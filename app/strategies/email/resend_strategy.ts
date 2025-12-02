import env from "#start/env";
import type {
	SendEmailOptions,
	EmailResult,
	BatchEmailResult,
	EmailAddress,
} from "#contracts/email_service_contract";
import type { EmailStrategy } from "./email_strategy.js";

/**
 * Resend API response types
 */
interface ResendEmailResponse {
	id: string;
}

interface ResendBatchResponse {
	data: Array<{
		id: string;
	}>;
}

interface ResendErrorResponse {
	statusCode: number;
	message: string;
	name: string;
}

/**
 * Format email address for Resend API
 */
function formatAddress(address: string | EmailAddress): string {
	if (typeof address === "string") {
		return address;
	}
	return address.name ? `${address.name} <${address.email}>` : address.email;
}

/**
 * Format multiple addresses
 */
function formatAddresses(
	addresses: string | string[] | EmailAddress | EmailAddress[] | undefined
): string[] | undefined {
	if (!addresses) return undefined;

	if (typeof addresses === "string") {
		return [addresses];
	}

	if (Array.isArray(addresses)) {
		return addresses.map((addr) =>
			typeof addr === "string" ? addr : formatAddress(addr)
		);
	}

	return [formatAddress(addresses)];
}

/**
 * Resend Email Strategy
 * Implementation of email operations using Resend API.
 *
 * @see https://resend.com/docs/api-reference/emails/send-email
 */
export class ResendStrategy implements EmailStrategy {
	readonly provider = "resend" as const;

	private apiKey: string = "";
	private defaultFrom: string = "";
	private baseUrl = "https://api.resend.com";

	async initialize(): Promise<void> {
		this.apiKey = env.get("RESEND_API_KEY", "");
		this.defaultFrom = env.get(
			"EMAIL_FROM",
			"Spons Easy <noreply@sponseasy.com>"
		);

		if (!this.apiKey) {
			throw new Error("RESEND_API_KEY is required");
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"Content-Type": "application/json",
				...options.headers,
			},
		});

		if (!response.ok) {
			const error = (await response.json()) as ResendErrorResponse;
			throw new Error(`Resend API error: ${error.message}`);
		}

		return response.json() as Promise<T>;
	}

	async send(options: SendEmailOptions): Promise<EmailResult> {
		try {
			const payload = {
				from: options.from
					? formatAddress(options.from)
					: this.defaultFrom,
				to: formatAddresses(options.to),
				subject: options.subject,
				html: options.html,
				text: options.text,
				reply_to: options.replyTo
					? formatAddress(options.replyTo)
					: undefined,
				cc: formatAddresses(options.cc),
				bcc: formatAddresses(options.bcc),
				attachments: options.attachments?.map((att) => ({
					filename: att.filename,
					content:
						typeof att.content === "string"
							? att.content
							: att.content.toString("base64"),
					content_type: att.contentType,
				})),
				tags: options.tags
					? Object.entries(options.tags).map(([name, value]) => ({
							name,
							value,
						}))
					: undefined,
				headers: options.headers,
			};

			const response = await this.request<ResendEmailResponse>("/emails", {
				method: "POST",
				body: JSON.stringify(payload),
			});

			return {
				id: response.id,
				provider: this.provider,
				success: true,
			};
		} catch (error) {
			return {
				id: "",
				provider: this.provider,
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	async sendBatch(emails: SendEmailOptions[]): Promise<BatchEmailResult> {
		try {
			const payload = emails.map((options) => ({
				from: options.from
					? formatAddress(options.from)
					: this.defaultFrom,
				to: formatAddresses(options.to),
				subject: options.subject,
				html: options.html,
				text: options.text,
				reply_to: options.replyTo
					? formatAddress(options.replyTo)
					: undefined,
				cc: formatAddresses(options.cc),
				bcc: formatAddresses(options.bcc),
				tags: options.tags
					? Object.entries(options.tags).map(([name, value]) => ({
							name,
							value,
						}))
					: undefined,
			}));

			const response = await this.request<ResendBatchResponse>(
				"/emails/batch",
				{
					method: "POST",
					body: JSON.stringify(payload),
				}
			);

			const results: EmailResult[] = response.data.map((item) => ({
				id: item.id,
				provider: this.provider,
				success: true,
			}));

			return {
				results,
				successCount: results.length,
				failureCount: 0,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			const results: EmailResult[] = emails.map(() => ({
				id: "",
				provider: this.provider,
				success: false,
				error: errorMessage,
			}));

			return {
				results,
				successCount: 0,
				failureCount: emails.length,
			};
		}
	}

	async verify(): Promise<boolean> {
		try {
			// Resend doesn't have a dedicated verify endpoint
			// We'll try to get API key info via domains endpoint
			const response = await fetch(`${this.baseUrl}/domains`, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			});

			return response.ok;
		} catch {
			return false;
		}
	}
}

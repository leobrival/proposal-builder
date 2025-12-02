import env from "#start/env";
import type {
	SendEmailOptions,
	EmailResult,
	BatchEmailResult,
	EmailAddress,
} from "#contracts/email_service_contract";
import type { EmailStrategy } from "./email_strategy.js";
import { randomUUID } from "node:crypto";

/**
 * SMTP Configuration
 */
interface SMTPConfig {
	host: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
}

/**
 * Format email address for SMTP
 */
function formatAddress(address: string | EmailAddress): string {
	if (typeof address === "string") {
		return address;
	}
	return address.name ? `"${address.name}" <${address.email}>` : address.email;
}

/**
 * Format multiple addresses to comma-separated string
 */
function formatAddresses(
	addresses: string | string[] | EmailAddress | EmailAddress[] | undefined
): string | undefined {
	if (!addresses) return undefined;

	if (typeof addresses === "string") {
		return addresses;
	}

	if (Array.isArray(addresses)) {
		return addresses
			.map((addr) => (typeof addr === "string" ? addr : formatAddress(addr)))
			.join(", ");
	}

	return formatAddress(addresses);
}

/**
 * Encode content for MIME
 */
function encodeBase64(content: string | Buffer): string {
	if (typeof content === "string") {
		return Buffer.from(content).toString("base64");
	}
	return content.toString("base64");
}

/**
 * Generate MIME boundary
 */
function generateBoundary(): string {
	return `----=_Part_${randomUUID().replace(/-/g, "")}`;
}

/**
 * Build raw email content for SMTP
 */
function buildRawEmail(options: SendEmailOptions, defaultFrom: string): string {
	const boundary = generateBoundary();
	const from = options.from ? formatAddress(options.from) : defaultFrom;
	const to = formatAddresses(options.to);

	const lines: string[] = [];

	// Headers
	lines.push(`From: ${from}`);
	lines.push(`To: ${to}`);
	lines.push(`Subject: =?UTF-8?B?${encodeBase64(options.subject)}?=`);
	lines.push(`MIME-Version: 1.0`);
	lines.push(`Message-ID: <${randomUUID()}@sponseasy.com>`);
	lines.push(`Date: ${new Date().toUTCString()}`);

	if (options.cc) {
		lines.push(`Cc: ${formatAddresses(options.cc)}`);
	}
	if (options.replyTo) {
		lines.push(`Reply-To: ${formatAddress(options.replyTo)}`);
	}

	// Custom headers
	if (options.headers) {
		for (const [key, value] of Object.entries(options.headers)) {
			lines.push(`${key}: ${value}`);
		}
	}

	const hasAttachments =
		options.attachments && options.attachments.length > 0;
	const hasMultipleParts = options.html && options.text;

	if (hasAttachments) {
		lines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
		lines.push("");

		const altBoundary = generateBoundary();

		// Start mixed part
		lines.push(`--${boundary}`);

		if (hasMultipleParts) {
			lines.push(
				`Content-Type: multipart/alternative; boundary="${altBoundary}"`
			);
			lines.push("");

			// Text part
			if (options.text) {
				lines.push(`--${altBoundary}`);
				lines.push(`Content-Type: text/plain; charset="UTF-8"`);
				lines.push(`Content-Transfer-Encoding: base64`);
				lines.push("");
				lines.push(encodeBase64(options.text));
			}

			// HTML part
			if (options.html) {
				lines.push(`--${altBoundary}`);
				lines.push(`Content-Type: text/html; charset="UTF-8"`);
				lines.push(`Content-Transfer-Encoding: base64`);
				lines.push("");
				lines.push(encodeBase64(options.html));
			}

			lines.push(`--${altBoundary}--`);
		} else {
			const contentType = options.html ? "text/html" : "text/plain";
			const content = options.html || options.text || "";
			lines.push(`Content-Type: ${contentType}; charset="UTF-8"`);
			lines.push(`Content-Transfer-Encoding: base64`);
			lines.push("");
			lines.push(encodeBase64(content));
		}

		// Attachments
		for (const attachment of options.attachments!) {
			lines.push(`--${boundary}`);
			lines.push(
				`Content-Type: ${attachment.contentType || "application/octet-stream"}; name="${attachment.filename}"`
			);
			lines.push(`Content-Transfer-Encoding: base64`);
			lines.push(
				`Content-Disposition: attachment; filename="${attachment.filename}"`
			);
			lines.push("");
			lines.push(encodeBase64(attachment.content));
		}

		lines.push(`--${boundary}--`);
	} else if (hasMultipleParts) {
		lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
		lines.push("");

		// Text part
		if (options.text) {
			lines.push(`--${boundary}`);
			lines.push(`Content-Type: text/plain; charset="UTF-8"`);
			lines.push(`Content-Transfer-Encoding: base64`);
			lines.push("");
			lines.push(encodeBase64(options.text));
		}

		// HTML part
		if (options.html) {
			lines.push(`--${boundary}`);
			lines.push(`Content-Type: text/html; charset="UTF-8"`);
			lines.push(`Content-Transfer-Encoding: base64`);
			lines.push("");
			lines.push(encodeBase64(options.html));
		}

		lines.push(`--${boundary}--`);
	} else {
		const contentType = options.html ? "text/html" : "text/plain";
		const content = options.html || options.text || "";
		lines.push(`Content-Type: ${contentType}; charset="UTF-8"`);
		lines.push(`Content-Transfer-Encoding: base64`);
		lines.push("");
		lines.push(encodeBase64(content));
	}

	return lines.join("\r\n");
}

/**
 * SMTP Email Strategy
 * Implementation of email operations using raw SMTP.
 * Uses Node.js net/tls modules for direct SMTP communication.
 */
export class SMTPStrategy implements EmailStrategy {
	readonly provider = "smtp" as const;

	private config: SMTPConfig | null = null;
	private defaultFrom: string = "";

	async initialize(): Promise<void> {
		this.defaultFrom = env.get(
			"EMAIL_FROM",
			"Spons Easy <noreply@sponseasy.com>"
		);

		this.config = {
			host: env.get("SMTP_HOST", "localhost"),
			port: Number.parseInt(env.get("SMTP_PORT", "587"), 10),
			secure: env.get("SMTP_SECURE", "false") === "true",
			auth: {
				user: env.get("SMTP_USER", ""),
				pass: env.get("SMTP_PASS", ""),
			},
		};

		if (!this.config.host) {
			throw new Error("SMTP_HOST is required");
		}
	}

	private async sendViaSMTP(rawEmail: string, to: string[]): Promise<string> {
		const net = await import("node:net");
		const tls = await import("node:tls");

		return new Promise((resolve, reject) => {
			const config = this.config!;
			let socket: ReturnType<typeof net.createConnection> | ReturnType<typeof tls.connect>;
			let messageId = randomUUID();
			let responseBuffer = "";
			let state: "greeting" | "ehlo" | "starttls" | "auth" | "mail" | "rcpt" | "data" | "content" | "quit" = "greeting";
			let rcptIndex = 0;

			const createSocket = () => {
				if (config.secure) {
					return tls.connect({
						host: config.host,
						port: config.port,
						rejectUnauthorized: false,
					});
				}
				return net.createConnection({
					host: config.host,
					port: config.port,
				});
			};

			const send = (data: string) => {
				socket.write(data + "\r\n");
			};

			const handleResponse = (response: string) => {
				const code = response.substring(0, 3);
				const isMultiline = response[3] === "-";

				if (isMultiline) {
					return; // Wait for more
				}

				switch (state) {
					case "greeting":
						if (code === "220") {
							state = "ehlo";
							send(`EHLO ${config.host}`);
						} else {
							reject(new Error(`SMTP greeting error: ${response}`));
						}
						break;

					case "ehlo":
						if (code === "250") {
							if (!config.secure && response.includes("STARTTLS")) {
								state = "starttls";
								send("STARTTLS");
							} else if (config.auth.user) {
								state = "auth";
								const credentials = Buffer.from(
									`\0${config.auth.user}\0${config.auth.pass}`
								).toString("base64");
								send(`AUTH PLAIN ${credentials}`);
							} else {
								state = "mail";
								send(`MAIL FROM:<${this.extractEmail(this.defaultFrom)}>`);
							}
						} else {
							reject(new Error(`SMTP EHLO error: ${response}`));
						}
						break;

					case "starttls":
						if (code === "220") {
							const tlsSocket = tls.connect({
								socket: socket as ReturnType<typeof net.createConnection>,
								host: config.host,
								rejectUnauthorized: false,
							});
							socket = tlsSocket;
							tlsSocket.on("data", onData);
							tlsSocket.on("error", onError);
							state = "ehlo";
							send(`EHLO ${config.host}`);
						} else {
							reject(new Error(`SMTP STARTTLS error: ${response}`));
						}
						break;

					case "auth":
						if (code === "235") {
							state = "mail";
							send(`MAIL FROM:<${this.extractEmail(this.defaultFrom)}>`);
						} else {
							reject(new Error(`SMTP auth error: ${response}`));
						}
						break;

					case "mail":
						if (code === "250") {
							state = "rcpt";
							rcptIndex = 0;
							send(`RCPT TO:<${to[rcptIndex]}>`);
						} else {
							reject(new Error(`SMTP MAIL error: ${response}`));
						}
						break;

					case "rcpt":
						if (code === "250") {
							rcptIndex++;
							if (rcptIndex < to.length) {
								send(`RCPT TO:<${to[rcptIndex]}>`);
							} else {
								state = "data";
								send("DATA");
							}
						} else {
							reject(new Error(`SMTP RCPT error: ${response}`));
						}
						break;

					case "data":
						if (code === "354") {
							state = "content";
							socket.write(rawEmail + "\r\n.\r\n");
						} else {
							reject(new Error(`SMTP DATA error: ${response}`));
						}
						break;

					case "content":
						if (code === "250") {
							state = "quit";
							send("QUIT");
						} else {
							reject(new Error(`SMTP content error: ${response}`));
						}
						break;

					case "quit":
						socket.end();
						resolve(messageId);
						break;
				}
			};

			const onData = (data: Buffer) => {
				responseBuffer += data.toString();
				const lines = responseBuffer.split("\r\n");
				responseBuffer = lines.pop() || "";

				for (const line of lines) {
					if (line) {
						handleResponse(line);
					}
				}
			};

			const onError = (err: Error) => {
				reject(err);
			};

			socket = createSocket();
			socket.on("data", onData);
			socket.on("error", onError);
			socket.on("close", () => {
				if (state !== "quit") {
					reject(new Error("Connection closed unexpectedly"));
				}
			});
		});
	}

	private extractEmail(address: string): string {
		const match = address.match(/<([^>]+)>/);
		return match ? match[1] : address;
	}

	private extractRecipients(
		addresses: string | string[] | EmailAddress | EmailAddress[] | undefined
	): string[] {
		if (!addresses) return [];

		if (typeof addresses === "string") {
			return [this.extractEmail(addresses)];
		}

		if (Array.isArray(addresses)) {
			return addresses.map((addr) =>
				typeof addr === "string"
					? this.extractEmail(addr)
					: addr.email
			);
		}

		return [addresses.email];
	}

	async send(options: SendEmailOptions): Promise<EmailResult> {
		try {
			const rawEmail = buildRawEmail(options, this.defaultFrom);
			const recipients = [
				...this.extractRecipients(options.to),
				...this.extractRecipients(options.cc),
				...this.extractRecipients(options.bcc),
			];

			const messageId = await this.sendViaSMTP(rawEmail, recipients);

			return {
				id: messageId,
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
		const results: EmailResult[] = [];
		let successCount = 0;
		let failureCount = 0;

		// SMTP doesn't support batch sending, so we send sequentially
		for (const email of emails) {
			const result = await this.send(email);
			results.push(result);
			if (result.success) {
				successCount++;
			} else {
				failureCount++;
			}
		}

		return {
			results,
			successCount,
			failureCount,
		};
	}

	async verify(): Promise<boolean> {
		try {
			const net = await import("node:net");
			const config = this.config!;

			return new Promise((resolve) => {
				const socket = net.createConnection({
					host: config.host,
					port: config.port,
				});

				socket.on("connect", () => {
					socket.end();
					resolve(true);
				});

				socket.on("error", () => {
					resolve(false);
				});

				socket.setTimeout(5000, () => {
					socket.destroy();
					resolve(false);
				});
			});
		} catch {
			return false;
		}
	}
}

import { createHmac, timingSafeEqual } from "node:crypto";
import type {
	CheckoutSession,
	CreateCheckoutOptions,
	CustomerPortalSession,
	PlanConfig,
	Subscription,
	SubscriptionStatus,
	WebhookEvent,
} from "#contracts/payment_service_contract";
import type User from "#models/user";
import env from "#start/env";
import type { PaymentStrategy } from "./payment_strategy.js";

/**
 * Stripe API response types (simplified)
 */
interface StripeCheckoutSession {
	id: string;
	url: string;
	expires_at: number;
}

interface StripeSubscription {
	id: string;
	status: string;
	current_period_start: number;
	current_period_end: number;
	cancel_at_period_end: boolean;
	trial_end: number | null;
	customer: string;
	items: {
		data: Array<{
			price: {
				id: string;
				product: string;
			};
		}>;
	};
	metadata: Record<string, string>;
}

interface StripeCustomer {
	id: string;
	email: string;
	name: string;
	metadata: Record<string, string>;
}

interface StripeBillingPortalSession {
	id: string;
	url: string;
}

/**
 * Map Stripe status to internal status
 */
function mapStripeStatus(status: string): SubscriptionStatus {
	switch (status) {
		case "active":
			return "active";
		case "past_due":
			return "past_due";
		case "canceled":
			return "cancelled";
		case "unpaid":
			return "unpaid";
		case "trialing":
			return "trialing";
		case "paused":
			return "paused";
		case "incomplete":
		case "incomplete_expired":
			return "expired";
		default:
			return "active";
	}
}

/**
 * Stripe Payment Strategy
 * Implementation of payment operations using Stripe API.
 */
export class StripeStrategy implements PaymentStrategy {
	readonly provider = "stripe" as const;

	private secretKey: string = "";
	private webhookSecret: string = "";
	private baseUrl = "https://api.stripe.com/v1";

	async initialize(): Promise<void> {
		this.secretKey = env.get("STRIPE_SECRET_KEY", "");
		this.webhookSecret = env.get("STRIPE_WEBHOOK_SECRET", "");

		if (!this.secretKey) {
			throw new Error("STRIPE_SECRET_KEY is required");
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bearer ${this.secretKey}`,
				"Content-Type": "application/x-www-form-urlencoded",
				...options.headers,
			},
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				`Stripe API error: ${response.status} - ${JSON.stringify(error)}`,
			);
		}

		return response.json() as Promise<T>;
	}

	private encodeParams(params: Record<string, unknown>): string {
		const encode = (key: string, value: unknown): string[] => {
			if (value === null || value === undefined) {
				return [];
			}
			if (typeof value === "object" && !Array.isArray(value)) {
				return Object.entries(value as Record<string, unknown>).flatMap(
					([k, v]) => encode(`${key}[${k}]`, v),
				);
			}
			if (Array.isArray(value)) {
				return value.flatMap((v, i) => encode(`${key}[${i}]`, v));
			}
			return [
				`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
			];
		};

		return Object.entries(params)
			.flatMap(([k, v]) => encode(k, v))
			.join("&");
	}

	async createCheckout(
		user: User,
		options: CreateCheckoutOptions,
	): Promise<CheckoutSession> {
		const customerId = await this.getOrCreateCustomer(user);
		const priceId = this.getPriceIdForPlan(options.plan, options.interval);

		const params = {
			customer: customerId,
			mode: "subscription",
			"line_items[0][price]": priceId,
			"line_items[0][quantity]": "1",
			success_url: options.successUrl,
			cancel_url: options.cancelUrl,
			"metadata[user_id]": user.id,
			"metadata[plan]": options.plan,
			"subscription_data[metadata][user_id]": user.id,
			"subscription_data[metadata][plan]": options.plan,
		};

		const response = await this.request<StripeCheckoutSession>(
			"/checkout/sessions",
			{
				method: "POST",
				body: this.encodeParams(params),
			},
		);

		return {
			id: response.id,
			url: response.url,
			provider: this.provider,
			expiresAt: new Date(response.expires_at * 1000),
		};
	}

	async getCustomerPortal(customerId: string): Promise<CustomerPortalSession> {
		const params = {
			customer: customerId,
			return_url: env.get("APP_URL", "http://localhost:3333") + "/dashboard",
		};

		const response = await this.request<StripeBillingPortalSession>(
			"/billing_portal/sessions",
			{
				method: "POST",
				body: this.encodeParams(params),
			},
		);

		return {
			url: response.url,
			provider: this.provider,
		};
	}

	async cancelSubscription(
		providerSubscriptionId: string,
	): Promise<Subscription> {
		const params = {
			cancel_at_period_end: "true",
		};

		const response = await this.request<StripeSubscription>(
			`/subscriptions/${providerSubscriptionId}`,
			{
				method: "POST",
				body: this.encodeParams(params),
			},
		);

		return this.mapSubscription(response);
	}

	async resumeSubscription(
		providerSubscriptionId: string,
	): Promise<Subscription> {
		const params = {
			cancel_at_period_end: "false",
		};

		const response = await this.request<StripeSubscription>(
			`/subscriptions/${providerSubscriptionId}`,
			{
				method: "POST",
				body: this.encodeParams(params),
			},
		);

		return this.mapSubscription(response);
	}

	async getSubscription(
		providerSubscriptionId: string,
	): Promise<Subscription | null> {
		try {
			const response = await this.request<StripeSubscription>(
				`/subscriptions/${providerSubscriptionId}`,
			);
			return this.mapSubscription(response);
		} catch {
			return null;
		}
	}

	async verifyWebhook(payload: string, signature: string): Promise<boolean> {
		if (!this.webhookSecret) {
			return false;
		}

		// Parse the signature header
		const elements = signature.split(",");
		const signatureMap: Record<string, string> = {};

		for (const element of elements) {
			const [key, value] = element.split("=");
			signatureMap[key] = value;
		}

		const timestamp = signatureMap["t"];
		const expectedSignature = signatureMap["v1"];

		if (!timestamp || !expectedSignature) {
			return false;
		}

		// Check timestamp (5 minutes tolerance)
		const timestampAge =
			Math.floor(Date.now() / 1000) - Number.parseInt(timestamp, 10);
		if (timestampAge > 300) {
			return false;
		}

		// Compute expected signature
		const signedPayload = `${timestamp}.${payload}`;
		const hmac = createHmac("sha256", this.webhookSecret);
		const computedSignature = hmac.update(signedPayload).digest("hex");

		// Timing-safe comparison
		try {
			return timingSafeEqual(
				Buffer.from(expectedSignature),
				Buffer.from(computedSignature),
			);
		} catch {
			return false;
		}
	}

	async parseWebhookEvent(
		payload: string,
		signature: string,
	): Promise<WebhookEvent> {
		const isValid = await this.verifyWebhook(payload, signature);
		if (!isValid) {
			throw new Error("Invalid webhook signature");
		}

		const data = JSON.parse(payload);

		return {
			id: data.id,
			type: data.type,
			provider: this.provider,
			data: data.data?.object || {},
			signature,
		};
	}

	async getOrCreateCustomer(user: User): Promise<string> {
		// Search for existing customer
		const searchResponse = await this.request<{ data: StripeCustomer[] }>(
			`/customers/search?query=email:'${encodeURIComponent(user.email)}'`,
		);

		if (searchResponse.data.length > 0) {
			return searchResponse.data[0].id;
		}

		// Create new customer
		const createParams = {
			email: user.email,
			name: user.fullName,
			"metadata[user_id]": user.id,
		};

		const createResponse = await this.request<StripeCustomer>("/customers", {
			method: "POST",
			body: this.encodeParams(createParams),
		});

		return createResponse.id;
	}

	getPlanVariantId(plan: PlanConfig, interval: "monthly" | "yearly"): string {
		const ids = plan.providerIds.stripe;
		if (!ids) {
			throw new Error(`No Stripe IDs configured for plan ${plan.type}`);
		}
		return interval === "monthly" ? ids.monthlyPriceId : ids.yearlyPriceId;
	}

	private getPriceIdForPlan(
		plan: string,
		interval: "monthly" | "yearly",
	): string {
		const prices: Record<string, Record<string, string>> = {
			pro: {
				monthly: env.get("STRIPE_PRO_MONTHLY_PRICE_ID", ""),
				yearly: env.get("STRIPE_PRO_YEARLY_PRICE_ID", ""),
			},
			enterprise: {
				monthly: env.get("STRIPE_ENTERPRISE_MONTHLY_PRICE_ID", ""),
				yearly: env.get("STRIPE_ENTERPRISE_YEARLY_PRICE_ID", ""),
			},
		};

		const priceId = prices[plan]?.[interval];
		if (!priceId) {
			throw new Error(
				`No price ID configured for plan ${plan} with ${interval} billing`,
			);
		}

		return priceId;
	}

	private mapSubscription(response: StripeSubscription): Subscription {
		return {
			id: response.id,
			providerId: response.id,
			provider: this.provider,
			userId: response.metadata.user_id || "",
			plan: (response.metadata.plan as "pro" | "enterprise") || "pro",
			status: mapStripeStatus(response.status),
			currentPeriodStart: new Date(response.current_period_start * 1000),
			currentPeriodEnd: new Date(response.current_period_end * 1000),
			cancelAtPeriodEnd: response.cancel_at_period_end,
			trialEnd: response.trial_end ? new Date(response.trial_end * 1000) : null,
			metadata: {
				customerId: response.customer,
				priceId: response.items.data[0]?.price?.id,
			},
		};
	}
}

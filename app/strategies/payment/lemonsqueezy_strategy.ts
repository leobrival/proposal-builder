import { createHmac } from "node:crypto";
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
 * Lemon Squeezy API response types
 */
interface LemonSqueezyCheckout {
	data: {
		id: string;
		attributes: {
			url: string;
			expires_at: string;
		};
	};
}

interface LemonSqueezySubscription {
	data: {
		id: string;
		attributes: {
			status: string;
			renews_at: string;
			ends_at: string | null;
			trial_ends_at: string | null;
			cancelled: boolean;
			pause: { mode: string } | null;
			first_subscription_item: {
				price_id: number;
			};
			urls: {
				customer_portal: string;
			};
		};
	};
}

interface LemonSqueezyCustomer {
	data: {
		id: string;
		attributes: {
			email: string;
			name: string;
		};
	};
}

/**
 * Map Lemon Squeezy status to internal status
 */
function mapLemonSqueezyStatus(
	status: string,
	cancelled: boolean,
): SubscriptionStatus {
	if (cancelled) return "cancelled";

	switch (status) {
		case "active":
			return "active";
		case "past_due":
			return "past_due";
		case "paused":
			return "paused";
		case "unpaid":
			return "unpaid";
		case "cancelled":
			return "cancelled";
		case "expired":
			return "expired";
		case "on_trial":
			return "trialing";
		default:
			return "active";
	}
}

/**
 * Lemon Squeezy Payment Strategy
 * Implementation of payment operations using Lemon Squeezy API.
 */
export class LemonSqueezyStrategy implements PaymentStrategy {
	readonly provider = "lemonsqueezy" as const;

	private apiKey: string = "";
	private storeId: string = "";
	private webhookSecret: string = "";
	private baseUrl = "https://api.lemonsqueezy.com/v1";

	async initialize(): Promise<void> {
		this.apiKey = env.get("LEMONSQUEEZY_API_KEY", "");
		this.storeId = env.get("LEMONSQUEEZY_STORE_ID", "");
		this.webhookSecret = env.get("LEMONSQUEEZY_WEBHOOK_SECRET", "");

		if (!this.apiKey) {
			throw new Error("LEMONSQUEEZY_API_KEY is required");
		}
		if (!this.storeId) {
			throw new Error("LEMONSQUEEZY_STORE_ID is required");
		}
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				Accept: "application/vnd.api+json",
				"Content-Type": "application/vnd.api+json",
				...options.headers,
			},
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Lemon Squeezy API error: ${response.status} - ${error}`);
		}

		return response.json() as Promise<T>;
	}

	async createCheckout(
		user: User,
		options: CreateCheckoutOptions,
	): Promise<CheckoutSession> {
		const checkoutData = {
			data: {
				type: "checkouts",
				attributes: {
					checkout_data: {
						email: user.email,
						name: user.fullName,
						custom: {
							user_id: user.id,
						},
					},
					product_options: {
						redirect_url: options.successUrl,
					},
					checkout_options: {
						button_color: "#3B82F6",
					},
				},
				relationships: {
					store: {
						data: {
							type: "stores",
							id: this.storeId,
						},
					},
					variant: {
						data: {
							type: "variants",
							id: this.getVariantIdForPlan(options.plan, options.interval),
						},
					},
				},
			},
		};

		const response = await this.request<LemonSqueezyCheckout>("/checkouts", {
			method: "POST",
			body: JSON.stringify(checkoutData),
		});

		return {
			id: response.data.id,
			url: response.data.attributes.url,
			provider: this.provider,
			expiresAt: new Date(response.data.attributes.expires_at),
		};
	}

	async getCustomerPortal(_customerId: string): Promise<CustomerPortalSession> {
		// Lemon Squeezy provides customer portal URL in subscription
		// For now, we construct the URL manually
		const portalUrl = `https://app.lemonsqueezy.com/my-orders`;

		return {
			url: portalUrl,
			provider: this.provider,
		};
	}

	async cancelSubscription(
		providerSubscriptionId: string,
	): Promise<Subscription> {
		const response = await this.request<LemonSqueezySubscription>(
			`/subscriptions/${providerSubscriptionId}`,
			{
				method: "PATCH",
				body: JSON.stringify({
					data: {
						type: "subscriptions",
						id: providerSubscriptionId,
						attributes: {
							cancelled: true,
						},
					},
				}),
			},
		);

		return this.mapSubscription(response);
	}

	async resumeSubscription(
		providerSubscriptionId: string,
	): Promise<Subscription> {
		const response = await this.request<LemonSqueezySubscription>(
			`/subscriptions/${providerSubscriptionId}`,
			{
				method: "PATCH",
				body: JSON.stringify({
					data: {
						type: "subscriptions",
						id: providerSubscriptionId,
						attributes: {
							cancelled: false,
						},
					},
				}),
			},
		);

		return this.mapSubscription(response);
	}

	async getSubscription(
		providerSubscriptionId: string,
	): Promise<Subscription | null> {
		try {
			const response = await this.request<LemonSqueezySubscription>(
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

		const hmac = createHmac("sha256", this.webhookSecret);
		const digest = hmac.update(payload).digest("hex");

		return signature === digest;
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
			id: data.meta?.event_id || data.data?.id || "",
			type: data.meta?.event_name || "",
			provider: this.provider,
			data: data.data || {},
			signature,
		};
	}

	async getOrCreateCustomer(user: User): Promise<string> {
		// Search for existing customer
		const searchResponse = await this.request<{
			data: LemonSqueezyCustomer["data"][];
		}>(
			`/customers?filter[store_id]=${this.storeId}&filter[email]=${encodeURIComponent(user.email)}`,
		);

		if (searchResponse.data.length > 0) {
			return searchResponse.data[0].id;
		}

		// Create new customer
		const createResponse = await this.request<LemonSqueezyCustomer>(
			"/customers",
			{
				method: "POST",
				body: JSON.stringify({
					data: {
						type: "customers",
						attributes: {
							email: user.email,
							name: user.fullName,
						},
						relationships: {
							store: {
								data: {
									type: "stores",
									id: this.storeId,
								},
							},
						},
					},
				}),
			},
		);

		return createResponse.data.id;
	}

	getPlanVariantId(plan: PlanConfig, interval: "monthly" | "yearly"): string {
		const ids = plan.providerIds.lemonsqueezy;
		if (!ids) {
			throw new Error(`No Lemon Squeezy IDs configured for plan ${plan.type}`);
		}
		return interval === "monthly" ? ids.monthlyVariantId : ids.yearlyVariantId;
	}

	private getVariantIdForPlan(
		plan: string,
		interval: "monthly" | "yearly",
	): string {
		// These would be configured in environment or database
		const variants: Record<string, Record<string, string>> = {
			pro: {
				monthly: env.get("LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID", ""),
				yearly: env.get("LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID", ""),
			},
			enterprise: {
				monthly: env.get("LEMONSQUEEZY_ENTERPRISE_MONTHLY_VARIANT_ID", ""),
				yearly: env.get("LEMONSQUEEZY_ENTERPRISE_YEARLY_VARIANT_ID", ""),
			},
		};

		const variantId = variants[plan]?.[interval];
		if (!variantId) {
			throw new Error(
				`No variant ID configured for plan ${plan} with ${interval} billing`,
			);
		}

		return variantId;
	}

	private mapSubscription(response: LemonSqueezySubscription): Subscription {
		const attrs = response.data.attributes;

		return {
			id: response.data.id,
			providerId: response.data.id,
			provider: this.provider,
			userId: "", // Will be set by the service from custom data
			plan: "pro", // Will be determined from variant ID
			status: mapLemonSqueezyStatus(attrs.status, attrs.cancelled),
			currentPeriodStart: new Date(), // Lemon Squeezy doesn't provide this directly
			currentPeriodEnd: new Date(
				attrs.renews_at || attrs.ends_at || Date.now(),
			),
			cancelAtPeriodEnd: attrs.cancelled,
			trialEnd: attrs.trial_ends_at ? new Date(attrs.trial_ends_at) : null,
			metadata: {
				customerPortalUrl: attrs.urls?.customer_portal,
			},
		};
	}
}

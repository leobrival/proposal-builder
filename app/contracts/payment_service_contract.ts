import type User from "#models/user";

/**
 * Supported payment providers
 */
export type PaymentProvider = "lemonsqueezy" | "stripe";

/**
 * Subscription status
 */
export type SubscriptionStatus =
	| "active"
	| "cancelled"
	| "expired"
	| "past_due"
	| "paused"
	| "trialing"
	| "unpaid";

/**
 * Plan types
 */
export type PlanType = "free" | "pro" | "enterprise";

/**
 * Checkout session data
 */
export interface CheckoutSession {
	id: string;
	url: string;
	provider: PaymentProvider;
	expiresAt?: Date;
}

/**
 * Subscription data
 */
export interface Subscription {
	id: string;
	providerId: string;
	provider: PaymentProvider;
	userId: string;
	plan: PlanType;
	status: SubscriptionStatus;
	currentPeriodStart: Date;
	currentPeriodEnd: Date;
	cancelAtPeriodEnd: boolean;
	trialEnd?: Date | null;
	metadata?: Record<string, unknown>;
}

/**
 * Customer portal session
 */
export interface CustomerPortalSession {
	url: string;
	provider: PaymentProvider;
}

/**
 * Webhook event data
 */
export interface WebhookEvent {
	id: string;
	type: string;
	provider: PaymentProvider;
	data: Record<string, unknown>;
	signature?: string;
}

/**
 * Plan configuration
 */
export interface PlanConfig {
	type: PlanType;
	name: string;
	priceMonthly: number;
	priceYearly: number;
	currency: string;
	features: string[];
	limits: {
		proposals: number;
		customDomains: number;
		teamMembers: number;
	};
	providerIds: {
		lemonsqueezy?: {
			monthlyVariantId: string;
			yearlyVariantId: string;
			productId: string;
		};
		stripe?: {
			monthlyPriceId: string;
			yearlyPriceId: string;
			productId: string;
		};
	};
}

/**
 * Billing interval
 */
export type BillingInterval = "monthly" | "yearly";

/**
 * Create checkout options
 */
export interface CreateCheckoutOptions {
	plan: PlanType;
	interval: BillingInterval;
	successUrl: string;
	cancelUrl: string;
	metadata?: Record<string, unknown>;
}

/**
 * Contract for Payment Service
 * Defines the interface for payment operations.
 * Supports multiple payment providers (Lemon Squeezy, Stripe).
 */
export abstract class PaymentServiceContract {
	/**
	 * Get the current payment provider
	 */
	abstract getProvider(): PaymentProvider;

	/**
	 * Create a checkout session for a user
	 */
	abstract createCheckoutSession(
		user: User,
		options: CreateCheckoutOptions,
	): Promise<CheckoutSession>;

	/**
	 * Get customer portal URL for managing subscription
	 */
	abstract getCustomerPortalUrl(user: User): Promise<CustomerPortalSession>;

	/**
	 * Cancel a subscription
	 */
	abstract cancelSubscription(subscriptionId: string): Promise<Subscription>;

	/**
	 * Resume a cancelled subscription
	 */
	abstract resumeSubscription(subscriptionId: string): Promise<Subscription>;

	/**
	 * Get subscription by ID
	 */
	abstract getSubscription(
		subscriptionId: string,
	): Promise<Subscription | null>;

	/**
	 * Get user's active subscription
	 */
	abstract getUserSubscription(userId: string): Promise<Subscription | null>;

	/**
	 * Handle webhook event from payment provider
	 */
	abstract handleWebhook(event: WebhookEvent): Promise<void>;

	/**
	 * Verify webhook signature
	 */
	abstract verifyWebhookSignature(
		payload: string,
		signature: string,
	): Promise<boolean>;

	/**
	 * Sync subscription status from provider
	 */
	abstract syncSubscription(subscriptionId: string): Promise<Subscription>;

	/**
	 * Get available plans
	 */
	abstract getPlans(): PlanConfig[];

	/**
	 * Get plan by type
	 */
	abstract getPlan(type: PlanType): PlanConfig | null;
}

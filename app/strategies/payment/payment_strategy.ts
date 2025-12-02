import type {
	CheckoutSession,
	CreateCheckoutOptions,
	CustomerPortalSession,
	PaymentProvider,
	PlanConfig,
	Subscription,
	WebhookEvent,
} from "#contracts/payment_service_contract";
import type User from "#models/user";

/**
 * Payment Strategy Interface
 * Base interface for all payment provider implementations.
 */
export interface PaymentStrategy {
	/**
	 * Get the provider identifier
	 */
	readonly provider: PaymentProvider;

	/**
	 * Initialize the payment provider client
	 */
	initialize(): Promise<void>;

	/**
	 * Create a checkout session
	 */
	createCheckout(
		user: User,
		options: CreateCheckoutOptions,
	): Promise<CheckoutSession>;

	/**
	 * Get customer portal URL
	 */
	getCustomerPortal(customerId: string): Promise<CustomerPortalSession>;

	/**
	 * Cancel a subscription
	 */
	cancelSubscription(providerSubscriptionId: string): Promise<Subscription>;

	/**
	 * Resume a cancelled subscription
	 */
	resumeSubscription(providerSubscriptionId: string): Promise<Subscription>;

	/**
	 * Get subscription from provider
	 */
	getSubscription(providerSubscriptionId: string): Promise<Subscription | null>;

	/**
	 * Verify webhook signature
	 */
	verifyWebhook(payload: string, signature: string): Promise<boolean>;

	/**
	 * Parse webhook event
	 */
	parseWebhookEvent(payload: string, signature: string): Promise<WebhookEvent>;

	/**
	 * Get or create customer in provider
	 */
	getOrCreateCustomer(user: User): Promise<string>;

	/**
	 * Get plan variant/price ID for provider
	 */
	getPlanVariantId(plan: PlanConfig, interval: "monthly" | "yearly"): string;
}

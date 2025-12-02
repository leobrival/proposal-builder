import { DateTime } from "luxon";
import {
	type CheckoutSession,
	type CreateCheckoutOptions,
	type CustomerPortalSession,
	type PaymentProvider,
	PaymentServiceContract,
	type PlanConfig,
	type PlanType,
	type Subscription,
	type WebhookEvent,
} from "#contracts/payment_service_contract";
import SubscriptionModel from "#models/subscription";
import type User from "#models/user";
import env from "#start/env";
import {
	LemonSqueezyStrategy,
	type PaymentStrategy,
	StripeStrategy,
} from "#strategies/payment/index";

/**
 * Plan configurations
 */
const PLANS: PlanConfig[] = [
	{
		type: "free",
		name: "Free",
		priceMonthly: 0,
		priceYearly: 0,
		currency: "EUR",
		features: [
			"1 proposal",
			"Basic templates",
			"Spons Easy branding",
			"Email support",
		],
		limits: {
			proposals: 1,
			customDomains: 0,
			teamMembers: 1,
		},
		providerIds: {},
	},
	{
		type: "pro",
		name: "Pro",
		priceMonthly: 19,
		priceYearly: 190,
		currency: "EUR",
		features: [
			"Unlimited proposals",
			"All templates",
			"Custom branding",
			"1 custom domain",
			"Priority support",
			"Analytics dashboard",
		],
		limits: {
			proposals: -1, // unlimited
			customDomains: 1,
			teamMembers: 3,
		},
		providerIds: {
			lemonsqueezy: {
				monthlyVariantId: env.get("LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID", ""),
				yearlyVariantId: env.get("LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID", ""),
				productId: env.get("LEMONSQUEEZY_PRO_PRODUCT_ID", ""),
			},
			stripe: {
				monthlyPriceId: env.get("STRIPE_PRO_MONTHLY_PRICE_ID", ""),
				yearlyPriceId: env.get("STRIPE_PRO_YEARLY_PRICE_ID", ""),
				productId: env.get("STRIPE_PRO_PRODUCT_ID", ""),
			},
		},
	},
	{
		type: "enterprise",
		name: "Enterprise",
		priceMonthly: 49,
		priceYearly: 490,
		currency: "EUR",
		features: [
			"Everything in Pro",
			"Unlimited custom domains",
			"White-label solution",
			"API access",
			"Dedicated support",
			"Custom integrations",
			"SLA guarantee",
		],
		limits: {
			proposals: -1,
			customDomains: -1, // unlimited
			teamMembers: -1, // unlimited
		},
		providerIds: {
			lemonsqueezy: {
				monthlyVariantId: env.get(
					"LEMONSQUEEZY_ENTERPRISE_MONTHLY_VARIANT_ID",
					"",
				),
				yearlyVariantId: env.get(
					"LEMONSQUEEZY_ENTERPRISE_YEARLY_VARIANT_ID",
					"",
				),
				productId: env.get("LEMONSQUEEZY_ENTERPRISE_PRODUCT_ID", ""),
			},
			stripe: {
				monthlyPriceId: env.get("STRIPE_ENTERPRISE_MONTHLY_PRICE_ID", ""),
				yearlyPriceId: env.get("STRIPE_ENTERPRISE_YEARLY_PRICE_ID", ""),
				productId: env.get("STRIPE_ENTERPRISE_PRODUCT_ID", ""),
			},
		},
	},
];

/**
 * Payment Service
 * Orchestrates payment operations using the configured payment provider.
 * Supports switching between Lemon Squeezy and Stripe.
 */
class PaymentService extends PaymentServiceContract {
	private strategy: PaymentStrategy | null = null;
	private initialized = false;

	/**
	 * Get and initialize the payment strategy
	 */
	private async getStrategy(): Promise<PaymentStrategy> {
		if (this.strategy && this.initialized) {
			return this.strategy;
		}

		const provider = env.get(
			"PAYMENT_PROVIDER",
			"lemonsqueezy",
		) as PaymentProvider;

		switch (provider) {
			case "stripe":
				this.strategy = new StripeStrategy();
				break;
			case "lemonsqueezy":
			default:
				this.strategy = new LemonSqueezyStrategy();
				break;
		}

		await this.strategy.initialize();
		this.initialized = true;

		return this.strategy;
	}

	getProvider(): PaymentProvider {
		return env.get("PAYMENT_PROVIDER", "lemonsqueezy") as PaymentProvider;
	}

	async createCheckoutSession(
		user: User,
		options: CreateCheckoutOptions,
	): Promise<CheckoutSession> {
		const strategy = await this.getStrategy();
		return strategy.createCheckout(user, options);
	}

	async getCustomerPortalUrl(user: User): Promise<CustomerPortalSession> {
		const strategy = await this.getStrategy();

		// Get user's subscription to find customer ID
		const subscription = await this.getUserSubscription(user.id);
		if (!subscription) {
			throw new Error("No active subscription found");
		}

		const customerId = subscription.metadata?.customerId as string;
		if (!customerId) {
			throw new Error("Customer ID not found in subscription");
		}

		return strategy.getCustomerPortal(customerId);
	}

	async cancelSubscription(subscriptionId: string): Promise<Subscription> {
		const strategy = await this.getStrategy();

		// Get subscription from database
		const dbSubscription = await SubscriptionModel.find(subscriptionId);
		if (!dbSubscription) {
			throw new Error("Subscription not found");
		}

		// Cancel in provider
		const providerSubscription = await strategy.cancelSubscription(
			dbSubscription.providerSubscriptionId,
		);

		// Update database
		dbSubscription.status = providerSubscription.status;
		dbSubscription.cancelAtPeriodEnd = true;
		await dbSubscription.save();

		return providerSubscription;
	}

	async resumeSubscription(subscriptionId: string): Promise<Subscription> {
		const strategy = await this.getStrategy();

		const dbSubscription = await SubscriptionModel.find(subscriptionId);
		if (!dbSubscription) {
			throw new Error("Subscription not found");
		}

		const providerSubscription = await strategy.resumeSubscription(
			dbSubscription.providerSubscriptionId,
		);

		dbSubscription.status = providerSubscription.status;
		dbSubscription.cancelAtPeriodEnd = false;
		await dbSubscription.save();

		return providerSubscription;
	}

	async getSubscription(subscriptionId: string): Promise<Subscription | null> {
		const dbSubscription = await SubscriptionModel.find(subscriptionId);
		if (!dbSubscription) {
			return null;
		}

		return this.mapDbSubscription(dbSubscription);
	}

	async getUserSubscription(userId: string): Promise<Subscription | null> {
		const dbSubscription = await SubscriptionModel.query()
			.where("userId", userId)
			.whereIn("status", ["active", "trialing", "past_due"])
			.orderBy("createdAt", "desc")
			.first();

		if (!dbSubscription) {
			return null;
		}

		return this.mapDbSubscription(dbSubscription);
	}

	async handleWebhook(event: WebhookEvent): Promise<void> {
		const provider = event.provider;

		switch (provider) {
			case "lemonsqueezy":
				await this.handleLemonSqueezyWebhook(event);
				break;
			case "stripe":
				await this.handleStripeWebhook(event);
				break;
		}
	}

	async verifyWebhookSignature(
		payload: string,
		signature: string,
	): Promise<boolean> {
		const strategy = await this.getStrategy();
		return strategy.verifyWebhook(payload, signature);
	}

	async syncSubscription(subscriptionId: string): Promise<Subscription> {
		const strategy = await this.getStrategy();

		const dbSubscription = await SubscriptionModel.find(subscriptionId);
		if (!dbSubscription) {
			throw new Error("Subscription not found");
		}

		const providerSubscription = await strategy.getSubscription(
			dbSubscription.providerSubscriptionId,
		);

		if (!providerSubscription) {
			throw new Error("Subscription not found in provider");
		}

		// Update database with provider data
		dbSubscription.status = providerSubscription.status;
		dbSubscription.currentPeriodStart = DateTime.fromJSDate(
			providerSubscription.currentPeriodStart,
		);
		dbSubscription.currentPeriodEnd = DateTime.fromJSDate(
			providerSubscription.currentPeriodEnd,
		);
		dbSubscription.cancelAtPeriodEnd = providerSubscription.cancelAtPeriodEnd;
		dbSubscription.trialEndsAt = providerSubscription.trialEnd
			? DateTime.fromJSDate(providerSubscription.trialEnd)
			: null;
		await dbSubscription.save();

		return providerSubscription;
	}

	getPlans(): PlanConfig[] {
		return PLANS;
	}

	getPlan(type: PlanType): PlanConfig | null {
		return PLANS.find((p) => p.type === type) || null;
	}

	/**
	 * Handle Lemon Squeezy webhook events
	 */
	private async handleLemonSqueezyWebhook(event: WebhookEvent): Promise<void> {
		const eventType = event.type;
		const data = event.data as Record<string, unknown>;

		switch (eventType) {
			case "subscription_created":
			case "subscription_updated":
				await this.upsertSubscriptionFromLemonSqueezy(data);
				break;
			case "subscription_cancelled":
				await this.handleSubscriptionCancelled(data);
				break;
			case "subscription_expired":
				await this.handleSubscriptionExpired(data);
				break;
			case "subscription_payment_success":
				await this.handlePaymentSuccess(data);
				break;
			case "subscription_payment_failed":
				await this.handlePaymentFailed(data);
				break;
		}
	}

	/**
	 * Handle Stripe webhook events
	 */
	private async handleStripeWebhook(event: WebhookEvent): Promise<void> {
		const eventType = event.type;
		const data = event.data as Record<string, unknown>;

		switch (eventType) {
			case "customer.subscription.created":
			case "customer.subscription.updated":
				await this.upsertSubscriptionFromStripe(data);
				break;
			case "customer.subscription.deleted":
				await this.handleSubscriptionDeleted(data);
				break;
			case "invoice.payment_succeeded":
				await this.handleInvoicePaymentSucceeded(data);
				break;
			case "invoice.payment_failed":
				await this.handleInvoicePaymentFailed(data);
				break;
		}
	}

	/**
	 * Create or update subscription from Lemon Squeezy data
	 */
	private async upsertSubscriptionFromLemonSqueezy(
		data: Record<string, unknown>,
	): Promise<void> {
		const attrs = data.attributes as Record<string, unknown>;
		const customData = attrs.custom_data as Record<string, string> | undefined;
		const userId = customData?.user_id;

		if (!userId) {
			console.warn("No user_id in Lemon Squeezy subscription custom data");
			return;
		}

		const providerSubscriptionId = String(data.id);

		let subscription = await SubscriptionModel.findBy(
			"providerSubscriptionId",
			providerSubscriptionId,
		);

		if (!subscription) {
			subscription = new SubscriptionModel();
			subscription.providerSubscriptionId = providerSubscriptionId;
			subscription.userId = userId;
			subscription.provider = "lemonsqueezy";
		}

		subscription.status = this.mapLemonSqueezyStatus(
			String(attrs.status),
			Boolean(attrs.cancelled),
		);
		subscription.plan = "pro"; // Determine from variant
		subscription.currentPeriodEnd = DateTime.fromISO(
			String(attrs.renews_at || attrs.ends_at),
		);

		if (attrs.trial_ends_at) {
			subscription.trialEndsAt = DateTime.fromISO(String(attrs.trial_ends_at));
		}

		subscription.cancelAtPeriodEnd = Boolean(attrs.cancelled);
		subscription.metadata = {
			variantId: attrs.variant_id,
			productId: attrs.product_id,
		};

		await subscription.save();

		// Update user plan
		await this.updateUserPlan(userId, subscription.plan as PlanType);
	}

	/**
	 * Create or update subscription from Stripe data
	 */
	private async upsertSubscriptionFromStripe(
		data: Record<string, unknown>,
	): Promise<void> {
		const metadata = data.metadata as Record<string, string> | undefined;
		const userId = metadata?.user_id;

		if (!userId) {
			console.warn("No user_id in Stripe subscription metadata");
			return;
		}

		const providerSubscriptionId = String(data.id);

		let subscription = await SubscriptionModel.findBy(
			"providerSubscriptionId",
			providerSubscriptionId,
		);

		if (!subscription) {
			subscription = new SubscriptionModel();
			subscription.providerSubscriptionId = providerSubscriptionId;
			subscription.userId = userId;
			subscription.provider = "stripe";
		}

		subscription.status = this.mapStripeStatus(String(data.status));
		subscription.plan = (metadata?.plan as PlanType) || "pro";
		subscription.currentPeriodStart = DateTime.fromMillis(
			Number(data.current_period_start) * 1000,
		);
		subscription.currentPeriodEnd = DateTime.fromMillis(
			Number(data.current_period_end) * 1000,
		);

		if (data.trial_end) {
			subscription.trialEndsAt = DateTime.fromMillis(
				Number(data.trial_end) * 1000,
			);
		}

		subscription.cancelAtPeriodEnd = Boolean(data.cancel_at_period_end);
		subscription.metadata = {
			customerId: data.customer,
		};

		await subscription.save();

		// Update user plan
		await this.updateUserPlan(userId, subscription.plan as PlanType);
	}

	private async handleSubscriptionCancelled(
		data: Record<string, unknown>,
	): Promise<void> {
		const providerSubscriptionId = String(data.id);
		const subscription = await SubscriptionModel.findBy(
			"providerSubscriptionId",
			providerSubscriptionId,
		);

		if (subscription) {
			subscription.status = "cancelled";
			subscription.cancelAtPeriodEnd = true;
			await subscription.save();
		}
	}

	private async handleSubscriptionExpired(
		data: Record<string, unknown>,
	): Promise<void> {
		const providerSubscriptionId = String(data.id);
		const subscription = await SubscriptionModel.findBy(
			"providerSubscriptionId",
			providerSubscriptionId,
		);

		if (subscription) {
			subscription.status = "expired";
			await subscription.save();

			// Downgrade user to free plan
			await this.updateUserPlan(subscription.userId, "free");
		}
	}

	private async handleSubscriptionDeleted(
		data: Record<string, unknown>,
	): Promise<void> {
		const providerSubscriptionId = String(data.id);
		const subscription = await SubscriptionModel.findBy(
			"providerSubscriptionId",
			providerSubscriptionId,
		);

		if (subscription) {
			subscription.status = "cancelled";
			await subscription.save();

			// Downgrade user to free plan
			await this.updateUserPlan(subscription.userId, "free");
		}
	}

	private async handlePaymentSuccess(
		data: Record<string, unknown>,
	): Promise<void> {
		// Log payment success, update billing history, etc.
		console.log("Payment success:", data);
	}

	private async handlePaymentFailed(
		data: Record<string, unknown>,
	): Promise<void> {
		const providerSubscriptionId = String(
			(data.attributes as Record<string, unknown>)?.subscription_id || data.id,
		);
		const subscription = await SubscriptionModel.findBy(
			"providerSubscriptionId",
			providerSubscriptionId,
		);

		if (subscription) {
			subscription.status = "past_due";
			await subscription.save();
		}
	}

	private async handleInvoicePaymentSucceeded(
		data: Record<string, unknown>,
	): Promise<void> {
		console.log("Invoice payment succeeded:", data);
	}

	private async handleInvoicePaymentFailed(
		data: Record<string, unknown>,
	): Promise<void> {
		const subscriptionId = String(data.subscription);
		const subscription = await SubscriptionModel.findBy(
			"providerSubscriptionId",
			subscriptionId,
		);

		if (subscription) {
			subscription.status = "past_due";
			await subscription.save();
		}
	}

	private async updateUserPlan(userId: string, plan: PlanType): Promise<void> {
		const { default: User } = await import("#models/user");
		const user = await User.find(userId);

		if (user) {
			user.plan = plan === "free" ? "free" : "paid";
			await user.save();
		}
	}

	private mapLemonSqueezyStatus(
		status: string,
		cancelled: boolean,
	): Subscription["status"] {
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

	private mapStripeStatus(status: string): Subscription["status"] {
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
			default:
				return "active";
		}
	}

	private mapDbSubscription(dbSubscription: SubscriptionModel): Subscription {
		return {
			id: dbSubscription.id,
			providerId: dbSubscription.providerSubscriptionId,
			provider: dbSubscription.provider as PaymentProvider,
			userId: dbSubscription.userId,
			plan: dbSubscription.plan as PlanType,
			status: dbSubscription.status as Subscription["status"],
			currentPeriodStart: dbSubscription.currentPeriodStart.toJSDate(),
			currentPeriodEnd: dbSubscription.currentPeriodEnd.toJSDate(),
			cancelAtPeriodEnd: dbSubscription.cancelAtPeriodEnd,
			trialEnd: dbSubscription.trialEndsAt?.toJSDate() ?? null,
			metadata: dbSubscription.metadata as Record<string, unknown>,
		};
	}
}

export default new PaymentService();

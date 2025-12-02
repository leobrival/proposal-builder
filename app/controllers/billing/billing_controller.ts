import type { HttpContext } from "@adonisjs/core/http";
import type {
	BillingInterval,
	PlanType,
} from "#contracts/payment_service_contract";
import paymentService from "#services/payment_service";
import env from "#start/env";

/**
 * Billing Controller
 * Handles billing pages and checkout flows.
 */
export default class BillingController {
	/**
	 * Display billing/pricing page
	 * GET /billing
	 */
	async index({ inertia, auth }: HttpContext) {
		const user = auth.user!;
		const plans = paymentService.getPlans();
		const subscription = await paymentService.getUserSubscription(user.id);

		return inertia.render("billing/index", {
			plans,
			currentSubscription: subscription,
			currentPlan: subscription?.plan || "free",
		});
	}

	/**
	 * Create checkout session and redirect
	 * POST /billing/checkout
	 */
	async checkout({ request, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const plan = request.input("plan") as PlanType;
		const interval = (request.input("interval") ||
			"monthly") as BillingInterval;

		if (!plan || plan === "free") {
			session.flash("error", "Invalid plan selected");
			return response.redirect().back();
		}

		try {
			const appUrl = env.get("APP_URL", "http://localhost:3333");
			const checkoutSession = await paymentService.createCheckoutSession(user, {
				plan,
				interval,
				successUrl: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
				cancelUrl: `${appUrl}/billing?cancelled=true`,
			});

			return response.redirect(checkoutSession.url);
		} catch (error) {
			console.error("Checkout error:", error);
			session.flash("error", "Failed to create checkout session");
			return response.redirect().back();
		}
	}

	/**
	 * Handle successful checkout
	 * GET /billing/success
	 */
	async success({ request, inertia }: HttpContext) {
		const sessionId = request.input("session_id");

		return inertia.render("billing/success", {
			sessionId,
		});
	}

	/**
	 * Redirect to customer portal
	 * GET /billing/portal
	 */
	async portal({ auth, response, session }: HttpContext) {
		const user = auth.user!;

		try {
			const portalSession = await paymentService.getCustomerPortalUrl(user);
			return response.redirect(portalSession.url);
		} catch (error) {
			console.error("Portal error:", error);
			session.flash("error", "Failed to access billing portal");
			return response.redirect().toRoute("billing.index");
		}
	}

	/**
	 * Cancel subscription
	 * POST /billing/cancel
	 */
	async cancel({ auth, response, session }: HttpContext) {
		const user = auth.user!;

		try {
			const subscription = await paymentService.getUserSubscription(user.id);
			if (!subscription) {
				session.flash("error", "No active subscription found");
				return response.redirect().toRoute("billing.index");
			}

			await paymentService.cancelSubscription(subscription.id);
			session.flash(
				"success",
				"Subscription cancelled. Access continues until end of billing period.",
			);
			return response.redirect().toRoute("billing.index");
		} catch (error) {
			console.error("Cancel error:", error);
			session.flash("error", "Failed to cancel subscription");
			return response.redirect().toRoute("billing.index");
		}
	}

	/**
	 * Resume cancelled subscription
	 * POST /billing/resume
	 */
	async resume({ auth, response, session }: HttpContext) {
		const user = auth.user!;

		try {
			const subscription = await paymentService.getUserSubscription(user.id);
			if (!subscription) {
				session.flash("error", "No subscription found");
				return response.redirect().toRoute("billing.index");
			}

			await paymentService.resumeSubscription(subscription.id);
			session.flash("success", "Subscription resumed successfully");
			return response.redirect().toRoute("billing.index");
		} catch (error) {
			console.error("Resume error:", error);
			session.flash("error", "Failed to resume subscription");
			return response.redirect().toRoute("billing.index");
		}
	}

	/**
	 * Get subscription status (API)
	 * GET /api/billing/subscription
	 */
	async getSubscription({ auth, response }: HttpContext) {
		const user = auth.user!;

		try {
			const subscription = await paymentService.getUserSubscription(user.id);
			const plans = paymentService.getPlans();
			const currentPlan = paymentService.getPlan(
				(subscription?.plan as PlanType) || "free",
			);

			return response.json({
				subscription,
				currentPlan,
				plans,
			});
		} catch (error) {
			console.error("Get subscription error:", error);
			return response.status(500).json({
				error: "Failed to get subscription",
			});
		}
	}
}

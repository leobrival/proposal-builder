import type { HttpContext } from "@adonisjs/core/http";
import type { PaymentProvider } from "#contracts/payment_service_contract";
import paymentService from "#services/payment_service";

/**
 * Webhooks Controller
 * Handles incoming webhook events from payment providers.
 */
export default class WebhooksController {
	/**
	 * Handle Lemon Squeezy webhooks
	 * POST /webhooks/lemonsqueezy
	 */
	async lemonsqueezy({ request, response }: HttpContext) {
		return this.handleWebhook(request, response, "lemonsqueezy");
	}

	/**
	 * Handle Stripe webhooks
	 * POST /webhooks/stripe
	 */
	async stripe({ request, response }: HttpContext) {
		return this.handleWebhook(request, response, "stripe");
	}

	/**
	 * Common webhook handler
	 */
	private async handleWebhook(
		request: HttpContext["request"],
		response: HttpContext["response"],
		provider: PaymentProvider,
	) {
		const signature = this.getSignature(request, provider);
		const payload = request.raw() || "";

		if (!signature) {
			return response.status(400).json({
				error: "Missing webhook signature",
			});
		}

		try {
			// Verify signature
			const isValid = await paymentService.verifyWebhookSignature(
				payload,
				signature,
			);
			if (!isValid) {
				return response.status(401).json({
					error: "Invalid webhook signature",
				});
			}

			// Parse and handle event
			const event = {
				id: "",
				type: "",
				provider,
				data: JSON.parse(payload),
				signature,
			};

			// Extract event type based on provider
			if (provider === "lemonsqueezy") {
				event.id = event.data.meta?.event_id || "";
				event.type = event.data.meta?.event_name || "";
				event.data = event.data.data || {};
			} else {
				event.id = event.data.id || "";
				event.type = event.data.type || "";
				event.data = event.data.data?.object || {};
			}

			await paymentService.handleWebhook(event);

			return response.status(200).json({ received: true });
		} catch (error) {
			console.error(`Webhook error (${provider}):`, error);
			return response.status(500).json({
				error: "Webhook processing failed",
			});
		}
	}

	/**
	 * Get signature from request headers based on provider
	 */
	private getSignature(
		request: HttpContext["request"],
		provider: PaymentProvider,
	): string | null {
		switch (provider) {
			case "lemonsqueezy":
				return request.header("X-Signature") || null;
			case "stripe":
				return request.header("Stripe-Signature") || null;
			default:
				return null;
		}
	}
}

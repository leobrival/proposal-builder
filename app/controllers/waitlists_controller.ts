import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";
import waitlistService from "#services/waitlist_service";

export default class WaitlistsController {
	async store({ request, response }: HttpContext) {
		const validator = vine.compile(
			vine.object({
				email: vine.string().email().normalizeEmail(),
				creatorType: vine.string().optional(),
			}),
		);

		const data = await request.validateUsing(validator);

		const result = await waitlistService.addToWaitlist({
			email: data.email,
			creatorType: data.creatorType || null,
			source: request.input("utm_source") || null,
			referrer: request.header("referer") || null,
		});

		const statusCode = result.alreadyRegistered ? 200 : 201;

		return response.status(statusCode).json({
			success: result.success,
			message: result.message,
			alreadyRegistered: result.alreadyRegistered,
		});
	}
}

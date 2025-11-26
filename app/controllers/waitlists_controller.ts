import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";
import Waitlist from "#models/waitlist";

export default class WaitlistsController {
	async store({ request, response }: HttpContext) {
		const validator = vine.compile(
			vine.object({
				email: vine.string().email().normalizeEmail(),
				creatorType: vine.string().optional(),
			}),
		);

		const data = await request.validateUsing(validator);

		const existing = await Waitlist.findBy("email", data.email);
		if (existing) {
			return response.status(200).json({
				success: true,
				message: "You are already on the waitlist!",
				alreadyRegistered: true,
			});
		}

		await Waitlist.create({
			email: data.email,
			creatorType: data.creatorType || null,
			source: request.input("utm_source") || null,
			referrer: request.header("referer") || null,
		});

		return response.status(201).json({
			success: true,
			message: "Welcome to the waitlist!",
			alreadyRegistered: false,
		});
	}
}

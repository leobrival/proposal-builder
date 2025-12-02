import type { HttpContext } from "@adonisjs/core/http";
import waitlistService from "#services/waitlist_service";

export default class LandingsController {
	async index({ inertia }: HttpContext) {
		const waitlistCount = await waitlistService.getCount();

		return inertia.render("landing", {
			waitlistCount,
		});
	}
}

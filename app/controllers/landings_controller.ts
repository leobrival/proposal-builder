import type { HttpContext } from "@adonisjs/core/http";
import Waitlist from "#models/waitlist";

export default class LandingsController {
	async index({ inertia }: HttpContext) {
		const waitlistCount = await Waitlist.query().count("* as total");
		const count = Number(waitlistCount[0].$extras.total) || 0;

		return inertia.render("landing", {
			waitlistCount: count,
		});
	}
}

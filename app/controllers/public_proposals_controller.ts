import type { HttpContext } from "@adonisjs/core/http";
import Proposal from "#models/proposal";

export default class PublicProposalsController {
	async show({ params, inertia, response }: HttpContext) {
		const proposal = await Proposal.query()
			.where("slug", params.slug)
			.where("status", "published")
			.preload("tiers", (query) => {
				query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
					benefitQuery.orderBy("position", "asc");
				});
			})
			.preload("user")
			.first();

		if (!proposal) {
			return response.status(404).send("Proposition introuvable");
		}

		// Increment view count
		proposal.viewCount = (proposal.viewCount || 0) + 1;
		await proposal.save();

		return inertia.render("public/proposal", { proposal });
	}
}

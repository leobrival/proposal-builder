import type { HttpContext } from "@adonisjs/core/http";
import proposalService from "#services/proposal_service";

export default class PublicProposalsController {
	async show({ params, inertia, response }: HttpContext) {
		const proposal = await proposalService.getPublishedBySlug(params.slug);

		if (!proposal) {
			return response.status(404).send("Proposition introuvable");
		}

		// Increment view count
		await proposalService.incrementViewCount(proposal);

		return inertia.render("public/proposal", { proposal });
	}
}

import type { HttpContext } from "@adonisjs/core/http";
import Lead from "#models/lead";
import Proposal from "#models/proposal";

export default class DashboardController {
	async index({ inertia, auth }: HttpContext) {
		const user = auth.user!;

		const proposals = await Proposal.query()
			.where("userId", user.id)
			.orderBy("updatedAt", "desc")
			.limit(5);

		const totalProposals = await Proposal.query()
			.where("userId", user.id)
			.count("* as total");

		const totalViews = await Proposal.query()
			.where("userId", user.id)
			.sum("view_count as total");

		const proposalIds = proposals.map((p) => p.id);
		let leadsCount = 0;
		if (proposalIds.length > 0) {
			const totalLeads = await Lead.query()
				.whereIn("proposalId", proposalIds)
				.count("* as total");
			leadsCount = Number(totalLeads[0].$extras.total) || 0;
		}

		return inertia.render("dashboard", {
			proposals,
			stats: {
				totalProposals: Number(totalProposals[0].$extras.total) || 0,
				totalViews: Number(totalViews[0].$extras.total) || 0,
				totalLeads: leadsCount,
			},
		});
	}
}

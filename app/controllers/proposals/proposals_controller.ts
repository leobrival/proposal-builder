import type { HttpContext } from "@adonisjs/core/http";
import proposalService from "#services/proposal_service";
import {
	createProposalValidator,
	updateProposalValidator,
} from "#validators/proposal/index";

export default class ProposalsController {
	async index({ inertia, auth }: HttpContext) {
		const user = auth.user!;
		const proposals = await proposalService.getAllByUser(user.id);

		return inertia.render("proposals/index", { proposals });
	}

	async create({ inertia }: HttpContext) {
		return inertia.render("proposals/create");
	}

	async store({ request, auth, response }: HttpContext) {
		const user = auth.user!;
		const data = await request.validateUsing(createProposalValidator);

		const proposal = await proposalService.create(user, data);

		return response.redirect().toRoute("proposals.edit", { id: proposal.id });
	}

	async edit({ params, inertia, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await proposalService.getWithTiers(params.id, user.id);

		if (!proposal) {
			return response.redirect().toRoute("dashboard");
		}

		return inertia.render("proposals/edit", { proposal });
	}

	async update({ params, request, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const proposal = await proposalService.getByIdForUser(params.id, user.id);

		if (!proposal) {
			session.flash("error", "Proposition introuvable");
			return response.redirect().toRoute("dashboard");
		}

		const data = await request.validateUsing(updateProposalValidator);

		await proposalService.update(proposal, data);

		session.flash("success", "Proposition mise a jour");
		return response.redirect().toRoute("proposals.edit", { id: proposal.id });
	}

	async destroy({ params, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const proposal = await proposalService.getByIdForUser(params.id, user.id);

		if (!proposal) {
			session.flash("error", "Proposition introuvable");
			return response.redirect().toRoute("dashboard");
		}

		await proposalService.delete(proposal);

		session.flash("success", "Proposition supprimee");
		return response.redirect().toRoute("dashboard");
	}

	async publish({ params, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const proposal = await proposalService.getByIdForUser(params.id, user.id);

		if (!proposal) {
			session.flash("error", "Proposition introuvable");
			return response.redirect().toRoute("dashboard");
		}

		await proposalService.publish(proposal);

		session.flash("success", "Proposition publiee");
		return response.redirect().toRoute("proposals.edit", { id: proposal.id });
	}

	async unpublish({ params, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const proposal = await proposalService.getByIdForUser(params.id, user.id);

		if (!proposal) {
			session.flash("error", "Proposition introuvable");
			return response.redirect().toRoute("dashboard");
		}

		await proposalService.unpublish(proposal);

		session.flash("success", "Proposition depubliee");
		return response.redirect().toRoute("proposals.edit", { id: proposal.id });
	}
}

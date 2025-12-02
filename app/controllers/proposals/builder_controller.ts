import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";
import proposalService from "#services/proposal_service";

const updateLayoutValidator = vine.compile(
	vine.object({
		pageLayout: vine.any(),
	}),
);

export default class BuilderController {
	/**
	 * Display the builder page for a proposal
	 */
	async show({ params, inertia, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await proposalService.getWithTiers(params.id, user.id);

		if (!proposal) {
			return response.redirect().toRoute("dashboard");
		}

		return inertia.render("proposals/builder", {
			proposal,
			initialLayout: proposal.pageLayout,
		});
	}

	/**
	 * Update the page layout for a proposal
	 */
	async update({ params, request, auth, response, inertia }: HttpContext) {
		const user = auth.user!;
		const proposal = await proposalService.getWithTiers(params.id, user.id);

		if (!proposal) {
			return response.redirect().toRoute("dashboard");
		}

		const data = await request.validateUsing(updateLayoutValidator);

		await proposalService.updatePageLayout(proposal, data.pageLayout);

		// Return Inertia response to stay on the same page
		return inertia.render("proposals/builder", {
			proposal,
			initialLayout: proposal.pageLayout,
			savedAt: proposal.updatedAt?.toISO(),
		});
	}

	/**
	 * Display the preview page for a proposal
	 */
	async preview({ params, inertia, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await proposalService.getWithTiers(params.id, user.id);

		if (!proposal) {
			return response.redirect().toRoute("dashboard");
		}

		return inertia.render("proposals/preview", {
			proposal,
			layout: proposal.pageLayout,
		});
	}
}

import type { HttpContext } from "@adonisjs/core/http";
import { DateTime } from "luxon";
import Benefit from "#models/benefit";
import Proposal from "#models/proposal";
import Tier from "#models/tier";
import {
	createProposalValidator,
	updateProposalValidator,
} from "#validators/proposal_validator";

export default class ProposalsController {
	async index({ inertia, auth }: HttpContext) {
		const user = auth.user!;
		const proposals = await Proposal.query()
			.where("userId", user.id)
			.orderBy("updatedAt", "desc");

		return inertia.render("proposals/index", { proposals });
	}

	async create({ inertia }: HttpContext) {
		return inertia.render("proposals/create");
	}

	async store({ request, auth, response }: HttpContext) {
		const user = auth.user!;
		const data = await request.validateUsing(createProposalValidator);

		const proposal = await Proposal.create({
			...data,
			userId: user.id,
		});

		return response.redirect().toRoute("proposals.edit", { id: proposal.id });
	}

	async edit({ params, inertia, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.preload("tiers", (query) => {
				query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
					benefitQuery.orderBy("position", "asc");
				});
			})
			.first();

		if (!proposal) {
			return response.redirect().toRoute("dashboard");
		}

		return inertia.render("proposals/edit", { proposal });
	}

	async update({ params, request, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			session.flash("error", "Proposition introuvable");
			return response.redirect().toRoute("dashboard");
		}

		const data = await request.validateUsing(updateProposalValidator);

		// Update proposal fields
		const { tiers: tiersData, ...proposalData } = data;
		proposal.merge(proposalData);
		await proposal.save();

		// Update tiers if provided
		if (tiersData) {
			const existingTierIds = new Set<string>();

			for (const tierData of tiersData) {
				const { benefits: benefitsData, ...tierFields } = tierData;

				let tier: Tier;
				if (tierData.id) {
					const existingTier = await Tier.find(tierData.id);
					if (existingTier && existingTier.proposalId === proposal.id) {
						tier = existingTier;
						tier.merge(tierFields);
						await tier.save();
					} else {
						tier = await Tier.create({
							...tierFields,
							proposalId: proposal.id,
						});
					}
				} else {
					tier = await Tier.create({
						...tierFields,
						proposalId: proposal.id,
					});
				}
				existingTierIds.add(tier.id);

				// Update benefits
				if (benefitsData) {
					const existingBenefitIds = new Set<string>();

					for (const benefitData of benefitsData) {
						let benefit: Benefit;
						if (benefitData.id) {
							const existingBenefit = await Benefit.find(benefitData.id);
							if (existingBenefit && existingBenefit.tierId === tier.id) {
								benefit = existingBenefit;
								benefit.merge(benefitData);
								await benefit.save();
							} else {
								benefit = await Benefit.create({
									...benefitData,
									tierId: tier.id,
								});
							}
						} else {
							benefit = await Benefit.create({
								...benefitData,
								tierId: tier.id,
							});
						}
						existingBenefitIds.add(benefit.id);
					}

					// Delete removed benefits
					await Benefit.query()
						.where("tierId", tier.id)
						.whereNotIn("id", Array.from(existingBenefitIds))
						.delete();
				}
			}

			// Delete removed tiers
			await Tier.query()
				.where("proposalId", proposal.id)
				.whereNotIn("id", Array.from(existingTierIds))
				.delete();
		}

		session.flash("success", "Proposition mise à jour");
		return response.redirect().toRoute("proposals.edit", { id: proposal.id });
	}

	async destroy({ params, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			session.flash("error", "Proposition introuvable");
			return response.redirect().toRoute("dashboard");
		}

		await proposal.delete();

		session.flash("success", "Proposition supprimée");
		return response.redirect().toRoute("dashboard");
	}

	async publish({ params, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			session.flash("error", "Proposition introuvable");
			return response.redirect().toRoute("dashboard");
		}

		proposal.status = "published";
		proposal.publishedAt = DateTime.now();
		await proposal.save();

		session.flash("success", "Proposition publiée");
		return response.redirect().toRoute("proposals.edit", { id: proposal.id });
	}

	async unpublish({ params, auth, response, session }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			session.flash("error", "Proposition introuvable");
			return response.redirect().toRoute("dashboard");
		}

		proposal.status = "draft";
		await proposal.save();

		session.flash("success", "Proposition dépubliée");
		return response.redirect().toRoute("proposals.edit", { id: proposal.id });
	}
}

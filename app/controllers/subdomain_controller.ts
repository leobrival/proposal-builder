import type { HttpContext } from "@adonisjs/core/http";
import domainService from "#services/domain_service";
import proposalService from "#services/proposal_service";

export default class SubdomainController {
	/**
	 * Handle subdomain requests and render the public proposal page
	 */
	async handle({ subdomains, inertia, response }: HttpContext) {
		// Get subdomain from route parameter
		const subdomain = subdomains.subdomain;

		if (!subdomain) {
			return response.redirect("http://localhost:3333/");
		}

		// Find proposal by subdomain
		const proposal = await domainService.findBySubdomain(subdomain);

		if (!proposal) {
			return response.redirect("http://localhost:3333/");
		}

		// Increment view count
		await proposalService.incrementViewCount(proposal);

		// Load relations
		await proposal.load("tiers", (query) => {
			query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
				benefitQuery.orderBy("position", "asc");
			});
		});
		await proposal.load("user");

		// Render the public proposal page
		return inertia.render("public/proposal", {
			proposal,
			isCustomDomain: true,
		});
	}
}

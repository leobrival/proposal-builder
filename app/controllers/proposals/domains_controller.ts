import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";
import Proposal from "#models/proposal";
import domainService from "#services/domain_service";

const subdomainValidator = vine.compile(
	vine.object({
		subdomain: vine.string().trim().toLowerCase().minLength(3).maxLength(63),
	}),
);

const customDomainValidator = vine.compile(
	vine.object({
		customDomain: vine.string().trim().toLowerCase().maxLength(255),
	}),
);

export default class DomainsController {
	/**
	 * Get domain settings for a proposal
	 */
	async show({ params, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			return response.status(404).json({ error: "Proposition introuvable" });
		}

		const subdomainUrl = proposal.subdomain
			? domainService.getSubdomainUrl(proposal.subdomain)
			: null;

		const dnsInstructions =
			proposal.customDomain && proposal.domainVerificationToken
				? domainService.getDnsInstructions(
						proposal.customDomain,
						proposal.domainVerificationToken,
					)
				: null;

		return response.json({
			subdomain: proposal.subdomain,
			subdomainUrl,
			customDomain: proposal.customDomain,
			domainStatus: proposal.domainStatus,
			sslStatus: proposal.sslStatus,
			domainVerifiedAt: proposal.domainVerifiedAt,
			dnsInstructions,
			cnameTarget: domainService.getCnameTarget(),
		});
	}

	/**
	 * Set subdomain for a proposal
	 */
	async setSubdomain({ params, request, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			return response.status(404).json({ error: "Proposition introuvable" });
		}

		const { subdomain } = await request.validateUsing(subdomainValidator);

		try {
			await domainService.setupSubdomain(proposal, subdomain);

			return response.json({
				success: true,
				subdomain: proposal.subdomain,
				subdomainUrl: domainService.getSubdomainUrl(proposal.subdomain!),
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Erreur inconnue";
			return response.status(400).json({ error: message });
		}
	}

	/**
	 * Remove subdomain from a proposal
	 */
	async removeSubdomain({ params, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			return response.status(404).json({ error: "Proposition introuvable" });
		}

		await domainService.removeSubdomain(proposal);

		return response.json({ success: true });
	}

	/**
	 * Set custom domain for a proposal
	 */
	async setCustomDomain({ params, request, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			return response.status(404).json({ error: "Proposition introuvable" });
		}

		const { customDomain } = await request.validateUsing(customDomainValidator);

		try {
			const verificationToken = await domainService.setupCustomDomain(
				proposal,
				customDomain,
			);

			const dnsInstructions = domainService.getDnsInstructions(
				customDomain,
				verificationToken,
			);

			return response.json({
				success: true,
				customDomain: proposal.customDomain,
				domainStatus: proposal.domainStatus,
				dnsInstructions,
				cnameTarget: domainService.getCnameTarget(),
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Erreur inconnue";
			return response.status(400).json({ error: message });
		}
	}

	/**
	 * Remove custom domain from a proposal
	 */
	async removeCustomDomain({ params, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			return response.status(404).json({ error: "Proposition introuvable" });
		}

		await domainService.removeCustomDomain(proposal);

		return response.json({ success: true });
	}

	/**
	 * Verify custom domain DNS configuration
	 */
	async verifyDomain({ params, auth, response }: HttpContext) {
		const user = auth.user!;
		const proposal = await Proposal.query()
			.where("id", params.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			return response.status(404).json({ error: "Proposition introuvable" });
		}

		if (!proposal.customDomain) {
			return response
				.status(400)
				.json({ error: "Aucun domaine personnalisé configuré" });
		}

		try {
			const result = await domainService.checkDomainVerification(proposal);

			return response.json({
				verified: result.verified,
				cnameValid: result.cnameValid,
				txtValid: result.txtValid,
				domainStatus: proposal.domainStatus,
				sslStatus: proposal.sslStatus,
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Erreur inconnue";
			return response.status(400).json({ error: message });
		}
	}

	/**
	 * Check subdomain availability
	 */
	async checkSubdomainAvailability({ request, response }: HttpContext) {
		const subdomain = request.input("subdomain", "").toLowerCase().trim();
		const proposalId = request.input("proposalId");

		if (!subdomain) {
			return response.status(400).json({ error: "Sous-domaine requis" });
		}

		const validation = domainService.isValidSubdomain(subdomain);
		if (!validation.valid) {
			return response.json({ available: false, error: validation.error });
		}

		const available = await domainService.isSubdomainAvailable(
			subdomain,
			proposalId,
		);

		return response.json({ available });
	}

	/**
	 * Check custom domain availability
	 */
	async checkCustomDomainAvailability({ request, response }: HttpContext) {
		const domain = request.input("domain", "").toLowerCase().trim();
		const proposalId = request.input("proposalId");

		if (!domain) {
			return response.status(400).json({ error: "Domaine requis" });
		}

		const validation = domainService.isValidCustomDomain(domain);
		if (!validation.valid) {
			return response.json({ available: false, error: validation.error });
		}

		const available = await domainService.isCustomDomainAvailable(
			domain,
			proposalId,
		);

		return response.json({ available });
	}
}

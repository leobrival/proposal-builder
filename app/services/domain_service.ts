import { randomBytes } from "node:crypto";
import { promises as dns } from "node:dns";
import { DateTime } from "luxon";
import Proposal from "#models/proposal";

// Reserved subdomains that cannot be used
const RESERVED_SUBDOMAINS = [
	"www",
	"app",
	"api",
	"admin",
	"dashboard",
	"mail",
	"smtp",
	"ftp",
	"ns1",
	"ns2",
	"staging",
	"dev",
	"test",
	"beta",
	"alpha",
	"demo",
	"help",
	"support",
	"status",
	"blog",
	"docs",
	"cdn",
	"assets",
	"static",
	"media",
	"images",
	"img",
	"files",
	"download",
	"uploads",
];

export class DomainService {
	/**
	 * Base domain for the application
	 */
	private baseDomain: string;

	/**
	 * CNAME target for custom domains
	 */
	private cnameTarget: string;

	constructor() {
		this.baseDomain = process.env.APP_DOMAIN || "sponseasy.com";
		this.cnameTarget = process.env.CNAME_TARGET || `custom.${this.baseDomain}`;
	}

	/**
	 * Validate subdomain format
	 */
	isValidSubdomain(subdomain: string): { valid: boolean; error?: string } {
		// Check length (1-63 characters for DNS label)
		if (subdomain.length < 3 || subdomain.length > 63) {
			return {
				valid: false,
				error: "Le sous-domaine doit contenir entre 3 et 63 caractères",
			};
		}

		// Check format (alphanumeric and hyphens, cannot start/end with hyphen)
		const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
		if (!subdomainRegex.test(subdomain)) {
			return {
				valid: false,
				error:
					"Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets",
			};
		}

		// Check reserved subdomains
		if (RESERVED_SUBDOMAINS.includes(subdomain)) {
			return { valid: false, error: "Ce sous-domaine est réservé" };
		}

		return { valid: true };
	}

	/**
	 * Validate custom domain format
	 */
	isValidCustomDomain(domain: string): { valid: boolean; error?: string } {
		// Basic domain format validation
		const domainRegex = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
		if (!domainRegex.test(domain)) {
			return { valid: false, error: "Format de domaine invalide" };
		}

		// Prevent using our own domain
		if (domain.endsWith(this.baseDomain)) {
			return {
				valid: false,
				error: `Vous ne pouvez pas utiliser un sous-domaine de ${this.baseDomain}`,
			};
		}

		return { valid: true };
	}

	/**
	 * Check if subdomain is available
	 */
	async isSubdomainAvailable(
		subdomain: string,
		excludeProposalId?: string,
	): Promise<boolean> {
		const query = Proposal.query().where("subdomain", subdomain);
		if (excludeProposalId) {
			query.whereNot("id", excludeProposalId);
		}
		const existing = await query.first();
		return !existing;
	}

	/**
	 * Check if custom domain is available
	 */
	async isCustomDomainAvailable(
		domain: string,
		excludeProposalId?: string,
	): Promise<boolean> {
		const query = Proposal.query().where("customDomain", domain);
		if (excludeProposalId) {
			query.whereNot("id", excludeProposalId);
		}
		const existing = await query.first();
		return !existing;
	}

	/**
	 * Generate a verification token for DNS TXT record
	 */
	generateVerificationToken(): string {
		return `sponseasy-verify-${randomBytes(16).toString("hex")}`;
	}

	/**
	 * Get the full subdomain URL
	 */
	getSubdomainUrl(subdomain: string): string {
		return `https://${subdomain}.${this.baseDomain}`;
	}

	/**
	 * Get CNAME target for custom domains
	 */
	getCnameTarget(): string {
		return this.cnameTarget;
	}

	/**
	 * Get DNS instructions for custom domain setup
	 */
	getDnsInstructions(
		domain: string,
		verificationToken: string,
	): {
		cname: { host: string; value: string };
		txt: { host: string; value: string };
	} {
		return {
			cname: {
				host: domain,
				value: this.cnameTarget,
			},
			txt: {
				host: `_sponseasy.${domain}`,
				value: verificationToken,
			},
		};
	}

	/**
	 * Verify CNAME record for custom domain
	 */
	async verifyCname(domain: string): Promise<boolean> {
		try {
			const records = await dns.resolveCname(domain);
			return records.some(
				(record) => record.toLowerCase() === this.cnameTarget.toLowerCase(),
			);
		} catch {
			return false;
		}
	}

	/**
	 * Verify TXT record for domain ownership
	 */
	async verifyTxtRecord(
		domain: string,
		expectedToken: string,
	): Promise<boolean> {
		try {
			const txtHost = `_sponseasy.${domain}`;
			const records = await dns.resolveTxt(txtHost);
			// TXT records come as arrays of strings
			return records.some((recordParts) =>
				recordParts.some((part) => part === expectedToken),
			);
		} catch {
			return false;
		}
	}

	/**
	 * Full domain verification (both CNAME and TXT)
	 */
	async verifyCustomDomain(
		domain: string,
		verificationToken: string,
	): Promise<{ verified: boolean; cnameValid: boolean; txtValid: boolean }> {
		const [cnameValid, txtValid] = await Promise.all([
			this.verifyCname(domain),
			this.verifyTxtRecord(domain, verificationToken),
		]);

		return {
			verified: cnameValid && txtValid,
			cnameValid,
			txtValid,
		};
	}

	/**
	 * Set up subdomain for a proposal
	 */
	async setupSubdomain(proposal: Proposal, subdomain: string): Promise<void> {
		const normalizedSubdomain = subdomain.toLowerCase().trim();

		// Validate format
		const validation = this.isValidSubdomain(normalizedSubdomain);
		if (!validation.valid) {
			throw new Error(validation.error);
		}

		// Check availability
		const available = await this.isSubdomainAvailable(
			normalizedSubdomain,
			proposal.id,
		);
		if (!available) {
			throw new Error("Ce sous-domaine est déjà utilisé");
		}

		proposal.subdomain = normalizedSubdomain;
		await proposal.save();
	}

	/**
	 * Set up custom domain for a proposal
	 */
	async setupCustomDomain(proposal: Proposal, domain: string): Promise<string> {
		const normalizedDomain = domain.toLowerCase().trim();

		// Validate format
		const validation = this.isValidCustomDomain(normalizedDomain);
		if (!validation.valid) {
			throw new Error(validation.error);
		}

		// Check availability
		const available = await this.isCustomDomainAvailable(
			normalizedDomain,
			proposal.id,
		);
		if (!available) {
			throw new Error("Ce domaine est déjà utilisé");
		}

		// Generate verification token
		const verificationToken = this.generateVerificationToken();

		proposal.customDomain = normalizedDomain;
		proposal.domainStatus = "pending";
		proposal.domainVerificationToken = verificationToken;
		proposal.sslStatus = "none";
		await proposal.save();

		return verificationToken;
	}

	/**
	 * Check and update domain verification status
	 */
	async checkDomainVerification(proposal: Proposal): Promise<{
		verified: boolean;
		cnameValid: boolean;
		txtValid: boolean;
	}> {
		if (!proposal.customDomain || !proposal.domainVerificationToken) {
			throw new Error("Aucun domaine personnalisé configuré");
		}

		const result = await this.verifyCustomDomain(
			proposal.customDomain,
			proposal.domainVerificationToken,
		);

		if (result.verified) {
			proposal.domainStatus = "verified";
			proposal.domainVerifiedAt = DateTime.now();
			proposal.sslStatus = "pending"; // SSL will be provisioned separately
		} else {
			proposal.domainStatus = "verifying";
		}

		await proposal.save();

		return result;
	}

	/**
	 * Remove custom domain from proposal
	 */
	async removeCustomDomain(proposal: Proposal): Promise<void> {
		proposal.customDomain = null;
		proposal.domainStatus = "pending";
		proposal.domainVerificationToken = null;
		proposal.sslStatus = "none";
		proposal.domainVerifiedAt = null;
		await proposal.save();
	}

	/**
	 * Remove subdomain from proposal
	 */
	async removeSubdomain(proposal: Proposal): Promise<void> {
		proposal.subdomain = null;
		await proposal.save();
	}

	/**
	 * Find proposal by subdomain
	 */
	async findBySubdomain(subdomain: string): Promise<Proposal | null> {
		return Proposal.query()
			.where("subdomain", subdomain.toLowerCase())
			.where("status", "published")
			.first();
	}

	/**
	 * Find proposal by custom domain
	 */
	async findByCustomDomain(domain: string): Promise<Proposal | null> {
		return Proposal.query()
			.where("customDomain", domain.toLowerCase())
			.where("domainStatus", "verified")
			.where("status", "published")
			.first();
	}
}

export default new DomainService();

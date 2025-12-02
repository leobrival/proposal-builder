import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";
import type Proposal from "#models/proposal";
import domainService from "#services/domain_service";

/**
 * Domain middleware that handles multi-tenant routing
 *
 * This middleware checks if the request is coming from:
 * 1. A custom domain (e.g., sponsors.mysite.com)
 * 2. A subdomain (e.g., techtalks.sponseasy.com)
 *
 * If a matching proposal is found, it attaches it to the context
 * and allows the request to proceed to the public proposal page.
 */
export default class DomainMiddleware {
	private baseDomain: string;

	constructor() {
		this.baseDomain = process.env.APP_DOMAIN || "sponseasy.com";
	}

	async handle(ctx: HttpContext, next: NextFn) {
		const host = ctx.request.header("host") || "";
		const hostname = host.split(":")[0]; // Remove port if present

		// Check for localhost subdomain first (e.g., techtalks.localhost)
		const localhostSubdomain = this.extractLocalhostSubdomain(hostname);
		if (localhostSubdomain) {
			const proposal = await domainService.findBySubdomain(localhostSubdomain);
			if (proposal) {
				ctx.proposal = proposal;
				return this.renderProposal(ctx, proposal);
			}
		}

		// Skip if it's the main domain or plain localhost
		if (this.isMainDomain(hostname)) {
			return next();
		}

		// Check if it's a subdomain of our base domain
		const subdomain = this.extractSubdomain(hostname);
		if (subdomain) {
			const proposal = await domainService.findBySubdomain(subdomain);
			if (proposal) {
				// Attach proposal to context and render public page
				ctx.proposal = proposal;
				return this.renderProposal(ctx, proposal);
			}
		}

		// Check if it's a custom domain
		const proposal = await domainService.findByCustomDomain(hostname);
		if (proposal) {
			ctx.proposal = proposal;
			return this.renderProposal(ctx, proposal);
		}

		// No matching domain found, continue to normal routing
		return next();
	}

	private isMainDomain(hostname: string): boolean {
		const mainDomains = [
			"localhost",
			"127.0.0.1",
			this.baseDomain,
			`www.${this.baseDomain}`,
			`app.${this.baseDomain}`,
		];

		return mainDomains.some((domain) => hostname === domain);
	}

	/**
	 * Extract subdomain from localhost (e.g., techtalks.localhost -> techtalks)
	 */
	private extractLocalhostSubdomain(hostname: string): string | null {
		const localhostPattern = /^([a-z0-9-]+)\.localhost$/i;
		const match = hostname.match(localhostPattern);

		if (!match) {
			return null;
		}

		const subdomain = match[1].toLowerCase();

		// Skip reserved subdomains
		const reserved = ["www", "app", "api", "admin", "mail"];
		if (reserved.includes(subdomain)) {
			return null;
		}

		return subdomain;
	}

	private extractSubdomain(hostname: string): string | null {
		// Check if hostname ends with our base domain
		const baseDomainPattern = new RegExp(
			`^([a-z0-9-]+)\\.${this.baseDomain.replace(".", "\\.")}$`,
			"i",
		);
		const match = hostname.match(baseDomainPattern);

		if (!match) {
			return null;
		}

		const subdomain = match[1].toLowerCase();

		// Skip www and other reserved subdomains
		const reserved = ["www", "app", "api", "admin", "mail"];
		if (reserved.includes(subdomain)) {
			return null;
		}

		return subdomain;
	}

	private async renderProposal(ctx: HttpContext, proposal: Proposal) {
		// Increment view count
		proposal.viewCount = (proposal.viewCount || 0) + 1;
		await proposal.save();

		// Load relations
		await proposal.load("tiers", (query) => {
			query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
				benefitQuery.orderBy("position", "asc");
			});
		});
		await proposal.load("user");

		// Render the public proposal page
		return ctx.inertia.render("public/proposal", {
			proposal,
			isCustomDomain: true,
		});
	}
}

// Extend HttpContext to include proposal
declare module "@adonisjs/core/http" {
	interface HttpContext {
		proposal?: Proposal;
	}
}

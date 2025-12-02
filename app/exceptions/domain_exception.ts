import BaseException from "./base_exception.js";

/**
 * Exception thrown when subdomain is already in use
 */
export class SubdomainAlreadyInUseException extends BaseException {
	constructor(subdomain: string) {
		super("Ce sous-domaine est deja utilise", {
			code: "E_SUBDOMAIN_ALREADY_IN_USE",
			status: 409,
			context: { subdomain },
		});
	}
}

/**
 * Exception thrown when subdomain format is invalid
 */
export class InvalidSubdomainException extends BaseException {
	constructor(subdomain: string, reason: string) {
		super(`Sous-domaine invalide: ${reason}`, {
			code: "E_INVALID_SUBDOMAIN",
			status: 400,
			context: { subdomain, reason },
		});
	}
}

/**
 * Exception thrown when custom domain is already in use
 */
export class CustomDomainAlreadyInUseException extends BaseException {
	constructor(domain: string) {
		super("Ce domaine personnalise est deja utilise", {
			code: "E_CUSTOM_DOMAIN_ALREADY_IN_USE",
			status: 409,
			context: { domain },
		});
	}
}

/**
 * Exception thrown when custom domain format is invalid
 */
export class InvalidCustomDomainException extends BaseException {
	constructor(domain: string, reason: string) {
		super(`Domaine personnalise invalide: ${reason}`, {
			code: "E_INVALID_CUSTOM_DOMAIN",
			status: 400,
			context: { domain, reason },
		});
	}
}

/**
 * Exception thrown when domain verification fails
 */
export class DomainVerificationFailedException extends BaseException {
	constructor(domain: string, reason: string) {
		super(`Echec de la verification du domaine: ${reason}`, {
			code: "E_DOMAIN_VERIFICATION_FAILED",
			status: 400,
			context: { domain, reason },
		});
	}
}

/**
 * Exception thrown when no custom domain is configured
 */
export class NoCustomDomainConfiguredException extends BaseException {
	constructor() {
		super("Aucun domaine personnalise configure", {
			code: "E_NO_CUSTOM_DOMAIN_CONFIGURED",
			status: 400,
		});
	}
}

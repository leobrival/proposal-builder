import BaseException from "./base_exception.js";

/**
 * Exception thrown when proposal is not found
 */
export class ProposalNotFoundException extends BaseException {
	constructor(identifier?: string, identifierType: "id" | "slug" = "id") {
		super("Proposition introuvable", {
			code: "E_PROPOSAL_NOT_FOUND",
			status: 404,
			context: identifier
				? { [identifierType === "slug" ? "slug" : "proposalId"]: identifier }
				: undefined,
		});
	}
}

/**
 * Exception thrown when user doesn't have access to proposal
 */
export class UnauthorizedProposalAccessException extends BaseException {
	constructor(proposalId: string) {
		super("Vous n'avez pas acces a cette proposition", {
			code: "E_UNAUTHORIZED_PROPOSAL_ACCESS",
			status: 403,
			context: { proposalId },
		});
	}
}

/**
 * Exception thrown when proposal status is invalid
 */
export class InvalidProposalStatusException extends BaseException {
	constructor(status: string) {
		super("Statut de proposition invalide", {
			code: "E_INVALID_PROPOSAL_STATUS",
			status: 400,
			context: { status, validStatuses: ["published", "draft", "archived"] },
		});
	}
}

/**
 * Exception thrown when trying to publish an invalid proposal
 */
export class CannotPublishProposalException extends BaseException {
	constructor(reason: string) {
		super(`Impossible de publier la proposition: ${reason}`, {
			code: "E_CANNOT_PUBLISH_PROPOSAL",
			status: 400,
			context: { reason },
		});
	}
}

/**
 * Exception thrown when tier is not found
 */
export class TierNotFoundException extends BaseException {
	constructor(tierId?: string) {
		super("Tier introuvable", {
			code: "E_TIER_NOT_FOUND",
			status: 404,
			context: tierId ? { tierId } : undefined,
		});
	}
}

/**
 * Exception thrown when benefit is not found
 */
export class BenefitNotFoundException extends BaseException {
	constructor(benefitId?: string) {
		super("Avantage introuvable", {
			code: "E_BENEFIT_NOT_FOUND",
			status: 404,
			context: benefitId ? { benefitId } : undefined,
		});
	}
}

/**
 * Application exceptions barrel export
 * Import all exceptions from this file for cleaner imports
 */

// Auth exceptions
export {
	AccountBlockedException,
	EmailAlreadyRegisteredException,
	InvalidCredentialsException,
	InvalidPasswordException,
	UnauthenticatedException,
} from "./auth_exception.js";
// Base
export { default as BaseException } from "./base_exception.js";
// Domain exceptions
export {
	CustomDomainAlreadyInUseException,
	DomainVerificationFailedException,
	InvalidCustomDomainException,
	InvalidSubdomainException,
	NoCustomDomainConfiguredException,
	SubdomainAlreadyInUseException,
} from "./domain_exception.js";

// Proposal exceptions
export {
	BenefitNotFoundException,
	CannotPublishProposalException,
	InvalidProposalStatusException,
	ProposalNotFoundException,
	TierNotFoundException,
	UnauthorizedProposalAccessException,
} from "./proposal_exception.js";
// User exceptions
export {
	CannotBlockOwnAccountException,
	CannotDeleteOwnAccountException,
	CannotModifyOwnAdminStatusException,
	InvalidPlanException,
	UserNotFoundException,
} from "./user_exception.js";

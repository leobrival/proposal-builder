/**
 * Validators barrel export
 * Organized by domain for cleaner imports
 */

// Auth validators
export { loginValidator, registerValidator } from "./auth/index.js";
// Proposal validators
export {
	createProposalValidator,
	publishProposalValidator,
	updateProposalValidator,
} from "./proposal/index.js";
// User validators
export {
	deleteAccountValidator,
	updatePasswordValidator,
	updateProfileValidator,
} from "./user/index.js";

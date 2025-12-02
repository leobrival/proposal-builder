/**
 * Listeners barrel export and registration
 */

import { registerAdminListeners } from "./admin_listener.js";
import { registerProposalListeners } from "./proposal_listener.js";
import { registerUserListeners } from "./user_listener.js";

/**
 * Register all event listeners
 * Call this function during application bootstrap
 */
export function registerAllListeners(): void {
	registerUserListeners();
	registerProposalListeners();
	registerAdminListeners();
}

export { registerAdminListeners } from "./admin_listener.js";
export { registerProposalListeners } from "./proposal_listener.js";
export { registerUserListeners } from "./user_listener.js";

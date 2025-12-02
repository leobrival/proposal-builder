import type User from "#models/user";

/**
 * Policy response type
 */
export interface PolicyResponse {
	allowed: boolean;
	reason?: string;
}

/**
 * Base policy class providing common authorization methods
 * All policies should extend this class
 */
export default abstract class BasePolicy {
	/**
	 * Allow the action
	 */
	protected allow(): PolicyResponse {
		return { allowed: true };
	}

	/**
	 * Deny the action with optional reason
	 */
	protected deny(reason?: string): PolicyResponse {
		return { allowed: false, reason };
	}

	/**
	 * Check if user is authenticated
	 */
	protected isAuthenticated(user: User | null): user is User {
		return user !== null;
	}

	/**
	 * Check if user is an admin
	 */
	protected isAdmin(user: User): boolean {
		return user.role === "admin";
	}

	/**
	 * Check if user has paid plan
	 */
	protected isPaidUser(user: User): boolean {
		return user.plan === "paid";
	}

	/**
	 * Check if user account is active
	 */
	protected isActive(user: User): boolean {
		return user.isActive;
	}
}

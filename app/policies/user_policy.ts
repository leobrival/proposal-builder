import type User from "#models/user";
import BasePolicy, { type PolicyResponse } from "./base_policy.js";

/**
 * Policy for user authorization
 * Handles all permission checks related to user management
 */
export default class UserPolicy extends BasePolicy {
	/**
	 * Check if user can view another user's profile
	 * Users can view their own profile, admins can view all
	 */
	view(currentUser: User, targetUser: User): PolicyResponse {
		if (this.isAdmin(currentUser)) {
			return this.allow();
		}

		if (currentUser.id === targetUser.id) {
			return this.allow();
		}

		return this.deny("Vous ne pouvez pas voir ce profil");
	}

	/**
	 * Check if user can update another user's profile
	 * Users can only update their own profile
	 */
	update(currentUser: User, targetUser: User): PolicyResponse {
		if (currentUser.id !== targetUser.id) {
			return this.deny("Vous ne pouvez pas modifier ce profil");
		}

		return this.allow();
	}

	/**
	 * Check if user can delete another user's account
	 * Users can delete their own, admins can delete others (but not themselves)
	 */
	delete(currentUser: User, targetUser: User): PolicyResponse {
		// Users can delete their own account
		if (currentUser.id === targetUser.id) {
			return this.allow();
		}

		// Admins can delete other users
		if (this.isAdmin(currentUser)) {
			return this.allow();
		}

		return this.deny("Vous ne pouvez pas supprimer ce compte");
	}

	/**
	 * Check if user can change another user's admin status
	 * Only admins can change admin status, but not their own
	 */
	changeAdminStatus(currentUser: User, targetUser: User): PolicyResponse {
		if (!this.isAdmin(currentUser)) {
			return this.deny(
				"Seuls les administrateurs peuvent modifier le statut admin",
			);
		}

		if (currentUser.id === targetUser.id) {
			return this.deny("Vous ne pouvez pas modifier votre propre statut admin");
		}

		return this.allow();
	}

	/**
	 * Check if user can change another user's plan
	 * Only admins can change plans
	 */
	changePlan(currentUser: User, _targetUser: User): PolicyResponse {
		if (!this.isAdmin(currentUser)) {
			return this.deny("Seuls les administrateurs peuvent modifier les plans");
		}

		return this.allow();
	}

	/**
	 * Check if user can block/unblock another user
	 * Only admins can block users, but not themselves
	 */
	changeBlockStatus(currentUser: User, targetUser: User): PolicyResponse {
		if (!this.isAdmin(currentUser)) {
			return this.deny(
				"Seuls les administrateurs peuvent bloquer les utilisateurs",
			);
		}

		if (currentUser.id === targetUser.id) {
			return this.deny("Vous ne pouvez pas bloquer votre propre compte");
		}

		return this.allow();
	}

	/**
	 * Check if user can access admin panel
	 */
	accessAdminPanel(user: User): PolicyResponse {
		if (!this.isAdmin(user)) {
			return this.deny("Acces reserve aux administrateurs");
		}

		return this.allow();
	}
}

export const userPolicy = new UserPolicy();

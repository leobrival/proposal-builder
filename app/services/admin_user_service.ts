import {
	CannotBlockOwnAccountException,
	CannotDeleteOwnAccountException,
	CannotModifyOwnAdminStatusException,
	InvalidPlanException,
	UserNotFoundException,
} from "#exceptions/index";
import AdminAction from "#models/admin_action";
import User from "#models/user";

/**
 * Service responsible for administrative user management.
 * Handles plan upgrades, admin status, blocking, and user deletion.
 * All actions are logged to AdminAction for audit trail.
 */
class AdminUserService {
	/**
	 * Update user subscription plan.
	 *
	 * @param adminId - ID of the admin performing the action
	 * @param userId - ID of the user to update
	 * @param plan - New plan value ('free' or 'paid')
	 * @returns Updated user data
	 * @throws {InvalidPlanException} When plan value is invalid
	 * @throws {UserNotFoundException} When user is not found
	 *
	 * @example
	 * ```typescript
	 * const result = await adminUserService.updatePlan(adminId, userId, 'paid');
	 * console.log(result.plan); // 'paid'
	 * ```
	 */
	async updatePlan(
		adminId: string,
		userId: string,
		plan: "free" | "paid",
	): Promise<{ id: string; plan: string }> {
		if (!["free", "paid"].includes(plan)) {
			throw new InvalidPlanException(plan);
		}

		const user = await User.find(userId);
		if (!user) {
			throw new UserNotFoundException(userId);
		}

		const oldPlan = user.plan;
		user.plan = plan;
		await user.save();

		await AdminAction.create({
			adminId,
			actionType: plan === "paid" ? "user_upgrade" : "user_downgrade",
			targetType: "user",
			targetId: user.id,
			metadata: { oldPlan, newPlan: plan },
		});

		return { id: user.id, plan: user.plan };
	}

	/**
	 * Update user admin status (promote/demote).
	 *
	 * @param adminId - ID of the admin performing the action
	 * @param userId - ID of the user to update
	 * @param isAdmin - Whether user should be admin
	 * @returns Updated user data
	 * @throws {CannotModifyOwnAdminStatusException} When trying to modify own status
	 * @throws {UserNotFoundException} When user is not found
	 *
	 * @example
	 * ```typescript
	 * // Promote user to admin
	 * await adminUserService.updateAdminStatus(adminId, userId, true);
	 *
	 * // Demote admin to user
	 * await adminUserService.updateAdminStatus(adminId, userId, false);
	 * ```
	 */
	async updateAdminStatus(
		adminId: string,
		userId: string,
		isAdmin: boolean,
	): Promise<{ id: string; role: string }> {
		if (userId === adminId) {
			throw new CannotModifyOwnAdminStatusException();
		}

		const user = await User.find(userId);
		if (!user) {
			throw new UserNotFoundException(userId);
		}

		user.role = isAdmin ? "admin" : "user";
		await user.save();

		await AdminAction.create({
			adminId,
			actionType: isAdmin ? "user_promote_admin" : "user_demote_admin",
			targetType: "user",
			targetId: user.id,
		});

		return { id: user.id, role: user.role };
	}

	/**
	 * Block or unblock a user account.
	 *
	 * @param adminId - ID of the admin performing the action
	 * @param userId - ID of the user to update
	 * @param isBlocked - Whether user should be blocked
	 * @returns Updated user data
	 * @throws {CannotBlockOwnAccountException} When trying to block own account
	 * @throws {UserNotFoundException} When user is not found
	 *
	 * @example
	 * ```typescript
	 * // Block user
	 * await adminUserService.updateBlockStatus(adminId, userId, true);
	 *
	 * // Unblock user
	 * await adminUserService.updateBlockStatus(adminId, userId, false);
	 * ```
	 */
	async updateBlockStatus(
		adminId: string,
		userId: string,
		isBlocked: boolean,
	): Promise<{ id: string; isActive: boolean }> {
		if (userId === adminId) {
			throw new CannotBlockOwnAccountException();
		}

		const user = await User.find(userId);
		if (!user) {
			throw new UserNotFoundException(userId);
		}

		user.isActive = !isBlocked;
		await user.save();

		await AdminAction.create({
			adminId,
			actionType: isBlocked ? "user_block" : "user_unblock",
			targetType: "user",
			targetId: user.id,
		});

		return { id: user.id, isActive: user.isActive };
	}

	/**
	 * Delete a user account permanently.
	 *
	 * @param adminId - ID of the admin performing the action
	 * @param userId - ID of the user to delete
	 * @throws {CannotDeleteOwnAccountException} When trying to delete own account
	 * @throws {UserNotFoundException} When user is not found
	 *
	 * @example
	 * ```typescript
	 * await adminUserService.deleteUser(adminId, userId);
	 * ```
	 */
	async deleteUser(adminId: string, userId: string): Promise<void> {
		if (userId === adminId) {
			throw new CannotDeleteOwnAccountException();
		}

		const user = await User.find(userId);
		if (!user) {
			throw new UserNotFoundException(userId);
		}

		await AdminAction.create({
			adminId,
			actionType: "user_delete",
			targetType: "user",
			targetId: user.id,
			metadata: {
				deletedUserEmail: user.email,
				deletedUserName: user.fullName,
			},
		});

		await user.delete();
	}

	/**
	 * Find a user by their ID.
	 *
	 * @param userId - User's unique identifier
	 * @returns The user if found, null otherwise
	 */
	async findById(userId: string): Promise<User | null> {
		return User.find(userId);
	}

	/**
	 * Get all users ordered by creation date (newest first).
	 *
	 * @returns Array of all users
	 */
	async getAll(): Promise<User[]> {
		return User.query().orderBy("createdAt", "desc");
	}
}

export default new AdminUserService();

import type { HttpContext } from "@adonisjs/core/http";
import {
	CannotBlockOwnAccountException,
	CannotDeleteOwnAccountException,
	CannotModifyOwnAdminStatusException,
	InvalidPlanException,
	UserNotFoundException,
} from "#exceptions/index";
import adminUserService from "#services/admin_user_service";

export default class AdminUsersController {
	/**
	 * Update user plan (free/paid)
	 */
	async updatePlan({ auth, params, request, response }: HttpContext) {
		const admin = auth.user!;
		const plan = request.input("plan") as "free" | "paid";

		try {
			const result = await adminUserService.updatePlan(
				admin.id,
				params.id,
				plan,
			);
			return response.json({ success: true, user: result });
		} catch (error) {
			if (error instanceof UserNotFoundException) {
				return response.notFound({ error: error.message });
			}
			if (error instanceof InvalidPlanException) {
				return response.badRequest({ error: error.message });
			}
			throw error;
		}
	}

	/**
	 * Update user admin status
	 */
	async updateAdmin({ auth, params, request, response }: HttpContext) {
		const admin = auth.user!;
		const isAdmin = request.input("isAdmin") as boolean;

		try {
			const result = await adminUserService.updateAdminStatus(
				admin.id,
				params.id,
				isAdmin,
			);
			return response.json({ success: true, user: result });
		} catch (error) {
			if (error instanceof UserNotFoundException) {
				return response.notFound({ error: error.message });
			}
			if (error instanceof CannotModifyOwnAdminStatusException) {
				return response.forbidden({ error: error.message });
			}
			throw error;
		}
	}

	/**
	 * Block/unblock user
	 */
	async updateBlock({ auth, params, request, response }: HttpContext) {
		const admin = auth.user!;
		const isBlocked = request.input("isBlocked") as boolean;

		try {
			const result = await adminUserService.updateBlockStatus(
				admin.id,
				params.id,
				isBlocked,
			);
			return response.json({ success: true, user: result });
		} catch (error) {
			if (error instanceof UserNotFoundException) {
				return response.notFound({ error: error.message });
			}
			if (error instanceof CannotBlockOwnAccountException) {
				return response.forbidden({ error: error.message });
			}
			throw error;
		}
	}

	/**
	 * Delete user
	 */
	async destroy({ auth, params, response }: HttpContext) {
		const admin = auth.user!;

		try {
			await adminUserService.deleteUser(admin.id, params.id);
			return response.json({ success: true });
		} catch (error) {
			if (error instanceof UserNotFoundException) {
				return response.notFound({ error: error.message });
			}
			if (error instanceof CannotDeleteOwnAccountException) {
				return response.forbidden({ error: error.message });
			}
			throw error;
		}
	}
}

import type { HttpContext } from "@adonisjs/core/http";
import AdminAction from "#models/admin_action";
import User from "#models/user";

export default class AdminUsersController {
	/**
	 * Update user plan (free/paid)
	 */
	async updatePlan({ auth, params, request, response }: HttpContext) {
		const admin = auth.user!;
		const user = await User.findOrFail(params.id);
		const plan = request.input("plan") as "free" | "paid";

		if (!["free", "paid"].includes(plan)) {
			return response.badRequest({ error: "Invalid plan value" });
		}

		const oldPlan = user.plan;
		user.plan = plan;
		await user.save();

		// Log action
		await AdminAction.create({
			adminId: admin.id,
			actionType: plan === "paid" ? "user_upgrade" : "user_downgrade",
			targetType: "user",
			targetId: user.id,
			metadata: { oldPlan, newPlan: plan },
		});

		return response.json({ success: true, user: { id: user.id, plan: user.plan } });
	}

	/**
	 * Update user admin status
	 */
	async updateAdmin({ auth, params, request, response }: HttpContext) {
		const admin = auth.user!;
		const user = await User.findOrFail(params.id);
		const isAdmin = request.input("isAdmin") as boolean;

		// Prevent self-modification
		if (user.id === admin.id) {
			return response.badRequest({ error: "You cannot modify your own admin status" });
		}

		user.role = isAdmin ? "admin" : "user";
		await user.save();

		// Log action
		await AdminAction.create({
			adminId: admin.id,
			actionType: isAdmin ? "user_promote_admin" : "user_demote_admin",
			targetType: "user",
			targetId: user.id,
		});

		return response.json({ success: true, user: { id: user.id, role: user.role } });
	}

	/**
	 * Block/unblock user
	 */
	async updateBlock({ auth, params, request, response }: HttpContext) {
		const admin = auth.user!;
		const user = await User.findOrFail(params.id);
		const isBlocked = request.input("isBlocked") as boolean;

		// Prevent self-blocking
		if (user.id === admin.id) {
			return response.badRequest({ error: "You cannot block your own account" });
		}

		user.isActive = !isBlocked;
		await user.save();

		// Log action
		await AdminAction.create({
			adminId: admin.id,
			actionType: isBlocked ? "user_block" : "user_unblock",
			targetType: "user",
			targetId: user.id,
		});

		return response.json({ success: true, user: { id: user.id, isActive: user.isActive } });
	}

	/**
	 * Delete user
	 */
	async destroy({ auth, params, response }: HttpContext) {
		const admin = auth.user!;
		const user = await User.findOrFail(params.id);

		// Prevent self-deletion
		if (user.id === admin.id) {
			return response.badRequest({ error: "You cannot delete your own account" });
		}

		// Log action before deletion
		await AdminAction.create({
			adminId: admin.id,
			actionType: "user_delete",
			targetType: "user",
			targetId: user.id,
			metadata: { deletedUserEmail: user.email, deletedUserName: user.fullName },
		});

		await user.delete();

		return response.json({ success: true });
	}
}

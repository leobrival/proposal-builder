import logger from "@adonisjs/core/services/logger";
import type {
	AdminProposalUpdatedEventData,
	AdminUserUpdatedEventData,
} from "#events/index";
import { emitter } from "#events/index";

/**
 * Admin event listeners
 * Handles side effects for admin-related events
 */
export function registerAdminListeners(): void {
	/**
	 * Handle admin user updates
	 * - Log the admin action
	 * - Could send notification to affected user
	 */
	emitter.on("admin:user_updated", async (data: AdminUserUpdatedEventData) => {
		logger.info(
			{
				adminId: data.adminId,
				targetUserId: data.targetUserId,
				action: data.action,
				oldValue: data.oldValue,
				newValue: data.newValue,
			},
			"Admin updated user",
		);

		// TODO: Notify affected user
		// TODO: Track admin action analytics
	});

	/**
	 * Handle admin proposal updates
	 * - Log the admin action
	 * - Could notify proposal owner
	 */
	emitter.on(
		"admin:proposal_updated",
		async (data: AdminProposalUpdatedEventData) => {
			logger.info(
				{
					adminId: data.adminId,
					proposalId: data.proposalId,
					action: data.action,
					oldValue: data.oldValue,
					newValue: data.newValue,
				},
				"Admin updated proposal",
			);

			// TODO: Notify proposal owner
			// TODO: Track admin action analytics
		},
	);
}

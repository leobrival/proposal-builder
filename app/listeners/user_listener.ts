import logger from "@adonisjs/core/services/logger";
import type {
	UserDeletedEventData,
	UserLoggedInEventData,
	UserPasswordChangedEventData,
	UserProfileUpdatedEventData,
	UserRegisteredEventData,
} from "#events/index";
import { emitter } from "#events/index";

/**
 * User event listeners
 * Handles side effects for user-related events
 */
export function registerUserListeners(): void {
	/**
	 * Handle new user registration
	 * - Log the registration
	 * - Could send welcome email
	 * - Could trigger analytics
	 */
	emitter.on("user:registered", async (data: UserRegisteredEventData) => {
		logger.info(
			{ userId: data.user.id, email: data.user.email },
			"New user registered",
		);

		// TODO: Send welcome email
		// TODO: Track analytics event
	});

	/**
	 * Handle user login
	 * - Log the login attempt
	 * - Could update last login timestamp
	 */
	emitter.on("user:logged_in", async (data: UserLoggedInEventData) => {
		logger.info({ userId: data.user.id, ip: data.ipAddress }, "User logged in");

		// TODO: Update last login timestamp
		// TODO: Track analytics event
	});

	/**
	 * Handle profile updates
	 * - Log the changes
	 * - Could notify user of changes
	 */
	emitter.on(
		"user:profile_updated",
		async (data: UserProfileUpdatedEventData) => {
			logger.info(
				{ userId: data.user.id, changes: Object.keys(data.changes) },
				"User profile updated",
			);

			// TODO: Send notification if email changed
		},
	);

	/**
	 * Handle password changes
	 * - Log the change
	 * - Could send security notification
	 */
	emitter.on(
		"user:password_changed",
		async (data: UserPasswordChangedEventData) => {
			logger.info({ userId: data.user.id }, "User password changed");

			// TODO: Send security notification email
		},
	);

	/**
	 * Handle user deletion
	 * - Log the deletion
	 * - Could clean up related data
	 */
	emitter.on("user:deleted", async (data: UserDeletedEventData) => {
		logger.info(
			{ userId: data.userId, email: data.email },
			"User account deleted",
		);

		// TODO: Clean up user-related data
		// TODO: Send goodbye email
	});
}

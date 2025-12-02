import { BaseCommand, flags } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import { DateTime } from "luxon";
import PostHogSyncService from "#services/posthog_sync_service";

export default class SyncPosthog extends BaseCommand {
	static commandName = "sync:posthog";
	static description = "Synchronize session data from PostHog";

	static options: CommandOptions = {
		startApp: true,
	};

	@flags.number({
		description: "Number of days to sync (default: 7)",
		alias: "d",
	})
	declare days: number;

	@flags.string({
		description: "Start date (ISO format: YYYY-MM-DD)",
		alias: "s",
	})
	declare startDate: string;

	@flags.string({
		description: "End date (ISO format: YYYY-MM-DD)",
		alias: "e",
	})
	declare endDate: string;

	async run() {
		const service = new PostHogSyncService();

		// Check if PostHog is configured
		if (!service.isConfigured()) {
			this.logger.error(
				"PostHog is not configured. Please set POSTHOG_API_KEY and POSTHOG_PROJECT_ID environment variables.",
			);
			return;
		}

		let startDateTime: DateTime;
		let endDateTime: DateTime;

		if (this.startDate && this.endDate) {
			// Use custom date range
			startDateTime = DateTime.fromISO(this.startDate);
			endDateTime = DateTime.fromISO(this.endDate);

			if (!startDateTime.isValid || !endDateTime.isValid) {
				this.logger.error(
					"Invalid date format. Please use ISO format (YYYY-MM-DD)",
				);
				return;
			}
		} else {
			// Use days parameter (default: 7)
			const days = this.days || 7;
			endDateTime = DateTime.now();
			startDateTime = endDateTime.minus({ days });
		}

		this.logger.info(
			`Syncing PostHog sessions from ${startDateTime.toISODate()} to ${endDateTime.toISODate()}...`,
		);

		try {
			const result = await service.syncSessions(startDateTime, endDateTime);

			this.logger.success("Sync completed!");
			this.logger.info(`Created: ${result.created} sessions`);
			this.logger.info(`Updated: ${result.updated} sessions`);

			if (result.errors > 0) {
				this.logger.warning(`Errors: ${result.errors} sessions failed to sync`);
			}
		} catch (error) {
			this.logger.error(
				`Sync failed: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}

import { args, BaseCommand, flags } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import contentService from "#services/content_service";

export default class ChangelogAdd extends BaseCommand {
	static commandName = "changelog:add";
	static description = "Add a new entry to the changelog";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string({
		description: "Version number (e.g., 1.2.0)",
		required: true,
	})
	declare version: string;

	@flags.array({
		description: "Added features (can be specified multiple times)",
		alias: "a",
	})
	declare added: string[];

	@flags.array({
		description: "Changed features (can be specified multiple times)",
		alias: "c",
	})
	declare changed: string[];

	@flags.array({
		description: "Fixed bugs (can be specified multiple times)",
		alias: "f",
	})
	declare fixed: string[];

	@flags.array({
		description: "Removed features (can be specified multiple times)",
		alias: "r",
	})
	declare removed: string[];

	@flags.array({
		description: "Security updates (can be specified multiple times)",
		alias: "s",
	})
	declare security: string[];

	async run() {
		// Validate version format
		const versionRegex = /^\d+\.\d+\.\d+$/;
		if (!versionRegex.test(this.version)) {
			this.logger.error(
				"Invalid version format. Use semantic versioning (e.g., 1.2.0)",
			);
			return;
		}

		const changes = {
			added: this.added || [],
			changed: this.changed || [],
			fixed: this.fixed || [],
			removed: this.removed || [],
			security: this.security || [],
		};

		// Check if at least one change is provided
		const totalChanges =
			changes.added.length +
			changes.changed.length +
			changes.fixed.length +
			changes.removed.length +
			changes.security.length;

		if (totalChanges === 0) {
			this.logger.error(
				"At least one change must be provided. Use --added, --changed, --fixed, --removed, or --security",
			);
			return;
		}

		try {
			await contentService.addChangelogEntry(this.version, changes);

			this.logger.success(`Changelog entry added for version ${this.version}`);

			if (changes.added.length > 0) {
				this.logger.info(`Added: ${changes.added.length} item(s)`);
			}
			if (changes.changed.length > 0) {
				this.logger.info(`Changed: ${changes.changed.length} item(s)`);
			}
			if (changes.fixed.length > 0) {
				this.logger.info(`Fixed: ${changes.fixed.length} item(s)`);
			}
			if (changes.removed.length > 0) {
				this.logger.info(`Removed: ${changes.removed.length} item(s)`);
			}
			if (changes.security.length > 0) {
				this.logger.info(`Security: ${changes.security.length} item(s)`);
			}
		} catch (error) {
			this.logger.error(`Failed to add changelog entry: ${error}`);
		}
	}
}

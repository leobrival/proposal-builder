import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "proposals";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			// Page layout JSON structure for the web builder
			table.jsonb("page_layout").nullable();
		});

		// Create GIN index for efficient JSON queries
		this.schema.raw(
			"CREATE INDEX idx_proposals_page_layout ON proposals USING gin (page_layout)",
		);
	}

	async down() {
		// Drop the index first
		this.schema.raw("DROP INDEX IF EXISTS idx_proposals_page_layout");

		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("page_layout");
		});
	}
}

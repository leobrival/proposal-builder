import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "daily_metrics";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary();
			table.date("date").notNullable().unique();

			// User metrics
			table.integer("total_users").defaultTo(0).notNullable();
			table.integer("new_users").defaultTo(0).notNullable();
			table.integer("active_users").defaultTo(0).notNullable();

			// Proposal metrics
			table.integer("total_proposals").defaultTo(0).notNullable();
			table.integer("published_proposals").defaultTo(0).notNullable();
			table.integer("new_proposals").defaultTo(0).notNullable();

			// Lead metrics
			table.integer("total_leads").defaultTo(0).notNullable();
			table.integer("new_leads").defaultTo(0).notNullable();

			// Activation metrics
			table.decimal("activation_rate", 5, 2).defaultTo(0).notNullable();

			// Revenue metrics (placeholder for future Stripe integration)
			table.decimal("mrr", 10, 2).defaultTo(0).notNullable();
			table.integer("paying_users").defaultTo(0).notNullable();

			table.timestamp("created_at").notNullable();
			table.timestamp("updated_at").notNullable();

			// Index for date queries
			table.index(["date"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

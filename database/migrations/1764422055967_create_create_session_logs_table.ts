import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "session_logs";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary();

			// PostHog identifiers
			table.string("posthog_session_id").notNullable().unique();
			table.string("posthog_distinct_id").nullable();

			// User reference (nullable for anonymous sessions)
			table
				.uuid("user_id")
				.nullable()
				.references("id")
				.inTable("users")
				.onDelete("SET NULL");

			// Device information
			table.enum("device_type", ["desktop", "mobile", "tablet"]).notNullable();
			table.string("device_brand").nullable();
			table.string("device_model").nullable();

			// Browser information
			table.string("browser").notNullable();
			table.string("browser_version").nullable();

			// Operating system
			table.string("os").notNullable();
			table.string("os_version").nullable();

			// Geographic information
			table.string("country").nullable();
			table.string("country_code", 2).nullable();
			table.string("city").nullable();
			table.string("region").nullable();

			// Session metadata
			table.string("referrer").nullable();
			table.string("utm_source").nullable();
			table.string("utm_medium").nullable();
			table.string("utm_campaign").nullable();

			// Session timing
			table.timestamp("session_start").notNullable();
			table.timestamp("session_end").nullable();
			table.integer("duration_seconds").nullable();
			table.integer("pageview_count").defaultTo(1).notNullable();

			// Timestamps
			table.timestamp("created_at").notNullable();
			table.timestamp("updated_at").notNullable();

			// Indexes for analytics queries
			table.index(["session_start"]);
			table.index(["device_type"]);
			table.index(["browser"]);
			table.index(["os"]);
			table.index(["country_code"]);
			table.index(["user_id"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

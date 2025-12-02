import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "api_keys";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary();
			table
				.uuid("user_id")
				.notNullable()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");

			// Key identification
			table.string("name", 255).notNullable();
			table.string("key_hash", 64).notNullable().unique();
			table.string("key_prefix", 12).notNullable();

			// Permissions
			table.json("scopes").defaultTo("[]");

			// Usage tracking
			table.timestamp("last_used_at").nullable();
			table.integer("request_count").defaultTo(0);

			// Validity
			table.timestamp("expires_at").nullable();
			table.boolean("is_active").defaultTo(true);

			// Rate limiting
			table.integer("rate_limit").nullable();

			// Timestamps
			table.timestamp("created_at").notNullable();
			table.timestamp("updated_at").notNullable();

			// Indexes
			table.index(["user_id"]);
			table.index(["key_prefix"]);
			table.index(["is_active"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "admin_actions";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary();
			table
				.uuid("admin_id")
				.notNullable()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table.string("action_type", 50).notNullable(); // 'user_deactivate', 'user_activate', 'proposal_unpublish'
			table.string("target_type", 50).notNullable(); // 'user', 'proposal'
			table.uuid("target_id").notNullable();
			table.text("reason").nullable();
			table.jsonb("metadata").nullable();
			table.timestamp("created_at").notNullable();
			table.timestamp("updated_at").notNullable();

			// Indexes
			table.index(["admin_id"]);
			table.index(["target_type", "target_id"]);
			table.index(["action_type"]);
			table.index(["created_at"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "proposals";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary().defaultTo(this.raw("gen_random_uuid()"));
			table
				.uuid("user_id")
				.notNullable()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");
			table.string("title", 255).notNullable();
			table.string("slug", 255).notNullable().unique();
			table.text("description").nullable();
			table.string("project_name", 255).notNullable();
			table.text("project_description").nullable();
			table.string("logo_url", 500).nullable();
			table.string("cover_image_url", 500).nullable();
			table.string("contact_email", 255).notNullable();
			table.string("contact_phone", 50).nullable();
			table
				.enum("status", ["draft", "published", "archived"])
				.notNullable()
				.defaultTo("draft");
			table.timestamp("published_at", { useTz: true }).nullable();
			table.integer("view_count").notNullable().defaultTo(0);
			table.jsonb("design_settings").notNullable().defaultTo("{}");

			table.timestamp("created_at", { useTz: true }).notNullable();
			table.timestamp("updated_at", { useTz: true }).notNullable();

			table.index("user_id");
			table.index("status");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

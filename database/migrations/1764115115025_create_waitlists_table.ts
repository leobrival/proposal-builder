import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "waitlists";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary().defaultTo(this.raw("gen_random_uuid()"));
			table.string("email").notNullable().unique();
			table.string("creator_type").nullable();
			table.string("source").nullable();
			table.string("referrer").nullable();
			table.timestamp("created_at").notNullable();
			table.timestamp("updated_at").notNullable();
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

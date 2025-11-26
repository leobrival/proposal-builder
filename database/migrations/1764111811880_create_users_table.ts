import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary().defaultTo(this.raw("gen_random_uuid()"));
			table.string("full_name", 255).notNullable();
			table.string("email", 254).notNullable().unique();
			table.string("password", 255).notNullable();
			table.string("remember_me_token", 255).nullable();

			table.timestamp("created_at", { useTz: true }).notNullable();
			table.timestamp("updated_at", { useTz: true }).notNullable();
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

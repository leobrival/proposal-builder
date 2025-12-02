import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.enum("role", ["user", "admin"]).defaultTo("user").notNullable();
			table.boolean("is_active").defaultTo(true).notNullable();
			table.timestamp("last_login_at").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("role");
			table.dropColumn("is_active");
			table.dropColumn("last_login_at");
		});
	}
}

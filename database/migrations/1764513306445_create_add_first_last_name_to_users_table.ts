import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "users";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string("first_name", 255).nullable();
			table.string("last_name", 255).nullable();
		});

		// Migrate existing fullName data to first_name and last_name
		this.defer(async (db) => {
			const users = await db.from("users").select("id", "full_name");

			for (const user of users) {
				if (user.full_name) {
					const nameParts = user.full_name.trim().split(/\s+/);
					const firstName = nameParts[0] || "";
					const lastName = nameParts.slice(1).join(" ") || "";

					await db.from("users").where("id", user.id).update({
						first_name: firstName,
						last_name: lastName,
					});
				}
			}
		});

		// Make columns not nullable after data migration
		this.schema.alterTable(this.tableName, (table) => {
			table.string("first_name", 255).notNullable().alter();
			table.string("last_name", 255).notNullable().alter();
		});

		// Drop full_name column
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("full_name");
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.string("full_name", 255).nullable();
		});

		// Restore fullName from first_name and last_name
		this.defer(async (db) => {
			const users = await db
				.from("users")
				.select("id", "first_name", "last_name");

			for (const user of users) {
				const fullName = [user.first_name, user.last_name]
					.filter(Boolean)
					.join(" ");
				await db.from("users").where("id", user.id).update({
					full_name: fullName,
				});
			}
		});

		this.schema.alterTable(this.tableName, (table) => {
			table.string("full_name", 255).notNullable().alter();
			table.dropColumn("first_name");
			table.dropColumn("last_name");
		});
	}
}

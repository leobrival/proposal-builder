import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "benefits";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary().defaultTo(this.raw("gen_random_uuid()"));
			table
				.uuid("tier_id")
				.notNullable()
				.references("id")
				.inTable("tiers")
				.onDelete("CASCADE");
			table.string("description", 500).notNullable();
			table.integer("position").notNullable().defaultTo(0);

			table.timestamp("created_at", { useTz: true }).notNullable();
			table.timestamp("updated_at", { useTz: true }).notNullable();

			table.index("tier_id");
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

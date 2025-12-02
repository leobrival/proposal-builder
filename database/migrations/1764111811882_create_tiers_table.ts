import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "tiers";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary().defaultTo(this.raw("gen_random_uuid()"));
			table
				.uuid("proposal_id")
				.notNullable()
				.references("id")
				.inTable("proposals")
				.onDelete("CASCADE");
			table.string("name", 255).notNullable();
			table.decimal("price", 10, 2).notNullable();
			table.string("currency", 3).notNullable().defaultTo("EUR");
			table.text("description").nullable();
			table.boolean("is_featured").notNullable().defaultTo(false);
			table.integer("max_sponsors").nullable();
			table.integer("position").notNullable().defaultTo(0);

			table.timestamp("created_at", { useTz: true }).notNullable();
			table.timestamp("updated_at", { useTz: true }).notNullable();

			table.index("proposal_id");
			table.index(["proposal_id", "position"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

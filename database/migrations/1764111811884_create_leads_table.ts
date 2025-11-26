import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "leads";

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
			table.string("email", 255).notNullable();
			table.string("company", 255).nullable();
			table.string("phone", 50).nullable();
			table.text("message").nullable();
			table
				.uuid("interested_tier_id")
				.nullable()
				.references("id")
				.inTable("tiers")
				.onDelete("SET NULL");
			table
				.enum("status", [
					"new",
					"contacted",
					"pending",
					"converted",
					"rejected",
				])
				.notNullable()
				.defaultTo("new");
			table.text("notes").nullable();

			table.timestamp("created_at", { useTz: true }).notNullable();
			table.timestamp("updated_at", { useTz: true }).notNullable();

			table.index("proposal_id");
			table.index("status");
			table.index(["email", "proposal_id"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

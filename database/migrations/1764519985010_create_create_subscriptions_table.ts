import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "subscriptions";

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.uuid("id").primary().defaultTo(this.raw("gen_random_uuid()"));
			table
				.uuid("user_id")
				.notNullable()
				.references("id")
				.inTable("users")
				.onDelete("CASCADE");

			// Provider information
			table.string("provider", 50).notNullable(); // 'lemonsqueezy' or 'stripe'
			table.string("provider_subscription_id", 255).notNullable().unique();
			table.string("provider_customer_id", 255).nullable();

			// Subscription details
			table.string("plan", 50).notNullable().defaultTo("pro"); // 'pro', 'enterprise'
			table.string("status", 50).notNullable().defaultTo("active"); // 'active', 'cancelled', 'expired', 'past_due', 'paused', 'trialing', 'unpaid'
			table.string("billing_interval", 20).notNullable().defaultTo("monthly"); // 'monthly', 'yearly'

			// Period information
			table.timestamp("current_period_start").nullable();
			table.timestamp("current_period_end").nullable();
			table.timestamp("trial_ends_at").nullable();

			// Cancellation
			table.boolean("cancel_at_period_end").notNullable().defaultTo(false);
			table.timestamp("cancelled_at").nullable();

			// Metadata (for provider-specific data)
			table.jsonb("metadata").nullable();

			// Timestamps
			table.timestamp("created_at").notNullable();
			table.timestamp("updated_at").notNullable();
		});

		// Indexes
		this.schema.alterTable(this.tableName, (table) => {
			table.index(["user_id"]);
			table.index(["status"]);
			table.index(["provider", "provider_subscription_id"]);
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}

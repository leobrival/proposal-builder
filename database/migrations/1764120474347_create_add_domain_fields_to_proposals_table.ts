import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "proposals";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			// Subdomain for free tier (e.g., "techtalks" -> techtalks.sponseasy.com)
			table.string("subdomain", 63).nullable().unique();

			// Custom domain for premium (e.g., "sponsors.mysite.com")
			table.string("custom_domain", 255).nullable().unique();

			// Domain verification status
			table
				.enum("domain_status", ["pending", "verifying", "verified", "failed"])
				.defaultTo("pending");

			// DNS verification token (for TXT record verification)
			table.string("domain_verification_token", 64).nullable();

			// SSL certificate status
			table
				.enum("ssl_status", ["none", "pending", "active", "failed"])
				.defaultTo("none");

			// Last DNS check timestamp
			table.timestamp("domain_verified_at").nullable();
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("subdomain");
			table.dropColumn("custom_domain");
			table.dropColumn("domain_status");
			table.dropColumn("domain_verification_token");
			table.dropColumn("ssl_status");
			table.dropColumn("domain_verified_at");
		});
	}
}

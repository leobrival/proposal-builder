import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	protected tableName = "proposals";

	async up() {
		this.schema.alterTable(this.tableName, (table) => {
			// Event date and time
			table.timestamp("event_start_date", { useTz: true }).nullable();
			table.timestamp("event_end_date", { useTz: true }).nullable();

			// Event location
			table.string("event_venue_name", 255).nullable();
			table.text("event_address").nullable();
			table.string("event_city", 100).nullable();
			table.string("event_country", 100).nullable();
			table.decimal("event_latitude", 10, 7).nullable();
			table.decimal("event_longitude", 10, 7).nullable();

			// Event metadata
			table.string("event_category", 100).nullable();
			table.jsonb("event_tags").nullable().defaultTo("[]");
			table.string("event_source_url", 500).nullable();
			table.string("event_source_platform", 50).nullable(); // eventbrite, meetup, etc.
			table.string("event_external_id", 100).nullable(); // ID from source platform

			// Organizer info (can be different from user)
			table.string("organizer_name", 255).nullable();
			table.string("organizer_website", 500).nullable();

			// Event format
			table.enum("event_format", ["in_person", "online", "hybrid"]).nullable();
			table.integer("event_expected_attendees").nullable();

			// Indexes
			table.index("event_start_date");
			table.index("event_city");
			table.index("event_source_platform");
		});
	}

	async down() {
		this.schema.alterTable(this.tableName, (table) => {
			table.dropColumn("event_start_date");
			table.dropColumn("event_end_date");
			table.dropColumn("event_venue_name");
			table.dropColumn("event_address");
			table.dropColumn("event_city");
			table.dropColumn("event_country");
			table.dropColumn("event_latitude");
			table.dropColumn("event_longitude");
			table.dropColumn("event_category");
			table.dropColumn("event_tags");
			table.dropColumn("event_source_url");
			table.dropColumn("event_source_platform");
			table.dropColumn("event_external_id");
			table.dropColumn("organizer_name");
			table.dropColumn("organizer_website");
			table.dropColumn("event_format");
			table.dropColumn("event_expected_attendees");
		});
	}
}

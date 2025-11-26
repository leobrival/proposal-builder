import { BaseModel, column } from "@adonisjs/lucid/orm";
import type { DateTime } from "luxon";

export default class Waitlist extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare email: string;

	@column()
	declare creatorType: string | null;

	@column()
	declare source: string | null;

	@column()
	declare referrer: string | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}

import { randomUUID } from "node:crypto";
import {
	BaseModel,
	beforeCreate,
	belongsTo,
	column,
} from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Tier from "./tier.js";

export default class Benefit extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare tierId: string;

	@column()
	declare description: string;

	@column()
	declare position: number;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => Tier)
	declare tier: BelongsTo<typeof Tier>;

	@beforeCreate()
	static assignDefaults(benefit: Benefit) {
		if (!benefit.id) {
			benefit.id = randomUUID();
		}
		if (benefit.position === undefined) {
			benefit.position = 0;
		}
	}
}

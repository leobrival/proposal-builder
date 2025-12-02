import { randomUUID } from "node:crypto";
import {
	BaseModel,
	beforeCreate,
	belongsTo,
	column,
	hasMany,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Benefit from "./benefit.js";
import Proposal from "./proposal.js";

export default class Tier extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare proposalId: string;

	@column()
	declare name: string;

	@column()
	declare price: number;

	@column()
	declare currency: string;

	@column()
	declare description: string | null;

	@column()
	declare isFeatured: boolean;

	@column()
	declare maxSponsors: number | null;

	@column()
	declare position: number;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => Proposal)
	declare proposal: BelongsTo<typeof Proposal>;

	@hasMany(() => Benefit)
	declare benefits: HasMany<typeof Benefit>;

	@beforeCreate()
	static assignDefaults(tier: Tier) {
		if (!tier.id) {
			tier.id = randomUUID();
		}
		if (tier.currency === undefined) {
			tier.currency = "EUR";
		}
		if (tier.isFeatured === undefined) {
			tier.isFeatured = false;
		}
		if (tier.position === undefined) {
			tier.position = 0;
		}
	}
}

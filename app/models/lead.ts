import { randomUUID } from "node:crypto";
import {
	BaseModel,
	beforeCreate,
	belongsTo,
	column,
} from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import Proposal from "./proposal.js";
import Tier from "./tier.js";

export type LeadStatus =
	| "new"
	| "contacted"
	| "pending"
	| "converted"
	| "rejected";

export default class Lead extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare proposalId: string;

	@column()
	declare name: string;

	@column()
	declare email: string;

	@column()
	declare company: string | null;

	@column()
	declare phone: string | null;

	@column()
	declare message: string | null;

	@column()
	declare interestedTierId: string | null;

	@column()
	declare status: LeadStatus;

	@column()
	declare notes: string | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => Proposal)
	declare proposal: BelongsTo<typeof Proposal>;

	@belongsTo(() => Tier, { foreignKey: "interestedTierId" })
	declare interestedTier: BelongsTo<typeof Tier>;

	@beforeCreate()
	static assignDefaults(lead: Lead) {
		if (!lead.id) {
			lead.id = randomUUID();
		}
		if (!lead.status) {
			lead.status = "new";
		}
	}
}

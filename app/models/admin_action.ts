import { randomUUID } from "node:crypto";
import {
	BaseModel,
	beforeCreate,
	belongsTo,
	column,
} from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import User from "./user.js";

export type AdminActionType =
	| "user_deactivate"
	| "user_activate"
	| "user_upgrade"
	| "user_downgrade"
	| "user_promote_admin"
	| "user_demote_admin"
	| "user_block"
	| "user_unblock"
	| "user_delete"
	| "proposal_unpublish"
	| "proposal_publish"
	| "proposal_archive"
	| "proposal_restore"
	| "proposal_status_change"
	| "proposal_delete";

export type AdminTargetType = "user" | "proposal";

export default class AdminAction extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare adminId: string;

	@column()
	declare actionType: AdminActionType;

	@column()
	declare targetType: AdminTargetType;

	@column()
	declare targetId: string;

	@column()
	declare reason: string | null;

	@column()
	declare metadata: Record<string, unknown> | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => User, { foreignKey: "adminId" })
	declare admin: BelongsTo<typeof User>;

	@beforeCreate()
	static assignId(action: AdminAction) {
		if (!action.id) {
			action.id = randomUUID();
		}
	}
}

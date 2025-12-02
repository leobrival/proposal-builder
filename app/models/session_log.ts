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

export type DeviceType = "desktop" | "mobile" | "tablet";

export default class SessionLog extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	// PostHog identifiers
	@column()
	declare posthogSessionId: string;

	@column()
	declare posthogDistinctId: string | null;

	// User reference
	@column()
	declare userId: string | null;

	// Device information
	@column()
	declare deviceType: DeviceType;

	@column()
	declare deviceBrand: string | null;

	@column()
	declare deviceModel: string | null;

	// Browser information
	@column()
	declare browser: string;

	@column()
	declare browserVersion: string | null;

	// Operating system
	@column()
	declare os: string;

	@column()
	declare osVersion: string | null;

	// Geographic information
	@column()
	declare country: string | null;

	@column()
	declare countryCode: string | null;

	@column()
	declare city: string | null;

	@column()
	declare region: string | null;

	// Session metadata
	@column()
	declare referrer: string | null;

	@column()
	declare utmSource: string | null;

	@column()
	declare utmMedium: string | null;

	@column()
	declare utmCampaign: string | null;

	// Session timing
	@column.dateTime()
	declare sessionStart: DateTime;

	@column.dateTime()
	declare sessionEnd: DateTime | null;

	@column()
	declare durationSeconds: number | null;

	@column()
	declare pageviewCount: number;

	// Timestamps
	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	// Relationships
	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@beforeCreate()
	static assignId(sessionLog: SessionLog) {
		if (!sessionLog.id) {
			sessionLog.id = randomUUID();
		}
	}
}

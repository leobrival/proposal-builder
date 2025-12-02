import { randomUUID } from "node:crypto";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import { compose } from "@adonisjs/core/helpers";
import hash from "@adonisjs/core/services/hash";
import {
	afterCreate,
	afterDelete,
	afterUpdate,
	BaseModel,
	beforeCreate,
	column,
	computed,
	hasMany,
} from "@adonisjs/lucid/orm";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import MetricsCacheService from "#services/metrics_cache_service";
import Proposal from "./proposal.js";

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
	uids: ["email"],
	passwordColumnName: "password",
});

export type UserRole = "user" | "admin";
export type UserPlan = "free" | "paid";

export default class User extends compose(BaseModel, AuthFinder) {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare firstName: string;

	@column()
	declare lastName: string;

	@column()
	declare email: string;

	@column({ serializeAs: null })
	declare password: string;

	@column()
	declare role: UserRole;

	@column()
	declare plan: UserPlan;

	@column()
	declare isActive: boolean;

	@column()
	declare rememberMeToken: string | null;

	@column.dateTime()
	declare lastLoginAt: DateTime | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@hasMany(() => Proposal)
	declare proposals: HasMany<typeof Proposal>;

	@computed()
	get fullName(): string {
		return [this.firstName, this.lastName].filter(Boolean).join(" ");
	}

	@beforeCreate()
	static assignId(user: User) {
		if (!user.id) {
			user.id = randomUUID();
		}
	}

	@afterCreate()
	@afterUpdate()
	@afterDelete()
	static async invalidateMetricsCache() {
		await MetricsCacheService.invalidateUsers();
	}

	get isAdmin(): boolean {
		return this.role === "admin";
	}
}

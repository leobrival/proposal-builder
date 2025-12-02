import { randomUUID } from "node:crypto";
import string from "@adonisjs/core/helpers/string";
import {
	afterCreate,
	afterDelete,
	afterUpdate,
	BaseModel,
	beforeCreate,
	belongsTo,
	column,
	hasMany,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import type { DateTime } from "luxon";
import MetricsCacheService from "#services/metrics_cache_service";
import Lead from "./lead.js";
import Tier from "./tier.js";
import User from "./user.js";

export type ProposalStatus = "draft" | "published" | "archived";
export type DomainStatus = "pending" | "verifying" | "verified" | "failed";
export type SslStatus = "none" | "pending" | "active" | "failed";
export type EventFormat = "in_person" | "online" | "hybrid";

export interface DesignSettings {
	primaryColor: string;
	secondaryColor: string;
	fontFamily: string;
	logoPosition: "left" | "center" | "right";
	layout: "modern" | "classic" | "minimal";
}

export const defaultDesignSettings: DesignSettings = {
	primaryColor: "#3B82F6",
	secondaryColor: "#1E40AF",
	fontFamily: "Inter",
	logoPosition: "left",
	layout: "modern",
};

export default class Proposal extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare userId: string;

	@column()
	declare title: string;

	@column()
	declare slug: string;

	@column()
	declare description: string | null;

	@column()
	declare projectName: string;

	@column()
	declare projectDescription: string | null;

	@column()
	declare logoUrl: string | null;

	@column()
	declare coverImageUrl: string | null;

	@column()
	declare contactEmail: string;

	@column()
	declare contactPhone: string | null;

	@column()
	declare status: ProposalStatus;

	@column.dateTime()
	declare publishedAt: DateTime | null;

	@column()
	declare viewCount: number;

	@column()
	declare designSettings: DesignSettings;

	// Domain settings
	@column()
	declare subdomain: string | null;

	@column()
	declare customDomain: string | null;

	@column()
	declare domainStatus: DomainStatus;

	@column()
	declare domainVerificationToken: string | null;

	@column()
	declare sslStatus: SslStatus;

	@column.dateTime()
	declare domainVerifiedAt: DateTime | null;

	// Event date and time
	@column.dateTime()
	declare eventStartDate: DateTime | null;

	@column.dateTime()
	declare eventEndDate: DateTime | null;

	// Event location
	@column()
	declare eventVenueName: string | null;

	@column()
	declare eventAddress: string | null;

	@column()
	declare eventCity: string | null;

	@column()
	declare eventCountry: string | null;

	@column()
	declare eventLatitude: number | null;

	@column()
	declare eventLongitude: number | null;

	// Event metadata
	@column()
	declare eventCategory: string | null;

	@column({
		prepare: (value: string[]) => JSON.stringify(value || []),
		consume: (value: string) =>
			typeof value === "string" ? JSON.parse(value) : value || [],
	})
	declare eventTags: string[];

	@column()
	declare eventSourceUrl: string | null;

	@column()
	declare eventSourcePlatform: string | null;

	@column()
	declare eventExternalId: string | null;

	// Organizer info
	@column()
	declare organizerName: string | null;

	@column()
	declare organizerWebsite: string | null;

	// Event format
	@column()
	declare eventFormat: EventFormat | null;

	@column()
	declare eventExpectedAttendees: number | null;

	// Page layout for web builder (JSONB)
	@column({
		prepare: (value: unknown) => (value ? JSON.stringify(value) : null),
		consume: (value: string | Record<string, unknown> | null) => {
			if (!value) return null;
			if (typeof value === "string") {
				try {
					return JSON.parse(value);
				} catch {
					return null;
				}
			}
			return value;
		},
	})
	declare pageLayout: Record<string, unknown> | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@hasMany(() => Tier)
	declare tiers: HasMany<typeof Tier>;

	@hasMany(() => Lead)
	declare leads: HasMany<typeof Lead>;

	@beforeCreate()
	static assignIdAndSlug(proposal: Proposal) {
		if (!proposal.id) {
			proposal.id = randomUUID();
		}
		if (!proposal.slug) {
			const baseSlug = string.slug(proposal.title, { lower: true });
			proposal.slug = `${baseSlug}-${randomUUID().slice(0, 8)}`;
		}
		if (!proposal.status) {
			proposal.status = "draft";
		}
		if (!proposal.viewCount) {
			proposal.viewCount = 0;
		}
		if (!proposal.designSettings) {
			proposal.designSettings = defaultDesignSettings;
		}
	}

	@afterCreate()
	@afterUpdate()
	@afterDelete()
	static async invalidateMetricsCache() {
		await MetricsCacheService.invalidateProposals();
	}
}

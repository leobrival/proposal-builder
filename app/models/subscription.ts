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

/**
 * Subscription model
 * Stores user subscription information for payment providers.
 */
export default class Subscription extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare userId: string;

	// Provider information
	@column()
	declare provider: string; // 'lemonsqueezy' or 'stripe'

	@column()
	declare providerSubscriptionId: string;

	@column()
	declare providerCustomerId: string | null;

	// Subscription details
	@column()
	declare plan: string; // 'pro', 'enterprise'

	@column()
	declare status: string; // 'active', 'cancelled', 'expired', 'past_due', 'paused', 'trialing', 'unpaid'

	@column()
	declare billingInterval: string; // 'monthly', 'yearly'

	// Period information
	@column.dateTime()
	declare currentPeriodStart: DateTime;

	@column.dateTime()
	declare currentPeriodEnd: DateTime;

	@column.dateTime()
	declare trialEndsAt: DateTime | null;

	// Cancellation
	@column()
	declare cancelAtPeriodEnd: boolean;

	@column.dateTime()
	declare cancelledAt: DateTime | null;

	// Metadata
	@column({
		prepare: (value: Record<string, unknown> | null) =>
			value ? JSON.stringify(value) : null,
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
	declare metadata: Record<string, unknown> | null;

	// Timestamps
	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	// Relationships
	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@beforeCreate()
	static assignId(subscription: Subscription) {
		if (!subscription.id) {
			subscription.id = randomUUID();
		}
	}

	/**
	 * Check if subscription is active
	 */
	get isActive(): boolean {
		return ["active", "trialing"].includes(this.status);
	}

	/**
	 * Check if subscription is in trial
	 */
	get isTrialing(): boolean {
		return this.status === "trialing";
	}

	/**
	 * Check if subscription is cancelled
	 */
	get isCancelled(): boolean {
		return this.status === "cancelled" || this.cancelAtPeriodEnd;
	}

	/**
	 * Check if subscription is past due
	 */
	get isPastDue(): boolean {
		return this.status === "past_due";
	}
}

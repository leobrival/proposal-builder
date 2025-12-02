import { randomBytes, createHash } from "node:crypto";
import { DateTime } from "luxon";
import { BaseModel, beforeCreate, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import User from "./user.js";

/**
 * API Key model
 * Stores API keys for MCP server authentication.
 */
export default class ApiKey extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column()
	declare userId: string;

	/**
	 * Human-readable name/label for the API key
	 */
	@column()
	declare name: string;

	/**
	 * Hashed API key (never store plain text)
	 */
	@column()
	declare keyHash: string;

	/**
	 * Key prefix for identification (first 8 chars)
	 * Format: sk_xxxx...
	 */
	@column()
	declare keyPrefix: string;

	/**
	 * Scopes/permissions for this key
	 * e.g., ["proposals:read", "proposals:write"]
	 */
	@column({
		prepare: (value: string[] | null) =>
			value ? JSON.stringify(value) : null,
		consume: (value: string | string[] | null) => {
			if (!value) return [];
			if (typeof value === "string") {
				try {
					return JSON.parse(value) as string[];
				} catch {
					return [];
				}
			}
			return value;
		},
	})
	declare scopes: string[];

	/**
	 * Last time this key was used
	 */
	@column.dateTime()
	declare lastUsedAt: DateTime | null;

	/**
	 * Number of requests made with this key
	 */
	@column()
	declare requestCount: number;

	/**
	 * Expiration date (null = never expires)
	 */
	@column.dateTime()
	declare expiresAt: DateTime | null;

	/**
	 * Whether the key is active
	 */
	@column()
	declare isActive: boolean;

	/**
	 * Rate limit override (requests per minute)
	 * null = use plan default
	 */
	@column()
	declare rateLimit: number | null;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	// Relationships
	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;

	@beforeCreate()
	static assignId(apiKey: ApiKey) {
		if (!apiKey.id) {
			apiKey.id = crypto.randomUUID();
		}
		if (apiKey.requestCount === undefined) {
			apiKey.requestCount = 0;
		}
		if (apiKey.isActive === undefined) {
			apiKey.isActive = true;
		}
	}

	/**
	 * Generate a new API key
	 * Returns the plain text key (only shown once)
	 */
	static generateKey(): { plainKey: string; hash: string; prefix: string } {
		const rawKey = randomBytes(32).toString("hex");
		const plainKey = `sk_${rawKey}`;
		const hash = createHash("sha256").update(plainKey).digest("hex");
		const prefix = plainKey.substring(0, 12);

		return { plainKey, hash, prefix };
	}

	/**
	 * Hash a plain text key for comparison
	 */
	static hashKey(plainKey: string): string {
		return createHash("sha256").update(plainKey).digest("hex");
	}

	/**
	 * Verify a plain text key against this key's hash
	 */
	verify(plainKey: string): boolean {
		const hash = ApiKey.hashKey(plainKey);
		return hash === this.keyHash;
	}

	/**
	 * Check if the key is expired
	 */
	get isExpired(): boolean {
		if (!this.expiresAt) return false;
		return this.expiresAt < DateTime.now();
	}

	/**
	 * Check if the key is valid (active and not expired)
	 */
	get isValid(): boolean {
		return this.isActive && !this.isExpired;
	}

	/**
	 * Check if the key has a specific scope
	 */
	hasScope(scope: string): boolean {
		if (this.scopes.includes("*")) return true;
		if (this.scopes.includes(scope)) return true;

		// Check wildcard scopes (e.g., "proposals:*" matches "proposals:read")
		const [resource] = scope.split(":");
		return this.scopes.includes(`${resource}:*`);
	}

	/**
	 * Record usage of this key
	 */
	async recordUsage(): Promise<void> {
		this.lastUsedAt = DateTime.now();
		this.requestCount += 1;
		await this.save();
	}
}

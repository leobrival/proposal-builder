/**
 * MCP Service
 * Handles API key management and MCP access control.
 * MCP is accessible by ALL plans - uses PlanLimitsService for proposal creation limits.
 */

import cache from "@adonisjs/cache/services/main";
import { DateTime } from "luxon";
import {
	type ApiKeyResponse,
	type CreateApiKeyOptions,
	type McpAuthResult,
	type McpScope,
	McpServiceContract,
	type UsageStats,
} from "#contracts/mcp_service_contract";
import ApiKey from "#models/api_key";
import type User from "#models/user";
import planLimitsService from "#services/plan_limits_service";

/**
 * MCP Service Implementation
 * No rate limiting - MCP accessible by all plans
 */
class McpService extends McpServiceContract {
	/**
	 * Create a new API key
	 * Uses PlanLimitsService to check if user can create more keys
	 */
	async createApiKey(
		user: User,
		options: CreateApiKeyOptions,
	): Promise<ApiKeyResponse> {
		// Check API key limit from centralized service
		const limitCheck = await planLimitsService.canCreateApiKey(user);

		if (!limitCheck.allowed) {
			throw new Error(
				limitCheck.message ||
					`Limite de clés API atteinte (${limitCheck.limit})`,
			);
		}

		// Default scopes - all users get full access
		const scopes = options.scopes || [
			"proposals:read",
			"proposals:write",
			"proposals:publish",
			"user:read",
		];

		// Generate key
		const { plainKey, hash, prefix } = ApiKey.generateKey();

		// Create API key
		const apiKey = await ApiKey.create({
			userId: user.id,
			name: options.name,
			keyHash: hash,
			keyPrefix: prefix,
			scopes,
			expiresAt: options.expiresAt
				? DateTime.fromJSDate(options.expiresAt)
				: null,
			isActive: true,
			requestCount: 0,
		});

		return {
			id: apiKey.id,
			name: apiKey.name,
			keyPrefix: apiKey.keyPrefix,
			scopes: apiKey.scopes,
			lastUsedAt: apiKey.lastUsedAt?.toJSDate() ?? null,
			requestCount: apiKey.requestCount,
			expiresAt: apiKey.expiresAt?.toJSDate() ?? null,
			isActive: apiKey.isActive,
			createdAt: apiKey.createdAt.toJSDate(),
			plainKey, // Only returned on creation
		};
	}

	/**
	 * List user's API keys
	 */
	async listApiKeys(user: User): Promise<ApiKeyResponse[]> {
		const keys = await ApiKey.query()
			.where("userId", user.id)
			.orderBy("createdAt", "desc");

		return keys.map((key) => this.mapApiKeyResponse(key));
	}

	/**
	 * Get a specific API key
	 */
	async getApiKey(user: User, keyId: string): Promise<ApiKeyResponse | null> {
		const key = await ApiKey.query()
			.where("id", keyId)
			.where("userId", user.id)
			.first();

		return key ? this.mapApiKeyResponse(key) : null;
	}

	/**
	 * Update an API key
	 */
	async updateApiKey(
		user: User,
		keyId: string,
		updates: Partial<CreateApiKeyOptions> & { isActive?: boolean },
	): Promise<ApiKeyResponse | null> {
		const key = await ApiKey.query()
			.where("id", keyId)
			.where("userId", user.id)
			.first();

		if (!key) return null;

		if (updates.name !== undefined) {
			key.name = updates.name;
		}

		if (updates.scopes !== undefined) {
			key.scopes = updates.scopes;
		}

		if (updates.expiresAt !== undefined) {
			key.expiresAt = updates.expiresAt
				? DateTime.fromJSDate(updates.expiresAt)
				: null;
		}

		if (updates.isActive !== undefined) {
			key.isActive = updates.isActive;
		}

		await key.save();

		return this.mapApiKeyResponse(key);
	}

	/**
	 * Delete an API key
	 */
	async deleteApiKey(user: User, keyId: string): Promise<boolean> {
		const result = await ApiKey.query()
			.where("id", keyId)
			.where("userId", user.id)
			.delete();

		return result.length > 0;
	}

	/**
	 * Revoke all API keys for a user
	 */
	async revokeAllApiKeys(user: User): Promise<number> {
		const result = await ApiKey.query()
			.where("userId", user.id)
			.update({ isActive: false });

		return result.length;
	}

	/**
	 * Authenticate a request using API key
	 * No rate limiting - all plans can access MCP
	 */
	async authenticate(
		apiKeyString: string,
		requiredScope?: McpScope,
	): Promise<McpAuthResult> {
		if (!apiKeyString || !apiKeyString.startsWith("sk_")) {
			return {
				success: false,
				error: "Format de clé API invalide",
				errorCode: "INVALID_KEY",
			};
		}

		// Hash the key for lookup
		const keyHash = ApiKey.hashKey(apiKeyString);

		// Find the key
		const apiKey = await ApiKey.query()
			.where("keyHash", keyHash)
			.preload("user")
			.first();

		if (!apiKey) {
			return {
				success: false,
				error: "Clé API invalide",
				errorCode: "INVALID_KEY",
			};
		}

		// Check if active
		if (!apiKey.isActive) {
			return {
				success: false,
				error: "Clé API inactive",
				errorCode: "INACTIVE_KEY",
			};
		}

		// Check expiration
		if (apiKey.isExpired) {
			return {
				success: false,
				error: "Clé API expirée",
				errorCode: "EXPIRED_KEY",
			};
		}

		// Check scope
		if (requiredScope && !apiKey.hasScope(requiredScope)) {
			return {
				success: false,
				error: `Scope requis manquant: ${requiredScope}`,
				errorCode: "SCOPE_DENIED",
			};
		}

		return {
			success: true,
			user: apiKey.user,
			apiKey,
		};
	}

	/**
	 * Record API request (for statistics only, no rate limiting)
	 */
	async recordRequest(apiKey: ApiKey, endpoint: string): Promise<void> {
		const dayCacheKey = `usage:${apiKey.id}:day`;
		const endpointKey = `usage:${apiKey.id}:endpoints`;

		// Increment day counter
		const dayCount = (await cache.get<number>({ key: dayCacheKey })) ?? 0;
		await cache.set({ key: dayCacheKey, value: dayCount + 1, ttl: 86400 });

		// Track endpoint usage
		const endpoints =
			(await cache.get<Record<string, number>>({ key: endpointKey })) ?? {};
		endpoints[endpoint] = (endpoints[endpoint] ?? 0) + 1;
		await cache.set({ key: endpointKey, value: endpoints, ttl: 86400 });

		// Update API key usage
		await apiKey.recordUsage();
	}

	/**
	 * Get usage statistics for an API key
	 */
	async getUsageStats(apiKey: ApiKey): Promise<UsageStats> {
		const dayCacheKey = `usage:${apiKey.id}:day`;
		const endpointKey = `usage:${apiKey.id}:endpoints`;

		const requestsToday = (await cache.get<number>({ key: dayCacheKey })) ?? 0;
		const endpoints =
			(await cache.get<Record<string, number>>({ key: endpointKey })) ?? {};

		const topEndpoints = Object.entries(endpoints)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([endpoint, count]) => ({ endpoint, count }));

		return {
			totalRequests: apiKey.requestCount,
			requestsToday,
			lastRequestAt: apiKey.lastUsedAt?.toJSDate() ?? null,
			topEndpoints,
		};
	}

	/**
	 * Get usage statistics for a user
	 */
	async getUserUsageStats(user: User): Promise<UsageStats> {
		const keys = await ApiKey.query().where("userId", user.id);

		let totalRequests = 0;
		let requestsToday = 0;
		let lastRequestAt: Date | null = null;
		const allEndpoints: Record<string, number> = {};

		for (const key of keys) {
			const stats = await this.getUsageStats(key);
			totalRequests += stats.totalRequests;
			requestsToday += stats.requestsToday;

			if (
				stats.lastRequestAt &&
				(!lastRequestAt || stats.lastRequestAt > lastRequestAt)
			) {
				lastRequestAt = stats.lastRequestAt;
			}

			for (const { endpoint, count } of stats.topEndpoints) {
				allEndpoints[endpoint] = (allEndpoints[endpoint] ?? 0) + count;
			}
		}

		const topEndpoints = Object.entries(allEndpoints)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([endpoint, count]) => ({ endpoint, count }));

		return {
			totalRequests,
			requestsToday,
			lastRequestAt,
			topEndpoints,
		};
	}

	/**
	 * Check if user can create a proposal (delegates to PlanLimitsService)
	 */
	async canUserCreateProposal(user: User): Promise<{
		allowed: boolean;
		message?: string;
		current: number;
		limit: number;
	}> {
		const result = await planLimitsService.canCreateProposal(user);
		return {
			allowed: result.allowed,
			message: result.message,
			current: result.current,
			limit: result.limit,
		};
	}

	/**
	 * Get user's plan limits summary
	 */
	async getUserLimits(user: User) {
		const limits = planLimitsService.getPlanLimits(user);
		const usage = await planLimitsService.getUsageSummary(user);

		return {
			plan: limits.plan,
			proposals: {
				current: usage.proposals.current,
				limit: limits.maxProposals,
				remaining: usage.proposals.remaining,
				unlimited: planLimitsService.isUnlimited(limits.maxProposals),
			},
			apiKeys: {
				current: usage.apiKeys.current,
				limit: limits.maxApiKeys,
				remaining: usage.apiKeys.remaining,
				unlimited: planLimitsService.isUnlimited(limits.maxApiKeys),
			},
			features: {
				canRemoveBranding: limits.canRemoveBranding,
				hasAnalytics: limits.hasAnalytics,
				hasPrioritySupport: limits.hasPrioritySupport,
				hasCustomTemplates: limits.hasCustomTemplates,
				hasApiAccess: limits.hasApiAccess,
			},
		};
	}

	/**
	 * Map ApiKey model to response
	 */
	private mapApiKeyResponse(key: ApiKey): ApiKeyResponse {
		return {
			id: key.id,
			name: key.name,
			keyPrefix: key.keyPrefix,
			scopes: key.scopes,
			lastUsedAt: key.lastUsedAt?.toJSDate() ?? null,
			requestCount: key.requestCount,
			expiresAt: key.expiresAt?.toJSDate() ?? null,
			isActive: key.isActive,
			createdAt: key.createdAt.toJSDate(),
		};
	}
}

export default new McpService();

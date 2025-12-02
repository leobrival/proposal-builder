/**
 * MCP Service Contract
 * Defines the interface for MCP (Model Context Protocol) operations.
 * MCP is accessible by ALL plans - only proposal creation is limited.
 */

import type User from "#models/user";
import type ApiKey from "#models/api_key";

/**
 * Available MCP scopes
 */
export type McpScope =
	| "*"
	| "proposals:read"
	| "proposals:write"
	| "proposals:delete"
	| "proposals:publish"
	| "templates:read"
	| "analytics:read"
	| "user:read"
	| "user:write";

/**
 * API Key creation options
 */
export interface CreateApiKeyOptions {
	name: string;
	scopes?: McpScope[];
	expiresAt?: Date | null;
}

/**
 * API Key response (includes plain key only on creation)
 */
export interface ApiKeyResponse {
	id: string;
	name: string;
	keyPrefix: string;
	scopes: string[];
	lastUsedAt: Date | null;
	requestCount: number;
	expiresAt: Date | null;
	isActive: boolean;
	createdAt: Date;
	/** Plain key - only returned on creation */
	plainKey?: string;
}

/**
 * MCP authentication result
 */
export interface McpAuthResult {
	success: boolean;
	user?: User;
	apiKey?: ApiKey;
	error?: string;
	errorCode?: "INVALID_KEY" | "EXPIRED_KEY" | "INACTIVE_KEY" | "SCOPE_DENIED";
}

/**
 * Usage statistics
 */
export interface UsageStats {
	totalRequests: number;
	requestsToday: number;
	lastRequestAt: Date | null;
	topEndpoints: Array<{ endpoint: string; count: number }>;
}

/**
 * MCP Service Contract
 */
export abstract class McpServiceContract {
	/**
	 * Create a new API key
	 */
	abstract createApiKey(
		user: User,
		options: CreateApiKeyOptions
	): Promise<ApiKeyResponse>;

	/**
	 * List user's API keys
	 */
	abstract listApiKeys(user: User): Promise<ApiKeyResponse[]>;

	/**
	 * Get a specific API key
	 */
	abstract getApiKey(user: User, keyId: string): Promise<ApiKeyResponse | null>;

	/**
	 * Update an API key
	 */
	abstract updateApiKey(
		user: User,
		keyId: string,
		updates: Partial<CreateApiKeyOptions> & { isActive?: boolean }
	): Promise<ApiKeyResponse | null>;

	/**
	 * Delete an API key
	 */
	abstract deleteApiKey(user: User, keyId: string): Promise<boolean>;

	/**
	 * Revoke all API keys for a user
	 */
	abstract revokeAllApiKeys(user: User): Promise<number>;

	/**
	 * Authenticate a request using API key
	 */
	abstract authenticate(
		apiKey: string,
		requiredScope?: McpScope
	): Promise<McpAuthResult>;

	/**
	 * Record API request (for statistics only, not rate limiting)
	 */
	abstract recordRequest(apiKey: ApiKey, endpoint: string): Promise<void>;

	/**
	 * Get usage statistics for an API key
	 */
	abstract getUsageStats(apiKey: ApiKey): Promise<UsageStats>;

	/**
	 * Get usage statistics for a user
	 */
	abstract getUserUsageStats(user: User): Promise<UsageStats>;
}

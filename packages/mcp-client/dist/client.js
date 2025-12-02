/**
 * Spons Easy API Client
 * TypeScript client for interacting with the Spons Easy API.
 * MCP is accessible by ALL plans - no rate limiting.
 */
const DEFAULT_BASE_URL = "https://api.sponseasy.com";
const DEFAULT_TIMEOUT = 30000;
/**
 * Spons Easy API Client
 */
export class SponsEasyClient {
    apiKey;
    baseUrl;
    timeout;
    fetchImpl;
    constructor(config) {
        if (!config.apiKey) {
            throw new Error("API key is required");
        }
        if (!config.apiKey.startsWith("sk_")) {
            throw new Error("Invalid API key format. Must start with 'sk_'");
        }
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
        this.timeout = config.timeout || DEFAULT_TIMEOUT;
        this.fetchImpl = config.fetch || globalThis.fetch;
    }
    /**
     * Make an authenticated API request
     */
    async request(method, path, body) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
                method,
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const error = (await response.json());
                throw new SponsEasyError(error.error || "Request failed", error.code || "REQUEST_FAILED", response.status);
            }
            return response.json();
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof SponsEasyError) {
                throw error;
            }
            if (error instanceof Error && error.name === "AbortError") {
                throw new SponsEasyError("Request timed out", "TIMEOUT", 408);
            }
            throw new SponsEasyError(error instanceof Error ? error.message : "Unknown error", "NETWORK_ERROR", 0);
        }
    }
    // ==================== Proposals ====================
    /**
     * List all proposals
     */
    async listProposals(options) {
        const result = await this.request("POST", "/mcp/tools/list_proposals", options || {});
        return result.result;
    }
    /**
     * Get a specific proposal
     */
    async getProposal(id) {
        const result = await this.request("POST", "/mcp/tools/get_proposal", { id });
        return result.result;
    }
    /**
     * Create a new proposal
     * Note: Limited by plan (2 for free, 50 for pro, unlimited for enterprise)
     */
    async createProposal(input) {
        const result = await this.request("POST", "/mcp/tools/create_proposal", input);
        return result.result;
    }
    /**
     * Update a proposal
     */
    async updateProposal(id, input) {
        const result = await this.request("POST", "/mcp/tools/update_proposal", { id, ...input });
        return result.result;
    }
    /**
     * Delete a proposal
     */
    async deleteProposal(id) {
        const result = await this.request("POST", "/mcp/tools/delete_proposal", { id });
        return result.result;
    }
    /**
     * Publish a proposal
     */
    async publishProposal(id) {
        const result = await this.request("POST", "/mcp/tools/publish_proposal", { id });
        return result.result;
    }
    /**
     * Unpublish a proposal
     */
    async unpublishProposal(id) {
        const result = await this.request("POST", "/mcp/tools/unpublish_proposal", { id });
        return result.result;
    }
    // ==================== Analytics ====================
    /**
     * Get analytics
     */
    async getAnalytics(options) {
        const result = await this.request("POST", "/mcp/tools/get_analytics", options || {});
        return result.result;
    }
    // ==================== User & Limits ====================
    /**
     * Get current user information with plan limits
     */
    async getUser() {
        const result = await this.request("POST", "/mcp/tools/get_user", {});
        return result.result;
    }
    /**
     * Get current plan limits and usage
     */
    async getLimits() {
        const result = await this.request("POST", "/mcp/tools/get_limits", {});
        return result.result;
    }
    // ==================== MCP ====================
    /**
     * List available MCP tools
     */
    async listTools() {
        const result = await this.request("GET", "/mcp/tools");
        return result.tools;
    }
    /**
     * Execute a raw MCP tool
     */
    async executeTool(name, input = {}) {
        return this.request("POST", `/mcp/tools/${name}`, input);
    }
}
/**
 * Spons Easy API Error
 */
export class SponsEasyError extends Error {
    code;
    statusCode;
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = "SponsEasyError";
    }
    /**
     * Check if error is an authentication error
     */
    isAuthError() {
        return (this.code === "INVALID_KEY" ||
            this.code === "EXPIRED_KEY" ||
            this.code === "INACTIVE_KEY" ||
            this.statusCode === 401);
    }
    /**
     * Check if error is a permission error
     */
    isPermissionError() {
        return this.code === "SCOPE_DENIED" || this.statusCode === 403;
    }
    /**
     * Check if error is a limit exceeded error
     */
    isLimitExceeded() {
        return this.code === "LIMIT_EXCEEDED";
    }
    /**
     * Check if error is a not found error
     */
    isNotFound() {
        return this.code === "NOT_FOUND" || this.statusCode === 404;
    }
}
/**
 * Create a new Spons Easy client
 */
export function createClient(config) {
    return new SponsEasyClient(config);
}
//# sourceMappingURL=client.js.map
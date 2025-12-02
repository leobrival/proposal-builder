/**
 * Spons Easy API Client
 * TypeScript client for interacting with the Spons Easy API.
 * MCP is accessible by ALL plans - no rate limiting.
 */
import type { AnalyticsOptions, AnalyticsResponse, CreateProposalInput, ListProposalsOptions, ListProposalsResponse, McpTool, Proposal, SponsEasyConfig, ToolResult, UpdateProposalInput, User, UserLimitsResponse } from "./types.js";
/**
 * Spons Easy API Client
 */
export declare class SponsEasyClient {
    private apiKey;
    private baseUrl;
    private timeout;
    private fetchImpl;
    constructor(config: SponsEasyConfig);
    /**
     * Make an authenticated API request
     */
    private request;
    /**
     * List all proposals
     */
    listProposals(options?: ListProposalsOptions): Promise<ListProposalsResponse>;
    /**
     * Get a specific proposal
     */
    getProposal(id: string): Promise<Proposal>;
    /**
     * Create a new proposal
     * Note: Limited by plan (2 for free, 50 for pro, unlimited for enterprise)
     */
    createProposal(input: CreateProposalInput): Promise<Proposal>;
    /**
     * Update a proposal
     */
    updateProposal(id: string, input: UpdateProposalInput): Promise<Proposal>;
    /**
     * Delete a proposal
     */
    deleteProposal(id: string): Promise<{
        success: boolean;
    }>;
    /**
     * Publish a proposal
     */
    publishProposal(id: string): Promise<Proposal>;
    /**
     * Unpublish a proposal
     */
    unpublishProposal(id: string): Promise<Proposal>;
    /**
     * Get analytics
     */
    getAnalytics(options?: AnalyticsOptions): Promise<AnalyticsResponse>;
    /**
     * Get current user information with plan limits
     */
    getUser(): Promise<User>;
    /**
     * Get current plan limits and usage
     */
    getLimits(): Promise<UserLimitsResponse>;
    /**
     * List available MCP tools
     */
    listTools(): Promise<McpTool[]>;
    /**
     * Execute a raw MCP tool
     */
    executeTool<T = unknown>(name: string, input?: Record<string, unknown>): Promise<ToolResult<T>>;
}
/**
 * Spons Easy API Error
 */
export declare class SponsEasyError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode: number);
    /**
     * Check if error is an authentication error
     */
    isAuthError(): boolean;
    /**
     * Check if error is a permission error
     */
    isPermissionError(): boolean;
    /**
     * Check if error is a limit exceeded error
     */
    isLimitExceeded(): boolean;
    /**
     * Check if error is a not found error
     */
    isNotFound(): boolean;
}
/**
 * Create a new Spons Easy client
 */
export declare function createClient(config: SponsEasyConfig): SponsEasyClient;
//# sourceMappingURL=client.d.ts.map
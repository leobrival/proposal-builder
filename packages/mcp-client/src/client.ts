/**
 * Spons Easy API Client
 * TypeScript client for interacting with the Spons Easy API.
 * MCP is accessible by ALL plans - no rate limiting.
 */

import type {
	AnalyticsOptions,
	AnalyticsResponse,
	ApiError,
	BlogPost,
	ChangelogResponse,
	CreateProposalInput,
	DocPage,
	ListBlogOptions,
	ListBlogResponse,
	ListDocsOptions,
	ListDocsResponse,
	ListProposalsOptions,
	ListProposalsResponse,
	McpTool,
	Proposal,
	SearchDocsOptions,
	SearchDocsResponse,
	SponsEasyConfig,
	ToolResult,
	UpdateProposalInput,
	User,
	UserLimitsResponse,
} from "./types.js";

const DEFAULT_BASE_URL = "https://api.sponseasy.com";
const DEFAULT_TIMEOUT = 30000;

/**
 * Spons Easy API Client
 */
export class SponsEasyClient {
	private apiKey: string;
	private baseUrl: string;
	private timeout: number;
	private fetchImpl: typeof fetch;

	constructor(config: SponsEasyConfig) {
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
	private async request<T>(
		method: string,
		path: string,
		body?: unknown,
	): Promise<T> {
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
				const error = (await response.json()) as ApiError;
				throw new SponsEasyError(
					error.error || "Request failed",
					error.code || "REQUEST_FAILED",
					response.status,
				);
			}

			return response.json() as Promise<T>;
		} catch (error) {
			clearTimeout(timeoutId);

			if (error instanceof SponsEasyError) {
				throw error;
			}

			if (error instanceof Error && error.name === "AbortError") {
				throw new SponsEasyError("Request timed out", "TIMEOUT", 408);
			}

			throw new SponsEasyError(
				error instanceof Error ? error.message : "Unknown error",
				"NETWORK_ERROR",
				0,
			);
		}
	}

	// ==================== Proposals ====================

	/**
	 * List all proposals
	 */
	async listProposals(
		options?: ListProposalsOptions,
	): Promise<ListProposalsResponse> {
		const result = await this.request<ToolResult<ListProposalsResponse>>(
			"POST",
			"/mcp/tools/list_proposals",
			options || {},
		);
		return result.result;
	}

	/**
	 * Get a specific proposal
	 */
	async getProposal(id: string): Promise<Proposal> {
		const result = await this.request<ToolResult<Proposal>>(
			"POST",
			"/mcp/tools/get_proposal",
			{ id },
		);
		return result.result;
	}

	/**
	 * Create a new proposal
	 * Note: Limited by plan (2 for free, 50 for pro, unlimited for enterprise)
	 */
	async createProposal(input: CreateProposalInput): Promise<Proposal> {
		const result = await this.request<ToolResult<Proposal>>(
			"POST",
			"/mcp/tools/create_proposal",
			input,
		);
		return result.result;
	}

	/**
	 * Update a proposal
	 */
	async updateProposal(
		id: string,
		input: UpdateProposalInput,
	): Promise<Proposal> {
		const result = await this.request<ToolResult<Proposal>>(
			"POST",
			"/mcp/tools/update_proposal",
			{ id, ...input },
		);
		return result.result;
	}

	/**
	 * Delete a proposal
	 */
	async deleteProposal(id: string): Promise<{ success: boolean }> {
		const result = await this.request<
			ToolResult<{ success: boolean; deletedId: string }>
		>("POST", "/mcp/tools/delete_proposal", { id });
		return result.result;
	}

	/**
	 * Publish a proposal
	 */
	async publishProposal(id: string): Promise<Proposal> {
		const result = await this.request<ToolResult<Proposal>>(
			"POST",
			"/mcp/tools/publish_proposal",
			{ id },
		);
		return result.result;
	}

	/**
	 * Unpublish a proposal
	 */
	async unpublishProposal(id: string): Promise<Proposal> {
		const result = await this.request<ToolResult<Proposal>>(
			"POST",
			"/mcp/tools/unpublish_proposal",
			{ id },
		);
		return result.result;
	}

	// ==================== Analytics ====================

	/**
	 * Get analytics
	 */
	async getAnalytics(options?: AnalyticsOptions): Promise<AnalyticsResponse> {
		const result = await this.request<ToolResult<AnalyticsResponse>>(
			"POST",
			"/mcp/tools/get_analytics",
			options || {},
		);
		return result.result;
	}

	// ==================== User & Limits ====================

	/**
	 * Get current user information with plan limits
	 */
	async getUser(): Promise<User> {
		const result = await this.request<ToolResult<User>>(
			"POST",
			"/mcp/tools/get_user",
			{},
		);
		return result.result;
	}

	/**
	 * Get current plan limits and usage
	 */
	async getLimits(): Promise<UserLimitsResponse> {
		const result = await this.request<ToolResult<UserLimitsResponse>>(
			"POST",
			"/mcp/tools/get_limits",
			{},
		);
		return result.result;
	}

	// ==================== MCP ====================

	/**
	 * List available MCP tools
	 */
	async listTools(): Promise<McpTool[]> {
		const result = await this.request<{ tools: McpTool[] }>(
			"GET",
			"/mcp/tools",
		);
		return result.tools;
	}

	/**
	 * Execute a raw MCP tool
	 */
	async executeTool<T = unknown>(
		name: string,
		input: Record<string, unknown> = {},
	): Promise<ToolResult<T>> {
		return this.request<ToolResult<T>>("POST", `/mcp/tools/${name}`, input);
	}

	// ==================== Documentation ====================

	/**
	 * List documentation pages
	 */
	async listDocs(options?: ListDocsOptions): Promise<ListDocsResponse> {
		const result = await this.request<ToolResult<ListDocsResponse>>(
			"POST",
			"/mcp/tools/list_docs",
			options || {},
		);
		return result.result;
	}

	/**
	 * Get a specific documentation page
	 */
	async getDoc(slug: string): Promise<DocPage> {
		const result = await this.request<ToolResult<DocPage>>(
			"POST",
			"/mcp/tools/get_doc",
			{ slug },
		);
		return result.result;
	}

	/**
	 * Search documentation and blog
	 */
	async searchDocs(options: SearchDocsOptions): Promise<SearchDocsResponse> {
		const result = await this.request<ToolResult<SearchDocsResponse>>(
			"POST",
			"/mcp/tools/search_docs",
			options,
		);
		return result.result;
	}

	/**
	 * List blog posts
	 */
	async listBlog(options?: ListBlogOptions): Promise<ListBlogResponse> {
		const result = await this.request<ToolResult<ListBlogResponse>>(
			"POST",
			"/mcp/tools/list_blog",
			options || {},
		);
		return result.result;
	}

	/**
	 * Get a specific blog post
	 */
	async getBlogPost(slug: string): Promise<BlogPost> {
		const result = await this.request<ToolResult<BlogPost>>(
			"POST",
			"/mcp/tools/get_blog_post",
			{ slug },
		);
		return result.result;
	}

	/**
	 * Get changelog entries
	 */
	async getChangelog(limit?: number): Promise<ChangelogResponse> {
		const result = await this.request<ToolResult<ChangelogResponse>>(
			"POST",
			"/mcp/tools/get_changelog",
			{ limit },
		);
		return result.result;
	}
}

/**
 * Spons Easy API Error
 */
export class SponsEasyError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode: number,
	) {
		super(message);
		this.name = "SponsEasyError";
	}

	/**
	 * Check if error is an authentication error
	 */
	isAuthError(): boolean {
		return (
			this.code === "INVALID_KEY" ||
			this.code === "EXPIRED_KEY" ||
			this.code === "INACTIVE_KEY" ||
			this.statusCode === 401
		);
	}

	/**
	 * Check if error is a permission error
	 */
	isPermissionError(): boolean {
		return this.code === "SCOPE_DENIED" || this.statusCode === 403;
	}

	/**
	 * Check if error is a limit exceeded error
	 */
	isLimitExceeded(): boolean {
		return this.code === "LIMIT_EXCEEDED";
	}

	/**
	 * Check if error is a not found error
	 */
	isNotFound(): boolean {
		return this.code === "NOT_FOUND" || this.statusCode === 404;
	}
}

/**
 * Create a new Spons Easy client
 */
export function createClient(config: SponsEasyConfig): SponsEasyClient {
	return new SponsEasyClient(config);
}

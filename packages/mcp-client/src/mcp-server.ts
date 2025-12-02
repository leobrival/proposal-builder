/**
 * Spons Easy MCP Server
 * Model Context Protocol server for Claude and other AI assistants.
 * MCP is accessible by ALL plans - no rate limiting.
 *
 * Usage with Claude Desktop:
 * Add to your claude_desktop_config.json:
 * {
 *   "mcpServers": {
 *     "spons-easy": {
 *       "command": "npx",
 *       "args": ["@spons-easy/mcp-client", "serve"],
 *       "env": {
 *         "SPONS_EASY_API_KEY": "sk_your_api_key"
 *       }
 *     }
 *   }
 * }
 */

import { SponsEasyClient, SponsEasyError } from "./client.js";
import type { ListProposalsOptions, UpdateProposalInput, ListDocsOptions, ListBlogOptions, SearchDocsOptions } from "./types.js";

/**
 * MCP Server configuration
 */
export interface McpServerConfig {
	apiKey: string;
	baseUrl?: string;
}

/**
 * MCP Tool call
 */
interface ToolCall {
	name: string;
	arguments: Record<string, unknown>;
}

/**
 * MCP Tool result
 */
interface ToolCallResult {
	content: Array<{
		type: "text";
		text: string;
	}>;
	isError?: boolean;
}

/**
 * Spons Easy MCP Server
 * Implements the Model Context Protocol for AI assistant integration.
 */
export class SponsEasyMcpServer {
	private client: SponsEasyClient;

	constructor(config: McpServerConfig) {
		this.client = new SponsEasyClient({
			apiKey: config.apiKey,
			baseUrl: config.baseUrl,
		});
	}

	/**
	 * Get available tools for MCP
	 */
	getTools() {
		return [
			{
				name: "spons_easy_list_proposals",
				description:
					"List all sponsorship proposals. Can filter by status (draft, published, archived).",
				inputSchema: {
					type: "object" as const,
					properties: {
						status: {
							type: "string",
							enum: ["draft", "published", "archived"],
							description: "Filter proposals by status",
						},
						limit: {
							type: "number",
							description:
								"Maximum number of proposals to return (default: 20, max: 100)",
						},
						offset: {
							type: "number",
							description: "Offset for pagination",
						},
					},
				},
			},
			{
				name: "spons_easy_get_proposal",
				description: "Get details of a specific sponsorship proposal by ID.",
				inputSchema: {
					type: "object" as const,
					properties: {
						id: {
							type: "string",
							description: "The proposal ID (UUID)",
						},
					},
					required: ["id"],
				},
			},
			{
				name: "spons_easy_create_proposal",
				description:
					"Create a new sponsorship proposal. Limited by plan: 2 for free, 50 for pro, unlimited for enterprise.",
				inputSchema: {
					type: "object" as const,
					properties: {
						title: {
							type: "string",
							description: "Title of the proposal",
						},
						description: {
							type: "string",
							description: "Description of the proposal",
						},
						projectName: {
							type: "string",
							description: "Name of the project",
						},
						eventStartDate: {
							type: "string",
							description: "Start date of the event (YYYY-MM-DD format)",
						},
						eventEndDate: {
							type: "string",
							description: "End date of the event (YYYY-MM-DD format)",
						},
						eventVenueName: {
							type: "string",
							description: "Name of the venue",
						},
						eventCity: {
							type: "string",
							description: "City where the event takes place",
						},
					},
					required: ["title"],
				},
			},
			{
				name: "spons_easy_update_proposal",
				description: "Update an existing sponsorship proposal.",
				inputSchema: {
					type: "object" as const,
					properties: {
						id: {
							type: "string",
							description: "The proposal ID to update",
						},
						title: {
							type: "string",
							description: "New title",
						},
						description: {
							type: "string",
							description: "New description",
						},
						projectName: {
							type: "string",
							description: "New project name",
						},
						eventStartDate: {
							type: "string",
							description: "New start date (YYYY-MM-DD)",
						},
						eventEndDate: {
							type: "string",
							description: "New end date (YYYY-MM-DD)",
						},
					},
					required: ["id"],
				},
			},
			{
				name: "spons_easy_delete_proposal",
				description:
					"Delete a sponsorship proposal. This action cannot be undone.",
				inputSchema: {
					type: "object" as const,
					properties: {
						id: {
							type: "string",
							description: "The proposal ID to delete",
						},
					},
					required: ["id"],
				},
			},
			{
				name: "spons_easy_publish_proposal",
				description:
					"Publish a proposal to make it publicly accessible via its URL.",
				inputSchema: {
					type: "object" as const,
					properties: {
						id: {
							type: "string",
							description: "The proposal ID to publish",
						},
					},
					required: ["id"],
				},
			},
			{
				name: "spons_easy_unpublish_proposal",
				description: "Unpublish a proposal to make it private (draft status).",
				inputSchema: {
					type: "object" as const,
					properties: {
						id: {
							type: "string",
							description: "The proposal ID to unpublish",
						},
					},
					required: ["id"],
				},
			},
			{
				name: "spons_easy_get_limits",
				description:
					"Get current plan limits and usage. Shows how many proposals you can create.",
				inputSchema: {
					type: "object" as const,
					properties: {},
				},
			},
			{
				name: "spons_easy_get_user",
				description:
					"Get information about the current authenticated user including plan and limits.",
				inputSchema: {
					type: "object" as const,
					properties: {},
				},
			},
			// Documentation tools
			{
				name: "spons_easy_list_docs",
				description:
					"List all documentation pages. Use this to understand Spons Easy features and how to use them.",
				inputSchema: {
					type: "object" as const,
					properties: {
						section: {
							type: "string",
							enum: ["getting-started", "integration", "features", "api", "guides"],
							description: "Filter by documentation section",
						},
					},
				},
			},
			{
				name: "spons_easy_get_doc",
				description:
					"Get a specific documentation page by slug with full content.",
				inputSchema: {
					type: "object" as const,
					properties: {
						slug: {
							type: "string",
							description: "The documentation page slug (e.g., 'mcp-setup', 'getting-started')",
						},
					},
					required: ["slug"],
				},
			},
			{
				name: "spons_easy_search_docs",
				description:
					"Search documentation and blog for specific topics. Returns relevant articles.",
				inputSchema: {
					type: "object" as const,
					properties: {
						query: {
							type: "string",
							description: "Search query",
						},
						types: {
							type: "array",
							items: { type: "string", enum: ["blog", "docs"] },
							description: "Content types to search (default: both)",
						},
					},
					required: ["query"],
				},
			},
			{
				name: "spons_easy_list_blog",
				description:
					"List blog posts with tutorials, tips, and product announcements.",
				inputSchema: {
					type: "object" as const,
					properties: {
						category: {
							type: "string",
							enum: ["product", "tutorial", "case-study", "announcement", "tips"],
							description: "Filter by category",
						},
						tag: {
							type: "string",
							description: "Filter by tag",
						},
						limit: {
							type: "number",
							description: "Maximum number of posts (default: 10)",
						},
					},
				},
			},
			{
				name: "spons_easy_get_blog_post",
				description: "Get a specific blog post by slug with full content.",
				inputSchema: {
					type: "object" as const,
					properties: {
						slug: {
							type: "string",
							description: "The blog post slug",
						},
					},
					required: ["slug"],
				},
			},
			{
				name: "spons_easy_get_changelog",
				description:
					"Get the changelog to see recent updates and new features.",
				inputSchema: {
					type: "object" as const,
					properties: {
						limit: {
							type: "number",
							description: "Maximum number of versions (default: 10)",
						},
					},
				},
			},
		];
	}

	/**
	 * Handle a tool call
	 */
	async handleToolCall(call: ToolCall): Promise<ToolCallResult> {
		try {
			const args = call.arguments;

			switch (call.name) {
				case "spons_easy_list_proposals": {
					const result = await this.client.listProposals(
						args as ListProposalsOptions,
					);
					return this.success(
						`Found ${result.proposals.length} proposal(s):\n\n` +
							result.proposals
								.map(
									(p) =>
										`- **${p.title}** (${p.status})\n  ID: ${p.id}\n  ${p.projectName ? `Project: ${p.projectName}` : ""}`,
								)
								.join("\n\n"),
					);
				}

				case "spons_easy_get_proposal": {
					const result = await this.client.getProposal(args.id as string);
					return this.success(
						`**${result.title}**\n\n` +
							`- Status: ${result.status}\n` +
							`- ID: ${result.id}\n` +
							`- Slug: ${result.slug}\n` +
							(result.projectName ? `- Project: ${result.projectName}\n` : "") +
							(result.eventStartDate
								? `- Event Date: ${result.eventStartDate}\n`
								: "") +
							(result.eventCity ? `- City: ${result.eventCity}\n` : "") +
							(result.description
								? `\nDescription:\n${result.description}`
								: ""),
					);
				}

				case "spons_easy_create_proposal": {
					if (!args.title || typeof args.title !== "string") {
						return this.error("Title is required");
					}
					const result = await this.client.createProposal({
						title: args.title,
						description:
							typeof args.description === "string"
								? args.description
								: undefined,
						projectName:
							typeof args.projectName === "string"
								? args.projectName
								: undefined,
						eventStartDate:
							typeof args.eventStartDate === "string"
								? args.eventStartDate
								: undefined,
						eventEndDate:
							typeof args.eventEndDate === "string"
								? args.eventEndDate
								: undefined,
						eventVenueName:
							typeof args.eventVenueName === "string"
								? args.eventVenueName
								: undefined,
						eventCity:
							typeof args.eventCity === "string" ? args.eventCity : undefined,
					});
					return this.success(
						`Proposal created successfully!\n\n` +
							`- Title: ${result.title}\n` +
							`- ID: ${result.id}\n` +
							`- Status: ${result.status}`,
					);
				}

				case "spons_easy_update_proposal": {
					if (!args.id || typeof args.id !== "string") {
						return this.error("Proposal ID is required");
					}
					const id = args.id;
					const updates: UpdateProposalInput = {
						title: typeof args.title === "string" ? args.title : undefined,
						description:
							typeof args.description === "string"
								? args.description
								: undefined,
						projectName:
							typeof args.projectName === "string"
								? args.projectName
								: undefined,
						eventStartDate:
							typeof args.eventStartDate === "string"
								? args.eventStartDate
								: undefined,
						eventEndDate:
							typeof args.eventEndDate === "string"
								? args.eventEndDate
								: undefined,
					};
					const result = await this.client.updateProposal(id, updates);
					return this.success(
						`Proposal updated successfully!\n\n` +
							`- Title: ${result.title}\n` +
							`- ID: ${result.id}\n` +
							`- Status: ${result.status}`,
					);
				}

				case "spons_easy_delete_proposal": {
					await this.client.deleteProposal(args.id as string);
					return this.success(`Proposal ${args.id} deleted successfully.`);
				}

				case "spons_easy_publish_proposal": {
					const result = await this.client.publishProposal(args.id as string);
					return this.success(
						`Proposal published!\n\n` +
							`- ID: ${result.id}\n` +
							`- Status: ${result.status}\n` +
							`- Published at: ${result.publishedAt}`,
					);
				}

				case "spons_easy_unpublish_proposal": {
					const result = await this.client.unpublishProposal(args.id as string);
					return this.success(
						`Proposal unpublished.\n\n` +
							`- ID: ${result.id}\n` +
							`- Status: ${result.status}`,
					);
				}

				case "spons_easy_get_limits": {
					const result = await this.client.getLimits();
					const proposalLimit = result.proposals.unlimited
						? "unlimited"
						: result.proposals.limit;
					return this.success(
						`Plan Limits (${result.plan}):\n\n` +
							`**Proposals:**\n` +
							`- Current: ${result.proposals.current}\n` +
							`- Limit: ${proposalLimit}\n` +
							`- Remaining: ${result.proposals.unlimited ? "unlimited" : result.proposals.remaining}\n\n` +
							`**API Keys:**\n` +
							`- Current: ${result.apiKeys.current}\n` +
							`- Limit: ${result.apiKeys.limit}\n\n` +
							`**Features:**\n` +
							`- Analytics: ${result.features.hasAnalytics ? "Yes" : "No"}\n` +
							`- Custom Templates: ${result.features.hasCustomTemplates ? "Yes" : "No"}\n` +
							`- Remove Branding: ${result.features.canRemoveBranding ? "Yes" : "No"}`,
					);
				}

				case "spons_easy_get_user": {
					const result = await this.client.getUser();
					const proposalLimit = result.limits.proposals.unlimited
						? "unlimited"
						: result.limits.proposals.limit;
					return this.success(
						`User Information:\n\n` +
							`- Name: ${result.fullName}\n` +
							`- Email: ${result.email}\n` +
							`- Plan: ${result.plan}\n\n` +
							`**Usage:**\n` +
							`- Proposals: ${result.limits.proposals.current}/${proposalLimit}`,
					);
				}

				// Documentation tools
				case "spons_easy_list_docs": {
					const result = await this.client.listDocs(args as ListDocsOptions);
					return this.success(
						`Found ${result.total} documentation page(s):\n\n` +
							result.docs
								.map(
									(d) =>
										`- **${d.title}** (${d.section})\n  Slug: ${d.slug}\n  ${d.description}`,
								)
								.join("\n\n"),
					);
				}

				case "spons_easy_get_doc": {
					const result = await this.client.getDoc(args.slug as string);
					return this.success(
						`**${result.title}**\n\n` +
							`Section: ${result.section}\n` +
							`Reading time: ${result.readingTime || "?"} min\n\n` +
							`---\n\n` +
							(result.content || result.html || result.excerpt),
					);
				}

				case "spons_easy_search_docs": {
					if (!args.query || typeof args.query !== "string") {
						return this.error("Search query is required");
					}
					const searchOptions: SearchDocsOptions = {
						query: args.query,
						types: Array.isArray(args.types) ? args.types as ("blog" | "docs")[] : undefined,
					};
					const result = await this.client.searchDocs(searchOptions);
					if (result.total === 0) {
						return this.success(`No results found for "${args.query}"`);
					}
					return this.success(
						`Found ${result.total} result(s) for "${result.query}":\n\n` +
							result.results
								.map(
									(r) =>
										`- **${r.title}** [${r.type}]\n  Slug: ${r.slug}\n  ${r.excerpt}`,
								)
								.join("\n\n"),
					);
				}

				case "spons_easy_list_blog": {
					const result = await this.client.listBlog(args as ListBlogOptions);
					return this.success(
						`Found ${result.total} blog post(s):\n\n` +
							result.posts
								.map(
									(p) =>
										`- **${p.title}** (${p.category})\n  Slug: ${p.slug}\n  By ${p.author} | ${p.readingTime || "?"} min read\n  ${p.excerpt}`,
								)
								.join("\n\n"),
					);
				}

				case "spons_easy_get_blog_post": {
					const result = await this.client.getBlogPost(args.slug as string);
					return this.success(
						`**${result.title}**\n\n` +
							`Category: ${result.category}\n` +
							`Author: ${result.author}\n` +
							`Tags: ${result.tags.join(", ")}\n` +
							`Reading time: ${result.readingTime || "?"} min\n\n` +
							`---\n\n` +
							(result.content || result.html || result.excerpt),
					);
				}

				case "spons_easy_get_changelog": {
					const limit = typeof args.limit === "number" ? args.limit : 10;
					const result = await this.client.getChangelog(limit);
					return this.success(
						`Changelog (${result.total} version(s)):\n\n` +
							result.entries
								.map(
									(e) =>
										`## v${e.version} - ${e.date}\n${e.title}\n${e.description || ""}`,
								)
								.join("\n\n"),
					);
				}

				default:
					return this.error(`Unknown tool: ${call.name}`);
			}
		} catch (error) {
			if (error instanceof SponsEasyError) {
				if (error.isLimitExceeded()) {
					return this.error(
						`Limit exceeded: ${error.message}. Upgrade your plan to create more proposals.`,
					);
				}
				if (error.isAuthError()) {
					return this.error(
						`Authentication failed: ${error.message}. Please check your API key.`,
					);
				}
				if (error.isPermissionError()) {
					return this.error(
						`Permission denied: ${error.message}. Your plan may not include this feature.`,
					);
				}
				if (error.isNotFound()) {
					return this.error(`Not found: ${error.message}`);
				}
				return this.error(error.message);
			}

			return this.error(
				error instanceof Error ? error.message : "Unknown error occurred",
			);
		}
	}

	/**
	 * Create a success response
	 */
	private success(text: string): ToolCallResult {
		return {
			content: [{ type: "text", text }],
		};
	}

	/**
	 * Create an error response
	 */
	private error(message: string): ToolCallResult {
		return {
			content: [{ type: "text", text: `Error: ${message}` }],
			isError: true,
		};
	}
}

/**
 * Create and run the MCP server
 * This is the entry point for running as a standalone MCP server.
 */
export async function runMcpServer(): Promise<void> {
	const apiKey = process.env.SPONS_EASY_API_KEY;
	const baseUrl = process.env.SPONS_EASY_BASE_URL;

	if (!apiKey) {
		console.error("Error: SPONS_EASY_API_KEY environment variable is required");
		process.exit(1);
	}

	const server = new SponsEasyMcpServer({ apiKey, baseUrl });

	// For MCP SDK integration, the server would be wrapped with the SDK
	// This is a simplified implementation for demonstration
	console.log("Spons Easy MCP Server initialized");
	console.log(
		"Available tools:",
		server
			.getTools()
			.map((t) => t.name)
			.join(", "),
	);

	// In a real implementation, this would use @modelcontextprotocol/sdk
	// to handle stdio communication with the AI assistant
}

/**
 * Create an MCP server instance
 */
export function createMcpServer(config: McpServerConfig): SponsEasyMcpServer {
	return new SponsEasyMcpServer(config);
}

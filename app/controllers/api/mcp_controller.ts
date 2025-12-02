import type { HttpContext } from "@adonisjs/core/http";
import type { McpScope } from "#contracts/mcp_service_contract";
import Proposal from "#models/proposal";
import type User from "#models/user";
import mcpService from "#services/mcp_service";
import proposalService from "#services/proposal_service";
import contentService from "#services/content_service";
import type { BlogFrontmatter, DocsFrontmatter } from "#contracts/content_service_contract";

/**
 * MCP Controller
 * Handles MCP (Model Context Protocol) API endpoints.
 * All endpoints require API key authentication.
 * MCP is accessible by ALL plans - no rate limiting.
 * Only proposal creation is limited by plan.
 */
export default class McpController {
	/**
	 * Extract API key from Authorization header
	 */
	private extractApiKey(request: HttpContext["request"]): string | null {
		const authHeader = request.header("Authorization");
		if (!authHeader) return null;

		// Support both "Bearer sk_xxx" and "sk_xxx" formats
		if (authHeader.startsWith("Bearer ")) {
			return authHeader.substring(7);
		}
		if (authHeader.startsWith("sk_")) {
			return authHeader;
		}

		return null;
	}

	/**
	 * Authenticate and authorize request
	 */
	private async authenticate(
		request: HttpContext["request"],
		response: HttpContext["response"],
		requiredScope?: McpScope,
	) {
		const apiKey = this.extractApiKey(request);

		if (!apiKey) {
			response.status(401).json({
				error: "Clé API manquante",
				code: "UNAUTHORIZED",
			});
			return null;
		}

		const result = await mcpService.authenticate(apiKey, requiredScope);

		if (!result.success) {
			response.status(401).json({
				error: result.error,
				code: result.errorCode,
			});
			return null;
		}

		return result;
	}

	/**
	 * List tools available in MCP
	 * GET /mcp/tools
	 */
	async listTools({ request, response }: HttpContext) {
		const auth = await this.authenticate(request, response);
		if (!auth) return;

		const tools = [
			{
				name: "list_proposals",
				description: "List all proposals for the authenticated user",
				inputSchema: {
					type: "object",
					properties: {
						status: {
							type: "string",
							enum: ["draft", "published", "archived"],
							description: "Filter by status",
						},
						limit: {
							type: "number",
							description: "Maximum number of proposals to return",
							default: 20,
						},
						offset: {
							type: "number",
							description: "Offset for pagination",
							default: 0,
						},
					},
				},
				requiredScope: "proposals:read",
			},
			{
				name: "get_proposal",
				description: "Get a specific proposal by ID",
				inputSchema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "The proposal ID",
						},
					},
					required: ["id"],
				},
				requiredScope: "proposals:read",
			},
			{
				name: "create_proposal",
				description:
					"Create a new proposal (limited by plan: 2 for free, 50 for pro, unlimited for enterprise)",
				inputSchema: {
					type: "object",
					properties: {
						title: {
							type: "string",
							description: "Proposal title",
						},
						description: {
							type: "string",
							description: "Proposal description",
						},
						projectName: {
							type: "string",
							description: "Project name",
						},
						eventStartDate: {
							type: "string",
							format: "date",
							description: "Event start date (YYYY-MM-DD)",
						},
						eventEndDate: {
							type: "string",
							format: "date",
							description: "Event end date (YYYY-MM-DD)",
						},
						eventVenueName: {
							type: "string",
							description: "Venue name",
						},
						eventCity: {
							type: "string",
							description: "City",
						},
					},
					required: ["title"],
				},
				requiredScope: "proposals:write",
			},
			{
				name: "update_proposal",
				description: "Update an existing proposal",
				inputSchema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "The proposal ID",
						},
						title: { type: "string" },
						description: { type: "string" },
						projectName: { type: "string" },
						eventStartDate: { type: "string", format: "date" },
						eventEndDate: { type: "string", format: "date" },
					},
					required: ["id"],
				},
				requiredScope: "proposals:write",
			},
			{
				name: "delete_proposal",
				description: "Delete a proposal",
				inputSchema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "The proposal ID",
						},
					},
					required: ["id"],
				},
				requiredScope: "proposals:delete",
			},
			{
				name: "publish_proposal",
				description: "Publish a proposal (make it publicly accessible)",
				inputSchema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "The proposal ID",
						},
					},
					required: ["id"],
				},
				requiredScope: "proposals:publish",
			},
			{
				name: "unpublish_proposal",
				description: "Unpublish a proposal",
				inputSchema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "The proposal ID",
						},
					},
					required: ["id"],
				},
				requiredScope: "proposals:publish",
			},
			{
				name: "get_limits",
				description: "Get current usage limits for your plan",
				inputSchema: {
					type: "object",
					properties: {},
				},
				requiredScope: "user:read",
			},
			{
				name: "get_user",
				description: "Get current user information",
				inputSchema: {
					type: "object",
					properties: {},
				},
				requiredScope: "user:read",
			},
			// Documentation tools - accessible without specific scope
			{
				name: "list_docs",
				description: "List all documentation pages. Use this to understand Spons Easy features and how to use them.",
				inputSchema: {
					type: "object",
					properties: {
						section: {
							type: "string",
							enum: ["getting-started", "integration", "features", "api", "guides"],
							description: "Filter by documentation section",
						},
					},
				},
				requiredScope: "user:read",
			},
			{
				name: "get_doc",
				description: "Get a specific documentation page by slug. Use this to get detailed information about a feature or topic.",
				inputSchema: {
					type: "object",
					properties: {
						slug: {
							type: "string",
							description: "The documentation page slug (e.g., 'mcp-setup', 'getting-started')",
						},
					},
					required: ["slug"],
				},
				requiredScope: "user:read",
			},
			{
				name: "search_docs",
				description: "Search documentation and blog for specific topics. Returns relevant articles matching the query.",
				inputSchema: {
					type: "object",
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
				requiredScope: "user:read",
			},
			{
				name: "list_blog",
				description: "List blog posts with tutorials, tips, and product announcements.",
				inputSchema: {
					type: "object",
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
							description: "Maximum number of posts to return",
							default: 10,
						},
					},
				},
				requiredScope: "user:read",
			},
			{
				name: "get_blog_post",
				description: "Get a specific blog post by slug with full content.",
				inputSchema: {
					type: "object",
					properties: {
						slug: {
							type: "string",
							description: "The blog post slug",
						},
					},
					required: ["slug"],
				},
				requiredScope: "user:read",
			},
			{
				name: "get_changelog",
				description: "Get the changelog to see recent updates and new features in Spons Easy.",
				inputSchema: {
					type: "object",
					properties: {
						limit: {
							type: "number",
							description: "Maximum number of versions to return",
							default: 10,
						},
					},
				},
				requiredScope: "user:read",
			},
		];

		// Filter tools based on API key scopes
		const availableTools = tools.filter((tool) =>
			auth.apiKey!.hasScope(tool.requiredScope as McpScope),
		);

		// Record request for statistics
		await mcpService.recordRequest(auth.apiKey!, "/mcp/tools");

		return response.json({
			tools: availableTools,
		});
	}

	/**
	 * Execute a tool
	 * POST /mcp/tools/:name
	 */
	async executeTool({ request, response, params }: HttpContext) {
		const toolName = params.name;
		const startTime = Date.now();

		// Map tool names to required scopes
		const scopeMap: Record<string, McpScope> = {
			list_proposals: "proposals:read",
			get_proposal: "proposals:read",
			create_proposal: "proposals:write",
			update_proposal: "proposals:write",
			delete_proposal: "proposals:delete",
			publish_proposal: "proposals:publish",
			unpublish_proposal: "proposals:publish",
			get_limits: "user:read",
			get_user: "user:read",
			// Documentation tools
			list_docs: "user:read",
			get_doc: "user:read",
			search_docs: "user:read",
			list_blog: "user:read",
			get_blog_post: "user:read",
			get_changelog: "user:read",
		};

		const requiredScope = scopeMap[toolName];
		if (!requiredScope) {
			return response.status(404).json({
				error: `Outil inconnu: ${toolName}`,
				code: "TOOL_NOT_FOUND",
			});
		}

		const auth = await this.authenticate(request, response, requiredScope);
		if (!auth) return;

		const input = request.body();

		try {
			let result: unknown;

			switch (toolName) {
				case "list_proposals":
					result = await this.listProposals(auth.user!, input);
					break;
				case "get_proposal":
					result = await this.getProposal(auth.user!, input);
					break;
				case "create_proposal":
					result = await this.createProposal(auth.user!, input);
					break;
				case "update_proposal":
					result = await this.updateProposal(auth.user!, input);
					break;
				case "delete_proposal":
					result = await this.deleteProposal(auth.user!, input);
					break;
				case "publish_proposal":
					result = await this.publishProposal(auth.user!, input);
					break;
				case "unpublish_proposal":
					result = await this.unpublishProposal(auth.user!, input);
					break;
				case "get_limits":
					result = await this.getLimits(auth.user!);
					break;
				case "get_user":
					result = await this.getUser(auth.user!);
					break;
				// Documentation tools
				case "list_docs":
					result = await this.listDocs(input);
					break;
				case "get_doc":
					result = await this.getDoc(input);
					break;
				case "search_docs":
					result = await this.searchDocs(input);
					break;
				case "list_blog":
					result = await this.listBlog(input);
					break;
				case "get_blog_post":
					result = await this.getBlogPost(input);
					break;
				case "get_changelog":
					result = await this.getChangelogEntries(input);
					break;
				default:
					return response.status(404).json({
						error: `Outil inconnu: ${toolName}`,
						code: "TOOL_NOT_FOUND",
					});
			}

			// Record request for statistics
			await mcpService.recordRequest(auth.apiKey!, `/mcp/tools/${toolName}`);

			return response.json({
				result,
				_meta: {
					tool: toolName,
					executionTime: Date.now() - startTime,
				},
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Échec de l'exécution de l'outil";

			// Check if it's a limit error
			if (errorMessage.includes("limite") || errorMessage.includes("Limite")) {
				return response.status(403).json({
					error: errorMessage,
					code: "LIMIT_EXCEEDED",
				});
			}

			return response.status(500).json({
				error: errorMessage,
				code: "EXECUTION_ERROR",
			});
		}
	}

	/**
	 * Get user limits and usage
	 * GET /mcp/limits
	 */
	async limits({ request, response }: HttpContext) {
		const auth = await this.authenticate(request, response);
		if (!auth) return;

		const limits = await mcpService.getUserLimits(auth.user!);

		return response.json(limits);
	}

	// Tool implementations

	private async listProposals(user: User, input: Record<string, unknown>) {
		const query = Proposal.query().where("userId", user.id);

		if (input.status && typeof input.status === "string") {
			query.where("status", input.status);
		}

		const limit = Math.min(Number(input.limit) || 20, 100);
		const offset = Number(input.offset) || 0;

		const proposals = await query
			.orderBy("createdAt", "desc")
			.limit(limit)
			.offset(offset);

		return {
			proposals: proposals.map((p) => ({
				id: p.id,
				title: p.title,
				description: p.description,
				status: p.status,
				slug: p.slug,
				projectName: p.projectName,
				eventStartDate: p.eventStartDate?.toISODate(),
				eventEndDate: p.eventEndDate?.toISODate(),
				eventVenueName: p.eventVenueName,
				eventCity: p.eventCity,
				createdAt: p.createdAt.toISO(),
				updatedAt: p.updatedAt.toISO(),
			})),
			pagination: {
				limit,
				offset,
				hasMore: proposals.length === limit,
			},
		};
	}

	private async getProposal(user: User, input: Record<string, unknown>) {
		if (!input.id || typeof input.id !== "string") {
			throw new Error("L'ID de la proposition est requis");
		}

		const proposal = await Proposal.query()
			.where("id", input.id)
			.where("userId", user.id)
			.first();

		if (!proposal) {
			throw new Error("Proposition non trouvée");
		}

		return {
			id: proposal.id,
			title: proposal.title,
			description: proposal.description,
			status: proposal.status,
			slug: proposal.slug,
			projectName: proposal.projectName,
			projectDescription: proposal.projectDescription,
			eventStartDate: proposal.eventStartDate?.toISODate(),
			eventEndDate: proposal.eventEndDate?.toISODate(),
			eventVenueName: proposal.eventVenueName,
			eventAddress: proposal.eventAddress,
			eventCity: proposal.eventCity,
			eventCountry: proposal.eventCountry,
			eventCategory: proposal.eventCategory,
			eventFormat: proposal.eventFormat,
			subdomain: proposal.subdomain,
			customDomain: proposal.customDomain,
			createdAt: proposal.createdAt.toISO(),
			updatedAt: proposal.updatedAt.toISO(),
			publishedAt: proposal.publishedAt?.toISO(),
		};
	}

	private async createProposal(user: User, input: Record<string, unknown>) {
		if (!input.title || typeof input.title !== "string") {
			throw new Error("Le titre est requis");
		}

		// Use proposalService which checks limits automatically
		const proposal = await proposalService.create(user, {
			title: input.title,
			description:
				typeof input.description === "string" ? input.description : undefined,
			projectName:
				typeof input.projectName === "string" ? input.projectName : input.title,
			contactEmail: user.email,
			eventStartDate:
				typeof input.eventStartDate === "string"
					? input.eventStartDate
					: undefined,
			eventEndDate:
				typeof input.eventEndDate === "string" ? input.eventEndDate : undefined,
			eventVenueName:
				typeof input.eventVenueName === "string"
					? input.eventVenueName
					: undefined,
			eventCity:
				typeof input.eventCity === "string" ? input.eventCity : undefined,
		});

		return {
			id: proposal.id,
			title: proposal.title,
			slug: proposal.slug,
			status: proposal.status,
			createdAt: proposal.createdAt.toISO(),
		};
	}

	private async updateProposal(user: User, input: Record<string, unknown>) {
		if (!input.id || typeof input.id !== "string") {
			throw new Error("L'ID de la proposition est requis");
		}

		const proposal = await proposalService.getByIdForUser(input.id, user.id);

		const updateData: Record<string, unknown> = {};
		if (typeof input.title === "string") updateData.title = input.title;
		if (typeof input.description === "string")
			updateData.description = input.description;
		if (typeof input.projectName === "string")
			updateData.projectName = input.projectName;
		if (typeof input.eventVenueName === "string")
			updateData.eventVenueName = input.eventVenueName;
		if (typeof input.eventCity === "string")
			updateData.eventCity = input.eventCity;
		if (typeof input.eventStartDate === "string")
			updateData.eventStartDate = input.eventStartDate;
		if (typeof input.eventEndDate === "string")
			updateData.eventEndDate = input.eventEndDate;

		await proposalService.update(proposal, updateData);

		return {
			id: proposal.id,
			title: proposal.title,
			status: proposal.status,
			updatedAt: proposal.updatedAt.toISO(),
		};
	}

	private async deleteProposal(user: User, input: Record<string, unknown>) {
		if (!input.id || typeof input.id !== "string") {
			throw new Error("L'ID de la proposition est requis");
		}

		const proposal = await proposalService.getByIdForUser(input.id, user.id);
		await proposalService.delete(proposal);

		return { success: true, deletedId: input.id };
	}

	private async publishProposal(user: User, input: Record<string, unknown>) {
		if (!input.id || typeof input.id !== "string") {
			throw new Error("L'ID de la proposition est requis");
		}

		const proposal = await proposalService.getByIdForUser(input.id, user.id);
		await proposalService.publish(proposal);

		return {
			id: proposal.id,
			status: proposal.status,
			publishedAt: proposal.publishedAt?.toISO(),
		};
	}

	private async unpublishProposal(user: User, input: Record<string, unknown>) {
		if (!input.id || typeof input.id !== "string") {
			throw new Error("L'ID de la proposition est requis");
		}

		const proposal = await proposalService.getByIdForUser(input.id, user.id);
		await proposalService.unpublish(proposal);

		return {
			id: proposal.id,
			status: proposal.status,
		};
	}

	private async getLimits(user: User) {
		return mcpService.getUserLimits(user);
	}

	private async getUser(user: User) {
		const limits = await mcpService.getUserLimits(user);

		return {
			id: user.id,
			email: user.email,
			fullName: user.fullName,
			plan: limits.plan,
			limits: {
				proposals: limits.proposals,
				apiKeys: limits.apiKeys,
			},
			features: limits.features,
		};
	}

	// Documentation tool implementations

	private async listDocs(input: Record<string, unknown>) {
		const section = typeof input.section === "string" ? input.section : undefined;

		const { items } = await contentService.list<DocsFrontmatter>({
			type: "docs",
			status: "published",
			limit: 100,
			orderBy: "title",
			order: "asc",
		});

		// Filter by section if provided
		const filtered = section
			? items.filter((item) => item.frontmatter.section === section)
			: items;

		return {
			docs: filtered.map((item) => ({
				slug: item.frontmatter.slug,
				title: item.frontmatter.title,
				description: item.frontmatter.description,
				section: item.frontmatter.section,
				icon: item.frontmatter.icon,
				excerpt: item.excerpt,
			})),
			total: filtered.length,
		};
	}

	private async getDoc(input: Record<string, unknown>) {
		if (!input.slug || typeof input.slug !== "string") {
			throw new Error("Le slug de la documentation est requis");
		}

		const doc = await contentService.get<DocsFrontmatter>("docs", input.slug);

		if (!doc || doc.frontmatter.status !== "published") {
			throw new Error("Documentation non trouvee");
		}

		return {
			slug: doc.frontmatter.slug,
			title: doc.frontmatter.title,
			description: doc.frontmatter.description,
			section: doc.frontmatter.section,
			content: doc.content, // Raw markdown for AI processing
			html: doc.html, // Rendered HTML
			toc: doc.toc,
			readingTime: (doc.frontmatter as { readingTime?: number }).readingTime,
		};
	}

	private async searchDocs(input: Record<string, unknown>) {
		if (!input.query || typeof input.query !== "string") {
			throw new Error("La requete de recherche est requise");
		}

		const types = Array.isArray(input.types)
			? (input.types as ("blog" | "docs")[])
			: ["blog", "docs"] as ("blog" | "docs")[];

		const results = await contentService.search(input.query, types);

		return {
			results: results.map((item) => ({
				type: "section" in item.frontmatter ? "docs" : "blog",
				slug: item.frontmatter.slug,
				title: item.frontmatter.title,
				description: item.frontmatter.description,
				excerpt: item.excerpt,
			})),
			total: results.length,
			query: input.query,
		};
	}

	private async listBlog(input: Record<string, unknown>) {
		const category = typeof input.category === "string" ? input.category : undefined;
		const tag = typeof input.tag === "string" ? input.tag : undefined;
		const limit = typeof input.limit === "number" ? Math.min(input.limit, 50) : 10;

		const { items, total } = await contentService.list<BlogFrontmatter>({
			type: "blog",
			status: "published",
			category: category as BlogFrontmatter["category"],
			tag,
			limit,
			orderBy: "publishedAt",
			order: "desc",
		});

		return {
			posts: items.map((item) => ({
				slug: item.frontmatter.slug,
				title: item.frontmatter.title,
				description: item.frontmatter.description,
				category: item.frontmatter.category,
				author: item.frontmatter.author,
				tags: item.frontmatter.tags,
				publishedAt: item.frontmatter.publishedAt,
				readingTime: item.frontmatter.readingTime,
				excerpt: item.excerpt,
			})),
			total,
		};
	}

	private async getBlogPost(input: Record<string, unknown>) {
		if (!input.slug || typeof input.slug !== "string") {
			throw new Error("Le slug de l'article est requis");
		}

		const post = await contentService.get<BlogFrontmatter>("blog", input.slug);

		if (!post || post.frontmatter.status !== "published") {
			throw new Error("Article non trouve");
		}

		return {
			slug: post.frontmatter.slug,
			title: post.frontmatter.title,
			description: post.frontmatter.description,
			category: post.frontmatter.category,
			author: post.frontmatter.author,
			tags: post.frontmatter.tags,
			publishedAt: post.frontmatter.publishedAt,
			readingTime: post.frontmatter.readingTime,
			content: post.content, // Raw markdown for AI processing
			html: post.html, // Rendered HTML
			toc: post.toc,
		};
	}

	private async getChangelogEntries(input: Record<string, unknown>) {
		const limit = typeof input.limit === "number" ? Math.min(input.limit, 50) : 10;

		const entries = await contentService.getChangelog();

		return {
			entries: entries.slice(0, limit).map((entry) => ({
				version: entry.version,
				date: entry.date,
				title: entry.title,
				description: entry.description,
			})),
			total: entries.length,
		};
	}
}

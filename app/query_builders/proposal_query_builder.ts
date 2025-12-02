import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";
import Proposal from "#models/proposal";

type ProposalQuery = ModelQueryBuilderContract<typeof Proposal, Proposal>;

/**
 * Fluent query builder for Proposal model
 * Provides chainable methods for building complex queries
 */
export default class ProposalQueryBuilder {
	private query: ProposalQuery;

	constructor() {
		this.query = Proposal.query();
	}

	/**
	 * Create a new instance
	 */
	static create(): ProposalQueryBuilder {
		return new ProposalQueryBuilder();
	}

	/**
	 * Filter by user ID
	 */
	forUser(userId: string): this {
		this.query.where("userId", userId);
		return this;
	}

	/**
	 * Filter by status
	 */
	whereStatus(status: "draft" | "published" | "archived"): this {
		this.query.where("status", status);
		return this;
	}

	/**
	 * Filter by published status
	 */
	published(): this {
		return this.whereStatus("published");
	}

	/**
	 * Filter by draft status
	 */
	draft(): this {
		return this.whereStatus("draft");
	}

	/**
	 * Filter by archived status
	 */
	archived(): this {
		return this.whereStatus("archived");
	}

	/**
	 * Search by title or project name
	 */
	search(term: string): this {
		this.query.where((builder) => {
			builder
				.whereILike("title", `%${term}%`)
				.orWhereILike("projectName", `%${term}%`);
		});
		return this;
	}

	/**
	 * Filter by slug
	 */
	whereSlug(slug: string): this {
		this.query.where("slug", slug);
		return this;
	}

	/**
	 * Filter by event category
	 */
	whereCategory(category: string): this {
		this.query.where("eventCategory", category);
		return this;
	}

	/**
	 * Filter by event city
	 */
	whereCity(city: string): this {
		this.query.where("eventCity", city);
		return this;
	}

	/**
	 * Filter by event format
	 */
	whereFormat(format: "in_person" | "online" | "hybrid"): this {
		this.query.where("eventFormat", format);
		return this;
	}

	/**
	 * Filter events starting after date
	 */
	eventStartsAfter(date: Date): this {
		this.query.where("eventStartDate", ">=", date);
		return this;
	}

	/**
	 * Filter events starting before date
	 */
	eventStartsBefore(date: Date): this {
		this.query.where("eventStartDate", "<=", date);
		return this;
	}

	/**
	 * Filter proposals created after date
	 */
	createdAfter(date: Date): this {
		this.query.where("createdAt", ">=", date);
		return this;
	}

	/**
	 * Filter proposals created before date
	 */
	createdBefore(date: Date): this {
		this.query.where("createdAt", "<=", date);
		return this;
	}

	/**
	 * Filter with minimum view count
	 */
	withMinViews(count: number): this {
		this.query.where("viewCount", ">=", count);
		return this;
	}

	/**
	 * Order by update date descending (most recent first)
	 */
	latestUpdated(): this {
		this.query.orderBy("updatedAt", "desc");
		return this;
	}

	/**
	 * Order by creation date descending
	 */
	latest(): this {
		this.query.orderBy("createdAt", "desc");
		return this;
	}

	/**
	 * Order by creation date ascending
	 */
	oldest(): this {
		this.query.orderBy("createdAt", "asc");
		return this;
	}

	/**
	 * Order by publish date descending
	 */
	latestPublished(): this {
		this.query.orderBy("publishedAt", "desc");
		return this;
	}

	/**
	 * Order by view count descending
	 */
	mostViewed(): this {
		this.query.orderBy("viewCount", "desc");
		return this;
	}

	/**
	 * Order by specific field
	 */
	orderBy(field: string, direction: "asc" | "desc" = "asc"): this {
		this.query.orderBy(field, direction);
		return this;
	}

	/**
	 * Limit results
	 */
	limit(count: number): this {
		this.query.limit(count);
		return this;
	}

	/**
	 * Offset results
	 */
	offset(count: number): this {
		this.query.offset(count);
		return this;
	}

	/**
	 * Select specific columns
	 */
	select(...columns: string[]): this {
		this.query.select(columns);
		return this;
	}

	/**
	 * Preload user relationship
	 */
	withUser(): this {
		this.query.preload("user");
		return this;
	}

	/**
	 * Preload tiers with benefits
	 */
	withTiers(): this {
		this.query.preload("tiers", (tierQuery) => {
			tierQuery
				.orderBy("position", "asc")
				.preload("benefits", (benefitQuery) => {
					benefitQuery.orderBy("position", "asc");
				});
		});
		return this;
	}

	/**
	 * Preload leads
	 */
	withLeads(): this {
		this.query.preload("leads");
		return this;
	}

	/**
	 * Execute query and return all results
	 */
	async get(): Promise<Proposal[]> {
		return this.query;
	}

	/**
	 * Execute query and return first result
	 */
	async first(): Promise<Proposal | null> {
		return this.query.first();
	}

	/**
	 * Execute query and return paginated results
	 */
	async paginate(page: number, perPage: number) {
		return this.query.paginate(page, perPage);
	}

	/**
	 * Execute query and return count
	 */
	async count(): Promise<number> {
		const result = await this.query.count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Execute query and return sum of view counts
	 */
	async sumViews(): Promise<number> {
		const result = await this.query.sum("view_count as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Get underlying query for advanced operations
	 */
	getQuery(): ProposalQuery {
		return this.query;
	}
}

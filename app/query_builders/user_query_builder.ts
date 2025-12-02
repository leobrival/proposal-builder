import type { ModelQueryBuilderContract } from "@adonisjs/lucid/types/model";
import User from "#models/user";

type UserQuery = ModelQueryBuilderContract<typeof User, User>;

/**
 * Fluent query builder for User model
 * Provides chainable methods for building complex queries
 */
export default class UserQueryBuilder {
	private query: UserQuery;

	constructor() {
		this.query = User.query();
	}

	/**
	 * Create a new instance
	 */
	static create(): UserQueryBuilder {
		return new UserQueryBuilder();
	}

	/**
	 * Filter by role
	 */
	whereRole(role: "user" | "admin"): this {
		this.query.where("role", role);
		return this;
	}

	/**
	 * Filter by plan
	 */
	wherePlan(plan: "free" | "paid"): this {
		this.query.where("plan", plan);
		return this;
	}

	/**
	 * Filter by active status
	 */
	whereActive(isActive = true): this {
		this.query.where("isActive", isActive);
		return this;
	}

	/**
	 * Filter by inactive status
	 */
	whereInactive(): this {
		return this.whereActive(false);
	}

	/**
	 * Search by name or email
	 */
	search(term: string): this {
		this.query.where((builder) => {
			builder
				.whereILike("firstName", `%${term}%`)
				.orWhereILike("lastName", `%${term}%`)
				.orWhereILike("email", `%${term}%`);
		});
		return this;
	}

	/**
	 * Filter users created after date
	 */
	createdAfter(date: Date): this {
		this.query.where("createdAt", ">=", date);
		return this;
	}

	/**
	 * Filter users created before date
	 */
	createdBefore(date: Date): this {
		this.query.where("createdAt", "<=", date);
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
	 * Preload proposals relationship
	 */
	withProposals(): this {
		this.query.preload("proposals");
		return this;
	}

	/**
	 * Execute query and return all results
	 */
	async get(): Promise<User[]> {
		return this.query;
	}

	/**
	 * Execute query and return first result
	 */
	async first(): Promise<User | null> {
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
	 * Get underlying query for advanced operations
	 */
	getQuery(): UserQuery {
		return this.query;
	}
}

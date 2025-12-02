import User from "#models/user";
import type { PaginatedResult, PaginationOptions } from "./base_repository.js";

/**
 * Filter options for user queries
 */
export interface UserFilters {
	role?: "user" | "admin";
	plan?: "free" | "paid";
	isActive?: boolean;
	search?: string;
}

/**
 * Repository for User model operations
 * Encapsulates all database queries related to users
 */
export default class UserRepository {
	/**
	 * Find a user by ID
	 */
	async findById(id: string): Promise<User | null> {
		return User.find(id);
	}

	/**
	 * Find a user by ID or throw
	 */
	async findByIdOrFail(id: string): Promise<User> {
		return User.findOrFail(id);
	}

	/**
	 * Find all users
	 */
	async findAll(): Promise<User[]> {
		return User.query().orderBy("createdAt", "desc");
	}

	/**
	 * Find a user by email
	 */
	async findByEmail(email: string): Promise<User | null> {
		return User.findBy("email", email);
	}

	/**
	 * Find users with filters
	 */
	async findWithFilters(filters: UserFilters): Promise<User[]> {
		const query = User.query();

		if (filters.role) {
			query.where("role", filters.role);
		}

		if (filters.plan) {
			query.where("plan", filters.plan);
		}

		if (filters.isActive !== undefined) {
			query.where("isActive", filters.isActive);
		}

		if (filters.search) {
			query.where((builder) => {
				builder
					.whereILike("firstName", `%${filters.search}%`)
					.orWhereILike("lastName", `%${filters.search}%`)
					.orWhereILike("email", `%${filters.search}%`);
			});
		}

		return query.orderBy("createdAt", "desc");
	}

	/**
	 * Find users with filters and pagination
	 */
	async findWithFiltersPaginated(
		filters: UserFilters,
		options: PaginationOptions,
	): Promise<PaginatedResult<User>> {
		const query = User.query();

		if (filters.role) {
			query.where("role", filters.role);
		}

		if (filters.plan) {
			query.where("plan", filters.plan);
		}

		if (filters.isActive !== undefined) {
			query.where("isActive", filters.isActive);
		}

		if (filters.search) {
			query.where((builder) => {
				builder
					.whereILike("firstName", `%${filters.search}%`)
					.orWhereILike("lastName", `%${filters.search}%`)
					.orWhereILike("email", `%${filters.search}%`);
			});
		}

		const result = await query
			.orderBy("createdAt", "desc")
			.paginate(options.page, options.perPage);

		return {
			data: result.all(),
			meta: {
				total: result.total,
				perPage: result.perPage,
				currentPage: result.currentPage,
				lastPage: result.lastPage,
				firstPage: result.firstPage,
			},
		};
	}

	/**
	 * Find all admins
	 */
	async findAdmins(): Promise<User[]> {
		return User.query().where("role", "admin").orderBy("createdAt", "desc");
	}

	/**
	 * Find active users
	 */
	async findActive(): Promise<User[]> {
		return User.query().where("isActive", true).orderBy("createdAt", "desc");
	}

	/**
	 * Count all users
	 */
	async count(): Promise<number> {
		const result = await User.query().count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Count users by role
	 */
	async countByRole(role: "user" | "admin"): Promise<number> {
		const result = await User.query().where("role", role).count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Count users by plan
	 */
	async countByPlan(plan: "free" | "paid"): Promise<number> {
		const result = await User.query().where("plan", plan).count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Check if email exists
	 */
	async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
		const query = User.query().where("email", email);

		if (excludeUserId) {
			query.whereNot("id", excludeUserId);
		}

		const user = await query.first();
		return user !== null;
	}

	/**
	 * Get recent users
	 */
	async findRecent(limit = 10): Promise<User[]> {
		return User.query().orderBy("createdAt", "desc").limit(limit);
	}

	/**
	 * Create a new user
	 */
	async create(data: Partial<User>): Promise<User> {
		return User.create(data);
	}

	/**
	 * Delete a user
	 */
	async delete(user: User): Promise<void> {
		await user.delete();
	}

	/**
	 * Check if user exists
	 */
	async exists(id: string): Promise<boolean> {
		const user = await this.findById(id);
		return user !== null;
	}
}

export const userRepository = new UserRepository();

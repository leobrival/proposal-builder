import Proposal from "#models/proposal";
import type { PaginatedResult, PaginationOptions } from "./base_repository.js";

/**
 * Filter options for proposal queries
 */
export interface ProposalFilters {
	userId?: string;
	status?: "draft" | "published" | "archived";
	search?: string;
}

/**
 * Repository for Proposal model operations
 * Encapsulates all database queries related to proposals
 */
export default class ProposalRepository {
	/**
	 * Find a proposal by ID
	 */
	async findById(id: string): Promise<Proposal | null> {
		return Proposal.find(id);
	}

	/**
	 * Find a proposal by ID or throw
	 */
	async findByIdOrFail(id: string): Promise<Proposal> {
		return Proposal.findOrFail(id);
	}

	/**
	 * Find all proposals
	 */
	async findAll(): Promise<Proposal[]> {
		return Proposal.query().orderBy("createdAt", "desc");
	}

	/**
	 * Find proposals by user ID
	 */
	async findByUserId(userId: string): Promise<Proposal[]> {
		return Proposal.query()
			.where("userId", userId)
			.orderBy("updatedAt", "desc");
	}

	/**
	 * Find a proposal by slug
	 */
	async findBySlug(slug: string): Promise<Proposal | null> {
		return Proposal.query().where("slug", slug).first();
	}

	/**
	 * Find a published proposal by slug
	 */
	async findPublishedBySlug(slug: string): Promise<Proposal | null> {
		return Proposal.query()
			.where("slug", slug)
			.where("status", "published")
			.preload("tiers", (query) => {
				query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
					benefitQuery.orderBy("position", "asc");
				});
			})
			.preload("user")
			.first();
	}

	/**
	 * Find a proposal with tiers and benefits
	 */
	async findWithTiers(proposalId: string): Promise<Proposal | null> {
		return Proposal.query()
			.where("id", proposalId)
			.preload("tiers", (query) => {
				query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
					benefitQuery.orderBy("position", "asc");
				});
			})
			.first();
	}

	/**
	 * Find a proposal with tiers for a specific user
	 */
	async findWithTiersForUser(
		proposalId: string,
		userId: string,
	): Promise<Proposal | null> {
		return Proposal.query()
			.where("id", proposalId)
			.where("userId", userId)
			.preload("tiers", (query) => {
				query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
					benefitQuery.orderBy("position", "asc");
				});
			})
			.first();
	}

	/**
	 * Find proposals with filters
	 */
	async findWithFilters(filters: ProposalFilters): Promise<Proposal[]> {
		const query = Proposal.query();

		if (filters.userId) {
			query.where("userId", filters.userId);
		}

		if (filters.status) {
			query.where("status", filters.status);
		}

		if (filters.search) {
			query.where((builder) => {
				builder
					.whereILike("title", `%${filters.search}%`)
					.orWhereILike("projectName", `%${filters.search}%`);
			});
		}

		return query.orderBy("updatedAt", "desc");
	}

	/**
	 * Find proposals with filters and pagination
	 */
	async findWithFiltersPaginated(
		filters: ProposalFilters,
		options: PaginationOptions,
	): Promise<PaginatedResult<Proposal>> {
		const query = Proposal.query();

		if (filters.userId) {
			query.where("userId", filters.userId);
		}

		if (filters.status) {
			query.where("status", filters.status);
		}

		if (filters.search) {
			query.where((builder) => {
				builder
					.whereILike("title", `%${filters.search}%`)
					.orWhereILike("projectName", `%${filters.search}%`);
			});
		}

		const result = await query
			.orderBy("updatedAt", "desc")
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
	 * Find recent proposals for a user
	 */
	async findRecentByUser(userId: string, limit = 5): Promise<Proposal[]> {
		return Proposal.query()
			.where("userId", userId)
			.orderBy("updatedAt", "desc")
			.limit(limit);
	}

	/**
	 * Find published proposals
	 */
	async findPublished(): Promise<Proposal[]> {
		return Proposal.query()
			.where("status", "published")
			.orderBy("publishedAt", "desc");
	}

	/**
	 * Count all proposals
	 */
	async count(): Promise<number> {
		const result = await Proposal.query().count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Count proposals by user
	 */
	async countByUser(userId: string): Promise<number> {
		const result = await Proposal.query()
			.where("userId", userId)
			.count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Count proposals by status
	 */
	async countByStatus(
		status: "draft" | "published" | "archived",
	): Promise<number> {
		const result = await Proposal.query()
			.where("status", status)
			.count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Sum view counts for a user
	 */
	async sumViewsByUser(userId: string): Promise<number> {
		const result = await Proposal.query()
			.where("userId", userId)
			.sum("view_count as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Get recent proposals globally
	 */
	async findRecent(limit = 10): Promise<Proposal[]> {
		return Proposal.query().orderBy("createdAt", "desc").limit(limit);
	}

	/**
	 * Increment view count
	 */
	async incrementViewCount(proposalId: string): Promise<void> {
		const proposal = await this.findById(proposalId);
		if (proposal) {
			proposal.viewCount = (proposal.viewCount || 0) + 1;
			await proposal.save();
		}
	}

	/**
	 * Create a new proposal
	 */
	async create(data: Partial<Proposal>): Promise<Proposal> {
		return Proposal.create(data);
	}

	/**
	 * Delete a proposal
	 */
	async delete(proposal: Proposal): Promise<void> {
		await proposal.delete();
	}

	/**
	 * Check if proposal exists
	 */
	async exists(id: string): Promise<boolean> {
		const proposal = await this.findById(id);
		return proposal !== null;
	}
}

export const proposalRepository = new ProposalRepository();

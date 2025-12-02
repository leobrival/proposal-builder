import { DateTime } from "luxon";
import { ProposalServiceContract } from "#contracts/proposal_service_contract";
import {
	ProposalNotFoundException,
	UnauthorizedProposalAccessException,
} from "#exceptions/index";
import Benefit from "#models/benefit";
import Proposal from "#models/proposal";
import Tier from "#models/tier";
import type User from "#models/user";
import planLimitsService from "#services/plan_limits_service";

/**
 * Data structure for creating a new proposal
 */
export interface CreateProposalData {
	title: string;
	description?: string | null;
	projectName: string;
	projectDescription?: string | null;
	contactEmail: string;
	contactPhone?: string | null;
	logoUrl?: string | null;
	coverImageUrl?: string | null;
	eventStartDate?: string | null;
	eventEndDate?: string | null;
	eventVenueName?: string | null;
	eventAddress?: string | null;
	eventCity?: string | null;
	eventCountry?: string | null;
	eventCategory?: string | null;
	eventTags?: string[];
	eventFormat?: "in_person" | "online" | "hybrid" | null;
	eventExpectedAttendees?: number | null;
	organizerName?: string | null;
	organizerWebsite?: string | null;
}

/**
 * Data structure for updating a proposal
 */
export interface UpdateProposalData extends Partial<CreateProposalData> {
	tiers?: TierData[];
}

/**
 * Data structure for a tier
 */
export interface TierData {
	id?: string;
	name: string;
	price: number;
	currency?: string;
	description?: string | null;
	isFeatured?: boolean;
	maxSponsors?: number | null;
	position: number;
	benefits?: BenefitData[];
}

/**
 * Data structure for a benefit
 */
export interface BenefitData {
	id?: string;
	description: string;
	position: number;
}

/**
 * Parse date string to DateTime
 * @param dateStr - ISO date string or null/undefined
 * @returns Parsed DateTime or null if invalid
 */
function parseDate(dateStr: string | null | undefined): DateTime | null {
	if (!dateStr) return null;
	try {
		const dt = DateTime.fromISO(dateStr);
		if (dt.isValid) return dt;
		return null;
	} catch {
		return null;
	}
}

/**
 * Service responsible for managing proposal CRUD operations
 * Handles proposals, tiers, and benefits management
 * Implements ProposalServiceContract for dependency injection support
 */
class ProposalService extends ProposalServiceContract {
	/**
	 * Get all proposals for a user
	 * @param userId - User ID to filter proposals
	 * @returns Array of proposals ordered by last update
	 */
	async getAllByUser(userId: string): Promise<Proposal[]> {
		return Proposal.query()
			.where("userId", userId)
			.orderBy("updatedAt", "desc");
	}

	/**
	 * Get recent proposals for a user with limit
	 * @param userId - User ID to filter proposals
	 * @param limit - Maximum number of proposals to return
	 * @returns Array of recent proposals
	 */
	async getRecentByUser(userId: string, limit = 5): Promise<Proposal[]> {
		return Proposal.query()
			.where("userId", userId)
			.orderBy("updatedAt", "desc")
			.limit(limit);
	}

	/**
	 * Get a proposal by ID for a specific user
	 * @param proposalId - Proposal UUID
	 * @param userId - Owner user ID
	 * @returns Proposal if found and owned by user
	 * @throws ProposalNotFoundException if proposal not found
	 * @throws UnauthorizedProposalAccessException if user doesn't own the proposal
	 */
	async getByIdForUser(proposalId: string, userId: string): Promise<Proposal> {
		const proposal = await Proposal.find(proposalId);

		if (!proposal) {
			throw new ProposalNotFoundException(proposalId);
		}

		if (proposal.userId !== userId) {
			throw new UnauthorizedProposalAccessException(proposalId);
		}

		return proposal;
	}

	/**
	 * Get a proposal by ID for a specific user, returns null if not found
	 * @param proposalId - Proposal UUID
	 * @param userId - Owner user ID
	 * @returns Proposal if found and owned by user, null otherwise
	 */
	async findByIdForUser(
		proposalId: string,
		userId: string,
	): Promise<Proposal | null> {
		return Proposal.query()
			.where("id", proposalId)
			.where("userId", userId)
			.first();
	}

	/**
	 * Get a proposal with tiers and benefits preloaded
	 * @param proposalId - Proposal UUID
	 * @param userId - Owner user ID
	 * @returns Proposal with nested tiers and benefits
	 * @throws ProposalNotFoundException if proposal not found
	 * @throws UnauthorizedProposalAccessException if user doesn't own the proposal
	 */
	async getWithTiers(proposalId: string, userId: string): Promise<Proposal> {
		const proposal = await Proposal.query()
			.where("id", proposalId)
			.preload("tiers", (query) => {
				query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
					benefitQuery.orderBy("position", "asc");
				});
			})
			.first();

		if (!proposal) {
			throw new ProposalNotFoundException(proposalId);
		}

		if (proposal.userId !== userId) {
			throw new UnauthorizedProposalAccessException(proposalId);
		}

		return proposal;
	}

	/**
	 * Get a proposal with tiers and benefits, returns null if not found
	 * @param proposalId - Proposal UUID
	 * @param userId - Owner user ID
	 * @returns Proposal with nested tiers and benefits, or null
	 */
	async findWithTiers(
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
	 * Get a published proposal by slug for public viewing
	 * @param slug - Proposal slug
	 * @returns Published proposal with tiers, benefits, and user
	 * @throws ProposalNotFoundException if proposal not found or not published
	 */
	async getPublishedBySlug(slug: string): Promise<Proposal> {
		const proposal = await Proposal.query()
			.where("slug", slug)
			.where("status", "published")
			.preload("tiers", (query) => {
				query.orderBy("position", "asc").preload("benefits", (benefitQuery) => {
					benefitQuery.orderBy("position", "asc");
				});
			})
			.preload("user")
			.first();

		if (!proposal) {
			throw new ProposalNotFoundException(slug, "slug");
		}

		return proposal;
	}

	/**
	 * Get a published proposal by slug, returns null if not found
	 * @param slug - Proposal slug
	 * @returns Published proposal or null
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
	 * Create a new proposal for a user
	 * Checks plan limits before creation (2 proposals for free plan)
	 * @param user - Owner user
	 * @param data - Proposal creation data
	 * @returns Created proposal
	 * @throws Error if user has reached proposal limit
	 */
	async create(user: User, data: CreateProposalData): Promise<Proposal> {
		// Check plan limits before creating
		const limitCheck = await planLimitsService.canCreateProposal(user);
		if (!limitCheck.allowed) {
			throw new Error(
				limitCheck.message ||
					`Limite de propositions atteinte (${limitCheck.limit})`
			);
		}

		const { eventStartDate, eventEndDate, eventTags, ...restData } = data;

		return Proposal.create({
			...restData,
			userId: user.id,
			eventStartDate: parseDate(eventStartDate),
			eventEndDate: parseDate(eventEndDate),
			eventTags: eventTags || [],
		});
	}

	/**
	 * Check if user can create more proposals
	 * @param user - User to check
	 * @returns Limit check result with current usage
	 */
	async canCreate(user: User): Promise<{
		allowed: boolean;
		current: number;
		limit: number;
		remaining: number;
		message?: string;
	}> {
		return planLimitsService.canCreateProposal(user);
	}

	/**
	 * Update an existing proposal
	 * @param proposal - Proposal to update
	 * @param data - Update data including optional tiers
	 * @returns Updated proposal
	 */
	async update(
		proposal: Proposal,
		data: UpdateProposalData,
	): Promise<Proposal> {
		const {
			tiers: tiersData,
			eventStartDate,
			eventEndDate,
			eventTags,
			...proposalData
		} = data;

		// Merge regular fields
		proposal.merge(proposalData);

		// Handle date fields explicitly
		if (eventStartDate !== undefined) {
			proposal.eventStartDate = parseDate(eventStartDate);
		}
		if (eventEndDate !== undefined) {
			proposal.eventEndDate = parseDate(eventEndDate);
		}
		if (eventTags !== undefined) {
			proposal.eventTags = eventTags || [];
		}

		await proposal.save();

		// Update tiers if provided
		if (tiersData) {
			await this.updateTiers(proposal, tiersData);
		}

		return proposal;
	}

	/**
	 * Update tiers for a proposal
	 * @param proposal - Parent proposal
	 * @param tiersData - Array of tier data to sync
	 */
	private async updateTiers(
		proposal: Proposal,
		tiersData: TierData[],
	): Promise<void> {
		const existingTierIds = new Set<string>();

		for (const tierData of tiersData) {
			const { benefits: benefitsData, ...tierFields } = tierData;

			let tier: Tier;
			if (tierData.id) {
				const existingTier = await Tier.find(tierData.id);
				if (existingTier && existingTier.proposalId === proposal.id) {
					tier = existingTier;
					tier.merge(tierFields);
					await tier.save();
				} else {
					tier = await Tier.create({
						...tierFields,
						proposalId: proposal.id,
					});
				}
			} else {
				tier = await Tier.create({
					...tierFields,
					proposalId: proposal.id,
				});
			}
			existingTierIds.add(tier.id);

			// Update benefits
			if (benefitsData) {
				await this.updateBenefits(tier, benefitsData);
			}
		}

		// Delete removed tiers
		await Tier.query()
			.where("proposalId", proposal.id)
			.whereNotIn("id", Array.from(existingTierIds))
			.delete();
	}

	/**
	 * Update benefits for a tier
	 * @param tier - Parent tier
	 * @param benefitsData - Array of benefit data to sync
	 */
	private async updateBenefits(
		tier: Tier,
		benefitsData: BenefitData[],
	): Promise<void> {
		const existingBenefitIds = new Set<string>();

		for (const benefitData of benefitsData) {
			let benefit: Benefit;
			if (benefitData.id) {
				const existingBenefit = await Benefit.find(benefitData.id);
				if (existingBenefit && existingBenefit.tierId === tier.id) {
					benefit = existingBenefit;
					benefit.merge(benefitData);
					await benefit.save();
				} else {
					benefit = await Benefit.create({
						...benefitData,
						tierId: tier.id,
					});
				}
			} else {
				benefit = await Benefit.create({
					...benefitData,
					tierId: tier.id,
				});
			}
			existingBenefitIds.add(benefit.id);
		}

		// Delete removed benefits
		await Benefit.query()
			.where("tierId", tier.id)
			.whereNotIn("id", Array.from(existingBenefitIds))
			.delete();
	}

	/**
	 * Delete a proposal and all related data
	 * @param proposal - Proposal to delete
	 */
	async delete(proposal: Proposal): Promise<void> {
		await proposal.delete();
	}

	/**
	 * Publish a proposal, making it publicly accessible
	 * @param proposal - Proposal to publish
	 * @returns Updated proposal with published status
	 */
	async publish(proposal: Proposal): Promise<Proposal> {
		proposal.status = "published";
		proposal.publishedAt = DateTime.now();
		await proposal.save();
		return proposal;
	}

	/**
	 * Unpublish a proposal, reverting to draft status
	 * @param proposal - Proposal to unpublish
	 * @returns Updated proposal with draft status
	 */
	async unpublish(proposal: Proposal): Promise<Proposal> {
		proposal.status = "draft";
		await proposal.save();
		return proposal;
	}

	/**
	 * Increment view count for analytics
	 * @param proposal - Proposal that was viewed
	 */
	async incrementViewCount(proposal: Proposal): Promise<void> {
		proposal.viewCount = (proposal.viewCount || 0) + 1;
		await proposal.save();
	}

	/**
	 * Update page layout configuration for builder
	 * @param proposal - Proposal to update
	 * @param pageLayout - Layout configuration object
	 * @returns Updated proposal
	 */
	async updatePageLayout(
		proposal: Proposal,
		pageLayout: Record<string, unknown> | null,
	): Promise<Proposal> {
		proposal.pageLayout = pageLayout;
		await proposal.save();
		return proposal;
	}
}

export default new ProposalService();

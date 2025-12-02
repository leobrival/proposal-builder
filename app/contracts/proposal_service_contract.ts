import type Proposal from "#models/proposal";
import type User from "#models/user";
import type {
	CreateProposalData,
	UpdateProposalData,
} from "#services/proposal_service";

/**
 * Contract for Proposal Service
 * Defines the interface for proposal management operations.
 * Enables dependency injection and easy mocking in tests.
 */
export abstract class ProposalServiceContract {
	/**
	 * Get all proposals for a user
	 */
	abstract getAllByUser(userId: string): Promise<Proposal[]>;

	/**
	 * Get recent proposals for a user with limit
	 */
	abstract getRecentByUser(userId: string, limit?: number): Promise<Proposal[]>;

	/**
	 * Get a proposal by ID for a specific user
	 * @throws ProposalNotFoundException if proposal not found
	 * @throws UnauthorizedProposalAccessException if user doesn't own the proposal
	 */
	abstract getByIdForUser(
		proposalId: string,
		userId: string,
	): Promise<Proposal>;

	/**
	 * Get a proposal by ID for a specific user, returns null if not found
	 */
	abstract findByIdForUser(
		proposalId: string,
		userId: string,
	): Promise<Proposal | null>;

	/**
	 * Get a proposal with tiers and benefits preloaded
	 * @throws ProposalNotFoundException if proposal not found
	 * @throws UnauthorizedProposalAccessException if user doesn't own the proposal
	 */
	abstract getWithTiers(proposalId: string, userId: string): Promise<Proposal>;

	/**
	 * Get a proposal with tiers and benefits, returns null if not found
	 */
	abstract findWithTiers(
		proposalId: string,
		userId: string,
	): Promise<Proposal | null>;

	/**
	 * Get a published proposal by slug for public viewing
	 * @throws ProposalNotFoundException if proposal not found or not published
	 */
	abstract getPublishedBySlug(slug: string): Promise<Proposal>;

	/**
	 * Get a published proposal by slug, returns null if not found
	 */
	abstract findPublishedBySlug(slug: string): Promise<Proposal | null>;

	/**
	 * Create a new proposal for a user
	 */
	abstract create(user: User, data: CreateProposalData): Promise<Proposal>;

	/**
	 * Update an existing proposal
	 */
	abstract update(
		proposal: Proposal,
		data: UpdateProposalData,
	): Promise<Proposal>;

	/**
	 * Delete a proposal and all related data
	 */
	abstract delete(proposal: Proposal): Promise<void>;

	/**
	 * Publish a proposal, making it publicly accessible
	 */
	abstract publish(proposal: Proposal): Promise<Proposal>;

	/**
	 * Unpublish a proposal, reverting to draft status
	 */
	abstract unpublish(proposal: Proposal): Promise<Proposal>;

	/**
	 * Increment view count for analytics
	 */
	abstract incrementViewCount(proposal: Proposal): Promise<void>;

	/**
	 * Update page layout configuration for builder
	 */
	abstract updatePageLayout(
		proposal: Proposal,
		pageLayout: Record<string, unknown> | null,
	): Promise<Proposal>;
}

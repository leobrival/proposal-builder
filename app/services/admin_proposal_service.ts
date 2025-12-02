import {
	InvalidProposalStatusException,
	ProposalNotFoundException,
} from "#exceptions/index";
import AdminAction, { type AdminActionType } from "#models/admin_action";
import Proposal from "#models/proposal";

/**
 * Valid proposal status values
 */
export type ProposalStatus = "published" | "draft" | "archived";

/**
 * Valid status values for validation
 */
const VALID_STATUSES: ProposalStatus[] = ["published", "draft", "archived"];

/**
 * Service responsible for admin-level proposal management
 * Handles status changes, deletions, and admin action logging
 */
class AdminProposalService {
	/**
	 * Update proposal status (published/draft/archived)
	 * @param adminId - ID of the admin performing the action
	 * @param proposalId - ID of the proposal to update
	 * @param status - New status to apply
	 * @returns Updated proposal with new status
	 * @throws InvalidProposalStatusException if status is invalid
	 * @throws ProposalNotFoundException if proposal not found
	 */
	async updateStatus(
		adminId: string,
		proposalId: string,
		status: ProposalStatus,
	): Promise<{ id: string; status: ProposalStatus }> {
		if (!VALID_STATUSES.includes(status)) {
			throw new InvalidProposalStatusException(status);
		}

		const proposal = await Proposal.find(proposalId);
		if (!proposal) {
			throw new ProposalNotFoundException(proposalId);
		}

		const oldStatus = proposal.status;
		proposal.status = status;
		await proposal.save();

		// Determine action type for logging
		const actionType = this.determineActionType(oldStatus, status);

		// Log admin action
		await AdminAction.create({
			adminId,
			actionType,
			targetType: "proposal",
			targetId: proposal.id,
			metadata: { oldStatus, newStatus: status },
		});

		return { id: proposal.id, status: proposal.status as ProposalStatus };
	}

	/**
	 * Determine the admin action type based on status change
	 * @param oldStatus - Previous status
	 * @param newStatus - New status
	 * @returns Appropriate admin action type
	 */
	private determineActionType(
		oldStatus: string,
		newStatus: ProposalStatus,
	): AdminActionType {
		if (newStatus === "published") {
			return "proposal_publish";
		}
		if (newStatus === "draft" && oldStatus === "published") {
			return "proposal_unpublish";
		}
		if (newStatus === "archived") {
			return "proposal_archive";
		}
		if (oldStatus === "archived") {
			return "proposal_restore";
		}
		return "proposal_status_change";
	}

	/**
	 * Delete a proposal permanently
	 * @param adminId - ID of the admin performing the action
	 * @param proposalId - ID of the proposal to delete
	 * @throws ProposalNotFoundException if proposal not found
	 */
	async deleteProposal(adminId: string, proposalId: string): Promise<void> {
		const proposal = await Proposal.find(proposalId);
		if (!proposal) {
			throw new ProposalNotFoundException(proposalId);
		}

		// Log action before deletion to preserve metadata
		await AdminAction.create({
			adminId,
			actionType: "proposal_delete",
			targetType: "proposal",
			targetId: proposal.id,
			metadata: {
				deletedProposalTitle: proposal.title,
				deletedProposalSlug: proposal.slug,
			},
		});

		await proposal.delete();
	}

	/**
	 * Find a proposal by ID
	 * @param proposalId - Proposal UUID
	 * @returns Proposal if found, null otherwise
	 */
	async findById(proposalId: string): Promise<Proposal | null> {
		return Proposal.find(proposalId);
	}

	/**
	 * Get a proposal by ID
	 * @param proposalId - Proposal UUID
	 * @returns Proposal
	 * @throws ProposalNotFoundException if not found
	 */
	async getById(proposalId: string): Promise<Proposal> {
		const proposal = await Proposal.find(proposalId);
		if (!proposal) {
			throw new ProposalNotFoundException(proposalId);
		}
		return proposal;
	}

	/**
	 * Get all proposals ordered by creation date
	 * @returns Array of all proposals
	 */
	async getAll(): Promise<Proposal[]> {
		return Proposal.query().orderBy("createdAt", "desc");
	}

	/**
	 * Get proposals filtered by status
	 * @param status - Status to filter by
	 * @returns Array of proposals with matching status
	 */
	async getByStatus(status: ProposalStatus): Promise<Proposal[]> {
		return Proposal.query()
			.where("status", status)
			.orderBy("createdAt", "desc");
	}

	/**
	 * Count proposals by status
	 * @param status - Optional status to filter
	 * @returns Total count of proposals
	 */
	async countByStatus(status?: ProposalStatus): Promise<number> {
		const query = Proposal.query();
		if (status) {
			query.where("status", status);
		}
		const result = await query.count("* as total");
		return Number(result[0].$extras.total) || 0;
	}
}

export default new AdminProposalService();

import type Proposal from "#models/proposal";
import type User from "#models/user";
import BasePolicy, { type PolicyResponse } from "./base_policy.js";

/**
 * Policy for proposal authorization
 * Handles all permission checks related to proposals
 */
export default class ProposalPolicy extends BasePolicy {
	/**
	 * Check if user can view a proposal
	 * Users can view their own proposals, admins can view all
	 */
	view(user: User, proposal: Proposal): PolicyResponse {
		if (this.isAdmin(user)) {
			return this.allow();
		}

		if (proposal.userId === user.id) {
			return this.allow();
		}

		return this.deny("Vous ne pouvez pas voir cette proposition");
	}

	/**
	 * Check if user can create a proposal
	 * All active users can create proposals
	 */
	create(user: User): PolicyResponse {
		if (!this.isActive(user)) {
			return this.deny("Votre compte est desactive");
		}

		return this.allow();
	}

	/**
	 * Check if user can update a proposal
	 * Only owners can update, admins cannot edit others' proposals
	 */
	update(user: User, proposal: Proposal): PolicyResponse {
		if (!this.isActive(user)) {
			return this.deny("Votre compte est desactive");
		}

		if (proposal.userId !== user.id) {
			return this.deny("Vous ne pouvez pas modifier cette proposition");
		}

		return this.allow();
	}

	/**
	 * Check if user can delete a proposal
	 * Owners can delete their own, admins can delete any
	 */
	delete(user: User, proposal: Proposal): PolicyResponse {
		if (!this.isActive(user)) {
			return this.deny("Votre compte est desactive");
		}

		if (this.isAdmin(user)) {
			return this.allow();
		}

		if (proposal.userId !== user.id) {
			return this.deny("Vous ne pouvez pas supprimer cette proposition");
		}

		return this.allow();
	}

	/**
	 * Check if user can publish a proposal
	 * Only owners can publish their own proposals
	 */
	publish(user: User, proposal: Proposal): PolicyResponse {
		if (!this.isActive(user)) {
			return this.deny("Votre compte est desactive");
		}

		if (proposal.userId !== user.id) {
			return this.deny("Vous ne pouvez pas publier cette proposition");
		}

		if (proposal.status === "published") {
			return this.deny("Cette proposition est deja publiee");
		}

		return this.allow();
	}

	/**
	 * Check if user can unpublish a proposal
	 * Only owners can unpublish their own proposals
	 */
	unpublish(user: User, proposal: Proposal): PolicyResponse {
		if (!this.isActive(user)) {
			return this.deny("Votre compte est desactive");
		}

		if (proposal.userId !== user.id) {
			return this.deny("Vous ne pouvez pas depublier cette proposition");
		}

		if (proposal.status !== "published") {
			return this.deny("Cette proposition n'est pas publiee");
		}

		return this.allow();
	}

	/**
	 * Check if user can manage tiers on a proposal
	 */
	manageTiers(user: User, proposal: Proposal): PolicyResponse {
		return this.update(user, proposal);
	}
}

export const proposalPolicy = new ProposalPolicy();

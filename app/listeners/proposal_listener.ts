import logger from "@adonisjs/core/services/logger";
import type {
	ProposalCreatedEventData,
	ProposalDeletedEventData,
	ProposalPublishedEventData,
	ProposalUnpublishedEventData,
	ProposalUpdatedEventData,
	ProposalViewedEventData,
} from "#events/index";
import { emitter } from "#events/index";

/**
 * Proposal event listeners
 * Handles side effects for proposal-related events
 */
export function registerProposalListeners(): void {
	/**
	 * Handle new proposal creation
	 * - Log the creation
	 * - Could trigger onboarding tips
	 */
	emitter.on("proposal:created", async (data: ProposalCreatedEventData) => {
		logger.info(
			{ proposalId: data.proposal.id, userId: data.user.id },
			"New proposal created",
		);

		// TODO: Track analytics event
	});

	/**
	 * Handle proposal updates
	 * - Log the update
	 */
	emitter.on("proposal:updated", async (data: ProposalUpdatedEventData) => {
		logger.info(
			{ proposalId: data.proposal.id, userId: data.user.id },
			"Proposal updated",
		);

		// TODO: Track analytics event
	});

	/**
	 * Handle proposal publication
	 * - Log the publication
	 * - Could notify subscribers
	 */
	emitter.on("proposal:published", async (data: ProposalPublishedEventData) => {
		logger.info(
			{
				proposalId: data.proposal.id,
				slug: data.proposal.slug,
				userId: data.user.id,
			},
			"Proposal published",
		);

		// TODO: Notify followers/subscribers
		// TODO: Track analytics event
	});

	/**
	 * Handle proposal unpublication
	 * - Log the unpublication
	 */
	emitter.on(
		"proposal:unpublished",
		async (data: ProposalUnpublishedEventData) => {
			logger.info(
				{ proposalId: data.proposal.id, userId: data.user.id },
				"Proposal unpublished",
			);

			// TODO: Track analytics event
		},
	);

	/**
	 * Handle proposal deletion
	 * - Log the deletion
	 * - Could clean up related data
	 */
	emitter.on("proposal:deleted", async (data: ProposalDeletedEventData) => {
		logger.info(
			{ proposalId: data.proposalId, title: data.title, userId: data.userId },
			"Proposal deleted",
		);

		// TODO: Clean up related media
		// TODO: Track analytics event
	});

	/**
	 * Handle proposal view
	 * - Could be used for analytics
	 */
	emitter.on("proposal:viewed", async (data: ProposalViewedEventData) => {
		logger.debug({ proposalId: data.proposal.id }, "Proposal viewed");

		// TODO: Track detailed analytics
	});
}

/**
 * Events barrel export
 */

export type {
	AdminProposalUpdatedEventData,
	// Admin events
	AdminUserUpdatedEventData,
	EventMap,
	// Proposal events
	ProposalCreatedEventData,
	ProposalDeletedEventData,
	ProposalPublishedEventData,
	ProposalUnpublishedEventData,
	ProposalUpdatedEventData,
	ProposalViewedEventData,
	UserDeletedEventData,
	UserLoggedInEventData,
	UserPasswordChangedEventData,
	UserProfileUpdatedEventData,
	// User events
	UserRegisteredEventData,
} from "./emitter.js";
export { default as emitter } from "./emitter.js";

import Emittery from "emittery";
import type Proposal from "#models/proposal";
import type User from "#models/user";

/**
 * Event data types for user-related events
 */
export interface UserRegisteredEventData {
	user: User;
	timestamp: Date;
}

export interface UserLoggedInEventData {
	user: User;
	timestamp: Date;
	ipAddress?: string;
}

export interface UserProfileUpdatedEventData {
	user: User;
	changes: Partial<{ firstName: string; lastName: string; email: string }>;
	timestamp: Date;
}

export interface UserPasswordChangedEventData {
	user: User;
	timestamp: Date;
}

export interface UserDeletedEventData {
	userId: string;
	email: string;
	timestamp: Date;
}

/**
 * Event data types for proposal-related events
 */
export interface ProposalCreatedEventData {
	proposal: Proposal;
	user: User;
	timestamp: Date;
}

export interface ProposalUpdatedEventData {
	proposal: Proposal;
	user: User;
	timestamp: Date;
}

export interface ProposalPublishedEventData {
	proposal: Proposal;
	user: User;
	timestamp: Date;
}

export interface ProposalUnpublishedEventData {
	proposal: Proposal;
	user: User;
	timestamp: Date;
}

export interface ProposalDeletedEventData {
	proposalId: string;
	title: string;
	userId: string;
	timestamp: Date;
}

export interface ProposalViewedEventData {
	proposal: Proposal;
	timestamp: Date;
	ipAddress?: string;
	userAgent?: string;
}

/**
 * Event data types for admin-related events
 */
export interface AdminUserUpdatedEventData {
	adminId: string;
	targetUserId: string;
	action: "plan_change" | "role_change" | "block" | "unblock" | "delete";
	oldValue?: string | boolean;
	newValue?: string | boolean;
	timestamp: Date;
}

export interface AdminProposalUpdatedEventData {
	adminId: string;
	proposalId: string;
	action: "status_change" | "delete";
	oldValue?: string;
	newValue?: string;
	timestamp: Date;
}

/**
 * All event types map
 */
export interface EventMap {
	// User events
	"user:registered": UserRegisteredEventData;
	"user:logged_in": UserLoggedInEventData;
	"user:profile_updated": UserProfileUpdatedEventData;
	"user:password_changed": UserPasswordChangedEventData;
	"user:deleted": UserDeletedEventData;

	// Proposal events
	"proposal:created": ProposalCreatedEventData;
	"proposal:updated": ProposalUpdatedEventData;
	"proposal:published": ProposalPublishedEventData;
	"proposal:unpublished": ProposalUnpublishedEventData;
	"proposal:deleted": ProposalDeletedEventData;
	"proposal:viewed": ProposalViewedEventData;

	// Admin events
	"admin:user_updated": AdminUserUpdatedEventData;
	"admin:proposal_updated": AdminProposalUpdatedEventData;
}

/**
 * Type-safe event emitter instance
 */
const emitter = new Emittery<EventMap>();

export default emitter;

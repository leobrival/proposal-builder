/**
 * Plan Limits Contract
 * Centralized business logic for plan-based limitations.
 * Single source of truth for all feature limits across the application.
 */

import type User from "#models/user";

/**
 * Plan types
 */
export type PlanType = "free" | "pro" | "enterprise";

/**
 * Plan limits configuration
 */
export interface PlanLimits {
	/** Plan identifier */
	plan: PlanType;

	/** Maximum number of proposals */
	maxProposals: number;

	/** Maximum number of API keys */
	maxApiKeys: number;

	/** Custom domains allowed */
	maxCustomDomains: number;

	/** Team members allowed */
	maxTeamMembers: number;

	/** Can remove Spons Easy branding */
	canRemoveBranding: boolean;

	/** Has access to analytics dashboard */
	hasAnalytics: boolean;

	/** Has priority support */
	hasPrioritySupport: boolean;

	/** Can use custom templates */
	hasCustomTemplates: boolean;

	/** Has API/MCP access */
	hasApiAccess: boolean;
}

/**
 * Plan configurations - Single source of truth
 */
export const PLAN_CONFIGS: Record<PlanType, PlanLimits> = {
	free: {
		plan: "free",
		maxProposals: 2,
		maxApiKeys: 1,
		maxCustomDomains: 0,
		maxTeamMembers: 1,
		canRemoveBranding: false,
		hasAnalytics: false,
		hasPrioritySupport: false,
		hasCustomTemplates: false,
		hasApiAccess: true,
	},
	pro: {
		plan: "pro",
		maxProposals: 50,
		maxApiKeys: 5,
		maxCustomDomains: 1,
		maxTeamMembers: 3,
		canRemoveBranding: true,
		hasAnalytics: true,
		hasPrioritySupport: true,
		hasCustomTemplates: true,
		hasApiAccess: true,
	},
	enterprise: {
		plan: "enterprise",
		maxProposals: -1, // unlimited
		maxApiKeys: 20,
		maxCustomDomains: -1, // unlimited
		maxTeamMembers: -1, // unlimited
		canRemoveBranding: true,
		hasAnalytics: true,
		hasPrioritySupport: true,
		hasCustomTemplates: true,
		hasApiAccess: true,
	},
};

/**
 * Limit check result
 */
export interface LimitCheckResult {
	allowed: boolean;
	current: number;
	limit: number;
	remaining: number;
	message?: string;
}

/**
 * Plan Limits Service Contract
 */
export abstract class PlanLimitsContract {
	/**
	 * Get user's current plan type
	 */
	abstract getUserPlan(user: User): PlanType;

	/**
	 * Get plan limits for a user
	 */
	abstract getPlanLimits(user: User): PlanLimits;

	/**
	 * Check if user can create more proposals
	 */
	abstract canCreateProposal(user: User): Promise<LimitCheckResult>;

	/**
	 * Check if user can create more API keys
	 */
	abstract canCreateApiKey(user: User): Promise<LimitCheckResult>;

	/**
	 * Check if user can add custom domain
	 */
	abstract canAddCustomDomain(user: User): Promise<LimitCheckResult>;

	/**
	 * Check if user can add team member
	 */
	abstract canAddTeamMember(user: User): Promise<LimitCheckResult>;

	/**
	 * Check if user has access to a specific feature
	 */
	abstract hasFeatureAccess(
		user: User,
		feature: keyof Omit<PlanLimits, "plan" | "maxProposals" | "maxApiKeys" | "maxCustomDomains" | "maxTeamMembers">
	): boolean;

	/**
	 * Get usage summary for a user
	 */
	abstract getUsageSummary(user: User): Promise<{
		proposals: LimitCheckResult;
		apiKeys: LimitCheckResult;
		customDomains: LimitCheckResult;
	}>;

	/**
	 * Check if a limit is unlimited (-1)
	 */
	abstract isUnlimited(limit: number): boolean;
}

/**
 * Plan Limits Service
 * Centralized business logic for plan-based limitations.
 * Single source of truth for all feature limits across the application.
 * Integrated with PaymentService for subscription sync.
 */

import {
	type LimitCheckResult,
	PLAN_CONFIGS,
	type PlanLimits,
	PlanLimitsContract,
	type PlanType,
} from "#contracts/plan_limits_contract";
import ApiKey from "#models/api_key";
import Proposal from "#models/proposal";
import type User from "#models/user";

/**
 * Plan Limits Service Implementation
 * Links to PaymentService for subscription-based plan resolution
 */
class PlanLimitsService extends PlanLimitsContract {
	/**
	 * Get user's current plan type
	 * Uses user.plan field for quick sync with payment webhooks
	 */
	getUserPlan(user: User): PlanType {
		// Map user.plan field to PlanType
		// The user.plan field is kept in sync by PaymentService webhooks
		switch (user.plan) {
			case "paid":
				// For now, assume paid = pro
				// Enterprise is determined by subscription check
				return "pro";
			default:
				return "free";
		}
	}

	/**
	 * Get user's plan type from subscription (async version for detailed check)
	 * Use this when you need to verify enterprise vs pro
	 */
	async getUserPlanFromSubscription(user: User): Promise<PlanType> {
		// Import dynamically to avoid circular dependencies
		const { default: Subscription } = await import("#models/subscription");

		const subscription = await Subscription.query()
			.where("userId", user.id)
			.whereIn("status", ["active", "trialing"])
			.orderBy("createdAt", "desc")
			.first();

		if (!subscription) {
			return "free";
		}

		// Map subscription plan to PlanType
		switch (subscription.plan) {
			case "enterprise":
				return "enterprise";
			case "pro":
				return "pro";
			default:
				return "free";
		}
	}

	/**
	 * Get user's detailed plan info including subscription status
	 * Useful for displaying billing information in UI
	 */
	async getDetailedPlanInfo(user: User): Promise<{
		plan: PlanType;
		limits: PlanLimits;
		subscription: {
			active: boolean;
			status: string | null;
			expiresAt: Date | null;
			cancelAtPeriodEnd: boolean;
		};
	}> {
		const { default: Subscription } = await import("#models/subscription");

		const subscription = await Subscription.query()
			.where("userId", user.id)
			.orderBy("createdAt", "desc")
			.first();

		let plan: PlanType = "free";
		let subscriptionInfo = {
			active: false,
			status: null as string | null,
			expiresAt: null as Date | null,
			cancelAtPeriodEnd: false,
		};

		if (subscription) {
			subscriptionInfo = {
				active: ["active", "trialing"].includes(subscription.status),
				status: subscription.status,
				expiresAt: subscription.currentPeriodEnd?.toJSDate() ?? null,
				cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
			};

			if (subscriptionInfo.active) {
				switch (subscription.plan) {
					case "enterprise":
						plan = "enterprise";
						break;
					case "pro":
						plan = "pro";
						break;
				}
			}
		}

		return {
			plan,
			limits: PLAN_CONFIGS[plan],
			subscription: subscriptionInfo,
		};
	}

	/**
	 * Get plan limits for a user
	 */
	getPlanLimits(user: User): PlanLimits {
		const plan = this.getUserPlan(user);
		return PLAN_CONFIGS[plan];
	}

	/**
	 * Check if user can create more proposals
	 */
	async canCreateProposal(user: User): Promise<LimitCheckResult> {
		const limits = this.getPlanLimits(user);

		// Unlimited
		if (this.isUnlimited(limits.maxProposals)) {
			return {
				allowed: true,
				current: 0,
				limit: -1,
				remaining: -1,
			};
		}

		// Count current proposals
		const countResult = await Proposal.query()
			.where("userId", user.id)
			.count("* as total");

		const current = Number(countResult[0].$extras.total);
		const remaining = Math.max(0, limits.maxProposals - current);

		return {
			allowed: current < limits.maxProposals,
			current,
			limit: limits.maxProposals,
			remaining,
			message:
				remaining === 0
					? `Vous avez atteint la limite de ${limits.maxProposals} proposition(s) pour le plan ${limits.plan}. Passez à un plan supérieur pour en créer plus.`
					: undefined,
		};
	}

	/**
	 * Check if user can create more API keys
	 */
	async canCreateApiKey(user: User): Promise<LimitCheckResult> {
		const limits = this.getPlanLimits(user);

		// Unlimited
		if (this.isUnlimited(limits.maxApiKeys)) {
			return {
				allowed: true,
				current: 0,
				limit: -1,
				remaining: -1,
			};
		}

		// Count current active API keys
		const countResult = await ApiKey.query()
			.where("userId", user.id)
			.where("isActive", true)
			.count("* as total");

		const current = Number(countResult[0].$extras.total);
		const remaining = Math.max(0, limits.maxApiKeys - current);

		return {
			allowed: current < limits.maxApiKeys,
			current,
			limit: limits.maxApiKeys,
			remaining,
			message:
				remaining === 0
					? `Vous avez atteint la limite de ${limits.maxApiKeys} clé(s) API pour le plan ${limits.plan}. Passez à un plan supérieur pour en créer plus.`
					: undefined,
		};
	}

	/**
	 * Check if user can add custom domain
	 */
	async canAddCustomDomain(user: User): Promise<LimitCheckResult> {
		const limits = this.getPlanLimits(user);

		// Unlimited
		if (this.isUnlimited(limits.maxCustomDomains)) {
			return {
				allowed: true,
				current: 0,
				limit: -1,
				remaining: -1,
			};
		}

		// Not allowed at all
		if (limits.maxCustomDomains === 0) {
			return {
				allowed: false,
				current: 0,
				limit: 0,
				remaining: 0,
				message: `Les domaines personnalisés ne sont pas disponibles sur le plan ${limits.plan}. Passez au plan Pro pour cette fonctionnalité.`,
			};
		}

		// Count current custom domains
		const countResult = await Proposal.query()
			.where("userId", user.id)
			.whereNotNull("customDomain")
			.count("* as total");

		const current = Number(countResult[0].$extras.total);
		const remaining = Math.max(0, limits.maxCustomDomains - current);

		return {
			allowed: current < limits.maxCustomDomains,
			current,
			limit: limits.maxCustomDomains,
			remaining,
			message:
				remaining === 0
					? `Vous avez atteint la limite de ${limits.maxCustomDomains} domaine(s) personnalisé(s) pour le plan ${limits.plan}.`
					: undefined,
		};
	}

	/**
	 * Check if user can add team member
	 */
	async canAddTeamMember(user: User): Promise<LimitCheckResult> {
		const limits = this.getPlanLimits(user);

		// Unlimited
		if (this.isUnlimited(limits.maxTeamMembers)) {
			return {
				allowed: true,
				current: 1, // At least the owner
				limit: -1,
				remaining: -1,
			};
		}

		// For now, return based on limit (team feature to be implemented)
		return {
			allowed: limits.maxTeamMembers > 1,
			current: 1,
			limit: limits.maxTeamMembers,
			remaining: Math.max(0, limits.maxTeamMembers - 1),
			message:
				limits.maxTeamMembers <= 1
					? `Les équipes ne sont pas disponibles sur le plan ${limits.plan}.`
					: undefined,
		};
	}

	/**
	 * Check if user has access to a specific feature
	 */
	hasFeatureAccess(
		user: User,
		feature: keyof Omit<
			PlanLimits,
			| "plan"
			| "maxProposals"
			| "maxApiKeys"
			| "maxCustomDomains"
			| "maxTeamMembers"
		>,
	): boolean {
		const limits = this.getPlanLimits(user);
		return limits[feature] as boolean;
	}

	/**
	 * Get usage summary for a user
	 */
	async getUsageSummary(user: User): Promise<{
		proposals: LimitCheckResult;
		apiKeys: LimitCheckResult;
		customDomains: LimitCheckResult;
	}> {
		const [proposals, apiKeys, customDomains] = await Promise.all([
			this.canCreateProposal(user),
			this.canCreateApiKey(user),
			this.canAddCustomDomain(user),
		]);

		return { proposals, apiKeys, customDomains };
	}

	/**
	 * Check if a limit is unlimited (-1)
	 */
	isUnlimited(limit: number): boolean {
		return limit === -1;
	}

	/**
	 * Format limit for display
	 */
	formatLimit(limit: number): string {
		return this.isUnlimited(limit) ? "Illimité" : String(limit);
	}

	/**
	 * Get upgrade message for a specific limit
	 */
	getUpgradeMessage(currentPlan: PlanType, feature: string): string {
		const nextPlan = currentPlan === "free" ? "Pro" : "Enterprise";
		return `Passez au plan ${nextPlan} pour débloquer plus de ${feature}.`;
	}
}

export default new PlanLimitsService();

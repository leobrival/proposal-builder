import cache from "@adonisjs/cache/services/main";
import type { Period } from "./metrics_service.js";

/**
 * Cache service for admin dashboard metrics
 *
 * Cache strategy:
 * - Short TTL (30s-2min) to keep data relatively fresh
 * - Automatic invalidation on entity creation/modification
 * - Tags for grouped invalidation by data type
 */
export default class MetricsCacheService {
	// TTL by data type
	private static readonly TTL = {
		// Data that changes rarely
		overview: "2m",
		chartData: "1m",
		// Data that changes frequently
		recentUsers: "30s",
		recentProposals: "30s",
		// Complete aggregated data
		dashboard: "1m",
	} as const;

	// Key prefixes for organization
	private static readonly PREFIX = {
		overview: "metrics:overview",
		chartData: "metrics:chart",
		recentUsers: "metrics:recent:users",
		recentProposals: "metrics:recent:proposals",
		dashboard: "metrics:dashboard",
	} as const;

	// Tags for grouped invalidation
	private static readonly TAGS = {
		users: "metrics:users",
		proposals: "metrics:proposals",
		leads: "metrics:leads",
		all: "metrics:all",
	} as const;

	/**
	 * Builds a cache key with period
	 */
	private static buildKey(prefix: string, period: Period): string {
		return `${prefix}:${period}`;
	}

	/**
	 * Gets or sets complete dashboard data
	 */
	static async getOrSetDashboard<T>(
		period: Period,
		factory: () => Promise<T>,
	): Promise<T> {
		const key = this.buildKey(this.PREFIX.dashboard, period);

		return cache.getOrSet({
			key,
			ttl: this.TTL.dashboard,
			factory,
			tags: [this.TAGS.all, this.TAGS.users, this.TAGS.proposals],
		});
	}

	/**
	 * Gets or sets overview metrics
	 */
	static async getOrSetOverview<T>(
		period: Period,
		factory: () => Promise<T>,
	): Promise<T> {
		const key = this.buildKey(this.PREFIX.overview, period);

		return cache.getOrSet({
			key,
			ttl: this.TTL.overview,
			factory,
			tags: [this.TAGS.all, this.TAGS.users, this.TAGS.proposals],
		});
	}

	/**
	 * Gets or sets chart data
	 */
	static async getOrSetChartData<T>(
		period: Period,
		factory: () => Promise<T>,
	): Promise<T> {
		const key = this.buildKey(this.PREFIX.chartData, period);

		return cache.getOrSet({
			key,
			ttl: this.TTL.chartData,
			factory,
			tags: [this.TAGS.all, this.TAGS.users, this.TAGS.proposals],
		});
	}

	/**
	 * Gets or sets recent users
	 */
	static async getOrSetRecentUsers<T>(factory: () => Promise<T>): Promise<T> {
		return cache.getOrSet({
			key: this.PREFIX.recentUsers,
			ttl: this.TTL.recentUsers,
			factory,
			tags: [this.TAGS.all, this.TAGS.users],
		});
	}

	/**
	 * Gets or sets recent proposals
	 */
	static async getOrSetRecentProposals<T>(
		factory: () => Promise<T>,
	): Promise<T> {
		return cache.getOrSet({
			key: this.PREFIX.recentProposals,
			ttl: this.TTL.recentProposals,
			factory,
			tags: [this.TAGS.all, this.TAGS.proposals],
		});
	}

	/**
	 * Invalidates user-related cache
	 * Call on user creation/modification
	 */
	static async invalidateUsers(): Promise<void> {
		await cache.deleteByTag({ tags: [this.TAGS.users] });
	}

	/**
	 * Invalidates proposal-related cache
	 * Call on proposal creation/modification
	 */
	static async invalidateProposals(): Promise<void> {
		await cache.deleteByTag({ tags: [this.TAGS.proposals] });
	}

	/**
	 * Invalidates lead-related cache
	 * Call on lead creation/modification
	 */
	static async invalidateLeads(): Promise<void> {
		await cache.deleteByTag({ tags: [this.TAGS.leads] });
	}

	/**
	 * Invalidates all metrics cache
	 * Call on major changes or to force refresh
	 */
	static async invalidateAll(): Promise<void> {
		await cache.deleteByTag({ tags: [this.TAGS.all] });
	}

	/**
	 * Gets cache statistics (for debugging)
	 */
	static async getStats(): Promise<{
		keys: string[];
	}> {
		// Note: BentoCache does not provide stats directly
		// but we can implement them if needed
		return {
			keys: [],
		};
	}
}

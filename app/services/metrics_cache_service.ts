import cache from "@adonisjs/cache/services/main";
import type { Period } from "./metrics_service.js";

/**
 * Cache service for admin dashboard metrics
 *
 * Cache strategy:
 * - Short TTL (30s-2min) to keep data relatively fresh
 * - Automatic invalidation on entity creation/modification
 * - Tags for grouped invalidation by data type
 * - Graceful fallback when cache is unavailable
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
	 * Builds a cache key with period or custom key
	 */
	private static buildKey(
		prefix: string,
		periodOrKey: Period | string,
	): string {
		return `${prefix}:${periodOrKey}`;
	}

	/**
	 * Safely execute cache operation with fallback to factory
	 * If cache is unavailable, just run the factory directly
	 */
	private static async safeGetOrSet<T>(
		key: string,
		ttl: string,
		factory: () => Promise<T>,
		tags: string[],
	): Promise<T> {
		try {
			return await cache.getOrSet({
				key,
				ttl,
				factory,
				tags,
			});
		} catch (error) {
			// If cache fails (e.g., Redis unavailable), just run the factory
			console.warn(
				`Cache unavailable for key ${key}, fetching directly:`,
				error instanceof Error ? error.message : error,
			);
			return factory();
		}
	}

	/**
	 * Gets or sets complete dashboard data
	 * Accepts either a Period or a custom cache key (e.g., for date ranges)
	 */
	static async getOrSetDashboard<T>(
		periodOrKey: Period | string,
		factory: () => Promise<T>,
	): Promise<T> {
		const key = MetricsCacheService.buildKey(
			MetricsCacheService.PREFIX.dashboard,
			periodOrKey,
		);

		return MetricsCacheService.safeGetOrSet(
			key,
			MetricsCacheService.TTL.dashboard,
			factory,
			[
				MetricsCacheService.TAGS.all,
				MetricsCacheService.TAGS.users,
				MetricsCacheService.TAGS.proposals,
			],
		);
	}

	/**
	 * Gets or sets overview metrics
	 */
	static async getOrSetOverview<T>(
		period: Period,
		factory: () => Promise<T>,
	): Promise<T> {
		const key = MetricsCacheService.buildKey(
			MetricsCacheService.PREFIX.overview,
			period,
		);

		return MetricsCacheService.safeGetOrSet(
			key,
			MetricsCacheService.TTL.overview,
			factory,
			[
				MetricsCacheService.TAGS.all,
				MetricsCacheService.TAGS.users,
				MetricsCacheService.TAGS.proposals,
			],
		);
	}

	/**
	 * Gets or sets chart data
	 */
	static async getOrSetChartData<T>(
		period: Period,
		factory: () => Promise<T>,
	): Promise<T> {
		const key = MetricsCacheService.buildKey(
			MetricsCacheService.PREFIX.chartData,
			period,
		);

		return MetricsCacheService.safeGetOrSet(
			key,
			MetricsCacheService.TTL.chartData,
			factory,
			[
				MetricsCacheService.TAGS.all,
				MetricsCacheService.TAGS.users,
				MetricsCacheService.TAGS.proposals,
			],
		);
	}

	/**
	 * Gets or sets recent users
	 */
	static async getOrSetRecentUsers<T>(factory: () => Promise<T>): Promise<T> {
		return MetricsCacheService.safeGetOrSet(
			MetricsCacheService.PREFIX.recentUsers,
			MetricsCacheService.TTL.recentUsers,
			factory,
			[MetricsCacheService.TAGS.all, MetricsCacheService.TAGS.users],
		);
	}

	/**
	 * Gets or sets recent proposals
	 */
	static async getOrSetRecentProposals<T>(
		factory: () => Promise<T>,
	): Promise<T> {
		return MetricsCacheService.safeGetOrSet(
			MetricsCacheService.PREFIX.recentProposals,
			MetricsCacheService.TTL.recentProposals,
			factory,
			[MetricsCacheService.TAGS.all, MetricsCacheService.TAGS.proposals],
		);
	}

	/**
	 * Invalidates user-related cache
	 * Call on user creation/modification
	 */
	static async invalidateUsers(): Promise<void> {
		try {
			await cache.deleteByTag({ tags: [MetricsCacheService.TAGS.users] });
		} catch (error) {
			console.warn(
				"Failed to invalidate users cache:",
				error instanceof Error ? error.message : error,
			);
		}
	}

	/**
	 * Invalidates proposal-related cache
	 * Call on proposal creation/modification
	 */
	static async invalidateProposals(): Promise<void> {
		try {
			await cache.deleteByTag({ tags: [MetricsCacheService.TAGS.proposals] });
		} catch (error) {
			console.warn(
				"Failed to invalidate proposals cache:",
				error instanceof Error ? error.message : error,
			);
		}
	}

	/**
	 * Invalidates lead-related cache
	 * Call on lead creation/modification
	 */
	static async invalidateLeads(): Promise<void> {
		try {
			await cache.deleteByTag({ tags: [MetricsCacheService.TAGS.leads] });
		} catch (error) {
			console.warn(
				"Failed to invalidate leads cache:",
				error instanceof Error ? error.message : error,
			);
		}
	}

	/**
	 * Invalidates all metrics cache
	 * Call on major changes or to force refresh
	 */
	static async invalidateAll(): Promise<void> {
		try {
			await cache.deleteByTag({ tags: [MetricsCacheService.TAGS.all] });
		} catch (error) {
			console.warn(
				"Failed to invalidate all cache:",
				error instanceof Error ? error.message : error,
			);
		}
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

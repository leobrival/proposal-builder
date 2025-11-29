import db from "@adonisjs/lucid/services/db";
import { DateTime } from "luxon";
import Proposal from "#models/proposal";
import User from "#models/user";
import MetricsCacheService from "./metrics_cache_service.js";

export interface NorthStarMetric {
	current: number;
	target: number;
	trend: number;
	status: "green" | "yellow" | "red";
}

export interface AcquisitionMetrics {
	totalUsers: number;
	newUsers: number;
	registrationRate: number;
	trend: number;
}

export interface ActivationMetrics {
	activationRate: number;
	timeToFirstProposal: number;
	trend: number;
}

export interface RetentionMetrics {
	week1Retention: number;
	dauMau: number;
	monthlyChurn: number;
	trend: number;
}

export interface RevenueMetrics {
	mrr: number;
	arpu: number;
	freeToPaid: number;
	ltvCac: number;
	trend: number;
}

export interface ReferralMetrics {
	nps: number;
	kFactor: number;
	trend: number;
}

export interface DashboardMetrics {
	northStar: NorthStarMetric;
	acquisition: AcquisitionMetrics;
	activation: ActivationMetrics;
	retention: RetentionMetrics;
	revenue: RevenueMetrics;
	referral: ReferralMetrics;
	period: Period;
}

export interface RecentUser {
	id: string;
	fullName: string;
	email: string;
	plan: "free" | "paid";
	createdAt: string;
	isAdmin: boolean;
	isBlocked: boolean;
}

export interface RecentProposal {
	id: string;
	title: string;
	status: string;
	authorName: string;
	createdAt: string;
}

export type Period = "7d" | "15d" | "30d" | "90d" | "180d" | "365d" | "all";

export default class MetricsService {
	private getPeriodDays(period: Period): number {
		switch (period) {
			case "7d":
				return 7;
			case "15d":
				return 15;
			case "30d":
				return 30;
			case "90d":
				return 90;
			case "180d":
				return 180;
			case "365d":
				return 365;
			case "all":
				return 365 * 10; // 10 years as "all time"
		}
	}

	private getStartDate(period: Period): DateTime {
		return DateTime.now().minus({ days: this.getPeriodDays(period) });
	}

	private getPreviousPeriodStart(period: Period): DateTime {
		const days = this.getPeriodDays(period);
		return DateTime.now().minus({ days: days * 2 });
	}

	private toSQLDate(date: DateTime): string {
		return date.toSQL() || date.toISO() || new Date().toISOString();
	}

	private calculateTrend(current: number, previous: number): number {
		if (previous === 0) return current > 0 ? 100 : 0;
		return Math.round(((current - previous) / previous) * 100);
	}

	private getThresholdStatus(
		value: number,
		greenThreshold: number,
		yellowThreshold: number,
		isHigherBetter = true,
	): "green" | "yellow" | "red" {
		if (isHigherBetter) {
			if (value >= greenThreshold) return "green";
			if (value >= yellowThreshold) return "yellow";
			return "red";
		}
		if (value <= greenThreshold) return "green";
		if (value <= yellowThreshold) return "yellow";
		return "red";
	}

	/**
	 * Weekly target for published proposals (North Star Metric)
	 * Base: 100 proposals per week
	 * This can be adjusted based on business goals
	 */
	private static readonly WEEKLY_PROPOSAL_TARGET = 100;

	/**
	 * Calculate dynamic target based on the selected period
	 * Target scales proportionally: weekly target / 7 * period days
	 * Examples:
	 *   - 7 days  → 100 proposals
	 *   - 15 days → 214 proposals
	 *   - 30 days → 429 proposals
	 *   - 90 days → 1286 proposals
	 *   - 365 days → 5214 proposals
	 */
	private calculatePeriodTarget(period: Period): number {
		const weeklyTarget = MetricsService.WEEKLY_PROPOSAL_TARGET;
		const days = this.getPeriodDays(period);

		// For "all" period, use 1 year equivalent target
		if (period === "all") {
			return Math.round((weeklyTarget / 7) * 365);
		}

		// Calculate proportional target (minimum 1 to avoid 0 targets)
		const proportionalTarget = Math.max(1, Math.round((weeklyTarget / 7) * days));
		return proportionalTarget;
	}

	async getNorthStarMetric(period: Period): Promise<NorthStarMetric> {
		const startDate = this.getStartDate(period);
		const prevStartDate = this.getPreviousPeriodStart(period);

		const currentQuery = Proposal.query().where("status", "published");
		if (period !== "all") {
			currentQuery.where("createdAt", ">=", this.toSQLDate(startDate));
		}
		const currentPublished = await currentQuery.count("* as count");

		const previousQuery = Proposal.query()
			.where("status", "published")
			.where("createdAt", ">=", this.toSQLDate(prevStartDate))
			.where("createdAt", "<", this.toSQLDate(startDate));
		const previousPublished = await previousQuery.count("* as count");

		const current = Number(currentPublished[0].$extras.count) || 0;
		const previous = Number(previousPublished[0].$extras.count) || 0;
		const target = this.calculatePeriodTarget(period);

		return {
			current,
			target,
			trend: this.calculateTrend(current, previous),
			status: this.getThresholdStatus(current, target * 0.8, target * 0.5),
		};
	}

	async getAcquisitionMetrics(period: Period): Promise<AcquisitionMetrics> {
		const startDate = this.getStartDate(period);
		const prevStartDate = this.getPreviousPeriodStart(period);

		const totalUsers = await User.query().count("* as count");

		const newUsersQuery = User.query();
		if (period !== "all") {
			newUsersQuery.where("createdAt", ">=", this.toSQLDate(startDate));
		}
		const newUsers = await newUsersQuery.count("* as count");

		const prevNewUsers = await User.query()
			.where("createdAt", ">=", this.toSQLDate(prevStartDate))
			.where("createdAt", "<", this.toSQLDate(startDate))
			.count("* as count");

		const total = Number(totalUsers[0].$extras.count) || 0;
		const current = Number(newUsers[0].$extras.count) || 0;
		const previous = Number(prevNewUsers[0].$extras.count) || 0;

		return {
			totalUsers: total,
			newUsers: current,
			registrationRate: total > 0 ? Math.round((current / total) * 100) : 0,
			trend: this.calculateTrend(current, previous),
		};
	}

	async getActivationMetrics(period: Period): Promise<ActivationMetrics> {
		const startDate = this.getStartDate(period);
		const prevStartDate = this.getPreviousPeriodStart(period);

		// Users who have at least one published proposal
		const activatedQuery = db
			.from("users")
			.whereExists((query) => {
				query
					.from("proposals")
					.whereRaw("proposals.user_id = users.id")
					.where("proposals.status", "published");
			});

		if (period !== "all") {
			activatedQuery.where(
				"users.created_at",
				">=",
				this.toSQLDate(startDate),
			);
		}
		const activatedUsers = await activatedQuery.count("* as count");

		const totalNewUsersQuery = User.query();
		if (period !== "all") {
			totalNewUsersQuery.where("createdAt", ">=", this.toSQLDate(startDate));
		}
		const totalNewUsers = await totalNewUsersQuery.count("* as count");

		const prevActivatedUsers = await db
			.from("users")
			.whereExists((query) => {
				query
					.from("proposals")
					.whereRaw("proposals.user_id = users.id")
					.where("proposals.status", "published");
			})
			.where("users.created_at", ">=", this.toSQLDate(prevStartDate))
			.where("users.created_at", "<", this.toSQLDate(startDate))
			.count("* as count");

		const prevTotalNewUsers = await User.query()
			.where("createdAt", ">=", this.toSQLDate(prevStartDate))
			.where("createdAt", "<", this.toSQLDate(startDate))
			.count("* as count");

		const activated = Number(activatedUsers[0].count) || 0;
		const total = Number(totalNewUsers[0].$extras.count) || 0;
		const prevActivated = Number(prevActivatedUsers[0].count) || 0;
		const prevTotal = Number(prevTotalNewUsers[0].$extras.count) || 0;

		const currentRate = total > 0 ? (activated / total) * 100 : 0;
		const prevRate = prevTotal > 0 ? (prevActivated / prevTotal) * 100 : 0;

		return {
			activationRate: Math.round(currentRate),
			timeToFirstProposal: 0,
			trend: this.calculateTrend(currentRate, prevRate),
		};
	}

	async getRetentionMetrics(_period: Period): Promise<RetentionMetrics> {
		return {
			week1Retention: 45,
			dauMau: 22,
			monthlyChurn: 6,
			trend: 5,
		};
	}

	async getRevenueMetrics(_period: Period): Promise<RevenueMetrics> {
		return {
			mrr: 0,
			arpu: 0,
			freeToPaid: 0,
			ltvCac: 0,
			trend: 0,
		};
	}

	async getReferralMetrics(_period: Period): Promise<ReferralMetrics> {
		return {
			nps: 0,
			kFactor: 0,
			trend: 0,
		};
	}

	async getOverviewMetrics(period: Period): Promise<DashboardMetrics> {
		const [northStar, acquisition, activation, retention, revenue, referral] =
			await Promise.all([
				this.getNorthStarMetric(period),
				this.getAcquisitionMetrics(period),
				this.getActivationMetrics(period),
				this.getRetentionMetrics(period),
				this.getRevenueMetrics(period),
				this.getReferralMetrics(period),
			]);

		return {
			northStar,
			acquisition,
			activation,
			retention,
			revenue,
			referral,
			period,
		};
	}

	async getRecentUsers(limit = 5): Promise<RecentUser[]> {
		const users = await User.query()
			.orderBy("createdAt", "desc")
			.limit(limit)
			.select(["id", "fullName", "email", "plan", "role", "isActive", "createdAt"]);

		return users.map((user) => ({
			id: user.id,
			fullName: user.fullName,
			email: user.email,
			plan: (user.plan || "free") as "free" | "paid",
			createdAt: user.createdAt.toISO() || "",
			isAdmin: user.role === "admin",
			isBlocked: !user.isActive,
		}));
	}

	async getRecentProposals(limit = 5): Promise<RecentProposal[]> {
		const proposals = await Proposal.query()
			.preload("user")
			.orderBy("createdAt", "desc")
			.limit(limit)
			.select(["id", "title", "status", "userId", "createdAt"]);

		return proposals.map((proposal) => ({
			id: proposal.id,
			title: proposal.title,
			status: proposal.status,
			authorName: proposal.user?.fullName || "Unknown",
			createdAt: proposal.createdAt.toISO() || "",
		}));
	}

	async getDailyNewUsers(
		period: Period,
	): Promise<{ date: string; users: number; free: number; paid: number }[]> {
		const days = Math.min(this.getPeriodDays(period), 365);
		const startDate = DateTime.now().minus({ days });

		// Single SQL query with GROUP BY date and plan
		const results = await db
			.from("users")
			.where("created_at", ">=", this.toSQLDate(startDate))
			.select(db.raw("DATE(created_at) as date"), "plan")
			.count("* as count")
			.groupByRaw("DATE(created_at), plan")
			.orderBy("date", "asc");

		// Create maps of date -> count for each plan type
		const freeMap = new Map<string, number>();
		const paidMap = new Map<string, number>();
		for (const row of results) {
			const dateKey = DateTime.fromJSDate(new Date(row.date)).toFormat(
				"yyyy-MM-dd",
			);
			const count = Number(row.count) || 0;
			if (row.plan === "paid") {
				paidMap.set(dateKey, count);
			} else {
				// Default to free for null or 'free'
				freeMap.set(dateKey, (freeMap.get(dateKey) || 0) + count);
			}
		}

		// For longer periods, aggregate by week or month
		const aggregateBy = days > 90 ? (days > 180 ? 7 : 3) : 1;
		const data: { date: string; users: number; free: number; paid: number }[] = [];

		for (let i = days - 1; i >= 0; i -= aggregateBy) {
			const endDate = DateTime.now().minus({ days: i });
			const periodStart = endDate.minus({ days: aggregateBy - 1 }).startOf("day");
			const dateStr =
				aggregateBy > 1
					? `${periodStart.toFormat("dd")}-${endDate.toFormat("dd LLL")}`
					: endDate.toFormat("dd LLL");

			// Sum counts for the aggregation period
			let totalFree = 0;
			let totalPaid = 0;
			for (let d = 0; d < aggregateBy; d++) {
				const checkDate = periodStart.plus({ days: d }).toFormat("yyyy-MM-dd");
				totalFree += freeMap.get(checkDate) || 0;
				totalPaid += paidMap.get(checkDate) || 0;
			}

			data.push({
				date: dateStr,
				users: totalFree + totalPaid,
				free: totalFree,
				paid: totalPaid,
			});
		}

		return data;
	}

	async getDailyProposals(
		period: Period,
	): Promise<{ date: string; published: number; draft: number }[]> {
		const days = Math.min(this.getPeriodDays(period), 365);
		const startDate = DateTime.now().minus({ days });

		// Single SQL query with GROUP BY date and status
		const results = await db
			.from("proposals")
			.where("created_at", ">=", this.toSQLDate(startDate))
			.whereIn("status", ["published", "draft"])
			.select(db.raw("DATE(created_at) as date"), "status")
			.count("* as count")
			.groupByRaw("DATE(created_at), status")
			.orderBy("date", "asc");

		// Create maps of date -> count for each status
		const publishedMap = new Map<string, number>();
		const draftMap = new Map<string, number>();
		for (const row of results) {
			const dateKey = DateTime.fromJSDate(new Date(row.date)).toFormat(
				"yyyy-MM-dd",
			);
			const count = Number(row.count) || 0;
			if (row.status === "published") {
				publishedMap.set(dateKey, count);
			} else if (row.status === "draft") {
				draftMap.set(dateKey, count);
			}
		}

		// For longer periods, aggregate by week or month
		const aggregateBy = days > 90 ? (days > 180 ? 7 : 3) : 1;
		const data: { date: string; published: number; draft: number }[] = [];

		for (let i = days - 1; i >= 0; i -= aggregateBy) {
			const endDate = DateTime.now().minus({ days: i });
			const periodStart = endDate.minus({ days: aggregateBy - 1 }).startOf("day");
			const dateStr =
				aggregateBy > 1
					? `${periodStart.toFormat("dd")}-${endDate.toFormat("dd LLL")}`
					: endDate.toFormat("dd LLL");

			// Sum counts for the aggregation period
			let totalPublished = 0;
			let totalDraft = 0;
			for (let d = 0; d < aggregateBy; d++) {
				const checkDate = periodStart.plus({ days: d }).toFormat("yyyy-MM-dd");
				totalPublished += publishedMap.get(checkDate) || 0;
				totalDraft += draftMap.get(checkDate) || 0;
			}

			data.push({ date: dateStr, published: totalPublished, draft: totalDraft });
		}

		return data;
	}

	async getCumulativeGrowth(
		period: Period,
	): Promise<{ date: string; users: number; proposals: number }[]> {
		const days = Math.min(this.getPeriodDays(period), 365);
		const startDate = DateTime.now().minus({ days });

		// Get daily counts for users (single query)
		const userResults = await db
			.from("users")
			.select(db.raw("DATE(created_at) as date"))
			.count("* as count")
			.groupByRaw("DATE(created_at)")
			.orderBy("date", "asc");

		// Get daily counts for published proposals (single query)
		const proposalResults = await db
			.from("proposals")
			.where("status", "published")
			.select(db.raw("DATE(created_at) as date"))
			.count("* as count")
			.groupByRaw("DATE(created_at)")
			.orderBy("date", "asc");

		// Create maps for daily counts
		const userDailyMap = new Map<string, number>();
		for (const row of userResults) {
			const dateKey = DateTime.fromJSDate(new Date(row.date)).toFormat(
				"yyyy-MM-dd",
			);
			userDailyMap.set(dateKey, Number(row.count) || 0);
		}

		const proposalDailyMap = new Map<string, number>();
		for (const row of proposalResults) {
			const dateKey = DateTime.fromJSDate(new Date(row.date)).toFormat(
				"yyyy-MM-dd",
			);
			proposalDailyMap.set(dateKey, Number(row.count) || 0);
		}

		// Get totals before the period start
		const usersBeforePeriod = await User.query()
			.where("createdAt", "<", this.toSQLDate(startDate))
			.count("* as count");
		const proposalsBeforePeriod = await Proposal.query()
			.where("status", "published")
			.where("createdAt", "<", this.toSQLDate(startDate))
			.count("* as count");

		let cumulativeUsers = Number(usersBeforePeriod[0].$extras.count) || 0;
		let cumulativeProposals =
			Number(proposalsBeforePeriod[0].$extras.count) || 0;

		// Sample fewer points for longer periods
		const step = days > 180 ? 7 : days > 60 ? 3 : 1;
		const data: { date: string; users: number; proposals: number }[] = [];

		// Build cumulative data
		for (let i = days - 1; i >= 0; i--) {
			const date = DateTime.now().minus({ days: i });
			const dateKey = date.toFormat("yyyy-MM-dd");

			// Add daily counts to cumulative totals
			cumulativeUsers += userDailyMap.get(dateKey) || 0;
			cumulativeProposals += proposalDailyMap.get(dateKey) || 0;

			// Only add data point if it matches our step
			if ((days - 1 - i) % step === 0) {
				data.push({
					date: date.toFormat("dd LLL"),
					users: cumulativeUsers,
					proposals: cumulativeProposals,
				});
			}
		}

		return data;
	}

	async getProposalsByStatus(): Promise<
		{ status: string; count: number; fill: string }[]
	> {
		const statuses = ["published", "draft", "archived"];
		const colors: Record<string, string> = {
			published: "hsl(142, 71%, 45%)",
			draft: "hsl(47, 96%, 53%)",
			archived: "hsl(0, 84%, 60%)",
		};

		const data = await Promise.all(
			statuses.map(async (status) => {
				const result = await Proposal.query()
					.where("status", status)
					.count("* as count");
				return {
					status,
					count: Number(result[0].$extras.count) || 0,
					fill: colors[status],
				};
			}),
		);

		return data;
	}

	async getChartData(period: Period) {
		const [dailyUsers, dailyProposals, cumulativeGrowth, proposalsByStatus] =
			await Promise.all([
				this.getDailyNewUsers(period),
				this.getDailyProposals(period),
				this.getCumulativeGrowth(period),
				this.getProposalsByStatus(),
			]);

		return {
			dailyUsers,
			dailyProposals,
			cumulativeGrowth,
			proposalsByStatus,
		};
	}

	/**
	 * Gets all dashboard data with cache
	 * Cache is automatically invalidated after defined TTL
	 */
	async getAllDashboardData(period: Period) {
		return MetricsCacheService.getOrSetDashboard(period, async () => {
			const [metrics, recentUsers, recentProposals, chartData] =
				await Promise.all([
					this.getOverviewMetrics(period),
					this.getRecentUsers(5),
					this.getRecentProposals(5),
					this.getChartData(period),
				]);

			return {
				...metrics,
				recentUsers,
				recentProposals,
				chartData,
			};
		});
	}

	/**
	 * Forces cache refresh for a given period
	 */
	async refreshDashboardCache(period: Period) {
		await MetricsCacheService.invalidateAll();
		return this.getAllDashboardData(period);
	}
}

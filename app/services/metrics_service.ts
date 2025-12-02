import db from "@adonisjs/lucid/services/db";
import { DateTime } from "luxon";
import Proposal from "#models/proposal";
import SessionLog from "#models/session_log";
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

// New date range interface using Unix timestamps (seconds)
export interface DateRange {
	from: number;
	to: number;
}

// Session analytics interfaces
export interface CountryData {
	id: string;
	name: string;
	code: string;
	users: number;
	percentage: number;
}

export interface DeviceData {
	id: string;
	name: string;
	type: "desktop" | "mobile" | "tablet";
	sessions: number;
	percentage: number;
}

export interface BrowserData {
	id: string;
	name: string;
	icon: string;
	sessions: number;
	percentage: number;
}

export interface OSData {
	id: string;
	name: string;
	icon: string;
	sessions: number;
	percentage: number;
}

export interface SessionAnalytics {
	countries: CountryData[];
	devices: DeviceData[];
	browsers: BrowserData[];
	operatingSystems: OSData[];
}

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

	/**
	 * Convert DateRange to DateTime objects
	 */
	private dateRangeToDateTime(range: DateRange): {
		start: DateTime;
		end: DateTime;
	} {
		return {
			start: DateTime.fromSeconds(range.from),
			end: DateTime.fromSeconds(range.to),
		};
	}

	/**
	 * Get the previous period for comparison based on date range
	 */
	private getPreviousDateRange(range: DateRange): DateRange {
		const durationSeconds = range.to - range.from;
		return {
			from: range.from - durationSeconds,
			to: range.from,
		};
	}

	/**
	 * Convert a Period to DateRange
	 */
	periodToDateRange(period: Period): DateRange {
		const now = DateTime.now();
		const endOfDay = now.endOf("day");
		const days = this.getPeriodDays(period);
		const startOfPeriod = now.minus({ days }).startOf("day");

		return {
			from: Math.floor(startOfPeriod.toSeconds()),
			to: Math.floor(endOfDay.toSeconds()),
		};
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
		const proportionalTarget = Math.max(
			1,
			Math.round((weeklyTarget / 7) * days),
		);
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
		const activatedQuery = db.from("users").whereExists((query) => {
			query
				.from("proposals")
				.whereRaw("proposals.user_id = users.id")
				.where("proposals.status", "published");
		});

		if (period !== "all") {
			activatedQuery.where("users.created_at", ">=", this.toSQLDate(startDate));
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
			.select([
				"id",
				"firstName",
				"lastName",
				"email",
				"plan",
				"role",
				"isActive",
				"createdAt",
			]);

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
		const data: { date: string; users: number; free: number; paid: number }[] =
			[];

		for (let i = days - 1; i >= 0; i -= aggregateBy) {
			const endDate = DateTime.now().minus({ days: i });
			const periodStart = endDate
				.minus({ days: aggregateBy - 1 })
				.startOf("day");
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
			const periodStart = endDate
				.minus({ days: aggregateBy - 1 })
				.startOf("day");
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

			data.push({
				date: dateStr,
				published: totalPublished,
				draft: totalDraft,
			});
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
	 * Gets all dashboard data using date range (from/to timestamps)
	 * This is the new preferred method for custom date ranges
	 */
	async getAllDashboardDataByRange(range: DateRange) {
		const cacheKey = `dashboard_${range.from}_${range.to}`;

		return MetricsCacheService.getOrSetDashboard(cacheKey, async () => {
			const { start, end } = this.dateRangeToDateTime(range);
			const previousRange = this.getPreviousDateRange(range);
			const { start: prevStart, end: prevEnd } =
				this.dateRangeToDateTime(previousRange);

			// Get metrics using date range
			const [
				northStar,
				acquisition,
				activation,
				retention,
				revenue,
				referral,
				recentUsers,
				recentProposals,
				chartData,
			] = await Promise.all([
				this.getNorthStarMetricByRange(start, end, prevStart, prevEnd),
				this.getAcquisitionMetricsByRange(start, end, prevStart, prevEnd),
				this.getActivationMetricsByRange(start, end, prevStart, prevEnd),
				this.getRetentionMetricsByRange(start, end),
				this.getRevenueMetricsByRange(start, end, prevStart, prevEnd),
				this.getReferralMetricsByRange(),
				this.getRecentUsers(5),
				this.getRecentProposals(5),
				this.getChartDataByRange(start, end),
			]);

			return {
				northStar,
				acquisition,
				activation,
				retention,
				revenue,
				referral,
				recentUsers,
				recentProposals,
				chartData,
				dateRange: range,
			};
		});
	}

	/**
	 * North Star metric by date range
	 */
	private async getNorthStarMetricByRange(
		start: DateTime,
		end: DateTime,
		prevStart: DateTime,
		prevEnd: DateTime,
	): Promise<NorthStarMetric> {
		const currentCount = await Proposal.query()
			.where("status", "published")
			.whereBetween("createdAt", [this.toSQLDate(start), this.toSQLDate(end)])
			.count("* as count");

		const previousCount = await Proposal.query()
			.where("status", "published")
			.whereBetween("createdAt", [
				this.toSQLDate(prevStart),
				this.toSQLDate(prevEnd),
			])
			.count("* as count");

		const current = Number(currentCount[0].$extras.count) || 0;
		const previous = Number(previousCount[0].$extras.count) || 0;
		const trend = this.calculateTrend(current, previous);

		// Dynamic target based on range duration
		const durationDays = Math.ceil(end.diff(start, "days").days);
		const target = Math.ceil((durationDays / 7) * 10); // 10 proposals per week

		return {
			current,
			target,
			trend,
			status: this.getThresholdStatus(current, target * 0.8, target * 0.5),
		};
	}

	/**
	 * Acquisition metrics by date range
	 */
	private async getAcquisitionMetricsByRange(
		start: DateTime,
		end: DateTime,
		prevStart: DateTime,
		prevEnd: DateTime,
	): Promise<AcquisitionMetrics> {
		const [totalResult, newUsersResult, prevNewUsersResult] = await Promise.all(
			[
				User.query().count("* as count"),
				User.query()
					.whereBetween("createdAt", [
						this.toSQLDate(start),
						this.toSQLDate(end),
					])
					.count("* as count"),
				User.query()
					.whereBetween("createdAt", [
						this.toSQLDate(prevStart),
						this.toSQLDate(prevEnd),
					])
					.count("* as count"),
			],
		);

		const totalUsers = Number(totalResult[0].$extras.count) || 0;
		const newUsers = Number(newUsersResult[0].$extras.count) || 0;
		const prevNewUsers = Number(prevNewUsersResult[0].$extras.count) || 0;

		return {
			totalUsers,
			newUsers,
			registrationRate:
				totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0,
			trend: this.calculateTrend(newUsers, prevNewUsers),
		};
	}

	/**
	 * Activation metrics by date range
	 */
	private async getActivationMetricsByRange(
		start: DateTime,
		end: DateTime,
		prevStart: DateTime,
		prevEnd: DateTime,
	): Promise<ActivationMetrics> {
		const usersInPeriod = await User.query()
			.whereBetween("createdAt", [this.toSQLDate(start), this.toSQLDate(end)])
			.preload("proposals");

		const activatedUsers = usersInPeriod.filter(
			(user) => user.proposals.length > 0,
		);
		const activationRate =
			usersInPeriod.length > 0
				? Math.round((activatedUsers.length / usersInPeriod.length) * 100)
				: 0;

		// Previous period
		const prevUsersInPeriod = await User.query()
			.whereBetween("createdAt", [
				this.toSQLDate(prevStart),
				this.toSQLDate(prevEnd),
			])
			.preload("proposals");
		const prevActivatedUsers = prevUsersInPeriod.filter(
			(user) => user.proposals.length > 0,
		);
		const prevActivationRate =
			prevUsersInPeriod.length > 0
				? Math.round(
						(prevActivatedUsers.length / prevUsersInPeriod.length) * 100,
					)
				: 0;

		return {
			activationRate,
			timeToFirstProposal: 24,
			trend: this.calculateTrend(activationRate, prevActivationRate),
		};
	}

	/**
	 * Retention metrics by date range
	 */
	private async getRetentionMetricsByRange(
		_start: DateTime,
		end: DateTime,
	): Promise<RetentionMetrics> {
		// Simplified retention calculation
		const oneWeekAgo = end.minus({ days: 7 });
		const usersLastWeek = await User.query()
			.where("createdAt", "<=", this.toSQLDate(oneWeekAgo))
			.preload("proposals");

		const activeLastWeek = usersLastWeek.filter((user) =>
			user.proposals.some((p) => {
				const proposalDate = p.createdAt;
				return proposalDate >= oneWeekAgo && proposalDate <= end;
			}),
		);

		const week1Retention =
			usersLastWeek.length > 0
				? Math.round((activeLastWeek.length / usersLastWeek.length) * 100)
				: 0;

		return {
			week1Retention,
			dauMau: 0,
			monthlyChurn: 0,
			trend: 0,
		};
	}

	/**
	 * Revenue metrics by date range
	 */
	private async getRevenueMetricsByRange(
		start: DateTime,
		end: DateTime,
		prevStart: DateTime,
		prevEnd: DateTime,
	): Promise<RevenueMetrics> {
		const [paidUsersResult, prevPaidUsersResult, totalUsersResult] =
			await Promise.all([
				User.query()
					.where("plan", "paid")
					.whereBetween("createdAt", [
						this.toSQLDate(start),
						this.toSQLDate(end),
					])
					.count("* as count"),
				User.query()
					.where("plan", "paid")
					.whereBetween("createdAt", [
						this.toSQLDate(prevStart),
						this.toSQLDate(prevEnd),
					])
					.count("* as count"),
				User.query().count("* as count"),
			]);

		const paidUsers = Number(paidUsersResult[0].$extras.count) || 0;
		const prevPaidUsers = Number(prevPaidUsersResult[0].$extras.count) || 0;
		const totalUsers = Number(totalUsersResult[0].$extras.count) || 0;

		return {
			mrr: paidUsers * 29,
			arpu: totalUsers > 0 ? Math.round((paidUsers * 29) / totalUsers) : 0,
			freeToPaid:
				totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0,
			ltvCac: 0,
			trend: this.calculateTrend(paidUsers, prevPaidUsers),
		};
	}

	/**
	 * Referral metrics (static for now)
	 */
	private async getReferralMetricsByRange(): Promise<ReferralMetrics> {
		return {
			nps: 0,
			kFactor: 0,
			trend: 0,
		};
	}

	/**
	 * Chart data by date range
	 */
	private async getChartDataByRange(start: DateTime, end: DateTime) {
		const startDate = this.toSQLDate(start);
		const endDate = this.toSQLDate(end);

		// Daily new users
		const dailyUsersRaw = await db
			.from("users")
			.select(db.raw("DATE(created_at) as date"))
			.select(db.raw("COUNT(*) as users"))
			.select(
				db.raw(
					"SUM(CASE WHEN plan = 'free' OR plan IS NULL THEN 1 ELSE 0 END) as free",
				),
			)
			.select(db.raw("SUM(CASE WHEN plan = 'paid' THEN 1 ELSE 0 END) as paid"))
			.whereBetween("created_at", [startDate, endDate])
			.groupByRaw("DATE(created_at)")
			.orderBy("date", "asc");

		const dailyUsers = dailyUsersRaw.map((row) => ({
			date: row.date,
			users: Number(row.users) || 0,
			free: Number(row.free) || 0,
			paid: Number(row.paid) || 0,
		}));

		// Daily proposals
		const dailyProposalsRaw = await db
			.from("proposals")
			.select(db.raw("DATE(created_at) as date"))
			.select(
				db.raw(
					"SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published",
				),
			)
			.select(
				db.raw("SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft"),
			)
			.whereBetween("created_at", [startDate, endDate])
			.groupByRaw("DATE(created_at)")
			.orderBy("date", "asc");

		const dailyProposals = dailyProposalsRaw.map((row) => ({
			date: row.date,
			published: Number(row.published) || 0,
			draft: Number(row.draft) || 0,
		}));

		// Proposals by status
		const proposalsByStatusRaw = await Proposal.query()
			.select("status")
			.count("* as count")
			.whereBetween("createdAt", [startDate, endDate])
			.groupBy("status");

		const statusColors: Record<string, string> = {
			published: "hsl(142, 71%, 45%)",
			draft: "hsl(45, 93%, 47%)",
			archived: "hsl(0, 0%, 45%)",
		};

		const proposalsByStatus = proposalsByStatusRaw.map((row) => ({
			status: row.status,
			count: Number(row.$extras.count) || 0,
			fill: statusColors[row.status] || "hsl(0, 0%, 50%)",
		}));

		return {
			dailyUsers,
			dailyProposals,
			proposalsByStatus,
		};
	}

	/**
	 * Forces cache refresh for a given period
	 */
	async refreshDashboardCache(period: Period) {
		await MetricsCacheService.invalidateAll();
		return this.getAllDashboardData(period);
	}

	/**
	 * Forces cache refresh for a given date range
	 */
	async refreshDashboardCacheByRange(range: DateRange) {
		await MetricsCacheService.invalidateAll();
		return this.getAllDashboardDataByRange(range);
	}

	/**
	 * Get session analytics data (countries, devices, browsers, OS)
	 */
	async getSessionAnalytics(
		start: DateTime,
		end: DateTime,
	): Promise<SessionAnalytics> {
		const startDate = this.toSQLDate(start);
		const endDate = this.toSQLDate(end);

		const [countries, devices, browsers, operatingSystems] = await Promise.all([
			this.getCountriesData(startDate, endDate),
			this.getDevicesData(startDate, endDate),
			this.getBrowsersData(startDate, endDate),
			this.getOSData(startDate, endDate),
		]);

		return {
			countries,
			devices,
			browsers,
			operatingSystems,
		};
	}

	/**
	 * Get countries breakdown from session logs
	 */
	private async getCountriesData(
		startDate: string,
		endDate: string,
	): Promise<CountryData[]> {
		const results = await SessionLog.query()
			.whereBetween("sessionStart", [startDate, endDate])
			.whereNotNull("country")
			.select("country", "countryCode")
			.count("* as count")
			.groupBy("country", "countryCode")
			.orderBy("count", "desc")
			.limit(10);

		const total = results.reduce(
			(sum, row) => sum + Number(row.$extras.count),
			0,
		);

		return results.map((row, index) => ({
			id: `country-${index + 1}`,
			name: row.country || "Unknown",
			code: row.countryCode || "XX",
			users: Number(row.$extras.count),
			percentage:
				total > 0
					? Math.round((Number(row.$extras.count) / total) * 1000) / 10
					: 0,
		}));
	}

	/**
	 * Get devices breakdown from session logs
	 */
	private async getDevicesData(
		startDate: string,
		endDate: string,
	): Promise<DeviceData[]> {
		const results = await SessionLog.query()
			.whereBetween("sessionStart", [startDate, endDate])
			.select("deviceType")
			.count("* as count")
			.groupBy("deviceType")
			.orderBy("count", "desc");

		const total = results.reduce(
			(sum, row) => sum + Number(row.$extras.count),
			0,
		);

		const deviceNames: Record<string, string> = {
			desktop: "Desktop",
			mobile: "Mobile",
			tablet: "Tablet",
		};

		return results.map((row, index) => ({
			id: `device-${index + 1}`,
			name: deviceNames[row.deviceType] || row.deviceType,
			type: row.deviceType as "desktop" | "mobile" | "tablet",
			sessions: Number(row.$extras.count),
			percentage:
				total > 0
					? Math.round((Number(row.$extras.count) / total) * 1000) / 10
					: 0,
		}));
	}

	/**
	 * Get browsers breakdown from session logs
	 */
	private async getBrowsersData(
		startDate: string,
		endDate: string,
	): Promise<BrowserData[]> {
		const results = await SessionLog.query()
			.whereBetween("sessionStart", [startDate, endDate])
			.select("browser")
			.count("* as count")
			.groupBy("browser")
			.orderBy("count", "desc")
			.limit(10);

		const total = results.reduce(
			(sum, row) => sum + Number(row.$extras.count),
			0,
		);

		const browserIcons: Record<string, string> = {
			Chrome: "chrome",
			Safari: "safari",
			Firefox: "firefox",
			Edge: "edge",
			Opera: "opera",
		};

		return results.map((row, index) => ({
			id: `browser-${index + 1}`,
			name: row.browser || "Unknown",
			icon: browserIcons[row.browser] || "other",
			sessions: Number(row.$extras.count),
			percentage:
				total > 0
					? Math.round((Number(row.$extras.count) / total) * 1000) / 10
					: 0,
		}));
	}

	/**
	 * Get OS breakdown from session logs
	 */
	private async getOSData(
		startDate: string,
		endDate: string,
	): Promise<OSData[]> {
		const results = await SessionLog.query()
			.whereBetween("sessionStart", [startDate, endDate])
			.select("os")
			.count("* as count")
			.groupBy("os")
			.orderBy("count", "desc")
			.limit(10);

		const total = results.reduce(
			(sum, row) => sum + Number(row.$extras.count),
			0,
		);

		const osIcons: Record<string, string> = {
			Windows: "windows",
			macOS: "macos",
			"Mac OS X": "macos",
			iOS: "ios",
			Android: "android",
			Linux: "linux",
			Ubuntu: "linux",
			"Chrome OS": "chromeos",
		};

		return results.map((row, index) => ({
			id: `os-${index + 1}`,
			name: row.os || "Unknown",
			icon: osIcons[row.os] || "other",
			sessions: Number(row.$extras.count),
			percentage:
				total > 0
					? Math.round((Number(row.$extras.count) / total) * 1000) / 10
					: 0,
		}));
	}

	/**
	 * Get session analytics by date range
	 */
	async getSessionAnalyticsByRange(
		range: DateRange,
	): Promise<SessionAnalytics> {
		const { start, end } = this.dateRangeToDateTime(range);
		return this.getSessionAnalytics(start, end);
	}
}

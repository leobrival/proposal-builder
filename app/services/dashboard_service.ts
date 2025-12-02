import Lead from "#models/lead";
import Proposal from "#models/proposal";

/**
 * Dashboard statistics structure
 */
export interface DashboardStats {
	totalProposals: number;
	totalViews: number;
	totalLeads: number;
}

/**
 * Complete dashboard data structure
 */
export interface DashboardData {
	proposals: Proposal[];
	stats: DashboardStats;
}

/**
 * Service responsible for user dashboard data aggregation
 * Provides statistics and recent activity for the user dashboard
 */
class DashboardService {
	/**
	 * Get complete dashboard data for a user
	 * @param userId - User ID to get dashboard data for
	 * @returns Dashboard data including proposals and statistics
	 */
	async getDashboardData(userId: string): Promise<DashboardData> {
		const [proposals, stats] = await Promise.all([
			this.getRecentProposals(userId),
			this.getStats(userId),
		]);

		return { proposals, stats };
	}

	/**
	 * Get recent proposals for dashboard display
	 * @param userId - User ID to filter proposals
	 * @param limit - Maximum number of proposals to return
	 * @returns Array of recent proposals
	 */
	async getRecentProposals(userId: string, limit = 5): Promise<Proposal[]> {
		return Proposal.query()
			.where("userId", userId)
			.orderBy("updatedAt", "desc")
			.limit(limit);
	}

	/**
	 * Get aggregated statistics for a user
	 * @param userId - User ID to calculate stats for
	 * @returns Dashboard statistics
	 */
	async getStats(userId: string): Promise<DashboardStats> {
		const [totalProposals, totalViews, totalLeads] = await Promise.all([
			this.getTotalProposals(userId),
			this.getTotalViews(userId),
			this.getTotalLeads(userId),
		]);

		return {
			totalProposals,
			totalViews,
			totalLeads,
		};
	}

	/**
	 * Get total proposal count for a user
	 * @param userId - User ID to count proposals for
	 * @returns Total number of proposals
	 */
	private async getTotalProposals(userId: string): Promise<number> {
		const result = await Proposal.query()
			.where("userId", userId)
			.count("* as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Get total view count across all user's proposals
	 * @param userId - User ID to sum views for
	 * @returns Total view count
	 */
	private async getTotalViews(userId: string): Promise<number> {
		const result = await Proposal.query()
			.where("userId", userId)
			.sum("view_count as total");
		return Number(result[0].$extras.total) || 0;
	}

	/**
	 * Get total lead count across all user's proposals
	 * @param userId - User ID to count leads for
	 * @returns Total lead count
	 */
	private async getTotalLeads(userId: string): Promise<number> {
		const proposals = await Proposal.query()
			.where("userId", userId)
			.select("id");

		const proposalIds = proposals.map((p) => p.id);

		if (proposalIds.length === 0) {
			return 0;
		}

		const result = await Lead.query()
			.whereIn("proposalId", proposalIds)
			.count("* as total");

		return Number(result[0].$extras.total) || 0;
	}
}

export default new DashboardService();

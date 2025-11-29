import type { HttpContext } from "@adonisjs/core/http";
import MetricsService from "#services/metrics_service";
import type { Period } from "#services/metrics_service";

export default class AdminDashboardController {
	async index({ inertia, request }: HttpContext) {
		const metricsService = new MetricsService();
		const period = (request.input("period", "7d") as Period) || "7d";

		const [metrics, recentUsers, recentProposals, chartData] = await Promise.all([
			metricsService.getOverviewMetrics(period),
			metricsService.getRecentUsers(5),
			metricsService.getRecentProposals(5),
			metricsService.getChartData(period),
		]);

		return inertia.render("admin/dashboard", {
			...metrics,
			recentUsers,
			recentProposals,
			chartData,
			period,
		});
	}
}

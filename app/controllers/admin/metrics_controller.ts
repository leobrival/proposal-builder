import type { HttpContext } from "@adonisjs/core/http";
import MetricsService from "#services/metrics_service";
import type { Period } from "#services/metrics_service";

export default class AdminMetricsController {
	async index({ request, response }: HttpContext) {
		const metricsService = new MetricsService();
		const period = (request.input("period", "7d") as Period) || "7d";

		const validPeriods: Period[] = [
			"7d",
			"15d",
			"30d",
			"90d",
			"180d",
			"365d",
			"all",
		];
		if (!validPeriods.includes(period)) {
			return response.badRequest({ error: "Invalid period" });
		}

		const data = await metricsService.getAllDashboardData(period);
		return response.json(data);
	}
}

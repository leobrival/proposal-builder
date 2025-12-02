import type { HttpContext } from "@adonisjs/core/http";
import type { DateRange, Period } from "#services/metrics_service";
import MetricsService from "#services/metrics_service";

export default class AdminMetricsController {
	async index({ request, response }: HttpContext) {
		const metricsService = new MetricsService();

		// Check for new from/to format first
		const fromParam = request.input("from");
		const toParam = request.input("to");

		if (fromParam && toParam) {
			const from = Number.parseInt(fromParam, 10);
			const to = Number.parseInt(toParam, 10);

			if (Number.isNaN(from) || Number.isNaN(to)) {
				return response.badRequest({ error: "Invalid from/to timestamps" });
			}

			if (from > to) {
				return response.badRequest({ error: "from must be less than to" });
			}

			const range: DateRange = { from, to };
			const data = await metricsService.getAllDashboardDataByRange(range);
			return response.json(data);
		}

		// Fallback to legacy period format
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

	/**
	 * Get session analytics data (countries, devices, browsers, OS)
	 */
	async sessionAnalytics({ request, response }: HttpContext) {
		const metricsService = new MetricsService();

		const fromParam = request.input("from");
		const toParam = request.input("to");

		if (!fromParam || !toParam) {
			return response.badRequest({
				error: "from and to parameters are required",
			});
		}

		const from = Number.parseInt(fromParam, 10);
		const to = Number.parseInt(toParam, 10);

		if (Number.isNaN(from) || Number.isNaN(to)) {
			return response.badRequest({ error: "Invalid from/to timestamps" });
		}

		if (from > to) {
			return response.badRequest({ error: "from must be less than to" });
		}

		const range: DateRange = { from, to };
		const data = await metricsService.getSessionAnalyticsByRange(range);
		return response.json(data);
	}
}

import type { HttpContext } from "@adonisjs/core/http";
import type { DateRange } from "#services/metrics_service";
import MetricsService from "#services/metrics_service";

export default class AdminDashboardController {
	async index({ inertia, request }: HttpContext) {
		const metricsService = new MetricsService();

		// Check for from/to parameters
		const fromParam = request.input("from");
		const toParam = request.input("to");

		let dateRange: DateRange;

		if (fromParam && toParam) {
			const from = Number.parseInt(fromParam, 10);
			const to = Number.parseInt(toParam, 10);

			if (!Number.isNaN(from) && !Number.isNaN(to) && from <= to) {
				dateRange = { from, to };
			} else {
				// Fallback to default 7 days
				dateRange = metricsService.periodToDateRange("7d");
			}
		} else {
			// Default to 7 days
			dateRange = metricsService.periodToDateRange("7d");
		}

		const data = await metricsService.getAllDashboardDataByRange(dateRange);

		return inertia.render("admin/dashboard", {
			...data,
		});
	}
}

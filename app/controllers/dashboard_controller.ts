import type { HttpContext } from "@adonisjs/core/http";
import dashboardService from "#services/dashboard_service";

export default class DashboardController {
	async index({ inertia, auth }: HttpContext) {
		const user = auth.user!;

		const { proposals, stats } = await dashboardService.getDashboardData(
			user.id,
		);

		return inertia.render("dashboard", {
			proposals,
			stats,
		});
	}
}

import type { HttpContext } from "@adonisjs/core/http";
import RoutesService from "#services/routes_service";

export default class AdminRoutesController {
	async index({ response }: HttpContext) {
		const routes = RoutesService.getAllRoutes();
		const counts = RoutesService.getRouteCounts();

		return response.json({
			routes,
			counts,
		});
	}
}

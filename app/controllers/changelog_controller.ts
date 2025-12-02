import type { HttpContext } from "@adonisjs/core/http";
import contentService from "#services/content_service";

/**
 * Changelog Controller
 * Handles changelog display and API endpoints.
 */
export default class ChangelogController {
	/**
	 * Changelog page
	 * GET /changelog
	 */
	async index({ inertia }: HttpContext) {
		const entries = await contentService.getChangelog();

		return inertia.render("changelog/index", {
			entries,
		});
	}

	/**
	 * API: List changelog entries
	 * GET /api/changelog
	 */
	async apiList({ response }: HttpContext) {
		const entries = await contentService.getChangelog();

		return response.json({
			entries,
		});
	}

	/**
	 * API: Get latest changelog entry
	 * GET /api/changelog/latest
	 */
	async apiLatest({ response }: HttpContext) {
		const entries = await contentService.getChangelog();
		const latest = entries[0] || null;

		return response.json({
			entry: latest,
		});
	}
}

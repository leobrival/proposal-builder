import type { HttpContext } from "@adonisjs/core/http";
import vine from "@vinejs/vine";
import EventScraperService from "#services/event_scraper_service";

const importEventValidator = vine.compile(
	vine.object({
		url: vine.string().url(),
	}),
);

export default class EventImportController {
	/**
	 * Preview event data from URL without creating a proposal
	 */
	async preview({ request, response }: HttpContext) {
		try {
			const { url } = await request.validateUsing(importEventValidator);

			const result = await EventScraperService.scrapeEvent(url);

			if (!result.success) {
				return response.badRequest({
					success: false,
					error: result.error,
					platform: result.platform,
				});
			}

			// Transform dates to ISO strings for JSON response
			const data = result.data!;
			return response.ok({
				success: true,
				platform: result.platform,
				data: {
					...data,
					eventStartDate: data.eventStartDate?.toISO() || null,
					eventEndDate: data.eventEndDate?.toISO() || null,
				},
			});
		} catch (error) {
			// Handle validation errors and other exceptions as JSON
			const message =
				error instanceof Error ? error.message : "An error occurred";
			return response.badRequest({
				success: false,
				error: message,
				platform: null,
			});
		}
	}

	/**
	 * Get supported platforms info
	 */
	async platforms({ response }: HttpContext) {
		return response.ok({
			platforms: [
				{
					id: "eventbrite",
					name: "Eventbrite",
					supported: true,
					urlPatterns: ["eventbrite.com", "eventbrite.fr", "eventbrite.co.uk"],
				},
				{
					id: "meetup",
					name: "Meetup",
					supported: false,
					urlPatterns: ["meetup.com"],
					comingSoon: true,
				},
				{
					id: "facebook",
					name: "Facebook Events",
					supported: false,
					urlPatterns: ["facebook.com/events"],
					comingSoon: true,
				},
			],
		});
	}
}

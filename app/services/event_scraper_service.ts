import { DateTime } from "luxon";
import type { EventFormat } from "#models/proposal";

export interface ScrapedEventData {
	// Basic info
	title: string;
	description: string | null;
	projectName: string;
	projectDescription: string | null;
	coverImageUrl: string | null;
	logoUrl: string | null;

	// Event dates
	eventStartDate: DateTime | null;
	eventEndDate: DateTime | null;

	// Location
	eventVenueName: string | null;
	eventAddress: string | null;
	eventCity: string | null;
	eventCountry: string | null;
	eventLatitude: number | null;
	eventLongitude: number | null;

	// Metadata
	eventCategory: string | null;
	eventTags: string[];
	eventSourceUrl: string;
	eventSourcePlatform: string;
	eventExternalId: string | null;

	// Organizer
	organizerName: string | null;
	organizerWebsite: string | null;

	// Event details
	eventFormat: EventFormat | null;
	eventExpectedAttendees: number | null;

	// Tier suggestion (from ticket price)
	suggestedTierPrice: number | null;
	suggestedTierCurrency: string;
}

export interface ScrapingResult {
	success: boolean;
	data: ScrapedEventData | null;
	error: string | null;
	platform: string | null;
}

class EventScraperService {
	private readonly platformDetectors: Record<string, RegExp> = {
		eventbrite: /eventbrite\.(com|fr|co\.uk|de|es|it)/i,
		meetup: /meetup\.com/i,
		facebook: /facebook\.com\/events/i,
		linkedin: /linkedin\.com\/events/i,
	};

	/**
	 * Detect the event platform from URL
	 */
	detectPlatform(url: string): string | null {
		for (const [platform, regex] of Object.entries(this.platformDetectors)) {
			if (regex.test(url)) {
				return platform;
			}
		}
		return null;
	}

	/**
	 * Extract event ID from URL based on platform
	 */
	extractEventId(url: string, platform: string): string | null {
		switch (platform) {
			case "eventbrite": {
				const match = url.match(/(\d{10,})/);
				return match ? match[1] : null;
			}
			case "meetup": {
				const match = url.match(/events\/(\d+)/);
				return match ? match[1] : null;
			}
			default:
				return null;
		}
	}

	/**
	 * Scrape event data from any supported platform
	 */
	async scrapeEvent(url: string): Promise<ScrapingResult> {
		const platform = this.detectPlatform(url);

		if (!platform) {
			return {
				success: false,
				data: null,
				error:
					"Platform not supported. Supported platforms: Eventbrite, Meetup",
				platform: null,
			};
		}

		try {
			switch (platform) {
				case "eventbrite":
					return await this.scrapeEventbrite(url);
				case "meetup":
					return await this.scrapeMeetup(url);
				default:
					return {
						success: false,
						data: null,
						error: `Scraping not implemented for platform: ${platform}`,
						platform,
					};
			}
		} catch (error) {
			return {
				success: false,
				data: null,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
				platform,
			};
		}
	}

	/**
	 * Scrape Eventbrite event page
	 */
	private async scrapeEventbrite(url: string): Promise<ScrapingResult> {
		const eventId = this.extractEventId(url, "eventbrite");

		try {
			const response = await fetch(url, {
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
					Accept:
						"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
					"Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}

			const html = await response.text();

			// Extract JSON-LD structured data
			const jsonLdMatch = html.match(
				/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
			);
			let eventData: Record<string, unknown> | null = null;

			if (jsonLdMatch) {
				for (const match of jsonLdMatch) {
					const jsonContent = match.replace(/<script[^>]*>|<\/script>/gi, "");
					try {
						const parsed = JSON.parse(jsonContent);
						if (
							parsed["@type"] === "Event" ||
							parsed["@type"]?.includes("Event")
						) {
							eventData = parsed;
							break;
						}
					} catch {
						// Continue to next JSON-LD block
					}
				}
			}

			// Extract Open Graph meta tags as fallback
			const ogTitle = this.extractMetaContent(html, "og:title");
			const ogDescription = this.extractMetaContent(html, "og:description");
			const ogImage = this.extractMetaContent(html, "og:image");

			// Parse event data
			const title = (eventData?.name as string) || ogTitle || "Untitled Event";
			const description =
				(eventData?.description as string) || ogDescription || null;

			// Parse location
			const location = eventData?.location as
				| Record<string, unknown>
				| undefined;
			const address = location?.address as Record<string, unknown> | undefined;

			// Parse organizer
			const organizer = eventData?.organizer as
				| Record<string, unknown>
				| undefined;

			// Parse dates
			const startDateStr = eventData?.startDate as string | undefined;
			const endDateStr = eventData?.endDate as string | undefined;

			// Parse offers/tickets for price
			const offers = eventData?.offers as
				| Record<string, unknown>
				| Record<string, unknown>[]
				| undefined;
			let ticketPrice: number | null = null;
			let ticketCurrency = "EUR";

			if (offers) {
				const offerArray = Array.isArray(offers) ? offers : [offers];
				for (const offer of offerArray) {
					if (offer.price && typeof offer.price === "number") {
						ticketPrice = offer.price;
						ticketCurrency = (offer.priceCurrency as string) || "EUR";
						break;
					}
				}
			}

			// Extract tags from keywords or categories
			const tags: string[] = [];
			if (eventData?.keywords) {
				const keywords = eventData.keywords as string | string[];
				if (typeof keywords === "string") {
					tags.push(...keywords.split(",").map((t) => t.trim()));
				} else if (Array.isArray(keywords)) {
					tags.push(...keywords);
				}
			}

			// Extract from HTML hashtags if no keywords in JSON-LD
			if (tags.length === 0) {
				const hashtagMatches = html.match(/#[\wÀ-ÿ_]+/g);
				if (hashtagMatches) {
					tags.push(...hashtagMatches.slice(0, 10));
				}
			}

			// Determine event format
			let eventFormat: EventFormat | null = null;
			const attendanceMode = eventData?.eventAttendanceMode as
				| string
				| undefined;
			if (attendanceMode) {
				if (attendanceMode.includes("Online")) {
					eventFormat = "online";
				} else if (attendanceMode.includes("Mixed")) {
					eventFormat = "hybrid";
				} else {
					eventFormat = "in_person";
				}
			} else if (location) {
				eventFormat = "in_person";
			}

			// Parse geo coordinates
			const geo = location?.geo as Record<string, unknown> | undefined;

			const scrapedData: ScrapedEventData = {
				title,
				description,
				projectName: (organizer?.name as string) || title,
				projectDescription: description,
				coverImageUrl: (eventData?.image as string) || ogImage || null,
				logoUrl: (organizer?.logo as string) || null,

				eventStartDate: startDateStr ? DateTime.fromISO(startDateStr) : null,
				eventEndDate: endDateStr ? DateTime.fromISO(endDateStr) : null,

				eventVenueName: (location?.name as string) || null,
				eventAddress: address
					? [address.streetAddress, address.postalCode, address.addressLocality]
							.filter(Boolean)
							.join(", ")
					: null,
				eventCity: (address?.addressLocality as string) || null,
				eventCountry: (address?.addressCountry as string) || null,
				eventLatitude: geo?.latitude ? Number(geo.latitude) : null,
				eventLongitude: geo?.longitude ? Number(geo.longitude) : null,

				eventCategory: this.extractCategory(html) || null,
				eventTags: tags,
				eventSourceUrl: url,
				eventSourcePlatform: "eventbrite",
				eventExternalId: eventId,

				organizerName: (organizer?.name as string) || null,
				organizerWebsite: (organizer?.url as string) || null,

				eventFormat,
				eventExpectedAttendees: null,

				suggestedTierPrice: ticketPrice,
				suggestedTierCurrency: ticketCurrency,
			};

			return {
				success: true,
				data: scrapedData,
				error: null,
				platform: "eventbrite",
			};
		} catch (error) {
			return {
				success: false,
				data: null,
				error:
					error instanceof Error
						? error.message
						: "Failed to scrape Eventbrite",
				platform: "eventbrite",
			};
		}
	}

	/**
	 * Scrape Meetup event page (placeholder for future implementation)
	 */
	private async scrapeMeetup(_url: string): Promise<ScrapingResult> {
		// Meetup scraping would require similar implementation
		return {
			success: false,
			data: null,
			error: "Meetup scraping not yet implemented",
			platform: "meetup",
		};
	}

	/**
	 * Helper to extract meta content
	 */
	private extractMetaContent(html: string, property: string): string | null {
		const regex = new RegExp(
			`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
			"i",
		);
		const match = html.match(regex);
		if (match) return match[1];

		// Try reverse order (content before property)
		const reverseRegex = new RegExp(
			`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${property}["']`,
			"i",
		);
		const reverseMatch = html.match(reverseRegex);
		return reverseMatch ? reverseMatch[1] : null;
	}

	/**
	 * Extract category from Eventbrite HTML
	 */
	private extractCategory(html: string): string | null {
		// Look for category in breadcrumbs or data attributes
		const categoryMatch = html.match(/data-subcategory-name=["']([^"']+)["']/i);
		if (categoryMatch) return categoryMatch[1];

		// Try to find in structured breadcrumbs
		const breadcrumbMatch = html.match(
			/<a[^>]*class="[^"]*breadcrumb[^"]*"[^>]*>([^<]+)<\/a>/gi,
		);
		if (breadcrumbMatch && breadcrumbMatch.length > 1) {
			// Usually the second breadcrumb is the category
			const cleanedText = breadcrumbMatch[1].replace(/<[^>]+>/g, "").trim();
			return cleanedText || null;
		}

		return null;
	}
}

export default new EventScraperService();

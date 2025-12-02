import { DateTime } from "luxon";
import type { DeviceType } from "#models/session_log";
import SessionLog from "#models/session_log";
import env from "#start/env";

interface PostHogSession {
	id: string;
	distinct_id: string;
	start_time: string;
	end_time: string | null;
	duration: number | null;
	$device_type: string | null;
	$browser: string | null;
	$browser_version: string | null;
	$os: string | null;
	$os_version: string | null;
	$geoip_country_name: string | null;
	$geoip_country_code: string | null;
	$geoip_city_name: string | null;
	$geoip_subdivision_1_name: string | null;
	$referring_domain: string | null;
	$initial_utm_source: string | null;
	$initial_utm_medium: string | null;
	$initial_utm_campaign: string | null;
	pageview_count: number;
}

interface PostHogSessionsResponse {
	results: PostHogSession[];
	has_next: boolean;
	next?: string;
}

export default class PostHogSyncService {
	private apiKey: string;
	private projectId: string;
	private host: string;

	constructor() {
		this.apiKey = env.get("POSTHOG_API_KEY", "");
		this.projectId = env.get("POSTHOG_PROJECT_ID", "");
		this.host = env.get("POSTHOG_HOST", "https://eu.posthog.com");
	}

	/**
	 * Check if PostHog is configured
	 */
	isConfigured(): boolean {
		return Boolean(this.apiKey && this.projectId);
	}

	/**
	 * Normalize device type to our enum values
	 */
	private normalizeDeviceType(deviceType: string | null): DeviceType {
		if (!deviceType) return "desktop";
		const lower = deviceType.toLowerCase();
		if (lower.includes("mobile") || lower.includes("phone")) return "mobile";
		if (lower.includes("tablet") || lower.includes("ipad")) return "tablet";
		return "desktop";
	}

	/**
	 * Fetch sessions from PostHog API
	 */
	async fetchSessions(
		startDate: DateTime,
		endDate: DateTime,
		limit = 100,
	): Promise<PostHogSession[]> {
		if (!this.isConfigured()) {
			throw new Error(
				"PostHog is not configured. Please set POSTHOG_API_KEY and POSTHOG_PROJECT_ID environment variables.",
			);
		}

		const url = new URL(`${this.host}/api/projects/${this.projectId}/sessions`);
		url.searchParams.set("date_from", startDate.toISO() || "");
		url.searchParams.set("date_to", endDate.toISO() || "");
		url.searchParams.set("limit", limit.toString());

		const response = await fetch(url.toString(), {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`PostHog API error: ${response.status} - ${errorText}`);
		}

		const data = (await response.json()) as PostHogSessionsResponse;
		return data.results;
	}

	/**
	 * Fetch all sessions using pagination
	 */
	async fetchAllSessions(
		startDate: DateTime,
		endDate: DateTime,
	): Promise<PostHogSession[]> {
		const allSessions: PostHogSession[] = [];
		let hasNext = true;
		let url = new URL(`${this.host}/api/projects/${this.projectId}/sessions`);
		url.searchParams.set("date_from", startDate.toISO() || "");
		url.searchParams.set("date_to", endDate.toISO() || "");
		url.searchParams.set("limit", "100");

		while (hasNext) {
			const response = await fetch(url.toString(), {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`PostHog API error: ${response.status} - ${errorText}`);
			}

			const data = (await response.json()) as PostHogSessionsResponse;
			allSessions.push(...data.results);

			if (data.has_next && data.next) {
				url = new URL(data.next);
			} else {
				hasNext = false;
			}
		}

		return allSessions;
	}

	/**
	 * Sync sessions from PostHog to our database
	 */
	async syncSessions(
		startDate: DateTime,
		endDate: DateTime,
	): Promise<{
		created: number;
		updated: number;
		errors: number;
	}> {
		const sessions = await this.fetchAllSessions(startDate, endDate);
		let created = 0;
		let updated = 0;
		let errors = 0;

		for (const session of sessions) {
			try {
				const existingSession = await SessionLog.findBy(
					"posthogSessionId",
					session.id,
				);

				const sessionData = {
					posthogSessionId: session.id,
					posthogDistinctId: session.distinct_id,
					deviceType: this.normalizeDeviceType(session.$device_type),
					browser: session.$browser || "Unknown",
					browserVersion: session.$browser_version,
					os: session.$os || "Unknown",
					osVersion: session.$os_version,
					country: session.$geoip_country_name,
					countryCode: session.$geoip_country_code,
					city: session.$geoip_city_name,
					region: session.$geoip_subdivision_1_name,
					referrer: session.$referring_domain,
					utmSource: session.$initial_utm_source,
					utmMedium: session.$initial_utm_medium,
					utmCampaign: session.$initial_utm_campaign,
					sessionStart: DateTime.fromISO(session.start_time),
					sessionEnd: session.end_time
						? DateTime.fromISO(session.end_time)
						: null,
					durationSeconds: session.duration,
					pageviewCount: session.pageview_count || 1,
				};

				if (existingSession) {
					existingSession.merge(sessionData);
					await existingSession.save();
					updated++;
				} else {
					await SessionLog.create(sessionData);
					created++;
				}
			} catch (error) {
				console.error(`Error syncing session ${session.id}:`, error);
				errors++;
			}
		}

		return { created, updated, errors };
	}

	/**
	 * Sync sessions for the last N days
	 */
	async syncLastNDays(days: number): Promise<{
		created: number;
		updated: number;
		errors: number;
	}> {
		const endDate = DateTime.now();
		const startDate = endDate.minus({ days });
		return this.syncSessions(startDate, endDate);
	}

	/**
	 * Get aggregated session data by device type
	 */
	async getDeviceBreakdown(
		startDate: DateTime,
		endDate: DateTime,
	): Promise<
		{
			name: string;
			value: number;
			percentage: number;
		}[]
	> {
		const sessions = await SessionLog.query()
			.whereBetween("sessionStart", [
				startDate.toSQL() || "",
				endDate.toSQL() || "",
			])
			.select("deviceType")
			.count("* as count")
			.groupBy("deviceType");

		const total = sessions.reduce(
			(sum, row) => sum + Number(row.$extras.count),
			0,
		);

		return sessions.map((row) => ({
			name: row.deviceType.charAt(0).toUpperCase() + row.deviceType.slice(1),
			value: Number(row.$extras.count),
			percentage:
				total > 0 ? Math.round((Number(row.$extras.count) / total) * 100) : 0,
		}));
	}

	/**
	 * Get aggregated session data by browser
	 */
	async getBrowserBreakdown(
		startDate: DateTime,
		endDate: DateTime,
	): Promise<
		{
			name: string;
			value: number;
			percentage: number;
		}[]
	> {
		const sessions = await SessionLog.query()
			.whereBetween("sessionStart", [
				startDate.toSQL() || "",
				endDate.toSQL() || "",
			])
			.select("browser")
			.count("* as count")
			.groupBy("browser")
			.orderBy("count", "desc")
			.limit(10);

		const total = sessions.reduce(
			(sum, row) => sum + Number(row.$extras.count),
			0,
		);

		return sessions.map((row) => ({
			name: row.browser,
			value: Number(row.$extras.count),
			percentage:
				total > 0 ? Math.round((Number(row.$extras.count) / total) * 100) : 0,
		}));
	}

	/**
	 * Get aggregated session data by country
	 */
	async getCountryBreakdown(
		startDate: DateTime,
		endDate: DateTime,
	): Promise<
		{
			name: string;
			code: string;
			value: number;
			percentage: number;
		}[]
	> {
		const sessions = await SessionLog.query()
			.whereBetween("sessionStart", [
				startDate.toSQL() || "",
				endDate.toSQL() || "",
			])
			.whereNotNull("country")
			.select("country", "countryCode")
			.count("* as count")
			.groupBy("country", "countryCode")
			.orderBy("count", "desc")
			.limit(10);

		const total = sessions.reduce(
			(sum, row) => sum + Number(row.$extras.count),
			0,
		);

		return sessions.map((row) => ({
			name: row.country || "Unknown",
			code: row.countryCode || "??",
			value: Number(row.$extras.count),
			percentage:
				total > 0 ? Math.round((Number(row.$extras.count) / total) * 100) : 0,
		}));
	}

	/**
	 * Get aggregated session data by OS
	 */
	async getOSBreakdown(
		startDate: DateTime,
		endDate: DateTime,
	): Promise<
		{
			name: string;
			value: number;
			percentage: number;
		}[]
	> {
		const sessions = await SessionLog.query()
			.whereBetween("sessionStart", [
				startDate.toSQL() || "",
				endDate.toSQL() || "",
			])
			.select("os")
			.count("* as count")
			.groupBy("os")
			.orderBy("count", "desc")
			.limit(10);

		const total = sessions.reduce(
			(sum, row) => sum + Number(row.$extras.count),
			0,
		);

		return sessions.map((row) => ({
			name: row.os,
			value: Number(row.$extras.count),
			percentage:
				total > 0 ? Math.round((Number(row.$extras.count) / total) * 100) : 0,
		}));
	}

	/**
	 * Get all analytics data for the dashboard
	 */
	async getAnalyticsData(startDate: DateTime, endDate: DateTime) {
		const [devices, browsers, countries, operatingSystems] = await Promise.all([
			this.getDeviceBreakdown(startDate, endDate),
			this.getBrowserBreakdown(startDate, endDate),
			this.getCountryBreakdown(startDate, endDate),
			this.getOSBreakdown(startDate, endDate),
		]);

		return {
			devices,
			browsers,
			countries,
			operatingSystems,
		};
	}
}

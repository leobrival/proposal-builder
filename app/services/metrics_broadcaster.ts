import transmit from "@adonisjs/transmit/services/main";
import type { Period } from "./metrics_service.js";
import MetricsService from "./metrics_service.js";

export default class MetricsBroadcaster {
	private metricsService: MetricsService;

	constructor() {
		this.metricsService = new MetricsService();
	}

	/**
	 * Broadcast updated metrics to all admin dashboard subscribers
	 */
	async broadcastMetricsUpdate(period: Period = "7d") {
		const data = await this.metricsService.getAllDashboardData(period);

		// Transmit expects simple JSON-serializable data
		transmit.broadcast("admin/metrics", {
			type: "metrics_update",
			period,
			payload: JSON.stringify(data),
			timestamp: new Date().toISOString(),
		});
	}

	/**
	 * Broadcast a new user registration event
	 */
	async broadcastNewUser(user: {
		id: string;
		fullName: string;
		email: string;
	}) {
		transmit.broadcast("admin/metrics", {
			type: "new_user",
			user,
			timestamp: new Date().toISOString(),
		});

		// Also broadcast full metrics update
		await this.broadcastMetricsUpdate();
	}

	/**
	 * Broadcast a new proposal event
	 */
	async broadcastNewProposal(proposal: {
		id: string;
		title: string;
		status: string;
		authorName: string;
	}) {
		transmit.broadcast("admin/metrics", {
			type: "new_proposal",
			proposal,
			timestamp: new Date().toISOString(),
		});

		// Also broadcast full metrics update
		await this.broadcastMetricsUpdate();
	}

	/**
	 * Broadcast a proposal status change
	 */
	async broadcastProposalStatusChange(proposal: {
		id: string;
		title: string;
		oldStatus: string;
		newStatus: string;
	}) {
		transmit.broadcast("admin/metrics", {
			type: "proposal_status_change",
			proposal,
			timestamp: new Date().toISOString(),
		});

		// Also broadcast full metrics update
		await this.broadcastMetricsUpdate();
	}

	/**
	 * Broadcast a new lead event
	 */
	async broadcastNewLead(lead: {
		id: string;
		name: string;
		proposalId: string;
		proposalTitle: string;
	}) {
		transmit.broadcast("admin/metrics", {
			type: "new_lead",
			lead,
			timestamp: new Date().toISOString(),
		});

		// Also broadcast full metrics update
		await this.broadcastMetricsUpdate();
	}
}

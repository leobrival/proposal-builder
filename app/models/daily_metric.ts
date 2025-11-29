import { randomUUID } from "node:crypto";
import { BaseModel, beforeCreate, column } from "@adonisjs/lucid/orm";
import type { DateTime } from "luxon";

export default class DailyMetric extends BaseModel {
	@column({ isPrimary: true })
	declare id: string;

	@column.date()
	declare date: DateTime;

	// User metrics
	@column()
	declare totalUsers: number;

	@column()
	declare newUsers: number;

	@column()
	declare activeUsers: number;

	// Proposal metrics
	@column()
	declare totalProposals: number;

	@column()
	declare publishedProposals: number;

	@column()
	declare newProposals: number;

	// Lead metrics
	@column()
	declare totalLeads: number;

	@column()
	declare newLeads: number;

	// Activation metrics
	@column()
	declare activationRate: number;

	// Revenue metrics (placeholder)
	@column()
	declare mrr: number;

	@column()
	declare payingUsers: number;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@beforeCreate()
	static assignId(metric: DailyMetric) {
		if (!metric.id) {
			metric.id = randomUUID();
		}
	}
}

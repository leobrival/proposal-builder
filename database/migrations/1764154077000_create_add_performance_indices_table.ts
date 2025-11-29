import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
	async up() {
		// Composite index for user metrics queries
		// Used by: getDailyNewUsers, getAcquisitionMetrics, getCumulativeGrowth
		this.schema.alterTable("users", (table) => {
			// Index on created_at DESC for period filters and recent sorting
			table.index(["created_at"], "idx_users_created_at_desc");
		});

		// Composite indexes for proposal metrics queries
		// Used by: getNorthStarMetric, getDailyProposals, getCumulativeGrowth, getProposalsByStatus
		this.schema.alterTable("proposals", (table) => {
			// Composite index status + created_at for combined filters
			// Covers: WHERE status = 'published' AND created_at >= ?
			table.index(
				["status", "created_at"],
				"idx_proposals_status_created_at",
			);

			// Index on created_at DESC for period queries without status filter
			table.index(["created_at"], "idx_proposals_created_at_desc");

			// Composite index user_id + status for activation queries
			// Covers: WHERE user_id = ? AND status = 'published'
			table.index(["user_id", "status"], "idx_proposals_user_id_status");
		});

		// Indexes for lead metrics queries
		// Used by future conversion metrics
		this.schema.alterTable("leads", (table) => {
			// Index on created_at for period filters
			table.index(["created_at"], "idx_leads_created_at_desc");

			// Composite index status + created_at for conversion metrics
			table.index(["status", "created_at"], "idx_leads_status_created_at");

			// Composite index proposal_id + status for per-proposal metrics
			table.index(
				["proposal_id", "status"],
				"idx_leads_proposal_id_status",
			);
		});
	}

	async down() {
		this.schema.alterTable("users", (table) => {
			table.dropIndex(["created_at"], "idx_users_created_at_desc");
		});

		this.schema.alterTable("proposals", (table) => {
			table.dropIndex(
				["status", "created_at"],
				"idx_proposals_status_created_at",
			);
			table.dropIndex(["created_at"], "idx_proposals_created_at_desc");
			table.dropIndex(["user_id", "status"], "idx_proposals_user_id_status");
		});

		this.schema.alterTable("leads", (table) => {
			table.dropIndex(["created_at"], "idx_leads_created_at_desc");
			table.dropIndex(
				["status", "created_at"],
				"idx_leads_status_created_at",
			);
			table.dropIndex(
				["proposal_id", "status"],
				"idx_leads_proposal_id_status",
			);
		});
	}
}

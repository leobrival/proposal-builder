import type { HttpContext } from "@adonisjs/core/http";
import AdminAction, { type AdminActionType } from "#models/admin_action";
import Proposal from "#models/proposal";

export default class AdminProposalsController {
	/**
	 * Update proposal status (published/draft/archived)
	 */
	async updateStatus({ auth, params, request, response }: HttpContext) {
		const admin = auth.user!;
		const proposal = await Proposal.findOrFail(params.id);
		const status = request.input("status") as "published" | "draft" | "archived";

		if (!["published", "draft", "archived"].includes(status)) {
			return response.badRequest({ error: "Invalid status value" });
		}

		const oldStatus = proposal.status;
		proposal.status = status;
		await proposal.save();

		// Determine action type
		let actionType: AdminActionType = "proposal_status_change";
		if (status === "published") actionType = "proposal_publish";
		else if (status === "draft" && oldStatus === "published") actionType = "proposal_unpublish";
		else if (status === "archived") actionType = "proposal_archive";
		else if (oldStatus === "archived") actionType = "proposal_restore";

		// Log action
		await AdminAction.create({
			adminId: admin.id,
			actionType,
			targetType: "proposal",
			targetId: proposal.id,
			metadata: { oldStatus, newStatus: status },
		});

		return response.json({ success: true, proposal: { id: proposal.id, status: proposal.status } });
	}

	/**
	 * Delete proposal
	 */
	async destroy({ auth, params, response }: HttpContext) {
		const admin = auth.user!;
		const proposal = await Proposal.findOrFail(params.id);

		// Log action before deletion
		await AdminAction.create({
			adminId: admin.id,
			actionType: "proposal_delete",
			targetType: "proposal",
			targetId: proposal.id,
			metadata: { deletedProposalTitle: proposal.title, deletedProposalSlug: proposal.slug },
		});

		await proposal.delete();

		return response.json({ success: true });
	}
}

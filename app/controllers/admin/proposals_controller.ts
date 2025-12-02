import type { HttpContext } from "@adonisjs/core/http";
import {
	InvalidProposalStatusException,
	ProposalNotFoundException,
} from "#exceptions/index";
import adminProposalService, {
	type ProposalStatus,
} from "#services/admin_proposal_service";

export default class AdminProposalsController {
	/**
	 * Update proposal status (published/draft/archived)
	 */
	async updateStatus({ auth, params, request, response }: HttpContext) {
		const admin = auth.user!;
		const status = request.input("status") as ProposalStatus;

		try {
			const result = await adminProposalService.updateStatus(
				admin.id,
				params.id,
				status,
			);
			return response.json({ success: true, proposal: result });
		} catch (error) {
			if (error instanceof ProposalNotFoundException) {
				return response.notFound({ error: error.message });
			}
			if (error instanceof InvalidProposalStatusException) {
				return response.badRequest({ error: error.message });
			}
			throw error;
		}
	}

	/**
	 * Delete proposal
	 */
	async destroy({ auth, params, response }: HttpContext) {
		const admin = auth.user!;

		try {
			await adminProposalService.deleteProposal(admin.id, params.id);
			return response.json({ success: true });
		} catch (error) {
			if (error instanceof ProposalNotFoundException) {
				return response.notFound({ error: error.message });
			}
			throw error;
		}
	}
}

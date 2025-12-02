import vine from "@vinejs/vine";

/**
 * Validator for publishing a proposal
 * Validates the proposal UUID
 */
export const publishProposalValidator = vine.compile(
	vine.object({
		id: vine.string().uuid(),
	}),
);

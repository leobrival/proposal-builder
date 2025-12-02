import vine from "@vinejs/vine";
import { designSettingsSchema, eventFieldsSchema } from "./schemas.js";

/**
 * Validator for creating a new proposal
 * Validates all required and optional fields including event details
 */
export const createProposalValidator = vine.compile(
	vine.object({
		title: vine.string().trim().minLength(1).maxLength(255),
		description: vine.string().trim().maxLength(2000).nullable(),
		projectName: vine.string().trim().minLength(1).maxLength(255),
		projectDescription: vine.string().trim().maxLength(2000).nullable(),
		contactEmail: vine.string().email(),
		contactPhone: vine.string().trim().maxLength(20).nullable(),
		designSettings: designSettingsSchema.optional(),
		coverImageUrl: vine.string().url().maxLength(500).optional().nullable(),
		...eventFieldsSchema,
	}),
);

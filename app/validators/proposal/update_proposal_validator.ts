import vine from "@vinejs/vine";
import {
	designSettingsSchema,
	eventFieldsSchema,
	tierSchema,
} from "./schemas.js";

/**
 * Validator for updating an existing proposal
 * All fields are optional, includes tiers with benefits
 */
export const updateProposalValidator = vine.compile(
	vine.object({
		title: vine.string().trim().minLength(1).maxLength(255).optional(),
		description: vine.string().trim().maxLength(2000).nullable().optional(),
		projectName: vine.string().trim().minLength(1).maxLength(255).optional(),
		projectDescription: vine
			.string()
			.trim()
			.maxLength(2000)
			.nullable()
			.optional(),
		contactEmail: vine.string().email().optional(),
		contactPhone: vine.string().trim().maxLength(20).nullable().optional(),
		designSettings: designSettingsSchema.optional(),
		tiers: vine.array(tierSchema).optional(),
		...eventFieldsSchema,
	}),
);

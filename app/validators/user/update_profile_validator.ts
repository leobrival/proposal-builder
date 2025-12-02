import vine from "@vinejs/vine";

/**
 * Validator for updating user profile
 * Validates firstName, lastName, and email format
 */
export const updateProfileValidator = vine.compile(
	vine.object({
		firstName: vine.string().trim().minLength(1).maxLength(100),
		lastName: vine.string().trim().minLength(1).maxLength(100),
		email: vine.string().trim().email().normalizeEmail(),
	}),
);

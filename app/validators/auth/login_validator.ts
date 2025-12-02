import vine from "@vinejs/vine";

/**
 * Validator for user login
 * Validates email format and password presence
 */
export const loginValidator = vine.compile(
	vine.object({
		email: vine.string().email(),
		password: vine.string(),
		remember: vine.boolean().optional(),
	}),
);

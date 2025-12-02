import vine from "@vinejs/vine";

/**
 * Validator for account deletion
 * Requires password confirmation before deletion
 */
export const deleteAccountValidator = vine.compile(
	vine.object({
		password: vine.string().minLength(1),
	}),
);

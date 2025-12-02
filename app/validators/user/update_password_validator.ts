import vine from "@vinejs/vine";

/**
 * Validator for updating user password
 * Validates current password presence and new password strength with confirmation
 */
export const updatePasswordValidator = vine.compile(
	vine.object({
		currentPassword: vine.string().minLength(1),
		newPassword: vine.string().minLength(8),
		confirmPassword: vine
			.string()
			.confirmed({ confirmationField: "newPassword" }),
	}),
);

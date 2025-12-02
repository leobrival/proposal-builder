import vine from "@vinejs/vine";

/**
 * Validator for user registration
 * Validates firstName, lastName, email uniqueness, and password strength
 */
export const registerValidator = vine.compile(
	vine.object({
		firstName: vine.string().trim().minLength(1).maxLength(255),
		lastName: vine.string().trim().minLength(1).maxLength(255),
		email: vine
			.string()
			.email()
			.normalizeEmail()
			.unique(async (db, value) => {
				const user = await db.from("users").where("email", value).first();
				return !user;
			}),
		password: vine.string().minLength(8).maxLength(255),
	}),
);

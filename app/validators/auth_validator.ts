import vine from "@vinejs/vine";

export const registerValidator = vine.compile(
	vine.object({
		fullName: vine.string().trim().minLength(2).maxLength(255),
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

export const loginValidator = vine.compile(
	vine.object({
		email: vine.string().email(),
		password: vine.string(),
		remember: vine.boolean().optional(),
	}),
);

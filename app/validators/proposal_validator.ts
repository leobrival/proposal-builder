import vine from "@vinejs/vine";

const designSettingsSchema = vine.object({
	primaryColor: vine.string().hexCode(),
	secondaryColor: vine.string().hexCode(),
	fontFamily: vine.string(),
	logoPosition: vine.enum(["left", "center", "right"]),
	layout: vine.enum(["modern", "classic", "minimal"]),
});

const benefitSchema = vine.object({
	id: vine.string().uuid().optional(),
	description: vine.string().trim().minLength(1).maxLength(500),
	position: vine.number().min(0),
});

const tierSchema = vine.object({
	id: vine.string().uuid().optional(),
	name: vine.string().trim().minLength(1).maxLength(255),
	price: vine.number().min(0),
	currency: vine.string().fixedLength(3),
	description: vine.string().trim().maxLength(1000).nullable(),
	isFeatured: vine.boolean(),
	maxSponsors: vine.number().min(1).nullable(),
	position: vine.number().min(0),
	benefits: vine.array(benefitSchema),
});

export const createProposalValidator = vine.compile(
	vine.object({
		title: vine.string().trim().minLength(1).maxLength(255),
		description: vine.string().trim().maxLength(2000).nullable(),
		projectName: vine.string().trim().minLength(1).maxLength(255),
		projectDescription: vine.string().trim().maxLength(2000).nullable(),
		contactEmail: vine.string().email(),
		contactPhone: vine.string().trim().maxLength(20).nullable(),
		designSettings: designSettingsSchema.optional(),
	}),
);

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
	}),
);

export const publishProposalValidator = vine.compile(
	vine.object({
		id: vine.string().uuid(),
	}),
);

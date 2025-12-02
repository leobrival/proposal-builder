import vine from "@vinejs/vine";

/**
 * Shared schema for design settings
 */
export const designSettingsSchema = vine.object({
	primaryColor: vine.string().hexCode(),
	secondaryColor: vine.string().hexCode(),
	fontFamily: vine.string(),
	logoPosition: vine.enum(["left", "center", "right"]),
	layout: vine.enum(["modern", "classic", "minimal"]),
});

/**
 * Shared schema for benefit within a tier
 */
export const benefitSchema = vine.object({
	id: vine.string().uuid().optional(),
	description: vine.string().trim().minLength(1).maxLength(500),
	position: vine.number().min(0),
});

/**
 * Shared schema for tier within a proposal
 */
export const tierSchema = vine.object({
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

/**
 * Shared schema for event fields
 */
export const eventFieldsSchema = {
	eventStartDate: vine.string().optional().nullable(),
	eventEndDate: vine.string().optional().nullable(),
	eventVenueName: vine.string().trim().maxLength(255).optional().nullable(),
	eventAddress: vine.string().trim().maxLength(500).optional().nullable(),
	eventCity: vine.string().trim().maxLength(100).optional().nullable(),
	eventCountry: vine.string().trim().maxLength(100).optional().nullable(),
	eventLatitude: vine.number().optional().nullable(),
	eventLongitude: vine.number().optional().nullable(),
	eventCategory: vine.string().trim().maxLength(100).optional().nullable(),
	eventTags: vine.array(vine.string()).optional(),
	eventSourceUrl: vine.string().url().maxLength(500).optional().nullable(),
	eventSourcePlatform: vine.string().trim().maxLength(50).optional().nullable(),
	eventExternalId: vine.string().trim().maxLength(100).optional().nullable(),
	organizerName: vine.string().trim().maxLength(255).optional().nullable(),
	organizerWebsite: vine.string().url().maxLength(500).optional().nullable(),
	eventFormat: vine
		.enum(["in_person", "online", "hybrid"])
		.optional()
		.nullable(),
	eventExpectedAttendees: vine.number().min(0).optional().nullable(),
};

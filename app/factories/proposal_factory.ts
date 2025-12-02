import { randomUUID } from "node:crypto";
import string from "@adonisjs/core/helpers/string";
import type { DateTime } from "luxon";
import type {
	DesignSettings,
	EventFormat,
	ProposalStatus,
} from "#models/proposal";
import { defaultDesignSettings } from "#models/proposal";

/**
 * Data structure for creating a proposal
 */
export interface CreateProposalInput {
	title: string;
	projectName: string;
	contactEmail: string;
	description?: string | null;
	projectDescription?: string | null;
	contactPhone?: string | null;
	logoUrl?: string | null;
	coverImageUrl?: string | null;
}

/**
 * Data structure for creating a proposal from an event
 */
export interface CreateFromEventInput extends CreateProposalInput {
	eventStartDate?: DateTime | null;
	eventEndDate?: DateTime | null;
	eventVenueName?: string | null;
	eventAddress?: string | null;
	eventCity?: string | null;
	eventCountry?: string | null;
	eventCategory?: string | null;
	eventTags?: string[];
	eventFormat?: EventFormat | null;
	eventExpectedAttendees?: number | null;
	organizerName?: string | null;
	organizerWebsite?: string | null;
	eventSourceUrl?: string | null;
	eventSourcePlatform?: string | null;
	eventExternalId?: string | null;
}

/**
 * Proposal template for quick creation
 */
export interface ProposalTemplate {
	name: string;
	description: string;
	defaultTiers: TierTemplate[];
	defaultDesignSettings?: Partial<DesignSettings>;
	defaultPageLayout?: Record<string, unknown>;
}

/**
 * Tier template
 */
export interface TierTemplate {
	name: string;
	price: number;
	currency: string;
	description: string;
	benefits: string[];
	isFeatured?: boolean;
}

/**
 * Built proposal data ready for persistence
 */
export interface ProposalData {
	id: string;
	userId: string;
	title: string;
	slug: string;
	projectName: string;
	contactEmail: string;
	status: ProposalStatus;
	viewCount: number;
	designSettings: DesignSettings;
	description: string | null;
	projectDescription: string | null;
	contactPhone: string | null;
	logoUrl: string | null;
	coverImageUrl: string | null;
	eventStartDate?: DateTime | null;
	eventEndDate?: DateTime | null;
	eventVenueName?: string | null;
	eventAddress?: string | null;
	eventCity?: string | null;
	eventCountry?: string | null;
	eventCategory?: string | null;
	eventTags?: string[];
	eventFormat?: EventFormat | null;
	eventExpectedAttendees?: number | null;
	organizerName?: string | null;
	organizerWebsite?: string | null;
	eventSourceUrl?: string | null;
	eventSourcePlatform?: string | null;
	eventExternalId?: string | null;
	pageLayout?: Record<string, unknown> | null;
}

/**
 * Proposal Factory
 * Creates proposal data objects with different configurations.
 */
export class ProposalFactory {
	/**
	 * Generate a unique slug from title
	 */
	private static generateSlug(title: string): string {
		const baseSlug = string.slug(title, { lower: true });
		return `${baseSlug}-${randomUUID().slice(0, 8)}`;
	}

	/**
	 * Create a basic draft proposal
	 */
	static createDraft(userId: string, input: CreateProposalInput): ProposalData {
		return {
			id: randomUUID(),
			userId,
			title: input.title,
			slug: ProposalFactory.generateSlug(input.title),
			projectName: input.projectName,
			contactEmail: input.contactEmail,
			status: "draft",
			viewCount: 0,
			designSettings: { ...defaultDesignSettings },
			description: input.description ?? null,
			projectDescription: input.projectDescription ?? null,
			contactPhone: input.contactPhone ?? null,
			logoUrl: input.logoUrl ?? null,
			coverImageUrl: input.coverImageUrl ?? null,
		};
	}

	/**
	 * Create a proposal from event data
	 */
	static createFromEvent(
		userId: string,
		input: CreateFromEventInput,
	): ProposalData {
		const base = ProposalFactory.createDraft(userId, input);

		return {
			...base,
			eventStartDate: input.eventStartDate,
			eventEndDate: input.eventEndDate,
			eventVenueName: input.eventVenueName ?? null,
			eventAddress: input.eventAddress ?? null,
			eventCity: input.eventCity ?? null,
			eventCountry: input.eventCountry ?? null,
			eventCategory: input.eventCategory ?? null,
			eventTags: input.eventTags ?? [],
			eventFormat: input.eventFormat ?? null,
			eventExpectedAttendees: input.eventExpectedAttendees ?? null,
			organizerName: input.organizerName ?? null,
			organizerWebsite: input.organizerWebsite ?? null,
			eventSourceUrl: input.eventSourceUrl ?? null,
			eventSourcePlatform: input.eventSourcePlatform ?? null,
			eventExternalId: input.eventExternalId ?? null,
		};
	}

	/**
	 * Create a proposal from a template
	 */
	static createFromTemplate(
		userId: string,
		template: ProposalTemplate,
		input: Partial<CreateProposalInput>,
	): ProposalData {
		const title = input.title ?? `${template.name} - New Proposal`;

		return {
			id: randomUUID(),
			userId,
			title,
			slug: ProposalFactory.generateSlug(title),
			projectName: input.projectName ?? "",
			contactEmail: input.contactEmail ?? "",
			status: "draft",
			viewCount: 0,
			designSettings: {
				...defaultDesignSettings,
				...template.defaultDesignSettings,
			},
			description: input.description ?? template.description,
			projectDescription: input.projectDescription ?? null,
			contactPhone: input.contactPhone ?? null,
			logoUrl: input.logoUrl ?? null,
			coverImageUrl: input.coverImageUrl ?? null,
			pageLayout: template.defaultPageLayout ?? null,
		};
	}

	/**
	 * Create a copy of an existing proposal
	 */
	static createCopy(
		userId: string,
		original: ProposalData,
		newTitle?: string,
	): ProposalData {
		const title = newTitle ?? `${original.title} (Copy)`;

		return {
			...original,
			id: randomUUID(),
			userId,
			title,
			slug: ProposalFactory.generateSlug(title),
			status: "draft",
			viewCount: 0,
		};
	}
}

/**
 * Predefined templates
 */
export const PROPOSAL_TEMPLATES: Record<string, ProposalTemplate> = {
	conference: {
		name: "Conference Sponsorship",
		description: "Standard conference sponsorship proposal with multiple tiers",
		defaultTiers: [
			{
				name: "Platinum",
				price: 10000,
				currency: "EUR",
				description: "Premium visibility and exclusive benefits",
				benefits: [
					"Logo on main stage backdrop",
					"Premium booth location",
					"5 VIP passes",
					"Keynote speaking slot",
					"Social media promotion",
				],
				isFeatured: true,
			},
			{
				name: "Gold",
				price: 5000,
				currency: "EUR",
				description: "High visibility sponsorship package",
				benefits: [
					"Logo on event materials",
					"Standard booth",
					"3 passes",
					"Workshop slot",
				],
			},
			{
				name: "Silver",
				price: 2500,
				currency: "EUR",
				description: "Standard sponsorship package",
				benefits: ["Logo on website", "2 passes", "Networking access"],
			},
		],
		defaultDesignSettings: {
			primaryColor: "#1E40AF",
			layout: "modern",
		},
	},
	meetup: {
		name: "Meetup Sponsorship",
		description: "Simple sponsorship for local meetups and community events",
		defaultTiers: [
			{
				name: "Venue Sponsor",
				price: 500,
				currency: "EUR",
				description: "Cover venue costs and get visibility",
				benefits: ["Logo display", "Verbal thanks", "2 tickets"],
				isFeatured: true,
			},
			{
				name: "Food & Drinks",
				price: 300,
				currency: "EUR",
				description: "Sponsor refreshments",
				benefits: ["Logo on tables", "Verbal thanks", "1 ticket"],
			},
		],
		defaultDesignSettings: {
			primaryColor: "#059669",
			layout: "minimal",
		},
	},
	hackathon: {
		name: "Hackathon Sponsorship",
		description: "Sponsorship packages for hackathons and coding events",
		defaultTiers: [
			{
				name: "Title Sponsor",
				price: 15000,
				currency: "EUR",
				description: "Naming rights and maximum exposure",
				benefits: [
					"Event naming rights",
					"Judge seat",
					"Prize category naming",
					"Recruiting booth",
					"10 mentor spots",
				],
				isFeatured: true,
			},
			{
				name: "Track Sponsor",
				price: 5000,
				currency: "EUR",
				description: "Sponsor a specific challenge track",
				benefits: [
					"Track naming",
					"Prize contribution",
					"3 mentor spots",
					"Logo on materials",
				],
			},
			{
				name: "Supporter",
				price: 1000,
				currency: "EUR",
				description: "Basic support package",
				benefits: ["Logo on website", "Social media mention"],
			},
		],
		defaultDesignSettings: {
			primaryColor: "#7C3AED",
			layout: "modern",
		},
	},
};

export default ProposalFactory;

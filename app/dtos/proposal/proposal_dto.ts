import type Benefit from "#models/benefit";
import type Proposal from "#models/proposal";
import type Tier from "#models/tier";
import { toUserReferenceDto, type UserReferenceDto } from "../user/user_dto.js";

/**
 * DTO for benefit data
 */
export interface BenefitDto {
	id: string;
	description: string;
	position: number;
}

/**
 * DTO for tier data
 */
export interface TierDto {
	id: string;
	name: string;
	price: number;
	currency: string;
	description: string | null;
	isFeatured: boolean;
	maxSponsors: number | null;
	position: number;
	benefits: BenefitDto[];
}

/**
 * DTO for proposal list items
 */
export interface ProposalListItemDto {
	id: string;
	title: string;
	projectName: string;
	status: string;
	slug: string | null;
	viewCount: number;
	createdAt: string;
	updatedAt: string;
}

/**
 * DTO for full proposal details
 */
export interface ProposalDetailDto {
	id: string;
	title: string;
	description: string | null;
	projectName: string;
	projectDescription: string | null;
	contactEmail: string;
	contactPhone: string | null;
	logoUrl: string | null;
	coverImageUrl: string | null;
	status: string;
	slug: string | null;
	viewCount: number;
	publishedAt: string | null;
	// Event fields
	eventStartDate: string | null;
	eventEndDate: string | null;
	eventVenueName: string | null;
	eventAddress: string | null;
	eventCity: string | null;
	eventCountry: string | null;
	eventCategory: string | null;
	eventTags: string[];
	eventFormat: string | null;
	eventExpectedAttendees: number | null;
	organizerName: string | null;
	organizerWebsite: string | null;
	// Relations
	tiers: TierDto[];
	user?: UserReferenceDto;
	// Timestamps
	createdAt: string;
	updatedAt: string;
}

/**
 * DTO for public proposal view
 */
export interface PublicProposalDto {
	id: string;
	title: string;
	description: string | null;
	projectName: string;
	projectDescription: string | null;
	contactEmail: string;
	logoUrl: string | null;
	coverImageUrl: string | null;
	slug: string;
	// Event fields
	eventStartDate: string | null;
	eventEndDate: string | null;
	eventVenueName: string | null;
	eventCity: string | null;
	eventCountry: string | null;
	eventCategory: string | null;
	eventFormat: string | null;
	eventExpectedAttendees: number | null;
	organizerName: string | null;
	organizerWebsite: string | null;
	// Relations
	tiers: TierDto[];
	user: UserReferenceDto;
}

/**
 * Transform a Benefit model to BenefitDto
 */
export function toBenefitDto(benefit: Benefit): BenefitDto {
	return {
		id: benefit.id,
		description: benefit.description,
		position: benefit.position,
	};
}

/**
 * Transform a Tier model to TierDto
 */
export function toTierDto(tier: Tier): TierDto {
	return {
		id: tier.id,
		name: tier.name,
		price: tier.price,
		currency: tier.currency,
		description: tier.description,
		isFeatured: tier.isFeatured,
		maxSponsors: tier.maxSponsors,
		position: tier.position,
		benefits: tier.benefits?.map(toBenefitDto) ?? [],
	};
}

/**
 * Transform a Proposal model to ProposalListItemDto
 */
export function toProposalListItemDto(proposal: Proposal): ProposalListItemDto {
	return {
		id: proposal.id,
		title: proposal.title,
		projectName: proposal.projectName,
		status: proposal.status,
		slug: proposal.slug,
		viewCount: proposal.viewCount || 0,
		createdAt: proposal.createdAt.toISO() ?? "",
		updatedAt: proposal.updatedAt.toISO() ?? "",
	};
}

/**
 * Transform a Proposal model to ProposalDetailDto
 */
export function toProposalDetailDto(proposal: Proposal): ProposalDetailDto {
	return {
		id: proposal.id,
		title: proposal.title,
		description: proposal.description,
		projectName: proposal.projectName,
		projectDescription: proposal.projectDescription,
		contactEmail: proposal.contactEmail,
		contactPhone: proposal.contactPhone,
		logoUrl: proposal.logoUrl,
		coverImageUrl: proposal.coverImageUrl,
		status: proposal.status,
		slug: proposal.slug,
		viewCount: proposal.viewCount || 0,
		publishedAt: proposal.publishedAt?.toISO() ?? null,
		// Event fields
		eventStartDate: proposal.eventStartDate?.toISO() ?? null,
		eventEndDate: proposal.eventEndDate?.toISO() ?? null,
		eventVenueName: proposal.eventVenueName,
		eventAddress: proposal.eventAddress,
		eventCity: proposal.eventCity,
		eventCountry: proposal.eventCountry,
		eventCategory: proposal.eventCategory,
		eventTags: proposal.eventTags || [],
		eventFormat: proposal.eventFormat,
		eventExpectedAttendees: proposal.eventExpectedAttendees,
		organizerName: proposal.organizerName,
		organizerWebsite: proposal.organizerWebsite,
		// Relations
		tiers: proposal.tiers?.map(toTierDto) ?? [],
		user: proposal.user ? toUserReferenceDto(proposal.user) : undefined,
		// Timestamps
		createdAt: proposal.createdAt.toISO() ?? "",
		updatedAt: proposal.updatedAt.toISO() ?? "",
	};
}

/**
 * Transform a Proposal model to PublicProposalDto
 */
export function toPublicProposalDto(proposal: Proposal): PublicProposalDto {
	if (!proposal.user) {
		throw new Error("Proposal must have user loaded for public DTO");
	}

	return {
		id: proposal.id,
		title: proposal.title,
		description: proposal.description,
		projectName: proposal.projectName,
		projectDescription: proposal.projectDescription,
		contactEmail: proposal.contactEmail,
		logoUrl: proposal.logoUrl,
		coverImageUrl: proposal.coverImageUrl,
		slug: proposal.slug!,
		// Event fields
		eventStartDate: proposal.eventStartDate?.toISO() ?? null,
		eventEndDate: proposal.eventEndDate?.toISO() ?? null,
		eventVenueName: proposal.eventVenueName,
		eventCity: proposal.eventCity,
		eventCountry: proposal.eventCountry,
		eventCategory: proposal.eventCategory,
		eventFormat: proposal.eventFormat,
		eventExpectedAttendees: proposal.eventExpectedAttendees,
		organizerName: proposal.organizerName,
		organizerWebsite: proposal.organizerWebsite,
		// Relations
		tiers: proposal.tiers?.map(toTierDto) ?? [],
		user: toUserReferenceDto(proposal.user),
	};
}

/**
 * Transform an array of Proposals to ProposalListItemDto array
 */
export function toProposalListDto(
	proposals: Proposal[],
): ProposalListItemDto[] {
	return proposals.map(toProposalListItemDto);
}

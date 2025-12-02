export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	fullName: string;
	isAdmin: boolean;
}

export interface SharedProps {
	user: User | null;
	flash: {
		success?: string;
		error?: string;
		info?: string;
	};
	errors: Record<string, string>;
	appName: string;
}

export type ProposalStatus = "draft" | "published" | "archived";
export type DomainStatus = "pending" | "verifying" | "verified" | "failed";
export type SslStatus = "none" | "pending" | "active" | "failed";
export type EventFormat = "in_person" | "online" | "hybrid";

export interface DesignSettings {
	primaryColor: string;
	secondaryColor: string;
	fontFamily: string;
	logoPosition: "left" | "center" | "right";
	layout: "modern" | "classic" | "minimal";
}

export interface Proposal {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	projectName: string;
	projectDescription: string | null;
	logoUrl: string | null;
	coverImageUrl: string | null;
	contactEmail: string;
	contactPhone: string | null;
	status: ProposalStatus;
	publishedAt: string | null;
	viewCount: number;
	designSettings: DesignSettings;
	// Domain settings
	subdomain: string | null;
	customDomain: string | null;
	domainStatus: DomainStatus;
	sslStatus: SslStatus;
	domainVerifiedAt: string | null;
	// Event date and time
	eventStartDate: string | null;
	eventEndDate: string | null;
	// Event location
	eventVenueName: string | null;
	eventAddress: string | null;
	eventCity: string | null;
	eventCountry: string | null;
	eventLatitude: number | null;
	eventLongitude: number | null;
	// Event metadata
	eventCategory: string | null;
	eventTags: string[];
	eventSourceUrl: string | null;
	eventSourcePlatform: string | null;
	eventExternalId: string | null;
	// Organizer info
	organizerName: string | null;
	organizerWebsite: string | null;
	// Event format
	eventFormat: EventFormat | null;
	eventExpectedAttendees: number | null;
	createdAt: string;
	updatedAt: string;
	tiers?: Tier[];
}

export interface DomainSettings {
	subdomain: string | null;
	subdomainUrl: string | null;
	customDomain: string | null;
	domainStatus: DomainStatus;
	sslStatus: SslStatus;
	domainVerifiedAt: string | null;
	dnsInstructions: {
		cname: { host: string; value: string };
		txt: { host: string; value: string };
	} | null;
	cnameTarget: string;
}

export interface Tier {
	id: string;
	name: string;
	price: number;
	currency: string;
	description: string | null;
	isFeatured: boolean;
	maxSponsors: number | null;
	position: number;
	benefits: Benefit[];
}

export interface Benefit {
	id: string;
	description: string;
	position: number;
}

export type LeadStatus =
	| "new"
	| "contacted"
	| "pending"
	| "converted"
	| "rejected";

export interface Lead {
	id: string;
	name: string;
	email: string;
	company: string | null;
	phone: string | null;
	message: string | null;
	status: LeadStatus;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
	proposal?: Pick<Proposal, "id" | "title">;
	interestedTier?: Pick<Tier, "id" | "name"> | null;
}

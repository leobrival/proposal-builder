/**
 * Spons Easy MCP Client Types
 */

/**
 * API client configuration
 */
export interface SponsEasyConfig {
	/** API key (starts with sk_) */
	apiKey: string;
	/** Base URL (default: https://api.sponseasy.com) */
	baseUrl?: string;
	/** Request timeout in ms (default: 30000) */
	timeout?: number;
	/** Custom fetch implementation */
	fetch?: typeof fetch;
}

/**
 * Proposal status
 */
export type ProposalStatus = "draft" | "published" | "archived";

/**
 * Event format type
 */
export type EventFormat = "in_person" | "online" | "hybrid";

/**
 * Proposal object
 */
export interface Proposal {
	id: string;
	title: string;
	description: string | null;
	status: ProposalStatus;
	slug: string;
	projectName: string;
	projectDescription?: string | null;
	eventStartDate?: string | null;
	eventEndDate?: string | null;
	eventVenueName?: string | null;
	eventAddress?: string | null;
	eventCity?: string | null;
	eventCountry?: string | null;
	eventCategory?: string | null;
	eventFormat?: EventFormat | null;
	subdomain?: string | null;
	customDomain?: string | null;
	createdAt: string;
	updatedAt: string;
	publishedAt?: string | null;
}

/**
 * Create proposal input
 */
export interface CreateProposalInput {
	title: string;
	description?: string;
	projectName?: string;
	eventStartDate?: string;
	eventEndDate?: string;
	eventVenueName?: string;
	eventCity?: string;
}

/**
 * Update proposal input
 */
export interface UpdateProposalInput {
	title?: string;
	description?: string;
	projectName?: string;
	eventStartDate?: string;
	eventEndDate?: string;
	eventVenueName?: string;
	eventCity?: string;
}

/**
 * List proposals options
 */
export interface ListProposalsOptions {
	status?: ProposalStatus;
	limit?: number;
	offset?: number;
}

/**
 * Pagination info
 */
export interface Pagination {
	limit: number;
	offset: number;
	hasMore: boolean;
}

/**
 * List proposals response
 */
export interface ListProposalsResponse {
	proposals: Proposal[];
	pagination: Pagination;
}

/**
 * Analytics period
 */
export type AnalyticsPeriod = "7d" | "30d" | "90d";

/**
 * Analytics options
 */
export interface AnalyticsOptions {
	proposalId?: string;
	period?: AnalyticsPeriod;
}

/**
 * Analytics response
 */
export interface AnalyticsResponse {
	period: string;
	totalProposals: number;
	publishedProposals: number;
	draftProposals: number;
	views: number;
	uniqueViews: number;
}

/**
 * Plan type
 */
export type PlanType = "free" | "pro" | "enterprise";

/**
 * Plan limits
 */
export interface PlanLimits {
	current: number;
	limit: number;
	remaining: number;
	unlimited: boolean;
}

/**
 * Plan features
 */
export interface PlanFeatures {
	canRemoveBranding: boolean;
	hasAnalytics: boolean;
	hasPrioritySupport: boolean;
	hasCustomTemplates: boolean;
	hasApiAccess: boolean;
}

/**
 * User limits response
 */
export interface UserLimitsResponse {
	plan: PlanType;
	proposals: PlanLimits;
	apiKeys: PlanLimits;
	features: PlanFeatures;
}

/**
 * User info
 */
export interface User {
	id: string;
	email: string;
	fullName: string;
	plan: PlanType;
	limits: {
		proposals: PlanLimits;
		apiKeys: PlanLimits;
	};
	features: PlanFeatures;
}

/**
 * MCP tool definition
 */
export interface McpTool {
	name: string;
	description: string;
	inputSchema: {
		type: string;
		properties: Record<string, unknown>;
		required?: string[];
	};
	requiredScope: string;
}

/**
 * API error
 */
export interface ApiError {
	error: string;
	code: string;
}

/**
 * Tool execution result
 */
export interface ToolResult<T = unknown> {
	result: T;
	_meta: {
		tool: string;
		executionTime: number;
	};
}

/**
 * Limit exceeded error response
 */
export interface LimitExceededError {
	error: string;
	code: "LIMIT_EXCEEDED";
}

// ==================== Documentation Types ====================

/**
 * Documentation section
 */
export type DocSection =
	| "getting-started"
	| "integration"
	| "features"
	| "api"
	| "guides";

/**
 * Blog category
 */
export type BlogCategory =
	| "product"
	| "tutorial"
	| "case-study"
	| "announcement"
	| "tips";

/**
 * Table of contents item
 */
export interface TocItem {
	id: string;
	title: string;
	level: number;
	children: TocItem[];
}

/**
 * Documentation page
 */
export interface DocPage {
	slug: string;
	title: string;
	description: string;
	section: DocSection;
	icon?: string;
	excerpt: string;
	content?: string;
	html?: string;
	toc?: TocItem[];
	readingTime?: number;
}

/**
 * Blog post
 */
export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	category: BlogCategory;
	author: string;
	tags: string[];
	publishedAt?: string;
	readingTime?: number;
	excerpt: string;
	content?: string;
	html?: string;
	toc?: TocItem[];
}

/**
 * Changelog entry
 */
export interface ChangelogEntry {
	version: string;
	date: string;
	title: string;
	description?: string;
}

/**
 * List docs options
 */
export interface ListDocsOptions {
	section?: DocSection;
}

/**
 * List docs response
 */
export interface ListDocsResponse {
	docs: DocPage[];
	total: number;
}

/**
 * List blog options
 */
export interface ListBlogOptions {
	category?: BlogCategory;
	tag?: string;
	limit?: number;
}

/**
 * List blog response
 */
export interface ListBlogResponse {
	posts: BlogPost[];
	total: number;
}

/**
 * Search docs options
 */
export interface SearchDocsOptions {
	query: string;
	types?: ("blog" | "docs")[];
}

/**
 * Search result item
 */
export interface SearchResultItem {
	type: "blog" | "docs";
	slug: string;
	title: string;
	description: string;
	excerpt: string;
}

/**
 * Search docs response
 */
export interface SearchDocsResponse {
	results: SearchResultItem[];
	total: number;
	query: string;
}

/**
 * Changelog response
 */
export interface ChangelogResponse {
	entries: ChangelogEntry[];
	total: number;
}

/**
 * Content Service Contract
 * Defines the interface for managing Markdown content (blog, docs, changelog).
 */

/**
 * Content type
 */
export type ContentType = "blog" | "docs" | "changelog";

/**
 * Content category for blog posts
 */
export type BlogCategory =
	| "product"
	| "tutorial"
	| "case-study"
	| "announcement"
	| "tips";

/**
 * Funnel stage for content marketing
 * Based on the awareness funnel:
 * - TOFU (Top of Funnel): Discovery - attract new visitors, introduce the platform
 * - MOFU (Middle of Funnel): Consideration - help registered users get value
 * - BOFU (Bottom of Funnel): Decision - advanced users, AI assistant, MCP integration
 */
export type FunnelStage = "tofu" | "mofu" | "bofu";

/**
 * Content status
 */
export type ContentStatus = "draft" | "published" | "archived";

/**
 * Base frontmatter for all content types
 */
export interface BaseFrontmatter {
	title: string;
	slug: string;
	description: string;
	publishedAt?: string;
	updatedAt?: string;
	status: ContentStatus;
}

/**
 * Blog post frontmatter
 */
export interface BlogFrontmatter extends BaseFrontmatter {
	category: BlogCategory;
	/**
	 * Funnel stage for content targeting:
	 * - tofu: Discovery articles for new visitors (SEO, awareness)
	 * - mofu: Articles for registered users learning the platform
	 * - bofu: Advanced content for power users (MCP, AI assistant, integrations)
	 */
	funnelStage: FunnelStage;
	author: string;
	authorAvatar?: string;
	coverImage?: string;
	tags: string[];
	readingTime?: number;
	featured?: boolean;
	seo?: {
		title?: string;
		description?: string;
		keywords?: string[];
	};
}

/**
 * Documentation frontmatter
 */
export interface DocsFrontmatter extends BaseFrontmatter {
	section: string;
	order: number;
	icon?: string;
	relatedDocs?: string[];
}

/**
 * Changelog entry frontmatter
 */
export interface ChangelogFrontmatter {
	version: string;
	date: string;
	title: string;
	description?: string;
}

/**
 * Parsed content with frontmatter
 */
export interface ParsedContent<T extends BaseFrontmatter = BaseFrontmatter> {
	frontmatter: T;
	content: string;
	html: string;
	excerpt: string;
	toc: TableOfContentsItem[];
}

/**
 * Table of contents item
 */
export interface TableOfContentsItem {
	id: string;
	title: string;
	level: number;
	children: TableOfContentsItem[];
}

/**
 * Content listing options
 */
export interface ContentListOptions {
	type: ContentType;
	status?: ContentStatus;
	category?: BlogCategory;
	funnelStage?: FunnelStage;
	tag?: string;
	limit?: number;
	offset?: number;
	orderBy?: "publishedAt" | "updatedAt" | "title";
	order?: "asc" | "desc";
}

/**
 * Content listing result
 */
export interface ContentListResult<T extends BaseFrontmatter> {
	items: ParsedContent<T>[];
	total: number;
	hasMore: boolean;
}

/**
 * Create blog post options
 */
export interface CreateBlogPostOptions {
	title: string;
	slug?: string;
	description: string;
	category: BlogCategory;
	funnelStage?: FunnelStage;
	author: string;
	tags?: string[];
	coverImage?: string;
	content: string;
	status?: ContentStatus;
	featured?: boolean;
}

/**
 * Create doc options
 */
export interface CreateDocOptions {
	title: string;
	slug?: string;
	description: string;
	section: string;
	order: number;
	icon?: string;
	content: string;
	status?: ContentStatus;
}

/**
 * Content Service Contract
 */
export abstract class ContentServiceContract {
	/**
	 * Get a single content item by slug
	 */
	abstract get<T extends BaseFrontmatter>(
		type: ContentType,
		slug: string
	): Promise<ParsedContent<T> | null>;

	/**
	 * List content items
	 */
	abstract list<T extends BaseFrontmatter>(
		options: ContentListOptions
	): Promise<ContentListResult<T>>;

	/**
	 * Create a new blog post
	 */
	abstract createBlogPost(
		options: CreateBlogPostOptions
	): Promise<ParsedContent<BlogFrontmatter>>;

	/**
	 * Create a new documentation page
	 */
	abstract createDoc(
		options: CreateDocOptions
	): Promise<ParsedContent<DocsFrontmatter>>;

	/**
	 * Update content
	 */
	abstract update<T extends BaseFrontmatter>(
		type: ContentType,
		slug: string,
		content: string,
		frontmatter: Partial<T>
	): Promise<ParsedContent<T>>;

	/**
	 * Delete content
	 */
	abstract delete(type: ContentType, slug: string): Promise<boolean>;

	/**
	 * Get changelog entries
	 */
	abstract getChangelog(): Promise<ChangelogFrontmatter[]>;

	/**
	 * Add changelog entry
	 */
	abstract addChangelogEntry(
		version: string,
		changes: {
			added?: string[];
			changed?: string[];
			fixed?: string[];
			removed?: string[];
			security?: string[];
		}
	): Promise<void>;

	/**
	 * Search content
	 */
	abstract search(
		query: string,
		types?: ContentType[]
	): Promise<ParsedContent<BaseFrontmatter>[]>;

	/**
	 * Get related content
	 */
	abstract getRelated<T extends BaseFrontmatter>(
		type: ContentType,
		slug: string,
		limit?: number
	): Promise<ParsedContent<T>[]>;

	/**
	 * Rebuild content cache
	 */
	abstract rebuildCache(): Promise<void>;
}

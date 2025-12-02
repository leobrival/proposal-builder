/**
 * Content Service
 * Manages Markdown content for blog, documentation, and changelog.
 * File-based content stored in /content directory.
 */

import { readFile, writeFile, readdir, unlink, mkdir, access } from "node:fs/promises";
import { join, basename } from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { mangle } from "marked-mangle";
import slugify from "slugify";
import readingTime from "reading-time";
import app from "@adonisjs/core/services/app";
import {
	type BaseFrontmatter,
	type BlogFrontmatter,
	type ChangelogFrontmatter,
	type ContentListOptions,
	type ContentListResult,
	type ContentType,
	ContentServiceContract,
	type CreateBlogPostOptions,
	type CreateDocOptions,
	type DocsFrontmatter,
	type ParsedContent,
	type TableOfContentsItem,
} from "#contracts/content_service_contract";

/**
 * Content Service Implementation
 */
class ContentService extends ContentServiceContract {
	private contentDir: string;
	private marked: Marked;
	private cache: Map<string, ParsedContent<BaseFrontmatter>> = new Map();

	constructor() {
		super();
		this.contentDir = app.makePath("content");
		this.marked = new Marked();
		this.marked.use(gfmHeadingId());
		this.marked.use(mangle());
	}

	/**
	 * Get content directory path for a type
	 */
	private getContentPath(type: ContentType): string {
		return join(this.contentDir, type);
	}

	/**
	 * Get file path for a content item
	 */
	private getFilePath(type: ContentType, slug: string): string {
		return join(this.getContentPath(type), `${slug}.md`);
	}

	/**
	 * Generate slug from title
	 */
	private generateSlug(title: string): string {
		const slugifyFn = slugify.default || slugify;
		return slugifyFn(title, {
			lower: true,
			strict: true,
			locale: "fr",
		});
	}

	/**
	 * Extract table of contents from HTML
	 */
	private extractToc(html: string): TableOfContentsItem[] {
		const headingRegex = /<h([2-4])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[2-4]>/g;
		const toc: TableOfContentsItem[] = [];
		const stack: { level: number; item: TableOfContentsItem }[] = [];

		let match: RegExpExecArray | null;
		while ((match = headingRegex.exec(html)) !== null) {
			const level = parseInt(match[1], 10);
			const id = match[2];
			const title = match[3].replace(/<[^>]+>/g, "").trim();

			const item: TableOfContentsItem = {
				id,
				title,
				level,
				children: [],
			};

			while (stack.length > 0 && stack[stack.length - 1].level >= level) {
				stack.pop();
			}

			if (stack.length === 0) {
				toc.push(item);
			} else {
				stack[stack.length - 1].item.children.push(item);
			}

			stack.push({ level, item });
		}

		return toc;
	}

	/**
	 * Extract excerpt from content
	 */
	private extractExcerpt(content: string, maxLength = 160): string {
		const text = content
			.replace(/^#+\s+.+$/gm, "") // Remove headings
			.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
			.replace(/[*_~`]/g, "") // Remove formatting
			.replace(/\n+/g, " ") // Normalize whitespace
			.trim();

		if (text.length <= maxLength) {
			return text;
		}

		return text.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
	}

	/**
	 * Parse markdown file
	 */
	private async parseFile<T extends BaseFrontmatter>(
		filePath: string,
	): Promise<ParsedContent<T> | null> {
		try {
			const fileContent = await readFile(filePath, "utf-8");
			const { data, content } = matter(fileContent);

			const html = await this.marked.parse(content);
			const toc = this.extractToc(html);
			const excerpt = data.description || this.extractExcerpt(content);
			const stats = readingTime(content);

			const frontmatter = {
				...data,
				readingTime: Math.ceil(stats.minutes),
			} as unknown as T;

			return {
				frontmatter,
				content,
				html,
				excerpt,
				toc,
			};
		} catch {
			return null;
		}
	}

	/**
	 * Get a single content item by slug
	 */
	async get<T extends BaseFrontmatter>(
		type: ContentType,
		slug: string,
	): Promise<ParsedContent<T> | null> {
		const cacheKey = `${type}:${slug}`;

		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey) as ParsedContent<T>;
		}

		const filePath = this.getFilePath(type, slug);
		const parsed = await this.parseFile<T>(filePath);

		if (parsed) {
			this.cache.set(cacheKey, parsed as ParsedContent<BaseFrontmatter>);
		}

		return parsed;
	}

	/**
	 * List content items
	 */
	async list<T extends BaseFrontmatter>(
		options: ContentListOptions,
	): Promise<ContentListResult<T>> {
		const contentPath = this.getContentPath(options.type);
		let files: string[];

		try {
			files = await readdir(contentPath);
		} catch {
			return { items: [], total: 0, hasMore: false };
		}

		const mdFiles = files.filter((f) => f.endsWith(".md"));
		const items: ParsedContent<T>[] = [];

		for (const file of mdFiles) {
			const slug = basename(file, ".md");
			const parsed = await this.get<T>(options.type, slug);

			if (!parsed) continue;

			// Filter by status
			if (
				options.status &&
				parsed.frontmatter.status !== options.status
			) {
				continue;
			}

			// Filter by category (blog only)
			if (
				options.category &&
				"category" in parsed.frontmatter &&
				(parsed.frontmatter as unknown as BlogFrontmatter).category !==
					options.category
			) {
				continue;
			}

			// Filter by tag (blog only)
			if (options.tag && "tags" in parsed.frontmatter) {
				const tags = (parsed.frontmatter as unknown as BlogFrontmatter)
					.tags;
				if (!tags.includes(options.tag)) {
					continue;
				}
			}

			// Filter by funnel stage (blog only)
			if (
				options.funnelStage &&
				"funnelStage" in parsed.frontmatter &&
				(parsed.frontmatter as unknown as BlogFrontmatter).funnelStage !==
					options.funnelStage
			) {
				continue;
			}

			items.push(parsed);
		}

		// Sort
		const orderBy = options.orderBy || "publishedAt";
		const order = options.order || "desc";

		items.sort((a, b) => {
			const aValue = a.frontmatter[orderBy as keyof BaseFrontmatter] || "";
			const bValue = b.frontmatter[orderBy as keyof BaseFrontmatter] || "";

			if (order === "asc") {
				return String(aValue).localeCompare(String(bValue));
			}
			return String(bValue).localeCompare(String(aValue));
		});

		const total = items.length;
		const offset = options.offset || 0;
		const limit = options.limit || 10;
		const paginatedItems = items.slice(offset, offset + limit);

		return {
			items: paginatedItems,
			total,
			hasMore: offset + limit < total,
		};
	}

	/**
	 * Create frontmatter string
	 */
	private createFrontmatter(data: Record<string, unknown>): string {
		const lines = ["---"];

		for (const [key, value] of Object.entries(data)) {
			if (value === undefined || value === null) continue;

			if (Array.isArray(value)) {
				lines.push(`${key}:`);
				for (const item of value) {
					lines.push(`  - ${item}`);
				}
			} else if (typeof value === "object") {
				lines.push(`${key}:`);
				for (const [subKey, subValue] of Object.entries(value)) {
					if (Array.isArray(subValue)) {
						lines.push(`  ${subKey}:`);
						for (const item of subValue) {
							lines.push(`    - ${item}`);
						}
					} else {
						lines.push(`  ${subKey}: ${subValue}`);
					}
				}
			} else {
				lines.push(`${key}: ${value}`);
			}
		}

		lines.push("---");
		return lines.join("\n");
	}

	/**
	 * Create a new blog post
	 */
	async createBlogPost(
		options: CreateBlogPostOptions,
	): Promise<ParsedContent<BlogFrontmatter>> {
		const slug = options.slug || this.generateSlug(options.title);
		const now = new Date().toISOString();

		const frontmatter: BlogFrontmatter = {
			title: options.title,
			slug,
			description: options.description,
			category: options.category,
			funnelStage: options.funnelStage || "tofu",
			author: options.author,
			tags: options.tags || [],
			coverImage: options.coverImage,
			status: options.status || "draft",
			featured: options.featured || false,
			publishedAt: options.status === "published" ? now : undefined,
			updatedAt: now,
		};

		const fileContent =
			this.createFrontmatter(frontmatter as unknown as Record<string, unknown>) +
			"\n\n" +
			options.content;

		const contentPath = this.getContentPath("blog");
		await mkdir(contentPath, { recursive: true });

		const filePath = this.getFilePath("blog", slug);
		await writeFile(filePath, fileContent, "utf-8");

		// Clear cache
		this.cache.delete(`blog:${slug}`);

		const parsed = await this.get<BlogFrontmatter>("blog", slug);
		if (!parsed) {
			throw new Error("Failed to create blog post");
		}

		return parsed;
	}

	/**
	 * Create a new documentation page
	 */
	async createDoc(
		options: CreateDocOptions,
	): Promise<ParsedContent<DocsFrontmatter>> {
		const slug = options.slug || this.generateSlug(options.title);
		const now = new Date().toISOString();

		const frontmatter: DocsFrontmatter = {
			title: options.title,
			slug,
			description: options.description,
			section: options.section,
			order: options.order,
			icon: options.icon,
			status: options.status || "draft",
			updatedAt: now,
		};

		const fileContent =
			this.createFrontmatter(frontmatter as unknown as Record<string, unknown>) +
			"\n\n" +
			options.content;

		const contentPath = this.getContentPath("docs");
		await mkdir(contentPath, { recursive: true });

		const filePath = this.getFilePath("docs", slug);
		await writeFile(filePath, fileContent, "utf-8");

		// Clear cache
		this.cache.delete(`docs:${slug}`);

		const parsed = await this.get<DocsFrontmatter>("docs", slug);
		if (!parsed) {
			throw new Error("Failed to create documentation");
		}

		return parsed;
	}

	/**
	 * Update content
	 */
	async update<T extends BaseFrontmatter>(
		type: ContentType,
		slug: string,
		content: string,
		frontmatterUpdates: Partial<T>,
	): Promise<ParsedContent<T>> {
		const existing = await this.get<T>(type, slug);
		if (!existing) {
			throw new Error(`Content not found: ${type}/${slug}`);
		}

		const now = new Date().toISOString();
		const updatedFrontmatter = {
			...existing.frontmatter,
			...frontmatterUpdates,
			updatedAt: now,
		};

		// If changing from draft to published, set publishedAt
		if (
			frontmatterUpdates.status === "published" &&
			existing.frontmatter.status !== "published"
		) {
			(updatedFrontmatter as BaseFrontmatter).publishedAt = now;
		}

		const fileContent =
			this.createFrontmatter(updatedFrontmatter as unknown as Record<string, unknown>) +
			"\n\n" +
			content;

		const filePath = this.getFilePath(type, slug);
		await writeFile(filePath, fileContent, "utf-8");

		// Clear cache
		this.cache.delete(`${type}:${slug}`);

		const parsed = await this.get<T>(type, slug);
		if (!parsed) {
			throw new Error("Failed to update content");
		}

		return parsed;
	}

	/**
	 * Delete content
	 */
	async delete(type: ContentType, slug: string): Promise<boolean> {
		const filePath = this.getFilePath(type, slug);

		try {
			await access(filePath);
			await unlink(filePath);
			this.cache.delete(`${type}:${slug}`);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get changelog entries
	 */
	async getChangelog(): Promise<ChangelogFrontmatter[]> {
		const changelogPath = join(
			this.getContentPath("changelog"),
			"CHANGELOG.md",
		);

		try {
			const content = await readFile(changelogPath, "utf-8");
			const entries: ChangelogFrontmatter[] = [];

			// Parse changelog format: ## [version] - date
			const versionRegex =
				/## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})\n\n([\s\S]*?)(?=## \[|$)/g;

			let match: RegExpExecArray | null;
			while ((match = versionRegex.exec(content)) !== null) {
				const version = match[1];
				const date = match[2];
				const body = match[3].trim();

				// Extract first line as title
				const firstLine = body.split("\n")[0];
				const title =
					firstLine.startsWith("###")
						? `Version ${version}`
						: firstLine.replace(/^###?\s*/, "");

				entries.push({
					version,
					date,
					title,
					description: body.substring(0, 200),
				});
			}

			return entries;
		} catch {
			return [];
		}
	}

	/**
	 * Add changelog entry
	 */
	async addChangelogEntry(
		version: string,
		changes: {
			added?: string[];
			changed?: string[];
			fixed?: string[];
			removed?: string[];
			security?: string[];
		},
	): Promise<void> {
		const changelogPath = join(
			this.getContentPath("changelog"),
			"CHANGELOG.md",
		);

		let existingContent = "";
		try {
			existingContent = await readFile(changelogPath, "utf-8");
		} catch {
			existingContent = `# Changelog

Toutes les modifications notables de Spons Easy sont documentées ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/),
et ce projet adhère au [Versionnement Sémantique](https://semver.org/lang/fr/).

`;
		}

		const date = new Date().toISOString().split("T")[0];
		const sections: string[] = [];

		if (changes.added?.length) {
			sections.push("### Ajouté\n\n" + changes.added.map((c) => `- ${c}`).join("\n"));
		}
		if (changes.changed?.length) {
			sections.push("### Modifié\n\n" + changes.changed.map((c) => `- ${c}`).join("\n"));
		}
		if (changes.fixed?.length) {
			sections.push("### Corrigé\n\n" + changes.fixed.map((c) => `- ${c}`).join("\n"));
		}
		if (changes.removed?.length) {
			sections.push("### Supprimé\n\n" + changes.removed.map((c) => `- ${c}`).join("\n"));
		}
		if (changes.security?.length) {
			sections.push("### Sécurité\n\n" + changes.security.map((c) => `- ${c}`).join("\n"));
		}

		const newEntry = `## [${version}] - ${date}\n\n${sections.join("\n\n")}\n\n`;

		// Insert after header
		const headerEnd = existingContent.indexOf("\n## [");
		if (headerEnd === -1) {
			// No existing entries
			existingContent = existingContent + newEntry;
		} else {
			existingContent =
				existingContent.substring(0, headerEnd + 1) +
				newEntry +
				existingContent.substring(headerEnd + 1);
		}

		await writeFile(changelogPath, existingContent, "utf-8");
	}

	/**
	 * Search content
	 */
	async search(
		query: string,
		types: ContentType[] = ["blog", "docs"],
	): Promise<ParsedContent<BaseFrontmatter>[]> {
		const results: ParsedContent<BaseFrontmatter>[] = [];
		const queryLower = query.toLowerCase();

		for (const type of types) {
			const { items } = await this.list<BaseFrontmatter>({
				type,
				status: "published",
				limit: 100,
			});

			for (const item of items) {
				const titleMatch = item.frontmatter.title
					.toLowerCase()
					.includes(queryLower);
				const descMatch = item.frontmatter.description
					?.toLowerCase()
					.includes(queryLower);
				const contentMatch = item.content.toLowerCase().includes(queryLower);

				if (titleMatch || descMatch || contentMatch) {
					results.push(item);
				}
			}
		}

		// Sort by relevance (title matches first)
		results.sort((a, b) => {
			const aTitle = a.frontmatter.title.toLowerCase().includes(queryLower);
			const bTitle = b.frontmatter.title.toLowerCase().includes(queryLower);

			if (aTitle && !bTitle) return -1;
			if (!aTitle && bTitle) return 1;
			return 0;
		});

		return results;
	}

	/**
	 * Get related content
	 */
	async getRelated<T extends BaseFrontmatter>(
		type: ContentType,
		slug: string,
		limit = 3,
	): Promise<ParsedContent<T>[]> {
		const current = await this.get<T>(type, slug);
		if (!current) return [];

		const { items } = await this.list<T>({
			type,
			status: "published",
			limit: 50,
		});

		// Filter out current item
		const others = items.filter((item) => item.frontmatter.slug !== slug);

		// Score by similarity
		const scored = others.map((item) => {
			let score = 0;

			// Same category (blog)
			if (
				"category" in current.frontmatter &&
				"category" in item.frontmatter
			) {
				if (
					(current.frontmatter as unknown as BlogFrontmatter).category ===
					(item.frontmatter as unknown as BlogFrontmatter).category
				) {
					score += 10;
				}
			}

			// Same section (docs)
			if (
				"section" in current.frontmatter &&
				"section" in item.frontmatter
			) {
				if (
					(current.frontmatter as unknown as DocsFrontmatter).section ===
					(item.frontmatter as unknown as DocsFrontmatter).section
				) {
					score += 10;
				}
			}

			// Shared tags (blog)
			if ("tags" in current.frontmatter && "tags" in item.frontmatter) {
				const currentTags = (current.frontmatter as unknown as BlogFrontmatter)
					.tags;
				const itemTags = (item.frontmatter as unknown as BlogFrontmatter).tags;
				const sharedTags = currentTags.filter((t) => itemTags.includes(t));
				score += sharedTags.length * 5;
			}

			return { item, score };
		});

		scored.sort((a, b) => b.score - a.score);

		return scored.slice(0, limit).map((s) => s.item);
	}

	/**
	 * Rebuild content cache
	 */
	async rebuildCache(): Promise<void> {
		this.cache.clear();

		const types: ContentType[] = ["blog", "docs"];

		for (const type of types) {
			await this.list({ type, limit: 1000 });
		}
	}
}

export default new ContentService();

import { args, BaseCommand, flags } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import contentService from "#services/content_service";
import type { BlogCategory, ContentStatus } from "#contracts/content_service_contract";

export default class ContentCreate extends BaseCommand {
	static commandName = "content:create";
	static description = "Create a new blog post or documentation page";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string({
		description: "Type of content: blog or docs",
		required: true,
	})
	declare type: "blog" | "docs";

	@args.string({
		description: "Title of the content",
		required: true,
	})
	declare title: string;

	@flags.string({
		description: "Content description",
		alias: "d",
	})
	declare description: string;

	@flags.string({
		description: "Category (blog only): product, tutorial, case-study, announcement, tips",
		alias: "c",
	})
	declare category: string;

	@flags.string({
		description: "Author name (blog only)",
		alias: "a",
	})
	declare author: string;

	@flags.string({
		description: "Section (docs only): getting-started, integration, features, api, guides",
		alias: "s",
	})
	declare section: string;

	@flags.number({
		description: "Order in section (docs only)",
		alias: "o",
	})
	declare order: number;

	@flags.string({
		description: "Icon (docs only)",
		alias: "i",
	})
	declare icon: string;

	@flags.string({
		description: "Comma-separated tags (blog only)",
		alias: "t",
	})
	declare tags: string;

	@flags.boolean({
		description: "Publish immediately",
		alias: "p",
		default: false,
	})
	declare publish: boolean;

	@flags.boolean({
		description: "Mark as featured (blog only)",
		alias: "f",
		default: false,
	})
	declare featured: boolean;

	@flags.string({
		description: "Custom slug",
	})
	declare slug: string;

	async run() {
		const status: ContentStatus = this.publish ? "published" : "draft";

		if (this.type === "blog") {
			await this.createBlogPost(status);
		} else if (this.type === "docs") {
			await this.createDoc(status);
		} else {
			this.logger.error("Type must be 'blog' or 'docs'");
			return;
		}
	}

	private async createBlogPost(status: ContentStatus) {
		const category = (this.category || "product") as BlogCategory;
		const validCategories = ["product", "tutorial", "case-study", "announcement", "tips"];

		if (!validCategories.includes(category)) {
			this.logger.error(
				`Invalid category. Must be one of: ${validCategories.join(", ")}`,
			);
			return;
		}

		const tags = this.tags ? this.tags.split(",").map((t) => t.trim()) : [];

		try {
			const post = await contentService.createBlogPost({
				title: this.title,
				slug: this.slug,
				description: this.description || `Article: ${this.title}`,
				category,
				author: this.author || "Equipe Spons Easy",
				tags,
				content: `# ${this.title}\n\nContenu de l'article a rediger...`,
				status,
				featured: this.featured,
			});

			this.logger.success(`Blog post created: ${post.frontmatter.slug}`);
			this.logger.info(`Title: ${post.frontmatter.title}`);
			this.logger.info(`Category: ${post.frontmatter.category}`);
			this.logger.info(`Status: ${post.frontmatter.status}`);
			this.logger.info(`File: content/blog/${post.frontmatter.slug}.md`);
		} catch (error) {
			this.logger.error(`Failed to create blog post: ${error}`);
		}
	}

	private async createDoc(status: ContentStatus) {
		const section = this.section || "guides";
		const validSections = ["getting-started", "integration", "features", "api", "guides"];

		if (!validSections.includes(section)) {
			this.logger.error(
				`Invalid section. Must be one of: ${validSections.join(", ")}`,
			);
			return;
		}

		try {
			const doc = await contentService.createDoc({
				title: this.title,
				slug: this.slug,
				description: this.description || `Documentation: ${this.title}`,
				section,
				order: this.order || 0,
				icon: this.icon,
				content: `# ${this.title}\n\nContenu de la documentation a rediger...`,
				status,
			});

			this.logger.success(`Documentation created: ${doc.frontmatter.slug}`);
			this.logger.info(`Title: ${doc.frontmatter.title}`);
			this.logger.info(`Section: ${doc.frontmatter.section}`);
			this.logger.info(`Status: ${doc.frontmatter.status}`);
			this.logger.info(`File: content/docs/${doc.frontmatter.slug}.md`);
		} catch (error) {
			this.logger.error(`Failed to create documentation: ${error}`);
		}
	}
}

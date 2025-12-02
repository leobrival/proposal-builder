import { args, BaseCommand, flags } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import contentService from "#services/content_service";
import type {
	BlogFrontmatter,
	DocsFrontmatter,
} from "#contracts/content_service_contract";

export default class ContentList extends BaseCommand {
	static commandName = "content:list";
	static description = "List all content (blog posts or documentation)";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string({
		description: "Type of content: blog, docs, or all",
		required: false,
	})
	declare type: string;

	@flags.string({
		description: "Filter by status: draft, published, archived",
		alias: "s",
	})
	declare status: string;

	@flags.number({
		description: "Limit results",
		alias: "l",
		default: 50,
	})
	declare limit: number;

	async run() {
		const type = this.type || "all";

		if (type === "blog" || type === "all") {
			await this.listBlogPosts();
		}

		if (type === "docs" || type === "all") {
			await this.listDocs();
		}

		if (type === "changelog") {
			await this.listChangelog();
		}

		if (!["blog", "docs", "changelog", "all"].includes(type)) {
			this.logger.error("Type must be 'blog', 'docs', 'changelog', or 'all'");
		}
	}

	private async listBlogPosts() {
		this.logger.info("");
		this.logger.info("=== Blog Posts ===");

		const { items, total } = await contentService.list<BlogFrontmatter>({
			type: "blog",
			status: this.status as "draft" | "published" | "archived" | undefined,
			limit: this.limit,
			orderBy: "publishedAt",
			order: "desc",
		});

		if (items.length === 0) {
			this.logger.info("No blog posts found.");
			return;
		}

		const table = this.ui.table();
		table.head(["Slug", "Title", "Category", "Status", "Published"]);

		for (const item of items) {
			const fm = item.frontmatter;
			table.row([
				fm.slug,
				fm.title.substring(0, 40) + (fm.title.length > 40 ? "..." : ""),
				fm.category,
				fm.status,
				fm.publishedAt
					? new Date(fm.publishedAt).toLocaleDateString("fr-FR")
					: "-",
			]);
		}

		table.render();
		this.logger.info(`Total: ${total} posts`);
	}

	private async listDocs() {
		this.logger.info("");
		this.logger.info("=== Documentation ===");

		const { items, total } = await contentService.list<DocsFrontmatter>({
			type: "docs",
			status: this.status as "draft" | "published" | "archived" | undefined,
			limit: this.limit,
			orderBy: "title",
			order: "asc",
		});

		if (items.length === 0) {
			this.logger.info("No documentation found.");
			return;
		}

		const table = this.ui.table();
		table.head(["Slug", "Title", "Section", "Order", "Status"]);

		for (const item of items) {
			const fm = item.frontmatter;
			table.row([
				fm.slug,
				fm.title.substring(0, 40) + (fm.title.length > 40 ? "..." : ""),
				fm.section,
				String(fm.order),
				fm.status,
			]);
		}

		table.render();
		this.logger.info(`Total: ${total} docs`);
	}

	private async listChangelog() {
		this.logger.info("");
		this.logger.info("=== Changelog ===");

		const entries = await contentService.getChangelog();

		if (entries.length === 0) {
			this.logger.info("No changelog entries found.");
			return;
		}

		const table = this.ui.table();
		table.head(["Version", "Date", "Title"]);

		for (const entry of entries) {
			table.row([
				entry.version,
				entry.date,
				entry.title.substring(0, 50) + (entry.title.length > 50 ? "..." : ""),
			]);
		}

		table.render();
		this.logger.info(`Total: ${entries.length} versions`);
	}
}

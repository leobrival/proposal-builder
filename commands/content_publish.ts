import { args, BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";
import contentService from "#services/content_service";
import type {
	BaseFrontmatter,
	ContentType,
} from "#contracts/content_service_contract";

export default class ContentPublish extends BaseCommand {
	static commandName = "content:publish";
	static description = "Publish a draft content item";

	static options: CommandOptions = {
		startApp: true,
	};

	@args.string({
		description: "Type of content: blog or docs",
		required: true,
	})
	declare type: "blog" | "docs";

	@args.string({
		description: "Slug of the content to publish",
		required: true,
	})
	declare slug: string;

	async run() {
		if (!["blog", "docs"].includes(this.type)) {
			this.logger.error("Type must be 'blog' or 'docs'");
			return;
		}

		const contentType = this.type as ContentType;

		try {
			const existing = await contentService.get<BaseFrontmatter>(
				contentType,
				this.slug,
			);

			if (!existing) {
				this.logger.error(`Content not found: ${contentType}/${this.slug}`);
				return;
			}

			if (existing.frontmatter.status === "published") {
				this.logger.warning(`Content is already published: ${this.slug}`);
				return;
			}

			const updated = await contentService.update<BaseFrontmatter>(
				contentType,
				this.slug,
				existing.content,
				{ status: "published" } as Partial<BaseFrontmatter>,
			);

			this.logger.success(`Content published: ${this.slug}`);
			this.logger.info(`Title: ${updated.frontmatter.title}`);
			this.logger.info(`Published at: ${updated.frontmatter.publishedAt}`);
		} catch (error) {
			this.logger.error(`Failed to publish content: ${error}`);
		}
	}
}

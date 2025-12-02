import type { HttpContext } from "@adonisjs/core/http";
import contentService from "#services/content_service";
import type {
	BlogCategory,
	BlogFrontmatter,
} from "#contracts/content_service_contract";

/**
 * Blog Controller
 * Handles public blog pages and API endpoints.
 */
export default class BlogController {
	/**
	 * Blog listing page
	 * GET /blog
	 */
	async index({ inertia, request }: HttpContext) {
		const page = Number(request.input("page", 1));
		const category = request.input("category") as BlogCategory | undefined;
		const tag = request.input("tag") as string | undefined;
		const limit = 12;
		const offset = (page - 1) * limit;

		const { items, total, hasMore } =
			await contentService.list<BlogFrontmatter>({
				type: "blog",
				status: "published",
				category,
				tag,
				limit,
				offset,
				orderBy: "publishedAt",
				order: "desc",
			});

		// Get featured posts for hero
		const { items: featured } = await contentService.list<BlogFrontmatter>({
			type: "blog",
			status: "published",
			limit: 3,
			orderBy: "publishedAt",
			order: "desc",
		});

		const featuredPosts = featured.filter((p) => p.frontmatter.featured);

		return inertia.render("blog/index", {
			posts: items.map((item) => ({
				...item.frontmatter,
				excerpt: item.excerpt,
			})),
			featured: featuredPosts.map((item) => ({
				...item.frontmatter,
				excerpt: item.excerpt,
			})),
			pagination: {
				page,
				limit,
				total,
				hasMore,
				totalPages: Math.ceil(total / limit),
			},
			filters: {
				category,
				tag,
			},
		});
	}

	/**
	 * Single blog post page
	 * GET /blog/:slug
	 */
	async show({ inertia, params, response }: HttpContext) {
		const post = await contentService.get<BlogFrontmatter>(
			"blog",
			params.slug,
		);

		if (!post || post.frontmatter.status !== "published") {
			return response.redirect().toRoute("blog.index");
		}

		// Get related posts
		const related = await contentService.getRelated<BlogFrontmatter>(
			"blog",
			params.slug,
			3,
		);

		return inertia.render("blog/show", {
			post: {
				...post.frontmatter,
				content: post.html,
				toc: post.toc,
			},
			related: related.map((item) => ({
				...item.frontmatter,
				excerpt: item.excerpt,
			})),
		});
	}

	/**
	 * Blog search
	 * GET /blog/search
	 */
	async search({ inertia, request }: HttpContext) {
		const query = request.input("q", "");
		const posts = query
			? await contentService.search(query, ["blog"])
			: [];

		return inertia.render("blog/search", {
			query,
			posts: posts.map((item) => ({
				...item.frontmatter,
				excerpt: item.excerpt,
			})),
		});
	}

	/**
	 * Blog RSS feed
	 * GET /blog/feed.xml
	 */
	async feed({ response }: HttpContext) {
		const { items } = await contentService.list<BlogFrontmatter>({
			type: "blog",
			status: "published",
			limit: 20,
			orderBy: "publishedAt",
			order: "desc",
		});

		const baseUrl = "https://sponseasy.com";

		const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Spons Easy Blog</title>
    <description>Actualités, tutoriels et conseils sur le sponsoring et les propositions de partenariat</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items
			.map(
				(item) => `
    <item>
      <title>${this.escapeXml(item.frontmatter.title)}</title>
      <description>${this.escapeXml(item.excerpt)}</description>
      <link>${baseUrl}/blog/${item.frontmatter.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${item.frontmatter.slug}</guid>
      <pubDate>${new Date(item.frontmatter.publishedAt || "").toUTCString()}</pubDate>
      <category>${item.frontmatter.category}</category>
    </item>`,
			)
			.join("")}
  </channel>
</rss>`;

		return response
			.header("Content-Type", "application/xml")
			.send(rss);
	}

	/**
	 * API: List blog posts
	 * GET /api/blog
	 */
	async apiList({ request, response }: HttpContext) {
		const page = Number(request.input("page", 1));
		const category = request.input("category") as BlogCategory | undefined;
		const tag = request.input("tag") as string | undefined;
		const limit = Number(request.input("limit", 12));
		const offset = (page - 1) * limit;

		const result = await contentService.list<BlogFrontmatter>({
			type: "blog",
			status: "published",
			category,
			tag,
			limit,
			offset,
			orderBy: "publishedAt",
			order: "desc",
		});

		return response.json({
			posts: result.items.map((item) => ({
				...item.frontmatter,
				excerpt: item.excerpt,
			})),
			pagination: {
				page,
				limit,
				total: result.total,
				hasMore: result.hasMore,
			},
		});
	}

	/**
	 * API: Get single blog post
	 * GET /api/blog/:slug
	 */
	async apiShow({ params, response }: HttpContext) {
		const post = await contentService.get<BlogFrontmatter>(
			"blog",
			params.slug,
		);

		if (!post || post.frontmatter.status !== "published") {
			return response.status(404).json({
				error: "Post not found",
			});
		}

		return response.json({
			post: {
				...post.frontmatter,
				content: post.html,
				toc: post.toc,
			},
		});
	}

	/**
	 * Escape XML special characters
	 */
	private escapeXml(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");
	}
}

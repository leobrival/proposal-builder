import type { HttpContext } from "@adonisjs/core/http";
import contentService from "#services/content_service";
import type { DocsFrontmatter } from "#contracts/content_service_contract";

/**
 * Documentation Controller
 * Handles documentation pages and API endpoints.
 */
export default class DocsController {
	/**
	 * Documentation index page
	 * GET /docs
	 */
	async index({ inertia }: HttpContext) {
		const { items } = await contentService.list<DocsFrontmatter>({
			type: "docs",
			status: "published",
			limit: 100,
			orderBy: "title",
			order: "asc",
		});

		// Group by section
		const sections = new Map<string, typeof items>();

		for (const doc of items) {
			const section = doc.frontmatter.section;
			if (!sections.has(section)) {
				sections.set(section, []);
			}
			sections.get(section)!.push(doc);
		}

		// Sort within each section by order
		for (const [, docs] of sections) {
			docs.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
		}

		// Convert to array for frontend
		const groupedDocs = Array.from(sections.entries()).map(
			([section, docs]) => ({
				section,
				docs: docs.map((doc) => ({
					...doc.frontmatter,
					excerpt: doc.excerpt,
				})),
			}),
		);

		return inertia.render("docs/index", {
			sections: groupedDocs,
		});
	}

	/**
	 * Single documentation page
	 * GET /docs/:slug
	 */
	async show({ inertia, params, response }: HttpContext) {
		const doc = await contentService.get<DocsFrontmatter>("docs", params.slug);

		if (!doc || doc.frontmatter.status !== "published") {
			return response.redirect().toRoute("docs.index");
		}

		// Get all docs for sidebar navigation
		const { items: allDocs } = await contentService.list<DocsFrontmatter>({
			type: "docs",
			status: "published",
			limit: 100,
			orderBy: "title",
			order: "asc",
		});

		// Group for sidebar
		const sections = new Map<string, typeof allDocs>();

		for (const d of allDocs) {
			const section = d.frontmatter.section;
			if (!sections.has(section)) {
				sections.set(section, []);
			}
			sections.get(section)!.push(d);
		}

		for (const [, docs] of sections) {
			docs.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
		}

		const groupedDocs = Array.from(sections.entries()).map(
			([section, docs]) => ({
				section,
				docs: docs.map((d) => ({
					slug: d.frontmatter.slug,
					title: d.frontmatter.title,
					icon: d.frontmatter.icon,
				})),
			}),
		);

		// Get related docs
		const related = await contentService.getRelated<DocsFrontmatter>(
			"docs",
			params.slug,
			3,
		);

		return inertia.render("docs/show", {
			doc: {
				...doc.frontmatter,
				content: doc.html,
				toc: doc.toc,
			},
			sections: groupedDocs,
			related: related.map((item) => ({
				...item.frontmatter,
				excerpt: item.excerpt,
			})),
		});
	}

	/**
	 * Documentation search
	 * GET /docs/search
	 */
	async search({ inertia, request }: HttpContext) {
		const query = request.input("q", "");
		const docs = query ? await contentService.search(query, ["docs"]) : [];

		return inertia.render("docs/search", {
			query,
			docs: docs.map((item) => ({
				...item.frontmatter,
				excerpt: item.excerpt,
			})),
		});
	}

	/**
	 * API: List documentation pages
	 * GET /api/docs
	 */
	async apiList({ request, response }: HttpContext) {
		const section = request.input("section") as string | undefined;
		const limit = Number(request.input("limit", 100));

		const { items, total } = await contentService.list<DocsFrontmatter>({
			type: "docs",
			status: "published",
			limit,
			orderBy: "title",
			order: "asc",
		});

		// Filter by section if provided
		const filtered = section
			? items.filter((item) => item.frontmatter.section === section)
			: items;

		return response.json({
			docs: filtered.map((item) => ({
				...item.frontmatter,
				excerpt: item.excerpt,
			})),
			total: section ? filtered.length : total,
		});
	}

	/**
	 * API: Get single documentation page
	 * GET /api/docs/:slug
	 */
	async apiShow({ params, response }: HttpContext) {
		const doc = await contentService.get<DocsFrontmatter>("docs", params.slug);

		if (!doc || doc.frontmatter.status !== "published") {
			return response.status(404).json({
				error: "Documentation not found",
			});
		}

		return response.json({
			doc: {
				...doc.frontmatter,
				content: doc.html,
				toc: doc.toc,
			},
		});
	}
}

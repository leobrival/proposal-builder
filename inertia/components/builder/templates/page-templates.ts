import type { Page, PageType, SectionType } from "../../../types/builder";
import { PAGE_METADATA, SECTION_METADATA } from "../../../types/builder";

// Generate unique ID
function generateId(): string {
	return crypto.randomUUID();
}

// Generate element ID
function generateElementId(type: string, index: number): string {
	return `${type}-${index}`;
}

// Create a section with default settings
function createDefaultSection(type: SectionType, index: number) {
	const meta = SECTION_METADATA[type];
	return {
		id: generateId(),
		type,
		elementId: generateElementId(type, index),
		visible: true,
		locked: false,
		settings: { ...meta.defaultSettings },
		blocks: [],
		customCss: "",
	};
}

// Create a page from type
export function createPageFromType(
	type: PageType,
	options?: {
		name?: string;
		slug?: string;
		isHomePage?: boolean;
		parentId?: string | null;
		order?: number;
	},
): Page {
	const meta = PAGE_METADATA[type];
	const sections = meta.suggestedSections.map((sectionType, index) =>
		createDefaultSection(sectionType, index + 1),
	);

	return {
		id: generateId(),
		type,
		name: options?.name || meta.name,
		slug: options?.slug || type === "home" ? "/" : `/${type}`,
		isHomePage: options?.isHomePage ?? type === "home",
		parentId: options?.parentId ?? null,
		order: options?.order ?? 0,
		sections,
		seo: {
			title: options?.name || meta.name,
			description: meta.description,
		},
	};
}

// Pre-built page templates with content
export interface PageTemplate {
	id: string;
	name: string;
	description: string;
	category: "landing" | "content" | "utility" | "ecommerce";
	thumbnail?: string;
	pages: Page[];
}

// Single Page Templates
export const SINGLE_PAGE_TEMPLATES: PageTemplate[] = [
	{
		id: "landing-sponsoring",
		name: "Landing Sponsoring",
		description:
			"Page de sponsoring complete avec toutes les sections essentielles",
		category: "landing",
		pages: [
			{
				id: generateId(),
				type: "home",
				name: "Page de Sponsoring",
				slug: "/",
				isHomePage: true,
				parentId: null,
				order: 0,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("about", 2),
					createDefaultSection("benefits", 3),
					createDefaultSection("tiers", 4),
					createDefaultSection("testimonials", 5),
					createDefaultSection("sponsors", 6),
					createDefaultSection("faq", 7),
					createDefaultSection("cta", 8),
					createDefaultSection("contact", 9),
				],
				seo: {
					title: "Devenez Sponsor",
					description:
						"Rejoignez nos partenaires et beneficiez d'une visibilite exceptionnelle",
				},
			},
		],
	},
	{
		id: "landing-event",
		name: "Landing Evenement",
		description: "Page d'evenement avec programme et informations pratiques",
		category: "landing",
		pages: [
			{
				id: generateId(),
				type: "event",
				name: "Evenement",
				slug: "/",
				isHomePage: true,
				parentId: null,
				order: 0,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("event-details", 2),
					createDefaultSection("about", 3),
					createDefaultSection("timeline", 4),
					createDefaultSection("team", 5),
					createDefaultSection("gallery", 6),
					createDefaultSection("sponsors", 7),
					createDefaultSection("contact", 8),
				],
				seo: {
					title: "Notre Evenement",
					description: "Decouvrez notre evenement et rejoignez-nous",
				},
			},
		],
	},
	{
		id: "landing-minimal",
		name: "Landing Minimaliste",
		description: "Page epuree avec l'essentiel",
		category: "landing",
		pages: [
			{
				id: generateId(),
				type: "home",
				name: "Accueil",
				slug: "/",
				isHomePage: true,
				parentId: null,
				order: 0,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("about", 2),
					createDefaultSection("tiers", 3),
					createDefaultSection("contact", 4),
				],
				seo: {
					title: "Accueil",
					description: "Bienvenue sur notre site",
				},
			},
		],
	},
];

// Multi-Page Site Templates (Relume-style sitemap)
export const MULTI_PAGE_TEMPLATES: PageTemplate[] = [
	{
		id: "site-complet",
		name: "Site Complet",
		description: "Site multi-pages avec navigation complete",
		category: "landing",
		pages: [
			{
				id: "home-page",
				type: "home",
				name: "Accueil",
				slug: "/",
				isHomePage: true,
				parentId: null,
				order: 0,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("about", 2),
					createDefaultSection("benefits", 3),
					createDefaultSection("tiers", 4),
					createDefaultSection("testimonials", 5),
					createDefaultSection("cta", 6),
				],
			},
			{
				id: "about-page",
				type: "about",
				name: "A propos",
				slug: "/a-propos",
				isHomePage: false,
				parentId: null,
				order: 1,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("about", 2),
					createDefaultSection("team", 3),
					createDefaultSection("timeline", 4),
					createDefaultSection("cta", 5),
				],
			},
			{
				id: "sponsors-page",
				type: "sponsors",
				name: "Sponsors",
				slug: "/sponsors",
				isHomePage: false,
				parentId: null,
				order: 2,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("sponsors", 2),
					createDefaultSection("tiers", 3),
					createDefaultSection("benefits", 4),
					createDefaultSection("cta", 5),
				],
			},
			{
				id: "contact-page",
				type: "contact",
				name: "Contact",
				slug: "/contact",
				isHomePage: false,
				parentId: null,
				order: 3,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("contact", 2),
					createDefaultSection("faq", 3),
				],
			},
		],
	},
	{
		id: "site-evenement",
		name: "Site Evenement",
		description: "Site dedie a un evenement avec plusieurs pages",
		category: "landing",
		pages: [
			{
				id: "event-home",
				type: "home",
				name: "L'evenement",
				slug: "/",
				isHomePage: true,
				parentId: null,
				order: 0,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("event-details", 2),
					createDefaultSection("about", 3),
					createDefaultSection("cta", 4),
				],
			},
			{
				id: "event-programme",
				type: "event",
				name: "Programme",
				slug: "/programme",
				isHomePage: false,
				parentId: null,
				order: 1,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("timeline", 2),
					createDefaultSection("team", 3),
				],
			},
			{
				id: "event-gallery",
				type: "portfolio",
				name: "Galerie",
				slug: "/galerie",
				isHomePage: false,
				parentId: null,
				order: 2,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("gallery", 2),
				],
			},
			{
				id: "event-sponsors",
				type: "sponsors",
				name: "Partenaires",
				slug: "/partenaires",
				isHomePage: false,
				parentId: null,
				order: 3,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("sponsors", 2),
					createDefaultSection("tiers", 3),
					createDefaultSection("testimonials", 4),
					createDefaultSection("cta", 5),
				],
			},
			{
				id: "event-contact",
				type: "contact",
				name: "Contact",
				slug: "/contact",
				isHomePage: false,
				parentId: null,
				order: 4,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("contact", 2),
				],
			},
		],
	},
	{
		id: "site-association",
		name: "Site Association",
		description: "Site pour association ou ONG",
		category: "landing",
		pages: [
			{
				id: "asso-home",
				type: "home",
				name: "Accueil",
				slug: "/",
				isHomePage: true,
				parentId: null,
				order: 0,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("about", 2),
					createDefaultSection("benefits", 3),
					createDefaultSection("testimonials", 4),
					createDefaultSection("cta", 5),
				],
			},
			{
				id: "asso-mission",
				type: "about",
				name: "Notre Mission",
				slug: "/mission",
				isHomePage: false,
				parentId: null,
				order: 1,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("about", 2),
					createDefaultSection("timeline", 3),
					createDefaultSection("gallery", 4),
				],
			},
			{
				id: "asso-team",
				type: "team",
				name: "L'equipe",
				slug: "/equipe",
				isHomePage: false,
				parentId: null,
				order: 2,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("team", 2),
					createDefaultSection("about", 3),
				],
			},
			{
				id: "asso-soutenir",
				type: "pricing",
				name: "Nous Soutenir",
				slug: "/soutenir",
				isHomePage: false,
				parentId: null,
				order: 3,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("tiers", 2),
					createDefaultSection("benefits", 3),
					createDefaultSection("sponsors", 4),
					createDefaultSection("faq", 5),
				],
			},
			{
				id: "asso-contact",
				type: "contact",
				name: "Contact",
				slug: "/contact",
				isHomePage: false,
				parentId: null,
				order: 4,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("contact", 2),
				],
			},
		],
	},
	{
		id: "site-startup",
		name: "Site Startup",
		description: "Site moderne pour startup tech",
		category: "landing",
		pages: [
			{
				id: "startup-home",
				type: "home",
				name: "Accueil",
				slug: "/",
				isHomePage: true,
				parentId: null,
				order: 0,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("benefits", 2),
					createDefaultSection("about", 3),
					createDefaultSection("testimonials", 4),
					createDefaultSection("cta", 5),
				],
			},
			{
				id: "startup-product",
				type: "services",
				name: "Produit",
				slug: "/produit",
				isHomePage: false,
				parentId: null,
				order: 1,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("benefits", 2),
					createDefaultSection("gallery", 3),
					createDefaultSection("faq", 4),
				],
			},
			{
				id: "startup-pricing",
				type: "pricing",
				name: "Tarifs",
				slug: "/tarifs",
				isHomePage: false,
				parentId: null,
				order: 2,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("tiers", 2),
					createDefaultSection("faq", 3),
					createDefaultSection("cta", 4),
				],
			},
			{
				id: "startup-about",
				type: "about",
				name: "A propos",
				slug: "/a-propos",
				isHomePage: false,
				parentId: null,
				order: 3,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("about", 2),
					createDefaultSection("team", 3),
					createDefaultSection("timeline", 4),
				],
			},
			{
				id: "startup-investors",
				type: "sponsors",
				name: "Investisseurs",
				slug: "/investisseurs",
				isHomePage: false,
				parentId: null,
				order: 4,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("sponsors", 2),
					createDefaultSection("tiers", 3),
					createDefaultSection("cta", 4),
				],
			},
			{
				id: "startup-contact",
				type: "contact",
				name: "Contact",
				slug: "/contact",
				isHomePage: false,
				parentId: null,
				order: 5,
				sections: [
					createDefaultSection("hero", 1),
					createDefaultSection("contact", 2),
				],
			},
		],
	},
];

// All templates
export const ALL_PAGE_TEMPLATES = [
	...SINGLE_PAGE_TEMPLATES,
	...MULTI_PAGE_TEMPLATES,
];

// Get template by ID
export function getPageTemplateById(id: string): PageTemplate | undefined {
	return ALL_PAGE_TEMPLATES.find((t) => t.id === id);
}

// Get templates by category
export function getPageTemplatesByCategory(
	category: PageTemplate["category"],
): PageTemplate[] {
	return ALL_PAGE_TEMPLATES.filter((t) => t.category === category);
}

// Template categories for UI
export const PAGE_TEMPLATE_CATEGORIES = [
	{ id: "landing", name: "Landing Pages", icon: "Layout" },
	{ id: "content", name: "Contenu", icon: "FileText" },
	{ id: "utility", name: "Utilitaires", icon: "Settings" },
	{ id: "ecommerce", name: "E-commerce", icon: "ShoppingCart" },
];

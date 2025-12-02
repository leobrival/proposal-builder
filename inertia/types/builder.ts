// ============================================================================
// WEB BUILDER TYPES
// ============================================================================

// ----------------------------------------------------------------------------
// GLOBAL STYLES
// ----------------------------------------------------------------------------

export interface ColorPalette {
	primary: string; // HEX - Main brand color
	secondary: string; // HEX - Secondary brand color
	accent: string; // HEX - Accent/highlight color
	background: string; // HEX - Page background
	text: string; // HEX - Main text color
	muted: string; // HEX - Muted/secondary text
}

export interface Typography {
	headingFont: string; // Font family for headings
	bodyFont: string; // Font family for body text
	baseFontSize: number; // Base font size in px (14-20)
	lineHeight: number; // Line height multiplier (1.4-1.8)
}

export type SectionPadding = "compact" | "normal" | "spacious";
export type ContainerWidth = "narrow" | "medium" | "wide" | "full";

export interface Spacing {
	sectionPadding: SectionPadding;
	containerWidth: ContainerWidth;
}

export interface GlobalStyles {
	colors: ColorPalette;
	typography: Typography;
	spacing: Spacing;
	customCss: string; // Global custom CSS
}

// ----------------------------------------------------------------------------
// SECTION TYPES
// ----------------------------------------------------------------------------

export type SectionType =
	| "hero"
	| "about"
	| "event-details"
	| "tiers"
	| "benefits"
	| "gallery"
	| "testimonials"
	| "sponsors"
	| "team"
	| "timeline"
	| "faq"
	| "contact"
	| "cta"
	| "custom";

// Section-specific settings
export interface HeroSettings {
	variant: "image" | "video" | "gradient" | "minimal";
	backgroundImage?: string;
	backgroundVideo?: string;
	gradientFrom?: string;
	gradientTo?: string;
	gradientDirection?: "to-right" | "to-bottom" | "to-bottom-right";
	overlayOpacity?: number; // 0-100
	alignment: "left" | "center" | "right";
	showDate?: boolean;
	showLocation?: boolean;
	showCta?: boolean;
	ctaText?: string;
	ctaLink?: string;
}

export interface AboutSettings {
	layout: "text-only" | "text-image" | "image-text";
	imagePosition?: "left" | "right";
	imageUrl?: string;
	showTitle?: boolean;
	title?: string;
}

export interface EventDetailsSettings {
	showDate?: boolean;
	showTime?: boolean;
	showLocation?: boolean;
	showMap?: boolean;
	showOrganizer?: boolean;
	layout: "horizontal" | "vertical" | "cards";
}

export interface TiersSettings {
	layout: "grid" | "horizontal" | "stacked";
	columns?: 1 | 2 | 3 | 4;
	showPrices?: boolean;
	showBenefits?: boolean;
	highlightFeatured?: boolean;
	ctaText?: string;
}

export interface BenefitsSettings {
	layout: "list" | "grid" | "icons";
	columns?: 2 | 3 | 4;
	showIcons?: boolean;
	iconStyle?: "circle" | "square" | "none";
}

export interface GallerySettings {
	layout: "grid" | "masonry" | "carousel";
	columns?: 2 | 3 | 4;
	gap?: "small" | "medium" | "large";
	images: Array<{
		url: string;
		alt?: string;
		caption?: string;
	}>;
}

export interface TestimonialsSettings {
	layout: "carousel" | "grid" | "stacked";
	showAvatar?: boolean;
	showCompany?: boolean;
	testimonials: Array<{
		id: string;
		quote: string;
		author: string;
		role?: string;
		company?: string;
		avatarUrl?: string;
	}>;
}

export interface SponsorsSettings {
	layout: "grid" | "carousel" | "tiered";
	columns?: 3 | 4 | 5 | 6;
	showNames?: boolean;
	grayscale?: boolean;
	sponsors: Array<{
		id: string;
		name: string;
		logoUrl: string;
		websiteUrl?: string;
		tier?: string;
	}>;
}

export interface TeamSettings {
	layout: "grid" | "carousel";
	columns?: 2 | 3 | 4;
	showRole?: boolean;
	showBio?: boolean;
	showSocials?: boolean;
	members: Array<{
		id: string;
		name: string;
		role?: string;
		bio?: string;
		photoUrl?: string;
		socials?: {
			linkedin?: string;
			twitter?: string;
			website?: string;
		};
	}>;
}

export interface TimelineSettings {
	layout: "vertical" | "horizontal" | "alternating";
	showDates?: boolean;
	showIcons?: boolean;
	events: Array<{
		id: string;
		date?: string;
		time?: string;
		title: string;
		description?: string;
		icon?: string;
	}>;
}

export interface FaqSettings {
	layout: "accordion" | "grid" | "simple";
	columns?: 1 | 2;
	faqs: Array<{
		id: string;
		question: string;
		answer: string;
	}>;
}

export interface ContactSettings {
	layout: "form-only" | "form-info" | "info-only";
	showEmail?: boolean;
	showPhone?: boolean;
	showAddress?: boolean;
	showSocials?: boolean;
	showMap?: boolean;
	formFields?: Array<"name" | "email" | "company" | "phone" | "message">;
	submitText?: string;
}

export interface CtaSettings {
	variant: "simple" | "split" | "banner";
	title?: string;
	subtitle?: string;
	buttonText?: string;
	buttonLink?: string;
	secondaryButtonText?: string;
	secondaryButtonLink?: string;
	backgroundImage?: string;
	backgroundColor?: string;
}

export interface CustomSettings {
	// Custom section has no predefined settings
	[key: string]: unknown;
}

export type SectionSettings =
	| HeroSettings
	| AboutSettings
	| EventDetailsSettings
	| TiersSettings
	| BenefitsSettings
	| GallerySettings
	| TestimonialsSettings
	| SponsorsSettings
	| TeamSettings
	| TimelineSettings
	| FaqSettings
	| ContactSettings
	| CtaSettings
	| CustomSettings;

// ----------------------------------------------------------------------------
// BLOCK TYPES
// ----------------------------------------------------------------------------

export type BlockType =
	| "heading"
	| "text"
	| "image"
	| "video"
	| "button"
	| "divider"
	| "spacer"
	| "icon-list"
	| "stats"
	| "quote"
	| "embed"
	| "html";

// Block-specific content and settings
export interface HeadingBlock {
	type: "heading";
	content: {
		text: string;
		level: 1 | 2 | 3 | 4 | 5 | 6;
	};
	settings: {
		alignment: "left" | "center" | "right";
		color?: string;
	};
}

export interface TextBlock {
	type: "text";
	content: {
		html: string; // Rich text HTML
	};
	settings: {
		alignment: "left" | "center" | "right" | "justify";
		maxWidth?: "narrow" | "medium" | "wide" | "full";
	};
}

export interface ImageBlock {
	type: "image";
	content: {
		src: string;
		alt: string;
		caption?: string;
	};
	settings: {
		width: "auto" | "full" | "fixed";
		fixedWidth?: number;
		alignment: "left" | "center" | "right";
		borderRadius?: "none" | "small" | "medium" | "large" | "full";
		shadow?: "none" | "small" | "medium" | "large";
	};
}

export interface VideoBlock {
	type: "video";
	content: {
		src: string; // URL or embed code
		provider: "youtube" | "vimeo" | "custom";
	};
	settings: {
		aspectRatio: "16:9" | "4:3" | "1:1" | "9:16";
		autoplay?: boolean;
		muted?: boolean;
		loop?: boolean;
	};
}

export interface ButtonBlock {
	type: "button";
	content: {
		text: string;
		link: string;
	};
	settings: {
		variant: "primary" | "secondary" | "outline" | "ghost";
		size: "small" | "medium" | "large";
		alignment: "left" | "center" | "right";
		fullWidth?: boolean;
		icon?: string;
		iconPosition?: "left" | "right";
	};
}

export interface DividerBlock {
	type: "divider";
	content: Record<string, never>;
	settings: {
		style: "solid" | "dashed" | "dotted" | "gradient";
		width: "short" | "medium" | "full";
		thickness: "thin" | "medium" | "thick";
		color?: string;
	};
}

export interface SpacerBlock {
	type: "spacer";
	content: Record<string, never>;
	settings: {
		height: "small" | "medium" | "large" | "xlarge";
		customHeight?: number; // px
	};
}

export interface IconListBlock {
	type: "icon-list";
	content: {
		items: Array<{
			id: string;
			icon: string;
			text: string;
		}>;
	};
	settings: {
		layout: "vertical" | "horizontal" | "grid";
		iconColor?: string;
		iconSize?: "small" | "medium" | "large";
	};
}

export interface StatsBlock {
	type: "stats";
	content: {
		stats: Array<{
			id: string;
			value: string;
			label: string;
			prefix?: string;
			suffix?: string;
		}>;
	};
	settings: {
		layout: "horizontal" | "grid";
		columns?: 2 | 3 | 4;
		animated?: boolean;
	};
}

export interface QuoteBlock {
	type: "quote";
	content: {
		text: string;
		author?: string;
		role?: string;
	};
	settings: {
		style: "simple" | "bordered" | "background";
		alignment: "left" | "center";
		showQuoteMark?: boolean;
	};
}

export interface EmbedBlock {
	type: "embed";
	content: {
		code: string; // iframe or embed code
	};
	settings: {
		aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
		maxWidth?: "narrow" | "medium" | "wide" | "full";
	};
}

export interface HtmlBlock {
	type: "html";
	content: {
		code: string; // Raw HTML
	};
	settings: {
		sanitize?: boolean;
	};
}

export type BlockData =
	| HeadingBlock
	| TextBlock
	| ImageBlock
	| VideoBlock
	| ButtonBlock
	| DividerBlock
	| SpacerBlock
	| IconListBlock
	| StatsBlock
	| QuoteBlock
	| EmbedBlock
	| HtmlBlock;

// ----------------------------------------------------------------------------
// SECTION & BLOCK STRUCTURE
// ----------------------------------------------------------------------------

export interface Block {
	id: string; // UUID
	type: BlockType;
	elementId: string; // Static ID for CSS targeting (e.g., "hero-heading-1")
	content: BlockData["content"];
	settings: BlockData["settings"];
	customCss: string;
}

export interface Section {
	id: string; // UUID
	type: SectionType;
	elementId: string; // Static ID for CSS targeting (e.g., "hero-section")
	visible: boolean;
	locked: boolean; // Locked sections cannot be removed
	settings: SectionSettings;
	blocks: Block[];
	customCss: string;
}

// ----------------------------------------------------------------------------
// PAGE TYPES (Relume-style sitemap)
// ----------------------------------------------------------------------------

export type PageType =
	| "home"
	| "about"
	| "services"
	| "pricing"
	| "contact"
	| "blog"
	| "blog-post"
	| "portfolio"
	| "portfolio-item"
	| "team"
	| "faq"
	| "testimonials"
	| "sponsors"
	| "event"
	| "legal"
	| "custom";

export interface PageMeta {
	type: PageType;
	name: string;
	description: string;
	icon: string;
	suggestedSections: SectionType[];
}

export const PAGE_METADATA: Record<PageType, PageMeta> = {
	home: {
		type: "home",
		name: "Accueil",
		description: "Page principale de votre site",
		icon: "Home",
		suggestedSections: [
			"hero",
			"about",
			"benefits",
			"tiers",
			"testimonials",
			"cta",
			"contact",
		],
	},
	about: {
		type: "about",
		name: "A propos",
		description: "Presentation de votre organisation",
		icon: "Info",
		suggestedSections: ["hero", "about", "team", "timeline", "cta"],
	},
	services: {
		type: "services",
		name: "Services",
		description: "Vos offres et services",
		icon: "Briefcase",
		suggestedSections: ["hero", "benefits", "tiers", "faq", "cta"],
	},
	pricing: {
		type: "pricing",
		name: "Tarifs",
		description: "Grille tarifaire",
		icon: "DollarSign",
		suggestedSections: ["hero", "tiers", "benefits", "faq", "cta"],
	},
	contact: {
		type: "contact",
		name: "Contact",
		description: "Page de contact",
		icon: "Mail",
		suggestedSections: ["hero", "contact", "faq"],
	},
	blog: {
		type: "blog",
		name: "Blog",
		description: "Liste des articles",
		icon: "FileText",
		suggestedSections: ["hero", "custom"],
	},
	"blog-post": {
		type: "blog-post",
		name: "Article",
		description: "Template d'article de blog",
		icon: "Edit3",
		suggestedSections: ["hero", "custom", "cta"],
	},
	portfolio: {
		type: "portfolio",
		name: "Portfolio",
		description: "Galerie de realisations",
		icon: "Image",
		suggestedSections: ["hero", "gallery", "testimonials", "cta"],
	},
	"portfolio-item": {
		type: "portfolio-item",
		name: "Projet",
		description: "Template de projet portfolio",
		icon: "Folder",
		suggestedSections: ["hero", "about", "gallery", "cta"],
	},
	team: {
		type: "team",
		name: "Equipe",
		description: "Presentation de l'equipe",
		icon: "Users",
		suggestedSections: ["hero", "team", "about", "cta"],
	},
	faq: {
		type: "faq",
		name: "FAQ",
		description: "Questions frequentes",
		icon: "HelpCircle",
		suggestedSections: ["hero", "faq", "contact"],
	},
	testimonials: {
		type: "testimonials",
		name: "Temoignages",
		description: "Avis clients",
		icon: "MessageSquare",
		suggestedSections: ["hero", "testimonials", "cta"],
	},
	sponsors: {
		type: "sponsors",
		name: "Sponsors",
		description: "Page des sponsors",
		icon: "Award",
		suggestedSections: ["hero", "sponsors", "tiers", "cta"],
	},
	event: {
		type: "event",
		name: "Evenement",
		description: "Page evenement",
		icon: "Calendar",
		suggestedSections: [
			"hero",
			"event-details",
			"timeline",
			"gallery",
			"sponsors",
			"contact",
		],
	},
	legal: {
		type: "legal",
		name: "Mentions legales",
		description: "Page juridique",
		icon: "Scale",
		suggestedSections: ["custom"],
	},
	custom: {
		type: "custom",
		name: "Page personnalisee",
		description: "Page vide a personnaliser",
		icon: "Plus",
		suggestedSections: [],
	},
};

export interface Page {
	id: string;
	type: PageType;
	name: string;
	slug: string;
	description?: string;
	isHomePage: boolean;
	parentId: string | null; // For nested pages
	order: number;
	sections: Section[];
	seo?: {
		title?: string;
		description?: string;
		ogImage?: string;
	};
}

export interface GlobalSection {
	id: string;
	name: string;
	section: Section;
	usedInPages: string[]; // Page IDs where this global section is used
}

// ----------------------------------------------------------------------------
// PAGE LAYOUT
// ----------------------------------------------------------------------------

export interface PageLayout {
	version: "1.0";
	globalStyles: GlobalStyles;
	sections: Section[];
}

// ----------------------------------------------------------------------------
// SITE LAYOUT (Multi-page support)
// ----------------------------------------------------------------------------

export interface SiteLayout {
	version: "2.0";
	globalStyles: GlobalStyles;
	pages: Page[];
	globalSections: GlobalSection[];
	navigation?: {
		header: NavigationItem[];
		footer: NavigationItem[];
	};
}

export interface NavigationItem {
	id: string;
	label: string;
	pageId?: string;
	url?: string;
	children?: NavigationItem[];
}

// ----------------------------------------------------------------------------
// BUILDER STATE & ACTIONS
// ----------------------------------------------------------------------------

export interface BuilderState {
	layout: PageLayout;
	selectedSectionId: string | null;
	selectedBlockId: string | null;
	isDragging: boolean;
	activePanel: "sections" | "blocks" | "styles" | "templates" | null;
	history: PageLayout[];
	historyIndex: number;
	hasUnsavedChanges: boolean;
	isSaving: boolean;
	lastSavedAt: Date | null;
}

export interface BuilderActions {
	// Sections
	addSection: (type: SectionType, index?: number) => void;
	removeSection: (sectionId: string) => void;
	moveSection: (fromIndex: number, toIndex: number) => void;
	updateSection: (sectionId: string, updates: Partial<Section>) => void;
	updateSectionSettings: (
		sectionId: string,
		settings: Partial<SectionSettings>,
	) => void;
	duplicateSection: (sectionId: string) => void;
	toggleSectionVisibility: (sectionId: string) => void;

	// Blocks
	addBlock: (sectionId: string, type: BlockType, index?: number) => void;
	removeBlock: (sectionId: string, blockId: string) => void;
	moveBlock: (sectionId: string, fromIndex: number, toIndex: number) => void;
	moveBlockBetweenSections: (
		fromSectionId: string,
		toSectionId: string,
		blockId: string,
		toIndex: number,
	) => void;
	updateBlock: (
		sectionId: string,
		blockId: string,
		updates: Partial<Block>,
	) => void;
	duplicateBlock: (sectionId: string, blockId: string) => void;

	// Global Styles
	updateGlobalStyles: (updates: Partial<GlobalStyles>) => void;
	updateColors: (colors: Partial<ColorPalette>) => void;
	updateTypography: (typography: Partial<Typography>) => void;
	updateSpacing: (spacing: Partial<Spacing>) => void;
	updateGlobalCss: (css: string) => void;

	// Selection
	selectSection: (sectionId: string | null) => void;
	selectBlock: (blockId: string | null) => void;
	clearSelection: () => void;

	// Panels
	setActivePanel: (
		panel: "sections" | "blocks" | "styles" | "templates" | null,
	) => void;

	// History
	undo: () => void;
	redo: () => void;
	canUndo: () => boolean;
	canRedo: () => boolean;

	// Templates
	applyTemplate: (templateId: string) => void;
	resetToDefault: () => void;

	// Persistence
	save: () => Promise<void>;
	setLayout: (layout: PageLayout) => void;
}

export type BuilderContextType = BuilderState & BuilderActions;

// ----------------------------------------------------------------------------
// TEMPLATES
// ----------------------------------------------------------------------------

export interface Template {
	id: string;
	name: string;
	description: string;
	category: string;
	thumbnail: string;
	layout: PageLayout;
}

// ----------------------------------------------------------------------------
// DEFAULTS
// ----------------------------------------------------------------------------

export const DEFAULT_COLORS: ColorPalette = {
	primary: "#3B82F6",
	secondary: "#1E40AF",
	accent: "#F59E0B",
	background: "#FFFFFF",
	text: "#1F2937",
	muted: "#6B7280",
};

export const DEFAULT_TYPOGRAPHY: Typography = {
	headingFont: "Inter",
	bodyFont: "Inter",
	baseFontSize: 16,
	lineHeight: 1.6,
};

export const DEFAULT_SPACING: Spacing = {
	sectionPadding: "normal",
	containerWidth: "medium",
};

export const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
	colors: DEFAULT_COLORS,
	typography: DEFAULT_TYPOGRAPHY,
	spacing: DEFAULT_SPACING,
	customCss: "",
};

export const DEFAULT_PAGE_LAYOUT: PageLayout = {
	version: "1.0",
	globalStyles: DEFAULT_GLOBAL_STYLES,
	sections: [],
};

// ----------------------------------------------------------------------------
// SECTION METADATA
// ----------------------------------------------------------------------------

export interface SectionMeta {
	type: SectionType;
	name: string;
	description: string;
	icon: string; // Lucide icon name
	defaultSettings: SectionSettings;
	supportsBlocks: boolean;
}

export const SECTION_METADATA: Record<SectionType, SectionMeta> = {
	hero: {
		type: "hero",
		name: "Hero",
		description: "Section principale avec titre et image de fond",
		icon: "Layout",
		defaultSettings: {
			variant: "gradient",
			gradientFrom: "#667eea",
			gradientTo: "#764ba2",
			gradientDirection: "to-bottom-right",
			alignment: "center",
			showDate: true,
			showLocation: true,
			showCta: true,
			ctaText: "En savoir plus",
		} as HeroSettings,
		supportsBlocks: true,
	},
	about: {
		type: "about",
		name: "A propos",
		description: "Description du projet ou evenement",
		icon: "FileText",
		defaultSettings: {
			layout: "text-only",
			showTitle: true,
			title: "A propos",
		} as AboutSettings,
		supportsBlocks: true,
	},
	"event-details": {
		type: "event-details",
		name: "Details evenement",
		description: "Date, lieu et informations pratiques",
		icon: "Calendar",
		defaultSettings: {
			showDate: true,
			showTime: true,
			showLocation: true,
			showMap: false,
			showOrganizer: true,
			layout: "cards",
		} as EventDetailsSettings,
		supportsBlocks: false,
	},
	tiers: {
		type: "tiers",
		name: "Offres de sponsoring",
		description: "Paliers de sponsoring avec prix et avantages",
		icon: "CreditCard",
		defaultSettings: {
			layout: "grid",
			columns: 3,
			showPrices: true,
			showBenefits: true,
			highlightFeatured: true,
			ctaText: "Choisir cette offre",
		} as TiersSettings,
		supportsBlocks: false,
	},
	benefits: {
		type: "benefits",
		name: "Avantages",
		description: "Liste des avantages ou caracteristiques",
		icon: "CheckCircle",
		defaultSettings: {
			layout: "grid",
			columns: 3,
			showIcons: true,
			iconStyle: "circle",
		} as BenefitsSettings,
		supportsBlocks: true,
	},
	gallery: {
		type: "gallery",
		name: "Galerie",
		description: "Galerie de photos ou images",
		icon: "Image",
		defaultSettings: {
			layout: "grid",
			columns: 3,
			gap: "medium",
			images: [],
		} as GallerySettings,
		supportsBlocks: false,
	},
	testimonials: {
		type: "testimonials",
		name: "Temoignages",
		description: "Avis et temoignages de sponsors precedents",
		icon: "Quote",
		defaultSettings: {
			layout: "carousel",
			showAvatar: true,
			showCompany: true,
			testimonials: [],
		} as TestimonialsSettings,
		supportsBlocks: false,
	},
	sponsors: {
		type: "sponsors",
		name: "Sponsors",
		description: "Logos des sponsors actuels ou passes",
		icon: "Award",
		defaultSettings: {
			layout: "grid",
			columns: 4,
			showNames: false,
			grayscale: true,
			sponsors: [],
		} as SponsorsSettings,
		supportsBlocks: false,
	},
	team: {
		type: "team",
		name: "Equipe",
		description: "Membres de l equipe organisatrice",
		icon: "Users",
		defaultSettings: {
			layout: "grid",
			columns: 3,
			showRole: true,
			showBio: false,
			showSocials: true,
			members: [],
		} as TeamSettings,
		supportsBlocks: false,
	},
	timeline: {
		type: "timeline",
		name: "Programme",
		description: "Chronologie ou programme de l evenement",
		icon: "Clock",
		defaultSettings: {
			layout: "vertical",
			showDates: true,
			showIcons: true,
			events: [],
		} as TimelineSettings,
		supportsBlocks: false,
	},
	faq: {
		type: "faq",
		name: "FAQ",
		description: "Questions frequemment posees",
		icon: "HelpCircle",
		defaultSettings: {
			layout: "accordion",
			columns: 1,
			faqs: [],
		} as FaqSettings,
		supportsBlocks: false,
	},
	contact: {
		type: "contact",
		name: "Contact",
		description: "Formulaire et informations de contact",
		icon: "Mail",
		defaultSettings: {
			layout: "form-info",
			showEmail: true,
			showPhone: true,
			showAddress: false,
			showSocials: false,
			showMap: false,
			formFields: ["name", "email", "company", "message"],
			submitText: "Envoyer",
		} as ContactSettings,
		supportsBlocks: true,
	},
	cta: {
		type: "cta",
		name: "Call to Action",
		description: "Section d appel a l action",
		icon: "MousePointer",
		defaultSettings: {
			variant: "simple",
			title: "Pret a devenir sponsor ?",
			subtitle:
				"Rejoignez nos partenaires et beneficiez d une visibilite exceptionnelle",
			buttonText: "Nous contacter",
			buttonLink: "#contact",
		} as CtaSettings,
		supportsBlocks: false,
	},
	custom: {
		type: "custom",
		name: "Section personnalisee",
		description: "Section vide a personnaliser avec des blocs",
		icon: "Plus",
		defaultSettings: {} as CustomSettings,
		supportsBlocks: true,
	},
};

// ----------------------------------------------------------------------------
// BLOCK METADATA
// ----------------------------------------------------------------------------

export interface BlockMeta {
	type: BlockType;
	name: string;
	description: string;
	icon: string;
	defaultContent: BlockData["content"];
	defaultSettings: BlockData["settings"];
}

export const BLOCK_METADATA: Record<BlockType, BlockMeta> = {
	heading: {
		type: "heading",
		name: "Titre",
		description: "Titre ou sous-titre",
		icon: "Type",
		defaultContent: { text: "Nouveau titre", level: 2 },
		defaultSettings: { alignment: "left" },
	},
	text: {
		type: "text",
		name: "Texte",
		description: "Paragraphe de texte riche",
		icon: "AlignLeft",
		defaultContent: { html: "<p>Votre texte ici...</p>" },
		defaultSettings: { alignment: "left", maxWidth: "medium" },
	},
	image: {
		type: "image",
		name: "Image",
		description: "Image avec legende optionnelle",
		icon: "Image",
		defaultContent: { src: "", alt: "Image" },
		defaultSettings: {
			width: "full",
			alignment: "center",
			borderRadius: "medium",
			shadow: "small",
		},
	},
	video: {
		type: "video",
		name: "Video",
		description: "Video YouTube, Vimeo ou personnalisee",
		icon: "Video",
		defaultContent: { src: "", provider: "youtube" },
		defaultSettings: { aspectRatio: "16:9", autoplay: false, muted: false },
	},
	button: {
		type: "button",
		name: "Bouton",
		description: "Bouton d action",
		icon: "MousePointer",
		defaultContent: { text: "Cliquez ici", link: "#" },
		defaultSettings: {
			variant: "primary",
			size: "medium",
			alignment: "center",
			fullWidth: false,
		},
	},
	divider: {
		type: "divider",
		name: "Separateur",
		description: "Ligne de separation",
		icon: "Minus",
		defaultContent: {},
		defaultSettings: { style: "solid", width: "medium", thickness: "thin" },
	},
	spacer: {
		type: "spacer",
		name: "Espacement",
		description: "Espace vertical",
		icon: "MoveVertical",
		defaultContent: {},
		defaultSettings: { height: "medium" },
	},
	"icon-list": {
		type: "icon-list",
		name: "Liste avec icones",
		description: "Liste d elements avec icones",
		icon: "List",
		defaultContent: { items: [] },
		defaultSettings: { layout: "vertical", iconSize: "medium" },
	},
	stats: {
		type: "stats",
		name: "Statistiques",
		description: "Chiffres cles et statistiques",
		icon: "BarChart",
		defaultContent: { stats: [] },
		defaultSettings: { layout: "horizontal", columns: 3, animated: true },
	},
	quote: {
		type: "quote",
		name: "Citation",
		description: "Citation avec auteur",
		icon: "Quote",
		defaultContent: { text: "Votre citation ici..." },
		defaultSettings: {
			style: "bordered",
			alignment: "center",
			showQuoteMark: true,
		},
	},
	embed: {
		type: "embed",
		name: "Embed",
		description: "Contenu externe integre",
		icon: "Code",
		defaultContent: { code: "" },
		defaultSettings: { aspectRatio: "16:9", maxWidth: "medium" },
	},
	html: {
		type: "html",
		name: "HTML personnalise",
		description: "Code HTML personnalise",
		icon: "Code2",
		defaultContent: { code: "" },
		defaultSettings: { sanitize: true },
	},
};

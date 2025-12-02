import {
	ChevronLeft,
	ChevronRight,
	Grid3X3,
	Layout,
	Palette,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import type { BlockType, SectionType } from "../../types/builder";
import { BLOCK_METADATA, SECTION_METADATA } from "../../types/builder";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useBuilder } from "./BuilderContext";
import { TEMPLATE_CATEGORIES, TEMPLATES } from "./templates";

export function BuilderSidebar() {
	const {
		activePanel,
		setActivePanel,
		addSection,
		selectedSectionId,
		layout,
		addBlock,
	} = useBuilder();

	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleAddSection = (type: SectionType) => {
		addSection(type);
	};

	const handleAddBlock = (type: BlockType) => {
		if (selectedSectionId) {
			const section = layout.sections.find((s) => s.id === selectedSectionId);
			if (section && SECTION_METADATA[section.type].supportsBlocks) {
				addBlock(selectedSectionId, type);
			}
		}
	};

	const selectedSection = selectedSectionId
		? layout.sections.find((s) => s.id === selectedSectionId)
		: null;

	const canAddBlocks =
		selectedSection && SECTION_METADATA[selectedSection.type].supportsBlocks;

	if (isCollapsed) {
		return (
			<div className="w-12 border-r border-border bg-background flex flex-col items-center py-4 gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsCollapsed(false)}
					title="Ouvrir le panneau"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<div className="w-8 h-px bg-border my-2" />
				<Button
					variant={activePanel === "sections" ? "secondary" : "ghost"}
					size="icon"
					onClick={() => {
						setActivePanel("sections");
						setIsCollapsed(false);
					}}
					title="Sections"
				>
					<Layout className="h-4 w-4" />
				</Button>
				<Button
					variant={activePanel === "blocks" ? "secondary" : "ghost"}
					size="icon"
					onClick={() => {
						setActivePanel("blocks");
						setIsCollapsed(false);
					}}
					title="Blocs"
					disabled={!canAddBlocks}
				>
					<Grid3X3 className="h-4 w-4" />
				</Button>
				<Button
					variant={activePanel === "styles" ? "secondary" : "ghost"}
					size="icon"
					onClick={() => {
						setActivePanel("styles");
						setIsCollapsed(false);
					}}
					title="Styles"
				>
					<Palette className="h-4 w-4" />
				</Button>
				<Button
					variant={activePanel === "templates" ? "secondary" : "ghost"}
					size="icon"
					onClick={() => {
						setActivePanel("templates");
						setIsCollapsed(false);
					}}
					title="Templates"
				>
					<Sparkles className="h-4 w-4" />
				</Button>
			</div>
		);
	}

	return (
		<div className="w-72 border-r border-border bg-background flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-3 border-b border-border">
				<h2 className="font-semibold text-sm">Builder</h2>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8"
					onClick={() => setIsCollapsed(true)}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
			</div>

			{/* Tabs */}
			<div className="flex border-b border-border">
				<button
					className={cn(
						"flex-1 py-2 text-xs font-medium transition-colors",
						activePanel === "sections"
							? "border-b-2 border-primary text-primary"
							: "text-muted-foreground hover:text-foreground",
					)}
					onClick={() => setActivePanel("sections")}
				>
					Sections
				</button>
				<button
					className={cn(
						"flex-1 py-2 text-xs font-medium transition-colors",
						activePanel === "blocks"
							? "border-b-2 border-primary text-primary"
							: "text-muted-foreground hover:text-foreground",
						!canAddBlocks && "opacity-50 cursor-not-allowed",
					)}
					onClick={() => canAddBlocks && setActivePanel("blocks")}
					disabled={!canAddBlocks}
				>
					Blocs
				</button>
				<button
					className={cn(
						"flex-1 py-2 text-xs font-medium transition-colors",
						activePanel === "styles"
							? "border-b-2 border-primary text-primary"
							: "text-muted-foreground hover:text-foreground",
					)}
					onClick={() => setActivePanel("styles")}
				>
					Styles
				</button>
				<button
					className={cn(
						"flex-1 py-2 text-xs font-medium transition-colors",
						activePanel === "templates"
							? "border-b-2 border-primary text-primary"
							: "text-muted-foreground hover:text-foreground",
					)}
					onClick={() => setActivePanel("templates")}
				>
					Templates
				</button>
			</div>

			{/* Content */}
			<ScrollArea className="flex-1">
				<div className="p-3">
					{activePanel === "sections" && (
						<SectionsPanel onAddSection={handleAddSection} />
					)}
					{activePanel === "blocks" && (
						<BlocksPanel onAddBlock={handleAddBlock} disabled={!canAddBlocks} />
					)}
					{activePanel === "styles" && <StylesPanel />}
					{activePanel === "templates" && <TemplatesPanel />}
				</div>
			</ScrollArea>
		</div>
	);
}

// Sections Panel
function SectionsPanel({
	onAddSection,
}: {
	onAddSection: (type: SectionType) => void;
}) {
	const sections = Object.values(SECTION_METADATA);

	return (
		<div className="space-y-4">
			<p className="text-xs text-muted-foreground">
				Cliquez pour ajouter une section a votre page
			</p>
			<div className="grid grid-cols-2 gap-2">
				{sections.map((meta) => (
					<button
						key={meta.type}
						className="flex flex-col items-center gap-1.5 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
						onClick={() => onAddSection(meta.type)}
					>
						<div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
							{meta.name.charAt(0)}
						</div>
						<span className="text-xs font-medium text-center">{meta.name}</span>
					</button>
				))}
			</div>
		</div>
	);
}

// Blocks Panel
function BlocksPanel({
	onAddBlock,
	disabled,
}: {
	onAddBlock: (type: BlockType) => void;
	disabled: boolean;
}) {
	const blocks = Object.values(BLOCK_METADATA);

	if (disabled) {
		return (
			<div className="text-center py-8">
				<p className="text-sm text-muted-foreground">
					Selectionnez une section qui supporte les blocs pour en ajouter
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<p className="text-xs text-muted-foreground">
				Ajoutez des blocs a la section selectionnee
			</p>
			<div className="grid grid-cols-2 gap-2">
				{blocks.map((meta) => (
					<button
						key={meta.type}
						className="flex flex-col items-center gap-1.5 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
						onClick={() => onAddBlock(meta.type)}
					>
						<div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
							{meta.name.charAt(0)}
						</div>
						<span className="text-xs font-medium">{meta.name}</span>
					</button>
				))}
			</div>
		</div>
	);
}

// Styles Panel
function StylesPanel() {
	const { layout, updateColors, updateTypography, updateSpacing } =
		useBuilder();
	const { colors, typography, spacing } = layout.globalStyles;

	return (
		<div className="space-y-6">
			{/* Colors */}
			<div className="space-y-3">
				<h3 className="text-sm font-medium">Couleurs</h3>
				<div className="space-y-2">
					{Object.entries(colors).map(([key, value]) => (
						<div key={key} className="flex items-center justify-between">
							<label className="text-xs text-muted-foreground capitalize">
								{key}
							</label>
							<input
								type="color"
								value={value}
								onChange={(e) => updateColors({ [key]: e.target.value })}
								className="w-8 h-8 rounded border border-border cursor-pointer"
							/>
						</div>
					))}
				</div>
			</div>

			{/* Typography */}
			<div className="space-y-3">
				<h3 className="text-sm font-medium">Typographie</h3>
				<div className="space-y-2">
					<div>
						<label className="text-xs text-muted-foreground">
							Police des titres
						</label>
						<select
							value={typography.headingFont}
							onChange={(e) =>
								updateTypography({ headingFont: e.target.value })
							}
							className="w-full mt-1 px-2 py-1.5 text-sm border border-border rounded bg-background"
						>
							<option value="Inter">Inter</option>
							<option value="Poppins">Poppins</option>
							<option value="Montserrat">Montserrat</option>
							<option value="Playfair Display">Playfair Display</option>
							<option value="Roboto">Roboto</option>
						</select>
					</div>
					<div>
						<label className="text-xs text-muted-foreground">
							Police du texte
						</label>
						<select
							value={typography.bodyFont}
							onChange={(e) => updateTypography({ bodyFont: e.target.value })}
							className="w-full mt-1 px-2 py-1.5 text-sm border border-border rounded bg-background"
						>
							<option value="Inter">Inter</option>
							<option value="Open Sans">Open Sans</option>
							<option value="Lato">Lato</option>
							<option value="Source Sans Pro">Source Sans Pro</option>
							<option value="Roboto">Roboto</option>
						</select>
					</div>
					<div>
						<label className="text-xs text-muted-foreground">
							Taille de base ({typography.baseFontSize}px)
						</label>
						<input
							type="range"
							min="14"
							max="20"
							value={typography.baseFontSize}
							onChange={(e) =>
								updateTypography({
									baseFontSize: Number(e.target.value),
								})
							}
							className="w-full mt-1"
						/>
					</div>
				</div>
			</div>

			{/* Spacing */}
			<div className="space-y-3">
				<h3 className="text-sm font-medium">Espacement</h3>
				<div className="space-y-2">
					<div>
						<label className="text-xs text-muted-foreground">
							Padding des sections
						</label>
						<select
							value={spacing.sectionPadding}
							onChange={(e) =>
								updateSpacing({
									sectionPadding: e.target.value as
										| "compact"
										| "normal"
										| "spacious",
								})
							}
							className="w-full mt-1 px-2 py-1.5 text-sm border border-border rounded bg-background"
						>
							<option value="compact">Compact</option>
							<option value="normal">Normal</option>
							<option value="spacious">Spacieux</option>
						</select>
					</div>
					<div>
						<label className="text-xs text-muted-foreground">
							Largeur du contenu
						</label>
						<select
							value={spacing.containerWidth}
							onChange={(e) =>
								updateSpacing({
									containerWidth: e.target.value as
										| "narrow"
										| "medium"
										| "wide"
										| "full",
								})
							}
							className="w-full mt-1 px-2 py-1.5 text-sm border border-border rounded bg-background"
						>
							<option value="narrow">Etroit</option>
							<option value="medium">Moyen</option>
							<option value="wide">Large</option>
							<option value="full">Pleine largeur</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}

// Templates Panel
function TemplatesPanel() {
	const { applyTemplate } = useBuilder();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	const filteredTemplates = selectedCategory
		? TEMPLATES.filter((t) => t.category === selectedCategory)
		: TEMPLATES;

	const getCategoryName = (categoryId: string) => {
		const cat = TEMPLATE_CATEGORIES.find((c) => c.id === categoryId);
		return cat?.name || categoryId;
	};

	return (
		<div className="space-y-4">
			<p className="text-xs text-muted-foreground">
				Choisissez un template pour demarrer rapidement
			</p>

			{/* Category filter */}
			<div className="flex flex-wrap gap-1">
				<button
					className={cn(
						"px-2 py-1 text-xs rounded-full transition-colors",
						selectedCategory === null
							? "bg-primary text-primary-foreground"
							: "bg-muted text-muted-foreground hover:bg-muted/80",
					)}
					onClick={() => setSelectedCategory(null)}
				>
					Tous
				</button>
				{TEMPLATE_CATEGORIES.map((cat) => (
					<button
						key={cat.id}
						className={cn(
							"px-2 py-1 text-xs rounded-full transition-colors",
							selectedCategory === cat.id
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground hover:bg-muted/80",
						)}
						onClick={() => setSelectedCategory(cat.id)}
					>
						{cat.name}
					</button>
				))}
			</div>

			{/* Templates list */}
			<div className="space-y-2">
				{filteredTemplates.map((template) => (
					<button
						key={template.id}
						className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
						onClick={() => applyTemplate(template.id)}
					>
						<div
							className="w-12 h-12 rounded flex items-center justify-center text-white font-bold"
							style={{
								background: `linear-gradient(135deg, ${template.layout.globalStyles.colors.primary}, ${template.layout.globalStyles.colors.secondary})`,
							}}
						>
							{template.name.charAt(0)}
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-sm font-medium truncate">
								{template.name}
							</div>
							<div className="text-xs text-muted-foreground">
								{getCategoryName(template.category)} -{" "}
								{template.layout.sections.length} sections
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}

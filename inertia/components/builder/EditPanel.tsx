import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Check,
	ChevronDown,
	Copy,
	Eye,
	EyeOff,
	Grid3X3,
	ImageIcon,
	LayoutGrid,
	List,
	Lock,
	MoreHorizontal,
	Palette,
	RotateCcw,
	Settings2,
	Sparkles,
	Trash2,
	Type,
	Unlock,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import type {
	AboutSettings,
	BenefitsSettings,
	ContactSettings,
	CtaSettings,
	FaqSettings,
	GallerySettings,
	HeroSettings,
	Section,
	SectionSettings,
	SectionType,
	SponsorsSettings,
	TeamSettings,
	TestimonialsSettings,
	TiersSettings,
	TimelineSettings,
} from "../../types/builder";
import { SECTION_METADATA } from "../../types/builder";
import { Button } from "../ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

interface EditPanelProps {
	section: Section;
	onUpdateSettings: (settings: Partial<SectionSettings>) => void;
	onUpdateSection: (updates: Partial<Section>) => void;
	onDuplicate: () => void;
	onDelete: () => void;
	onToggleVisibility: () => void;
	onToggleLock: () => void;
	onReset: () => void;
	onMakeGlobal?: () => void;
}

export function EditPanel({
	section,
	onUpdateSettings,
	onUpdateSection,
	onDuplicate,
	onDelete,
	onToggleVisibility,
	onToggleLock,
	onReset,
	onMakeGlobal,
}: EditPanelProps) {
	const [activeTab, setActiveTab] = useState<"settings" | "style" | "advanced">(
		"settings",
	);
	const sectionMeta = SECTION_METADATA[section.type];

	return (
		<TooltipProvider>
			<div className="flex flex-col h-full border-l border-border bg-background w-80">
				{/* Header */}
				<div className="flex items-center justify-between p-3 border-b border-border">
					<div className="flex items-center gap-2">
						<div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
							<span className="text-xs font-medium text-primary">
								{sectionMeta.name.charAt(0)}
							</span>
						</div>
						<div>
							<h3 className="text-sm font-medium">{sectionMeta.name}</h3>
							<p className="text-[10px] text-muted-foreground">
								#{section.elementId}
							</p>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="flex items-center gap-1">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7"
									onClick={onToggleVisibility}
								>
									{section.visible ? (
										<Eye className="h-4 w-4" />
									) : (
										<EyeOff className="h-4 w-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{section.visible ? "Masquer" : "Afficher"}
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7"
									onClick={onToggleLock}
								>
									{section.locked ? (
										<Lock className="h-4 w-4" />
									) : (
										<Unlock className="h-4 w-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{section.locked ? "Deverrouiller" : "Verrouiller"}
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7"
									onClick={onDuplicate}
								>
									<Copy className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Dupliquer</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7 text-destructive hover:text-destructive"
									onClick={onDelete}
									disabled={section.locked}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Supprimer</TooltipContent>
						</Tooltip>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex border-b border-border">
					<button
						className={cn(
							"flex-1 py-2 text-xs font-medium transition-colors",
							activeTab === "settings"
								? "border-b-2 border-primary text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
						onClick={() => setActiveTab("settings")}
					>
						<Settings2 className="h-3 w-3 inline mr-1" />
						Parametres
					</button>
					<button
						className={cn(
							"flex-1 py-2 text-xs font-medium transition-colors",
							activeTab === "style"
								? "border-b-2 border-primary text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
						onClick={() => setActiveTab("style")}
					>
						<Palette className="h-3 w-3 inline mr-1" />
						Style
					</button>
					<button
						className={cn(
							"flex-1 py-2 text-xs font-medium transition-colors",
							activeTab === "advanced"
								? "border-b-2 border-primary text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
						onClick={() => setActiveTab("advanced")}
					>
						<Sparkles className="h-3 w-3 inline mr-1" />
						Avance
					</button>
				</div>

				{/* Content */}
				<ScrollArea className="flex-1">
					<div className="p-4 space-y-4">
						{activeTab === "settings" && (
							<SettingsTab
								section={section}
								onUpdateSettings={onUpdateSettings}
							/>
						)}
						{activeTab === "style" && (
							<StyleTab section={section} onUpdateSection={onUpdateSection} />
						)}
						{activeTab === "advanced" && (
							<AdvancedTab
								section={section}
								onUpdateSection={onUpdateSection}
								onReset={onReset}
								onMakeGlobal={onMakeGlobal}
							/>
						)}
					</div>
				</ScrollArea>
			</div>
		</TooltipProvider>
	);
}

// Settings Tab - Section-specific settings
function SettingsTab({
	section,
	onUpdateSettings,
}: {
	section: Section;
	onUpdateSettings: (settings: Partial<SectionSettings>) => void;
}) {
	switch (section.type) {
		case "hero":
			return (
				<HeroSettingsPanel
					settings={section.settings as HeroSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		case "about":
			return (
				<AboutSettingsPanel
					settings={section.settings as AboutSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		case "tiers":
			return (
				<TiersSettingsPanel
					settings={section.settings as TiersSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		case "benefits":
			return (
				<BenefitsSettingsPanel
					settings={section.settings as BenefitsSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		case "testimonials":
			return (
				<TestimonialsSettingsPanel
					settings={section.settings as TestimonialsSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		case "team":
			return (
				<TeamSettingsPanel
					settings={section.settings as TeamSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		case "faq":
			return (
				<FaqSettingsPanel
					settings={section.settings as FaqSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		case "contact":
			return (
				<ContactSettingsPanel
					settings={section.settings as ContactSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		case "cta":
			return (
				<CtaSettingsPanel
					settings={section.settings as CtaSettings}
					onUpdate={onUpdateSettings}
				/>
			);
		default:
			return (
				<div className="text-center py-8 text-sm text-muted-foreground">
					Cette section n'a pas de parametres specifiques
				</div>
			);
	}
}

// Hero Settings
function HeroSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: HeroSettings;
	onUpdate: (s: Partial<HeroSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			{/* Variant Selection */}
			<SettingGroup title="Variante">
				<div className="grid grid-cols-2 gap-2">
					{(["gradient", "image", "video", "minimal"] as const).map(
						(variant) => (
							<button
								key={variant}
								className={cn(
									"p-2 border rounded text-xs capitalize transition-colors",
									settings.variant === variant
										? "border-primary bg-primary/10 text-primary"
										: "border-border hover:border-primary/50",
								)}
								onClick={() => onUpdate({ variant })}
							>
								{variant === "gradient" && "Degrade"}
								{variant === "image" && "Image"}
								{variant === "video" && "Video"}
								{variant === "minimal" && "Minimal"}
							</button>
						),
					)}
				</div>
			</SettingGroup>

			{/* Alignment */}
			<SettingGroup title="Alignement">
				<div className="flex gap-1">
					{(["left", "center", "right"] as const).map((align) => (
						<Button
							key={align}
							variant={settings.alignment === align ? "secondary" : "ghost"}
							size="icon"
							className="h-8 w-8"
							onClick={() => onUpdate({ alignment: align })}
						>
							{align === "left" && <AlignLeft className="h-4 w-4" />}
							{align === "center" && <AlignCenter className="h-4 w-4" />}
							{align === "right" && <AlignRight className="h-4 w-4" />}
						</Button>
					))}
				</div>
			</SettingGroup>

			{/* Gradient Settings */}
			{settings.variant === "gradient" && (
				<SettingGroup title="Couleurs du degrade">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label className="text-xs">Debut</Label>
							<input
								type="color"
								value={settings.gradientFrom || "#667eea"}
								onChange={(e) => onUpdate({ gradientFrom: e.target.value })}
								className="w-8 h-8 rounded border cursor-pointer"
							/>
						</div>
						<div className="flex items-center justify-between">
							<Label className="text-xs">Fin</Label>
							<input
								type="color"
								value={settings.gradientTo || "#764ba2"}
								onChange={(e) => onUpdate({ gradientTo: e.target.value })}
								className="w-8 h-8 rounded border cursor-pointer"
							/>
						</div>
						<div>
							<Label className="text-xs">Direction</Label>
							<Select
								value={settings.gradientDirection || "to-bottom-right"}
								onValueChange={(v) =>
									onUpdate({
										gradientDirection: v as HeroSettings["gradientDirection"],
									})
								}
							>
								<SelectTrigger className="h-8 text-xs mt-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="to-right">Vers la droite</SelectItem>
									<SelectItem value="to-bottom">Vers le bas</SelectItem>
									<SelectItem value="to-bottom-right">Diagonale</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</SettingGroup>
			)}

			{/* Image Settings */}
			{settings.variant === "image" && (
				<SettingGroup title="Image de fond">
					<div className="space-y-2">
						<Input
							placeholder="URL de l'image"
							value={settings.backgroundImage || ""}
							onChange={(e) => onUpdate({ backgroundImage: e.target.value })}
							className="h-8 text-xs"
						/>
						<div>
							<Label className="text-xs">
								Opacite overlay ({settings.overlayOpacity || 50}%)
							</Label>
							<Slider
								value={[settings.overlayOpacity || 50]}
								onValueChange={([v]) => onUpdate({ overlayOpacity: v })}
								min={0}
								max={100}
								step={5}
								className="mt-2"
							/>
						</div>
					</div>
				</SettingGroup>
			)}

			{/* Display Options */}
			<SettingGroup title="Affichage">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher la date</Label>
						<Switch
							checked={settings.showDate ?? true}
							onCheckedChange={(checked) => onUpdate({ showDate: checked })}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher le lieu</Label>
						<Switch
							checked={settings.showLocation ?? true}
							onCheckedChange={(checked) => onUpdate({ showLocation: checked })}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher le bouton CTA</Label>
						<Switch
							checked={settings.showCta ?? true}
							onCheckedChange={(checked) => onUpdate({ showCta: checked })}
						/>
					</div>
				</div>
			</SettingGroup>

			{/* CTA Settings */}
			{settings.showCta && (
				<SettingGroup title="Bouton d'action">
					<div className="space-y-2">
						<Input
							placeholder="Texte du bouton"
							value={settings.ctaText || ""}
							onChange={(e) => onUpdate({ ctaText: e.target.value })}
							className="h-8 text-xs"
						/>
						<Input
							placeholder="Lien (ex: #contact)"
							value={settings.ctaLink || ""}
							onChange={(e) => onUpdate({ ctaLink: e.target.value })}
							className="h-8 text-xs"
						/>
					</div>
				</SettingGroup>
			)}
		</div>
	);
}

// About Settings
function AboutSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: AboutSettings;
	onUpdate: (s: Partial<AboutSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Layout">
				<div className="grid grid-cols-3 gap-2">
					{(["text-only", "text-image", "image-text"] as const).map(
						(layout) => (
							<button
								key={layout}
								className={cn(
									"p-2 border rounded text-[10px] transition-colors",
									settings.layout === layout
										? "border-primary bg-primary/10 text-primary"
										: "border-border hover:border-primary/50",
								)}
								onClick={() => onUpdate({ layout })}
							>
								{layout === "text-only" && "Texte"}
								{layout === "text-image" && "Texte + Img"}
								{layout === "image-text" && "Img + Texte"}
							</button>
						),
					)}
				</div>
			</SettingGroup>

			{settings.layout !== "text-only" && (
				<SettingGroup title="Image">
					<Input
						placeholder="URL de l'image"
						value={settings.imageUrl || ""}
						onChange={(e) => onUpdate({ imageUrl: e.target.value })}
						className="h-8 text-xs"
					/>
				</SettingGroup>
			)}

			<SettingGroup title="Titre">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher le titre</Label>
						<Switch
							checked={settings.showTitle ?? true}
							onCheckedChange={(checked) => onUpdate({ showTitle: checked })}
						/>
					</div>
					{settings.showTitle && (
						<Input
							placeholder="Titre de la section"
							value={settings.title || ""}
							onChange={(e) => onUpdate({ title: e.target.value })}
							className="h-8 text-xs"
						/>
					)}
				</div>
			</SettingGroup>
		</div>
	);
}

// Tiers Settings
function TiersSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: TiersSettings;
	onUpdate: (s: Partial<TiersSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Layout">
				<div className="grid grid-cols-3 gap-2">
					{(["grid", "horizontal", "stacked"] as const).map((layout) => (
						<button
							key={layout}
							className={cn(
								"p-2 border rounded text-[10px] transition-colors flex flex-col items-center gap-1",
								settings.layout === layout
									? "border-primary bg-primary/10 text-primary"
									: "border-border hover:border-primary/50",
							)}
							onClick={() => onUpdate({ layout })}
						>
							{layout === "grid" && <LayoutGrid className="h-4 w-4" />}
							{layout === "horizontal" && <Grid3X3 className="h-4 w-4" />}
							{layout === "stacked" && <List className="h-4 w-4" />}
							<span className="capitalize">{layout}</span>
						</button>
					))}
				</div>
			</SettingGroup>

			<SettingGroup title="Colonnes">
				<Select
					value={String(settings.columns || 3)}
					onValueChange={(v) =>
						onUpdate({ columns: Number(v) as 1 | 2 | 3 | 4 })
					}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="1">1 colonne</SelectItem>
						<SelectItem value="2">2 colonnes</SelectItem>
						<SelectItem value="3">3 colonnes</SelectItem>
						<SelectItem value="4">4 colonnes</SelectItem>
					</SelectContent>
				</Select>
			</SettingGroup>

			<SettingGroup title="Affichage">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher les prix</Label>
						<Switch
							checked={settings.showPrices ?? true}
							onCheckedChange={(checked) => onUpdate({ showPrices: checked })}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher les avantages</Label>
						<Switch
							checked={settings.showBenefits ?? true}
							onCheckedChange={(checked) => onUpdate({ showBenefits: checked })}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-xs">Mettre en avant le populaire</Label>
						<Switch
							checked={settings.highlightFeatured ?? true}
							onCheckedChange={(checked) =>
								onUpdate({ highlightFeatured: checked })
							}
						/>
					</div>
				</div>
			</SettingGroup>

			<SettingGroup title="Bouton">
				<Input
					placeholder="Texte du bouton"
					value={settings.ctaText || ""}
					onChange={(e) => onUpdate({ ctaText: e.target.value })}
					className="h-8 text-xs"
				/>
			</SettingGroup>
		</div>
	);
}

// Benefits Settings
function BenefitsSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: BenefitsSettings;
	onUpdate: (s: Partial<BenefitsSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Layout">
				<div className="grid grid-cols-3 gap-2">
					{(["list", "grid", "icons"] as const).map((layout) => (
						<button
							key={layout}
							className={cn(
								"p-2 border rounded text-[10px] transition-colors",
								settings.layout === layout
									? "border-primary bg-primary/10 text-primary"
									: "border-border hover:border-primary/50",
							)}
							onClick={() => onUpdate({ layout })}
						>
							{layout === "list" && "Liste"}
							{layout === "grid" && "Grille"}
							{layout === "icons" && "Icones"}
						</button>
					))}
				</div>
			</SettingGroup>

			<SettingGroup title="Colonnes">
				<Select
					value={String(settings.columns || 3)}
					onValueChange={(v) => onUpdate({ columns: Number(v) as 2 | 3 | 4 })}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="2">2 colonnes</SelectItem>
						<SelectItem value="3">3 colonnes</SelectItem>
						<SelectItem value="4">4 colonnes</SelectItem>
					</SelectContent>
				</Select>
			</SettingGroup>

			<SettingGroup title="Icones">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher les icones</Label>
						<Switch
							checked={settings.showIcons ?? true}
							onCheckedChange={(checked) => onUpdate({ showIcons: checked })}
						/>
					</div>
					{settings.showIcons && (
						<Select
							value={settings.iconStyle || "circle"}
							onValueChange={(v) =>
								onUpdate({ iconStyle: v as "circle" | "square" | "none" })
							}
						>
							<SelectTrigger className="h-8 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="circle">Cercle</SelectItem>
								<SelectItem value="square">Carre</SelectItem>
								<SelectItem value="none">Sans fond</SelectItem>
							</SelectContent>
						</Select>
					)}
				</div>
			</SettingGroup>
		</div>
	);
}

// Testimonials Settings
function TestimonialsSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: TestimonialsSettings;
	onUpdate: (s: Partial<TestimonialsSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Layout">
				<div className="grid grid-cols-3 gap-2">
					{(["carousel", "grid", "stacked"] as const).map((layout) => (
						<button
							key={layout}
							className={cn(
								"p-2 border rounded text-[10px] transition-colors",
								settings.layout === layout
									? "border-primary bg-primary/10 text-primary"
									: "border-border hover:border-primary/50",
							)}
							onClick={() => onUpdate({ layout })}
						>
							{layout === "carousel" && "Carousel"}
							{layout === "grid" && "Grille"}
							{layout === "stacked" && "Empile"}
						</button>
					))}
				</div>
			</SettingGroup>

			<SettingGroup title="Affichage">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher l'avatar</Label>
						<Switch
							checked={settings.showAvatar ?? true}
							onCheckedChange={(checked) => onUpdate({ showAvatar: checked })}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher l'entreprise</Label>
						<Switch
							checked={settings.showCompany ?? true}
							onCheckedChange={(checked) => onUpdate({ showCompany: checked })}
						/>
					</div>
				</div>
			</SettingGroup>
		</div>
	);
}

// Team Settings
function TeamSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: TeamSettings;
	onUpdate: (s: Partial<TeamSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Layout">
				<div className="grid grid-cols-2 gap-2">
					{(["grid", "carousel"] as const).map((layout) => (
						<button
							key={layout}
							className={cn(
								"p-2 border rounded text-xs transition-colors",
								settings.layout === layout
									? "border-primary bg-primary/10 text-primary"
									: "border-border hover:border-primary/50",
							)}
							onClick={() => onUpdate({ layout })}
						>
							{layout === "grid" && "Grille"}
							{layout === "carousel" && "Carousel"}
						</button>
					))}
				</div>
			</SettingGroup>

			<SettingGroup title="Colonnes">
				<Select
					value={String(settings.columns || 3)}
					onValueChange={(v) => onUpdate({ columns: Number(v) as 2 | 3 | 4 })}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="2">2 colonnes</SelectItem>
						<SelectItem value="3">3 colonnes</SelectItem>
						<SelectItem value="4">4 colonnes</SelectItem>
					</SelectContent>
				</Select>
			</SettingGroup>

			<SettingGroup title="Affichage">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher le role</Label>
						<Switch
							checked={settings.showRole ?? true}
							onCheckedChange={(checked) => onUpdate({ showRole: checked })}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher la bio</Label>
						<Switch
							checked={settings.showBio ?? false}
							onCheckedChange={(checked) => onUpdate({ showBio: checked })}
						/>
					</div>
					<div className="flex items-center justify-between">
						<Label className="text-xs">Afficher les reseaux</Label>
						<Switch
							checked={settings.showSocials ?? true}
							onCheckedChange={(checked) => onUpdate({ showSocials: checked })}
						/>
					</div>
				</div>
			</SettingGroup>
		</div>
	);
}

// FAQ Settings
function FaqSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: FaqSettings;
	onUpdate: (s: Partial<FaqSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Layout">
				<div className="grid grid-cols-3 gap-2">
					{(["accordion", "grid", "simple"] as const).map((layout) => (
						<button
							key={layout}
							className={cn(
								"p-2 border rounded text-[10px] transition-colors",
								settings.layout === layout
									? "border-primary bg-primary/10 text-primary"
									: "border-border hover:border-primary/50",
							)}
							onClick={() => onUpdate({ layout })}
						>
							{layout === "accordion" && "Accordeon"}
							{layout === "grid" && "Grille"}
							{layout === "simple" && "Simple"}
						</button>
					))}
				</div>
			</SettingGroup>

			{settings.layout === "grid" && (
				<SettingGroup title="Colonnes">
					<Select
						value={String(settings.columns || 1)}
						onValueChange={(v) => onUpdate({ columns: Number(v) as 1 | 2 })}
					>
						<SelectTrigger className="h-8 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">1 colonne</SelectItem>
							<SelectItem value="2">2 colonnes</SelectItem>
						</SelectContent>
					</Select>
				</SettingGroup>
			)}
		</div>
	);
}

// Contact Settings
function ContactSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: ContactSettings;
	onUpdate: (s: Partial<ContactSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Layout">
				<div className="grid grid-cols-3 gap-2">
					{(["form-only", "form-info", "info-only"] as const).map((layout) => (
						<button
							key={layout}
							className={cn(
								"p-2 border rounded text-[10px] transition-colors",
								settings.layout === layout
									? "border-primary bg-primary/10 text-primary"
									: "border-border hover:border-primary/50",
							)}
							onClick={() => onUpdate({ layout })}
						>
							{layout === "form-only" && "Formulaire"}
							{layout === "form-info" && "Form + Info"}
							{layout === "info-only" && "Info seule"}
						</button>
					))}
				</div>
			</SettingGroup>

			{settings.layout !== "form-only" && (
				<SettingGroup title="Informations affichees">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label className="text-xs">Email</Label>
							<Switch
								checked={settings.showEmail ?? true}
								onCheckedChange={(checked) => onUpdate({ showEmail: checked })}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Label className="text-xs">Telephone</Label>
							<Switch
								checked={settings.showPhone ?? true}
								onCheckedChange={(checked) => onUpdate({ showPhone: checked })}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Label className="text-xs">Adresse</Label>
							<Switch
								checked={settings.showAddress ?? false}
								onCheckedChange={(checked) =>
									onUpdate({ showAddress: checked })
								}
							/>
						</div>
						<div className="flex items-center justify-between">
							<Label className="text-xs">Reseaux sociaux</Label>
							<Switch
								checked={settings.showSocials ?? false}
								onCheckedChange={(checked) =>
									onUpdate({ showSocials: checked })
								}
							/>
						</div>
					</div>
				</SettingGroup>
			)}

			{settings.layout !== "info-only" && (
				<SettingGroup title="Bouton">
					<Input
						placeholder="Texte du bouton"
						value={settings.submitText || ""}
						onChange={(e) => onUpdate({ submitText: e.target.value })}
						className="h-8 text-xs"
					/>
				</SettingGroup>
			)}
		</div>
	);
}

// CTA Settings
function CtaSettingsPanel({
	settings,
	onUpdate,
}: {
	settings: CtaSettings;
	onUpdate: (s: Partial<CtaSettings>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Variante">
				<div className="grid grid-cols-3 gap-2">
					{(["simple", "split", "banner"] as const).map((variant) => (
						<button
							key={variant}
							className={cn(
								"p-2 border rounded text-[10px] transition-colors",
								settings.variant === variant
									? "border-primary bg-primary/10 text-primary"
									: "border-border hover:border-primary/50",
							)}
							onClick={() => onUpdate({ variant })}
						>
							{variant === "simple" && "Simple"}
							{variant === "split" && "Split"}
							{variant === "banner" && "Banniere"}
						</button>
					))}
				</div>
			</SettingGroup>

			<SettingGroup title="Contenu">
				<div className="space-y-2">
					<Input
						placeholder="Titre"
						value={settings.title || ""}
						onChange={(e) => onUpdate({ title: e.target.value })}
						className="h-8 text-xs"
					/>
					<Input
						placeholder="Sous-titre"
						value={settings.subtitle || ""}
						onChange={(e) => onUpdate({ subtitle: e.target.value })}
						className="h-8 text-xs"
					/>
				</div>
			</SettingGroup>

			<SettingGroup title="Bouton principal">
				<div className="space-y-2">
					<Input
						placeholder="Texte"
						value={settings.buttonText || ""}
						onChange={(e) => onUpdate({ buttonText: e.target.value })}
						className="h-8 text-xs"
					/>
					<Input
						placeholder="Lien"
						value={settings.buttonLink || ""}
						onChange={(e) => onUpdate({ buttonLink: e.target.value })}
						className="h-8 text-xs"
					/>
				</div>
			</SettingGroup>

			{settings.variant === "split" && (
				<SettingGroup title="Bouton secondaire">
					<div className="space-y-2">
						<Input
							placeholder="Texte"
							value={settings.secondaryButtonText || ""}
							onChange={(e) =>
								onUpdate({ secondaryButtonText: e.target.value })
							}
							className="h-8 text-xs"
						/>
						<Input
							placeholder="Lien"
							value={settings.secondaryButtonLink || ""}
							onChange={(e) =>
								onUpdate({ secondaryButtonLink: e.target.value })
							}
							className="h-8 text-xs"
						/>
					</div>
				</SettingGroup>
			)}
		</div>
	);
}

// Style Tab
function StyleTab({
	section,
	onUpdateSection,
}: {
	section: Section;
	onUpdateSection: (updates: Partial<Section>) => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Element ID">
				<Input
					value={section.elementId}
					onChange={(e) => onUpdateSection({ elementId: e.target.value })}
					className="h-8 text-xs font-mono"
					placeholder="section-id"
				/>
				<p className="text-[10px] text-muted-foreground mt-1">
					Utilise pour le CSS et les ancres
				</p>
			</SettingGroup>

			<SettingGroup title="CSS personnalise">
				<Textarea
					value={section.customCss}
					onChange={(e) => onUpdateSection({ customCss: e.target.value })}
					placeholder={`#${section.elementId} {\n  /* Votre CSS ici */\n}`}
					className="font-mono text-xs min-h-[120px]"
				/>
			</SettingGroup>
		</div>
	);
}

// Advanced Tab
function AdvancedTab({
	section,
	onUpdateSection,
	onReset,
	onMakeGlobal,
}: {
	section: Section;
	onUpdateSection: (updates: Partial<Section>) => void;
	onReset: () => void;
	onMakeGlobal?: () => void;
}) {
	return (
		<div className="space-y-4">
			<SettingGroup title="Actions">
				<div className="space-y-2">
					<Button
						variant="outline"
						size="sm"
						className="w-full justify-start"
						onClick={onReset}
					>
						<RotateCcw className="h-4 w-4 mr-2" />
						Reinitialiser les parametres
					</Button>

					{onMakeGlobal && (
						<Button
							variant="outline"
							size="sm"
							className="w-full justify-start"
							onClick={onMakeGlobal}
						>
							<Globe className="h-4 w-4 mr-2" />
							Creer une section globale
						</Button>
					)}
				</div>
			</SettingGroup>

			<SettingGroup title="Informations">
				<div className="space-y-1 text-xs text-muted-foreground">
					<div className="flex justify-between">
						<span>Type:</span>
						<span className="font-mono">{section.type}</span>
					</div>
					<div className="flex justify-between">
						<span>ID:</span>
						<span className="font-mono text-[10px]">{section.id}</span>
					</div>
					<div className="flex justify-between">
						<span>Blocs:</span>
						<span>{section.blocks.length}</span>
					</div>
				</div>
			</SettingGroup>
		</div>
	);
}

// Helper component for setting groups
function SettingGroup({
	title,
	children,
	defaultOpen = true,
}: {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-xs font-medium hover:text-primary">
				{title}
				<ChevronDown
					className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")}
				/>
			</CollapsibleTrigger>
			<CollapsibleContent className="pt-2">{children}</CollapsibleContent>
		</Collapsible>
	);
}

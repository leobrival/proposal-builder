import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Copy,
	Eye,
	EyeOff,
	GripVertical,
	Lock,
	Settings,
	Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { Section } from "../../types/builder";
import { SECTION_METADATA } from "../../types/builder";
import { Button } from "../ui/button";
import { useBuilder } from "./BuilderContext";

interface SectionWrapperProps {
	section: Section;
	children: React.ReactNode;
}

export function SectionWrapper({ section, children }: SectionWrapperProps) {
	const {
		selectedSectionId,
		selectSection,
		removeSection,
		duplicateSection,
		toggleSectionVisibility,
		setActivePanel,
	} = useBuilder();

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: section.id,
		disabled: section.locked,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const isSelected = selectedSectionId === section.id;
	const meta = SECTION_METADATA[section.type];

	const handleSelect = () => {
		selectSection(section.id);
		setActivePanel("sections");
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (section.locked) return;
		removeSection(section.id);
	};

	const handleDuplicate = (e: React.MouseEvent) => {
		e.stopPropagation();
		duplicateSection(section.id);
	};

	const handleToggleVisibility = (e: React.MouseEvent) => {
		e.stopPropagation();
		toggleSectionVisibility(section.id);
	};

	const handleOpenSettings = (e: React.MouseEvent) => {
		e.stopPropagation();
		selectSection(section.id);
		setActivePanel("sections");
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				"group relative",
				isDragging && "z-50 opacity-50",
				!section.visible && "opacity-40",
			)}
			onClick={handleSelect}
			data-section-id={section.id}
			data-section-type={section.type}
		>
			{/* Section outline when selected */}
			<div
				className={cn(
					"absolute inset-0 pointer-events-none border-2 rounded-lg transition-colors z-10",
					isSelected
						? "border-primary"
						: "border-transparent group-hover:border-primary/30",
				)}
			/>

			{/* Section toolbar */}
			<div
				className={cn(
					"absolute -top-10 left-0 right-0 flex items-center justify-between px-2 py-1 bg-background border border-border rounded-t-lg shadow-sm transition-opacity z-20",
					isSelected || isDragging
						? "opacity-100"
						: "opacity-0 group-hover:opacity-100",
				)}
			>
				{/* Left side - Drag handle and section info */}
				<div className="flex items-center gap-2">
					{/* Drag handle */}
					<button
						{...attributes}
						{...listeners}
						className={cn(
							"p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing",
							section.locked && "cursor-not-allowed opacity-50",
						)}
						disabled={section.locked}
					>
						<GripVertical className="h-4 w-4 text-muted-foreground" />
					</button>

					{/* Section type label */}
					<span className="text-xs font-medium text-muted-foreground">
						{meta.name}
					</span>

					{/* Element ID */}
					<code className="text-xs text-muted-foreground/60 font-mono">
						#{section.elementId}
					</code>

					{/* Locked indicator */}
					{section.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
				</div>

				{/* Right side - Actions */}
				<div className="flex items-center gap-1">
					{/* Visibility toggle */}
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={handleToggleVisibility}
						title={section.visible ? "Masquer" : "Afficher"}
					>
						{section.visible ? (
							<Eye className="h-3.5 w-3.5" />
						) : (
							<EyeOff className="h-3.5 w-3.5" />
						)}
					</Button>

					{/* Settings */}
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={handleOpenSettings}
						title="Parametres"
					>
						<Settings className="h-3.5 w-3.5" />
					</Button>

					{/* Duplicate */}
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7"
						onClick={handleDuplicate}
						title="Dupliquer"
					>
						<Copy className="h-3.5 w-3.5" />
					</Button>

					{/* Delete */}
					<Button
						variant="ghost"
						size="icon"
						className="h-7 w-7 text-destructive hover:text-destructive"
						onClick={handleDelete}
						disabled={section.locked}
						title={section.locked ? "Section verrouillee" : "Supprimer"}
					>
						<Trash2 className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>

			{/* Section content */}
			<div
				id={section.elementId}
				className={cn(
					"builder-section relative",
					!section.visible && "pointer-events-none",
				)}
				data-section-type={section.type}
			>
				{children}
			</div>

			{/* Custom CSS indicator */}
			{section.customCss && (
				<div className="absolute bottom-2 right-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
					CSS
				</div>
			)}
		</div>
	);
}

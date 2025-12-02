import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	ChevronDown,
	ChevronRight,
	Eye,
	EyeOff,
	GripVertical,
	Layers,
	Lock,
	Unlock,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import type { Section } from "../../types/builder";
import { SECTION_METADATA } from "../../types/builder";
import { ScrollArea } from "../ui/scroll-area";

interface SitemapPanelProps {
	sections: Section[];
	selectedSectionId: string | null;
	onSelectSection: (sectionId: string) => void;
	onReorderSections: (fromIndex: number, toIndex: number) => void;
	onToggleVisibility: (sectionId: string) => void;
	onToggleLock: (sectionId: string) => void;
}

export function SitemapPanel({
	sections,
	selectedSectionId,
	onSelectSection,
	onReorderSections,
	onToggleVisibility,
	onToggleLock,
}: SitemapPanelProps) {
	const [activeId, setActiveId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		const section = sections.find((s) => s.id === event.active.id);
		if (section?.locked) return;
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const fromIndex = sections.findIndex((s) => s.id === active.id);
			const toIndex = sections.findIndex((s) => s.id === over.id);

			if (fromIndex !== -1 && toIndex !== -1) {
				onReorderSections(fromIndex, toIndex);
			}
		}

		setActiveId(null);
	};

	const activeSection = activeId
		? sections.find((s) => s.id === activeId)
		: null;

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="flex items-center gap-2 p-3 border-b border-border">
				<Layers className="h-4 w-4 text-muted-foreground" />
				<span className="text-sm font-medium">Structure</span>
				<span className="text-xs text-muted-foreground ml-auto">
					{sections.length} section{sections.length > 1 ? "s" : ""}
				</span>
			</div>

			{/* Section List */}
			<ScrollArea className="flex-1">
				<div className="p-2">
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={sections.map((s) => s.id)}
							strategy={verticalListSortingStrategy}
						>
							{sections.map((section, index) => (
								<SectionItem
									key={section.id}
									section={section}
									index={index}
									isSelected={selectedSectionId === section.id}
									onSelect={() => onSelectSection(section.id)}
									onToggleVisibility={() => onToggleVisibility(section.id)}
									onToggleLock={() => onToggleLock(section.id)}
								/>
							))}
						</SortableContext>

						<DragOverlay>
							{activeSection ? (
								<div className="bg-background border border-primary rounded px-3 py-2 shadow-lg">
									<span className="text-sm font-medium">
										{SECTION_METADATA[activeSection.type].name}
									</span>
								</div>
							) : null}
						</DragOverlay>
					</DndContext>

					{sections.length === 0 && (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<Layers className="h-8 w-8 text-muted-foreground mb-2" />
							<p className="text-sm text-muted-foreground">Aucune section</p>
							<p className="text-xs text-muted-foreground mt-1">
								Ajoutez des sections depuis le panneau Sections
							</p>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}

interface SectionItemProps {
	section: Section;
	index: number;
	isSelected: boolean;
	onSelect: () => void;
	onToggleVisibility: () => void;
	onToggleLock: () => void;
}

function SectionItem({
	section,
	index,
	isSelected,
	onSelect,
	onToggleVisibility,
	onToggleLock,
}: SectionItemProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const sectionMeta = SECTION_METADATA[section.type];

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

	const hasBlocks = section.blocks.length > 0;

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn("group", isDragging && "opacity-50")}
		>
			<div
				className={cn(
					"flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
					isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
					!section.visible && "opacity-50",
				)}
				onClick={onSelect}
			>
				{/* Drag Handle */}
				<button
					className={cn(
						"cursor-grab hover:bg-muted rounded p-0.5 transition-opacity",
						section.locked
							? "opacity-30 cursor-not-allowed"
							: "opacity-0 group-hover:opacity-100",
					)}
					{...attributes}
					{...listeners}
				>
					<GripVertical className="h-3 w-3 text-muted-foreground" />
				</button>

				{/* Expand/Collapse for blocks */}
				{hasBlocks ? (
					<button
						className="p-0.5 hover:bg-muted rounded"
						onClick={(e) => {
							e.stopPropagation();
							setIsExpanded(!isExpanded);
						}}
					>
						{isExpanded ? (
							<ChevronDown className="h-3 w-3" />
						) : (
							<ChevronRight className="h-3 w-3" />
						)}
					</button>
				) : (
					<div className="w-4" />
				)}

				{/* Index */}
				<span className="text-[10px] text-muted-foreground w-4 text-center">
					{index + 1}
				</span>

				{/* Section Name */}
				<span className="flex-1 text-sm truncate">{sectionMeta.name}</span>

				{/* Element ID */}
				<span className="text-[10px] text-muted-foreground hidden group-hover:block">
					#{section.elementId}
				</span>

				{/* Action buttons */}
				<div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
					{/* Visibility toggle */}
					<button
						className="p-1 hover:bg-muted rounded"
						onClick={(e) => {
							e.stopPropagation();
							onToggleVisibility();
						}}
						title={section.visible ? "Masquer" : "Afficher"}
					>
						{section.visible ? (
							<Eye className="h-3 w-3 text-muted-foreground" />
						) : (
							<EyeOff className="h-3 w-3 text-muted-foreground" />
						)}
					</button>

					{/* Lock toggle */}
					<button
						className="p-1 hover:bg-muted rounded"
						onClick={(e) => {
							e.stopPropagation();
							onToggleLock();
						}}
						title={section.locked ? "Deverrouiller" : "Verrouiller"}
					>
						{section.locked ? (
							<Lock className="h-3 w-3 text-muted-foreground" />
						) : (
							<Unlock className="h-3 w-3 text-muted-foreground" />
						)}
					</button>
				</div>
			</div>

			{/* Expanded Blocks */}
			{isExpanded && hasBlocks && (
				<div className="ml-8 mt-1 space-y-0.5">
					{section.blocks.map((block) => (
						<div
							key={block.id}
							className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground rounded hover:bg-muted/30"
						>
							<div className="w-1 h-1 rounded-full bg-muted-foreground" />
							<span className="capitalize">{block.type}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

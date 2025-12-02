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
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import type { Section, SectionType } from "../../types/builder";
import { SECTION_METADATA } from "../../types/builder";
import { Button } from "../ui/button";
import { useBuilder } from "./BuilderContext";
import { SectionWrapper } from "./SectionWrapper";
import { SectionRenderer } from "./sections/SectionRenderer";

export function BuilderCanvas() {
	const { layout, moveSection, addSection, clearSelection, setActivePanel } =
		useBuilder();

	const [activeId, setActiveId] = useState<string | null>(null);
	const [showAddMenu, setShowAddMenu] = useState(false);

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
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = layout.sections.findIndex((s) => s.id === active.id);
			const newIndex = layout.sections.findIndex((s) => s.id === over.id);

			if (oldIndex !== -1 && newIndex !== -1) {
				moveSection(oldIndex, newIndex);
			}
		}

		setActiveId(null);
	};

	const handleCanvasClick = (e: React.MouseEvent) => {
		// Only clear selection if clicking directly on the canvas
		if (e.target === e.currentTarget) {
			clearSelection();
		}
	};

	const handleAddSection = (type: SectionType) => {
		addSection(type);
		setShowAddMenu(false);
	};

	const activeSection = activeId
		? layout.sections.find((s) => s.id === activeId)
		: null;

	// Get spacing classes based on global styles
	const getPaddingClass = () => {
		switch (layout.globalStyles.spacing.sectionPadding) {
			case "compact":
				return "py-8";
			case "spacious":
				return "py-20";
			default:
				return "py-12";
		}
	};

	const getContainerClass = () => {
		switch (layout.globalStyles.spacing.containerWidth) {
			case "narrow":
				return "max-w-3xl";
			case "wide":
				return "max-w-7xl";
			case "full":
				return "max-w-full";
			default:
				return "max-w-5xl";
		}
	};

	return (
		<div
			className="flex-1 overflow-auto bg-muted/30"
			onClick={handleCanvasClick}
		>
			{/* Canvas container with global styles applied */}
			<div
				className={cn("min-h-full", getPaddingClass())}
				style={{
					backgroundColor: layout.globalStyles.colors.background,
					color: layout.globalStyles.colors.text,
					fontFamily: layout.globalStyles.typography.bodyFont,
					fontSize: `${layout.globalStyles.typography.baseFontSize}px`,
					lineHeight: layout.globalStyles.typography.lineHeight,
				}}
			>
				<div className={cn("mx-auto px-4", getContainerClass())}>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragStart={handleDragStart}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={layout.sections.map((s) => s.id)}
							strategy={verticalListSortingStrategy}
						>
							{/* Sections */}
							{layout.sections.length > 0 ? (
								<div className="space-y-4">
									{layout.sections.map((section) => (
										<SectionWrapper key={section.id} section={section}>
											<SectionRenderer section={section} />
										</SectionWrapper>
									))}
								</div>
							) : (
								/* Empty state */
								<div className="flex flex-col items-center justify-center py-20 text-center">
									<div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
										<Plus className="h-8 w-8 text-muted-foreground" />
									</div>
									<h3 className="text-lg font-medium mb-2">
										Commencez a construire votre page
									</h3>
									<p className="text-muted-foreground mb-6 max-w-md">
										Ajoutez des sections pour creer votre page de sponsoring
										personnalisee. Vous pouvez aussi choisir un template pour
										demarrer rapidement.
									</p>
									<div className="flex gap-3">
										<Button onClick={() => setShowAddMenu(true)}>
											<Plus className="h-4 w-4 mr-2" />
											Ajouter une section
										</Button>
										<Button
											variant="outline"
											onClick={() => setActivePanel("templates")}
										>
											Choisir un template
										</Button>
									</div>
								</div>
							)}

							{/* Add section button at the end */}
							{layout.sections.length > 0 && (
								<div className="relative mt-8">
									<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" />
									<div className="relative flex justify-center">
										<Button
											variant="outline"
											size="sm"
											className="bg-background"
											onClick={() => setShowAddMenu(!showAddMenu)}
										>
											<Plus className="h-4 w-4 mr-2" />
											Ajouter une section
										</Button>
									</div>
								</div>
							)}
						</SortableContext>

						{/* Drag overlay */}
						<DragOverlay>
							{activeSection ? (
								<div className="opacity-80 shadow-xl rounded-lg overflow-hidden">
									<SectionRenderer section={activeSection} />
								</div>
							) : null}
						</DragOverlay>
					</DndContext>
				</div>
			</div>

			{/* Add section menu */}
			{showAddMenu && (
				<div
					className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
					onClick={() => setShowAddMenu(false)}
				>
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-6 bg-background border border-border rounded-lg shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-lg font-semibold mb-4">Ajouter une section</h3>
						<div className="grid grid-cols-3 gap-3">
							{Object.values(SECTION_METADATA).map((meta) => (
								<button
									key={meta.type}
									className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
									onClick={() => handleAddSection(meta.type)}
								>
									<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
										{/* Icon placeholder - will be replaced with actual Lucide icons */}
										<span className="text-xs font-medium">
											{meta.name.charAt(0)}
										</span>
									</div>
									<div className="text-center">
										<div className="text-sm font-medium">{meta.name}</div>
										<div className="text-xs text-muted-foreground line-clamp-2">
											{meta.description}
										</div>
									</div>
								</button>
							))}
						</div>
						<div className="flex justify-end mt-6">
							<Button variant="outline" onClick={() => setShowAddMenu(false)}>
								Annuler
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Global custom CSS */}
			{layout.globalStyles.customCss && (
				<style>{layout.globalStyles.customCss}</style>
			)}
		</div>
	);
}

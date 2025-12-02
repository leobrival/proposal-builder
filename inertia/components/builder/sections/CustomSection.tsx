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
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { BlockType, Section } from "../../../types/builder";
import { BLOCK_METADATA } from "../../../types/builder";
import { Button } from "../../ui/button";
import { BlockWrapper } from "../BlockWrapper";
import { useBuilder } from "../BuilderContext";
import { BlockRenderer } from "../blocks/BlockRenderer";

interface CustomSectionProps {
	section: Section;
}

export function CustomSection({ section }: CustomSectionProps) {
	const { layout, moveBlock, addBlock } = useBuilder();
	const { colors } = layout.globalStyles;

	const [activeId, setActiveId] = useState<string | null>(null);
	const [showAddMenu, setShowAddMenu] = useState(false);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
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
			const oldIndex = section.blocks.findIndex((b) => b.id === active.id);
			const newIndex = section.blocks.findIndex((b) => b.id === over.id);

			if (oldIndex !== -1 && newIndex !== -1) {
				moveBlock(section.id, oldIndex, newIndex);
			}
		}

		setActiveId(null);
	};

	const handleAddBlock = (type: BlockType) => {
		addBlock(section.id, type);
		setShowAddMenu(false);
	};

	const activeBlock = activeId
		? section.blocks.find((b) => b.id === activeId)
		: null;

	return (
		<div className="py-8 min-h-[200px]">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={section.blocks.map((b) => b.id)}
					strategy={verticalListSortingStrategy}
				>
					{section.blocks.length > 0 ? (
						<div className="space-y-4">
							{section.blocks.map((block) => (
								<BlockWrapper
									key={block.id}
									block={block}
									sectionId={section.id}
								>
									<BlockRenderer block={block} sectionId={section.id} />
								</BlockWrapper>
							))}
						</div>
					) : (
						<div
							className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg"
							style={{ borderColor: colors.muted }}
						>
							<p className="text-sm mb-4" style={{ color: colors.muted }}>
								Cette section est vide. Ajoutez des blocs pour la personnaliser.
							</p>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowAddMenu(true)}
							>
								<Plus className="h-4 w-4 mr-2" />
								Ajouter un bloc
							</Button>
						</div>
					)}
				</SortableContext>

				<DragOverlay>
					{activeBlock ? (
						<div className="opacity-80 shadow-lg rounded bg-background p-4">
							<BlockRenderer block={activeBlock} sectionId={section.id} />
						</div>
					) : null}
				</DragOverlay>
			</DndContext>

			{/* Add block button */}
			{section.blocks.length > 0 && (
				<div className="flex justify-center mt-6">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setShowAddMenu(true)}
					>
						<Plus className="h-4 w-4 mr-2" />
						Ajouter un bloc
					</Button>
				</div>
			)}

			{/* Add block menu */}
			{showAddMenu && (
				<div
					className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
					onClick={() => setShowAddMenu(false)}
				>
					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 bg-background border border-border rounded-lg shadow-lg"
						onClick={(e) => e.stopPropagation()}
					>
						<h3 className="text-lg font-semibold mb-4">Ajouter un bloc</h3>
						<div className="grid grid-cols-3 gap-3">
							{Object.values(BLOCK_METADATA).map((meta) => (
								<button
									key={meta.type}
									className="flex flex-col items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
									onClick={() => handleAddBlock(meta.type)}
								>
									<div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
										{meta.name.charAt(0)}
									</div>
									<span className="text-xs font-medium">{meta.name}</span>
								</button>
							))}
						</div>
						<div className="flex justify-end mt-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowAddMenu(false)}
							>
								Annuler
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

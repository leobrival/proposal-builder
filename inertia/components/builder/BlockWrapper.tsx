import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Settings, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Block } from "../../types/builder";
import { BLOCK_METADATA } from "../../types/builder";
import { Button } from "../ui/button";
import { useBuilder } from "./BuilderContext";

interface BlockWrapperProps {
	block: Block;
	sectionId: string;
	children: React.ReactNode;
}

export function BlockWrapper({
	block,
	sectionId,
	children,
}: BlockWrapperProps) {
	const {
		selectedBlockId,
		selectBlock,
		selectSection,
		removeBlock,
		duplicateBlock,
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
		id: block.id,
		data: {
			type: "block",
			sectionId,
			block,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const isSelected = selectedBlockId === block.id;
	const meta = BLOCK_METADATA[block.type];

	const handleSelect = (e: React.MouseEvent) => {
		e.stopPropagation();
		selectSection(sectionId);
		selectBlock(block.id);
		setActivePanel("blocks");
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		removeBlock(sectionId, block.id);
	};

	const handleDuplicate = (e: React.MouseEvent) => {
		e.stopPropagation();
		duplicateBlock(sectionId, block.id);
	};

	const handleOpenSettings = (e: React.MouseEvent) => {
		e.stopPropagation();
		selectSection(sectionId);
		selectBlock(block.id);
		setActivePanel("blocks");
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn("group/block relative", isDragging && "z-50 opacity-50")}
			onClick={handleSelect}
			data-block-id={block.id}
			data-block-type={block.type}
		>
			{/* Block outline when selected */}
			<div
				className={cn(
					"absolute inset-0 pointer-events-none border rounded transition-colors z-10",
					isSelected
						? "border-primary border-dashed"
						: "border-transparent group-hover/block:border-primary/20 group-hover/block:border-dashed",
				)}
			/>

			{/* Block toolbar */}
			<div
				className={cn(
					"absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-background border border-border rounded shadow-sm transition-opacity z-20",
					isSelected
						? "opacity-100"
						: "opacity-0 group-hover/block:opacity-100",
				)}
			>
				{/* Drag handle */}
				<button
					{...attributes}
					{...listeners}
					className="p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing"
				>
					<GripVertical className="h-3 w-3 text-muted-foreground" />
				</button>

				{/* Block type */}
				<span className="text-xs text-muted-foreground px-1">{meta.name}</span>

				{/* Divider */}
				<div className="w-px h-4 bg-border" />

				{/* Settings */}
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={handleOpenSettings}
					title="Parametres"
				>
					<Settings className="h-3 w-3" />
				</Button>

				{/* Duplicate */}
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={handleDuplicate}
					title="Dupliquer"
				>
					<Copy className="h-3 w-3" />
				</Button>

				{/* Delete */}
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6 text-destructive hover:text-destructive"
					onClick={handleDelete}
					title="Supprimer"
				>
					<Trash2 className="h-3 w-3" />
				</Button>
			</div>

			{/* Block content */}
			<div
				id={block.elementId}
				className="builder-block"
				data-block-type={block.type}
			>
				{children}
			</div>

			{/* Custom CSS indicator */}
			{block.customCss && (
				<div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded">
					CSS
				</div>
			)}
		</div>
	);
}

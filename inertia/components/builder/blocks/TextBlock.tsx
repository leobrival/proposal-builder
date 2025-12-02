import { cn } from "../../../lib/utils";
import type { Block, TextBlock as TextBlockType } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface TextBlockProps {
	block: Block;
}

export function TextBlock({ block }: TextBlockProps) {
	const { layout } = useBuilder();
	const { colors } = layout.globalStyles;

	const content = block.content as TextBlockType["content"];
	const settings = block.settings as TextBlockType["settings"];

	const getAlignmentClass = () => {
		switch (settings.alignment) {
			case "left":
				return "text-left";
			case "right":
				return "text-right";
			case "justify":
				return "text-justify";
			default:
				return "text-center";
		}
	};

	const getMaxWidthClass = () => {
		switch (settings.maxWidth) {
			case "narrow":
				return "max-w-xl";
			case "wide":
				return "max-w-4xl";
			case "full":
				return "max-w-full";
			default:
				return "max-w-2xl";
		}
	};

	return (
		<div
			className={cn(
				"prose prose-lg mx-auto",
				getAlignmentClass(),
				getMaxWidthClass(),
			)}
			style={{ color: colors.text }}
			contentEditable
			suppressContentEditableWarning
			dangerouslySetInnerHTML={{ __html: content.html }}
		/>
	);
}

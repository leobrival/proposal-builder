import { cn } from "../../../lib/utils";
import type {
	Block,
	HeadingBlock as HeadingBlockType,
} from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface HeadingBlockProps {
	block: Block;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
	const { layout } = useBuilder();
	const { colors, typography } = layout.globalStyles;

	const content = block.content as HeadingBlockType["content"];
	const settings = block.settings as HeadingBlockType["settings"];

	const getAlignmentClass = () => {
		switch (settings.alignment) {
			case "left":
				return "text-left";
			case "right":
				return "text-right";
			default:
				return "text-center";
		}
	};

	const getSizeClass = () => {
		switch (content.level) {
			case 1:
				return "text-4xl md:text-5xl";
			case 2:
				return "text-3xl md:text-4xl";
			case 3:
				return "text-2xl md:text-3xl";
			case 4:
				return "text-xl md:text-2xl";
			case 5:
				return "text-lg md:text-xl";
			case 6:
				return "text-base md:text-lg";
			default:
				return "text-2xl";
		}
	};

	const Tag = `h${content.level}` as keyof JSX.IntrinsicElements;

	return (
		<Tag
			className={cn("font-bold", getAlignmentClass(), getSizeClass())}
			style={{
				fontFamily: typography.headingFont,
				color: settings.color || colors.text,
			}}
			contentEditable
			suppressContentEditableWarning
		>
			{content.text}
		</Tag>
	);
}

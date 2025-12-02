import { cn } from "../../../lib/utils";
import type {
	Block,
	ButtonBlock as ButtonBlockType,
} from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface ButtonBlockProps {
	block: Block;
}

export function ButtonBlock({ block }: ButtonBlockProps) {
	const { layout } = useBuilder();
	const { colors } = layout.globalStyles;

	const content = block.content as ButtonBlockType["content"];
	const settings = block.settings as ButtonBlockType["settings"];

	const getAlignmentClass = () => {
		switch (settings.alignment) {
			case "left":
				return "justify-start";
			case "right":
				return "justify-end";
			default:
				return "justify-center";
		}
	};

	const getSizeClass = () => {
		switch (settings.size) {
			case "small":
				return "px-4 py-2 text-sm";
			case "large":
				return "px-8 py-4 text-lg";
			default:
				return "px-6 py-3";
		}
	};

	const getVariantStyles = (): React.CSSProperties => {
		switch (settings.variant) {
			case "secondary":
				return {
					backgroundColor: colors.secondary,
					color: "#FFFFFF",
					border: "none",
				};
			case "outline":
				return {
					backgroundColor: "transparent",
					color: colors.primary,
					border: `2px solid ${colors.primary}`,
				};
			case "ghost":
				return {
					backgroundColor: "transparent",
					color: colors.primary,
					border: "none",
				};
			default:
				return {
					backgroundColor: colors.primary,
					color: "#FFFFFF",
					border: "none",
				};
		}
	};

	return (
		<div className={cn("flex", getAlignmentClass())}>
			<button
				className={cn(
					"inline-flex items-center justify-center rounded-lg font-medium transition-opacity hover:opacity-90",
					getSizeClass(),
					settings.fullWidth && "w-full",
				)}
				style={getVariantStyles()}
				onClick={(e) => e.preventDefault()}
			>
				{settings.icon && settings.iconPosition === "left" && (
					<span className="mr-2">{settings.icon}</span>
				)}
				<span contentEditable suppressContentEditableWarning>
					{content.text}
				</span>
				{settings.icon && settings.iconPosition === "right" && (
					<span className="ml-2">{settings.icon}</span>
				)}
			</button>
		</div>
	);
}

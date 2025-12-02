import { cn } from "../../../lib/utils";
import type {
	Block,
	DividerBlock as DividerBlockType,
} from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface DividerBlockProps {
	block: Block;
}

export function DividerBlock({ block }: DividerBlockProps) {
	const { layout } = useBuilder();
	const { colors } = layout.globalStyles;

	const settings = block.settings as DividerBlockType["settings"];

	const getWidthClass = () => {
		switch (settings.width) {
			case "short":
				return "w-1/4";
			case "full":
				return "w-full";
			default:
				return "w-1/2";
		}
	};

	const getThicknessClass = () => {
		switch (settings.thickness) {
			case "medium":
				return "border-t-2";
			case "thick":
				return "border-t-4";
			default:
				return "border-t";
		}
	};

	const getStyleClass = () => {
		switch (settings.style) {
			case "dashed":
				return "border-dashed";
			case "dotted":
				return "border-dotted";
			case "gradient":
				return "";
			default:
				return "border-solid";
		}
	};

	if (settings.style === "gradient") {
		return (
			<div className="flex justify-center py-4">
				<div
					className={cn("h-1 rounded-full", getWidthClass())}
					style={{
						background: `linear-gradient(to right, transparent, ${settings.color || colors.primary}, transparent)`,
					}}
				/>
			</div>
		);
	}

	return (
		<div className="flex justify-center py-4">
			<hr
				className={cn(
					"mx-auto",
					getWidthClass(),
					getThicknessClass(),
					getStyleClass(),
				)}
				style={{ borderColor: settings.color || colors.muted }}
			/>
		</div>
	);
}

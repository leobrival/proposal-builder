import { cn } from "../../../lib/utils";
import type {
	Block,
	ImageBlock as ImageBlockType,
} from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface ImageBlockProps {
	block: Block;
}

export function ImageBlock({ block }: ImageBlockProps) {
	const { layout } = useBuilder();
	const { colors } = layout.globalStyles;

	const content = block.content as ImageBlockType["content"];
	const settings = block.settings as ImageBlockType["settings"];

	const getAlignmentClass = () => {
		switch (settings.alignment) {
			case "left":
				return "mr-auto";
			case "right":
				return "ml-auto";
			default:
				return "mx-auto";
		}
	};

	const getWidthStyle = (): React.CSSProperties => {
		switch (settings.width) {
			case "auto":
				return { width: "auto" };
			case "fixed":
				return {
					width: settings.fixedWidth ? `${settings.fixedWidth}px` : "auto",
				};
			default:
				return { width: "100%" };
		}
	};

	const getBorderRadiusClass = () => {
		switch (settings.borderRadius) {
			case "none":
				return "rounded-none";
			case "small":
				return "rounded";
			case "large":
				return "rounded-xl";
			case "full":
				return "rounded-full";
			default:
				return "rounded-lg";
		}
	};

	const getShadowClass = () => {
		switch (settings.shadow) {
			case "none":
				return "";
			case "small":
				return "shadow";
			case "large":
				return "shadow-xl";
			default:
				return "shadow-md";
		}
	};

	if (!content.src) {
		return (
			<div
				className={cn(
					"aspect-video flex items-center justify-center bg-muted",
					getAlignmentClass(),
					getBorderRadiusClass(),
				)}
				style={getWidthStyle()}
			>
				<div className="text-center text-muted-foreground">
					<svg
						className="w-12 h-12 mx-auto mb-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1}
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<p className="text-sm">Cliquez pour ajouter une image</p>
				</div>
			</div>
		);
	}

	return (
		<figure className={getAlignmentClass()} style={getWidthStyle()}>
			<img
				src={content.src}
				alt={content.alt}
				className={cn(
					"w-full h-auto object-cover",
					getBorderRadiusClass(),
					getShadowClass(),
				)}
			/>
			{content.caption && (
				<figcaption
					className="mt-2 text-sm text-center"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					{content.caption}
				</figcaption>
			)}
		</figure>
	);
}

import type { Block } from "../../../types/builder";
import { ButtonBlock } from "./ButtonBlock";
import { DividerBlock } from "./DividerBlock";
import { HeadingBlock } from "./HeadingBlock";
import { ImageBlock } from "./ImageBlock";
import { SpacerBlock } from "./SpacerBlock";
import { TextBlock } from "./TextBlock";

interface BlockRendererProps {
	block: Block;
	sectionId: string;
}

export function BlockRenderer({ block, sectionId }: BlockRendererProps) {
	// Apply block custom CSS
	const renderWithCss = (content: React.ReactNode) => (
		<>
			{content}
			{block.customCss && (
				<style>{`#${block.elementId} { ${block.customCss} }`}</style>
			)}
		</>
	);

	switch (block.type) {
		case "heading":
			return renderWithCss(<HeadingBlock block={block} />);
		case "text":
			return renderWithCss(<TextBlock block={block} />);
		case "image":
			return renderWithCss(<ImageBlock block={block} />);
		case "button":
			return renderWithCss(<ButtonBlock block={block} />);
		case "divider":
			return renderWithCss(<DividerBlock block={block} />);
		case "spacer":
			return renderWithCss(<SpacerBlock block={block} />);
		// Placeholder for other blocks
		case "video":
		case "icon-list":
		case "stats":
		case "quote":
		case "embed":
		case "html":
			return renderWithCss(<PlaceholderBlock block={block} />);
		default:
			return renderWithCss(<PlaceholderBlock block={block} />);
	}
}

// Placeholder component for blocks not yet implemented
function PlaceholderBlock({ block }: { block: Block }) {
	return (
		<div className="py-4 px-4 bg-muted/30 border border-dashed border-border rounded text-center">
			<span className="text-sm text-muted-foreground">Bloc: {block.type}</span>
		</div>
	);
}

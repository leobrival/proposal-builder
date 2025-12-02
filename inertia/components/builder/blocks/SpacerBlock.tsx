import { cn } from "../../../lib/utils";
import type {
	Block,
	SpacerBlock as SpacerBlockType,
} from "../../../types/builder";

interface SpacerBlockProps {
	block: Block;
}

export function SpacerBlock({ block }: SpacerBlockProps) {
	const settings = block.settings as SpacerBlockType["settings"];

	const getHeightClass = () => {
		if (settings.customHeight) {
			return "";
		}
		switch (settings.height) {
			case "small":
				return "h-4";
			case "large":
				return "h-16";
			case "xlarge":
				return "h-24";
			default:
				return "h-8";
		}
	};

	const getHeightStyle = (): React.CSSProperties => {
		if (settings.customHeight) {
			return { height: `${settings.customHeight}px` };
		}
		return {};
	};

	return (
		<div className={cn("w-full", getHeightClass())} style={getHeightStyle()} />
	);
}

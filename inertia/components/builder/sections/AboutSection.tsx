import { cn } from "../../../lib/utils";
import type { AboutSettings, Section } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface AboutSectionProps {
	section: Section;
}

export function AboutSection({ section }: AboutSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as AboutSettings;
	const { colors, typography } = layout.globalStyles;

	const getLayoutClass = () => {
		switch (settings.layout) {
			case "text-image":
				return "grid md:grid-cols-2 gap-8 items-center";
			case "image-text":
				return "grid md:grid-cols-2 gap-8 items-center";
			default:
				return "max-w-3xl mx-auto";
		}
	};

	const renderImage = () => {
		if (!settings.imageUrl && settings.layout === "text-only") return null;

		return (
			<div
				className={cn(
					"aspect-video rounded-lg overflow-hidden bg-muted",
					settings.layout === "image-text" && "md:order-first",
				)}
			>
				{settings.imageUrl ? (
					<img
						src={settings.imageUrl}
						alt="About"
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-muted-foreground">
						<svg
							className="w-16 h-16"
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
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="py-12">
			<div className={getLayoutClass()}>
				{/* Text content */}
				<div className="space-y-4">
					{settings.showTitle !== false && (
						<h2
							className="text-3xl font-bold"
							style={{
								fontFamily: typography.headingFont,
								color: colors.primary,
							}}
							contentEditable
							suppressContentEditableWarning
						>
							{settings.title || "A propos"}
						</h2>
					)}

					<div className="prose prose-lg" style={{ color: colors.text }}>
						<p contentEditable suppressContentEditableWarning>
							Decrivez votre projet ou evenement ici. Expliquez ce qui le rend
							unique, son histoire, ses objectifs et pourquoi les sponsors
							devraient s'y interesser.
						</p>
						<p contentEditable suppressContentEditableWarning>
							Ajoutez des details sur votre audience, votre portee et l'impact
							que les sponsors peuvent attendre de leur participation.
						</p>
					</div>
				</div>

				{/* Image */}
				{settings.layout !== "text-only" && renderImage()}
			</div>
		</div>
	);
}

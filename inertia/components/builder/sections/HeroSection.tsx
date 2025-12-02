import { cn } from "../../../lib/utils";
import type { HeroSettings, Section } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface HeroSectionProps {
	section: Section;
}

export function HeroSection({ section }: HeroSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as HeroSettings;
	const { colors, typography } = layout.globalStyles;

	// Build background style based on variant
	const getBackgroundStyle = (): React.CSSProperties => {
		switch (settings.variant) {
			case "image":
				return {
					backgroundImage: settings.backgroundImage
						? `url(${settings.backgroundImage})`
						: undefined,
					backgroundSize: "cover",
					backgroundPosition: "center",
				};
			case "video":
				return {};
			case "gradient": {
				const direction = (settings.gradientDirection || "to-bottom-right")
					.replace("to-", "to ")
					.replace("-", " ");
				return {
					background: `linear-gradient(${direction}, ${settings.gradientFrom || colors.primary}, ${settings.gradientTo || colors.secondary})`,
				};
			}
			case "minimal":
			default:
				return {
					backgroundColor: colors.background,
				};
		}
	};

	const getAlignmentClass = () => {
		switch (settings.alignment) {
			case "left":
				return "text-left items-start";
			case "right":
				return "text-right items-end";
			default:
				return "text-center items-center";
		}
	};

	return (
		<div
			className="relative min-h-[400px] py-20 px-6 rounded-lg overflow-hidden"
			style={getBackgroundStyle()}
		>
			{/* Overlay for image/video backgrounds */}
			{(settings.variant === "image" || settings.variant === "video") && (
				<div
					className="absolute inset-0 bg-black"
					style={{ opacity: (settings.overlayOpacity || 40) / 100 }}
				/>
			)}

			{/* Video background */}
			{settings.variant === "video" && settings.backgroundVideo && (
				<video
					className="absolute inset-0 w-full h-full object-cover"
					src={settings.backgroundVideo}
					autoPlay
					muted
					loop
					playsInline
				/>
			)}

			{/* Content */}
			<div
				className={cn(
					"relative z-10 flex flex-col gap-6 max-w-3xl mx-auto",
					getAlignmentClass(),
				)}
			>
				{/* Title - editable placeholder */}
				<h1
					className="text-4xl md:text-5xl lg:text-6xl font-bold"
					style={{
						fontFamily: typography.headingFont,
						color: settings.variant === "minimal" ? colors.text : "#FFFFFF",
					}}
					contentEditable
					suppressContentEditableWarning
				>
					Titre de votre evenement
				</h1>

				{/* Subtitle */}
				<p
					className="text-lg md:text-xl max-w-2xl"
					style={{
						color:
							settings.variant === "minimal"
								? colors.muted
								: "rgba(255, 255, 255, 0.9)",
					}}
					contentEditable
					suppressContentEditableWarning
				>
					Une description courte et accrocheuse de votre evenement qui donne
					envie d'en savoir plus.
				</p>

				{/* Date and location */}
				<div
					className="flex flex-wrap gap-4 text-sm"
					style={{
						color:
							settings.variant === "minimal"
								? colors.muted
								: "rgba(255, 255, 255, 0.8)",
					}}
				>
					{settings.showDate !== false && (
						<span className="flex items-center gap-2">
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<span contentEditable suppressContentEditableWarning>
								15 Janvier 2025
							</span>
						</span>
					)}
					{settings.showLocation !== false && (
						<span className="flex items-center gap-2">
							<svg
								className="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							<span contentEditable suppressContentEditableWarning>
								Paris, France
							</span>
						</span>
					)}
				</div>

				{/* CTA Button */}
				{settings.showCta !== false && (
					<button
						className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors mt-4"
						style={{
							backgroundColor:
								settings.variant === "minimal" ? colors.primary : "#FFFFFF",
							color:
								settings.variant === "minimal" ? "#FFFFFF" : colors.primary,
						}}
					>
						{settings.ctaText || "En savoir plus"}
					</button>
				)}
			</div>
		</div>
	);
}

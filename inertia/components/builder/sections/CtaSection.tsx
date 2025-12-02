import { ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { CtaSettings, Section } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface CtaSectionProps {
	section: Section;
}

export function CtaSection({ section }: CtaSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as CtaSettings;
	const { colors, typography } = layout.globalStyles;

	const getBackgroundStyle = (): React.CSSProperties => {
		if (settings.backgroundImage) {
			return {
				backgroundImage: `url(${settings.backgroundImage})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			};
		}
		if (settings.backgroundColor) {
			return { backgroundColor: settings.backgroundColor };
		}
		return {
			background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
		};
	};

	const isLight = settings.backgroundColor
		? settings.backgroundColor.toLowerCase() === "#ffffff" ||
			settings.backgroundColor.toLowerCase() === "white"
		: false;

	const textColor = isLight ? colors.text : "#FFFFFF";
	const mutedColor = isLight ? colors.muted : "rgba(255, 255, 255, 0.8)";

	if (settings.variant === "split") {
		return (
			<div
				className="py-12 rounded-xl overflow-hidden"
				style={getBackgroundStyle()}
			>
				<div className="flex flex-col md:flex-row items-center justify-between gap-8 px-8 md:px-12">
					<div className="flex-1">
						<h2
							className="text-2xl md:text-3xl font-bold mb-3"
							style={{
								fontFamily: typography.headingFont,
								color: textColor,
							}}
							contentEditable
							suppressContentEditableWarning
						>
							{settings.title || "Pret a devenir sponsor ?"}
						</h2>
						{settings.subtitle && (
							<p
								className="text-lg"
								style={{ color: mutedColor }}
								contentEditable
								suppressContentEditableWarning
							>
								{settings.subtitle}
							</p>
						)}
					</div>
					<div className="flex flex-col sm:flex-row gap-4">
						<a
							href={settings.buttonLink || "#contact"}
							className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors"
							style={{
								backgroundColor: isLight ? colors.primary : "#FFFFFF",
								color: isLight ? "#FFFFFF" : colors.primary,
							}}
						>
							{settings.buttonText || "Nous contacter"}
							<ArrowRight className="w-4 h-4 ml-2" />
						</a>
						{settings.secondaryButtonText && (
							<a
								href={settings.secondaryButtonLink || "#"}
								className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors border-2"
								style={{
									borderColor: isLight ? colors.primary : "#FFFFFF",
									color: isLight ? colors.primary : "#FFFFFF",
									backgroundColor: "transparent",
								}}
							>
								{settings.secondaryButtonText}
							</a>
						)}
					</div>
				</div>
			</div>
		);
	}

	if (settings.variant === "banner") {
		return (
			<div className="py-6 px-8 rounded-xl" style={getBackgroundStyle()}>
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<p
						className="font-semibold text-lg"
						style={{ color: textColor }}
						contentEditable
						suppressContentEditableWarning
					>
						{settings.title || "Rejoignez nos sponsors pour l'edition 2025 !"}
					</p>
					<a
						href={settings.buttonLink || "#contact"}
						className="inline-flex items-center justify-center px-5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
						style={{
							backgroundColor: isLight ? colors.primary : "#FFFFFF",
							color: isLight ? "#FFFFFF" : colors.primary,
						}}
					>
						{settings.buttonText || "En savoir plus"}
					</a>
				</div>
			</div>
		);
	}

	// Default: simple variant
	return (
		<div
			className="py-16 px-8 rounded-xl text-center"
			style={getBackgroundStyle()}
		>
			<div className="max-w-2xl mx-auto">
				<h2
					className="text-2xl md:text-4xl font-bold mb-4"
					style={{
						fontFamily: typography.headingFont,
						color: textColor,
					}}
					contentEditable
					suppressContentEditableWarning
				>
					{settings.title || "Pret a devenir sponsor ?"}
				</h2>
				{settings.subtitle && (
					<p
						className="text-lg mb-8"
						style={{ color: mutedColor }}
						contentEditable
						suppressContentEditableWarning
					>
						{settings.subtitle ||
							"Rejoignez nos partenaires et beneficiez d'une visibilite exceptionnelle"}
					</p>
				)}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<a
						href={settings.buttonLink || "#contact"}
						className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105"
						style={{
							backgroundColor: isLight ? colors.primary : "#FFFFFF",
							color: isLight ? "#FFFFFF" : colors.primary,
						}}
					>
						{settings.buttonText || "Nous contacter"}
						<ArrowRight className="w-5 h-5 ml-2" />
					</a>
					{settings.secondaryButtonText && (
						<a
							href={settings.secondaryButtonLink || "#"}
							className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2"
							style={{
								borderColor: isLight ? colors.primary : "#FFFFFF",
								color: isLight ? colors.primary : "#FFFFFF",
								backgroundColor: "transparent",
							}}
						>
							{settings.secondaryButtonText}
						</a>
					)}
				</div>
			</div>
		</div>
	);
}

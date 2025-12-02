import { Building2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Section, SponsorsSettings } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface SponsorsSectionProps {
	section: Section;
}

const defaultSponsors = [
	{ id: "1", name: "TechCorp", logoUrl: "", websiteUrl: "#", tier: "gold" },
	{ id: "2", name: "InnoStart", logoUrl: "", websiteUrl: "#", tier: "gold" },
	{ id: "3", name: "BigBrand", logoUrl: "", websiteUrl: "#", tier: "silver" },
	{ id: "4", name: "DataFlow", logoUrl: "", websiteUrl: "#", tier: "silver" },
	{ id: "5", name: "CloudNet", logoUrl: "", websiteUrl: "#", tier: "bronze" },
	{ id: "6", name: "AppWorks", logoUrl: "", websiteUrl: "#", tier: "bronze" },
];

export function SponsorsSection({ section }: SponsorsSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as SponsorsSettings;
	const { colors, typography } = layout.globalStyles;

	const sponsors =
		settings.sponsors?.length > 0 ? settings.sponsors : defaultSponsors;
	const cols = settings.columns || 4;

	const groupedSponsors =
		settings.layout === "tiered"
			? {
					gold: sponsors.filter((s) => s.tier === "gold"),
					silver: sponsors.filter((s) => s.tier === "silver"),
					bronze: sponsors.filter((s) => s.tier === "bronze"),
					other: sponsors.filter(
						(s) => !["gold", "silver", "bronze"].includes(s.tier || ""),
					),
				}
			: null;

	const SponsorLogo = ({
		sponsor,
		size = "normal",
	}: {
		sponsor: (typeof sponsors)[0];
		size?: "large" | "normal" | "small";
	}) => {
		const sizeClasses = {
			large: "h-24 p-6",
			normal: "h-20 p-4",
			small: "h-16 p-3",
		};

		return (
			<a
				href={sponsor.websiteUrl || "#"}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					"flex items-center justify-center rounded-lg transition-all duration-200 hover:shadow-md",
					sizeClasses[size],
					settings.grayscale && "grayscale hover:grayscale-0",
				)}
				style={{
					backgroundColor: colors.muted + "10",
					border: `1px solid ${colors.muted}20`,
				}}
			>
				{sponsor.logoUrl ? (
					<img
						src={sponsor.logoUrl}
						alt={sponsor.name}
						className="max-h-full max-w-full object-contain"
					/>
				) : (
					<div className="flex flex-col items-center gap-1">
						<Building2
							className={cn(
								size === "large"
									? "w-8 h-8"
									: size === "small"
										? "w-5 h-5"
										: "w-6 h-6",
							)}
							style={{ color: colors.muted }}
						/>
						{settings.showNames !== false && (
							<span
								className={cn(
									"font-medium",
									size === "large"
										? "text-sm"
										: size === "small"
											? "text-xs"
											: "text-xs",
								)}
								style={{ color: colors.muted }}
							>
								{sponsor.name}
							</span>
						)}
					</div>
				)}
			</a>
		);
	};

	return (
		<div className="py-12">
			<div className="text-center mb-10">
				<h2
					className="text-2xl md:text-3xl font-bold mb-4"
					style={{
						fontFamily: typography.headingFont,
						color: colors.text,
					}}
					contentEditable
					suppressContentEditableWarning
				>
					Nos sponsors
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Merci a nos partenaires qui rendent cet evenement possible
				</p>
			</div>

			{settings.layout === "tiered" && groupedSponsors ? (
				<div className="space-y-10">
					{groupedSponsors.gold.length > 0 && (
						<div>
							<h3
								className="text-center text-lg font-semibold mb-4"
								style={{ color: "#D4AF37" }}
							>
								Sponsors Gold
							</h3>
							<div className="flex flex-wrap justify-center gap-6">
								{groupedSponsors.gold.map((sponsor) => (
									<SponsorLogo
										key={sponsor.id}
										sponsor={sponsor}
										size="large"
									/>
								))}
							</div>
						</div>
					)}

					{groupedSponsors.silver.length > 0 && (
						<div>
							<h3
								className="text-center text-lg font-semibold mb-4"
								style={{ color: "#C0C0C0" }}
							>
								Sponsors Silver
							</h3>
							<div className="flex flex-wrap justify-center gap-4">
								{groupedSponsors.silver.map((sponsor) => (
									<SponsorLogo
										key={sponsor.id}
										sponsor={sponsor}
										size="normal"
									/>
								))}
							</div>
						</div>
					)}

					{groupedSponsors.bronze.length > 0 && (
						<div>
							<h3
								className="text-center text-lg font-semibold mb-4"
								style={{ color: "#CD7F32" }}
							>
								Sponsors Bronze
							</h3>
							<div className="flex flex-wrap justify-center gap-3">
								{groupedSponsors.bronze.map((sponsor) => (
									<SponsorLogo
										key={sponsor.id}
										sponsor={sponsor}
										size="small"
									/>
								))}
							</div>
						</div>
					)}

					{groupedSponsors.other.length > 0 && (
						<div>
							<h3
								className="text-center text-lg font-semibold mb-4"
								style={{ color: colors.muted }}
							>
								Partenaires
							</h3>
							<div className="flex flex-wrap justify-center gap-3">
								{groupedSponsors.other.map((sponsor) => (
									<SponsorLogo
										key={sponsor.id}
										sponsor={sponsor}
										size="small"
									/>
								))}
							</div>
						</div>
					)}
				</div>
			) : settings.layout === "carousel" ? (
				<div className="overflow-hidden">
					<div className="flex animate-scroll gap-8">
						{[...sponsors, ...sponsors].map((sponsor, index) => (
							<SponsorLogo key={`${sponsor.id}-${index}`} sponsor={sponsor} />
						))}
					</div>
				</div>
			) : (
				<div
					className={`grid grid-cols-2 md:grid-cols-${Math.min(cols, 3)} lg:grid-cols-${cols} gap-4`}
				>
					{sponsors.map((sponsor) => (
						<SponsorLogo key={sponsor.id} sponsor={sponsor} />
					))}
				</div>
			)}
		</div>
	);
}

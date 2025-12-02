import { cn } from "../../../lib/utils";
import type { Section, TiersSettings } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface TiersSectionProps {
	section: Section;
}

export function TiersSection({ section }: TiersSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as TiersSettings;
	const { colors, typography } = layout.globalStyles;

	// Demo tiers for preview
	const demoTiers = [
		{
			id: "1",
			name: "Bronze",
			price: 500,
			description: "Ideal pour les petites entreprises",
			benefits: [
				"Logo sur le site web",
				"Mention sur les reseaux sociaux",
				"2 invitations VIP",
			],
			featured: false,
		},
		{
			id: "2",
			name: "Argent",
			price: 1500,
			description: "Pour une visibilite accrue",
			benefits: [
				"Tout le pack Bronze",
				"Stand d'exposition",
				"Logo sur les supports imprimes",
				"5 invitations VIP",
			],
			featured: true,
		},
		{
			id: "3",
			name: "Or",
			price: 3000,
			description: "Partenariat premium",
			benefits: [
				"Tout le pack Argent",
				"Prise de parole",
				"Article dedie",
				"Logo en premiere position",
				"10 invitations VIP",
			],
			featured: false,
		},
	];

	const getColumnsClass = () => {
		switch (settings.columns) {
			case 1:
				return "grid-cols-1 max-w-md mx-auto";
			case 2:
				return "grid-cols-1 md:grid-cols-2";
			case 4:
				return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
			default:
				return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
		}
	};

	return (
		<div className="py-12">
			{/* Section title */}
			<div className="text-center mb-10">
				<h2
					className="text-3xl font-bold mb-3"
					style={{
						fontFamily: typography.headingFont,
						color: colors.primary,
					}}
					contentEditable
					suppressContentEditableWarning
				>
					Nos offres de sponsoring
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Choisissez le niveau de partenariat qui correspond a vos objectifs
				</p>
			</div>

			{/* Tiers grid */}
			<div className={cn("grid gap-6", getColumnsClass())}>
				{demoTiers.map((tier) => (
					<div
						key={tier.id}
						className={cn(
							"relative rounded-xl border p-6 transition-all",
							tier.featured && settings.highlightFeatured
								? "border-primary shadow-lg scale-105"
								: "border-border hover:border-primary/50",
						)}
						style={{
							backgroundColor: colors.background,
						}}
					>
						{/* Featured badge */}
						{tier.featured && settings.highlightFeatured && (
							<div
								className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full text-white"
								style={{ backgroundColor: colors.primary }}
							>
								Populaire
							</div>
						)}

						{/* Tier name */}
						<h3
							className="text-xl font-bold mb-2"
							style={{
								fontFamily: typography.headingFont,
								color: colors.text,
							}}
						>
							{tier.name}
						</h3>

						{/* Price */}
						{settings.showPrices !== false && (
							<div className="mb-4">
								<span
									className="text-3xl font-bold"
									style={{ color: colors.primary }}
								>
									{tier.price.toLocaleString("fr-FR")} €
								</span>
							</div>
						)}

						{/* Description */}
						<p className="text-sm mb-6" style={{ color: colors.muted }}>
							{tier.description}
						</p>

						{/* Benefits */}
						{settings.showBenefits !== false && (
							<ul className="space-y-3 mb-6">
								{tier.benefits.map((benefit, index) => (
									<li
										key={index}
										className="flex items-start gap-2 text-sm"
										style={{ color: colors.text }}
									>
										<svg
											className="w-5 h-5 flex-shrink-0 mt-0.5"
											style={{ color: colors.primary }}
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>{benefit}</span>
									</li>
								))}
							</ul>
						)}

						{/* CTA Button */}
						<button
							className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
							style={{
								backgroundColor: tier.featured ? colors.primary : "transparent",
								color: tier.featured ? "#FFFFFF" : colors.primary,
								border: tier.featured ? "none" : `2px solid ${colors.primary}`,
							}}
						>
							{settings.ctaText || "Choisir cette offre"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

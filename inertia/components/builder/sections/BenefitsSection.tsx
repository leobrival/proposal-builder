import { Award, Check, Shield, Star, Target, Zap } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { BenefitsSettings, Section } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface BenefitsSectionProps {
	section: Section;
}

const defaultBenefits = [
	{
		id: "1",
		icon: "Star",
		title: "Visibilite premium",
		description: "Votre logo sur tous nos supports de communication",
	},
	{
		id: "2",
		icon: "Zap",
		title: "Acces VIP",
		description: "Places reservees pour vos invites",
	},
	{
		id: "3",
		icon: "Shield",
		title: "Exclusivite",
		description: "Un seul sponsor par categorie",
	},
	{
		id: "4",
		icon: "Target",
		title: "Networking",
		description: "Acces aux sessions de networking privees",
	},
	{
		id: "5",
		icon: "Award",
		title: "Reconnaissance",
		description: "Mention speciale lors de l'evenement",
	},
	{
		id: "6",
		icon: "Check",
		title: "ROI garanti",
		description: "Rapport detaille post-evenement",
	},
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	Star,
	Zap,
	Shield,
	Target,
	Award,
	Check,
};

export function BenefitsSection({ section }: BenefitsSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as BenefitsSettings;
	const { colors, typography } = layout.globalStyles;

	const getLayoutClass = () => {
		const cols = settings.columns || 3;
		switch (settings.layout) {
			case "list":
				return "flex flex-col gap-4 max-w-2xl mx-auto";
			case "icons":
				return `grid grid-cols-2 md:grid-cols-${cols} gap-8`;
			default:
				return `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6`;
		}
	};

	const getIconStyle = () => {
		switch (settings.iconStyle) {
			case "square":
				return "rounded-lg";
			case "none":
				return "hidden";
			default:
				return "rounded-full";
		}
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
					Pourquoi devenir sponsor ?
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Decouvrez les avantages exclusifs reserves a nos partenaires
				</p>
			</div>

			<div className={getLayoutClass()}>
				{defaultBenefits.map((benefit) => {
					const IconComponent = iconMap[benefit.icon] || Check;

					return (
						<div
							key={benefit.id}
							className={cn(
								"flex gap-4",
								settings.layout === "icons" &&
									"flex-col items-center text-center",
								settings.layout === "list" && "items-start",
								settings.layout === "grid" && "flex-col",
							)}
						>
							{settings.showIcons !== false && (
								<div
									className={cn(
										"flex items-center justify-center w-12 h-12 shrink-0",
										getIconStyle(),
									)}
									style={{ backgroundColor: colors.primary + "15" }}
								>
									<IconComponent
										className="w-6 h-6"
										style={{ color: colors.primary }}
									/>
								</div>
							)}
							<div>
								<h3
									className="font-semibold mb-1"
									style={{ color: colors.text }}
									contentEditable
									suppressContentEditableWarning
								>
									{benefit.title}
								</h3>
								<p
									className="text-sm"
									style={{ color: colors.muted }}
									contentEditable
									suppressContentEditableWarning
								>
									{benefit.description}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

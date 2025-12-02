import {
	Award,
	Clock,
	Coffee,
	Mic,
	Music,
	PartyPopper,
	Users,
	Utensils,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import type { Section, TimelineSettings } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface TimelineSectionProps {
	section: Section;
}

const defaultEvents = [
	{
		id: "1",
		time: "18:00",
		title: "Accueil & Enregistrement",
		description: "Accueil des participants et remise des badges",
		icon: "Coffee",
	},
	{
		id: "2",
		time: "18:30",
		title: "Discours d'ouverture",
		description: "Mot de bienvenue par les organisateurs",
		icon: "Mic",
	},
	{
		id: "3",
		time: "19:00",
		title: "Conference principale",
		description: "Presentation par notre invite d'honneur",
		icon: "Users",
	},
	{
		id: "4",
		time: "20:00",
		title: "Session networking",
		description: "Echanges entre participants et sponsors",
		icon: "Users",
	},
	{
		id: "5",
		time: "20:30",
		title: "Cocktail dinatoire",
		description: "Buffet et animations",
		icon: "Utensils",
	},
	{
		id: "6",
		time: "22:00",
		title: "Remise des prix",
		description: "Ceremonie de cloture et tirage au sort",
		icon: "Award",
	},
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	Clock,
	Coffee,
	Users,
	Mic,
	Award,
	Music,
	Utensils,
	PartyPopper,
};

export function TimelineSection({ section }: TimelineSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as TimelineSettings;
	const { colors, typography } = layout.globalStyles;

	const events = settings.events?.length > 0 ? settings.events : defaultEvents;

	const TimelineItem = ({
		event,
		index,
		isLast,
	}: {
		event: (typeof events)[0];
		index: number;
		isLast: boolean;
	}) => {
		const IconComponent = iconMap[event.icon || "Clock"] || Clock;
		const isAlternate = settings.layout === "alternating" && index % 2 === 1;

		return (
			<div
				className={cn(
					"flex gap-4",
					settings.layout === "horizontal" &&
						"flex-col items-center text-center",
					settings.layout === "alternating" && "relative",
					isAlternate && "flex-row-reverse",
				)}
			>
				{/* Time & Icon */}
				<div
					className={cn(
						"flex items-center gap-3",
						settings.layout === "horizontal" && "flex-col",
						settings.layout === "alternating" &&
							"absolute left-1/2 -translate-x-1/2 flex-col",
					)}
				>
					{settings.showDates !== false && (event.time || event.date) && (
						<span
							className="text-sm font-semibold whitespace-nowrap"
							style={{ color: colors.primary }}
						>
							{event.time || event.date}
						</span>
					)}

					{settings.showIcons !== false && (
						<div
							className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10"
							style={{ backgroundColor: colors.primary }}
						>
							<IconComponent className="w-5 h-5 text-white" />
						</div>
					)}
				</div>

				{/* Line connector */}
				{settings.layout === "vertical" && !isLast && (
					<div
						className="absolute left-5 top-10 w-0.5 h-full -translate-x-1/2"
						style={{ backgroundColor: colors.muted + "30" }}
					/>
				)}

				{/* Content */}
				<div
					className={cn(
						"flex-1 pb-8",
						settings.layout === "horizontal" && "pb-0",
						settings.layout === "alternating" &&
							(isAlternate ? "text-right pr-[60%]" : "pl-[60%]"),
					)}
				>
					<h3
						className="font-semibold text-lg mb-1"
						style={{ color: colors.text }}
						contentEditable
						suppressContentEditableWarning
					>
						{event.title}
					</h3>
					{event.description && (
						<p
							className="text-sm"
							style={{ color: colors.muted }}
							contentEditable
							suppressContentEditableWarning
						>
							{event.description}
						</p>
					)}
				</div>
			</div>
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
					Programme de la soiree
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Decouvrez le deroulement de l'evenement
				</p>
			</div>

			<div
				className={cn(
					"relative",
					settings.layout === "horizontal" && "flex overflow-x-auto gap-8 pb-4",
					settings.layout === "vertical" && "max-w-2xl mx-auto",
					settings.layout === "alternating" && "max-w-4xl mx-auto",
				)}
			>
				{/* Center line for alternating layout */}
				{settings.layout === "alternating" && (
					<div
						className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
						style={{ backgroundColor: colors.muted + "30" }}
					/>
				)}

				{events.map((event, index) => (
					<div
						key={event.id}
						className={cn(
							settings.layout === "horizontal" && "shrink-0 w-48",
							settings.layout === "vertical" && "relative pl-14",
						)}
					>
						<TimelineItem
							event={event}
							index={index}
							isLast={index === events.length - 1}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

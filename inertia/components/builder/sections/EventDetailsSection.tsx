import { Building, Calendar, Clock, MapPin, User } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { EventDetailsSettings, Section } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface EventDetailsSectionProps {
	section: Section;
}

export function EventDetailsSection({ section }: EventDetailsSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as EventDetailsSettings;
	const { colors, typography } = layout.globalStyles;

	const detailItems = [
		{
			key: "date",
			show: settings.showDate !== false,
			icon: Calendar,
			label: "Date",
			value: "15 Janvier 2025",
		},
		{
			key: "time",
			show: settings.showTime !== false,
			icon: Clock,
			label: "Horaire",
			value: "18h00 - 22h00",
		},
		{
			key: "location",
			show: settings.showLocation !== false,
			icon: MapPin,
			label: "Lieu",
			value: "Paris, France",
		},
		{
			key: "organizer",
			show: settings.showOrganizer !== false,
			icon: Building,
			label: "Organisateur",
			value: "Votre Organisation",
		},
	].filter((item) => item.show);

	const getLayoutClass = () => {
		switch (settings.layout) {
			case "horizontal":
				return "flex flex-wrap justify-center gap-8";
			case "cards":
				return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
			default:
				return "flex flex-col gap-4 max-w-md mx-auto";
		}
	};

	return (
		<div className="py-12">
			<h2
				className="text-2xl md:text-3xl font-bold text-center mb-8"
				style={{
					fontFamily: typography.headingFont,
					color: colors.text,
				}}
				contentEditable
				suppressContentEditableWarning
			>
				Details de l'evenement
			</h2>

			<div className={getLayoutClass()}>
				{detailItems.map((item) => (
					<div
						key={item.key}
						className={cn(
							"flex items-center gap-4",
							settings.layout === "cards" &&
								"flex-col text-center p-6 rounded-lg border",
							settings.layout === "vertical" && "py-2",
						)}
						style={{
							borderColor:
								settings.layout === "cards" ? colors.muted + "30" : undefined,
							backgroundColor:
								settings.layout === "cards" ? colors.background : undefined,
						}}
					>
						<div
							className={cn(
								"flex items-center justify-center rounded-full",
								settings.layout === "cards" ? "w-14 h-14" : "w-10 h-10",
							)}
							style={{ backgroundColor: colors.primary + "15" }}
						>
							<item.icon
								className={cn(
									settings.layout === "cards" ? "w-6 h-6" : "w-5 h-5",
								)}
								style={{ color: colors.primary }}
							/>
						</div>
						<div
							className={cn(
								settings.layout === "cards" ? "text-center" : "text-left",
							)}
						>
							<div
								className="text-sm font-medium"
								style={{ color: colors.muted }}
							>
								{item.label}
							</div>
							<div
								className="font-semibold"
								style={{ color: colors.text }}
								contentEditable
								suppressContentEditableWarning
							>
								{item.value}
							</div>
						</div>
					</div>
				))}
			</div>

			{settings.showMap && (
				<div
					className="mt-8 h-64 rounded-lg overflow-hidden"
					style={{ backgroundColor: colors.muted + "20" }}
				>
					<div className="w-full h-full flex items-center justify-center">
						<div className="text-center">
							<MapPin
								className="w-8 h-8 mx-auto mb-2"
								style={{ color: colors.muted }}
							/>
							<p style={{ color: colors.muted }}>
								Carte interactive (integrez Google Maps)
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

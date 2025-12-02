"use client";

import { Apple, Monitor } from "lucide-react";
import { DataCard, type DataCardColumn } from "./data-card";

interface OperatingSystem {
	id: string;
	name: string;
	icon: string;
	sessions: number;
	percentage: number;
}

interface OSCardProps {
	operatingSystems?: OperatingSystem[];
}

// Mock data
const mockOS: OperatingSystem[] = [
	{
		id: "1",
		name: "Windows",
		icon: "windows",
		sessions: 3245,
		percentage: 41.8,
	},
	{ id: "2", name: "macOS", icon: "macos", sessions: 2156, percentage: 27.8 },
	{ id: "3", name: "iOS", icon: "ios", sessions: 1234, percentage: 15.9 },
	{
		id: "4",
		name: "Android",
		icon: "android",
		sessions: 876,
		percentage: 11.3,
	},
	{ id: "5", name: "Linux", icon: "linux", sessions: 198, percentage: 2.5 },
	{ id: "6", name: "Other", icon: "other", sessions: 55, percentage: 0.7 },
];

const getOSIcon = (icon: string) => {
	switch (icon) {
		case "macos":
		case "ios":
			return <Apple className="h-4 w-4 text-muted-foreground" />;
		default:
			return <Monitor className="h-4 w-4 text-muted-foreground" />;
	}
};

const getOSColor = (name: string) => {
	switch (name.toLowerCase()) {
		case "windows":
			return "bg-blue-500";
		case "macos":
			return "bg-gray-700";
		case "ios":
			return "bg-gray-500";
		case "android":
			return "bg-green-500";
		case "linux":
			return "bg-orange-500";
		default:
			return "bg-gray-400";
	}
};

const formatNumber = (num: number) => {
	return new Intl.NumberFormat("fr-FR").format(num);
};

const columns: DataCardColumn<OperatingSystem>[] = [
	{
		key: "name",
		header: "OS",
		render: (os) => (
			<span className="flex items-center gap-2 font-medium">
				{getOSIcon(os.icon)}
				{os.name}
			</span>
		),
	},
	{
		key: "sessions",
		header: "Sessions",
		render: (os) => (
			<span className="text-muted-foreground">{formatNumber(os.sessions)}</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (os) => <span className="font-medium">{os.percentage}%</span>,
		className: "text-right",
	},
];

const modalColumns: DataCardColumn<OperatingSystem>[] = [
	...columns,
	{
		key: "bar",
		header: "Distribution",
		render: (os) => (
			<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full ${getOSColor(os.name)}`}
					style={{ width: `${os.percentage}%` }}
				/>
			</div>
		),
	},
];

export function OSCard({ operatingSystems = mockOS }: OSCardProps) {
	const totalSessions = operatingSystems.reduce(
		(sum, os) => sum + os.sessions,
		0,
	);
	const displayedOS = operatingSystems.slice(0, 5);

	return (
		<DataCard
			id="operating-systems"
			title="Operating Systems"
			count={totalSessions}
			data={displayedOS}
			keyExtractor={(os) => os.id}
			columns={columns}
			modalColumns={modalColumns}
			modalTitle="OS Analytics"
			exportFilename="os-export.csv"
			exportHeaders={["OS", "Sessions", "Pourcentage"]}
			exportRow={(os) => [os.name, os.sessions.toString(), `${os.percentage}%`]}
			rowTooltip="Filtrer par OS"
			viewAllTooltip="Voir tous les OS"
			moreOptionsTooltip="Plus d'options"
			emptyMessage="Aucune donnée disponible"
			filterKey="os"
			getFilterValue={(os) => os.name.toLowerCase()}
		/>
	);
}

"use client";

import { Chrome, Globe } from "lucide-react";
import { DataCard, type DataCardColumn } from "./data-card";

interface Browser {
	id: string;
	name: string;
	icon: string;
	sessions: number;
	percentage: number;
}

interface BrowsersCardProps {
	browsers?: Browser[];
}

// Mock data
const mockBrowsers: Browser[] = [
	{ id: "1", name: "Chrome", icon: "chrome", sessions: 4892, percentage: 63.0 },
	{ id: "2", name: "Safari", icon: "safari", sessions: 1789, percentage: 23.0 },
	{ id: "3", name: "Firefox", icon: "firefox", sessions: 621, percentage: 8.0 },
	{ id: "4", name: "Edge", icon: "edge", sessions: 388, percentage: 5.0 },
	{ id: "5", name: "Other", icon: "other", sessions: 74, percentage: 1.0 },
];

const getBrowserIcon = (icon: string) => {
	// Using Chrome icon for Chrome, Globe for others as lucide doesn't have all browser icons
	if (icon === "chrome") {
		return <Chrome className="h-4 w-4 text-muted-foreground" />;
	}
	return <Globe className="h-4 w-4 text-muted-foreground" />;
};

const getBrowserColor = (name: string) => {
	switch (name.toLowerCase()) {
		case "chrome":
			return "bg-green-500";
		case "safari":
			return "bg-blue-500";
		case "firefox":
			return "bg-orange-500";
		case "edge":
			return "bg-cyan-500";
		default:
			return "bg-gray-500";
	}
};

const formatNumber = (num: number) => {
	return new Intl.NumberFormat("fr-FR").format(num);
};

const columns: DataCardColumn<Browser>[] = [
	{
		key: "name",
		header: "Browser",
		render: (browser) => (
			<span className="flex items-center gap-2 font-medium">
				{getBrowserIcon(browser.icon)}
				{browser.name}
			</span>
		),
	},
	{
		key: "sessions",
		header: "Sessions",
		render: (browser) => (
			<span className="text-muted-foreground">
				{formatNumber(browser.sessions)}
			</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (browser) => (
			<span className="font-medium">{browser.percentage}%</span>
		),
		className: "text-right",
	},
];

const modalColumns: DataCardColumn<Browser>[] = [
	...columns,
	{
		key: "bar",
		header: "Distribution",
		render: (browser) => (
			<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full ${getBrowserColor(browser.name)}`}
					style={{ width: `${browser.percentage}%` }}
				/>
			</div>
		),
	},
];

export function BrowsersCard({ browsers = mockBrowsers }: BrowsersCardProps) {
	const totalSessions = browsers.reduce((sum, b) => sum + b.sessions, 0);

	return (
		<DataCard
			title="Browsers"
			count={totalSessions}
			data={browsers}
			keyExtractor={(browser) => browser.id}
			columns={columns}
			modalColumns={modalColumns}
			modalTitle="Browser Analytics"
			exportFilename="browsers-export.csv"
			exportHeaders={["Browser", "Sessions", "Percentage"]}
			exportRow={(browser) => [
				browser.name,
				browser.sessions.toString(),
				`${browser.percentage}%`,
			]}
			rowTooltip="Filtrer par navigateur"
			viewAllTooltip="Voir tous les navigateurs"
			moreOptionsTooltip="Plus d'options"
			emptyMessage="Aucune donnée disponible"
			filterKey="browser"
			getFilterValue={(browser) => browser.name.toLowerCase()}
		/>
	);
}

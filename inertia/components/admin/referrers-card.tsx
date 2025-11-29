"use client";

import { ExternalLink, Globe, Search, Share2 } from "lucide-react";
import { DataCard, type DataCardColumn } from "./data-card";

interface Referrer {
	id: string;
	source: string;
	type: "direct" | "search" | "social" | "referral";
	sessions: number;
	percentage: number;
}

interface ReferrersCardProps {
	referrers?: Referrer[];
}

// Mock data
const mockReferrers: Referrer[] = [
	{ id: "1", source: "Direct", type: "direct", sessions: 2845, percentage: 36.6 },
	{ id: "2", source: "Google", type: "search", sessions: 2156, percentage: 27.8 },
	{ id: "3", source: "Twitter/X", type: "social", sessions: 1023, percentage: 13.2 },
	{ id: "4", source: "LinkedIn", type: "social", sessions: 756, percentage: 9.7 },
	{ id: "5", source: "ProductHunt", type: "referral", sessions: 534, percentage: 6.9 },
	{ id: "6", source: "Facebook", type: "social", sessions: 298, percentage: 3.8 },
	{ id: "7", source: "Other", type: "referral", sessions: 152, percentage: 2.0 },
];

const getReferrerIcon = (type: Referrer["type"]) => {
	switch (type) {
		case "direct":
			return <Globe className="h-4 w-4 text-muted-foreground" />;
		case "search":
			return <Search className="h-4 w-4 text-muted-foreground" />;
		case "social":
			return <Share2 className="h-4 w-4 text-muted-foreground" />;
		case "referral":
			return <ExternalLink className="h-4 w-4 text-muted-foreground" />;
	}
};

const getReferrerColor = (source: string) => {
	switch (source.toLowerCase()) {
		case "direct":
			return "bg-gray-500";
		case "google":
			return "bg-blue-500";
		case "twitter/x":
			return "bg-black";
		case "linkedin":
			return "bg-blue-700";
		case "producthunt":
			return "bg-orange-500";
		case "facebook":
			return "bg-blue-600";
		default:
			return "bg-gray-400";
	}
};

const formatNumber = (num: number) => {
	return new Intl.NumberFormat("fr-FR").format(num);
};

const columns: DataCardColumn<Referrer>[] = [
	{
		key: "source",
		header: "Source",
		render: (referrer) => (
			<span className="flex items-center gap-2 font-medium">
				{getReferrerIcon(referrer.type)}
				{referrer.source}
			</span>
		),
	},
	{
		key: "sessions",
		header: "Sessions",
		render: (referrer) => (
			<span className="text-muted-foreground">{formatNumber(referrer.sessions)}</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (referrer) => (
			<span className="font-medium">{referrer.percentage}%</span>
		),
		className: "text-right",
	},
];

const modalColumns: DataCardColumn<Referrer>[] = [
	...columns,
	{
		key: "type",
		header: "Type",
		render: (referrer) => (
			<span className="text-muted-foreground capitalize text-xs">{referrer.type}</span>
		),
	},
	{
		key: "bar",
		header: "Distribution",
		render: (referrer) => (
			<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full ${getReferrerColor(referrer.source)}`}
					style={{ width: `${referrer.percentage}%` }}
				/>
			</div>
		),
	},
];

export function ReferrersCard({ referrers = mockReferrers }: ReferrersCardProps) {
	const totalSessions = referrers.reduce((sum, r) => sum + r.sessions, 0);
	const displayedReferrers = referrers.slice(0, 5);

	return (
		<DataCard
			title="Referrers"
			count={totalSessions}
			data={displayedReferrers}
			keyExtractor={(referrer) => referrer.id}
			columns={columns}
			modalColumns={modalColumns}
			modalTitle="Traffic Sources"
			exportFilename="referrers-export.csv"
			exportHeaders={["Source", "Type", "Sessions", "Pourcentage"]}
			exportRow={(referrer) => [
				referrer.source,
				referrer.type,
				referrer.sessions.toString(),
				`${referrer.percentage}%`,
			]}
			rowTooltip="Filtrer par source"
			viewAllTooltip="Voir toutes les sources"
			moreOptionsTooltip="Plus d'options"
			emptyMessage="Aucune donnée disponible"
			filterKey="referrer"
			getFilterValue={(referrer) => referrer.source.toLowerCase()}
		/>
	);
}

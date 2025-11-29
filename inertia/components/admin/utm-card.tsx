"use client";

import { Tag } from "lucide-react";
import { DataCard, type DataCardColumn } from "./data-card";

interface UTMParameter {
	id: string;
	campaign: string;
	source: string;
	medium: string;
	sessions: number;
	percentage: number;
	conversions: number;
}

interface UTMCardProps {
	utmParams?: UTMParameter[];
}

// Mock data
const mockUTMParams: UTMParameter[] = [
	{ id: "1", campaign: "launch_2024", source: "twitter", medium: "social", sessions: 1245, percentage: 28.5, conversions: 89 },
	{ id: "2", campaign: "newsletter_nov", source: "email", medium: "email", sessions: 987, percentage: 22.6, conversions: 156 },
	{ id: "3", campaign: "ph_launch", source: "producthunt", medium: "referral", sessions: 756, percentage: 17.3, conversions: 67 },
	{ id: "4", campaign: "linkedin_ads", source: "linkedin", medium: "cpc", sessions: 534, percentage: 12.2, conversions: 34 },
	{ id: "5", campaign: "blog_seo", source: "google", medium: "organic", sessions: 423, percentage: 9.7, conversions: 28 },
	{ id: "6", campaign: "influencer_collab", source: "instagram", medium: "social", sessions: 298, percentage: 6.8, conversions: 21 },
	{ id: "7", campaign: "retargeting", source: "facebook", medium: "cpc", sessions: 126, percentage: 2.9, conversions: 8 },
];

const getMediumColor = (medium: string) => {
	switch (medium.toLowerCase()) {
		case "social":
			return "bg-pink-500";
		case "email":
			return "bg-green-500";
		case "referral":
			return "bg-orange-500";
		case "cpc":
			return "bg-blue-500";
		case "organic":
			return "bg-emerald-500";
		default:
			return "bg-gray-400";
	}
};

const formatNumber = (num: number) => {
	return new Intl.NumberFormat("fr-FR").format(num);
};

const columns: DataCardColumn<UTMParameter>[] = [
	{
		key: "campaign",
		header: "Campaign",
		render: (utm) => (
			<span className="flex items-center gap-2 font-medium">
				<Tag className="h-4 w-4 text-muted-foreground" />
				<span className="truncate max-w-[120px]">{utm.campaign}</span>
			</span>
		),
	},
	{
		key: "sessions",
		header: "Sessions",
		render: (utm) => (
			<span className="text-muted-foreground">{formatNumber(utm.sessions)}</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (utm) => (
			<span className="font-medium">{utm.percentage}%</span>
		),
		className: "text-right",
	},
];

const modalColumns: DataCardColumn<UTMParameter>[] = [
	{
		key: "campaign",
		header: "Campaign",
		render: (utm) => (
			<span className="font-medium">{utm.campaign}</span>
		),
	},
	{
		key: "source",
		header: "Source",
		render: (utm) => (
			<span className="text-muted-foreground">{utm.source}</span>
		),
	},
	{
		key: "medium",
		header: "Medium",
		render: (utm) => (
			<span className={`px-2 py-0.5 rounded-full text-xs text-white ${getMediumColor(utm.medium)}`}>
				{utm.medium}
			</span>
		),
	},
	{
		key: "sessions",
		header: "Sessions",
		render: (utm) => (
			<span className="text-muted-foreground">{formatNumber(utm.sessions)}</span>
		),
		className: "text-right",
	},
	{
		key: "conversions",
		header: "Conversions",
		render: (utm) => (
			<span className="font-medium">{utm.conversions}</span>
		),
		className: "text-right",
	},
	{
		key: "bar",
		header: "Distribution",
		render: (utm) => (
			<div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full ${getMediumColor(utm.medium)}`}
					style={{ width: `${utm.percentage}%` }}
				/>
			</div>
		),
	},
];

export function UTMCard({ utmParams = mockUTMParams }: UTMCardProps) {
	const totalSessions = utmParams.reduce((sum, u) => sum + u.sessions, 0);
	const displayedUTM = utmParams.slice(0, 5);

	return (
		<DataCard
			title="UTM Campaigns"
			count={totalSessions}
			data={displayedUTM}
			keyExtractor={(utm) => utm.id}
			columns={columns}
			modalColumns={modalColumns}
			modalTitle="Campaign Analytics"
			exportFilename="utm-campaigns-export.csv"
			exportHeaders={["Campaign", "Source", "Medium", "Sessions", "Conversions", "Pourcentage"]}
			exportRow={(utm) => [
				utm.campaign,
				utm.source,
				utm.medium,
				utm.sessions.toString(),
				utm.conversions.toString(),
				`${utm.percentage}%`,
			]}
			rowTooltip="Filtrer par campagne"
			viewAllTooltip="Voir toutes les campagnes"
			moreOptionsTooltip="Plus d'options"
			emptyMessage="Aucune donnée disponible"
			filterKey="utm_campaign"
			getFilterValue={(utm) => utm.campaign}
		/>
	);
}

"use client";

import { ExternalLink, Globe, Search, Share2, Tag } from "lucide-react";
import {
	type DataCardColumn,
	type DataCardTab,
	TabbedDataCard,
} from "./data-card";

// Referrer types
interface Referrer {
	id: string;
	source: string;
	type: "direct" | "search" | "social" | "referral";
	sessions: number;
	percentage: number;
}

// UTM types
interface UTMParameter {
	id: string;
	campaign: string;
	source: string;
	medium: string;
	sessions: number;
	percentage: number;
	conversions: number;
}

// Combined type for the tabbed card
type TrafficSource = Referrer | UTMParameter;

interface TrafficSourcesCardProps {
	referrers?: Referrer[];
	utmParams?: UTMParameter[];
}

// Mock data - Referrers
const mockReferrers: Referrer[] = [
	{
		id: "r1",
		source: "Direct",
		type: "direct",
		sessions: 2845,
		percentage: 36.6,
	},
	{
		id: "r2",
		source: "Google",
		type: "search",
		sessions: 2156,
		percentage: 27.8,
	},
	{
		id: "r3",
		source: "Twitter/X",
		type: "social",
		sessions: 1023,
		percentage: 13.2,
	},
	{
		id: "r4",
		source: "LinkedIn",
		type: "social",
		sessions: 756,
		percentage: 9.7,
	},
	{
		id: "r5",
		source: "ProductHunt",
		type: "referral",
		sessions: 534,
		percentage: 6.9,
	},
];

// Mock data - UTM
const mockUTMParams: UTMParameter[] = [
	{
		id: "u1",
		campaign: "launch_2024",
		source: "twitter",
		medium: "social",
		sessions: 1245,
		percentage: 28.5,
		conversions: 89,
	},
	{
		id: "u2",
		campaign: "newsletter_nov",
		source: "email",
		medium: "email",
		sessions: 987,
		percentage: 22.6,
		conversions: 156,
	},
	{
		id: "u3",
		campaign: "ph_launch",
		source: "producthunt",
		medium: "referral",
		sessions: 756,
		percentage: 17.3,
		conversions: 67,
	},
	{
		id: "u4",
		campaign: "linkedin_ads",
		source: "linkedin",
		medium: "cpc",
		sessions: 534,
		percentage: 12.2,
		conversions: 34,
	},
	{
		id: "u5",
		campaign: "blog_seo",
		source: "google",
		medium: "organic",
		sessions: 423,
		percentage: 9.7,
		conversions: 28,
	},
];

// Helper functions - Referrers
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
		default:
			return "bg-gray-400";
	}
};

// Helper functions - UTM
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

// Referrer columns
const referrerColumns: DataCardColumn<Referrer>[] = [
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
			<span className="text-muted-foreground">
				{formatNumber(referrer.sessions)}
			</span>
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

const referrerModalColumns: DataCardColumn<Referrer>[] = [
	...referrerColumns,
	{
		key: "type",
		header: "Type",
		render: (referrer) => (
			<span className="text-muted-foreground capitalize text-xs">
				{referrer.type}
			</span>
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

// UTM columns
const utmColumns: DataCardColumn<UTMParameter>[] = [
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
			<span className="text-muted-foreground">
				{formatNumber(utm.sessions)}
			</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (utm) => <span className="font-medium">{utm.percentage}%</span>,
		className: "text-right",
	},
];

const utmModalColumns: DataCardColumn<UTMParameter>[] = [
	{
		key: "campaign",
		header: "Campaign",
		render: (utm) => <span className="font-medium">{utm.campaign}</span>,
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
			<span
				className={`px-2 py-0.5 rounded-full text-xs text-white ${getMediumColor(utm.medium)}`}
			>
				{utm.medium}
			</span>
		),
	},
	{
		key: "sessions",
		header: "Sessions",
		render: (utm) => (
			<span className="text-muted-foreground">
				{formatNumber(utm.sessions)}
			</span>
		),
		className: "text-right",
	},
	{
		key: "conversions",
		header: "Conversions",
		render: (utm) => <span className="font-medium">{utm.conversions}</span>,
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

export function TrafficSourcesCard({
	referrers = mockReferrers,
	utmParams = mockUTMParams,
}: TrafficSourcesCardProps) {
	const totalReferrerSessions = referrers.reduce(
		(sum, r) => sum + r.sessions,
		0,
	);
	const totalUTMSessions = utmParams.reduce((sum, u) => sum + u.sessions, 0);

	const tabs: DataCardTab<TrafficSource>[] = [
		{
			id: "referrers",
			label: "Referrers",
			data: referrers as TrafficSource[],
			columns: referrerColumns as DataCardColumn<TrafficSource>[],
			modalColumns: referrerModalColumns as DataCardColumn<TrafficSource>[],
			keyExtractor: (item) => (item as Referrer).id,
			count: totalReferrerSessions,
			filterKey: "referrer",
			getFilterValue: (item) => (item as Referrer).source.toLowerCase(),
			emptyMessage: "Aucune source de trafic",
			exportFilename: "referrers-export.csv",
			exportHeaders: ["Source", "Type", "Sessions", "Pourcentage"],
			exportRow: (item) => {
				const referrer = item as Referrer;
				return [
					referrer.source,
					referrer.type,
					referrer.sessions.toString(),
					`${referrer.percentage}%`,
				];
			},
		},
		{
			id: "utm",
			label: "Campaigns",
			data: utmParams as TrafficSource[],
			columns: utmColumns as DataCardColumn<TrafficSource>[],
			modalColumns: utmModalColumns as DataCardColumn<TrafficSource>[],
			keyExtractor: (item) => (item as UTMParameter).id,
			count: totalUTMSessions,
			filterKey: "utm_campaign",
			getFilterValue: (item) => (item as UTMParameter).campaign,
			emptyMessage: "Aucune campagne UTM",
			exportFilename: "utm-campaigns-export.csv",
			exportHeaders: [
				"Campaign",
				"Source",
				"Medium",
				"Sessions",
				"Conversions",
				"Pourcentage",
			],
			exportRow: (item) => {
				const utm = item as UTMParameter;
				return [
					utm.campaign,
					utm.source,
					utm.medium,
					utm.sessions.toString(),
					utm.conversions.toString(),
					`${utm.percentage}%`,
				];
			},
		},
	];

	return (
		<TabbedDataCard
			id="traffic-sources"
			tabs={tabs}
			defaultTab="referrers"
			modalTitle="Traffic Sources Analytics"
			rowTooltip="Cliquer pour filtrer"
			viewAllTooltip="Voir tout"
			moreOptionsTooltip="Plus d'options"
		/>
	);
}

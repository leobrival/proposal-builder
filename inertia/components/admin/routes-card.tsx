"use client";

import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import {
	type DataCardColumn,
	type DataCardTab,
	TabbedDataCard,
} from "./data-card";

type RouteType = "page" | "api" | "sse" | "action";

interface RouteInfo {
	id: string;
	name: string;
	pattern: string;
	methods: string[];
	type: RouteType;
	controller: string;
	middleware: string[];
}

interface RoutesResponse {
	routes: RouteInfo[];
	counts: Record<RouteType, number>;
}

const methodColors: Record<string, string> = {
	GET: "bg-green-500/10 text-green-600 border-green-500/20",
	POST: "bg-blue-500/10 text-blue-600 border-blue-500/20",
	PUT: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
	PATCH: "bg-orange-500/10 text-orange-600 border-orange-500/20",
	DELETE: "bg-red-500/10 text-red-600 border-red-500/20",
};

const typeLabels: Record<RouteType, string> = {
	page: "Pages",
	api: "API",
	sse: "SSE",
	action: "Actions",
};

const columns: DataCardColumn<RouteInfo>[] = [
	{
		key: "methods",
		header: "Method",
		render: (route) => (
			<div className="flex gap-1">
				{route.methods.map((method) => (
					<Badge
						key={method}
						variant="outline"
						className={`text-xs font-mono ${methodColors[method] || ""}`}
					>
						{method}
					</Badge>
				))}
			</div>
		),
	},
	{
		key: "pattern",
		header: "Pattern",
		render: (route) => (
			<code className="text-sm font-mono text-muted-foreground">
				{route.pattern}
			</code>
		),
	},
];

const modalColumns: DataCardColumn<RouteInfo>[] = [
	{
		key: "methods",
		header: "Method",
		render: (route) => (
			<div className="flex gap-1">
				{route.methods.map((method) => (
					<Badge
						key={method}
						variant="outline"
						className={`text-xs font-mono ${methodColors[method] || ""}`}
					>
						{method}
					</Badge>
				))}
			</div>
		),
	},
	{
		key: "pattern",
		header: "Pattern",
		render: (route) => (
			<code className="text-sm font-mono text-muted-foreground">
				{route.pattern}
			</code>
		),
	},
	{
		key: "controller",
		header: "Controller",
		render: (route) => (
			<span className="text-sm text-muted-foreground">{route.controller}</span>
		),
	},
	{
		key: "middleware",
		header: "Middleware",
		render: (route) =>
			route.middleware.length > 0 ? (
				<div className="flex gap-1 flex-wrap">
					{route.middleware.map((mw) => (
						<Badge key={mw} variant="secondary" className="text-xs">
							{mw}
						</Badge>
					))}
				</div>
			) : (
				<span className="text-xs text-muted-foreground">-</span>
			),
	},
];

export function RoutesCard() {
	const [data, setData] = useState<RoutesResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchRoutes = async () => {
			try {
				const response = await fetch("/admin/api/routes");
				if (response.ok) {
					const result = await response.json();
					setData(result);
				} else {
					setError(`Erreur ${response.status}`);
				}
			} catch (err) {
				console.error("Failed to fetch routes:", err);
				setError("Impossible de charger les routes");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRoutes();
	}, []);

	if (isLoading) {
		return (
			<div className="rounded-lg border bg-card p-6">
				<div className="animate-pulse space-y-3">
					<div className="h-4 w-24 bg-muted rounded" />
					<div className="h-8 w-full bg-muted rounded" />
					<div className="h-8 w-full bg-muted rounded" />
					<div className="h-8 w-full bg-muted rounded" />
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="rounded-lg border bg-card p-6">
				<div className="text-center text-muted-foreground">
					<p>{error || "Aucune donnée disponible"}</p>
				</div>
			</div>
		);
	}

	const { routes, counts } = data;

	const createTab = (
		id: string,
		type: RouteType | "all",
	): DataCardTab<RouteInfo> => {
		const filteredRoutes =
			type === "all" ? routes : routes.filter((r) => r.type === type);
		const label = type === "all" ? "All" : typeLabels[type];
		const count = type === "all" ? routes.length : counts[type];

		return {
			id,
			label,
			data: filteredRoutes,
			columns,
			modalColumns,
			keyExtractor: (route) => route.id,
			count,
			modalTitle: `${label} Routes`,
			exportFilename: `routes-${id}-export.csv`,
			exportHeaders: ["Method", "Pattern", "Controller", "Middleware", "Type"],
			exportRow: (route) => [
				route.methods.join(", "),
				route.pattern,
				route.controller,
				route.middleware.join(", "),
				route.type,
			],
			emptyMessage: "Aucune route",
		};
	};

	const tabs: DataCardTab<RouteInfo>[] = [
		createTab("all", "all"),
		createTab("page", "page"),
		createTab("api", "api"),
		createTab("action", "action"),
		createTab("sse", "sse"),
	];

	return (
		<TabbedDataCard
			id="routes"
			tabs={tabs}
			defaultTab="all"
			viewAllTooltip="Voir toutes les routes"
			moreOptionsTooltip="Plus d'options"
		/>
	);
}

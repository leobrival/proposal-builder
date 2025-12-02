import { Transmit } from "@adonisjs/transmit-client";
import { Head, router } from "@inertiajs/react";
import { RefreshCw, TrendingUp, Wifi, WifiOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "~/components/admin/admin-layout";

import { TabbedChartCard } from "~/components/admin/chart-card";
import { CountriesCard } from "~/components/admin/countries-card";
import { DevicesBrowsersCard } from "~/components/admin/devices-browsers-card";
import { MetricsCard } from "~/components/admin/metrics-card";
import { OSCard } from "~/components/admin/os-card";
import {
	type DateRangeTimestamp,
	getPeriodLabel,
	PeriodFilter,
	presetToDateRange,
} from "~/components/admin/period-filter";
import { RecentProposalsCard } from "~/components/admin/recent-proposals-card";
import { RecentUsersCard } from "~/components/admin/recent-users-card";
import { RoutesCard } from "~/components/admin/routes-card";
import { SiteStatusBar } from "~/components/admin/site-status-bar";
import { TrafficSourcesCard } from "~/components/admin/traffic-sources-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface Country {
	id: string;
	name: string;
	code: string;
	users: number;
	percentage: number;
}

interface Device {
	id: string;
	name: string;
	type: "desktop" | "mobile" | "tablet";
	sessions: number;
	percentage: number;
}

interface Browser {
	id: string;
	name: string;
	icon: string;
	sessions: number;
	percentage: number;
}

interface OperatingSystem {
	id: string;
	name: string;
	icon: string;
	sessions: number;
	percentage: number;
}

interface SessionAnalytics {
	countries: Country[];
	devices: Device[];
	browsers: Browser[];
	operatingSystems: OperatingSystem[];
}

interface DashboardProps {
	northStar: {
		current: number;
		target: number;
		trend: number;
		status: "green" | "yellow" | "red";
	};
	acquisition: {
		totalUsers: number;
		newUsers: number;
		registrationRate: number;
		trend: number;
	};
	activation: {
		activationRate: number;
		timeToFirstProposal: number;
		trend: number;
	};
	retention: {
		week1Retention: number;
		dauMau: number;
		monthlyChurn: number;
		trend: number;
	};
	revenue: {
		mrr: number;
		arpu: number;
		freeToPaid: number;
		ltvCac: number;
		trend: number;
	};
	referral: {
		nps: number;
		kFactor: number;
		trend: number;
	};
	recentUsers: Array<{
		id: string;
		fullName: string;
		email: string;
		plan: "free" | "paid";
		createdAt: string;
		isAdmin: boolean;
		isBlocked: boolean;
	}>;
	recentProposals: Array<{
		id: string;
		title: string;
		status: string;
		authorName: string;
		createdAt: string;
	}>;
	chartData: {
		dailyUsers: Array<{
			date: string;
			users: number;
			free: number;
			paid: number;
		}>;
		dailyProposals: Array<{ date: string; published: number; draft: number }>;

		proposalsByStatus: Array<{ status: string; count: number; fill: string }>;
	};
	dateRange: {
		from: number;
		to: number;
	};
}

// Create transmit instance (singleton)
const transmit = new Transmit({
	baseUrl: typeof window !== "undefined" ? window.location.origin : "",
});

export default function AdminDashboard(props: DashboardProps) {
	const [data, setData] = useState(props);
	const [dateRange, setDateRange] = useState<DateRangeTimestamp>(
		props.dateRange || presetToDateRange("7d"),
	);
	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
	const [sessionAnalytics, setSessionAnalytics] =
		useState<SessionAnalytics | null>(null);

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("fr-FR", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	// Fetch session analytics from API
	const fetchSessionAnalytics = useCallback(
		async (range: DateRangeTimestamp) => {
			try {
				const response = await fetch(
					`/admin/api/session-analytics?from=${range.from}&to=${range.to}`,
				);
				if (response.ok) {
					const analyticsData = await response.json();
					setSessionAnalytics(analyticsData);
				}
			} catch (error) {
				console.error("Failed to fetch session analytics:", error);
			}
		},
		[],
	);

	// Fetch metrics from API
	const fetchMetrics = useCallback(
		async (range: DateRangeTimestamp) => {
			setIsLoading(true);
			try {
				const [metricsResponse] = await Promise.all([
					fetch(`/admin/api/metrics?from=${range.from}&to=${range.to}`),
					fetchSessionAnalytics(range),
				]);
				if (metricsResponse.ok) {
					const newData = await metricsResponse.json();
					setData({ ...newData, dateRange: range });
					setLastUpdate(new Date());
				}
			} catch (error) {
				console.error("Failed to fetch metrics:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[fetchSessionAnalytics],
	);

	// Handle period change - update URL and fetch new data
	const handlePeriodChange = (newRange: DateRangeTimestamp) => {
		setDateRange(newRange);

		// Update URL with new date range parameters
		router.get(
			"/admin/dashboard",
			{ from: newRange.from, to: newRange.to },
			{
				preserveState: true,
				preserveScroll: true,
				replace: true,
				only: [], // Don't reload page data, we fetch via API
			},
		);

		fetchMetrics(newRange);
	};

	// Manual refresh
	const handleRefresh = () => {
		fetchMetrics(dateRange);
	};

	// Load session analytics on initial render
	useEffect(() => {
		fetchSessionAnalytics(dateRange);
	}, []);

	// Subscribe to real-time updates
	useEffect(() => {
		const subscription = transmit.subscription("admin/metrics");

		subscription
			.create()
			.then(() => {
				setIsConnected(true);
			})
			.catch((error) => {
				console.error("Failed to subscribe to metrics channel:", error);
				setIsConnected(false);
			});

		subscription.onMessage((message: { type: string; payload?: string }) => {
			if (message.type === "metrics_update" && message.payload) {
				try {
					const newData = JSON.parse(message.payload) as DashboardProps;
					setData({ ...newData, dateRange });
					setLastUpdate(new Date());
				} catch (e) {
					console.error("Failed to parse metrics payload:", e);
				}
			}
		});

		return () => {
			subscription.delete();
			setIsConnected(false);
		};
	}, [dateRange]);

	// Memoize derived data to prevent unnecessary re-renders
	const {
		northStar,
		acquisition,
		activation,
		retention,
		recentUsers,
		recentProposals,
		chartData,
	} = useMemo(() => data, [data]);

	return (
		<AdminLayout
			title="Dashboard"
			subtitle={
				<SiteStatusBar
					domain="www.spons-easy.com"
					pagesIndexed={2}
					onlineUsers={0}
					syncStatus={isConnected ? "synced" : "offline"}
					lastSyncAt={lastUpdate}
				/>
			}
		>
			<Head title="Admin Dashboard" />

			{/* Header with filters and status */}
			<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<PeriodFilter value={dateRange} onChange={handlePeriodChange} />
					<Button
						variant="outline"
						size="sm"
						onClick={handleRefresh}
						disabled={isLoading}
					>
						<RefreshCw
							className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
						/>
						Actualiser
					</Button>
				</div>
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					{lastUpdate && (
						<span>Dernière mise à jour : {formatTime(lastUpdate)}</span>
					)}
					<div className="flex items-center gap-1">
						{isConnected ? (
							<>
								<Wifi className="h-4 w-4 text-green-500" />
								<span className="text-green-500">Temps réel</span>
							</>
						) : (
							<>
								<WifiOff className="h-4 w-4 text-muted-foreground" />
								<span>Hors ligne</span>
							</>
						)}
					</div>
				</div>
			</div>

			{/* North Star Metric */}
			<Card className="mb-8 border-primary/20 bg-primary/5 transition-all duration-300">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-primary" />
						North Star Metric: Proposals Published
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className={`flex items-baseline gap-4 transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}
					>
						<span className="text-4xl font-bold tabular-nums">
							{northStar.current}
						</span>
						<span className="text-muted-foreground">
							/ {northStar.target} target
						</span>
						<Badge
							variant={
								northStar.status === "green"
									? "default"
									: northStar.status === "yellow"
										? "secondary"
										: "destructive"
							}
							className="transition-colors duration-300"
						>
							{northStar.trend >= 0 ? "+" : ""}
							{northStar.trend}% vs previous period
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* AARRR Metrics Grid */}
			<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<MetricsCard
					title="Total Users"
					value={acquisition.totalUsers}
					trend={acquisition.trend}
					subtitle="all time"
					isLoading={isLoading}
				/>
				<MetricsCard
					title="New Users"
					value={acquisition.newUsers}
					trend={acquisition.trend}
					subtitle="this period"
					isLoading={isLoading}
				/>
				<MetricsCard
					title="Activation Rate"
					value={`${activation.activationRate}%`}
					trend={activation.trend}
					status={
						activation.activationRate >= 35
							? "green"
							: activation.activationRate >= 20
								? "yellow"
								: "red"
					}
					isLoading={isLoading}
				/>
				<MetricsCard
					title="Week 1 Retention"
					value={`${retention.week1Retention}%`}
					trend={retention.trend}
					status={
						retention.week1Retention >= 45
							? "green"
							: retention.week1Retention >= 30
								? "yellow"
								: "red"
					}
					isLoading={isLoading}
				/>
			</div>

			{/* Activity Charts */}
			<div
				className={`mb-8 transition-opacity duration-300 ${isLoading ? "opacity-60" : "opacity-100"}`}
			>
				<TabbedChartCard
					views={[
						{
							id: "users",
							label: "Utilisateurs",
							data: chartData.dailyUsers,
							series: [
								{ key: "users", label: "Total", color: "hsl(221, 83%, 53%)" },
								{ key: "free", label: "Gratuits", color: "hsl(47, 96%, 53%)" },
								{ key: "paid", label: "Payants", color: "hsl(142, 71%, 45%)" },
							],
							xAxisKey: "date",
							filterKey: "date",
							getFilterValue: (d) => d.date as string,
							metrics: [
								{
									label: "Nouveaux utilisateurs",
									value: chartData.dailyUsers.reduce(
										(sum, d) => sum + d.users,
										0,
									),
									trend: acquisition.trend,
								},
								{
									label: "Gratuits",
									value: chartData.dailyUsers.reduce(
										(sum, d) => sum + d.free,
										0,
									),
								},
								{
									label: "Payants",
									value: chartData.dailyUsers.reduce(
										(sum, d) => sum + d.paid,
										0,
									),
								},
							],
						},
						{
							id: "proposals",
							label: "Proposals",
							data: chartData.dailyProposals,
							series: [
								{
									key: "published",
									label: "Publiées",
									color: "hsl(142, 71%, 45%)",
								},
								{
									key: "draft",
									label: "Brouillons",
									color: "hsl(45, 93%, 47%)",
								},
							],
							xAxisKey: "date",
							filterKey: "date",
							getFilterValue: (d) => d.date as string,
							metrics: [
								{
									label: "Proposals créées",
									value: chartData.dailyProposals.reduce(
										(sum, d) => sum + d.published + d.draft,
										0,
									),
									trend: northStar.trend,
								},
								{
									label: "Publiées",
									value: chartData.dailyProposals.reduce(
										(sum, d) => sum + d.published,
										0,
									),
								},
								{
									label: "Brouillons",
									value: chartData.dailyProposals.reduce(
										(sum, d) => sum + d.draft,
										0,
									),
								},
							],
						},
					]}
					defaultChartType="area"
					allowedChartTypes={["line", "area", "bar"]}
					stacked={false}
					footer={
						<span>
							Activite sur la periode selectionnee ({getPeriodLabel(dateRange)})
						</span>
					}
				/>
			</div>

			{/* Recent Activity */}
			<div className="mb-8 grid gap-4 lg:grid-cols-2">
				<RecentUsersCard users={recentUsers} />
				<RecentProposalsCard proposals={recentProposals} />
			</div>

			{/* Analytics Cards */}
			<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<CountriesCard countries={sessionAnalytics?.countries} />
				<DevicesBrowsersCard
					devices={sessionAnalytics?.devices}
					browsers={sessionAnalytics?.browsers}
				/>
				<OSCard operatingSystems={sessionAnalytics?.operatingSystems} />
			</div>

			<div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<TrafficSourcesCard />
			</div>

			{/* System Routes */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<RoutesCard />
			</div>
		</AdminLayout>
	);
}

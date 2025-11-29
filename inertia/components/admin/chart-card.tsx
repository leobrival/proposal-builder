"use client";

import { router } from "@inertiajs/react";
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	CartesianGrid,
	XAxis,
	YAxis,
	ResponsiveContainer,
} from "recharts";
import { type ReactNode, useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "~/components/ui/toggle-group";
import { AreaChartIcon, BarChart3, LineChartIcon, PieChartIcon } from "lucide-react";

// Chart types
export type ChartType = "line" | "area" | "bar" | "pie";

// Data point interface
export interface ChartDataPoint {
	[key: string]: string | number;
}

// Series configuration
export interface ChartSeries {
	key: string;
	label: string;
	color: string;
	// For stacked charts
	stackId?: string;
}

// Metric configuration for header stats
export interface ChartMetric {
	label: string;
	value: number | string;
	trend?: number; // percentage change
	format?: "number" | "percent" | "currency";
}

// View configuration for tabbed charts
export interface ChartView<T extends ChartDataPoint = ChartDataPoint> {
	id: string;
	label: string;
	data: T[];
	series: ChartSeries[];
	xAxisKey: string;
	// Metrics to display in header
	metrics?: ChartMetric[];
	// Optional filter when clicking on data
	filterKey?: string;
	getFilterValue?: (dataPoint: T) => string;
}

// Props for single view ChartCard
export interface ChartCardProps<T extends ChartDataPoint = ChartDataPoint> {
	// Card header
	title: string;
	description?: string;

	// Data
	data: T[];
	series: ChartSeries[];
	xAxisKey: string;

	// Chart type (can be changed by user)
	defaultChartType?: ChartType;
	allowedChartTypes?: ChartType[];

	// Chart customization
	showGrid?: boolean;
	showLegend?: boolean;
	showXAxis?: boolean;
	showYAxis?: boolean;
	stacked?: boolean;
	curved?: boolean;

	// Footer content
	footer?: ReactNode;

	// Filter settings for URL params (clicking on chart)
	filterKey?: string;
	getFilterValue?: (dataPoint: T) => string;

	// Formatters
	xAxisFormatter?: (value: string) => string;
	yAxisFormatter?: (value: number) => string;
	tooltipFormatter?: (value: number) => string;
}

// Props for tabbed ChartCard
export interface TabbedChartCardProps<T extends ChartDataPoint = ChartDataPoint> {
	// Tabs configuration
	views: ChartView<T>[];
	defaultView?: string;

	// Card header (optional, can use view labels)
	title?: string;
	description?: string;

	// Chart type (can be changed by user)
	defaultChartType?: ChartType;
	allowedChartTypes?: ChartType[];

	// Chart customization
	showGrid?: boolean;
	showLegend?: boolean;
	showXAxis?: boolean;
	showYAxis?: boolean;
	stacked?: boolean;
	curved?: boolean;

	// Footer content
	footer?: ReactNode;

	// Formatters
	xAxisFormatter?: (value: string) => string;
	yAxisFormatter?: (value: number) => string;
	tooltipFormatter?: (value: number) => string;
}

// Chart type icons
const chartTypeIcons: Record<ChartType, ReactNode> = {
	line: <LineChartIcon className="h-4 w-4" />,
	area: <AreaChartIcon className="h-4 w-4" />,
	bar: <BarChart3 className="h-4 w-4" />,
	pie: <PieChartIcon className="h-4 w-4" />,
};

// Format metric value
function formatMetricValue(value: number | string, format?: "number" | "percent" | "currency"): string {
	if (typeof value === "string") return value;

	switch (format) {
		case "percent":
			return `${value}%`;
		case "currency":
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
		default:
			return new Intl.NumberFormat("fr-FR").format(value);
	}
}

// Trend badge component
function TrendBadge({ trend }: { trend: number }) {
	const isPositive = trend >= 0;
	const isNeutral = trend === 0;

	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
				isNeutral
					? "bg-muted text-muted-foreground"
					: isPositive
						? "bg-green-500/20 text-green-500"
						: "bg-red-500/20 text-red-500"
			}`}
		>
			{isPositive ? "+" : ""}{trend}%
		</span>
	);
}

// Metrics header component
function MetricsHeader({ metrics }: { metrics: ChartMetric[] }) {
	if (!metrics || metrics.length === 0) return null;

	return (
		<div className="flex divide-x">
			{metrics.map((metric, index) => (
				<div key={index} className="flex-1 px-4 py-3 first:pl-0 last:pr-0">
					<div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
					<div className="flex items-center gap-2">
						<span className="text-2xl font-bold tabular-nums">
							{formatMetricValue(metric.value, metric.format)}
						</span>
						{metric.trend !== undefined && <TrendBadge trend={metric.trend} />}
					</div>
				</div>
			))}
		</div>
	);
}

// Build chart config from series
function buildChartConfig(series: ChartSeries[]): ChartConfig {
	return series.reduce((config, s) => {
		config[s.key] = {
			label: s.label,
			color: s.color,
		};
		return config;
	}, {} as ChartConfig);
}

// Single view ChartCard component
export function ChartCard<T extends ChartDataPoint>({
	title,
	description,
	data,
	series,
	xAxisKey,
	defaultChartType = "area",
	allowedChartTypes = ["line", "area", "bar"],
	showGrid = true,
	showLegend = true,
	showXAxis = true,
	showYAxis = true,
	stacked = false,
	curved = true,
	footer,
	filterKey,
	getFilterValue,
	xAxisFormatter = (value) => value.slice(0, 6),
	yAxisFormatter,
	tooltipFormatter,
}: ChartCardProps<T>) {
	const [chartType, setChartType] = useState<ChartType>(defaultChartType);
	const chartConfig = buildChartConfig(series);

	const handleChartClick = (dataPoint: T) => {
		if (filterKey && getFilterValue) {
			const filterValue = getFilterValue(dataPoint);
			const currentParams = new URLSearchParams(window.location.search);
			currentParams.set(filterKey, filterValue);

			router.get(
				window.location.pathname,
				Object.fromEntries(currentParams.entries()),
				{
					preserveState: true,
					preserveScroll: true,
					replace: true,
					only: [],
				}
			);
		}
	};

	const renderChart = () => {
		const commonProps = {
			data,
			margin: { top: 10, right: 10, left: 0, bottom: 0 },
		};

		const curveType = curved ? "monotone" : "linear";

		switch (chartType) {
			case "line":
				return (
					<LineChart {...commonProps}>
						{showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
						{showXAxis && (
							<XAxis
								dataKey={xAxisKey}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={xAxisFormatter}
							/>
						)}
						{showYAxis && (
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								width={40}
								tickFormatter={yAxisFormatter}
							/>
						)}
						<ChartTooltip
							cursor={{ strokeDasharray: "3 3" }}
							content={<ChartTooltipContent />}
						/>
						{showLegend && <ChartLegend content={<ChartLegendContent />} />}
						{series.map((s) => (
							<Line
								key={s.key}
								dataKey={s.key}
								type={curveType}
								stroke={s.color}
								strokeWidth={2}
								dot={{ fill: s.color, r: 3 }}
								activeDot={{ r: 5, fill: s.color, onClick: (_, payload) => handleChartClick(payload.payload as T) }}
							/>
						))}
					</LineChart>
				);

			case "area":
				return (
					<AreaChart {...commonProps}>
						{showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
						{showXAxis && (
							<XAxis
								dataKey={xAxisKey}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={xAxisFormatter}
							/>
						)}
						{showYAxis && (
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								width={40}
								tickFormatter={yAxisFormatter}
							/>
						)}
						<ChartTooltip
							cursor={{ strokeDasharray: "3 3" }}
							content={<ChartTooltipContent />}
						/>
						{showLegend && <ChartLegend content={<ChartLegendContent />} />}
						{series.map((s) => (
							<Area
								key={s.key}
								dataKey={s.key}
								type={curveType}
								stroke={s.color}
								fill={s.color}
								fillOpacity={0.2}
								strokeWidth={2}
								stackId={stacked ? "stack" : undefined}
								activeDot={{ r: 5, fill: s.color, onClick: (_, payload) => handleChartClick(payload.payload as T) }}
							/>
						))}
					</AreaChart>
				);

			case "bar":
				return (
					<BarChart {...commonProps}>
						{showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
						{showXAxis && (
							<XAxis
								dataKey={xAxisKey}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={xAxisFormatter}
							/>
						)}
						{showYAxis && (
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								width={40}
								tickFormatter={yAxisFormatter}
							/>
						)}
						<ChartTooltip
							cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.3 }}
							content={<ChartTooltipContent />}
						/>
						{showLegend && <ChartLegend content={<ChartLegendContent />} />}
						{series.map((s) => (
							<Bar
								key={s.key}
								dataKey={s.key}
								fill={s.color}
								radius={[4, 4, 0, 0]}
								stackId={stacked ? "stack" : undefined}
								onClick={(payload) => handleChartClick(payload as unknown as T)}
							/>
						))}
					</BarChart>
				);

			case "pie":
				// For pie chart, we need to transform data differently
				const pieData = series.map((s) => ({
					name: s.label,
					value: data.reduce((sum, d) => sum + (Number(d[s.key]) || 0), 0),
					color: s.color,
					key: s.key,
				}));

				return (
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Pie
							data={pieData}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							innerRadius={60}
							outerRadius={100}
							paddingAngle={2}
						>
							{pieData.map((entry) => (
								<Cell
									key={entry.key}
									fill={entry.color}
									onClick={() => {
										if (filterKey) {
											const currentParams = new URLSearchParams(window.location.search);
											currentParams.set(filterKey, entry.key);
											router.get(
												window.location.pathname,
												Object.fromEntries(currentParams.entries()),
												{ preserveState: true, preserveScroll: true, replace: true, only: [] }
											);
										}
									}}
									className="cursor-pointer"
								/>
							))}
						</Pie>
						{showLegend && <ChartLegend content={<ChartLegendContent />} />}
					</PieChart>
				);

			default:
				return null;
		}
	};

	return (
		<Card className="p-0 gap-0">
			<CardHeader className="p-4 flex flex-row items-center justify-between">
				<div>
					<CardTitle>{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</div>
				{allowedChartTypes.length > 1 && (
					<ToggleGroup
						type="single"
						value={chartType}
						onValueChange={(value) => value && setChartType(value as ChartType)}
						size="sm"
					>
						{allowedChartTypes.map((type) => (
							<ToggleGroupItem key={type} value={type} aria-label={`${type} chart`}>
								{chartTypeIcons[type]}
							</ToggleGroupItem>
						))}
					</ToggleGroup>
				)}
			</CardHeader>
			<Separator />
			<CardContent className="p-4">
				<ChartContainer config={chartConfig} className="h-[250px] w-full">
					{renderChart()}
				</ChartContainer>
			</CardContent>
			{footer && (
				<CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
					{footer}
				</CardFooter>
			)}
		</Card>
	);
}

// Tabbed ChartCard component for multiple views
export function TabbedChartCard<T extends ChartDataPoint>({
	views,
	defaultView,
	title,
	description,
	defaultChartType = "area",
	allowedChartTypes = ["line", "area", "bar"],
	showGrid = true,
	showLegend = true,
	showXAxis = true,
	showYAxis = true,
	stacked = false,
	curved = true,
	footer,
	xAxisFormatter = (value) => value.slice(0, 6),
	yAxisFormatter,
	tooltipFormatter,
}: TabbedChartCardProps<T>) {
	const [activeView, setActiveView] = useState(defaultView || views[0]?.id || "");
	const [chartType, setChartType] = useState<ChartType>(defaultChartType);

	const currentView = views.find((v) => v.id === activeView) || views[0];
	const chartConfig = currentView ? buildChartConfig(currentView.series) : {};

	const handleChartClick = (dataPoint: T, view: ChartView<T>) => {
		if (view.filterKey && view.getFilterValue) {
			const filterValue = view.getFilterValue(dataPoint);
			const currentParams = new URLSearchParams(window.location.search);
			currentParams.set(view.filterKey, filterValue);

			router.get(
				window.location.pathname,
				Object.fromEntries(currentParams.entries()),
				{
					preserveState: true,
					preserveScroll: true,
					replace: true,
					only: [],
				}
			);
		}
	};

	const renderChart = (view: ChartView<T>) => {
		const { data, series, xAxisKey } = view;
		const viewConfig = buildChartConfig(series);

		const commonProps = {
			data,
			margin: { top: 10, right: 10, left: 0, bottom: 0 },
		};

		const curveType = curved ? "monotone" : "linear";

		switch (chartType) {
			case "line":
				return (
					<ChartContainer config={viewConfig} className="h-[250px] w-full">
						<LineChart {...commonProps}>
							{showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
							{showXAxis && (
								<XAxis
									dataKey={xAxisKey}
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									tickFormatter={xAxisFormatter}
								/>
							)}
							{showYAxis && (
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									width={40}
									tickFormatter={yAxisFormatter}
								/>
							)}
							<ChartTooltip
								cursor={{ strokeDasharray: "3 3" }}
								content={<ChartTooltipContent />}
							/>
							{showLegend && <ChartLegend content={<ChartLegendContent />} />}
							{series.map((s) => (
								<Line
									key={s.key}
									dataKey={s.key}
									type={curveType}
									stroke={s.color}
									strokeWidth={2}
									dot={{ fill: s.color, r: 3 }}
									activeDot={{ r: 5, fill: s.color, onClick: (_, payload) => handleChartClick(payload.payload as T, view) }}
								/>
							))}
						</LineChart>
					</ChartContainer>
				);

			case "area":
				return (
					<ChartContainer config={viewConfig} className="h-[250px] w-full">
						<AreaChart {...commonProps}>
							{showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
							{showXAxis && (
								<XAxis
									dataKey={xAxisKey}
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									tickFormatter={xAxisFormatter}
								/>
							)}
							{showYAxis && (
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									width={40}
									tickFormatter={yAxisFormatter}
								/>
							)}
							<ChartTooltip
								cursor={{ strokeDasharray: "3 3" }}
								content={<ChartTooltipContent />}
							/>
							{showLegend && <ChartLegend content={<ChartLegendContent />} />}
							{series.map((s) => (
								<Area
									key={s.key}
									dataKey={s.key}
									type={curveType}
									stroke={s.color}
									fill={s.color}
									fillOpacity={0.2}
									strokeWidth={2}
									stackId={stacked ? "stack" : undefined}
									activeDot={{ r: 5, fill: s.color, onClick: (_, payload) => handleChartClick(payload.payload as T, view) }}
								/>
							))}
						</AreaChart>
					</ChartContainer>
				);

			case "bar":
				return (
					<ChartContainer config={viewConfig} className="h-[250px] w-full">
						<BarChart {...commonProps}>
							{showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
							{showXAxis && (
								<XAxis
									dataKey={xAxisKey}
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									tickFormatter={xAxisFormatter}
								/>
							)}
							{showYAxis && (
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									width={40}
									tickFormatter={yAxisFormatter}
								/>
							)}
							<ChartTooltip
								cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.3 }}
								content={<ChartTooltipContent />}
							/>
							{showLegend && <ChartLegend content={<ChartLegendContent />} />}
							{series.map((s) => (
								<Bar
									key={s.key}
									dataKey={s.key}
									fill={s.color}
									radius={[4, 4, 0, 0]}
									stackId={stacked ? "stack" : undefined}
									onClick={(payload) => handleChartClick(payload as unknown as T, view)}
								/>
							))}
						</BarChart>
					</ChartContainer>
				);

			case "pie":
				const pieData = series.map((s) => ({
					name: s.label,
					value: data.reduce((sum, d) => sum + (Number(d[s.key]) || 0), 0),
					color: s.color,
					key: s.key,
				}));

				return (
					<ChartContainer config={viewConfig} className="h-[250px] w-full">
						<PieChart>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Pie
								data={pieData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={100}
								paddingAngle={2}
							>
								{pieData.map((entry) => (
									<Cell
										key={entry.key}
										fill={entry.color}
										onClick={() => {
											if (view.filterKey) {
												const currentParams = new URLSearchParams(window.location.search);
												currentParams.set(view.filterKey, entry.key);
												router.get(
													window.location.pathname,
													Object.fromEntries(currentParams.entries()),
													{ preserveState: true, preserveScroll: true, replace: true, only: [] }
												);
											}
										}}
										className="cursor-pointer"
									/>
								))}
							</Pie>
							{showLegend && <ChartLegend content={<ChartLegendContent />} />}
						</PieChart>
					</ChartContainer>
				);

			default:
				return null;
		}
	};

	return (
		<Card className="p-0 gap-0">
			<Tabs value={activeView} onValueChange={setActiveView}>
				<CardHeader className="p-4 flex flex-row items-center justify-between">
					<div className="flex items-center gap-4">
						{title ? (
							<div>
								<CardTitle>{title}</CardTitle>
								{description && <CardDescription>{description}</CardDescription>}
							</div>
						) : (
							<TabsList className="h-8">
								{views.map((view) => (
									<TabsTrigger
										key={view.id}
										value={view.id}
										className="text-xs px-3"
									>
										{view.label}
									</TabsTrigger>
								))}
							</TabsList>
						)}
					</div>
					<div className="flex items-center gap-2">
						{title && views.length > 1 && (
							<TabsList className="h-8">
								{views.map((view) => (
									<TabsTrigger
										key={view.id}
										value={view.id}
										className="text-xs px-3"
									>
										{view.label}
									</TabsTrigger>
								))}
							</TabsList>
						)}
						{allowedChartTypes.length > 1 && (
							<ToggleGroup
								type="single"
								value={chartType}
								onValueChange={(value) => value && setChartType(value as ChartType)}
								size="sm"
							>
								{allowedChartTypes.map((type) => (
									<ToggleGroupItem key={type} value={type} aria-label={`${type} chart`}>
										{chartTypeIcons[type]}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						)}
					</div>
				</CardHeader>
				<Separator />
				{/* Metrics section */}
				{views.map((view) => (
					<TabsContent key={`metrics-${view.id}`} value={view.id} className="m-0">
						{view.metrics && view.metrics.length > 0 && (
							<>
								<div className="px-4 pt-4">
									<MetricsHeader metrics={view.metrics} />
								</div>
								<Separator className="mt-4" />
							</>
						)}
					</TabsContent>
				))}
				<CardContent className="p-4">
					{views.map((view) => (
						<TabsContent key={view.id} value={view.id} className="m-0">
							{renderChart(view)}
						</TabsContent>
					))}
				</CardContent>
			</Tabs>
			{footer && (
				<CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
					{footer}
				</CardFooter>
			)}
		</Card>
	);
}

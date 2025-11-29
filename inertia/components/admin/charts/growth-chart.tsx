"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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

interface GrowthChartProps {
	data: Array<{ date: string; users: number; proposals: number }>;
	period: string;
}

const chartConfig = {
	users: {
		label: "Utilisateurs",
		color: "hsl(221, 83%, 53%)",
	},
	proposals: {
		label: "Proposals",
		color: "hsl(142, 71%, 45%)",
	},
} satisfies ChartConfig;

export function GrowthChart({ data, period }: GrowthChartProps) {
	const firstData = data[0] || { users: 0, proposals: 0 };
	const lastData = data[data.length - 1] || { users: 0, proposals: 0 };

	const userGrowth =
		firstData.users > 0
			? Math.round(
					((lastData.users - firstData.users) / firstData.users) * 100,
				)
			: lastData.users > 0
				? 100
				: 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Croissance Cumulative</CardTitle>
				<CardDescription>
					{period === "7d"
						? "7 derniers jours"
						: period === "15d"
							? "15 derniers jours"
							: period === "30d"
								? "30 derniers jours"
								: period === "90d"
									? "3 derniers mois"
									: period === "180d"
										? "6 derniers mois"
										: period === "365d"
											? "12 derniers mois"
											: "Depuis le début"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={data}
						margin={{
							top: 20,
							left: 12,
							right: 12,
							bottom: 10,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 6)}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							width={40}
						/>
						<ChartTooltip
							cursor={{ strokeDasharray: "3 3" }}
							content={<ChartTooltipContent />}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Line
							dataKey="users"
							type="monotone"
							stroke="hsl(221, 83%, 53%)"
							strokeWidth={3}
							dot={{
								fill: "hsl(221, 83%, 53%)",
								r: 4,
							}}
							activeDot={{
								r: 6,
								fill: "hsl(221, 83%, 53%)",
							}}
							animationDuration={800}
							animationEasing="ease-out"
						/>
						<Line
							dataKey="proposals"
							type="monotone"
							stroke="hsl(142, 71%, 45%)"
							strokeWidth={3}
							dot={{
								fill: "hsl(142, 71%, 45%)",
								r: 4,
							}}
							activeDot={{
								r: 6,
								fill: "hsl(142, 71%, 45%)",
							}}
							animationDuration={800}
							animationEasing="ease-out"
							animationBegin={200}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					{userGrowth >= 0 ? "+" : ""}
					{userGrowth}% de croissance utilisateurs
					<TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					{lastData.users} utilisateurs, {lastData.proposals} proposals publiées
				</div>
			</CardFooter>
		</Card>
	);
}

"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

interface ProposalsChartProps {
	data: Array<{ date: string; published: number; draft: number }>;
	period: string;
}

const chartConfig = {
	published: {
		label: "Publiées",
		color: "hsl(142, 71%, 45%)",
	},
	draft: {
		label: "Brouillons",
		color: "hsl(47, 96%, 53%)",
	},
} satisfies ChartConfig;

function getPeriodLabel(period: string): string {
	switch (period) {
		case "7d":
			return "7 derniers jours";
		case "15d":
			return "15 derniers jours";
		case "30d":
			return "30 derniers jours";
		case "90d":
			return "3 derniers mois";
		case "180d":
			return "6 derniers mois";
		case "365d":
			return "12 derniers mois";
		default:
			return "Depuis le début";
	}
}

export function ProposalsChart({ data, period }: ProposalsChartProps) {
	const totalPublished = data.reduce((sum, d) => sum + d.published, 0);
	const totalDraft = data.reduce((sum, d) => sum + d.draft, 0);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Proposals Créées</CardTitle>
				<CardDescription>{getPeriodLabel(period)}</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 6)}
						/>
						<YAxis tickLine={false} axisLine={false} tickMargin={8} width={30} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey="published"
							stackId="a"
							fill="hsl(142, 71%, 45%)"
							radius={[0, 0, 4, 4]}
							animationDuration={600}
							animationEasing="ease-out"
						/>
						<Bar
							dataKey="draft"
							stackId="a"
							fill="hsl(47, 96%, 53%)"
							radius={[4, 4, 0, 0]}
							animationDuration={600}
							animationEasing="ease-out"
							animationBegin={150}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					{totalPublished} publiées, {totalDraft} brouillons
					<TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					{totalPublished + totalDraft} proposals créées au total
				</div>
			</CardFooter>
		</Card>
	);
}

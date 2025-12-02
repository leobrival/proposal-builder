"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
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

interface StatusChartProps {
	data: Array<{ status: string; count: number; fill: string }>;
}

const chartConfig = {
	count: {
		label: "Proposals",
	},
	published: {
		label: "Publiées",
		color: "hsl(142, 71%, 45%)",
	},
	draft: {
		label: "Brouillons",
		color: "hsl(47, 96%, 53%)",
	},
	archived: {
		label: "Archivées",
		color: "hsl(0, 84%, 60%)",
	},
} satisfies ChartConfig;

const COLORS: Record<string, string> = {
	published: "hsl(142, 71%, 45%)",
	draft: "hsl(47, 96%, 53%)",
	archived: "hsl(0, 84%, 60%)",
};

export function StatusChart({ data }: StatusChartProps) {
	const total = data.reduce((sum, d) => sum + d.count, 0);

	return (
		<Card>
			<CardHeader className="items-center pb-0">
				<CardTitle>Répartition des Proposals</CardTitle>
				<CardDescription>Par statut</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={data}
							dataKey="count"
							nameKey="status"
							innerRadius={60}
							outerRadius={90}
							strokeWidth={2}
							stroke="hsl(var(--background))"
							animationDuration={800}
							animationEasing="ease-out"
						>
							{data.map((entry) => (
								<Cell
									key={entry.status}
									fill={COLORS[entry.status] || "hsl(var(--muted))"}
								/>
							))}
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey="status" />}
							className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<div className="pb-4 text-center">
				<p className="text-2xl font-bold">{total}</p>
				<p className="text-sm text-muted-foreground">Proposals au total</p>
			</div>
		</Card>
	);
}

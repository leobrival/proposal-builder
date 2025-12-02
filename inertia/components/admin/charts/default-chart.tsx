"use client";

import { Download, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "~/components/ui/chart";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface DefaultChartProps {
	data: Array<{ date: string; value: number }>;
	title?: string;
}

const chartConfig = {
	value: {
		label: "Valeur",
		color: "hsl(221, 83%, 53%)",
	},
} satisfies ChartConfig;

export function DefaultChart({
	data,
	title = "Statistiques",
}: DefaultChartProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const exportToCSV = () => {
		const headers = ["Date", "Valeur"];
		const csvContent = [
			headers.join(","),
			...data.map((row) => `${row.date},${row.value}`),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`${title.toLowerCase().replace(/\s+/g, "-")}-export.csv`,
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig}>
						<AreaChart
							accessibilityLayer
							data={data}
							margin={{
								top: 10,
								left: 12,
								right: 12,
								bottom: 0,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
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
								content={<ChartTooltipContent indicator="line" />}
							/>
							<defs>
								<linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
									<stop
										offset="5%"
										stopColor="hsl(221, 83%, 53%)"
										stopOpacity={0.8}
									/>
									<stop
										offset="95%"
										stopColor="hsl(221, 83%, 53%)"
										stopOpacity={0.1}
									/>
								</linearGradient>
							</defs>
							<Area
								dataKey="value"
								type="monotone"
								fill="url(#fillValue)"
								stroke="hsl(221, 83%, 53%)"
								strokeWidth={2}
								animationDuration={800}
								animationEasing="ease-out"
							/>
						</AreaChart>
					</ChartContainer>
				</CardContent>
				<CardFooter className="flex items-center justify-between">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsModalOpen(true)}
					>
						View All
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={exportToCSV}>
								<Download className="mr-2 h-4 w-4" />
								Export CSV
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardFooter>
			</Card>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="max-w-4xl">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
					<div className="mt-4">
						<ChartContainer config={chartConfig} className="h-[400px]">
							<AreaChart
								accessibilityLayer
								data={data}
								margin={{
									top: 10,
									left: 12,
									right: 12,
									bottom: 0,
								}}
							>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis
									dataKey="date"
									tickLine={false}
									axisLine={false}
									tickMargin={8}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									width={40}
								/>
								<ChartTooltip
									cursor={{ strokeDasharray: "3 3" }}
									content={<ChartTooltipContent indicator="line" />}
								/>
								<defs>
									<linearGradient
										id="fillValueModal"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="5%"
											stopColor="hsl(221, 83%, 53%)"
											stopOpacity={0.8}
										/>
										<stop
											offset="95%"
											stopColor="hsl(221, 83%, 53%)"
											stopOpacity={0.1}
										/>
									</linearGradient>
								</defs>
								<Area
									dataKey="value"
									type="monotone"
									fill="url(#fillValueModal)"
									stroke="hsl(221, 83%, 53%)"
									strokeWidth={2}
									animationDuration={800}
									animationEasing="ease-out"
								/>
							</AreaChart>
						</ChartContainer>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

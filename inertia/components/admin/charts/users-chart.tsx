"use client";

import { Download, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

interface UsersChartProps {
	data: Array<{ date: string; users: number }>;
	period: string;
}

const chartConfig = {
	users: {
		label: "Nouveaux utilisateurs",
		color: "hsl(221, 83%, 53%)",
	},
} satisfies ChartConfig;

export function UsersChart({ data }: UsersChartProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const exportToCSV = () => {
		const headers = ["Date", "Utilisateurs"];
		const csvContent = [
			headers.join(","),
			...data.map((row) => `${row.date},${row.users}`),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", "nouveaux-utilisateurs-export.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Nouveaux Utilisateurs</CardTitle>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig}>
						<BarChart accessibilityLayer data={data}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 6)}
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								width={30}
							/>
							<ChartTooltip
								cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Bar
								dataKey="users"
								fill="hsl(221, 83%, 53%)"
								radius={[4, 4, 0, 0]}
								animationDuration={600}
								animationEasing="ease-out"
							/>
						</BarChart>
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
						<DialogTitle>Nouveaux Utilisateurs</DialogTitle>
					</DialogHeader>
					<div className="mt-4">
						<ChartContainer config={chartConfig} className="h-[400px]">
							<BarChart accessibilityLayer data={data}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis
									dataKey="date"
									tickLine={false}
									tickMargin={10}
									axisLine={false}
								/>
								<YAxis
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									width={30}
								/>
								<ChartTooltip
									cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Bar
									dataKey="users"
									fill="hsl(221, 83%, 53%)"
									radius={[4, 4, 0, 0]}
									animationDuration={600}
									animationEasing="ease-out"
								/>
							</BarChart>
						</ChartContainer>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

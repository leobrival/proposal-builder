import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

interface MetricsCardProps {
	title: string;
	value: string | number;
	trend?: number;
	subtitle?: string;
	status?: "green" | "yellow" | "red";
	isLoading?: boolean;
}

/**
 * Animated number component that smoothly transitions between values
 */
function AnimatedNumber({ value }: { value: number }) {
	const [displayValue, setDisplayValue] = useState(value);
	const previousValue = useRef(value);

	useEffect(() => {
		const start = previousValue.current;
		const end = value;
		const duration = 500; // ms
		const startTime = performance.now();

		const animate = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Easing function (ease-out-cubic)
			const easeOut = 1 - (1 - progress) ** 3;

			const current = Math.round(start + (end - start) * easeOut);
			setDisplayValue(current);

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				previousValue.current = end;
			}
		};

		requestAnimationFrame(animate);
	}, [value]);

	return <>{displayValue.toLocaleString("fr-FR")}</>;
}

export function MetricsCard({
	title,
	value,
	trend,
	subtitle,
	status,
	isLoading = false,
}: MetricsCardProps) {
	const statusColors = {
		green: "text-green-500",
		yellow: "text-yellow-500",
		red: "text-red-500",
	};

	// Parse numeric value for animation
	const numericValue =
		typeof value === "number"
			? value
			: Number.parseInt(value.toString().replace(/[^0-9-]/g, ""), 10);
	const isNumeric = !Number.isNaN(numericValue) && typeof value === "number";
	const suffix = typeof value === "string" ? value.replace(/[0-9-]/g, "") : "";

	if (isLoading) {
		return (
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<Skeleton className="h-4 w-24" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-8 w-16 mb-2" />
					<Skeleton className="h-3 w-20" />
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="transition-all duration-300 hover:shadow-md">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				{status && (
					<div
						className={`h-2 w-2 rounded-full ${statusColors[status]} bg-current transition-colors duration-300`}
					/>
				)}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold transition-all duration-300">
					{isNumeric ? (
						<>
							<AnimatedNumber value={numericValue} />
							{suffix}
						</>
					) : (
						value
					)}
				</div>
				{(trend !== undefined || subtitle) && (
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						{trend !== undefined && (
							<span
								className={`flex items-center transition-colors duration-300 ${trend >= 0 ? "text-green-500" : "text-red-500"}`}
							>
								{trend >= 0 ? (
									<ArrowUp className="h-3 w-3" />
								) : (
									<ArrowDown className="h-3 w-3" />
								)}
								{Math.abs(trend)}%
							</span>
						)}
						{subtitle && <span>{subtitle}</span>}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

"use client";

import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

// Preset periods for quick selection
export type PresetPeriod =
	| "7d"
	| "15d"
	| "30d"
	| "90d"
	| "180d"
	| "365d"
	| "all";

// Date range in Unix timestamps (seconds)
export interface DateRangeTimestamp {
	from: number;
	to: number;
}

interface PeriodFilterProps {
	value: DateRangeTimestamp;
	onChange: (range: DateRangeTimestamp) => void;
}

const presetOptions: {
	value: PresetPeriod;
	label: string;
	fullLabel: string;
}[] = [
	{ value: "7d", label: "7j", fullLabel: "7 derniers jours" },
	{ value: "15d", label: "15j", fullLabel: "15 derniers jours" },
	{ value: "30d", label: "30j", fullLabel: "30 derniers jours" },
	{ value: "90d", label: "3m", fullLabel: "3 derniers mois" },
	{ value: "180d", label: "6m", fullLabel: "6 derniers mois" },
	{ value: "365d", label: "1a", fullLabel: "12 derniers mois" },
];

/**
 * Convert a preset period to a date range with Unix timestamps
 */
export function presetToDateRange(preset: PresetPeriod): DateRangeTimestamp {
	const now = new Date();
	const to = Math.floor(endOfDay(now).getTime() / 1000);

	if (preset === "all") {
		// Return a very old date for "all time"
		return {
			from: 0,
			to,
		};
	}

	const days = Number.parseInt(preset.replace("d", ""), 10);
	const fromDate = startOfDay(subDays(now, days));
	return {
		from: Math.floor(fromDate.getTime() / 1000),
		to,
	};
}

/**
 * Check if a date range matches a preset period
 */
function matchesPreset(range: DateRangeTimestamp): PresetPeriod | null {
	const now = new Date();
	const todayEnd = Math.floor(endOfDay(now).getTime() / 1000);

	// Allow 1 day tolerance for "to" date
	const toTolerance = 86400; // 1 day in seconds
	if (Math.abs(range.to - todayEnd) > toTolerance) {
		return null;
	}

	for (const option of presetOptions) {
		const presetRange = presetToDateRange(option.value);
		// Allow 1 day tolerance for comparison
		if (Math.abs(range.from - presetRange.from) <= toTolerance) {
			return option.value;
		}
	}

	if (range.from === 0) {
		return "all";
	}

	return null;
}

/**
 * Format a date range for display
 */
function formatDateRange(range: DateRangeTimestamp): string {
	const fromDate = new Date(range.from * 1000);
	const toDate = new Date(range.to * 1000);

	if (range.from === 0) {
		return "Depuis le debut";
	}

	return `${format(fromDate, "d MMM", { locale: fr })} - ${format(toDate, "d MMM yyyy", { locale: fr })}`;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [calendarRange, setCalendarRange] = useState<DateRange | undefined>(
		() => ({
			from: new Date(value.from * 1000),
			to: new Date(value.to * 1000),
		}),
	);
	// Track the number of clicks to know when user has completed selection
	const [clickCount, setClickCount] = useState(0);

	// Detect if current range matches a preset
	const activePreset = useMemo(() => matchesPreset(value), [value]);

	// Sync calendar range when value changes externally
	useEffect(() => {
		if (value.from > 0) {
			setCalendarRange({
				from: new Date(value.from * 1000),
				to: new Date(value.to * 1000),
			});
		}
	}, [value.from, value.to]);

	// Reset click count when popover opens
	useEffect(() => {
		if (isOpen) {
			setClickCount(0);
		}
	}, [isOpen]);

	const handlePresetChange = (preset: string) => {
		if (!preset) return;
		const range = presetToDateRange(preset as PresetPeriod);
		onChange(range);
	};

	const handleCalendarSelect = (range: DateRange | undefined) => {
		setCalendarRange(range);
		const newClickCount = clickCount + 1;
		setClickCount(newClickCount);

		// After second click, apply the range and close
		if (newClickCount >= 2 && range?.from && range?.to) {
			onChange({
				from: Math.floor(startOfDay(range.from).getTime() / 1000),
				to: Math.floor(endOfDay(range.to).getTime() / 1000),
			});
			setIsOpen(false);
			setClickCount(0);
		}
	};

	// Get the label for current selection
	const currentLabel = activePreset
		? presetOptions.find((o) => o.value === activePreset)?.label || "Période"
		: "Personnalisé";

	return (
		<div className="flex items-center gap-2">
			{/* Preset dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" className="min-w-[80px]">
						{currentLabel}
						<ChevronDown className="ml-2 h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					{presetOptions.map((option) => (
						<DropdownMenuItem
							key={option.value}
							onClick={() => handlePresetChange(option.value)}
							className={cn(activePreset === option.value && "bg-accent")}
						>
							{option.fullLabel}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Calendar date range picker */}
			<Popover open={isOpen} onOpenChange={setIsOpen}>
				<PopoverTrigger asChild>
					<Button
						variant={activePreset ? "outline" : "default"}
						size="sm"
						className={cn(
							"justify-start text-left font-normal min-w-[180px]",
							!activePreset && "bg-primary text-primary-foreground",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{activePreset ? (
							<span className="text-muted-foreground">Personnaliser</span>
						) : (
							formatDateRange(value)
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						defaultMonth={calendarRange?.from}
						selected={calendarRange}
						onSelect={handleCalendarSelect}
						numberOfMonths={2}
						locale={fr}
						disabled={{ after: new Date() }}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}

/**
 * Helper to get period label for display
 */
export function getPeriodLabel(range: DateRangeTimestamp): string {
	const preset = matchesPreset(range);
	if (preset) {
		const labels: Record<PresetPeriod, string> = {
			"7d": "7 derniers jours",
			"15d": "15 derniers jours",
			"30d": "30 derniers jours",
			"90d": "3 derniers mois",
			"180d": "6 derniers mois",
			"365d": "12 derniers mois",
			all: "Depuis le debut",
		};
		return labels[preset];
	}
	return formatDateRange(range);
}

/**
 * Helper to build URL search params from date range
 */
export function dateRangeToSearchParams(
	range: DateRangeTimestamp,
): URLSearchParams {
	const params = new URLSearchParams();
	params.set("from", range.from.toString());
	params.set("to", range.to.toString());
	return params;
}

/**
 * Helper to parse date range from URL search params
 */
export function searchParamsToDateRange(
	params: URLSearchParams,
): DateRangeTimestamp | null {
	const from = params.get("from");
	const to = params.get("to");

	if (from && to) {
		const fromNum = Number.parseInt(from, 10);
		const toNum = Number.parseInt(to, 10);
		if (!Number.isNaN(fromNum) && !Number.isNaN(toNum)) {
			return { from: fromNum, to: toNum };
		}
	}

	return null;
}

// Re-export legacy Period type for backward compatibility
export type Period = PresetPeriod;

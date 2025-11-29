import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

export type Period = "7d" | "15d" | "30d" | "90d" | "180d" | "365d" | "all";

interface PeriodFilterProps {
	value: Period;
	onChange: (period: Period) => void;
}

const periodOptions: { value: Period; label: string }[] = [
	{ value: "7d", label: "7 derniers jours" },
	{ value: "15d", label: "15 derniers jours" },
	{ value: "30d", label: "30 derniers jours" },
	{ value: "90d", label: "3 derniers mois" },
	{ value: "180d", label: "6 derniers mois" },
	{ value: "365d", label: "12 derniers mois" },
	{ value: "all", label: "Depuis le début" },
];

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
	return (
		<Select value={value} onValueChange={(v) => onChange(v as Period)}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Sélectionner une période" />
			</SelectTrigger>
			<SelectContent>
				{periodOptions.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export function getPeriodLabel(period: Period): string {
	const option = periodOptions.find((o) => o.value === period);
	return option?.label || "7 derniers jours";
}

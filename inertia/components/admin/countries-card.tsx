"use client";

import { DataCard, type DataCardColumn } from "./data-card";

interface Country {
	id: string;
	name: string;
	code: string;
	users: number;
	percentage: number;
}

interface CountriesCardProps {
	countries?: Country[];
}

// Mock data
const mockCountries: Country[] = [
	{ id: "1", name: "France", code: "FR", users: 4125, percentage: 53.1 },
	{ id: "2", name: "Belgique", code: "BE", users: 892, percentage: 11.5 },
	{ id: "3", name: "Canada", code: "CA", users: 756, percentage: 9.7 },
	{ id: "4", name: "Suisse", code: "CH", users: 621, percentage: 8.0 },
	{ id: "5", name: "États-Unis", code: "US", users: 534, percentage: 6.9 },
	{ id: "6", name: "Maroc", code: "MA", users: 312, percentage: 4.0 },
	{ id: "7", name: "Algérie", code: "DZ", users: 245, percentage: 3.2 },
	{ id: "8", name: "Tunisie", code: "TN", users: 156, percentage: 2.0 },
	{ id: "9", name: "Sénégal", code: "SN", users: 89, percentage: 1.1 },
	{ id: "10", name: "Autres", code: "XX", users: 34, percentage: 0.5 },
];

// Get flag emoji from country code
const getFlagEmoji = (countryCode: string) => {
	if (countryCode === "XX") return "🌍";
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt(0));
	return String.fromCodePoint(...codePoints);
};

const formatNumber = (num: number) => {
	return new Intl.NumberFormat("fr-FR").format(num);
};

const columns: DataCardColumn<Country>[] = [
	{
		key: "name",
		header: "Pays",
		render: (country) => (
			<span className="flex items-center gap-2 font-medium">
				<span className="text-lg">{getFlagEmoji(country.code)}</span>
				{country.name}
			</span>
		),
	},
	{
		key: "users",
		header: "Utilisateurs",
		render: (country) => (
			<span className="text-muted-foreground">
				{formatNumber(country.users)}
			</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (country) => (
			<span className="font-medium">{country.percentage}%</span>
		),
		className: "text-right",
	},
];

const modalColumns: DataCardColumn<Country>[] = [
	{
		key: "flag",
		header: "",
		render: (country) => (
			<span className="text-xl">{getFlagEmoji(country.code)}</span>
		),
		className: "w-10",
	},
	{
		key: "name",
		header: "Pays",
		render: (country) => <span className="font-medium">{country.name}</span>,
	},
	{
		key: "code",
		header: "Code",
		render: (country) => (
			<span className="text-muted-foreground font-mono text-xs">
				{country.code}
			</span>
		),
	},
	{
		key: "users",
		header: "Utilisateurs",
		render: (country) => (
			<span className="text-muted-foreground">
				{formatNumber(country.users)}
			</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (country) => (
			<span className="font-medium">{country.percentage}%</span>
		),
		className: "text-right",
	},
	{
		key: "bar",
		header: "Distribution",
		render: (country) => (
			<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
				<div
					className="h-full bg-primary rounded-full"
					style={{ width: `${country.percentage}%` }}
				/>
			</div>
		),
	},
];

export function CountriesCard({
	countries = mockCountries,
}: CountriesCardProps) {
	const totalUsers = countries.reduce((sum, c) => sum + c.users, 0);
	const displayedCountries = countries.slice(0, 5);

	return (
		<DataCard
			id="countries"
			title="Countries"
			count={totalUsers}
			data={displayedCountries}
			keyExtractor={(country) => country.id}
			columns={columns}
			modalColumns={modalColumns}
			modalTitle="User Distribution by Country"
			exportFilename="countries-export.csv"
			exportHeaders={["Pays", "Code", "Utilisateurs", "Pourcentage"]}
			exportRow={(country) => [
				country.name,
				country.code,
				country.users.toString(),
				`${country.percentage}%`,
			]}
			rowTooltip="Filtrer par pays"
			viewAllTooltip="Voir tous les pays"
			moreOptionsTooltip="Plus d'options"
			emptyMessage="Aucune donnée disponible"
			filterKey="country"
			getFilterValue={(country) => country.code}
		/>
	);
}

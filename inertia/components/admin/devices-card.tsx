"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { DataCard, type DataCardColumn } from "./data-card";

interface Device {
	id: string;
	name: string;
	type: "desktop" | "mobile" | "tablet";
	sessions: number;
	percentage: number;
}

interface DevicesCardProps {
	devices?: Device[];
}

// Mock data
const mockDevices: Device[] = [
	{ id: "1", name: "Desktop", type: "desktop", sessions: 4521, percentage: 58.2 },
	{ id: "2", name: "Mobile", type: "mobile", sessions: 2847, percentage: 36.7 },
	{ id: "3", name: "Tablet", type: "tablet", sessions: 396, percentage: 5.1 },
];

const getDeviceIcon = (type: Device["type"]) => {
	switch (type) {
		case "desktop":
			return <Monitor className="h-4 w-4 text-muted-foreground" />;
		case "mobile":
			return <Smartphone className="h-4 w-4 text-muted-foreground" />;
		case "tablet":
			return <Tablet className="h-4 w-4 text-muted-foreground" />;
	}
};

const formatNumber = (num: number) => {
	return new Intl.NumberFormat("fr-FR").format(num);
};

const columns: DataCardColumn<Device>[] = [
	{
		key: "name",
		header: "Device",
		render: (device) => (
			<span className="flex items-center gap-2 font-medium">
				{getDeviceIcon(device.type)}
				{device.name}
			</span>
		),
	},
	{
		key: "sessions",
		header: "Sessions",
		render: (device) => (
			<span className="text-muted-foreground">{formatNumber(device.sessions)}</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (device) => (
			<span className="font-medium">{device.percentage}%</span>
		),
		className: "text-right",
	},
];

const modalColumns: DataCardColumn<Device>[] = [
	...columns,
	{
		key: "bar",
		header: "Distribution",
		render: (device) => (
			<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
				<div
					className="h-full bg-primary rounded-full"
					style={{ width: `${device.percentage}%` }}
				/>
			</div>
		),
	},
];

export function DevicesCard({ devices = mockDevices }: DevicesCardProps) {
	const totalSessions = devices.reduce((sum, d) => sum + d.sessions, 0);

	return (
		<DataCard
			title="Devices"
			count={totalSessions}
			data={devices}
			keyExtractor={(device) => device.id}
			columns={columns}
			modalColumns={modalColumns}
			modalTitle="Device Analytics"
			exportFilename="devices-export.csv"
			exportHeaders={["Device", "Sessions", "Percentage"]}
			exportRow={(device) => [
				device.name,
				device.sessions.toString(),
				`${device.percentage}%`,
			]}
			rowTooltip="Filtrer par appareil"
			viewAllTooltip="Voir tous les appareils"
			moreOptionsTooltip="Plus d'options"
			emptyMessage="Aucune donnée disponible"
			filterKey="device"
			getFilterValue={(device) => device.type}
		/>
	);
}

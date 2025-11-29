"use client";

import { Chrome, Globe, Monitor, Smartphone, Tablet } from "lucide-react";
import { TabbedDataCard, type DataCardColumn, type DataCardTab } from "./data-card";

// Device types
interface Device {
	id: string;
	name: string;
	type: "desktop" | "mobile" | "tablet";
	sessions: number;
	percentage: number;
}

// Browser types
interface Browser {
	id: string;
	name: string;
	icon: string;
	sessions: number;
	percentage: number;
}

// Combined type for the tabbed card
type DeviceOrBrowser = Device | Browser;

interface DevicesBrowsersCardProps {
	devices?: Device[];
	browsers?: Browser[];
}

// Mock data
const mockDevices: Device[] = [
	{ id: "d1", name: "Desktop", type: "desktop", sessions: 4521, percentage: 58.2 },
	{ id: "d2", name: "Mobile", type: "mobile", sessions: 2847, percentage: 36.7 },
	{ id: "d3", name: "Tablet", type: "tablet", sessions: 396, percentage: 5.1 },
];

const mockBrowsers: Browser[] = [
	{ id: "b1", name: "Chrome", icon: "chrome", sessions: 4892, percentage: 63.0 },
	{ id: "b2", name: "Safari", icon: "safari", sessions: 1789, percentage: 23.0 },
	{ id: "b3", name: "Firefox", icon: "firefox", sessions: 621, percentage: 8.0 },
	{ id: "b4", name: "Edge", icon: "edge", sessions: 388, percentage: 5.0 },
	{ id: "b5", name: "Other", icon: "other", sessions: 74, percentage: 1.0 },
];

// Helper functions
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

const getBrowserIcon = (icon: string) => {
	if (icon === "chrome") {
		return <Chrome className="h-4 w-4 text-muted-foreground" />;
	}
	return <Globe className="h-4 w-4 text-muted-foreground" />;
};

const getBrowserColor = (name: string) => {
	switch (name.toLowerCase()) {
		case "chrome":
			return "bg-green-500";
		case "safari":
			return "bg-blue-500";
		case "firefox":
			return "bg-orange-500";
		case "edge":
			return "bg-cyan-500";
		default:
			return "bg-gray-500";
	}
};

const formatNumber = (num: number) => {
	return new Intl.NumberFormat("fr-FR").format(num);
};

// Device columns
const deviceColumns: DataCardColumn<Device>[] = [
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

const deviceModalColumns: DataCardColumn<Device>[] = [
	...deviceColumns,
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

// Browser columns
const browserColumns: DataCardColumn<Browser>[] = [
	{
		key: "name",
		header: "Browser",
		render: (browser) => (
			<span className="flex items-center gap-2 font-medium">
				{getBrowserIcon(browser.icon)}
				{browser.name}
			</span>
		),
	},
	{
		key: "sessions",
		header: "Sessions",
		render: (browser) => (
			<span className="text-muted-foreground">{formatNumber(browser.sessions)}</span>
		),
		className: "text-right",
	},
	{
		key: "percentage",
		header: "%",
		render: (browser) => (
			<span className="font-medium">{browser.percentage}%</span>
		),
		className: "text-right",
	},
];

const browserModalColumns: DataCardColumn<Browser>[] = [
	...browserColumns,
	{
		key: "bar",
		header: "Distribution",
		render: (browser) => (
			<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full ${getBrowserColor(browser.name)}`}
					style={{ width: `${browser.percentage}%` }}
				/>
			</div>
		),
	},
];

export function DevicesBrowsersCard({
	devices = mockDevices,
	browsers = mockBrowsers,
}: DevicesBrowsersCardProps) {
	const totalDeviceSessions = devices.reduce((sum, d) => sum + d.sessions, 0);
	const totalBrowserSessions = browsers.reduce((sum, b) => sum + b.sessions, 0);

	const tabs: DataCardTab<DeviceOrBrowser>[] = [
		{
			id: "devices",
			label: "Devices",
			data: devices as DeviceOrBrowser[],
			columns: deviceColumns as DataCardColumn<DeviceOrBrowser>[],
			modalColumns: deviceModalColumns as DataCardColumn<DeviceOrBrowser>[],
			keyExtractor: (item) => (item as Device).id,
			count: totalDeviceSessions,
			filterKey: "device",
			getFilterValue: (item) => (item as Device).type,
			emptyMessage: "Aucun appareil disponible",
			exportFilename: "devices-export.csv",
			exportHeaders: ["Device", "Sessions", "Percentage"],
			exportRow: (item) => {
				const device = item as Device;
				return [device.name, device.sessions.toString(), `${device.percentage}%`];
			},
		},
		{
			id: "browsers",
			label: "Browsers",
			data: browsers as DeviceOrBrowser[],
			columns: browserColumns as DataCardColumn<DeviceOrBrowser>[],
			modalColumns: browserModalColumns as DataCardColumn<DeviceOrBrowser>[],
			keyExtractor: (item) => (item as Browser).id,
			count: totalBrowserSessions,
			filterKey: "browser",
			getFilterValue: (item) => (item as Browser).name.toLowerCase(),
			emptyMessage: "Aucun navigateur disponible",
			exportFilename: "browsers-export.csv",
			exportHeaders: ["Browser", "Sessions", "Percentage"],
			exportRow: (item) => {
				const browser = item as Browser;
				return [browser.name, browser.sessions.toString(), `${browser.percentage}%`];
			},
		},
	];

	return (
		<TabbedDataCard
			tabs={tabs}
			defaultTab="devices"
			modalTitle="Device & Browser Analytics"
			rowTooltip="Cliquer pour filtrer"
			viewAllTooltip="Voir tout"
			moreOptionsTooltip="Plus d'options"
		/>
	);
}

"use client";

import { router } from "@inertiajs/react";
import { Download, Ellipsis, Inbox, Loader2, Maximize2, MoreHorizontal } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Separator } from "~/components/ui/separator";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "~/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";

// Maximum items to display in card view
const MAX_CARD_ITEMS = 5;

// Action definition for row actions
export interface DataCardAction<T> {
	id: string;
	label: string;
	icon?: ReactNode;
	onClick: (item: T) => void | Promise<void>;
	variant?: "default" | "destructive";
	// Show separator before this action
	separator?: boolean;
	// Condition to show/hide action
	show?: (item: T) => boolean;
	// Disable condition
	disabled?: (item: T) => boolean;
}

// Column definition for the table
export interface DataCardColumn<T> {
	key: keyof T | string;
	header: string;
	render: (item: T) => ReactNode;
	className?: string;
}

// Tab definition for multi-view support
export interface DataCardTab<T> {
	id: string;
	label: string;
	data: T[];
	// All data for modal (loaded on demand)
	allData?: T[];
	columns: DataCardColumn<T>[];
	modalColumns?: DataCardColumn<T>[];
	filterKey?: string;
	getFilterValue?: (item: T) => string;
	keyExtractor: (item: T) => string;
	count?: number;
	emptyMessage?: string;
	exportFilename?: string;
	exportHeaders?: string[];
	exportRow?: (item: T) => string[];
	// Row actions for this tab
	actions?: DataCardAction<T>[];
}

// Props for the DataCard component (single view - backwards compatible)
export interface DataCardProps<T> {
	// Card header
	title: string;
	count?: number;

	// Data (limited to 5 for card view)
	data: T[];
	// All data for modal (optional - loaded on demand)
	allData?: T[];
	keyExtractor: (item: T) => string;

	// Table columns for card view (simplified)
	columns: DataCardColumn<T>[];

	// Modal columns (can be different/more detailed)
	modalColumns?: DataCardColumn<T>[];

	// Modal settings
	modalTitle?: string;

	// Export settings
	exportFilename?: string;
	exportHeaders?: string[];
	exportRow?: (item: T) => string[];

	// Tooltips
	rowTooltip?: string;
	viewAllTooltip?: string;
	moreOptionsTooltip?: string;

	// Empty state
	emptyMessage?: string;

	// Row click handler
	onRowClick?: (item: T) => void;

	// Filter settings for URL params
	filterKey?: string;
	getFilterValue?: (item: T) => string;

	// Callback to load all data when opening modal
	onLoadAll?: () => Promise<T[]> | T[];

	// Row actions
	actions?: DataCardAction<T>[];
}

// Props for tabbed DataCard
export interface TabbedDataCardProps<T> {
	// Tabs configuration
	tabs: DataCardTab<T>[];
	defaultTab?: string;

	// Modal settings
	modalTitle?: string;

	// Tooltips
	rowTooltip?: string;
	viewAllTooltip?: string;
	moreOptionsTooltip?: string;

	// Row click handler (applies to all tabs)
	onRowClick?: (item: T) => void;

	// Callback to load all data for a specific tab when opening modal
	onLoadAll?: (tabId: string) => Promise<T[]> | T[];
}

// Row Actions Menu component
function RowActionsMenu<T>({
	item,
	actions,
}: {
	item: T;
	actions: DataCardAction<T>[];
}) {
	const [isLoading, setIsLoading] = useState<string | null>(null);

	const visibleActions = actions.filter((action) => !action.show || action.show(item));

	if (visibleActions.length === 0) return null;

	const handleAction = async (action: DataCardAction<T>, e: React.MouseEvent) => {
		e.stopPropagation();
		if (action.disabled?.(item)) return;

		setIsLoading(action.id);
		try {
			await action.onClick(item);
		} finally {
			setIsLoading(null);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
				<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
					<MoreHorizontal className="h-4 w-4" />
					<span className="sr-only">Actions</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{visibleActions.map((action, index) => (
					<div key={action.id}>
						{action.separator && index > 0 && <DropdownMenuSeparator />}
						<DropdownMenuItem
							onClick={(e) => handleAction(action, e)}
							disabled={action.disabled?.(item) || isLoading === action.id}
							className={action.variant === "destructive" ? "text-destructive focus:text-destructive" : ""}
						>
							{isLoading === action.id ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								action.icon && <span className="mr-2">{action.icon}</span>
							)}
							{action.label}
						</DropdownMenuItem>
					</div>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// Single view DataCard component
export function DataCard<T>({
	title,
	count,
	data,
	allData,
	keyExtractor,
	columns,
	modalColumns,
	modalTitle,
	exportFilename = "export.csv",
	exportHeaders,
	exportRow,
	rowTooltip = "Click to filter",
	viewAllTooltip = "View all",
	moreOptionsTooltip = "More options",
	emptyMessage = "No data found for selected period.",
	onRowClick,
	filterKey,
	getFilterValue,
	onLoadAll,
	actions,
}: DataCardProps<T>) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [modalData, setModalData] = useState<T[] | null>(null);

	// Limit card display to MAX_CARD_ITEMS
	const cardData = data.slice(0, MAX_CARD_ITEMS);

	const handleRowClick = (item: T) => {
		if (onRowClick) {
			onRowClick(item);
			return;
		}

		if (filterKey && getFilterValue) {
			const filterValue = getFilterValue(item);
			const currentParams = new URLSearchParams(window.location.search);
			currentParams.set(filterKey, filterValue);

			router.get(
				window.location.pathname,
				Object.fromEntries(currentParams.entries()),
				{
					preserveState: true,
					preserveScroll: true,
					replace: true,
					only: [],
				}
			);
		}
	};

	const handleOpenModal = async () => {
		setIsModalOpen(true);

		// If we have allData, use it
		if (allData) {
			setModalData(allData);
			return;
		}

		// If we have onLoadAll callback, fetch data
		if (onLoadAll) {
			setIsLoading(true);
			try {
				const loadedData = await onLoadAll();
				setModalData(loadedData);
			} catch (error) {
				console.error("Failed to load all data:", error);
				setModalData(data); // Fallback to current data
			} finally {
				setIsLoading(false);
			}
			return;
		}

		// Otherwise use current data
		setModalData(data);
	};

	const handleCloseModal = (open: boolean) => {
		setIsModalOpen(open);
		if (!open) {
			// Reset modal data when closing (to force reload next time if using onLoadAll)
			if (onLoadAll) {
				setModalData(null);
			}
		}
	};

	const effectiveModalColumns = modalColumns || columns;
	const effectiveModalTitle = modalTitle || `All ${title}`;
	const displayCount = count ?? data.length;
	const displayModalData = modalData || data;

	const exportToCSV = () => {
		if (!exportHeaders || !exportRow) return;

		const exportData = displayModalData;
		const csvContent = [
			exportHeaders.join(","),
			...exportData.map((item) =>
				exportRow(item)
					.map((cell) => `"${cell}"`)
					.join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", exportFilename);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const canExport = exportHeaders && exportRow;

	return (
		<>
			<Card className="p-0 gap-0">
				<CardHeader className="p-4 justify-between items-center flex flex-row">
					<CardTitle className="flex items-center gap-2">{title}</CardTitle>
					<span className="text-sm font-medium tabular-nums">{displayCount}</span>
				</CardHeader>
				<Separator />
				<CardContent className="p-0">
					<Table>
						<TableBody>
							{cardData.length > 0 ? (
								cardData.map((item) => (
									<Tooltip key={keyExtractor(item)}>
										<TooltipTrigger asChild>
											<TableRow
												className={`border-b-0 hover:bg-muted/50 ${!actions ? "cursor-pointer hover:shadow-[inset_2px_0_0_0_black]" : ""}`}
												onClick={() => !actions && handleRowClick(item)}
											>
												{columns.map((column) => (
													<td
														key={String(column.key)}
														className={`p-2 align-middle whitespace-nowrap ${column.className || ""}`}
													>
														{column.render(item)}
													</td>
												))}
												{actions && actions.length > 0 && (
													<td className="p-2 align-middle whitespace-nowrap w-10">
														<RowActionsMenu item={item} actions={actions} />
													</td>
												)}
											</TableRow>
										</TooltipTrigger>
										{!actions && (
											<TooltipContent
												className="text-accent-foreground"
												hideArrow
											>
												{rowTooltip}
											</TooltipContent>
										)}
									</Tooltip>
								))
							) : (
								<TableRow>
									<td colSpan={columns.length} className="p-8">
										<div className="flex flex-col items-center justify-center">
											<Inbox className="h-8 w-8 text-muted-foreground/50 mb-2" />
											<span className="text-sm text-muted-foreground">
												{emptyMessage}
											</span>
										</div>
									</td>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardContent>
				<CardFooter className="flex items-center justify-center gap-2 p-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full gap-2"
								variant="outline"
								size="sm"
								onClick={handleOpenModal}
							>
								View All
								<Maximize2 className="h-3 w-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent hideArrow className="text-accent-foreground">
							{viewAllTooltip}
						</TooltipContent>
					</Tooltip>
					{canExport && (
						<DropdownMenu>
							<Tooltip>
								<TooltipTrigger asChild>
									<DropdownMenuTrigger asChild>
										<Button
											className="rounded-full gap-2"
											variant="outline"
											size="sm"
										>
											<Ellipsis className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
								</TooltipTrigger>
								<TooltipContent className="text-accent-foreground" hideArrow>
									{moreOptionsTooltip}
								</TooltipContent>
							</Tooltip>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={exportToCSV}>
									<Download className="mr-2 h-4 w-4" />
									Export CSV
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</CardFooter>
			</Card>

			<Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
				<DialogContent className="max-w-4xl h-[80vh] overflow-hidden flex flex-col">
					<DialogHeader>
						<DialogTitle>{effectiveModalTitle}</DialogTitle>
					</DialogHeader>
					<div className="flex-1 overflow-auto">
						{isLoading ? (
							<div className="flex items-center justify-center h-full">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										{effectiveModalColumns.map((column) => (
											<TableHead key={String(column.key)}>
												{column.header}
											</TableHead>
										))}
										{actions && actions.length > 0 && (
											<TableHead className="w-10">Actions</TableHead>
										)}
									</TableRow>
								</TableHeader>
								<TableBody>
									{displayModalData.map((item) => (
										<TableRow key={keyExtractor(item)}>
											{effectiveModalColumns.map((column) => (
												<td
													key={String(column.key)}
													className={`p-2 align-middle whitespace-nowrap ${column.className || ""}`}
												>
													{column.render(item)}
												</td>
											))}
											{actions && actions.length > 0 && (
												<td className="p-2 align-middle whitespace-nowrap w-10">
													<RowActionsMenu item={item} actions={actions} />
												</td>
											)}
										</TableRow>
									))}
									{displayModalData.length === 0 && (
										<TableRow>
											<td colSpan={effectiveModalColumns.length + (actions ? 1 : 0)} className="p-8">
												<div className="flex flex-col items-center justify-center">
													<Inbox className="h-8 w-8 text-muted-foreground/50 mb-2" />
													<span className="text-sm text-muted-foreground">
														{emptyMessage}
													</span>
												</div>
											</td>
										</TableRow>
									)}
								</TableBody>
							</Table>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

// Tabbed DataCard component for multiple views
export function TabbedDataCard<T>({
	tabs,
	defaultTab,
	modalTitle,
	rowTooltip = "Click to filter",
	viewAllTooltip = "View all",
	moreOptionsTooltip = "More options",
	onRowClick,
	onLoadAll,
}: TabbedDataCardProps<T>) {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [modalDataByTab, setModalDataByTab] = useState<Record<string, T[]>>({});

	const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

	const handleRowClick = (item: T, tab: DataCardTab<T>) => {
		if (onRowClick) {
			onRowClick(item);
			return;
		}

		if (tab.filterKey && tab.getFilterValue) {
			const filterValue = tab.getFilterValue(item);
			const currentParams = new URLSearchParams(window.location.search);
			currentParams.set(tab.filterKey, filterValue);

			router.get(
				window.location.pathname,
				Object.fromEntries(currentParams.entries()),
				{
					preserveState: true,
					preserveScroll: true,
					replace: true,
					only: [],
				}
			);
		}
	};

	const handleOpenModal = async () => {
		setIsModalOpen(true);

		// Load all data for current tab if not already loaded
		if (!modalDataByTab[currentTab.id]) {
			// If tab has allData, use it
			if (currentTab.allData) {
				setModalDataByTab((prev) => ({
					...prev,
					[currentTab.id]: currentTab.allData!,
				}));
				return;
			}

			// If we have onLoadAll callback, fetch data
			if (onLoadAll) {
				setIsLoading(true);
				try {
					const loadedData = await onLoadAll(currentTab.id);
					setModalDataByTab((prev) => ({
						...prev,
						[currentTab.id]: loadedData,
					}));
				} catch (error) {
					console.error("Failed to load all data:", error);
					setModalDataByTab((prev) => ({
						...prev,
						[currentTab.id]: currentTab.data,
					}));
				} finally {
					setIsLoading(false);
				}
				return;
			}

			// Otherwise use current data
			setModalDataByTab((prev) => ({
				...prev,
				[currentTab.id]: currentTab.data,
			}));
		}
	};

	const handleTabChange = async (tabId: string) => {
		setActiveTab(tabId);

		// If modal is open and we don't have data for this tab, load it
		if (isModalOpen && !modalDataByTab[tabId]) {
			const tab = tabs.find((t) => t.id === tabId);
			if (!tab) return;

			if (tab.allData) {
				setModalDataByTab((prev) => ({
					...prev,
					[tabId]: tab.allData!,
				}));
				return;
			}

			if (onLoadAll) {
				setIsLoading(true);
				try {
					const loadedData = await onLoadAll(tabId);
					setModalDataByTab((prev) => ({
						...prev,
						[tabId]: loadedData,
					}));
				} catch (error) {
					console.error("Failed to load all data:", error);
					setModalDataByTab((prev) => ({
						...prev,
						[tabId]: tab.data,
					}));
				} finally {
					setIsLoading(false);
				}
				return;
			}

			setModalDataByTab((prev) => ({
				...prev,
				[tabId]: tab.data,
			}));
		}
	};

	const handleCloseModal = (open: boolean) => {
		setIsModalOpen(open);
		if (!open && onLoadAll) {
			// Reset modal data when closing (to force reload next time)
			setModalDataByTab({});
		}
	};

	const exportToCSV = (tab: DataCardTab<T>) => {
		if (!tab.exportHeaders || !tab.exportRow) return;

		const exportData = modalDataByTab[tab.id] || tab.data;
		const csvContent = [
			tab.exportHeaders.join(","),
			...exportData.map((item) =>
				tab.exportRow!(item)
					.map((cell) => `"${cell}"`)
					.join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", tab.exportFilename || "export.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const effectiveModalTitle = modalTitle || `All ${currentTab?.label || "Data"}`;

	return (
		<>
			<Card className="p-0 gap-0">
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<CardHeader className="p-4 justify-between items-center flex flex-row">
						<TabsList className="h-8">
							{tabs.map((tab) => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									className="text-xs px-3"
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
						<span className="text-sm font-medium tabular-nums">
							{currentTab?.count ?? currentTab?.data.length ?? 0}
						</span>
					</CardHeader>
					<Separator />
					<CardContent className="p-0">
						{tabs.map((tab) => {
							// Limit card display to MAX_CARD_ITEMS
							const cardData = tab.data.slice(0, MAX_CARD_ITEMS);
							return (
								<TabsContent key={tab.id} value={tab.id} className="m-0">
									<Table>
										<TableBody>
											{cardData.length > 0 ? (
												cardData.map((item) => (
													<Tooltip key={tab.keyExtractor(item)}>
														<TooltipTrigger asChild>
															<TableRow
																className={`border-b-0 hover:bg-muted/50 ${!tab.actions ? "cursor-pointer hover:shadow-[inset_2px_0_0_0_black]" : ""}`}
																onClick={() => !tab.actions && handleRowClick(item, tab)}
															>
																{tab.columns.map((column) => (
																	<td
																		key={String(column.key)}
																		className={`p-2 align-middle whitespace-nowrap ${column.className || ""}`}
																	>
																		{column.render(item)}
																	</td>
																))}
																{tab.actions && tab.actions.length > 0 && (
																	<td className="p-2 align-middle whitespace-nowrap w-10">
																		<RowActionsMenu item={item} actions={tab.actions} />
																	</td>
																)}
															</TableRow>
														</TooltipTrigger>
														{!tab.actions && (
															<TooltipContent
																className="text-accent-foreground"
																hideArrow
															>
																{rowTooltip}
															</TooltipContent>
														)}
													</Tooltip>
												))
											) : (
												<TableRow>
													<td colSpan={tab.columns.length} className="p-8">
														<div className="flex flex-col items-center justify-center">
															<Inbox className="h-8 w-8 text-muted-foreground/50 mb-2" />
															<span className="text-sm text-muted-foreground">
																{tab.emptyMessage || "No data found for selected period."}
															</span>
														</div>
													</td>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</TabsContent>
							);
						})}
					</CardContent>
				</Tabs>
				<CardFooter className="flex items-center justify-center gap-2 p-4">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="rounded-full gap-2"
								variant="outline"
								size="sm"
								onClick={handleOpenModal}
							>
								View All
								<Maximize2 className="h-3 w-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent hideArrow className="text-accent-foreground">
							{viewAllTooltip}
						</TooltipContent>
					</Tooltip>
					{currentTab?.exportHeaders && currentTab?.exportRow && (
						<DropdownMenu>
							<Tooltip>
								<TooltipTrigger asChild>
									<DropdownMenuTrigger asChild>
										<Button
											className="rounded-full gap-2"
											variant="outline"
											size="sm"
										>
											<Ellipsis className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
								</TooltipTrigger>
								<TooltipContent className="text-accent-foreground" hideArrow>
									{moreOptionsTooltip}
								</TooltipContent>
							</Tooltip>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => exportToCSV(currentTab)}>
									<Download className="mr-2 h-4 w-4" />
									Export CSV
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</CardFooter>
			</Card>

			<Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
				<DialogContent className="max-w-4xl h-[80vh] overflow-hidden flex flex-col">
					<DialogHeader>
						<DialogTitle>{effectiveModalTitle}</DialogTitle>
					</DialogHeader>
					<Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
						<TabsList className="w-fit">
							{tabs.map((tab) => (
								<TabsTrigger key={tab.id} value={tab.id}>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
						<div className="flex-1 overflow-auto mt-4">
							{isLoading ? (
								<div className="flex items-center justify-center h-full">
									<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
								</div>
							) : (
								tabs.map((tab) => {
									const modalCols = tab.modalColumns || tab.columns;
									const displayData = modalDataByTab[tab.id] || tab.data;
									return (
										<TabsContent key={tab.id} value={tab.id} className="m-0 h-full">
											<Table>
												<TableHeader>
													<TableRow>
														{modalCols.map((column) => (
															<TableHead key={String(column.key)}>
																{column.header}
															</TableHead>
														))}
														{tab.actions && tab.actions.length > 0 && (
															<TableHead className="w-10">Actions</TableHead>
														)}
													</TableRow>
												</TableHeader>
												<TableBody>
													{displayData.map((item) => (
														<TableRow key={tab.keyExtractor(item)}>
															{modalCols.map((column) => (
																<td
																	key={String(column.key)}
																	className={`p-2 align-middle whitespace-nowrap ${column.className || ""}`}
																>
																	{column.render(item)}
																</td>
															))}
															{tab.actions && tab.actions.length > 0 && (
																<td className="p-2 align-middle whitespace-nowrap w-10">
																	<RowActionsMenu item={item} actions={tab.actions} />
																</td>
															)}
														</TableRow>
													))}
													{displayData.length === 0 && (
														<TableRow>
															<td colSpan={modalCols.length + (tab.actions ? 1 : 0)} className="p-8">
																<div className="flex flex-col items-center justify-center">
																	<Inbox className="h-8 w-8 text-muted-foreground/50 mb-2" />
																	<span className="text-sm text-muted-foreground">
																		{tab.emptyMessage || "No data found for selected period."}
																	</span>
																</div>
															</td>
														</TableRow>
													)}
												</TableBody>
											</Table>
										</TabsContent>
									);
								})
							)}
						</div>
					</Tabs>
				</DialogContent>
			</Dialog>
		</>
	);
}

import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BuilderCanvas } from "../../components/builder/BuilderCanvas";
import {
	BuilderProvider,
	useBuilder,
} from "../../components/builder/BuilderContext";
import { BuilderSidebar } from "../../components/builder/BuilderSidebar";
import { BuilderToolbar } from "../../components/builder/BuilderToolbar";
import {
	CanvasControls,
	useCanvasControls,
	ZoomableCanvas,
} from "../../components/builder/CanvasControls";
import { EditPanel } from "../../components/builder/EditPanel";
import { SitemapPanel } from "../../components/builder/SitemapPanel";
import { Button } from "../../components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../../components/ui/tooltip";
import { cn } from "../../lib/utils";
import type { Proposal } from "../../types";
import type { PageLayout, Section, SectionSettings } from "../../types/builder";
import { SECTION_METADATA } from "../../types/builder";

interface BuilderPageProps {
	proposal: Proposal;
	initialLayout: PageLayout | null;
	savedAt?: string;
}

function BuilderContent({
	proposal,
	initialLayout,
	savedAt,
}: BuilderPageProps) {
	const builder = useBuilder();
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState<Date | null>(
		savedAt ? new Date(savedAt) : null,
	);

	// UI State
	const [leftPanelMode, setLeftPanelMode] = useState<"sections" | "structure">(
		"sections",
	);
	const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
	const [rightPanelOpen, setRightPanelOpen] = useState(false);

	// Canvas controls
	const canvasControls = useCanvasControls();

	// Initialize layout
	useEffect(() => {
		if (initialLayout) {
			builder.setLayout(initialLayout);
		}
	}, [initialLayout, builder.setLayout]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Undo/Redo
			if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
				e.preventDefault();
				if (builder.canUndo()) {
					builder.undo();
				}
			}
			if (
				(e.ctrlKey || e.metaKey) &&
				(e.key === "y" || (e.key === "z" && e.shiftKey))
			) {
				e.preventDefault();
				if (builder.canRedo()) {
					builder.redo();
				}
			}
			// Save
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault();
				handleSave();
			}
			// Toggle panels
			if (e.key === "[" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				setLeftPanelCollapsed((c) => !c);
			}
			if (e.key === "]" && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				setRightPanelOpen((o) => !o);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [builder]);

	// Save handler
	const handleSave = useCallback(async () => {
		setIsSaving(true);
		try {
			await new Promise<void>((resolve, reject) => {
				router.put(
					`/proposals/${proposal.id}/layout`,
					{ pageLayout: builder.layout },
					{
						preserveState: true,
						preserveScroll: true,
						onSuccess: () => {
							setLastSaved(new Date());
							resolve();
						},
						onError: (errors) => {
							console.error("Erreur de sauvegarde:", errors);
							reject(errors);
						},
					},
				);
			});
		} finally {
			setIsSaving(false);
		}
	}, [proposal.id, builder.layout]);

	// Preview handler
	const handlePreview = useCallback(() => {
		window.open(`/proposals/${proposal.id}/preview`, "_blank");
	}, [proposal.id]);

	// Unsaved changes warning
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (builder.hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [builder.hasUnsavedChanges]);

	// Get selected section for edit panel
	const selectedSection = builder.selectedSectionId
		? builder.layout.sections.find((s) => s.id === builder.selectedSectionId)
		: null;

	// Section handlers
	const handleSelectSection = useCallback(
		(sectionId: string) => {
			builder.selectSection(sectionId);
			setRightPanelOpen(true);
		},
		[builder],
	);

	const handleReorderSections = useCallback(
		(fromIndex: number, toIndex: number) => {
			builder.moveSection(fromIndex, toIndex);
		},
		[builder],
	);

	const handleToggleSectionVisibility = useCallback(
		(sectionId: string) => {
			builder.toggleSectionVisibility(sectionId);
		},
		[builder],
	);

	const handleToggleSectionLock = useCallback(
		(sectionId: string) => {
			const section = builder.layout.sections.find((s) => s.id === sectionId);
			if (section) {
				builder.updateSection(sectionId, { locked: !section.locked });
			}
		},
		[builder],
	);

	// Edit panel handlers
	const handleUpdateSectionSettings = useCallback(
		(settings: Partial<SectionSettings>) => {
			if (builder.selectedSectionId) {
				builder.updateSectionSettings(builder.selectedSectionId, settings);
			}
		},
		[builder],
	);

	const handleUpdateSection = useCallback(
		(updates: Partial<Section>) => {
			if (builder.selectedSectionId) {
				builder.updateSection(builder.selectedSectionId, updates);
			}
		},
		[builder],
	);

	const handleDuplicateSection = useCallback(() => {
		if (builder.selectedSectionId) {
			builder.duplicateSection(builder.selectedSectionId);
		}
	}, [builder]);

	const handleDeleteSection = useCallback(() => {
		if (builder.selectedSectionId) {
			builder.removeSection(builder.selectedSectionId);
			setRightPanelOpen(false);
		}
	}, [builder]);

	const handleToggleSelectedSectionVisibility = useCallback(() => {
		if (builder.selectedSectionId) {
			builder.toggleSectionVisibility(builder.selectedSectionId);
		}
	}, [builder]);

	const handleToggleSelectedSectionLock = useCallback(() => {
		if (builder.selectedSectionId && selectedSection) {
			builder.updateSection(builder.selectedSectionId, {
				locked: !selectedSection.locked,
			});
		}
	}, [builder, selectedSection]);

	const handleResetSection = useCallback(() => {
		if (builder.selectedSectionId && selectedSection) {
			const meta = SECTION_METADATA[selectedSection.type];
			builder.updateSection(builder.selectedSectionId, {
				settings: { ...meta.defaultSettings },
			});
		}
	}, [builder, selectedSection]);

	// Auto-open edit panel when section is selected
	useEffect(() => {
		if (builder.selectedSectionId) {
			setRightPanelOpen(true);
		}
	}, [builder.selectedSectionId]);

	return (
		<TooltipProvider>
			<div className="h-screen flex flex-col bg-muted/30">
				<Head title={`Builder - ${proposal.title}`} />

				{/* Top Bar */}
				<div className="flex items-center gap-4 h-12 px-4 border-b bg-background">
					<Link
						href={`/proposals/${proposal.id}/edit`}
						className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Retour a l'edition
					</Link>
					<div className="h-4 w-px bg-border" />
					<span className="text-sm font-medium">{proposal.title}</span>
				</div>

				{/* Toolbar */}
				<BuilderToolbar
					proposalId={proposal.id}
					proposalTitle={proposal.title}
					onPreview={handlePreview}
					onSave={handleSave}
					isSaving={isSaving}
					lastSaved={lastSaved}
				/>

				{/* Main Content */}
				<div className="flex flex-1 overflow-hidden">
					{/* Left Panel */}
					<div
						className={cn(
							"flex flex-col border-r border-border bg-background transition-all duration-200",
							leftPanelCollapsed ? "w-12" : "w-72",
						)}
					>
						{leftPanelCollapsed ? (
							/* Collapsed Panel */
							<div className="flex flex-col items-center py-4 gap-2">
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setLeftPanelCollapsed(false)}
										>
											<PanelLeftOpen className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent side="right">
										Ouvrir le panneau
									</TooltipContent>
								</Tooltip>
							</div>
						) : (
							/* Expanded Panel */
							<>
								{/* Panel Mode Toggle */}
								<div className="flex items-center border-b border-border">
									<button
										className={cn(
											"flex-1 py-2 px-4 text-xs font-medium transition-colors",
											leftPanelMode === "sections"
												? "bg-muted text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
										onClick={() => setLeftPanelMode("sections")}
									>
										Sections
									</button>
									<button
										className={cn(
											"flex-1 py-2 px-4 text-xs font-medium transition-colors",
											leftPanelMode === "structure"
												? "bg-muted text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
										onClick={() => setLeftPanelMode("structure")}
									>
										Structure
									</button>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 mx-1"
												onClick={() => setLeftPanelCollapsed(true)}
											>
												<PanelLeftClose className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Fermer (Cmd+[)</TooltipContent>
									</Tooltip>
								</div>

								{/* Panel Content */}
								{leftPanelMode === "sections" ? (
									<BuilderSidebar />
								) : (
									<SitemapPanel
										sections={builder.layout.sections}
										selectedSectionId={builder.selectedSectionId}
										onSelectSection={handleSelectSection}
										onReorderSections={handleReorderSections}
										onToggleVisibility={handleToggleSectionVisibility}
										onToggleLock={handleToggleSectionLock}
									/>
								)}
							</>
						)}
					</div>

					{/* Canvas */}
					<ZoomableCanvas
						zoom={canvasControls.zoom}
						position={canvasControls.position}
						viewportWidth={canvasControls.getViewportWidth()}
						isPanning={canvasControls.isPanning}
						mode={canvasControls.mode}
						onPanStart={canvasControls.handlePanStart}
						onPanMove={canvasControls.handlePanMove}
						onPanEnd={canvasControls.handlePanEnd}
						onWheel={canvasControls.handleWheel}
					>
						<BuilderCanvas />
					</ZoomableCanvas>

					{/* Right Panel (Edit Panel) */}
					{rightPanelOpen && selectedSection && (
						<EditPanel
							section={selectedSection}
							onUpdateSettings={handleUpdateSectionSettings}
							onUpdateSection={handleUpdateSection}
							onDuplicate={handleDuplicateSection}
							onDelete={handleDeleteSection}
							onToggleVisibility={handleToggleSelectedSectionVisibility}
							onToggleLock={handleToggleSelectedSectionLock}
							onReset={handleResetSection}
						/>
					)}
				</div>

				{/* Bottom Canvas Controls */}
				<CanvasControls
					zoom={canvasControls.zoom}
					onZoomChange={canvasControls.setZoom}
					viewport={canvasControls.viewport}
					onViewportChange={canvasControls.setViewport}
					mode={canvasControls.mode}
					onModeChange={canvasControls.setMode}
					onFitToScreen={canvasControls.fitToScreen}
					onResetView={canvasControls.resetView}
				/>
			</div>
		</TooltipProvider>
	);
}

export default function BuilderPage({
	proposal,
	initialLayout,
	savedAt,
}: BuilderPageProps) {
	return (
		<BuilderProvider initialLayout={initialLayout || undefined}>
			<BuilderContent
				proposal={proposal}
				initialLayout={initialLayout}
				savedAt={savedAt}
			/>
		</BuilderProvider>
	);
}

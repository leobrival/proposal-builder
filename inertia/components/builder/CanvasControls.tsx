import {
	Maximize2,
	Minus,
	Monitor,
	MousePointer2,
	Move,
	Plus,
	RotateCcw,
	Smartphone,
	Tablet,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

export type ViewportSize = "mobile" | "tablet" | "desktop" | "full";
export type CanvasMode = "select" | "pan";

interface CanvasControlsProps {
	zoom: number;
	onZoomChange: (zoom: number) => void;
	viewport: ViewportSize;
	onViewportChange: (viewport: ViewportSize) => void;
	mode: CanvasMode;
	onModeChange: (mode: CanvasMode) => void;
	onFitToScreen: () => void;
	onResetView: () => void;
}

export function CanvasControls({
	zoom,
	onZoomChange,
	viewport,
	onViewportChange,
	mode,
	onModeChange,
	onFitToScreen,
	onResetView,
}: CanvasControlsProps) {
	const zoomLevels = [25, 50, 75, 100, 125, 150, 200];

	const handleZoomIn = () => {
		const currentIndex = zoomLevels.findIndex((z) => z >= zoom);
		if (currentIndex < zoomLevels.length - 1) {
			onZoomChange(zoomLevels[currentIndex + 1]);
		}
	};

	const handleZoomOut = () => {
		const currentIndex = zoomLevels.findIndex((z) => z >= zoom);
		if (currentIndex > 0) {
			onZoomChange(zoomLevels[currentIndex - 1]);
		}
	};

	return (
		<TooltipProvider>
			<div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-2 bg-background/95 backdrop-blur border border-border rounded-lg shadow-lg">
				{/* Mode Toggle */}
				<div className="flex items-center gap-1 pr-2 border-r border-border">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={mode === "select" ? "secondary" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => onModeChange("select")}
							>
								<MousePointer2 className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Selection (V)</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={mode === "pan" ? "secondary" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => onModeChange("pan")}
							>
								<Move className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Deplacer (Espace)</TooltipContent>
					</Tooltip>
				</div>

				{/* Zoom Controls */}
				<div className="flex items-center gap-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleZoomOut}
								disabled={zoom <= 25}
							>
								<Minus className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Zoom arriere (Cmd+-)</TooltipContent>
					</Tooltip>

					<div className="w-20 px-2">
						<Slider
							value={[zoom]}
							onValueChange={([v]) => onZoomChange(v)}
							min={25}
							max={200}
							step={5}
							className="cursor-pointer"
						/>
					</div>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleZoomIn}
								disabled={zoom >= 200}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Zoom avant (Cmd++)</TooltipContent>
					</Tooltip>

					<button
						className="min-w-[48px] h-8 px-2 text-xs font-medium hover:bg-muted rounded transition-colors"
						onClick={() => onZoomChange(100)}
					>
						{zoom}%
					</button>
				</div>

				{/* Viewport Controls */}
				<div className="flex items-center gap-1 pl-2 border-l border-border">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={viewport === "mobile" ? "secondary" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => onViewportChange("mobile")}
							>
								<Smartphone className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Mobile (375px)</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={viewport === "tablet" ? "secondary" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => onViewportChange("tablet")}
							>
								<Tablet className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Tablette (768px)</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={viewport === "desktop" ? "secondary" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => onViewportChange("desktop")}
							>
								<Monitor className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Desktop (1280px)</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={viewport === "full" ? "secondary" : "ghost"}
								size="icon"
								className="h-8 w-8"
								onClick={() => onViewportChange("full")}
							>
								<Maximize2 className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Pleine largeur</TooltipContent>
					</Tooltip>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-1 pl-2 border-l border-border">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={onFitToScreen}
							>
								<Maximize2 className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Ajuster a l'ecran (Cmd+0)</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={onResetView}
							>
								<RotateCcw className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Reinitialiser la vue</TooltipContent>
					</Tooltip>
				</div>
			</div>
		</TooltipProvider>
	);
}

// Hook for canvas zoom and pan
export function useCanvasControls() {
	const [zoom, setZoom] = useState(100);
	const [viewport, setViewport] = useState<ViewportSize>("desktop");
	const [mode, setMode] = useState<CanvasMode>("select");
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const lastPanPosition = useRef({ x: 0, y: 0 });

	// Get viewport width
	const getViewportWidth = useCallback(() => {
		switch (viewport) {
			case "mobile":
				return 375;
			case "tablet":
				return 768;
			case "desktop":
				return 1280;
			case "full":
				return "100%";
		}
	}, [viewport]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Zoom shortcuts
			if ((e.metaKey || e.ctrlKey) && e.key === "=") {
				e.preventDefault();
				setZoom((z) => Math.min(z + 25, 200));
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "-") {
				e.preventDefault();
				setZoom((z) => Math.max(z - 25, 25));
			}
			if ((e.metaKey || e.ctrlKey) && e.key === "0") {
				e.preventDefault();
				setZoom(100);
				setPosition({ x: 0, y: 0 });
			}

			// Mode shortcuts
			if (e.key === "v" && !e.metaKey && !e.ctrlKey) {
				setMode("select");
			}
			if (e.key === " " && !e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				setMode("pan");
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === " ") {
				setMode("select");
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	// Wheel zoom
	const handleWheel = useCallback((e: WheelEvent) => {
		if (e.metaKey || e.ctrlKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? -10 : 10;
			setZoom((z) => Math.max(25, Math.min(200, z + delta)));
		}
	}, []);

	// Pan handlers
	const handlePanStart = useCallback(
		(e: React.MouseEvent) => {
			if (mode === "pan" || e.button === 1) {
				setIsPanning(true);
				lastPanPosition.current = { x: e.clientX, y: e.clientY };
			}
		},
		[mode],
	);

	const handlePanMove = useCallback(
		(e: React.MouseEvent) => {
			if (isPanning) {
				const deltaX = e.clientX - lastPanPosition.current.x;
				const deltaY = e.clientY - lastPanPosition.current.y;
				setPosition((p) => ({ x: p.x + deltaX, y: p.y + deltaY }));
				lastPanPosition.current = { x: e.clientX, y: e.clientY };
			}
		},
		[isPanning],
	);

	const handlePanEnd = useCallback(() => {
		setIsPanning(false);
	}, []);

	const fitToScreen = useCallback(() => {
		setZoom(100);
		setPosition({ x: 0, y: 0 });
	}, []);

	const resetView = useCallback(() => {
		setZoom(100);
		setPosition({ x: 0, y: 0 });
		setViewport("desktop");
	}, []);

	return {
		zoom,
		setZoom,
		viewport,
		setViewport,
		mode,
		setMode,
		position,
		isPanning,
		getViewportWidth,
		handleWheel,
		handlePanStart,
		handlePanMove,
		handlePanEnd,
		fitToScreen,
		resetView,
	};
}

// Canvas wrapper component with zoom and pan
interface ZoomableCanvasProps {
	children: React.ReactNode;
	zoom: number;
	position: { x: number; y: number };
	viewportWidth: number | string;
	isPanning: boolean;
	mode: CanvasMode;
	onPanStart: (e: React.MouseEvent) => void;
	onPanMove: (e: React.MouseEvent) => void;
	onPanEnd: () => void;
	onWheel: (e: WheelEvent) => void;
}

export function ZoomableCanvas({
	children,
	zoom,
	position,
	viewportWidth,
	isPanning,
	mode,
	onPanStart,
	onPanMove,
	onPanEnd,
	onWheel,
}: ZoomableCanvasProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		container.addEventListener("wheel", onWheel, { passive: false });
		return () => container.removeEventListener("wheel", onWheel);
	}, [onWheel]);

	return (
		<div
			ref={containerRef}
			className={cn(
				"flex-1 overflow-hidden bg-muted/30 relative",
				mode === "pan" && "cursor-grab",
				isPanning && "cursor-grabbing",
			)}
			onMouseDown={onPanStart}
			onMouseMove={onPanMove}
			onMouseUp={onPanEnd}
			onMouseLeave={onPanEnd}
		>
			{/* Canvas Background Pattern */}
			<div
				className="absolute inset-0 opacity-50"
				style={{
					backgroundImage: `
						linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
						linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
					`,
					backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
					transform: `translate(${position.x}px, ${position.y}px)`,
				}}
			/>

			{/* Canvas Content */}
			<div
				className="absolute top-1/2 left-1/2 origin-center transition-transform duration-75"
				style={{
					transform: `
						translate(-50%, -50%)
						translate(${position.x}px, ${position.y}px)
						scale(${zoom / 100})
					`,
					width:
						typeof viewportWidth === "number"
							? `${viewportWidth}px`
							: viewportWidth,
				}}
			>
				<div className="bg-background shadow-2xl rounded-lg overflow-hidden">
					{children}
				</div>
			</div>

			{/* Viewport indicator */}
			<div className="absolute top-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
				{typeof viewportWidth === "number" ? `${viewportWidth}px` : "100%"} @{" "}
				{zoom}%
			</div>
		</div>
	);
}

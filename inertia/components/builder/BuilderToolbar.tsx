import {
	Copy,
	Download,
	Eye,
	Monitor,
	Redo2,
	Save,
	Settings,
	Smartphone,
	Tablet,
	Undo2,
	Upload,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useBuilder } from "./BuilderContext";

interface BuilderToolbarProps {
	proposalId: number;
	proposalTitle: string;
	onPreview: () => void;
	onSave: () => Promise<void>;
	isSaving?: boolean;
	lastSaved?: Date | null;
}

type ViewportSize = "mobile" | "tablet" | "desktop";

export function BuilderToolbar({
	proposalId,
	proposalTitle,
	onPreview,
	onSave,
	isSaving = false,
	lastSaved,
}: BuilderToolbarProps) {
	const builder = useBuilder();
	const [viewport, setViewport] = useState<ViewportSize>("desktop");

	const handleUndo = () => {
		if (builder.canUndo()) {
			builder.undo();
		}
	};

	const handleRedo = () => {
		if (builder.canRedo()) {
			builder.redo();
		}
	};

	const handleExport = () => {
		const layoutJson = JSON.stringify(builder.layout, null, 2);
		const blob = new Blob([layoutJson], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `proposal-${proposalId}-layout.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleImport = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				try {
					const text = await file.text();
					const layout = JSON.parse(text);
					builder.setLayout(layout);
				} catch {
					alert("Fichier JSON invalide");
				}
			}
		};
		input.click();
	};

	const handleCopyLayout = () => {
		const layoutJson = JSON.stringify(builder.layout, null, 2);
		navigator.clipboard.writeText(layoutJson);
	};

	const formatLastSaved = (date: Date | null | undefined) => {
		if (!date) return null;
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diff < 60) return "Sauvegardé il y a quelques secondes";
		if (diff < 3600) return `Sauvegardé il y a ${Math.floor(diff / 60)} min`;
		return `Sauvegardé à ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
	};

	return (
		<TooltipProvider>
			<div className="flex items-center justify-between h-14 px-4 border-b bg-background">
				<div className="flex items-center gap-4">
					<h1 className="text-sm font-medium truncate max-w-[200px]">
						{proposalTitle}
					</h1>

					<div className="flex items-center gap-1 border-l pl-4">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={handleUndo}
									disabled={!builder.canUndo()}
									className="h-8 w-8"
								>
									<Undo2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Annuler (Ctrl+Z)</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={handleRedo}
									disabled={!builder.canRedo()}
									className="h-8 w-8"
								>
									<Redo2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Rétablir (Ctrl+Y)</TooltipContent>
						</Tooltip>
					</div>
				</div>

				<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant={viewport === "mobile" ? "secondary" : "ghost"}
								size="icon"
								onClick={() => setViewport("mobile")}
								className="h-7 w-7"
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
								onClick={() => setViewport("tablet")}
								className="h-7 w-7"
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
								onClick={() => setViewport("desktop")}
								className="h-7 w-7"
							>
								<Monitor className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Desktop (1280px)</TooltipContent>
					</Tooltip>
				</div>

				<div className="flex items-center gap-2">
					{lastSaved && (
						<span className="text-xs text-muted-foreground">
							{formatLastSaved(lastSaved)}
						</span>
					)}

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<Settings className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={handleExport}>
								<Download className="h-4 w-4 mr-2" />
								Exporter le layout
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleImport}>
								<Upload className="h-4 w-4 mr-2" />
								Importer un layout
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleCopyLayout}>
								<Copy className="h-4 w-4 mr-2" />
								Copier le JSON
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button variant="outline" size="sm" onClick={onPreview}>
						<Eye className="h-4 w-4 mr-2" />
						Prévisualiser
					</Button>

					<Button size="sm" onClick={onSave} disabled={isSaving}>
						<Save className="h-4 w-4 mr-2" />
						{isSaving ? "Sauvegarde..." : "Sauvegarder"}
					</Button>
				</div>
			</div>
		</TooltipProvider>
	);
}

export function useViewportWidth(viewport: ViewportSize): number {
	switch (viewport) {
		case "mobile":
			return 375;
		case "tablet":
			return 768;
		case "desktop":
			return 1280;
	}
}

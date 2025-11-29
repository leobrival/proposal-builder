"use client";

import { ExternalLink } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/components/ui/tooltip";

type SyncStatus = "synced" | "syncing" | "error" | "offline";

interface SiteStatusBarProps {
	domain: string;
	pagesIndexed?: number;
	onlineUsers?: number;
	syncStatus?: SyncStatus;
	lastSyncAt?: Date | null;
}

const syncStatusConfig: Record<SyncStatus, { color: string; label: string; description: string }> = {
	synced: {
		color: "bg-green-500",
		label: "Synchronisé",
		description: "Les données sont à jour",
	},
	syncing: {
		color: "bg-blue-500 animate-pulse",
		label: "Synchronisation...",
		description: "Mise à jour des données en cours",
	},
	error: {
		color: "bg-red-500",
		label: "Erreur",
		description: "La synchronisation a échoué",
	},
	offline: {
		color: "bg-muted-foreground/50",
		label: "Hors ligne",
		description: "Aucune connexion au serveur",
	},
};

export function SiteStatusBar({
	domain,
	pagesIndexed = 0,
	onlineUsers = 0,
	syncStatus = "offline",
	lastSyncAt,
}: SiteStatusBarProps) {
	const domainUrl = domain.startsWith("http") ? domain : `https://${domain}`;
	const statusConfig = syncStatusConfig[syncStatus];

	const formatLastSync = (date: Date) => {
		return date.toLocaleTimeString("fr-FR", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="flex items-center gap-4 text-sm">
			{/* Domain with external link */}
			<div className="flex items-center gap-1.5">
				<span className="inline-flex h-2 w-2 rounded-full bg-orange-500" />
				<a
					href={domainUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
				>
					{domain}
					<ExternalLink className="h-3 w-3" />
				</a>
				{pagesIndexed > 0 && (
					<span className="text-muted-foreground">+{pagesIndexed}</span>
				)}
			</div>

			{/* Separator */}
			<span className="text-muted-foreground/50">|</span>

			{/* Online users with sync status */}
			<Tooltip>
				<TooltipTrigger asChild>
					<div className="flex items-center gap-1.5 cursor-help">
						<span className={`inline-flex h-2 w-2 rounded-full ${statusConfig.color}`} />
						<span className={`${syncStatus === "synced" ? "text-green-500" : syncStatus === "error" ? "text-red-500" : "text-muted-foreground"}`}>
							{onlineUsers} online
						</span>
					</div>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="text-xs">
					<div className="space-y-1">
						<div className="font-medium">{statusConfig.label}</div>
						<div className="text-muted-foreground">{statusConfig.description}</div>
						{lastSyncAt && (
							<div className="text-muted-foreground">
								Dernière sync : {formatLastSync(lastSyncAt)}
							</div>
						)}
					</div>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}

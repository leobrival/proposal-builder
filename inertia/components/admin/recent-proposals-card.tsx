"use client";

import { router } from "@inertiajs/react";
import {
	Archive,
	Eye,
	FileEdit,
	Globe,
	Trash2,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { TabbedDataCard, type DataCardAction, type DataCardColumn, type DataCardTab } from "./data-card";

interface Proposal {
	id: string;
	title: string;
	status: string;
	authorName: string;
	createdAt: string;
}

interface RecentProposalsCardProps {
	proposals: Proposal[];
}

const formatDate = (dateStr: string) => {
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		month: "short",
		day: "numeric",
	});
};

const getStatusBadgeVariant = (status: string) => {
	switch (status) {
		case "published":
			return "default";
		case "draft":
			return "secondary";
		case "archived":
			return "outline";
		default:
			return "outline";
	}
};

// Proposal actions
const createProposalActions = (): DataCardAction<Proposal>[] => [
	{
		id: "view",
		label: "Voir",
		icon: <Eye className="h-4 w-4" />,
		onClick: (proposal) => {
			window.open(`/proposals/${proposal.id}`, "_blank");
		},
	},
	{
		id: "edit",
		label: "Modifier",
		icon: <FileEdit className="h-4 w-4" />,
		onClick: (proposal) => {
			router.visit(`/proposals/${proposal.id}/edit`);
		},
	},
	{
		id: "publish",
		label: "Publier",
		icon: <Globe className="h-4 w-4" />,
		onClick: async (proposal) => {
			router.put(`/admin/api/proposals/${proposal.id}/status`, { status: "published" }, {
				preserveScroll: true,
				onSuccess: () => {
					router.reload({ only: ["recentProposals"] });
				},
			});
		},
		show: (proposal) => proposal.status === "draft",
	},
	{
		id: "unpublish",
		label: "Dépublier",
		icon: <FileEdit className="h-4 w-4" />,
		onClick: async (proposal) => {
			router.put(`/admin/api/proposals/${proposal.id}/status`, { status: "draft" }, {
				preserveScroll: true,
				onSuccess: () => {
					router.reload({ only: ["recentProposals"] });
				},
			});
		},
		show: (proposal) => proposal.status === "published",
	},
	{
		id: "archive",
		label: "Archiver",
		icon: <Archive className="h-4 w-4" />,
		separator: true,
		onClick: async (proposal) => {
			router.put(`/admin/api/proposals/${proposal.id}/status`, { status: "archived" }, {
				preserveScroll: true,
				onSuccess: () => {
					router.reload({ only: ["recentProposals"] });
				},
			});
		},
		show: (proposal) => proposal.status !== "archived",
	},
	{
		id: "restore",
		label: "Restaurer",
		icon: <FileEdit className="h-4 w-4" />,
		onClick: async (proposal) => {
			router.put(`/admin/api/proposals/${proposal.id}/status`, { status: "draft" }, {
				preserveScroll: true,
				onSuccess: () => {
					router.reload({ only: ["recentProposals"] });
				},
			});
		},
		show: (proposal) => proposal.status === "archived",
	},
	{
		id: "delete",
		label: "Supprimer",
		icon: <Trash2 className="h-4 w-4" />,
		variant: "destructive",
		separator: true,
		onClick: async (proposal) => {
			if (confirm(`Supprimer la proposal "${proposal.title}" ?`)) {
				router.delete(`/admin/api/proposals/${proposal.id}`, {
					preserveScroll: true,
					onSuccess: () => {
						router.reload({ only: ["recentProposals"] });
					},
				});
			}
		},
	},
];

const columns: DataCardColumn<Proposal>[] = [
	{
		key: "title",
		header: "Title",
		render: (proposal) => (
			<span className="font-medium truncate max-w-[200px] block">{proposal.title}</span>
		),
	},
	{
		key: "authorName",
		header: "Author",
		render: (proposal) => (
			<span className="text-muted-foreground">{proposal.authorName}</span>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (proposal) => (
			<Badge variant={getStatusBadgeVariant(proposal.status)}>
				{proposal.status}
			</Badge>
		),
	},
];

// Columns without status for filtered tabs
const columnsWithoutStatus: DataCardColumn<Proposal>[] = [
	{
		key: "title",
		header: "Title",
		render: (proposal) => (
			<span className="font-medium truncate max-w-[200px] block">{proposal.title}</span>
		),
	},
	{
		key: "authorName",
		header: "Author",
		render: (proposal) => (
			<span className="text-muted-foreground">{proposal.authorName}</span>
		),
	},
	{
		key: "createdAt",
		header: "Date",
		render: (proposal) => (
			<span className="text-muted-foreground text-sm">{formatDate(proposal.createdAt)}</span>
		),
		className: "text-right",
	},
];

const modalColumns: DataCardColumn<Proposal>[] = [
	{
		key: "title",
		header: "Title",
		render: (proposal) => (
			<span className="font-medium">{proposal.title}</span>
		),
	},
	{
		key: "authorName",
		header: "Author",
		render: (proposal) => (
			<span className="text-muted-foreground">{proposal.authorName}</span>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (proposal) => (
			<Badge variant={getStatusBadgeVariant(proposal.status)}>
				{proposal.status}
			</Badge>
		),
	},
	{
		key: "createdAt",
		header: "Created",
		render: (proposal) => (
			<span className="text-muted-foreground">{formatDate(proposal.createdAt)}</span>
		),
	},
];

export function RecentProposalsCard({ proposals }: RecentProposalsCardProps) {
	// Filter proposals by status
	const publishedProposals = proposals.filter((p) => p.status === "published");
	const draftProposals = proposals.filter((p) => p.status === "draft");
	const archivedProposals = proposals.filter((p) => p.status === "archived");

	const proposalActions = createProposalActions();

	const createTab = (
		id: string,
		label: string,
		data: Proposal[],
		showStatus: boolean = false
	): DataCardTab<Proposal> => ({
		id,
		label,
		data: data.slice(0, 5),
		columns: showStatus ? columns : columnsWithoutStatus,
		modalColumns,
		keyExtractor: (proposal) => proposal.id,
		count: data.length,
		filterKey: "status",
		getFilterValue: (proposal) => proposal.status,
		emptyMessage: "Aucune proposal",
		exportFilename: `proposals-${id}-export.csv`,
		exportHeaders: ["Titre", "Auteur", "Statut", "Date de création"],
		exportRow: (proposal) => [
			proposal.title,
			proposal.authorName,
			proposal.status,
			proposal.createdAt,
		],
		actions: proposalActions,
	});

	const tabs: DataCardTab<Proposal>[] = [
		createTab("all", "All", proposals, true),
		createTab("published", "Published", publishedProposals),
		createTab("draft", "Draft", draftProposals),
		createTab("archived", "Archived", archivedProposals),
	];

	return (
		<TabbedDataCard
			tabs={tabs}
			defaultTab="all"
			modalTitle="All Proposals"
			rowTooltip="Voir la proposal"
			viewAllTooltip="Voir toutes les proposals"
			moreOptionsTooltip="Plus d'options"
		/>
	);
}

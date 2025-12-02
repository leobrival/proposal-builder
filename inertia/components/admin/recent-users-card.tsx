"use client";

import { router } from "@inertiajs/react";
import {
	Ban,
	CreditCard,
	Shield,
	ShieldOff,
	Trash2,
	Unlock,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
	type DataCardAction,
	type DataCardColumn,
	type DataCardTab,
	TabbedDataCard,
} from "./data-card";

interface User {
	id: string;
	fullName: string;
	email: string;
	plan: "free" | "paid";
	createdAt: string;
	isAdmin?: boolean;
	isBlocked?: boolean;
}

interface RecentUsersCardProps {
	users: User[];
}

const formatDate = (dateStr: string) => {
	return new Date(dateStr).toLocaleDateString("fr-FR", {
		month: "short",
		day: "numeric",
	});
};

// User actions
const createUserActions = (): DataCardAction<User>[] => [
	{
		id: "upgrade-plan",
		label: "Passer en Payant",
		icon: <CreditCard className="h-4 w-4" />,
		onClick: async (user) => {
			router.put(
				`/admin/api/users/${user.id}/plan`,
				{ plan: "paid" },
				{
					preserveScroll: true,
					onSuccess: () => {
						router.reload({ only: ["recentUsers"] });
					},
				},
			);
		},
		show: (user) => user.plan === "free",
	},
	{
		id: "downgrade-plan",
		label: "Passer en Gratuit",
		icon: <CreditCard className="h-4 w-4" />,
		onClick: async (user) => {
			router.put(
				`/admin/api/users/${user.id}/plan`,
				{ plan: "free" },
				{
					preserveScroll: true,
					onSuccess: () => {
						router.reload({ only: ["recentUsers"] });
					},
				},
			);
		},
		show: (user) => user.plan === "paid",
	},
	{
		id: "make-admin",
		label: "Promouvoir Admin",
		icon: <Shield className="h-4 w-4" />,
		onClick: async (user) => {
			router.put(
				`/admin/api/users/${user.id}/admin`,
				{ isAdmin: true },
				{
					preserveScroll: true,
					onSuccess: () => {
						router.reload({ only: ["recentUsers"] });
					},
				},
			);
		},
		show: (user) => !user.isAdmin,
	},
	{
		id: "remove-admin",
		label: "Révoquer Admin",
		icon: <ShieldOff className="h-4 w-4" />,
		onClick: async (user) => {
			router.put(
				`/admin/api/users/${user.id}/admin`,
				{ isAdmin: false },
				{
					preserveScroll: true,
					onSuccess: () => {
						router.reload({ only: ["recentUsers"] });
					},
				},
			);
		},
		show: (user) => user.isAdmin === true,
	},
	{
		id: "block",
		label: "Bloquer",
		icon: <Ban className="h-4 w-4" />,
		variant: "destructive",
		separator: true,
		onClick: async (user) => {
			router.put(
				`/admin/api/users/${user.id}/block`,
				{ isBlocked: true },
				{
					preserveScroll: true,
					onSuccess: () => {
						router.reload({ only: ["recentUsers"] });
					},
				},
			);
		},
		show: (user) => !user.isBlocked,
	},
	{
		id: "unblock",
		label: "Débloquer",
		icon: <Unlock className="h-4 w-4" />,
		onClick: async (user) => {
			router.put(
				`/admin/api/users/${user.id}/block`,
				{ isBlocked: false },
				{
					preserveScroll: true,
					onSuccess: () => {
						router.reload({ only: ["recentUsers"] });
					},
				},
			);
		},
		show: (user) => user.isBlocked === true,
	},
	{
		id: "delete",
		label: "Supprimer",
		icon: <Trash2 className="h-4 w-4" />,
		variant: "destructive",
		separator: true,
		onClick: async (user) => {
			if (confirm(`Supprimer l'utilisateur ${user.fullName} ?`)) {
				router.delete(`/admin/api/users/${user.id}`, {
					preserveScroll: true,
					onSuccess: () => {
						router.reload({ only: ["recentUsers"] });
					},
				});
			}
		},
	},
];

const columns: DataCardColumn<User>[] = [
	{
		key: "fullName",
		header: "Name",
		render: (user) => <span className="font-medium">{user.fullName}</span>,
	},
	{
		key: "email",
		header: "Email",
		render: (user) => (
			<span className="text-muted-foreground">{user.email}</span>
		),
	},
	{
		key: "createdAt",
		header: "Joined",
		render: (user) => formatDate(user.createdAt),
	},
];

const columnsWithPlan: DataCardColumn<User>[] = [
	{
		key: "fullName",
		header: "Name",
		render: (user) => <span className="font-medium">{user.fullName}</span>,
	},
	{
		key: "plan",
		header: "Plan",
		render: (user) => (
			<Badge variant={user.plan === "paid" ? "default" : "secondary"}>
				{user.plan === "paid" ? "Payant" : "Gratuit"}
			</Badge>
		),
	},
	{
		key: "createdAt",
		header: "Joined",
		render: (user) => formatDate(user.createdAt),
	},
];

export function RecentUsersCard({ users }: RecentUsersCardProps) {
	const freeUsers = users.filter((user) => user.plan === "free");
	const paidUsers = users.filter((user) => user.plan === "paid");

	const userActions = createUserActions();

	const createTab = (
		id: string,
		label: string,
		data: User[],
		showPlanColumn = false,
	): DataCardTab<User> => ({
		id,
		label,
		data,
		columns: showPlanColumn ? columnsWithPlan : columns,
		modalColumns: columnsWithPlan,
		keyExtractor: (user) => user.id,
		count: data.length,
		filterKey: "plan",
		getFilterValue: (user) => user.plan,
		modalTitle: `${label} Users`,
		exportFilename: `users-${id}-export.csv`,
		exportHeaders: ["Nom", "Email", "Plan", "Date d'inscription"],
		exportRow: (user) => [
			user.fullName,
			user.email,
			user.plan === "paid" ? "Payant" : "Gratuit",
			user.createdAt,
		],
		emptyMessage: "Aucun utilisateur",
		actions: userActions,
	});

	const tabs: DataCardTab<User>[] = [
		createTab("all", "All", users, true),
		createTab("free", "Free", freeUsers),
		createTab("paid", "Paid", paidUsers),
	];

	return (
		<TabbedDataCard
			id="users"
			tabs={tabs}
			defaultTab="all"
			viewAllTooltip="Voir tous les utilisateurs"
			moreOptionsTooltip="Plus d'options"
		/>
	);
}

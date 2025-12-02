import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "../components/layouts/app-layout";
import type { Proposal, SharedProps } from "../types";

interface DashboardProps extends SharedProps {
	proposals: Proposal[];
	stats: {
		totalProposals: number;
		totalViews: number;
		totalLeads: number;
	};
}

export default function Dashboard() {
	const { user, proposals, stats } = usePage<DashboardProps>().props;

	return (
		<AppLayout>
			<Head title="Dashboard" />
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
					<p className="text-muted-foreground mt-1">
						Bienvenue, {user?.fullName} !
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-card border border-border rounded-lg p-6">
						<h2 className="text-lg font-semibold text-foreground">
							Mes propositions
						</h2>
						<p className="text-3xl font-bold text-primary mt-2">
							{stats.totalProposals}
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							{stats.totalProposals === 0
								? "Aucune proposition créée"
								: `proposition${stats.totalProposals > 1 ? "s" : ""} créée${stats.totalProposals > 1 ? "s" : ""}`}
						</p>
					</div>
					<div className="bg-card border border-border rounded-lg p-6">
						<h2 className="text-lg font-semibold text-foreground">
							Vues totales
						</h2>
						<p className="text-3xl font-bold text-primary mt-2">
							{stats.totalViews}
						</p>
						<p className="text-sm text-muted-foreground mt-1">
							Sur toutes vos propositions
						</p>
					</div>
					<div className="bg-card border border-border rounded-lg p-6">
						<h2 className="text-lg font-semibold text-foreground">
							Leads générés
						</h2>
						<p className="text-3xl font-bold text-primary mt-2">
							{stats.totalLeads}
						</p>
						<p className="text-sm text-muted-foreground mt-1">Contacts reçus</p>
					</div>
				</div>
				<div className="bg-card border border-border rounded-lg p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-foreground">
							Propositions récentes
						</h2>
						<Link
							href="/proposals/new"
							className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
						>
							Nouvelle proposition
						</Link>
					</div>
					{proposals.length === 0 ? (
						<p className="text-muted-foreground text-center py-8">
							Vous n'avez pas encore de propositions. Créez votre première
							proposition de sponsoring !
						</p>
					) : (
						<div className="space-y-3">
							{proposals.map((proposal) => (
								<div
									key={proposal.id}
									className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
								>
									<div>
										<h3 className="font-medium">{proposal.title}</h3>
										<p className="text-sm text-muted-foreground">
											{proposal.projectName}
										</p>
									</div>
									<div className="flex items-center gap-4">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												proposal.status === "published"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{proposal.status === "published" ? "Publié" : "Brouillon"}
										</span>
										<Link
											href={`/proposals/${proposal.id}/edit`}
											className="text-sm text-primary hover:underline"
										>
											Modifier
										</Link>
									</div>
								</div>
							))}
							{stats.totalProposals > 5 && (
								<div className="text-center pt-2">
									<Link
										href="/proposals"
										className="text-sm text-primary hover:underline"
									>
										Voir toutes les propositions →
									</Link>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	);
}

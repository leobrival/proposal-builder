import { Head, Link, router } from "@inertiajs/react";
import { Edit, Eye, MoreVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import AppLayout from "../../components/layouts/app-layout";
import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import type { Proposal } from "../../types";

interface ProposalsIndexProps {
	proposals: Proposal[];
}

export default function ProposalsIndex({ proposals }: ProposalsIndexProps) {
	const [menuOpen, setMenuOpen] = useState<string | null>(null);

	const handleDelete = (id: string) => {
		if (
			window.confirm("Êtes-vous sûr de vouloir supprimer cette proposition ?")
		) {
			router.delete(`/proposals/${id}`);
		}
	};

	return (
		<AppLayout>
			<Head title="Mes propositions" />

			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Mes propositions</h1>
				<Link href="/proposals/new">
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Nouvelle proposition
					</Button>
				</Link>
			</div>

			{proposals.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<p className="text-muted-foreground mb-4">
							Vous n'avez pas encore de propositions.
						</p>
						<Link href="/proposals/new">
							<Button>
								<Plus className="h-4 w-4 mr-2" />
								Créer ma première proposition
							</Button>
						</Link>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{proposals.map((proposal) => (
						<Card key={proposal.id} className="relative">
							<CardHeader className="pb-2">
								<div className="flex items-start justify-between">
									<div className="space-y-1 flex-1 min-w-0">
										<CardTitle className="text-lg truncate">
											{proposal.title}
										</CardTitle>
										<CardDescription className="truncate">
											{proposal.projectName}
										</CardDescription>
									</div>
									<div className="relative">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={() =>
												setMenuOpen(
													menuOpen === proposal.id ? null : proposal.id,
												)
											}
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
										{menuOpen === proposal.id && (
											<div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-md shadow-lg z-10">
												<Link
													href={`/proposals/${proposal.id}/edit`}
													className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
												>
													<Edit className="h-4 w-4" />
													Modifier
												</Link>
												{proposal.status === "published" && (
													<a
														href={`/p/${proposal.slug}`}
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
													>
														<Eye className="h-4 w-4" />
														Voir la page
													</a>
												)}
												<button
													type="button"
													onClick={() => handleDelete(proposal.id)}
													className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full"
												>
													<Trash2 className="h-4 w-4" />
													Supprimer
												</button>
											</div>
										)}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between text-sm">
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium ${
											proposal.status === "published"
												? "bg-green-100 text-green-800"
												: proposal.status === "archived"
													? "bg-gray-100 text-gray-800"
													: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{proposal.status === "published"
											? "Publié"
											: proposal.status === "archived"
												? "Archivé"
												: "Brouillon"}
									</span>
									<span className="text-muted-foreground">
										{proposal.viewCount} vue
										{proposal.viewCount !== 1 ? "s" : ""}
									</span>
								</div>
								<div className="mt-4">
									<Link
										href={`/proposals/${proposal.id}/edit`}
										className="text-sm text-primary hover:underline"
									>
										Modifier →
									</Link>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</AppLayout>
	);
}

import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../../components/app-header";
import { ThemeProvider } from "../../components/theme-provider";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface Doc {
	title: string;
	slug: string;
	description: string;
	section: string;
	excerpt: string;
}

interface DocsSearchProps {
	query: string;
	docs: Doc[];
}

const sectionLabels: Record<string, string> = {
	"getting-started": "Demarrage",
	integration: "Integration",
	features: "Fonctionnalites",
	api: "API",
	guides: "Guides",
};

export default function DocsSearch({ query, docs }: DocsSearchProps) {
	const [searchQuery, setSearchQuery] = useState(query);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.get("/docs/search", { q: searchQuery });
		}
	};

	return (
		<ThemeProvider defaultTheme="system" storageKey="sponseasy-theme">
			<Head title={`Recherche: ${query} - Documentation Spons Easy`} />

			<div className="min-h-screen bg-background">
				<AppHeader showLogo />

				<main className="px-4 py-8">
					<div className="mx-auto max-w-4xl">
						{/* Back Link */}
						<Link
							href="/docs"
							className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
						>
							<ArrowLeft className="h-4 w-4" />
							Retour a la documentation
						</Link>

						{/* Search Form */}
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<BookOpen className="h-8 w-8 text-primary" />
								<h1 className="text-3xl font-bold text-foreground">
									Rechercher dans la documentation
								</h1>
							</div>
							<form onSubmit={handleSearch} className="flex gap-2">
								<Input
									type="search"
									placeholder="Rechercher..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="flex-1"
									autoFocus
								/>
								<Button type="submit">
									<Search className="h-4 w-4 mr-2" />
									Rechercher
								</Button>
							</form>
						</div>

						{/* Results */}
						{query && (
							<div className="space-y-6">
								<p className="text-muted-foreground">
									{docs.length} resultat{docs.length !== 1 ? "s" : ""} pour "
									{query}"
								</p>

								{docs.length === 0 ? (
									<div className="text-center py-12 border rounded-lg">
										<p className="text-muted-foreground mb-4">
											Aucun document trouve pour cette recherche.
										</p>
										<Button variant="outline" asChild>
											<Link href="/docs">Parcourir la documentation</Link>
										</Button>
									</div>
								) : (
									<div className="space-y-4">
										{docs.map((doc) => (
											<Link
												key={doc.slug}
												href={`/docs/${doc.slug}`}
												className="block p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
											>
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground uppercase tracking-wide">
															{sectionLabels[doc.section] || doc.section}
														</span>
													</div>
													<h2 className="text-lg font-semibold text-foreground">
														{doc.title}
													</h2>
													<p className="text-muted-foreground text-sm line-clamp-2">
														{doc.excerpt || doc.description}
													</p>
												</div>
											</Link>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</main>

				{/* Footer */}
				<footer className="py-8 px-4 border-t mt-12">
					<div className="mx-auto max-w-6xl text-center">
						<p className="text-sm text-muted-foreground">
							© 2025 Spons Easy. Tous droits reserves.
						</p>
					</div>
				</footer>
			</div>
		</ThemeProvider>
	);
}

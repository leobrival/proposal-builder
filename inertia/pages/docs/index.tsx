import { Head, Link } from "@inertiajs/react";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../../components/app-header";
import { ThemeProvider } from "../../components/theme-provider";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { router } from "@inertiajs/react";

interface Doc {
	title: string;
	slug: string;
	description: string;
	section: string;
	order: number;
	icon?: string;
	excerpt: string;
}

interface Section {
	section: string;
	docs: Doc[];
}

interface DocsIndexProps {
	sections: Section[];
}

const sectionIcons: Record<string, string> = {
	"getting-started": "rocket",
	integration: "plug",
	features: "sparkles",
	api: "code",
	guides: "book-open",
};

const sectionLabels: Record<string, string> = {
	"getting-started": "Demarrage",
	integration: "Integration",
	features: "Fonctionnalites",
	api: "API",
	guides: "Guides",
};

export default function DocsIndex({ sections }: DocsIndexProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.get("/docs/search", { q: searchQuery });
		}
	};

	return (
		<ThemeProvider defaultTheme="system" storageKey="sponseasy-theme">
			<Head title="Documentation - Spons Easy" />

			<div className="min-h-screen bg-background">
				<AppHeader showLogo />

				{/* Hero Section */}
				<section className="px-4 py-12 md:py-16 border-b bg-muted/30">
					<div className="mx-auto max-w-6xl">
						<div className="space-y-4 text-center">
							<BookOpen className="h-12 w-12 mx-auto text-primary" />
							<h1 className="text-4xl font-bold tracking-tight text-foreground">
								Documentation
							</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Tout ce dont vous avez besoin pour maitriser Spons Easy
							</p>

							{/* Search */}
							<form
								onSubmit={handleSearch}
								className="flex gap-2 max-w-md mx-auto mt-6"
							>
								<Input
									type="search"
									placeholder="Rechercher dans la documentation..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="flex-1"
								/>
								<Button type="submit" variant="secondary">
									<Search className="h-4 w-4" />
								</Button>
							</form>
						</div>
					</div>
				</section>

				<main className="px-4 py-12">
					<div className="mx-auto max-w-6xl">
						{sections.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground mb-4">
									La documentation arrive bientot.
								</p>
								<Button variant="outline" asChild>
									<Link href="/blog">Consulter le blog</Link>
								</Button>
							</div>
						) : (
							<div className="grid gap-8 md:grid-cols-2">
								{sections.map((section) => (
									<div
										key={section.section}
										className="rounded-lg border bg-card p-6 space-y-4"
									>
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
												<span className="text-lg">
													{section.section === "getting-started" && "🚀"}
													{section.section === "integration" && "🔌"}
													{section.section === "features" && "✨"}
													{section.section === "api" && "💻"}
													{section.section === "guides" && "📖"}
													{!sectionIcons[section.section] && "📄"}
												</span>
											</div>
											<h2 className="text-xl font-semibold text-foreground">
												{sectionLabels[section.section] || section.section}
											</h2>
										</div>

										<div className="space-y-2">
											{section.docs.map((doc) => (
												<Link
													key={doc.slug}
													href={`/docs/${doc.slug}`}
													className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors group"
												>
													<div className="flex items-center gap-3">
														{doc.icon && (
															<span className="text-muted-foreground">
																{doc.icon}
															</span>
														)}
														<div>
															<h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
																{doc.title}
															</h3>
															{doc.description && (
																<p className="text-sm text-muted-foreground line-clamp-1">
																	{doc.description}
																</p>
															)}
														</div>
													</div>
													<ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
												</Link>
											))}
										</div>
									</div>
								))}
							</div>
						)}

						{/* Quick Links */}
						<div className="mt-12 grid gap-4 md:grid-cols-3">
							<Link
								href="/blog"
								className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
							>
								<h3 className="font-semibold text-foreground mb-2">Blog</h3>
								<p className="text-sm text-muted-foreground">
									Tutoriels, conseils et actualites
								</p>
							</Link>
							<Link
								href="/changelog"
								className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
							>
								<h3 className="font-semibold text-foreground mb-2">Changelog</h3>
								<p className="text-sm text-muted-foreground">
									Historique des mises a jour
								</p>
							</Link>
							<a
								href="mailto:support@sponseasy.com"
								className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
							>
								<h3 className="font-semibold text-foreground mb-2">Support</h3>
								<p className="text-sm text-muted-foreground">
									Besoin d'aide ? Contactez-nous
								</p>
							</a>
						</div>
					</div>
				</main>

				{/* Footer */}
				<footer className="py-8 px-4 border-t">
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

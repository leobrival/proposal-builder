import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, Calendar, Clock, Search, Tag } from "lucide-react";
import { useState } from "react";
import { AppHeader } from "../../components/app-header";
import { ThemeProvider } from "../../components/theme-provider";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface BlogPost {
	title: string;
	slug: string;
	description: string;
	category: string;
	author: string;
	tags: string[];
	readingTime?: number;
	publishedAt?: string;
	excerpt: string;
}

interface BlogSearchProps {
	query: string;
	posts: BlogPost[];
}

const categoryLabels: Record<string, string> = {
	product: "Produit",
	tutorial: "Tutoriel",
	"case-study": "Cas client",
	announcement: "Annonce",
	tips: "Conseils",
};

const categoryColors: Record<string, string> = {
	product: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
	tutorial: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
	"case-study":
		"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
	announcement:
		"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
	tips: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
};

function formatDate(dateString?: string): string {
	if (!dateString) return "";
	return new Date(dateString).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default function BlogSearch({ query, posts }: BlogSearchProps) {
	const [searchQuery, setSearchQuery] = useState(query);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.get("/blog/search", { q: searchQuery });
		}
	};

	return (
		<ThemeProvider defaultTheme="system" storageKey="sponseasy-theme">
			<Head title={`Recherche: ${query} - Blog Spons Easy`} />

			<div className="min-h-screen bg-background">
				<AppHeader showLogo />

				<main className="px-4 py-8">
					<div className="mx-auto max-w-4xl">
						{/* Back Link */}
						<Link
							href="/blog"
							className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
						>
							<ArrowLeft className="h-4 w-4" />
							Retour au blog
						</Link>

						{/* Search Form */}
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground mb-4">
								Rechercher
							</h1>
							<form onSubmit={handleSearch} className="flex gap-2">
								<Input
									type="search"
									placeholder="Rechercher un article..."
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
									{posts.length} resultat{posts.length !== 1 ? "s" : ""} pour "
									{query}"
								</p>

								{posts.length === 0 ? (
									<div className="text-center py-12 border rounded-lg">
										<p className="text-muted-foreground mb-4">
											Aucun article trouve pour cette recherche.
										</p>
										<Button variant="outline" asChild>
											<Link href="/blog">Voir tous les articles</Link>
										</Button>
									</div>
								) : (
									<div className="space-y-4">
										{posts.map((post) => (
											<Link
												key={post.slug}
												href={`/blog/${post.slug}`}
												className="block p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
											>
												<div className="flex items-start gap-4">
													<div className="flex-1 space-y-2">
														<div className="flex items-center gap-2">
															<Badge
																variant="secondary"
																className={
																	categoryColors[post.category] || ""
																}
															>
																{categoryLabels[post.category] ||
																	post.category}
															</Badge>
														</div>
														<h2 className="text-lg font-semibold text-foreground">
															{post.title}
														</h2>
														<p className="text-muted-foreground text-sm line-clamp-2">
															{post.excerpt}
														</p>
														<div className="flex items-center gap-4 text-xs text-muted-foreground">
															{post.publishedAt && (
																<span className="flex items-center gap-1">
																	<Calendar className="h-3 w-3" />
																	{formatDate(post.publishedAt)}
																</span>
															)}
															{post.readingTime && (
																<span className="flex items-center gap-1">
																	<Clock className="h-3 w-3" />
																	{post.readingTime} min
																</span>
															)}
														</div>
														{post.tags.length > 0 && (
															<div className="flex items-center gap-1 flex-wrap">
																<Tag className="h-3 w-3 text-muted-foreground" />
																{post.tags.slice(0, 3).map((tag) => (
																	<span
																		key={tag}
																		className="text-xs text-muted-foreground"
																	>
																		#{tag}
																	</span>
																))}
															</div>
														)}
													</div>
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

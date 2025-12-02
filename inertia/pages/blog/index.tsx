import { Head, Link, router } from "@inertiajs/react";
import { Calendar, Clock, Search, Tag } from "lucide-react";
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
	featured?: boolean;
	publishedAt?: string;
	coverImage?: string;
	excerpt: string;
}

interface Pagination {
	page: number;
	limit: number;
	total: number;
	hasMore: boolean;
	totalPages: number;
}

interface Filters {
	category?: string;
	tag?: string;
}

interface BlogIndexProps {
	posts: BlogPost[];
	featured: BlogPost[];
	pagination: Pagination;
	filters: Filters;
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

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
	return (
		<Link
			href={`/blog/${post.slug}`}
			className={`group block rounded-lg border bg-card overflow-hidden transition-shadow hover:shadow-lg ${
				featured ? "md:col-span-2 md:grid md:grid-cols-2" : ""
			}`}
		>
			{post.coverImage && (
				<div
					className={`aspect-video bg-muted ${featured ? "" : ""}`}
					style={{
						backgroundImage: `url(${post.coverImage})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
			)}
			{!post.coverImage && (
				<div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
					<span className="text-4xl">📝</span>
				</div>
			)}
			<div className="p-6 space-y-3">
				<div className="flex items-center gap-2">
					<Badge
						variant="secondary"
						className={categoryColors[post.category] || ""}
					>
						{categoryLabels[post.category] || post.category}
					</Badge>
					{post.featured && (
						<Badge variant="default">En vedette</Badge>
					)}
				</div>
				<h3
					className={`font-semibold text-foreground group-hover:text-primary transition-colors ${
						featured ? "text-2xl" : "text-lg"
					}`}
				>
					{post.title}
				</h3>
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
								className="text-xs text-muted-foreground hover:text-foreground"
							>
								#{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</Link>
	);
}

export default function BlogIndex({
	posts,
	featured,
	pagination,
	filters,
}: BlogIndexProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.get("/blog/search", { q: searchQuery });
		}
	};

	const handleCategoryFilter = (category: string) => {
		router.get("/blog", { category });
	};

	const handleClearFilters = () => {
		router.get("/blog");
	};

	return (
		<ThemeProvider defaultTheme="system" storageKey="sponseasy-theme">
			<Head title="Blog - Spons Easy" />

			<div className="min-h-screen bg-background">
				<AppHeader showLogo />

				{/* Hero Section */}
				<section className="px-4 py-12 md:py-16 border-b">
					<div className="mx-auto max-w-6xl">
						<div className="space-y-4 text-center">
							<h1 className="text-4xl font-bold tracking-tight text-foreground">
								Blog Spons Easy
							</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Conseils, tutoriels et actualites pour reussir vos propositions
								de sponsoring
							</p>

							{/* Search */}
							<form
								onSubmit={handleSearch}
								className="flex gap-2 max-w-md mx-auto mt-6"
							>
								<Input
									type="search"
									placeholder="Rechercher un article..."
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

				{/* Categories Filter */}
				<section className="px-4 py-6 bg-muted/50">
					<div className="mx-auto max-w-6xl">
						<div className="flex items-center gap-2 flex-wrap justify-center">
							<Button
								variant={!filters.category ? "default" : "outline"}
								size="sm"
								onClick={handleClearFilters}
							>
								Tous
							</Button>
							{Object.entries(categoryLabels).map(([key, label]) => (
								<Button
									key={key}
									variant={filters.category === key ? "default" : "outline"}
									size="sm"
									onClick={() => handleCategoryFilter(key)}
								>
									{label}
								</Button>
							))}
						</div>
						{(filters.category || filters.tag) && (
							<div className="text-center mt-4">
								<Button variant="ghost" size="sm" onClick={handleClearFilters}>
									Effacer les filtres
								</Button>
							</div>
						)}
					</div>
				</section>

				<main className="px-4 py-12">
					<div className="mx-auto max-w-6xl space-y-12">
						{/* Featured Posts */}
						{featured.length > 0 && !filters.category && !filters.tag && (
							<section>
								<h2 className="text-2xl font-bold text-foreground mb-6">
									Articles en vedette
								</h2>
								<div className="grid gap-6 md:grid-cols-2">
									{featured.slice(0, 2).map((post) => (
										<PostCard key={post.slug} post={post} featured />
									))}
								</div>
							</section>
						)}

						{/* All Posts */}
						<section>
							<h2 className="text-2xl font-bold text-foreground mb-6">
								{filters.category
									? categoryLabels[filters.category] || filters.category
									: filters.tag
										? `Articles tagges "${filters.tag}"`
										: "Tous les articles"}
							</h2>

							{posts.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-muted-foreground">
										Aucun article trouve.
									</p>
									<Button
										variant="outline"
										onClick={handleClearFilters}
										className="mt-4"
									>
										Voir tous les articles
									</Button>
								</div>
							) : (
								<>
									<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
										{posts.map((post) => (
											<PostCard key={post.slug} post={post} />
										))}
									</div>

									{/* Pagination */}
									{pagination.totalPages > 1 && (
										<div className="flex justify-center gap-2 mt-8">
											{pagination.page > 1 && (
												<Button
													variant="outline"
													onClick={() =>
														router.get("/blog", {
															...filters,
															page: pagination.page - 1,
														})
													}
												>
													Precedent
												</Button>
											)}
											<span className="flex items-center px-4 text-sm text-muted-foreground">
												Page {pagination.page} sur {pagination.totalPages}
											</span>
											{pagination.hasMore && (
												<Button
													variant="outline"
													onClick={() =>
														router.get("/blog", {
															...filters,
															page: pagination.page + 1,
														})
													}
												>
													Suivant
												</Button>
											)}
										</div>
									)}
								</>
							)}
						</section>
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

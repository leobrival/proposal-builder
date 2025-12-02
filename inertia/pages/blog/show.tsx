import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, Clock, Share2, Tag } from "lucide-react";
import { AppHeader } from "../../components/app-header";
import { ThemeProvider } from "../../components/theme-provider";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

interface TableOfContentsItem {
	id: string;
	title: string;
	level: number;
	children: TableOfContentsItem[];
}

interface BlogPost {
	title: string;
	slug: string;
	description: string;
	category: string;
	author: string;
	authorAvatar?: string;
	tags: string[];
	readingTime?: number;
	publishedAt?: string;
	updatedAt?: string;
	coverImage?: string;
	content: string;
	toc: TableOfContentsItem[];
}

interface RelatedPost {
	title: string;
	slug: string;
	category: string;
	excerpt: string;
	publishedAt?: string;
}

interface BlogShowProps {
	post: BlogPost;
	related: RelatedPost[];
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

function TableOfContents({ items }: { items: TableOfContentsItem[] }) {
	if (items.length === 0) return null;

	const renderItems = (items: TableOfContentsItem[], depth = 0) => (
		<ul className={depth > 0 ? "ml-4 mt-2" : ""}>
			{items.map((item) => (
				<li key={item.id} className="mb-2">
					<a
						href={`#${item.id}`}
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						{item.title}
					</a>
					{item.children.length > 0 && renderItems(item.children, depth + 1)}
				</li>
			))}
		</ul>
	);

	return (
		<nav className="sticky top-24 p-4 rounded-lg border bg-card">
			<h4 className="font-semibold text-foreground mb-4">Sommaire</h4>
			{renderItems(items)}
		</nav>
	);
}

export default function BlogShow({ post, related }: BlogShowProps) {
	const handleShare = async () => {
		const url = window.location.href;
		if (navigator.share) {
			await navigator.share({
				title: post.title,
				text: post.description,
				url,
			});
		} else {
			await navigator.clipboard.writeText(url);
		}
	};

	return (
		<ThemeProvider defaultTheme="system" storageKey="sponseasy-theme">
			<Head title={`${post.title} - Blog Spons Easy`}>
				<meta name="description" content={post.description} />
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.description} />
				{post.coverImage && (
					<meta property="og:image" content={post.coverImage} />
				)}
			</Head>

			<div className="min-h-screen bg-background">
				<AppHeader showLogo />

				<main className="px-4 py-8">
					<div className="mx-auto max-w-6xl">
						{/* Back Link */}
						<Link
							href="/blog"
							className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
						>
							<ArrowLeft className="h-4 w-4" />
							Retour au blog
						</Link>

						<div className="grid gap-8 lg:grid-cols-[1fr_300px]">
							{/* Main Content */}
							<article className="space-y-6">
								{/* Header */}
								<header className="space-y-4">
									<div className="flex items-center gap-2">
										<Badge
											variant="secondary"
											className={categoryColors[post.category] || ""}
										>
											{categoryLabels[post.category] || post.category}
										</Badge>
									</div>

									<h1 className="text-4xl font-bold text-foreground">
										{post.title}
									</h1>

									<p className="text-xl text-muted-foreground">
										{post.description}
									</p>

									<div className="flex items-center justify-between flex-wrap gap-4">
										<div className="flex items-center gap-4 text-sm text-muted-foreground">
											<span className="flex items-center gap-2">
												{post.authorAvatar ? (
													<img
														src={post.authorAvatar}
														alt={post.author}
														className="h-8 w-8 rounded-full"
													/>
												) : (
													<div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
														<span className="text-primary font-semibold">
															{post.author.charAt(0)}
														</span>
													</div>
												)}
												{post.author}
											</span>
											{post.publishedAt && (
												<span className="flex items-center gap-1">
													<Calendar className="h-4 w-4" />
													{formatDate(post.publishedAt)}
												</span>
											)}
											{post.readingTime && (
												<span className="flex items-center gap-1">
													<Clock className="h-4 w-4" />
													{post.readingTime} min de lecture
												</span>
											)}
										</div>

										<Button
											variant="outline"
											size="sm"
											onClick={handleShare}
										>
											<Share2 className="h-4 w-4 mr-2" />
											Partager
										</Button>
									</div>
								</header>

								{/* Cover Image */}
								{post.coverImage && (
									<div className="aspect-video rounded-lg overflow-hidden">
										<img
											src={post.coverImage}
											alt={post.title}
											className="w-full h-full object-cover"
										/>
									</div>
								)}

								{/* Content */}
								<div
									className="prose prose-lg dark:prose-invert max-w-none"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown content is trusted
									dangerouslySetInnerHTML={{ __html: post.content }}
								/>

								{/* Tags */}
								{post.tags.length > 0 && (
									<div className="flex items-center gap-2 flex-wrap pt-6 border-t">
										<Tag className="h-4 w-4 text-muted-foreground" />
										{post.tags.map((tag) => (
											<Link
												key={tag}
												href={`/blog?tag=${tag}`}
												className="text-sm text-muted-foreground hover:text-foreground"
											>
												#{tag}
											</Link>
										))}
									</div>
								)}

								{/* Author Bio */}
								<div className="p-6 rounded-lg border bg-card mt-8">
									<div className="flex items-start gap-4">
										{post.authorAvatar ? (
											<img
												src={post.authorAvatar}
												alt={post.author}
												className="h-16 w-16 rounded-full"
											/>
										) : (
											<div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
												<span className="text-2xl text-primary font-semibold">
													{post.author.charAt(0)}
												</span>
											</div>
										)}
										<div>
											<h3 className="font-semibold text-foreground">
												{post.author}
											</h3>
											<p className="text-sm text-muted-foreground mt-1">
												Equipe Spons Easy
											</p>
										</div>
									</div>
								</div>
							</article>

							{/* Sidebar */}
							<aside className="space-y-6">
								{/* Table of Contents */}
								{post.toc.length > 0 && (
									<TableOfContents items={post.toc} />
								)}

								{/* Related Posts */}
								{related.length > 0 && (
									<div className="p-4 rounded-lg border bg-card">
										<h4 className="font-semibold text-foreground mb-4">
											Articles similaires
										</h4>
										<div className="space-y-4">
											{related.map((relatedPost) => (
												<Link
													key={relatedPost.slug}
													href={`/blog/${relatedPost.slug}`}
													className="block group"
												>
													<h5 className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
														{relatedPost.title}
													</h5>
													<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
														{relatedPost.excerpt}
													</p>
												</Link>
											))}
										</div>
									</div>
								)}

								{/* CTA */}
								<div className="p-4 rounded-lg bg-primary text-primary-foreground">
									<h4 className="font-semibold mb-2">
										Creez votre premiere proposition
									</h4>
									<p className="text-sm opacity-90 mb-4">
										Rejoignez la beta et creez des propositions de sponsoring
										professionnelles.
									</p>
									<Button variant="secondary" size="sm" asChild>
										<Link href="/register">Commencer gratuitement</Link>
									</Button>
								</div>
							</aside>
						</div>
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

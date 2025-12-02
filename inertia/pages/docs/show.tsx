import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { AppHeader } from "../../components/app-header";
import { ThemeProvider } from "../../components/theme-provider";
import { Button } from "../../components/ui/button";

interface TableOfContentsItem {
	id: string;
	title: string;
	level: number;
	children: TableOfContentsItem[];
}

interface Doc {
	title: string;
	slug: string;
	description: string;
	section: string;
	order: number;
	icon?: string;
	content: string;
	toc: TableOfContentsItem[];
	updatedAt?: string;
}

interface SidebarDoc {
	slug: string;
	title: string;
	icon?: string;
}

interface Section {
	section: string;
	docs: SidebarDoc[];
}

interface RelatedDoc {
	title: string;
	slug: string;
	section: string;
	excerpt: string;
}

interface DocsShowProps {
	doc: Doc;
	sections: Section[];
	related: RelatedDoc[];
}

const sectionLabels: Record<string, string> = {
	"getting-started": "Demarrage",
	integration: "Integration",
	features: "Fonctionnalites",
	api: "API",
	guides: "Guides",
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
		<nav className="p-4 rounded-lg border bg-card">
			<h4 className="font-semibold text-foreground mb-4">Sur cette page</h4>
			{renderItems(items)}
		</nav>
	);
}

function Sidebar({
	sections,
	currentSlug,
}: {
	sections: Section[];
	currentSlug: string;
}) {
	return (
		<nav className="space-y-6">
			{sections.map((section) => (
				<div key={section.section}>
					<h4 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">
						{sectionLabels[section.section] || section.section}
					</h4>
					<ul className="space-y-1">
						{section.docs.map((doc) => (
							<li key={doc.slug}>
								<Link
									href={`/docs/${doc.slug}`}
									className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
										doc.slug === currentSlug
											? "bg-primary text-primary-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-muted"
									}`}
								>
									{doc.icon && <span>{doc.icon}</span>}
									{doc.title}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</nav>
	);
}

export default function DocsShow({ doc, sections, related }: DocsShowProps) {
	return (
		<ThemeProvider defaultTheme="system" storageKey="sponseasy-theme">
			<Head title={`${doc.title} - Documentation Spons Easy`}>
				<meta name="description" content={doc.description} />
			</Head>

			<div className="min-h-screen bg-background">
				<AppHeader showLogo />

				<div className="mx-auto max-w-7xl px-4 py-8">
					<div className="grid gap-8 lg:grid-cols-[250px_1fr_250px]">
						{/* Sidebar */}
						<aside className="hidden lg:block">
							<div className="sticky top-24">
								<Link
									href="/docs"
									className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
								>
									<BookOpen className="h-4 w-4" />
									Documentation
								</Link>
								<Sidebar sections={sections} currentSlug={doc.slug} />
							</div>
						</aside>

						{/* Main Content */}
						<main className="min-w-0">
							{/* Mobile Back Link */}
							<Link
								href="/docs"
								className="lg:hidden inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
							>
								<ArrowLeft className="h-4 w-4" />
								Retour a la documentation
							</Link>

							{/* Breadcrumb */}
							<nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
								<Link href="/docs" className="hover:text-foreground">
									Documentation
								</Link>
								<ChevronRight className="h-4 w-4" />
								<span className="text-foreground">{doc.title}</span>
							</nav>

							<article className="space-y-6">
								<header className="space-y-2">
									<h1 className="text-4xl font-bold text-foreground">
										{doc.title}
									</h1>
									{doc.description && (
										<p className="text-xl text-muted-foreground">
											{doc.description}
										</p>
									)}
									{doc.updatedAt && (
										<p className="text-sm text-muted-foreground">
											Mis a jour le {formatDate(doc.updatedAt)}
										</p>
									)}
								</header>

								{/* Content */}
								<div
									className="prose prose-lg dark:prose-invert max-w-none"
									// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown content is trusted
									dangerouslySetInnerHTML={{ __html: doc.content }}
								/>

								{/* Related Docs */}
								{related.length > 0 && (
									<div className="pt-8 border-t space-y-4">
										<h3 className="font-semibold text-foreground">
											Articles connexes
										</h3>
										<div className="grid gap-4 md:grid-cols-2">
											{related.map((relatedDoc) => (
												<Link
													key={relatedDoc.slug}
													href={`/docs/${relatedDoc.slug}`}
													className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
												>
													<h4 className="font-medium text-foreground">
														{relatedDoc.title}
													</h4>
													<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
														{relatedDoc.excerpt}
													</p>
												</Link>
											))}
										</div>
									</div>
								)}

								{/* Feedback */}
								<div className="pt-8 border-t">
									<p className="text-muted-foreground text-sm">
										Cette page vous a-t-elle ete utile ?{" "}
										<a
											href="mailto:support@sponseasy.com"
											className="text-primary hover:underline"
										>
											Donnez-nous votre avis
										</a>
									</p>
								</div>
							</article>
						</main>

						{/* Right Sidebar - TOC */}
						<aside className="hidden xl:block">
							<div className="sticky top-24 space-y-6">
								{doc.toc.length > 0 && <TableOfContents items={doc.toc} />}

								{/* CTA */}
								<div className="p-4 rounded-lg bg-primary text-primary-foreground">
									<h4 className="font-semibold mb-2">Besoin d'aide ?</h4>
									<p className="text-sm opacity-90 mb-4">
										Notre equipe est la pour vous accompagner.
									</p>
									<Button variant="secondary" size="sm" asChild>
										<a href="mailto:support@sponseasy.com">Nous contacter</a>
									</Button>
								</div>
							</div>
						</aside>
					</div>
				</div>

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

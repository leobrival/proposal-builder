import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, History } from "lucide-react";
import { AppHeader } from "../../components/app-header";
import { ThemeProvider } from "../../components/theme-provider";
import { Badge } from "../../components/ui/badge";

interface ChangelogEntry {
	version: string;
	date: string;
	title: string;
	description?: string;
}

interface ChangelogIndexProps {
	entries: ChangelogEntry[];
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function getVersionType(version: string): "major" | "minor" | "patch" {
	const parts = version.split(".");
	if (parts.length < 3) return "patch";

	const [major, minor] = parts.map(Number);

	if (major > 0 && minor === 0 && parts[2] === "0") return "major";
	if (parts[2] === "0") return "minor";
	return "patch";
}

const versionBadgeColors: Record<string, string> = {
	major: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
	minor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
	patch: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

const versionLabels: Record<string, string> = {
	major: "Version majeure",
	minor: "Nouvelle fonctionnalite",
	patch: "Correction",
};

export default function ChangelogIndex({ entries }: ChangelogIndexProps) {
	return (
		<ThemeProvider defaultTheme="system" storageKey="sponseasy-theme">
			<Head title="Changelog - Spons Easy" />

			<div className="min-h-screen bg-background">
				<AppHeader showLogo />

				{/* Hero Section */}
				<section className="px-4 py-12 md:py-16 border-b bg-muted/30">
					<div className="mx-auto max-w-4xl">
						<div className="space-y-4 text-center">
							<History className="h-12 w-12 mx-auto text-primary" />
							<h1 className="text-4xl font-bold tracking-tight text-foreground">
								Changelog
							</h1>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
								Historique des mises a jour et nouvelles fonctionnalites de
								Spons Easy
							</p>
						</div>
					</div>
				</section>

				<main className="px-4 py-12">
					<div className="mx-auto max-w-4xl">
						{entries.length === 0 ? (
							<div className="text-center py-12">
								<p className="text-muted-foreground">
									Aucune mise a jour enregistree pour le moment.
								</p>
							</div>
						) : (
							<div className="relative">
								{/* Timeline line */}
								<div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

								<div className="space-y-8">
									{entries.map((entry, index) => {
										const versionType = getVersionType(entry.version);

										return (
											<div
												key={entry.version}
												className={`relative flex items-start gap-8 ${
													index % 2 === 0
														? "md:flex-row"
														: "md:flex-row-reverse"
												}`}
											>
												{/* Timeline dot */}
												<div className="absolute left-4 w-3 h-3 rounded-full bg-primary border-4 border-background md:left-1/2 md:-translate-x-1.5 z-10" />

												{/* Content */}
												<div
													className={`flex-1 ml-12 md:ml-0 ${
														index % 2 === 0 ? "md:pr-12" : "md:pl-12"
													}`}
												>
													<div className="p-6 rounded-lg border bg-card">
														<div className="flex items-center gap-3 mb-3 flex-wrap">
															<Badge
																variant="outline"
																className="font-mono text-lg"
															>
																v{entry.version}
															</Badge>
															<Badge
																variant="secondary"
																className={versionBadgeColors[versionType]}
															>
																{versionLabels[versionType]}
															</Badge>
														</div>

														<h2 className="text-xl font-semibold text-foreground mb-2">
															{entry.title}
														</h2>

														<p className="text-sm text-muted-foreground mb-4">
															{formatDate(entry.date)}
														</p>

														{entry.description && (
															<p className="text-muted-foreground whitespace-pre-line">
																{entry.description}
															</p>
														)}
													</div>
												</div>

												{/* Spacer for alternating layout */}
												<div className="hidden md:block flex-1" />
											</div>
										);
									})}
								</div>
							</div>
						)}

						{/* Links */}
						<div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/docs"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border bg-card hover:bg-muted transition-colors"
							>
								Documentation
							</Link>
							<Link
								href="/blog"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border bg-card hover:bg-muted transition-colors"
							>
								Blog
							</Link>
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

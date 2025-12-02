import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { SectionRenderer } from "../../components/builder/sections/SectionRenderer";
import { Button } from "../../components/ui/button";
import type { Proposal } from "../../types";
import type { PageLayout, Section } from "../../types/builder";

interface PreviewPageProps {
	proposal: Proposal;
	layout: PageLayout | null;
}

export default function PreviewPage({ proposal, layout }: PreviewPageProps) {
	const [isFullscreen, setIsFullscreen] = useState(false);

	if (!layout || layout.sections.length === 0) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
				<Head title={`Prévisualisation - ${proposal.title}`} />
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Aucun contenu</h1>
					<p className="text-muted-foreground mb-6">
						Cette proposition n'a pas encore de page personnalisée.
					</p>
					<Link href={`/proposals/${proposal.id}/builder`}>
						<Button>Créer la page</Button>
					</Link>
				</div>
			</div>
		);
	}

	const { globalStyles } = layout;

	const globalCssVars = {
		"--color-primary": globalStyles.colors.primary,
		"--color-secondary": globalStyles.colors.secondary,
		"--color-accent": globalStyles.colors.accent,
		"--color-background": globalStyles.colors.background,
		"--color-text": globalStyles.colors.text,
		"--font-heading": globalStyles.fonts.heading,
		"--font-body": globalStyles.fonts.body,
	} as React.CSSProperties;

	if (isFullscreen) {
		return (
			<>
				<Head title={proposal.title} />
				<div
					className="min-h-screen"
					style={{
						...globalCssVars,
						backgroundColor: globalStyles.colors.background,
						color: globalStyles.colors.text,
						fontFamily: globalStyles.fonts.body,
					}}
				>
					<Button
						variant="outline"
						size="icon"
						className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur"
						onClick={() => setIsFullscreen(false)}
					>
						<X className="h-4 w-4" />
					</Button>

					{layout.sections
						.filter((section) => section.isVisible)
						.map((section) => (
							<div
								key={section.id}
								id={section.elementId}
								className={globalStyles.spacing.sectionPadding}
							>
								<div
									className={`mx-auto ${globalStyles.spacing.containerWidth}`}
								>
									<SectionRenderer section={section} proposal={proposal} />
								</div>
								{section.customCss && (
									<style>{`#${section.elementId} { ${section.customCss} }`}</style>
								)}
							</div>
						))}
				</div>
			</>
		);
	}

	return (
		<div className="min-h-screen bg-muted/30">
			<Head title={`Prévisualisation - ${proposal.title}`} />

			<div className="sticky top-0 z-50 flex items-center justify-between h-12 px-4 border-b bg-background/95 backdrop-blur">
				<div className="flex items-center gap-4">
					<Link
						href={`/proposals/${proposal.id}/builder`}
						className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Retour au builder
					</Link>
					<div className="h-4 w-px bg-border" />
					<span className="text-sm font-medium">
						Prévisualisation : {proposal.title}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsFullscreen(true)}
					>
						<ExternalLink className="h-4 w-4 mr-2" />
						Plein écran
					</Button>
					{proposal.status === "published" && (
						<a
							href={`/p/${proposal.slug}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button size="sm">
								<ExternalLink className="h-4 w-4 mr-2" />
								Page publique
							</Button>
						</a>
					)}
				</div>
			</div>

			<div className="p-6">
				<div
					className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
					style={{ maxWidth: "1280px" }}
				>
					<div
						style={{
							...globalCssVars,
							backgroundColor: globalStyles.colors.background,
							color: globalStyles.colors.text,
							fontFamily: globalStyles.fonts.body,
						}}
					>
						{layout.sections
							.filter((section) => section.isVisible)
							.map((section) => (
								<div
									key={section.id}
									id={section.elementId}
									className={globalStyles.spacing.sectionPadding}
								>
									<div
										className={`mx-auto px-4 ${globalStyles.spacing.containerWidth}`}
									>
										<SectionRenderer section={section} proposal={proposal} />
									</div>
									{section.customCss && (
										<style>{`#${section.elementId} { ${section.customCss} }`}</style>
									)}
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}

import type { Proposal } from "../../../types";
import type { Section } from "../../../types/builder";
import { AboutSection } from "./AboutSection";
import { BenefitsSection } from "./BenefitsSection";
import { ContactSection } from "./ContactSection";
import { CtaSection } from "./CtaSection";
import { CustomSection } from "./CustomSection";
import { EventDetailsSection } from "./EventDetailsSection";
import { FaqSection } from "./FaqSection";
import { GallerySection } from "./GallerySection";
import { HeroSection } from "./HeroSection";
import { SponsorsSection } from "./SponsorsSection";
import { TeamSection } from "./TeamSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { TiersSection } from "./TiersSection";
import { TimelineSection } from "./TimelineSection";

interface SectionRendererProps {
	section: Section;
	proposal?: Proposal;
}

export function SectionRenderer({ section, proposal }: SectionRendererProps) {
	// Apply section custom CSS
	const renderWithCss = (content: React.ReactNode) => (
		<>
			{content}
			{section.customCss && (
				<style>{`#${section.elementId} { ${section.customCss} }`}</style>
			)}
		</>
	);

	switch (section.type) {
		case "hero":
			return renderWithCss(<HeroSection section={section} />);
		case "about":
			return renderWithCss(<AboutSection section={section} />);
		case "event-details":
			return renderWithCss(<EventDetailsSection section={section} />);
		case "tiers":
			return renderWithCss(<TiersSection section={section} />);
		case "benefits":
			return renderWithCss(<BenefitsSection section={section} />);
		case "gallery":
			return renderWithCss(<GallerySection section={section} />);
		case "testimonials":
			return renderWithCss(<TestimonialsSection section={section} />);
		case "sponsors":
			return renderWithCss(<SponsorsSection section={section} />);
		case "team":
			return renderWithCss(<TeamSection section={section} />);
		case "timeline":
			return renderWithCss(<TimelineSection section={section} />);
		case "faq":
			return renderWithCss(<FaqSection section={section} />);
		case "contact":
			return renderWithCss(<ContactSection section={section} />);
		case "cta":
			return renderWithCss(<CtaSection section={section} />);
		case "custom":
			return renderWithCss(<CustomSection section={section} />);
		default:
			return renderWithCss(<PlaceholderSection section={section} />);
	}
}

// Placeholder component for unknown sections
function PlaceholderSection({ section }: { section: Section }) {
	return (
		<div className="py-12 px-6 bg-muted/50 border border-dashed border-border rounded-lg">
			<div className="text-center">
				<h3 className="text-lg font-medium text-muted-foreground mb-2">
					Section: {section.type}
				</h3>
				<p className="text-sm text-muted-foreground">
					Type de section non reconnu
				</p>
			</div>
		</div>
	);
}

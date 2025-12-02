import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import type { FaqSettings, Section } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface FaqSectionProps {
	section: Section;
}

const defaultFaqs = [
	{
		id: "1",
		question: "Quels sont les differents niveaux de sponsoring ?",
		answer:
			"Nous proposons plusieurs niveaux de partenariat : Gold, Silver et Bronze. Chaque niveau offre des avantages specifiques en termes de visibilite, d'acces et de networking.",
	},
	{
		id: "2",
		question: "Combien de participants sont attendus ?",
		answer:
			"Nous attendons entre 200 et 300 participants qualifies, comprenant des decideurs, entrepreneurs et professionnels du secteur.",
	},
	{
		id: "3",
		question: "Quels sont les avantages pour les sponsors ?",
		answer:
			"Les sponsors beneficient d'une visibilite sur tous nos supports de communication, d'un stand dedie, de places VIP, et d'un acces privilegie aux sessions de networking.",
	},
	{
		id: "4",
		question: "Comment puis-je devenir sponsor ?",
		answer:
			"Contactez-nous via le formulaire de contact ou par email. Notre equipe vous recontactera sous 48h pour discuter des opportunites de partenariat.",
	},
	{
		id: "5",
		question: "Quelle est la date limite pour devenir sponsor ?",
		answer:
			"Nous acceptons les inscriptions jusqu'a 2 semaines avant l'evenement, mais nous vous conseillons de nous contacter au plus tot pour beneficier de la meilleure visibilite.",
	},
];

export function FaqSection({ section }: FaqSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as FaqSettings;
	const { colors, typography } = layout.globalStyles;
	const [openItems, setOpenItems] = useState<Set<string>>(new Set());

	const faqs = settings.faqs?.length > 0 ? settings.faqs : defaultFaqs;
	const cols = settings.columns || 1;

	const toggleItem = (id: string) => {
		const newOpenItems = new Set(openItems);
		if (newOpenItems.has(id)) {
			newOpenItems.delete(id);
		} else {
			newOpenItems.add(id);
		}
		setOpenItems(newOpenItems);
	};

	const FaqItem = ({ faq }: { faq: (typeof faqs)[0] }) => {
		const isOpen = openItems.has(faq.id);

		if (settings.layout === "simple") {
			return (
				<div
					className="py-4 border-b"
					style={{ borderColor: colors.muted + "20" }}
				>
					<h3
						className="font-semibold mb-2"
						style={{ color: colors.text }}
						contentEditable
						suppressContentEditableWarning
					>
						{faq.question}
					</h3>
					<p
						className="text-sm"
						style={{ color: colors.muted }}
						contentEditable
						suppressContentEditableWarning
					>
						{faq.answer}
					</p>
				</div>
			);
		}

		return (
			<div
				className="border rounded-lg overflow-hidden"
				style={{ borderColor: colors.muted + "20" }}
			>
				<button
					onClick={() => toggleItem(faq.id)}
					className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
					style={{
						backgroundColor: isOpen ? colors.muted + "10" : "transparent",
					}}
				>
					<span className="font-semibold pr-4" style={{ color: colors.text }}>
						{faq.question}
					</span>
					<ChevronDown
						className={cn(
							"w-5 h-5 shrink-0 transition-transform duration-200",
							isOpen && "rotate-180",
						)}
						style={{ color: colors.muted }}
					/>
				</button>
				<div
					className={cn(
						"overflow-hidden transition-all duration-200",
						isOpen ? "max-h-96" : "max-h-0",
					)}
				>
					<p
						className="p-4 pt-0 text-sm"
						style={{ color: colors.muted }}
						contentEditable
						suppressContentEditableWarning
					>
						{faq.answer}
					</p>
				</div>
			</div>
		);
	};

	return (
		<div className="py-12">
			<div className="text-center mb-10">
				<h2
					className="text-2xl md:text-3xl font-bold mb-4"
					style={{
						fontFamily: typography.headingFont,
						color: colors.text,
					}}
					contentEditable
					suppressContentEditableWarning
				>
					Questions frequentes
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Retrouvez les reponses aux questions les plus courantes
				</p>
			</div>

			<div
				className={cn(
					"max-w-4xl mx-auto",
					settings.layout === "grid" &&
						`grid grid-cols-1 md:grid-cols-${cols} gap-4`,
					settings.layout !== "grid" && "space-y-3",
				)}
			>
				{faqs.map((faq) => (
					<FaqItem key={faq.id} faq={faq} />
				))}
			</div>
		</div>
	);
}

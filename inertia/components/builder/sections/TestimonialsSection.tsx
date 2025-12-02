import { ChevronLeft, ChevronRight, Quote, User } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import type { Section, TestimonialsSettings } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface TestimonialsSectionProps {
	section: Section;
}

const defaultTestimonials = [
	{
		id: "1",
		quote:
			"Un evenement exceptionnel qui nous a permis de rencontrer des partenaires cles. Le retour sur investissement a ete au-dela de nos attentes.",
		author: "Marie Dupont",
		role: "Directrice Marketing",
		company: "TechCorp",
		avatarUrl: "",
	},
	{
		id: "2",
		quote:
			"L'organisation etait parfaite et l'audience tres qualifiee. Nous avons signe plusieurs contrats suite a notre participation.",
		author: "Jean Martin",
		role: "CEO",
		company: "InnoStart",
		avatarUrl: "",
	},
	{
		id: "3",
		quote:
			"Une visibilite exceptionnelle aupres de notre cible. Nous recommandons vivement ce partenariat.",
		author: "Sophie Bernard",
		role: "Responsable Partenariats",
		company: "BigBrand",
		avatarUrl: "",
	},
];

export function TestimonialsSection({ section }: TestimonialsSectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as TestimonialsSettings;
	const { colors, typography } = layout.globalStyles;
	const [currentIndex, setCurrentIndex] = useState(0);

	const testimonials =
		settings.testimonials?.length > 0
			? settings.testimonials
			: defaultTestimonials;

	const nextSlide = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
	};

	const prevSlide = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length,
		);
	};

	const TestimonialCard = ({
		testimonial,
		isActive = true,
	}: {
		testimonial: (typeof testimonials)[0];
		isActive?: boolean;
	}) => (
		<div
			className={cn(
				"p-6 rounded-xl transition-all duration-300",
				isActive ? "opacity-100" : "opacity-50",
			)}
			style={{
				backgroundColor: colors.background,
				border: `1px solid ${colors.muted}20`,
			}}
		>
			<Quote
				className="w-8 h-8 mb-4"
				style={{ color: colors.primary + "40" }}
			/>
			<p
				className="text-lg mb-6 italic"
				style={{ color: colors.text }}
				contentEditable
				suppressContentEditableWarning
			>
				"{testimonial.quote}"
			</p>
			<div className="flex items-center gap-4">
				{settings.showAvatar !== false && (
					<div
						className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
						style={{ backgroundColor: colors.primary + "15" }}
					>
						{testimonial.avatarUrl ? (
							<img
								src={testimonial.avatarUrl}
								alt={testimonial.author}
								className="w-full h-full object-cover"
							/>
						) : (
							<User className="w-6 h-6" style={{ color: colors.primary }} />
						)}
					</div>
				)}
				<div>
					<div
						className="font-semibold"
						style={{ color: colors.text }}
						contentEditable
						suppressContentEditableWarning
					>
						{testimonial.author}
					</div>
					{testimonial.role && (
						<div
							className="text-sm"
							style={{ color: colors.muted }}
							contentEditable
							suppressContentEditableWarning
						>
							{testimonial.role}
							{settings.showCompany !== false && testimonial.company && (
								<span> - {testimonial.company}</span>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);

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
					Ce que disent nos sponsors
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Decouvrez les retours de nos partenaires des editions precedentes
				</p>
			</div>

			{settings.layout === "carousel" ? (
				<div className="relative max-w-3xl mx-auto">
					<div className="overflow-hidden">
						<div
							className="flex transition-transform duration-300"
							style={{ transform: `translateX(-${currentIndex * 100}%)` }}
						>
							{testimonials.map((testimonial) => (
								<div key={testimonial.id} className="w-full shrink-0 px-4">
									<TestimonialCard testimonial={testimonial} />
								</div>
							))}
						</div>
					</div>

					{testimonials.length > 1 && (
						<>
							<button
								onClick={prevSlide}
								className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg hover:bg-gray-50 transition-colors"
							>
								<ChevronLeft
									className="w-6 h-6"
									style={{ color: colors.text }}
								/>
							</button>
							<button
								onClick={nextSlide}
								className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg hover:bg-gray-50 transition-colors"
							>
								<ChevronRight
									className="w-6 h-6"
									style={{ color: colors.text }}
								/>
							</button>

							<div className="flex justify-center gap-2 mt-6">
								{testimonials.map((_, index) => (
									<button
										key={index}
										onClick={() => setCurrentIndex(index)}
										className="w-2 h-2 rounded-full transition-colors"
										style={{
											backgroundColor:
												index === currentIndex
													? colors.primary
													: colors.muted + "40",
										}}
									/>
								))}
							</div>
						</>
					)}
				</div>
			) : settings.layout === "stacked" ? (
				<div className="max-w-2xl mx-auto space-y-6">
					{testimonials.map((testimonial) => (
						<TestimonialCard key={testimonial.id} testimonial={testimonial} />
					))}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{testimonials.map((testimonial) => (
						<TestimonialCard key={testimonial.id} testimonial={testimonial} />
					))}
				</div>
			)}
		</div>
	);
}

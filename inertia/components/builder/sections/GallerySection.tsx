import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import type { GallerySettings, Section } from "../../../types/builder";
import { useBuilder } from "../BuilderContext";

interface GallerySectionProps {
	section: Section;
}

const defaultImages = [
	{ id: "1", url: "", alt: "Image 1", caption: "Edition 2024" },
	{ id: "2", url: "", alt: "Image 2", caption: "Networking" },
	{ id: "3", url: "", alt: "Image 3", caption: "Conference" },
	{ id: "4", url: "", alt: "Image 4", caption: "Sponsors" },
	{ id: "5", url: "", alt: "Image 5", caption: "Participants" },
	{ id: "6", url: "", alt: "Image 6", caption: "Ceremonie" },
];

export function GallerySection({ section }: GallerySectionProps) {
	const { layout } = useBuilder();
	const settings = section.settings as GallerySettings;
	const { colors, typography } = layout.globalStyles;
	const [currentIndex, setCurrentIndex] = useState(0);

	const images = settings.images?.length > 0 ? settings.images : defaultImages;
	const cols = settings.columns || 3;

	const getGapClass = () => {
		switch (settings.gap) {
			case "small":
				return "gap-2";
			case "large":
				return "gap-6";
			default:
				return "gap-4";
		}
	};

	const nextSlide = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	const prevSlide = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
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
					Galerie photos
				</h2>
				<p
					className="text-lg max-w-2xl mx-auto"
					style={{ color: colors.muted }}
					contentEditable
					suppressContentEditableWarning
				>
					Retrouvez les moments forts de nos editions precedentes
				</p>
			</div>

			{settings.layout === "carousel" ? (
				<div className="relative">
					<div className="overflow-hidden rounded-lg">
						<div
							className="flex transition-transform duration-300"
							style={{ transform: `translateX(-${currentIndex * 100}%)` }}
						>
							{images.map((image, index) => (
								<div
									key={image.id || index}
									className="w-full shrink-0 aspect-video"
									style={{ backgroundColor: colors.muted + "20" }}
								>
									{image.url ? (
										<img
											src={image.url}
											alt={image.alt || `Image ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<div className="text-center">
												<ImageIcon
													className="w-12 h-12 mx-auto mb-2"
													style={{ color: colors.muted }}
												/>
												<p style={{ color: colors.muted }}>
													{image.caption || `Image ${index + 1}`}
												</p>
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					<button
						onClick={prevSlide}
						className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white transition-colors shadow-lg"
					>
						<ChevronLeft className="w-6 h-6" style={{ color: colors.text }} />
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white transition-colors shadow-lg"
					>
						<ChevronRight className="w-6 h-6" style={{ color: colors.text }} />
					</button>

					<div className="flex justify-center gap-2 mt-4">
						{images.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrentIndex(index)}
								className={cn(
									"w-2 h-2 rounded-full transition-colors",
									index === currentIndex ? "bg-primary" : "bg-gray-300",
								)}
								style={{
									backgroundColor:
										index === currentIndex
											? colors.primary
											: colors.muted + "40",
								}}
							/>
						))}
					</div>
				</div>
			) : (
				<div
					className={cn(
						`grid grid-cols-2 md:grid-cols-${cols}`,
						getGapClass(),
						settings.layout === "masonry" && "auto-rows-[200px]",
					)}
				>
					{images.map((image, index) => (
						<div
							key={image.id || index}
							className={cn(
								"rounded-lg overflow-hidden aspect-video",
								settings.layout === "masonry" &&
									index % 3 === 0 &&
									"row-span-2 aspect-auto",
							)}
							style={{ backgroundColor: colors.muted + "20" }}
						>
							{image.url ? (
								<img
									src={image.url}
									alt={image.alt || `Image ${index + 1}`}
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<div className="text-center p-4">
										<ImageIcon
											className="w-8 h-8 mx-auto mb-2"
											style={{ color: colors.muted }}
										/>
										<p className="text-sm" style={{ color: colors.muted }}>
											{image.caption || `Image ${index + 1}`}
										</p>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

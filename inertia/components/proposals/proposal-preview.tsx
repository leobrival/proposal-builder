import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Proposal } from "../../types";

interface ProposalPreviewProps {
	proposal: Proposal;
}

export function ProposalPreview({ proposal }: ProposalPreviewProps) {
	const { designSettings } = proposal;

	return (
		<div
			className="min-h-full p-8"
			style={{
				fontFamily: designSettings.fontFamily,
				backgroundColor: "#ffffff",
			}}
		>
			<header
				className={cn("mb-8", {
					"text-left": designSettings.logoPosition === "left",
					"text-center": designSettings.logoPosition === "center",
					"text-right": designSettings.logoPosition === "right",
				})}
			>
				{proposal.logoUrl && (
					<img
						src={proposal.logoUrl}
						alt="Logo"
						className="h-16 inline-block mb-4"
					/>
				)}
				<h1
					className="text-3xl font-bold mb-2"
					style={{ color: designSettings.primaryColor }}
				>
					{proposal.title || "Titre de la proposition"}
				</h1>
				<p className="text-lg text-gray-600">
					{proposal.projectName || "Nom du projet"}
				</p>
			</header>

			{proposal.coverImageUrl && (
				<div className="mb-8 rounded-lg overflow-hidden">
					<img
						src={proposal.coverImageUrl}
						alt="Cover"
						className="w-full h-48 object-cover"
					/>
				</div>
			)}

			{proposal.description && (
				<section className="mb-8">
					<h2
						className="text-xl font-semibold mb-3"
						style={{ color: designSettings.primaryColor }}
					>
						À propos de cette proposition
					</h2>
					<p className="text-gray-700 whitespace-pre-wrap">
						{proposal.description}
					</p>
				</section>
			)}

			{proposal.projectDescription && (
				<section className="mb-8">
					<h2
						className="text-xl font-semibold mb-3"
						style={{ color: designSettings.primaryColor }}
					>
						Le projet
					</h2>
					<p className="text-gray-700 whitespace-pre-wrap">
						{proposal.projectDescription}
					</p>
				</section>
			)}

			{proposal.tiers && proposal.tiers.length > 0 && (
				<section className="mb-8">
					<h2
						className="text-xl font-semibold mb-6 text-center"
						style={{ color: designSettings.primaryColor }}
					>
						Nos offres de sponsoring
					</h2>
					<div
						className={cn("grid gap-6", {
							"grid-cols-1": proposal.tiers.length === 1,
							"grid-cols-1 md:grid-cols-2": proposal.tiers.length === 2,
							"grid-cols-1 md:grid-cols-2 lg:grid-cols-3":
								proposal.tiers.length >= 3,
						})}
					>
						{proposal.tiers.map((tier) => (
							<div
								key={tier.id}
								className={cn(
									"relative rounded-lg border p-6 transition-shadow hover:shadow-lg",
									tier.isFeatured ? "border-2 shadow-md" : "border-gray-200",
								)}
								style={{
									borderColor: tier.isFeatured
										? designSettings.primaryColor
										: undefined,
								}}
							>
								{tier.isFeatured && (
									<div
										className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-semibold text-white rounded-full"
										style={{ backgroundColor: designSettings.primaryColor }}
									>
										Populaire
									</div>
								)}

								<h3
									className="text-xl font-bold mb-2"
									style={{ color: designSettings.primaryColor }}
								>
									{tier.name || "Palier"}
								</h3>

								<div className="mb-4">
									<span className="text-3xl font-bold">
										{tier.price.toLocaleString("fr-FR")}
									</span>
									<span className="text-gray-500 ml-1">{tier.currency}</span>
								</div>

								{tier.description && (
									<p className="text-sm text-gray-600 mb-4">
										{tier.description}
									</p>
								)}

								{tier.maxSponsors && (
									<p className="text-xs text-gray-500 mb-4">
										Limité à {tier.maxSponsors} sponsor
										{tier.maxSponsors > 1 ? "s" : ""}
									</p>
								)}

								{tier.benefits.length > 0 && (
									<ul className="space-y-2">
										{tier.benefits.map((benefit) => (
											<li key={benefit.id} className="flex items-start gap-2">
												<Check
													className="h-5 w-5 shrink-0 mt-0.5"
													style={{ color: designSettings.primaryColor }}
												/>
												<span className="text-sm text-gray-700">
													{benefit.description}
												</span>
											</li>
										))}
									</ul>
								)}
							</div>
						))}
					</div>
				</section>
			)}

			<footer className="mt-12 pt-8 border-t border-gray-200 text-center">
				<h3
					className="text-lg font-semibold mb-2"
					style={{ color: designSettings.primaryColor }}
				>
					Intéressé ?
				</h3>
				<p className="text-gray-600 mb-4">
					Contactez-nous pour en savoir plus sur nos offres de sponsoring.
				</p>
				<div className="space-y-1 text-sm text-gray-500">
					<p>{proposal.contactEmail}</p>
					{proposal.contactPhone && <p>{proposal.contactPhone}</p>}
				</div>
			</footer>
		</div>
	);
}

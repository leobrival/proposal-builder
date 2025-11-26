import { Head } from "@inertiajs/react";
import { Check, Mail, Phone } from "lucide-react";
import { cn } from "../../lib/utils";
import type { Proposal } from "../../types";

interface PublicProposalProps {
	proposal: Proposal;
}

export default function PublicProposal({ proposal }: PublicProposalProps) {
	const designSettings = proposal.designSettings || {
		primaryColor: "#3B82F6",
		secondaryColor: "#1E40AF",
		fontFamily: "Inter",
		logoPosition: "center",
		layout: "modern",
	};

	return (
		<>
			<Head title={proposal.title} />
			<div
				className="min-h-screen"
				style={{
					fontFamily: designSettings.fontFamily,
					backgroundColor: "#f9fafb",
				}}
			>
				<div className="max-w-4xl mx-auto px-4 py-12">
					<header
						className={cn("mb-12", {
							"text-left": designSettings.logoPosition === "left",
							"text-center": designSettings.logoPosition === "center",
							"text-right": designSettings.logoPosition === "right",
						})}
					>
						{proposal.logoUrl && (
							<img
								src={proposal.logoUrl}
								alt="Logo"
								className="h-20 inline-block mb-6"
							/>
						)}
						<h1
							className="text-4xl md:text-5xl font-bold mb-4"
							style={{ color: designSettings.primaryColor }}
						>
							{proposal.title}
						</h1>
						<p className="text-xl text-gray-600">{proposal.projectName}</p>
					</header>

					{proposal.coverImageUrl && (
						<div className="mb-12 rounded-xl overflow-hidden shadow-lg">
							<img
								src={proposal.coverImageUrl}
								alt="Cover"
								className="w-full h-64 md:h-80 object-cover"
							/>
						</div>
					)}

					<div className="bg-white rounded-xl shadow-sm p-8 mb-8">
						{proposal.description && (
							<section className="mb-10">
								<h2
									className="text-2xl font-semibold mb-4"
									style={{ color: designSettings.primaryColor }}
								>
									À propos de cette proposition
								</h2>
								<p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
									{proposal.description}
								</p>
							</section>
						)}

						{proposal.projectDescription && (
							<section className="mb-10">
								<h2
									className="text-2xl font-semibold mb-4"
									style={{ color: designSettings.primaryColor }}
								>
									Le projet
								</h2>
								<p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
									{proposal.projectDescription}
								</p>
							</section>
						)}
					</div>

					{proposal.tiers && proposal.tiers.length > 0 && (
						<section className="mb-12">
							<h2
								className="text-2xl font-semibold mb-8 text-center"
								style={{ color: designSettings.primaryColor }}
							>
								Nos offres de sponsoring
							</h2>
							<div
								className={cn("grid gap-6", {
									"grid-cols-1 max-w-md mx-auto": proposal.tiers.length === 1,
									"grid-cols-1 md:grid-cols-2": proposal.tiers.length === 2,
									"grid-cols-1 md:grid-cols-2 lg:grid-cols-3":
										proposal.tiers.length >= 3,
								})}
							>
								{proposal.tiers.map((tier) => (
									<div
										key={tier.id}
										className={cn(
											"relative bg-white rounded-xl p-8 transition-all hover:shadow-xl",
											tier.isFeatured
												? "border-2 shadow-lg scale-105"
												: "border border-gray-200 shadow-sm",
										)}
										style={{
											borderColor: tier.isFeatured
												? designSettings.primaryColor
												: undefined,
										}}
									>
										{tier.isFeatured && (
											<div
												className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-sm font-semibold text-white rounded-full"
												style={{ backgroundColor: designSettings.primaryColor }}
											>
												Populaire
											</div>
										)}

										<h3
											className="text-2xl font-bold mb-3"
											style={{ color: designSettings.primaryColor }}
										>
											{tier.name}
										</h3>

										<div className="mb-6">
											<span className="text-4xl font-bold">
												{tier.price.toLocaleString("fr-FR")}
											</span>
											<span className="text-gray-500 ml-2 text-lg">
												{tier.currency}
											</span>
										</div>

										{tier.description && (
											<p className="text-gray-600 mb-6">{tier.description}</p>
										)}

										{tier.maxSponsors && (
											<p className="text-sm text-gray-500 mb-6 font-medium">
												Limité à {tier.maxSponsors} sponsor
												{tier.maxSponsors > 1 ? "s" : ""}
											</p>
										)}

										{tier.benefits.length > 0 && (
											<ul className="space-y-3">
												{tier.benefits.map((benefit) => (
													<li
														key={benefit.id}
														className="flex items-start gap-3"
													>
														<div
															className="rounded-full p-1"
															style={{
																backgroundColor: `${designSettings.primaryColor}20`,
															}}
														>
															<Check
																className="h-4 w-4"
																style={{ color: designSettings.primaryColor }}
															/>
														</div>
														<span className="text-gray-700">
															{benefit.description}
														</span>
													</li>
												))}
											</ul>
										)}

										<a
											href={`mailto:${proposal.contactEmail}?subject=Intéressé par ${tier.name} - ${proposal.title}`}
											className="mt-8 block w-full text-center py-3 px-6 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
											style={{ backgroundColor: designSettings.primaryColor }}
										>
											Choisir cette offre
										</a>
									</div>
								))}
							</div>
						</section>
					)}

					<footer className="bg-white rounded-xl shadow-sm p-8 text-center">
						<h3
							className="text-2xl font-semibold mb-4"
							style={{ color: designSettings.primaryColor }}
						>
							Intéressé par un partenariat ?
						</h3>
						<p className="text-gray-600 mb-6 max-w-lg mx-auto">
							Contactez-nous pour discuter de vos besoins et découvrir comment
							nous pouvons collaborer ensemble.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<a
								href={`mailto:${proposal.contactEmail}`}
								className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
								style={{ backgroundColor: designSettings.primaryColor }}
							>
								<Mail className="h-5 w-5" />
								{proposal.contactEmail}
							</a>
							{proposal.contactPhone && (
								<a
									href={`tel:${proposal.contactPhone}`}
									className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-colors hover:bg-gray-50"
									style={{
										borderColor: designSettings.primaryColor,
										color: designSettings.primaryColor,
									}}
								>
									<Phone className="h-5 w-5" />
									{proposal.contactPhone}
								</a>
							)}
						</div>
					</footer>

					<div className="mt-8 text-center text-sm text-gray-500">
						<p>
							Propulsé par{" "}
							<a href="/" className="font-medium hover:underline">
								Sponseasy
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	);
}

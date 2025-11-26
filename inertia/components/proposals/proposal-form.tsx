import type { Proposal, Tier } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { TierForm } from "./tier-form";

interface ProposalFormProps {
	proposal: Proposal;
	onChange: (updates: Partial<Proposal>) => void;
	onTierChange: (tierId: string, updates: Partial<Tier>) => void;
	onTierAdd: () => void;
	onTierRemove: (tierId: string) => void;
	onBenefitAdd: (tierId: string) => void;
	onBenefitRemove: (tierId: string, benefitId: string) => void;
	onBenefitChange: (
		tierId: string,
		benefitId: string,
		description: string,
	) => void;
}

export function ProposalForm({
	proposal,
	onChange,
	onTierChange,
	onTierAdd,
	onTierRemove,
	onBenefitAdd,
	onBenefitRemove,
	onBenefitChange,
}: ProposalFormProps) {
	return (
		<div className="space-y-8">
			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Informations du projet</h2>

				<div className="space-y-2">
					<Label htmlFor="title">Titre de la proposition</Label>
					<Input
						id="title"
						value={proposal.title}
						onChange={(e) => onChange({ title: e.target.value })}
						placeholder="Ex: Sponsoring Festival 2024"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="projectName">Nom du projet</Label>
					<Input
						id="projectName"
						value={proposal.projectName}
						onChange={(e) => onChange({ projectName: e.target.value })}
						placeholder="Ex: Festival de Musique"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">Description de la proposition</Label>
					<Textarea
						id="description"
						value={proposal.description || ""}
						onChange={(e) => onChange({ description: e.target.value || null })}
						placeholder="Décrivez votre proposition de sponsoring..."
						rows={3}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="projectDescription">Description du projet</Label>
					<Textarea
						id="projectDescription"
						value={proposal.projectDescription || ""}
						onChange={(e) =>
							onChange({ projectDescription: e.target.value || null })
						}
						placeholder="Décrivez votre projet en détail..."
						rows={4}
					/>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-lg font-semibold">Contact</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="contactEmail">Email de contact</Label>
						<Input
							id="contactEmail"
							type="email"
							value={proposal.contactEmail}
							onChange={(e) => onChange({ contactEmail: e.target.value })}
							placeholder="contact@example.com"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="contactPhone">Téléphone (optionnel)</Label>
						<Input
							id="contactPhone"
							type="tel"
							value={proposal.contactPhone || ""}
							onChange={(e) =>
								onChange({ contactPhone: e.target.value || null })
							}
							placeholder="+33 6 12 34 56 78"
						/>
					</div>
				</div>
			</section>

			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Paliers de sponsoring</h2>
					<Button type="button" variant="outline" size="sm" onClick={onTierAdd}>
						Ajouter un palier
					</Button>
				</div>

				{proposal.tiers && proposal.tiers.length > 0 ? (
					<div className="space-y-4">
						{proposal.tiers.map((tier) => (
							<TierForm
								key={tier.id}
								tier={tier}
								onChange={(updates) => onTierChange(tier.id, updates)}
								onRemove={() => onTierRemove(tier.id)}
								onBenefitAdd={() => onBenefitAdd(tier.id)}
								onBenefitRemove={(benefitId) =>
									onBenefitRemove(tier.id, benefitId)
								}
								onBenefitChange={(benefitId, description) =>
									onBenefitChange(tier.id, benefitId, description)
								}
							/>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
						Aucun palier de sponsoring. Cliquez sur "Ajouter un palier" pour
						commencer.
					</p>
				)}
			</section>
		</div>
	);
}

import { Trash2 } from "lucide-react";
import type { Tier } from "../../types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { BenefitList } from "./benefit-list";

interface TierFormProps {
	tier: Tier;
	onChange: (updates: Partial<Tier>) => void;
	onRemove: () => void;
	onBenefitAdd: () => void;
	onBenefitRemove: (benefitId: string) => void;
	onBenefitChange: (benefitId: string, description: string) => void;
}

export function TierForm({
	tier,
	onChange,
	onRemove,
	onBenefitAdd,
	onBenefitRemove,
	onBenefitChange,
}: TierFormProps) {
	return (
		<Card>
			<CardHeader className="pb-4">
				<div className="flex items-start justify-between">
					<CardTitle className="text-base">
						{tier.name || "Nouveau palier"}
					</CardTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onRemove}
						className="text-destructive hover:text-destructive"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor={`tier-name-${tier.id}`}>Nom du palier</Label>
						<Input
							id={`tier-name-${tier.id}`}
							value={tier.name}
							onChange={(e) => onChange({ name: e.target.value })}
							placeholder="Ex: Bronze, Silver, Gold..."
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor={`tier-price-${tier.id}`}>Prix (€)</Label>
						<Input
							id={`tier-price-${tier.id}`}
							type="number"
							min="0"
							step="0.01"
							value={tier.price}
							onChange={(e) =>
								onChange({ price: Number.parseFloat(e.target.value) || 0 })
							}
							placeholder="1000"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor={`tier-description-${tier.id}`}>
						Description (optionnel)
					</Label>
					<Textarea
						id={`tier-description-${tier.id}`}
						value={tier.description || ""}
						onChange={(e) => onChange({ description: e.target.value || null })}
						placeholder="Décrivez ce palier..."
						rows={2}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor={`tier-maxSponsors-${tier.id}`}>
							Nombre max de sponsors (optionnel)
						</Label>
						<Input
							id={`tier-maxSponsors-${tier.id}`}
							type="number"
							min="1"
							value={tier.maxSponsors || ""}
							onChange={(e) =>
								onChange({
									maxSponsors: e.target.value
										? Number.parseInt(e.target.value, 10)
										: null,
								})
							}
							placeholder="Illimité"
						/>
					</div>

					<div className="flex items-center space-x-2 pt-6">
						<input
							type="checkbox"
							id={`tier-featured-${tier.id}`}
							checked={tier.isFeatured}
							onChange={(e) => onChange({ isFeatured: e.target.checked })}
							className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
						/>
						<Label htmlFor={`tier-featured-${tier.id}`}>
							Mettre en avant ce palier
						</Label>
					</div>
				</div>

				<BenefitList
					benefits={tier.benefits}
					onAdd={onBenefitAdd}
					onRemove={onBenefitRemove}
					onChange={onBenefitChange}
				/>
			</CardContent>
		</Card>
	);
}

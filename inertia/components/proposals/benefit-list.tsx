import { Plus, Trash2 } from "lucide-react";
import type { Benefit } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface BenefitListProps {
	benefits: Benefit[];
	onAdd: () => void;
	onRemove: (benefitId: string) => void;
	onChange: (benefitId: string, description: string) => void;
}

export function BenefitList({
	benefits,
	onAdd,
	onRemove,
	onChange,
}: BenefitListProps) {
	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">Avantages inclus</span>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onAdd}
					className="h-7 text-xs"
				>
					<Plus className="h-3 w-3 mr-1" />
					Ajouter
				</Button>
			</div>

			{benefits.length > 0 ? (
				<ul className="space-y-2">
					{benefits.map((benefit) => (
						<li key={benefit.id} className="flex items-center gap-2">
							<Input
								value={benefit.description}
								onChange={(e) => onChange(benefit.id, e.target.value)}
								placeholder="Ex: Logo sur les supports de communication"
								className="flex-1"
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => onRemove(benefit.id)}
								className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</li>
					))}
				</ul>
			) : (
				<p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded">
					Aucun avantage défini
				</p>
			)}
		</div>
	);
}

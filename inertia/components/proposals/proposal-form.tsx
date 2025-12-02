import {
	Calendar,
	ExternalLink,
	Globe,
	MapPin,
	Tag,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import type { EventFormat, Proposal, Tier } from "../../types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
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

// Helper to format ISO date string to datetime-local input value
function formatDateTimeLocal(isoString: string | null): string {
	if (!isoString) return "";
	try {
		const date = new Date(isoString);
		// Format: YYYY-MM-DDTHH:MM
		return date.toISOString().slice(0, 16);
	} catch {
		return "";
	}
}

// Helper to format datetime-local input value to ISO string
function formatToISOString(dateTimeLocal: string): string | null {
	if (!dateTimeLocal) return null;
	try {
		return new Date(dateTimeLocal).toISOString();
	} catch {
		return null;
	}
}

const EVENT_FORMAT_LABELS: Record<EventFormat, string> = {
	in_person: "En présentiel",
	online: "En ligne",
	hybrid: "Hybride",
};

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
	const [newTag, setNewTag] = useState("");

	const handleAddTag = () => {
		if (newTag.trim() && !proposal.eventTags?.includes(newTag.trim())) {
			onChange({
				eventTags: [...(proposal.eventTags || []), newTag.trim()],
			});
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		onChange({
			eventTags: (proposal.eventTags || []).filter(
				(tag) => tag !== tagToRemove,
			),
		});
	};

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

			{/* Event Details Section */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<Calendar className="h-5 w-5 text-muted-foreground" />
					<h2 className="text-lg font-semibold">Détails de l'événement</h2>
				</div>

				{/* Source URL Display */}
				{proposal.eventSourceUrl && (
					<div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
						<Globe className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">
							Importé depuis{" "}
							{proposal.eventSourcePlatform || "une source externe"}
						</span>
						<a
							href={proposal.eventSourceUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary hover:underline flex items-center gap-1"
						>
							Voir l'original
							<ExternalLink className="h-3 w-3" />
						</a>
					</div>
				)}

				{/* Date and Time */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="eventStartDate">Date et heure de début</Label>
						<Input
							id="eventStartDate"
							type="datetime-local"
							value={formatDateTimeLocal(proposal.eventStartDate)}
							onChange={(e) =>
								onChange({ eventStartDate: formatToISOString(e.target.value) })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="eventEndDate">Date et heure de fin</Label>
						<Input
							id="eventEndDate"
							type="datetime-local"
							value={formatDateTimeLocal(proposal.eventEndDate)}
							onChange={(e) =>
								onChange({ eventEndDate: formatToISOString(e.target.value) })
							}
						/>
					</div>
				</div>

				{/* Event Format */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="eventFormat">Format de l'événement</Label>
						<Select
							value={proposal.eventFormat || ""}
							onValueChange={(value) =>
								onChange({ eventFormat: (value as EventFormat) || null })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Sélectionner un format" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="in_person">En présentiel</SelectItem>
								<SelectItem value="online">En ligne</SelectItem>
								<SelectItem value="hybrid">Hybride</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="eventExpectedAttendees">
							Nombre de participants attendus
						</Label>
						<Input
							id="eventExpectedAttendees"
							type="number"
							min="0"
							value={proposal.eventExpectedAttendees || ""}
							onChange={(e) =>
								onChange({
									eventExpectedAttendees: e.target.value
										? Number.parseInt(e.target.value, 10)
										: null,
								})
							}
							placeholder="Ex: 500"
						/>
					</div>
				</div>

				{/* Category */}
				<div className="space-y-2">
					<Label htmlFor="eventCategory">Catégorie</Label>
					<Input
						id="eventCategory"
						value={proposal.eventCategory || ""}
						onChange={(e) =>
							onChange({ eventCategory: e.target.value || null })
						}
						placeholder="Ex: Networking, Conférence, Festival..."
					/>
				</div>

				{/* Tags */}
				<div className="space-y-2">
					<Label className="flex items-center gap-2">
						<Tag className="h-4 w-4" />
						Tags
					</Label>
					<div className="flex flex-wrap gap-2 mb-2">
						{(proposal.eventTags || []).map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="flex items-center gap-1"
							>
								{tag}
								<button
									type="button"
									onClick={() => handleRemoveTag(tag)}
									className="ml-1 hover:text-destructive"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>
					<div className="flex gap-2">
						<Input
							value={newTag}
							onChange={(e) => setNewTag(e.target.value)}
							placeholder="Ajouter un tag..."
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddTag();
								}
							}}
						/>
						<Button type="button" variant="outline" onClick={handleAddTag}>
							Ajouter
						</Button>
					</div>
				</div>
			</section>

			{/* Location Section */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<MapPin className="h-5 w-5 text-muted-foreground" />
					<h2 className="text-lg font-semibold">Lieu de l'événement</h2>
				</div>

				<div className="space-y-2">
					<Label htmlFor="eventVenueName">Nom du lieu</Label>
					<Input
						id="eventVenueName"
						value={proposal.eventVenueName || ""}
						onChange={(e) =>
							onChange({ eventVenueName: e.target.value || null })
						}
						placeholder="Ex: Palais des Congrès"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="eventAddress">Adresse</Label>
					<Textarea
						id="eventAddress"
						value={proposal.eventAddress || ""}
						onChange={(e) => onChange({ eventAddress: e.target.value || null })}
						placeholder="Adresse complète du lieu"
						rows={2}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="eventCity">Ville</Label>
						<Input
							id="eventCity"
							value={proposal.eventCity || ""}
							onChange={(e) => onChange({ eventCity: e.target.value || null })}
							placeholder="Ex: Paris"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="eventCountry">Pays</Label>
						<Input
							id="eventCountry"
							value={proposal.eventCountry || ""}
							onChange={(e) =>
								onChange({ eventCountry: e.target.value || null })
							}
							placeholder="Ex: France"
						/>
					</div>
				</div>

				{/* Coordinates (hidden but can be shown for advanced users) */}
				{(proposal.eventLatitude || proposal.eventLongitude) && (
					<div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
						<div className="text-sm">
							<span className="text-muted-foreground">Latitude: </span>
							<span>{proposal.eventLatitude}</span>
						</div>
						<div className="text-sm">
							<span className="text-muted-foreground">Longitude: </span>
							<span>{proposal.eventLongitude}</span>
						</div>
					</div>
				)}
			</section>

			{/* Organizer Section */}
			<section className="space-y-4">
				<div className="flex items-center gap-2">
					<Users className="h-5 w-5 text-muted-foreground" />
					<h2 className="text-lg font-semibold">Organisateur</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="organizerName">Nom de l'organisateur</Label>
						<Input
							id="organizerName"
							value={proposal.organizerName || ""}
							onChange={(e) =>
								onChange({ organizerName: e.target.value || null })
							}
							placeholder="Ex: Association XYZ"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="organizerWebsite">Site web de l'organisateur</Label>
						<Input
							id="organizerWebsite"
							type="url"
							value={proposal.organizerWebsite || ""}
							onChange={(e) =>
								onChange({ organizerWebsite: e.target.value || null })
							}
							placeholder="https://example.com"
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

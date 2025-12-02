import { Head, Link, router } from "@inertiajs/react";
import { ExternalLink, Globe, Paintbrush, Save } from "lucide-react";
import { useCallback, useState } from "react";
import AppLayout from "../../components/layouts/app-layout";
import { DomainSettings } from "../../components/proposals/domain-settings";
import { ProposalForm } from "../../components/proposals/proposal-form";
import { ProposalPreview } from "../../components/proposals/proposal-preview";
import { Button } from "../../components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/ui/dialog";
import { useAutosave } from "../../hooks/use-autosave";
import type { Benefit, Proposal, Tier } from "../../types";

interface EditProposalProps {
	proposal: Proposal;
}

const defaultDesignSettings = {
	primaryColor: "#3B82F6",
	secondaryColor: "#1E40AF",
	fontFamily: "Inter",
	logoPosition: "left" as const,
	layout: "modern" as const,
};

export default function EditProposal({
	proposal: initialProposal,
}: EditProposalProps) {
	const [proposal, setProposal] = useState<Proposal>({
		...initialProposal,
		tiers: initialProposal.tiers || [],
		designSettings: initialProposal.designSettings || defaultDesignSettings,
		eventTags: initialProposal.eventTags || [],
	});

	const { isSaving, lastSavedAt, hasUnsavedChanges, save } = useAutosave({
		proposal,
		debounceMs: 30000,
	});

	const handleProposalChange = useCallback((updates: Partial<Proposal>) => {
		setProposal((prev) => ({ ...prev, ...updates }));
	}, []);

	const handleTierChange = useCallback(
		(tierId: string, updates: Partial<Tier>) => {
			setProposal((prev) => ({
				...prev,
				tiers: prev.tiers?.map((tier) =>
					tier.id === tierId ? { ...tier, ...updates } : tier,
				),
			}));
		},
		[],
	);

	const handleTierAdd = useCallback(() => {
		const newTier: Tier = {
			id: `temp-${Date.now()}`,
			name: "",
			price: 0,
			currency: "EUR",
			description: null,
			isFeatured: false,
			maxSponsors: null,
			position: proposal.tiers?.length || 0,
			benefits: [],
		};
		setProposal((prev) => ({
			...prev,
			tiers: [...(prev.tiers || []), newTier],
		}));
	}, [proposal.tiers?.length]);

	const handleTierRemove = useCallback((tierId: string) => {
		setProposal((prev) => ({
			...prev,
			tiers: prev.tiers?.filter((tier) => tier.id !== tierId),
		}));
	}, []);

	const handleBenefitAdd = useCallback((tierId: string) => {
		const newBenefit: Benefit = {
			id: `temp-${Date.now()}`,
			description: "",
			position: 0,
		};
		setProposal((prev) => ({
			...prev,
			tiers: prev.tiers?.map((tier) => {
				if (tier.id === tierId) {
					return {
						...tier,
						benefits: [
							...tier.benefits,
							{ ...newBenefit, position: tier.benefits.length },
						],
					};
				}
				return tier;
			}),
		}));
	}, []);

	const handleBenefitRemove = useCallback(
		(tierId: string, benefitId: string) => {
			setProposal((prev) => ({
				...prev,
				tiers: prev.tiers?.map((tier) => {
					if (tier.id === tierId) {
						return {
							...tier,
							benefits: tier.benefits.filter((b) => b.id !== benefitId),
						};
					}
					return tier;
				}),
			}));
		},
		[],
	);

	const handleBenefitChange = useCallback(
		(tierId: string, benefitId: string, description: string) => {
			setProposal((prev) => ({
				...prev,
				tiers: prev.tiers?.map((tier) => {
					if (tier.id === tierId) {
						return {
							...tier,
							benefits: tier.benefits.map((b) =>
								b.id === benefitId ? { ...b, description } : b,
							),
						};
					}
					return tier;
				}),
			}));
		},
		[],
	);

	const handlePublish = () => {
		router.post(
			`/proposals/${proposal.id}/publish`,
			{},
			{
				onSuccess: () => {
					setProposal((prev) => ({ ...prev, status: "published" }));
				},
			},
		);
	};

	const handleUnpublish = () => {
		router.post(
			`/proposals/${proposal.id}/unpublish`,
			{},
			{
				onSuccess: () => {
					setProposal((prev) => ({ ...prev, status: "draft" }));
				},
			},
		);
	};

	return (
		<AppLayout>
			<Head title={`Éditer - ${proposal.title || "Nouvelle proposition"}`} />

			<div className="flex items-center justify-between mb-6">
				<div>
					<Link
						href="/dashboard"
						className="text-sm text-muted-foreground hover:text-foreground"
					>
						← Retour au dashboard
					</Link>
					<h1 className="text-2xl font-bold mt-1">
						{proposal.title || "Nouvelle proposition"}
					</h1>
				</div>

				<div className="flex items-center gap-4">
					<div className="text-sm text-muted-foreground">
						{isSaving && "Sauvegarde..."}
						{!isSaving && hasUnsavedChanges && "Modifications non sauvegardées"}
						{!isSaving &&
							!hasUnsavedChanges &&
							lastSavedAt &&
							`Sauvegardé à ${lastSavedAt.toLocaleTimeString("fr-FR")}`}
					</div>

					<Button
						variant="outline"
						size="sm"
						onClick={() => save()}
						disabled={isSaving || !hasUnsavedChanges}
					>
						<Save className="h-4 w-4 mr-2" />
						Sauvegarder
					</Button>

					<Link href={`/proposals/${proposal.id}/builder`}>
						<Button variant="outline" size="sm">
							<Paintbrush className="h-4 w-4 mr-2" />
							Builder
						</Button>
					</Link>

					{proposal.status === "draft" ? (
						<Button size="sm" onClick={handlePublish}>
							Publier
						</Button>
					) : (
						<>
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										<Globe className="h-4 w-4 mr-2" />
										Domaines
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
									<DialogHeader>
										<DialogTitle>Paramètres de domaine</DialogTitle>
									</DialogHeader>
									<DomainSettings proposal={proposal} />
								</DialogContent>
							</Dialog>
							<a
								href={`/p/${proposal.slug}`}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
							>
								<ExternalLink className="h-4 w-4" />
								Voir la page publique
							</a>
							<Button variant="outline" size="sm" onClick={handleUnpublish}>
								Dépublier
							</Button>
						</>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
				<div className="overflow-auto border border-border rounded-lg p-6 bg-card">
					<ProposalForm
						proposal={proposal}
						onChange={handleProposalChange}
						onTierChange={handleTierChange}
						onTierAdd={handleTierAdd}
						onTierRemove={handleTierRemove}
						onBenefitAdd={handleBenefitAdd}
						onBenefitRemove={handleBenefitRemove}
						onBenefitChange={handleBenefitChange}
					/>
				</div>

				<div className="overflow-auto border border-border rounded-lg bg-white">
					<div className="sticky top-0 z-10 bg-muted px-4 py-2 border-b border-border">
						<span className="text-sm font-medium text-muted-foreground">
							Prévisualisation
						</span>
					</div>
					<ProposalPreview proposal={proposal} />
				</div>
			</div>
		</AppLayout>
	);
}

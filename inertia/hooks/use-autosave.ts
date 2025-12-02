import { router } from "@inertiajs/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Proposal } from "../types";

interface UseAutosaveOptions {
	proposal: Proposal;
	debounceMs?: number;
}

interface UseAutosaveReturn {
	isSaving: boolean;
	lastSavedAt: Date | null;
	hasUnsavedChanges: boolean;
	save: () => Promise<void>;
}

export function useAutosave({
	proposal,
	debounceMs = 30000,
}: UseAutosaveOptions): UseAutosaveReturn {
	const [isSaving, setIsSaving] = useState(false);
	const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const lastSavedProposal = useRef<string>(JSON.stringify(proposal));
	const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const save = useCallback(async () => {
		if (isSaving) return;

		const currentProposal = JSON.stringify(proposal);
		if (currentProposal === lastSavedProposal.current) {
			setHasUnsavedChanges(false);
			return;
		}

		setIsSaving(true);

		try {
			await new Promise<void>((resolve, reject) => {
				router.put(
					`/proposals/${proposal.id}`,
					{
						title: proposal.title,
						description: proposal.description,
						projectName: proposal.projectName,
						projectDescription: proposal.projectDescription,
						contactEmail: proposal.contactEmail,
						contactPhone: proposal.contactPhone,
						designSettings: proposal.designSettings,
						tiers: proposal.tiers,
						// Event fields
						eventStartDate: proposal.eventStartDate,
						eventEndDate: proposal.eventEndDate,
						eventVenueName: proposal.eventVenueName,
						eventAddress: proposal.eventAddress,
						eventCity: proposal.eventCity,
						eventCountry: proposal.eventCountry,
						eventLatitude: proposal.eventLatitude,
						eventLongitude: proposal.eventLongitude,
						eventCategory: proposal.eventCategory,
						eventTags: proposal.eventTags,
						eventSourceUrl: proposal.eventSourceUrl,
						eventSourcePlatform: proposal.eventSourcePlatform,
						eventExternalId: proposal.eventExternalId,
						organizerName: proposal.organizerName,
						organizerWebsite: proposal.organizerWebsite,
						eventFormat: proposal.eventFormat,
						eventExpectedAttendees: proposal.eventExpectedAttendees,
					},
					{
						preserveScroll: true,
						preserveState: true,
						onSuccess: () => {
							lastSavedProposal.current = currentProposal;
							setLastSavedAt(new Date());
							setHasUnsavedChanges(false);
							resolve();
						},
						onError: () => {
							reject(new Error("Failed to save"));
						},
					},
				);
			});
		} catch (error) {
			console.error("Autosave failed:", error);
		} finally {
			setIsSaving(false);
		}
	}, [proposal, isSaving]);

	useEffect(() => {
		const currentProposal = JSON.stringify(proposal);
		if (currentProposal !== lastSavedProposal.current) {
			setHasUnsavedChanges(true);

			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}

			saveTimeoutRef.current = setTimeout(() => {
				save();
			}, debounceMs);
		}

		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [proposal, debounceMs, save]);

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]);

	return {
		isSaving,
		lastSavedAt,
		hasUnsavedChanges,
		save,
	};
}

import { useCallback, useEffect, useRef } from "react";
import type { PageLayout } from "../types/builder";

interface UseBuilderAutosaveOptions {
	layout: PageLayout;
	hasUnsavedChanges: boolean;
	onSave: () => Promise<void>;
	debounceMs?: number;
	enabled?: boolean;
}

export function useBuilderAutosave({
	layout,
	hasUnsavedChanges,
	onSave,
	debounceMs = 30000, // 30 seconds default
	enabled = true,
}: UseBuilderAutosaveOptions) {
	const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const lastLayoutRef = useRef<string>(JSON.stringify(layout));

	// Clear timeout on unmount
	useEffect(() => {
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, []);

	// Debounced autosave
	useEffect(() => {
		if (!enabled || !hasUnsavedChanges) return;

		const currentLayout = JSON.stringify(layout);
		if (currentLayout === lastLayoutRef.current) return;

		// Clear existing timeout
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		// Set new timeout
		saveTimeoutRef.current = setTimeout(async () => {
			try {
				await onSave();
				lastLayoutRef.current = currentLayout;
			} catch (error) {
				console.error("Autosave failed:", error);
			}
		}, debounceMs);

		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [layout, hasUnsavedChanges, onSave, debounceMs, enabled]);

	// Warn before leaving with unsaved changes
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

	// Force save now
	const saveNow = useCallback(async () => {
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}
		try {
			await onSave();
			lastLayoutRef.current = JSON.stringify(layout);
		} catch (error) {
			console.error("Save failed:", error);
			throw error;
		}
	}, [onSave, layout]);

	return { saveNow };
}

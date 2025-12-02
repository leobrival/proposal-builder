import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useReducer,
} from "react";
import type {
	Block,
	BlockType,
	BuilderContextType,
	BuilderState,
	ColorPalette,
	GlobalStyles,
	PageLayout,
	Section,
	SectionSettings,
	SectionType,
	Spacing,
	Typography,
} from "../../types/builder";
import {
	BLOCK_METADATA,
	DEFAULT_PAGE_LAYOUT,
	SECTION_METADATA,
} from "../../types/builder";
import { getTemplateById } from "./templates";

// ----------------------------------------------------------------------------
// ACTION TYPES
// ----------------------------------------------------------------------------

type BuilderAction =
	| { type: "SET_LAYOUT"; payload: PageLayout }
	| { type: "ADD_SECTION"; payload: { section: Section; index?: number } }
	| { type: "REMOVE_SECTION"; payload: { sectionId: string } }
	| { type: "MOVE_SECTION"; payload: { fromIndex: number; toIndex: number } }
	| {
			type: "UPDATE_SECTION";
			payload: { sectionId: string; updates: Partial<Section> };
	  }
	| { type: "DUPLICATE_SECTION"; payload: { sectionId: string } }
	| { type: "TOGGLE_SECTION_VISIBILITY"; payload: { sectionId: string } }
	| {
			type: "ADD_BLOCK";
			payload: { sectionId: string; block: Block; index?: number };
	  }
	| { type: "REMOVE_BLOCK"; payload: { sectionId: string; blockId: string } }
	| {
			type: "MOVE_BLOCK";
			payload: { sectionId: string; fromIndex: number; toIndex: number };
	  }
	| {
			type: "MOVE_BLOCK_BETWEEN_SECTIONS";
			payload: {
				fromSectionId: string;
				toSectionId: string;
				blockId: string;
				toIndex: number;
			};
	  }
	| {
			type: "UPDATE_BLOCK";
			payload: { sectionId: string; blockId: string; updates: Partial<Block> };
	  }
	| { type: "DUPLICATE_BLOCK"; payload: { sectionId: string; blockId: string } }
	| { type: "UPDATE_GLOBAL_STYLES"; payload: Partial<GlobalStyles> }
	| { type: "SELECT_SECTION"; payload: string | null }
	| { type: "SELECT_BLOCK"; payload: string | null }
	| { type: "CLEAR_SELECTION" }
	| { type: "SET_ACTIVE_PANEL"; payload: BuilderState["activePanel"] }
	| { type: "SET_DRAGGING"; payload: boolean }
	| { type: "UNDO" }
	| { type: "REDO" }
	| { type: "SAVE_TO_HISTORY" }
	| { type: "SET_SAVING"; payload: boolean }
	| { type: "SET_SAVED"; payload: Date };

// ----------------------------------------------------------------------------
// INITIAL STATE
// ----------------------------------------------------------------------------

const initialState: BuilderState = {
	layout: DEFAULT_PAGE_LAYOUT,
	selectedSectionId: null,
	selectedBlockId: null,
	isDragging: false,
	activePanel: "sections",
	history: [DEFAULT_PAGE_LAYOUT],
	historyIndex: 0,
	hasUnsavedChanges: false,
	isSaving: false,
	lastSavedAt: null,
};

// ----------------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------------

function generateId(): string {
	return crypto.randomUUID();
}

function generateElementId(type: string, existingIds: string[]): string {
	let index = 1;
	let elementId = `${type}-${index}`;
	while (existingIds.includes(elementId)) {
		index++;
		elementId = `${type}-${index}`;
	}
	return elementId;
}

function createSection(
	type: SectionType,
	existingElementIds: string[],
): Section {
	const meta = SECTION_METADATA[type];
	return {
		id: generateId(),
		type,
		elementId: generateElementId(type, existingElementIds),
		visible: true,
		locked: false,
		settings: { ...meta.defaultSettings },
		blocks: [],
		customCss: "",
	};
}

function createBlock(type: BlockType, existingElementIds: string[]): Block {
	const meta = BLOCK_METADATA[type];
	return {
		id: generateId(),
		type,
		elementId: generateElementId(type, existingElementIds),
		content: { ...meta.defaultContent },
		settings: { ...meta.defaultSettings },
		customCss: "",
	};
}

// ----------------------------------------------------------------------------
// REDUCER
// ----------------------------------------------------------------------------

function builderReducer(
	state: BuilderState,
	action: BuilderAction,
): BuilderState {
	switch (action.type) {
		case "SET_LAYOUT":
			return {
				...state,
				layout: action.payload,
				hasUnsavedChanges: false,
			};

		case "ADD_SECTION": {
			const { section, index } = action.payload;
			const newSections = [...state.layout.sections];
			if (index !== undefined) {
				newSections.splice(index, 0, section);
			} else {
				newSections.push(section);
			}
			return {
				...state,
				layout: { ...state.layout, sections: newSections },
				hasUnsavedChanges: true,
			};
		}

		case "REMOVE_SECTION": {
			const { sectionId } = action.payload;
			const section = state.layout.sections.find((s) => s.id === sectionId);
			if (section?.locked) return state;
			return {
				...state,
				layout: {
					...state.layout,
					sections: state.layout.sections.filter((s) => s.id !== sectionId),
				},
				selectedSectionId:
					state.selectedSectionId === sectionId
						? null
						: state.selectedSectionId,
				selectedBlockId: section?.blocks.some(
					(b) => b.id === state.selectedBlockId,
				)
					? null
					: state.selectedBlockId,
				hasUnsavedChanges: true,
			};
		}

		case "MOVE_SECTION": {
			const { fromIndex, toIndex } = action.payload;
			const newSections = [...state.layout.sections];
			const [removed] = newSections.splice(fromIndex, 1);
			newSections.splice(toIndex, 0, removed);
			return {
				...state,
				layout: { ...state.layout, sections: newSections },
				hasUnsavedChanges: true,
			};
		}

		case "UPDATE_SECTION": {
			const { sectionId, updates } = action.payload;
			return {
				...state,
				layout: {
					...state.layout,
					sections: state.layout.sections.map((s) =>
						s.id === sectionId ? { ...s, ...updates } : s,
					),
				},
				hasUnsavedChanges: true,
			};
		}

		case "DUPLICATE_SECTION": {
			const { sectionId } = action.payload;
			const sectionIndex = state.layout.sections.findIndex(
				(s) => s.id === sectionId,
			);
			if (sectionIndex === -1) return state;
			const existingElementIds = state.layout.sections.map((s) => s.elementId);
			const original = state.layout.sections[sectionIndex];
			const duplicated: Section = {
				...original,
				id: generateId(),
				elementId: generateElementId(original.type, existingElementIds),
				locked: false,
				blocks: original.blocks.map((b) => ({
					...b,
					id: generateId(),
					elementId: generateElementId(b.type, existingElementIds),
				})),
			};
			const newSections = [...state.layout.sections];
			newSections.splice(sectionIndex + 1, 0, duplicated);
			return {
				...state,
				layout: { ...state.layout, sections: newSections },
				hasUnsavedChanges: true,
			};
		}

		case "TOGGLE_SECTION_VISIBILITY": {
			const { sectionId } = action.payload;
			return {
				...state,
				layout: {
					...state.layout,
					sections: state.layout.sections.map((s) =>
						s.id === sectionId ? { ...s, visible: !s.visible } : s,
					),
				},
				hasUnsavedChanges: true,
			};
		}

		case "ADD_BLOCK": {
			const { sectionId, block, index } = action.payload;
			return {
				...state,
				layout: {
					...state.layout,
					sections: state.layout.sections.map((s) => {
						if (s.id !== sectionId) return s;
						const newBlocks = [...s.blocks];
						if (index !== undefined) {
							newBlocks.splice(index, 0, block);
						} else {
							newBlocks.push(block);
						}
						return { ...s, blocks: newBlocks };
					}),
				},
				hasUnsavedChanges: true,
			};
		}

		case "REMOVE_BLOCK": {
			const { sectionId, blockId } = action.payload;
			return {
				...state,
				layout: {
					...state.layout,
					sections: state.layout.sections.map((s) =>
						s.id === sectionId
							? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) }
							: s,
					),
				},
				selectedBlockId:
					state.selectedBlockId === blockId ? null : state.selectedBlockId,
				hasUnsavedChanges: true,
			};
		}

		case "MOVE_BLOCK": {
			const { sectionId, fromIndex, toIndex } = action.payload;
			return {
				...state,
				layout: {
					...state.layout,
					sections: state.layout.sections.map((s) => {
						if (s.id !== sectionId) return s;
						const newBlocks = [...s.blocks];
						const [removed] = newBlocks.splice(fromIndex, 1);
						newBlocks.splice(toIndex, 0, removed);
						return { ...s, blocks: newBlocks };
					}),
				},
				hasUnsavedChanges: true,
			};
		}

		case "MOVE_BLOCK_BETWEEN_SECTIONS": {
			const { fromSectionId, toSectionId, blockId, toIndex } = action.payload;
			let movedBlock: Block | undefined;
			const newSections = state.layout.sections.map((s) => {
				if (s.id === fromSectionId) {
					movedBlock = s.blocks.find((b) => b.id === blockId);
					return { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) };
				}
				return s;
			});
			if (!movedBlock) return state;
			const finalSections = newSections.map((s) => {
				if (s.id === toSectionId) {
					const newBlocks = [...s.blocks];
					newBlocks.splice(toIndex, 0, movedBlock as Block);
					return { ...s, blocks: newBlocks };
				}
				return s;
			});
			return {
				...state,
				layout: { ...state.layout, sections: finalSections },
				hasUnsavedChanges: true,
			};
		}

		case "UPDATE_BLOCK": {
			const { sectionId, blockId, updates } = action.payload;
			return {
				...state,
				layout: {
					...state.layout,
					sections: state.layout.sections.map((s) =>
						s.id === sectionId
							? {
									...s,
									blocks: s.blocks.map((b) =>
										b.id === blockId ? { ...b, ...updates } : b,
									),
								}
							: s,
					),
				},
				hasUnsavedChanges: true,
			};
		}

		case "DUPLICATE_BLOCK": {
			const { sectionId, blockId } = action.payload;
			return {
				...state,
				layout: {
					...state.layout,
					sections: state.layout.sections.map((s) => {
						if (s.id !== sectionId) return s;
						const blockIndex = s.blocks.findIndex((b) => b.id === blockId);
						if (blockIndex === -1) return s;
						const existingElementIds = s.blocks.map((b) => b.elementId);
						const original = s.blocks[blockIndex];
						const duplicated: Block = {
							...original,
							id: generateId(),
							elementId: generateElementId(original.type, existingElementIds),
						};
						const newBlocks = [...s.blocks];
						newBlocks.splice(blockIndex + 1, 0, duplicated);
						return { ...s, blocks: newBlocks };
					}),
				},
				hasUnsavedChanges: true,
			};
		}

		case "UPDATE_GLOBAL_STYLES":
			return {
				...state,
				layout: {
					...state.layout,
					globalStyles: { ...state.layout.globalStyles, ...action.payload },
				},
				hasUnsavedChanges: true,
			};

		case "SELECT_SECTION":
			return {
				...state,
				selectedSectionId: action.payload,
				selectedBlockId: null,
			};

		case "SELECT_BLOCK":
			return {
				...state,
				selectedBlockId: action.payload,
			};

		case "CLEAR_SELECTION":
			return {
				...state,
				selectedSectionId: null,
				selectedBlockId: null,
			};

		case "SET_ACTIVE_PANEL":
			return {
				...state,
				activePanel: action.payload,
			};

		case "SET_DRAGGING":
			return {
				...state,
				isDragging: action.payload,
			};

		case "SAVE_TO_HISTORY": {
			const newHistory = state.history.slice(0, state.historyIndex + 1);
			newHistory.push(state.layout);
			// Keep only last 50 states
			if (newHistory.length > 50) {
				newHistory.shift();
			}
			return {
				...state,
				history: newHistory,
				historyIndex: newHistory.length - 1,
			};
		}

		case "UNDO": {
			if (state.historyIndex <= 0) return state;
			const newIndex = state.historyIndex - 1;
			return {
				...state,
				layout: state.history[newIndex],
				historyIndex: newIndex,
				hasUnsavedChanges: true,
			};
		}

		case "REDO": {
			if (state.historyIndex >= state.history.length - 1) return state;
			const newIndex = state.historyIndex + 1;
			return {
				...state,
				layout: state.history[newIndex],
				historyIndex: newIndex,
				hasUnsavedChanges: true,
			};
		}

		case "SET_SAVING":
			return {
				...state,
				isSaving: action.payload,
			};

		case "SET_SAVED":
			return {
				...state,
				isSaving: false,
				hasUnsavedChanges: false,
				lastSavedAt: action.payload,
			};

		default:
			return state;
	}
}

// ----------------------------------------------------------------------------
// CONTEXT
// ----------------------------------------------------------------------------

const BuilderContext = createContext<BuilderContextType | null>(null);

// ----------------------------------------------------------------------------
// PROVIDER
// ----------------------------------------------------------------------------

interface BuilderProviderProps {
	children: React.ReactNode;
	initialLayout?: PageLayout;
	onSave?: (layout: PageLayout) => Promise<void>;
}

export function BuilderProvider({
	children,
	initialLayout,
	onSave,
}: BuilderProviderProps) {
	const [state, dispatch] = useReducer(builderReducer, {
		...initialState,
		layout: initialLayout || DEFAULT_PAGE_LAYOUT,
		history: [initialLayout || DEFAULT_PAGE_LAYOUT],
	});

	// Get all existing element IDs for generating unique IDs
	const existingElementIds = useMemo(() => {
		const ids: string[] = [];
		for (const section of state.layout.sections) {
			ids.push(section.elementId);
			for (const block of section.blocks) {
				ids.push(block.elementId);
			}
		}
		return ids;
	}, [state.layout.sections]);

	// Section actions
	const addSection = useCallback(
		(type: SectionType, index?: number) => {
			dispatch({ type: "SAVE_TO_HISTORY" });
			const section = createSection(type, existingElementIds);
			dispatch({ type: "ADD_SECTION", payload: { section, index } });
		},
		[existingElementIds],
	);

	const removeSection = useCallback((sectionId: string) => {
		dispatch({ type: "SAVE_TO_HISTORY" });
		dispatch({ type: "REMOVE_SECTION", payload: { sectionId } });
	}, []);

	const moveSection = useCallback((fromIndex: number, toIndex: number) => {
		dispatch({ type: "SAVE_TO_HISTORY" });
		dispatch({ type: "MOVE_SECTION", payload: { fromIndex, toIndex } });
	}, []);

	const updateSection = useCallback(
		(sectionId: string, updates: Partial<Section>) => {
			dispatch({ type: "UPDATE_SECTION", payload: { sectionId, updates } });
		},
		[],
	);

	const updateSectionSettings = useCallback(
		(sectionId: string, settings: Partial<SectionSettings>) => {
			const section = state.layout.sections.find((s) => s.id === sectionId);
			if (!section) return;
			dispatch({
				type: "UPDATE_SECTION",
				payload: {
					sectionId,
					updates: { settings: { ...section.settings, ...settings } },
				},
			});
		},
		[state.layout.sections],
	);

	const duplicateSection = useCallback((sectionId: string) => {
		dispatch({ type: "SAVE_TO_HISTORY" });
		dispatch({ type: "DUPLICATE_SECTION", payload: { sectionId } });
	}, []);

	const toggleSectionVisibility = useCallback((sectionId: string) => {
		dispatch({ type: "TOGGLE_SECTION_VISIBILITY", payload: { sectionId } });
	}, []);

	// Block actions
	const addBlock = useCallback(
		(sectionId: string, type: BlockType, index?: number) => {
			dispatch({ type: "SAVE_TO_HISTORY" });
			const block = createBlock(type, existingElementIds);
			dispatch({ type: "ADD_BLOCK", payload: { sectionId, block, index } });
		},
		[existingElementIds],
	);

	const removeBlock = useCallback((sectionId: string, blockId: string) => {
		dispatch({ type: "SAVE_TO_HISTORY" });
		dispatch({ type: "REMOVE_BLOCK", payload: { sectionId, blockId } });
	}, []);

	const moveBlock = useCallback(
		(sectionId: string, fromIndex: number, toIndex: number) => {
			dispatch({ type: "SAVE_TO_HISTORY" });
			dispatch({
				type: "MOVE_BLOCK",
				payload: { sectionId, fromIndex, toIndex },
			});
		},
		[],
	);

	const moveBlockBetweenSections = useCallback(
		(
			fromSectionId: string,
			toSectionId: string,
			blockId: string,
			toIndex: number,
		) => {
			dispatch({ type: "SAVE_TO_HISTORY" });
			dispatch({
				type: "MOVE_BLOCK_BETWEEN_SECTIONS",
				payload: { fromSectionId, toSectionId, blockId, toIndex },
			});
		},
		[],
	);

	const updateBlock = useCallback(
		(sectionId: string, blockId: string, updates: Partial<Block>) => {
			dispatch({
				type: "UPDATE_BLOCK",
				payload: { sectionId, blockId, updates },
			});
		},
		[],
	);

	const duplicateBlock = useCallback((sectionId: string, blockId: string) => {
		dispatch({ type: "SAVE_TO_HISTORY" });
		dispatch({ type: "DUPLICATE_BLOCK", payload: { sectionId, blockId } });
	}, []);

	// Global styles actions
	const updateGlobalStyles = useCallback((updates: Partial<GlobalStyles>) => {
		dispatch({ type: "UPDATE_GLOBAL_STYLES", payload: updates });
	}, []);

	const updateColors = useCallback(
		(colors: Partial<ColorPalette>) => {
			dispatch({
				type: "UPDATE_GLOBAL_STYLES",
				payload: { colors: { ...state.layout.globalStyles.colors, ...colors } },
			});
		},
		[state.layout.globalStyles.colors],
	);

	const updateTypography = useCallback(
		(typography: Partial<Typography>) => {
			dispatch({
				type: "UPDATE_GLOBAL_STYLES",
				payload: {
					typography: {
						...state.layout.globalStyles.typography,
						...typography,
					},
				},
			});
		},
		[state.layout.globalStyles.typography],
	);

	const updateSpacing = useCallback(
		(spacing: Partial<Spacing>) => {
			dispatch({
				type: "UPDATE_GLOBAL_STYLES",
				payload: {
					spacing: { ...state.layout.globalStyles.spacing, ...spacing },
				},
			});
		},
		[state.layout.globalStyles.spacing],
	);

	const updateGlobalCss = useCallback((css: string) => {
		dispatch({ type: "UPDATE_GLOBAL_STYLES", payload: { customCss: css } });
	}, []);

	// Selection actions
	const selectSection = useCallback((sectionId: string | null) => {
		dispatch({ type: "SELECT_SECTION", payload: sectionId });
	}, []);

	const selectBlock = useCallback((blockId: string | null) => {
		dispatch({ type: "SELECT_BLOCK", payload: blockId });
	}, []);

	const clearSelection = useCallback(() => {
		dispatch({ type: "CLEAR_SELECTION" });
	}, []);

	// Panel actions
	const setActivePanel = useCallback((panel: BuilderState["activePanel"]) => {
		dispatch({ type: "SET_ACTIVE_PANEL", payload: panel });
	}, []);

	// History actions
	const undo = useCallback(() => {
		dispatch({ type: "UNDO" });
	}, []);

	const redo = useCallback(() => {
		dispatch({ type: "REDO" });
	}, []);

	const canUndo = useCallback(
		() => state.historyIndex > 0,
		[state.historyIndex],
	);

	const canRedo = useCallback(
		() => state.historyIndex < state.history.length - 1,
		[state.historyIndex, state.history.length],
	);

	// Template actions
	const applyTemplate = useCallback((templateId: string) => {
		const template = getTemplateById(templateId);
		if (template) {
			dispatch({ type: "SAVE_TO_HISTORY" });
			// Deep clone the layout to avoid mutation issues
			const clonedLayout: PageLayout = JSON.parse(
				JSON.stringify(template.layout),
			);
			// Regenerate IDs for all sections and blocks to ensure uniqueness
			clonedLayout.sections = clonedLayout.sections.map((section) => ({
				...section,
				id: generateId(),
				blocks: section.blocks.map((block) => ({
					...block,
					id: generateId(),
				})),
			}));
			dispatch({ type: "SET_LAYOUT", payload: clonedLayout });
		}
	}, []);

	const resetToDefault = useCallback(() => {
		dispatch({ type: "SAVE_TO_HISTORY" });
		dispatch({ type: "SET_LAYOUT", payload: DEFAULT_PAGE_LAYOUT });
	}, []);

	// Persistence
	const save = useCallback(async () => {
		if (!onSave) return;
		dispatch({ type: "SET_SAVING", payload: true });
		try {
			await onSave(state.layout);
			dispatch({ type: "SET_SAVED", payload: new Date() });
		} catch (error) {
			console.error("Failed to save layout:", error);
			dispatch({ type: "SET_SAVING", payload: false });
		}
	}, [onSave, state.layout]);

	const setLayout = useCallback((layout: PageLayout) => {
		dispatch({ type: "SET_LAYOUT", payload: layout });
	}, []);

	const contextValue: BuilderContextType = useMemo(
		() => ({
			...state,
			addSection,
			removeSection,
			moveSection,
			updateSection,
			updateSectionSettings,
			duplicateSection,
			toggleSectionVisibility,
			addBlock,
			removeBlock,
			moveBlock,
			moveBlockBetweenSections,
			updateBlock,
			duplicateBlock,
			updateGlobalStyles,
			updateColors,
			updateTypography,
			updateSpacing,
			updateGlobalCss,
			selectSection,
			selectBlock,
			clearSelection,
			setActivePanel,
			undo,
			redo,
			canUndo,
			canRedo,
			applyTemplate,
			resetToDefault,
			save,
			setLayout,
		}),
		[
			state,
			addSection,
			removeSection,
			moveSection,
			updateSection,
			updateSectionSettings,
			duplicateSection,
			toggleSectionVisibility,
			addBlock,
			removeBlock,
			moveBlock,
			moveBlockBetweenSections,
			updateBlock,
			duplicateBlock,
			updateGlobalStyles,
			updateColors,
			updateTypography,
			updateSpacing,
			updateGlobalCss,
			selectSection,
			selectBlock,
			clearSelection,
			setActivePanel,
			undo,
			redo,
			canUndo,
			canRedo,
			applyTemplate,
			resetToDefault,
			save,
			setLayout,
		],
	);

	return (
		<BuilderContext.Provider value={contextValue}>
			{children}
		</BuilderContext.Provider>
	);
}

// ----------------------------------------------------------------------------
// HOOK
// ----------------------------------------------------------------------------

export function useBuilder(): BuilderContextType {
	const context = useContext(BuilderContext);
	if (!context) {
		throw new Error("useBuilder must be used within a BuilderProvider");
	}
	return context;
}

export { BuilderContext };

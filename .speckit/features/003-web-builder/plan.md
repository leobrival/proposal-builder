# Web Builder - Plan d'Implementation

## Vue d'ensemble

Systeme de web-builder hybride avec drag & drop pour la creation de pages de sponsoring personnalisees. Architecture basee sur des sections predefinies avec possibilite d'ajouter des blocs custom, 10 templates de demarrage, et personnalisation CSS avancee.

## Architecture Technique

### 1. Schema de Donnees

#### Nouvelle colonne `page_layout` (JSONB)

```typescript
interface PageLayout {
  version: "1.0";
  globalStyles: GlobalStyles;
  sections: Section[];
}

interface GlobalStyles {
  // Couleurs
  colors: {
    primary: string;      // HEX
    secondary: string;    // HEX
    accent: string;       // HEX
    background: string;   // HEX
    text: string;         // HEX
    muted: string;        // HEX
  };
  // Typographie
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: number; // px
    lineHeight: number;
  };
  // Espacements
  spacing: {
    sectionPadding: "compact" | "normal" | "spacious";
    containerWidth: "narrow" | "medium" | "wide" | "full";
  };
  // CSS custom global
  customCss: string;
}

interface Section {
  id: string;           // UUID unique
  type: SectionType;    // Type de section predefinie
  elementId: string;    // ID statique pour CSS custom (ex: "hero-section")
  visible: boolean;
  locked: boolean;      // Sections obligatoires non supprimables
  settings: SectionSettings;
  blocks: Block[];      // Blocs custom dans la section
  customCss: string;    // CSS specifique a la section
}

type SectionType = 
  | "hero"
  | "about"
  | "event-details"
  | "tiers"
  | "benefits"
  | "gallery"
  | "testimonials"
  | "sponsors"
  | "team"
  | "timeline"
  | "faq"
  | "contact"
  | "cta"
  | "custom";

interface Block {
  id: string;
  type: BlockType;
  elementId: string;
  settings: BlockSettings;
  content: BlockContent;
  customCss: string;
}

type BlockType =
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "divider"
  | "spacer"
  | "icon-list"
  | "stats"
  | "quote"
  | "embed"
  | "html";
```

#### Migration Base de Donnees

```sql
ALTER TABLE proposals 
ADD COLUMN page_layout JSONB DEFAULT NULL;

-- Index pour recherche dans le JSON
CREATE INDEX idx_proposals_page_layout ON proposals USING gin (page_layout);
```

### 2. Structure des Fichiers

```
inertia/
├── components/
│   └── builder/
│       ├── BuilderContext.tsx        # Context global du builder
│       ├── BuilderCanvas.tsx         # Zone de travail principale
│       ├── BuilderSidebar.tsx        # Panneau lateral (sections/blocs)
│       ├── BuilderToolbar.tsx        # Barre d'outils (undo, preview, save)
│       ├── BuilderStylePanel.tsx     # Panneau de styles globaux
│       ├── SectionWrapper.tsx        # Wrapper drag & drop pour sections
│       ├── BlockWrapper.tsx          # Wrapper drag & drop pour blocs
│       ├── sections/
│       │   ├── HeroSection.tsx
│       │   ├── AboutSection.tsx
│       │   ├── EventDetailsSection.tsx
│       │   ├── TiersSection.tsx
│       │   ├── BenefitsSection.tsx
│       │   ├── GallerySection.tsx
│       │   ├── TestimonialsSection.tsx
│       │   ├── SponsorsSection.tsx
│       │   ├── TeamSection.tsx
│       │   ├── TimelineSection.tsx
│       │   ├── FaqSection.tsx
│       │   ├── ContactSection.tsx
│       │   ├── CtaSection.tsx
│       │   └── CustomSection.tsx
│       ├── blocks/
│       │   ├── HeadingBlock.tsx
│       │   ├── TextBlock.tsx
│       │   ├── ImageBlock.tsx
│       │   ├── VideoBlock.tsx
│       │   ├── ButtonBlock.tsx
│       │   ├── DividerBlock.tsx
│       │   ├── SpacerBlock.tsx
│       │   ├── IconListBlock.tsx
│       │   ├── StatsBlock.tsx
│       │   ├── QuoteBlock.tsx
│       │   ├── EmbedBlock.tsx
│       │   └── HtmlBlock.tsx
│       ├── settings/
│       │   ├── SectionSettings.tsx   # Panneau settings par section
│       │   ├── BlockSettings.tsx     # Panneau settings par bloc
│       │   ├── ColorPicker.tsx
│       │   ├── FontSelector.tsx
│       │   ├── SpacingControl.tsx
│       │   └── CssEditor.tsx         # Editeur CSS avec validation
│       └── templates/
│           └── index.ts              # Export des 10 templates
├── pages/
│   └── proposals/
│       ├── builder.tsx               # Page principale du builder
│       └── preview.tsx               # Page de preview isolee
├── hooks/
│   ├── use-builder.ts                # Hook principal du builder
│   ├── use-builder-history.ts        # Undo/Redo
│   └── use-builder-autosave.ts       # Autosave specifique
├── lib/
│   └── builder/
│       ├── templates.ts              # Definitions des 10 templates
│       ├── defaults.ts               # Valeurs par defaut
│       ├── validators.ts             # Validation du schema
│       └── renderer.ts               # Rendu cote serveur
└── types/
    └── builder.ts                    # Types TypeScript
```

### 3. Les 10 Templates Predefinis

| # | Nom | Secteur | Sections Incluses |
|---|-----|---------|-------------------|
| 1 | **Festival** | Musique/Culture | Hero (video bg), About, Timeline, Tiers, Gallery, Sponsors, Contact |
| 2 | **Conference** | Tech/Business | Hero, About, Team, Timeline, Tiers, Testimonials, FAQ, Contact |
| 3 | **Sport Event** | Sport | Hero (dynamic), Event-Details, Tiers, Benefits, Sponsors, Gallery, CTA |
| 4 | **Charity Gala** | Association | Hero, About, Team, Tiers, Testimonials, Gallery, Contact |
| 5 | **Startup Launch** | Tech | Hero (minimal), About, Benefits, Tiers, Team, FAQ, CTA |
| 6 | **Trade Show** | B2B | Hero, Event-Details, Tiers, Benefits, Sponsors, FAQ, Contact |
| 7 | **Wedding** | Evenementiel | Hero (elegant), About, Timeline, Gallery, Contact |
| 8 | **Workshop** | Education | Hero, About, Benefits, Tiers, Testimonials, FAQ, Contact |
| 9 | **Art Exhibition** | Culture | Hero (gallery), About, Gallery, Team, Sponsors, Contact |
| 10 | **Blank** | Universel | Hero, About, Tiers, Contact (template minimal) |

### 4. Composants Cles

#### BuilderContext

```typescript
interface BuilderState {
  layout: PageLayout;
  selectedSection: string | null;
  selectedBlock: string | null;
  isDragging: boolean;
  history: PageLayout[];
  historyIndex: number;
  hasUnsavedChanges: boolean;
}

interface BuilderActions {
  // Sections
  addSection: (type: SectionType, index?: number) => void;
  removeSection: (sectionId: string) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  duplicateSection: (sectionId: string) => void;
  
  // Blocs
  addBlock: (sectionId: string, type: BlockType, index?: number) => void;
  removeBlock: (sectionId: string, blockId: string) => void;
  moveBlock: (sectionId: string, fromIndex: number, toIndex: number) => void;
  updateBlock: (sectionId: string, blockId: string, updates: Partial<Block>) => void;
  
  // Styles
  updateGlobalStyles: (updates: Partial<GlobalStyles>) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  
  // Selection
  selectSection: (sectionId: string | null) => void;
  selectBlock: (blockId: string | null) => void;
  
  // Template
  applyTemplate: (templateId: string) => void;
  
  // Save
  save: () => Promise<void>;
}
```

#### Integration dnd-kit

```typescript
// BuilderCanvas.tsx
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function BuilderCanvas() {
  const { layout, moveSection, selectSection } = useBuilder();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={layout.sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {layout.sections.map((section, index) => (
          <SectionWrapper key={section.id} section={section} index={index} />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId ? <SectionPreview id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
```

### 5. Systeme de Preview

#### Architecture de Preview

```
┌─────────────────────────────────────────────────────────────┐
│                    Builder Interface                        │
│  ┌─────────────┐  ┌────────────────────────┐  ┌──────────┐ │
│  │   Sidebar   │  │       Canvas           │  │  Styles  │ │
│  │  - Sections │  │  (Live editing)        │  │  Panel   │ │
│  │  - Blocs    │  │                        │  │          │ │
│  │  - Templates│  │                        │  │          │ │
│  └─────────────┘  └────────────────────────┘  └──────────┘ │
│                                                             │
│  [Preview Button] ──────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               Preview Mode (Nouvelle fenetre)               │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Toolbar: Desktop | Tablet | Mobile | Fermer            ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                         ││
│  │           Rendu Final de la Page                        ││
│  │           (Sans interface d'edition)                    ││
│  │                                                         ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

#### Routes

```typescript
// start/routes.ts

// Builder (authentifie)
router.get("/proposals/:id/builder", [ProposalsController, "builder"])
  .as("proposals.builder")
  .use(middleware.auth());

// Preview (authentifie, mode iframe ou popup)
router.get("/proposals/:id/preview", [ProposalsController, "preview"])
  .as("proposals.preview")
  .use(middleware.auth());

// Page publique finale (inchange)
router.get("/p/:slug", [PublicProposalsController, "show"])
  .as("proposals.public");
```

### 6. Validation et CSS Custom

#### Validation CSS

```typescript
// lib/builder/validators.ts
import { parse } from "css";

export function validateCustomCss(css: string): {
  valid: boolean;
  errors: string[];
} {
  try {
    const ast = parse(css);
    const errors: string[] = [];

    // Verifier qu'il n'y a pas de @import ou @font-face externes
    ast.stylesheet?.rules.forEach((rule) => {
      if (rule.type === "import") {
        errors.push("@import non autorise");
      }
      if (rule.type === "font-face") {
        errors.push("@font-face non autorise (utilisez les polices du systeme)");
      }
    });

    return { valid: errors.length === 0, errors };
  } catch (e) {
    return { valid: false, errors: ["Syntaxe CSS invalide"] };
  }
}
```

#### Element IDs Statiques

```typescript
// Chaque section et bloc a un elementId unique et previsible
// Format: {type}-{index} ou custom

// Exemple de rendu HTML
<section id="hero-section" class="builder-section" data-section-type="hero">
  <div id="hero-heading" class="builder-block" data-block-type="heading">
    <h1>Mon Evenement</h1>
  </div>
</section>

// CSS custom peut cibler ces IDs
#hero-section {
  background: linear-gradient(to right, #667eea, #764ba2);
}
#hero-heading h1 {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}
```

### 7. Plan d'Implementation

#### Phase 1: Fondations (3-4 jours)

1. **Migration DB** - Ajouter colonne `page_layout`
2. **Types TypeScript** - Definir tous les types du builder
3. **BuilderContext** - Creer le context React avec state management
4. **Hook use-builder** - Logique principale
5. **Hook use-builder-history** - Undo/Redo

#### Phase 2: Drag & Drop (2-3 jours)

1. **Integration dnd-kit** - Setup de base
2. **SectionWrapper** - Composant draggable pour sections
3. **BlockWrapper** - Composant draggable pour blocs
4. **BuilderCanvas** - Zone de travail avec DndContext
5. **DragOverlay** - Preview pendant le drag

#### Phase 3: Sections Predefinies (4-5 jours)

1. **HeroSection** - Avec variantes (image, video, gradient)
2. **AboutSection** - Description + image
3. **TiersSection** - Integration avec tiers existants
4. **ContactSection** - Formulaire de contact
5. **GallerySection** - Grille d'images
6. **TestimonialsSection** - Carousel de temoignages
7. **Autres sections** - Event-Details, FAQ, Team, etc.

#### Phase 4: Blocs Custom (2-3 jours)

1. **HeadingBlock** - H1-H6 avec styles
2. **TextBlock** - Rich text basique
3. **ImageBlock** - Upload + URL
4. **ButtonBlock** - CTA configurable
5. **Autres blocs** - Video, Embed, Stats, etc.

#### Phase 5: Interface Builder (3-4 jours)

1. **BuilderSidebar** - Liste sections/blocs disponibles
2. **BuilderToolbar** - Actions (save, preview, undo)
3. **BuilderStylePanel** - Panneau de styles globaux
4. **SectionSettings** - Panneau de config par section
5. **BlockSettings** - Panneau de config par bloc
6. **CssEditor** - Editeur CSS avec validation

#### Phase 6: Templates (2 jours)

1. **Definition des 10 templates** - JSON structures
2. **Template Selector** - Interface de selection
3. **Apply Template** - Logique d'application

#### Phase 7: Preview & Rendu (2-3 jours)

1. **Page Preview** - Nouvelle route/page
2. **Responsive Preview** - Desktop/Tablet/Mobile
3. **Public Renderer** - Mise a jour du rendu public
4. **CSS Injection** - Custom CSS dans le rendu final

#### Phase 8: Polish & Tests (2 jours)

1. **Autosave** - Sauvegarde automatique
2. **Validation** - Schema JSON + CSS
3. **Tests E2E** - Playwright
4. **Performance** - Optimisations

### 8. Dependances a Installer

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
pnpm add css # Pour validation CSS
pnpm add -D @types/css
```

### 9. Considerations de Performance

1. **Lazy Loading** - Charger les sections uniquement quand visibles
2. **Memoization** - React.memo pour les composants lourds
3. **Debounce** - Sur les mises a jour frequentes (styles)
4. **Virtual List** - Si beaucoup de sections (react-virtual)
5. **CSS-in-JS** - Eviter re-renders inutiles

### 10. Securite

1. **Sanitization HTML** - Pour le bloc HTML custom
2. **Validation CSS** - Pas d'@import, pas de @font-face externes
3. **XSS Prevention** - Escape du contenu utilisateur
4. **Rate Limiting** - Sur les sauvegardes

## Estimation Totale

- **Developpement**: 20-25 jours
- **Tests & QA**: 3-5 jours
- **Total**: ~4-5 semaines

## Prochaines Etapes

1. Valider ce plan
2. Creer la migration DB
3. Definir les types TypeScript complets
4. Commencer par Phase 1 (Fondations)

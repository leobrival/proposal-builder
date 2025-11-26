# Changelog - Session du 26 Novembre 2025

## Résumé

Cette session a permis de corriger le problème de suppression des sous-domaines gratuits et d'implémenter plusieurs améliorations de qualité de code.

## Problème initial

L'utilisateur ne pouvait pas supprimer le sous-domaine gratuit depuis la page d'édition d'une proposition. Le bouton X ne fonctionnait pas.

## Diagnostic

L'analyse des requêtes réseau a révélé que les requêtes DELETE retournaient un code **302 (redirect)** au lieu de **200 (success)**. La cause : le token CSRF (`X-XSRF-TOKEN`) n'était pas inclus dans les headers des requêtes fetch.

## Changements implémentés

### 1. Correction du token CSRF pour les requêtes API

**Fichier** : `inertia/components/proposals/domain-settings.tsx`

**Problème** : Les requêtes POST et DELETE vers l'API des domaines ne contenaient pas le token CSRF requis par le middleware Shield d'AdonisJS.

**Solution** : Ajout d'une fonction utilitaire et inclusion du header dans toutes les requêtes modificatrices.

```typescript
/**
 * Get CSRF token from cookie
 */
function getCsrfToken(): string {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (match) {
    return decodeURIComponent(match[1]);
  }
  return "";
}
```

**Requêtes modifiées** :
- `saveSubdomain` (POST)
- `removeSubdomain` (DELETE)
- `saveCustomDomain` (POST)
- `removeCustomDomain` (DELETE)
- `verifyDomain` (POST)

### 2. Système de routes par sous-domaine

**Fichiers** :
- `app/controllers/subdomain_controller.ts` (nouveau)
- `start/routes.ts` (modifié)
- `start/kernel.ts` (modifié)

**Problème** : L'accès à `http://techtalks.localhost:3333/` renvoyait vers la page d'accueil au lieu d'afficher la proposition.

**Solution** : Création d'un contrôleur dédié et configuration de routes avec contrainte de domaine.

```typescript
// start/routes.ts
router
  .group(() => {
    router.get("/", [SubdomainController, "handle"]).as("subdomain.index");
    router.get("/*", [SubdomainController, "handle"]).as("subdomain.catchall");
  })
  .domain(":subdomain.localhost");
```

Le contrôleur extrait le sous-domaine depuis les paramètres de route, recherche la proposition correspondante et rend la page publique.

### 3. Correction des types TypeScript

**Fichier** : `app/middleware/domain_middleware.ts`

**Problème** : Utilisation de `any` pour les types, ce qui causait des warnings de lint.

**Solution** : Import et utilisation du type `Proposal` approprié.

```typescript
import type Proposal from "#models/proposal";

private async renderProposal(ctx: HttpContext, proposal: Proposal) {
  // ...
}

declare module "@adonisjs/core/http" {
  interface HttpContext {
    proposal?: Proposal;
  }
}
```

**Fichier** : `inertia/pages/errors/server_error.tsx`

```typescript
interface ServerErrorProps {
  error: {
    message: string;
  };
}

export default function ServerError(props: ServerErrorProps) {
  // ...
}
```

### 4. Corrections d'accessibilité (a11y)

**Fichier** : `inertia/pages/home.tsx`

**Problème** : Les SVG décoratifs n'avaient pas d'attributs d'accessibilité, ce qui causait des erreurs de lint Biome.

**Solution** :

1. Ajout de `aria-hidden="true"` sur 14 SVG décoratifs :
```tsx
<svg className="h-6 w-6 fill-primary" viewBox="0 0 256 256" aria-hidden="true">
```

2. Ajout d'un texte accessible pour le lien avec icône seule :
```tsx
<a href="https://adonisjs.com" ...>
  <span className="sr-only">AdonisJS</span>
  <svg aria-hidden="true">...</svg>
</a>
```

### 5. Optimisation du code-splitting

**Fichier** : `vite.config.ts`

**Problème** : Le bundle principal (`app.js`) faisait 563 kB, dépassant la limite recommandée de 500 kB.

**Solution** : Configuration de chunks manuels pour séparer les dépendances vendors.

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        "vendor-react": ["react", "react-dom"],
        "vendor-inertia": ["@inertiajs/react"],
        "vendor-radix": ["@radix-ui/react-dialog"],
        "vendor-lucide": ["lucide-react"],
        "vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority"],
      },
    },
  },
},
```

**Résultats** :
| Chunk | Taille |
|-------|--------|
| `app.js` | 363 kB (était 563 kB) |
| `vendor-inertia.js` | 167 kB |
| `vendor-radix.js` | 38.5 kB |
| `vendor-react.js` | 30.9 kB |
| `vendor-utils.js` | 25.5 kB |
| `vendor-lucide.js` | 8.6 kB |

**Réduction totale** : 35% sur le bundle principal, plus d'avertissement de taille.

## Fichiers modifiés

| Fichier | Type de modification |
|---------|---------------------|
| `inertia/components/proposals/domain-settings.tsx` | Ajout token CSRF |
| `app/controllers/subdomain_controller.ts` | Nouveau fichier |
| `start/routes.ts` | Ajout routes sous-domaine |
| `start/kernel.ts` | Nettoyage middleware |
| `app/middleware/domain_middleware.ts` | Correction types |
| `inertia/pages/errors/server_error.tsx` | Correction type |
| `inertia/pages/home.tsx` | Corrections a11y |
| `vite.config.ts` | Code-splitting |

## Vérifications passées

- **Lint (Biome)** : OK
- **Typecheck (TypeScript)** : OK
- **Build (Vite + AdonisJS)** : OK

## Comment tester

1. Démarrer le serveur de développement : `pnpm dev`
2. Se connecter et éditer une proposition
3. Cliquer sur "Domaines"
4. Configurer un sous-domaine (ex: `techtalks`)
5. Accéder à `http://techtalks.localhost:3333/`
6. Vérifier que la suppression du sous-domaine fonctionne

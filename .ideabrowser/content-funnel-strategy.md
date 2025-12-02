# Content Funnel Strategy - TOFU/MOFU/BOFU

**Version**: 1.0.0
**Date de creation**: 2025-11-30
**Status**: Ready for Implementation
**Base**: onboarding.md, email-sequences.md, ai-assistant-knowledge.md

---

## Executive Summary

Ce document definit la strategie de contenu basee sur le funnel de sensibilisation TOFU/MOFU/BOFU pour Spons Easy. Chaque article de blog est tague avec un `funnelStage` dans son frontmatter pour cibler le bon niveau d'utilisateur.

---

## 1. Le Funnel de Contenu

### Vue d'ensemble

```
                    ┌─────────────────────────┐
                    │         TOFU            │
                    │    Top of Funnel        │
                    │      Decouverte         │
                    │   (Visiteurs inconnus)  │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │         MOFU            │
                    │   Middle of Funnel      │
                    │     Consideration       │
                    │  (Utilisateurs inscrits)│
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │         BOFU            │
                    │   Bottom of Funnel      │
                    │       Decision          │
                    │  (Utilisateurs avances) │
                    └─────────────────────────┘
```

### Definition des stages

| Stage | Acronyme | Audience | Objectif |
|-------|----------|----------|----------|
| **TOFU** | Top of Funnel | Visiteurs qui ne connaissent pas Spons Easy | Attirer, eduquer, faire decouvrir |
| **MOFU** | Middle of Funnel | Utilisateurs ayant un compte | Activer, engager, aider a reussir |
| **BOFU** | Bottom of Funnel | Utilisateurs avances/reguliers | Approfondir, integrer, fideliser |

---

## 2. TOFU - Top of Funnel (Decouverte)

### Objectif

Attirer des visiteurs qui cherchent des solutions a leurs problemes de sponsoring, sans forcement connaitre Spons Easy.

### Audience cible

- Createurs de contenu cherchant a monetiser
- Associations cherchant des sponsors
- Organisateurs d'evenements
- Personnes recherchant "comment trouver des sponsors"

### Caracteristiques du contenu TOFU

| Aspect | Description |
|--------|-------------|
| **Ton** | Educatif, accessible, pas de jargon |
| **Focus** | Probleme, pas solution |
| **CTA** | Soft - "Essayer gratuitement", "En savoir plus" |
| **SEO** | Tres important - mots-cles de recherche |
| **Mention produit** | Legere, en fin d'article |

### Types de contenu TOFU

1. **Guides educatifs**
   - "Comment trouver des sponsors pour votre podcast"
   - "Guide complet du sponsoring pour associations sportives"
   - "10 erreurs a eviter dans vos demandes de sponsoring"

2. **Listes et ressources**
   - "50 marques qui sponsorisent les createurs de contenu"
   - "Template gratuit de proposition de sponsoring"
   - "Checklist avant de contacter un sponsor"

3. **Etudes de cas inspirantes**
   - "Comment Marie a obtenu son premier sponsor a 5K abonnes"
   - "Le club de tennis qui a leve 10K en sponsors locaux"

4. **Contenus SEO**
   - "Sponsoring vs Partenariat : quelle difference ?"
   - "Combien demander pour un sponsoring Instagram ?"

### Exemple de frontmatter TOFU

```yaml
---
title: "Comment trouver des sponsors pour votre podcast en 2025"
slug: trouver-sponsors-podcast
description: "Guide complet pour monetiser votre podcast avec des sponsors, meme avec une petite audience."
category: tutorial
funnelStage: tofu
author: Equipe Spons Easy
tags:
  - podcast
  - sponsoring
  - monetisation
  - guide
status: published
featured: true
seo:
  title: "Trouver des sponsors podcast : Guide complet 2025"
  description: "Apprenez a trouver et convaincre des sponsors pour votre podcast. Strategies, templates et conseils pratiques."
  keywords:
    - sponsor podcast
    - monetiser podcast
    - trouver sponsors
---
```

### Metriques TOFU

| Metrique | Cible | Description |
|----------|-------|-------------|
| Trafic organique | +15% MoM | Visiteurs depuis Google |
| Temps sur page | > 3 min | Engagement avec le contenu |
| Taux de rebond | < 60% | Qualite du ciblage |
| Inscriptions | > 2% du trafic | Conversion en leads |

---

## 3. MOFU - Middle of Funnel (Consideration)

### Objectif

Aider les utilisateurs inscrits a tirer le maximum de valeur de Spons Easy et les guider vers le succes.

### Audience cible

- Utilisateurs ayant cree un compte
- Utilisateurs avec une proposition en cours
- Utilisateurs cherchant a optimiser leurs resultats

### Caracteristiques du contenu MOFU

| Aspect | Description |
|--------|-------------|
| **Ton** | Pratique, actionnable, specifique |
| **Focus** | Utilisation du produit, best practices |
| **CTA** | Medium - "Creer ma proposition", "Optimiser mes paliers" |
| **SEO** | Secondaire - contenu interne |
| **Mention produit** | Centrale, tutoriels integres |

### Types de contenu MOFU

1. **Tutoriels produit**
   - "Comment creer votre premiere proposition en 5 minutes"
   - "Configurer vos paliers de sponsoring : le guide complet"
   - "Personnaliser le design de votre page de proposition"

2. **Best practices**
   - "Les 5 elements d'une proposition qui convertit"
   - "Comment fixer vos prix de sponsoring"
   - "Rediger une description qui attire les sponsors"

3. **Cas d'usage specifiques**
   - "Creer une proposition pour un evenement tech"
   - "Adapter votre proposition pour les sponsors locaux"
   - "Proposition multi-paliers : quand et comment"

4. **FAQ et troubleshooting**
   - "Mon apercu ne s'affiche pas : solutions"
   - "Comment modifier une proposition publiee"
   - "Gerer vos leads efficacement"

### Exemple de frontmatter MOFU

```yaml
---
title: "Configurer vos paliers de sponsoring : le guide complet"
slug: configurer-paliers-sponsoring
description: "Apprenez a creer des paliers de sponsoring attractifs qui maximisent vos chances de conversion."
category: tutorial
funnelStage: mofu
author: Equipe Spons Easy
tags:
  - paliers
  - pricing
  - configuration
  - tutoriel
status: published
featured: false
---
```

### Integration avec l'onboarding

Le contenu MOFU est directement lie aux emails d'onboarding :

| Email | Jour | Contenu MOFU associe |
|-------|------|---------------------|
| Tips | J+2 | "Les 5 elements d'une proposition qui convertit" |
| Publication | J+4 | "Comment partager votre proposition efficacement" |
| Leads | J+7 | "Gerer vos leads : du premier contact au deal" |

### Metriques MOFU

| Metrique | Cible | Description |
|----------|-------|-------------|
| Taux d'activation | 40% | Utilisateurs qui publient |
| Feature adoption | > 60% | Utilisation des paliers |
| Retention J+7 | > 50% | Retour sur la plateforme |
| Support tickets | < 5% | Qualite de la documentation |

---

## 4. BOFU - Bottom of Funnel (Decision)

### Objectif

Accompagner les utilisateurs avances vers une maitrise complete de la plateforme, incluant les integrations avancees (MCP, API, assistant IA).

### Audience cible

- Utilisateurs reguliers et actifs
- Utilisateurs Pro ou considerant l'upgrade
- Power users cherchant l'automatisation
- Developpeurs et tech-savvy users

### Caracteristiques du contenu BOFU

| Aspect | Description |
|--------|-------------|
| **Ton** | Technique, approfondi, expert |
| **Focus** | Integrations, automatisation, optimisation |
| **CTA** | Hard - "Upgrader vers Pro", "Configurer MCP" |
| **SEO** | Niche - termes techniques |
| **Mention produit** | Complete, fonctionnalites avancees |

### Types de contenu BOFU

1. **Integrations techniques**
   - "Configurer l'integration MCP avec Claude Desktop"
   - "Utiliser l'API Spons Easy pour automatiser vos propositions"
   - "Connecter Spons Easy a votre CRM"

2. **Assistant IA**
   - "Tirer le maximum de l'assistant IA Spons Easy"
   - "Generer des propositions avec Claude et MCP"
   - "Automatiser la creation de contenu sponsoring"

3. **Strategies avancees**
   - "Scaling : gerer 10+ propositions simultanement"
   - "Analytics avancees : comprendre vos metriques"
   - "A/B testing de vos paliers de sponsoring"

4. **Contenu Pro**
   - "Export PDF : optimiser vos presentations"
   - "Custom branding : guide complet de personnalisation"
   - "Fonctionnalites Pro : ROI et cas d'usage"

### Exemple de frontmatter BOFU

```yaml
---
title: "Configurer l'integration MCP avec Claude Desktop"
slug: integration-mcp-claude-desktop
description: "Guide technique pour utiliser Spons Easy avec Claude Desktop via le Model Context Protocol."
category: tutorial
funnelStage: bofu
author: Equipe Spons Easy
tags:
  - mcp
  - claude
  - integration
  - api
  - avance
status: published
featured: true
seo:
  title: "Integration MCP Spons Easy + Claude Desktop"
  description: "Configurez l'integration MCP pour generer des propositions de sponsoring avec Claude Desktop."
  keywords:
    - mcp spons easy
    - claude desktop integration
    - model context protocol
---
```

### Integration avec l'assistant IA

Le contenu BOFU alimente directement la base de connaissances de l'assistant IA :

| Sujet BOFU | Utilisation par l'IA |
|------------|---------------------|
| Configuration MCP | Repondre aux questions techniques |
| API documentation | Aider les developpeurs |
| Fonctionnalites Pro | Expliquer les avantages upgrade |
| Troubleshooting avance | Resoudre problemes complexes |

### Metriques BOFU

| Metrique | Cible | Description |
|----------|-------|-------------|
| Upgrade rate | > 5% | Conversion Free -> Pro |
| MCP adoption | > 10% Pro | Utilisation de l'integration |
| API usage | Croissant | Appels API par mois |
| NPS Pro users | > 50 | Satisfaction avancee |

---

## 5. Mapping Funnel x Personas

### Clara (Creatrice de contenu)

| Stage | Contenu prioritaire |
|-------|---------------------|
| TOFU | "Comment monetiser sa communaute avec le sponsoring" |
| MOFU | "Creer une proposition qui seduit les marques" |
| BOFU | "Automatiser vos propositions avec Claude" |

### Alice (Association)

| Stage | Contenu prioritaire |
|-------|---------------------|
| TOFU | "Sponsoring pour associations : guide complet" |
| MOFU | "Adapter vos paliers aux sponsors locaux" |
| BOFU | "Gerer plusieurs evenements avec Spons Easy Pro" |

### Eric (Organisateur d'evenements)

| Stage | Contenu prioritaire |
|-------|---------------------|
| TOFU | "Dossier de sponsoring evenementiel : les bases" |
| MOFU | "Optimiser votre proposition pour conferences tech" |
| BOFU | "API et webhooks pour automatiser vos evenements" |

---

## 6. Calendrier Editorial par Stage

### Ratio recommande

```
TOFU : MOFU : BOFU = 50% : 35% : 15%
```

### Planning mensuel type

| Semaine | TOFU | MOFU | BOFU |
|---------|------|------|------|
| S1 | 2 articles | 1 article | - |
| S2 | 1 article | 2 articles | - |
| S3 | 2 articles | 1 article | 1 article |
| S4 | 1 article | 1 article | - |

### Saisonnalite

| Periode | Focus | Raison |
|---------|-------|--------|
| Janvier | TOFU | Nouvelles resolutions, recherche de sponsors |
| Septembre | TOFU | Rentree, nouveaux projets |
| Pre-evenements | MOFU | Utilisateurs actifs preparent leurs propositions |
| Trimestre fiscal | BOFU | Budgets sponsors disponibles |

---

## 7. Implementation Technique

### Frontmatter obligatoire

Chaque article de blog DOIT inclure :

```yaml
funnelStage: tofu | mofu | bofu
```

### Filtrage par stage

```typescript
// Exemple : recuperer les articles TOFU
const { items } = await contentService.list<BlogFrontmatter>({
  type: "blog",
  status: "published",
  funnelStage: "tofu",
  limit: 10,
});
```

### Affichage conditionnel

- **Homepage** : Mix TOFU (pour SEO) + Featured
- **Blog public** : Tous les stages, filtrables
- **Dashboard utilisateur** : MOFU + BOFU prioritaires
- **Assistant IA** : MOFU + BOFU pour contexte avance

### Recommandations automatiques

| Contexte utilisateur | Stage recommande |
|---------------------|------------------|
| Non connecte | TOFU |
| Nouveau compte (< 7j) | MOFU |
| Compte actif, pas de lead | MOFU |
| Compte avec leads | MOFU + BOFU |
| Utilisateur Pro | BOFU |

---

## 8. Migration du Contenu Existant

### Articles existants a tagger

Passer en revue chaque article existant et ajouter `funnelStage` :

```bash
# Lister les articles sans funnelStage
grep -L "funnelStage" content/blog/*.md
```

### Default stage

Si `funnelStage` n'est pas specifie, le systeme utilise `tofu` par defaut.

---

## 9. Metriques Globales

### Dashboard Content Funnel

```
=== CONTENT FUNNEL METRICS ===

TOFU (Decouverte)
- Articles publies: [X]
- Trafic organique: [X] (+/-% vs M-1)
- Conversion en inscription: [X%]

MOFU (Consideration)
- Articles publies: [X]
- Vues utilisateurs connectes: [X]
- Correlation activation: [X%]

BOFU (Decision)
- Articles publies: [X]
- Vues Pro users: [X]
- Correlation upgrade: [X%]

GLOBAL
- Ratio TOFU:MOFU:BOFU: [X:X:X]
- Articles ce mois: [X]
- Top performers par stage: [...]
```

---

## Historique du Document

| Date | Version | Modifications |
|------|---------|---------------|
| 2025-11-30 | 1.0.0 | Creation initiale |

---

_Document cree pour Spons Easy_
_Framework: TOFU/MOFU/BOFU Content Funnel_

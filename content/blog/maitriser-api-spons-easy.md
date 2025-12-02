---
title: Maîtriser l'API Spons Easy pour automatiser vos workflows de sponsoring
slug: maitriser-api-spons-easy
description: Guide technique complet de l'API REST Spons Easy avec exemples de code, webhooks, et intégrations avancées pour développeurs.
category: tutorial
funnelStage: bofu
author: Équipe Spons Easy
tags:
  - api
  - developpement
  - automation
  - rest
  - webhooks
  - integration
status: published
featured: true
publishedAt: 2025-12-01T00:00:00.000Z
updatedAt: 2025-12-01T00:00:00.000Z
seo:
  title: API Spons Easy - Guide Développeur Complet
  description: Documentation technique de l'API REST Spons Easy. Authentification, endpoints, webhooks, exemples TypeScript/Python/cURL.
  keywords:
    - api spons easy
    - rest api sponsoring
    - webhooks sponsoring
    - integration api
    - automation developpeur
---

# Maîtriser l'API Spons Easy pour automatiser vos workflows de sponsoring

**Niveau** : Avancé | **Temps de lecture** : 20 min | **Prérequis** : Notions de REST API, compte Pro

---

## Introduction

L'**API REST Spons Easy** vous permet d'intégrer programmatiquement la gestion de propositions de sponsoring dans vos outils et workflows existants. Cette API complète expose tous les endpoints nécessaires pour une automatisation totale.

### Pourquoi utiliser l'API ?

| Cas d'usage | Exemple concret |
|-------------|-----------------|
| **Intégration CRM** | Synchroniser automatiquement vos leads Spons Easy avec Salesforce |
| **Génération dynamique** | Créer des propositions depuis votre site web ou application |
| **Workflows custom** | Déclencher des actions externes quand une proposition est publiée |
| **Reporting avancé** | Extraire vos données pour des analyses dans Tableau/PowerBI |
| **Multi-tenant** | Gérer les propositions de plusieurs clients depuis une seule interface |

---

## Architecture de l'API

### Vue d'ensemble

```
┌──────────────┐
│  Votre App   │
└──────┬───────┘
       │ HTTPS
       ▼
┌──────────────────────┐
│   API Gateway        │
│  api.sponseasy.com   │
└──────┬───────────────┘
       │
       ├─── Auth (JWT/API Key)
       ├─── Rate Limiting
       ├─── Validation
       └─── Logging
       │
       ▼
┌──────────────────────┐
│  AdonisJS Backend    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  PostgreSQL (Neon)   │
└──────────────────────┘
```

### Caractéristiques techniques

| Aspect | Détails |
|--------|---------|
| **Protocol** | REST over HTTPS |
| **Format** | JSON (Content-Type: application/json) |
| **Authentification** | API Key (Bearer Token) |
| **Versioning** | URL-based (/v1/...) |
| **Rate Limiting** | 1000 req/jour (Pro), 5000 req/jour (Enterprise) |
| **Pagination** | Offset/Limit + cursors |
| **Webhooks** | Oui, événements en temps réel |

---

## Authentification

### Générer une API Key

1. Connectez-vous à votre compte Pro
2. **Paramètres** > **API & Intégrations**
3. **Générer une nouvelle clé**

### Format de la clé

```
sk_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd
```

### Utilisation dans les requêtes

Toutes les requêtes doivent inclure l'en-tête :

```http
Authorization: Bearer sk_YOUR_API_KEY_HERE
```

### Exemples par langage

**cURL**
```bash
curl https://api.sponseasy.com/v1/proposals \
  -H "Authorization: Bearer sk_YOUR_KEY" \
  -H "Content-Type: application/json"
```

**JavaScript/TypeScript**
```typescript
const response = await fetch('https://api.sponseasy.com/v1/proposals', {
  headers: {
    'Authorization': 'Bearer sk_YOUR_KEY',
    'Content-Type': 'application/json'
  }
})
```

**Python**
```python
import requests

headers = {
    'Authorization': 'Bearer sk_YOUR_KEY',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.sponseasy.com/v1/proposals', headers=headers)
```

---

## Endpoints principaux

### 1. Propositions

#### Lister toutes vos propositions

```http
GET /v1/proposals
```

**Query Parameters** :
- `status` : `draft`, `published`, `archived`
- `limit` : Nombre de résultats (max 100)
- `offset` : Pagination
- `orderBy` : `createdAt`, `updatedAt`, `title`

**Exemple** :
```bash
curl "https://api.sponseasy.com/v1/proposals?status=published&limit=10" \
  -H "Authorization: Bearer sk_YOUR_KEY"
```

**Réponse** :
```json
{
  "data": [
    {
      "id": "cm3abc123",
      "title": "TechConf 2025",
      "slug": "techconf-2025-abc123",
      "status": "published",
      "contactEmail": "sponsor@techconf.com",
      "publicUrl": "https://app.sponseasy.com/p/techconf-2025-abc123",
      "createdAt": "2025-11-15T10:30:00Z",
      "updatedAt": "2025-11-20T14:22:00Z"
    }
  ],
  "meta": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

#### Obtenir une proposition

```http
GET /v1/proposals/:id
```

**Exemple** :
```bash
curl "https://api.sponseasy.com/v1/proposals/cm3abc123" \
  -H "Authorization: Bearer sk_YOUR_KEY"
```

**Réponse** :
```json
{
  "data": {
    "id": "cm3abc123",
    "title": "TechConf 2025",
    "slug": "techconf-2025-abc123",
    "projectName": "Conférence Tech Paris",
    "description": "La conférence de référence...",
    "status": "published",
    "contactEmail": "sponsor@techconf.com",
    "tiers": [
      {
        "id": "tier_1",
        "name": "Bronze",
        "price": 500,
        "currency": "EUR",
        "benefits": [
          "Logo sur le site",
          "Mention réseaux sociaux"
        ]
      },
      {
        "id": "tier_2",
        "name": "Silver",
        "price": 1500,
        "currency": "EUR",
        "benefits": [
          "Logo sur le site",
          "Stand au salon",
          "2 entrées conférence"
        ]
      }
    ],
    "metrics": {
      "views": 1247,
      "leads": 8
    }
  }
}
```

#### Créer une proposition

```http
POST /v1/proposals
```

**Body** :
```json
{
  "title": "PodCast DevCafé S02",
  "projectName": "DevCafé - Le podcast des développeurs",
  "description": "Podcast hebdomadaire avec 5000 auditeurs",
  "contactEmail": "sponsor@devcafe.fm",
  "tiers": [
    {
      "name": "Bronze",
      "price": 300,
      "currency": "EUR",
      "benefits": [
        "Mention début d'épisode (5 secondes)",
        "Lien dans show notes"
      ]
    },
    {
      "name": "Gold",
      "price": 1000,
      "currency": "EUR",
      "benefits": [
        "Mention début + fin d'épisode",
        "Interview de 10 minutes",
        "Article blog sponsorisé"
      ]
    }
  ]
}
```

**Exemple cURL** :
```bash
curl -X POST "https://api.sponseasy.com/v1/proposals" \
  -H "Authorization: Bearer sk_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "PodCast DevCafé S02",
    "projectName": "DevCafé",
    "contactEmail": "sponsor@devcafe.fm",
    "tiers": [...]
  }'
```

**Réponse** :
```json
{
  "data": {
    "id": "cm3xyz789",
    "slug": "podcast-devcafe-s02-xyz789",
    "status": "draft",
    "publicUrl": "https://app.sponseasy.com/p/podcast-devcafe-s02-xyz789",
    "createdAt": "2025-12-01T15:45:00Z"
  }
}
```

#### Mettre à jour une proposition

```http
PUT /v1/proposals/:id
```

**Body** (partial update) :
```json
{
  "title": "DevCafé S02 - Edition 2025",
  "description": "Nouvelle description...",
  "tiers": [...]
}
```

#### Publier une proposition

```http
POST /v1/proposals/:id/publish
```

**Exemple** :
```bash
curl -X POST "https://api.sponseasy.com/v1/proposals/cm3xyz789/publish" \
  -H "Authorization: Bearer sk_YOUR_KEY"
```

**Réponse** :
```json
{
  "data": {
    "id": "cm3xyz789",
    "status": "published",
    "publicUrl": "https://app.sponseasy.com/p/podcast-devcafe-s02-xyz789",
    "publishedAt": "2025-12-01T16:00:00Z"
  }
}
```

#### Supprimer une proposition

```http
DELETE /v1/proposals/:id
```

---

### 2. Leads

#### Lister les leads d'une proposition

```http
GET /v1/proposals/:id/leads
```

**Réponse** :
```json
{
  "data": [
    {
      "id": "lead_abc123",
      "name": "Marie Dupont",
      "email": "marie@techcorp.com",
      "company": "TechCorp SAS",
      "tier": "Gold",
      "message": "Intéressés pour sponsoriser l'édition 2025",
      "createdAt": "2025-11-28T09:15:00Z"
    }
  ],
  "meta": {
    "total": 8
  }
}
```

---

### 3. Utilisateur et limites

#### Obtenir vos informations

```http
GET /v1/user
```

**Réponse** :
```json
{
  "data": {
    "id": "user_123",
    "email": "vous@example.com",
    "firstName": "Jean",
    "lastName": "Martin",
    "plan": "pro",
    "limits": {
      "proposals": {
        "current": 12,
        "limit": 50,
        "remaining": 38
      },
      "apiKeys": {
        "current": 2,
        "limit": 5,
        "remaining": 3
      }
    }
  }
}
```

---

## Rate Limiting

### Limites par plan

| Plan | Requêtes/jour | Requêtes/minute |
|------|---------------|-----------------|
| **Free** | N/A (API non disponible) | N/A |
| **Pro** | 1 000 | 60 |
| **Enterprise** | 5 000 | 200 |

### En-têtes de réponse

Chaque réponse inclut ces headers :

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1701388800
```

### Gestion des erreurs

Réponse quand la limite est atteinte :

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Limit resets at 2025-12-02T00:00:00Z",
    "retryAfter": 3600
  }
}
```

---

## Webhooks

### Configuration

Les webhooks vous permettent de recevoir des notifications en temps réel sur les événements Spons Easy.

**Configuration dans le dashboard** :
1. **Paramètres** > **Webhooks**
2. **Ajouter un endpoint**
3. Sélectionner les événements

### Événements disponibles

| Événement | Déclenché quand... |
|-----------|-------------------|
| `proposal.published` | Une proposition est publiée |
| `proposal.unpublished` | Une proposition est dépubliée |
| `proposal.updated` | Une proposition est modifiée |
| `proposal.deleted` | Une proposition est supprimée |
| `lead.created` | Un nouveau lead arrive |
| `lead.viewed` | Vous consultez un lead |

### Format du payload

**Headers** :
```http
POST https://votre-site.com/webhooks/spons-easy
Content-Type: application/json
X-SponsEasy-Event: proposal.published
X-SponsEasy-Signature: sha256=abc123...
```

**Body** :
```json
{
  "event": "proposal.published",
  "timestamp": "2025-12-01T16:00:00Z",
  "data": {
    "id": "cm3xyz789",
    "title": "TechConf 2025",
    "slug": "techconf-2025-xyz789",
    "publicUrl": "https://app.sponseasy.com/p/techconf-2025-xyz789"
  }
}
```

### Vérifier la signature

**Node.js** :
```typescript
import crypto from 'crypto'

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return `sha256=${expectedSignature}` === signature
}

// Utilisation dans Express
app.post('/webhooks/spons-easy', (req, res) => {
  const signature = req.headers['x-sponseasy-signature']
  const isValid = verifyWebhook(
    JSON.stringify(req.body),
    signature,
    process.env.WEBHOOK_SECRET
  )
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' })
  }
  
  // Traiter l'événement
  const { event, data } = req.body
  
  if (event === 'lead.created') {
    // Envoyer notification Slack, email, etc.
  }
  
  res.status(200).json({ received: true })
})
```

---

## SDK et packages

### Package NPM officiel

```bash
npm install @spons-easy/sdk
```

**Utilisation** :
```typescript
import { SponsEasyClient } from '@spons-easy/sdk'

const client = new SponsEasyClient({
  apiKey: process.env.SPONS_EASY_API_KEY
})

// Créer une proposition
const proposal = await client.proposals.create({
  title: 'Mon Événement',
  projectName: 'Super Conf',
  contactEmail: 'sponsor@event.com',
  tiers: [...]
})

// Lister les propositions
const proposals = await client.proposals.list({ status: 'published' })

// Mettre à jour
await client.proposals.update(proposal.id, {
  title: 'Mon Événement 2025'
})

// Publier
await client.proposals.publish(proposal.id)
```

### Package Python (communauté)

```bash
pip install spons-easy-python
```

**Utilisation** :
```python
from spons_easy import SponsEasyClient

client = SponsEasyClient(api_key=os.getenv('SPONS_EASY_API_KEY'))

# Créer une proposition
proposal = client.proposals.create({
    'title': 'Mon Événement',
    'projectName': 'Super Conf',
    'contactEmail': 'sponsor@event.com',
    'tiers': [...]
})

print(f"Proposition créée : {proposal['publicUrl']}")
```

---

## Exemples d'intégrations

### 1. Synchronisation Notion

Créez automatiquement une page Notion quand un lead arrive :

```typescript
import { Client as NotionClient } from '@notionhq/client'
import { SponsEasyClient } from '@spons-easy/sdk'

const notion = new NotionClient({ auth: process.env.NOTION_KEY })
const sponsEasy = new SponsEasyClient({ apiKey: process.env.SPONS_EASY_KEY })

// Webhook handler
async function handleLeadCreated(lead: any) {
  await notion.pages.create({
    parent: { database_id: process.env.NOTION_DB_ID },
    properties: {
      'Nom': { title: [{ text: { content: lead.name } }] },
      'Email': { email: lead.email },
      'Entreprise': { rich_text: [{ text: { content: lead.company } }] },
      'Palier': { select: { name: lead.tier } },
      'Date': { date: { start: lead.createdAt } }
    }
  })
}
```

### 2. Export automatique vers Google Sheets

```typescript
import { google } from 'googleapis'
import { SponsEasyClient } from '@spons-easy/sdk'

const sheets = google.sheets('v4')
const sponsEasy = new SponsEasyClient({ apiKey: process.env.SPONS_EASY_KEY })

async function exportToSheets() {
  const proposals = await sponsEasy.proposals.list({ status: 'published' })
  
  const rows = proposals.data.map(p => [
    p.title,
    p.status,
    p.metrics.views,
    p.metrics.leads,
    p.publicUrl
  ])
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Propositions!A2',
    valueInputOption: 'RAW',
    requestBody: { values: rows }
  })
}

// Exécuter quotidiennement
setInterval(exportToSheets, 24 * 60 * 60 * 1000)
```

### 3. Génération depuis formulaire Typeform

```typescript
import { SponsEasyClient } from '@spons-easy/sdk'

const sponsEasy = new SponsEasyClient({ apiKey: process.env.SPONS_EASY_KEY })

// Webhook Typeform
app.post('/webhooks/typeform', async (req, res) => {
  const { form_response } = req.body
  const answers = form_response.answers
  
  // Extraire les réponses
  const title = answers.find(a => a.field.ref === 'title').text
  const projectName = answers.find(a => a.field.ref === 'project').text
  const email = answers.find(a => a.field.ref === 'email').email
  
  // Créer la proposition
  const proposal = await sponsEasy.proposals.create({
    title,
    projectName,
    contactEmail: email,
    tiers: [] // À construire depuis le formulaire
  })
  
  res.json({ proposalUrl: proposal.publicUrl })
})
```

---

## Gestion des erreurs

### Codes d'erreur HTTP

| Code | Signification | Action |
|------|---------------|--------|
| `400` | Bad Request | Vérifier le format du body |
| `401` | Unauthorized | Clé API invalide ou expirée |
| `403` | Forbidden | Permissions insuffisantes |
| `404` | Not Found | Ressource inexistante |
| `422` | Validation Error | Données invalides |
| `429` | Rate Limit | Attendre avant de réessayer |
| `500` | Server Error | Réessayer avec backoff |

### Format des erreurs

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "fields": {
      "contactEmail": ["Email format is invalid"],
      "tiers": ["At least one tier is required"]
    }
  }
}
```

### Retry avec backoff exponentiel

```typescript
async function apiCallWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error.status === 429 || error.status >= 500) {
        const delay = Math.pow(2, i) * 1000 // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries exceeded')
}
```

---

## Bonnes pratiques

### 1. Sécurité

✅ **Faire** :
- Stocker la clé API dans des variables d'environnement
- Utiliser HTTPS uniquement
- Vérifier les signatures de webhooks
- Régénérer les clés régulièrement

❌ **Ne pas faire** :
- Exposer la clé dans le code frontend
- Commiter la clé dans Git
- Partager la clé publiquement

### 2. Performance

- **Paginer** les requêtes pour grandes listes
- **Cacher** les réponses quand possible
- **Batch** plusieurs opérations
- **Utiliser les webhooks** plutôt que du polling

### 3. Monitoring

Suivez ces métriques :

- **Taux d'erreur** par endpoint
- **Latence** moyenne
- **Consommation rate limit**
- **Uptime** de vos webhooks

---

## Documentation complète

- **API Reference** : [docs.sponseasy.com/api](https://docs.sponseasy.com/api)
- **SDK TypeScript** : [github.com/spons-easy/sdk](https://github.com/spons-easy/sdk)
- **Exemples** : [github.com/spons-easy/examples](https://github.com/spons-easy/examples)
- **Changelog API** : [docs.sponseasy.com/changelog](https://docs.sponseasy.com/changelog)

---

## Support

**Questions techniques ?** 
- Email : [api@sponseasy.com](mailto:api@sponseasy.com)
- Discord : [Rejoindre la communauté dev](https://discord.gg/sponseasy)
- Status page : [status.sponseasy.com](https://status.sponseasy.com)

---

**Compte Pro requis** pour accéder à l'API - [Upgrader maintenant](https://app.sponseasy.com/billing)

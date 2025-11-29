# Cache Architecture: Admin Dashboard

**Created**: 2025-11-26
**Status**: Implemented

## Overview

Le dashboard admin utilise un système de cache à deux niveaux (L1 + L2) pour optimiser les performances des métriques.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      MetricsService                              │
│                           │                                      │
│                           ▼                                      │
│                  MetricsCacheService                             │
│                           │                                      │
│              ┌────────────┴────────────┐                        │
│              ▼                         ▼                         │
│     ┌─────────────┐           ┌─────────────────┐               │
│     │  L1 Cache   │           │    L2 Cache     │               │
│     │  (Memory)   │           │ (Upstash Redis) │               │
│     │   10 MB     │           │    EU-West-1    │               │
│     │   500 items │           │    256 MB       │               │
│     └─────────────┘           └─────────────────┘               │
│                                        │                         │
│                                        ▼                         │
│                              ┌─────────────────┐                │
│                              │  PostgreSQL     │                │
│                              │  (Neon)         │                │
│                              └─────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration

### Upstash Redis (EU)

| Paramètre | Valeur |
|-----------|--------|
| **Database ID** | `ab913a61-4525-4d40-bd68-7011c9d3be0b` |
| **Region** | `eu-west-1` (Primary) |
| **Endpoint** | `internal-stinkbug-28683.upstash.io` |
| **Port** | `6379` |
| **TLS** | Enabled (obligatoire) |
| **Type** | Free tier |
| **Limite** | 500K commands/mois |

### Variables d'environnement

```env
# Upstash Redis (EU)
REDIS_HOST=internal-stinkbug-28683.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=<UPSTASH_PASSWORD>
```

## TTL Strategy

| Type de données | TTL | Raison |
|-----------------|-----|--------|
| Dashboard complet | 1 minute | Équilibre fraîcheur/performance |
| Overview metrics | 2 minutes | Données agrégées, changent peu |
| Chart data | 1 minute | Graphiques historiques |
| Recent users | 30 secondes | Données dynamiques |
| Recent proposals | 30 secondes | Données dynamiques |

## Tags d'invalidation

```typescript
const TAGS = {
  users: "metrics:users",      // Invalidé à chaque CRUD User
  proposals: "metrics:proposals", // Invalidé à chaque CRUD Proposal
  leads: "metrics:leads",      // Invalidé à chaque CRUD Lead
  all: "metrics:all",          // Invalidation globale
};
```

## Invalidation automatique

Les hooks Lucid ORM invalident le cache automatiquement :

### User Model

```typescript
@afterCreate()
@afterUpdate()
@afterDelete()
static async invalidateMetricsCache() {
  await MetricsCacheService.invalidateUsers();
}
```

### Proposal Model

```typescript
@afterCreate()
@afterUpdate()
@afterDelete()
static async invalidateMetricsCache() {
  await MetricsCacheService.invalidateProposals();
}
```

## Services

### MetricsCacheService

```typescript
// Récupérer avec cache
MetricsCacheService.getOrSetDashboard(period, factory)
MetricsCacheService.getOrSetOverview(period, factory)
MetricsCacheService.getOrSetChartData(period, factory)

// Invalidation
MetricsCacheService.invalidateUsers()
MetricsCacheService.invalidateProposals()
MetricsCacheService.invalidateLeads()
MetricsCacheService.invalidateAll()
```

### MetricsService

```typescript
// Utilise le cache automatiquement
metricsService.getAllDashboardData(period)

// Force le rafraîchissement
metricsService.refreshDashboardCache(period)
```

## Performances

### Avant cache (requêtes DB directes)

| Période | Temps |
|---------|-------|
| 7 jours | 175ms |
| 30 jours | 71ms |
| 365 jours | 57ms |

### Après cache (L1 + L2)

| Période | Temps | Amélioration |
|---------|-------|--------------|
| 7 jours | 25-30ms | **6x** |
| 30 jours | 25ms | **2.8x** |
| 365 jours | 26ms | **2.2x** |

## Index de base de données

Migration `1764154077000_create_add_performance_indices_table.ts` :

### Table `users`
- `idx_users_created_at_desc` - Filtres de période

### Table `proposals`
- `idx_proposals_status_created_at` - Filtre status + période
- `idx_proposals_created_at_desc` - Filtres de période
- `idx_proposals_user_id_status` - Requêtes d'activation

### Table `leads`
- `idx_leads_created_at_desc` - Filtres de période
- `idx_leads_status_created_at` - Métriques de conversion
- `idx_leads_proposal_id_status` - Métriques par proposal

## Monitoring

### Console Upstash

https://console.upstash.com/redis/ab913a61-4525-4d40-bd68-7011c9d3be0b

### Métriques disponibles

- Commands/jour
- Memory usage
- Hit rate
- Latency

## CLI Upstash

```bash
# Liste des bases
upstash redis list

# Détails de la base
upstash redis get ab913a61-4525-4d40-bd68-7011c9d3be0b

# Connexion directe
redis-cli --tls -u redis://<PASSWORD>@internal-stinkbug-28683.upstash.io:6379
```

## Coûts

| Plan | Limite | Coût |
|------|--------|------|
| Free | 500K commands/mois | 0€ |
| Pay-as-you-go | Illimité | 0.20€/100K requests |

Estimation usage dashboard admin : ~30K commands/mois = **Gratuit**

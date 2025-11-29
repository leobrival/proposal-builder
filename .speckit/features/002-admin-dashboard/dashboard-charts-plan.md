# Plan de Visualisation des KPIs - Admin Dashboard

## Filtres Temporels Disponibles

| Filtre | Code | Description |
|--------|------|-------------|
| 7 jours | `7d` | Dernière semaine |
| 15 jours | `15d` | Deux dernières semaines |
| 1 mois | `30d` | Dernier mois |
| 3 mois | `90d` | Dernier trimestre |
| 6 mois | `180d` | Dernier semestre |
| 1 an | `365d` | Dernière année |
| Toujours | `all` | Depuis le début |

## North Star Metric

### Proposals Published (Métrique Principale)

| KPI | Type de Chart | Justification |
|-----|---------------|---------------|
| Valeur actuelle vs Target | **Gauge / Radial Progress** | Visualisation immédiate de la progression vers l'objectif |
| Évolution dans le temps | **Area Chart** | Montre la croissance cumulative et les tendances |
| Comparaison période précédente | **Badge avec pourcentage** | Indicateur rapide de la tendance |

```
┌─────────────────────────────────────────────────────────┐
│  North Star: Proposals Published                        │
│  ┌──────────┐  ┌─────────────────────────────────────┐ │
│  │   72%    │  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░ │ │
│  │  72/100  │  │        Area Chart évolution         │ │
│  │  target  │  │                                     │ │
│  └──────────┘  └─────────────────────────────────────┘ │
│  +15% vs période précédente                            │
└─────────────────────────────────────────────────────────┘
```

## AARRR Metrics

### 1. Acquisition

| KPI | Type de Chart | Justification | Granularité |
|-----|---------------|---------------|-------------|
| Total Users | **Number Card** | KPI simple, valeur absolue | Instantané |
| New Users | **Bar Chart** | Compare les inscriptions jour par jour | Jour/Semaine |
| Registration Rate | **Line Chart** | Évolution du taux dans le temps | Jour |
| Sources d'acquisition | **Pie Chart / Donut** | Répartition par canal | Période |
| Trend vs période précédente | **Sparkline** | Tendance rapide intégrée dans la card | Période |

```
┌─────────────────────────────────────────────────────────┐
│  Acquisition                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Total Users  │  │  New Users   │  │ Reg. Rate    │  │
│  │    1,234     │  │     89       │  │   12.5%      │  │
│  │ ───────────  │  │ █ █▄█ █▄    │  │ ─────────    │  │
│  │   +12% ↑     │  │ Bar Chart    │  │   +5% ↑      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Sources d'Acquisition (Donut)           │   │
│  │    Organic 45% | Referral 30% | Paid 25%        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2. Activation

| KPI | Type de Chart | Justification | Granularité |
|-----|---------------|---------------|-------------|
| Activation Rate | **Gauge** | Objectif clair (35% target) | Période |
| Time to First Proposal | **Histogram** | Distribution des délais | Jour |
| Activation Funnel | **Funnel Chart** | Étapes: Signup → Profile → 1st Proposal → Published | Période |
| Daily Activations | **Line Chart** | Tendance des activations | Jour |

```
┌─────────────────────────────────────────────────────────┐
│  Activation                                             │
│  ┌──────────────┐  ┌──────────────────────────────────┐│
│  │ Act. Rate    │  │      Activation Funnel           ││
│  │    63%       │  │ Signup    ████████████████ 100%  ││
│  │   ◐ Gauge    │  │ Profile   ██████████████   85%   ││
│  │  Target: 35% │  │ 1st Prop  ████████████     72%   ││
│  └──────────────┘  │ Published ████████         63%   ││
│                    └──────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐   │
│  │    Time to First Proposal (Histogram)           │   │
│  │    < 1h | 1-24h | 1-3d | 3-7d | > 7d            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 3. Retention

| KPI | Type de Chart | Justification | Granularité |
|-----|---------------|---------------|-------------|
| Week 1 Retention | **Gauge** | Objectif clair (45% target) | Semaine |
| DAU/MAU Ratio | **Line Chart** | Évolution de l'engagement | Jour |
| Monthly Churn | **Bar Chart (inversé)** | Visualiser les pertes | Mois |
| Retention Cohorts | **Heatmap** | Analyse par cohorte d'inscription | Semaine/Mois |
| User Activity | **Stacked Area Chart** | Utilisateurs actifs vs inactifs | Jour |

```
┌─────────────────────────────────────────────────────────┐
│  Retention                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │ Week 1 Ret │ │  DAU/MAU   │ │   Churn    │          │
│  │    45%     │ │    22%     │ │    6%      │          │
│  │   ◐ Gauge  │ │ ─────────  │ │ █ █ █ █    │          │
│  │ Target:45% │ │ Line Chart │ │ Bar Chart  │          │
│  └────────────┘ └────────────┘ └────────────┘          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Retention Cohorts (Heatmap)           │   │
│  │         W1    W2    W3    W4    W5    W6        │   │
│  │ Nov W1  100%  72%   58%   45%   42%   40%       │   │
│  │ Nov W2  100%  68%   55%   48%   44%   --        │   │
│  │ Nov W3  100%  75%   62%   52%   --    --        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4. Revenue (Future - Stripe Integration)

| KPI | Type de Chart | Justification | Granularité |
|-----|---------------|---------------|-------------|
| MRR | **Number Card + Area Chart** | Revenu récurrent avec évolution | Mois |
| ARPU | **Line Chart** | Évolution du revenu par utilisateur | Mois |
| Free to Paid | **Funnel Chart** | Conversion freemium | Période |
| LTV/CAC | **Gauge** | Ratio santé business (target > 3) | Mois |
| Revenue by Plan | **Stacked Bar Chart** | Répartition par tier | Mois |
| Churn Revenue | **Bar Chart (négatif)** | Perte de revenus | Mois |

```
┌─────────────────────────────────────────────────────────┐
│  Revenue                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │    MRR     │ │    ARPU    │ │  LTV/CAC   │          │
│  │  €12,450   │ │   €24.50   │ │    3.2x    │          │
│  │ ▓▓▓▓▓▓▓▓   │ │ ─────────  │ │   ◐ Gauge  │          │
│  │ Area Chart │ │ Line Chart │ │ Target: 3x │          │
│  └────────────┘ └────────────┘ └────────────┘          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │        Revenue by Plan (Stacked Bar)            │   │
│  │ Free | Starter €9 | Pro €29 | Business €99      │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 5. Referral (Future - PostHog Integration)

| KPI | Type de Chart | Justification | Granularité |
|-----|---------------|---------------|-------------|
| NPS Score | **Gauge** | Score -100 à +100 | Période |
| K-Factor | **Line Chart** | Viralité dans le temps | Semaine |
| Referral Sources | **Pie Chart** | Canaux de partage | Période |
| Invites Sent vs Converted | **Dual Bar Chart** | Efficacité du referral | Semaine |

```
┌─────────────────────────────────────────────────────────┐
│  Referral                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │    NPS     │ │  K-Factor  │ │  Invites   │          │
│  │    +42     │ │    0.8     │ │   234      │          │
│  │   ◐ Gauge  │ │ ─────────  │ │ Sent: 312  │          │
│  │  Promoters │ │ Line Chart │ │ Conv: 75%  │          │
│  └────────────┘ └────────────┘ └────────────┘          │
└─────────────────────────────────────────────────────────┘
```

## Proposals Analytics

| KPI | Type de Chart | Justification | Granularité |
|-----|---------------|---------------|-------------|
| Total Proposals | **Number Card** | Valeur absolue | Instantané |
| By Status | **Donut Chart** | Répartition Draft/Published/Archived | Période |
| Daily Created | **Bar Chart** | Activité quotidienne | Jour |
| Published vs Draft Trend | **Stacked Area Chart** | Évolution des deux statuts | Jour |
| Avg Tiers per Proposal | **Line Chart** | Complexité des proposals | Semaine |
| Proposals with Leads | **Progress Bar** | % proposals avec au moins 1 lead | Période |

```
┌─────────────────────────────────────────────────────────┐
│  Proposals Analytics                                    │
│  ┌────────────┐ ┌────────────────────────────────────┐ │
│  │   Total    │ │       By Status (Donut)            │ │
│  │    156     │ │  Published 70% | Draft 20% | 10%   │ │
│  │ +23 period │ │                                    │ │
│  └────────────┘ └────────────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │     Daily Created (Stacked Bar)                 │   │
│  │     Published ████ | Draft ██                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Leads Analytics

| KPI | Type de Chart | Justification | Granularité |
|-----|---------------|---------------|-------------|
| Total Leads | **Number Card** | Valeur absolue | Instantané |
| Lead Conversion Rate | **Gauge** | Objectif clair | Période |
| Leads per Proposal | **Histogram** | Distribution | Période |
| Lead Sources | **Pie Chart** | D'où viennent les leads | Période |
| Daily Leads | **Bar Chart** | Activité quotidienne | Jour |
| Lead Quality Score | **Heatmap** | Score par source/période | Semaine |

```
┌─────────────────────────────────────────────────────────┐
│  Leads Analytics                                        │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │   Total    │ │ Conv. Rate │ │ Avg/Prop   │          │
│  │    892     │ │   12.5%    │ │    5.7     │          │
│  │ +156 period│ │   ◐ Gauge  │ │ ─────────  │          │
│  └────────────┘ └────────────┘ └────────────┘          │
└─────────────────────────────────────────────────────────┘
```

## User Activity

| KPI | Type de Chart | Justification | Granularité |
|-----|---------------|---------------|-------------|
| Active Users | **Stacked Area** | DAU/WAU/MAU sur même graphique | Jour |
| Session Duration | **Histogram** | Distribution des durées | Période |
| Pages per Session | **Line Chart** | Engagement | Jour |
| Peak Activity Hours | **Heatmap** | Jour x Heure | Heure |
| User Segments | **Treemap** | Power users / Regular / Casual | Période |

```
┌─────────────────────────────────────────────────────────┐
│  User Activity                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │       Active Users (Stacked Area)               │   │
│  │   DAU ░░░ | WAU ▒▒▒ | MAU ▓▓▓                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │       Peak Activity (Heatmap)                   │   │
│  │       Lun Mar Mer Jeu Ven Sam Dim               │   │
│  │  8h   ░   ░   ░   ░   ░   ░   ░                 │   │
│  │ 14h   ▓   ▓   ▓   ▓   ▓   ░   ░                 │   │
│  │ 20h   ▒   ▒   ▒   ▒   ░   ░   ░                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Récapitulatif des Types de Charts

| Type de Chart | Cas d'utilisation | Librairie Recharts |
|---------------|-------------------|-------------------|
| **Number Card** | KPIs simples, valeurs absolues | Custom component |
| **Gauge / Radial** | Progression vers objectif | `RadialBarChart` |
| **Line Chart** | Évolution dans le temps | `LineChart` |
| **Area Chart** | Évolution cumulative | `AreaChart` |
| **Bar Chart** | Comparaison par période | `BarChart` |
| **Stacked Bar** | Répartition par catégorie | `BarChart` (stacked) |
| **Pie / Donut** | Répartition en % | `PieChart` |
| **Funnel** | Conversion étapes | `FunnelChart` |
| **Heatmap** | 2 dimensions (cohorts, activity) | Custom avec `Rectangle` |
| **Histogram** | Distribution | `BarChart` avec bins |
| **Sparkline** | Tendance inline | `LineChart` minimal |
| **Treemap** | Hiérarchie proportionnelle | `Treemap` |

## Composants shadcn/ui à utiliser

- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`
- `Select` pour le filtre temporel
- `Tabs` pour basculer entre vues
- `Badge` pour les tendances (+X%, -X%)
- `Skeleton` pour le loading state

## Architecture des Composants

```
inertia/components/admin/
├── charts/
│   ├── gauge-chart.tsx          # Radial progress
│   ├── area-chart.tsx           # Cumulative growth
│   ├── bar-chart.tsx            # Daily comparisons
│   ├── stacked-bar-chart.tsx    # Multi-category bars
│   ├── line-chart.tsx           # Trends
│   ├── pie-chart.tsx            # Distribution
│   ├── funnel-chart.tsx         # Conversion steps
│   ├── heatmap-chart.tsx        # Cohorts / Activity
│   ├── sparkline.tsx            # Inline mini chart
│   └── number-card.tsx          # KPI with trend
├── filters/
│   └── period-filter.tsx        # 7d, 15d, 30d, 90d, 180d, 365d, all
├── sections/
│   ├── north-star-section.tsx
│   ├── acquisition-section.tsx
│   ├── activation-section.tsx
│   ├── retention-section.tsx
│   ├── revenue-section.tsx
│   ├── referral-section.tsx
│   ├── proposals-section.tsx
│   ├── leads-section.tsx
│   └── activity-section.tsx
└── dashboard-layout.tsx
```

## API Backend

### Endpoints nécessaires

```typescript
// GET /admin/api/metrics?period=7d|15d|30d|90d|180d|365d|all

interface MetricsResponse {
  period: string;
  northStar: NorthStarMetrics;
  acquisition: AcquisitionMetrics;
  activation: ActivationMetrics;
  retention: RetentionMetrics;
  revenue: RevenueMetrics;
  referral: ReferralMetrics;
  proposals: ProposalMetrics;
  leads: LeadMetrics;
  activity: ActivityMetrics;
}

// GET /admin/api/charts/:type?period=...
// Types: users, proposals, leads, retention-cohorts, activity-heatmap
```

## Priorité d'Implémentation

### Phase 1 - MVP (Maintenant)

1. Period Filter (7d, 15d, 30d, 90d, 180d, 365d, all)
2. North Star avec Gauge
3. Acquisition (Number Cards + Bar Chart)
4. Proposals Analytics (Donut + Stacked Bar)

### Phase 2 - Activation & Retention

1. Activation Funnel
2. Time to First Proposal Histogram
3. Retention Cohorts Heatmap
4. DAU/MAU Line Chart

### Phase 3 - Revenue (Post-Stripe)

1. MRR Area Chart
2. Revenue by Plan
3. LTV/CAC Gauge

### Phase 4 - Advanced

1. Activity Heatmap
2. User Segments Treemap
3. NPS Gauge
4. K-Factor Line

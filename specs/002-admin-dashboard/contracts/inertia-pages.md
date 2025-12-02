# Inertia Pages: Admin Dashboard

**Feature Branch**: `002-admin-dashboard`
**Date**: 2025-11-26

## Page Structure

```
inertia/pages/admin/
├── dashboard.tsx           # Main KPI overview
├── users/
│   ├── index.tsx          # User list
│   └── [id].tsx           # User details
├── proposals/
│   ├── index.tsx          # Proposal list
│   └── [id].tsx           # Proposal details
├── revenue.tsx            # Revenue analytics
└── growth.tsx             # GTM analytics
```

## Component Hierarchy

### Dashboard Page

```
AdminDashboard
├── AdminLayout
│   ├── AdminSidebar
│   │   ├── NavLink (Dashboard)
│   │   ├── NavLink (Users)
│   │   ├── NavLink (Proposals)
│   │   ├── NavLink (Revenue)
│   │   └── NavLink (Growth)
│   └── AdminHeader
│       ├── BreadcrumbNav
│       └── PeriodSelector
├── NorthStarCard
│   ├── MetricValue
│   ├── TrendIndicator
│   └── ThresholdBadge
├── AARRRMetricsGrid
│   ├── MetricsCard (Acquisition)
│   ├── MetricsCard (Activation)
│   ├── MetricsCard (Retention)
│   ├── MetricsCard (Revenue)
│   └── MetricsCard (Referral)
├── TrendChartSection
│   ├── AreaChart (Users)
│   └── AreaChart (Proposals)
└── RecentActivitySection
    ├── RecentUsersList
    └── RecentProposalsList
```

### Users Pages

```
AdminUsersIndex
├── AdminLayout
├── PageHeader
│   ├── Title
│   └── SearchInput
├── FiltersBar
│   ├── TierSelect
│   ├── StatusSelect
│   └── SortSelect
├── UsersDataTable
│   ├── TableHeader
│   ├── TableBody
│   │   └── UserRow (×n)
│   └── TablePagination
└── EmptyState (conditional)

AdminUsersShow
├── AdminLayout
├── PageHeader
│   ├── BackButton
│   ├── UserTitle
│   └── ActionButtons
│       ├── DeactivateButton
│       └── ActivateButton
├── UserInfoCard
│   ├── Avatar
│   ├── ContactInfo
│   ├── RoleBadge
│   └── StatusBadge
├── UserStatsTabs
│   ├── Tab (Proposals)
│   │   └── ProposalsList
│   ├── Tab (Leads)
│   │   └── LeadsList
│   ├── Tab (Activity)
│   │   └── ActivityTimeline
│   └── Tab (Subscription)
│       └── SubscriptionHistory
└── AdminActionsLog
```

### Proposals Pages

```
AdminProposalsIndex
├── AdminLayout
├── PageHeader
│   ├── Title
│   └── SearchInput
├── ProposalStatsCards
│   ├── StatCard (Total)
│   ├── StatCard (Draft)
│   ├── StatCard (Published)
│   └── StatCard (Archived)
├── FiltersBar
│   ├── StatusSelect
│   └── SortSelect
├── ProposalsDataTable
│   ├── TableHeader
│   ├── TableBody
│   │   └── ProposalRow (×n)
│   └── TablePagination
└── EmptyState (conditional)

AdminProposalsShow
├── AdminLayout
├── PageHeader
│   ├── BackButton
│   ├── ProposalTitle
│   └── ActionButtons
│       └── UnpublishButton
├── ProposalInfoCard
│   ├── StatusBadge
│   ├── AuthorLink
│   ├── DatesInfo
│   └── StatsRow
├── ViewsChart
│   └── AreaChart
├── ProposalContentTabs
│   ├── Tab (Tiers)
│   │   └── TiersList
│   ├── Tab (Leads)
│   │   └── LeadsTable
│   └── Tab (Preview)
│       └── ProposalPreview
└── AdminActionsLog
```

### Analytics Pages

```
AdminRevenue
├── AdminLayout
├── PageHeader
│   ├── Title
│   └── PeriodSelector
├── RevenueOverviewCards
│   ├── MetricCard (MRR)
│   ├── MetricCard (ARR)
│   ├── MetricCard (ARPU)
│   └── MetricCard (LTV:CAC)
├── MRRBreakdownCard
│   ├── WaterfallChart
│   └── BreakdownTable
├── MRRTrendChart
│   └── AreaChart
├── SubscriptionsByTierCard
│   └── PieChart
└── RecentEventsCard
    └── EventsList

AdminGrowth
├── AdminLayout
├── PageHeader
│   ├── Title
│   └── PeriodSelector
├── OKRProgressGrid
│   ├── OKRCard (Signups)
│   ├── OKRCard (Activation)
│   ├── OKRCard (Proposals)
│   ├── OKRCard (NPS)
│   └── OKRCard (Retention)
├── ActivationFunnelCard
│   └── FunnelChart
├── ChannelPerformanceCard
│   └── ChannelTable
├── ReferralMetricsCard
│   ├── KFactorGauge
│   └── ParticipationStats
└── GrowthTrendChart
    └── StackedAreaChart
```

## Component Specifications

### AdminLayout

```tsx
interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  breadcrumbs?: { label: string; href?: string }[]
}

// Features:
// - Sidebar navigation with active state
// - Responsive (collapsible on mobile)
// - Header with breadcrumbs
// - Period selector (global state)
```

### MetricsCard

```tsx
interface MetricsCardProps {
  title: string
  value: number | string
  format?: 'number' | 'percentage' | 'currency' | 'time'
  trend?: number // percentage change
  trendDirection?: 'up-good' | 'down-good' // for churn, lower is better
  threshold?: {
    green: number
    yellow: number
    inverted?: boolean
  }
  icon?: React.ReactNode
  loading?: boolean
}

// Features:
// - Animated number counting
// - Trend arrow with color
// - Threshold status badge
// - Loading skeleton state
```

### AreaChart (shadcn/ui)

```tsx
interface AreaChartProps {
  data: { date: string; value: number }[]
  xKey?: string
  yKey?: string
  gradient?: boolean
  stacked?: boolean
  colors?: string[]
  height?: number
  showTooltip?: boolean
  showGrid?: boolean
}

// Features:
// - Uses Recharts via shadcn/ui
// - Responsive sizing
// - Hover tooltips
// - Gradient fill option
// - Multiple series for stacked
```

### DataTable

```tsx
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pagination: {
    page: number
    perPage: number
    total: number
  }
  onPageChange: (page: number) => void
  onSort?: (field: string, order: 'asc' | 'desc') => void
  onRowClick?: (row: T) => void
  loading?: boolean
}

// Features:
// - Uses @tanstack/react-table
// - Server-side pagination
// - Sortable columns
// - Row click handling
// - Loading state
// - Empty state
```

### ThresholdIndicator

```tsx
interface ThresholdIndicatorProps {
  value: number
  thresholds: {
    green: number
    yellow: number
    inverted?: boolean // for metrics where lower is better
  }
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Features:
// - Color-coded badge
// - Configurable thresholds
// - Support for inverted metrics (churn)
```

### PeriodSelector

```tsx
interface PeriodSelectorProps {
  value: '7d' | '30d' | '90d'
  onChange: (period: string) => void
}

// Features:
// - Uses shadcn/ui Select
// - Persists to URL query param
// - Triggers data refresh
```

### ConfirmDialog

```tsx
interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: 'default' | 'destructive'
  loading?: boolean
}

// Features:
// - Used for deactivate/unpublish actions
// - Loading state during action
// - Destructive variant for dangerous actions
```

## New shadcn/ui Components Needed

```bash
# Install required components
npx shadcn@latest add chart
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add avatar
npx shadcn@latest add skeleton
npx shadcn@latest add alert
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add dropdown-menu
```

## State Management

### URL State (via Inertia)
- Current page/filters for lists
- Selected period for analytics
- Search queries

### Local State (React useState)
- Modal open/close
- Loading states
- Form inputs

### Server State (Inertia props)
- All data comes from server
- No client-side caching needed
- Refresh via Inertia.reload()

## Page Props Types

```typescript
// inertia/types/admin.ts

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export interface AdminUser {
  id: string
  fullName: string
  email: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
  proposalCount: number
  publishedProposalCount: number
  leadCount: number
}

export interface AdminProposal {
  id: string
  title: string
  status: 'draft' | 'published' | 'archived'
  viewCount: number
  leadCount: number
  tierCount: number
  createdAt: string
  publishedAt: string | null
  author: {
    id: string
    fullName: string
    email: string
  }
}

export interface MetricData {
  current: number
  previous: number
  trend: number
  target?: number
  status?: 'green' | 'yellow' | 'red'
}

export interface ChartDataPoint {
  date: string
  value: number
  [key: string]: string | number
}

export interface FunnelStage {
  name: string
  count: number
  rate: number
}

export interface AdminAction {
  id: string
  action: string
  targetType: string
  targetId: string
  metadata: Record<string, unknown>
  createdAt: string
  admin: {
    id: string
    fullName: string
  }
}
```

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 768px | Sidebar collapsed, single column |
| 768px - 1024px | Sidebar visible, 2-column grid |
| > 1024px | Full layout, 3-4 column grid |

## Accessibility

- All interactive elements keyboard accessible
- ARIA labels on icons and charts
- Color contrast meets WCAG 2.1 AA
- Focus management for modals
- Screen reader support for metrics

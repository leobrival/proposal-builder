# API Routes: Admin Dashboard

**Feature Branch**: `002-admin-dashboard`
**Date**: 2025-11-26

## Route Overview

All admin routes are prefixed with `/admin` and protected by `AdminMiddleware`.

```typescript
// start/routes.ts
router
  .group(() => {
    // Dashboard
    router.get('/dashboard', [AdminDashboardController, 'index']).as('admin.dashboard')

    // Users
    router.get('/users', [AdminUsersController, 'index']).as('admin.users.index')
    router.get('/users/:id', [AdminUsersController, 'show']).as('admin.users.show')
    router
      .post('/users/:id/deactivate', [AdminUsersController, 'deactivate'])
      .as('admin.users.deactivate')
    router
      .post('/users/:id/activate', [AdminUsersController, 'activate'])
      .as('admin.users.activate')

    // Proposals
    router.get('/proposals', [AdminProposalsController, 'index']).as('admin.proposals.index')
    router.get('/proposals/:id', [AdminProposalsController, 'show']).as('admin.proposals.show')
    router
      .post('/proposals/:id/unpublish', [AdminProposalsController, 'unpublish'])
      .as('admin.proposals.unpublish')

    // Analytics
    router.get('/revenue', [AdminRevenueController, 'index']).as('admin.revenue')
    router.get('/growth', [AdminGrowthController, 'index']).as('admin.growth')

    // API endpoints (JSON responses for charts)
    router.get('/api/metrics/overview', [AdminApiController, 'overview']).as('admin.api.overview')
    router.get('/api/metrics/trend', [AdminApiController, 'trend']).as('admin.api.trend')
    router.get('/api/metrics/funnel', [AdminApiController, 'funnel']).as('admin.api.funnel')
  })
  .prefix('/admin')
  .middleware([middleware.auth(), middleware.admin()])
  .as('admin')
```

## Endpoint Specifications

### Dashboard

#### GET /admin/dashboard

**Description**: Main admin dashboard with KPI overview

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | "7d" | Time period: "7d", "30d", "90d" |

**Response**: Inertia page with props

```typescript
interface DashboardProps {
  // North Star
  northStar: {
    current: number
    target: number
    trend: number // percentage change
    status: 'green' | 'yellow' | 'red'
  }

  // AARRR Metrics
  acquisition: {
    totalUsers: number
    newUsers: number
    registrationRate: number
    trend: number
  }
  activation: {
    activationRate: number
    timeToFirstProposal: number // minutes
    trend: number
  }
  retention: {
    week1Retention: number
    dauMau: number
    monthlyChurn: number
    trend: number
  }
  revenue: {
    mrr: number
    arpu: number
    freeToPaid: number
    ltvCac: number
    trend: number
  }
  referral: {
    nps: number
    kFactor: number
    trend: number
  }

  // Recent activity
  recentUsers: User[]
  recentProposals: Proposal[]

  // Period
  period: '7d' | '30d' | '90d'
}
```

---

### Users

#### GET /admin/users

**Description**: Paginated list of all users

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| perPage | number | 20 | Items per page |
| search | string | "" | Search by name/email |
| tier | string | "all" | Filter: "all", "free", "pro", "business" |
| status | string | "all" | Filter: "all", "active", "inactive" |
| sort | string | "created_at" | Sort field |
| order | string | "desc" | Sort order: "asc", "desc" |

**Response**: Inertia page with props

```typescript
interface UsersIndexProps {
  users: {
    data: UserWithStats[]
    meta: PaginationMeta
  }
  filters: {
    search: string
    tier: string
    status: string
    sort: string
    order: string
  }
}

interface UserWithStats {
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
  tier: 'free' | 'pro' | 'business' // calculated from subscription
}
```

#### GET /admin/users/:id

**Description**: Detailed user profile

**Response**: Inertia page with props

```typescript
interface UserShowProps {
  user: UserWithStats & {
    proposals: ProposalSummary[]
    leads: LeadSummary[]
    activityTimeline: ActivityEvent[]
    subscriptionHistory: SubscriptionEvent[]
  }
  adminActions: AdminAction[] // Actions taken on this user
}
```

#### POST /admin/users/:id/deactivate

**Description**: Deactivate a user account

**Request Body**:

```typescript
interface DeactivateRequest {
  reason?: string
}
```

**Response**:

```typescript
// Success: Redirect to /admin/users/:id with flash message
// Error: 403 if trying to deactivate own account
// Error: 404 if user not found
```

#### POST /admin/users/:id/activate

**Description**: Reactivate a deactivated user account

**Response**:

```typescript
// Success: Redirect to /admin/users/:id with flash message
// Error: 404 if user not found
```

---

### Proposals

#### GET /admin/proposals

**Description**: Paginated list of all proposals

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| perPage | number | 20 | Items per page |
| search | string | "" | Search by title/author |
| status | string | "all" | Filter: "all", "draft", "published", "archived" |
| sort | string | "created_at" | Sort field |
| order | string | "desc" | Sort order |

**Response**: Inertia page with props

```typescript
interface ProposalsIndexProps {
  proposals: {
    data: ProposalWithAuthor[]
    meta: PaginationMeta
  }
  filters: {
    search: string
    status: string
    sort: string
    order: string
  }
  stats: {
    total: number
    draft: number
    published: number
    archived: number
  }
}

interface ProposalWithAuthor {
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
```

#### GET /admin/proposals/:id

**Description**: Detailed proposal view

**Response**: Inertia page with props

```typescript
interface ProposalShowProps {
  proposal: Proposal & {
    author: User
    tiers: Tier[]
    leads: Lead[]
    viewsOverTime: { date: string; views: number }[]
  }
  adminActions: AdminAction[] // Actions taken on this proposal
}
```

#### POST /admin/proposals/:id/unpublish

**Description**: Force unpublish a proposal

**Request Body**:

```typescript
interface UnpublishRequest {
  reason?: string
  notifyOwner?: boolean
}
```

**Response**:

```typescript
// Success: Redirect to /admin/proposals/:id with flash message
// Error: 400 if proposal not published
// Error: 404 if proposal not found
```

---

### Analytics

#### GET /admin/revenue

**Description**: Revenue analytics dashboard

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | "30d" | Time period |

**Response**: Inertia page with props

```typescript
interface RevenueProps {
  overview: {
    mrr: number
    arr: number
    mrrGrowth: number
    arpu: number
    freeToPaid: number
    ltvCac: number
  }
  mrrBreakdown: {
    newMrr: number
    expansionMrr: number
    churnedMrr: number
    netMrr: number
  }
  mrrTrend: { date: string; mrr: number }[]
  subscriptionsByTier: { tier: string; count: number }[]
  recentEvents: SubscriptionEvent[]
  period: string
}
```

#### GET /admin/growth

**Description**: GTM and growth analytics

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| period | string | "30d" | Time period |

**Response**: Inertia page with props

```typescript
interface GrowthProps {
  okrs: {
    signups: { current: number; target: number; status: string }
    activation: { current: number; target: number; status: string }
    proposals: { current: number; target: number; status: string }
    nps: { current: number; target: number; status: string }
    retention: { current: number; target: number; status: string }
  }
  funnel: {
    signup: number
    dashboardView: number
    createStarted: number
    proposalSaved: number
    tiersAdded: number
    proposalPublished: number
  }
  channelPerformance: {
    channel: string
    visitors: number
    signups: number
    conversionRate: number
    cac: number
  }[]
  referralMetrics: {
    kFactor: number
    participationRate: number
    madeWithClicks: number
  }
  trend: { date: string; signups: number; activated: number }[]
  period: string
}
```

---

### API Endpoints (JSON)

#### GET /admin/api/metrics/overview

**Description**: JSON endpoint for dashboard metrics (for client-side refresh)

**Response**:

```typescript
interface MetricsOverviewResponse {
  northStar: { current: number; target: number; trend: number }
  acquisition: { totalUsers: number; newUsers: number; trend: number }
  activation: { rate: number; trend: number }
  retention: { week1: number; dauMau: number; trend: number }
  revenue: { mrr: number; trend: number }
  referral: { nps: number; kFactor: number }
  updatedAt: string
}
```

#### GET /admin/api/metrics/trend

**Description**: Time series data for charts

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| metric | string | required | Metric name |
| period | string | "7d" | Time period |

**Response**:

```typescript
interface TrendResponse {
  metric: string
  period: string
  data: { date: string; value: number }[]
}
```

#### GET /admin/api/metrics/funnel

**Description**: Activation funnel data

**Response**:

```typescript
interface FunnelResponse {
  stages: {
    name: string
    count: number
    rate: number // percentage from previous stage
  }[]
}
```

---

## Error Responses

All endpoints return standard error format:

```typescript
interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
}
```

| Status | Description                        |
| ------ | ---------------------------------- |
| 400    | Bad Request - Invalid parameters   |
| 401    | Unauthorized - Not authenticated   |
| 403    | Forbidden - Not admin role         |
| 404    | Not Found - Resource doesn't exist |
| 422    | Validation Error - Invalid input   |
| 500    | Server Error                       |

## Security

### CSRF Protection

All admin POST/DELETE actions are protected by AdonisJS Shield CSRF middleware:

```typescript
// config/shield.ts
csrf: {
  enabled: true,
  exceptRoutes: [],
  enableXsrfCookie: true,
  methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
}
```

**Implementation**:

- All admin forms include CSRF token via `@csrf()` directive
- Inertia.js automatically handles CSRF tokens via `X-XSRF-TOKEN` header
- POST actions (deactivate, activate, unpublish) require valid CSRF token
- Invalid tokens return 419 status code

### Input Validation

All admin endpoints validate inputs using AdonisJS VineJS validators:

```typescript
// app/validators/admin_validator.ts
export const deactivateUserValidator = vine.compile(
  vine.object({
    reason: vine.string().optional().maxLength(500),
  })
)

export const unpublishProposalValidator = vine.compile(
  vine.object({
    reason: vine.string().optional().maxLength(500),
    notifyOwner: vine.boolean().optional(),
  })
)

export const listUsersValidator = vine.compile(
  vine.object({
    page: vine.number().optional().min(1),
    perPage: vine.number().optional().min(1).max(100),
    search: vine.string().optional().maxLength(100),
    tier: vine.enum(['all', 'free', 'pro', 'business']).optional(),
    status: vine.enum(['all', 'active', 'inactive']).optional(),
    sort: vine.enum(['created_at', 'name', 'proposal_count']).optional(),
    order: vine.enum(['asc', 'desc']).optional(),
  })
)
```

## Rate Limiting

Admin endpoints are rate-limited using AdonisJS Limiter:

```typescript
// config/limiter.ts
adminDashboard: Limiter.define('admin-dashboard', () => {
  return Limiter.allowRequests(60).every('1 minute')
})

adminDetail: Limiter.define('admin-detail', () => {
  return Limiter.allowRequests(120).every('1 minute')
})

adminAction: Limiter.define('admin-action', () => {
  return Limiter.allowRequests(10).every('1 minute')
})
```

**Rate Limits by Endpoint Type**:

- Dashboard/List views: 60 requests/minute
- Detail views: 120 requests/minute
- Actions (deactivate, unpublish): 10 requests/minute

**Response on Rate Limit Exceeded**:

```typescript
{
  status: 429,
  message: "Too many requests. Please try again later.",
  retryAfter: 60 // seconds
}
```

## Caching

| Endpoint              | Cache TTL | Cache Key                         |
| --------------------- | --------- | --------------------------------- |
| /admin/dashboard      | 5 min     | `admin:dashboard:{period}`        |
| /admin/api/metrics/\* | 5 min     | `admin:metrics:{metric}:{period}` |
| /admin/users          | None      | -                                 |
| /admin/proposals      | None      | -                                 |

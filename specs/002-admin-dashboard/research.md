# Research: Admin Dashboard

**Feature Branch**: `002-admin-dashboard`
**Date**: 2025-11-26
**Status**: Complete

## Research Areas

### 1. shadcn/ui Area Charts Implementation

**Decision**: Use shadcn/ui chart components with Recharts
**Rationale**: 
- shadcn/ui provides pre-built, accessible chart components
- Uses Recharts under the hood (industry standard)
- Consistent styling with existing UI components
- Supports all required chart types (area, stacked area, gradient)

**Implementation Details**:
```bash
# Install chart component
npx shadcn@latest add chart
```

The chart component uses:
- `recharts` for rendering
- `@radix-ui/react-slot` for composition
- Tailwind CSS for styling

**Chart Types Needed**:
1. **Linear Area Chart** - MRR evolution, user growth
2. **Stacked Area Chart** - Traffic by channel
3. **Gradient Area Chart** - Proposal views over time

**Alternatives Considered**:
- Chart.js: Good but less React-native integration
- Tremor: Good charts but adds another design system
- Visx: Lower-level, more work to style

### 2. Admin Role Implementation in AdonisJS

**Decision**: Add `role` enum column to users table
**Rationale**:
- Simplest approach for single admin level
- No additional tables needed
- Easy to extend later if needed

**Implementation**:
```typescript
// Migration
schema.alterTable('users', (table) => {
  table.enum('role', ['user', 'admin']).defaultTo('user')
})

// Model
@column()
declare role: 'user' | 'admin'
```

**Middleware Pattern**:
```typescript
// app/middleware/admin_middleware.ts
export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user
    if (!user || user.role !== 'admin') {
      return response.forbidden({ message: 'Admin access required' })
    }
    await next()
  }
}
```

**Alternatives Considered**:
- Bouncer/Policies: Overkill for single role
- Separate admins table: Unnecessary complexity
- JWT claims: Already using session auth

### 3. Metrics Calculation Strategy

**Decision**: Hybrid approach - real-time for simple counts, cached for aggregations
**Rationale**:
- Simple counts (total users, proposals) are fast
- Time-series aggregations are expensive
- 5-minute cache acceptable per spec assumptions

**Caching Strategy**:
```typescript
// Using AdonisJS cache (Redis or in-memory)
const metrics = await cache.getOrSet(
  'admin:dashboard:overview',
  async () => calculateMetrics(),
  { ttl: 300 } // 5 minutes
)
```

**Metrics Categories**:

| Category | Calculation Method | Cache TTL |
|----------|-------------------|-----------|
| Total counts | Real-time query | None |
| Daily aggregates | Scheduled job | 1 hour |
| Trend data (7/30/90d) | Cached query | 5 min |
| Conversion rates | Calculated | 5 min |

**Alternatives Considered**:
- Materialized views: Good but PostgreSQL-specific complexity
- Pre-computed tables: Requires scheduled jobs
- External analytics (PostHog only): Limited customization

### 4. Data Table Component

**Decision**: Use @tanstack/react-table via shadcn/ui
**Rationale**:
- Industry standard for React tables
- Built-in sorting, filtering, pagination
- Headless - full styling control

**Installation**:
```bash
npx shadcn@latest add table
npm install @tanstack/react-table
```

**Features Needed**:
- Server-side pagination
- Column sorting
- Search/filter
- Row selection (for bulk actions)

**Alternatives Considered**:
- AG Grid: Overkill, heavy bundle
- Custom implementation: Too much work
- MUI DataGrid: Different design system

### 5. Audit Logging Pattern

**Decision**: Dedicated AdminAction model with polymorphic references
**Rationale**:
- Clear audit trail for compliance
- Queryable for admin activity reports
- Extensible for future action types

**Model Design**:
```typescript
// app/models/admin_action.ts
export default class AdminAction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare adminId: string // Who performed action

  @column()
  declare action: 'user_deactivate' | 'user_activate' | 'proposal_unpublish' | 'proposal_delete'

  @column()
  declare targetType: 'user' | 'proposal' | 'lead'

  @column()
  declare targetId: string

  @column()
  declare metadata: Record<string, any> // Additional context

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
```

**Service Pattern**:
```typescript
// app/services/admin_audit_service.ts
class AdminAuditService {
  async log(adminId: string, action: string, target: Model, metadata?: object) {
    await AdminAction.create({
      adminId,
      action,
      targetType: target.constructor.name.toLowerCase(),
      targetId: target.id,
      metadata: metadata || {}
    })
  }
}
```

**Alternatives Considered**:
- Application logs only: Not queryable
- Event sourcing: Overkill for MVP
- Third-party audit service: Unnecessary dependency

### 6. Revenue Metrics from Stripe

**Decision**: Store subscription events locally, query for dashboard
**Rationale**:
- Stripe API rate limits prevent real-time dashboard queries
- Local storage enables historical analysis
- Webhook-based updates ensure data freshness

**Implementation Approach**:
1. Create `subscription_events` table
2. Configure Stripe webhooks for subscription lifecycle
3. Calculate MRR/ARR from local data

**Note**: Full Stripe integration deferred to separate feature. For MVP, revenue section will show placeholder data or manual entry.

**Alternatives Considered**:
- Direct Stripe API calls: Rate limits, latency
- Stripe Billing Portal embed: Limited customization
- Baremetrics integration: Additional cost

### 7. Period Selector Implementation

**Decision**: Query parameter-based period selection
**Rationale**:
- Shareable URLs with period context
- Server-side filtering for performance
- Simple implementation

**Implementation**:
```typescript
// Route: /admin/dashboard?period=7d
const period = request.input('period', '7d') // Default 7 days
const startDate = getPeriodStart(period) // 7d, 30d, 90d

const metrics = await metricsService.getForPeriod(startDate)
```

**UI Component**:
```tsx
<Select value={period} onValueChange={setPeriod}>
  <SelectItem value="7d">Last 7 days</SelectItem>
  <SelectItem value="30d">Last 30 days</SelectItem>
  <SelectItem value="90d">Last 90 days</SelectItem>
</Select>
```

### 8. Threshold Indicators

**Decision**: Component-based with threshold config
**Rationale**:
- Reusable across all metrics
- Configurable thresholds from KPI spec
- Visual consistency

**Implementation**:
```tsx
// inertia/components/admin/threshold-indicator.tsx
const thresholds = {
  activationRate: { green: 35, yellow: 20 },
  week1Retention: { green: 45, yellow: 30 },
  nps: { green: 30, yellow: 10 },
  monthlyChurn: { green: 5, yellow: 10, inverted: true }
}

function ThresholdIndicator({ metric, value }: Props) {
  const config = thresholds[metric]
  const status = getStatus(value, config)
  return <Badge variant={status}>{value}</Badge>
}
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend Framework | AdonisJS 6 | API, auth, ORM |
| Frontend Framework | React 18 + Inertia.js | SPA-like experience |
| UI Components | shadcn/ui | Consistent styling |
| Charts | Recharts (via shadcn/ui) | Data visualization |
| Tables | @tanstack/react-table | Data tables |
| Database | PostgreSQL (Neon) | Data storage |
| Caching | AdonisJS Cache | Metrics caching |
| Auth | AdonisJS Auth (sessions) | Admin authentication |

## Next Steps

1. Create data model (data-model.md)
2. Define API contracts (contracts/)
3. Create quickstart guide (quickstart.md)
4. Generate implementation tasks (/speckit.tasks)

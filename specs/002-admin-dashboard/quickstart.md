# Quickstart: Admin Dashboard

**Feature Branch**: `002-admin-dashboard`
**Date**: 2025-11-26

## Time-Box Constraints

| Phase                  | Target Duration | Deadline Action                         |
| ---------------------- | --------------- | --------------------------------------- |
| Phase 1: Setup         | 2 hours         | Skip optional shadcn components         |
| Phase 2: Foundation    | 4 hours         | Use simplified models, defer validators |
| Phase 3: MVP Dashboard | 6 hours         | Ship with placeholder data, no charts   |
| **Total MVP**          | **12 hours**    | Cut scope, not quality                  |

**If behind schedule**:

- Skip period selector (hardcode 30 days)
- Use placeholder data for all metrics except user/proposal counts
- Defer charts to v1.1
- Ship basic layout without polish

## Prerequisites

- Node.js 20 LTS
- pnpm installed
- PostgreSQL (Neon) connection configured
- Existing Spons Easy codebase on `dev` branch

## Quick Setup

### 1. Switch to Feature Branch

```bash
cd /Users/leobrival/Developer/sass/spons-easy
git checkout 002-admin-dashboard
```

### 2. Install New Dependencies

```bash
# Install shadcn/ui components
npx shadcn@latest add chart table badge tabs select avatar skeleton alert separator sheet dropdown-menu

# If recharts not installed
pnpm add recharts

# If @tanstack/react-table not installed
pnpm add @tanstack/react-table
```

### 3. Run Migrations

```bash
# Create new migrations
node ace make:migration add_admin_fields_to_users
node ace make:migration create_admin_actions
node ace make:migration create_daily_metrics

# Run migrations
node ace migration:run
```

### 4. Create First Admin User

```bash
# Via Ace command (create this first)
node ace make:command create_admin

# Then run
node ace create:admin --email=admin@sponseasy.com --password=secure123
```

Or directly in database:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 5. Start Development

```bash
pnpm dev
```

Access admin dashboard at: `http://localhost:3333/admin/dashboard`

## File Structure to Create

### Backend Files

```
app/
├── controllers/admin/
│   ├── dashboard_controller.ts
│   ├── users_controller.ts
│   ├── proposals_controller.ts
│   ├── revenue_controller.ts
│   ├── growth_controller.ts
│   └── api_controller.ts
├── middleware/
│   └── admin_middleware.ts
├── models/
│   ├── admin_action.ts
│   └── daily_metric.ts
├── services/
│   ├── metrics_service.ts
│   ├── admin_audit_service.ts
│   └── analytics_service.ts
└── validators/
    └── admin_validator.ts

database/migrations/
├── XXXX_add_admin_fields_to_users.ts
├── XXXX_create_admin_actions.ts
└── XXXX_create_daily_metrics.ts
```

### Frontend Files

```
inertia/
├── components/admin/
│   ├── admin-layout.tsx
│   ├── admin-sidebar.tsx
│   ├── metrics-card.tsx
│   ├── threshold-indicator.tsx
│   ├── area-chart.tsx
│   ├── data-table.tsx
│   ├── period-selector.tsx
│   └── confirm-dialog.tsx
├── pages/admin/
│   ├── dashboard.tsx
│   ├── users/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── proposals/
│   │   ├── index.tsx
│   │   └── [id].tsx
│   ├── revenue.tsx
│   └── growth.tsx
└── types/
    └── admin.ts
```

## Development Order

### Phase 1: Foundation

1. Create admin middleware
2. Add role field to User model
3. Create AdminAction model
4. Create basic admin layout

### Phase 2: Dashboard

1. Create metrics service
2. Build dashboard controller
3. Create metrics cards components
4. Add area charts

### Phase 3: User Management

1. Build users controller
2. Create users list page
3. Create user detail page
4. Add deactivate/activate actions

### Phase 4: Proposal Monitoring

1. Build proposals controller
2. Create proposals list page
3. Create proposal detail page
4. Add unpublish action

### Phase 5: Analytics

1. Build revenue controller
2. Build growth controller
3. Create analytics pages
4. Add funnel visualization

## Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run admin-specific tests
pnpm test -- --files="tests/functional/admin/**"

# Run with coverage
pnpm test:coverage
```

### Manual Testing Checklist

- [ ] Admin login works
- [ ] Non-admin users are blocked
- [ ] Dashboard metrics display correctly
- [ ] User list pagination works
- [ ] User search works
- [ ] User deactivation works (not own account)
- [ ] Proposal list filtering works
- [ ] Proposal unpublish works
- [ ] Charts render correctly
- [ ] Period selector updates data
- [ ] Audit log records actions

## Environment Variables

No new environment variables required for MVP.

Future (for Stripe integration):

```env
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Troubleshooting

### "Admin access required" error

- Verify user has `role = 'admin'` in database
- Clear session and re-login

### Charts not rendering

- Verify recharts is installed
- Check browser console for errors
- Ensure data format matches ChartDataPoint interface

### Metrics showing 0

- Verify migrations have run
- Check database has data
- Verify date ranges in queries

### Slow dashboard load

- Check if caching is working
- Verify indexes are created
- Consider pre-computing daily metrics

## Related Documentation

- [Spec](./spec.md) - Feature requirements
- [Plan](./plan.md) - Implementation plan
- [Data Model](./data-model.md) - Database schema
- [API Routes](./contracts/api-routes.md) - Backend endpoints
- [Inertia Pages](./contracts/inertia-pages.md) - Frontend components
- [KPI Dashboard](.ideabrowser/kpi-dashboard.md) - Metrics definitions

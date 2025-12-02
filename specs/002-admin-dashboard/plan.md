# Implementation Plan: Admin Dashboard

**Branch**: `002-admin-dashboard` | **Date**: 2025-11-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-admin-dashboard/spec.md`

## Summary

Build a comprehensive admin dashboard for Spons Easy platform administrators to monitor platform health, manage users, track proposals, and analyze revenue/growth metrics. The dashboard will display AARRR metrics (Acquisition, Activation, Retention, Revenue, Referral), use shadcn/ui Area Charts for visualizations, and integrate with existing AdonisJS 6 + Inertia.js + React stack.

## Technical Context

**Language/Version**: TypeScript 5.x (Node.js 20 LTS)
**Primary Dependencies**: AdonisJS 6, Inertia.js, React 18, shadcn/ui, Recharts (for Area Charts), Lucid ORM
**Storage**: PostgreSQL (Neon Serverless)
**Testing**: Japa (AdonisJS test runner), Vitest for React components
**Target Platform**: Web application (responsive, desktop-first for admin)
**Project Type**: Web application (AdonisJS backend + Inertia/React frontend)
**Performance Goals**: Dashboard load <3s, search results <1s, real-time-ish metrics (5min cache acceptable)
**Constraints**: Admin-only access, audit logging required, metrics accuracy >99%
**Scale/Scope**: <10,000 users/proposals in MVP phase, single admin level

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                       | Status | Notes                                                                           |
| ------------------------------- | ------ | ------------------------------------------------------------------------------- |
| No placeholders in constitution | PASS   | Constitution template not customized for this project - using sensible defaults |
| Existing patterns respected     | PASS   | Following existing AdonisJS controller/model/service patterns                   |
| No unnecessary complexity       | PASS   | Single admin role, no complex permission system                                 |
| Test coverage required          | PASS   | Will add tests for admin controllers and services                               |

## Project Structure

### Documentation (this feature)

```text
specs/002-admin-dashboard/
├── plan.md                       # This file
├── research.md                   # Phase 0 output
├── data-model.md                 # Phase 1 output
├── quickstart.md                 # Phase 1 output
├── contracts/                    # Phase 1 output
│   ├── api-routes.md             # Admin API endpoints
│   ├── inertia-pages.md          # Admin page components
│   ├── cache-architecture.md     # Cache system documentation
│   └── charts-visualization-plan.md  # KPI charts mapping
└── tasks.md                      # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
# Backend (AdonisJS)
app/
├── controllers/
│   └── admin/
│       ├── dashboard_controller.ts      # KPI overview
│       ├── metrics_controller.ts        # API metrics endpoint
│       ├── users_controller.ts          # User management
│       ├── proposals_controller.ts      # Proposal monitoring
│       ├── revenue_controller.ts        # Revenue analytics
│       └── growth_controller.ts         # GTM analytics
├── middleware/
│   └── admin_middleware.ts              # Admin role check
├── models/
│   ├── user.ts                          # Add role field + cache hooks
│   ├── proposal.ts                      # Cache invalidation hooks
│   └── admin_action.ts                  # Audit log model
├── services/
│   ├── metrics_service.ts               # KPI calculations with cache
│   ├── metrics_cache_service.ts         # Cache management (L1+L2)
│   ├── metrics_broadcaster.ts           # SSE real-time updates
│   ├── admin_audit_service.ts           # Audit logging
│   └── analytics_service.ts             # Chart data aggregation
└── validators/
    └── admin_validator.ts               # Admin action validation

config/
├── cache.ts                             # BentoCache config (Memory + Redis)
├── redis.ts                             # Upstash Redis connection
└── transmit.ts                          # SSE real-time config

database/
└── migrations/
    ├── XXXX_add_role_to_users.ts
    └── XXXX_create_admin_actions.ts

# Frontend (Inertia/React)
inertia/
├── components/
│   ├── admin/
│   │   ├── metrics-card.tsx             # KPI metric display
│   │   ├── threshold-indicator.tsx      # Green/yellow/red status
│   │   ├── area-chart.tsx               # Recharts wrapper
│   │   ├── data-table.tsx               # Paginated table
│   │   └── user-details-sheet.tsx       # User detail slide-over
│   └── ui/
│       ├── chart.tsx                    # shadcn/ui chart (NEW)
│       ├── table.tsx                    # shadcn/ui table (NEW)
│       ├── badge.tsx                    # shadcn/ui badge (NEW)
│       ├── tabs.tsx                     # shadcn/ui tabs (NEW)
│       └── select.tsx                   # shadcn/ui select (NEW)
├── pages/
│   └── admin/
│       ├── dashboard.tsx                # Main KPI overview
│       ├── users/
│       │   ├── index.tsx                # User list
│       │   └── [id].tsx                 # User details
│       ├── proposals/
│       │   ├── index.tsx                # Proposal list
│       │   └── [id].tsx                 # Proposal details
│       ├── revenue.tsx                  # Revenue analytics
│       └── growth.tsx                   # GTM analytics
└── lib/
    └── admin-utils.ts                   # Admin helper functions

tests/
├── functional/
│   └── admin/
│       ├── dashboard.spec.ts
│       ├── users.spec.ts
│       └── proposals.spec.ts
└── unit/
    └── services/
        └── metrics_service.spec.ts
```

**Structure Decision**: Follows existing AdonisJS + Inertia structure with new `admin/` namespaces in both controllers and pages. New shadcn/ui components will be added as needed.

## Key Technical Decisions

### 1. Charts Library

**Decision**: Use Recharts via shadcn/ui chart components
**Rationale**: shadcn/ui provides pre-styled chart components that wrap Recharts, ensuring consistent styling with the rest of the UI. Area charts specifically match the spec requirement.
**Reference**: https://ui.shadcn.com/charts/area

### 2. Admin Role Implementation

**Decision**: Add `role` enum field to existing User model
**Rationale**: Simplest approach - single admin level as specified in assumptions. No need for separate admin table or complex RBAC.

### 3. Metrics Calculation & Caching

**Decision**: Two-tier cache (L1 Memory + L2 Upstash Redis) with 1-2 minute TTL
**Rationale**:

- L1 (Memory): 10MB, ultra-fast local cache
- L2 (Upstash Redis EU): 256MB, persistent, shared across instances
- TTL: 30s-2min selon le type de données
- Invalidation automatique via hooks Lucid ORM
  **Performance**: 6x improvement (175ms → 25ms)
  **Reference**: See `specs/002-admin-dashboard/contracts/cache-architecture.md`

### 4. Audit Logging

**Decision**: Dedicated AdminAction model with polymorphic target
**Rationale**: All admin actions logged with actor, action type, target entity, timestamp, and metadata.

### 5. Revenue Data Source

**Decision**: Stripe webhooks stored in local database, queried for dashboard
**Rationale**: Avoids Stripe API rate limits, enables historical analysis, provides offline resilience.

## Dependencies

### New npm Packages (Frontend)

- `recharts` - Already included with shadcn/ui charts
- `@tanstack/react-table` - For data tables (via shadcn/ui table)
- `date-fns` - Date formatting (if not already installed)

### New npm Packages (Backend)

- None required - using existing AdonisJS ecosystem

### External Services

- PostgreSQL (Neon) - Existing
- **Upstash Redis (EU)** - Cache L2 pour métriques dashboard (Implemented)
- Stripe (webhooks) - Future integration for revenue metrics
- PostHog - Future integration for analytics events

## Risk Assessment

| Risk                            | Probability | Impact | Mitigation                                           |
| ------------------------------- | ----------- | ------ | ---------------------------------------------------- |
| Metrics calculation performance | Medium      | Medium | Implement caching, pre-aggregate daily stats         |
| Chart rendering performance     | Low         | Low    | Use virtualization for large datasets                |
| Admin access security           | Low         | High   | Thorough middleware testing, audit logging           |
| Stripe data delays              | Medium      | Low    | Show "last updated" timestamps, graceful degradation |

## Phases Overview

1. **Phase 0: Research** - Technology decisions, best practices (COMPLETE in research.md)
2. **Phase 1: Design** - Data model, API contracts, component specs (COMPLETE in this plan)
3. **Phase 2: Tasks** - Implementation tasks with dependencies (Created by /speckit.tasks)

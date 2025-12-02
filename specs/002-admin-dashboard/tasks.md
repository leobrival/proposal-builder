# Tasks: Admin Dashboard

**Input**: Design documents from `/specs/002-admin-dashboard/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in this feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `app/` (AdonisJS controllers, models, services, middleware)
- **Frontend**: `inertia/` (React pages and components)
- **Database**: `database/migrations/`
- **Tests**: `tests/functional/`, `tests/unit/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create project structure for admin dashboard

- [ ] T001 Install shadcn/ui chart component: `npx shadcn@latest add chart`
- [ ] T002 [P] Install shadcn/ui table component: `npx shadcn@latest add table`
- [ ] T003 [P] Install shadcn/ui badge component: `npx shadcn@latest add badge`
- [ ] T004 [P] Install shadcn/ui tabs component: `npx shadcn@latest add tabs`
- [ ] T005 [P] Install shadcn/ui select component: `npx shadcn@latest add select`
- [ ] T006 [P] Install shadcn/ui avatar component: `npx shadcn@latest add avatar`
- [ ] T007 [P] Install shadcn/ui skeleton component: `npx shadcn@latest add skeleton`
- [ ] T008 [P] Install shadcn/ui sheet component: `npx shadcn@latest add sheet`
- [ ] T009 [P] Install shadcn/ui dropdown-menu component: `npx shadcn@latest add dropdown-menu`
- [ ] T010 [P] Install shadcn/ui separator component: `npx shadcn@latest add separator`
- [ ] T011 [P] Install shadcn/ui alert component: `npx shadcn@latest add alert`
- [ ] T012 Install @tanstack/react-table: `pnpm add @tanstack/react-table`
- [ ] T013 Create admin controllers directory: `app/controllers/admin/`
- [ ] T014 [P] Create admin components directory: `inertia/components/admin/`
- [ ] T015 [P] Create admin pages directory: `inertia/pages/admin/`
- [ ] T016 [P] Create admin types file: `inertia/types/admin.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database migrations, models, and middleware that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Migrations

- [ ] T017 Create migration to add admin fields to users table in `database/migrations/XXXX_add_admin_fields_to_users.ts` (add role enum, is_active boolean, last_login_at timestamp)
- [ ] T018 Create migration for admin_actions table in `database/migrations/XXXX_create_admin_actions.ts` (audit log)
- [ ] T019 Create migration for daily_metrics table in `database/migrations/XXXX_create_daily_metrics.ts` (metrics cache)
- [ ] T020 Run migrations: `node ace migration:run`

### Models

- [ ] T021 Update User model to add role, isActive, lastLoginAt fields in `app/models/user.ts`
- [ ] T022 [P] Create AdminAction model for audit logging in `app/models/admin_action.ts`
- [ ] T023 [P] Create DailyMetric model for metrics caching in `app/models/daily_metric.ts`

### Middleware & Auth

- [ ] T024 Create AdminMiddleware to check admin role in `app/middleware/admin_middleware.ts`
- [ ] T025 Register AdminMiddleware in kernel as named middleware in `start/kernel.ts`

### Services

- [ ] T026 Create AdminAuditService for logging admin actions in `app/services/admin_audit_service.ts`

### Routes Setup

- [ ] T027 Add admin route group with middleware in `start/routes.ts` (prefix /admin, middleware auth + admin)

### Frontend Foundation

- [ ] T028 Create AdminLayout component with sidebar navigation in `inertia/components/admin/admin-layout.tsx`
- [ ] T029 [P] Create AdminSidebar component with nav links in `inertia/components/admin/admin-sidebar.tsx`
- [ ] T030 [P] Create PeriodSelector component for date range selection in `inertia/components/admin/period-selector.tsx`
- [ ] T031 [P] Create ThresholdIndicator component for status badges in `inertia/components/admin/threshold-indicator.tsx`
- [ ] T032 [P] Create MetricsCard component for KPI display in `inertia/components/admin/metrics-card.tsx`
- [ ] T033 [P] Create AreaChartWrapper component using shadcn/ui charts in `inertia/components/admin/area-chart.tsx`
- [ ] T034 [P] Create DataTable component with pagination/sorting in `inertia/components/admin/data-table.tsx`
- [ ] T035 [P] Create ConfirmDialog component for destructive actions in `inertia/components/admin/confirm-dialog.tsx`
- [ ] T036 Define TypeScript types for admin pages in `inertia/types/admin.ts` (MetricData, AdminUser, AdminProposal, etc.)

### Create First Admin User

- [ ] T037 Create Ace command to create admin user in `commands/create_admin.ts`
- [ ] T038 Run command to create admin user: `node ace create:admin`

### Seed Data for Development

- [ ] T039-SEED Create database seeder with sample data in `database/seeders/admin_dashboard_seeder.ts`
  - 50 sample users (mix of free/pro tiers)
  - 100 sample proposals (mix of draft/published/archived)
  - 200 sample leads distributed across proposals
  - 30 days of DailyMetric entries
- [ ] T040-SEED Run seeder: `node ace db:seed --files=admin_dashboard_seeder`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Platform Overview with KPI Metrics (Priority: P1) 🎯 MVP

**Goal**: Display comprehensive KPI dashboard with North Star metric, AARRR metrics, Area Charts, and threshold indicators

**Independent Test**: Access /admin/dashboard as admin user, verify all metrics display with correct values and charts render properly

### Backend Implementation

- [ ] T041 Create MetricsService with methods for calculating all KPI metrics in `app/services/metrics_service.ts`
- [ ] T042 [US1] Implement getOverviewMetrics() in MetricsService for dashboard summary
- [ ] T043 [US1] Implement getNorthStarMetric() in MetricsService (Proposals Published with trend)
- [ ] T044 [US1] Implement getAcquisitionMetrics() in MetricsService (totalUsers, newUsers, registrationRate)
- [ ] T045 [US1] Implement getActivationMetrics() in MetricsService (activationRate, timeToFirstProposal)
- [ ] T046 [US1] Implement getRetentionMetrics() in MetricsService (week1Retention, dauMau, churn)
- [ ] T047 [US1] Implement getRevenueMetrics() in MetricsService (mrr, arpu, freeToPaid, ltvCac - placeholder data for MVP)
- [ ] T048 [US1] Implement getReferralMetrics() in MetricsService (nps, kFactor - placeholder data for MVP)
- [ ] T049 [US1] Implement getTrendData() in MetricsService for chart time series data
- [ ] T050 [US1] Implement caching for expensive metric calculations (5-minute TTL)
- [ ] T051 [US1] Create AdminDashboardController in `app/controllers/admin/dashboard_controller.ts`
- [ ] T052 [US1] Implement index() action in AdminDashboardController with all metrics props
- [ ] T053 [US1] Add dashboard route: GET /admin/dashboard in `start/routes.ts`

### Frontend Implementation

- [ ] T054 [US1] Create NorthStarCard component for prominent North Star display in `inertia/components/admin/north-star-card.tsx`
- [ ] T055 [P] [US1] Create AARRRMetricsGrid component for 5 metric cards in `inertia/components/admin/aarrr-metrics-grid.tsx`
- [ ] T056 [P] [US1] Create RecentActivitySection component for latest users/proposals in `inertia/components/admin/recent-activity-section.tsx`
- [ ] T057 [US1] Create admin dashboard page in `inertia/pages/admin/dashboard.tsx`
- [ ] T058 [US1] Integrate all dashboard components in dashboard page with period selector

**Checkpoint**: Admin dashboard displays all KPI metrics with charts - User Story 1 complete

---

## Phase 4: User Story 2 - Manage Users (Priority: P2)

**Goal**: List, search, filter users and view/manage user details including deactivation

**Independent Test**: Access /admin/users, search for a user, view their details, deactivate and reactivate an account

### Backend Implementation

- [ ] T057 [US2] Create AdminUsersController in `app/controllers/admin/users_controller.ts`
- [ ] T058 [US2] Implement index() action with pagination, search, filter, sort in AdminUsersController
- [ ] T059 [US2] Implement show() action with user details, proposals, leads, activity in AdminUsersController
- [ ] T060 [US2] Implement deactivate() action with audit logging in AdminUsersController
- [ ] T061 [US2] Implement activate() action with audit logging in AdminUsersController
- [ ] T062 [US2] Add validation to prevent self-deactivation in deactivate() action
- [ ] T063 [US2] Add users routes in `start/routes.ts`: GET /admin/users, GET /admin/users/:id, POST /admin/users/:id/deactivate, POST /admin/users/:id/activate

### Frontend Implementation

- [ ] T064 [P] [US2] Create UserRow component for table display in `inertia/components/admin/user-row.tsx`
- [ ] T065 [P] [US2] Create UserFilters component for search/filter bar in `inertia/components/admin/user-filters.tsx`
- [ ] T066 [P] [US2] Create UserInfoCard component for user details in `inertia/components/admin/user-info-card.tsx`
- [ ] T067 [P] [US2] Create UserStatsTabs component for proposals/leads/activity tabs in `inertia/components/admin/user-stats-tabs.tsx`
- [ ] T068 [US2] Create users list page in `inertia/pages/admin/users/index.tsx`
- [ ] T069 [US2] Create user detail page in `inertia/pages/admin/users/[id].tsx`
- [ ] T070 [US2] Implement deactivate/activate buttons with ConfirmDialog in user detail page
- [ ] T071 [US2] Add user count and status badges to users list

**Checkpoint**: User management fully functional - User Story 2 complete

---

## Phase 5: User Story 3 - Monitor Proposals (Priority: P3)

**Goal**: List, search, filter proposals and view details with ability to force-unpublish

**Independent Test**: Access /admin/proposals, filter by status, view a proposal's details and leads, force-unpublish a proposal

### Backend Implementation

- [ ] T072 [US3] Create AdminProposalsController in `app/controllers/admin/proposals_controller.ts`
- [ ] T073 [US3] Implement index() action with pagination, search, filter, sort in AdminProposalsController
- [ ] T074 [US3] Implement show() action with proposal details, tiers, leads, view stats in AdminProposalsController
- [ ] T075 [US3] Implement unpublish() action with audit logging and owner notification flag in AdminProposalsController
- [ ] T076 [US3] Add proposals routes in `start/routes.ts`: GET /admin/proposals, GET /admin/proposals/:id, POST /admin/proposals/:id/unpublish

### Frontend Implementation

- [ ] T077 [P] [US3] Create ProposalStatsCards component for status breakdown in `inertia/components/admin/proposal-stats-cards.tsx`
- [ ] T078 [P] [US3] Create ProposalRow component for table display in `inertia/components/admin/proposal-row.tsx`
- [ ] T079 [P] [US3] Create ProposalFilters component for search/filter bar in `inertia/components/admin/proposal-filters.tsx`
- [ ] T080 [P] [US3] Create ProposalInfoCard component for proposal details in `inertia/components/admin/proposal-info-card.tsx`
- [ ] T081 [P] [US3] Create ProposalContentTabs component for tiers/leads/preview tabs in `inertia/components/admin/proposal-content-tabs.tsx`
- [ ] T082 [US3] Create proposals list page in `inertia/pages/admin/proposals/index.tsx`
- [ ] T083 [US3] Create proposal detail page in `inertia/pages/admin/proposals/[id].tsx`
- [ ] T084 [US3] Implement unpublish button with ConfirmDialog in proposal detail page
- [ ] T085 [US3] Add views chart (AreaChart) to proposal detail page

**Checkpoint**: Proposal monitoring fully functional - User Story 3 complete

---

## Phase 6: User Story 4 - Track Revenue & Subscription Metrics (Priority: P4)

**Goal**: Display MRR, ARR, ARPU, LTV:CAC, subscription breakdown and revenue trends

**Independent Test**: Access /admin/revenue, verify all revenue metrics display (placeholder data acceptable for MVP)

### Backend Implementation

- [ ] T086 [US4] Create AdminRevenueController in `app/controllers/admin/revenue_controller.ts`
- [ ] T087 [US4] Implement index() action with revenue metrics (placeholder data for MVP, Stripe integration future)
- [ ] T088 [US4] Add getMRRBreakdown() to MetricsService (new/expansion/churned)
- [ ] T089 [US4] Add getSubscriptionsByTier() to MetricsService
- [ ] T090 [US4] Add revenue route in `start/routes.ts`: GET /admin/revenue

### Frontend Implementation

- [ ] T091 [P] [US4] Create RevenueOverviewCards component for MRR/ARR/ARPU/LTV:CAC in `inertia/components/admin/revenue-overview-cards.tsx`
- [ ] T092 [P] [US4] Create MRRBreakdownCard component for waterfall display in `inertia/components/admin/mrr-breakdown-card.tsx`
- [ ] T093 [P] [US4] Create SubscriptionsByTierCard component in `inertia/components/admin/subscriptions-by-tier-card.tsx`
- [ ] T094 [US4] Create revenue analytics page in `inertia/pages/admin/revenue.tsx`
- [ ] T095 [US4] Add MRR trend chart using AreaChart to revenue page

**Checkpoint**: Revenue analytics page functional - User Story 4 complete

---

## Phase 7: User Story 5 - View GTM & Growth Analytics (Priority: P5)

**Goal**: Display OKR progress, activation funnel, channel performance, and referral metrics

**Independent Test**: Access /admin/growth, verify OKR cards show progress, funnel visualization renders, channel table displays

### Backend Implementation

- [ ] T096 [US5] Create AdminGrowthController in `app/controllers/admin/growth_controller.ts`
- [ ] T097 [US5] Implement index() action with growth metrics
- [ ] T098 [US5] Add getOKRProgress() to MetricsService (compare current vs targets from spec)
- [ ] T099 [US5] Add getActivationFunnel() to MetricsService (signup → dashboard → create → save → tiers → publish)
- [ ] T100 [US5] Add getChannelPerformance() to MetricsService (placeholder data for MVP)
- [ ] T101 [US5] Add getReferralMetrics() to MetricsService (kFactor, participationRate)
- [ ] T102 [US5] Add growth route in `start/routes.ts`: GET /admin/growth

### Frontend Implementation

- [ ] T103 [P] [US5] Create OKRProgressGrid component for OKR cards in `inertia/components/admin/okr-progress-grid.tsx`
- [ ] T104 [P] [US5] Create ActivationFunnelCard component with funnel visualization in `inertia/components/admin/activation-funnel-card.tsx`
- [ ] T105 [P] [US5] Create ChannelPerformanceCard component with table in `inertia/components/admin/channel-performance-card.tsx`
- [ ] T106 [P] [US5] Create ReferralMetricsCard component in `inertia/components/admin/referral-metrics-card.tsx`
- [ ] T107 [US5] Create growth analytics page in `inertia/pages/admin/growth.tsx`
- [ ] T108 [US5] Add growth trend chart (stacked AreaChart) to growth page

**Checkpoint**: GTM analytics page functional - User Story 5 complete

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: API endpoints for client-side refresh, performance optimization, and final cleanup

### JSON API Endpoints

- [ ] T109 Create AdminApiController in `app/controllers/admin/api_controller.ts`
- [ ] T110 [P] Implement overview() action for dashboard metrics JSON
- [ ] T111 [P] Implement trend() action for chart data JSON
- [ ] T112 [P] Implement funnel() action for funnel data JSON
- [ ] T113 Add API routes in `start/routes.ts`: GET /admin/api/metrics/overview, GET /admin/api/metrics/trend, GET /admin/api/metrics/funnel

### Navigation & UX

- [ ] T114 Add admin navigation link to main app layout (visible only to admins) in `inertia/components/layouts/app-layout.tsx`
- [ ] T115 [P] Add breadcrumb navigation to AdminLayout
- [ ] T116 [P] Add loading skeletons to all admin pages for better UX
- [ ] T117 [P] Add empty states to all list pages (users, proposals)

### Performance

- [ ] T118 Add database indexes for admin queries as specified in data-model.md
- [ ] T119 Verify caching is working for expensive metrics calculations

### Documentation & Cleanup

- [ ] T120 Update CLAUDE.md with admin dashboard routes and patterns
- [ ] T121 Run lint and fix any issues: `pnpm lint:fix`
- [ ] T122 Run typecheck: `pnpm typecheck`
- [ ] T123 Run build: `pnpm build`
- [ ] T124 Manual testing following quickstart.md checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel if multiple developers
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories - **MVP**
- **User Story 2 (P2)**: Can start after Foundational - Independent of other stories
- **User Story 3 (P3)**: Can start after Foundational - Independent of other stories
- **User Story 4 (P4)**: Can start after Foundational - Shares MetricsService with US1
- **User Story 5 (P5)**: Can start after Foundational - Shares MetricsService with US1

### Within Each User Story

- Backend before Frontend
- Controller before Page
- Components before Page integration

### Parallel Opportunities

Within Phase 1 (Setup):

- T002-T011 can all run in parallel (independent shadcn components)
- T013-T016 can all run in parallel (directory/file creation)

Within Phase 2 (Foundational):

- T022-T023 can run in parallel (independent models)
- T028-T036 can run in parallel (independent components)

Within Each User Story:

- All [P] marked tasks can run in parallel within their phase
- Components marked [P] can be built simultaneously

---

## Parallel Example: Phase 2 Foundational Components

```bash
# Launch all foundational components together:
Task: "Create AdminSidebar component in inertia/components/admin/admin-sidebar.tsx"
Task: "Create PeriodSelector component in inertia/components/admin/period-selector.tsx"
Task: "Create ThresholdIndicator component in inertia/components/admin/threshold-indicator.tsx"
Task: "Create MetricsCard component in inertia/components/admin/metrics-card.tsx"
Task: "Create AreaChartWrapper component in inertia/components/admin/area-chart.tsx"
Task: "Create DataTable component in inertia/components/admin/data-table.tsx"
Task: "Create ConfirmDialog component in inertia/components/admin/confirm-dialog.tsx"
```

## Parallel Example: User Story 2 Components

```bash
# Launch all US2 components together:
Task: "Create UserRow component in inertia/components/admin/user-row.tsx"
Task: "Create UserFilters component in inertia/components/admin/user-filters.tsx"
Task: "Create UserInfoCard component in inertia/components/admin/user-info-card.tsx"
Task: "Create UserStatsTabs component in inertia/components/admin/user-stats-tabs.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (16 tasks)
2. Complete Phase 2: Foundational (22 tasks)
3. Complete Phase 3: User Story 1 (18 tasks)
4. **STOP and VALIDATE**: Test dashboard independently
5. Deploy/demo if ready - **MVP Complete!**

### Incremental Delivery

1. Setup + Foundational → Foundation ready (38 tasks)
2. Add User Story 1 → Test → Deploy (MVP: 56 tasks total)
3. Add User Story 2 → Test → Deploy (User management: 71 tasks)
4. Add User Story 3 → Test → Deploy (Proposal monitoring: 85 tasks)
5. Add User Story 4 → Test → Deploy (Revenue analytics: 95 tasks)
6. Add User Story 5 → Test → Deploy (GTM analytics: 108 tasks)
7. Add Polish → Test → Deploy (Complete: 124 tasks)

### Suggested MVP Scope (REDUCED)

**Minimum Viable Admin Dashboard** (Target: ~32 tasks):

- Phase 1: Setup - Essential only (8 tasks: chart, table + directories)
- Phase 2: Foundational - Core only (14 tasks: migrations, models, middleware, basic layout)
- Phase 3: User Story 1 - Simplified (10 tasks: basic metrics, no caching in v1)
- **Total MVP: ~32 tasks**

This delivers a functional admin dashboard with:

- North Star metric (Proposals Published)
- Basic user/proposal counts
- Simple metrics cards
- Recent activity list

**MVP Exclusions** (defer to post-MVP):

- Period selector (default to 30 days)
- Complex trend charts (add in v1.1)
- Caching layer (add when performance needed)
- Revenue/Referral real data (placeholder only)
- Full AARRR breakdown (simplified to 3 cards: Users, Proposals, Activation Rate)

---

## Summary

| Phase             | User Story                  | Tasks   | Parallel Tasks |
| ----------------- | --------------------------- | ------- | -------------- |
| 1                 | Setup                       | 16      | 12             |
| 2                 | Foundational                | 24      | 12             |
| 3                 | US1: KPI Dashboard (P1)     | 18      | 4              |
| 4                 | US2: Manage Users (P2)      | 15      | 5              |
| 5                 | US3: Monitor Proposals (P3) | 14      | 6              |
| 6                 | US4: Revenue Analytics (P4) | 10      | 4              |
| 7                 | US5: GTM Analytics (P5)     | 13      | 5              |
| 8                 | Polish                      | 16      | 6              |
| **Total**         |                             | **126** | **54**         |
| **MVP (Reduced)** |                             | **~32** | -              |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Revenue metrics (US4) use placeholder data until Stripe integration
- Referral/NPS metrics (US5) use placeholder data until PostHog integration
- **MVP Focus**: Ship basic dashboard fast, iterate based on real usage

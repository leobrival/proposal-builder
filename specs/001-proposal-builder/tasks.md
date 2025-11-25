# Tasks: Sponseasy - Sponsorship Proposal Builder

**Input**: Design documents from `/specs/001-proposal-builder/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested - test tasks are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `app/` (AdonisJS controllers, models, services)
- **Frontend**: `inertia/` (React pages, components)
- **Config**: `config/`, `start/`
- **Database**: `database/migrations/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization with AdonisJS + Inertia + React

- [ ] T001 Create AdonisJS project with Inertia starter kit: `npm init adonisjs@latest spons-easy -- -K=inertia --adapter=react`
- [ ] T002 Configure PostgreSQL driver and Lucid ORM: `node ace configure @adonisjs/lucid --db=postgres`
- [ ] T003 [P] Setup Neon database branches (main + dev/staging) and configure DATABASE_URL in .env
- [ ] T004 [P] Initialize Shadcn/ui: `pnpm dlx shadcn@latest init`
- [ ] T005 [P] Install Shadcn components: button, input, form, dialog, table, card, tabs, toast, textarea, select, sheet, label
- [ ] T006 [P] Install form dependencies: zod, @hookform/resolvers, @tanstack/react-table
- [ ] T007 [P] Configure Biome for linting in biome.json
- [ ] T008 Update inertia/tsconfig.json with path aliases (@/_, ~/components/_)
- [ ] T009 Exclude inertia/\*_/_ from root tsconfig.json for HMR

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Database Migrations

- [ ] T010 Create users table migration in database/migrations/001_create_users_table.ts
- [ ] T011 [P] Create proposals table migration in database/migrations/002_create_proposals_table.ts
- [ ] T012 [P] Create tiers table migration in database/migrations/003_create_tiers_table.ts
- [ ] T013 [P] Create benefits table migration in database/migrations/004_create_benefits_table.ts
- [ ] T014 [P] Create leads table migration in database/migrations/005_create_leads_table.ts
- [ ] T015 Run migrations: `node ace migration:run`

### Models

- [ ] T016 [P] Create User model with AuthFinder mixin in app/models/user.ts
- [ ] T017 [P] Create Proposal model with relationships in app/models/proposal.ts
- [ ] T018 [P] Create Tier model with relationships in app/models/tier.ts
- [ ] T019 [P] Create Benefit model in app/models/benefit.ts
- [ ] T020 [P] Create Lead model with relationships in app/models/lead.ts

### Authentication Setup

- [ ] T021 Configure session auth guard in config/auth.ts
- [ ] T022 Configure session driver in config/session.ts
- [ ] T023 Enable XSRF cookie in config/shield.ts (enableXsrfCookie: true)
- [ ] T024 [P] Create auth validators in app/validators/auth_validator.ts
- [ ] T025 [P] Create LoginController in app/controllers/auth/login_controller.ts
- [ ] T026 [P] Create RegisterController in app/controllers/auth/register_controller.ts
- [ ] T027 [P] Create LogoutController in app/controllers/auth/logout_controller.ts

### Inertia Configuration

- [ ] T028 Configure shared data (user, flash, errors) in config/inertia.ts
- [ ] T029 [P] Create TypeScript types in inertia/types/index.ts
- [ ] T030 [P] Update inertia_layout.edge with proper meta tags in resources/views/inertia_layout.edge
- [ ] T031 [P] Add reference directives in inertia/app/app.tsx

### Layouts

- [ ] T032 [P] Create AppLayout component in inertia/components/layout/app-layout.tsx
- [ ] T033 [P] Create GuestLayout component in inertia/components/layout/guest-layout.tsx
- [ ] T034 [P] Create PublicLayout component in inertia/components/layout/public-layout.tsx

### Auth Pages

- [ ] T035 [P] Create login page in inertia/pages/auth/login.tsx
- [ ] T036 [P] Create register page in inertia/pages/auth/register.tsx

### Routes (Auth)

- [ ] T037 Define auth routes (login, register, logout) in start/routes.ts

### Error Pages

- [ ] T038 [P] Create not-found page in inertia/pages/errors/not-found.tsx
- [ ] T039 [P] Create server-error page in inertia/pages/errors/server-error.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create Sponsorship Proposal (Priority: P1) MVP

**Goal**: Users can create proposals with live builder interface (split-screen form + preview)

**Independent Test**: Create a complete proposal from start to finish with real-time preview updates

### Validators

- [ ] T040 [P] [US1] Create proposal validator in app/validators/proposal_validator.ts
- [ ] T041 [P] [US1] Create tier validator in app/validators/tier_validator.ts
- [ ] T042 [P] [US1] Create benefit validator in app/validators/benefit_validator.ts

### Controllers

- [ ] T043 [US1] Create ProposalsController with CRUD actions in app/controllers/proposals_controller.ts
- [ ] T044 [P] [US1] Create TiersController in app/controllers/tiers_controller.ts
- [ ] T045 [P] [US1] Create BenefitsController in app/controllers/benefits_controller.ts
- [ ] T046 [P] [US1] Create UploadsController for image handling in app/controllers/uploads_controller.ts

### File Upload Service

- [ ] T047 [US1] Configure Drive for local storage in config/drive.ts
- [ ] T048 [US1] Implement image upload and compression in UploadsController

### Frontend Components (Proposal Builder)

- [ ] T049 [P] [US1] Create proposal-form component in inertia/components/proposals/proposal-form.tsx
- [ ] T050 [P] [US1] Create proposal-preview component in inertia/components/proposals/proposal-preview.tsx
- [ ] T051 [P] [US1] Create tier-card component in inertia/components/proposals/tier-card.tsx
- [ ] T052 [P] [US1] Create tier-form component in inertia/components/proposals/tier-form.tsx
- [ ] T053 [P] [US1] Create benefit-list component in inertia/components/proposals/benefit-list.tsx

### Frontend Hooks

- [ ] T054 [US1] Create useAutosave hook in inertia/hooks/use-autosave.ts
- [ ] T055 [US1] Create useProposalPreview hook in inertia/hooks/use-proposal-preview.ts

### Frontend Pages

- [ ] T056 [US1] Create proposals index page in inertia/pages/proposals/index.tsx
- [ ] T057 [US1] Create proposal create page with split-screen in inertia/pages/proposals/create.tsx
- [ ] T058 [US1] Create proposal edit page with split-screen in inertia/pages/proposals/edit.tsx
- [ ] T059 [US1] Create proposal show page in inertia/pages/proposals/show.tsx

### Dashboard (Basic)

- [ ] T060 [P] [US1] Create DashboardController in app/controllers/dashboard_controller.ts
- [ ] T061 [P] [US1] Create stats-card component in inertia/components/dashboard/stats-card.tsx
- [ ] T062 [P] [US1] Create proposal-card component in inertia/components/dashboard/proposal-card.tsx
- [ ] T063 [US1] Create dashboard index page in inertia/pages/dashboard/index.tsx

### Routes (Proposals)

- [ ] T064 [US1] Define proposal CRUD routes in start/routes.ts
- [ ] T065 [US1] Define tier routes (nested under proposals) in start/routes.ts
- [ ] T066 [US1] Define benefit routes (nested under tiers) in start/routes.ts
- [ ] T067 [US1] Define upload routes in start/routes.ts
- [ ] T068 [US1] Define dashboard route in start/routes.ts

### Auto-save Implementation

- [ ] T069 [US1] Implement autosave endpoint in ProposalsController
- [ ] T070 [US1] Integrate useAutosave hook in proposal edit page
- [ ] T070b [US1] Add beforeunload browser prompt when unsaved changes exist in proposal builder
- [ ] T070c [US1] Implement localStorage backup in useAutosave hook for session recovery

**Checkpoint**: User Story 1 complete - Users can create and edit proposals with live preview

---

## Phase 4: User Story 2 - Publish Proposal as Website (Priority: P2)

**Goal**: Users can publish proposals as interactive websites with contact forms

**Independent Test**: Publish a proposal and verify it's accessible at unique URL with working contact form

### Controllers

- [ ] T071 [US2] Create PublicProposalsController in app/controllers/public_proposals_controller.ts
- [ ] T072 [US2] Add publish/unpublish/archive actions to ProposalsController

### Lead Validator

- [ ] T073 [P] [US2] Create lead validator in app/validators/lead_validator.ts

### Email Service

- [ ] T074 [US2] Configure mail provider in config/mail.ts
- [ ] T075 [US2] Create EmailService for lead notifications in app/services/email_service.ts
- [ ] T075b [US2] Implement email retry mechanism (3 attempts with exponential backoff) in EmailService

### Frontend Components

- [ ] T076 [P] [US2] Create contact form component for public page in inertia/components/proposals/contact-form.tsx

### Frontend Pages

- [ ] T077 [US2] Create public proposal page in inertia/pages/public/proposal.tsx

### Routes

- [ ] T078 [US2] Define public proposal routes (/p/:slug) in start/routes.ts
- [ ] T079 [US2] Define contact form submission route in start/routes.ts

### View Counter

- [ ] T080 [US2] Implement view count increment in PublicProposalsController.show

### Edge Cases

- [ ] T080b [US2] Add "update published version" vs "keep as draft" selection in proposal edit workflow
- [ ] T080c [US2] Implement duplicate contact submission detection (5-minute consolidation window) in PublicProposalsController
- [ ] T080d [US2] Create "proposal unavailable" page in inertia/pages/public/unavailable.tsx for deleted/archived proposals

**Checkpoint**: User Story 2 complete - Proposals can be published and receive leads

---

## Phase 5: User Story 3 - Customize Proposal Design (Priority: P3)

**Goal**: Users can customize colors, typography, and layout of their proposals

**Independent Test**: Modify design settings and verify changes appear in preview and published version

### Validators (Zod)

- [ ] T081a [P] [US3] Create design_settings_validator.ts with Zod schema in app/validators/
- [ ] T081b [P] [US3] Create design-settings.ts with Zod frontend schema in inertia/schemas/
- [ ] T081c [US3] Integrate designSettingsSchema validation in proposal_validator.ts (updateSettings)

### Controllers

- [ ] T081 [US3] Add settings and updateSettings actions to ProposalsController

### Frontend Components

- [ ] T082 [P] [US3] Create color-picker component in inertia/components/ui/color-picker.tsx
- [ ] T083 [P] [US3] Create font-selector component in inertia/components/proposals/font-selector.tsx
- [ ] T084 [P] [US3] Create layout-selector component in inertia/components/proposals/layout-selector.tsx

### Frontend Pages

- [ ] T085 [US3] Create proposal settings page in inertia/pages/proposals/settings.tsx

### Design System Integration

- [ ] T086 [US3] Update proposal-preview to apply design settings dynamically
- [ ] T087 [US3] Update public proposal page to render with design settings

### Routes

- [ ] T088 [US3] Define settings routes in start/routes.ts

**Checkpoint**: User Story 3 complete - Design customization fully functional

---

## Phase 6: User Story 4 - Export Proposal as PDF (Priority: P4)

**Goal**: Users can export proposals as professionally formatted PDFs

**Independent Test**: Export a proposal to PDF and verify content integrity and styling

### PDF Service

- [ ] T089 [US4] Install PDF generation dependency (puppeteer or playwright)
- [ ] T089b [US4] Configure Bull queue with Redis for asynchronous PDF generation
- [ ] T089c [US4] Implement PDF job worker with 30s timeout
- [ ] T090 [US4] Create PdfService in app/services/pdf_service.ts
- [ ] T091 [US4] Implement PDF generation with design settings support

### Controllers

- [ ] T092 [US4] Add exportPdf action to ProposalsController

### Frontend

- [ ] T093 [US4] Add "Export PDF" button to proposal show page
- [ ] T094 [US4] Add loading state and download handling for PDF export

### Routes

- [ ] T095 [US4] Define PDF export route in start/routes.ts

**Checkpoint**: User Story 4 complete - PDF export functional

---

## Phase 7: User Story 5 - Manage Leads and View Analytics (Priority: P5)

**Goal**: Users can track views and manage leads with basic CRM

**Independent Test**: View dashboard with analytics and update lead statuses

### Controllers

- [ ] T096 [US5] Create LeadsController in app/controllers/leads_controller.ts
- [ ] T097 [US5] Add leads action to DashboardController for centralized view

### Frontend Components

- [ ] T098 [P] [US5] Create leads-table component in inertia/components/leads/leads-table.tsx
- [ ] T099 [P] [US5] Create lead-status-badge component in inertia/components/leads/lead-status-badge.tsx
- [ ] T100 [P] [US5] Create lead-filters component in inertia/components/leads/lead-filters.tsx

### Frontend Pages

- [ ] T101 [US5] Create dashboard leads page in inertia/pages/dashboard/leads.tsx
- [ ] T102 [US5] Update dashboard index with analytics stats

### Routes

- [ ] T103 [US5] Define lead routes in start/routes.ts
- [ ] T104 [US5] Define dashboard/leads route in start/routes.ts

**Checkpoint**: User Story 5 complete - Full CRM and analytics functionality

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Home Page

- [ ] T105 [P] Create HomeController in app/controllers/home_controller.ts
- [ ] T106 [P] Create home page with marketing content in inertia/pages/home.tsx
- [ ] T107 Define home route in start/routes.ts

### Security & Validation

- [ ] T108 Add authorization checks to all controllers (users can only access own data)
- [ ] T109 Configure @adonisjs/limiter in config/limiter.ts with Redis backend
- [ ] T109a Implement rate limiting for authentication (login: 5/15min, register: 3/1h)
- [ ] T109b Implement rate limiting for API endpoints (read: 100/min, write: 30/min, delete: 10/min)
- [ ] T109c Implement rate limiting for contact form submissions (3/5min per IP+slug)
- [ ] T109d Implement rate limiting for uploads (10/10min) and autosave (60/min)
- [ ] T109e Implement rate limiting for PDF export (5/10min)
- [ ] T110 Add CSRF protection validation

### Session Configuration

- [ ] T110b Configure session expiry to 7 days in config/session.ts (NFR-014)

### Pagination & Filtering

- [ ] T111a [P] Create reusable pagination helper in app/helpers/pagination.ts
- [ ] T111b Implement pagination with filtering and sorting in ProposalsController.index
- [ ] T111c Implement pagination in DashboardController.index
- [ ] T111d Implement pagination with filtering in DashboardController.leads
- [ ] T111e Implement pagination in LeadsController.index

### Performance

- [ ] T111 Add database indexes verification
- [ ] T112 Implement image lazy loading in preview
- [ ] T112b Add browser-image-compression before upload in proposal-form
- [ ] T113 Add response caching headers for public proposals
- [ ] T113b Configure React.lazy for non-critical pages (code splitting)

### Analytics & Tracking (PostHog)

- [ ] T113c [P] Install PostHog: `pnpm add posthog-js`
- [ ] T113d [P] Create PostHog client in inertia/lib/posthog.ts with EU host configuration
- [ ] T113e Configure PostHog initialization in inertia/app/app.tsx
- [ ] T113f Implement user identification on login (posthog.identify)
- [ ] T113g Add critical event tracking: proposal_created, proposal_published, lead_captured, pdf_exported
- [ ] T113h Add activation funnel events: signup_completed, profile_completed, first_proposal_created
- [ ] T113i Configure PostHog feature flags for A/B testing (optional)

### Health & Monitoring

- [ ] T113j Add health check endpoint (/health) in start/routes.ts (NFR-016)

### Accessibility (WCAG 2.1 AA)

- [ ] T113k Run accessibility audit on public proposal page using axe-core or Lighthouse
- [ ] T113l Add aria-labels to all interactive components in proposal builder

### Error Handling

- [ ] T114 Configure exception handler for Inertia redirects in app/exceptions/handler.ts
- [ ] T115 Add user-friendly error messages for all validation failures

### Final Verification

- [ ] T116 Run full application test following quickstart.md
- [ ] T117 Verify all user stories work independently
- [ ] T118 Run Biome lint check: `pnpm run lint`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3 → P4 → P5)
  - Or in parallel if team capacity allows
- **Polish (Phase 8)**: Depends on at least US1 being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP**
- **User Story 2 (P2)**: Can start after Foundational - Uses Proposal model from US1
- **User Story 3 (P3)**: Can start after Foundational - Enhances US1/US2 proposals
- **User Story 4 (P4)**: Can start after Foundational - Uses Proposal model
- **User Story 5 (P5)**: Can start after Foundational - Uses Lead model from US2

### Within Each User Story

- Validators before controllers
- Controllers before frontend pages
- Components before pages that use them
- Routes defined after controllers

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All migrations (T011-T014) can run in parallel
- All models (T016-T020) can run in parallel
- All auth controllers (T025-T027) can run in parallel
- Within each user story, all components marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all validators together:
Task: "Create proposal validator in app/validators/proposal_validator.ts"
Task: "Create tier validator in app/validators/tier_validator.ts"
Task: "Create benefit validator in app/validators/benefit_validator.ts"

# Launch all frontend components together:
Task: "Create proposal-form component in inertia/components/proposals/proposal-form.tsx"
Task: "Create proposal-preview component in inertia/components/proposals/proposal-preview.tsx"
Task: "Create tier-card component in inertia/components/proposals/tier-card.tsx"
Task: "Create tier-form component in inertia/components/proposals/tier-form.tsx"
Task: "Create benefit-list component in inertia/components/proposals/benefit-list.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test proposal creation with live preview
5. Deploy/demo if ready - users can already create proposals!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy (MVP - create proposals)
3. Add User Story 2 → Test independently → Deploy (publish + leads)
4. Add User Story 3 → Test independently → Deploy (design customization)
5. Add User Story 4 → Test independently → Deploy (PDF export)
6. Add User Story 5 → Test independently → Deploy (analytics + CRM)
7. Each story adds value without breaking previous stories

### Estimated Task Counts

| Phase                 | Tasks   | Parallel Opportunities |
| --------------------- | ------- | ---------------------- |
| Setup                 | 9       | 6                      |
| Foundational          | 30      | 18                     |
| US1 - Create Proposal | 33      | 15                     |
| US2 - Publish         | 14      | 2                      |
| US3 - Design          | 11      | 5                      |
| US4 - PDF Export      | 9       | 0                      |
| US5 - Leads/Analytics | 9       | 3                      |
| Polish                | 34      | 6                      |
| **TOTAL**             | **149** | **55**                 |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP is achievable after completing Phase 1, 2, and 3 (US1)

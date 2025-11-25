# MVP Roadmap: Spons Easy - 21-Day Development Plan

**Branch**: `001-proposal-builder`
**Created**: 2025-11-25
**Solo Developer Timeline**: 21 working days
**MVP Checkpoint**: Day 9 (Phase 3 complete)

---

## Executive Summary

This roadmap provides a day-by-day execution plan for building Spons Easy MVP as a solo developer. The plan prioritizes the core value proposition (live proposal builder with 5-minute time-to-value) while managing risks and dependencies.

**Key Numbers**:

- **21 days** total development time
- **142 tasks** across 8 phases
- **53 tasks** can run in parallel (for team scaling)
- **Day 9** = MVP checkpoint (users can create proposals)
- **Day 21** = Full feature release

---

## Week 1: Foundation Sprint (Days 1-7)

### Day 1: Project Setup (Phase 1)

**Focus**: Get development environment running

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T001 | Create AdonisJS project with Inertia starter kit | 30min | Project scaffold |
| T002 | Configure PostgreSQL driver and Lucid ORM | 15min | Database config |
| T003 | Setup Neon database branches (main + dev) | 30min | DATABASE_URL working |
| T004 | Initialize Shadcn/ui | 15min | Shadcn configured |
| T005 | Install Shadcn components (button, input, form, dialog, table, card, tabs, toast, textarea, select, sheet, label) | 45min | UI components ready |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T006 | Install form dependencies (zod, @hookform/resolvers, @tanstack/react-table) | 15min | Dependencies installed |
| T007 | Configure Biome for linting | 30min | biome.json ready |
| T008 | Update inertia/tsconfig.json with path aliases | 15min | Path aliases working |
| T009 | Exclude inertia from root tsconfig.json for HMR | 15min | HMR working |
| - | Verify full stack runs (npm run dev) | 30min | Development server running |
| - | Create initial git commit | 15min | Clean starting point |

**Day 1 Deliverables**:

- [x] AdonisJS + Inertia + React running
- [x] Neon PostgreSQL connected
- [x] Shadcn/ui components available
- [x] Biome linting configured
- [x] `npm run dev` works without errors

**Go/No-Go Criteria**:

- MUST: Development server starts successfully
- MUST: Database connection verified
- MUST: Shadcn components render correctly

**Risk Assessment Point**: If Neon connection fails, fallback to local PostgreSQL for development.

---

### Day 2: Database & Models (Phase 2 - Part 1)

**Focus**: Database schema and Lucid models

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T010 | Create users table migration | 30min | 001_create_users_table.ts |
| T011 | Create proposals table migration | 45min | 002_create_proposals_table.ts |
| T012 | Create tiers table migration | 30min | 003_create_tiers_table.ts |
| T013 | Create benefits table migration | 20min | 004_create_benefits_table.ts |
| T014 | Create leads table migration | 30min | 005_create_leads_table.ts |
| T015 | Run all migrations | 15min | Schema created in Neon |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T016 | Create User model with AuthFinder mixin | 45min | app/models/user.ts |
| T017 | Create Proposal model with relationships | 45min | app/models/proposal.ts |
| T018 | Create Tier model with relationships | 30min | app/models/tier.ts |
| T019 | Create Benefit model | 20min | app/models/benefit.ts |
| T020 | Create Lead model with relationships | 30min | app/models/lead.ts |
| - | Verify relationships with test queries | 30min | Models working correctly |

**Day 2 Deliverables**:

- [x] All 5 migrations created and run
- [x] All 5 Lucid models with relationships
- [x] Verified: User hasMany Proposals, Proposal hasMany Tiers/Leads, Tier hasMany Benefits

**Go/No-Go Criteria**:

- MUST: All migrations run without errors
- MUST: Models can be instantiated and saved
- MUST: Relationships work (eager loading tested)

**Dependency**: Day 2 completion BLOCKS all user story work

---

### Day 3: Authentication System (Phase 2 - Part 2)

**Focus**: Complete auth flow (register, login, logout)

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T021 | Configure session auth guard in config/auth.ts | 30min | Auth guard configured |
| T022 | Configure session driver in config/session.ts | 20min | Session config ready |
| T023 | Enable XSRF cookie in config/shield.ts | 15min | CSRF protection enabled |
| T024 | Create auth validators (login, register) | 45min | app/validators/auth_validator.ts |
| T025 | Create LoginController | 45min | app/controllers/auth/login_controller.ts |
| T026 | Create RegisterController | 45min | app/controllers/auth/register_controller.ts |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T027 | Create LogoutController | 20min | app/controllers/auth/logout_controller.ts |
| T028 | Configure shared data in config/inertia.ts | 30min | User/flash/errors available |
| T029 | Create TypeScript types | 45min | inertia/types/index.ts |
| T030 | Update inertia_layout.edge | 20min | Meta tags configured |
| T031 | Add reference directives in app.tsx | 15min | Type references set |
| T037 | Define auth routes in start/routes.ts | 30min | Routes configured |

**Day 3 Deliverables**:

- [x] Session-based authentication working
- [x] CSRF protection enabled
- [x] Auth validators created
- [x] All auth controllers (login, register, logout)
- [x] Shared data (user, flash, errors) available in Inertia

**Go/No-Go Criteria**:

- MUST: User can register with email/password
- MUST: User can login and session persists
- MUST: User can logout
- MUST: Protected routes redirect to login

---

### Day 4: Layouts & Auth Pages (Phase 2 - Part 3)

**Focus**: React layouts and authentication pages

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T032 | Create AppLayout (authenticated users) | 1h | inertia/components/layout/app-layout.tsx |
| T033 | Create GuestLayout (login/register) | 45min | inertia/components/layout/guest-layout.tsx |
| T034 | Create PublicLayout (public proposals) | 45min | inertia/components/layout/public-layout.tsx |
| T035 | Create login page | 1h | inertia/pages/auth/login.tsx |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T036 | Create register page | 1h | inertia/pages/auth/register.tsx |
| T038 | Create not-found error page | 30min | inertia/pages/errors/not-found.tsx |
| T039 | Create server-error page | 30min | inertia/pages/errors/server-error.tsx |
| - | End-to-end auth flow testing | 1h30min | Full auth flow verified |

**Day 4 Deliverables**:

- [x] 3 layouts (App, Guest, Public)
- [x] Login page with form validation
- [x] Register page with form validation
- [x] Error pages (404, 500)
- [x] Full auth flow working end-to-end

**PHASE 2 CHECKPOINT**: Foundation complete - User stories can now begin

**Go/No-Go Criteria**:

- MUST: New user can register, login, see dashboard stub
- MUST: Session persists across page refreshes
- MUST: Logout clears session
- MUST: Error pages display correctly

**Risk Assessment Point**: If auth issues persist, consider simplifying to basic session without complex middleware.

---

### Day 5: Proposal Builder Core (Phase 3 - Part 1)

**Focus**: Validators, controllers, and file upload

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T040 | Create proposal validator | 45min | app/validators/proposal_validator.ts |
| T041 | Create tier validator | 30min | app/validators/tier_validator.ts |
| T042 | Create benefit validator | 20min | app/validators/benefit_validator.ts |
| T043 | Create ProposalsController (CRUD) | 2h | app/controllers/proposals_controller.ts |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T044 | Create TiersController | 1h | app/controllers/tiers_controller.ts |
| T045 | Create BenefitsController | 45min | app/controllers/benefits_controller.ts |
| T046 | Create UploadsController | 45min | app/controllers/uploads_controller.ts |
| T047 | Configure Drive for local storage | 30min | config/drive.ts |
| T048 | Implement image upload/compression | 1h | Upload endpoint working |

**Day 5 Deliverables**:

- [x] All proposal-related validators
- [x] ProposalsController with full CRUD
- [x] TiersController and BenefitsController
- [x] Image upload working (max 10MB, compression)

**Go/No-Go Criteria**:

- MUST: Proposal can be created via API
- MUST: Tiers can be added to proposal
- MUST: Images upload successfully
- SHOULD: Validation errors return correctly

---

### Day 6: Builder Frontend Components (Phase 3 - Part 2)

**Focus**: React components for proposal builder

**Full Day (8h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T049 | Create proposal-form component | 2h | inertia/components/proposals/proposal-form.tsx |
| T050 | Create proposal-preview component | 2h | inertia/components/proposals/proposal-preview.tsx |
| T051 | Create tier-card component | 1h | inertia/components/proposals/tier-card.tsx |
| T052 | Create tier-form component | 1h30min | inertia/components/proposals/tier-form.tsx |
| T053 | Create benefit-list component | 1h | inertia/components/proposals/benefit-list.tsx |
| - | Component testing and refinement | 30min | All components render correctly |

**Day 6 Deliverables**:

- [x] ProposalForm - main form with all fields
- [x] ProposalPreview - live preview display
- [x] TierCard - individual tier display
- [x] TierForm - tier creation/editing
- [x] BenefitList - benefits management

**Go/No-Go Criteria**:

- MUST: All components render without errors
- MUST: Forms validate input correctly
- MUST: Preview updates when form changes
- SHOULD: Components are responsive

---

### Day 7: Builder Pages & Auto-save (Phase 3 - Part 3)

**Focus**: Complete builder pages and auto-save functionality

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T054 | Create useAutosave hook | 1h | inertia/hooks/use-autosave.ts |
| T055 | Create useProposalPreview hook | 1h | inertia/hooks/use-proposal-preview.ts |
| T056 | Create proposals index page | 1h | inertia/pages/proposals/index.tsx |
| T057 | Create proposal create page (split-screen) | 1h | inertia/pages/proposals/create.tsx |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T058 | Create proposal edit page (split-screen) | 1h30min | inertia/pages/proposals/edit.tsx |
| T059 | Create proposal show page | 45min | inertia/pages/proposals/show.tsx |
| T064-T068 | Define all proposal routes | 1h | start/routes.ts updated |
| - | Test split-screen builder end-to-end | 45min | Builder works fully |

**Day 7 Deliverables**:

- [x] useAutosave hook (30s interval, debounced)
- [x] useProposalPreview hook (instant updates)
- [x] All proposal pages (index, create, edit, show)
- [x] Routes for proposals, tiers, benefits, uploads
- [x] Split-screen builder working

**WEEK 1 CHECKPOINT**: Core builder functional

**Go/No-Go Criteria**:

- MUST: User can create new proposal
- MUST: Split-screen shows form left, preview right
- MUST: Preview updates within 500ms of typing
- MUST: Auto-save triggers every 30 seconds
- MUST: User can add/edit/delete tiers and benefits

---

## Week 2: Core Features Sprint (Days 8-14)

### Day 8: Dashboard & Auto-save Polish (Phase 3 - Part 4)

**Focus**: Complete User Story 1 with dashboard

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T060 | Create DashboardController | 45min | app/controllers/dashboard_controller.ts |
| T061 | Create stats-card component | 45min | inertia/components/dashboard/stats-card.tsx |
| T062 | Create proposal-card component | 1h | inertia/components/dashboard/proposal-card.tsx |
| T063 | Create dashboard index page | 1h30min | inertia/pages/dashboard/index.tsx |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T069 | Implement autosave endpoint | 1h | PATCH /proposals/:id/autosave |
| T070 | Integrate useAutosave in edit page | 45min | Auto-save working |
| T070b | Add beforeunload browser prompt | 30min | Unsaved changes warning |
| T070c | Implement localStorage backup | 45min | Session recovery |
| - | Full User Story 1 testing | 1h | US1 complete |

**Day 8 Deliverables**:

- [x] Dashboard with stats cards
- [x] Proposal list on dashboard
- [x] Auto-save fully working
- [x] Unsaved changes warning
- [x] localStorage backup for recovery

**Day 9 = MVP CHECKPOINT**

---

### Day 9: MVP Demo & Publishing Start (Phase 4 - Part 1)

**Morning (2h) - MVP VALIDATION**:

| Activity | Duration | Success Criteria |
|----------|----------|------------------|
| Create test user account | 5min | User registered |
| Create complete proposal (5-min challenge) | 10min | < 5 minutes target |
| Test all builder features | 30min | All features work |
| Test auto-save and recovery | 15min | No data loss |
| Document any bugs | 30min | Bug list created |
| Go/No-Go decision | 30min | MVP approved or fixes needed |

**MVP DEMO CHECKLIST**:

- [ ] User can register and login (< 30 seconds)
- [ ] User can create proposal (< 5 minutes)
- [ ] Split-screen builder works
- [ ] Preview updates in < 500ms
- [ ] Tiers and benefits can be added
- [ ] Images upload successfully
- [ ] Auto-save works (30s interval)
- [ ] Dashboard shows proposal list
- [ ] No critical bugs

**Afternoon (4h) - Start Phase 4**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T071 | Create PublicProposalsController | 1h30min | app/controllers/public_proposals_controller.ts |
| T072 | Add publish/unpublish actions | 1h | ProposalsController updated |
| T073 | Create lead validator | 30min | app/validators/lead_validator.ts |
| T074 | Configure mail provider | 30min | config/mail.ts |

**Day 9 Deliverables**:

- [x] MVP VALIDATED and documented
- [x] PublicProposalsController created
- [x] Publish/unpublish actions
- [x] Lead validator
- [x] Mail configuration

**CRITICAL GATE**: If MVP fails, STOP and fix before continuing. Do not proceed to Phase 4 until Day 8 deliverables are solid.

---

### Day 10: Publishing Complete (Phase 4 - Part 2)

**Focus**: Complete publishing and lead capture

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T075 | Create EmailService | 1h | app/services/email_service.ts |
| T075b | Implement email retry (3 attempts) | 45min | Retry mechanism |
| T076 | Create contact-form component | 1h30min | inertia/components/proposals/contact-form.tsx |
| T077 | Create public proposal page | 1h | inertia/pages/public/proposal.tsx |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T078 | Define public proposal routes | 30min | /p/:slug route |
| T079 | Define contact form route | 30min | POST /p/:slug/contact |
| T080 | Implement view count increment | 30min | View tracking working |
| T080b | Add "update published" vs "draft" selection | 45min | Edit workflow complete |
| T080c | Duplicate submission detection | 45min | 5-min consolidation |
| T080d | Create "proposal unavailable" page | 30min | inertia/pages/public/unavailable.tsx |

**Day 10 Deliverables**:

- [x] EmailService with retry mechanism
- [x] Public proposal page at /p/:slug
- [x] Contact form captures leads
- [x] Email notification on new lead
- [x] View count tracking
- [x] Duplicate submission prevention

**PHASE 4 CHECKPOINT**: Publishing feature complete

**Go/No-Go Criteria**:

- MUST: Published proposal accessible at /p/:slug
- MUST: Contact form submits and creates lead
- MUST: Email sent to proposal owner
- MUST: View count increments
- MUST: Unpublish removes public access

---

### Day 11: Design Customization (Phase 5)

**Focus**: Complete User Story 3 - Design settings

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T081a | Create design_settings_validator (Vine) | 30min | app/validators/design_settings_validator.ts |
| T081b | Create design-settings Zod schema | 30min | inertia/schemas/design-settings.ts |
| T081c | Integrate schema in proposal_validator | 20min | Validation integrated |
| T081 | Add settings actions to ProposalsController | 1h | Settings endpoints |
| T082 | Create color-picker component | 1h | inertia/components/ui/color-picker.tsx |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T083 | Create font-selector component | 45min | inertia/components/proposals/font-selector.tsx |
| T084 | Create layout-selector component | 45min | inertia/components/proposals/layout-selector.tsx |
| T085 | Create proposal settings page | 1h30min | inertia/pages/proposals/settings.tsx |
| T086 | Update preview with design settings | 45min | Preview reflects settings |
| T087 | Update public page with design settings | 30min | Published reflects settings |
| T088 | Define settings routes | 15min | Routes configured |

**Day 11 Deliverables**:

- [x] Design settings validator (Vine + Zod)
- [x] Color picker component
- [x] Font selector component
- [x] Layout selector component
- [x] Settings page working
- [x] Preview and public page reflect design settings

**PHASE 5 CHECKPOINT**: Design customization complete

**Go/No-Go Criteria**:

- MUST: User can change primary/secondary colors
- MUST: User can select font family
- MUST: User can choose layout template
- MUST: Preview updates immediately
- MUST: Published page reflects design choices

---

### Day 12: PDF Export (Phase 6 - Part 1)

**Focus**: PDF generation service setup

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T089 | Install Puppeteer for PDF generation | 30min | Dependency installed |
| T089b | Configure Bull queue with Redis | 1h | Async queue ready |
| T089c | Implement PDF job worker (30s timeout) | 1h | Worker processing jobs |
| T090 | Create PdfService | 1h30min | app/services/pdf_service.ts |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T091 | Implement PDF with design settings | 2h | Styled PDF output |
| T092 | Add exportPdf action to controller | 45min | GET /proposals/:id/export-pdf |
| T095 | Define PDF export route | 15min | Route configured |
| - | Test PDF generation (< 10s) | 1h | Performance verified |

**Day 12 Deliverables**:

- [x] Puppeteer installed and configured
- [x] Bull queue for async processing
- [x] PdfService with design settings support
- [x] Export endpoint working
- [x] PDF generates in < 10 seconds

**Risk Assessment Point**: If Puppeteer is slow, consider client-side fallback (browser print).

---

### Day 13: PDF Export Complete & Analytics Start (Phase 6-7)

**Focus**: Complete PDF export, start analytics

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T093 | Add "Export PDF" button | 45min | Button on show page |
| T094 | Add loading state and download | 1h | UX complete |
| - | Full PDF testing | 1h | All edge cases tested |
| T096 | Create LeadsController | 1h30min | app/controllers/leads_controller.ts |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T097 | Add leads action to DashboardController | 45min | Centralized leads view |
| T098 | Create leads-table component | 1h30min | inertia/components/leads/leads-table.tsx |
| T099 | Create lead-status-badge component | 30min | inertia/components/leads/lead-status-badge.tsx |
| T100 | Create lead-filters component | 1h | inertia/components/leads/lead-filters.tsx |

**Day 13 Deliverables**:

- [x] PDF export feature complete
- [x] LeadsController with CRUD
- [x] Leads table component
- [x] Status badges
- [x] Filter components

**PHASE 6 CHECKPOINT**: PDF export fully functional

---

### Day 14: Analytics Complete (Phase 7)

**Focus**: Complete User Story 5 - Lead management and analytics

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T101 | Create dashboard leads page | 1h30min | inertia/pages/dashboard/leads.tsx |
| T102 | Update dashboard with analytics stats | 1h30min | Stats cards updated |
| T103 | Define lead routes | 30min | CRUD routes |
| T104 | Define dashboard/leads route | 15min | Route configured |

**Afternoon (4h)**:

| Activity | Duration | Deliverable |
|----------|----------|-------------|
| Full User Story 5 testing | 1h30min | US5 verified |
| Integration testing (all stories) | 2h | All stories work together |
| Bug fixes and polish | 30min | Issues resolved |

**Day 14 Deliverables**:

- [x] Dashboard leads page with filtering
- [x] Analytics stats on dashboard
- [x] Lead status updates
- [x] All routes defined
- [x] All 5 user stories working

**WEEK 2 CHECKPOINT**: All user stories complete

**Go/No-Go Criteria**:

- MUST: All 5 user stories pass acceptance criteria
- MUST: No critical bugs
- MUST: Performance targets met (< 3s load, < 500ms preview)
- SHOULD: All P0 requirements complete

---

## Week 3: Polish & Launch Sprint (Days 15-21)

### Day 15: Home Page & Security (Phase 8 - Part 1)

**Focus**: Public home page and security hardening

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T105 | Create HomeController | 30min | app/controllers/home_controller.ts |
| T106 | Create home page | 2h | inertia/pages/home.tsx |
| T107 | Define home route | 15min | / route |
| T108 | Add authorization checks to all controllers | 1h | User ownership verified |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T109 | Configure @adonisjs/limiter | 30min | config/limiter.ts |
| T109a | Rate limiting for auth (5/15min login, 3/1h register) | 30min | Auth protected |
| T109b | Rate limiting for API (100/min read, 30/min write) | 30min | API protected |
| T109c | Rate limiting for contact form (3/5min) | 30min | Spam prevention |
| T109d | Rate limiting for uploads (10/10min) and autosave (60/min) | 30min | Abuse prevention |
| T109e | Rate limiting for PDF export (5/10min) | 15min | Resource protection |
| T110 | CSRF protection validation | 30min | CSRF verified |

**Day 15 Deliverables**:

- [x] Marketing home page
- [x] Authorization checks on all endpoints
- [x] Rate limiting configured for all endpoints
- [x] CSRF protection verified

---

### Day 16: Session & Pagination (Phase 8 - Part 2)

**Focus**: Session configuration and pagination

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T110b | Configure session expiry (7 days) | 30min | config/session.ts updated |
| T111a | Create pagination helper | 1h | app/helpers/pagination.ts |
| T111b | Pagination in ProposalsController.index | 45min | Paginated list |
| T111c | Pagination in DashboardController.index | 45min | Paginated dashboard |
| T111d | Pagination in DashboardController.leads | 45min | Paginated leads |
| T111e | Pagination in LeadsController.index | 45min | Paginated leads list |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T111 | Database indexes verification | 1h | Indexes optimized |
| T112 | Image lazy loading in preview | 45min | Performance improved |
| T112b | Browser image compression before upload | 1h | Upload optimized |
| T113 | Response caching headers for public proposals | 45min | Caching configured |
| T113b | React.lazy for non-critical pages | 30min | Code splitting |

**Day 16 Deliverables**:

- [x] Session expiry at 7 days
- [x] Pagination on all list views
- [x] Database indexes verified
- [x] Image lazy loading
- [x] Client-side image compression
- [x] Caching headers
- [x] Code splitting

---

### Day 17: Monitoring & Accessibility (Phase 8 - Part 3)

**Focus**: Health check, accessibility, error handling

**Morning (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T113c | Health check endpoint (/health) | 30min | Monitoring ready |
| T113d | Accessibility audit (public proposal) | 2h | Issues documented |
| T113e | Add aria-labels to builder | 1h30min | Accessibility improved |

**Afternoon (4h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T114 | Configure exception handler | 1h | app/exceptions/handler.ts |
| T115 | User-friendly error messages | 1h30min | All validations have messages |
| - | Fix accessibility issues | 1h30min | WCAG 2.1 AA compliance |

**Day 17 Deliverables**:

- [x] Health check endpoint working
- [x] Accessibility audit complete
- [x] ARIA labels added
- [x] Exception handler configured
- [x] User-friendly error messages

---

### Day 18: Testing & Bug Fixes (Phase 8 - Part 4)

**Focus**: End-to-end testing and bug fixes

**Full Day (8h)**:

| Task ID | Description | Est. Time | Deliverable |
|---------|-------------|-----------|-------------|
| T116 | Run full application test (quickstart.md) | 2h | All flows verified |
| T117 | Verify all user stories independently | 3h | Each story works alone |
| T118 | Run Biome lint check | 30min | 0 lint errors |
| - | Fix discovered bugs | 2h | Bugs resolved |
| - | Document remaining issues | 30min | Issue backlog |

**Day 18 Deliverables**:

- [x] Full application tested
- [x] All 5 user stories verified
- [x] Biome lint passing (0 errors)
- [x] Critical bugs fixed
- [x] Issue backlog documented

**Testing Checklist**:

| User Story | Test Scenario | Status |
|------------|---------------|--------|
| US1 | Create proposal in < 5 min | [ ] |
| US1 | Preview updates < 500ms | [ ] |
| US1 | Auto-save every 30s | [ ] |
| US2 | Publish at /p/:slug | [ ] |
| US2 | Contact form captures lead | [ ] |
| US2 | Email notification sent | [ ] |
| US3 | Colors apply to preview | [ ] |
| US3 | Colors apply to published | [ ] |
| US4 | PDF downloads < 10s | [ ] |
| US4 | PDF preserves design | [ ] |
| US5 | Dashboard shows analytics | [ ] |
| US5 | Lead status can be updated | [ ] |

---

### Day 19: Performance & Security Audit

**Focus**: Final performance optimization and security review

**Morning (4h)**:

| Activity | Duration | Deliverable |
|----------|----------|-------------|
| Lighthouse audit (desktop) | 1h | Score > 90 |
| Lighthouse audit (mobile) | 1h | Score > 80 |
| Performance bottleneck fixes | 2h | Improvements applied |

**Afternoon (4h)**:

| Activity | Duration | Deliverable |
|----------|----------|-------------|
| Security checklist review | 1h | OWASP Top 10 check |
| Penetration testing (basic) | 2h | Vulnerabilities documented |
| Security fixes | 1h | Issues resolved |

**Day 19 Deliverables**:

- [x] Lighthouse scores meet targets
- [x] Security audit complete
- [x] All critical vulnerabilities fixed

**Security Checklist**:

| Item | Status |
|------|--------|
| Authentication working | [ ] |
| Authorization on all routes | [ ] |
| CSRF protection enabled | [ ] |
| Input validation (all forms) | [ ] |
| Rate limiting active | [ ] |
| HTTPS enforced | [ ] |
| No SQL injection possible | [ ] |
| XSS prevention (React escaping) | [ ] |
| Passwords hashed (scrypt) | [ ] |
| Sensitive data not in logs | [ ] |

---

### Day 20: Pre-Launch Preparation

**Focus**: Final polish and launch preparation

**Morning (4h)**:

| Activity | Duration | Deliverable |
|----------|----------|-------------|
| Final bug sweep | 1h30min | Last fixes applied |
| Documentation update | 1h | README complete |
| Environment variables documented | 30min | .env.example updated |
| Deployment preparation | 1h | Railway/Vercel ready |

**Afternoon (4h)**:

| Activity | Duration | Deliverable |
|----------|----------|-------------|
| Production database setup | 1h | Neon main branch ready |
| Production environment config | 1h | Environment variables set |
| Staging deployment test | 1h30min | Staging working |
| Final smoke test | 30min | All critical paths work |

**Day 20 Deliverables**:

- [x] All bugs fixed (P0/P1)
- [x] Documentation complete
- [x] Production environment configured
- [x] Staging deployment successful
- [x] Final smoke test passed

**Launch Readiness Checklist**:

| Item | Status |
|------|--------|
| All P0 requirements complete | [ ] |
| No P0/P1 bugs | [ ] |
| 5-minute time-to-value achievable | [ ] |
| Email notifications working | [ ] |
| PDF export functional | [ ] |
| Performance targets met | [ ] |
| Security audit passed | [ ] |
| Staging deployment successful | [ ] |

---

### Day 21: Launch Day

**Focus**: Production deployment and launch

**Morning (4h)**:

| Activity | Duration | Deliverable |
|----------|----------|-------------|
| Final staging verification | 30min | Staging approved |
| Production deployment | 1h | Live on production |
| DNS/domain configuration | 30min | Domain pointing |
| Production smoke test | 1h | All features work |
| Monitor for issues | 1h | No critical errors |

**Afternoon (4h)**:

| Activity | Duration | Deliverable |
|----------|----------|-------------|
| Create 5 test proposals | 1h | Real data for demo |
| Document learnings | 1h | Retrospective notes |
| Plan iteration 1 | 1h30min | Next sprint backlog |
| Celebrate! | 30min | MVP launched! |

**Day 21 Deliverables**:

- [x] Production deployment live
- [x] All features working in production
- [x] Test data created
- [x] Launch documentation complete
- [x] Iteration 1 planned

---

## Milestone Definitions

### Milestone 1: Foundation Ready (Day 4)

**Criteria**:

- [x] Database schema created and migrated
- [x] All Lucid models with relationships
- [x] Authentication fully working
- [x] Layouts and auth pages complete
- [x] Development environment stable

**Demo**: User can register, login, see empty dashboard, logout

**Go/No-Go**: If auth is broken, STOP and fix before proceeding

---

### Milestone 2: MVP Checkpoint (Day 9)

**Criteria**:

- [x] User Story 1 complete (Create Proposal)
- [x] Split-screen builder working
- [x] Live preview updates < 500ms
- [x] Auto-save every 30 seconds
- [x] Dashboard shows proposals
- [x] Time-to-value < 5 minutes

**Demo**: Create complete proposal with tiers and benefits using live builder

**Go/No-Go**: If core builder broken, STOP and fix. This is the minimum viable product.

---

### Milestone 3: Publishing Live (Day 10)

**Criteria**:

- [x] User Story 2 complete (Publish)
- [x] Public proposal at /p/:slug
- [x] Contact form captures leads
- [x] Email notifications working
- [x] View tracking active

**Demo**: Publish proposal, visit public URL, submit contact form, receive email

---

### Milestone 4: Full Features (Day 14)

**Criteria**:

- [x] User Story 3 complete (Design)
- [x] User Story 4 complete (PDF)
- [x] User Story 5 complete (Analytics)
- [x] All 5 user stories working together
- [x] No critical bugs

**Demo**: Full user journey from registration to lead conversion

---

### Milestone 5: Production Ready (Day 21)

**Criteria**:

- [x] Phase 8 complete (Polish)
- [x] Security audit passed
- [x] Performance targets met
- [x] All documentation complete
- [x] Production deployment successful

**Demo**: Live production site with real user test

---

## Risk Mitigation Schedule

### Daily Risk Check

| Day | Risk to Assess | Trigger | Contingency |
|-----|----------------|---------|-------------|
| 1 | Neon connection fails | Connection timeout | Use local PostgreSQL |
| 3 | Auth complexity too high | > 4h on single task | Simplify middleware |
| 5 | Controller complexity | > 2h on ProposalsController | Split into smaller controllers |
| 7 | Preview performance | > 500ms updates | Optimize re-renders, debounce |
| 9 | MVP not ready | Critical bugs | Extend Phase 3, delay Phase 4 |
| 10 | Email delivery fails | No emails received | Switch provider (Resend -> Mailgun) |
| 12 | PDF slow | > 10s generation | Add queue, or use client-side print |
| 15 | Rate limiting issues | Legitimate users blocked | Adjust limits, add whitelist |
| 17 | Accessibility failures | WCAG audit fails | Prioritize critical fixes |
| 19 | Security vulnerabilities | High-severity finding | STOP and fix immediately |
| 20 | Deployment fails | Railway/Vercel errors | Try alternative (Render, Fly.io) |

### Weekly Risk Review

**End of Week 1 (Day 7)**:

- Is foundation solid? (Auth, DB, Models)
- Is builder UX smooth?
- Are there technical debt items to address?
- Is pace sustainable?

**End of Week 2 (Day 14)**:

- Are all user stories working?
- Is performance acceptable?
- Are there integration issues?
- Is launch date realistic?

**End of Week 3 (Day 21)**:

- Is production stable?
- Are there known issues for iteration 1?
- What went well?
- What could improve?

---

## Resource Allocation

### Solo Developer Daily Schedule

| Time Block | Duration | Focus |
|------------|----------|-------|
| 08:00-10:00 | 2h | Deep work (complex tasks) |
| 10:00-10:15 | 15min | Break |
| 10:15-12:15 | 2h | Deep work (complex tasks) |
| 12:15-13:15 | 1h | Lunch |
| 13:15-15:15 | 2h | Implementation |
| 15:15-15:30 | 15min | Break |
| 15:30-17:00 | 1.5h | Testing and polish |
| 17:00-17:30 | 30min | Daily wrap-up, next day prep |

**Total Productive Hours**: ~7.5h/day

### Critical Path

The following tasks MUST be completed on schedule:

1. **T010-T015**: Database migrations (Day 2) - Blocks all models
2. **T016-T020**: Lucid models (Day 2) - Blocks all controllers
3. **T021-T027**: Auth system (Day 3) - Blocks all protected routes
4. **T043**: ProposalsController (Day 5) - Blocks builder pages
5. **T057-T058**: Builder pages (Day 7) - Core MVP feature
6. **T071**: PublicProposalsController (Day 9) - Blocks publishing

### Buffer Time Allocation

| Phase | Estimated | Buffer | Total |
|-------|-----------|--------|-------|
| Phase 1: Setup | 1 day | 0 | 1 day |
| Phase 2: Foundation | 3 days | 0.5 day | 3.5 days |
| Phase 3: US1 | 4 days | 0.5 day | 4.5 days |
| Phase 4: US2 | 1.5 days | 0.5 day | 2 days |
| Phase 5: US3 | 1 day | 0 | 1 day |
| Phase 6: US4 | 1.5 days | 0.5 day | 2 days |
| Phase 7: US5 | 1 day | 0 | 1 day |
| Phase 8: Polish | 5 days | 1 day | 6 days |

**Buffer Strategy**: 2.5 days total buffer distributed across high-risk phases. If buffer consumed, de-scope Phase 8 polish tasks.

---

## Sprint Planning Summary

### Week 1: Foundation Sprint (Days 1-7)

**Goal**: Complete setup and foundation, deliver working builder

**Deliverables**:

- AdonisJS + Inertia + Shadcn configured
- Database with all migrations
- Authentication working
- Proposal builder with live preview
- Auto-save functionality

**Story Points**: ~40 tasks

---

### Week 2: Core Features Sprint (Days 8-14)

**Goal**: Complete all 5 user stories

**Deliverables**:

- Dashboard with stats
- Publishing with public URLs
- Contact form and lead capture
- Design customization
- PDF export
- Lead management

**Story Points**: ~50 tasks

---

### Week 3: Polish & Launch Sprint (Days 15-21)

**Goal**: Production-ready launch

**Deliverables**:

- Home page
- Security hardening
- Performance optimization
- Accessibility compliance
- Full testing
- Production deployment

**Story Points**: ~52 tasks

---

## Success Criteria Summary

### MVP Success (Day 9)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first proposal | < 5 minutes | Manual test |
| Preview update latency | < 500ms | In-app timing |
| Auto-save reliability | 100% | No data loss |
| Builder usability | Intuitive | Dogfooding |

### Launch Success (Day 21)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load (desktop) | < 3s | Lighthouse LCP |
| Page load (mobile) | < 4s | Lighthouse LCP |
| PDF generation | < 10s | Server logs |
| Uptime | 99.5% | External monitoring |
| Security vulnerabilities | 0 critical | Security audit |
| Lint errors | 0 | Biome check |

### Business Success (Post-Launch)

| Metric | Target | Timeline |
|--------|--------|----------|
| Beta users | 50 | 2 weeks |
| Proposals generated | 100 | 1 month |
| Activation rate | 40% | 1 month |
| NPS | > 30 | 1 month |

---

## Post-Launch: Iteration 1 Preview (Days 22-35)

Based on MVP learnings, prioritize:

1. **User feedback fixes** - Address critical usability issues
2. **Performance optimization** - Fix any bottlenecks discovered
3. **Onboarding improvement** - If activation < 40%, simplify first-time flow
4. **Missing features** - Based on user requests

**Potential Iteration 1 Tasks**:

- Guided onboarding wizard
- More design templates
- Analytics dashboard improvements
- Mobile responsiveness polish
- Email deliverability improvements

---

## Appendix: Task Reference

Full task list available at: `/specs/001-proposal-builder/tasks.md`

**Quick Reference**:

| Phase | Tasks | File Reference |
|-------|-------|----------------|
| Setup | T001-T009 | tasks.md#phase-1-setup |
| Foundational | T010-T039 | tasks.md#phase-2-foundational |
| US1 | T040-T070c | tasks.md#phase-3-user-story-1 |
| US2 | T071-T080d | tasks.md#phase-4-user-story-2 |
| US3 | T081-T088 | tasks.md#phase-5-user-story-3 |
| US4 | T089-T095 | tasks.md#phase-6-user-story-4 |
| US5 | T096-T104 | tasks.md#phase-7-user-story-5 |
| Polish | T105-T118 | tasks.md#phase-8-polish |

---

**Created**: 2025-11-25
**Version**: 1.0.0
**Author**: MVP Roadmap Agent

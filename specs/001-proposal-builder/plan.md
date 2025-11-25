# Implementation Plan: Sponseasy - Sponsorship Proposal Builder

**Branch**: `001-proposal-builder` | **Date**: 2025-11-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-proposal-builder/spec.md`
**Related**: Product Requirements Document at `/.ideabrowser/prd.md` (business context, personas, success metrics)

## Summary

Sponseasy is a proposal management system for sponsorship seekers to create professional sponsorship decks via a live builder interface (split-screen: form + real-time preview) and publish them as interactive websites. The application uses AdonisJS 6 backend with Inertia.js + React frontend, Shadcn/ui components, session-based authentication, and Neon PostgreSQL with branch-based development workflow.

## Technical Context

**Language/Version**: TypeScript 5.x (Node.js 20 LTS)
**Primary Dependencies**:
- Backend: AdonisJS 6, @adonisjs/lucid, @adonisjs/auth, @adonisjs/inertia
- Frontend: React 18, Inertia.js, Shadcn/ui, Tailwind CSS v4
- Forms: react-hook-form, Zod, @hookform/resolvers
- Tables: @tanstack/react-table

**Storage**: PostgreSQL (Neon) with 2 branches (main=production, dev/staging=development)
**Testing**: Japa (AdonisJS test runner)
**Target Platform**: Web application (modern browsers)
**Project Type**: Web application (monolith with Inertia)
**Performance Goals**: 3s page load, 500ms preview update, 10s PDF generation
**Constraints**: Auto-save every 30s, image uploads max 10MB, SSL required for Neon
**Scale/Scope**: MVP for single-tenant use, future multi-tenant capability

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Constitution defined | Yes | See `/.ideabrowser/constitution.md` |
| Automation-first | Aligned | Live builder with instant preview |
| Time-to-value (<5 min) | Aligned | Guided wizard, auto-save, one-click publish |
| Data-driven | Aligned | Analytics, lead tracking, view counts |
| KISS | Aligned | Minimal stack, no over-engineering |

## Project Structure

### Documentation (this feature)

```text
specs/001-proposal-builder/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - database schema
├── quickstart.md        # Phase 1 output - setup guide
├── contracts/           # Phase 1 output - API definitions
│   ├── api-routes.md    # Route definitions
│   └── inertia-pages.md # Page component contracts
├── checklists/          # Validation checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
spons-easy/
├── app/
│   ├── controllers/
│   │   ├── auth/
│   │   │   ├── login_controller.ts
│   │   │   ├── register_controller.ts
│   │   │   └── logout_controller.ts
│   │   ├── dashboard_controller.ts
│   │   ├── proposals_controller.ts
│   │   ├── tiers_controller.ts
│   │   ├── benefits_controller.ts
│   │   ├── leads_controller.ts
│   │   ├── uploads_controller.ts
│   │   ├── public_proposals_controller.ts
│   │   └── home_controller.ts
│   ├── middleware/
│   │   ├── auth_middleware.ts
│   │   └── guest_middleware.ts
│   ├── models/
│   │   ├── user.ts
│   │   ├── proposal.ts
│   │   ├── tier.ts
│   │   ├── benefit.ts
│   │   └── lead.ts
│   ├── validators/
│   │   ├── auth_validator.ts
│   │   ├── proposal_validator.ts
│   │   ├── tier_validator.ts
│   │   └── lead_validator.ts
│   └── services/
│       ├── pdf_service.ts
│       └── email_service.ts
├── config/
│   ├── app.ts
│   ├── auth.ts
│   ├── database.ts
│   ├── inertia.ts
│   ├── session.ts
│   └── shield.ts
├── database/
│   └── migrations/
│       ├── 001_create_users_table.ts
│       ├── 002_create_proposals_table.ts
│       ├── 003_create_tiers_table.ts
│       ├── 004_create_benefits_table.ts
│       └── 005_create_leads_table.ts
├── inertia/
│   ├── app/
│   │   ├── app.tsx
│   │   └── ssr.tsx
│   ├── components/
│   │   ├── ui/                    # Shadcn components
│   │   ├── layout/
│   │   │   ├── app-layout.tsx
│   │   │   ├── guest-layout.tsx
│   │   │   └── public-layout.tsx
│   │   ├── proposals/
│   │   │   ├── proposal-form.tsx
│   │   │   ├── proposal-preview.tsx
│   │   │   ├── tier-card.tsx
│   │   │   ├── tier-form.tsx
│   │   │   └── benefit-list.tsx
│   │   ├── dashboard/
│   │   │   ├── stats-card.tsx
│   │   │   └── proposal-card.tsx
│   │   └── leads/
│   │       ├── leads-table.tsx
│   │       └── lead-status-badge.tsx
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   ├── dashboard/
│   │   │   ├── index.tsx
│   │   │   └── leads.tsx
│   │   ├── proposals/
│   │   │   ├── index.tsx
│   │   │   ├── create.tsx
│   │   │   ├── edit.tsx
│   │   │   ├── show.tsx
│   │   │   └── settings.tsx
│   │   ├── public/
│   │   │   └── proposal.tsx
│   │   └── errors/
│   │       ├── not-found.tsx
│   │       └── server-error.tsx
│   ├── hooks/
│   │   ├── use-autosave.ts
│   │   └── use-proposal-preview.ts
│   ├── types/
│   │   └── index.ts
│   ├── css/
│   │   └── app.css
│   └── tsconfig.json
├── resources/
│   └── views/
│       └── inertia_layout.edge
├── start/
│   ├── routes.ts
│   ├── kernel.ts
│   └── env.ts
├── public/
│   └── uploads/
├── tests/
│   ├── functional/
│   └── unit/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── biome.json
```

**Structure Decision**: Monolithic AdonisJS application with Inertia.js for frontend. Frontend code lives in `inertia/` directory at project root, separated from AdonisJS resources. This structure follows AdonisJS + Inertia best practices for maintainability and HMR performance.

## Complexity Tracking

> No complexity violations identified. The chosen stack (AdonisJS + Inertia + Shadcn) provides a well-integrated solution without unnecessary abstractions.

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | `specs/001-proposal-builder/research.md` | Complete |
| Data Model | `specs/001-proposal-builder/data-model.md` | Complete |
| API Routes | `specs/001-proposal-builder/contracts/api-routes.md` | Complete |
| Inertia Pages | `specs/001-proposal-builder/contracts/inertia-pages.md` | Complete |
| Quickstart | `specs/001-proposal-builder/quickstart.md` | Complete |
| Tasks | `specs/001-proposal-builder/tasks.md` | Pending (/speckit.tasks) |

## Key Technical Decisions

1. **AdonisJS 6 + Inertia.js**: Full-stack TypeScript with server-side routing and client-side interactivity
2. **Shadcn/ui**: Copy-paste components for full customization control
3. **Neon PostgreSQL**: Serverless Postgres with instant branching for dev/prod isolation
4. **Session Authentication**: Built-in AdonisJS auth with cookie-based sessions
5. **Auto-save Pattern**: Debounced PATCH requests to `/autosave` endpoint every 30 seconds
6. **Live Preview**: React state management with instant updates, no server round-trip

## Risks & Mitigation

### High Priority Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **PDF generation slow/fails in production** | Medium | High | Implement async queue with Bull/Redis, 30s timeout, fallback to "PDF generation in progress" email notification |
| **Rate limiting bypass (brute-force attacks)** | Medium | High | Implement @adonisjs/limiter with Redis backend, rate limits per endpoint (see API docs) |
| **Session loss during editing** | Medium | High | Auto-save every 30s, localStorage backup of form state, recovery prompt on reconnect |
| **Large image uploads blocking UI** | Medium | Medium | Client-side compression before upload (browser-image-compression), strict 10MB server limit, progress indicator |

### Medium Priority Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Neon cold starts causing slow first queries** | Low | Medium | Use pooled connections, implement connection warmup on app start |
| **Email delivery failures (Resend)** | Low | Medium | Implement retry mechanism (3 attempts), fallback in-app notification, email delivery status tracking |
| **Bundle size too large for mobile** | Medium | Medium | Lazy loading for non-critical pages, code splitting per route, bundle analyzer monitoring |
| **Preview not updating fast enough** | Low | Medium | Pure React state updates (no API calls), debounce only for auto-save, not for preview |

### Low Priority Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Vendor lock-in (Neon)** | Low | Low | Standard PostgreSQL, migrations are portable, can migrate to any Postgres host |
| **Shadcn components breaking on update** | Low | Low | Components are copied locally, not npm dependencies, version control tracks all changes |
| **SSR hydration mismatches** | Low | Low | Disable SSR initially if issues arise, Inertia handles most edge cases |

### Contingency Plans

1. **If Neon has extended outage**: Environment variable to switch to local PostgreSQL for development
2. **If Resend quota exceeded**: Queue emails, implement daily digest mode
3. **If PDF generation consistently fails**: Offer HTML-to-PDF browser print as fallback

## Timeline & Milestones

| Phase | Estimated Duration | Milestone | Deliverable |
|-------|-------------------|-----------|-------------|
| Phase 1: Setup | 1 day | Project scaffolded | AdonisJS + Inertia + Shadcn configured |
| Phase 2: Foundational | 3 days | Auth + DB ready | Login, Register, Migrations, Models |
| Phase 3: US1 - Create Proposal | 5 days | **MVP Demo** | Live builder with split-screen preview |
| Phase 4: US2 - Publish | 3 days | Public URLs live | Publishing + Contact form + Leads |
| Phase 5: US3 - Design | 2 days | Customization ready | Colors, fonts, layout options |
| Phase 6: US4 - PDF | 2 days | Export functional | PDF generation service |
| Phase 7: US5 - Analytics | 3 days | CRM ready | Dashboard + Lead management |
| Phase 8: Polish | 2 days | Production ready | Security hardening, performance optimization |

**Total Estimated Duration**: 21 working days (~4 weeks)

**MVP Checkpoint**: After Phase 3 (9 days) - Users can create and edit proposals with live preview

## External Services & Costs

| Service | Tier | Monthly Cost | Limits | Fallback |
|---------|------|--------------|--------|----------|
| **Neon** | Free | $0 | 0.5 GB storage, 10 branches | Local PostgreSQL |
| **Resend** | Free | $0 | 3,000 emails/month | In-app notifications |
| **Vercel** (optional) | Free | $0 | 100 GB bandwidth | Railway, Render |

**Estimated Monthly Cost for MVP**: $0 (all free tiers)

## Next Steps

Run `/speckit.tasks` to generate the implementation task list from this plan.

# Product Requirements Document: Spons Easy MVP

---

## Document Info

**Author**: Product Team
**Date Created**: 2025-11-25
**Last Updated**: 2025-11-25
**Status**: Approved
**Version**: 1.0.0
**Stakeholders**: Engineering Lead, Design Lead, Marketing

---

## 1. Executive Summary

Spons Easy is a sponsorship proposal management platform that enables content creators, event organizers, and associations to create professional sponsorship decks through an intuitive live builder interface and publish them as interactive websites. The platform addresses the critical pain point of time-consuming, unprofessional sponsorship outreach that prevents creators and organizations from monetizing their audiences effectively.

The MVP focuses on delivering immediate value through a **5-minute time-to-value** promise: users should be able to create and publish their first professional sponsorship proposal within 5 minutes of signing up. This is achieved through a split-screen builder with real-time preview, pre-designed templates, and one-click publishing to shareable URLs.

**TL;DR**:

- **What**: Live builder for sponsorship proposals with web publishing
- **Why**: Creators lose opportunities due to unprofessional, time-consuming proposal creation
- **Who**: Content creators (50%), associations (30%), event organizers (20%)
- **When**: 30-day MVP development timeline
- **Success**: 50 beta users, 100 proposals generated, NPS > 30

---

## 2. Background and Context

### Problem Statement

Finding sponsors is time-consuming, repetitive, and often ineffective. Creators and organizers spend hours:

- Identifying the right brands to contact (out of scope for MVP)
- Writing personalized proposals from scratch
- Creating professional-looking decks without design skills
- Following up on negotiations without tracking tools
- Managing contractual documentation

**Quantified Pain**:

- Content creators spend 10+ hours/week on administrative tasks instead of content creation
- Event organizers lose EUR 15,000+ deals due to slow proposal turnaround
- Associations send informal requests that look unprofessional, resulting in <5% response rates

### Opportunity

The creator economy is growing rapidly, with micro-influencers (10K-100K followers) representing the fastest-growing segment. These creators desperately need professional tools but cannot afford enterprise solutions or agencies. Similarly, associations and event organizers lack dedicated sponsorship resources.

**Market Gap**: No affordable, easy-to-use tool specifically designed for sponsorship proposal creation with web publishing capabilities.

### Goals

**Business Goals**:

- **BG-001**: Acquire 50 beta users within 2 weeks of launch
- **BG-002**: Generate 100 proposals within first month
- **BG-003**: Achieve NPS > 30 from beta users
- **BG-004**: Validate product-market fit before scaling investment

**User Goals**:

- **UG-001**: Create first proposal in under 5 minutes (time-to-value)
- **UG-002**: Publish professional proposals without design skills
- **UG-003**: Track sponsor engagement and manage leads in one place
- **UG-004**: Export proposals for offline sharing (PDF)

### Success Metrics

**Primary Metric**: Time to first published proposal (target: <5 minutes)

**Secondary Metrics**:

| Metric                             | Target | Current | How Measured      |
| ---------------------------------- | ------ | ------- | ----------------- |
| Beta user signups                  | 50     | 0       | Database count    |
| Proposals generated                | 100    | 0       | Database count    |
| Activation rate (1st proposal)     | 40%    | N/A     | Proposals/Signups |
| Week 1 retention                   | 50%    | N/A     | Return visits     |
| NPS score                          | >30    | N/A     | In-app survey     |
| Published proposal views           | 500+   | 0       | View counter      |
| Lead conversion (form submissions) | 5%     | N/A     | Leads/Views       |

---

## 3. User Research and Insights

### Target Users

**Primary Persona: Content Creator Clara (50% of users)**

| Attribute          | Value                      |
| ------------------ | -------------------------- |
| Age                | 24-32                      |
| Income             | EUR 25,000-50,000/year     |
| Audience           | 10,000-100,000 followers   |
| Platform           | YouTube, Instagram, TikTok |
| Tech Savvy         | High                       |
| Budget Sensitivity | High                       |

- **Goals**: Generate EUR 2,000+/month from sponsorships, look professional
- **Pain Points**: Does not know how to price, proposals look amateur, wastes hours on pitches
- **Jobs-to-be-Done**: "When a brand I love launches a product, I want to create a compelling proposal quickly, so I can reach out before their budget is spent."

**Secondary Persona: Association Administrator Alice (30% of users)**

| Attribute          | Value                             |
| ------------------ | --------------------------------- |
| Age                | 25-40                             |
| Role               | President/Secretary (volunteer)   |
| Organization       | Sports club, cultural association |
| Tech Savvy         | Variable                          |
| Budget Sensitivity | Very High                         |

- **Goals**: Secure EUR 3,000-10,000 in annual sponsorships
- **Pain Points**: No idea how to write proposals, feels like "begging"
- **Jobs-to-be-Done**: "When our association needs funding, I want to create a professional proposal, so I can approach businesses with confidence."

**Tertiary Persona: Event Organizer Eric (20% of users)**

| Attribute          | Value               |
| ------------------ | ------------------- |
| Age                | 32-45               |
| Role               | Event Director      |
| Event Size         | 200-2,000 attendees |
| Tech Savvy         | Moderate            |
| Budget Sensitivity | Moderate            |

- **Goals**: Fill sponsorship tiers faster, increase deal sizes
- **Pain Points**: Creates proposals from scratch for each event, no visibility on conversion
- **Jobs-to-be-Done**: "When planning an event, I want to generate professional packages quickly, so I can start outreach before competitors."

### User Research Summary

**Methods**: Constitution analysis, competitive research, persona development using JTBD framework

**Key Findings**:

1. **Finding 1**: Users spend 10+ hours creating a single sponsorship proposal manually
2. **Finding 2**: 80% of creators feel their proposals look unprofessional compared to larger creators
3. **Finding 3**: Associations have <5% response rate on sponsorship requests
4. **Finding 4**: The "5-minute time-to-value" promise resonates strongly with all personas

---

## 4. User Stories and Use Cases

### User Story 1: Create Sponsorship Proposal (Priority: P1 - Must Have)

**As a** sponsorship seeker,
**I want to** create a professional sponsorship proposal using a live builder,
**So that** I can quickly produce compelling decks to attract sponsors.

**Acceptance Criteria**:

- [ ] Given I am logged in, when I click "Create New Proposal", then I see a split-screen interface with a form on the left and a live preview on the right
- [ ] Given I am in the proposal builder, when I type in any form field, then the preview updates within 500ms to reflect my changes
- [ ] Given I am creating a proposal, when I add sponsorship tiers with different benefit levels, then each tier appears in the preview with its associated benefits
- [ ] Given I am editing a proposal, when I upload images or logos, then they appear immediately in the preview
- [ ] Given I have unsaved changes, when I navigate away from the builder, then I am prompted to save my work
- [ ] Given I am editing, when 30 seconds pass without manual save, then the system auto-saves my work

**Priority**: Must Have (P1)
**Effort**: Large (Phase 3 - ~33 tasks)

---

### User Story 2: Publish Proposal as Website (Priority: P2 - Must Have)

**As a** sponsorship seeker,
**I want to** publish my proposal as an interactive website,
**So that** potential sponsors can view and interact with it online.

**Acceptance Criteria**:

- [ ] Given I have a completed proposal, when I click "Publish", then my proposal becomes accessible at a unique public URL (format: `/p/:slug`)
- [ ] Given my proposal is published, when a sponsor visits the URL, then they see the full proposal with all content and styling intact
- [ ] Given a sponsor views my published proposal, when they fill the contact form, then their inquiry is captured and I receive an email notification
- [ ] Given my proposal is published, when I make edits in the builder, then I can choose to update the published version or keep changes as draft
- [ ] Given my proposal is published, when I click "Unpublish", then the public URL shows "proposal no longer available"

**Priority**: Must Have (P2)
**Effort**: Medium (Phase 4 - ~14 tasks)

---

### User Story 3: Customize Proposal Design (Priority: P3 - Should Have)

**As a** sponsorship seeker,
**I want to** customize the design of my proposal,
**So that** it matches my brand identity and stands out to sponsors.

**Acceptance Criteria**:

- [ ] Given I am in the proposal builder, when I access the settings section, then I see options for colors, typography, and layout
- [ ] Given I am customizing design, when I change the primary color, then the preview immediately updates to show the new color scheme
- [ ] Given I have customized my design, when I publish my proposal, then the published website reflects all my design choices
- [ ] Given I want to start over, when I click "Reset to defaults", then all design settings return to default values

**Priority**: Should Have (P3)
**Effort**: Small (Phase 5 - ~11 tasks)

---

### User Story 4: Export Proposal as PDF (Priority: P4 - Should Have)

**As a** sponsorship seeker,
**I want to** export my proposal as a PDF,
**So that** I can share it offline or attach it to emails.

**Acceptance Criteria**:

- [ ] Given I have a proposal, when I click "Export PDF", then a PDF download starts within 10 seconds
- [ ] Given I export a PDF, when I open it, then it contains all proposal content with proper formatting and images
- [ ] Given I have customized my proposal design, when I export to PDF, then the PDF reflects my design choices (colors, fonts, layout)

**Priority**: Should Have (P4)
**Effort**: Small (Phase 6 - ~9 tasks)

---

### User Story 5: Manage Leads and View Analytics (Priority: P5 - Nice to Have)

**As a** sponsorship seeker,
**I want to** track who views my proposals and manage incoming leads,
**So that** I can follow up effectively with interested sponsors.

**Acceptance Criteria**:

- [ ] Given I have published proposals, when I access the dashboard, then I see a list of my proposals with view metrics
- [ ] Given sponsors have viewed my proposal, when I check analytics, then I see accurate view counts
- [ ] Given a sponsor submitted a contact form, when I view my leads, then I see their contact information and message
- [ ] Given I have leads, when I update a lead's status (new, contacted, pending, converted, rejected), then the status change is saved and reflected in the dashboard
- [ ] Given I have multiple proposals, when I view leads, then I can filter by proposal and by status

**Priority**: Nice to Have (P5)
**Effort**: Small (Phase 7 - ~9 tasks)

---

### Edge Cases

| Scenario                            | Expected Behavior                                                  |
| ----------------------------------- | ------------------------------------------------------------------ |
| User publishes incomplete proposal  | System displays validation errors indicating required fields       |
| Large image upload (>10MB)          | File rejected with clear error message                             |
| Session expires while editing       | Auto-save preserves work; users can recover last saved state       |
| Duplicate lead submissions (<5 min) | Detected and consolidated; anti-spam measures active               |
| Published proposal deleted          | Public URL returns friendly "proposal no longer available" message |
| Concurrent edits (same proposal)    | Last save wins; no real-time collaboration in MVP                  |

---

## 5. Functional Requirements

### Must Have (P0 - Launch Blockers)

**Authentication**

| ID     | Requirement                                                            | Rationale           |
| ------ | ---------------------------------------------------------------------- | ------------------- |
| FR-001 | System MUST provide email/password registration                        | Core access control |
| FR-002 | System MUST provide email/password login with session persistence      | User continuity     |
| FR-003 | System MUST ensure users can only access their own proposals and leads | Data isolation      |

**Proposal Builder**

| ID     | Requirement                                                                                                              | Rationale                    |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| FR-004 | System MUST provide a split-screen interface with form input on the left and live preview on the right                   | Core UX differentiator       |
| FR-005 | System MUST update the preview within 500ms of any form field change                                                     | Real-time feedback           |
| FR-006 | System MUST support guided sections: project description, sponsorship tiers, benefits, contact information, media assets | Structured proposal creation |
| FR-007 | System MUST auto-save proposals every 30 seconds to prevent data loss                                                    | User trust                   |
| FR-008 | System MUST support image uploads for logos and cover images (max 10MB)                                                  | Visual proposals             |

**Sponsorship Tiers**

| ID     | Requirement                                                                                 | Rationale             |
| ------ | ------------------------------------------------------------------------------------------- | --------------------- |
| FR-009 | System MUST allow users to create multiple sponsorship tiers with name, price, and benefits | Core proposal content |
| FR-010 | System MUST support reordering of tiers                                                     | Flexibility           |
| FR-011 | System MUST allow adding/editing/removing benefits for each tier                            | Tier customization    |

**Publishing**

| ID     | Requirement                                                                                   | Rationale           |
| ------ | --------------------------------------------------------------------------------------------- | ------------------- |
| FR-012 | System MUST generate a unique, shareable URL for each published proposal (format: `/p/:slug`) | Distribution        |
| FR-013 | System MUST provide a contact form on each published proposal for sponsor inquiries           | Lead capture        |
| FR-014 | System MUST send email notifications to proposal owners when new leads are received           | Lead responsiveness |
| FR-015 | System MUST allow users to unpublish their proposals at any time                              | Control             |

### Should Have (P1 - Important)

**Design Customization**

| ID     | Requirement                                                                                     | Rationale       |
| ------ | ----------------------------------------------------------------------------------------------- | --------------- |
| FR-016 | System SHOULD provide design customization: primary/secondary colors, typography, logo position | Brand alignment |
| FR-017 | System SHOULD offer layout templates (modern, classic, minimal)                                 | Design variety  |
| FR-018 | System SHOULD apply customizations to both preview and published website                        | Consistency     |

**PDF Export**

| ID     | Requirement                                                                    | Rationale       |
| ------ | ------------------------------------------------------------------------------ | --------------- |
| FR-019 | System SHOULD generate PDF exports that maintain content integrity and styling | Offline sharing |
| FR-020 | System SHOULD complete PDF generation within 10 seconds                        | User experience |

### Nice to Have (P2 - Future)

**Analytics and CRM**

| ID     | Requirement                                                                                 | Rationale           |
| ------ | ------------------------------------------------------------------------------------------- | ------------------- |
| FR-021 | System MAY track and display view counts for published proposals                            | Engagement insights |
| FR-022 | System MAY allow users to update lead status (new, contacted, pending, converted, rejected) | Pipeline management |
| FR-023 | System MAY display all leads in a centralized dashboard with filtering                      | Lead management     |

### Out of Scope (Will Not Have in MVP)

| Feature                                  | Reason                                            |
| ---------------------------------------- | ------------------------------------------------- |
| Marketplace for sponsor-creator matching | Phase 2 feature; requires critical mass           |
| Integrated payments                      | Complex compliance; not core to proposal creation |
| Advanced analytics (funnel, cohorts)     | Overkill for MVP validation                       |
| Multi-language support                   | Focus on French market first                      |
| Native mobile app                        | Responsive web is sufficient for MVP              |
| Real-time collaboration                  | Single-user focus for MVP                         |
| Custom domains for proposals             | Nice-to-have for future premium tier              |
| API access                               | No third-party integrations needed for MVP        |

---

## 6. User Experience (UX)

### User Flows

**Flow 1: New User Onboarding**

```
1. User lands on home page (/)
2. User clicks "Get Started" CTA
3. User fills registration form (name, email, password)
4. System creates account and logs user in
5. User redirected to dashboard (/dashboard)
6. Dashboard shows empty state with "Create First Proposal" CTA
7. User clicks CTA and enters proposal builder
```

**Flow 2: Create and Publish Proposal**

```
1. User clicks "Create New Proposal" from dashboard
2. System shows split-screen builder (form left, preview right)
3. User fills basic info (title, project name, contact email)
4. Preview updates in real-time as user types
5. User adds sponsorship tiers with prices and benefits
6. User uploads logo and cover image
7. User clicks "Publish"
8. System validates required fields
9. System generates unique URL and publishes
10. User sees success message with shareable link
```

**Flow 3: Sponsor Views Proposal and Submits Interest**

```
1. Sponsor receives link via email/social
2. Sponsor opens public proposal URL (/p/:slug)
3. Sponsor views project info, tiers, and benefits
4. Sponsor scrolls to contact form
5. Sponsor fills form (name, email, company, message, interested tier)
6. System captures lead and sends notification to proposal owner
7. Sponsor sees confirmation message
```

**Flow 4: Manage Leads**

```
1. Proposal owner receives email notification of new lead
2. Owner logs in and goes to dashboard
3. Owner clicks "Leads" to see all leads
4. Owner reviews lead details (contact info, interested tier, message)
5. Owner updates lead status to "Contacted"
6. Owner adds internal notes
7. Process repeats as lead progresses through pipeline
```

### Wireframes and Mockups

**Key Screens**:

1. **Home Page** (`/`)
   - Hero section with value proposition
   - Feature highlights
   - CTA to register/login

2. **Dashboard** (`/dashboard`)
   - Stats cards (proposals, views, leads)
   - Proposal list with status badges
   - Quick actions (edit, view, publish)

3. **Proposal Builder** (`/proposals/:id/edit`)
   - Split-screen layout (50/50)
   - Left: Tabbed form (Content, Tiers, Media, Contact)
   - Right: Live preview with scroll sync
   - Top bar: Save indicator, Publish button, Settings

4. **Public Proposal** (`/p/:slug`)
   - Hero with cover image and logo
   - Project description
   - Sponsorship tiers grid
   - Contact form (sticky or section)

5. **Leads Dashboard** (`/dashboard/leads`)
   - Filter bar (status, proposal)
   - Data table with columns: Name, Email, Company, Proposal, Tier, Status, Date
   - Status dropdown for quick updates

### Information Architecture

```
/                           Home (public)
/login                      Login (guest)
/register                   Register (guest)
/dashboard                  Dashboard (auth)
/dashboard/leads            All Leads (auth)
/proposals                  Proposal List (auth)
/proposals/create           Create Proposal (auth)
/proposals/:id              View Proposal (auth)
/proposals/:id/edit         Edit Proposal (auth)
/proposals/:id/settings     Design Settings (auth)
/p/:slug                    Public Proposal (public)
```

### Design System

**Components (Shadcn/ui)**:

- Button, Input, Form, Dialog
- Table, Card, Tabs, Toast
- Textarea, Select, Sheet, Label

**Style Guide**:

- Primary font: Inter
- Colors: Customizable per proposal (default: blue primary)
- Spacing: Tailwind defaults
- Responsive: Mobile-first, breakpoints at sm/md/lg/xl

**Accessibility**:

- WCAG 2.1 AA compliance target
- Keyboard navigation for all interactive elements
- ARIA labels on form fields
- Color contrast ratios >4.5:1

---

## 7. Technical Requirements

### Architecture Overview

**Stack**: AdonisJS 6 (Backend) + Inertia.js + React 18 (Frontend) + PostgreSQL (Neon)

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│  ┌─────────────────────────────────────────────┐    │
│  │         React + Inertia.js Client           │    │
│  │  - Pages (Inertia)                          │    │
│  │  - Components (Shadcn/ui)                   │    │
│  │  - Hooks (useAutosave, useProposalPreview)  │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                          │
                          │ HTTP/Inertia Protocol
                          ▼
┌─────────────────────────────────────────────────────┐
│                AdonisJS 6 Server                    │
│  ┌─────────────────────────────────────────────┐    │
│  │              Inertia Adapter                │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │              Controllers                     │    │
│  │  - Auth (Login, Register, Logout)           │    │
│  │  - Proposals (CRUD, Publish, Export)        │    │
│  │  - Tiers, Benefits, Leads                   │    │
│  │  - Uploads, Public                          │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │              Services                        │    │
│  │  - PdfService (generation)                  │    │
│  │  - EmailService (notifications)             │    │
│  └─────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────┐    │
│  │         Lucid ORM (Models)                  │    │
│  │  - User, Proposal, Tier, Benefit, Lead      │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
                          │
                          │ SQL
                          ▼
┌─────────────────────────────────────────────────────┐
│              PostgreSQL (Neon Serverless)           │
│  - Branch: main (production)                        │
│  - Branch: dev (development)                        │
└─────────────────────────────────────────────────────┘
```

### Data Model

**Entity Relationship**:

```
User (1) ──────< Proposal (many)
Proposal (1) ──────< Tier (many)
Proposal (1) ──────< Lead (many)
Tier (1) ──────< Benefit (many)
Lead (many) >────── Tier (1) [optional: interested_tier_id]
```

**Key Entities**:

| Entity       | Fields                                                                                                                                                                    | Purpose           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| **User**     | id, email, password, fullName, createdAt                                                                                                                                  | Account holder    |
| **Proposal** | id, userId, title, slug, description, projectName, projectDescription, logoUrl, coverImageUrl, contactEmail, contactPhone, status, publishedAt, viewCount, designSettings | Sponsorship deck  |
| **Tier**     | id, proposalId, name, price, currency, description, isFeatured, maxSponsors, position                                                                                     | Sponsorship level |
| **Benefit**  | id, tierId, description, position                                                                                                                                         | Tier perk         |
| **Lead**     | id, proposalId, name, email, company, phone, message, interestedTierId, status, notes                                                                                     | Potential sponsor |

**Enums**:

- `ProposalStatus`: draft, published, archived
- `LeadStatus`: new, contacted, pending, converted, rejected

**Design Settings JSON Schema**:

```json
{
  "primaryColor": "#3B82F6",
  "secondaryColor": "#1E40AF",
  "fontFamily": "Inter",
  "logoPosition": "left",
  "layout": "modern"
}
```

### API Specifications

**Authentication**

| Method | Endpoint    | Auth  | Description               |
| ------ | ----------- | ----- | ------------------------- |
| GET    | `/login`    | Guest | Display login form        |
| POST   | `/login`    | Guest | Authenticate user         |
| GET    | `/register` | Guest | Display registration form |
| POST   | `/register` | Guest | Create account            |
| POST   | `/logout`   | Auth  | End session               |

**Proposals**

| Method | Endpoint                    | Auth | Description           |
| ------ | --------------------------- | ---- | --------------------- |
| GET    | `/proposals`                | Auth | List user's proposals |
| GET    | `/proposals/create`         | Auth | New proposal builder  |
| POST   | `/proposals`                | Auth | Create proposal       |
| GET    | `/proposals/:id`            | Auth | View proposal         |
| GET    | `/proposals/:id/edit`       | Auth | Edit builder          |
| PUT    | `/proposals/:id`            | Auth | Update proposal       |
| DELETE | `/proposals/:id`            | Auth | Delete proposal       |
| PATCH  | `/proposals/:id/autosave`   | Auth | Auto-save draft       |
| POST   | `/proposals/:id/publish`    | Auth | Publish               |
| POST   | `/proposals/:id/unpublish`  | Auth | Unpublish             |
| GET    | `/proposals/:id/settings`   | Auth | Design settings       |
| PUT    | `/proposals/:id/settings`   | Auth | Update design         |
| GET    | `/proposals/:id/export-pdf` | Auth | Generate PDF          |

**Tiers**

| Method | Endpoint                               | Auth | Description |
| ------ | -------------------------------------- | ---- | ----------- |
| POST   | `/proposals/:proposalId/tiers`         | Auth | Add tier    |
| PUT    | `/proposals/:proposalId/tiers/:id`     | Auth | Update tier |
| DELETE | `/proposals/:proposalId/tiers/:id`     | Auth | Remove tier |
| POST   | `/proposals/:proposalId/tiers/reorder` | Auth | Reorder     |

**Benefits**

| Method | Endpoint                      | Auth | Description |
| ------ | ----------------------------- | ---- | ----------- |
| POST   | `/tiers/:tierId/benefits`     | Auth | Add benefit |
| PUT    | `/tiers/:tierId/benefits/:id` | Auth | Update      |
| DELETE | `/tiers/:tierId/benefits/:id` | Auth | Remove      |

**Leads**

| Method | Endpoint                       | Auth | Description   |
| ------ | ------------------------------ | ---- | ------------- |
| GET    | `/proposals/:proposalId/leads` | Auth | List leads    |
| GET    | `/leads/:id`                   | Auth | View lead     |
| PUT    | `/leads/:id`                   | Auth | Update status |
| DELETE | `/leads/:id`                   | Auth | Delete        |

**Public**

| Method | Endpoint           | Auth   | Description             |
| ------ | ------------------ | ------ | ----------------------- |
| GET    | `/`                | Public | Home page               |
| GET    | `/p/:slug`         | Public | View published proposal |
| POST   | `/p/:slug/contact` | Public | Submit contact form     |

### Performance Requirements

| Metric              | Target      | Measurement         |
| ------------------- | ----------- | ------------------- |
| Page Load (Desktop) | <3 seconds  | Lighthouse          |
| Page Load (Mobile)  | <4 seconds  | Lighthouse          |
| Preview Update      | <500ms      | In-app timing       |
| PDF Generation      | <10 seconds | Server logs         |
| API Response (p95)  | <200ms      | Application metrics |
| Uptime              | 99.5%       | External monitoring |

### Security Requirements

| Requirement      | Implementation                                     |
| ---------------- | -------------------------------------------------- |
| Authentication   | Session-based (AdonisJS Auth with scrypt hashing)  |
| Authorization    | Ownership check on all resources                   |
| CSRF Protection  | XSRF cookie enabled                                |
| Input Validation | Vine validators on all endpoints                   |
| Rate Limiting    | Contact form: 5 requests/minute                    |
| File Upload      | Max 10MB, image types only, server-side validation |
| SQL Injection    | Prevented by Lucid ORM parameterized queries       |
| XSS              | React auto-escaping, CSP headers                   |
| HTTPS            | Required (Neon SSL)                                |

### Scalability and Infrastructure

**Initial Scale**:

- Expected: 50-100 users, 200 proposals
- Database: Neon free tier sufficient
- Storage: Local file storage (MVP), migrate to S3 later
- Hosting: Railway or Vercel

**Future Scaling Path**:

1. Move file uploads to S3/Cloudflare R2
2. Add Redis for session storage
3. Implement CDN for static assets
4. Database connection pooling

---

## 8. Analytics and Tracking

### Analytics Platform: PostHog

**Why PostHog**:
- Open-source, GDPR-compliant (EU hosting available)
- Free tier: 1M events/month (sufficient for MVP)
- Built-in: Event tracking, funnels, session replay, feature flags
- Self-hostable option for future data sovereignty

**Implementation**:
- Package: `posthog-js`
- Host: `https://eu.posthog.com` (EU data residency)
- Integration: Client-side via Inertia/React

### Event Tracking

| Event                 | Trigger           | Properties                    | Purpose       |
| --------------------- | ----------------- | ----------------------------- | ------------- |
| `user_registered`     | Account created   | userId, source                | Acquisition   |
| `proposal_created`    | New proposal      | userId, proposalId            | Activation    |
| `proposal_published`  | Publish clicked   | userId, proposalId, tierCount | Activation    |
| `proposal_viewed`     | Public page load  | proposalId, referrer          | Engagement    |
| `lead_submitted`      | Contact form sent | proposalId, tierId            | Conversion    |
| `lead_status_changed` | Status update     | leadId, fromStatus, toStatus  | Pipeline      |
| `pdf_exported`        | PDF download      | proposalId                    | Feature usage |

### Dashboards

**Product Dashboard** (MVP):

- Daily active users
- Proposals created (total, by day)
- Proposals published (total, by day)
- Leads received (total, by day)
- Conversion funnel: Signup -> Create -> Publish -> Lead

### A/B Testing Plan (Post-MVP)

**Test 1**: Onboarding Flow

- **Hypothesis**: Guided onboarding increases activation rate
- **Variants**: A (current), B (step-by-step wizard)
- **Metric**: First proposal created within 24h
- **Sample Size**: 100 users per variant

---

## 9. Launch Plan

### Rollout Strategy

**Phase 1: Internal Testing** (Days 1-3)

- Audience: Development team (5 users)
- Goal: Catch critical bugs, verify core flows
- Success: All user stories complete E2E

**Phase 2: Closed Beta** (Days 4-14)

- Audience: Hand-picked beta users (20 users)
- Goal: Validate time-to-value, gather feedback
- Success: 40%+ create first proposal within 24h

**Phase 3: Open Beta** (Days 15-30)

- Audience: Waitlist signups (50+ users)
- Goal: Scale testing, iterate on feedback
- Success: 100 proposals generated, NPS > 30

### Marketing and Communication

| Channel                     | Date    | Content      |
| --------------------------- | ------- | ------------ |
| Product Hunt                | Day 21  | Launch post  |
| Creator Discord communities | Day 15+ | Beta invites |
| LinkedIn                    | Day 21  | Founder post |
| Email to waitlist           | Day 15  | Beta access  |

### Training and Documentation

**User Documentation**:

- Quick start guide (in-app)
- FAQ page
- Video walkthrough (2-3 min)

**Support**:

- Email support (founders@sponseasy.com)
- In-app feedback widget

---

## 10. Dependencies and Risks

### Dependencies

**Internal**:

| Dependency                  | Owner       | Status      |
| --------------------------- | ----------- | ----------- |
| AdonisJS 6 + Inertia setup  | Engineering | Not started |
| Neon database provisioning  | Engineering | Not started |
| Email service configuration | Engineering | Not started |
| PDF generation service      | Engineering | Not started |

**External**:

| Dependency      | Provider       | Risk Level           |
| --------------- | -------------- | -------------------- |
| Neon PostgreSQL | Neon.tech      | Low (mature service) |
| Email delivery  | Resend/Mailgun | Low                  |
| Hosting         | Railway/Vercel | Low                  |

### Risks and Mitigation

| Risk                            | Probability | Impact | Mitigation                                   |
| ------------------------------- | ----------- | ------ | -------------------------------------------- |
| Live preview performance issues | Medium      | High   | Debounce updates, optimize re-renders        |
| PDF generation slow/failing     | Medium      | Medium | Async queue, fallback to client-side         |
| Low beta user activation        | Medium      | High   | Improve onboarding, simplify first proposal  |
| Email deliverability issues     | Low         | Medium | Use reputable provider, verify domain        |
| Database connection issues      | Low         | High   | Connection pooling, retry logic              |
| Image upload failures           | Medium      | Low    | Client-side validation, clear error messages |

### Assumptions

- Users have modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Users have basic familiarity with web forms
- Email delivery is reliable via third-party service
- Neon free tier sufficient for MVP scale
- Single-tenant model adequate for MVP

---

## 11. Timeline and Milestones

### Development Timeline (21 Days / ~4 Weeks)

| Phase | Duration | Deliverable |
| ----- | -------- | ----------- |
| **Phase 1: Setup** | 1 day | AdonisJS + Inertia + Shadcn configured |
| **Phase 2: Foundational** | 3 days | Auth + DB ready (Login, Register, Migrations, Models) |
| **Phase 3: US1 - Create Proposal** | 5 days | **MVP Demo** - Live builder with split-screen preview |
| **Phase 4: US2 - Publish** | 3 days | Public URLs live (Publishing + Contact form + Leads) |
| **Phase 5: US3 - Design** | 2 days | Customization ready (Colors, fonts, layout options) |
| **Phase 6: US4 - PDF** | 2 days | Export functional (PDF generation service) |
| **Phase 7: US5 - Analytics** | 3 days | CRM ready (Dashboard + Lead management) |
| **Phase 8: Polish** | 2 days | Production ready (Security hardening, performance) |

**MVP Checkpoint**: After Phase 3 (9 days) - Users can create and edit proposals with live preview

### Task Breakdown (142 Tasks Total)

| Phase | Tasks | Parallel Opportunities |
| ----- | ----- | ---------------------- |
| Setup | 9 | 6 |
| Foundational | 30 | 18 |
| US1 - Create Proposal | 33 | 15 |
| US2 - Publish | 14 | 2 |
| US3 - Design | 11 | 5 |
| US4 - PDF Export | 9 | 0 |
| US5 - Leads/Analytics | 9 | 3 |
| Polish | 27 | 4 |

**Full task breakdown**: See `/specs/001-proposal-builder/tasks.md`

### Critical Path

1. **Database migrations** (blocks all models)
2. **Auth system** (blocks all protected routes)
3. **Proposal model** (blocks builder, publishing, leads)
4. **Builder UI** (blocks publishing)
5. **Publishing** (blocks lead capture)

---

## 12. Success Criteria and Definition of Done

### Definition of Done (DoD)

**Code Quality**:

- [ ] All P0 requirements implemented
- [ ] TypeScript strict mode, no type errors
- [ ] Biome lint passing (0 errors)
- [ ] Code reviewed

**Testing**:

- [ ] All user stories manually tested
- [ ] E2E happy path verified
- [ ] Edge cases handled gracefully

**Security**:

- [ ] Authentication working
- [ ] Authorization checks on all routes
- [ ] Input validation on all forms
- [ ] CSRF protection enabled

**Performance**:

- [ ] Page load <3s (desktop)
- [ ] Preview updates <500ms
- [ ] No console errors

**Documentation**:

- [ ] README updated
- [ ] Environment variables documented
- [ ] API endpoints documented in code

### Go/No-Go Criteria

**Launch if**:

- All P0 requirements complete
- No critical bugs (P0/P1)
- 5-minute time-to-value achievable
- Email notifications working
- PDF export functional

**Do NOT launch if**:

- Data loss possible (auto-save broken)
- Security vulnerabilities exist
- Publishing broken
- Lead capture failing
- Performance below targets

---

## 13. Post-Launch Plan

### Monitoring (First 30 Days)

| Period     | Focus              | Frequency |
| ---------- | ------------------ | --------- |
| Days 1-3   | Critical bugs      | Real-time |
| Days 4-7   | User feedback      | Daily     |
| Days 8-14  | Activation metrics | Daily     |
| Days 15-30 | Retention, NPS     | Weekly    |

### Iteration Plan

**Iteration 1** (Week 5-6):

- Address critical user feedback
- Fix bugs discovered in beta
- Improve onboarding based on activation data

**Iteration 2** (Week 7-8):

- P2 features (advanced analytics)
- Performance optimizations
- Prepare for public launch

### Success Validation

**Product-Market Fit Signals**:

- Activation rate >40%
- Week 1 retention >50%
- NPS >30
- Users share proposals organically
- Inbound feature requests

**Pivot Triggers**:

- Activation rate <20% after 2 weeks
- NPS <0
- No organic sharing
- Users say "doesn't solve my problem"

---

## 14. Open Questions and Decisions

| Question          | Status   | Options                                           | Decision                |
| ----------------- | -------- | ------------------------------------------------- | ----------------------- |
| Free tier limits? | Pending  | 1 proposal free, unlimited free, 3 proposals free | TBD after beta feedback |
| Pricing model?    | Pending  | Freemium, paid-only, usage-based                  | TBD after validation    |
| Custom domains?   | Deferred | Include in MVP, Phase 2 feature                   | Phase 2                 |
| Multi-language?   | Deferred | French-only MVP, English + French                 | French-only MVP         |

---

## 15. Appendix

### Technical Specifications (Source of Truth)

All technical implementation details are maintained in `/specs/001-proposal-builder/`:

| Document | Path | Description |
| -------- | ---- | ----------- |
| **Feature Spec** | `spec.md` | User stories, acceptance criteria, requirements |
| **Data Model** | `data-model.md` | Database schema, entities, relationships, migrations |
| **API Routes** | `contracts/api-routes.md` | All endpoints, request/response schemas, rate limits |
| **Inertia Pages** | `contracts/inertia-pages.md` | Page components, props, component organization |
| **Implementation Plan** | `plan.md` | Technical decisions, risks, project structure |
| **Task Breakdown** | `tasks.md` | 142 implementation tasks with dependencies |
| **Research** | `research.md` | Technology decisions and rationale |
| **Quickstart** | `quickstart.md` | Setup guide for new developers |

### Technical Docs

- AdonisJS 6: https://docs.adonisjs.com/
- Inertia.js: https://inertiajs.com/
- Shadcn/ui: https://ui.shadcn.com/
- Neon: https://neon.tech/docs/

### References

- Personas: `/.ideabrowser/personas.md`
- Constitution: `/.ideabrowser/constitution.md`

---

## 16. Changelog

| Date       | Version | Author       | Changes                                          |
| ---------- | ------- | ------------ | ------------------------------------------------ |
| 2025-11-25 | 1.0.0   | Product Team | Initial PRD created from specification documents |

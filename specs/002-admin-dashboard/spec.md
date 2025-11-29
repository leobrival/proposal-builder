# Feature Specification: Admin Dashboard

**Feature Branch**: `002-admin-dashboard`
**Created**: 2025-11-26
**Status**: Draft
**Input**: User description: "Create admin dashboard"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Platform Overview with KPI Metrics (Priority: P1)

As a Spons Easy platform administrator, I want to see a comprehensive overview of platform activity with key AARRR metrics so that I can quickly understand business health, track North Star metrics, and make data-driven decisions.

**Why this priority**: This is the fundamental dashboard functionality. Without this overview, administrators cannot monitor platform performance, track the North Star metric (Proposals Published), or identify trends in Acquisition, Activation, Retention, Revenue, and Referral metrics.

**Independent Test**: Can be tested by verifying that all KPI metrics display correctly with real database data, charts render properly using shadcn/ui Area Charts, and trend calculations match expected values.

**Acceptance Scenarios**:

1. **Given** I am logged in as an administrator, **When** I access the admin dashboard, **Then** I see the North Star metric (Proposals Published) prominently displayed with current value, target, and trend status.
2. **Given** I am on the admin dashboard, **When** I view the AARRR metrics cards, **Then** I see:
   - **Acquisition**: Total users, Registration conversion rate, Website visitors
   - **Activation**: Activation rate (users with 1st published proposal / total signups), Time to first proposal
   - **Retention**: Week 1 retention, DAU/MAU stickiness ratio, Monthly churn rate
   - **Revenue**: MRR, ARPU, Free-to-Paid conversion rate, LTV:CAC ratio
   - **Referral**: NPS score, K-factor (viral coefficient)
3. **Given** I am viewing the dashboard, **When** I look at the Area Charts (using shadcn/ui), **Then** I see trend visualizations for the last 7/30/90 days with period selector.
4. **Given** I am on the dashboard, **When** new registrations or proposals are created, **Then** the counters update upon page refresh.
5. **Given** I am viewing metrics, **When** a metric crosses a threshold (green/yellow/red as defined in KPI dashboard spec), **Then** I see a visual alert indicator.

---

### User Story 2 - Manage Users (Priority: P2)

As an administrator, I want to view and manage registered users so that I can provide support, resolve issues, track user segments, and moderate accounts when necessary.

**Why this priority**: User management is essential for customer support and moderation, but comes after the overview that provides global context. This directly supports GTM goals of understanding user personas (Clara 50%, Alice 30%, Eric 20%).

**Independent Test**: Can be tested by navigating to the user list, performing searches/filters, viewing user details, and verifying user actions work correctly.

**Acceptance Scenarios**:

1. **Given** I am on the admin dashboard, **When** I click on "Users", **Then** I see a paginated list of all users with: name, email, registration date, proposal count, subscription tier (Free/Pro/Business), and activation status.
2. **Given** I am on the user list, **When** I search by email or name, **Then** the list filters to show only matching users.
3. **Given** I am on the user list, **When** I filter by subscription tier, **Then** I see only users on that tier (useful for tracking Free-to-Pro conversion).
4. **Given** I am on the user list, **When** I click on a user, **Then** I see their detailed profile including:
   - All proposals with status (draft/published/archived)
   - All leads received with status
   - Subscription history and billing status
   - Activity timeline (key events)
   - User persona category (Creator/Association/Event Organizer if tagged)
5. **Given** I am viewing a user, **When** I want to deactivate their account, **Then** I can deactivate it and the user cannot log in anymore.
6. **Given** I attempt to deactivate my own admin account, **When** I confirm the action, **Then** the system blocks this action with an error message.

---

### User Story 3 - Monitor Proposals (Priority: P3)

As an administrator, I want to view all proposals created on the platform so that I can monitor content quality, track publishing rates (key activation metric), and identify potentially problematic content.

**Why this priority**: Proposal monitoring enables quality control and directly tracks the North Star metric (Proposals Published). It comes after user management as it provides content-level insights.

**Independent Test**: Can be tested by navigating to the proposal list, filtering by status, viewing proposal details, and verifying admin actions work correctly.

**Acceptance Scenarios**:

1. **Given** I am on the admin dashboard, **When** I click on "Proposals", **Then** I see a paginated list of all proposals with: title, author name, status (draft/published/archived), creation date, view count, and lead count.
2. **Given** I am on the proposal list, **When** I filter by status, **Then** the list shows only proposals with that status.
3. **Given** I am on the proposal list, **When** I search by title or author name, **Then** the list filters accordingly.
4. **Given** I click on a proposal, **When** the details page loads, **Then** I see:
   - Full proposal content (tiers, benefits, contact info)
   - All leads generated with details
   - View statistics over time (Area Chart)
   - Publishing rate (time from creation to publish)
5. **Given** I identify a problematic proposal, **When** I force-unpublish it, **Then** it becomes inaccessible publicly and the owner is notified.
6. **Given** any admin action on a proposal, **When** the action completes, **Then** an audit log entry is created.

---

### User Story 4 - Track Revenue & Subscription Metrics (Priority: P4)

As an administrator, I want to see detailed revenue analytics and subscription metrics so that I can track MRR growth, monitor churn, and validate pricing strategy effectiveness.

**Why this priority**: Revenue tracking is critical for business sustainability but builds on the foundation of user and proposal monitoring. Directly supports pricing strategy validation.

**Independent Test**: Can be tested by viewing revenue dashboards, verifying calculations match Stripe data, and checking chart accuracy.

**Acceptance Scenarios**:

1. **Given** I am on the Revenue section, **When** I view the overview, **Then** I see:
   - MRR (Monthly Recurring Revenue) with trend
   - ARR (Annual Recurring Revenue)
   - MRR breakdown: New MRR + Expansion MRR - Churned MRR
   - ARPU (Average Revenue Per User)
   - Free-to-Paid conversion rate
   - LTV:CAC ratio
2. **Given** I am viewing revenue metrics, **When** I select a time period, **Then** I see an Area Chart showing MRR evolution with the waterfall breakdown.
3. **Given** I am on the subscription analytics page, **When** I view the data, **Then** I see:
   - Active subscriptions by tier (Free/Pro/Business)
   - New subscriptions this period
   - Upgrades and downgrades
   - Cancellations with reasons (if provided)
4. **Given** revenue metrics are calculated, **When** I compare with targets from pricing strategy, **Then** I see status indicators (on-track/behind/ahead).

---

### User Story 5 - View GTM & Growth Analytics (Priority: P5)

As an administrator, I want to see GTM (Go-To-Market) performance metrics so that I can track launch progress, channel effectiveness, and growth trajectory against OKRs.

**Why this priority**: GTM analytics enable strategic decision-making but are less critical for daily operations. Important for validating launch strategy and channel mix.

**Independent Test**: Can be tested by viewing GTM dashboards and verifying metrics align with defined OKRs and targets.

**Acceptance Scenarios**:

1. **Given** I am on the GTM Analytics section, **When** I view acquisition channels, **Then** I see traffic and signups by source (Creator communities, Product Hunt, LinkedIn, SEO, Paid Ads) with CAC per channel.
2. **Given** I am viewing growth metrics, **When** I check OKR progress, **Then** I see NOW phase OKRs status:
   - Waitlist/user signups vs target (50)
   - Beta users activated vs target (40%)
   - Proposals created vs target (100)
   - NPS score vs target (>30)
   - Week 1 retention vs target (>50%)
3. **Given** I am on the growth dashboard, **When** I view the activation funnel, **Then** I see conversion rates at each stage:
   - Signup → Dashboard View (target: >90%)
   - Dashboard → Create Proposal Started (target: >60%)
   - Create → Proposal Saved (target: >50%)
   - Saved → Tiers Added (target: >35%)
   - Tiers → Proposal Published (target: 40%)
4. **Given** I am analyzing referral metrics, **When** I check virality, **Then** I see K-factor, referral participation rate, and "Made with Spons Easy" click-through rate.

---

### Edge Cases

- What happens if an administrator tries to access the dashboard without admin privileges? The system displays a 403 error page and redirects to the login page.
- What happens if the database is empty (no users)? The dashboard displays zeros and a message indicating no data is available yet.
- What happens if an administrator deactivates their own account? The action is blocked with an explicit error message.
- What happens if a user is deleted but has published proposals? Proposals remain accessible but are marked as "deleted user" in admin views.
- What happens if Stripe webhook data is delayed? Revenue metrics show "last updated" timestamp and use cached data with a warning indicator.
- What happens if a metric crosses a critical threshold? An alert badge appears on the dashboard with recommended action.

## Requirements _(mandatory)_

### Functional Requirements

**Authentication & Authorization**

- **FR-001**: The system MUST restrict admin dashboard access to users with the "admin" role.
- **FR-002**: The system MUST display a 403 error and redirect unauthorized users.
- **FR-003**: The system MUST prevent an administrator from deactivating their own account.
- **FR-004**: The system MUST log all admin authentication attempts.

**Dashboard Home (KPI Overview)**

- **FR-005**: The system MUST display the North Star metric (Proposals Published) with current value, target, trend percentage, and status indicator.
- **FR-006**: The system MUST display AARRR metrics cards:
  - Acquisition: Total users, Registration conversion rate
  - Activation: Activation rate, Time to first proposal
  - Retention: Week 1 retention, DAU/MAU, Monthly churn
  - Revenue: MRR, ARPU, Free-to-Paid conversion, LTV:CAC
  - Referral: NPS, K-factor
- **FR-007**: The system MUST display trend Area Charts using shadcn/ui chart components for key metrics.
- **FR-008**: The system MUST support period selection (7 days, 30 days, 90 days) for all time-based metrics.
- **FR-009**: The system MUST calculate and display percentage variations compared to the previous period.
- **FR-010**: The system MUST display threshold status indicators (green/yellow/red) based on KPI dashboard thresholds:
  - Activation Rate: Green >35%, Yellow 20-35%, Red <20%
  - Week 1 Retention: Green >45%, Yellow 30-45%, Red <30%
  - NPS: Green >30, Yellow 10-30, Red <10
  - Monthly Churn: Green <5%, Yellow 5-10%, Red >10%
- **FR-011**: The system MUST display the 5 most recent registrations and 5 most recent proposals.

**User Management**

- **FR-012**: The system MUST display a paginated user list (20 per page by default).
- **FR-013**: The system MUST support user search by name or email.
- **FR-014**: The system MUST support user filtering by subscription tier (Free/Pro/Business).
- **FR-015**: The system MUST support sorting users by registration date, name, or proposal count.
- **FR-016**: The system MUST display detailed user profiles including proposals, leads, subscription history, and activity timeline.
- **FR-017**: The system MUST allow user account deactivation/reactivation.
- **FR-018**: The system MUST maintain an audit log of all administrative actions on user accounts.

**Proposal Monitoring**

- **FR-019**: The system MUST display a paginated proposal list (20 per page by default).
- **FR-020**: The system MUST support proposal filtering by status (draft, published, archived).
- **FR-021**: The system MUST support proposal search by title or author name.
- **FR-022**: The system MUST display full proposal details including tiers, benefits, leads, and view statistics.
- **FR-023**: The system MUST allow forced unpublishing of proposals by administrators.
- **FR-024**: The system MUST record an audit log entry for any administrative action on a proposal.
- **FR-025**: The system MUST display proposal view statistics as an Area Chart over time.

**Revenue & Subscription Analytics**

- **FR-026**: The system MUST display MRR with breakdown (New + Expansion - Churned).
- **FR-027**: The system MUST display ARR, ARPU, and Free-to-Paid conversion rate.
- **FR-028**: The system MUST display LTV:CAC ratio with target comparison.
- **FR-029**: The system MUST display subscription distribution by tier.
- **FR-030**: The system MUST display MRR waterfall chart showing revenue movement.
- **FR-031**: The system MUST show subscription events (new, upgrade, downgrade, cancellation).

**GTM & Growth Analytics**

- **FR-032**: The system MUST display traffic and conversions by acquisition channel.
- **FR-033**: The system MUST display CAC (Customer Acquisition Cost) per channel when data is available.
- **FR-034**: The system MUST display OKR progress against NOW phase targets.
- **FR-035**: The system MUST display the activation funnel with conversion rates at each stage.
- **FR-036**: The system MUST display referral metrics (K-factor, participation rate, Made with Spons Easy clicks).

**Charts & Visualization**

- **FR-037**: The system MUST use shadcn/ui Area Chart components for all trend visualizations.
- **FR-038**: The system MUST support hover interactions to display exact values on charts.
- **FR-039**: The system MUST support responsive chart sizing for different screen widths.

**Accessibility & Security**

- **FR-040**: The system MUST be accessible according to WCAG 2.1 AA standards (keyboard navigation, color contrast, screen reader support).
- **FR-041**: The system MUST include CSRF protection on all POST/DELETE admin actions.
- **FR-042**: The system MUST validate all user inputs server-side before processing.

### Key Entities

- **AdminRole**: Extension of the User model with a `role` field to distinguish administrators from standard users. Possible values: "user", "admin".
- **AdminAction**: Audit log of administrative actions with reference to the admin, action type, target entity, timestamp, and optional metadata/notes.
- **PlatformMetrics**: Aggregated metrics computed for the dashboard. Can be real-time queries or pre-computed cached values with timestamps.
- **SubscriptionEvent**: Record of subscription state changes (created, upgraded, downgraded, cancelled) with timestamps and optional reason.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Administrators can access the dashboard and view all key metrics within 3 seconds of page load.
- **SC-002**: User search by email returns results in under 1 second.
- **SC-003**: 100% of administrative actions (deactivation, unpublishing) are recorded in the audit log.
- **SC-004**: Area Charts display accurate data with less than 1% margin of error compared to database queries.
- **SC-005**: An administrator can find and view the details of a specific user within 30 seconds.
- **SC-006**: Revenue metrics (MRR, ARR, ARPU) match Stripe data with 99% accuracy.
- **SC-007**: Threshold alerts correctly identify metrics outside target ranges with 100% accuracy.
- **SC-008**: The activation funnel correctly calculates conversion rates matching database reality.
- **SC-009**: Admin dashboard has 99.5% availability during business hours (measured monthly).
- **SC-010**: All WCAG 2.1 AA compliance tests pass for admin interface components.

## Assumptions

- A single administrator level is sufficient for MVP (no distinction between super-admin/admin).
- Administrators will be created manually in the database or via a CLI command (no admin creation interface in MVP).
- The number of users and proposals will remain manageable without advanced server-side pagination (< 10,000 entries).
- Analytics do not need to be real-time; a delay of a few minutes is acceptable.
- Internationalization is not required; the admin interface will be in English only.
- The pricing tiers are: Free (EUR 0), Pro (EUR 29/month), Business (EUR 99/month - future).

### MVP Dependencies (Required)

- **Database Only**: All MVP metrics (Phases 1-3) are calculated from database queries only.
- **No PostHog Required**: Channel attribution, funnel analytics, and NPS metrics use placeholder data in MVP.
- **No Stripe Required**: Revenue metrics (MRR, ARPU, LTV) use placeholder data in MVP.

### Post-MVP Integrations (Future)

- **Stripe Integration** (Phase 6+): Required for real revenue metrics (MRR, ARR, subscription events).
- **PostHog Integration** (Phase 7+): Required for real funnel analytics, channel attribution, and NPS tracking.
- **Email Service**: Required for owner notifications when proposals are force-unpublished.

## Technical Notes

### Chart Implementation

The admin dashboard will use **shadcn/ui Area Charts** (https://ui.shadcn.com/charts/area) for all trend visualizations:

- Linear area charts for MRR evolution
- Stacked area charts for traffic by channel
- Gradient area charts for user growth trends

### Metrics Reference

Key metrics definitions from the KPI Dashboard specification:

| Metric                  | Formula                                             | Target               |
| ----------------------- | --------------------------------------------------- | -------------------- |
| Activation Rate         | Users with published proposal / Total signups × 100 | 40%                  |
| Week 1 Retention        | Users returning in Week 1 / Signups × 100           | 50%                  |
| DAU/MAU (Stickiness)    | DAU / MAU × 100                                     | >20%                 |
| Monthly Churn           | Customers lost / Customers at start × 100           | <8%                  |
| MRR                     | SUM(active subscriptions × price)                   | EUR 2,781 (Month 12) |
| ARPU                    | MRR / Paying customers                              | EUR 27               |
| Free-to-Paid Conversion | Paid users / Total users × 100                      | 4%                   |
| LTV                     | ARPU × (1 / Churn Rate)                             | EUR 540              |
| NPS                     | % Promoters - % Detractors                          | >30                  |
| K-Factor                | Avg invites × Invite conversion rate                | 0.3 (NOW)            |

### GTM OKR Targets (NOW Phase)

| Key Result            | Target |
| --------------------- | ------ |
| Waitlist/user signups | 50     |
| Beta users activated  | 40%+   |
| Proposals created     | 100    |
| NPS score             | >30    |
| Week 1 retention      | >50%   |

# KPI Dashboard Specification: Spons Easy

**Document Info**

- **Created**: 2025-11-25
- **Last Updated**: 2025-11-25
- **Version**: 1.0.0
- **Status**: Active
- **Author**: KPI Dashboard Agent

---

## Executive Summary

This document defines the comprehensive KPI dashboard framework for Spons Easy, a sponsorship proposal builder targeting content creators, event organizers, and associations. The dashboard is designed to track product-market fit validation, growth metrics, and business health across the MVP and scale phases.

**Key Dashboard Principles**:

- **Data-driven decisions**: Every metric must be actionable
- **PMF-first**: Prioritize validation metrics before growth metrics
- **Phase-appropriate**: Metrics evolve from NOW (validate) to NEXT (scale) to LATER (expand)
- **5-minute insight**: Executives should understand business health in 5 minutes

---

## 1. North Star Metric

### Definition

**North Star Metric**: **Proposals Published**

A proposal is considered "published" when a user clicks the "Publish" button and the proposal becomes accessible at a public URL (`/p/:slug`).

### Rationale

| Criterion | Why "Proposals Published" Wins |
| --------- | ------------------------------ |
| **Value Delivery** | A published proposal represents completed user value - the 5-minute time-to-value promise fulfilled |
| **Leading Indicator** | Published proposals precede leads, which precede revenue |
| **Actionable** | Low publish rate signals onboarding/builder issues; high rate signals PMF |
| **Simple** | Single number everyone understands |
| **Not Vanity** | Unlike signups, published proposals require real engagement |

### Target and Tracking

| Phase | Target | Timeframe | Current | Status |
| ----- | ------ | --------- | ------- | ------ |
| **NOW (MVP)** | 30 proposals published | Month 1 | 0 | Not Started |
| **NEXT** | 100 proposals published | Month 3 | - | - |
| **LATER** | 500 proposals published | Month 6 | - | - |

**Tracking Frequency**: Daily (dashboard), Weekly (team review), Monthly (board/investor)

**Formula**:

```
Proposals Published = COUNT(proposals WHERE status = 'published')

Publishing Rate = Proposals Published / Total Proposals Created * 100
Target Publishing Rate: >50%
```

---

## 2. Metrics Framework (AARRR Pirate Metrics)

### 2.1 Acquisition Metrics

**Purpose**: Measure how effectively we attract potential users to Spons Easy.

| Metric | Formula | Data Source | Update Frequency | Target | Alert Threshold |
| ------ | ------- | ----------- | ---------------- | ------ | --------------- |
| **Website Visitors** | COUNT(unique_sessions) per period | Plausible/PostHog | Daily | 1,000/month (M3) | <500/month |
| **Waitlist Signups** | COUNT(waitlist_entries) | Database | Daily | 50 (pre-launch) | <30 by Day 14 |
| **New Registrations** | COUNT(users WHERE created_at in period) | Database | Daily | 50/month (M1) | <25/month |
| **Registration Conversion Rate** | Registrations / Visitors * 100 | Calculated | Weekly | >3% | <1.5% |
| **Traffic by Channel** | COUNT(sessions) GROUP BY utm_source | Plausible/PostHog | Weekly | Balanced mix | Single channel >70% |
| **CAC (Customer Acquisition Cost)** | Marketing Spend / New Customers | Finance + DB | Monthly | <EUR 50 (NOW) | >EUR 100 |

**Channel Breakdown Targets** (Month 3):

| Channel | Traffic % | CAC Target | Quality (ICP Match) |
| ------- | --------- | ---------- | ------------------- |
| Organic (SEO) | 30% | EUR 0 | 70%+ |
| Product Hunt | 20% | EUR 0 | 60%+ |
| Creator Communities | 25% | EUR 0-10 | 80%+ |
| LinkedIn/Twitter | 15% | EUR 0 | 70%+ |
| Paid Ads | 10% | EUR 30-50 | 65%+ |

### 2.2 Activation Metrics

**Purpose**: Measure how effectively new users experience the core value proposition.

| Metric | Formula | Data Source | Update Frequency | Target | Alert Threshold |
| ------ | ------- | ----------- | ---------------- | ------ | --------------- |
| **Activation Rate** | Users with 1st published proposal / Total signups * 100 | Database | Daily | 40% | <20% |
| **Time to First Proposal** | AVG(first_proposal_created_at - user_created_at) | Database | Weekly | <10 min | >30 min |
| **Time to First Publish** | AVG(first_proposal_published_at - user_created_at) | Database | Weekly | <30 min | >2 hours |
| **Onboarding Completion Rate** | Users completing onboarding / Total signups * 100 | PostHog | Daily | 70% | <40% |
| **Builder Abandonment Rate** | Started but not saved proposals / Started proposals * 100 | Database | Weekly | <30% | >50% |
| **5-Minute Challenge Rate** | Users publishing in <5 min / Total signups * 100 | Database | Weekly | 25% | <10% |

**Activation Funnel**:

```
Signup (100%)
    |
    v
Dashboard View (95%) -- Target: >90%
    |
    v
Create Proposal Started (70%) -- Target: >60%
    |
    v
Proposal Saved (First Draft) (50%) -- Target: >50%
    |
    v
Tiers Added (40%) -- Target: >35%
    |
    v
Proposal Published (30%) -- Target: 40% (North Star Driver)
```

### 2.3 Retention Metrics

**Purpose**: Measure how effectively we keep users engaged over time.

| Metric | Formula | Data Source | Update Frequency | Target | Alert Threshold |
| ------ | ------- | ----------- | ---------------- | ------ | --------------- |
| **Day 1 Retention** | Users returning Day 1 / Signups * 100 | PostHog | Daily | 60% | <40% |
| **Week 1 Retention** | Users returning Week 1 / Signups * 100 | PostHog | Weekly | 50% | <30% |
| **Month 1 Retention** | Users returning Month 1 / Signups * 100 | PostHog | Monthly | 35% | <20% |
| **DAU (Daily Active Users)** | COUNT(unique users with activity today) | Database | Daily | 30 (M3) | <15 |
| **WAU (Weekly Active Users)** | COUNT(unique users with activity this week) | Database | Weekly | 80 (M3) | <40 |
| **MAU (Monthly Active Users)** | COUNT(unique users with activity this month) | Database | Monthly | 150 (M3) | <75 |
| **DAU/MAU (Stickiness)** | DAU / MAU * 100 | Calculated | Weekly | >20% | <10% |
| **Proposals per User** | AVG(proposals per user) | Database | Weekly | >2.5 | <1.5 |
| **Monthly Churn Rate** | Users lost / Users at start of month * 100 | Database | Monthly | <8% | >15% |

**Cohort Retention Template**:

| Cohort | Month 0 | Month 1 | Month 2 | Month 3 | Month 6 |
| ------ | ------- | ------- | ------- | ------- | ------- |
| Dec 2025 | 100% | 35%+ | 28%+ | 22%+ | 15%+ |
| Jan 2026 | 100% | - | - | - | - |

### 2.4 Revenue Metrics

**Purpose**: Measure financial health and monetization effectiveness.

| Metric | Formula | Data Source | Update Frequency | Target | Alert Threshold |
| ------ | ------- | ----------- | ---------------- | ------ | --------------- |
| **MRR (Monthly Recurring Revenue)** | SUM(active_subscriptions * price) | Stripe | Daily | EUR 2,781 (M12) | <EUR 1,000 (M6) |
| **ARR (Annual Recurring Revenue)** | MRR * 12 | Calculated | Monthly | EUR 33,372 (M12) | <EUR 12,000 (M6) |
| **New MRR** | MRR from new customers this month | Stripe | Monthly | EUR 500+ (M6) | <EUR 200 |
| **Expansion MRR** | MRR from upgrades | Stripe | Monthly | 10% of total MRR | <5% |
| **Churned MRR** | MRR lost from cancellations | Stripe | Monthly | <5% of MRR | >10% |
| **Net MRR Growth** | (New + Expansion - Churned) / Starting MRR * 100 | Calculated | Monthly | >15% | <5% |
| **ARPU (Average Revenue Per User)** | MRR / Paying Customers | Calculated | Monthly | EUR 27 | <EUR 20 |
| **Free-to-Paid Conversion** | Paid users / Total users * 100 | Database | Monthly | 4% | <2% |
| **LTV (Customer Lifetime Value)** | ARPU * (1 / Churn Rate) | Calculated | Monthly | EUR 540 | <EUR 300 |
| **LTV:CAC Ratio** | LTV / CAC | Calculated | Monthly | >3:1 | <2:1 |
| **CAC Payback Period** | CAC / ARPU (months) | Calculated | Monthly | <12 months | >18 months |

**Revenue Projection (Year 1)**:

| Month | Users | Free | Pro (4%) | Pro MRR | Cumulative |
| ----- | ----- | ---- | -------- | ------- | ---------- |
| 1 | 50 | 48 | 2 | EUR 54 | EUR 54 |
| 3 | 85 | 81 | 7 | EUR 189 | EUR 351 |
| 6 | 186 | 177 | 19 | EUR 513 | EUR 1,512 |
| 12 | 901 | 856 | 103 | EUR 2,781 | EUR 10,989 |

### 2.5 Referral Metrics

**Purpose**: Measure organic growth and word-of-mouth effectiveness.

| Metric | Formula | Data Source | Update Frequency | Target | Alert Threshold |
| ------ | ------- | ----------- | ---------------- | ------ | --------------- |
| **NPS (Net Promoter Score)** | % Promoters (9-10) - % Detractors (0-6) | In-app Survey | Monthly | >30 | <10 |
| **K-factor (Viral Coefficient)** | Invites per user * Invite conversion rate | Database | Monthly | 0.3 (NOW), 1.1 (LATER) | <0.1 |
| **Referral Participation Rate** | Users who referred / Total users * 100 | Database | Monthly | 15% | <5% |
| **Referral Conversion Rate** | Referred signups / Referrals sent * 100 | Database | Monthly | 20% | <10% |
| **Organic Sharing Rate** | Proposals shared (no referral code) / Proposals published * 100 | PostHog | Monthly | 30% | <10% |
| **"Made with Spons Easy" Clicks** | Clicks on proposal footer link / Proposal views * 100 | PostHog | Weekly | 5% | <2% |

---

## 3. Dashboard Layout

### 3.1 Executive Summary View (1-Page)

**Purpose**: Board/investor updates, weekly leadership review

**Layout**:

```
+------------------------------------------------------------------+
|                    SPONS EASY KPI DASHBOARD                       |
|                         [Date Range: ____]                        |
+------------------------------------------------------------------+
|                                                                   |
|  NORTH STAR: PROPOSALS PUBLISHED                                  |
|  ================================                                 |
|  Current: [XX] | Target: [XX] | Trend: [+X% MoM] | Status: [OK]   |
|                                                                   |
+------------------------------------------------------------------+
|                          HEADLINES                                |
+------------------------------------------------------------------+
| - MRR: EUR X (+X% MoM)                                            |
| - Active Users: X (+X% MoM)                                       |
| - Activation Rate: X% (Target: 40%)                               |
| - NPS: X (Target: >30)                                            |
+------------------------------------------------------------------+
|                                                                   |
|   +-------------------+  +-------------------+  +----------------+ |
|   | ACQUISITION       |  | ACTIVATION        |  | REVENUE        | |
|   | Signups: XX       |  | Rate: XX%         |  | MRR: EUR XX    | |
|   | CAC: EUR XX       |  | Time-to-value: Xm |  | ARPU: EUR XX   | |
|   | Conv Rate: X%     |  | Onboarding: X%    |  | LTV:CAC: X:1   | |
|   +-------------------+  +-------------------+  +----------------+ |
|                                                                   |
|   +-------------------+  +-------------------+  +----------------+ |
|   | RETENTION         |  | REFERRAL          |  | HEALTH         | |
|   | Week 1: XX%       |  | NPS: XX           |  | Runway: X mo   | |
|   | Churn: X%         |  | K-factor: X.X     |  | Burn: EUR X/mo | |
|   | DAU/MAU: X%       |  | Referrals: X      |  | Cash: EUR X    | |
|   +-------------------+  +-------------------+  +----------------+ |
|                                                                   |
+------------------------------------------------------------------+
|                      KEY WINS THIS PERIOD                         |
| 1. [Win 1]                                                        |
| 2. [Win 2]                                                        |
| 3. [Win 3]                                                        |
+------------------------------------------------------------------+
|                      KEY CHALLENGES                               |
| 1. [Challenge 1] - [Mitigation]                                   |
| 2. [Challenge 2] - [Mitigation]                                   |
+------------------------------------------------------------------+
```

### 3.2 Product Metrics View

**Purpose**: Product team daily/weekly review

**Sections**:

1. **Activation Funnel**
   - Visual funnel chart: Signup -> Dashboard -> Create -> Publish
   - Conversion rates between each step
   - Week-over-week comparison

2. **User Engagement**
   - DAU/WAU/MAU trend lines
   - Stickiness (DAU/MAU) over time
   - Feature usage heatmap

3. **Core Loop Performance**
   - Proposals created vs published (ratio)
   - Tiers added per proposal (avg)
   - Leads received per published proposal (avg)

4. **Performance**
   - Page load times (p50, p95)
   - Preview update latency
   - PDF generation time
   - API response times

### 3.3 Growth Metrics View

**Purpose**: Marketing/growth team weekly review

**Sections**:

1. **Acquisition Channels**
   - Traffic by source (stacked area chart)
   - CAC by channel (bar chart)
   - Conversion rate by channel (table)

2. **Funnel Analytics**
   - Visitor -> Signup conversion
   - Signup -> Activated conversion
   - Free -> Paid conversion

3. **Cohort Analysis**
   - Retention curves by cohort
   - Revenue by cohort
   - Behavior patterns by acquisition source

4. **Virality**
   - Referral program performance
   - Organic sharing metrics
   - "Made with Spons Easy" attribution

### 3.4 Financial Metrics View

**Purpose**: Founder/CFO monthly review, investor updates

**Sections**:

1. **Revenue Overview**
   - MRR waterfall (Starting + New + Expansion - Churned = Ending)
   - ARR trend line
   - Revenue by plan tier

2. **Unit Economics**
   - LTV calculation breakdown
   - CAC trend over time
   - LTV:CAC ratio trend
   - Payback period trend

3. **Subscription Analytics**
   - New subscriptions
   - Upgrades/downgrades
   - Cancellations (with reasons)
   - Trial conversions

4. **Financial Health**
   - Burn rate
   - Runway (months)
   - Cash position
   - Projected break-even

---

## 4. Metric Definitions

### 4.1 Acquisition Metrics

#### Website Visitors

| Attribute | Value |
| --------- | ----- |
| **Definition** | Count of unique browser sessions visiting any Spons Easy page |
| **Formula** | `COUNT(DISTINCT session_id WHERE timestamp IN period)` |
| **Data Source** | Plausible Analytics / PostHog |
| **Update Frequency** | Real-time (dashboard), Daily (reports) |
| **Benchmark** | SaaS average: 10% MoM growth |
| **Target** | 500/month (M1), 1,000/month (M3), 5,000/month (M12) |

#### Registration Conversion Rate

| Attribute | Value |
| --------- | ----- |
| **Definition** | Percentage of website visitors who complete registration |
| **Formula** | `(Registrations / Unique Visitors) * 100` |
| **Data Source** | Plausible + Database (joined on session ID) |
| **Update Frequency** | Weekly |
| **Benchmark** | SaaS landing page: 2-5% |
| **Target** | 3% (cold traffic), 10% (warm traffic from communities) |

#### Customer Acquisition Cost (CAC)

| Attribute | Value |
| --------- | ----- |
| **Definition** | Average cost to acquire one paying customer |
| **Formula** | `Total Sales & Marketing Spend / New Paying Customers` |
| **Data Source** | Finance (spend) + Stripe (customers) |
| **Update Frequency** | Monthly |
| **Benchmark** | B2C SaaS: EUR 50-200; B2B SaaS: EUR 200-500 |
| **Target** | EUR 0-10 (NOW organic), EUR 30-50 (NEXT with paid) |

### 4.2 Activation Metrics

#### Activation Rate

| Attribute | Value |
| --------- | ----- |
| **Definition** | Percentage of signups who publish at least one proposal |
| **Formula** | `(Users with published_proposals >= 1 / Total Users) * 100` |
| **Data Source** | Database (users + proposals tables) |
| **Update Frequency** | Daily |
| **Benchmark** | SaaS average: 20-40% |
| **Target** | 40% |

**SQL Query**:

```sql
SELECT
  COUNT(DISTINCT u.id) FILTER (
    WHERE EXISTS (
      SELECT 1 FROM proposals p
      WHERE p.user_id = u.id
      AND p.status = 'published'
    )
  ) * 100.0 / COUNT(DISTINCT u.id) AS activation_rate
FROM users u
WHERE u.created_at >= :start_date
AND u.created_at < :end_date;
```

#### Time to First Proposal

| Attribute | Value |
| --------- | ----- |
| **Definition** | Average time from user registration to first proposal creation |
| **Formula** | `AVG(first_proposal.created_at - user.created_at)` |
| **Data Source** | Database |
| **Update Frequency** | Weekly |
| **Benchmark** | Best-in-class PLG: <5 minutes |
| **Target** | <10 minutes (median), <5 minutes (p25) |

### 4.3 Retention Metrics

#### Week 1 Retention

| Attribute | Value |
| --------- | ----- |
| **Definition** | Percentage of users who return and perform an action within 7 days of signup |
| **Formula** | `(Users with activity in days 1-7 / Users who signed up) * 100` |
| **Data Source** | PostHog events / Database activity logs |
| **Update Frequency** | Weekly |
| **Benchmark** | SaaS average: 40-60% |
| **Target** | 50% |

#### Monthly Churn Rate

| Attribute | Value |
| --------- | ----- |
| **Definition** | Percentage of paying customers who cancel in a given month |
| **Formula** | `(Customers lost this month / Customers at start of month) * 100` |
| **Data Source** | Stripe subscription events |
| **Update Frequency** | Monthly |
| **Benchmark** | B2C SaaS: 5-10%; B2B SaaS: 2-5% |
| **Target** | <8% (monthly), <5% (target for NEXT phase) |

#### DAU/MAU (Stickiness)

| Attribute | Value |
| --------- | ----- |
| **Definition** | Ratio of daily active users to monthly active users, indicating product stickiness |
| **Formula** | `(DAU / MAU) * 100` |
| **Data Source** | PostHog / Database |
| **Update Frequency** | Weekly |
| **Benchmark** | Excellent: >25%; Good: 15-25%; Needs work: <15% |
| **Target** | >20% |

### 4.4 Revenue Metrics

#### Monthly Recurring Revenue (MRR)

| Attribute | Value |
| --------- | ----- |
| **Definition** | Predictable monthly revenue from active subscriptions |
| **Formula** | `SUM(subscription.price WHERE subscription.status = 'active')` |
| **Data Source** | Stripe |
| **Update Frequency** | Daily |
| **Benchmark** | Early-stage: EUR 1K-10K; Growth: EUR 10K-100K |
| **Target** | EUR 2,781 by Month 12 |

**MRR Components**:

```
MRR = New MRR + Expansion MRR + Reactivation MRR - Churned MRR - Contraction MRR

Where:
- New MRR: Revenue from new customers
- Expansion MRR: Revenue from upgrades (e.g., Free -> Pro)
- Reactivation MRR: Revenue from returning customers
- Churned MRR: Revenue lost from cancellations
- Contraction MRR: Revenue lost from downgrades
```

#### Customer Lifetime Value (LTV)

| Attribute | Value |
| --------- | ----- |
| **Definition** | Total revenue expected from a customer over their lifetime |
| **Formula** | `ARPU * Customer Lifetime` where `Customer Lifetime = 1 / Monthly Churn Rate` |
| **Data Source** | Calculated from Stripe data |
| **Update Frequency** | Monthly |
| **Benchmark** | Healthy SaaS: LTV > 3x CAC |
| **Target** | EUR 540 (based on EUR 27 ARPU, 5% churn = 20 months) |

**LTV Calculation Example**:

```
ARPU = EUR 27/month
Monthly Churn = 5%
Customer Lifetime = 1 / 0.05 = 20 months
LTV = EUR 27 * 20 = EUR 540
```

### 4.5 Referral Metrics

#### Net Promoter Score (NPS)

| Attribute | Value |
| --------- | ----- |
| **Definition** | Measure of customer loyalty and likelihood to recommend |
| **Formula** | `% Promoters (9-10) - % Detractors (0-6)` |
| **Data Source** | In-app NPS survey (triggered after 3rd proposal or 14 days) |
| **Update Frequency** | Monthly |
| **Benchmark** | SaaS average: 30-40; Excellent: >50 |
| **Target** | >30 |

**NPS Survey Trigger**:

- After user publishes 3rd proposal, OR
- 14 days after signup, whichever comes first
- Follow-up: 90 days after last survey

#### Viral Coefficient (K-Factor)

| Attribute | Value |
| --------- | ----- |
| **Definition** | Average number of new users each existing user generates |
| **Formula** | `(Avg invites per user) * (Invite conversion rate)` |
| **Data Source** | Database (referrals table) |
| **Update Frequency** | Monthly |
| **Benchmark** | Viral: >1.0; Good: 0.5-1.0; Normal: <0.5 |
| **Target** | 0.3 (NOW), 0.5 (NEXT), 1.1 (LATER) |

---

## 5. Alerting and Thresholds

### 5.1 Threshold Definitions

| Metric | Green (On Track) | Yellow (Needs Attention) | Red (Critical) |
| ------ | ---------------- | ------------------------ | -------------- |
| **Activation Rate** | >35% | 20-35% | <20% |
| **Week 1 Retention** | >45% | 30-45% | <30% |
| **NPS** | >30 | 10-30 | <10 |
| **Monthly Churn** | <5% | 5-10% | >10% |
| **LTV:CAC** | >3:1 | 2:1-3:1 | <2:1 |
| **CAC Payback** | <12 mo | 12-18 mo | >18 mo |
| **MRR Growth** | >20% MoM | 10-20% MoM | <10% MoM |
| **Page Load (Desktop)** | <2s | 2-3s | >3s |
| **Preview Update** | <300ms | 300-500ms | >500ms |
| **PDF Generation** | <5s | 5-10s | >10s |

### 5.2 Alert Triggers

#### Critical Alerts (Immediate Action Required)

| Alert | Trigger | Channel | Escalation |
| ----- | ------- | ------- | ---------- |
| **Activation Collapse** | Activation Rate <15% for 3 days | Slack + Email | Founder + Product Lead |
| **Churn Spike** | Churn >15% in any month | Email | Founder + CS Lead |
| **System Down** | Health check fails for 5 minutes | PagerDuty | Engineering Lead |
| **Revenue Drop** | MRR drops >10% MoM | Email | Founder |
| **NPS Crash** | NPS <0 | Email | Product Lead |

#### Warning Alerts (Review Required)

| Alert | Trigger | Channel | Review By |
| ----- | ------- | ------- | --------- |
| **Low Activation** | Activation Rate <25% for 7 days | Slack | Product Team (Weekly) |
| **High Churn** | Churn >8% in any month | Slack | CS Lead (Weekly) |
| **CAC Creeping** | CAC increases >30% MoM | Email | Growth Lead (Monthly) |
| **Conversion Drop** | Free-to-Paid <2% | Slack | Product Team (Weekly) |
| **Performance Degradation** | Page load >2.5s (p95) | Slack | Engineering (Daily) |

### 5.3 Escalation Paths

```
Level 1: Slack Notification
   |
   v
Level 2: Email to Function Owner (24h to respond)
   |
   v
Level 3: Email to Founder + All Leads (48h if unresolved)
   |
   v
Level 4: Emergency Team Meeting (72h if unresolved or critical)
```

---

## 6. Implementation Recommendations

### 6.1 Recommended Analytics Stack

| Layer | Tool | Purpose | Cost | Priority |
| ----- | ---- | ------- | ---- | -------- |
| **Product Analytics** | PostHog (Recommended) | Events, funnels, session replay, feature flags | Free <1M events/mo | P1 |
| **Web Analytics** | Plausible | Privacy-friendly traffic analytics | EUR 9/mo | P1 |
| **Revenue Analytics** | Stripe Dashboard + Baremetrics | Subscription metrics, MRR tracking | Stripe free, Baremetrics EUR 50/mo | P2 |
| **Dashboard** | Notion / Google Sheets | Consolidated KPI views | Free | P1 |
| **Alerting** | Slack + Zapier | Automated notifications | Free-EUR 20/mo | P2 |
| **BI (Future)** | Metabase | Advanced analysis, custom queries | Free (self-hosted) | P3 |

**Why PostHog**:

- Open-source, privacy-friendly
- All-in-one: Events + Funnels + Session Replay + Feature Flags + A/B Tests
- Free tier: 1M events/month (sufficient for MVP)
- Self-hosted option for GDPR compliance
- JavaScript SDK integrates easily with React

### 6.2 Event Tracking Plan

#### Critical Events (Must Track from Day 1)

| Event Name | Trigger | Properties | Purpose |
| ---------- | ------- | ---------- | ------- |
| `user_registered` | Account creation | `user_id`, `source`, `utm_*` | Acquisition |
| `user_logged_in` | Login success | `user_id`, `method` | Retention |
| `proposal_created` | Create proposal clicked | `user_id`, `proposal_id` | Activation |
| `proposal_saved` | First save/autosave | `user_id`, `proposal_id`, `tier_count` | Engagement |
| `tier_added` | Tier created | `proposal_id`, `tier_position` | Engagement |
| `benefit_added` | Benefit added to tier | `proposal_id`, `tier_id` | Engagement |
| `proposal_published` | Publish button clicked | `user_id`, `proposal_id`, `tier_count` | North Star |
| `proposal_unpublished` | Unpublish clicked | `user_id`, `proposal_id` | Churn signal |
| `proposal_viewed` | Public proposal loaded | `proposal_id`, `referrer`, `is_unique` | Engagement |
| `lead_submitted` | Contact form submitted | `proposal_id`, `tier_interested` | Conversion |
| `pdf_exported` | PDF download initiated | `proposal_id`, `user_id` | Feature usage |

#### Secondary Events (Track in Phase 2)

| Event Name | Trigger | Properties | Purpose |
| ---------- | ------- | ---------- | ------- |
| `design_settings_changed` | Settings saved | `proposal_id`, `setting_type` | Feature usage |
| `lead_status_updated` | Status dropdown changed | `lead_id`, `from_status`, `to_status` | CRM usage |
| `referral_link_shared` | Share button clicked | `user_id`, `channel` | Virality |
| `upgrade_clicked` | Upgrade CTA clicked | `user_id`, `source_page` | Monetization |
| `subscription_started` | Stripe webhook | `user_id`, `plan`, `amount` | Revenue |
| `subscription_cancelled` | Stripe webhook | `user_id`, `reason`, `tenure` | Churn analysis |

#### Page Views (Auto-tracked by PostHog)

| Page | Path | Key Insights |
| ---- | ---- | ------------ |
| Home | `/` | Landing page effectiveness |
| Dashboard | `/dashboard` | User engagement |
| Proposal Builder | `/proposals/:id/edit` | Core feature usage |
| Public Proposal | `/p/:slug` | Lead generation |
| Pricing | `/pricing` | Monetization intent |

### 6.3 PostHog Implementation

**Installation** (React/Inertia):

```typescript
// inertia/lib/posthog.ts
import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      },
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
    })
  }
}
```

**User Identification**:

```typescript
// On login/register
posthog.identify(user.id, {
  email: user.email,
  name: user.fullName,
  created_at: user.createdAt,
  plan: user.plan, // 'free' | 'pro'
})
```

**Event Tracking**:

```typescript
// Example: Track proposal published
posthog.capture('proposal_published', {
  proposal_id: proposal.id,
  tier_count: proposal.tiers.length,
  has_logo: !!proposal.logoUrl,
  has_cover: !!proposal.coverImageUrl,
})
```

### 6.4 Data Collection Strategy

**Phase 1: MVP (Days 1-21)**

- Implement PostHog with autocapture enabled
- Track 11 critical events manually
- Set up Plausible for traffic analytics
- Manual KPI tracking in Google Sheets

**Phase 2: Post-Launch (Month 1-3)**

- Add secondary event tracking
- Configure PostHog funnels (Activation, Monetization)
- Set up session replay for UX analysis
- Implement NPS survey (in-app)
- Connect Stripe for revenue metrics

**Phase 3: Scale (Month 4+)**

- Deploy Metabase for custom queries
- Build automated KPI dashboard
- Implement cohort analysis
- Set up predictive churn alerts
- A/B testing infrastructure

### 6.5 Dashboard Update Cadence

| Dashboard | Update Frequency | Owner | Meeting |
| --------- | ---------------- | ----- | ------- |
| **Real-time** (DAU, Active Users) | Real-time | Engineering | - |
| **Daily** (Signups, Proposals, Leads) | Every morning | Product | Daily standup |
| **Weekly** (Retention, Conversion, NPS) | Monday AM | Growth | Weekly review |
| **Monthly** (MRR, LTV, CAC, Cohorts) | 1st of month | Founder | Monthly review |
| **Quarterly** (Strategic health, PMF) | End of quarter | Leadership | Board prep |

---

## 7. PMF Health Metrics

### 7.1 PMF Validation Scorecard

**Phase: NOW (MVP Validation)**

| Metric | Target | Current | Weight | Weighted Score |
| ------ | ------ | ------- | ------ | -------------- |
| NPS | >30 | - | 25% | - |
| Activation Rate | >40% | - | 25% | - |
| Week 1 Retention | >50% | - | 20% | - |
| Proposals Published | 30 | - | 15% | - |
| Time to Value | <5 min | - | 15% | - |
| **PMF Score** | - | - | 100% | **-/100** |

**Scoring**:

- Green (100%): Meets or exceeds target
- Yellow (50%): Within 20% of target
- Red (0%): More than 20% below target

**PMF Validation Gate**:

- **Pass**: PMF Score >70% -> Proceed to NEXT phase
- **Conditional**: PMF Score 50-70% -> Extend NOW, fix weak metrics
- **Fail**: PMF Score <50% -> Pivot decision required

### 7.2 Allan Dib 1-Page Marketing Plan Metrics Integration

**Phase 1: BEFORE (Prospects)**

| Square | Metric | Target | How to Measure |
| ------ | ------ | ------ | -------------- |
| **1. Target Market** | ICP Match Rate | >70% | Lead qualification form |
| **2. Message** | Landing Page CVR | >5% | Plausible/PostHog |
| **3. Media** | Traffic by Channel | Balanced | Plausible UTMs |

**Phase 2: DURING (Leads)**

| Square | Metric | Target | How to Measure |
| ------ | ------ | ------ | -------------- |
| **4. Lead Capture** | Waitlist/Signup CVR | >3% | Database |
| **5. Lead Nurture** | Email Open Rate | >35% | Email provider |
| **6. Sales Conversion** | Activation Rate | >40% | PostHog funnel |

**Phase 3: AFTER (Customers)**

| Square | Metric | Target | How to Measure |
| ------ | ------ | ------ | -------------- |
| **7. WOW Experience** | NPS | >30 | In-app survey |
| **8. Increase LTV** | Net Revenue Retention | >100% | Stripe |
| **9. Referrals** | K-Factor | >0.3 | Database |

---

## 8. Review Cadence

### 8.1 Daily Check-in (15 min)

**When**: Every morning, 9:00 AM
**Attendees**: Founder
**Format**: Solo review of dashboard

**Agenda**:

1. Check North Star (Proposals Published) - 2 min
2. Review yesterday's signups and activation - 3 min
3. Check for critical alerts - 2 min
4. Review support queue - 3 min
5. Identify 1-2 focus areas for today - 5 min

### 8.2 Weekly Review (30 min)

**When**: Monday, 10:00 AM
**Attendees**: Founder + any team members
**Format**: Metrics review meeting

**Agenda**:

1. North Star update and trend - 5 min
2. AARRR funnel review - 10 min
3. Week-over-week comparisons - 5 min
4. Key wins and challenges - 5 min
5. Action items for the week - 5 min

**Template**:

```markdown
## Weekly KPI Review - Week of [Date]

### North Star: Proposals Published
- This Week: [X]
- Last Week: [X]
- WoW Change: [+/-X%]
- Trend: [Up/Down/Stable]

### AARRR Summary
| Metric | This Week | Last Week | Target | Status |
|--------|-----------|-----------|--------|--------|
| Signups | X | X | X | OK/WARN/CRIT |
| Activation | X% | X% | 40% | OK/WARN/CRIT |
| Week 1 Retention | X% | X% | 50% | OK/WARN/CRIT |
| NPS | X | X | >30 | OK/WARN/CRIT |

### Key Wins
1. [Win]
2. [Win]

### Key Challenges
1. [Challenge] -> [Action]
2. [Challenge] -> [Action]

### Action Items
- [ ] [Action 1] - Owner - Due
- [ ] [Action 2] - Owner - Due
```

### 8.3 Monthly Review (60 min)

**When**: First Monday of each month
**Attendees**: Founder + advisors (if any)
**Format**: Deep-dive analysis

**Agenda**:

1. Executive summary (5 min)
2. North Star and trend analysis (10 min)
3. Full AARRR funnel analysis (15 min)
4. Cohort retention analysis (10 min)
5. Revenue and unit economics (10 min)
6. PMF health scorecard (5 min)
7. Go/No-Go decision on phase progression (5 min)

### 8.4 Quarterly Review (3 hours)

**When**: End of each quarter
**Attendees**: Founder + advisors + investors (if applicable)
**Format**: Strategic review and planning

**Agenda**:

1. Quarter in review: Goals vs. Actuals (30 min)
2. PMF validation status (30 min)
3. Competitive landscape update (15 min)
4. Financial review and projections (30 min)
5. Key learnings and pivots considered (30 min)
6. Next quarter OKRs (30 min)
7. Q&A and discussion (15 min)

---

## 9. Dashboard Templates

### 9.1 Google Sheets KPI Tracker

**Sheet 1: Daily Metrics**

| Date | Visitors | Signups | Proposals Created | Proposals Published | Leads | DAU |
| ---- | -------- | ------- | ----------------- | ------------------- | ----- | --- |
| 2025-12-01 | | | | | | |
| 2025-12-02 | | | | | | |

**Sheet 2: Weekly Metrics**

| Week | Signups | Activation Rate | Week 1 Retention | NPS | MRR | Churn |
| ---- | ------- | --------------- | ---------------- | --- | --- | ----- |
| W1 Dec | | | | | | |
| W2 Dec | | | | | | |

**Sheet 3: Monthly Metrics**

| Month | MAU | New MRR | Churned MRR | Net MRR | ARR | LTV:CAC | CAC Payback |
| ----- | --- | ------- | ----------- | ------- | --- | ------- | ----------- |
| Dec 2025 | | | | | | | |
| Jan 2026 | | | | | | | |

### 9.2 Notion KPI Dashboard Template

```markdown
# Spons Easy KPI Dashboard

## North Star: Proposals Published

**Current**: [X] | **Target**: [X] | **Status**: [Emoji]

---

## Quick Stats (Today)

| Metric | Value | vs Yesterday |
|--------|-------|--------------|
| Signups | X | +X |
| DAU | X | +X |
| Proposals Created | X | +X |
| Proposals Published | X | +X |
| Leads | X | +X |

---

## Weekly Trends

[Embed chart from Google Sheets or data source]

---

## AARRR Funnel

### Acquisition
- Visitors: X
- Signups: X
- Conversion: X%

### Activation
- Activated Users: X
- Activation Rate: X%
- Time to Value: X min

### Retention
- Week 1: X%
- DAU/MAU: X%

### Revenue
- MRR: EUR X
- ARPU: EUR X
- Paying: X users

### Referral
- NPS: X
- K-Factor: X

---

## Alerts

[List any active alerts]

---

## Action Items

- [ ] [Action 1]
- [ ] [Action 2]
```

---

## 10. Appendix

### A. Glossary

| Term | Definition |
| ---- | ---------- |
| **AARRR** | Pirate Metrics framework: Acquisition, Activation, Retention, Revenue, Referral |
| **Activation** | User reaching the "aha moment" (publishing first proposal) |
| **ARR** | Annual Recurring Revenue (MRR * 12) |
| **CAC** | Customer Acquisition Cost |
| **Churn** | Customers who cancel or stop using the product |
| **DAU** | Daily Active Users |
| **K-Factor** | Viral coefficient measuring organic growth |
| **LTV** | Customer Lifetime Value |
| **MAU** | Monthly Active Users |
| **MRR** | Monthly Recurring Revenue |
| **NPS** | Net Promoter Score (-100 to +100) |
| **PMF** | Product-Market Fit |
| **WAU** | Weekly Active Users |

### B. Metric Calculation SQL Queries

**Activation Rate (PostgreSQL)**:

```sql
WITH activated_users AS (
  SELECT COUNT(DISTINCT user_id) as count
  FROM proposals
  WHERE status = 'published'
  AND created_at >= :start_date
),
total_users AS (
  SELECT COUNT(*) as count
  FROM users
  WHERE created_at >= :start_date
)
SELECT
  (activated_users.count::float / NULLIF(total_users.count, 0)) * 100 as activation_rate
FROM activated_users, total_users;
```

**Week 1 Retention (PostgreSQL)**:

```sql
WITH cohort AS (
  SELECT
    id as user_id,
    DATE_TRUNC('week', created_at) as signup_week
  FROM users
  WHERE created_at >= :start_date
),
activity AS (
  SELECT DISTINCT
    user_id,
    DATE_TRUNC('week', created_at) as activity_week
  FROM proposals
)
SELECT
  c.signup_week,
  COUNT(DISTINCT c.user_id) as cohort_size,
  COUNT(DISTINCT CASE WHEN a.activity_week = c.signup_week + INTERVAL '1 week' THEN c.user_id END) as retained,
  (COUNT(DISTINCT CASE WHEN a.activity_week = c.signup_week + INTERVAL '1 week' THEN c.user_id END)::float /
   NULLIF(COUNT(DISTINCT c.user_id), 0)) * 100 as retention_rate
FROM cohort c
LEFT JOIN activity a ON c.user_id = a.user_id
GROUP BY c.signup_week
ORDER BY c.signup_week;
```

### C. Data Sources Reference

| Data Point | Primary Source | Backup Source |
| ---------- | -------------- | ------------- |
| User registrations | Database (users table) | PostHog events |
| Proposal creation | Database (proposals table) | PostHog events |
| Page views | Plausible | PostHog pageviews |
| Session data | PostHog | - |
| Revenue/MRR | Stripe | - |
| Email metrics | Resend/Mailgun | - |
| NPS | In-app survey (custom) | - |

### D. Related Documents

- [Constitution](/Users/leobrival/Developer/sass/spons-easy/.ideabrowser/constitution.md)
- [PRD](/Users/leobrival/Developer/sass/spons-easy/.ideabrowser/prd.md)
- [GTM Strategy](/Users/leobrival/Developer/sass/spons-easy/.ideabrowser/gtm-strategy.md)
- [Pricing Strategy](/Users/leobrival/Developer/sass/spons-easy/.ideabrowser/pricing-strategy.md)
- [MVP Roadmap](/Users/leobrival/Developer/sass/spons-easy/.ideabrowser/mvp-roadmap.md)
- [Personas](/Users/leobrival/Developer/sass/spons-easy/.ideabrowser/personas.md)

---

**Document Maintenance**:

- Update weekly during MVP phase
- Update monthly post-launch
- Review and revise quarterly

---

_Created: 2025-11-25_
_Last Updated: 2025-11-25_
_Version: 1.0.0_

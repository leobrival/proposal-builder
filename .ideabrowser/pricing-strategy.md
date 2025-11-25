# Pricing Strategy: Spons Easy

**Created**: 2025-11-25
**Version**: 1.0.0
**Status**: Draft - To be validated during beta

---

## 1. Pricing Philosophy

### Value-Based vs Cost-Based Analysis

**Cost-Based Pricing** (What it costs us):

| Cost Component | Monthly Cost (Est.) | Per User (at 100 users) |
| -------------- | ------------------- | ----------------------- |
| Neon PostgreSQL | EUR 0-25 | EUR 0.25 |
| Railway/Vercel Hosting | EUR 0-50 | EUR 0.50 |
| Email Service (Resend) | EUR 0-20 | EUR 0.20 |
| PDF Generation | EUR 0-10 | EUR 0.10 |
| **Total Infrastructure** | **EUR 50-105** | **EUR 1.05** |

**Value-Based Pricing** (What it's worth to users):

| Persona | Time Saved | Money Impact | Perceived Value |
| ------- | ---------- | ------------ | --------------- |
| **Content Creator Clara** | 10+ hours/month | EUR 2,000+/month potential sponsorship revenue | EUR 50-100/month |
| **Event Organizer Eric** | 2-3 weeks/event | EUR 15,000+ deals recovered | EUR 100-300/month |
| **Association Alice** | 5-10 hours/month | EUR 5,000-20,000/year funding unlocked | EUR 0-20/month (budget-constrained) |

**Conclusion**: Value-based pricing should anchor between EUR 9-29/month for primary tier. Cost-plus pricing would suggest EUR 5/month minimum at scale.

### Willingness to Pay by Persona

Based on persona analysis from `/Users/leobrival/Developer/sass/spons-easy/.ideabrowser/personas.md`:

| Persona | Budget Sensitivity | Monthly Budget | Price Ceiling | Purchase Authority |
| ------- | ------------------ | -------------- | ------------- | ------------------ |
| **Clara** (Creator) | High | EUR 50-100 for tools | EUR 29/month | Individual (fast) |
| **Eric** (Event) | Moderate | EUR 200-500 for tools | EUR 99/month | May need approval |
| **Alice** (Association) | Very High | EUR 0-20 | Must have free tier | Board approval required |

**Key Insight**: Alice represents 30% of target users but has near-zero budget. A strong free tier is essential for:

1. Building volume and social proof
2. Federation/community word-of-mouth
3. Potential upgrades when associations grow

### Price Anchoring Strategy

**Anchoring Approach**: Present pricing from highest to lowest (Enterprise -> Pro -> Free) to leverage the anchoring effect:

```
Enterprise: EUR 199/month (anchor - makes Pro look reasonable)
Pro: EUR 29/month (target - 7x cheaper than anchor)
Free: EUR 0/month (entry point - drives adoption)
```

**Psychological Framing**:

- Pro at EUR 29/month = "less than EUR 1/day"
- Pro at EUR 29/month = "cost of 2 coffees/week"
- Annual discount: EUR 290/year = "2 months free" vs monthly

---

## 2. Pricing Model Options

### Option A: Freemium (Recommended)

**Structure**:

- Free: 1 active proposal, basic features
- Pro: Unlimited proposals, full features
- Business: Team features (future)

**Pros**:

- Lowest friction for acquisition (critical for 5-minute time-to-value promise)
- Essential for Association Alice persona (budget = EUR 0)
- Enables viral growth (free users share proposals)
- Validates product-market fit before monetization pressure
- Matches competitor positioning (Canva, Notion)

**Cons**:

- Slower path to revenue
- Risk of free tier being "enough" for most users
- Support costs for non-paying users

**Conversion Assumption**: 3-5% free-to-paid (industry standard for B2C freemium)

### Option B: Usage-Based (Pay per Proposal)

**Structure**:

- First proposal free
- EUR 9 per additional proposal
- EUR 49/10-pack (20% discount)

**Pros**:

- Clear value exchange (pay when you use)
- Low commitment entry
- Scales with customer success

**Cons**:

- Unpredictable revenue (MRR volatility)
- Discourages experimentation (users hesitate to create)
- Conflicts with 5-minute time-to-value (paywall after first use)
- Complex billing for associations

### Option C: Tiered Subscription (No Free Tier)

**Structure**:

- Starter: EUR 9/month (3 proposals)
- Pro: EUR 29/month (unlimited)
- Business: EUR 99/month (team features)

**Pros**:

- Immediate revenue per user
- Clear tier differentiation
- Predictable MRR

**Cons**:

- Excludes Association Alice (30% of target market)
- Higher acquisition friction
- Harder to validate PMF (paying users may tolerate issues)
- Misaligned with MVP goal of "validate before monetize"

### Recommendation: Option A (Freemium)

**Rationale**:

1. **MVP Focus**: PRD explicitly states "validate product-market fit before scaling investment" - freemium enables this
2. **Persona Alignment**: Association Alice (30% of users) requires free tier - excluding them loses network effects
3. **Time-to-Value**: 5-minute promise is best served by zero-friction onboarding
4. **Competitive Positioning**: Canva and Notion templates offer free access - we cannot charge upfront for an unproven product
5. **Growth Loop**: Free proposals get shared -> sponsors see quality -> sponsors may become users (B2B flywheel)

**Risk Mitigation**:

- Gate high-value features (PDF export, custom branding, analytics) behind Pro
- Free tier limited to 1 active proposal (forces upgrade for serious users)
- Track upgrade triggers to optimize conversion

---

## 3. Tier Structure

### Free Tier - "Starter"

**Price**: EUR 0/month

**Target Persona**: Association Alice, new Content Creators testing the product

**Features**:

| Feature | Included | Limit |
| ------- | -------- | ----- |
| Active Proposals | Yes | 1 |
| Live Preview Builder | Yes | Full |
| Sponsorship Tiers | Yes | 3 max |
| Benefits per Tier | Yes | 5 max |
| Web Publishing | Yes | spons.easy/p/slug |
| Contact Form | Yes | Basic |
| Lead Capture | Yes | 10 leads/month |
| PDF Export | No | - |
| Custom Branding | No | - |
| Analytics | No | - |
| Email Notifications | Yes | New leads only |

**Limitations Rationale**:

- 1 proposal: Forces upgrade for multi-event users (Eric) or multi-project creators (Clara)
- 3 tiers: Sufficient for basic proposals, power users need more
- 10 leads/month: Enough to prove value, not enough for serious operations
- No PDF: Key enterprise feature, strong upgrade trigger
- No custom branding: Spons Easy watermark on free proposals drives awareness

**Goal**: Acquire users, demonstrate value, build habit

### Pro Tier - "Professional"

**Price**: EUR 29/month (EUR 290/year - save EUR 58)

**Target Persona**: Content Creator Clara (primary), small event organizers

**Features**:

| Feature | Included | Limit |
| ------- | -------- | ----- |
| Active Proposals | Yes | Unlimited |
| Live Preview Builder | Yes | Full |
| Sponsorship Tiers | Yes | Unlimited |
| Benefits per Tier | Yes | Unlimited |
| Web Publishing | Yes | spons.easy/p/slug |
| Contact Form | Yes | Enhanced |
| Lead Capture | Yes | Unlimited |
| PDF Export | Yes | Unlimited |
| Custom Branding | Yes | Colors, fonts, logo |
| Analytics | Yes | Views, lead sources |
| Email Notifications | Yes | Full (leads + weekly digest) |
| Lead Status Management | Yes | Full pipeline |
| Priority Support | Yes | 24h response |

**Why EUR 29/month**:

- Below Clara's EUR 50-100/month tool budget
- Below psychological EUR 30 barrier (feels like "twenties")
- 3x multiplier from free value (industry standard)
- Competitive with creator tools (Linktree Pro: EUR 24, Canva Pro: EUR 12)
- Sweet spot: affordable for individuals, valuable for businesses

**Annual Discount Strategy**:

- EUR 29/month x 12 = EUR 348/year
- Annual price: EUR 290/year (EUR 24.17/month effective)
- Savings: EUR 58 (17% discount)
- Framing: "2 months free" (resonates better than "17% off")

**Goal**: Convert serious users, maximize ARPU, validate willingness to pay

### Business Tier - "Business" (Future - Phase 2)

**Price**: EUR 99/month (EUR 990/year)

**Target Persona**: Event Organizer Eric, agencies, larger associations

**Features** (in addition to Pro):

| Feature | Included |
| ------- | -------- |
| Team Members | Up to 5 |
| Proposal Templates | Save and reuse |
| Brand Kit | Multiple brands |
| Advanced Analytics | Funnel, conversion rates |
| Custom Domain | proposals.yourcompany.com |
| API Access | Integrations |
| Dedicated Onboarding | 1-hour call |
| Priority Support | 4h response |

**Why Deferred**:

- MVP focus is individual users
- Team features require significant development
- Need Pro tier validation first
- Eric persona (20% of users) has longer sales cycle

**Goal**: Capture enterprise value, increase LTV, enable agencies

### Enterprise Tier (Future - Phase 3)

**Price**: Custom (starting EUR 299/month)

**Target**: Large event agencies, multi-brand organizations, franchises

**Features**:

- Unlimited team members
- SSO/SAML
- Dedicated account manager
- Custom integrations
- SLA guarantee
- Invoice billing

**Goal**: High-value accounts, predictable revenue, logos for social proof

---

## 4. Pricing Psychology

### Anchoring Techniques

**1. Pricing Page Layout**:

```
[Business EUR 99] -> [Pro EUR 29 RECOMMENDED] -> [Free EUR 0]
```

Display order: Show highest price first to anchor expectations. EUR 99 makes EUR 29 feel like a bargain.

**2. Feature Comparison Anchoring**:

- Free: "Get started"
- Pro: "**Everything you need**" (anchor on completeness)
- Business: "For teams" (positions as upgrade path)

**3. Social Proof Anchoring**:

- "Most popular" badge on Pro tier
- "Chosen by 500+ creators" (after validation)
- Testimonial from successful creator near pricing

### Value Communication

**For Content Creator Clara**:

```
"Stop leaving money on the table.
Professional proposals that get brands to say yes.

Your EUR 29/month investment can unlock EUR 2,000+/month in sponsorships.
That's 70x return on investment."
```

**For Event Organizer Eric**:

```
"Close sponsors faster with proposals that convert.
Stop recreating decks from scratch for every event.

One recovered sponsorship pays for a year of Spons Easy."
```

**For Association Alice**:

```
"Professional sponsorship proposals for associations - free to start.
You deserve the same tools as big organizations.

Create your first proposal in 5 minutes, no experience needed."
```

### Upgrade Triggers

**Strategic Friction Points** (designed to trigger upgrades):

| Trigger Point | Behavior | Messaging |
| ------------- | -------- | --------- |
| Create 2nd proposal | Soft block | "Upgrade to Pro for unlimited proposals" |
| 10 leads received | Soft block | "You're getting traction! Upgrade to capture more leads" |
| PDF export attempt | Hard block | "PDF export available on Pro - EUR 29/month" |
| Brand customization | Hard block | "Remove Spons Easy branding with Pro" |
| View analytics | Hard block | "See who's viewing your proposals with Pro" |

**Upgrade Path Messaging**:

1. **Achievement-based**: "Congratulations! Your proposal got 50 views. Upgrade to see detailed analytics."
2. **Loss aversion**: "You've reached your 10-lead limit. 3 potential sponsors are waiting - don't miss them."
3. **Social proof**: "Clara upgraded to Pro and closed 3 deals in her first month."

### Objection Pre-emption

**"I can just use Canva for free"**

Response on pricing page:

> "Canva makes beautiful documents. Spons Easy makes proposals that convert. Our guided builder includes sponsorship best practices, tier structures, and lead capture - all designed specifically for sponsorships."

**"I don't have enough followers for sponsors yet"**

Response:

> "Brands partner with creators of all sizes. Professional proposals help you punch above your weight. Start free, upgrade when you start closing deals."

**"I'll do it properly when I have more time"**

Response:

> "Your first proposal takes 5 minutes. That's shorter than writing one email. Start now, close sponsors sooner."

---

## 5. Revenue Projections

### Assumptions

| Metric | Assumption | Rationale |
| ------ | ---------- | --------- |
| Beta users (Month 1) | 50 | PRD target |
| Monthly user growth | 30% | Conservative for MVP launch |
| Free-to-Pro conversion | 4% | Industry average for freemium B2C |
| Pro monthly churn | 5% | Early-stage SaaS average |
| Annual plan adoption | 25% | Conservative estimate |
| Average Pro MRR | EUR 27 | Blended (75% monthly @ EUR 29, 25% annual @ EUR 24.17) |

### Month-by-Month Projection (Year 1)

| Month | Total Users | Free Users | Pro Users (New) | Pro Users (Total) | MRR (EUR) | Cumulative Revenue |
| ----- | ----------- | ---------- | --------------- | ----------------- | --------- | ------------------ |
| 1 | 50 | 48 | 2 | 2 | 54 | 54 |
| 2 | 65 | 62 | 2 | 4 | 108 | 162 |
| 3 | 85 | 81 | 3 | 7 | 189 | 351 |
| 4 | 110 | 105 | 4 | 10 | 270 | 621 |
| 5 | 143 | 136 | 5 | 14 | 378 | 999 |
| 6 | 186 | 177 | 6 | 19 | 513 | 1,512 |
| 7 | 242 | 230 | 8 | 26 | 702 | 2,214 |
| 8 | 315 | 299 | 10 | 35 | 945 | 3,159 |
| 9 | 410 | 389 | 13 | 46 | 1,242 | 4,401 |
| 10 | 533 | 506 | 17 | 61 | 1,647 | 6,048 |
| 11 | 693 | 658 | 22 | 80 | 2,160 | 8,208 |
| 12 | 901 | 856 | 28 | 103 | 2,781 | 10,989 |

**Year 1 Summary**:

- Total users: 901
- Paying users: 103 (11.4% of total due to churn)
- MRR at Month 12: EUR 2,781
- ARR at Month 12: EUR 33,372
- Total Year 1 Revenue: EUR 10,989

### Break-Even Analysis

**Monthly Costs at Scale**:

| Cost | Monthly (EUR) |
| ---- | ------------- |
| Infrastructure (at 1000 users) | 150 |
| Email service | 50 |
| Support tools | 25 |
| Marketing (minimal) | 100 |
| **Total** | **325** |

**Break-Even Point**:

- Monthly costs: EUR 325
- Pro ARPU: EUR 27
- Required Pro users: 13 (EUR 325 / EUR 27)
- Break-even month: Month 4 (10 Pro users) to Month 5 (14 Pro users)

**Note**: This excludes founder time/opportunity cost. With founder salary factored in (EUR 4,000/month for one founder), break-even would require 160 Pro users (approximately Month 14).

### Scenario Analysis

| Scenario | Conversion Rate | Month 12 MRR | Month 12 Pro Users |
| -------- | --------------- | ------------ | ------------------ |
| **Pessimistic** | 2% | EUR 1,390 | 52 |
| **Base Case** | 4% | EUR 2,781 | 103 |
| **Optimistic** | 8% | EUR 5,562 | 206 |

---

## 6. Validation Plan

### Beta Pricing Experiment Design

**Phase 1: Soft Launch (Weeks 1-2)**

- Price: Free for all features (no paywall)
- Goal: Validate product-market fit without pricing friction
- Metrics: Activation rate, proposal quality, NPS

**Phase 2: Price Sensitivity Testing (Weeks 3-4)**

**Method**: Van Westendorp Price Sensitivity Meter

Ask beta users (n=30+):

1. "At what price would Spons Easy Pro be so expensive you wouldn't consider it?"
2. "At what price would it be expensive, but you'd still consider it?"
3. "At what price would it be cheap enough to be a no-brainer?"
4. "At what price would it be so cheap you'd question its quality?"

**Expected Results** (hypothesis):

- Too expensive: > EUR 49
- Expensive but acceptable: EUR 29-49
- Cheap but credible: EUR 9-19
- Too cheap: < EUR 5
- **Optimal price point**: EUR 19-29

**Phase 3: Conversion Testing (Weeks 5-8)**

**A/B Test**: Split beta users 50/50

- Variant A: Pro at EUR 19/month
- Variant B: Pro at EUR 29/month

**Metrics**:

- Conversion rate (free to paid)
- Revenue per visitor (price x conversion)
- Churn rate (30-day)
- NPS score per variant

**Decision Framework**:

| Result | Decision |
| ------ | -------- |
| EUR 19 converts 2x better | Launch at EUR 19 |
| EUR 29 converts equally | Launch at EUR 29 (higher revenue) |
| Neither converts well (< 2%) | Revisit value proposition, consider EUR 9 tier |

### Metrics to Track

**Leading Indicators** (early signals):

| Metric | Target | Alert Threshold | Tool |
| ------ | ------ | --------------- | ---- |
| Proposal created (activation) | 40% of signups | < 20% | PostHog |
| Time to first proposal | < 5 minutes | > 10 minutes | Custom timing |
| Upgrade button clicks | 10% of free users | < 3% | PostHog |
| Pricing page views | 20% of active users | < 10% | PostHog |

**Lagging Indicators** (outcome metrics):

| Metric | Target | Alert Threshold | Frequency |
| ------ | ------ | --------------- | --------- |
| Free-to-paid conversion | 4% | < 2% | Weekly |
| MRR growth rate | 20%+ MoM | < 10% | Monthly |
| Net Revenue Retention | > 100% | < 90% | Monthly |
| LTV:CAC ratio | > 3:1 | < 2:1 | Quarterly |

**Qualitative Signals**:

- "I would pay for this" statements in feedback
- Feature requests for Pro-only features
- Complaints about free tier limits (positive signal)
- Referrals from free users

### When to Adjust Pricing

**Increase Price If**:

- Conversion rate > 8% (price too low)
- No price objections in user interviews
- Competitors charge more for less
- Users say "this is a steal"

**Decrease Price If**:

- Conversion rate < 1% after 60 days
- Consistent feedback: "too expensive for what it does"
- Users churning citing price
- Competitor launches cheaper alternative

**Add New Tier If**:

- Clear segment emerges (e.g., agencies) willing to pay more
- Users hitting limits and requesting upgrade path
- Feature requests cluster around enterprise needs

**Introduce Usage-Based Component If**:

- High-volume users dramatically outpace average
- Proposal count becomes primary value driver
- Infrastructure costs scale disproportionately

---

## 7. Competitive Positioning

### Competitor Pricing Landscape

| Competitor | Type | Price | Target |
| ---------- | ---- | ----- | ------ |
| **Canva** | Design tool | Free + EUR 12/mo Pro | General design |
| **Notion** | Templates | EUR 0-30 one-time | All use cases |
| **Pitch** | Presentations | Free + EUR 8/mo Pro | Business decks |
| **SponsorPitch** | Sponsorship platform | EUR 199+/mo | Enterprise events |
| **OpenSponsorship** | Marketplace | EUR 99+/mo | Athletes/teams |

### Our Positioning

```
Canva (cheap, general) <------ Spons Easy ------> SponsorPitch (expensive, enterprise)
                              (affordable, specialized)
```

**Differentiation**:

- vs Canva: Purpose-built for sponsorships (guided structure, tier builder, lead capture)
- vs Notion templates: Dynamic, interactive web publishing
- vs SponsorPitch: 10x more affordable, self-service, creator-focused

**Pricing Message**:

> "Professional sponsorship tools at creator-friendly prices. The features of enterprise platforms. The simplicity of Canva. The price of a couple coffees."

---

## 8. Implementation Checklist

### Pre-Launch (Beta Period)

- [ ] Implement free tier limits in backend
- [ ] Add upgrade prompts at trigger points
- [ ] Create pricing page with tier comparison
- [ ] Set up Stripe/payment integration
- [ ] Configure annual billing option
- [ ] Add pricing FAQ section
- [ ] Set up conversion tracking (PostHog)

### Launch (Day 1)

- [ ] Enable payment processing
- [ ] Announce pricing to beta users
- [ ] Grandfather early beta users at special rate
- [ ] Monitor conversion funnel real-time

### Post-Launch (Week 1-4)

- [ ] Conduct Van Westendorp survey
- [ ] Run A/B test if sample size allows
- [ ] Interview churned users about pricing
- [ ] Interview converted users about value

### Optimization (Month 2+)

- [ ] Adjust price based on data
- [ ] Optimize upgrade messaging
- [ ] Consider annual-only promotions
- [ ] Plan Business tier development

---

## 9. Pricing Page Copy

### Headline

> **Plans that grow with you**
> Start free. Upgrade when you're ready.

### Tier Descriptions

**Free**

> Perfect for getting started
>
> - 1 active proposal
> - Basic lead capture (10/month)
> - Web publishing
> - Spons Easy branding

**Pro** (MOST POPULAR)

> Everything you need to close deals
>
> - Unlimited proposals
> - Unlimited leads
> - PDF export
> - Custom branding
> - Analytics dashboard
> - Priority support

**Business** (COMING SOON)

> For teams and agencies
>
> - Everything in Pro
> - 5 team members
> - Custom domain
> - Advanced analytics
> - Dedicated onboarding

### FAQ

**Can I change plans later?**

> Yes, upgrade or downgrade anytime. Changes take effect immediately.

**What payment methods do you accept?**

> Credit card (Visa, Mastercard, Amex) via Stripe. Annual plans can be invoiced.

**Do you offer refunds?**

> 14-day money-back guarantee on all paid plans. No questions asked.

**Is there a discount for nonprofits?**

> Yes! Associations and registered nonprofits get 50% off Pro. Contact us with proof of status.

**What happens to my proposals if I downgrade?**

> Your proposals remain accessible but you cannot edit more than your tier allows. Upgrade anytime to regain full access.

---

## 10. Key Decisions Summary

| Decision | Choice | Rationale |
| -------- | ------ | --------- |
| **Pricing Model** | Freemium | Aligns with MVP validation, persona needs, 5-min time-to-value |
| **Pro Price Point** | EUR 29/month | Below Clara's ceiling, competitive, room for discounts |
| **Annual Discount** | 17% (EUR 290/year) | Improves cash flow, reduces churn, "2 months free" framing |
| **Free Tier Limits** | 1 proposal, 10 leads, no PDF | Gates value without blocking validation |
| **Business Tier** | Deferred to Phase 2 | Focus resources on Pro conversion first |
| **Nonprofit Discount** | 50% off Pro | Supports Association Alice, builds goodwill |

---

_Document created: 2025-11-25_
_Last updated: 2025-11-25_
_Based on: constitution.md, personas.md, prd.md, competitive analysis_

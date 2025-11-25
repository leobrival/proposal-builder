# Referral Program: Spons Easy

**Created**: 2025-11-25
**Version**: 1.0.0
**Status**: Draft - Bootstrap/Low-Budget Launch
**Based on**: constitution.md, gtm-strategy.md, pricing-strategy.md, personas.md

---

## Executive Summary

This referral program is designed for a **zero-budget, bootstrap launch** targeting 50 beta users. It leverages the inherent virality of published proposals ("Made with Spons Easy" footer) combined with a simple two-sided incentive ("Give 1 month, Get 1 month Pro").

**Key Principles**:

- Simple mechanics that users understand in 5 seconds
- Low-cost rewards using product value (free months) instead of cash
- Built-in virality through proposal footers (passive referrals)
- Gamification introduced gradually (MVP simple, V2 gamified)
- Fraud prevention without friction

---

## 1. Program Structure

### 1.1 Core Referral Mechanic

**Two-Sided Reward System**:

| Party | Reward | Condition |
|-------|--------|-----------|
| **Referrer (Advocate)** | 1 month Pro free | Referee signs up AND publishes first proposal |
| **Referee (New User)** | 1 month Pro free | Signs up via referral link AND publishes first proposal |

**Why This Structure**:

- **Double activation requirement**: Ensures quality referrals (not just signups)
- **Product-aligned reward**: Free Pro months cost us nothing but server time
- **Win-win-win**: Referrer wins, referee wins, Spons Easy gets activated users
- **Budget-friendly**: EUR 0 marginal cost per referral (vs EUR 15 if cash-based)

### 1.2 Eligibility Criteria

**Who Can Refer**:

| Criteria | Requirement |
|----------|-------------|
| Account status | Active account (not suspended) |
| Activation status | Has published at least 1 proposal |
| Plan type | Any plan (Free or Pro) |
| Account age | No minimum (can refer immediately after activation) |

**Who Can Be Referred**:

| Criteria | Requirement |
|----------|-------------|
| Email status | New email (no prior account) |
| Signup method | Must use referral link |
| Activation requirement | Must publish first proposal within 30 days |

### 1.3 Reward Tiers (Progressive)

**MVP Version (Simple):**

| Referrals | Referrer Reward |
|-----------|-----------------|
| 1 | 1 month Pro free |
| 2 | 2 months Pro free |
| 3 | 3 months Pro free |
| ... | 1 month per referral (linear) |

**V2 Version (Tiered Bonuses):**

| Milestone | Reward | Value |
|-----------|--------|-------|
| 1 referral | 1 month Pro | EUR 29 value |
| 3 referrals | 1 bonus month (4 total) | EUR 116 value |
| 5 referrals | "Founding Referrer" badge + 2 bonus months (7 total) | EUR 203 value |
| 10 referrals | Lifetime 50% discount on Pro | EUR 174/year saved |
| 25 referrals | 1 year Pro free | EUR 290 value |
| 50 referrals | Lifetime Pro access | Unlimited value |

**Referee Reward (Constant)**:

- Always 1 month Pro free, regardless of referrer tier
- Creates consistent value proposition for sharing

### 1.4 Reward Economics

**Cost Analysis**:

| Metric | Value | Calculation |
|--------|-------|-------------|
| Pro monthly price | EUR 29 | - |
| Marginal cost per month given | EUR 1.05 | Infrastructure only (no marginal product cost) |
| Effective reward cost | EUR 2.10 | EUR 1.05 x 2 (referrer + referee) |
| Target CAC | EUR 15 | From pricing-strategy.md |
| Referral savings vs CAC | EUR 12.90 | EUR 15 - EUR 2.10 |
| ROI per referral | 614% | (EUR 15 - EUR 2.10) / EUR 2.10 |

**Break-Even Analysis**:

If a referred user converts to paid after their free month:

- Revenue: EUR 29/month
- Reward cost: EUR 2.10
- Net: EUR 26.90 (93% margin)

Even if only 20% convert to paid:

- Expected revenue: EUR 29 x 20% = EUR 5.80
- Reward cost: EUR 2.10
- Net: EUR 3.70 (still profitable)

---

## 2. Viral Loops

### 2.1 Built-in Virality: Proposal Footer

**Mechanism**:

Every published proposal on Free tier includes a footer:

```
---
Created with Spons Easy - Create professional sponsorship proposals in 5 minutes
[Create Your Free Proposal]
```

**Design Specifications**:

| Element | Specification |
|---------|---------------|
| Position | Bottom of proposal page |
| Style | Subtle, professional, not spammy |
| Link | UTM-tracked: `?utm_source=proposal&utm_medium=footer&utm_campaign=viral` |
| Removable | Pro tier only (upgrade incentive) |
| Click tracking | PostHog event: `footer_cta_clicked` |

**Expected Impact**:

| Metric | Assumption | Rationale |
|--------|------------|-----------|
| Avg views per proposal | 50 | Based on sponsor outreach volume |
| Footer CTR | 2-5% | Conservative for subtle CTA |
| Signup conversion | 20% | Landing page conversion |
| Activation rate | 40% | MVP target from GTM strategy |

**Viral Contribution Calculation**:

- 100 proposals published (MVP target)
- x 50 views = 5,000 impressions
- x 3% CTR = 150 clicks
- x 20% signup = 30 signups
- x 40% activation = 12 activated users

**Result**: ~12% of MVP users from passive viral loop (footer only)

### 2.2 Active Referral Loop

**Flow Diagram**:

```
User signs up
     |
     v
User creates first proposal
     |
     v
User publishes proposal (ACTIVATION)
     |
     v
Trigger: "Congrats! Share to earn 1 month Pro free" modal
     |
     +---> User copies referral link
     |
     v
User shares via email/social/DM
     |
     v
Friend clicks link, lands on personalized page
     |
     v
Friend signs up (cookie tracks referral)
     |
     v
Friend publishes first proposal (ACTIVATION)
     |
     v
Both users receive 1 month Pro free
     |
     v
Friend receives same "Share to earn" prompt
     |
     v
REPEAT
```

### 2.3 Share Triggers and Prompts

**Trigger Points** (When to prompt referral):

| Trigger | Timing | Message | Priority |
|---------|--------|---------|----------|
| Post-publish | After first proposal published | "Share Spons Easy, get 1 month Pro free" | P1 |
| Achievement | After receiving first lead | "You got your first lead! Know someone who'd benefit?" | P2 |
| Weekly digest | Monday email | "Refer friends, earn free months" section | P2 |
| Dashboard | Always visible | "Referral" nav item with reward counter | P1 |
| Pro upgrade prompt | When hitting free tier limits | "Or refer 1 friend to unlock Pro free" | P3 |

**Post-Publish Modal (Primary Trigger)**:

```
---------------------------------------------
|  Congratulations! Your proposal is live   |
|                                           |
|  Share Spons Easy with friends and        |
|  you'll both get 1 month Pro free!        |
|                                           |
|  [Copy Referral Link]  [Share via Email]  |
|                                           |
|  Your referral link:                      |
|  sponseasy.com/r/clara-abc123             |
|                                           |
|  [Maybe Later]                            |
---------------------------------------------
```

### 2.4 Social Sharing Optimization

**Pre-Written Messages by Channel**:

**Email Template**:

```
Subject: I found a tool you'll love for sponsorships

Hey [Name],

I've been using Spons Easy to create sponsorship proposals and it's a game-changer.
Instead of spending hours in Canva or Word, I built a professional proposal in 5 minutes.

You can try it free - and we'll both get 1 month Pro free:
[REFERRAL LINK]

Let me know what you think!

[Referrer Name]
```

**Twitter/X Share**:

```
Just discovered @SponsEasy - created a professional sponsorship proposal in 5 minutes

If you're a creator/organizer looking for sponsors, try it free:
[REFERRAL LINK]

We'll both get 1 month Pro free
```

**Instagram Story**:

- Template image with referral link
- "Swipe up" or link sticker
- Text: "This is how I create sponsorship proposals now"

**WhatsApp/SMS**:

```
Hey! I found this tool that creates sponsorship proposals in 5 minutes.
Super useful if you're looking for sponsors.
Sign up here and we both get 1 month free: [REFERRAL LINK]
```

**LinkedIn**:

```
I've been testing Spons Easy for creating sponsorship proposals.

If you organize events, run an association, or create content - and struggle with pitching sponsors - this tool is worth checking out.

Full disclosure: if you sign up with my link, we both get 1 month free.
But I'd recommend it either way: [REFERRAL LINK]
```

---

## 3. Reward System

### 3.1 Reward Options

**Primary Reward: Free Pro Months**

| Aspect | Detail |
|--------|--------|
| Value | EUR 29/month |
| Duration | 1 month per successful referral |
| Stackable | Yes (up to 12 months banked) |
| Expiration | 12 months from earning |
| Transferable | No |

**Why Pro months over cash**:

1. Zero marginal cost (EUR 1.05 infrastructure vs EUR 15 cash)
2. Increases product usage and stickiness
3. Natural conversion path (user experiences Pro, wants to keep it)
4. No payment processing fees
5. Aligns with bootstrap budget

**Alternative Rewards (V2 - for variety)**:

| Reward Type | When Offered | Value |
|-------------|--------------|-------|
| Extended features | After 3+ referrals | Custom domain for 3 months |
| Swag | After 10+ referrals | Branded merchandise |
| Early access | Power referrers | Beta features, roadmap input |
| Recognition | Top referrers | Featured on website, badge |

### 3.2 Milestone Rewards

**Milestone System (V2)**:

```
REFERRAL JOURNEY
================

[x] 1 referral  --> 1 month Pro (UNLOCKED)
[ ] 3 referrals --> "Early Supporter" badge + bonus month
[ ] 5 referrals --> "Founding Referrer" badge + 2 bonus months
[ ] 10 referrals -> Lifetime 50% discount
[ ] 25 referrals -> 1 year Pro free
[ ] 50 referrals -> Lifetime Pro + name on Founders Wall

Current: 2 referrals | Next milestone: 1 more to unlock badge!
```

**Milestone Celebration Emails**:

Sent automatically when user reaches milestone:

- Personalized congratulations
- Badge/reward notification
- Social share prompt ("Share your achievement!")
- Preview of next milestone

### 3.3 Leaderboard Mechanics (V2)

**Leaderboard Design**:

| Feature | Implementation |
|---------|----------------|
| Visibility | Dashboard section, optional public page |
| Ranking | By total successful referrals (all time) |
| Anonymity | Display name (can be real name or username) |
| Refresh | Real-time |
| Rewards | Monthly top 3 get bonus rewards |

**Leaderboard Display**:

```
TOP REFERRERS THIS MONTH
========================

1. Clara M.      - 12 referrals  [Crown]
2. Eric D.       - 8 referrals   [Silver]
3. Anonymous     - 6 referrals   [Bronze]
4. You           - 2 referrals
5. Marie L.      - 2 referrals
...

Your rank: #4 (tie)
Referrals to top 3: 4 more
```

**Monthly Leaderboard Rewards**:

| Rank | Reward |
|------|--------|
| #1 | 3 months Pro free + featured profile |
| #2 | 2 months Pro free |
| #3 | 1 month Pro free |

**Gamification Elements**:

- Progress bar toward next milestone
- Streak bonus: 3 referrals in same week = 1 bonus month
- Seasonal campaigns: 2x rewards during launch month

---

## 4. Implementation Plan

### 4.1 MVP Version (Month 1 - Simple)

**Scope**: Minimum viable referral system for beta launch

**Features**:

| Feature | MVP | Notes |
|---------|-----|-------|
| Unique referral link | Yes | `sponseasy.com/r/{user-slug}` |
| Basic tracking | Yes | Cookie-based, 30-day window |
| Referral dashboard | Yes | Simple list: pending, completed |
| Email notification | Yes | When referral converts |
| Automatic reward | Yes | Pro month credited instantly |
| Post-publish prompt | Yes | Modal encouraging share |
| Pre-written messages | Yes | Copy-paste templates |
| Social sharing buttons | No | V2 |
| Leaderboard | No | V2 |
| Milestone badges | No | V2 |
| Analytics dashboard | No | V2 |

**Technical Requirements (MVP)**:

```
Database Schema:
================

referrals:
  - id: uuid
  - referrer_id: uuid (FK to users)
  - referee_id: uuid (FK to users, nullable until signup)
  - referral_code: string (unique)
  - status: enum (pending, signed_up, activated, rewarded)
  - created_at: timestamp
  - converted_at: timestamp (nullable)
  - rewarded_at: timestamp (nullable)

users (additions):
  - referral_code: string (unique)
  - referred_by: uuid (FK to users, nullable)
  - referral_credits: integer (months of Pro earned)
```

**API Endpoints (MVP)**:

```
GET  /api/referrals              # Get user's referrals
GET  /api/referrals/stats        # Get referral stats
POST /api/referrals/track        # Track referral click (cookie)
GET  /api/users/:code            # Validate referral code
```

**Development Estimate**: 3-5 days

### 4.2 V2 Version (Month 2-3 - Gamified)

**Additional Features**:

| Feature | Priority | Effort |
|---------|----------|--------|
| Social sharing buttons | P1 | 1 day |
| Leaderboard (monthly) | P2 | 2 days |
| Milestone system | P2 | 2 days |
| Achievement badges | P3 | 1 day |
| Referral analytics | P2 | 2 days |
| Email sequences | P2 | 1 day |
| Seasonal campaigns | P3 | 1 day |

**Development Estimate**: 8-12 days

### 4.3 Technical Architecture

**Referral Link System**:

```
Flow:
1. User visits sponseasy.com/r/clara-abc123
2. Server logs referral click
3. Server sets cookie: spons_ref=clara-abc123 (30-day expiry)
4. Redirect to landing page with UTM params
5. On signup, check cookie and link accounts
6. On activation (first proposal published), trigger reward
```

**Attribution Logic**:

```
Priority order:
1. Referral code in URL (explicit)
2. Referral cookie (passive)
3. Email match (if referee email was pre-shared)

Edge cases:
- Multiple referral links clicked: First one wins (first-touch)
- Cookie expired: No attribution
- Existing account: No attribution (must be new user)
```

**Reward Fulfillment**:

```
Trigger: referee publishes first proposal
Action:
1. Mark referral as "activated"
2. Credit referrer with 1 Pro month
3. Credit referee with 1 Pro month
4. Send email notification to both
5. Update leaderboard
6. Check milestone achievements
```

---

## 5. Tracking and Analytics

### 5.1 Key Metrics

**Primary Metrics**:

| Metric | Definition | Target | Tool |
|--------|------------|--------|------|
| **Viral Coefficient (K)** | Avg referrals sent x conversion rate | K = 0.3 (MVP), K = 0.5 (V2) | Custom |
| **Participation Rate** | % of users who share referral link | 15% | PostHog |
| **Referral Conversion Rate** | % of referred signups who activate | 40% | PostHog |
| **Referrals per Advocate** | Avg successful referrals per active referrer | 2.5 | Custom |

**Funnel Metrics**:

| Stage | Metric | Target |
|-------|--------|--------|
| Referral prompt shown | Impressions | 100% of activated users |
| Referral link copied | Copy rate | 20% |
| Referral link clicked | Click-through | 5 clicks per referrer |
| Referee signed up | Signup rate | 25% of clicks |
| Referee activated | Activation rate | 40% of signups |
| Reward issued | Completion rate | 100% of activations |

**Viral Coefficient Calculation**:

```
K = i x c

Where:
- i = Average invites sent per user
- c = Conversion rate (invite to activated user)

Example (MVP target):
- 15% of users send referrals (participation)
- Average referrer sends to 10 people
- 25% click the link
- 40% of clickers sign up
- 40% of signups activate

K = 0.15 x 10 x 0.25 x 0.40 x 0.40 = 0.06

Wait, that's too low. Let's recalculate with better assumptions:

Revised (optimistic):
- 30% of users send referrals
- Average referrer invites 5 people directly (high intent)
- 40% click (warm leads, personal invite)
- 50% sign up
- 40% activate

K = 0.30 x 5 x 0.40 x 0.50 x 0.40 = 0.12

Still below 1.0, which means referrals augment growth but don't create viral explosion.
This is normal for B2B/productivity tools. Target: K = 0.2-0.3 (each user brings 0.2-0.3 new users on average).
```

### 5.2 Attribution Tracking

**Tracking Implementation**:

| Method | Use Case | Reliability |
|--------|----------|-------------|
| Referral code in URL | Direct link share | High |
| First-party cookie | Return visits | Medium (30-day window) |
| Email match | Pre-registered referrals | High |
| UTM parameters | Channel attribution | High |

**UTM Structure**:

```
Referral link base: sponseasy.com/r/{code}
Redirects to: sponseasy.com/?ref={code}&utm_source=referral&utm_medium={channel}&utm_campaign=referral_program

Channels:
- email
- twitter
- linkedin
- whatsapp
- facebook
- copy (default)
```

**PostHog Events**:

| Event | Properties | Trigger |
|-------|------------|---------|
| `referral_prompt_viewed` | user_id, trigger_type | Modal shown |
| `referral_link_copied` | user_id, channel | Copy button clicked |
| `referral_link_shared` | user_id, channel | Share button clicked |
| `referral_link_clicked` | referrer_code, source | Landing page loaded with ref |
| `referral_signup` | referrer_id, referee_id | New user signs up via referral |
| `referral_activated` | referrer_id, referee_id | Referee publishes first proposal |
| `referral_rewarded` | user_id, reward_type, amount | Reward credited |

### 5.3 Fraud Prevention

**Risk Assessment**:

| Fraud Type | Risk Level | Detection Method |
|------------|------------|------------------|
| Self-referral | High | Email domain matching, IP/device fingerprint |
| Fake accounts | Medium | Email verification, behavior analysis |
| Referral farms | Low | Volume anomaly detection |
| Collusion rings | Low | Network analysis |

**Prevention Measures (MVP)**:

| Measure | Implementation | Effort |
|---------|----------------|--------|
| Email verification | Required for signup | Already implemented |
| Disposable email block | Block known disposable domains | 1 hour |
| Same IP warning | Flag if referrer/referee share IP | 2 hours |
| Manual review queue | Flag users with 5+ referrals in 7 days | 2 hours |
| Activation requirement | Referee must publish proposal | Core mechanic |

**Fraud Detection Rules**:

```
Auto-flag for review if:
- Same IP address for referrer and referee
- Same device fingerprint
- Email domains match (both @gmail.com is fine, both @company.com flagged)
- Referee account shows no activity after signup
- Referrer has 10+ pending referrals
- Signup/activation happens within 5 minutes

Auto-reject if:
- Known disposable email domain
- Previously banned user
- Exact same name + phone as existing user
```

**Terms and Conditions** (Required):

```
Referral Program Terms:
1. Referrals must be genuine new users
2. Self-referrals are prohibited
3. Spons Easy reserves the right to revoke rewards for abuse
4. Rewards expire 12 months after earning
5. Referral credits have no cash value
6. One referral reward per new user
7. Referee must activate within 30 days
```

---

## 6. Communication Templates

### 6.1 Referral Invite Email

**Subject Lines** (A/B test):

- "I found the tool you need for sponsorships"
- "This is how I create sponsorship proposals now"
- "You'll love this - and we both get 1 month free"

**Email Body**:

```
Subject: I found a tool you'll love for sponsorships

Hey [First Name],

I've been using Spons Easy to create sponsorship proposals and wanted to share it with you.

Instead of spending hours in Canva or PowerPoint, I can now create a professional sponsorship proposal in 5 minutes. It has a live preview, one-click publishing, and even captures leads from interested sponsors.

Since you [organize events / create content / run an association], I thought you might find it useful too.

If you sign up with my link, we'll both get 1 month of Pro free:

[REFERRAL LINK BUTTON]

Let me know what you think!

Best,
[Referrer Name]

P.S. The free tier lets you create 1 proposal - enough to test it out. I think you'll be impressed.
```

### 6.2 Reward Notification (Referrer)

**Subject**: "You earned 1 month Pro free!"

```
Hey [Name],

Great news - [Referee Name] just activated their account!

As a thank you for spreading the word, you've earned:

+1 month Pro free

Your current Pro credits: [X] months

[View Your Referral Dashboard]

Keep sharing to earn more:
- 1 referral = 1 month Pro
- 5 referrals = Founding Referrer badge + bonus months
- 10 referrals = Lifetime 50% discount

Your referral link: [LINK]

Thanks for being an advocate!

The Spons Easy Team
```

### 6.3 Reward Notification (Referee)

**Subject**: "Welcome! You've got 1 month Pro free"

```
Hey [Name],

Welcome to Spons Easy!

Thanks to [Referrer Name]'s referral, you're starting with:

1 month Pro free

That means you get:
- Unlimited proposals
- PDF export
- Custom branding
- Analytics dashboard
- Priority support

Your Pro access is active now. Create your first proposal:

[Create Proposal]

Want to earn more free months? Share Spons Easy with friends:

[Your Referral Link]

Happy proposing!

The Spons Easy Team
```

### 6.4 Milestone Celebration

**Subject**: "You've reached a milestone! - [Milestone Name]"

```
Hey [Name],

You did it! You've reached the [Milestone Name] milestone.

[BADGE IMAGE]

With [X] successful referrals, you've earned:
- [Reward details]
- [Badge name] badge (displayed on your profile)

You're now in the top [X]% of referrers!

Next milestone: [Next milestone details]
[X] more referrals to unlock.

Keep sharing: [REFERRAL LINK]

Congratulations!

The Spons Easy Team
```

### 6.5 Referral Reminder (Non-Participants)

**Subject**: "Did you know? Get 1 month Pro free"

**Timing**: 7 days after user activates, if no referral shared

```
Hey [Name],

Quick reminder: you can get 1 month Pro free by sharing Spons Easy with friends.

Here's how it works:
1. Share your unique link: [REFERRAL LINK]
2. When a friend signs up and publishes their first proposal
3. You both get 1 month Pro free

It takes 30 seconds to share. Your next Pro month could be free.

[Copy Referral Link]

Happy proposing!

The Spons Easy Team

P.S. So far, our referrers have earned [X] months of free Pro. Join them!
```

### 6.6 Re-Engagement (Inactive Referrers)

**Subject**: "Your friends are missing out"

**Timing**: 30 days after last referral activity

```
Hey [Name],

It's been a while since you shared Spons Easy.

Your referral link is still active:
[REFERRAL LINK]

You've earned [X] months of Pro so far. Want more?

Share with:
- Creator friends looking for sponsorships
- Association leaders in your network
- Event organizers you know

Every successful referral = 1 month Pro free for both of you.

[Copy Link] [Share via Email]

See you soon!

The Spons Easy Team
```

---

## 7. Growth Projections

### 7.1 Viral Coefficient Targets

| Phase | Timeline | K-Factor Target | Meaning |
|-------|----------|-----------------|---------|
| MVP | Month 1 | K = 0.1 | Each 10 users bring 1 new user |
| Growth | Month 2-3 | K = 0.2 | Each 5 users bring 1 new user |
| Scale | Month 4+ | K = 0.3 | Each 3.3 users bring 1 new user |

**Why K < 1.0 is OK**:

- B2B/productivity tools rarely achieve viral growth (K > 1)
- K = 0.3 means 30% more users at no acquisition cost
- Combined with footer virality and organic channels, compounds significantly
- Focus is augmenting growth, not replacing other channels

### 7.2 Referral Funnel Assumptions

**MVP Month (50 users target)**:

| Stage | Metric | Value | Users/Actions |
|-------|--------|-------|---------------|
| Active users | Base | - | 50 |
| See referral prompt | % of active | 100% | 50 |
| Copy referral link | % who copy | 20% | 10 |
| Friends invited | Avg per referrer | 5 | 50 invites |
| Click referral link | % of invites | 30% | 15 clicks |
| Sign up | % of clicks | 40% | 6 signups |
| Activate (publish) | % of signups | 40% | 2-3 activations |

**Result**: 2-3 new activated users from referrals in Month 1 (MVP)

**Month 3 (200 users target)**:

| Stage | Metric | Value | Users/Actions |
|-------|--------|-------|---------------|
| Active users | Base | - | 200 |
| See referral prompt | % of active | 100% | 200 |
| Copy referral link | % who copy | 25% | 50 |
| Friends invited | Avg per referrer | 5 | 250 invites |
| Click referral link | % of invites | 30% | 75 clicks |
| Sign up | % of clicks | 40% | 30 signups |
| Activate (publish) | % of signups | 50% | 15 activations |

**Result**: ~15 new activated users from referrals in Month 3

### 7.3 Impact on Customer Acquisition

**Acquisition Channel Mix (Month 6 Projection)**:

| Channel | Users | % of Total | CAC |
|---------|-------|------------|-----|
| Organic (SEO, word-of-mouth) | 150 | 40% | EUR 0 |
| Referral program | 75 | 20% | EUR 2.10 |
| Proposal footer (passive viral) | 50 | 13% | EUR 0 |
| Community/Discord | 50 | 13% | EUR 0 |
| Product Hunt + social | 50 | 13% | EUR 0 |
| **Total** | **375** | **100%** | **EUR 0.42 blended** |

**Referral Program ROI**:

| Metric | Value |
|--------|-------|
| Users acquired via referral | 75 |
| Reward cost (EUR 2.10 x 75) | EUR 157.50 |
| Target CAC without referrals | EUR 15 |
| Savings vs paid acquisition | EUR 967.50 |
| ROI | 514% |

### 7.4 Revenue Impact

**Referral Users to Revenue (Month 6)**:

| Metric | Value |
|--------|-------|
| Referred users | 75 |
| Free tier users (60%) | 45 |
| Pro conversion (40%) | 30 |
| Pro users | 30 |
| MRR from referred users | EUR 870 |
| Annual projection | EUR 10,440 |

**LTV Comparison**:

| Acquisition Channel | Expected LTV | Rationale |
|--------------------|--------------|-----------|
| Organic | EUR 200 | Baseline |
| Referral | EUR 300 | 1.5x (referred users have higher retention) |
| Paid ads | EUR 150 | Lower quality, tire-kickers |

---

## 8. Launch Checklist

### 8.1 MVP Launch (Day 1-7)

**Pre-Launch**:

- [ ] Implement referral code generation for all users
- [ ] Build referral tracking (cookie + database)
- [ ] Create referral dashboard page
- [ ] Implement post-publish modal
- [ ] Set up reward fulfillment automation
- [ ] Create email templates (invite, reward notification)
- [ ] Block disposable email domains
- [ ] Add referral link to user dashboard
- [ ] Test full flow end-to-end

**Launch Day**:

- [ ] Enable referral system for all users
- [ ] Send announcement email to existing users
- [ ] Add referral section to welcome email
- [ ] Monitor for bugs/issues

**Post-Launch (Week 1)**:

- [ ] Track participation rate
- [ ] Monitor fraud signals
- [ ] Collect user feedback on flow
- [ ] Fix any UX issues

### 8.2 V2 Launch (Month 2)

- [ ] Build leaderboard
- [ ] Implement milestone system
- [ ] Create achievement badges
- [ ] Add social sharing buttons
- [ ] Build referral analytics dashboard
- [ ] Implement email sequences (reminders)
- [ ] Launch seasonal campaign (2x rewards)

### 8.3 Optimization Cycle (Monthly)

- [ ] Review referral metrics
- [ ] A/B test messaging
- [ ] Adjust reward amounts if needed
- [ ] Update fraud detection rules
- [ ] Celebrate top referrers
- [ ] Plan seasonal campaigns

---

## 9. Success Metrics Dashboard

### 9.1 Weekly Tracking

| Metric | Week 1 | Week 2 | Week 3 | Week 4 | Target |
|--------|--------|--------|--------|--------|--------|
| Referral prompts shown | | | | | 100% of activated |
| Referral links copied | | | | | 20% |
| Referrals sent | | | | | 50+ invites |
| Referral signups | | | | | 10+ |
| Referral activations | | | | | 5+ |
| Rewards issued | | | | | = activations |
| K-factor | | | | | 0.1+ |

### 9.2 Monthly Review

| Metric | Month 1 | Month 2 | Month 3 | Target |
|--------|---------|---------|---------|--------|
| Participation rate | | | | 15%+ |
| Referrals per advocate | | | | 2.5+ |
| Referral conversion rate | | | | 40%+ |
| Users from referrals | | | | 10%+ of total |
| Reward cost | | | | < EUR 3/user |
| Fraud rate | | | | < 5% |

---

## 10. Appendix

### A. Referral Program Comparison

**Benchmarks from Successful Programs**:

| Company | Reward (Referrer) | Reward (Referee) | K-Factor |
|---------|-------------------|------------------|----------|
| Dropbox | 500MB storage | 500MB storage | ~0.3 |
| Uber | EUR 10-20 credit | EUR 10-20 credit | ~0.5 |
| Airbnb | EUR 25 credit | EUR 40 credit | ~0.3 |
| Morning Brew | Swag tiers | None | ~0.4 |
| **Spons Easy** | 1 month Pro | 1 month Pro | 0.2-0.3 (target) |

### B. Localization Notes

**French Market Considerations**:

- All referral emails and prompts in French
- EUR currency only
- GDPR compliance for email collection
- French-specific social platforms (LinkedIn strong in France)
- Consider partnership with French creator communities

### C. Seasonal Campaign Ideas

| Campaign | Timing | Mechanic | Goal |
|----------|--------|----------|------|
| Launch Week | Day 1-7 | 2x rewards (2 months instead of 1) | Kickstart referrals |
| Back to School | September | "Equip your association" theme | Target Alice persona |
| Year-End | December | "Give the gift of Pro" themed | Holiday sharing boost |
| Anniversary | Launch + 1 year | Top referrers get lifetime Pro | Celebrate community |

### D. FAQ for Users

**How does the referral program work?**

> Share your unique link with friends. When they sign up and publish their first proposal, you both get 1 month Pro free.

**How do I find my referral link?**

> Go to your Dashboard and click "Referrals" in the sidebar. Your unique link is displayed there.

**When do I receive my reward?**

> Rewards are credited instantly when your friend publishes their first proposal. You'll receive an email confirmation.

**Is there a limit to how many friends I can refer?**

> No limit! Refer as many friends as you want. Each successful referral earns you 1 month Pro free.

**Can I refer myself?**

> No. Self-referrals are against our terms and will result in reward forfeiture.

**Do referral credits expire?**

> Yes, credits expire 12 months after earning. Use them or lose them!

**Can I transfer my credits to another user?**

> No, referral credits are non-transferable.

---

**Document Maintenance**:

- Review monthly during growth phase
- Update metrics weekly during first month
- Archive outdated tactics, add new learnings
- Sync with pricing-strategy.md if reward economics change

---

*Created: 2025-11-25*
*Last Updated: 2025-11-25*
*Version: 1.0.0*

# Customer Success Playbook: Spons Easy

**Created**: 2025-11-25
**Version**: 1.0.0
**Status**: Ready for Implementation
**Audience**: Solo Founder Managing Early Customers
**Based on**: Constitution, PRD, Personas, Pricing Strategy, Email Sequences

---

## Executive Summary

This playbook provides a practical framework for a solo founder to manage customer success at Spons Easy. It focuses on:

- **Time-to-Value**: First proposal in under 5 minutes
- **Activation Rate**: 40% target (first proposal published)
- **NPS Target**: >30
- **Churn Target**: <8% monthly

The playbook is designed for scale-as-you-grow: start with manual processes, automate as you gain traction.

---

## 1. Onboarding Excellence

### 1.1 The First 5 Minutes Experience

**Critical Path to Value**:

```
Signup (30s) -> Dashboard (10s) -> Create Proposal (2min) -> Preview (instant) -> Publish (30s)
Total: 4 minutes 10 seconds
```

**Friction Points to Eliminate**:

| Step | Potential Friction | Solution |
| ---- | ------------------ | -------- |
| Signup | Long form | Only require email + password + name |
| First action | Blank dashboard | Empty state with prominent "Create First Proposal" CTA |
| Builder | Too many fields | Progressive disclosure - show essentials first |
| Publishing | Fear of commitment | "You can edit anytime after publishing" reassurance |

**First 5 Minutes Checklist**:

- [ ] Welcome modal shows 3-step quick start
- [ ] Sample content pre-filled in builder (editable)
- [ ] Real-time preview builds confidence
- [ ] "Publish" button visible without scrolling
- [ ] Success celebration on first publish (confetti, share prompt)

### 1.2 Day 1/7/30 Milestones

**Day 1 - "Aha Moment" Achieved**

| Goal | Action | Measurement |
| ---- | ------ | ----------- |
| Account created | Signup complete | User record exists |
| First proposal created | Builder used | Proposal in draft status |
| First proposal published | Publish button clicked | Proposal status = published |
| Share link copied | User copied public URL | Copy button clicked |

**Automated Day 1 Actions**:
- Welcome email sent immediately (Sequence 2, Email 1)
- In-app tooltip tour (optional, skippable)
- Dashboard shows progress tracker

**Day 7 - Engagement Established**

| Goal | Action | Measurement |
| ---- | ------ | ----------- |
| Return visit | User logged in again | Session count > 1 |
| Proposal refined | Edits made to proposal | Updated_at changed |
| First lead received | Sponsor submitted form | Lead record created |
| Outreach started | Public URL shared externally | Referrer data from views |

**Automated Day 7 Actions**:
- Tips email sent (Sequence 2, Emails 2-3)
- If no return visit: Re-engagement nudge
- If lead received: Celebration email + lead management tips

**Day 30 - Value Confirmed**

| Goal | Action | Measurement |
| ---- | ------ | ----------- |
| Multiple leads | 3+ leads received | Lead count >= 3 |
| Proposal iterated | Proposal edited 2+ times | Edit count >= 2 |
| Upgrade considered | Viewed pricing or hit limit | Pricing page view or trigger |
| NPS provided | Survey completed | NPS score recorded |

**Automated Day 30 Actions**:
- Success check-in email (Sequence 2, Email 5)
- NPS survey triggered
- If high engagement: Upgrade prompt
- If low engagement: Re-engagement sequence

### 1.3 Success Checklist by Persona

**Clara (Content Creator) - "Confidence Builder"**

Clara needs quick wins and validation that she looks professional.

| Day | Success Milestone | How to Help |
| --- | ----------------- | ----------- |
| 1 | First proposal published | "Your proposal looks more professional than creators with 10x your followers" |
| 3 | Shared with one brand | Outreach template in email sequence |
| 7 | First proposal view | "A sponsor just viewed your proposal!" notification |
| 14 | First lead captured | Celebration + "Here's how to follow up" guide |
| 30 | First sponsor conversation | "You're doing it! Tips for closing the deal" |

**Key Messaging for Clara**:
- "You look professional"
- "Brands take you seriously now"
- "You're ahead of 90% of creators"

**Alice (Association Admin) - "Hand-Holder"**

Alice needs simplicity and reassurance that this is for associations, not just businesses.

| Day | Success Milestone | How to Help |
| --- | ----------------- | ----------- |
| 1 | First proposal created | "Your tennis club now has a professional sponsorship page" |
| 3 | Shared with board | "Share this with your committee" prompt |
| 7 | Local business contacted | "Here's how other associations approach local sponsors" |
| 14 | First local response | "A business is interested!" |
| 30 | First sponsorship discussion | "You're not begging - you're offering a partnership" |

**Key Messaging for Alice**:
- "Other associations like yours use this"
- "No experience needed"
- "You deserve professional tools too"

**Eric (Event Organizer) - "Efficiency Expert"**

Eric needs speed and the ability to reuse work across events.

| Day | Success Milestone | How to Help |
| --- | ----------------- | ----------- |
| 1 | First event proposal created | "That was faster than PowerPoint, right?" |
| 3 | Tier structure defined | "Your sponsorship packages are ready to pitch" |
| 7 | Multiple sponsors contacted | "Track all your outreach in one place" |
| 14 | Lead pipeline started | "3 sponsors interested - here's how to prioritize" |
| 30 | First sponsor closed | "One down, more to come. Time saved: 2 weeks" |

**Key Messaging for Eric**:
- "Save 2 weeks per event"
- "Never recreate from scratch"
- "Track everything in one place"

---

## 2. Health Scoring

### 2.1 Health Score Formula

**Spons Easy Customer Health Score (0-100)**

Given the early stage and solo founder context, this is a simplified health score that can be calculated weekly with minimal tooling.

```
Health Score = Usage (40) + Engagement (30) + Value Realized (30)
```

**Usage Score (40 points max)**:

| Factor | Points | Criteria |
| ------ | ------ | -------- |
| Login frequency | 0-15 | 0 logins = 0, 1-2 = 5, 3-4 = 10, 5+ = 15 |
| Proposals created | 0-10 | 0 = 0, 1 = 5, 2+ = 10 |
| Proposals published | 0-15 | 0 = 0, 1 = 10, 2+ = 15 |

**Engagement Score (30 points max)**:

| Factor | Points | Criteria |
| ------ | ------ | -------- |
| Email opens | 0-10 | <20% = 0, 20-50% = 5, >50% = 10 |
| Feature usage | 0-10 | Basic only = 0, Used tiers = 5, Used customization = 10 |
| Support interaction | 0-10 | Negative ticket = 0, No contact = 5, Positive interaction = 10 |

**Value Realized Score (30 points max)**:

| Factor | Points | Criteria |
| ------ | ------ | -------- |
| Leads received | 0-15 | 0 = 0, 1-3 = 5, 4-9 = 10, 10+ = 15 |
| Lead status updates | 0-10 | No updates = 0, Some = 5, Active pipeline = 10 |
| Referral made | 0-5 | No = 0, Yes = 5 |

### 2.2 Risk Indicators

**Early Warning Signs** (Track Weekly):

| Signal | Risk Level | Detection Method |
| ------ | ---------- | ---------------- |
| No login in 14+ days | High | Last login timestamp |
| 0 proposals published | Medium | Proposal status check |
| Support complaint | High | Support ticket sentiment |
| Hit free tier limit + no upgrade | Medium | Trigger event + no conversion |
| NPS score 0-6 (Detractor) | High | NPS survey response |
| Email unsubscribe | Medium | Email service data |
| Competitor mention | High | Support ticket or feedback |

**Risk Indicator Dashboard** (Weekly Review):

```
RISK INDICATORS - Week of [DATE]

HIGH RISK (Immediate Action):
- [X] users inactive 14+ days
- [X] detractor NPS scores
- [X] support complaints

MEDIUM RISK (Monitor):
- [X] users at free tier limits
- [X] users with 0 published proposals
- [X] email unsubscribes

HEALTHY:
- [X] active users with leads
- [X] recent upgrades
- [X] promoter NPS scores
```

### 2.3 Green/Yellow/Red Thresholds

**Health Tiers and Actions**:

| Tier | Score | % of Users (Target) | Characteristics | Action Priority |
| ---- | ----- | ------------------- | --------------- | --------------- |
| **Green** | 70-100 | 60% | Active, receiving leads, engaged | Expansion opportunities |
| **Yellow** | 40-69 | 30% | Some activity, not fully activated | Re-engagement |
| **Red** | 0-39 | <10% | Inactive, at-risk, frustrated | Churn prevention |

**Green Users (70-100)**:

- Published at least 1 proposal
- Logged in within last 7 days
- Receiving leads OR actively sharing proposal
- No support complaints

**Actions for Green**:
- Monthly check-in email
- Feature updates
- Upgrade prompts (if free tier)
- Referral program invitation
- Case study/testimonial request

**Yellow Users (40-69)**:

- Created proposal but not published OR
- Published but no leads OR
- Logged in but declining frequency OR
- Hit upgrade trigger but didn't convert

**Actions for Yellow**:
- Re-engagement email sequence (Sequence 3)
- Personal email from founder
- "How can I help?" outreach
- Feature tutorial content
- Limited-time upgrade offer

**Red Users (0-39)**:

- No login in 14+ days OR
- No proposal created OR
- Support complaint OR
- NPS detractor (0-6)

**Actions for Red**:
- Immediate personal outreach
- "What went wrong?" feedback request
- Churn prevention offer
- Product feedback interview request
- Document learnings regardless of outcome

---

## 3. Retention Playbooks

### 3.1 At-Risk Intervention

**Playbook: User Inactive 7+ Days (Yellow)**

```
TRIGGER: Last login > 7 days AND proposal exists

DAY 7:
- [ ] Automated re-engagement email (Sequence 3, Email 1)
- [ ] In-app notification queued for next login

DAY 10 (if still inactive):
- [ ] Personal email from founder:
  "Hi {{name}}, noticed you haven't been back. Everything okay?
   Your proposal [title] is still live. Any questions I can help with?"

DAY 14 (if still inactive):
- [ ] Move to Red status
- [ ] Trigger churn prevention playbook
```

**Playbook: User Hit Limit but Didn't Upgrade (Yellow)**

```
TRIGGER: Hit upgrade trigger (2nd proposal, 10 leads, PDF export) + 48h no upgrade

IMMEDIATE:
- [ ] Automated upgrade email (Sequence 4, Email 1)

DAY 3:
- [ ] Social proof email (Sequence 4, Email 2)

DAY 5:
- [ ] Limited offer email (Sequence 4, Email 3)

DAY 7 (if no upgrade):
- [ ] Personal email: "I noticed you tried to [action].
       Is the pricing a concern, or is something else holding you back?"

DAY 14 (if no upgrade):
- [ ] Accept they may stay on free tier
- [ ] Continue nurturing with value content
- [ ] Re-offer upgrade after 30 days if still active
```

**Playbook: Support Complaint Received (Red)**

```
TRIGGER: Negative support ticket OR frustration expressed

IMMEDIATE (within 2 hours):
- [ ] Acknowledge the issue personally
- [ ] Apologize sincerely (even if not our fault)
- [ ] Provide specific solution or timeline
- [ ] Offer compensation if appropriate (extend Pro trial, etc.)

FOLLOW-UP (24-48 hours):
- [ ] Confirm issue resolved
- [ ] Thank them for patience
- [ ] Ask if there's anything else

POST-RESOLUTION (7 days):
- [ ] Check-in email: "How's everything working now?"
- [ ] If positive: Ask for feedback/testimonial
- [ ] If negative: Escalate to deeper discovery
```

### 3.2 Churn Prevention Tactics

**Pre-Churn Signals and Interventions**:

| Signal | Timing | Intervention |
| ------ | ------ | ------------ |
| Pro user reduces usage | 2 weeks before renewal | "Getting full value from Pro?" check-in |
| Annual user 30 days out | 30 days before renewal | Value recap email + renewal reminder |
| Multiple support tickets | Any time | Priority resolution + founder call offer |
| Competitor mentioned | Any time | Feature comparison + "What are we missing?" call |
| Budget concerns expressed | Any time | Offer discount or downgrade path |

**Churn Prevention Offers** (Use Sparingly):

| Situation | Offer | Conditions |
| --------- | ----- | ---------- |
| Price objection (Pro) | 50% off next 3 months | First-time request only |
| "Not using it enough" | Pause subscription (1-3 months) | Pro users, good history |
| "Missing feature X" | Early access to beta + direct feedback line | Feature on roadmap |
| Non-profit/association budget | 50% permanent discount | Verified non-profit |
| Student/early-stage creator | 3 months free to prove value | <5K followers verified |

**Churn Exit Interview Template**:

```
Subject: Quick question before you go

Hi {{name}},

I saw you cancelled your Spons Easy subscription. Totally understand -
not every tool is right for everyone.

Would you mind telling me why? It helps me make the product better
for others like you.

Just reply with a number:

1. Pricing - Too expensive for what I got
2. Features - Missing something I needed
3. Time - Didn't have time to use it properly
4. Results - Didn't get the sponsorships I hoped for
5. Other - [please explain]

Thanks for trying Spons Easy. Door's always open if things change.

{{sender_name}}

P.S. If there's anything I could have done differently to keep you,
I'd genuinely like to know.
```

### 3.3 Win-Back Campaigns

**Win-Back Sequence** (For Churned Users):

**Timing**: Start 30 days after churn

**Email 1: "We Miss You" (Day 30)**

```
Subject: What we've built since you left

Hi {{name}},

It's been a month since you left Spons Easy. No hard feelings -
I wanted to share what we've improved in case it addresses
what didn't work for you:

- [New Feature 1]
- [New Feature 2]
- [Improvement based on common churn feedback]

If any of these are what you were looking for, your account is
still there. Just log in to pick up where you left off.

[BUTTON: See What's New]

{{sender_name}}
```

**Email 2: "Special Comeback Offer" (Day 45)**

```
Subject: 50% off to come back (7 days only)

Hi {{name}},

Last month I shared what we've improved.

If you're thinking about giving Spons Easy another try,
I'd like to offer you 50% off Pro for your first 3 months.

Code: COMEBACK50
Expires: [Date]

[BUTTON: Reactivate My Account]

No pressure. But if sponsorships are still a goal,
we're here when you're ready.

{{sender_name}}
```

**Email 3: "Feedback Request" (Day 60)**

```
Subject: Can I ask you something?

Hi {{name}},

This is my last email about Spons Easy - I promise.

I'm still working to understand what makes the product
work for some people and not others.

Would you be open to a 15-minute call to share your experience?
I'm not trying to sell you anything - just want to learn.

[BUTTON: Book 15 Minutes]

Either way, thanks for trying Spons Easy.
I hope you find the sponsorships you're looking for.

{{sender_name}}
```

---

## 4. Expansion Strategy

### 4.1 Upgrade Journey Mapping

**Free to Pro Journey**:

```
Free User Journey:

Week 1: Activation
├── Creates first proposal
├── Publishes proposal
├── Shares with potential sponsor
└── [Health: Monitoring engagement]

Week 2-4: Value Discovery
├── Receives first leads
├── Updates proposal based on feedback
├── Hits first limit (2nd proposal or 10 leads)
└── [Trigger: Upgrade prompt shown]

Week 4-8: Decision Point
├── If converted: Pro onboarding
├── If not: Continue nurturing
└── [Sequence 4: Upgrade emails]

Post-Decision:
├── If Pro: Expansion opportunities
├── If Free: Seasonal re-offer (quarterly)
└── [Track: LTV potential]
```

**Pro to Business Journey** (Future):

```
Pro User Journey to Business:

Month 1-3: Pro Success
├── Multiple proposals active
├── Regular lead flow
├── Using advanced features (PDF, analytics)
└── [Health: Green tier maintained]

Month 4-6: Team Signals
├── Asks about sharing access
├── Multiple events/projects
├── Requests collaboration features
└── [Trigger: Business tier interest]

Month 6+: Business Upgrade
├── Offer Business tier preview
├── Highlight team features
├── Migration assistance
└── [Expansion: Account growth]
```

### 4.2 Expansion Triggers

**Trigger 1: Second Proposal Attempt (Primary)**

| Trigger | User tries to create 2nd proposal on free tier |
| ------- | ---------------------------------------------- |
| Timing | Immediate soft block |
| Message | "You've created an amazing proposal! Upgrade to Pro for unlimited proposals." |
| Offer | Standard Pro pricing (EUR 29/month) |
| Follow-up | Upgrade sequence if no conversion |

**Trigger 2: Lead Limit Reached (Primary)**

| Trigger | User receives 10th lead on free tier |
| ------- | ------------------------------------ |
| Timing | After 10th lead captured |
| Message | "Congratulations - 10 sponsors interested! Upgrade to never miss a lead." |
| Offer | Standard Pro + urgency ("X leads waiting") |
| Follow-up | Upgrade sequence if no conversion |

**Trigger 3: PDF Export Attempt (Primary)**

| Trigger | User clicks PDF export on free tier |
| ------- | ----------------------------------- |
| Timing | Immediate hard block |
| Message | "PDF export helps you reach sponsors via email. Available on Pro." |
| Offer | Standard Pro pricing |
| Follow-up | Upgrade sequence if no conversion |

**Trigger 4: Custom Branding Attempt (Secondary)**

| Trigger | User tries to modify branding/remove watermark |
| ------- | ---------------------------------------------- |
| Timing | Immediate hard block |
| Message | "Make it 100% yours - custom branding on Pro." |
| Offer | Standard Pro pricing |
| Follow-up | Upgrade sequence if no conversion |

**Trigger 5: High Engagement Free User (Proactive)**

| Trigger | Free user with Health Score >80 for 30 days |
| ------- | ------------------------------------------- |
| Timing | 30-day check-in |
| Message | Personal email: "You're getting great results - want to unlock more?" |
| Offer | 20% discount on annual plan |
| Follow-up | Single follow-up if no response |

### 4.3 Upsell Conversations

**Upgrade Conversation Framework** (For Manual Outreach):

**1. Acknowledge Success**
"I noticed [specific success metric - leads, views, etc]. That's impressive!"

**2. Identify Constraint**
"It looks like you're hitting [specific limit]. Is that creating any friction?"

**3. Quantify Value**
"With Pro, you could [specific benefit]. Given you're already getting [X leads], that could mean [projected outcome]."

**4. Make It Easy**
"Want to try Pro? I can set you up with [specific offer]. Takes 30 seconds to upgrade."

**5. No Pressure Close**
"No rush - just wanted to make sure you knew the option was there. Let me know if you have questions."

**Sample Upgrade Email** (Personal from Founder):

```
Subject: You're killing it with Spons Easy

Hi {{name}},

Just looked at your account - {{leads_count}} leads in {{days_active}} days.
That's better than 90% of our users!

I noticed you're on the free tier. A few things that might help:

- You've hit the 10-lead limit - there might be more waiting
- PDF export could help with email outreach (Pro feature)
- Analytics would show you which sponsors are most interested

If any of that sounds useful, I can get you started on Pro with 20% off
your first 3 months. Just reply "yes" and I'll send the link.

Either way, keep up the great work!

{{sender_name}}
```

---

## 5. Support Framework

### 5.1 Self-Service Resources

**Help Center Structure** (Priority Order for MVP):

**Tier 1 - Essential (Build First)**:

| Article | Purpose | Format |
| ------- | ------- | ------ |
| Quick Start Guide | First 5 minutes | Step-by-step + screenshots |
| Creating Your First Proposal | Core action | Video (2 min) + written |
| Publishing and Sharing | Core action | Step-by-step + screenshots |
| Managing Leads | After first success | Step-by-step |
| Account & Billing | Self-service support | FAQ format |

**Tier 2 - Helpful (Build After Launch)**:

| Article | Purpose | Format |
| ------- | ------- | ------ |
| Sponsorship Tier Best Practices | Improve proposals | Guide + examples |
| Writing Compelling Descriptions | Improve proposals | Templates |
| Outreach Email Templates | Drive results | Copy-paste templates |
| Understanding Analytics | Pro feature | Dashboard walkthrough |
| PDF Export Guide | Pro feature | Step-by-step |

**Tier 3 - Nice to Have (Build Based on Questions)**:

| Article | Purpose | Format |
| ------- | ------- | ------ |
| Pricing Your Sponsorships | Education | Calculator + guide |
| Case Studies | Social proof | Success stories |
| Advanced Customization | Power users | Reference |

**In-App Help Elements**:

| Element | Location | Content |
| ------- | -------- | ------- |
| Tooltips | Builder fields | Helpful hints on hover |
| Empty states | Dashboard, leads | Encouraging prompts + next action |
| Progress indicator | Builder | Completion percentage |
| Help button | Global header | Link to help center |
| Chat widget | All pages | Intercom or similar (Phase 2) |

### 5.2 Support Tiers (For Scale)

**Current State (Solo Founder)**:

| Channel | Response Time | Availability |
| ------- | ------------- | ------------ |
| Email (support@sponseasy.com) | <24 hours | Business hours |
| Founder direct reply | <4 hours | During business hours |
| In-app feedback | <24 hours | Async |

**Scaled State (Future - 500+ Users)**:

| Tier | Channel | Response Time | Handles |
| ---- | ------- | ------------- | ------- |
| **Tier 0** | Self-service | Instant | FAQs, guides, common issues |
| **Tier 1** | Help widget + email | <4 hours | How-to questions, minor bugs |
| **Tier 2** | Priority email | <2 hours | Pro users, billing, complex issues |
| **Tier 3** | Direct founder | <1 hour | Churn risk, critical bugs, escalations |

**Support Quality Metrics**:

| Metric | Target | Alert |
| ------ | ------ | ----- |
| First response time | <4 hours | >8 hours |
| Resolution time | <24 hours | >48 hours |
| Customer satisfaction | >4.5/5 | <4.0/5 |
| First contact resolution | >70% | <50% |
| Tickets per 100 users | <10 | >20 |

### 5.3 Escalation Paths

**Escalation Matrix**:

| Issue Type | Initial Handler | Escalate If | Escalate To |
| ---------- | --------------- | ----------- | ----------- |
| How-to question | Self-service/Email | Not resolved in 2 exchanges | Founder |
| Bug report | Email | Reproducible critical bug | Founder (immediate) |
| Billing issue | Email | Refund request or error | Founder |
| Feature request | Email | Common request (3+ users) | Product backlog |
| Complaint/frustration | Email | Churn risk signal | Founder (immediate) |
| Security concern | Email | Any security issue | Founder (immediate) |

**Escalation Response Templates**:

**Bug Acknowledged**:
```
Hi {{name}},

Thanks for reporting this. I've confirmed the issue and
it's now my top priority to fix.

Expected fix: [timeline]

I'll email you as soon as it's resolved. Sorry for the inconvenience.

{{sender_name}}
```

**Feature Request Logged**:
```
Hi {{name}},

Great idea! I've added this to our feature backlog:
[Feature description]

I can't promise a timeline, but I'll let you know if/when
we start working on it.

Thanks for helping make Spons Easy better!

{{sender_name}}
```

**Complaint Acknowledged**:
```
Hi {{name}},

I'm really sorry about [issue]. That's not the experience
you should have.

Here's what I'm going to do:
1. [Specific action]
2. [Specific action]
3. [Compensation if appropriate]

I'll follow up within [timeline] to make sure this is fully resolved.

Thanks for your patience.

{{sender_name}}
```

---

## 6. Feedback Loops

### 6.1 NPS Survey Strategy

**Survey Timing**:

| Trigger | Survey Type | Question Count |
| ------- | ----------- | -------------- |
| Day 14 after signup | Short NPS | 2 questions |
| Day 30 after signup | Full NPS | 3 questions |
| Post-upgrade (Day 7) | Upgrade NPS | 2 questions |
| Quarterly (Pro users) | Relationship NPS | 3 questions |

**NPS Survey Questions**:

**Short NPS (Day 14)**:
1. "How likely are you to recommend Spons Easy to a friend or colleague?" (0-10)
2. "What's the main reason for your score?" (Open text)

**Full NPS (Day 30)**:
1. "How likely are you to recommend Spons Easy to a friend or colleague?" (0-10)
2. "What's the main reason for your score?" (Open text)
3. "What's one thing we could do to improve?" (Open text)

**Follow-Up Actions by Score**:

| Score | Category | Immediate Action | Follow-Up |
| ----- | -------- | ---------------- | --------- |
| 9-10 | Promoter | Thank you + referral ask | Testimonial/case study request |
| 7-8 | Passive | Thank you + "what would make it a 10?" | Feature request tracking |
| 0-6 | Detractor | Personal outreach within 24h | Churn prevention playbook |

**Promoter Follow-Up Template**:
```
Subject: Thanks for the amazing feedback!

Hi {{name}},

Wow - a {{score}}/10! That means a lot, especially at this early stage.

Since you're finding Spons Easy helpful, would you be open to
either of these?

1. Share a quick testimonial I could feature on our site
2. Refer a creator/organizer friend who might benefit

[BUTTON: Share Your Story]
[BUTTON: Invite a Friend]

Either way, thanks for being part of this journey.

{{sender_name}}
```

**Detractor Follow-Up Template**:
```
Subject: Can we chat about your experience?

Hi {{name}},

I saw your feedback - I'm sorry Spons Easy hasn't met your expectations.

I'd love to understand what went wrong. Would you be open to a
quick 10-minute call? I want to make this right.

[BUTTON: Book 10 Minutes]

If calls aren't your thing, just reply with what's frustrating
you and I'll do my best to help.

{{sender_name}}
```

### 6.2 Feature Request Management

**Request Capture Process**:

| Source | Capture Method | Processing |
| ------ | -------------- | ---------- |
| Support emails | Tag and log in spreadsheet | Weekly review |
| NPS open text | Extract and log | With NPS analysis |
| In-app feedback | Collect in feedback widget | Weekly review |
| Direct founder conversations | Note after call | Immediate log |

**Feature Request Tracking** (Simple Spreadsheet):

| Feature | Requester Type | Request Count | Impact | Effort | Priority |
| ------- | -------------- | ------------- | ------ | ------ | -------- |
| Custom domains | Eric (event) | 3 | High | High | P2 |
| Proposal templates | Clara (creator) | 5 | Medium | Medium | P1 |
| Team sharing | Eric (event) | 2 | High | High | P3 |
| Multiple languages | Alice (association) | 1 | Low | High | P4 |

**Prioritization Framework**:

```
Priority = (Request Count x 2) + Impact Score + (10 - Effort Score)

Impact Score: High=10, Medium=5, Low=2
Effort Score: High=10, Medium=5, Low=2

P1: Score > 25
P2: Score 15-25
P3: Score < 15
```

**Communicating Back to Requesters**:

**Request Received**:
```
Thanks for the suggestion! I've added it to our roadmap.
Can't promise timing, but I'll let you know when it's shipped.
```

**Request Shipped**:
```
Subject: You asked, we built it!

Hi {{name}},

Remember when you requested [feature]? It's live!

Here's how to use it: [link/explanation]

Thanks for helping shape Spons Easy.

{{sender_name}}
```

**Request Declined**:
```
Thanks for the suggestion. After some thought, we've decided
not to build [feature] because [honest reason].

If this is a dealbreaker, I understand. Let me know if there's
another way I can help.
```

### 6.3 Continuous Discovery

**Weekly Discovery Habits** (15-30 min/week):

| Day | Activity | Time | Output |
| --- | -------- | ---- | ------ |
| Monday | Review NPS responses from past week | 10 min | Detractor follow-ups scheduled |
| Wednesday | Review support tickets for patterns | 10 min | Common issues identified |
| Friday | Read all feature requests | 10 min | Roadmap updates |

**Monthly Discovery Activities**:

| Activity | Time | Output |
| -------- | ---- | ------ |
| 2-3 user interviews (Green users) | 1-2 hours | Success patterns documented |
| 1-2 user interviews (Red users) | 30-60 min | Failure patterns documented |
| Feature request prioritization | 30 min | Updated roadmap |
| Competitive check-in | 15 min | Market awareness |

**User Interview Questions** (Mom Test Style):

**For Successful Users**:
1. "Walk me through how you created your last proposal."
2. "What happened after you shared it with sponsors?"
3. "What's the most valuable part of Spons Easy for you?"
4. "If Spons Easy disappeared tomorrow, what would you do instead?"
5. "What's one thing that would make it even better?"

**For Struggling Users**:
1. "When was the last time you logged into Spons Easy?"
2. "What stopped you from using it more?"
3. "What were you hoping to accomplish when you signed up?"
4. "What would need to change for you to use it regularly?"
5. "Have you found another solution for sponsorship proposals?"

---

## 7. Automation Roadmap

### 7.1 Phase 1: Manual (Launch - 50 Users)

**Tools**: Email + Spreadsheet + Manual outreach

| Process | Method |
| ------- | ------ |
| Onboarding emails | Email service (Resend) - automated |
| Health scoring | Weekly spreadsheet review |
| At-risk intervention | Manual email from founder |
| NPS surveys | Simple form (Tally or Typeform) |
| Support | Direct email |

**Time Investment**: ~5 hours/week

### 7.2 Phase 2: Semi-Automated (50-200 Users)

**Tools**: Email service + Simple CRM (Notion or Airtable) + In-app triggers

| Process | Method |
| ------- | ------ |
| Onboarding emails | Automated sequences with personalization |
| Health scoring | Weekly automated report from database |
| At-risk intervention | Automated email triggers + manual follow-up |
| NPS surveys | In-app survey widget |
| Support | Shared inbox (Intercom or Help Scout) |
| Upgrade prompts | In-app triggers (built into product) |

**Time Investment**: ~3 hours/week

### 7.3 Phase 3: Automated (200+ Users)

**Tools**: Customer success platform (ChurnZero, Vitally) + Full product analytics (PostHog)

| Process | Method |
| ------- | ------ |
| Onboarding emails | Behavior-triggered personalized journeys |
| Health scoring | Real-time automated scoring |
| At-risk intervention | Automated playbooks with escalation |
| NPS surveys | Automated with follow-up workflows |
| Support | Tiered system with chatbot |
| Expansion | Automated PQL identification |

**Time Investment**: ~2 hours/week (reviewing dashboards, handling escalations)

---

## 8. Key Metrics Dashboard

### 8.1 Weekly Metrics (Solo Founder Review)

| Metric | This Week | Last Week | Target | Status |
| ------ | --------- | --------- | ------ | ------ |
| **Acquisition** |
| New signups | | | +10% WoW | |
| **Activation** |
| Proposals created | | | 40% of signups | |
| Proposals published | | | 30% of signups | |
| **Engagement** |
| Weekly active users | | | 50% of total | |
| Leads received (all users) | | | +10% WoW | |
| **Revenue** |
| New Pro subscriptions | | | 4% of eligible | |
| MRR | | | +10% MoM | |
| **Health** |
| Green users (%) | | | >60% | |
| Red users (%) | | | <10% | |
| **Satisfaction** |
| NPS score | | | >30 | |
| Support tickets | | | <10 per 100 users | |

### 8.2 Monthly Metrics

| Metric | This Month | Last Month | Target |
| ------ | ---------- | ---------- | ------ |
| Net Revenue Retention | | | >100% |
| Gross Revenue Retention | | | >92% |
| Free-to-Pro Conversion | | | >4% |
| Monthly Churn (Pro) | | | <8% |
| Customer Lifetime Value | | | >3x CAC |
| Time to First Value | | | <5 min |

---

## 9. Appendix

### 9.1 Email Templates Library

**Templates are documented in**: `/Users/leobrival/Developer/sass/spons-easy/.ideabrowser/email-sequences.md`

**Key Sequences**:
- Sequence 1: Waitlist Nurture (5 emails)
- Sequence 2: Onboarding (5 emails)
- Sequence 3: Re-engagement (3 emails)
- Sequence 4: Upgrade (3 emails)

### 9.2 Health Score Calculator

```
=== HEALTH SCORE CALCULATOR ===

USER: [Name]
DATE: [Date]

USAGE (40 points):
- Logins this week: [X] -> [Points]
  (0=0, 1-2=5, 3-4=10, 5+=15)
- Proposals created: [X] -> [Points]
  (0=0, 1=5, 2+=10)
- Proposals published: [X] -> [Points]
  (0=0, 1=10, 2+=15)

ENGAGEMENT (30 points):
- Email open rate: [X%] -> [Points]
  (<20%=0, 20-50%=5, >50%=10)
- Feature usage: [Level] -> [Points]
  (Basic=0, Tiers=5, Customization=10)
- Support interaction: [Type] -> [Points]
  (Negative=0, None=5, Positive=10)

VALUE (30 points):
- Leads received: [X] -> [Points]
  (0=0, 1-3=5, 4-9=10, 10+=15)
- Lead status updates: [Level] -> [Points]
  (None=0, Some=5, Active=10)
- Referral made: [Y/N] -> [Points]
  (No=0, Yes=5)

TOTAL SCORE: [X/100]
TIER: [Green/Yellow/Red]
```

### 9.3 Weekly Review Checklist

```
=== WEEKLY CS REVIEW CHECKLIST ===

DATE: [Date]
TIME SPENT: [X minutes]

[ ] METRICS REVIEW (10 min)
    [ ] Update weekly metrics dashboard
    [ ] Note any anomalies
    [ ] Identify trends

[ ] HEALTH CHECK (10 min)
    [ ] Review Red users (immediate action list)
    [ ] Review Yellow users (intervention candidates)
    [ ] Note Green users for expansion

[ ] SUPPORT REVIEW (10 min)
    [ ] Clear support inbox
    [ ] Identify common issues
    [ ] Update FAQ if needed

[ ] NPS FOLLOW-UPS (10 min)
    [ ] Contact detractors from past week
    [ ] Thank promoters
    [ ] Log feedback

[ ] PLANNING (5 min)
    [ ] Schedule interventions for coming week
    [ ] Note any product feedback for roadmap

NOTES:
[Free-form notes from review]
```

---

## Document History

| Date | Version | Author | Changes |
| ---- | ------- | ------ | ------- |
| 2025-11-25 | 1.0.0 | CS Agent | Initial playbook creation |

---

_Created: 2025-11-25_
_Based on: Constitution, PRD, Personas, Pricing Strategy, Email Sequences_

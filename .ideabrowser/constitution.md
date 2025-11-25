# Project Constitution - Spons Easy

## Vision

Automate and simplify sponsor acquisition for content creators, event organizers, and associations by eliminating friction from the traditional outreach process.

## Problem Statement

Finding sponsors is time-consuming, repetitive, and often ineffective. Creators and organizers spend hours:
- Identifying the right brands to contact
- Writing personalized proposals
- Following up on negotiations
- Managing contractual documentation

## Solution

Spons Easy automates the sponsorship process end-to-end:
1. **Proposal Generation** - Automatic creation of personalized sponsorship decks
2. **Smart Matching** - Relevant sponsor suggestions based on profile
3. **Automated Follow-up** - Pipeline and outreach management
4. **Optimized Templates** - Ready-to-use contract and proposal templates

## Target Users

### Primary Personas
1. **Content Creators** - YouTubers, streamers, podcasters, influencers
2. **Event Organizers** - Festivals, conferences, sports events
3. **Associations & Clubs** - Sports, cultural, and student associations

### User Pain Points
- Lack of time for outreach
- Difficulty monetizing their audience/community
- Unprofessional sponsorship proposals
- No visibility on conversion rates

## Core Principles

1. **Automation-first** - Automate everything possible without losing personalization
2. **Time-to-value** - Users must get their first proposal in under 5 minutes
3. **Data-driven** - Every feature must be measurable and optimizable
4. **Mobile-ready** - Responsive interface, usable on all devices
5. **KISS** - Keep It Simple, Stupid - No over-engineering

## Technical Constraints

### Stack
- **Backend**: AdonisJS 6 (TypeScript)
- **Frontend**: React 18+ with TypeScript
- **Database**: PostgreSQL (Neon serverless)
- **Deployment**: Railway or Vercel
- **Auth**: Session-based (AdonisJS Auth)

### Architecture Principles
- REST API with Vine validation
- Repository pattern for data layer
- Feature-based folder structure
- Biome for linting/formatting

## Timeline & Milestones

### Phase 1: MVP (30 days)
**Goal**: Enable users to generate a sponsorship proposal

- Week 1: Project setup + Auth + User profile
- Week 2: Proposal builder (form + generation)
- Week 3: PDF export + Basic dashboard
- Week 4: Landing page + Beta launch

### Success Metrics (MVP)
- 50 beta users signed up
- 100 proposals generated
- NPS > 30

## Quality Standards

1. **Code Quality**
   - TypeScript strict mode
   - Biome linting (0 errors)
   - Unit tests on critical business logic

2. **UX Standards**
   - Load time < 2s
   - Mobile-first responsive design
   - WCAG 2.1 AA accessibility

3. **Security**
   - OWASP Top 10 compliance
   - Rate limiting on APIs
   - Strict input validation

## Out of Scope (MVP)

- Marketplace for matchmaking
- Integrated payments
- Advanced analytics
- Multi-language support
- Native mobile app

---

*Created: 2025-11-25*
*Last Updated: 2025-11-25*
*Version: 1.0.0*

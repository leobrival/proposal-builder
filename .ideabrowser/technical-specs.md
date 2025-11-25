# Technical Specifications: Spons Easy MVP

**Feature**: 001-proposal-builder
**Date**: 2025-11-25
**Version**: 1.0.0
**Status**: Approved

---

## Document Overview

This technical specification complements the existing documentation:

| Document | Path | Content |
|----------|------|---------|
| Data Model | `/specs/001-proposal-builder/data-model.md` | Database schema, entities, relationships |
| API Routes | `/specs/001-proposal-builder/contracts/api-routes.md` | Endpoints, request/response schemas |
| Inertia Pages | `/specs/001-proposal-builder/contracts/inertia-pages.md` | Page components, props contracts |
| Quickstart | `/specs/001-proposal-builder/quickstart.md` | Local development setup |
| PRD | `/.ideabrowser/prd.md` | Business requirements, user stories |

This document focuses on **architectural decisions**, **infrastructure**, **security**, and **performance strategies** not covered elsewhere.

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture Diagram

```
                                    INTERNET
                                        |
                                        v
                    +-------------------+-------------------+
                    |                   |                   |
                    v                   v                   v
              [CDN/Edge]          [DNS/SSL]           [Monitoring]
              Cloudflare          Cloudflare          Sentry/Axiom
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
+-----------------------------------------------------------------------+
|                        RAILWAY PLATFORM                                |
|                                                                        |
|   +---------------------------+    +----------------------------+     |
|   |    AdonisJS 6 Server      |    |     Background Workers     |     |
|   |    (Node.js 20 LTS)       |    |     (Optional - Phase 2)   |     |
|   +---------------------------+    +----------------------------+     |
|   |                           |    |                            |     |
|   |  +---------------------+  |    |  - PDF Generation Queue    |     |
|   |  | Inertia Adapter     |  |    |  - Email Queue             |     |
|   |  +---------------------+  |    |  - Analytics Processing    |     |
|   |  | Controllers         |  |    +----------------------------+     |
|   |  | - Auth              |  |                                       |
|   |  | - Proposals         |  |                                       |
|   |  | - Tiers/Benefits    |  |                                       |
|   |  | - Leads             |  |                                       |
|   |  | - Uploads           |  |                                       |
|   |  +---------------------+  |                                       |
|   |  | Services            |  |                                       |
|   |  | - PdfService        |  |                                       |
|   |  | - EmailService      |  |                                       |
|   |  +---------------------+  |                                       |
|   |  | Lucid ORM           |  |                                       |
|   |  +---------------------+  |                                       |
|   +------------|--------------+                                       |
|                |                                                       |
+----------------|------------------------------------------------------+
                 |
                 | PostgreSQL Protocol (SSL)
                 v
+-----------------------------------------------------------------------+
|                        NEON SERVERLESS                                 |
|                                                                        |
|   +---------------------------+    +----------------------------+     |
|   |    main (Production)      |    |    dev/staging             |     |
|   |    PostgreSQL 15          |    |    PostgreSQL 15           |     |
|   +---------------------------+    +----------------------------+     |
|   |                           |    |                            |     |
|   |  - Connection Pooling     |    |  - Isolated branch         |     |
|   |  - Auto-scaling           |    |  - Copy-on-write           |     |
|   |  - Point-in-time recovery |    |  - Safe for experiments    |     |
|   +---------------------------+    +----------------------------+     |
|                                                                        |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
|                      EXTERNAL SERVICES                                 |
|                                                                        |
|   +----------------+  +----------------+  +---------------------+      |
|   |    Resend      |  |   Cloudflare   |  |    PostHog          |      |
|   |    Email API   |  |   R2 Storage   |  |    Analytics        |      |
|   +----------------+  +----------------+  +---------------------+      |
|   |                |  |                |  |                     |      |
|   | - Lead notif.  |  | - Image uploads|  | - Event tracking    |      |
|   | - PDF ready    |  | - PDF storage  |  | - Funnel analysis   |      |
|   | - Transactional|  | - Public CDN   |  | - Session replay    |      |
|   +----------------+  +----------------+  +---------------------+      |
|                                                                        |
+-----------------------------------------------------------------------+
```

### 1.2 Component Interaction Flow

```
USER BROWSER                    ADONISJS SERVER                    DATABASE
     |                                |                                |
     |  1. GET /proposals/create      |                                |
     |------------------------------->|                                |
     |                                |                                |
     |  2. Inertia Response           |                                |
     |  (HTML + React hydration)      |                                |
     |<-------------------------------|                                |
     |                                |                                |
     |  3. User types in form         |                                |
     |  (React state updates)         |                                |
     |  Preview updates instantly     |                                |
     |  (No server call)              |                                |
     |                                |                                |
     |  4. Auto-save triggers         |                                |
     |  (30s debounce)                |                                |
     |                                |                                |
     |  5. PATCH /proposals/:id/      |                                |
     |     autosave                   |                                |
     |------------------------------->|                                |
     |                                |  6. Validate + Update          |
     |                                |-------------------------------->|
     |                                |                                |
     |                                |  7. Confirm                    |
     |                                |<--------------------------------|
     |  8. { success: true,           |                                |
     |       savedAt: "..." }         |                                |
     |<-------------------------------|                                |
     |                                |                                |
     |  9. POST /proposals/:id/       |                                |
     |     publish                    |                                |
     |------------------------------->|                                |
     |                                |  10. Update status             |
     |                                |      Set published_at          |
     |                                |-------------------------------->|
     |                                |                                |
     |  11. Redirect to               |                                |
     |      /proposals/:id            |                                |
     |<-------------------------------|                                |
```

### 1.3 Data Flow: Lead Capture

```
SPONSOR BROWSER               ADONISJS SERVER                    SERVICES
     |                               |                               |
     |  1. GET /p/:slug              |                               |
     |------------------------------>|                               |
     |                               |  2. Find proposal by slug     |
     |                               |  3. Increment view_count      |
     |                               |                               |
     |  4. Public proposal page      |                               |
     |<------------------------------|                               |
     |                               |                               |
     |  5. Fill contact form         |                               |
     |                               |                               |
     |  6. POST /p/:slug/contact     |                               |
     |------------------------------>|                               |
     |                               |  7. Rate limit check          |
     |                               |  8. Validate input            |
     |                               |  9. Create Lead record        |
     |                               |                               |
     |                               |  10. Send notification        |
     |                               |------------------------------->|
     |                               |     RESEND API                |
     |                               |     (async, non-blocking)     |
     |                               |                               |
     |  11. Success response         |                               |
     |<------------------------------|                               |
```

---

## 2. Technology Stack Decisions

### 2.1 Why AdonisJS 6 Over Alternatives

**Decision**: AdonisJS 6 with TypeScript

**Evaluation Criteria**:

| Criteria | AdonisJS 6 | NestJS | Express.js | Fastify |
|----------|------------|--------|------------|---------|
| **Full-stack MVC** | Built-in | Partial | No | No |
| **TypeScript** | First-class | First-class | Manual | Manual |
| **ORM Integration** | Lucid (built-in) | TypeORM/Prisma | None | None |
| **Authentication** | Built-in (sessions) | Manual | Passport.js | Manual |
| **Inertia.js Adapter** | Official | Community | Community | None |
| **Learning Curve** | Medium | High | Low | Low |
| **Time to MVP** | Fast | Medium | Slow (many packages) | Slow |

**Rationale**:

1. **Official Inertia.js Adapter**: `@adonisjs/inertia` provides seamless React integration with server-side routing and typed props via `InferPageProps`. No other Node.js framework has this level of integration.

2. **Batteries Included**: AdonisJS includes authentication, validation (Vine), ORM (Lucid), mail, and security out of the box. This reduces decision fatigue and ensures consistent patterns.

3. **Lucid ORM**: Built specifically for AdonisJS, Lucid provides:
   - Active Record pattern (familiar to Laravel developers)
   - Type-safe queries with TypeScript
   - Relationships, scopes, and hooks
   - Migration system integrated with CLI

4. **Session-based Auth**: Unlike JWT-heavy alternatives, AdonisJS's session auth works perfectly with Inertia's server-side rendering model, eliminating token management complexity.

5. **Convention over Configuration**: AdonisJS follows Rails-inspired conventions, meaning less boilerplate and faster development for a 21-day MVP timeline.

**Alternatives Rejected**:

- **NestJS**: Over-engineered for an MVP. Its dependency injection and modular architecture add complexity without proportional benefit for a monolith.
- **Express.js**: Too minimal. Would require 15+ additional packages to match AdonisJS's built-in features.
- **Fastify**: While performant, lacks the integrated tooling needed for rapid MVP development.

---

### 2.2 Why Inertia.js Over Traditional SPA

**Decision**: Inertia.js with React adapter

**Comparison with Traditional SPA Approaches**:

| Aspect | Inertia.js | Traditional SPA (REST API) | GraphQL SPA |
|--------|------------|---------------------------|-------------|
| **API Development** | None required | Full REST API needed | Schema + resolvers |
| **Routing** | Server-side | Client-side (React Router) | Client-side |
| **Type Safety** | `InferPageProps` (auto) | Manual types | Codegen required |
| **SEO/SSR** | Built-in support | Complex setup | Complex setup |
| **Auth Handling** | Session cookies | JWT tokens | JWT tokens |
| **Caching** | Browser back/forward | Custom implementation | Apollo/urql cache |
| **Development Speed** | Very fast | Slow (2 codebases) | Medium |

**Rationale**:

1. **No API Layer**: Inertia eliminates the need for a separate REST or GraphQL API. Controllers return `inertia.render()` with props, and React components receive typed data directly.

   ```typescript
   // Controller
   async edit({ params, inertia }: HttpContext) {
     const proposal = await Proposal.findOrFail(params.id)
     return inertia.render('proposals/edit', { proposal })
   }

   // React component
   export default function Edit({ proposal }: InferPageProps<ProposalsController, 'edit'>) {
     // TypeScript knows proposal shape automatically
   }
   ```

2. **Server-Side Routing**: URLs are managed by AdonisJS, not React Router. This means:
   - Simpler mental model (one routing system)
   - Native browser back/forward caching
   - SEO-friendly by default
   - No client-side route guards needed

3. **Authentication Simplicity**: Session cookies work automatically with Inertia. No JWT refresh logic, no token storage decisions, no CORS issues.

4. **Shared Data Pattern**: User auth state, flash messages, and errors are shared across all pages via `config/inertia.ts`, eliminating prop drilling.

5. **Progressive Enhancement**: Inertia supports SSR when needed, but works great without it for MVP speed.

**Trade-offs Accepted**:

- **Less decoupled**: Frontend and backend are tightly integrated. This is acceptable for a single-team MVP but may require refactoring for mobile apps later.
- **No offline support**: Unlike PWAs with service workers, Inertia apps require server connectivity. Acceptable for Spons Easy's use case.

---

### 2.3 Why Neon Over Other PostgreSQL Providers

**Decision**: Neon Serverless PostgreSQL

**Comparison**:

| Feature | Neon | Supabase | PlanetScale | Railway Postgres | AWS RDS |
|---------|------|----------|-------------|------------------|---------|
| **Serverless** | Yes | Yes | Yes | No | Partial |
| **Branching** | Native | No | Yes | No | No |
| **Scale-to-zero** | Yes | Yes | Yes | No | No |
| **Free Tier** | 0.5GB storage | 500MB | 1GB | 500MB | None |
| **Cold Start** | ~300ms | ~500ms | ~100ms | N/A | N/A |
| **PostgreSQL** | Yes | Yes | MySQL | Yes | Yes |
| **Connection Pooling** | Built-in | Built-in | N/A | Manual | Manual |

**Rationale**:

1. **Native Database Branching**: Neon's copy-on-write branching creates isolated database environments instantly (~1 second). This enables:

   ```bash
   # Create development branch
   neonctl branches create --name dev/staging

   # Each developer can have their own branch
   neonctl branches create --name dev/feature-123
   ```

   Benefits:
   - Safe schema experiments without affecting production
   - Instant branch creation (vs. hours for traditional DB clones)
   - Cost-effective (branches share unchanged data)

2. **Scale-to-Zero**: Neon automatically suspends compute when inactive, reducing costs to near-zero for low-traffic periods. Essential for MVP budget constraints.

3. **Connection Pooling**: Built-in PgBouncer-compatible pooling handles serverless connection patterns without additional infrastructure.

4. **PostgreSQL Compatibility**: Standard PostgreSQL 15 with all features (JSONB, full-text search, triggers). No ORM changes needed if migrating away.

5. **Integrated with Development Workflow**: Branch URLs can be environment-specific:

   ```bash
   # .env.development
   DATABASE_URL="postgresql://...@ep-dev-xxx.neon.tech/neondb?sslmode=require"

   # .env.production
   DATABASE_URL="postgresql://...@ep-prod-xxx.neon.tech/neondb?sslmode=require"
   ```

**Alternatives Rejected**:

- **Supabase**: Excellent product, but no native branching. Would require manual database cloning for dev/prod isolation.
- **PlanetScale**: MySQL-based, not PostgreSQL. Lucid ORM supports MySQL, but JSONB (used for `design_settings`) is PostgreSQL-specific.
- **Railway Postgres**: No serverless/scale-to-zero. Fixed compute cost even when idle.

---

## 3. Infrastructure Planning

### 3.1 Deployment Architecture

**Platform**: Railway (recommended)

```
RAILWAY PROJECT: spons-easy
|
+-- Service: web (AdonisJS)
|   |-- Dockerfile: node:20-slim
|   |-- Build: pnpm install && pnpm build
|   |-- Start: node build/bin/server.js
|   |-- Env: NODE_ENV=production
|   |-- Health Check: GET /health
|   |-- Auto-scaling: 1-3 instances
|   |-- Memory: 512MB - 2GB
|
+-- Service: worker (Phase 2 - optional)
|   |-- Dockerfile: node:20-slim
|   |-- Start: node build/bin/worker.js
|   |-- Env: WORKER_MODE=true
|   |-- Memory: 1GB (PDF generation)
|
+-- Volume: uploads (if not using R2)
    |-- Mount: /app/public/uploads
    |-- Size: 10GB
```

**Alternative: Vercel**

```
VERCEL PROJECT: spons-easy
|
+-- Framework: AdonisJS (Custom)
|   |-- Build: pnpm build
|   |-- Output: build/
|   |-- Functions: Serverless
|   |-- Regions: iad1 (US East)
|
+-- Note: SSR requires edge runtime
|-- Note: Long-running tasks (PDF) need
|         external queue (Trigger.dev)
```

**Recommendation**: Railway for MVP

Railway provides better support for:
- Long-running processes (PDF generation up to 30s)
- Persistent volumes for local file storage
- WebSocket support (future real-time features)
- Simpler deployment model (no serverless cold starts)

---

### 3.2 Environment Configuration

**Environment Variables Matrix**:

| Variable | Development | Staging | Production | Secret |
|----------|-------------|---------|------------|--------|
| `NODE_ENV` | development | staging | production | No |
| `PORT` | 3333 | 3333 | 3333 | No |
| `HOST` | 0.0.0.0 | 0.0.0.0 | 0.0.0.0 | No |
| `APP_KEY` | Generated | Generated | Generated | **Yes** |
| `APP_URL` | http://localhost:3333 | https://staging.sponseasy.com | https://sponseasy.com | No |
| `DATABASE_URL` | Neon dev branch | Neon staging branch | Neon main branch | **Yes** |
| `SESSION_DRIVER` | cookie | cookie | cookie | No |
| `RESEND_API_KEY` | Test key | Test key | Production key | **Yes** |
| `SENTRY_DSN` | - | DSN | DSN | **Yes** |
| `LOG_LEVEL` | debug | info | info | No |
| `DRIVE_DISK` | local | r2 | r2 | No |
| `R2_ACCESS_KEY_ID` | - | Key | Key | **Yes** |
| `R2_SECRET_ACCESS_KEY` | - | Key | Key | **Yes** |
| `R2_BUCKET` | - | sponseasy-staging | sponseasy-prod | No |
| `R2_ENDPOINT` | - | Cloudflare URL | Cloudflare URL | No |

**Secret Management**:

- **Development**: `.env` file (gitignored)
- **Railway/Vercel**: Platform-native secret storage
- **Future (Scale)**: HashiCorp Vault or AWS Secrets Manager

---

### 3.3 CI/CD Pipeline Recommendations

**GitHub Actions Workflow**:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run lint
      - run: pnpm run typecheck
      - run: pnpm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  deploy-staging:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway (Staging)
        uses: railwayapp/railway-action@v1
        with:
          service: web
          environment: staging
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway (Production)
        uses: railwayapp/railway-action@v1
        with:
          service: web
          environment: production
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Pipeline Stages**:

```
PR Created
    |
    v
[Lint + TypeCheck + Tests] --> Fail --> Block merge
    |
    v Pass
[Preview Deploy (optional)]
    |
    v
PR Merged to main
    |
    v
[Deploy Staging] --> Run migrations
    |
    v
[Manual Approval]
    |
    v
[Deploy Production] --> Run migrations
```

**Database Migration Strategy**:

```bash
# Pre-deployment hook (Railway/Vercel)
node ace migration:run --force

# Rollback on failure
node ace migration:rollback
```

---

## 4. Security Architecture

### 4.1 Authentication Flow

```
                    REGISTRATION FLOW
                    =================

+--------+    1. POST /register     +----------+
|        |------------------------->|          |
| Browser|    {email, password,     | AdonisJS |
|        |     fullName}            |          |
+--------+                          +----+-----+
    ^                                    |
    |                                    v
    |                            2. Validate input
    |                               (Vine validator)
    |                                    |
    |                                    v
    |                            3. Hash password
    |                               (scrypt algorithm)
    |                                    |
    |                                    v
    |                            4. Create User record
    |                                    |
    |                                    v
    |                            5. Create session
    |                               (cookie-based)
    |                                    |
    |    6. Set-Cookie: session=xxx     |
    |<-----------------------------------+
    |    7. Redirect to /dashboard      |


                    LOGIN FLOW
                    ==========

+--------+    1. POST /login        +----------+
|        |------------------------->|          |
| Browser|    {email, password,     | AdonisJS |
|        |     remember}            |          |
+--------+                          +----+-----+
    ^                                    |
    |                                    v
    |                            2. Find user by email
    |                                    |
    |                                    v
    |                            3. Verify password
    |                               (scrypt compare)
    |                                    |
    |                          +--------+--------+
    |                          |                 |
    |                       Valid             Invalid
    |                          |                 |
    |                          v                 v
    |                   4. Create session   4. Return error
    |                      (+ remember_me)     (flash message)
    |                          |                 |
    |    5. Set-Cookie         |                 |
    |<-------------------------+    5. Re-render form
    |    6. Redirect                   |
    |                                  v
    +----------------------------------+


                    SESSION VALIDATION
                    ==================

+--------+    1. GET /dashboard     +----------+
|        |------------------------->|          |
| Browser|    Cookie: session=xxx   | AdonisJS |
|        |                          |          |
+--------+                          +----+-----+
    ^                                    |
    |                                    v
    |                            2. auth_middleware
    |                               - Decrypt cookie
    |                               - Validate session
    |                               - Load user
    |                                    |
    |                          +--------+--------+
    |                          |                 |
    |                       Valid             Invalid
    |                          |                 |
    |                          v                 v
    |                   3. Attach user      3. Redirect
    |                      to context          /login
    |                          |
    |                          v
    |                   4. Controller
    |                      executes
    |                          |
    |    5. Inertia response   |
    |<-------------------------+
```

### 4.2 Authorization Patterns

**Resource Ownership Model**:

All resources are scoped to the authenticated user. Authorization is enforced at the query level.

```typescript
// app/controllers/proposals_controller.ts
export default class ProposalsController {
  /**
   * Always filter by authenticated user
   * This prevents IDOR (Insecure Direct Object Reference) vulnerabilities
   */
  async index({ auth, inertia }: HttpContext) {
    const proposals = await auth.user!
      .related('proposals')
      .query()
      .orderBy('createdAt', 'desc')

    return inertia.render('proposals/index', { proposals })
  }

  /**
   * Use findByOrFail with user scope
   */
  async show({ params, auth, inertia }: HttpContext) {
    const proposal = await auth.user!
      .related('proposals')
      .query()
      .where('id', params.id)
      .firstOrFail()

    return inertia.render('proposals/show', { proposal })
  }

  /**
   * Cascading authorization for nested resources
   */
  async updateTier({ params, auth, request }: HttpContext) {
    // First verify proposal belongs to user
    const proposal = await auth.user!
      .related('proposals')
      .query()
      .where('id', params.proposalId)
      .firstOrFail()

    // Then verify tier belongs to proposal
    const tier = await proposal
      .related('tiers')
      .query()
      .where('id', params.tierId)
      .firstOrFail()

    // Now safe to update
    await tier.merge(request.body()).save()
  }
}
```

**Authorization Checklist**:

| Resource | Rule | Implementation |
|----------|------|----------------|
| Proposal | Owner only | `auth.user.related('proposals')` |
| Tier | Owner of parent proposal | Check proposal ownership first |
| Benefit | Owner of parent tier's proposal | Check tier -> proposal -> user |
| Lead | Owner of parent proposal | Check proposal ownership first |
| Upload | Owner only | Track `user_id` on uploads |

### 4.3 Data Protection Measures

**1. Input Validation (Server-Side)**

All inputs validated using Vine validators before processing:

```typescript
// app/validators/proposal_validator.ts
import vine from '@vinejs/vine'

export const createProposalValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    projectName: vine.string().trim().minLength(2).maxLength(255),
    contactEmail: vine.string().email().normalizeEmail(),
    description: vine.string().trim().maxLength(5000).optional(),
    contactPhone: vine.string().trim().maxLength(50).optional(),
  })
)
```

**2. CSRF Protection**

Enabled via `@adonisjs/shield`:

```typescript
// config/shield.ts
export default defineConfig({
  csrf: {
    enabled: true,
    exceptRoutes: [], // No exceptions
    enableXsrfCookie: true, // Required for Inertia
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },
})
```

**3. SQL Injection Prevention**

Lucid ORM uses parameterized queries by default:

```typescript
// Safe - parameterized query
await User.query().where('email', userInput)

// Also safe - Lucid handles escaping
await Proposal.query().whereILike('title', `%${search}%`)

// Never do this (raw SQL without binding)
// await db.rawQuery(`SELECT * FROM users WHERE email = '${userInput}'`)
```

**4. XSS Prevention**

- React auto-escapes by default
- `dangerouslySetInnerHTML` is never used
- CSP headers configured in production

```typescript
// config/shield.ts (production)
contentSecurityPolicy: {
  enabled: true,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"], // Required for Inertia
    styleSrc: ["'self'", "'unsafe-inline'"],  // Required for Tailwind
    imgSrc: ["'self'", 'data:', 'https://*.r2.dev'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
  },
}
```

**5. File Upload Security**

```typescript
// app/controllers/uploads_controller.ts
export default class UploadsController {
  async image({ request, auth }: HttpContext) {
    const file = request.file('file', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    })

    if (!file || file.hasErrors) {
      return response.badRequest({ errors: file?.errors })
    }

    // Generate safe filename (UUID + original extension)
    const filename = `${randomUUID()}.${file.extname}`

    // Move to storage (local or R2)
    await file.moveToDisk(filename)

    return { url: `/uploads/${filename}`, id: filename }
  }
}
```

**6. Rate Limiting**

Configured per endpoint category (see `api-routes.md` for full details):

```typescript
// start/limiter.ts
import limiter from '@adonisjs/limiter/services/main'

export const authLimiter = limiter.define('auth', () => {
  return limiter.allowRequests(5).every('15 minutes')
})

export const contactLimiter = limiter.define('contact', () => {
  return limiter.allowRequests(3).every('5 minutes')
})
```

**7. Sensitive Data Handling**

```typescript
// app/models/user.ts
export default class User extends BaseModel {
  // Never serialize password to frontend
  @column({ serializeAs: null })
  declare password: string

  // Never serialize remember token
  @column({ serializeAs: null })
  declare rememberMeToken: string | null
}
```

---

## 5. Performance Strategy

### 5.1 Caching Strategy

**Layer 1: Browser Caching (Static Assets)**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Content-hash for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})
```

Nginx/Cloudflare headers:
```
# Static assets (CSS, JS, images)
Cache-Control: public, max-age=31536000, immutable

# HTML pages
Cache-Control: no-cache
```

**Layer 2: Inertia Partial Reloads**

Avoid refetching unchanged data:

```typescript
// Only reload specific props
router.reload({ only: ['leads'] })

// Preserve scroll position
router.visit(url, { preserveScroll: true })
```

**Layer 3: Database Query Optimization**

```typescript
// Eager load relationships
const proposal = await Proposal.query()
  .where('id', id)
  .preload('tiers', (tierQuery) => {
    tierQuery.preload('benefits').orderBy('position', 'asc')
  })
  .firstOrFail()

// Select only needed columns
const proposals = await Proposal.query()
  .select(['id', 'title', 'status', 'viewCount', 'createdAt'])
  .where('userId', auth.user!.id)
```

**Layer 4: In-Memory Caching (Future)**

For frequently accessed data:

```typescript
// Using AdonisJS cache (Phase 2)
import cache from '@adonisjs/cache/services/main'

const fontOptions = await cache.getOrSet('fontOptions', async () => {
  return [
    { value: 'Inter', label: 'Inter' },
    // ...
  ]
}, '1 day')
```

### 5.2 Image Optimization

**Client-Side Compression Before Upload**:

```typescript
// inertia/hooks/use-image-upload.ts
import imageCompression from 'browser-image-compression'

export function useImageUpload() {
  const compressAndUpload = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    const compressedFile = await imageCompression(file, options)

    const formData = new FormData()
    formData.append('file', compressedFile)
    formData.append('type', 'cover')

    return fetch('/uploads/image', {
      method: 'POST',
      body: formData,
    })
  }

  return { compressAndUpload }
}
```

**Server-Side Processing** (using Sharp):

```typescript
// app/services/image_service.ts
import sharp from 'sharp'

export class ImageService {
  async processUpload(buffer: Buffer, type: 'logo' | 'cover') {
    const config = {
      logo: { width: 400, height: 400, fit: 'inside' },
      cover: { width: 1920, height: 1080, fit: 'cover' },
    }

    return sharp(buffer)
      .resize(config[type])
      .webp({ quality: 80 })
      .toBuffer()
  }
}
```

**Responsive Images** (Frontend):

```tsx
// inertia/components/proposals/cover-image.tsx
export function CoverImage({ url, alt }: { url: string; alt: string }) {
  return (
    <picture>
      <source
        srcSet={`${url}?w=640 640w, ${url}?w=1280 1280w, ${url}?w=1920 1920w`}
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1920px"
        type="image/webp"
      />
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="object-cover w-full h-64"
      />
    </picture>
  )
}
```

### 5.3 Database Query Optimization

**Index Strategy** (defined in `data-model.md`):

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| users | `users_email_unique` | email | Login lookup |
| proposals | `proposals_user_id_index` | user_id | Dashboard list |
| proposals | `proposals_slug_unique` | slug | Public URL lookup |
| proposals | `proposals_status_index` | status | Status filtering |
| tiers | `tiers_proposal_id_index` | proposal_id | Tier loading |
| tiers | `tiers_position_index` | proposal_id, position | Ordered tier list |
| benefits | `benefits_tier_id_index` | tier_id | Benefit loading |
| leads | `leads_proposal_id_index` | proposal_id | Lead list |
| leads | `leads_status_index` | status | Status filtering |
| leads | `leads_email_proposal_index` | email, proposal_id | Duplicate detection |

**Query Patterns**:

```typescript
// Dashboard: Single query with aggregates
const dashboardData = await db.rawQuery(`
  SELECT
    COUNT(p.id) as total_proposals,
    COUNT(CASE WHEN p.status = 'published' THEN 1 END) as published_proposals,
    COALESCE(SUM(p.view_count), 0) as total_views,
    COUNT(l.id) as total_leads,
    COUNT(CASE WHEN l.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_leads_week
  FROM proposals p
  LEFT JOIN leads l ON l.proposal_id = p.id
  WHERE p.user_id = ?
`, [userId])

// Avoid N+1 with preloading
const proposals = await Proposal.query()
  .where('userId', userId)
  .withCount('leads')
  .withCount('tiers')
  .orderBy('createdAt', 'desc')
  .limit(20)
```

**Connection Pooling** (Neon):

```typescript
// config/database.ts
const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: env.get('DATABASE_URL'),
      pool: {
        min: 2,
        max: 10,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
      },
    },
  },
})
```

---

## 6. Developer Handoff Documentation

### 6.1 Local Development Setup

**Prerequisites**:

```bash
# Required versions
node -v  # v20.x (LTS)
pnpm -v  # v8.x
git -v   # v2.x

# Optional but recommended
neonctl --version  # Neon CLI
```

**Step-by-Step Setup**:

```bash
# 1. Clone repository
git clone https://github.com/your-org/spons-easy.git
cd spons-easy

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env

# 4. Generate app key
node ace generate:key

# 5. Configure database
# Option A: Use shared Neon dev branch
# Edit .env and set DATABASE_URL to dev branch connection string

# Option B: Create personal Neon branch
neonctl branches create --name dev/your-name
neonctl connection-string dev/your-name --pooled
# Copy connection string to .env

# 6. Run migrations
node ace migration:run

# 7. (Optional) Seed database
node ace db:seed

# 8. Start development server
pnpm dev

# 9. Open browser
open http://localhost:3333
```

### 6.2 Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TZ` | No | UTC | Timezone for DateTime operations |
| `PORT` | No | 3333 | HTTP server port |
| `HOST` | No | 0.0.0.0 | HTTP server host |
| `NODE_ENV` | No | development | Environment mode |
| `APP_KEY` | **Yes** | - | Session encryption key (32+ chars) |
| `APP_URL` | No | http://localhost:3333 | Application URL for email links |
| `LOG_LEVEL` | No | info | Log verbosity (trace/debug/info/warn/error) |
| `DATABASE_URL` | **Yes** | - | PostgreSQL connection string |
| `SESSION_DRIVER` | No | cookie | Session storage (cookie/redis) |
| `RESEND_API_KEY` | For email | - | Resend API key for notifications |
| `SENTRY_DSN` | For errors | - | Sentry project DSN |
| `DRIVE_DISK` | No | local | File storage driver (local/r2) |
| `R2_ACCESS_KEY_ID` | For R2 | - | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | For R2 | - | Cloudflare R2 secret key |
| `R2_BUCKET` | For R2 | - | Cloudflare R2 bucket name |
| `R2_ENDPOINT` | For R2 | - | Cloudflare R2 endpoint URL |

### 6.3 Code Conventions

**File Naming**:

| Type | Convention | Example |
|------|------------|---------|
| Controller | `snake_case` | `proposals_controller.ts` |
| Model | `snake_case` (singular) | `proposal.ts` |
| Migration | `number_verb_noun` | `002_create_proposals_table.ts` |
| Validator | `snake_case` | `proposal_validator.ts` |
| React Component | `kebab-case` | `proposal-preview.tsx` |
| React Page | `kebab-case` | `edit.tsx` |
| Hook | `use-` prefix | `use-autosave.ts` |
| Type | `PascalCase` | `Proposal`, `SharedProps` |

**Import Order**:

```typescript
// 1. Node.js built-ins
import { randomUUID } from 'node:crypto'

// 2. External packages
import { DateTime } from 'luxon'
import { z } from 'zod'

// 3. AdonisJS core
import type { HttpContext } from '@adonisjs/core/http'
import { BaseModel, column } from '@adonisjs/lucid/orm'

// 4. Internal modules (absolute paths)
import User from '#models/user'
import { createProposalValidator } from '#validators/proposal_validator'

// 5. Relative imports
import type { Proposal } from './types'
```

**Controller Pattern**:

```typescript
export default class ProposalsController {
  /**
   * Display list
   * GET /proposals
   */
  async index({ auth, inertia }: HttpContext) {
    const proposals = await auth.user!.related('proposals').query()
    return inertia.render('proposals/index', { proposals })
  }

  /**
   * Display form
   * GET /proposals/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('proposals/create')
  }

  /**
   * Handle form submission
   * POST /proposals
   */
  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createProposalValidator)
    const proposal = await auth.user!.related('proposals').create(data)
    return response.redirect().toRoute('proposals.edit', { id: proposal.id })
  }
}
```

**React Component Pattern**:

```tsx
// Props interface matches Inertia page contract
interface ProposalFormProps {
  proposal?: Proposal
  onSubmit: (data: ProposalFormData) => void
  isSubmitting: boolean
}

export function ProposalForm({ proposal, onSubmit, isSubmitting }: ProposalFormProps) {
  // 1. Hooks first
  const form = useForm({
    defaultValues: proposal ?? defaultProposalValues,
  })

  // 2. Derived state
  const isDirty = form.formState.isDirty

  // 3. Event handlers
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  // 4. Render
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

### 6.4 Common Commands

```bash
# Development
pnpm dev              # Start dev server with HMR
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run Biome linter
pnpm lint:fix         # Auto-fix lint issues
pnpm typecheck        # TypeScript check

# Database
node ace migration:run        # Run pending migrations
node ace migration:rollback   # Rollback last batch
node ace migration:fresh      # Drop all and re-run
node ace migration:status     # Show migration status
node ace db:seed              # Run database seeders

# Code Generation
node ace make:controller Name # Create controller
node ace make:model Name      # Create model
node ace make:migration name  # Create migration
node ace make:validator Name  # Create validator
node ace make:service Name    # Create service

# Utilities
node ace generate:key         # Generate APP_KEY
node ace list                 # List all commands
```

### 6.5 Troubleshooting Guide

**Issue: "Database connection refused"**

```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host/db?sslmode=require

# Test connection
node ace db:wipe --dry-run

# For Neon: Ensure SSL mode is require
# For local: Ensure PostgreSQL is running
```

**Issue: "Inertia page not found"**

```bash
# Ensure page file exists
ls inertia/pages/proposals/edit.tsx

# Check route points to correct page
node ace list:routes | grep proposals

# Clear Vite cache
rm -rf node_modules/.vite
pnpm dev
```

**Issue: "CSRF token mismatch"**

```typescript
// Ensure XSRF cookie is enabled
// config/shield.ts
csrf: {
  enableXsrfCookie: true,
}

// Check cookie is sent with requests (browser DevTools)
// Should see XSRF-TOKEN cookie
```

**Issue: "Type errors in Inertia pages"**

```bash
# Ensure tsconfig paths are correct
# inertia/tsconfig.json should have:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# Restart TypeScript server in IDE
# VSCode: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

---

## 7. Appendix

### 7.1 Architecture Decision Records (ADR)

#### ADR-001: Monolith vs Microservices

**Status**: Accepted

**Context**: MVP with 21-day timeline, single development team, targeting 50-100 initial users.

**Decision**: Monolithic architecture with AdonisJS.

**Rationale**:
- Team size (<5 developers) does not warrant microservices complexity
- Time-to-market priority over scalability
- Single deployment unit simplifies operations
- Can extract services later if needed (modular code structure)

**Consequences**:
- Faster development velocity
- Simpler deployment and monitoring
- All features scale together (potential bottleneck at high scale)
- Future: May need to extract PDF generation to separate service

---

#### ADR-002: Session vs JWT Authentication

**Status**: Accepted

**Context**: User authentication for SPA-like experience with Inertia.js.

**Decision**: Session-based authentication with httpOnly cookies.

**Rationale**:
- Inertia.js is server-rendered, sessions work naturally
- No client-side token storage (XSS-safe)
- Real-time session invalidation on logout
- Built-in to AdonisJS with no additional setup

**Consequences**:
- Requires stateful server (or Redis for horizontal scaling)
- Cookie-based (CORS considerations for future mobile apps)
- Simpler implementation for MVP

---

#### ADR-003: File Storage Strategy

**Status**: Accepted

**Context**: User uploads for logos and cover images, need to support MVP and scale.

**Decision**: Start with local storage, architecture ready for Cloudflare R2.

**Rationale**:
- Local storage simplest for MVP ($0 cost)
- AdonisJS Drive provides abstraction layer
- R2 pricing competitive ($0.015/GB storage)
- Migration path: Change `DRIVE_DISK` env var

**Consequences**:
- MVP: Files stored on Railway volume
- Scale: Migrate to R2 with minimal code changes
- CDN integration straightforward with R2

---

### 7.2 Related Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| PRD | `/.ideabrowser/prd.md` | Business requirements |
| Constitution | `/.ideabrowser/constitution.md` | Project principles |
| Data Model | `/specs/001-proposal-builder/data-model.md` | Database schema |
| API Routes | `/specs/001-proposal-builder/contracts/api-routes.md` | Endpoint contracts |
| Inertia Pages | `/specs/001-proposal-builder/contracts/inertia-pages.md` | Page component contracts |
| Research | `/specs/001-proposal-builder/research.md` | Technology decisions |
| Plan | `/specs/001-proposal-builder/plan.md` | Implementation plan |
| Quickstart | `/specs/001-proposal-builder/quickstart.md` | Setup guide |
| Tasks | `/specs/001-proposal-builder/tasks.md` | Implementation tasks |

---

## Changelog

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2025-11-25 | 1.0.0 | Tech Specs Agent | Initial technical specifications |

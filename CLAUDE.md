# Spons Easy - Development Guidelines

## Project Overview

Spons Easy is a SaaS platform for creating and managing sponsorship proposals. Built with AdonisJS 6 (backend), Inertia.js, and React 18 (frontend).

## Technology Stack

### Backend

- **Framework**: AdonisJS 6 (Node.js 20 LTS)
- **ORM**: Lucid ORM
- **Database**: PostgreSQL (Neon Serverless)
- **Cache**: Redis with `@adonisjs/cache`
- **Authentication**: Session-based with `@adonisjs/auth`
- **Real-time**: `@adonisjs/transmit` (SSE)
- **Validation**: VineJS

### Frontend

- **Framework**: React 18 with Inertia.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Build Tool**: Vite

## Project Structure

```text
app/
├── contracts/             # Service interfaces for DI
├── controllers/           # HTTP Controllers
│   ├── admin/            # Admin-specific controllers
│   ├── auth/             # Authentication controllers
│   ├── proposals/        # Proposal management
│   └── api/              # API endpoints
├── decorators/           # Logging and caching decorators
├── dtos/                 # Data Transfer Objects
│   ├── auth/
│   ├── proposal/
│   └── user/
├── events/               # Domain events
├── exceptions/           # Custom exceptions
├── factories/            # Object creation factories
├── listeners/            # Event listeners
├── middleware/           # HTTP middleware
├── models/               # Lucid models
├── policies/             # Authorization policies
├── query_builders/       # Custom query builders
├── repositories/         # Data access layer
├── services/             # Business logic
├── specifications/       # Business rules specifications
├── strategies/           # Export strategies
└── validators/           # Request validators
    ├── auth/
    ├── proposal/
    └── user/

providers/                # Service providers for IoC

config/                   # Application configuration
database/
├── migrations/           # Database migrations
└── seeders/             # Database seeders

inertia/                  # Frontend (React + Inertia)
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── builder/         # Proposal builder
│   ├── layouts/         # Layout components
│   ├── proposals/       # Proposal components
│   └── ui/              # shadcn/ui components
├── hooks/               # React hooks
├── pages/               # Inertia pages
└── types/               # TypeScript types

start/
├── env.ts               # Environment validation
├── events.ts            # Event registrations
├── kernel.ts            # Middleware registration
└── routes.ts            # Route definitions

tests/
├── bootstrap.ts         # Test configuration
└── functional/          # Functional tests
    └── routes/          # Route tests
```

## Architecture Patterns

### Layered Architecture

```text
Controller -> Service -> Repository -> Model
     ↓           ↓           ↓
  Validator    DTO      QueryBuilder
     ↓           ↓
  Policy     Exception
```

### Key Principles

1. **Controllers**: Handle HTTP requests, delegate to services
2. **Services**: Business logic, orchestrate operations
3. **Repositories**: Data access abstraction
4. **DTOs**: Data transfer between layers
5. **Policies**: Authorization logic
6. **Validators**: Input validation
7. **Exceptions**: Domain-specific errors

## Commands

### Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Run specific test suite
node ace test functional
node ace test unit

# Run single test file
node ace test functional --files="tests/functional/routes/admin.spec.ts"

# Database operations
node ace migration:run
node ace migration:rollback
node ace db:seed

# Generate resources
node ace make:controller ControllerName
node ace make:model ModelName
node ace make:migration migration_name
node ace make:validator ValidatorName
node ace make:service ServiceName
node ace make:exception ExceptionName
node ace make:policy PolicyName

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix
```

### Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## Testing Guidelines (TDD)

### Test Framework

- **Runner**: Japa (AdonisJS test runner)
- **Assertions**: `@japa/assert`
- **HTTP Client**: `@japa/api-client`
- **Plugins**: `@adonisjs/session/plugins/api_client`, `@adonisjs/auth/plugins/api_client`

### Test Configuration (`tests/bootstrap.ts`)

```typescript
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import { shieldApiClient } from '@adonisjs/shield/plugins/api_client'
import { apiClient } from '@japa/api-client'
import { assert } from '@japa/assert'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import type { Config } from '@japa/runner/types'

export const plugins: Config['plugins'] = [
  assert(),
  apiClient(),
  sessionApiClient(app),
  shieldApiClient(),
  authApiClient(app),
  pluginAdonisJS(app),
]
```

### Test Structure

```text
tests/
├── bootstrap.ts              # Test configuration
├── unit/                     # Unit tests
│   ├── services/            # Service tests
│   ├── validators/          # Validator tests
│   └── models/              # Model tests
└── functional/               # Functional/Integration tests
    ├── routes/              # Route tests
    │   ├── public.spec.ts   # Public route tests
    │   ├── auth_guard.spec.ts # Auth middleware tests
    │   ├── user.spec.ts     # User route tests
    │   └── admin.spec.ts    # Admin route tests
    └── api/                 # API endpoint tests
```

### Writing Tests

#### Basic Test Structure

```typescript
import { test } from '@japa/runner'
import User from '#models/user'

test.group('Group Name', (group) => {
  // Setup - runs before all tests in group
  group.setup(async () => {
    // Create test data
  })

  // Teardown - runs after all tests in group
  group.teardown(async () => {
    // Clean up test data
  })

  // Each - runs before/after each test
  group.each.setup(async () => {})
  group.each.teardown(async () => {})

  test('test description', async ({ client, assert }) => {
    // Test implementation
  })
})
```

#### Testing GET Routes

```typescript
test('route returns 200', async ({ client }) => {
  const response = await client.get('/route')
  response.assertStatus(200)
})
```

#### Testing Authenticated Routes

```typescript
test('authenticated route works', async ({ client }) => {
  const user = await User.create({
    /* ... */
  })

  const response = await client.get('/protected-route').loginAs(user)

  response.assertStatus(200)
})
```

#### Testing POST/PUT/DELETE Routes

```typescript
test('can create resource', async ({ client }) => {
  const user = await User.create({
    /* ... */
  })

  const response = await client.post('/resource').loginAs(user).form({ field: 'value' })

  response.assertStatus(302) // Redirect after creation
})

// For JSON APIs
test('can update via API', async ({ client }) => {
  const response = await client.put('/api/resource/1').loginAs(adminUser).json({ field: 'value' })

  response.assertStatus(200)
  response.assertBodyContains({ success: true })
})
```

#### Testing Redirects

```typescript
test('unauthenticated user is redirected', async ({ client }) => {
  const response = await client.get('/protected')
  response.assertRedirectsTo('/login')
})
```

#### Testing with Assertions

```typescript
test('data is modified correctly', async ({ client, assert }) => {
  const user = await User.create({ plan: 'free' })

  await client.put(`/users/${user.id}/plan`).loginAs(adminUser).json({ plan: 'paid' })

  await user.refresh()
  assert.equal(user.plan, 'paid')
})
```

### CSRF Handling in Tests

CSRF is disabled in test environment via `config/shield.ts`:

```typescript
csrf: {
  enabled: !app.inTest,
  // ...
}
```

### Test Data Management

#### Creating Test Users

```typescript
const testUser = await User.create({
  firstName: 'Test',
  lastName: 'User',
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
  role: 'user',
  plan: 'free',
  isActive: true,
})
```

#### Creating Test Proposals

```typescript
const testProposal = await Proposal.create({
  userId: testUser.id,
  title: 'Test Proposal',
  projectName: 'Test Project',
  contactEmail: testUser.email,
  status: 'draft',
})
```

#### Cleanup Pattern

```typescript
group.teardown(async () => {
  // Delete in reverse order of dependencies
  if (testProposal) await testProposal.delete()
  if (testUser) await testUser.delete()
})
```

### TDD Workflow

1. **Write failing test first**

   ```typescript
   test('user can publish proposal', async ({ client }) => {
     const response = await client.post(`/proposals/${proposal.id}/publish`).loginAs(user)
     response.assertStatus(302)
   })
   ```

2. **Implement minimal code to pass**
3. **Refactor while keeping tests green**
4. **Repeat**

### Test Categories

#### 1. Public Routes (`public.spec.ts`)

- Landing page accessibility
- Login/Register page availability
- Public proposal viewing
- Waitlist submission

#### 2. Auth Guard Tests (`auth_guard.spec.ts`)

- Protected routes redirect to login
- Admin routes require authentication

#### 3. User Routes (`user.spec.ts`)

- Dashboard access
- Profile management
- Proposal CRUD operations
- Domain management

#### 4. Admin Routes (`admin.spec.ts`)

- Admin dashboard access
- User management (plan, admin status, blocking)
- Proposal management (status changes)
- API endpoints

### Known Issues & Solutions

#### Issue: `loginAs` not working for JSON requests

When making JSON API requests, the session might not be properly maintained. Solutions:

1. Use form data instead of JSON for session-based auth
2. Add proper Content-Type headers
3. Consider API tokens for pure API routes

#### Issue: Inertia returns 200 instead of redirect

Inertia handles redirects client-side. For tests:

- Check for redirect in headers
- Or accept 200 with Inertia location

```typescript
const status = response.response.status
if (status === 302) {
  response.assertHeader('location', '/expected')
}
// 200 with Inertia redirect is also acceptable
```

## Code Style

### TypeScript Conventions

- Use strict mode
- Prefer interfaces over types for objects
- Use enums for fixed sets of values
- Always type function parameters and returns

### Naming Conventions

- **Files**: snake_case (`user_service.ts`)
- **Classes**: PascalCase (`UserService`)
- **Methods/Functions**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces**: PascalCase with `I` prefix optional (`User` or `IUser`)

### Import Order

1. Node.js built-ins
2. External packages
3. AdonisJS packages
4. Internal modules (absolute imports with `#`)
5. Relative imports

### Controller Pattern

```typescript
export default class ResourceController {
  // GET /resource
  async index({ inertia }: HttpContext) {}

  // GET /resource/new
  async create({ inertia }: HttpContext) {}

  // POST /resource
  async store({ request, response }: HttpContext) {}

  // GET /resource/:id
  async show({ params, inertia }: HttpContext) {}

  // GET /resource/:id/edit
  async edit({ params, inertia }: HttpContext) {}

  // PUT /resource/:id
  async update({ params, request, response }: HttpContext) {}

  // DELETE /resource/:id
  async destroy({ params, response }: HttpContext) {}
}
```

### Service Pattern

```typescript
class ResourceService {
  async findById(id: string): Promise<Resource> {
    const resource = await Resource.find(id)
    if (!resource) {
      throw new ResourceNotFoundException(id)
    }
    return resource
  }

  async create(data: CreateResourceDto): Promise<Resource> {
    return Resource.create(data)
  }
}

export default new ResourceService()
```

### Exception Pattern

```typescript
import { BaseException } from './base_exception.js'

export class ResourceNotFoundException extends BaseException {
  static status = 404
  static code = 'E_RESOURCE_NOT_FOUND'

  constructor(id: string) {
    super(`Resource with id ${id} not found`)
  }
}
```

## Environment Variables

Required variables in `.env`:

```bash
# Application
NODE_ENV=development
PORT=3333
APP_KEY=<generated-key>
HOST=localhost
LOG_LEVEL=info

# Session
SESSION_DRIVER=cookie

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_DATABASE=spons_easy
DB_SSL=false

# Redis (for cache)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Optional: PostHog Analytics
POSTHOG_API_KEY=
POSTHOG_PROJECT_ID=
POSTHOG_HOST=
```

## Database

### Migrations

Located in `database/migrations/`. Run with:

```bash
node ace migration:run
```

### Models

Key models:

- `User` - User accounts with roles (user/admin)
- `Proposal` - Sponsorship proposals
- `Tier` - Sponsorship tiers within proposals
- `Benefit` - Benefits within tiers
- `Lead` - Leads generated from proposals
- `Waitlist` - Waitlist signups
- `DailyMetric` - Analytics metrics
- `SessionLog` - Session analytics
- `AdminAction` - Admin action audit log

## Routes Overview

### Public Routes

- `GET /` - Landing page
- `GET /login` - Login page
- `POST /login` - Login action
- `GET /register` - Register page
- `POST /register` - Register action
- `GET /p/:slug` - Public proposal view
- `POST /waitlist` - Waitlist signup

### User Routes (Authenticated)

- `GET /dashboard` - User dashboard
- `GET /profile` - Profile page
- `PUT /profile` - Update profile
- `GET /proposals` - List proposals
- `GET /proposals/new` - Create proposal form
- `POST /proposals` - Create proposal
- `GET /proposals/:id/edit` - Edit proposal
- `PUT /proposals/:id` - Update proposal
- `DELETE /proposals/:id` - Delete proposal
- `GET /proposals/:id/builder` - Visual builder
- `GET /proposals/:id/domain` - Domain settings

### Admin Routes (`/admin/*`)

- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/api/metrics` - Metrics API
- `GET /admin/api/routes` - Routes listing
- `PUT /admin/api/users/:id/plan` - Update user plan
- `PUT /admin/api/users/:id/admin` - Toggle admin status
- `PUT /admin/api/users/:id/block` - Block/unblock user
- `PUT /admin/api/proposals/:id/status` - Change proposal status

## Design Patterns

### Existing Patterns

| Pattern             | Location                                | Description                           |
| ------------------- | --------------------------------------- | ------------------------------------- |
| Singleton           | `app/services/`                         | Services exported as unique instances |
| Repository          | `app/repositories/`                     | Data access abstraction layer         |
| Query Builder       | `app/query_builders/`                   | Fluent query construction             |
| DTO                 | `app/dtos/`                             | Data transfer between layers          |
| Policy              | `app/policies/`                         | Centralized authorization logic       |
| Observer/Event      | `app/events/`, `app/listeners/`         | Decoupling via typed events           |
| Exception Hierarchy | `app/exceptions/`                       | Exception hierarchy with JSON support |
| Cache Aside         | `app/services/metrics_cache_service.ts` | Cache with graceful fallback          |

### Implemented Patterns

| Pattern              | Location                       | Description                              |
| -------------------- | ------------------------------ | ---------------------------------------- |
| Unit of Work         | `app/services/unit_of_work.ts` | Multi-entity transactions                |
| Specification        | `app/specifications/`          | Composable business filtering rules      |
| Strategy             | `app/strategies/`              | Variable behaviors (export formats)      |
| Decorator            | `app/decorators/`              | Transparent enrichment (logging/caching) |
| Factory              | `app/factories/`               | Complex object creation                  |
| Dependency Injection | `app/contracts/`, `providers/` | IoC container with abstract contracts    |

### Anti-Patterns to Avoid

- **God Object**: Do not put all logic in a single giant service
- **Anemic Domain Model**: Models should contain associated business logic
- **Service Locator**: Prefer explicit dependency injection
- **Magic Strings**: Use constants or enums for fixed values
- **Primitive Obsession**: Create Value Objects for business concepts

## Plan Limits System

### Architecture Overview

The plan limits system is centralized in `PlanLimitsService` and integrates with both the Payment and MCP systems.

```text
PlanLimitsService (Single Source of Truth)
        ↑
        ├── ProposalService (enforces creation limits)
        ├── McpService (checks limits via API)
        └── PaymentService (syncs plan via webhooks)
```

### Plan Configuration (`app/contracts/plan_limits_contract.ts`)

```typescript
export const PLAN_CONFIGS: Record<PlanType, PlanLimits> = {
  free: {
    plan: 'free',
    maxProposals: 2, // Main limitation
    maxApiKeys: 1,
    maxCustomDomains: 0,
    maxTeamMembers: 1,
    canRemoveBranding: false,
    hasAnalytics: false,
    hasPrioritySupport: false,
    hasCustomTemplates: false,
    hasApiAccess: true, // MCP accessible by ALL plans
  },
  pro: {
    maxProposals: 50,
    maxApiKeys: 5,
    // ...
  },
  enterprise: {
    maxProposals: -1, // unlimited
    maxApiKeys: 20,
    // ...
  },
}
```

### Key Principles

1. **MCP accessible by ALL plans** - No rate limiting for MCP
2. **Only proposal creation is limited** - 2 for free, 50 for pro, unlimited for enterprise
3. **Centralized in services** - All limit checks go through `PlanLimitsService`
4. **Linked to PaymentService** - Plan sync via webhooks

### Using Plan Limits

```typescript
// In a controller or service
import planLimitsService from '#services/plan_limits_service'

// Check if user can create proposal
const check = await planLimitsService.canCreateProposal(user)
if (!check.allowed) {
  throw new Error(check.message)
}

// Get full usage summary
const usage = await planLimitsService.getUsageSummary(user)
// { proposals: { current: 2, limit: 2, remaining: 0 }, apiKeys: {...}, ... }

// Check feature access
const hasAnalytics = planLimitsService.hasFeatureAccess(user, 'hasAnalytics')
```

### Plan Sync Flow (Payment Webhooks)

```text
Payment Provider (Lemon Squeezy/Stripe)
        ↓ webhook
PaymentService.handleWebhook()
        ↓
PaymentService.updateUserPlan(userId, planType)
        ↓
User.plan = 'free' | 'paid'
        ↓
PlanLimitsService reads user.plan → maps to PlanType
```

## MCP (Model Context Protocol) Integration

### Overview

MCP allows Claude Desktop and other AI assistants to interact with Spons Easy via API keys.

### Architecture

```text
Claude Desktop → MCP Client (npm package) → API Key Auth → MCP Controller → Services
```

### API Key System

- **Key format**: `sk_` prefix + 32-byte random hex
- **Storage**: SHA-256 hash in database
- **Scopes**: `proposals:read`, `proposals:write`, `proposals:publish`, `user:read`

### MCP Endpoints

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/mcp/tools`       | List available tools     |
| POST   | `/mcp/tools/:name` | Execute a tool           |
| GET    | `/mcp/limits`      | Get current usage limits |

### Available MCP Tools

**Proposal Management:**

- `list_proposals` - List user's proposals
- `get_proposal` - Get proposal details
- `create_proposal` - Create new proposal (respects plan limits)
- `update_proposal` - Update existing proposal
- `delete_proposal` - Delete proposal
- `publish_proposal` - Publish proposal
- `unpublish_proposal` - Unpublish proposal

**User & Limits:**

- `get_limits` - Get plan limits and usage
- `get_user` - Get user info with plan details

**Documentation & Content (for AI assistants):**

- `list_docs` - List documentation pages by section
- `get_doc` - Get full documentation page content
- `search_docs` - Search documentation and blog
- `list_blog` - List blog posts by category/tag
- `get_blog_post` - Get full blog post content
- `get_changelog` - Get changelog entries

### NPM Package (`@spons-easy/mcp-client`)

Located in `packages/mcp-client/`:

```typescript
import { SponsEasyClient } from '@spons-easy/mcp-client'

const client = new SponsEasyClient({
  apiKey: 'sk_...',
  baseUrl: 'https://app.sponseasy.com',
})

const proposals = await client.listProposals()
const newProposal = await client.createProposal({ title: 'My Event' })
```

## Payment System

### Strategy Pattern

Supports multiple payment providers via Strategy pattern:

```text
PaymentService
    ├── LemonSqueezyStrategy (default)
    └── StripeStrategy
```

### Configuration

```bash
PAYMENT_PROVIDER=lemonsqueezy  # or 'stripe'

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Webhook Handling

```typescript
// routes.ts
router.post('/webhooks/lemonsqueezy', [WebhooksController, 'lemonsqueezy'])
router.post('/webhooks/stripe', [WebhooksController, 'stripe'])
```

## Email System

### Strategy Pattern

Supports multiple email providers:

```text
EmailService
    ├── ResendStrategy (default)
    └── SMTPStrategy (fallback)
```

### Available Templates

- `welcome` - Welcome email after registration
- `password-reset` - Password reset link
- `proposal-published` - Proposal publication confirmation
- `lead-notification` - New lead notification
- `subscription-welcome` - New subscription confirmation
- `subscription-cancelled` - Cancellation confirmation
- `payment-failed` - Payment failure alert
- `trial-ending` - Trial ending reminder
- And more...

### Usage

```typescript
import emailService from '#services/email_service'

await emailService.send(user.email, 'welcome', {
  userName: user.firstName,
  loginUrl: 'https://app.sponseasy.com/login',
})
```

## Recent Changes

- Implemented comprehensive functional test suite
- Added admin dashboard with real-time metrics
- Disabled CSRF in test environment for easier testing
- Configured Japa test plugins (session, auth, shield)
- Documented design patterns and architecture recommendations
- Implemented centralized plan limits system (`PlanLimitsService`)
- Added MCP (Model Context Protocol) integration with API keys
- Implemented payment system with Lemon Squeezy/Stripe support
- Added email system with Resend/SMTP support
- Created `@spons-easy/mcp-client` NPM package for Claude Desktop
- Implemented blog/documentation system with Markdown content management

## Content Management System (Blog, Docs, Changelog)

### Overview

Spons Easy includes a file-based content management system for blog posts, documentation, and changelog. Content is stored as Markdown files with YAML frontmatter.

### Directory Structure

```text
content/
├── blog/                    # Blog posts
│   └── *.md                # Markdown files with frontmatter
├── docs/                    # Documentation pages
│   └── *.md                # Markdown files with frontmatter
└── changelog/
    └── CHANGELOG.md        # Keep a Changelog format
```

### Frontmatter Schema

#### Blog Posts

```yaml
---
title: Article Title
slug: article-slug
description: Short description for SEO
category: product | tutorial | case-study | announcement | tips
author: Author Name
authorAvatar: /images/author.jpg # optional
coverImage: /images/cover.jpg # optional
tags:
  - tag1
  - tag2
featured: true | false
status: draft | published | archived
publishedAt: 2024-11-30T00:00:00.000Z
updatedAt: 2024-11-30T00:00:00.000Z
---
```

#### Documentation

```yaml
---
title: Documentation Title
slug: doc-slug
description: Short description
section: getting-started | integration | features | api | guides
order: 1
icon: emoji # optional
status: draft | published | archived
updatedAt: 2024-11-30T00:00:00.000Z
---
```

### Content Service

Located in `app/services/content_service.ts`:

```typescript
import contentService from '#services/content_service'

// Get a single item
const post = await contentService.get<BlogFrontmatter>('blog', 'article-slug')

// List items with filters
const { items, total, hasMore } = await contentService.list<BlogFrontmatter>({
  type: 'blog',
  status: 'published',
  category: 'tutorial',
  tag: 'mcp',
  limit: 10,
  offset: 0,
  orderBy: 'publishedAt',
  order: 'desc',
})

// Create blog post
const post = await contentService.createBlogPost({
  title: 'My Article',
  description: 'Description',
  category: 'tutorial',
  author: 'Author Name',
  tags: ['tag1', 'tag2'],
  content: '# Markdown content...',
  status: 'draft',
})

// Create documentation
const doc = await contentService.createDoc({
  title: 'Getting Started',
  description: 'How to start',
  section: 'getting-started',
  order: 1,
  content: '# Documentation...',
  status: 'published',
})

// Add changelog entry
await contentService.addChangelogEntry('1.2.0', {
  added: ['New feature X', 'New feature Y'],
  changed: ['Updated Z'],
  fixed: ['Bug fix A'],
})

// Search content
const results = await contentService.search('search query', ['blog', 'docs'])

// Get related content
const related = await contentService.getRelated<BlogFrontmatter>('blog', 'current-slug', 3)
```

### CLI Commands

```bash
# Create content
node ace content:create blog "Article Title" --category=tutorial --author="Name" --tags="tag1,tag2"
node ace content:create docs "Doc Title" --section=integration --order=1

# List content
node ace content:list              # List all
node ace content:list blog         # List blog posts only
node ace content:list docs         # List docs only
node ace content:list changelog    # List changelog entries
node ace content:list --status=draft  # Filter by status

# Publish content
node ace content:publish blog article-slug
node ace content:publish docs doc-slug

# Add changelog entry
node ace changelog:add 1.2.0 \
  --added="New feature X" \
  --added="New feature Y" \
  --changed="Updated Z" \
  --fixed="Bug fix A"
```

### Routes

#### Public Routes

```text
GET  /blog              → Blog listing
GET  /blog/search       → Blog search
GET  /blog/feed.xml     → RSS feed
GET  /blog/:slug        → Single blog post

GET  /docs              → Documentation index
GET  /docs/search       → Docs search
GET  /docs/:slug        → Single doc page

GET  /changelog         → Changelog page
```

#### API Routes

```text
GET  /api/content/blog              → List blog posts
GET  /api/content/blog/:slug        → Get single post
GET  /api/content/docs              → List docs
GET  /api/content/docs/:slug        → Get single doc
GET  /api/content/changelog         → List changelog entries
GET  /api/content/changelog/latest  → Get latest version
```

### Changelog Management

When implementing new features, always update the changelog:

```bash
# After completing a feature
node ace changelog:add 1.X.X --added="Description of new feature"

# After fixing a bug
node ace changelog:add 1.X.X --fixed="Description of fix"

# Multiple changes
node ace changelog:add 1.2.0 \
  --added="MCP integration for Claude Desktop" \
  --added="Blog and documentation system" \
  --changed="Improved plan limits system" \
  --fixed="Auth redirect issue"
```

### Frontend Pages

Located in `inertia/pages/`:

- `blog/index.tsx` - Blog listing with filters and pagination
- `blog/show.tsx` - Single blog post with TOC and related posts
- `blog/search.tsx` - Blog search results
- `docs/index.tsx` - Documentation index by sections
- `docs/show.tsx` - Single doc with sidebar navigation
- `docs/search.tsx` - Docs search results
- `changelog/index.tsx` - Timeline changelog view

### Best Practices

1. **Always use frontmatter** - Include all required fields
2. **Use semantic versioning** - For changelog entries
3. **Keep slugs URL-friendly** - Auto-generated from title if not provided
4. **Publish when ready** - Use draft status for work in progress
5. **Update changelog** - After every feature/fix implementation
6. **Add documentation** - For new features, especially API changes

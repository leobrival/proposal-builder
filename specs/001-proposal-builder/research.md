# Research: Sponseasy Technical Stack

**Feature**: 001-proposal-builder
**Date**: 2025-11-25
**Status**: Complete

## Technology Decisions

### 1. Backend Framework: AdonisJS 6

**Decision**: AdonisJS 6 with TypeScript

**Rationale**:

- Full-featured MVC framework with built-in ORM (Lucid), authentication, and validation
- First-class TypeScript support
- Official Inertia.js adapter (`@adonisjs/inertia`) for seamless React integration
- Session-based authentication out of the box
- Active development and excellent documentation

**Alternatives Considered**:

- Express.js: Too minimal, requires many additional packages
- NestJS: More complex, better suited for microservices
- Laravel: PHP-based, not in scope

### 2. Frontend Framework: Inertia.js + React

**Decision**: Inertia.js with React adapter

**Rationale**:

- Creates modern SPA experience without building a separate API
- Server-side routing with client-side page transitions
- Typed props from controllers using `InferPageProps`
- SSR support available when needed
- Perfect for the live builder interface with real-time preview

**Key Configuration**:

- Frontend code lives in `inertia/` directory at project root
- Exclude `inertia/**/*` from root `tsconfig.json` for HMR
- Use `import type` only for backend types in frontend code
- Share authenticated user via `sharedData` in `config/inertia.ts`

### 3. UI Components: Shadcn/ui

**Decision**: Shadcn/ui with Tailwind CSS v4

**Rationale**:

- Copy-paste components (no npm dependency lock-in)
- Built on Radix UI (accessible, unstyled primitives)
- Full customization control
- Form components with react-hook-form + Zod integration
- Tables with TanStack Table support

**Key Components Needed**:

- `form`, `input`, `textarea`, `select` - Proposal builder forms
- `button`, `dialog`, `sheet` - Actions and modals
- `table` - Leads dashboard
- `card`, `tabs` - Layout and organization
- `toast` - Notifications

**Installation**:

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input form dialog table card tabs toast textarea select sheet
pnpm add zod @hookform/resolvers @tanstack/react-table
```

### 4. Database: Neon PostgreSQL

**Decision**: Neon PostgreSQL with branching

**Rationale**:

- Serverless PostgreSQL with instant branching
- Copy-on-write architecture for fast branch creation (~1 second)
- Perfect for dev/prod isolation
- SSL required (secure by default)
- Scale-to-zero for cost efficiency

**Branch Strategy**:
| Branch | Purpose | Connection |
|--------|---------|------------|
| `main` | Production | Pooled connection |
| `dev/staging` | Pre-production testing | Pooled connection |

**Configuration**:

```bash
# .env.development
DATABASE_URL="postgresql://user:xxx@ep-dev-xxx.neon.tech/neondb?sslmode=require"

# .env.production
DATABASE_URL="postgresql://user:xxx@ep-prod-xxx.neon.tech/neondb?sslmode=require"
```

### 5. Authentication: Session-based

**Decision**: AdonisJS session guard with cookies

**Rationale**:

- Built-in to AdonisJS (`@adonisjs/auth`)
- Works seamlessly with Inertia.js
- CSRF protection via `@adonisjs/shield`
- Simple user model with password hashing
- Remember me tokens optional

**Key Configuration**:

- Enable `enableXsrfCookie: true` in `config/shield.ts`
- Share user via `sharedData` in `config/inertia.ts`
- Use `middleware.auth()` for protected routes

### 6. File Storage: Local + Cloud (Future)

**Decision**: Local storage initially, cloud-ready architecture

**Rationale**:

- AdonisJS Drive abstraction allows easy migration to S3/CloudFlare R2
- Start simple with local storage for MVP
- Image optimization handled at upload time

### 7. Email Service: Resend (Recommended)

**Decision**: Resend for transactional emails

**Rationale**:

- Modern API, developer-friendly
- Free tier sufficient for MVP
- AdonisJS mail package compatible

### 8. PDF Generation: Puppeteer/Playwright

**Decision**: Headless browser for PDF generation

**Rationale**:

- Renders React components as PDF
- Preserves styling and layout
- Can be offloaded to background job for performance

## Project Structure

```
spons-easy/
├── app/
│   ├── controllers/
│   │   ├── auth/
│   │   │   ├── login_controller.ts
│   │   │   ├── register_controller.ts
│   │   │   └── logout_controller.ts
│   │   ├── proposals_controller.ts
│   │   ├── tiers_controller.ts
│   │   ├── leads_controller.ts
│   │   ├── dashboard_controller.ts
│   │   └── public_proposals_controller.ts
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
│   │   ├── layout.tsx
│   │   ├── navbar.tsx
│   │   └── proposal-preview.tsx
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
│   │   │   └── settings.tsx
│   │   └── public/
│   │       └── [slug].tsx
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
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Development Workflow

### Initial Setup

```bash
# 1. Create AdonisJS project with Inertia + React
npm init adonisjs@latest spons-easy -- -K=inertia --adapter=react

# 2. Configure database
node ace configure @adonisjs/lucid --db=postgres

# 3. Initialize Shadcn
cd spons-easy
pnpm dlx shadcn@latest init

# 4. Add Shadcn components
pnpm dlx shadcn@latest add button input form dialog table card tabs toast textarea select sheet

# 5. Add form dependencies
pnpm add zod @hookform/resolvers @tanstack/react-table

# 6. Setup Neon branches
neon branches create --name dev/staging
```

### Environment Variables

```bash
# .env
TZ=UTC
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=<generated>
NODE_ENV=development

# Database (Neon)
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"

# Session
SESSION_DRIVER=cookie

# Email (Resend)
RESEND_API_KEY=re_xxx

# App
APP_URL=http://localhost:3333
```

## Key Integration Patterns

### 1. Inertia Shared Data for Auth

```typescript
// config/inertia.ts
sharedData: {
  user: (ctx) => ctx.auth?.user ?? null,
  flash: (ctx) => ctx.session?.flashMessages.all() ?? {},
  errors: (ctx) => ctx.session?.flashMessages.get('errors') ?? {},
}
```

### 2. Controller Pattern with Inertia

```typescript
// app/controllers/proposals_controller.ts
export default class ProposalsController {
  async create({ inertia }: HttpContext) {
    return inertia.render("proposals/create");
  }

  async store({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createProposalValidator);
    const proposal = await auth.user!.related("proposals").create(data);
    return response.redirect().toRoute("proposals.edit", { id: proposal.id });
  }
}
```

### 3. Form with Shadcn + Inertia

```tsx
// inertia/pages/proposals/create.tsx
import { useForm } from "@inertiajs/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function CreateProposal() {
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    description: "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        post("/proposals");
      }}
    >
      {/* Form fields */}
    </form>
  );
}
```

## Performance Considerations

1. **Live Preview**: Use React state for instant updates, debounce API saves
2. **Image Uploads**: Compress client-side before upload, lazy load in preview
3. **PDF Generation**: Queue as background job, notify user when ready
4. **Database**: Use pooled connections for Neon, index frequently queried columns

## Security Considerations

1. **CSRF**: Enabled via `@adonisjs/shield` with XSRF cookie
2. **Authentication**: Session-based with httpOnly cookies
3. **Authorization**: Users can only access their own proposals/leads
4. **Input Validation**: Server-side validation on all endpoints
5. **File Uploads**: Validate file types and sizes, sanitize filenames

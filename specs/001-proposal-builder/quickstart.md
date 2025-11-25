# Quickstart Guide: Sponseasy

**Feature**: 001-proposal-builder
**Date**: 2025-11-25

## Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 8+ (or npm/yarn)
- Neon account (free tier: https://neon.tech)
- Git

## 1. Create AdonisJS Project

```bash
# Create project with Inertia + React starter kit
npm init adonisjs@latest spons-easy -- -K=inertia --adapter=react

# During setup, select:
# - Package manager: pnpm
# - Auth: Sessions
# - SSR: Yes (optional, can disable later)

cd spons-easy
```

## 2. Configure Database (Neon PostgreSQL)

### Create Neon Project

1. Go to https://console.neon.tech
2. Create new project "sponseasy"
3. Note the connection string

### Create Development Branch

```bash
# Install Neon CLI
npm install -g neonctl

# Authenticate
neonctl auth

# Create dev branch
neonctl branches create --name dev/staging

# Get connection strings
neonctl connection-string main --pooled        # Production
neonctl connection-string dev/staging --pooled # Development
```

### Configure AdonisJS

```bash
# Install PostgreSQL driver
pnpm add @adonisjs/lucid pg
node ace configure @adonisjs/lucid --db=postgres
```

Update `.env`:

```bash
# Database (Neon - Development)
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"

# Session
SESSION_DRIVER=cookie
```

Update `config/database.ts`:

```typescript
import env from "#start/env";
import { defineConfig } from "@adonisjs/lucid";

const dbConfig = defineConfig({
  connection: "postgres",
  connections: {
    postgres: {
      client: "pg",
      connection: env.get("DATABASE_URL"),
      migrations: {
        naturalSort: true,
        paths: ["database/migrations"],
      },
    },
  },
});

export default dbConfig;
```

## 3. Install Shadcn/ui

```bash
# Initialize Shadcn
pnpm dlx shadcn@latest init

# When prompted:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind CSS: Yes (already configured)
# - Components location: inertia/components/ui

# Install essential components
pnpm dlx shadcn@latest add button input form dialog table card tabs toast textarea select sheet label

# Install form dependencies
pnpm add zod @hookform/resolvers @tanstack/react-table
```

### Configure Path Alias

Update `inertia/tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "~/components/*": ["./components/*"]
    }
  }
}
```

## 4. Configure Authentication

### Update Inertia Shared Data

Edit `config/inertia.ts`:

```typescript
import { defineConfig } from "@adonisjs/inertia";
import type { InferSharedProps } from "@adonisjs/inertia/types";

const inertiaConfig = defineConfig({
  rootView: "inertia_layout",

  sharedData: {
    appName: "Sponseasy",
    user: (ctx) => ctx.auth?.user ?? null,
    flash: (ctx) => ctx.session?.flashMessages.all() ?? {},
    errors: (ctx) => ctx.session?.flashMessages.get("errors") ?? {},
  },

  ssr: {
    enabled: true,
    entrypoint: "inertia/app/ssr.tsx",
  },
});

declare module "@adonisjs/inertia/types" {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}

export default inertiaConfig;
```

### Enable CSRF Cookie

Edit `config/shield.ts`:

```typescript
import { defineConfig } from "@adonisjs/shield";

export default defineConfig({
  csrf: {
    enabled: true,
    enableXsrfCookie: true, // Important for Inertia
  },
});
```

## 5. Create Database Schema

### Run Migration Generator

```bash
# Users table (usually included with auth)
node ace make:migration create_users_table

# Proposals table
node ace make:migration create_proposals_table

# Tiers table
node ace make:migration create_tiers_table

# Benefits table
node ace make:migration create_benefits_table

# Leads table
node ace make:migration create_leads_table
```

### Example Migration (Proposals)

```typescript
// database/migrations/xxx_create_proposals_table.ts
import { BaseSchema } from "@adonisjs/lucid/schema";

export default class extends BaseSchema {
  protected tableName = "proposals";

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid("id").primary().defaultTo(this.raw("gen_random_uuid()"));
      table
        .uuid("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("title", 255).notNullable();
      table.string("slug", 255).unique().notNullable();
      table.text("description").nullable();
      table.string("project_name", 255).notNullable();
      table.text("project_description").nullable();
      table.string("logo_url", 500).nullable();
      table.string("cover_image_url", 500).nullable();
      table.string("contact_email", 255).notNullable();
      table.string("contact_phone", 50).nullable();
      table
        .enum("status", ["draft", "published", "archived"])
        .defaultTo("draft");
      table.timestamp("published_at").nullable();
      table.integer("view_count").defaultTo(0);
      table.jsonb("design_settings").defaultTo("{}");
      table.timestamps(true, true);

      table.index("user_id");
      table.index("status");
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
```

### Run Migrations

```bash
node ace migration:run
```

## 6. Create Models

```bash
node ace make:model User
node ace make:model Proposal
node ace make:model Tier
node ace make:model Benefit
node ace make:model Lead
```

See `data-model.md` for complete model definitions.

## 7. Create Controllers

```bash
# Auth controllers
node ace make:controller auth/Login
node ace make:controller auth/Register
node ace make:controller auth/Logout

# Feature controllers
node ace make:controller Dashboard
node ace make:controller Proposals
node ace make:controller Tiers
node ace make:controller Benefits
node ace make:controller Leads
node ace make:controller Uploads
node ace make:controller PublicProposals
node ace make:controller Home
```

## 8. Setup Routes

Copy the routes definition from `contracts/api-routes.md` to `start/routes.ts`.

## 9. Create Inertia Pages

Create the following page structure:

```
inertia/pages/
├── home.tsx
├── auth/
│   ├── login.tsx
│   └── register.tsx
├── dashboard/
│   ├── index.tsx
│   └── leads.tsx
├── proposals/
│   ├── index.tsx
│   ├── create.tsx
│   ├── edit.tsx
│   ├── show.tsx
│   └── settings.tsx
├── public/
│   └── proposal.tsx
└── errors/
    ├── not-found.tsx
    └── server-error.tsx
```

See `contracts/inertia-pages.md` for component props and structure.

## 10. Start Development Server

```bash
# Start AdonisJS dev server (includes Vite HMR)
pnpm dev
```

Open http://localhost:3333

## Environment Variables Reference

```bash
# .env.example

# App
TZ=UTC
PORT=3333
HOST=0.0.0.0
LOG_LEVEL=info
APP_KEY=<run: node ace generate:key>
NODE_ENV=development
APP_URL=http://localhost:3333

# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"

# Session
SESSION_DRIVER=cookie

# Email (optional, for notifications)
RESEND_API_KEY=re_xxx

# File Storage (optional, for S3/R2)
DRIVE_DISK=local
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=
S3_BUCKET=
```

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
node ace migration:run       # Run migrations
node ace migration:rollback  # Rollback last batch
node ace migration:fresh     # Drop all & re-run
node ace db:seed             # Run seeders

# Code Generation
node ace make:controller Name
node ace make:model Name
node ace make:migration create_xxx_table
node ace make:validator Name

# Testing
node ace test         # Run tests

# Shadcn
pnpm dlx shadcn@latest add [component]  # Add component
```

## Next Steps

1. Implement authentication controllers
2. Create the proposal builder UI with live preview
3. Implement auto-save functionality
4. Add tier/benefit management
5. Build the public proposal page
6. Implement PDF export
7. Add email notifications for leads
8. Deploy to production

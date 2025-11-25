# API Routes Contract: Sponseasy

**Feature**: 001-proposal-builder
**Date**: 2025-11-25
**Framework**: AdonisJS 6 with Inertia.js

## Overview

This document defines all routes for the Sponseasy application. Routes are organized by feature area and include both Inertia page routes and API endpoints.

## Route Conventions

- **Inertia Pages**: Return `inertia.render()` for full page loads
- **API Actions**: Return JSON or redirect responses
- **Protected Routes**: Require authentication via `middleware.auth()`
- **Guest Routes**: Only accessible when not authenticated via `middleware.guest()`
- **Public Routes**: Accessible by anyone

---

## Authentication Routes

### Guest Only (middleware.guest)

| Method | URI         | Controller         | Action | Description               |
| ------ | ----------- | ------------------ | ------ | ------------------------- |
| GET    | `/login`    | LoginController    | show   | Display login form        |
| POST   | `/login`    | LoginController    | store  | Authenticate user         |
| GET    | `/register` | RegisterController | show   | Display registration form |
| POST   | `/register` | RegisterController | store  | Create new account        |

### Authenticated (middleware.auth)

| Method | URI       | Controller       | Action | Description |
| ------ | --------- | ---------------- | ------ | ----------- |
| POST   | `/logout` | LogoutController | handle | End session |

---

## Dashboard Routes (middleware.auth)

| Method | URI                | Controller          | Action | Description                       |
| ------ | ------------------ | ------------------- | ------ | --------------------------------- |
| GET    | `/dashboard`       | DashboardController | index  | Main dashboard with proposal list |
| GET    | `/dashboard/leads` | DashboardController | leads  | All leads across proposals        |

---

## Proposal Routes (middleware.auth)

### Proposal CRUD

| Method | URI                   | Controller          | Action  | Description           |
| ------ | --------------------- | ------------------- | ------- | --------------------- |
| GET    | `/proposals`          | ProposalsController | index   | List user's proposals |
| GET    | `/proposals/create`   | ProposalsController | create  | New proposal builder  |
| POST   | `/proposals`          | ProposalsController | store   | Create proposal       |
| GET    | `/proposals/:id`      | ProposalsController | show    | View proposal details |
| GET    | `/proposals/:id/edit` | ProposalsController | edit    | Edit proposal builder |
| PUT    | `/proposals/:id`      | ProposalsController | update  | Update proposal       |
| DELETE | `/proposals/:id`      | ProposalsController | destroy | Delete proposal       |

### Proposal Actions

| Method | URI                         | Controller          | Action         | Description            |
| ------ | --------------------------- | ------------------- | -------------- | ---------------------- |
| POST   | `/proposals/:id/publish`    | ProposalsController | publish        | Publish proposal       |
| POST   | `/proposals/:id/unpublish`  | ProposalsController | unpublish      | Unpublish proposal     |
| POST   | `/proposals/:id/archive`    | ProposalsController | archive        | Archive proposal       |
| GET    | `/proposals/:id/settings`   | ProposalsController | settings       | Design settings page   |
| PUT    | `/proposals/:id/settings`   | ProposalsController | updateSettings | Update design settings |
| GET    | `/proposals/:id/export-pdf` | ProposalsController | exportPdf      | Generate PDF export    |

### Auto-save Endpoint

| Method | URI                       | Controller          | Action   | Description             |
| ------ | ------------------------- | ------------------- | -------- | ----------------------- |
| PATCH  | `/proposals/:id/autosave` | ProposalsController | autosave | Auto-save draft changes |

---

## Tier Routes (middleware.auth)

| Method | URI                                    | Controller      | Action  | Description          |
| ------ | -------------------------------------- | --------------- | ------- | -------------------- |
| POST   | `/proposals/:proposalId/tiers`         | TiersController | store   | Add tier to proposal |
| PUT    | `/proposals/:proposalId/tiers/:id`     | TiersController | update  | Update tier          |
| DELETE | `/proposals/:proposalId/tiers/:id`     | TiersController | destroy | Remove tier          |
| POST   | `/proposals/:proposalId/tiers/reorder` | TiersController | reorder | Reorder tiers        |

---

## Benefit Routes (middleware.auth)

| Method | URI                               | Controller         | Action  | Description         |
| ------ | --------------------------------- | ------------------ | ------- | ------------------- |
| POST   | `/tiers/:tierId/benefits`         | BenefitsController | store   | Add benefit to tier |
| PUT    | `/tiers/:tierId/benefits/:id`     | BenefitsController | update  | Update benefit      |
| DELETE | `/tiers/:tierId/benefits/:id`     | BenefitsController | destroy | Remove benefit      |
| POST   | `/tiers/:tierId/benefits/reorder` | BenefitsController | reorder | Reorder benefits    |

---

## Lead Routes (middleware.auth)

| Method | URI                            | Controller      | Action  | Description              |
| ------ | ------------------------------ | --------------- | ------- | ------------------------ |
| GET    | `/proposals/:proposalId/leads` | LeadsController | index   | List leads for proposal  |
| GET    | `/leads/:id`                   | LeadsController | show    | View lead details        |
| PUT    | `/leads/:id`                   | LeadsController | update  | Update lead status/notes |
| DELETE | `/leads/:id`                   | LeadsController | destroy | Delete lead              |

---

## File Upload Routes (middleware.auth)

| Method | URI              | Controller        | Action  | Description              |
| ------ | ---------------- | ----------------- | ------- | ------------------------ |
| POST   | `/uploads/image` | UploadsController | image   | Upload and process image |
| DELETE | `/uploads/:id`   | UploadsController | destroy | Delete uploaded file     |

---

## Public Routes (no authentication)

### Public Proposal View

| Method | URI                | Controller                | Action  | Description                        |
| ------ | ------------------ | ------------------------- | ------- | ---------------------------------- |
| GET    | `/p/:slug`         | PublicProposalsController | show    | View published proposal            |
| POST   | `/p/:slug/contact` | PublicProposalsController | contact | Submit contact form (creates Lead) |

### Home Page

| Method | URI | Controller     | Action | Description  |
| ------ | --- | -------------- | ------ | ------------ |
| GET    | `/` | HomeController | index  | Landing page |

---

## AdonisJS Routes Definition

```typescript
// start/routes.ts
import router from "@adonisjs/core/services/router";
import { middleware } from "#start/kernel";

// Controllers
const HomeController = () => import("#controllers/home_controller");
const LoginController = () => import("#controllers/auth/login_controller");
const RegisterController = () =>
  import("#controllers/auth/register_controller");
const LogoutController = () => import("#controllers/auth/logout_controller");
const DashboardController = () => import("#controllers/dashboard_controller");
const ProposalsController = () => import("#controllers/proposals_controller");
const TiersController = () => import("#controllers/tiers_controller");
const BenefitsController = () => import("#controllers/benefits_controller");
const LeadsController = () => import("#controllers/leads_controller");
const UploadsController = () => import("#controllers/uploads_controller");
const PublicProposalsController = () =>
  import("#controllers/public_proposals_controller");

// Public routes
router.get("/", [HomeController, "index"]);

// Guest routes (login, register)
router
  .group(() => {
    router.get("/login", [LoginController, "show"]).as("login");
    router.post("/login", [LoginController, "store"]);
    router.get("/register", [RegisterController, "show"]).as("register");
    router.post("/register", [RegisterController, "store"]);
  })
  .use(middleware.guest());

// Authenticated routes
router
  .group(() => {
    // Logout
    router.post("/logout", [LogoutController, "handle"]).as("logout");

    // Dashboard
    router.get("/dashboard", [DashboardController, "index"]).as("dashboard");
    router
      .get("/dashboard/leads", [DashboardController, "leads"])
      .as("dashboard.leads");

    // Proposals
    router.resource("proposals", ProposalsController).except(["show"]);
    router
      .get("/proposals/:id", [ProposalsController, "show"])
      .as("proposals.show");
    router
      .post("/proposals/:id/publish", [ProposalsController, "publish"])
      .as("proposals.publish");
    router
      .post("/proposals/:id/unpublish", [ProposalsController, "unpublish"])
      .as("proposals.unpublish");
    router
      .post("/proposals/:id/archive", [ProposalsController, "archive"])
      .as("proposals.archive");
    router
      .get("/proposals/:id/settings", [ProposalsController, "settings"])
      .as("proposals.settings");
    router
      .put("/proposals/:id/settings", [ProposalsController, "updateSettings"])
      .as("proposals.updateSettings");
    router
      .get("/proposals/:id/export-pdf", [ProposalsController, "exportPdf"])
      .as("proposals.exportPdf");
    router
      .patch("/proposals/:id/autosave", [ProposalsController, "autosave"])
      .as("proposals.autosave");

    // Tiers (nested under proposals)
    router
      .post("/proposals/:proposalId/tiers", [TiersController, "store"])
      .as("tiers.store");
    router
      .put("/proposals/:proposalId/tiers/:id", [TiersController, "update"])
      .as("tiers.update");
    router
      .delete("/proposals/:proposalId/tiers/:id", [TiersController, "destroy"])
      .as("tiers.destroy");
    router
      .post("/proposals/:proposalId/tiers/reorder", [
        TiersController,
        "reorder",
      ])
      .as("tiers.reorder");

    // Benefits (nested under tiers)
    router
      .post("/tiers/:tierId/benefits", [BenefitsController, "store"])
      .as("benefits.store");
    router
      .put("/tiers/:tierId/benefits/:id", [BenefitsController, "update"])
      .as("benefits.update");
    router
      .delete("/tiers/:tierId/benefits/:id", [BenefitsController, "destroy"])
      .as("benefits.destroy");
    router
      .post("/tiers/:tierId/benefits/reorder", [BenefitsController, "reorder"])
      .as("benefits.reorder");

    // Leads
    router
      .get("/proposals/:proposalId/leads", [LeadsController, "index"])
      .as("leads.index");
    router.get("/leads/:id", [LeadsController, "show"]).as("leads.show");
    router.put("/leads/:id", [LeadsController, "update"]).as("leads.update");
    router
      .delete("/leads/:id", [LeadsController, "destroy"])
      .as("leads.destroy");

    // Uploads
    router
      .post("/uploads/image", [UploadsController, "image"])
      .as("uploads.image");
    router
      .delete("/uploads/:id", [UploadsController, "destroy"])
      .as("uploads.destroy");
  })
  .use(middleware.auth());

// Public proposal routes
router
  .get("/p/:slug", [PublicProposalsController, "show"])
  .as("public.proposal");
router
  .post("/p/:slug/contact", [PublicProposalsController, "contact"])
  .as("public.contact");
```

---

## Request/Response Schemas

### Authentication

#### POST /login

**Request**:

```typescript
{
  email: string      // required, valid email
  password: string   // required, min 8 chars
  remember?: boolean // optional, persist session
}
```

**Response**: Redirect to `/dashboard` on success, back with errors on failure

#### POST /register

**Request**:

```typescript
{
  fullName: string; // required, 2-255 chars
  email: string; // required, valid email, unique
  password: string; // required, min 8 chars
}
```

**Response**: Redirect to `/dashboard` on success

---

### Proposals

#### POST /proposals

**Request**:

```typescript
{
  title: string           // required, 3-255 chars
  projectName: string     // required, 2-255 chars
  contactEmail: string    // required, valid email
  description?: string
  projectDescription?: string
  contactPhone?: string
}
```

**Response**: Redirect to `/proposals/:id/edit`

#### PUT /proposals/:id

**Request**:

```typescript
{
  title?: string
  description?: string
  projectName?: string
  projectDescription?: string
  contactEmail?: string
  contactPhone?: string
  logoUrl?: string
  coverImageUrl?: string
}
```

**Response**: Redirect back or JSON `{ success: true }`

#### PATCH /proposals/:id/autosave

**Request**:

```typescript
{
  title?: string
  description?: string
  projectName?: string
  projectDescription?: string
  // ... any proposal fields
}
```

**Response**:

```typescript
{
  success: true;
  savedAt: string; // ISO timestamp
}
```

#### PUT /proposals/:id/settings

**Request**:

```typescript
{
  designSettings: {
    primaryColor?: string    // hex color
    secondaryColor?: string  // hex color
    fontFamily?: string      // font name
    logoPosition?: 'left' | 'center' | 'right'
    layout?: 'modern' | 'classic' | 'minimal'
  }
}
```

**Response**: Redirect back

---

### Tiers

#### POST /proposals/:proposalId/tiers

**Request**:

```typescript
{
  name: string        // required, 1-255 chars
  price: number       // required, positive
  currency?: string   // default 'EUR'
  description?: string
  isFeatured?: boolean
  maxSponsors?: number | null
}
```

**Response**:

```typescript
{
  tier: {
    id: string;
    name: string;
    price: number;
    // ...
  }
}
```

#### POST /proposals/:proposalId/tiers/reorder

**Request**:

```typescript
{
  tierIds: string[] // ordered array of tier IDs
}
```

**Response**: `{ success: true }`

---

### Benefits

#### POST /tiers/:tierId/benefits

**Request**:

```typescript
{
  description: string; // required, 1-500 chars
}
```

**Response**:

```typescript
{
  benefit: {
    id: string;
    description: string;
    position: number;
  }
}
```

---

### Leads

#### PUT /leads/:id

**Request**:

```typescript
{
  status?: 'new' | 'contacted' | 'pending' | 'converted' | 'rejected'
  notes?: string
}
```

**Response**: Redirect back or JSON `{ success: true }`

---

### Public Contact Form

#### POST /p/:slug/contact

**Request**:

```typescript
{
  name: string           // required, 2-255 chars
  email: string          // required, valid email
  company?: string
  phone?: string
  message?: string       // max 5000 chars
  interestedTierId?: string
}
```

**Response**:

```typescript
{
  success: true;
  message: "Votre demande a été envoyée avec succès";
}
```

---

### File Uploads

#### POST /uploads/image

**Request**: `multipart/form-data`

```
file: File // required, max 10MB, image/*
type: 'logo' | 'cover' | 'content' // required
```

**Response**:

```typescript
{
  url: string; // public URL to access image
  id: string; // upload ID for deletion
}
```

---

## Error Responses

All error responses follow this format:

```typescript
{
  errors: {
    [field: string]: string[] // validation errors per field
  }
}
```

Or for general errors:

```typescript
{
  message: string
  code?: string
}
```

HTTP Status Codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not owner)
- `404` - Not Found
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limited)
- `500` - Server Error

---

## Rate Limiting

Rate limiting is implemented via `@adonisjs/limiter` to prevent abuse and protect against brute-force attacks.

### Rate Limit Configuration

| Endpoint Category                 | Limit        | Window     | Key        |
| --------------------------------- | ------------ | ---------- | ---------- |
| **Authentication**                |              |            |            |
| POST /login                       | 5 requests   | 15 minutes | IP address |
| POST /register                    | 3 requests   | 1 hour     | IP address |
| **Public Contact**                |              |            |            |
| POST /p/:slug/contact             | 3 requests   | 5 minutes  | IP + slug  |
| **API (Authenticated)**           |              |            |            |
| Read operations (GET)             | 100 requests | 1 minute   | User ID    |
| Write operations (POST/PUT/PATCH) | 30 requests  | 1 minute   | User ID    |
| DELETE operations                 | 10 requests  | 1 minute   | User ID    |
| **File Uploads**                  |              |            |            |
| POST /uploads/image               | 10 requests  | 10 minutes | User ID    |
| **Auto-save**                     |              |            |            |
| PATCH /proposals/:id/autosave     | 60 requests  | 1 minute   | User ID    |
| **PDF Export**                    |              |            |            |
| GET /proposals/:id/export-pdf     | 5 requests   | 10 minutes | User ID    |

### Rate Limit Response

When rate limit is exceeded:

```typescript
// HTTP 429 Too Many Requests
{
  message: "Trop de requêtes. Veuillez réessayer dans X secondes.",
  retryAfter: number // seconds until limit resets
}
```

**Response Headers**:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699999999
Retry-After: 60
```

### Implementation Example

```typescript
// start/limiter.ts
import limiter from "@adonisjs/limiter/services/main";

export const authLimiter = limiter.define("auth", () => {
  return limiter.allowRequests(5).every("15 minutes");
});

export const apiLimiter = limiter.define("api", (ctx) => {
  // Higher limits for authenticated users
  if (ctx.auth.user) {
    return limiter.allowRequests(100).every("1 minute");
  }
  return limiter.allowRequests(20).every("1 minute");
});

export const contactLimiter = limiter.define("contact", () => {
  return limiter.allowRequests(3).every("5 minutes");
});
```

---

## Pagination

All list endpoints support pagination via query parameters.

### Pagination Parameters

| Parameter   | Type            | Default     | Max | Description                     |
| ----------- | --------------- | ----------- | --- | ------------------------------- |
| `page`      | integer         | 1           | -   | Current page number (1-indexed) |
| `perPage`   | integer         | 20          | 100 | Items per page                  |
| `sortBy`    | string          | 'createdAt' | -   | Field to sort by                |
| `sortOrder` | 'asc' \| 'desc' | 'desc'      | -   | Sort direction                  |

### Paginated Endpoints

| Endpoint                 | Default Sort | Sortable Fields                                |
| ------------------------ | ------------ | ---------------------------------------------- |
| GET /proposals           | createdAt    | createdAt, updatedAt, title, viewCount, status |
| GET /dashboard           | createdAt    | createdAt, viewCount, leadsCount               |
| GET /dashboard/leads     | createdAt    | createdAt, status, name                        |
| GET /proposals/:id/leads | createdAt    | createdAt, status, name, company               |

### Pagination Response Format

```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number; // Total items across all pages
    perPage: number; // Items per page
    currentPage: number; // Current page number
    lastPage: number; // Total number of pages
    firstPage: number; // First page (always 1)
    firstPageUrl: string; // URL to first page
    lastPageUrl: string; // URL to last page
    nextPageUrl: string | null; // URL to next page
    previousPageUrl: string | null; // URL to previous page
  };
}
```

### Example Request

```bash
GET /proposals?page=2&perPage=10&sortBy=viewCount&sortOrder=desc
```

### Example Response

```typescript
{
  data: [
    { id: "...", title: "Mon Projet", viewCount: 150, ... },
    { id: "...", title: "Autre Projet", viewCount: 120, ... },
    // ... 8 more items
  ],
  meta: {
    total: 45,
    perPage: 10,
    currentPage: 2,
    lastPage: 5,
    firstPage: 1,
    firstPageUrl: "/proposals?page=1&perPage=10",
    lastPageUrl: "/proposals?page=5&perPage=10",
    nextPageUrl: "/proposals?page=3&perPage=10",
    previousPageUrl: "/proposals?page=1&perPage=10"
  }
}
```

### Filtering Parameters

Additional filtering is available on specific endpoints:

#### GET /proposals

| Parameter | Type   | Description                                  |
| --------- | ------ | -------------------------------------------- |
| `status`  | string | Filter by status: draft, published, archived |
| `search`  | string | Search in title and projectName              |

#### GET /dashboard/leads

| Parameter    | Type   | Description                    |
| ------------ | ------ | ------------------------------ |
| `status`     | string | Filter by lead status          |
| `proposalId` | string | Filter by proposal             |
| `search`     | string | Search in name, email, company |

### Implementation Example

```typescript
// app/controllers/proposals_controller.ts
import type { HttpContext } from "@adonisjs/core/http";

export default class ProposalsController {
  async index({ request, auth, inertia }: HttpContext) {
    const page = request.input("page", 1);
    const perPage = Math.min(request.input("perPage", 20), 100);
    const sortBy = request.input("sortBy", "createdAt");
    const sortOrder = request.input("sortOrder", "desc");
    const status = request.input("status");
    const search = request.input("search");

    const query = auth.user!.related("proposals").query();

    if (status) {
      query.where("status", status);
    }

    if (search) {
      query.where((q) => {
        q.whereILike("title", `%${search}%`).orWhereILike(
          "projectName",
          `%${search}%`,
        );
      });
    }

    const proposals = await query
      .orderBy(sortBy, sortOrder)
      .paginate(page, perPage);

    return inertia.render("proposals/index", {
      proposals: proposals.serialize(),
    });
  }
}
```

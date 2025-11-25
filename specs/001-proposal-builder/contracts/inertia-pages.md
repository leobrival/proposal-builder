# Inertia Pages Contract: Sponseasy

**Feature**: 001-proposal-builder
**Date**: 2025-11-25
**Framework**: Inertia.js + React

## Overview

This document defines all Inertia page components and their expected props. Each page receives props from the controller and shared data from `config/inertia.ts`.

## Shared Props (All Pages)

Available via `usePage<SharedProps>().props`:

```typescript
interface SharedProps {
  user: {
    id: string;
    email: string;
    fullName: string;
  } | null;
  flash: {
    success?: string;
    error?: string;
    info?: string;
  };
  errors: Record<string, string>;
  appName: string;
}
```

---

## Page Components

### Authentication Pages

#### `pages/auth/login.tsx`

**Route**: `GET /login`

**Props**:

```typescript
interface LoginPageProps {
  // No additional props, uses shared errors
}
```

**Component Structure**:

- Email input field
- Password input field
- "Remember me" checkbox
- Submit button
- Link to register page

---

#### `pages/auth/register.tsx`

**Route**: `GET /register`

**Props**:

```typescript
interface RegisterPageProps {
  // No additional props, uses shared errors
}
```

**Component Structure**:

- Full name input field
- Email input field
- Password input field
- Password confirmation field
- Submit button
- Link to login page

---

### Dashboard Pages

#### `pages/dashboard/index.tsx`

**Route**: `GET /dashboard`

**Props**:

```typescript
interface DashboardPageProps {
  proposals: Array<{
    id: string;
    title: string;
    slug: string;
    status: "draft" | "published" | "archived";
    viewCount: number;
    leadsCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  stats: {
    totalProposals: number;
    publishedProposals: number;
    totalViews: number;
    totalLeads: number;
    newLeadsThisWeek: number;
  };
}
```

**Component Structure**:

- Stats cards (total proposals, views, leads)
- Proposals list/grid with status badges
- Quick actions (edit, view, publish/unpublish)
- "Create New Proposal" button

---

#### `pages/dashboard/leads.tsx`

**Route**: `GET /dashboard/leads`

**Props**:

```typescript
interface LeadsPageProps {
  leads: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    message: string | null;
    status: "new" | "contacted" | "pending" | "converted" | "rejected";
    createdAt: string;
    proposal: {
      id: string;
      title: string;
    };
    interestedTier: {
      id: string;
      name: string;
    } | null;
  }>;
  filters: {
    status: string | null;
    proposalId: string | null;
  };
  proposals: Array<{
    id: string;
    title: string;
  }>;
}
```

**Component Structure**:

- Filters (by status, by proposal)
- Data table with leads
- Status dropdown for each lead
- Link to proposal
- Delete action

---

### Proposal Pages

#### `pages/proposals/index.tsx`

**Route**: `GET /proposals`

**Props**:

```typescript
interface ProposalsIndexPageProps {
  proposals: Array<{
    id: string;
    title: string;
    slug: string;
    projectName: string;
    status: "draft" | "published" | "archived";
    viewCount: number;
    leadsCount: number;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

**Component Structure**:

- Proposals list/grid view
- Status filters
- Sort options (date, views, leads)
- Actions menu per proposal

---

#### `pages/proposals/create.tsx`

**Route**: `GET /proposals/create`

**Props**:

```typescript
interface ProposalCreatePageProps {
  // Empty, new proposal form
}
```

**Component Structure**:

- Split-screen layout
- Left: Form wizard with sections
  - Basic info (title, project name)
  - Project description
  - Contact information
- Right: Live preview (empty state)
- Save as draft button

---

#### `pages/proposals/edit.tsx`

**Route**: `GET /proposals/:id/edit`

**Props**:

```typescript
interface ProposalEditPageProps {
  proposal: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    projectName: string;
    projectDescription: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    contactEmail: string;
    contactPhone: string | null;
    status: "draft" | "published" | "archived";
    designSettings: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      logoPosition: "left" | "center" | "right";
      layout: "modern" | "classic" | "minimal";
    };
    tiers: Array<{
      id: string;
      name: string;
      price: number;
      currency: string;
      description: string | null;
      isFeatured: boolean;
      maxSponsors: number | null;
      position: number;
      benefits: Array<{
        id: string;
        description: string;
        position: number;
      }>;
    }>;
  };
  lastSavedAt: string | null;
}
```

**Component Structure**:

- Split-screen layout (form left, preview right)
- Tab navigation:
  - Content (project info, description)
  - Sponsorship Tiers (add/edit/reorder tiers)
  - Media (logo, cover image)
  - Contact (email, phone)
- Auto-save indicator
- Preview panel with live updates
- Action buttons (Save, Publish, Settings)

---

#### `pages/proposals/show.tsx`

**Route**: `GET /proposals/:id`

**Props**:

```typescript
interface ProposalShowPageProps {
  proposal: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    projectName: string;
    projectDescription: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    contactEmail: string;
    contactPhone: string | null;
    status: "draft" | "published" | "archived";
    publishedAt: string | null;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
    tiers: Array<{
      id: string;
      name: string;
      price: number;
      currency: string;
      benefits: Array<{
        id: string;
        description: string;
      }>;
    }>;
  };
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
  }>;
}
```

**Component Structure**:

- Proposal summary card
- Status badge
- Quick stats (views, leads)
- Recent leads preview
- Action buttons (Edit, View Public, Export PDF)

---

#### `pages/proposals/settings.tsx`

**Route**: `GET /proposals/:id/settings`

**Props**:

```typescript
interface ProposalSettingsPageProps {
  proposal: {
    id: string;
    title: string;
    designSettings: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      logoPosition: "left" | "center" | "right";
      layout: "modern" | "classic" | "minimal";
    };
  };
  fontOptions: Array<{
    value: string;
    label: string;
  }>;
  layoutOptions: Array<{
    value: string;
    label: string;
    preview: string;
  }>;
}
```

**Component Structure**:

- Color pickers (primary, secondary)
- Font family selector
- Logo position selector
- Layout template selector with previews
- Reset to defaults button
- Save button

---

### Public Pages

#### `pages/public/proposal.tsx`

**Route**: `GET /p/:slug`

**Props**:

```typescript
interface PublicProposalPageProps {
  proposal: {
    title: string;
    description: string | null;
    projectName: string;
    projectDescription: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    contactEmail: string;
    designSettings: {
      primaryColor: string;
      secondaryColor: string;
      fontFamily: string;
      logoPosition: "left" | "center" | "right";
      layout: "modern" | "classic" | "minimal";
    };
    tiers: Array<{
      id: string;
      name: string;
      price: number;
      currency: string;
      description: string | null;
      isFeatured: boolean;
      benefits: Array<{
        id: string;
        description: string;
      }>;
    }>;
  };
}
```

**Component Structure**:

- Hero section with cover image
- Project information
- Sponsorship tiers grid/list
- Benefits for each tier
- Contact form (sticky or section)
- Footer with owner info

---

#### `pages/home.tsx`

**Route**: `GET /`

**Props**:

```typescript
interface HomePageProps {
  // Marketing content, can be static
}
```

**Component Structure**:

- Hero section
- Features overview
- How it works
- CTA to register/login

---

### Error Pages

#### `pages/errors/not-found.tsx`

**Props**: None

**Component Structure**:

- 404 message
- Link to home

#### `pages/errors/server-error.tsx`

**Props**:

```typescript
interface ServerErrorPageProps {
  error?: {
    message: string;
  };
}
```

**Component Structure**:

- Error message
- Retry button
- Link to home

---

## Component Organization

```
inertia/
├── pages/
│   ├── home.tsx
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── dashboard/
│   │   ├── index.tsx
│   │   └── leads.tsx
│   ├── proposals/
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   ├── show.tsx
│   │   └── settings.tsx
│   ├── public/
│   │   └── proposal.tsx
│   └── errors/
│       ├── not-found.tsx
│       └── server-error.tsx
├── components/
│   ├── ui/                    # Shadcn components
│   ├── layout/
│   │   ├── app-layout.tsx     # Authenticated layout
│   │   ├── guest-layout.tsx   # Auth pages layout
│   │   └── public-layout.tsx  # Public proposal layout
│   ├── proposals/
│   │   ├── proposal-form.tsx
│   │   ├── proposal-preview.tsx
│   │   ├── tier-card.tsx
│   │   ├── tier-form.tsx
│   │   └── benefit-list.tsx
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   └── proposal-card.tsx
│   └── leads/
│       ├── leads-table.tsx
│       └── lead-status-badge.tsx
└── hooks/
    ├── use-autosave.ts
    └── use-proposal-preview.ts
```

---

## Type Definitions

Create a shared types file for TypeScript:

```typescript
// inertia/types/index.ts

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface Proposal {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  projectName: string;
  projectDescription: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  contactEmail: string;
  contactPhone: string | null;
  status: ProposalStatus;
  publishedAt: string | null;
  viewCount: number;
  designSettings: DesignSettings;
  createdAt: string;
  updatedAt: string;
  tiers?: Tier[];
}

export type ProposalStatus = "draft" | "published" | "archived";

export interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoPosition: "left" | "center" | "right";
  layout: "modern" | "classic" | "minimal";
}

export interface Tier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  isFeatured: boolean;
  maxSponsors: number | null;
  position: number;
  benefits: Benefit[];
}

export interface Benefit {
  id: string;
  description: string;
  position: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  proposal?: Pick<Proposal, "id" | "title">;
  interestedTier?: Pick<Tier, "id" | "name"> | null;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "pending"
  | "converted"
  | "rejected";
```

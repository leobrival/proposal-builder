# Data Model: Sponseasy

**Feature**: 001-proposal-builder
**Date**: 2025-11-25
**Database**: PostgreSQL (Neon)

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│    User     │       │    Proposal     │       │    Tier     │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)         │──┐    │ id (PK)     │
│ email       │  │    │ user_id (FK)    │  │    │ proposal_id │
│ password    │  └───<│ title           │  └───<│ name        │
│ full_name   │       │ slug            │       │ price       │
│ created_at  │       │ description     │       │ position    │
│ updated_at  │       │ project_name    │       │ created_at  │
└─────────────┘       │ project_desc    │       │ updated_at  │
                      │ logo_url        │       └──────┬──────┘
                      │ cover_image_url │              │
                      │ contact_email   │              │
                      │ contact_phone   │       ┌──────┴──────┐
                      │ status          │       │   Benefit   │
                      │ published_at    │       ├─────────────┤
                      │ view_count      │       │ id (PK)     │
                      │ design_settings │       │ tier_id (FK)│
                      │ created_at      │       │ description │
                      │ updated_at      │       │ position    │
                      └────────┬────────┘       │ created_at  │
                               │                │ updated_at  │
                               │                └─────────────┘
                      ┌────────┴────────┐
                      │      Lead       │
                      ├─────────────────┤
                      │ id (PK)         │
                      │ proposal_id (FK)│
                      │ name            │
                      │ email           │
                      │ company         │
                      │ phone           │
                      │ message         │
                      │ status          │
                      │ created_at      │
                      │ updated_at      │
                      └─────────────────┘
```

## Entities

### User

The authenticated user who creates and manages sponsorship proposals.

| Field             | Type         | Constraints        | Description             |
| ----------------- | ------------ | ------------------ | ----------------------- |
| id                | UUID         | PK, auto-generated | Unique identifier       |
| email             | VARCHAR(255) | UNIQUE, NOT NULL   | Login email             |
| password          | VARCHAR(255) | NOT NULL           | Hashed password         |
| full_name         | VARCHAR(255) | NOT NULL           | Display name            |
| remember_me_token | VARCHAR(255) | NULL               | For persistent sessions |
| created_at        | TIMESTAMP    | NOT NULL           | Creation timestamp      |
| updated_at        | TIMESTAMP    | NOT NULL           | Last update timestamp   |

**Relationships**:

- Has many `Proposal`

**Indexes**:

- `users_email_unique` on `email`

---

### Proposal

A sponsorship deck containing project information, tiers, and design settings.

| Field               | Type         | Constraints                | Description                             |
| ------------------- | ------------ | -------------------------- | --------------------------------------- |
| id                  | UUID         | PK, auto-generated         | Unique identifier                       |
| user_id             | UUID         | FK → users.id, NOT NULL    | Owner of the proposal                   |
| title               | VARCHAR(255) | NOT NULL                   | Proposal title                          |
| slug                | VARCHAR(255) | UNIQUE, NOT NULL           | URL-friendly identifier                 |
| description         | TEXT         | NULL                       | Brief proposal description              |
| project_name        | VARCHAR(255) | NOT NULL                   | Name of the project seeking sponsorship |
| project_description | TEXT         | NULL                       | Detailed project description            |
| logo_url            | VARCHAR(500) | NULL                       | Project logo URL                        |
| cover_image_url     | VARCHAR(500) | NULL                       | Cover/hero image URL                    |
| contact_email       | VARCHAR(255) | NOT NULL                   | Contact email for inquiries             |
| contact_phone       | VARCHAR(50)  | NULL                       | Optional contact phone                  |
| status              | ENUM         | NOT NULL, default: 'draft' | draft, published, archived              |
| published_at        | TIMESTAMP    | NULL                       | When proposal was published             |
| view_count          | INTEGER      | NOT NULL, default: 0       | Total page views                        |
| design_settings     | JSONB        | NOT NULL, default: '{}'    | Design customization                    |
| created_at          | TIMESTAMP    | NOT NULL                   | Creation timestamp                      |
| updated_at          | TIMESTAMP    | NOT NULL                   | Last update timestamp                   |

**Relationships**:

- Belongs to `User`
- Has many `Tier`
- Has many `Lead`

**Indexes**:

- `proposals_user_id_index` on `user_id`
- `proposals_slug_unique` on `slug`
- `proposals_status_index` on `status`

**Design Settings JSON Schema**:

```json
{
  "primaryColor": "#3B82F6",
  "secondaryColor": "#1E40AF",
  "fontFamily": "Inter",
  "logoPosition": "left",
  "layout": "modern"
}
```

**Design Settings Zod Validation**:

```typescript
// app/validators/design_settings_validator.ts
import { z } from "zod";

// Hex color validation regex
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Available font families
const fontFamilies = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Sans Pro",
  "Playfair Display",
] as const;

// Logo positions
const logoPositions = ["left", "center", "right"] as const;

// Layout templates
const layouts = ["modern", "classic", "minimal"] as const;

export const designSettingsSchema = z.object({
  primaryColor: z
    .string()
    .regex(hexColorRegex, "Couleur primaire invalide (format: #RRGGBB)")
    .default("#3B82F6"),
  secondaryColor: z
    .string()
    .regex(hexColorRegex, "Couleur secondaire invalide (format: #RRGGBB)")
    .default("#1E40AF"),
  fontFamily: z
    .enum(fontFamilies, {
      errorMap: () => ({ message: "Police non supportée" }),
    })
    .default("Inter"),
  logoPosition: z
    .enum(logoPositions, {
      errorMap: () => ({ message: "Position du logo invalide" }),
    })
    .default("left"),
  layout: z
    .enum(layouts, {
      errorMap: () => ({ message: "Template de mise en page invalide" }),
    })
    .default("modern"),
});

export type DesignSettings = z.infer<typeof designSettingsSchema>;

// Default values for new proposals
export const defaultDesignSettings: DesignSettings = {
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  fontFamily: "Inter",
  logoPosition: "left",
  layout: "modern",
};

// Partial schema for updates (all fields optional)
export const designSettingsUpdateSchema = designSettingsSchema.partial();

export type DesignSettingsUpdate = z.infer<typeof designSettingsUpdateSchema>;
```

**Usage in AdonisJS Validator**:

```typescript
// app/validators/proposal_validator.ts
import vine from "@vinejs/vine";
import { designSettingsSchema } from "./design_settings_validator.js";

export const updateSettingsValidator = vine.compile(
  vine.object({
    designSettings: vine.object({
      primaryColor: vine
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .optional(),
      secondaryColor: vine
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .optional(),
      fontFamily: vine
        .enum([
          "Inter",
          "Roboto",
          "Open Sans",
          "Lato",
          "Montserrat",
          "Poppins",
          "Source Sans Pro",
          "Playfair Display",
        ])
        .optional(),
      logoPosition: vine.enum(["left", "center", "right"]).optional(),
      layout: vine.enum(["modern", "classic", "minimal"]).optional(),
    }),
  }),
);
```

**Frontend Zod Schema (React)**:

```typescript
// inertia/schemas/design-settings.ts
import { z } from "zod";

export const designSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Format de couleur invalide",
  }),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Format de couleur invalide",
  }),
  fontFamily: z.enum([
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Source Sans Pro",
    "Playfair Display",
  ]),
  logoPosition: z.enum(["left", "center", "right"]),
  layout: z.enum(["modern", "classic", "minimal"]),
});

export type DesignSettings = z.infer<typeof designSettingsSchema>;
```

---

### Tier

A sponsorship level with associated price and benefits.

| Field        | Type          | Constraints                 | Description                          |
| ------------ | ------------- | --------------------------- | ------------------------------------ |
| id           | UUID          | PK, auto-generated          | Unique identifier                    |
| proposal_id  | UUID          | FK → proposals.id, NOT NULL | Parent proposal                      |
| name         | VARCHAR(255)  | NOT NULL                    | Tier name (e.g., "Gold", "Silver")   |
| price        | DECIMAL(10,2) | NOT NULL                    | Price in default currency            |
| currency     | VARCHAR(3)    | NOT NULL, default: 'EUR'    | ISO currency code                    |
| description  | TEXT          | NULL                        | Optional tier description            |
| is_featured  | BOOLEAN       | NOT NULL, default: false    | Highlight this tier                  |
| max_sponsors | INTEGER       | NULL                        | Limit on sponsors (NULL = unlimited) |
| position     | INTEGER       | NOT NULL, default: 0        | Display order                        |
| created_at   | TIMESTAMP     | NOT NULL                    | Creation timestamp                   |
| updated_at   | TIMESTAMP     | NOT NULL                    | Last update timestamp                |

**Relationships**:

- Belongs to `Proposal`
- Has many `Benefit`

**Indexes**:

- `tiers_proposal_id_index` on `proposal_id`
- `tiers_position_index` on `proposal_id, position`

---

### Benefit

A specific benefit included in a sponsorship tier.

| Field       | Type         | Constraints             | Description           |
| ----------- | ------------ | ----------------------- | --------------------- |
| id          | UUID         | PK, auto-generated      | Unique identifier     |
| tier_id     | UUID         | FK → tiers.id, NOT NULL | Parent tier           |
| description | VARCHAR(500) | NOT NULL                | Benefit description   |
| position    | INTEGER      | NOT NULL, default: 0    | Display order         |
| created_at  | TIMESTAMP    | NOT NULL                | Creation timestamp    |
| updated_at  | TIMESTAMP    | NOT NULL                | Last update timestamp |

**Relationships**:

- Belongs to `Tier`

**Indexes**:

- `benefits_tier_id_index` on `tier_id`

---

### Lead

A potential sponsor who submitted the contact form on a published proposal.

| Field              | Type         | Constraints                 | Description                                  |
| ------------------ | ------------ | --------------------------- | -------------------------------------------- |
| id                 | UUID         | PK, auto-generated          | Unique identifier                            |
| proposal_id        | UUID         | FK → proposals.id, NOT NULL | Related proposal                             |
| name               | VARCHAR(255) | NOT NULL                    | Contact name                                 |
| email              | VARCHAR(255) | NOT NULL                    | Contact email                                |
| company            | VARCHAR(255) | NULL                        | Company name                                 |
| phone              | VARCHAR(50)  | NULL                        | Phone number                                 |
| message            | TEXT         | NULL                        | Inquiry message                              |
| interested_tier_id | UUID         | FK → tiers.id, NULL         | Tier they're interested in                   |
| status             | ENUM         | NOT NULL, default: 'new'    | new, contacted, pending, converted, rejected |
| notes              | TEXT         | NULL                        | Internal notes                               |
| created_at         | TIMESTAMP    | NOT NULL                    | Submission timestamp                         |
| updated_at         | TIMESTAMP    | NOT NULL                    | Last update timestamp                        |

**Relationships**:

- Belongs to `Proposal`
- Belongs to `Tier` (optional, via `interested_tier_id`)

**Indexes**:

- `leads_proposal_id_index` on `proposal_id`
- `leads_status_index` on `status`
- `leads_email_proposal_index` on `email, proposal_id` (for duplicate detection)

---

## Enums

### ProposalStatus

| Value     | Description                            |
| --------- | -------------------------------------- |
| draft     | Work in progress, not publicly visible |
| published | Live and accessible via public URL     |
| archived  | Hidden but preserved                   |

### LeadStatus

| Value     | Description                    |
| --------- | ------------------------------ |
| new       | Just submitted, not reviewed   |
| contacted | User has reached out           |
| pending   | In discussion                  |
| converted | Became a sponsor               |
| rejected  | Not interested or disqualified |

---

## Validation Rules

### User

- `email`: Valid email format, unique
- `password`: Minimum 8 characters
- `full_name`: 2-255 characters

### Proposal

- `title`: 3-255 characters
- `slug`: Auto-generated from title, URL-safe, unique
- `project_name`: 2-255 characters
- `contact_email`: Valid email format
- `status`: Must be valid enum value

### Tier

- `name`: 1-255 characters
- `price`: Positive decimal, max 2 decimal places
- `position`: Non-negative integer

### Benefit

- `description`: 1-500 characters
- `position`: Non-negative integer

### Lead

- `name`: 2-255 characters
- `email`: Valid email format
- `message`: Max 5000 characters
- `status`: Must be valid enum value

---

## State Transitions

### Proposal Status

```
┌─────────┐     publish      ┌───────────┐
│  draft  │─────────────────>│ published │
└─────────┘                  └───────────┘
     │                            │
     │         archive            │
     └──────────────┬─────────────┘
                    │
                    v
              ┌──────────┐
              │ archived │
              └──────────┘
                    │
                    │ restore (to draft)
                    v
              ┌─────────┐
              │  draft  │
              └─────────┘
```

### Lead Status

```
┌─────┐
│ new │
└──┬──┘
   │
   ├──────────> contacted ──────────> converted
   │                │
   │                └──────────────> rejected
   │
   └──────────> pending ───────────> converted
                   │
                   └───────────────> rejected
```

---

## AdonisJS Model Examples

### User Model

```typescript
// app/models/user.ts
import { DateTime } from "luxon";
import hash from "@adonisjs/core/services/hash";
import { compose } from "@adonisjs/core/helpers";
import { BaseModel, column, hasMany } from "@adonisjs/lucid/orm";
import { withAuthFinder } from "@adonisjs/auth/mixins/lucid";
import type { HasMany } from "@adonisjs/lucid/types/relations";
import Proposal from "./proposal.js";

const AuthFinder = withAuthFinder(() => hash.use("scrypt"), {
  uids: ["email"],
  passwordColumnName: "password",
});

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare email: string;

  @column({ serializeAs: null })
  declare password: string;

  @column()
  declare fullName: string;

  @column()
  declare rememberMeToken: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @hasMany(() => Proposal)
  declare proposals: HasMany<typeof Proposal>;
}
```

### Proposal Model

```typescript
// app/models/proposal.ts
import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
  beforeCreate,
} from "@adonisjs/lucid/orm";
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations";
import { randomUUID } from "node:crypto";
import string from "@adonisjs/core/helpers/string";
import User from "./user.js";
import Tier from "./tier.js";
import Lead from "./lead.js";

export default class Proposal extends BaseModel {
  @column({ isPrimary: true })
  declare id: string;

  @column()
  declare userId: string;

  @column()
  declare title: string;

  @column()
  declare slug: string;

  @column()
  declare description: string | null;

  @column()
  declare projectName: string;

  @column()
  declare projectDescription: string | null;

  @column()
  declare logoUrl: string | null;

  @column()
  declare coverImageUrl: string | null;

  @column()
  declare contactEmail: string;

  @column()
  declare contactPhone: string | null;

  @column()
  declare status: "draft" | "published" | "archived";

  @column.dateTime()
  declare publishedAt: DateTime | null;

  @column()
  declare viewCount: number;

  @column()
  declare designSettings: Record<string, unknown>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>;

  @hasMany(() => Tier)
  declare tiers: HasMany<typeof Tier>;

  @hasMany(() => Lead)
  declare leads: HasMany<typeof Lead>;

  @beforeCreate()
  static assignIdAndSlug(proposal: Proposal) {
    proposal.id = randomUUID();
    if (!proposal.slug) {
      proposal.slug =
        string.slug(proposal.title, { lower: true }) +
        "-" +
        randomUUID().slice(0, 8);
    }
  }
}
```

---

## Migration Order

1. `001_create_users_table.ts`
2. `002_create_proposals_table.ts`
3. `003_create_tiers_table.ts`
4. `004_create_benefits_table.ts`
5. `005_create_leads_table.ts`

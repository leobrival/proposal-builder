# Data Model: Admin Dashboard

**Feature Branch**: `002-admin-dashboard`
**Date**: 2025-11-26

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │   AdminAction   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │
│ fullName        │  │    │ adminId (FK)────┼──┐
│ email           │  │    │ action          │  │
│ password        │  │    │ targetType      │  │
│ role (NEW)      │  │    │ targetId        │  │
│ isActive (NEW)  │  │    │ metadata        │  │
│ createdAt       │  │    │ createdAt       │  │
│ updatedAt       │  │    └─────────────────┘  │
└─────────────────┘  │                         │
         │           └─────────────────────────┘
         │
         │ hasMany
         ▼
┌─────────────────┐       ┌─────────────────┐
│    Proposal     │──────▶│      Lead       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ userId (FK)     │       │ proposalId (FK) │
│ title           │       │ name            │
│ status          │       │ email           │
│ viewCount       │       │ status          │
│ publishedAt     │       │ createdAt       │
│ createdAt       │       └─────────────────┘
└─────────────────┘
         │
         │ hasMany
         ▼
┌─────────────────┐       ┌─────────────────┐
│      Tier       │──────▶│    Benefit      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ proposalId (FK) │       │ tierId (FK)     │
│ name            │       │ description     │
│ price           │       │ position        │
│ position        │       └─────────────────┘
└─────────────────┘
```

## Schema Changes

### 1. Users Table Modification

**Migration**: `XXXX_add_admin_fields_to_users.ts`

```typescript
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('role', ['user', 'admin']).defaultTo('user').notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()
      table.timestamp('last_login_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('role')
      table.dropColumn('is_active')
      table.dropColumn('last_login_at')
    })
  }
}
```

**Model Update**: `app/models/user.ts`

```typescript
// Add to existing User model

@column()
declare role: 'user' | 'admin'

@column()
declare isActive: boolean

@column.dateTime()
declare lastLoginAt: DateTime | null

// Helper method
get isAdmin(): boolean {
  return this.role === 'admin'
}
```

### 2. AdminAction Table (New)

**Migration**: `XXXX_create_admin_actions.ts`

```typescript
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'admin_actions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('admin_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('action', 50).notNullable()
      table.string('target_type', 50).notNullable()
      table.uuid('target_id').notNullable()
      table.jsonb('metadata').defaultTo('{}')
      table.string('ip_address', 45).nullable()
      table.text('user_agent').nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())

      // Indexes for querying
      table.index(['admin_id'])
      table.index(['target_type', 'target_id'])
      table.index(['action'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

**Model**: `app/models/admin_action.ts`

```typescript
import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import User from './user.js'

export default class AdminAction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare adminId: string

  @column()
  declare action: AdminActionType

  @column()
  declare targetType: 'user' | 'proposal' | 'lead'

  @column()
  declare targetId: string

  @column()
  declare metadata: Record<string, unknown>

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, { foreignKey: 'adminId' })
  declare admin: BelongsTo<typeof User>

  @beforeCreate()
  static assignId(action: AdminAction) {
    if (!action.id) {
      action.id = randomUUID()
    }
  }
}

export type AdminActionType =
  | 'user_view'
  | 'user_deactivate'
  | 'user_activate'
  | 'proposal_view'
  | 'proposal_unpublish'
  | 'proposal_delete'
  | 'dashboard_view'
```

### 3. Daily Metrics Table (New - for caching)

**Migration**: `XXXX_create_daily_metrics.ts`

```typescript
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'daily_metrics'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.date('date').notNullable().unique()
      
      // Acquisition
      table.integer('new_users').defaultTo(0)
      table.integer('total_users').defaultTo(0)
      
      // Activation
      table.integer('proposals_created').defaultTo(0)
      table.integer('proposals_published').defaultTo(0)
      table.integer('users_activated').defaultTo(0) // Users who published first proposal
      
      // Engagement
      table.integer('proposal_views').defaultTo(0)
      table.integer('leads_received').defaultTo(0)
      
      // Retention
      table.integer('daily_active_users').defaultTo(0)
      table.integer('weekly_active_users').defaultTo(0)
      table.integer('monthly_active_users').defaultTo(0)
      
      // Revenue (placeholder for Stripe integration)
      table.decimal('mrr', 10, 2).defaultTo(0)
      table.integer('paid_users').defaultTo(0)
      table.integer('churned_users').defaultTo(0)
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
```

**Model**: `app/models/daily_metric.ts`

```typescript
import { randomUUID } from 'node:crypto'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import type { DateTime } from 'luxon'

export default class DailyMetric extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare date: string // YYYY-MM-DD format

  // Acquisition
  @column()
  declare newUsers: number

  @column()
  declare totalUsers: number

  // Activation
  @column()
  declare proposalsCreated: number

  @column()
  declare proposalsPublished: number

  @column()
  declare usersActivated: number

  // Engagement
  @column()
  declare proposalViews: number

  @column()
  declare leadsReceived: number

  // Retention
  @column()
  declare dailyActiveUsers: number

  @column()
  declare weeklyActiveUsers: number

  @column()
  declare monthlyActiveUsers: number

  // Revenue
  @column()
  declare mrr: number

  @column()
  declare paidUsers: number

  @column()
  declare churnedUsers: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignId(metric: DailyMetric) {
    if (!metric.id) {
      metric.id = randomUUID()
    }
  }
}
```

## Validation Rules

### User Deactivation
- Cannot deactivate own account
- Must be admin role to perform action
- Audit log entry required

### Proposal Unpublish
- Only published proposals can be unpublished
- Must be admin role to perform action
- Audit log entry required
- Owner notification triggered

## State Transitions

### User States

```
                    ┌──────────────┐
                    │              │
        ┌──────────▶│   Active     │◀──────────┐
        │           │ (isActive=   │           │
        │           │    true)     │           │
        │           └──────┬───────┘           │
        │                  │                   │
  activate()          deactivate()        activate()
        │                  │                   │
        │                  ▼                   │
        │           ┌──────────────┐           │
        │           │              │           │
        └───────────│  Deactivated │───────────┘
                    │ (isActive=   │
                    │    false)    │
                    └──────────────┘
```

### Proposal States (existing)

```
   ┌──────────┐     publish()     ┌───────────┐
   │          │──────────────────▶│           │
   │  Draft   │                   │ Published │
   │          │◀──────────────────│           │
   └──────────┘    unpublish()    └───────────┘
        │                              │
        │         archive()            │
        ▼                              ▼
   ┌──────────────────────────────────────┐
   │               Archived               │
   └──────────────────────────────────────┘
```

## Indexes

### Performance Indexes

```sql
-- Users table
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Proposals table (existing, verify)
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_user_id ON proposals(user_id);
CREATE INDEX idx_proposals_created_at ON proposals(created_at);

-- Admin actions
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at);

-- Daily metrics
CREATE UNIQUE INDEX idx_daily_metrics_date ON daily_metrics(date);
```

## Computed Metrics (Service Layer)

These metrics are calculated in `MetricsService`, not stored:

| Metric | Formula | Source |
|--------|---------|--------|
| Activation Rate | `users_with_published_proposal / total_users * 100` | Users + Proposals |
| Week 1 Retention | `users_active_in_week_1 / cohort_size * 100` | User activity |
| DAU/MAU | `daily_active_users / monthly_active_users * 100` | Daily metrics |
| Publishing Rate | `proposals_published / proposals_created * 100` | Proposals |
| Lead Conversion | `leads_received / proposal_views * 100` | Leads + Views |
| Free-to-Paid | `paid_users / total_users * 100` | Users (future) |
| MRR Growth | `(current_mrr - previous_mrr) / previous_mrr * 100` | Daily metrics |

## Sample Queries

### Dashboard Overview

```typescript
// Get today's key metrics
const today = DateTime.now().toFormat('yyyy-MM-dd')
const metrics = await DailyMetric.findBy('date', today)

// Get trend for last 7 days
const sevenDaysAgo = DateTime.now().minus({ days: 7 }).toFormat('yyyy-MM-dd')
const trend = await DailyMetric.query()
  .where('date', '>=', sevenDaysAgo)
  .orderBy('date', 'asc')
```

### User Management

```typescript
// Paginated user list with proposal count
const users = await User.query()
  .select('users.*')
  .withCount('proposals')
  .orderBy('created_at', 'desc')
  .paginate(page, 20)

// Search users
const results = await User.query()
  .where('email', 'ilike', `%${search}%`)
  .orWhere('full_name', 'ilike', `%${search}%`)
  .limit(20)
```

### Audit Log

```typescript
// Get admin actions for a user
const actions = await AdminAction.query()
  .where('target_type', 'user')
  .where('target_id', userId)
  .preload('admin')
  .orderBy('created_at', 'desc')
```

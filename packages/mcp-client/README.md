# @spons-easy/mcp-client

MCP (Model Context Protocol) client for Spons Easy API. Manage sponsorship proposals with AI assistants like Claude.

## Features

- Full TypeScript support with complete type definitions
- Works with Claude Desktop via MCP
- Standalone API client for programmatic use
- No rate limiting - MCP accessible by all plans
- Plan-based proposal limits (2 free, 50 pro, unlimited enterprise)

## Installation

```bash
npm install @spons-easy/mcp-client
# or
pnpm add @spons-easy/mcp-client
# or
yarn add @spons-easy/mcp-client
```

## Quick Start

### As an API Client

```typescript
import { createClient } from '@spons-easy/mcp-client'

const client = createClient({
  apiKey: 'sk_your_api_key',
})

// List proposals
const { proposals } = await client.listProposals()
console.log(proposals)

// Create a proposal
const proposal = await client.createProposal({
  title: 'Tech Conference 2025 Sponsorship',
  projectName: 'Tech Conference 2025',
  eventStartDate: '2025-06-15',
  eventCity: 'Paris',
})

// Check your limits
const limits = await client.getLimits()
console.log(`Proposals: ${limits.proposals.current}/${limits.proposals.limit}`)

// Publish when ready
await client.publishProposal(proposal.id)
```

### With Claude Desktop (MCP)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "spons-easy": {
      "command": "npx",
      "args": ["@spons-easy/mcp-client", "serve"],
      "env": {
        "SPONS_EASY_API_KEY": "sk_your_api_key"
      }
    }
  }
}
```

Then in Claude, you can say:

- "List my sponsorship proposals"
- "Create a new proposal for Tech Conference 2025"
- "Publish my proposal"
- "Show my plan limits"

## API Reference

### Client Methods

#### Proposals

```typescript
// List all proposals
client.listProposals(options?: {
  status?: 'draft' | 'published' | 'archived';
  limit?: number;
  offset?: number;
})

// Get a specific proposal
client.getProposal(id: string)

// Create a proposal
client.createProposal({
  title: string;
  description?: string;
  projectName?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventVenueName?: string;
  eventCity?: string;
})

// Update a proposal
client.updateProposal(id: string, updates: UpdateProposalInput)

// Delete a proposal
client.deleteProposal(id: string)

// Publish a proposal
client.publishProposal(id: string)

// Unpublish a proposal
client.unpublishProposal(id: string)
```

#### User & Limits

```typescript
// Get current user with plan info
client.getUser()

// Get plan limits and usage
client.getLimits()
```

#### MCP Tools

```typescript
// List available MCP tools
client.listTools()

// Execute a raw tool
client.executeTool<T>(name: string, input?: object)
```

### Error Handling

```typescript
import { SponsEasyError } from '@spons-easy/mcp-client'

try {
  await client.createProposal({ title: 'New Proposal' })
} catch (error) {
  if (error instanceof SponsEasyError) {
    if (error.isLimitExceeded()) {
      console.log('Upgrade your plan to create more proposals')
    } else if (error.isAuthError()) {
      console.log('Check your API key')
    } else if (error.isPermissionError()) {
      console.log('Feature not available on your plan')
    }
  }
}
```

## Plan Limits

| Plan       | Proposals | API Keys | Custom Domains |
| ---------- | --------- | -------- | -------------- |
| Free       | 2         | 1        | 0              |
| Pro        | 50        | 5        | 1              |
| Enterprise | Unlimited | 20       | Unlimited      |

All plans have access to MCP - no rate limiting!

## MCP Tools Available

When using with Claude Desktop, the following tools are available:

- `spons_easy_list_proposals` - List all proposals
- `spons_easy_get_proposal` - Get proposal details
- `spons_easy_create_proposal` - Create a new proposal
- `spons_easy_update_proposal` - Update a proposal
- `spons_easy_delete_proposal` - Delete a proposal
- `spons_easy_publish_proposal` - Publish a proposal
- `spons_easy_unpublish_proposal` - Unpublish a proposal
- `spons_easy_get_limits` - Get plan limits
- `spons_easy_get_user` - Get user info

## Configuration

```typescript
interface SponsEasyConfig {
  // Required: Your API key (starts with sk_)
  apiKey: string

  // Optional: Custom API base URL
  baseUrl?: string // Default: https://api.sponseasy.com

  // Optional: Request timeout in ms
  timeout?: number // Default: 30000

  // Optional: Custom fetch implementation
  fetch?: typeof fetch
}
```

## Environment Variables

For the MCP server:

- `SPONS_EASY_API_KEY` - Your API key (required)
- `SPONS_EASY_BASE_URL` - Custom API URL (optional)

## Getting an API Key

1. Log in to your Spons Easy account at https://sponseasy.com
2. Go to Settings > API Keys
3. Create a new API key with a descriptive name
4. Copy the key (it won't be shown again!)

## License

MIT - see [LICENSE](./LICENSE)

## Links

- [Spons Easy](https://sponseasy.com)
- [Documentation](https://sponseasy.com/docs/mcp)
- [GitHub](https://github.com/spons-easy/mcp-client)

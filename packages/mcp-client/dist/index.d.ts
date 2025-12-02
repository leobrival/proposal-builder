/**
 * @spons-easy/mcp-client
 * MCP (Model Context Protocol) client for Spons Easy API
 * MCP is accessible by ALL plans - no rate limiting.
 *
 * @example
 * ```typescript
 * import { createClient } from '@spons-easy/mcp-client';
 *
 * const client = createClient({
 *   apiKey: 'sk_your_api_key',
 * });
 *
 * // List proposals
 * const { proposals } = await client.listProposals();
 *
 * // Create a proposal (limited by plan: 2 free, 50 pro, unlimited enterprise)
 * const proposal = await client.createProposal({
 *   title: 'My Sponsorship Proposal',
 *   projectName: 'Tech Conference 2025',
 * });
 *
 * // Check your limits
 * const limits = await client.getLimits();
 * console.log(`Proposals: ${limits.proposals.current}/${limits.proposals.limit}`);
 *
 * // Publish
 * await client.publishProposal(proposal.id);
 * ```
 */
export { createClient, SponsEasyClient, SponsEasyError } from "./client.js";
export type { McpServerConfig } from "./mcp-server.js";
export { createMcpServer, runMcpServer, SponsEasyMcpServer, } from "./mcp-server.js";
export type { AnalyticsOptions, AnalyticsPeriod, AnalyticsResponse, ApiError, CreateProposalInput, EventFormat, LimitExceededError, ListProposalsOptions, ListProposalsResponse, McpTool, Pagination, PlanFeatures, PlanLimits, PlanType, Proposal, ProposalStatus, SponsEasyConfig, ToolResult, UpdateProposalInput, User, UserLimitsResponse, } from "./types.js";
//# sourceMappingURL=index.d.ts.map
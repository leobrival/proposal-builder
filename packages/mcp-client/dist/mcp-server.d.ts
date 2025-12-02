/**
 * Spons Easy MCP Server
 * Model Context Protocol server for Claude and other AI assistants.
 * MCP is accessible by ALL plans - no rate limiting.
 *
 * Usage with Claude Desktop:
 * Add to your claude_desktop_config.json:
 * {
 *   "mcpServers": {
 *     "spons-easy": {
 *       "command": "npx",
 *       "args": ["@spons-easy/mcp-client", "serve"],
 *       "env": {
 *         "SPONS_EASY_API_KEY": "sk_your_api_key"
 *       }
 *     }
 *   }
 * }
 */
/**
 * MCP Server configuration
 */
export interface McpServerConfig {
    apiKey: string;
    baseUrl?: string;
}
/**
 * MCP Tool call
 */
interface ToolCall {
    name: string;
    arguments: Record<string, unknown>;
}
/**
 * MCP Tool result
 */
interface ToolCallResult {
    content: Array<{
        type: "text";
        text: string;
    }>;
    isError?: boolean;
}
/**
 * Spons Easy MCP Server
 * Implements the Model Context Protocol for AI assistant integration.
 */
export declare class SponsEasyMcpServer {
    private client;
    constructor(config: McpServerConfig);
    /**
     * Get available tools for MCP
     */
    getTools(): ({
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                status: {
                    type: string;
                    enum: string[];
                    description: string;
                };
                limit: {
                    type: string;
                    description: string;
                };
                offset: {
                    type: string;
                    description: string;
                };
                id?: undefined;
                title?: undefined;
                description?: undefined;
                projectName?: undefined;
                eventStartDate?: undefined;
                eventEndDate?: undefined;
                eventVenueName?: undefined;
                eventCity?: undefined;
            };
            required?: undefined;
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                status?: undefined;
                limit?: undefined;
                offset?: undefined;
                title?: undefined;
                description?: undefined;
                projectName?: undefined;
                eventStartDate?: undefined;
                eventEndDate?: undefined;
                eventVenueName?: undefined;
                eventCity?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                title: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                projectName: {
                    type: string;
                    description: string;
                };
                eventStartDate: {
                    type: string;
                    description: string;
                };
                eventEndDate: {
                    type: string;
                    description: string;
                };
                eventVenueName: {
                    type: string;
                    description: string;
                };
                eventCity: {
                    type: string;
                    description: string;
                };
                status?: undefined;
                limit?: undefined;
                offset?: undefined;
                id?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                id: {
                    type: string;
                    description: string;
                };
                title: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                projectName: {
                    type: string;
                    description: string;
                };
                eventStartDate: {
                    type: string;
                    description: string;
                };
                eventEndDate: {
                    type: string;
                    description: string;
                };
                status?: undefined;
                limit?: undefined;
                offset?: undefined;
                eventVenueName?: undefined;
                eventCity?: undefined;
            };
            required: string[];
        };
    } | {
        name: string;
        description: string;
        inputSchema: {
            type: "object";
            properties: {
                status?: undefined;
                limit?: undefined;
                offset?: undefined;
                id?: undefined;
                title?: undefined;
                description?: undefined;
                projectName?: undefined;
                eventStartDate?: undefined;
                eventEndDate?: undefined;
                eventVenueName?: undefined;
                eventCity?: undefined;
            };
            required?: undefined;
        };
    })[];
    /**
     * Handle a tool call
     */
    handleToolCall(call: ToolCall): Promise<ToolCallResult>;
    /**
     * Create a success response
     */
    private success;
    /**
     * Create an error response
     */
    private error;
}
/**
 * Create and run the MCP server
 * This is the entry point for running as a standalone MCP server.
 */
export declare function runMcpServer(): Promise<void>;
/**
 * Create an MCP server instance
 */
export declare function createMcpServer(config: McpServerConfig): SponsEasyMcpServer;
export {};
//# sourceMappingURL=mcp-server.d.ts.map
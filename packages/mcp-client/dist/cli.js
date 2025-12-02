#!/usr/bin/env node
/**
 * Spons Easy MCP CLI
 * Command-line interface for running the MCP server.
 */
import { runMcpServer } from "./mcp-server.js";
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Spons Easy MCP Client

Usage:
  spons-easy-mcp serve    Start the MCP server for Claude Desktop
  spons-easy-mcp --help   Show this help message

Environment Variables:
  SPONS_EASY_API_KEY     Your Spons Easy API key (required)
  SPONS_EASY_BASE_URL    Custom API base URL (optional)

Claude Desktop Configuration:
  Add to your claude_desktop_config.json:

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

For more information, visit: https://sponseasy.com/docs/mcp
`);
    process.exit(0);
}
if (args[0] === "serve") {
    runMcpServer().catch((error) => {
        console.error("Failed to start MCP server:", error);
        process.exit(1);
    });
}
else {
    console.error('Unknown command. Use "spons-easy-mcp --help" for usage.');
    process.exit(1);
}
//# sourceMappingURL=cli.js.map
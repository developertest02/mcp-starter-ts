import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist/client")));

// Create a map to store tool handlers
const toolHandlers = new Map();

// MCP server setup
const mcpServer = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

// Define MCP tools with explicit return types
const echoHandler = async ({ random_string }: { random_string: string }) => ({
  content: [
    {
      type: "text" as const,
      text: "hello from tool",
    },
  ],
});

const addHandler = async ({ a, b }: { a: number; b: number }) => ({
  content: [
    {
      type: "text" as const,
      text: String(a + b),
    },
  ],
});

const bigdogsHandler = ({ snarf }: { snarf: string }) => ({
  messages: [
    {
      role: "user" as const,
      content: {
        type: "text" as const,
        text: `Please review this code:\n\n${snarf}`,
      },
    },
  ],
});

// Register tools with the MCP server
mcpServer.tool("echo", { random_string: z.string() }, async (args, extra) =>
  echoHandler(args)
);

mcpServer.tool("add", { a: z.number(), b: z.number() }, async (args, extra) =>
  addHandler(args)
);

mcpServer.prompt("getmy-bigdogs", { snarf: z.string() }, (args, extra) =>
  bigdogsHandler(args)
);

// Store handlers for direct access
toolHandlers.set("echo", echoHandler);
toolHandlers.set("add", addHandler);
toolHandlers.set("getmy-bigdogs", bigdogsHandler);

// API endpoint to handle MCP tool requests
app.post("/api/mcp/:tool", async (req, res) => {
  const { tool } = req.params;
  const params = req.body;

  try {
    const handler = toolHandlers.get(tool);
    if (!handler) {
      throw new Error(`Tool '${tool}' not found`);
    }
    const result = await handler(params);
    res.json(result);
  } catch (error) {
    console.error("Error executing MCP tool:", error);
    res.status(500).json({ error: "Failed to execute MCP tool" });
  }
});

// Serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/client/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

# Scenario.com MCP Server

This is a Model Context Protocol (MCP) server for the Scenario.com API.
It provides comprehensive access to Scenario's generative AI tools, including text-to-image, image-to-image, inpainting, controlnet, model training, and asset management.

## Features

- **Complete API Coverage**: Wraps over 100 API endpoints from Scenario.com.
- **Generative Tools**: Create images, upscale, remove backgrounds, train models, and more.
- **Asset Management**: List, delete, and manage assets and collections.

## Installation

### Prerequisites

- Node.js (v18 or higher)
- A Scenario.com API Key and Secret (Get them from your [Scenario Dashboard](https://app.scenario.com/))

### Install from Source

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the server:
   ```bash
   npm run build
   ```

## Configuration

**No configuration needed!** 

Just install and run. You'll configure credentials once per session using the `set-credentials` tool (see Usage below).

## Usage

### Quick Start (Recommended)

**Step 1:** Add to your MCP client config:

```json
{
  "mcpServers": {
    "scenario": {
      "command": "npx",
      "args": ["-y", "scenario.com-mcp-server"]
    }
  }
}
```

**Step 2:** In your MCP client (Claude, Cline, etc.), run the setup:

```
Use the set-credentials tool with my Scenario.com API key and secret:
API Key: api_your_actual_key_here
API Secret: your_actual_secret_here
```

**That's it!** Credentials are stored for the session. You only need to do this once per session.

### Alternative: Environment Variables (Optional)

You can still use environment variables if you prefer:

```json
{
  "mcpServers": {
    "scenario": {
      "command": "npx",
      "args": ["-y", "scenario.com-mcp-server"],
      "env": {
        "SCENARIO_API_KEY": "your_key",
        "SCENARIO_API_SECRET": "your_secret"
      }
    }
  }
}
```

**But this is optional** - the session-based approach (using `set-credentials`) is simpler and works around MCP client bugs.

### Running Locally

```json
{
  "mcpServers": {
    "scenario": {
      "command": "node",
      "args": ["/path/to/scenario.com-mcp-server/dist/index.js"]
    }
  }
}
```

Then use `set-credentials` tool in your MCP client to configure API access.

## Tools

### Setup Tools

- **`set-credentials`**: Configure your API credentials (call this first!)
- **`get-credentials-status`**: Check if credentials are configured

### Generation Tools

- `post-txt2img-inferences`: Generate images from text
- `post-img2img-inferences`: Generate images from an image
- `post-remove-background-inferences`: Remove background from an image
- `post-upscale-inferences`: Upscale images
- And 70+ more tools for model training, asset management, and more!

(See `src/generated-tools.ts` or use the `list_tools` MCP capability to see the full list.)

## Development

- **Re-generate Tools**: If the Swagger file changes, run `node scripts/generate_tools.js` to update `src/generated-tools.ts`.
- **Build**: `npm run build`
- **Watch**: `npm run watch`

## License

ISC
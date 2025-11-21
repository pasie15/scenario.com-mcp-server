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

You must provide your Scenario API credentials via environment variables.

Create a `.env` file in the root directory (or ensure these are set in your environment):

```env
SCENARIO_API_KEY=your_api_key
SCENARIO_API_SECRET=your_api_secret
```

## Usage

### Running Locally (Stdio)

To use this server with an MCP client (like Claude Desktop or Cline):

Add the following to your MCP settings file:

```json
{
  "mcpServers": {
    "scenario": {
      "command": "node",
      "args": ["/path/to/scenario.com-mcp-server/dist/index.js"],
      "env": {
        "SCENARIO_API_KEY": "your_key",
        "SCENARIO_API_SECRET": "your_secret"
      }
    }
  }
}
```

## Tools

This server exposes tools for almost every operation in the Scenario API. 
Common tools include:

- `post-txt2img-inferences`: Generate images from text.
- `post-img2img-inferences`: Generate images from an image.
- `post-remove-background-inferences`: Remove background from an image.
- `get-assets`: List your generated assets.
- `get-models`: List available models.

(See `src/generated-tools.ts` or use the `list_tools` MCP capability to see the full list.)

## Development

- **Re-generate Tools**: If the Swagger file changes, run `node scripts/generate_tools.js` to update `src/generated-tools.ts`.
- **Build**: `npm run build`
- **Watch**: `npm run watch`

## License

ISC
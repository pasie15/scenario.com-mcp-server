# Scenario.com MCP Server

MCP server providing access to Scenario.com's generative AI API - text-to-image, image-to-image, model training, upscaling, and 70+ other tools.

## Installation

Add to your MCP client config:

```json
{
  "mcpServers": {
    "scenario": {
      "command": "npx",
      "args": ["-y", "scenario.com-mcp-server"],
      "env": {
        "SCENARIO_API_KEY": "your_api_key_here",
        "SCENARIO_API_SECRET": "your_api_secret_here"
      }
    }
  }
}
```

Get your API credentials from [https://app.scenario.com/](https://app.scenario.com/) → Settings → API Keys

## Alternative: Session-based Credentials

Don't want to use env vars? Just use:

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

Then in your MCP client:
```
Use set-credentials with API key api_xxx and secret yyy
```

## Available Tools

**Setup:**
- `set-credentials` - Configure API access for session
- `get-credentials-status` - Check credential status

**Image Generation:**
- `post-txt2img-inferences` - Generate from text
- `post-img2img-inferences` - Generate from image
- `post-controlnet-inferences` - ControlNet generation
- `post-inpaint-inferences` - Inpainting
- `post-upscale-inferences` - Upscale images
- `post-remove-background-inferences` - Remove backgrounds

**Asset Management:**
- `get-assets` - List assets
- `delete-asset` - Delete assets
- `get-models` - List models

**Model Training:**
- `post-models` - Create model
- `put-models-train-by-model-id` - Train model
- `post-models-training-images-by-model-id` - Add training images

...and 60+ more tools. Use `list_tools` to see all.

## License

ISC

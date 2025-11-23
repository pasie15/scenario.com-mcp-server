# Troubleshooting Scenario.com MCP Server

## Common Issues and Solutions

### 400/403 Authentication Errors

If you're getting 400 or 403 errors, the MCP server cannot authenticate with Scenario.com API.

#### Check 1: Verify Your Credentials

Make sure you're using your **actual** API credentials, not placeholder values:

**❌ WRONG:**
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

**✅ CORRECT:**
```json
{
  "mcpServers": {
    "scenario": {
      "command": "npx",
      "args": ["-y", "scenario.com-mcp-server"],
      "env": {
        "SCENARIO_API_KEY": "api_mkhg2tuw84fqgbsdoSkZPAdJ",
        "SCENARIO_API_SECRET": "DKwKFnw4hcofBH2K3ifPX296"
      }
    }
  }
}
```

#### Check 2: Get Your API Credentials

1. Go to [https://scenario.com](https://scenario.com)
2. Log in to your account
3. Navigate to **Settings** → **API Keys**
4. Create a new API key if you don't have one
5. Copy both the **API Key** and **API Secret**

#### Check 3: Verify Configuration File Location

The configuration file location depends on your MCP client:

- **Claude Desktop (Windows)**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Claude Desktop (Mac)**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Cline/VSCode**: `.vscode/settings.json` or Cline's MCP settings UI

#### Check 4: Restart Your MCP Client

After updating the configuration:
1. Save the configuration file
2. **Completely close** your MCP client (Claude Desktop/Cline/etc.)
3. Reopen it
4. Try using the Scenario tools again

### Empty Responses

If tool calls return `{}` empty responses:

1. Check the MCP client logs for error messages
2. Verify the server is starting correctly
3. With improved error handling (v1.0.2+), errors should now be visible

### Testing the Server Manually

You can test if the server works with your credentials:

```powershell
# Windows PowerShell
$env:SCENARIO_API_KEY="api_mkhg2tuw84fqgbsdoSkZPAdJ"
$env:SCENARIO_API_SECRET="DKwKFnw4hcofBH2K3ifPX296"
npx -y scenario.com-mcp-server
```

Then send a test message:
```json
{"jsonrpc":"2.0","id":1,"method":"tools/list"}
```

You should see a list of 74 available tools.

### Common Configuration Mistakes

1. **Using quotes inside quotes**: Make sure your JSON is valid
2. **Trailing commas**: Remove any trailing commas in JSON
3. **Special characters**: If your API key/secret has special characters, they should work fine in JSON strings
4. **Environment variables not loading**: Make sure to restart the MCP client after config changes

## Getting Help

If you're still having issues:

1. Check the MCP client logs
2. Verify your API credentials on Scenario.com
3. Ensure you have an active Scenario.com subscription
4. Try the manual test above to isolate the issue
5. Open an issue on GitHub with:
   - Your MCP client (Claude Desktop, Cline, etc.)
   - Error messages from logs
   - Configuration structure (WITHOUT your actual API keys!)

## Version History

- **v1.0.2**: Added comprehensive error handling to expose API errors
- **v1.0.1**: Fixed extended thinking compatibility
- **v1.0.0**: Initial release

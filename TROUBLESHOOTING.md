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

### Using the Diagnostic Tool (v1.0.4+)

**RECOMMENDED**: Use the built-in diagnostic tool to check if your credentials are configured:

1. In your MCP client (Claude Desktop, Cline, etc.), ask it to use the `diagnose-credentials` tool
2. This will return a report showing:
   - Whether credentials are present
   - If you're using placeholder values
   - The first 4 characters of your credentials (to verify they're correct)
   - Environment information

**Example**: Just ask Claude: "Use the diagnose-credentials tool to check my Scenario API configuration"

The diagnostic will show something like:
```json
{
  "credentials_status": {
    "api_key": {
      "present": true,
      "length": 33,
      "starts_with": "api_...",
      "is_placeholder": false
    },
    "api_secret": {
      "present": true,
      "length": 24,
      "starts_with": "DKwK...",
      "is_placeholder": false
    }
  },
  "verdict": "PASSED: Credentials appear to be configured correctly"
}
```

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

You should see a list of 75 available tools (including diagnose-credentials).

### Common Configuration Mistakes

1. **Using quotes inside quotes**: Make sure your JSON is valid
2. **Trailing commas**: Remove any trailing commas in JSON
3. **Special characters**: If your API key/secret has special characters, they should work fine in JSON strings
4. **Environment variables not loading**: Make sure to restart the MCP client after config changes
5. **npx cache issues**: Try clearing npx cache: `npx clear-npx-cache` or use `npx -y scenario.com-mcp-server@latest`
6. **MCP client bugs**: Some MCP clients have issues passing environment variables - try the diagnostic tool first

### Known Issues

#### MCP Client Not Passing Environment Variables

Some MCP clients have bugs where environment variables aren't passed correctly to spawned processes:

**Workaround for Claude Desktop on Windows**:
1. Set environment variables globally in Windows:
   - Press Win + X → System → Advanced system settings
   - Click "Environment Variables"
   - Add `SCENARIO_API_KEY` and `SCENARIO_API_SECRET` as User variables
2. Restart Claude Desktop completely
3. Remove the `env` section from your config:
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

**Workaround for other MCP clients**:
Try running the server locally instead of via npx:
1. Install globally: `npm install -g scenario.com-mcp-server`
2. Set env vars in your shell startup file (`.bashrc`, `.zshrc`, etc.)
3. Update config to use the global installation

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

- **v1.0.4**: Added `diagnose-credentials` diagnostic tool
- **v1.0.3**: Improved error messages and troubleshooting guide
- **v1.0.2**: Added comprehensive error handling to expose API errors
- **v1.0.1**: Fixed extended thinking compatibility
- **v1.0.0**: Initial release

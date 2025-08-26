# Amanahfy AI MCP Server

A production-ready Model Context Protocol (MCP) server that provides AI tools & resources with access to Amanahfy APIs & services. Built with TypeScript and following clean architecture principles.

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)

## 🚀 Features

- **Dual Transport Support**: STDIO (Claude Desktop) and HTTP (testing/development)
- **Clean Architecture**: 5-layer architecture with separation of concerns
- **CLI Tools**: Command-line interface for direct API testing
- **Resource Access**: URI-based resource references (`campaign://slug`, `ip://address`)
- **Type Safety**: Full TypeScript implementation with Zod validation

## 📋 Prerequisites

- **Node.js** (>=18.0.0): [Download](https://nodejs.org/)
- **Git**: For version control
- **Claude Desktop**: For MCP integration (Optional)

## ⚡ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd amanahfy-ai-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Claude Desktop Integration

Add to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
    "mcpServers": {
        "amanahfy-ai-mcp": {
            "command": "node",
            "args": [
                "C:\\path\\to\\campaign-agent-mcp-server\\dist\\index.js"
            ],
            "env": {
                "TRANSPORT_MODE": "stdio"
            }
        }
    }
}
```

### 3. Test the Connection

Restart Claude Desktop completely, then ask Claude:
- *"Look up the campaign gaza-100k-in-72hrs"*
- *"What's the location of IP 8.8.8.8?"*

## 💻 CLI Usage

Test functionality directly from the command line:

### Campaign Commands

```bash
# Get campaign details
npm run cli -- get-campaign-details gaza-100k-in-72hrs

# With custom options
npm run cli -- get-campaign-details gaza-100k-in-72hrs --timeout 5000 --retries 1
```

## 🏗️ Architecture

The server follows a clean 5-layer architecture:

```
├── CLI Layer (src/cli/)           # Command-line interfaces
├── Tools Layer (src/tools/)       # MCP tool definitions
├── Resources Layer (src/resources/) # MCP resource handlers
├── Controllers Layer (src/controllers/) # Business logic
├── Services Layer (src/services/) # External API integration
└── Utils Layer (src/utils/)       # Shared utilities
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Transport Configuration
TRANSPORT_MODE=stdio
PORT=8000
DEBUG=false
NODE_ENV=production

# API Configuration
AMANAHFY_API_BASE=https://api.amanahfy.com/api

# Optional API Keys
# IPAPI_API_TOKEN=your_api_token_here
```

### Available Scripts

```bash
# Development
npm run build          # Compile TypeScript
npm run dev:stdio      # Run in STDIO mode with debug
npm run dev:http       # Run in HTTP mode with debug

# MCP Server Modes
npm run mcp:stdio      # STDIO transport (for Claude Desktop)
npm run mcp:http       # HTTP transport (for testing)

# Testing & Development
npm run cli            # CLI mode
npm run test           # Run tests
npm run lint           # Run ESLint
npm run format         # Format with Prettier

# Debugging
npm run mcp:inspect    # Launch with MCP Inspector
```

## 🧪 Testing & Development

### MCP Inspector (Recommended)

Test your MCP server with the official inspector:

```bash
# Launch server with inspector
npm run mcp:inspect

# Then open: http://localhost:3000/mcp
```

### Manual Testing

```bash
# Test HTTP mode
npm run mcp:http

# Test specific endpoints
curl http://localhost:8000/mcp
```

### CLI Testing

```bash
# Test campaign lookup
npm run cli -- get-campaign-details gaza-100k-in-72hrs

# Test IP lookup
npm run cli -- get-ip-details 8.8.8.8
```

## 🔧 Troubleshooting

### Common Issues

1. **"Not valid JSON" error**
   - Ensure no console output is interfering with STDIO mode
   - Check that `TRANSPORT_MODE=stdio` in Claude Desktop config

2. **Module not found errors**
   - Run `npm run build` after any code changes
   - Verify all dependencies are installed: `npm install`

3. **API timeout errors**
   - Check network connectivity
   - Increase timeout values in tool parameters
   - Verify API endpoints are accessible

4. **Claude Desktop connection issues**
   - Use absolute paths in config
   - Restart Claude Desktop completely after config changes
   - Check Claude Desktop logs for detailed error messages

### Debug Mode

Enable detailed logging:

```env
DEBUG=true
NODE_ENV=development
```
---

**Need help?** Open an issue or check the troubleshooting section above.

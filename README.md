# Grey Hack MCP Server

A Model Context Protocol (MCP) server for Grey Hack game development, designed to work with Cursor IDE and other MCP-compatible tools.

## Features

- **GitHub Code Search**: Find Grey Hack code examples from GitHub repositories
- **Greybel-JS Transpilation**: Convert GreyScript to JavaScript
- **GreyScript API Validation**: Validate code against the official Grey Hack API
- **Script Generation**: Generate template scripts for common game tasks

## Installation

### Prerequisites

- Node.js 18+ installed
- Cursor IDE or another MCP-compatible editor
- GitHub API token (for code search functionality)

### Install from NPM

```bash
npm install -g @chromewillow/greyhack-mcp-server
```

### Manual Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/chromewillow/greyhack-mcp-server.git
cd greyhack-mcp-server
npm install
npm run build
```

## Usage with Cursor IDE

### Using Configuration File

Create a `.cursor/mcp.json` file in your workspace with the following content:

```json
{
  "mcpServers": {
    "@greyhack-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@chromewillow/greyhack-mcp-server",
        "--config",
        "{\"GITHUB_TOKEN\":\"your-github-token-here\"}"
      ]
    }
  }
}
```

### Manual Configuration in Cursor

1. Open Cursor settings (Cmd/Ctrl + ,)
2. Navigate to Features → MCP
3. Click "+ Add New MCP Server"
4. Enter the following details:
   - Name: `greyhack-mcp-server`
   - Command: `npx`
   - Arguments: `-y @smithery/cli@latest run @chromewillow/greyhack-mcp-server`
   - Environment Variables: `GITHUB_TOKEN=your-github-token-here`

## Available Tools

### 1. GitHub Code Search

Search for Grey Hack code examples on GitHub:

```
Use the search_greyhack_code tool to find examples of port scanners in Grey Hack
```

### 2. Greybel-JS Transpilation

Convert GreyScript code to JavaScript:

```
Use the transpile_greyscript tool to convert this Grey Hack code to JavaScript:
get_shell.host_computer.File("/home/user/test.txt")
```

### 3. GreyScript API Validation

Validate your code against the Grey Hack API:

```
Use the validate_greyscript tool to check if this code is valid in Grey Hack 0.8.0:
router = get_router
ip = router.local_ip
```

### 4. Script Generation

Generate template scripts for common game tasks:

```
Use the generate_greyhack_script tool to create a port scanner for Grey Hack 0.8.0
```

Available script types:
- `port_scanner`: Network port scanning utility
- `password_cracker`: Password cracking tool
- `file_browser`: File browsing and manipulation utility
- `ssh_tool`: SSH connection utility
- `custom`: Custom script template (requires description)

## Development

### Building from Source

```bash
npm run build
```

### Running in Development Mode

```bash
npm run dev
```

## License

MIT

## Acknowledgments

This project uses:
- Model Context Protocol TypeScript SDK
- Smithery GitHub Client
- Axios for HTTP requests
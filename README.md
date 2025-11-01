# Mind Reasoner MCP Server

An MCP (Model Context Protocol) server that integrates Mind Reasoner's API with Claude Desktop and Claude Code. This is the **first MCP server for Mind Reasoner**, enabling you to create digital minds, upload conversational data, and run AI simulations directly from Claude.

## What is Mind Reasoner?

Mind Reasoner is an AI service that creates digital twins of people based on their conversational data (chat logs, transcripts, documents). These digital twins can then simulate how the person would think, feel, say, and act in various scenarios.

**This MCP server makes Mind Reasoner accessible in Claude Desktop/Code conversations.**

## Features

- **6 MCP Tools** for Mind Reasoner API integration
- **Standalone CLI** for direct API access without Claude
- **Secure** API key handling via environment variables
- **Complete Workflow** from mind creation to simulation
- **TypeScript** implementation with full type safety

## What You Can Do

1. **Create Digital Minds** - Initialize new minds with names
2. **Upload Data** - Upload chat transcripts, PDFs, or DOCX files
3. **Create Snapshots** - Process uploaded data into AI models
4. **Check Status** - Monitor snapshot processing
5. **Run Simulations** - Ask questions and get AI-predicted responses
6. **Use CLI** - Command-line tool for quick API access

---

## Installation

### Prerequisites

- **Node.js 18+** installed ([download here](https://nodejs.org/))
- **Mind Reasoner API key** from [app.mindreasoner.com](https://app.mindreasoner.com)
- **Claude Desktop** or **Claude Code** installed

### Step 1: Clone or Download

```bash
git clone https://github.com/reasoner-com/mcp-server
cd mcp
```

Or download and extract the ZIP file.

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build

```bash
npm run build
```

This compiles the TypeScript code to JavaScript in the `dist/` folder.

### Step 4: Set Up API Key

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API key
echo "MIND_REASONER_API_KEY=your_api_key_here" > .env
```

**Security Note:** Never commit your `.env` file to git. It's already in `.gitignore`.

### Step 5: Link Globally (Optional)

To use the CLI tool from anywhere:

```bash
npm link
```

This makes `mr-cli` available globally in your terminal.

---

## Configuration

Choose **one** based on whether you're using Claude Desktop or Claude Code.

### Option A: Claude Desktop

Add this to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mind-reasoner": {
      "command": "node",
      "args": ["/absolute/path/to/mindreasoner-mcp-server/dist/index.js"],
      "env": {
        "MIND_REASONER_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Important:** Replace `/absolute/path/to/mindreasoner-mcp-server` with the actual path on your system.

### Option B: Claude Code

Add this to your Claude Code config file at `~/.claude.json`:

```json
{
  "mcpServers": {
    "mind-reasoner": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "--prefix",
        "/absolute/path/to/mindreasoner-mcp-server",
        "mcp-mind-reasoner"
      ],
      "env": {
        "MIND_REASONER_API_KEY": "your_api_key_here",
        "PATH": "/usr/local/bin:/usr/bin:/bin"
      }
    }
  }
}
```

**Important:**
- Replace `/absolute/path/to/mindreasoner-mcp-server` with your actual path
- Replace `your_api_key_here` with your Mind Reasoner API key
- Adjust `PATH` to match your system's Node.js location

### Step 6: Restart

- **Claude Desktop:** Quit and restart the app
- **Claude Code:** Reload window or restart

Verify the MCP server loaded by checking for Mind Reasoner tools in Claude.

---

## CLI Usage

The package includes a standalone CLI tool that works without Claude.

### Available Commands

```bash
# Create a mind
mr-cli create "Person Name"

# Get signed upload URL
mr-cli upload-url <MIND_ID> <CONTENT_TYPE>

# Upload a file
mr-cli upload "<SIGNED_URL>" /path/to/file.vtt <CONTENT_TYPE>

# Create snapshot
mr-cli snapshot <MIND_ID> <DIGITAL_TWIN_ID> <ARTIFACT_ID>

# Check snapshot status
mr-cli status <MIND_ID> <SNAPSHOT_ID>

# Run simulation
mr-cli simulate <MIND_ID> "Your question here"
```

### CLI Example Workflow

```bash
# 1. Create mind
mr-cli create "Customer Service Rep"
# Output: Mind ID: abc-123, Digital Twin ID: def-456

# 2. Get upload URL
mr-cli upload-url abc-123
# Output: Signed URL: https://..., Artifact ID: ghi-789, Content Type: text/vtt

# 3. Upload file
mr-cli upload "https://storage.googleapis.com/..." ./transcript.vtt text/vtt

# 4. Create snapshot
mr-cli snapshot abc-123 def-456 ghi-789
# Output: Snapshot ID: jkl-012

# 5. Check status (wait for completion)
mr-cli status abc-123 jkl-012

# 6. Run simulation
mr-cli simulate abc-123 "How would you handle an angry customer?"
```

---

## MCP Tools Reference

When using in Claude Desktop/Code, you have access to 6 tools:

### 1. `create_mind`

Creates a new digital mind.

**Parameters:**
- `name` (string, required) - Human-readable name for the mind

**Returns:**
```json
{
  "id": "6eadcb0b-7d0b-416f-a18d-dd1e6776be48",
  "name": "Customer Service Rep",
  "digitalTwin": {
    "id": "aedcbe4d-dd9f-4dd8-9991-5e048fffe521"
  }
}
```

**Save both `id` and `digitalTwin.id` for later steps.**

---

### 2. `get_signed_upload_url`

Gets a secure URL for uploading data files.

**Parameters:**
- `mindId` (string, required) - The mind ID from `create_mind`
- `contentType` (string, optional) - MIME type:
  - `text/vtt`
  - `application/pdf`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `application/octet-stream` (default)

**Returns:**
```json
{
  "signedUrl": "https://storage.googleapis.com/mind-reasoner-prod/...",
  "artifactId": "e29e3da5-5495-4666-89dd-6886475d0a72",
  "contentType": "text/vtt"
}
```

**Save both `signedUrl` and `artifactId` and `contentType` for next steps.**

---

### 3. `upload_file_to_signed_url`

Uploads a file to the signed URL.

**Parameters:**
- `signedUrl` (string, required) - URL from `get_signed_upload_url`
- `filePath` (string, required) - Absolute path to the file
- `contentType` (string, required) - contentType from `get_signed_upload_url`

**Example:**
```json
{
  "signedUrl": "https://assets.mindreasoner.com/...",
  "filePath": "/Users/username/Documents/transcript.vtt",
  "contentType": "text/vtt" // <-- Content type from step 2
}
```

**Returns:** Success confirmation

---

### 4. `create_snapshot`

Processes uploaded data into an AI snapshot.

**Parameters:**
- `mindId` (string, required) - Mind ID from step 1
- `digitalTwinId` (string, required) - Digital Twin ID from step 1
- `artifactId` (string, required) - Artifact ID from step 2

**Returns:**
```json
{
  "mindAssessmentId": "f1234567-89ab-cdef-0123-456789abcdef"
}
```

**The `mindAssessmentId` is your snapshot ID.** Save it!

---

### 5. `get_snapshot_status`

Checks if a snapshot is ready for simulation.

**Parameters:**
- `mindId` (string, required) - Mind ID
- `snapshotId` (string, required) - The `mindAssessmentId` from `create_snapshot`

**Returns:**
```json
{
  "id": "f1234567-89ab-cdef-0123-456789abcdef",
  "status": "processing"  // or "completed", "failed"
}
```

**Wait for `status: "completed"` before running simulations.**

---

### 6. `simulate`

Runs an AI simulation to predict how the mind will respond.

**Parameters:**
- `mindId` (string, required) - Mind ID
- `selectedSimulationModel` (string, required) - Model to use:
  - `mind-reasoner-pro` - Most advanced (recommended)
  - `mind-reasoner-standard` - Standard model
- `scenario` (object, required) - Contains:
  - `message` (string, required) - Your question/scenario

**Example:**
```json
{
  "mindId": "6eadcb0b-7d0b-416f-a18d-dd1e6776be48",
  "selectedSimulationModel": "mind-reasoner-pro",
  "scenario": {
    "message": "How would you handle a customer complaint about late delivery?"
  }
}
```

**Returns:** AI-generated response based on the digital mind's data

---

## Complete Workflow Guide

### End-to-End Example

This workflow shows how to go from zero to running simulations:

#### Step 1: Create a Mind

Ask Claude:
> "Create a new mind called 'Sales Manager John'"

Or use CLI:
```bash
mr-cli create "Sales Manager John"
```

**Output:**
```
Mind ID: 6eadcb0b-7d0b-416f-a18d-dd1e6776be48
Digital Twin ID: aedcbe4d-dd9f-4dd8-9991-5e048fffe521
```

**💾 Save:** Mind ID and Digital Twin ID

---

#### Step 2: Get Upload URL

Ask Claude:
> "Get upload URL for mind 6eadcb0b-7d0b-416f-a18d-dd1e6776be48"

Or use CLI:
```bash
mr-cli upload-url 6eadcb0b-7d0b-416f-a18d-dd1e6776be48
```

**Output:**
```
Signed URL: https://storage.googleapis.com/mind-reasoner-prod/...
Artifact ID: e29e3da5-5495-4666-89dd-6886475d0a72
```

**💾 Save:** Signed URL and Artifact ID

---

#### Step 3: Upload Data File

You need a file containing conversational data. Supported formats:
- `.vtt` - Chat transcripts (WebVTT format)
- `.pdf` - PDF documents
- `.docx` - Word documents

Ask Claude:
> "Upload the file /Users/me/Documents/sales_calls.vtt to [paste signed URL] with content type text/vtt"

Or use CLI:
```bash
mr-cli upload "https://storage.googleapis.com/..." /Users/me/Documents/sales_calls.vtt text/vtt
```

**Output:**
```
✅ File uploaded successfully
```

---

#### Step 4: Create Snapshot

This processes your uploaded data into an AI model.

Ask Claude:
> "Create snapshot for mind 6eadcb0b... using digital twin aedcbe4d... and artifact e29e3da5..."

Or use CLI:
```bash
mr-cli snapshot 6eadcb0b-7d0b-416f-a18d-dd1e6776be48 aedcbe4d-dd9f-4dd8-9991-5e048fffe521 e29e3da5-5495-4666-89dd-6886475d0a72
```

**Output:**
```
Snapshot ID: f1234567-89ab-cdef-0123-456789abcdef
```

**💾 Save:** Snapshot ID

---

#### Step 5: Check Snapshot Status

Snapshots take time to process. Check status repeatedly until complete.

Ask Claude:
> "Check status of snapshot f1234567... for mind 6eadcb0b..."

Or use CLI:
```bash
mr-cli status 6eadcb0b-7d0b-416f-a18d-dd1e6776be48 f1234567-89ab-cdef-0123-456789abcdef
```

**Output:**
```
Status: processing  // Keep checking until "completed"
```

**⏳ Wait for `status: "completed"` before proceeding.**

---

#### Step 6: Run Simulation

Once the snapshot is complete, you can run simulations!

Ask Claude:
> "Simulate mind 6eadcb0b... with model mind-reasoner-pro and ask: 'What would you say to a client who wants a discount?'"

Or use CLI:
```bash
mr-cli simulate 6eadcb0b-7d0b-416f-a18d-dd1e6776be48 "What would you say to a client who wants a discount?"
```

**Output:**
```
AI-generated response based on Sales Manager John's communication style and personality...
```

---

## Supported File Types

| Format | Extension | Content Type | Use Case |
|--------|-----------|--------------|----------|
| WebVTT | `.vtt` | `text/vtt` | Chat transcripts, call transcripts |
| PDF | `.pdf` | `application/pdf` | Documents, reports |
| Word | `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Documents, notes |

---

## Troubleshooting

### MCP Server Not Loading

**Problem:** Tools don't appear in Claude Desktop/Code

**Solutions:**

1. **Check config file syntax**
   ```bash
   # Validate JSON
   cat ~/.claude.json | python3 -m json.tool
   ```

2. **Verify paths are absolute**
   ```bash
   # Get absolute path
   cd /path/to/mindreasoner-mcp-server
   pwd
   ```

3. **Check API key is set**
   ```bash
   # Test CLI works
   mr-cli create "Test Mind"
   ```

4. **Restart properly**
   - Claude Desktop: Quit completely (Cmd+Q), then reopen
   - Claude Code: Use "Reload Window" command

5. **Check logs** (macOS)
   ```bash
   # View Claude Desktop logs
   tail -f ~/Library/Logs/Claude/mcp*.log
   ```

---

### API Errors

**Problem:** "Unauthorized" or "Invalid API key"

**Solution:**
1. Verify your API key at [app.mindreasoner.com](https://app.mindreasoner.com)
2. Check `.env` file has correct key
3. Ensure config file has the right key (no extra spaces)
4. Restart Claude after updating the key

---

**Problem:** "404 Not Found"

**Solution:**
- The endpoint may not exist in Mind Reasoner's API
- Check the API documentation for supported endpoints
- Only use the 6 documented tools

---

**Problem:** "Snapshot still processing"

**Solution:**
- Snapshots can take 5-15 minutes to process
- Keep checking status until `"completed"`
- Don't run simulations until snapshot is ready

---

### File Upload Issues

**Problem:** File upload fails

**Solutions:**
1. **Check file path is absolute**
   ```bash
   # Wrong
   mr-cli upload "..." transcript.vtt text/vtt

   # Right
   mr-cli upload "..." /Users/me/Documents/transcript.vtt text/vtt
   ```

2. **Verify content type matches file extension**
   - `.vtt` → `text/vtt`
   - `.pdf` → `application/pdf`
   - `.docx` → `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

3. **Check file size** (API may have limits)

4. **Ensure file exists**
   ```bash
   ls -lh /path/to/your/file.vtt
   ```

5. **Ensure content type matches the file extension**
   ```bash
   # Wrong
   mr-cli upload-url 6eadcb0b-7d0b-416f-a18d-dd1e6776be48 text/vtt
   mr-cli upload "..." /Users/me/Documents/transcript.vtt application/pdf
   ```
   ```bash
   # Right
   mr-cli upload-url 6eadcb0b-7d0b-416f-a18d-dd1e6776be48 text/vtt
   mr-cli upload "..." /Users/me/Documents/transcript.vtt text/vtt
   ```

---

## Development

### Project Structure

```
mcp/
├── src/
│   └── index.ts          # MCP server implementation
├── dist/
│   └── index.js          # Compiled JavaScript (generated)
├── cli.mjs               # Standalone CLI tool
├── package.json          # npm configuration
├── tsconfig.json         # TypeScript config
├── .env                  # Your API key (git-ignored)
├── .env.example          # Template for .env
├── .gitignore            # Ignores .env and sensitive files
└── README.md             # This file
```

### Build Commands

```bash
# Build once
npm run build

# Watch for changes and rebuild
npm run watch

# Clean build artifacts
rm -rf dist/
npm run build
```

### Making Changes

1. **Edit TypeScript source:**
   ```bash
   # Edit src/index.ts or cli.mjs
   nano src/index.ts
   ```

2. **Rebuild:**
   ```bash
   npm run build
   ```

3. **Test MCP server:**
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{}}}' | node dist/index.js
   ```

4. **Test CLI:**
   ```bash
   mr-cli create "Test Mind"
   ```

### Adding New Tools

To add a new tool to the MCP server:

1. Add tool definition in `src/index.ts`:
   ```typescript
   const tools: Tool[] = [
     // ... existing tools
     {
       name: "your_new_tool",
       description: "What your tool does",
       inputSchema: {
         type: "object",
         properties: {
           param1: { type: "string", description: "..." }
         },
         required: ["param1"]
       }
     }
   ];
   ```

2. Add handler in `CallToolRequestSchema` handler:
   ```typescript
   case "your_new_tool": {
     const params = request.params.arguments as YourParamsType;
     // Implementation
   }
   ```

3. Rebuild and test

---

## Security Best Practices

### API Key Protection

**✅ DO:**
- Store API key in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables in config
- Never hardcode keys in source code

**❌ DON'T:**
- Commit `.env` to git
- Share your API key publicly
- Hardcode keys in code
- Upload keys to GitHub

### File Permissions

Recommended `.env` permissions:
```bash
chmod 600 .env
```

This makes it readable/writable only by you.

---

## API Rate Limits

Mind Reasoner API may have rate limits. If you hit limits:

- Space out requests
- Cache results when possible
- Contact Mind Reasoner support for higher limits

---

## Advanced Usage

### Using in Other Projects

Install locally in another project:

```bash
cd /path/to/your/project
npm install /path/to/mindreasoner-mcp-server
```

Then use in Node.js:

```javascript
import { createMind, simulate } from 'mcp-mind-reasoner';

const mind = await createMind("Test Mind");
const result = await simulate(mind.id, "mind-reasoner-pro", {
  message: "Your question"
});
```

### Environment Variables

You can override defaults with environment variables:

```bash
# Set API key
export MIND_REASONER_API_KEY="your_key"

# Run CLI
mr-cli create "Mind Name"
```

Or use dotenv in your own code:

```javascript
import dotenv from 'dotenv';
dotenv.config();
```

---

## Resources

- **Mind Reasoner Dashboard:** [app.mindreasoner.com](https://app.mindreasoner.com)
- **API Documentation:** [docs.reasoner.com/mind-reasoner-api](https://docs.reasoner.com/mind-reasoner-api/getting-started-mind-reasoner-api)
- **MCP Protocol:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Claude Desktop:** [claude.ai](https://claude.ai)

## Support

For issues or questions:

- **Mind Reasoner API:** support@mindreasoner.com
- **This MCP Server:** Open an issue on GitHub
- **MCP Protocol:** Anthropic's MCP Discord

---

## FAQ

### Q: Do I need to host this somewhere?

**A:** No! MCP servers run locally on your machine. Claude Desktop/Code starts the server automatically when you use it.

### Q: Can I share this with others?

**A:** Yes! Others can:
1. Clone your repo
2. Install dependencies
3. Add their own API key
4. Configure their Claude Desktop/Code

Each person runs their own copy with their own API key.

### Q: What data does Mind Reasoner store?

**A:** Mind Reasoner stores the files you upload and the minds you create. Check Mind Reasoner's privacy policy for details.

### Q: Can I delete a mind?

**A:** Not through this MCP server (the API doesn't support it via public endpoints). Use the Mind Reasoner web dashboard to delete minds.

### Q: How long do snapshots take?

**A:** Typically 5-15 minutes, depending on file size and Mind Reasoner's processing queue.

### Q: Can I use multiple minds simultaneously?

**A:** Yes! Each mind has its own ID. You can create as many as you want (subject to Mind Reasoner's limits).

---

## Contributing

Contributions welcome! To contribute:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Please follow existing code style and add tests for new features.

---

## Changelog

### v1.0.0 (2025-10-25)

- Initial release
- 6 MCP tools for Mind Reasoner API
- Standalone CLI tool
- Claude Desktop and Claude Code support
- TypeScript implementation
- Comprehensive documentation

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- Built with [MCP SDK](https://github.com/anthropics/mcp-sdk)
- Powered by [Mind Reasoner API](https://docs.mindreasoner.com)
- Created for the Claude Desktop/Code community

---

**Made with ❤️ for the Mind Reasoner and Claude communities**

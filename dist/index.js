#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import axios, { AxiosError } from "axios";
import FormData from "form-data";
const API_BASE_URL = "https://staging.app.mindreasoner.com/api/public/v1";
const API_KEY = process.env.MIND_REASONER_API_KEY || "";
if (!API_KEY) {
    console.error("Error: MIND_REASONER_API_KEY environment variable is required");
    process.exit(1);
}
// Define all available tools
const tools = [
    {
        name: "create_mind",
        description: "Create a new digital mind. This is the first step in the Mind Reasoner workflow. Returns a mind object with an ID and a digitalTwin object with an ID that you'll need for subsequent operations.",
        inputSchema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "A human-readable name for the mind",
                },
            },
            required: ["name"],
        },
    },
    {
        name: "get_signed_upload_url",
        description: "Get a secure, one-time URL for uploading a data file (conversation transcript, etc.) to a mind. Returns a signedUrl for uploading and an artifactId that you'll need when creating a snapshot.",
        inputSchema: {
            type: "object",
            properties: {
                mindId: {
                    type: "string",
                    description: "The unique ID of the mind",
                },
            },
            required: ["mindId"],
        },
    },
    {
        name: "upload_file_to_signed_url",
        description: "Upload a file to a signed URL obtained from get_signed_upload_url. Supports .vtt, .docx, and .pdf files. This is step 2B in the workflow.",
        inputSchema: {
            type: "object",
            properties: {
                signedUrl: {
                    type: "string",
                    description: "The signed URL obtained from get_signed_upload_url",
                },
                filePath: {
                    type: "string",
                    description: "Local file path to upload",
                },
                contentType: {
                    type: "string",
                    default: "application/octet-stream",
                    description: "MIME type of the file (e.g., 'text/vtt', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')",
                },
            },
            required: ["signedUrl", "filePath"],
        },
    },
    {
        name: "create_snapshot",
        description: "Create a snapshot from an uploaded file. This processes the uploaded data file and creates a point-in-time capture of the mind's knowledge. This operation is asynchronous - use get_snapshot_status to check when it's complete. Returns a mindAssessmentId (snapshotId) that you'll use to check status.",
        inputSchema: {
            type: "object",
            properties: {
                mindId: {
                    type: "string",
                    description: "The unique ID of the mind",
                },
                digitalTwinId: {
                    type: "string",
                    description: "The ID of the digital twin (obtained when creating the mind)",
                },
                artifactId: {
                    type: "string",
                    description: "The artifact ID (obtained from get_signed_upload_url)",
                },
            },
            required: ["mindId", "digitalTwinId", "artifactId"],
        },
    },
    {
        name: "get_snapshot_status",
        description: "Check the processing status of a snapshot. Poll this endpoint until the status is 'completed' before running simulations. The snapshot processing is asynchronous and may take several minutes.",
        inputSchema: {
            type: "object",
            properties: {
                mindId: {
                    type: "string",
                    description: "The unique ID of the mind",
                },
                snapshotId: {
                    type: "string",
                    description: "The snapshot ID (mindAssessmentId from create_snapshot)",
                },
            },
            required: ["mindId", "snapshotId"],
        },
    },
    {
        name: "simulate",
        description: "Run a simulation to get a prediction of how the mind will think, feel, say, and act in response to a scenario. The snapshot must be in 'completed' status before running simulations.",
        inputSchema: {
            type: "object",
            properties: {
                mindId: {
                    type: "string",
                    description: "The unique ID of the mind to simulate",
                },
                selectedSimulationModel: {
                    type: "string",
                    description: "The reasoning model to use. 'mind-reasoner-pro' is the most advanced model.",
                    enum: ["mind-reasoner-pro", "mind-reasoner-standard"],
                    default: "mind-reasoner-pro",
                },
                scenario: {
                    type: "object",
                    description: "The scenario to simulate",
                    properties: {
                        message: {
                            type: "string",
                            description: "The scenario message or question",
                        },
                    },
                    required: ["message"],
                },
            },
            required: ["mindId", "selectedSimulationModel", "scenario"],
        },
    },
];
// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    },
});
// Error handler
function formatError(error) {
    if (error instanceof AxiosError) {
        if (error.response) {
            return `API Error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
        }
        return `Request Error: ${error.message}`;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
// Tool handlers
async function createMind(params) {
    const response = await api.post("/minds", { name: params.name });
    return response.data;
}
async function getSignedUploadUrl(params) {
    const response = await api.get(`/minds/${params.mindId}/signed-url`);
    return response.data;
}
async function uploadFileToSignedUrl(params) {
    const fileContent = await readFile(params.filePath);
    const contentType = params.contentType || "application/octet-stream";
    await axios.put(params.signedUrl, fileContent, {
        headers: {
            "Content-Type": contentType,
        },
    });
    return { success: true, message: "File uploaded successfully" };
}
async function createSnapshot(params) {
    const form = new FormData();
    form.append("digitalTwinId", params.digitalTwinId);
    form.append("artifactId", params.artifactId);
    const response = await axios.post(`${API_BASE_URL}/minds/${params.mindId}/snapshots`, form, {
        headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${API_KEY}`,
        },
    });
    return response.data;
}
async function getSnapshotStatus(params) {
    const response = await api.get(`/minds/${params.mindId}/snapshots/${params.snapshotId}/status`);
    return response.data;
}
async function simulate(params) {
    const response = await api.post("/simulate", {
        mindId: params.mindId,
        selectedSimulationModel: params.selectedSimulationModel,
        scenario: params.scenario,
    });
    return response.data;
}
// Create MCP server
const server = new Server({
    name: "mind-reasoner",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
        const { name, arguments: args } = request.params;
        switch (name) {
            case "create_mind":
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(await createMind(args), null, 2),
                        },
                    ],
                };
            case "get_signed_upload_url":
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(await getSignedUploadUrl(args), null, 2),
                        },
                    ],
                };
            case "upload_file_to_signed_url":
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(await uploadFileToSignedUrl(args), null, 2),
                        },
                    ],
                };
            case "create_snapshot":
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(await createSnapshot(args), null, 2),
                        },
                    ],
                };
            case "get_snapshot_status":
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(await getSnapshotStatus(args), null, 2),
                        },
                    ],
                };
            case "simulate":
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(await simulate(args), null, 2),
                        },
                    ],
                };
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${formatError(error)}`,
                },
            ],
            isError: true,
        };
    }
});
// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Mind Reasoner MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
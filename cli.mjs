#!/usr/bin/env node

/**
 * Mind Reasoner CLI - Direct usage without MCP
 * Use this to interact with Mind Reasoner API directly
 */

import { readFile } from "node:fs/promises";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const API_BASE_URL = "https://staging.app.mindreasoner.com/api/public/v1";
const API_KEY = process.env.MIND_REASONER_API_KEY;

if (!API_KEY) {
	console.error("❌ Error: MIND_REASONER_API_KEY not set in .env file");
	process.exit(1);
}

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		Authorization: `Bearer ${API_KEY}`,
		"Content-Type": "application/json",
	},
});

// Command line arguments
const command = process.argv[2];
const args = process.argv.slice(3);

async function createMind(name) {
	console.log(`📝 Creating mind: "${name}"...`);
	const response = await api.post("/minds", { name });
	console.log("\n✅ Mind created successfully!\n");
	console.log("Mind ID:", response.data.mind?.id);
	console.log("Digital Twin ID:", response.data.digitalTwin?.id);
	console.log("\n💾 Save these IDs for next steps!");
	return response.data;
}

async function getSignedUrl(mindId, contentType = "application/octet-stream") {
	console.log(`🔐 Getting signed upload URL for mind: ${mindId}...`);
	const response = await api.get(
		`/minds/${mindId}/signed-url?contentType=${contentType}`,
	);
	console.log("\n✅ Signed URL obtained!\n");
	console.log("Artifact ID:", response.data.artifactId);
	console.log("Signed URL:", `${response.data.signedUrl.substring(0, 50)}...`);
	console.log("Content Type:", response.data.contentType);
	console.log("\n💾 Save the Artifact ID!");
	return response.data;
}

async function uploadFile(
	signedUrl,
	filePath,
	contentType = "application/octet-stream",
) {
	console.log(`📤 Uploading file: ${filePath}...`);
	const fileContent = await readFile(filePath);
	await axios.put(signedUrl, fileContent, {
		headers: { "Content-Type": contentType },
	});
	console.log("\n✅ File uploaded successfully!");
}

async function createSnapshot(mindId, digitalTwinId, artifactId) {
	console.log(`📸 Creating snapshot...`);
	const form = new FormData();
	form.append("digitalTwinId", digitalTwinId);
	form.append("artifactId", artifactId);

	const response = await axios.post(
		`${API_BASE_URL}/minds/${mindId}/snapshots`,
		form,
		{
			headers: {
				...form.getHeaders(),
				Authorization: `Bearer ${API_KEY}`,
			},
		},
	);
	console.log("\n✅ Snapshot creation started!\n");
	console.log("Snapshot ID:", response.data.mindAssessmentId);
	console.log(
		'\n⏳ Snapshot is processing. Use "check-status" to monitor progress.',
	);
	return response.data;
}

async function checkStatus(mindId, snapshotId) {
	console.log(`🔍 Checking snapshot status...`);
	const response = await api.get(
		`/minds/${mindId}/snapshots/${snapshotId}/status`,
	);
	console.log("\n📊 Status:", response.data.status);
	if (response.data.status === "completed") {
		console.log("✅ Snapshot is ready for simulation!");
	} else {
		console.log("⏳ Still processing... check again in a few minutes.");
	}
	return response.data;
}

async function simulate(mindId, scenario, model = "mind-reasoner-pro") {
	console.log(`🎭 Running simulation...`);
	const response = await api.post("/simulate", {
		mindId,
		selectedSimulationModel: model,
		scenario: { message: scenario },
	});
	console.log("\n✅ Simulation complete!\n");
	console.log("Response:", response.data.message);
	return response.data;
}

// Help text
function showHelp() {
	console.log(`
🧠 Mind Reasoner CLI

USAGE:
  node cli.mjs <command> [arguments]

COMMANDS:
  create <name>
    Create a new mind
    Example: node cli.mjs create "Customer Service Rep"

  upload-url <mindId>
    Get signed URL for uploading data
    Example: node cli.mjs upload-url abc123-def456

  upload <signedUrl> <filePath> <contentType>
    Upload a file to signed URL
    Example: node cli.mjs upload "https://..." ./transcript.vtt text/vtt

  snapshot <mindId> <digitalTwinId> <artifactId>
    Create snapshot from uploaded data
    Example: node cli.mjs snapshot mind123 twin456 artifact789

  status <mindId> <snapshotId>
    Check snapshot processing status
    Example: node cli.mjs status mind123 snapshot456

  simulate <mindId> <scenario> [model]
    Run a simulation
    Example: node cli.mjs simulate mind123 "How would you handle this?"

  help
    Show this help message

ENVIRONMENT:
  Set MIND_REASONER_API_KEY in .env file

EXAMPLES:
  # Complete workflow
  node cli.mjs create "Sales Assistant"
  node cli.mjs upload-url <mindId>
  node cli.mjs upload <signedUrl> ./data.vtt text/vtt
  node cli.mjs snapshot <mindId> <digitalTwinId> <artifactId>
  node cli.mjs status <mindId> <snapshotId>
  node cli.mjs simulate <mindId> "How should I approach this sale?"
`);
}

// Main
async function main() {
	try {
		switch (command) {
			case "create":
				await createMind(args[0]);
				break;

			case "upload-url":
				await getSignedUrl(args[0], args[1]);
				break;

			case "upload":
				await uploadFile(args[0], args[1], args[2]);
				break;

			case "snapshot":
				await createSnapshot(args[0], args[1], args[2]);
				break;

			case "status":
				await checkStatus(args[0], args[1]);
				break;

			case "simulate":
				await simulate(args[0], args[1], args[2]);
				break;
			default:
				showHelp();
				break;
		}
	} catch (error) {
		console.error("\n❌ Error:", error.response?.data || error.message);
		process.exit(1);
	}
}

main();

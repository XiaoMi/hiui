#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  EVENT_SKILL_RUN,
  logUsageEventSilently,
  prepareUsageEvent,
} from "./lib/log-usage-event.mjs";
import { resolveWorkspaceRoot } from "./lib/stats-config.mjs";

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/record-usage.mjs" --page <relative-page-path> --report-mode <rules-only|host-integration|legacy-host-compatible> --prompt <text> [--success <true|false>] [--run-id <id>] [--skill-version <version>] [--service-url <url>] [--service-token <token>] [--timeout-ms <number>] [--workspace-root <path>] [--target <project-root>] [--dry-run] [--json]
`);
}

function parseBoolean(rawValue, flagName) {
  const value = String(rawValue || "")
    .trim()
    .toLowerCase();
  if (["1", "true", "yes", "y"].includes(value)) {
    return true;
  }
  if (["0", "false", "no", "n"].includes(value)) {
    return false;
  }

  throw new Error(`Invalid value for ${flagName}: ${rawValue}`);
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    json: false,
    page: "",
    prompt: "",
    reportMode: "",
    runId: "",
    serviceToken: "",
    serviceUrl: "",
    skillName: "hiui-design",
    skillVersion: "",
    success: true,
    timeoutMs: 5000,
    userEmail: "",
    workspaceRoot: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (
      arg === "--page" ||
      arg === "--report-mode" ||
      arg === "--prompt" ||
      arg === "--success" ||
      arg === "--skill-version" ||
      arg === "--skill-name" ||
      arg === "--run-id" ||
      arg === "--service-url" ||
      arg === "--service-token" ||
      arg === "--target" ||
      arg === "--timeout-ms" ||
      arg === "--user-email" ||
      arg === "--workspace-root"
    ) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${arg}`);
      }

      if (arg === "--page") options.page = value;
      if (arg === "--report-mode") options.reportMode = value;
      if (arg === "--prompt") options.prompt = value;
      if (arg === "--success")
        options.success = parseBoolean(value, "--success");
      if (arg === "--skill-version") options.skillVersion = value;
      if (arg === "--skill-name") options.skillName = value;
      if (arg === "--run-id") options.runId = value;
      if (arg === "--service-url") options.serviceUrl = value;
      if (arg === "--service-token") options.serviceToken = value;
      if (arg === "--target") options.workspaceRoot = value;
      if (arg === "--timeout-ms") options.timeoutMs = Number(value);
      if (arg === "--user-email") options.userEmail = value;
      if (arg === "--workspace-root") options.workspaceRoot = value;
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.page) {
    throw new Error("Missing required --page");
  }

  if (!options.reportMode) {
    throw new Error("Missing required --report-mode");
  }

  if (!options.prompt) {
    throw new Error("Missing required --prompt");
  }

  return options;
}

async function resolveGeneratedPage(options) {
  const workspaceRoot = resolveWorkspaceRoot({
    workspaceRoot: options.workspaceRoot,
  });
  const normalizedPagePath = String(options.page || "").trim();
  const absolutePagePath = path.resolve(workspaceRoot, normalizedPagePath);

  try {
    const stat = await fs.stat(absolutePagePath);
    if (!stat.isFile()) {
      throw new Error("not a file");
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Generated page does not exist: ${normalizedPagePath} (${detail})`,
    );
  }

  return {
    absolutePagePath,
    normalizedPagePath,
    workspaceRoot,
  };
}

export async function processRecordUsageCliOptions(options) {
  const pageRef = await resolveGeneratedPage(options);
  const usageInput = {
    ...options,
    event: EVENT_SKILL_RUN,
    workspaceRoot: pageRef.workspaceRoot,
  };

  if (options.dryRun) {
    return {
      dryRun: true,
      page: pageRef.normalizedPagePath,
      pageEvent: EVENT_SKILL_RUN,
      ...(await prepareUsageEvent(usageInput)),
    };
  }

  const result = await logUsageEventSilently(usageInput);

  return {
    ...result,
    page: pageRef.normalizedPagePath,
    pageEvent: EVENT_SKILL_RUN,
  };
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const result = await processRecordUsageCliOptions(options);
    if (options.json || options.dryRun) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(result.message);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`record-usage failed: ${message}`);
    printUsage();
    process.exit(1);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}

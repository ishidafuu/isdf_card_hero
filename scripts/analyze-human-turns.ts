import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  analyzeHumanTurnReport,
  formatHumanTurnAuditMarkdown,
  type HumanTurnAuditReportInput,
} from "./lib/humanTurnAudit";

interface CliOptions {
  reportPaths: string[];
  outputPath: string;
}

const options = parseArgs(process.argv.slice(2));
const reports = await Promise.all(options.reportPaths.map(async (path) => {
  const value: unknown = JSON.parse(await readFile(path, "utf8"));
  assertReport(value, path);
  return analyzeHumanTurnReport(value);
}));
const markdown = formatHumanTurnAuditMarkdown(reports);
await mkdir(dirname(options.outputPath), { recursive: true });
await writeFile(options.outputPath, `${markdown}\n`);
console.log(`Human turn audit: ${options.outputPath}`);
console.log(`Reports: ${reports.length}, turns: ${reports.reduce((total, report) => total + report.entries.length, 0)}`);

function parseArgs(args: string[]): CliOptions {
  const reportPaths: string[] = [];
  let outputPath = resolve("docs/ai_playtest_reports/analysis/human-turn-audit.md");
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--report") {
      reportPaths.push(resolve(readValue(arg, next)));
      index += 1;
    } else if (arg === "--output") {
      outputPath = resolve(readValue(arg, next));
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  if (reportPaths.length === 0) {
    throw new Error("at least one --report is required");
  }
  return { reportPaths, outputPath };
}

function assertReport(value: unknown, path: string): asserts value is HumanTurnAuditReportInput {
  if (!value || typeof value !== "object" || typeof (value as { reportId?: unknown }).reportId !== "string") {
    throw new Error(`invalid battle report: ${path}`);
  }
}

function readValue(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function printHelp(): void {
  console.log(`Usage:
  npm run audit:human-turns -- --report <json> [--report <json> ...] [--output <md>]
`);
}

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  formatAutoPlayValidationSummary,
  validateAutoPlay,
  type AutoPlayIssue,
  type AutoPlayValidationOptions,
} from "../src/game/autoPlayValidation";

interface CliOptions extends AutoPlayValidationOptions {
  outDir: string;
  writeArtifacts: boolean;
}

const options = parseArgs(process.argv.slice(2));
const result = validateAutoPlay(options);
console.log(formatAutoPlayValidationSummary(result));

if (options.writeArtifacts || result.issues.length > 0) {
  await writeArtifacts(options.outDir, result.issues);
  console.log(`Artifacts: ${options.outDir}`);
}

if (!result.ok) {
  process.exitCode = 1;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    outDir: defaultOutDir(),
    writeArtifacts: false,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--seed-end") {
      parsed.seedEnd = readNumber(arg, next);
      i += 1;
    } else if (arg === "--count") {
      parsed.count = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--stagnation-limit") {
      parsed.stagnationLimit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-steps") {
      parsed.longGameSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-turns") {
      parsed.longGameTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--history-limit") {
      parsed.historyLimit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--out-dir") {
      if (!next) {
        throw new Error("--out-dir requires a value");
      }
      parsed.outDir = next;
      i += 1;
    } else if (arg === "--write-artifacts") {
      parsed.writeArtifacts = true;
    } else if (arg === "--fail-on-warnings") {
      parsed.failOnWarnings = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

function readNumber(name: string, value: string | undefined): number {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  const number = Number(value);
  if (!Number.isInteger(number)) {
    throw new Error(`${name} must be an integer`);
  }
  return number;
}

function defaultOutDir(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return join("artifacts", "auto-play-validation", stamp);
}

async function writeArtifacts(outDir: string, issues: AutoPlayIssue[]): Promise<void> {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "issues-summary.json"), JSON.stringify(issues.map(issueSummary), null, 2));

  await Promise.all(issues.map((issue, index) => {
    const filename = `${String(index + 1).padStart(3, "0")}_seed-${issue.seed}_${issue.kind}.json`;
    return writeFile(join(outDir, filename), JSON.stringify(issue, null, 2));
  }));
}

function issueSummary(issue: AutoPlayIssue): object {
  return {
    kind: issue.kind,
    severity: issue.severity,
    seed: issue.seed,
    step: issue.step,
    turnNumber: issue.turnNumber,
    message: issue.message,
  };
}

function printHelp(): void {
  console.log(`
Usage:
  npm run validate:auto-play -- [options]

Options:
  --seed-start <n>        First seed. Default: 400
  --seed-end <n>          Last seed, inclusive. Overrides --count.
  --count <n>             Number of games. Default: 100
  --max-steps <n>         Failure threshold per game. Default: 500
  --max-turns <n>         Failure threshold per game. Default: 120
  --long-game-steps <n>   Warning threshold per game. Default: 300
  --long-game-turns <n>   Warning threshold per game. Default: 80
  --stagnation-limit <n>  Failure threshold for repeated state signatures. Default: 8
  --history-limit <n>     Decision history saved per issue. Default: 30
  --out-dir <path>        Artifact output directory.
  --write-artifacts       Write artifact directory even when no issues are detected.
  --fail-on-warnings      Exit non-zero when warnings are detected.
`);
}

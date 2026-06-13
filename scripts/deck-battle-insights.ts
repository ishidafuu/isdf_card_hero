import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  analyzeDeckBattleReport,
  formatDeckBattleInsightsMarkdown,
  type DeckBattleInsightsOptions,
} from "../src/game/deckBattleInsights";
import { getDeckBenchmarkSuite } from "../src/game/deckBenchmarkSuites";
import {
  scoreDeckBattleResults,
  type DeckBattleScoringReport,
} from "../src/game/deckBattleScoring";

interface CliOptions extends DeckBattleInsightsOptions {
  reportPath: string;
  outDir: string;
  jsonPath?: string;
  markdownPath?: string;
}

const options = parseArgs(process.argv.slice(2));
const report = JSON.parse(await readFile(options.reportPath, "utf8")) as DeckBattleScoringReport;
const insights = analyzeDeckBattleReport(enrichReportDeckScores(report), options);
const markdown = formatDeckBattleInsightsMarkdown(insights);

const jsonPath = options.jsonPath ?? join(options.outDir, "insights.json");
const markdownPath = options.markdownPath ?? join(options.outDir, "insights.md");
await writeReport(jsonPath, JSON.stringify(insights, null, 2));
await writeReport(markdownPath, markdown);

console.log(`Deck battle insights: ${insights.source.suiteId}`);
console.log(`Decks: ${insights.source.decks}, games: ${insights.source.games}`);
console.log(`Problem games: ${insights.problemGames.length}`);
for (const item of insights.recommendedFocus.slice(0, 4)) {
  console.log(`- ${item}`);
}
console.log(`JSON: ${jsonPath}`);
console.log(`Markdown: ${markdownPath}`);

function enrichReportDeckScores(report: DeckBattleScoringReport): DeckBattleScoringReport {
  const suiteDeckIds = getDeckBenchmarkSuite(report.options.suiteId).deckPresetIds;
  const deckPresetIds = suiteDeckIds.slice(0, report.options.maxDecks ?? suiteDeckIds.length);
  return {
    ...report,
    decks: scoreDeckBattleResults(deckPresetIds, report.games),
  };
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    reportPath: join("artifacts", "deck-battle-score", "latest", "report.json"),
    outDir: join("artifacts", "deck-battle-score", "latest"),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--report") {
      parsed.reportPath = readString(arg, next);
      i += 1;
    } else if (arg === "--out-dir") {
      parsed.outDir = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--limit") {
      parsed.limit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--long-game-step-margin") {
      parsed.longGameStepMargin = readNumber(arg, next);
      i += 1;
    } else if (arg === "--upset-gap") {
      parsed.upsetBattleScoreGap = readNumber(arg, next);
      i += 1;
    } else if (arg === "--top-rank-limit") {
      parsed.topDeckRankLimit = readNumber(arg, next);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return parsed;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
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

function printHelp(): void {
  console.log(`
Usage:
  npm run analyze:deck-battles -- [options]

Options:
  --report <path>                 Input report.json. Default: artifacts/deck-battle-score/latest/report.json
  --out-dir <path>                Output directory. Default: artifacts/deck-battle-score/latest
  --json <path>                   Write JSON report to an explicit path.
  --markdown <path>               Write Markdown report to an explicit path.
  --limit <n>                     Entries per category. Default: 8
  --long-game-step-margin <n>     Long game threshold over suite average steps. Default: 45
  --upset-gap <n>                 Battle score gap for upset games. Default: 18
  --top-rank-limit <n>            Rank threshold for top deck loss. Default: 8
`);
}

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getDeckBenchmarkSuites } from "../src/game/deckBenchmarkSuites";
import { analyzeDeckSubmissions, summarizeDeckTemplateGroups, type DeckTemplateAudit } from "../src/game/deckTemplateAnalysis";

interface CliOptions {
  outDir: string;
  top: number;
}

const options = parseArgs(process.argv.slice(2));
const audits = analyzeDeckSubmissions();
const groups = summarizeDeckTemplateGroups(audits);
const suites = getDeckBenchmarkSuites();
const report = { generatedAt: new Date().toISOString(), groups, suites, decks: audits };

await mkdir(options.outDir, { recursive: true });
await writeFile(join(options.outDir, "deck-report.json"), JSON.stringify(report, null, 2));
await writeFile(join(options.outDir, "deck-report.md"), formatMarkdownReport(audits, options.top));

console.log(formatConsoleSummary(audits, options.top));
console.log(`Report: ${options.outDir}`);

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    outDir: join("artifacts", "deck-submission-audit", "latest"),
    top: 8,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--out-dir") {
      if (!next) {
        throw new Error("--out-dir requires a value");
      }
      parsed.outDir = next;
      i += 1;
    } else if (arg === "--top") {
      parsed.top = readNumber(arg, next);
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

function formatConsoleSummary(audits: readonly DeckTemplateAudit[], top: number): string {
  const groups = summarizeDeckTemplateGroups(audits);
  const lines = [
    `Deck submission audit`,
    `Decks: ${audits.length}`,
    `Groups:`,
    ...groups.map((group) =>
      `- ${group.group}: ${group.total} decks, special ${group.allowSpecial}, avg score ${group.averagePracticalScore}, avg rating ${group.averageRating}`,
    ),
    ``,
    `Top ${top}:`,
    ...audits.slice(0, top).map((audit, index) =>
      `${index + 1}. ${audit.id} score ${audit.practicalScore} rating ${audit.averageRating} ` +
      `${audit.counts.front}/${audit.counts.back}/${audit.counts.magic}/S${audit.counts.special} ${audit.archetypes.join(",")}`,
    ),
  ];
  return lines.join("\n");
}

function formatMarkdownReport(audits: readonly DeckTemplateAudit[], top: number): string {
  const groups = summarizeDeckTemplateGroups(audits);
  const suites = getDeckBenchmarkSuites();
  return [
    `# 投稿デッキ監査レポート`,
    ``,
    `生成日時: ${new Date().toISOString()}`,
    ``,
    `## グループ概要`,
    ``,
    `| グループ | 件数 | Specialあり | 平均実践スコア | 平均評価 |`,
    `| --- | ---: | ---: | ---: | ---: |`,
    ...groups.map((group) =>
      `| ${group.group} | ${group.total} | ${group.allowSpecial} | ${group.averagePracticalScore} | ${group.averageRating} |`,
    ),
    ``,
    `## 検証スイート`,
    ``,
    `| Suite | 件数 | 用途 |`,
    `| --- | ---: | --- |`,
    ...suites.map((suite) => `| ${suite.id} | ${suite.deckPresetIds.length} | ${suite.description} |`),
    ``,
    `## 上位${top}件`,
    ``,
    `| 順位 | Preset | Score | Rating | 構成 | Archetype | Key cards |`,
    `| ---: | --- | ---: | ---: | --- | --- | --- |`,
    ...audits.slice(0, top).map((audit, index) =>
      `| ${index + 1} | ${audit.id} | ${audit.practicalScore} | ${audit.averageRating} | ` +
      `${audit.counts.front}/${audit.counts.back}/${audit.counts.magic}/S${audit.counts.special} | ` +
      `${audit.archetypes.join(", ")} | ${audit.keyCards.slice(0, 4).map((card) => `${card.name}x${card.count}`).join(", ")} |`,
    ),
    ``,
  ].join("\n");
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
  npm run audit:deck-submissions -- [options]

Options:
  --out-dir <path>   Output directory. Default: artifacts/deck-submission-audit/latest
  --top <n>          Number of top decks in summaries. Default: 8
`);
}

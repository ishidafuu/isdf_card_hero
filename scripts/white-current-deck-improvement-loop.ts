import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { CpuAiTuning } from "../src/game/cpuAi";
import { DEFAULT_PLAYER_DECK_PRESET_ID } from "../src/game/defaultDeckPresets";
import {
  formatWhiteAiTuningLoopMarkdown,
  runWhiteAiTuningLoop,
  type WhiteAiTuningOpponent,
  type WhiteAiTuningReport,
  type WhiteAiTuningStanding,
  type WhiteAiTuningVariant,
} from "../src/game/whiteAiTuningLoop";

interface CliOptions {
  screenGamesPerMatchup: number;
  confirmGamesPerMatchup: number;
  seedStart: number;
  maxSteps: number;
  maxTurns: number;
  top: number;
  markdownPath?: string;
  screenMarkdownPath?: string;
  confirmMarkdownPath?: string;
  jsonPath?: string;
  screenJsonPath?: string;
  confirmJsonPath?: string;
}

interface LoopSummary {
  generatedAt: string;
  deckPreset: string;
  screen: PhaseSummary;
  confirm: PhaseSummary;
  adopted?: AdoptionSummary;
  nextSteps: string[];
}

interface PhaseSummary {
  gamesPerMatchup: number;
  totalGames: number;
  standings: Array<{
    rank: number;
    variantId: string;
    label: string;
    score: number;
    wins: number;
    losses: number;
    draws: number;
    overall: number;
    vsBlack: number;
    vsDecoy: number;
    vsWhite: number;
    averageTurns: number;
    issues: string;
    notes: string[];
  }>;
}

interface AdoptionSummary {
  variantId: string;
  label: string;
  recommendation: "adopt" | "hold";
  reason: string;
}

const CURRENT_WHITE_DECK = DEFAULT_PLAYER_DECK_PRESET_ID;

const options = parseArgs(process.argv.slice(2));
const variants = buildVariants();
const opponents = buildOpponents();

const screenReport = runWhiteAiTuningLoop({
  variants,
  opponents,
  gamesPerMatchup: options.screenGamesPerMatchup,
  seedStart: options.seedStart,
  maxSteps: options.maxSteps,
  maxTurns: options.maxTurns,
  includeGameHistory: false,
});

const confirmVariants = selectConfirmVariants(screenReport, options.top);
const confirmSeedStart = options.seedStart + 50_000;
const confirmReport = runWhiteAiTuningLoop({
  variants: confirmVariants,
  opponents,
  gamesPerMatchup: options.confirmGamesPerMatchup,
  seedStart: confirmSeedStart,
  maxSteps: options.maxSteps,
  maxTurns: options.maxTurns,
  includeGameHistory: true,
});

const summary = buildSummary(screenReport, confirmReport);
const summaryMarkdown = formatSummaryMarkdown(summary);

console.log(formatConsole(summary));

if (options.screenMarkdownPath) {
  await writeReport(options.screenMarkdownPath, formatWhiteAiTuningLoopMarkdown(screenReport));
  console.log(`Screen Markdown: ${options.screenMarkdownPath}`);
}
if (options.confirmMarkdownPath) {
  await writeReport(options.confirmMarkdownPath, formatWhiteAiTuningLoopMarkdown(confirmReport));
  console.log(`Confirm Markdown: ${options.confirmMarkdownPath}`);
}
if (options.markdownPath) {
  await writeReport(options.markdownPath, summaryMarkdown);
  console.log(`Summary Markdown: ${options.markdownPath}`);
}
if (options.screenJsonPath) {
  await writeReport(options.screenJsonPath, JSON.stringify(compactReportForJson(screenReport), null, 2));
  console.log(`Screen JSON: ${options.screenJsonPath}`);
}
if (options.confirmJsonPath) {
  await writeReport(options.confirmJsonPath, JSON.stringify(compactReportForJson(confirmReport), null, 2));
  console.log(`Confirm JSON: ${options.confirmJsonPath}`);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(summary, null, 2));
  console.log(`Summary JSON: ${options.jsonPath}`);
}

function buildVariants(): WhiteAiTuningVariant[] {
  return [
    variant("current_white_baseline", "現行: デスシープ3 / white", undefined, "暫定白最強デッキで現行white profileを基準化する。"),
    variant("current_strong_profile", "比較: デスシープ3 / strong", undefined, "白専用補正が本当に必要かを確認するため、strong profileを横に置く。", "strong"),
    variant("current_front_work_light", "候補: 既存前衛仕事 48", {
      situationalBias: { whiteActiveFrontWorkBonus: 48 },
    }, "デスシープで前衛が厚くなったため、現行72が押しすぎていないか軽量化を見る。"),
    variant("current_front_work_strong", "候補: 既存前衛仕事 96", {
      situationalBias: { whiteActiveFrontWorkBonus: 96 },
    }, "デスシープ型でも既存前衛でこのターンの仕事をする価値をさらに押す。"),
    variant("current_black_front_threat16", "候補: 黒前衛脅威 16", {
      situationalBias: { whiteBlackFrontThreatBonus: 16 },
    }, "黒の次ターン打点源になりうる前衛処理を、現行8より強く見る。"),
    variant("current_threat_source_attack4", "候補: 脅威源攻撃 4", {
      situationalBias: { whiteThreatSourceAttackBonus: 4 },
    }, "相手マスター種別を問わず、次ターン打点源を削る攻撃を軽く押す。"),
    variant("current_threat_source_attack8", "候補: 脅威源攻撃 8", {
      situationalBias: { whiteThreatSourceAttackBonus: 8 },
    }, "脅威源処理を強め、黒/デコイ/白ミラーへの副作用を確認する。"),
    variant("current_threat_then_setup", "候補: 脅威処理後布石", {
      situationalBias: { whiteThreatSourceAttackBonus: 6, whiteSetupAfterThreatReductionBonus: 6 },
    }, "このターンの脅威処理を済ませてから、次ターンの布石へ入る順序を押す。"),
    variant("current_threat_left_low_stone_guard", "候補: 脅威残り低石布石抑制", {
      situationalBias: { whiteThreatLeftLowStoneSetupPenalty: 6 },
    }, "脅威が残ったまま石1以下へ落とす盾/起動/召喚/集中を軽く抑える。"),
    variant("current_wake_safe_work4", "候補: 安全ウェイク仕事 4", {
      situationalBias: { whiteWakeSafeWorkBonus: 4 },
    }, "味方ウェイクアップを、即仕事または次ターン仕事へ変換できる場面だけ軽く押す。"),
    variant("current_wake_safe_work8", "候補: 安全ウェイク仕事 8", {
      situationalBias: { whiteWakeSafeWorkBonus: 8 },
    }, "ウェイクアップ品質加点を強め、気合ため目的の起こし過ぎが出ないか見る。"),
    variant("current_shield_wake_quality", "候補: 盾/起動品質", {
      situationalBias: { whiteShieldThreatConversionBonus: 8, whiteWakeSafeWorkBonus: 4 },
    }, "守る価値のある盾と仕事へ変換できる起動だけを少し押す。"),
  ];
}

function variant(
  id: string,
  label: string,
  tuning: CpuAiTuning | undefined,
  hypothesis: string,
  aiProfile: WhiteAiTuningVariant["aiProfile"] = "white",
): WhiteAiTuningVariant {
  return {
    id,
    kind: tuning ? "hybrid" : "baseline",
    label,
    deckPreset: CURRENT_WHITE_DECK,
    aiProfile,
    ...(tuning ? { tuning } : {}),
    hypothesis,
  };
}

function buildOpponents(): WhiteAiTuningOpponent[] {
  return [
    {
      id: "black_pressure_strong",
      category: "black",
      label: "黒: black-pressure / strong",
      participant: "black",
      deckPreset: "black-pressure",
      aiProfile: "strong",
    },
    {
      id: "black_1375_pressure",
      category: "black",
      label: "黒: 1375 / pressure",
      participant: "black",
      deckPreset: "submission-pro-no-rare8-black-1375",
      aiProfile: "pressure",
    },
    {
      id: "decoy_back_stable",
      category: "decoy",
      label: "デコイ: 後衛安定 / enemy+16",
      participant: "decoy",
      deckPreset: "master-lab-decoy-unit-back-stable",
      aiProfile: "strong",
      labActionMargin: 12,
      labEvaluationTuning: { targetOwnerBias: { enemy: 16 } },
    },
    {
      id: "white_current_mirror",
      category: "white",
      label: "白: 暫定白最強ミラー / white",
      participant: "white",
      deckPreset: CURRENT_WHITE_DECK,
      aiProfile: "white",
    },
  ];
}

function selectConfirmVariants(report: WhiteAiTuningReport, top: number): WhiteAiTuningVariant[] {
  const byId = new Map(report.variants.map((variant) => [variant.id, variant]));
  const ids = new Set<string>(["current_white_baseline"]);
  for (const standing of report.standings) {
    ids.add(standing.variant.id);
    if (ids.size >= top + 1) {
      break;
    }
  }
  return [...ids].map((id) => {
    const variant = byId.get(id);
    if (!variant) {
      throw new Error(`Unknown confirm variant: ${id}`);
    }
    return variant;
  });
}

function buildSummary(screenReport: WhiteAiTuningReport, confirmReport: WhiteAiTuningReport): LoopSummary {
  const confirmBest = confirmReport.standings[0];
  const confirmBaseline = confirmReport.standings.find((standing) => standing.variant.id === "current_white_baseline");
  const adopted = buildAdoption(confirmBest, confirmBaseline);
  return {
    generatedAt: new Date().toISOString(),
    deckPreset: CURRENT_WHITE_DECK,
    screen: summarizePhase(screenReport),
    confirm: summarizePhase(confirmReport),
    adopted,
    nextSteps: buildNextSteps(confirmReport, adopted),
  };
}

function buildAdoption(
  best: WhiteAiTuningStanding | undefined,
  baseline: WhiteAiTuningStanding | undefined,
): AdoptionSummary | undefined {
  if (!best) {
    return undefined;
  }
  if (!baseline || best.variant.id === baseline.variant.id) {
    return {
      variantId: best.variant.id,
      label: best.variant.label,
      recommendation: "hold",
      reason: "確認ループで現行baselineが首位または比較baselineがないため、AI本体への反映は保留。",
    };
  }
  const scoreDelta = best.score - baseline.score;
  const overallDelta = best.winPointRate - baseline.winPointRate;
  const blackDelta = best.matchups.black.winPointRate - baseline.matchups.black.winPointRate;
  const whiteDelta = best.matchups.white.winPointRate - baseline.matchups.white.winPointRate;
  const hasIssue = best.failures > 0 || best.warnings > 0;
  const recommendation = scoreDelta >= 8 && overallDelta >= 0.06 && blackDelta >= -0.08 && whiteDelta >= -0.12 && !hasIssue
    ? "adopt"
    : "hold";
  return {
    variantId: best.variant.id,
    label: best.variant.label,
    recommendation,
    reason: `baseline比 score ${signed(scoreDelta)}, overall ${signedPercent(overallDelta)}, vsBlack ${signedPercent(blackDelta)}, vsWhite ${signedPercent(whiteDelta)}, issues ${best.failures}F/${best.warnings}W。`,
  };
}

function summarizePhase(report: WhiteAiTuningReport): PhaseSummary {
  return {
    gamesPerMatchup: report.gamesPerMatchup,
    totalGames: report.runs.reduce((total, run) => total + run.result.summary.games, 0),
    standings: report.standings.map((standing, index) => ({
      rank: index + 1,
      variantId: standing.variant.id,
      label: standing.variant.label,
      score: standing.score,
      wins: standing.wins,
      losses: standing.losses,
      draws: standing.draws,
      overall: standing.winPointRate,
      vsBlack: standing.matchups.black.winPointRate,
      vsDecoy: standing.matchups.decoy.winPointRate,
      vsWhite: standing.matchups.white.winPointRate,
      averageTurns: standing.averageTurns,
      issues: `${standing.failures}F/${standing.warnings}W`,
      notes: standing.notes,
    })),
  };
}

function buildNextSteps(report: WhiteAiTuningReport, adoption: AdoptionSummary | undefined): string[] {
  const baseline = report.standings.find((standing) => standing.variant.id === "current_white_baseline");
  const best = report.standings[0];
  const steps: string[] = [];
  if (!best) {
    return ["検証結果が空。候補/相手セットを確認して再実行する。"];
  }
  if (adoption?.recommendation === "adopt") {
    steps.push(`\`${best.variant.id}\` は採用候補。係数をそのままではなく、対応する局面評価として white profile に反映する。`);
  } else {
    steps.push("今回の確認では即採用せず、ベースラインを維持する。");
  }
  if (baseline && best.variant.id !== baseline.variant.id) {
    steps.push(`次は \`${best.variant.id}\` と \`current_white_baseline\` を games-per-matchup 3-4 で再確認し、seed差を潰す。`);
  }
  const weakBlack = report.standings.filter((standing) => standing.matchups.black.winPointRate < 0.5).slice(0, 3);
  if (weakBlack.length > 0) {
    steps.push("対黒がまだ不安定。負けseedから、デスシープが前に出た後の盾/ウェイク/攻撃順を重点監査する。");
  }
  steps.push("デッキ側はデスシープ3を固定し、次ループはAIだけを触る。元1377は比較対象として残す。");
  return steps;
}

function formatSummaryMarkdown(summary: LoopSummary): string {
  const adoption = summary.adopted;
  return [
    "# White Current Deck Improvement Loop",
    "",
    `生成: ${summary.generatedAt}`,
    `デッキ: \`${summary.deckPreset}\``,
    "",
    "## Summary",
    "",
    adoption
      ? `判定: **${adoption.recommendation === "adopt" ? "採用候補" : "保留"}** / \`${adoption.variantId}\` ${adoption.label}。${adoption.reason}`
      : "判定: 保留。採用候補なし。",
    "",
    "## Screen",
    "",
    formatPhaseTable(summary.screen),
    "",
    "## Confirm",
    "",
    formatPhaseTable(summary.confirm),
    "",
    "## Next Steps",
    "",
    ...summary.nextSteps.map((step) => `- ${step}`),
    "",
  ].join("\n");
}

function formatPhaseTable(phase: PhaseSummary): string {
  return [
    `試行: ${phase.gamesPerMatchup} games/matchup/direction / 総試合 ${phase.totalGames}`,
    "",
    "| Rank | Variant | Score | W-L-D | Overall | vsBlack | vsDecoy | vsWhite | Avg turns | Issues | Notes |",
    "| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |",
    ...phase.standings.map((standing) =>
      `| ${standing.rank} | ${standing.variantId}<br>${escapeCell(standing.label)} | ${standing.score} | ` +
      `${standing.wins}-${standing.losses}-${standing.draws} | ${percent(standing.overall)} | ` +
      `${percent(standing.vsBlack)} | ${percent(standing.vsDecoy)} | ${percent(standing.vsWhite)} | ` +
      `${standing.averageTurns} | ${standing.issues} | ${escapeCell(standing.notes.join("<br>"))} |`
    ),
  ].join("\n");
}

function formatConsole(summary: LoopSummary): string {
  const top = summary.confirm.standings[0];
  return [
    `White current deck loop: ${summary.deckPreset}`,
    `Screen: ${summary.screen.standings.length} variants / ${summary.screen.totalGames} games`,
    `Confirm: ${summary.confirm.standings.length} variants / ${summary.confirm.totalGames} games`,
    top
      ? `Confirm top: ${top.variantId} score ${top.score} overall ${percent(top.overall)} vsBlack ${percent(top.vsBlack)}`
      : "Confirm top: none",
    summary.adopted ? `Decision: ${summary.adopted.recommendation} (${summary.adopted.reason})` : "Decision: hold",
  ].join("\n");
}

function compactReportForJson(report: WhiteAiTuningReport): WhiteAiTuningReport {
  const compact = structuredClone(report) as WhiteAiTuningReport;
  for (const run of compact.runs) {
    for (const game of run.result.games) {
      delete game.history;
      delete game.logTail;
      delete game.stateSummary;
    }
    for (const issue of run.result.issues) {
      const compactIssue = issue as Partial<typeof issue>;
      delete compactIssue.history;
      delete compactIssue.logTail;
      delete compactIssue.stateSummary;
    }
  }
  return compact;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    screenGamesPerMatchup: 1,
    confirmGamesPerMatchup: 2,
    seedStart: 82000,
    maxSteps: 700,
    maxTurns: 160,
    top: 4,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--screen-games-per-matchup") {
      parsed.screenGamesPerMatchup = readNumber(arg, next);
      i += 1;
    } else if (arg === "--confirm-games-per-matchup") {
      parsed.confirmGamesPerMatchup = readNumber(arg, next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--top") {
      parsed.top = readNumber(arg, next);
      i += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--screen-markdown") {
      parsed.screenMarkdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--confirm-markdown") {
      parsed.confirmMarkdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--screen-json") {
      parsed.screenJsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--confirm-json") {
      parsed.confirmJsonPath = readString(arg, next);
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

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return number;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function percent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function signed(value: number): string {
  return value >= 0 ? `+${Math.round(value * 10) / 10}` : `${Math.round(value * 10) / 10}`;
}

function signedPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${percent(value)}`;
}

function escapeCell(value: string): string {
  return value.replaceAll("|", "\\|");
}

function printHelp(): void {
  console.log(`
Usage:
  npm run lab:masters:white-current-deck-loop -- [options]

Options:
  --screen-games-per-matchup <n>    Screen games per directed matchup. Default: 1
  --confirm-games-per-matchup <n>   Confirm games per directed matchup. Default: 2
  --seed-start <n>                  First screen seed. Default: 82000
  --top <n>                         Top screen variants to confirm, plus baseline. Default: 4
  --max-steps <n>                   Failure threshold per game. Default: 700
  --max-turns <n>                   Failure threshold per game. Default: 160
  --markdown <path>                 Summary Markdown output path.
  --screen-markdown <path>          Screen detail Markdown output path.
  --confirm-markdown <path>         Confirm detail Markdown output path.
  --json <path>                     Summary JSON output path.
  --screen-json <path>              Screen detail JSON output path.
  --confirm-json <path>             Confirm detail JSON output path.
`);
}

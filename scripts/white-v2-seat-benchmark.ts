import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import {
  validateAutoPlay,
  type AutoPlayGameResult,
  type AutoPlayIssue,
} from "../src/game/autoPlayValidation";
import type { CpuAiProfile } from "../src/game/cpuAi";
import type { DeckPresetId } from "../src/game/deckPresets";
import type { MasterId, PlayerId } from "../src/game/types";
import { readInteger, readString } from "./lib/cli";

type MatchupId = "white-baseline" | "black-pressure";
type CandidateSeat = "player" | "cpu";

interface CliOptions {
  seedStart: number;
  count: number;
  maxSteps: number;
  maxTurns: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface BenchGame {
  matchup: MatchupId;
  seed: number;
  candidateSeat: CandidateSeat;
  playerProfile: CpuAiProfile;
  cpuProfile: CpuAiProfile;
  playerMaster: MasterId;
  cpuMaster: MasterId;
  playerDeckPreset: DeckPresetId;
  cpuDeckPreset: DeckPresetId;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  status: "completed" | "limited" | "failed";
  unfinishedReason?: string;
  steps: number;
  turns: number;
  elapsedMs: number;
  partialLevelUpResolutionSteps: number;
  issueCount: number;
  warningCount: number;
  issues: Array<Pick<AutoPlayIssue, "kind" | "severity" | "step" | "turnNumber" | "message">>;
  stateSummary?: AutoPlayGameResult["stateSummary"];
}

interface Report {
  generatedAt: string;
  options: CliOptions & {
    candidateProfile: "white_v2";
    whiteBaselineProfile: "white";
    blackProfile: "strong";
    whiteDeckPreset: DeckPresetId;
    blackDeckPreset: DeckPresetId;
    games: number;
  };
  games: BenchGame[];
  summary: Record<MatchupId, {
    games: number;
    candidateWins: number;
    opponentWins: number;
    unfinished: number;
    failures: number;
    warnings: number;
    averageElapsedMs: number;
  }>;
  limitations: string[];
}

const WHITE_DECK: DeckPresetId = "master-lab-white-1377-death-sheep3";
const BLACK_DECK: DeckPresetId = "black-pressure";
const CANDIDATE = "white_v2" satisfies CpuAiProfile;
const BASELINE = "white" satisfies CpuAiProfile;
const BLACK_PROFILE = "strong" satisfies CpuAiProfile;
const options = parseArgs(process.argv.slice(2));
const report = await runBenchmark(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeText(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeText(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}
console.log(markdown);
if (report.games.some((game) => game.status === "failed")) {
  process.exitCode = 1;
}

async function runBenchmark(options: CliOptions): Promise<Report> {
  const games: BenchGame[] = [];
  for (const matchup of ["white-baseline", "black-pressure"] as const) {
    for (const candidateSeat of ["cpu", "player"] as const) {
      const opponentProfile = matchup === "white-baseline" ? BASELINE : BLACK_PROFILE;
      const playerIsCandidate = candidateSeat === "player";
      const playerDeckPreset = matchup === "white-baseline"
        ? WHITE_DECK
        : playerIsCandidate ? WHITE_DECK : BLACK_DECK;
      const cpuDeckPreset = matchup === "white-baseline"
        ? WHITE_DECK
        : playerIsCandidate ? BLACK_DECK : WHITE_DECK;
      const playerMaster = matchup === "white-baseline" || playerIsCandidate ? "white" : "black";
      const cpuMaster = matchup === "white-baseline" || !playerIsCandidate ? "white" : "black";
      const playerProfile = playerIsCandidate ? CANDIDATE : opponentProfile;
      const cpuProfile = playerIsCandidate ? opponentProfile : CANDIDATE;
      const result = validateAutoPlay({
        seedStart: options.seedStart,
        count: options.count,
        maxSteps: options.maxSteps,
        maxTurns: options.maxTurns,
        longGameSteps: Math.min(options.maxSteps, 300),
        longGameTurns: Math.min(options.maxTurns, 80),
        masterIds: { player: playerMaster, cpu: cpuMaster },
        aiProfiles: { player: playerProfile, cpu: cpuProfile },
        playerDeckPreset,
        cpuDeckPreset,
        onGameResult: (game) => {
          const winnerProfile = game.winner === "player" ? playerProfile : game.winner === "cpu" ? cpuProfile : undefined;
          console.log(
            `[game] ${matchup} seed=${game.seed} candidate=${candidateSeat} result=${winnerProfile ? `${winnerProfile}/${game.winner}` : "no-winner"} steps=${game.steps} ${game.elapsedMs}ms ${game.issueCount}F/${game.warningCount}W`,
          );
        },
      });
      for (const game of result.games) {
        const issues = result.issues.filter((issue) => issue.seed === game.seed).map((issue) => ({
          kind: issue.kind,
          severity: issue.severity,
          step: issue.step,
          turnNumber: issue.turnNumber,
          message: issue.message,
        }));
        games.push({
          matchup,
          seed: game.seed,
          candidateSeat,
          playerProfile,
          cpuProfile,
          playerMaster,
          cpuMaster,
          playerDeckPreset,
          cpuDeckPreset,
          winner: game.winner,
          winnerProfile: game.winner ? (game.winner === "player" ? playerProfile : cpuProfile) : undefined,
          status: game.issueCount > 0 ? "failed" : game.winner ? "completed" : "limited",
          unfinishedReason: game.winner && game.issueCount === 0
            ? undefined
            : issues.map((issue) => issue.message).join("; ") || "no winner was recorded",
          steps: game.steps,
          turns: game.turns,
          elapsedMs: game.elapsedMs,
          partialLevelUpResolutionSteps: game.partialLevelUpResolutionSteps,
          issueCount: game.issueCount,
          warningCount: game.warningCount,
          issues,
          stateSummary: game.stateSummary,
        });
      }
    }
  }
  const summary = Object.fromEntries((["white-baseline", "black-pressure"] as const).map((matchup) => {
    const subset = games.filter((game) => game.matchup === matchup);
    return [matchup, {
      games: subset.length,
      candidateWins: subset.filter((game) => game.winnerProfile === CANDIDATE).length,
      opponentWins: subset.filter((game) => game.winner && game.winnerProfile !== CANDIDATE).length,
      unfinished: subset.filter((game) => !game.winner).length,
      failures: subset.reduce((total, game) => total + game.issueCount, 0),
      warnings: subset.reduce((total, game) => total + game.warningCount, 0),
      averageElapsedMs: average(subset.map((game) => game.elapsedMs)),
    }];
  })) as Report["summary"];
  return {
    generatedAt: new Date().toISOString(),
    options: {
      ...options,
      candidateProfile: CANDIDATE,
      whiteBaselineProfile: BASELINE,
      blackProfile: BLACK_PROFILE,
      whiteDeckPreset: WHITE_DECK,
      blackDeckPreset: BLACK_DECK,
      games: games.length,
    },
    games,
    summary,
    limitations: [
      "同seed・両席を対にした機能/回帰スモークであり、少数試合は強さの証明ではない。",
      "40試合でも採用判断は行わず、勝ち筋/警告/所要時間の追加調査に限定する。",
      "時間値は環境依存の観測値で、seed再現性や勝敗の比較指標にしない。",
      "whiteLowStoneFocusMissedAttackPenalty=8は候補defaultへ追加していない。",
    ],
  };
}

function formatMarkdown(report: Report): string {
  const lines = [
    "# WhiteV2 両先攻ベンチ",
    "",
    `生成: ${report.generatedAt}`,
    `seed: ${report.options.seedStart}-${report.options.seedStart + report.options.count - 1}; games=${report.options.games}`,
    `candidate: ${CANDIDATE}; white baseline: ${BASELINE}; black: ${BLACK_PROFILE}`,
    `deck: white=${WHITE_DECK}; black=${BLACK_DECK}`,
    `limit: ${report.options.maxSteps} steps / ${report.options.maxTurns} turns`,
    "",
    "## Matchup summary",
    "",
    "| matchup | games | candidate wins | opponent wins | unfinished | failures | warnings | avg ms |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const matchup of ["white-baseline", "black-pressure"] as const) {
    const row = report.summary[matchup];
    lines.push(`| ${matchup} | ${row.games} | ${row.candidateWins} | ${row.opponentWins} | ${row.unfinished} | ${row.failures} | ${row.warnings} | ${Math.round(row.averageElapsedMs)} |`);
  }
  lines.push("", "## Every game", "", "| matchup | seed | candidate seat | P / CPU profile | P / CPU deck | result | steps / turns | partial LvUP steps | ms | issues |", "| --- | ---: | --- | --- | --- | --- | ---: | ---: | ---: | --- |");
  for (const game of report.games) {
    const issueText = game.issues.map((issue) => `${issue.severity}:${issue.kind}@${issue.step} ${issue.message}`).join("; ") || "—";
    const result = game.winner ? `${game.winnerProfile}/${game.winner} (${game.status})` : `unresolved (${game.status}): ${game.unfinishedReason}`;
    lines.push(`| ${game.matchup} | ${game.seed} | ${game.candidateSeat} | ${game.playerProfile} / ${game.cpuProfile} | ${game.playerDeckPreset} / ${game.cpuDeckPreset} | ${result.replaceAll("|", "\\|")} | ${game.steps} / ${game.turns} | ${game.partialLevelUpResolutionSteps} | ${game.elapsedMs} | ${issueText.replaceAll("|", "\\|")} |`);
  }
  lines.push("", "## Limitations", "", ...report.limitations.map((item) => `- ${item}`), "");
  return lines.join("\n");
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { seedStart: 400, count: 2, maxSteps: 500, maxTurns: 120 };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      index += 1;
    } else if (arg === "--count") {
      parsed.count = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      index += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      index += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      console.log("Usage: npm run benchmark:white-v2-seats -- [--seed-start N] [--count N] [--max-steps N] [--max-turns N] [--markdown PATH] [--json PATH]");
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  if (parsed.count < 1 || parsed.maxSteps < 1 || parsed.maxTurns < 1) {
    throw new Error("count, max-steps, and max-turns must be positive integers");
  }
  return parsed;
}

async function writeText(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

function average(values: readonly number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

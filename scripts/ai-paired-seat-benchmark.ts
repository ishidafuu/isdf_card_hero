import { writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import {
  benchmarkAiProfiles,
  type AiBenchmarkDirection,
  type AiBenchmarkGameOutcome,
  type AiBenchmarkOptions,
} from "../src/game/aiBenchmark";
import { CPU_AI_PROFILES, type CpuAiProfile } from "../src/game/cpuAi";
import { DECK_PRESET_IDS, type DeckPresetId } from "../src/game/deckPresets";
import { MASTER_IDS } from "../src/game/masters";
import type { MasterId, PlayerId } from "../src/game/types";
import { formatPercent, readInteger, readString } from "./lib/cli";

type PairedClassification =
  | "challenger_profile_sweep"
  | "baseline_profile_sweep"
  | "player_seat_sweep"
  | "cpu_seat_sweep"
  | "split_or_draw";

interface CliOptions extends AiBenchmarkOptions {
  markdownPath?: string;
  jsonPath?: string;
  streamProgress: boolean;
}

interface PairedSeedResult {
  seed: number;
  classification: PairedClassification;
  challengerAsCpu: PairedGameLine;
  challengerAsPlayer: PairedGameLine;
}

interface PairedGameLine {
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  steps: number;
  turns: number;
  playerHp?: number;
  cpuHp?: number;
  playerStones?: number;
  cpuStones?: number;
  playerUnits?: number;
  cpuUnits?: number;
  playerLevelSum?: number;
  cpuLevelSum?: number;
  issueCount: number;
  warningCount: number;
}

interface PairedReport {
  generatedAt: string;
  options: Required<Pick<CliOptions, "seedStart" | "count" | "deckPreset" | "maxSteps" | "maxTurns">> & {
    masterIds: Record<PlayerId, MasterId>;
    baselineProfile: CpuAiProfile;
    challengerProfile: CpuAiProfile;
  };
  pairs: PairedSeedResult[];
  summary: Record<PairedClassification, number> & {
    seeds: number;
    challengerPairedScore: number;
    baselinePairedScore: number;
    seatBiasSeeds: number;
    splitOrDraw: number;
  };
}

const BENCHMARK_DIRECTIONS: AiBenchmarkDirection[] = ["challenger-as-cpu", "challenger-as-player"];

const options = parseArgs(process.argv.slice(2));
const report = runReport(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeText(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeText(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(markdown);

function runReport(options: CliOptions): PairedReport {
  const baselineProfile = options.baselineProfile ?? "stable";
  const challengerProfile = options.challengerProfile ?? "strong";
  const seedStart = options.seedStart ?? 400;
  const count = options.seedEnd === undefined ? options.count ?? 20 : options.seedEnd - seedStart + 1;
  const result = benchmarkAiProfiles({
    ...options,
    seedStart,
    count,
    baselineProfile,
    challengerProfile,
    directions: BENCHMARK_DIRECTIONS,
    onGameOutcome: options.streamProgress
      ? (outcome) => console.log(`[game] seed ${outcome.seed} ${outcome.direction}: ${outcome.winnerProfile ?? "draw"}/${outcome.winner ?? "-"}, ${outcome.steps} steps / ${outcome.turns} turns`)
      : undefined,
  });
  const pairs = pairOutcomes(result.runs.flatMap((run) => run.outcomes), baselineProfile, challengerProfile);
  return {
    generatedAt: new Date().toISOString(),
    options: {
      seedStart,
      count,
      deckPreset: result.options.deckPreset,
      masterIds: result.options.masterIds,
      maxSteps: result.options.maxSteps,
      maxTurns: result.options.maxTurns,
      baselineProfile,
      challengerProfile,
    },
    pairs,
    summary: summarizePairs(pairs),
  };
}

function pairOutcomes(
  outcomes: readonly AiBenchmarkGameOutcome[],
  baselineProfile: CpuAiProfile,
  challengerProfile: CpuAiProfile,
): PairedSeedResult[] {
  const seeds = [...new Set(outcomes.map((outcome) => outcome.seed))].sort((a, b) => a - b);
  return seeds.map((seed) => {
    const challengerAsCpu = outcomes.find((outcome) => outcome.seed === seed && outcome.direction === "challenger-as-cpu");
    const challengerAsPlayer = outcomes.find((outcome) => outcome.seed === seed && outcome.direction === "challenger-as-player");
    if (!challengerAsCpu || !challengerAsPlayer) {
      throw new Error(`Missing paired outcomes for seed ${seed}`);
    }
    return {
      seed,
      classification: classifyPair(challengerAsCpu, challengerAsPlayer, baselineProfile, challengerProfile),
      challengerAsCpu: gameLine(challengerAsCpu),
      challengerAsPlayer: gameLine(challengerAsPlayer),
    };
  });
}

function classifyPair(
  challengerAsCpu: AiBenchmarkGameOutcome,
  challengerAsPlayer: AiBenchmarkGameOutcome,
  baselineProfile: CpuAiProfile,
  challengerProfile: CpuAiProfile,
): PairedClassification {
  if (
    challengerAsCpu.winnerProfile === challengerProfile &&
    challengerAsPlayer.winnerProfile === challengerProfile
  ) {
    return "challenger_profile_sweep";
  }
  if (
    challengerAsCpu.winnerProfile === baselineProfile &&
    challengerAsPlayer.winnerProfile === baselineProfile
  ) {
    return "baseline_profile_sweep";
  }
  if (challengerAsCpu.winner === "player" && challengerAsPlayer.winner === "player") {
    return "player_seat_sweep";
  }
  if (challengerAsCpu.winner === "cpu" && challengerAsPlayer.winner === "cpu") {
    return "cpu_seat_sweep";
  }
  return "split_or_draw";
}

function gameLine(outcome: AiBenchmarkGameOutcome): PairedGameLine {
  const summary = outcome.stateSummary;
  const playerSlots = summary?.slots.filter((slot) => slot.owner === "player") ?? [];
  const cpuSlots = summary?.slots.filter((slot) => slot.owner === "cpu") ?? [];
  return {
    winner: outcome.winner,
    winnerProfile: outcome.winnerProfile,
    steps: outcome.steps,
    turns: outcome.turns,
    playerHp: summary?.players.player.hp,
    cpuHp: summary?.players.cpu.hp,
    playerStones: summary?.players.player.stones,
    cpuStones: summary?.players.cpu.stones,
    playerUnits: playerSlots.length,
    cpuUnits: cpuSlots.length,
    playerLevelSum: playerSlots.reduce((total, slot) => total + (slot.level ?? 0), 0),
    cpuLevelSum: cpuSlots.reduce((total, slot) => total + (slot.level ?? 0), 0),
    issueCount: outcome.issueCount,
    warningCount: outcome.warningCount,
  };
}

function summarizePairs(pairs: readonly PairedSeedResult[]): PairedReport["summary"] {
  const counts = {
    challenger_profile_sweep: 0,
    baseline_profile_sweep: 0,
    player_seat_sweep: 0,
    cpu_seat_sweep: 0,
    split_or_draw: 0,
  } satisfies Record<PairedClassification, number>;
  for (const pair of pairs) {
    counts[pair.classification] += 1;
  }
  return {
    ...counts,
    seeds: pairs.length,
    challengerPairedScore: counts.challenger_profile_sweep,
    baselinePairedScore: counts.baseline_profile_sweep,
    seatBiasSeeds: counts.player_seat_sweep + counts.cpu_seat_sweep,
    splitOrDraw: counts.split_or_draw,
  };
}

function formatMarkdown(report: PairedReport): string {
  const summary = report.summary;
  const lines = [
    "# AI Paired Seat Benchmark",
    "",
    `生成: ${report.generatedAt}`,
    `seeds: ${report.options.seedStart}-${report.options.seedStart + report.options.count - 1}`,
    `deck: \`${report.options.deckPreset}\``,
    `masters: player \`${report.options.masterIds.player}\`, cpu \`${report.options.masterIds.cpu}\``,
    `baseline: \`${report.options.baselineProfile}\`, challenger: \`${report.options.challengerProfile}\``,
    "",
    "## Summary",
    "",
    `- challenger profile sweep: ${summary.challenger_profile_sweep}/${summary.seeds} (${formatPercent(summary.challenger_profile_sweep / Math.max(1, summary.seeds))})`,
    `- baseline profile sweep: ${summary.baseline_profile_sweep}/${summary.seeds} (${formatPercent(summary.baseline_profile_sweep / Math.max(1, summary.seeds))})`,
    `- seat-bias seeds: ${summary.seatBiasSeeds}/${summary.seeds} (${formatPercent(summary.seatBiasSeeds / Math.max(1, summary.seeds))})`,
    `- split/draw seeds: ${summary.split_or_draw}/${summary.seeds}`,
    "",
    "## Pairs",
    "",
    "| seed | class | challenger as cpu | challenger as player |",
    "| ---: | --- | --- | --- |",
  ];
  for (const pair of report.pairs) {
    lines.push(
      `| ${pair.seed} | ${pair.classification} | ${formatGameLine(pair.challengerAsCpu)} | ${formatGameLine(pair.challengerAsPlayer)} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function formatGameLine(line: PairedGameLine): string {
  const hp = line.playerHp === undefined || line.cpuHp === undefined ? "" : `, HP P${line.playerHp}/C${line.cpuHp}`;
  const stones = line.playerStones === undefined || line.cpuStones === undefined
    ? ""
    : `, stones P${line.playerStones}/C${line.cpuStones}`;
  const board = line.playerUnits === undefined || line.cpuUnits === undefined
    ? ""
    : `, board P${line.playerUnits}/Lv${line.playerLevelSum ?? 0} C${line.cpuUnits}/Lv${line.cpuLevelSum ?? 0}`;
  const issues = line.issueCount > 0 || line.warningCount > 0 ? `, ${line.issueCount}F/${line.warningCount}W` : "";
  return `${line.winnerProfile ?? "draw"}/${line.winner ?? "-"} (${line.steps} steps / ${line.turns} turns${hp}${stones}${board}${issues})`;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    streamProgress: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      index += 1;
    } else if (arg === "--seed-end") {
      parsed.seedEnd = readInteger(arg, next);
      index += 1;
    } else if (arg === "--count") {
      parsed.count = readInteger(arg, next);
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readDeckPreset(next);
      index += 1;
    } else if (arg === "--player-master") {
      parsed.masterIds = { ...parsed.masterIds, player: readMasterId(arg, next) };
      index += 1;
    } else if (arg === "--cpu-master") {
      parsed.masterIds = { ...parsed.masterIds, cpu: readMasterId(arg, next) };
      index += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      index += 1;
    } else if (arg === "--long-game-steps") {
      parsed.longGameSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--long-game-turns") {
      parsed.longGameTurns = readInteger(arg, next);
      index += 1;
    } else if (arg === "--baseline-ai") {
      parsed.baselineProfile = readAiProfile(arg, next);
      index += 1;
    } else if (arg === "--challenger-ai") {
      parsed.challengerProfile = readAiProfile(arg, next);
      index += 1;
    } else if (arg === "--stream-progress") {
      parsed.streamProgress = true;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      index += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelpAndExit();
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return parsed;
}

function readAiProfile(name: string, value: string | undefined): CpuAiProfile {
  if ((CPU_AI_PROFILES as readonly string[]).includes(value ?? "")) {
    return value as CpuAiProfile;
  }
  throw new Error(`${name} must be one of: ${CPU_AI_PROFILES.join(", ")}`);
}

function readMasterId(name: string, value: string | undefined): MasterId {
  if ((MASTER_IDS as string[]).includes(value ?? "")) {
    return value as MasterId;
  }
  throw new Error(`${name} must be one of: ${MASTER_IDS.join(", ")}`);
}

function readDeckPreset(value: string | undefined): "random" | DeckPresetId {
  if (value === "random" || (DECK_PRESET_IDS as string[]).includes(value ?? "")) {
    return value as "random" | DeckPresetId;
  }
  throw new Error(`--deck-preset must be one of: random, ${DECK_PRESET_IDS.join(", ")}`);
}

async function writeText(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run benchmark:ai-paired-seat -- [options]

Options:
  --seed-start <n>        First seed. Default: 400
  --seed-end <n>          Last seed, inclusive. Overrides --count.
  --count <n>             Number of seeds. Default: 20
  --deck-preset <id>      Deck preset. Default: random. Values: random, ${DECK_PRESET_IDS.join(", ")}
  --player-master <id>    Player master. Default: white. Values: ${MASTER_IDS.join(", ")}
  --cpu-master <id>       CPU master. Default: white. Values: ${MASTER_IDS.join(", ")}
  --max-steps <n>         Failure threshold per game. Default: 500
  --max-turns <n>         Failure threshold per game. Default: 120
  --long-game-steps <n>   Warning threshold per game. Default: 300
  --long-game-turns <n>   Warning threshold per game. Default: 80
  --baseline-ai <id>      Baseline AI profile. Default: stable. Values: ${CPU_AI_PROFILES.join(", ")}
  --challenger-ai <id>    Challenger AI profile. Default: strong. Values: ${CPU_AI_PROFILES.join(", ")}
  --stream-progress       Print one line after each game.
  --markdown <path>       Write Markdown report.
  --json <path>           Write JSON report.
`);
  process.exit(0);
}

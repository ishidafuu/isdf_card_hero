import { chooseCpuDecision, type CpuAiProfile, type CpuAiProfiles, type CpuDecision } from "../src/game/cpuAi";
import { getCardName } from "../src/game/cards";
import { createInitialGame, runAutoStep } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey, Target } from "../src/game/types";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface Options {
  seed: number;
  baselineProfile: CpuAiProfile;
  challengerProfile: CpuAiProfile;
  direction: Direction;
  maxSteps: number;
  maxDiffs: number;
  turnFrom?: number;
  turnTo?: number;
}

const options = parseArgs(process.argv.slice(2));
const profiles = profilesForDirection(options.direction, options.baselineProfile, options.challengerProfile);
const challengerPlayer = challengerPlayerForDirection(options.direction);
const result = runDecisionDiff(options, profiles, challengerPlayer);

console.log(`AI decision diff: seed ${options.seed}, ${options.direction}`);
console.log(`Profiles: player ${profiles.player}, cpu ${profiles.cpu}`);
console.log(`Winner: ${result.winner ?? "none"} after ${result.steps} steps / ${result.turnNumber} turns`);
if (options.turnFrom !== undefined || options.turnTo !== undefined) {
  console.log(`Turn filter: ${options.turnFrom ?? "start"}-${options.turnTo ?? "end"}`);
}
console.log(`Diffs: ${result.diffs.length}`);
printDecisionDiffSummary(result.diffs, options);
for (const diff of result.diffs) {
  console.log(
    [
      `- step ${diff.step}`,
      `turn ${diff.turnNumber}`,
      diff.player,
      `HP P/C ${diff.playerHp}/${diff.cpuHp}`,
      `stones P/C ${diff.playerStones}/${diff.cpuStones}`,
    ].join(" | "),
  );
  console.log(`  ${options.baselineProfile}: ${diff.baseline.text} score=${diff.baseline.score} reason=${diff.baseline.reason}`);
  console.log(`  ${options.challengerProfile}: ${diff.challenger.text} score=${diff.challenger.score} reason=${diff.challenger.reason}`);
  console.log(`  score gap: ${diff.scoreGap}`);
  console.log(`  resources: ${diff.resourceSummary}`);
  console.log(`  board: ${diff.boardSummary}`);
  if (diff.recentLog.length > 0) {
    console.log(`  recent: ${diff.recentLog.join(" / ")}`);
  }
}

interface DecisionDiff {
  step: number;
  turnNumber: number;
  player: PlayerId;
  playerHp: number;
  cpuHp: number;
  playerStones: number;
  cpuStones: number;
  baseline: DecisionSummary;
  challenger: DecisionSummary;
  scoreGap: number;
  resourceSummary: string;
  boardSummary: string;
  recentLog: string[];
}

function runDecisionDiff(options: Options, profiles: CpuAiProfiles, challengerPlayer: PlayerId) {
  let game = createInitialGame(options.seed);
  const diffs: DecisionDiff[] = [];
  let step = 0;

  for (; step < options.maxSteps && !game.winner; step += 1) {
    if (
      !game.pendingLevelUp &&
      game.currentPlayer === challengerPlayer &&
      diffs.length < options.maxDiffs &&
      isTurnInRange(game.turnNumber, options)
    ) {
      const baseline = chooseCpuDecision(game, { profile: options.baselineProfile });
      const challenger = chooseCpuDecision(game, { profile: options.challengerProfile });
      if (decisionKey(baseline) !== decisionKey(challenger)) {
        const baselineSummary = summarizeDecision(baseline);
        const challengerSummary = summarizeDecision(challenger);
        diffs.push({
          step,
          turnNumber: game.turnNumber,
          player: game.currentPlayer,
          playerHp: game.players.player.masterHp,
          cpuHp: game.players.cpu.masterHp,
          playerStones: game.players.player.stones,
          cpuStones: game.players.cpu.stones,
          baseline: baselineSummary,
          challenger: challengerSummary,
          scoreGap: decisionScoreGap(baselineSummary, challengerSummary),
          resourceSummary: resourceSummary(game),
          boardSummary: boardSummary(game),
          recentLog: game.log.slice(-3),
        });
      }
    }
    game = runAutoStep(game, { profiles });
  }

  return { winner: game.winner, steps: step, turnNumber: game.turnNumber, diffs };
}

function isTurnInRange(turnNumber: number, options: Options): boolean {
  if (options.turnFrom !== undefined && turnNumber < options.turnFrom) {
    return false;
  }
  if (options.turnTo !== undefined && turnNumber > options.turnTo) {
    return false;
  }
  return true;
}

function printDecisionDiffSummary(diffs: DecisionDiff[], options: Options): void {
  if (diffs.length === 0) {
    console.log("Summary: no profile differences in the inspected range.");
    return;
  }
  const first = diffs[0];
  const last = diffs[diffs.length - 1];
  const largestGap = diffs.reduce((best, diff) => (diff.scoreGap > best.scoreGap ? diff : best), first);
  console.log(
    `Summary: first step ${first.step}/turn ${first.turnNumber}, last step ${last.step}/turn ${last.turnNumber}, largest score gap ${largestGap.scoreGap} at step ${largestGap.step}`,
  );
  console.log(`  first ${options.baselineProfile}: ${first.baseline.text}`);
  console.log(`  first ${options.challengerProfile}: ${first.challenger.text}`);
}

interface DecisionSummary {
  text: string;
  score: number;
  reason: string;
}

function summarizeDecision(decision: CpuDecision): DecisionSummary {
  return {
    text: decisionKey(decision),
    score: decision.score,
    reason: decision.reason,
  };
}

function decisionScoreGap(baseline: DecisionSummary, challenger: DecisionSummary): number {
  return Math.abs(Math.round(challenger.score - baseline.score));
}

function resourceSummary(game: GameState): string {
  return [
    `P hand/deck/discard ${game.players.player.hand.length}/${game.players.player.deck.length}/${game.players.player.discard.length}`,
    `C hand/deck/discard ${game.players.cpu.hand.length}/${game.players.cpu.deck.length}/${game.players.cpu.discard.length}`,
  ].join(" | ");
}

function boardSummary(game: GameState): string {
  const slots: SlotKey[] = [
    "cpu_back_left",
    "cpu_back_right",
    "cpu_front_left",
    "cpu_front_right",
    "player_front_left",
    "player_front_right",
    "player_back_left",
    "player_back_right",
  ];
  return slots.map((slotKey) => slotSummary(game, slotKey)).filter(Boolean).join(" | ") || "empty";
}

function slotSummary(game: GameState, slotKey: SlotKey): string {
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return "";
  }
  const side = monster.owner === "player" ? "P" : "C";
  const status = monster.status === "prepared" ? "prep" : `act${monster.actionCount}/${monster.actionLimit}`;
  const flags = [
    monster.focused ? "気" : "",
    monster.shielded ? "盾" : "",
    monster.powerUp ? "力" : "",
  ].filter(Boolean).join("");
  return `${slotLabel(slotKey)}:${side}${getCardName(monster.cardId)} Lv${monster.level} HP${monster.hp} ${status}${flags ? ` ${flags}` : ""}`;
}

function slotLabel(slotKey: SlotKey): string {
  const [owner, row, lane] = slotKey.split("_");
  const side = owner === "player" ? "P" : "C";
  const rowLabel = row === "front" ? "F" : "B";
  const laneLabel = lane === "left" ? "L" : "R";
  return `${side}${rowLabel}${laneLabel}`;
}

function decisionKey(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}->${targetKey(decision.action.target)}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.handInstanceId}->${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${decision.action.handInstanceId}->${targetKey(decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function targetKey(target: Target): string {
  if (target.kind === "master") {
    return `master:${target.playerId}`;
  }
  if (target.kind === "monster") {
    return `monster:${target.slotKey}`;
  }
  return "unknown";
}

function parseArgs(args: string[]): Options {
  const parsed: Options = {
    seed: 430,
    baselineProfile: "stable",
    challengerProfile: "strong",
    direction: "challenger-as-cpu",
    maxSteps: 220,
    maxDiffs: 20,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--seed") {
      parsed.seed = readNumber(arg, next);
      i += 1;
    } else if (arg === "--baseline-ai") {
      parsed.baselineProfile = readProfile(arg, next);
      i += 1;
    } else if (arg === "--challenger-ai") {
      parsed.challengerProfile = readProfile(arg, next);
      i += 1;
    } else if (arg === "--direction") {
      parsed.direction = readDirection(next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-diffs") {
      parsed.maxDiffs = readNumber(arg, next);
      i += 1;
    } else if (arg === "--turn-from") {
      parsed.turnFrom = readNumber(arg, next);
      i += 1;
    } else if (arg === "--turn-to") {
      parsed.turnTo = readNumber(arg, next);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (parsed.baselineProfile === parsed.challengerProfile) {
    throw new Error("baseline and challenger profiles must differ");
  }
  assertMinimum("--seed", parsed.seed, 0);
  assertMinimum("--max-steps", parsed.maxSteps, 1);
  assertMinimum("--max-diffs", parsed.maxDiffs, 1);
  if (parsed.turnFrom !== undefined) {
    assertMinimum("--turn-from", parsed.turnFrom, 1);
  }
  if (parsed.turnTo !== undefined) {
    assertMinimum("--turn-to", parsed.turnTo, 1);
  }
  if (parsed.turnFrom !== undefined && parsed.turnTo !== undefined && parsed.turnFrom > parsed.turnTo) {
    throw new Error("--turn-from must be less than or equal to --turn-to");
  }
  return parsed;
}

function profilesForDirection(direction: Direction, baselineProfile: CpuAiProfile, challengerProfile: CpuAiProfile): CpuAiProfiles {
  return direction === "challenger-as-cpu"
    ? { player: baselineProfile, cpu: challengerProfile }
    : { player: challengerProfile, cpu: baselineProfile };
}

function challengerPlayerForDirection(direction: Direction): PlayerId {
  return direction === "challenger-as-cpu" ? "cpu" : "player";
}

function readProfile(name: string, value: string | undefined): CpuAiProfile {
  if (value === "stable" || value === "strong") {
    return value;
  }
  throw new Error(`${name} must be one of: stable, strong`);
}

function readDirection(value: string | undefined): Direction {
  if (value === "challenger-as-cpu" || value === "challenger-as-player") {
    return value;
  }
  throw new Error("--direction must be one of: challenger-as-cpu, challenger-as-player");
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

function assertMinimum(name: string, value: number, minimum: number): void {
  if (value < minimum) {
    throw new Error(`${name} must be ${minimum} or greater`);
  }
}

function printHelp(): void {
  console.log(`
Usage:
  npm run diff:ai -- [options]

Options:
  --seed <n>              Seed to replay. Default: 430
  --baseline-ai <id>      Baseline profile. Default: stable.
  --challenger-ai <id>    Challenger profile. Default: strong.
  --direction <id>        challenger-as-cpu or challenger-as-player. Default: challenger-as-cpu.
  --max-steps <n>         Maximum replay steps. Default: 220
  --max-diffs <n>         Maximum profile differences to print. Default: 20
  --turn-from <n>         Only inspect differences from this turn.
  --turn-to <n>           Only inspect differences through this turn.
`);
}

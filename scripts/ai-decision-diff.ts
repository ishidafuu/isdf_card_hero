import { chooseCpuDecision, type CpuAiProfile, type CpuAiProfiles, type CpuDecision } from "../src/game/cpuAi";
import { createInitialGame, runAutoStep } from "../src/game/rules";
import type { PlayerId, Target } from "../src/game/types";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface Options {
  seed: number;
  baselineProfile: CpuAiProfile;
  challengerProfile: CpuAiProfile;
  direction: Direction;
  maxSteps: number;
  maxDiffs: number;
}

const options = parseArgs(process.argv.slice(2));
const profiles = profilesForDirection(options.direction, options.baselineProfile, options.challengerProfile);
const challengerPlayer = challengerPlayerForDirection(options.direction);
const result = runDecisionDiff(options, profiles, challengerPlayer);

console.log(`AI decision diff: seed ${options.seed}, ${options.direction}`);
console.log(`Profiles: player ${profiles.player}, cpu ${profiles.cpu}`);
console.log(`Winner: ${result.winner ?? "none"} after ${result.steps} steps / ${result.turnNumber} turns`);
console.log(`Diffs: ${result.diffs.length}`);
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
}

function runDecisionDiff(options: Options, profiles: CpuAiProfiles, challengerPlayer: PlayerId) {
  let game = createInitialGame(options.seed);
  const diffs: Array<{
    step: number;
    turnNumber: number;
    player: PlayerId;
    playerHp: number;
    cpuHp: number;
    playerStones: number;
    cpuStones: number;
    baseline: DecisionSummary;
    challenger: DecisionSummary;
  }> = [];
  let step = 0;

  for (; step < options.maxSteps && !game.winner; step += 1) {
    if (!game.pendingLevelUp && game.currentPlayer === challengerPlayer && diffs.length < options.maxDiffs) {
      const baseline = chooseCpuDecision(game, { profile: options.baselineProfile });
      const challenger = chooseCpuDecision(game, { profile: options.challengerProfile });
      if (decisionKey(baseline) !== decisionKey(challenger)) {
        diffs.push({
          step,
          turnNumber: game.turnNumber,
          player: game.currentPlayer,
          playerHp: game.players.player.masterHp,
          cpuHp: game.players.cpu.masterHp,
          playerStones: game.players.player.stones,
          cpuStones: game.players.cpu.stones,
          baseline: summarizeDecision(baseline),
          challenger: summarizeDecision(challenger),
        });
      }
    }
    game = runAutoStep(game, { profiles });
  }

  return { winner: game.winner, steps: step, turnNumber: game.turnNumber, diffs };
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
`);
}

import { getCardName } from "../src/game/cards";
import { createCurrentWhiteAiVariant, CURRENT_WHITE_AI_MIRROR_OPPONENT } from "../src/game/currentWhiteAiFixtures";
import { runWhiteAiTuningLoop, type WhiteAiTuningLoopOptions } from "../src/game/whiteAiTuningLoop";
import type { MasterLabDecisionEvent, MasterLabGameStateSummary } from "../src/game/masterLabAutoPlay";
import type { PlayerId } from "../src/game/types";
import { escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
  maxSamples: number;
}

interface RiskAuditReport {
  generatedAt: string;
  gamesPerMatchup: number;
  seedStart: number;
  games: number;
  completed: number;
  wins: number;
  losses: number;
  draws: number;
  metrics: RiskMetrics;
  samples: RiskSample[];
  conclusion: string[];
}

interface RiskMetrics {
  turns: number;
  lowStoneHandoffs: number;
  lowStonePunished: number;
  lowStoneWithWake: number;
  lowStoneWithShield: number;
  lowStoneWithSummon: number;
  lowStonePunishedWithWake: number;
  lowStonePunishedWithShield: number;
  lowStonePunishedWithSummon: number;
  doubleShieldTurns: number;
  doubleShieldLowStone: number;
  doubleShieldPunished: number;
  doubleShieldLowStonePunished: number;
  shieldUses: number;
  secondOrLaterShieldUses: number;
  wakeUses: number;
  wakeSameTurnWork: number;
  heavyWakeUses: number;
  heavyWakeLowStone: number;
  heavyWakePunished: number;
  endWithZeroStones: number;
  endWithOneStone: number;
  averageLowStoneBoardSwing: number;
  averageHeavyWakeBoardSwing: number;
}

type RiskKind =
  | "low_stone_punished"
  | "double_shield_low_stone"
  | "heavy_wake_punished"
  | "heavy_wake"
  | "low_stone";

interface RiskSample {
  kind: RiskKind;
  seed: number;
  seat: PlayerId;
  turnNumber: number;
  finalStones: number;
  boardSwing: number;
  hpSwing: number;
  ownLost: number;
  opponentLevelGain: number;
  decisions: string;
  opponentResponse: string;
  handoff: string;
  nextOwnTurn: string;
}

interface TurnRecord {
  seed: number;
  seat: PlayerId;
  turnNumber: number;
  events: MasterLabDecisionEvent[];
  opponentEvents: MasterLabDecisionEvent[];
  handoff: MasterLabGameStateSummary;
  nextOwnTurn?: MasterLabGameStateSummary;
}

const options = parseArgs(process.argv.slice(2));
const report = runAudit(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White mirror risk audit: ${report.games} games, ${report.metrics.turns} turns`);
console.log(
  `lowStone ${report.metrics.lowStoneHandoffs}, punished ${report.metrics.lowStonePunished}, ` +
    `doubleShield ${report.metrics.doubleShieldTurns}, heavyWake ${report.metrics.heavyWakeUses}`,
);
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runAudit(options: CliOptions): RiskAuditReport {
  const variant = createCurrentWhiteAiVariant(
    "current_white_baseline",
    "現行: 暫定白最強 / white",
    undefined,
    "白ミラーで低石・二重盾・重いウェイクアップの危険パターンを監査する。",
  );
  const loopReport = runWhiteAiTuningLoop({
    ...options,
    variants: [variant],
    opponents: [CURRENT_WHITE_AI_MIRROR_OPPONENT],
    includeGameHistory: true,
  });

  const metrics = emptyMetrics();
  const samples: RiskSample[] = [];
  const lowStoneSwings: number[] = [];
  const heavyWakeSwings: number[] = [];
  let games = 0;
  let completed = 0;
  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (const run of loopReport.runs) {
    for (const game of run.result.games) {
      games += 1;
      if (game.issueCount === 0 && game.winner) {
        completed += 1;
      }
      if (game.winner === run.candidateSeat) {
        wins += 1;
      } else if (game.winner) {
        losses += 1;
      } else {
        draws += 1;
      }

      for (const turn of buildTurnRecords(game.history ?? [], run.candidateSeat)) {
        auditTurn(turn, metrics, samples, options.maxSamples, lowStoneSwings, heavyWakeSwings);
      }
    }
  }

  metrics.averageLowStoneBoardSwing = round(average(lowStoneSwings), 1);
  metrics.averageHeavyWakeBoardSwing = round(average(heavyWakeSwings), 1);

  return {
    generatedAt: loopReport.generatedAt,
    gamesPerMatchup: loopReport.gamesPerMatchup,
    seedStart: options.seedStart ?? 0,
    games,
    completed,
    wins,
    losses,
    draws,
    metrics,
    samples,
    conclusion: buildConclusion(metrics),
  };
}

function auditTurn(
  turn: TurnRecord,
  metrics: RiskMetrics,
  samples: RiskSample[],
  maxSamples: number,
  lowStoneSwings: number[],
  heavyWakeSwings: number[],
): void {
  if (turn.events.length === 0) {
    return;
  }
  metrics.turns += 1;
  const finalStones = turn.handoff.players[turn.seat].stones;
  const lowStone = finalStones <= 1;
  const wakeEvents = turn.events.filter((event) => event.decision.startsWith("master:wake_up->"));
  const shieldEvents = turn.events.filter((event) => event.decision.startsWith("master:shield->"));
  const summonEvents = turn.events.filter((event) => event.decision.startsWith("summon:"));
  const boardSwing = boardBalance(turn.nextOwnTurn ?? turn.handoff, turn.seat) - boardBalance(turn.handoff, turn.seat);
  const ownBoardSwing = boardValue(turn.nextOwnTurn ?? turn.handoff, turn.seat) - boardValue(turn.handoff, turn.seat);
  const hpSwing = hpBalance(turn.nextOwnTurn ?? turn.handoff, turn.seat) - hpBalance(turn.handoff, turn.seat);
  const ownLost = Math.max(0, ownMonsterCount(turn.handoff, turn.seat) - ownMonsterCount(turn.nextOwnTurn ?? turn.handoff, turn.seat));
  const opponentLevelGain = Math.max(0, level2PlusCount(turn.nextOwnTurn ?? turn.handoff, opponentOf(turn.seat)) - level2PlusCount(turn.handoff, opponentOf(turn.seat)));
  const punished = ownBoardSwing <= -120 || ownLost > 0 || opponentLevelGain > 0 || hpSwing <= -2;

  if (finalStones === 0) {
    metrics.endWithZeroStones += 1;
  } else if (finalStones === 1) {
    metrics.endWithOneStone += 1;
  }

  if (lowStone) {
    metrics.lowStoneHandoffs += 1;
    lowStoneSwings.push(boardSwing);
    if (punished) {
      metrics.lowStonePunished += 1;
    }
    if (wakeEvents.length > 0) {
      metrics.lowStoneWithWake += 1;
      if (punished) {
        metrics.lowStonePunishedWithWake += 1;
      }
    }
    if (shieldEvents.length > 0) {
      metrics.lowStoneWithShield += 1;
      if (punished) {
        metrics.lowStonePunishedWithShield += 1;
      }
    }
    if (summonEvents.length > 0) {
      metrics.lowStoneWithSummon += 1;
      if (punished) {
        metrics.lowStonePunishedWithSummon += 1;
      }
    }
    addSample(samples, maxSamples, turn, punished ? "low_stone_punished" : "low_stone", finalStones, boardSwing, hpSwing, ownLost, opponentLevelGain);
  }

  metrics.shieldUses += shieldEvents.length;
  metrics.secondOrLaterShieldUses += Math.max(0, shieldEvents.length - 1);
  if (shieldEvents.length >= 2) {
    metrics.doubleShieldTurns += 1;
    if (punished) {
      metrics.doubleShieldPunished += 1;
    }
    if (lowStone) {
      metrics.doubleShieldLowStone += 1;
      if (punished) {
        metrics.doubleShieldLowStonePunished += 1;
      }
      addSample(samples, maxSamples, turn, "double_shield_low_stone", finalStones, boardSwing, hpSwing, ownLost, opponentLevelGain);
    }
  }

  for (const wake of wakeEvents) {
    metrics.wakeUses += 1;
    const wakeTarget = targetSlotKeyForDecision(wake.decision);
    const sameTurnWork = !!wakeTarget && turn.events.some((event) =>
      event.step > wake.step &&
      event.turnNumber === wake.turnNumber &&
      event.decision.startsWith("attack:") &&
      actorSlotKeyForDecision(event.decision) === wakeTarget
    );
    if (sameTurnWork) {
      metrics.wakeSameTurnWork += 1;
      continue;
    }
    metrics.heavyWakeUses += 1;
    heavyWakeSwings.push(boardSwing);
    if (lowStone) {
      metrics.heavyWakeLowStone += 1;
    }
    if (punished) {
      metrics.heavyWakePunished += 1;
    }
    addSample(
      samples,
      maxSamples,
      turn,
      punished ? "heavy_wake_punished" : "heavy_wake",
      finalStones,
      boardSwing,
      hpSwing,
      ownLost,
      opponentLevelGain,
    );
  }
}

function buildTurnRecords(history: readonly MasterLabDecisionEvent[], seat: PlayerId): TurnRecord[] {
  const records: TurnRecord[] = [];
  const candidateEvents = history.filter((event) => event.player === seat && event.source === "cpu");
  const byTurn = new Map<number, MasterLabDecisionEvent[]>();
  for (const event of candidateEvents) {
    const events = byTurn.get(event.turnNumber) ?? [];
    events.push(event);
    byTurn.set(event.turnNumber, events);
  }

  for (const [turnNumber, events] of byTurn) {
    events.sort((a, b) => a.step - b.step);
    const last = events[events.length - 1];
    if (!last) {
      continue;
    }
    records.push({
      seed: last.seed,
      seat,
      turnNumber,
      events,
      opponentEvents: opponentEventsUntilNextOwnTurn(history, seat, last.step, turnNumber),
      handoff: last.after,
      nextOwnTurn: nextOwnTurnStart(history, seat, last.step, turnNumber),
    });
  }
  return records;
}

function opponentEventsUntilNextOwnTurn(
  history: readonly MasterLabDecisionEvent[],
  seat: PlayerId,
  afterStep: number,
  turnNumber: number,
): MasterLabDecisionEvent[] {
  const opponent = opponentOf(seat);
  const events: MasterLabDecisionEvent[] = [];
  for (const event of history) {
    if (event.step <= afterStep) {
      continue;
    }
    if (event.player === seat && event.turnNumber > turnNumber) {
      break;
    }
    if (event.player === opponent && event.source === "cpu") {
      events.push(event);
    }
  }
  return events;
}

function nextOwnTurnStart(
  history: readonly MasterLabDecisionEvent[],
  seat: PlayerId,
  afterStep: number,
  turnNumber: number,
): MasterLabGameStateSummary | undefined {
  const next = history.find((event) => event.player === seat && event.step > afterStep && event.turnNumber > turnNumber);
  return next?.before;
}

function addSample(
  samples: RiskSample[],
  maxSamples: number,
  turn: TurnRecord,
  kind: RiskKind,
  finalStones: number,
  boardSwing: number,
  hpSwing: number,
  ownLost: number,
  opponentLevelGain: number,
): void {
  if (samples.length >= maxSamples) {
    return;
  }
  samples.push({
    kind,
    seed: turn.seed,
    seat: turn.seat,
    turnNumber: turn.turnNumber,
    finalStones,
    boardSwing: round(boardSwing, 1),
    hpSwing,
    ownLost,
    opponentLevelGain,
    decisions: turn.events.map((event) => `${event.decision} [${round(event.score, 1)}]`).join(" -> "),
    opponentResponse: opponentResponse(turn),
    handoff: stateLine(turn.handoff, turn.seat),
    nextOwnTurn: turn.nextOwnTurn ? stateLine(turn.nextOwnTurn, turn.seat) : "-",
  });
}

function opponentResponse(turn: TurnRecord): string {
  return turn.opponentEvents.slice(0, 8).map((event) => `${event.decision} [${round(event.score, 1)}]`).join(" -> ") || "-";
}

function boardBalance(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return boardValue(summary, seat) - boardValue(summary, opponentOf(seat));
}

function hpBalance(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.players[seat].hp - summary.players[opponentOf(seat)].hp;
}

function boardValue(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.reduce((total, slot) => {
    if (!slot.card || slot.owner !== seat) {
      return total;
    }
    return total + (slot.level ?? 1) * 80 + (slot.hp ?? 0) * 18 + (slot.shielded ? 25 : 0);
  }, 0);
}

function ownMonsterCount(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.filter((slot) => slot.card && slot.owner === seat).length;
}

function level2PlusCount(summary: MasterLabGameStateSummary, seat: PlayerId): number {
  return summary.slots.filter((slot) => slot.card && slot.owner === seat && (slot.level ?? 1) >= 2).length;
}

function stateLine(summary: MasterLabGameStateSummary, seat: PlayerId): string {
  const opponent = opponentOf(seat);
  return `${seat} HP${summary.players[seat].hp} S${summary.players[seat].stones} B${boardValue(summary, seat)} / ` +
    `${opponent} HP${summary.players[opponent].hp} S${summary.players[opponent].stones} B${boardValue(summary, opponent)} / ` +
    boardLine(summary);
}

function boardLine(summary: MasterLabGameStateSummary): string {
  const occupied = summary.slots.filter((slot) => slot.card);
  if (occupied.length === 0) {
    return "-";
  }
  return occupied.map((slot) => {
    const status = slot.status ? ` ${slot.status}` : "";
    const shield = slot.shielded ? " shield" : "";
    return `${slot.slotKey}:${slot.owner}:${getCardName(slot.card ?? "")} L${slot.level} HP${slot.hp}${status}${shield}`;
  }).join(" | ");
}

function emptyMetrics(): RiskMetrics {
  return {
    turns: 0,
    lowStoneHandoffs: 0,
    lowStonePunished: 0,
    lowStoneWithWake: 0,
    lowStoneWithShield: 0,
    lowStoneWithSummon: 0,
    lowStonePunishedWithWake: 0,
    lowStonePunishedWithShield: 0,
    lowStonePunishedWithSummon: 0,
    doubleShieldTurns: 0,
    doubleShieldLowStone: 0,
    doubleShieldPunished: 0,
    doubleShieldLowStonePunished: 0,
    shieldUses: 0,
    secondOrLaterShieldUses: 0,
    wakeUses: 0,
    wakeSameTurnWork: 0,
    heavyWakeUses: 0,
    heavyWakeLowStone: 0,
    heavyWakePunished: 0,
    endWithZeroStones: 0,
    endWithOneStone: 0,
    averageLowStoneBoardSwing: 0,
    averageHeavyWakeBoardSwing: 0,
  };
}

function buildConclusion(metrics: RiskMetrics): string[] {
  const lines: string[] = [];
  lines.push(
    `低石ハンドオフは ${metrics.lowStoneHandoffs}/${metrics.turns} (${formatPercent(ratio(metrics.lowStoneHandoffs, metrics.turns))})。` +
      `そのうち罰を受けたものは ${metrics.lowStonePunished} (${formatPercent(ratio(metrics.lowStonePunished, metrics.lowStoneHandoffs))})。`,
  );
  lines.push(
    `二重盾ターンは ${metrics.doubleShieldTurns}、低石二重盾は ${metrics.doubleShieldLowStone}。` +
      `罰あり二重盾は ${metrics.doubleShieldPunished}、罰あり低石二重盾は ${metrics.doubleShieldLowStonePunished}。` +
      `second-or-later shield uses は ${metrics.secondOrLaterShieldUses}。`,
  );
  lines.push(
    `ウェイクアップは ${metrics.wakeUses} 回、同ターン仕事あり ${metrics.wakeSameTurnWork} 回、` +
      `重いウェイクアップ ${metrics.heavyWakeUses} 回。重いウェイクアップ後に罰を受けたものは ${metrics.heavyWakePunished} 回。`,
  );
  if (metrics.doubleShieldLowStonePunished > 0) {
    lines.push("二重盾は改善候補。低石でターンを返し、実害も出た二重盾だけを対象に、より強い抑制を検討する。");
  } else if (metrics.doubleShieldLowStone > 0) {
    lines.push("低石二重盾は出ているが、今回の母数では実害に直結していない。即修正より監視対象に留める。");
  }
  if (metrics.heavyWakePunished > 0) {
    lines.push("重いウェイクアップは改善候補。対象が同ターン攻撃しない、かつ低石で返す場合を中心に抑制する。");
  }
  if (metrics.lowStonePunished > 0 && metrics.heavyWakePunished === 0 && metrics.doubleShieldLowStone === 0) {
    lines.push("低石で罰を受ける局面はあるが、原因が盾/ウェイクアップ以外にも分散しているためサンプルごとの行動順監査を優先する。");
  }
  return lines;
}

function formatMarkdown(report: RiskAuditReport): string {
  const lines: string[] = [];
  const m = report.metrics;
  lines.push("# White Mirror Risk Audit");
  lines.push("");
  lines.push(`生成: ${report.generatedAt}`);
  lines.push(`gamesPerMatchup: ${report.gamesPerMatchup}, seedStart: ${report.seedStart}`);
  lines.push(`games: ${report.games}, completed: ${report.completed}, W-L-D: ${report.wins}-${report.losses}-${report.draws}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- turns: ${m.turns}`);
  lines.push(`- low stone handoffs: ${m.lowStoneHandoffs} (${formatPercent(ratio(m.lowStoneHandoffs, m.turns))})`);
  lines.push(`- low stone punished: ${m.lowStonePunished} (${formatPercent(ratio(m.lowStonePunished, m.lowStoneHandoffs))})`);
  lines.push(`- low stone with wake/shield/summon: ${m.lowStoneWithWake}/${m.lowStoneWithShield}/${m.lowStoneWithSummon}`);
  lines.push(`- low stone punished with wake/shield/summon: ${m.lowStonePunishedWithWake}/${m.lowStonePunishedWithShield}/${m.lowStonePunishedWithSummon}`);
  lines.push(`- end with 0/1 stones: ${m.endWithZeroStones}/${m.endWithOneStone}`);
  lines.push(
    `- double shield turns: ${m.doubleShieldTurns}, low-stone double shield: ${m.doubleShieldLowStone}, ` +
      `punished: ${m.doubleShieldPunished}, low-stone punished: ${m.doubleShieldLowStonePunished}, second+ shield uses: ${m.secondOrLaterShieldUses}`,
  );
  lines.push(`- wake uses: ${m.wakeUses}, same-turn work: ${m.wakeSameTurnWork}, heavy wake: ${m.heavyWakeUses}, heavy wake punished: ${m.heavyWakePunished}`);
  lines.push(`- average board swing after low-stone handoff: ${m.averageLowStoneBoardSwing}`);
  lines.push(`- average board swing after heavy wake: ${m.averageHeavyWakeBoardSwing}`);
  lines.push("");
  lines.push("## Conclusion");
  lines.push("");
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("");
  lines.push("## Samples");
  lines.push("");
  lines.push("| kind | seed | seat | turn | S | boardSwing | hpSwing | lost | oppLv+ | decisions | opponent response | handoff | next own turn |");
  lines.push("|---|---:|---|---:|---:|---:|---:|---:|---:|---|---|---|---|");
  for (const sample of report.samples) {
    lines.push(
      `| ${sample.kind} | ${sample.seed} | ${sample.seat} | ${sample.turnNumber} | ${sample.finalStones} | ` +
        `${sample.boardSwing} | ${sample.hpSwing} | ${sample.ownLost} | ${sample.opponentLevelGain} | ` +
        `${escapeMarkdownTableCell(sample.decisions)} | ${escapeMarkdownTableCell(sample.opponentResponse)} | ` +
        `${escapeMarkdownTableCell(sample.handoff)} | ` +
        `${escapeMarkdownTableCell(sample.nextOwnTurn)} |`,
    );
  }
  return lines.join("\n");
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    gamesPerMatchup: 8,
    seedStart: 966000,
    maxSteps: 650,
    maxTurns: 160,
    maxSamples: 24,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case "--games-per-matchup":
        options.gamesPerMatchup = readInteger(arg, args[++index]);
        break;
      case "--seed-start":
        options.seedStart = readInteger(arg, args[++index]);
        break;
      case "--max-steps":
        options.maxSteps = readInteger(arg, args[++index]);
        break;
      case "--max-turns":
        options.maxTurns = readInteger(arg, args[++index]);
        break;
      case "--max-samples":
        options.maxSamples = readInteger(arg, args[++index]);
        break;
      case "--markdown":
        options.markdownPath = readString(arg, args[++index]);
        break;
      case "--json":
        options.jsonPath = readString(arg, args[++index]);
        break;
      case "--help":
        printHelpAndExit();
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-mirror-risk -- [options]

Options:
  --games-per-matchup <n>  Games per seat. Default: 8
  --seed-start <n>         First seed. Default: 966000
  --max-steps <n>          Max steps per game. Default: 650
  --max-turns <n>          Max turns per game. Default: 160
  --max-samples <n>        Sample rows. Default: 24
  --markdown <path>        Write Markdown report.
  --json <path>            Write JSON report.
`);
  process.exit(0);
}

function actorSlotKeyForDecision(decision: string): string | undefined {
  if (!decision.startsWith("attack:")) {
    return undefined;
  }
  return decision.split(":")[1];
}

function targetSlotKeyForDecision(decision: string): string | undefined {
  const target = decision.split("->")[1];
  return target?.startsWith("monster:") ? target.slice("monster:".length) : undefined;
}

function opponentOf(player: PlayerId): PlayerId {
  return player === "player" ? "cpu" : "player";
}

function average(values: readonly number[]): number {
  return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function ratio(value: number, total: number): number {
  return total > 0 ? value / total : 0;
}

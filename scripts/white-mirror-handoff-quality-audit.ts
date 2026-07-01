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

interface HandoffQualityReport {
  generatedAt: string;
  gamesPerMatchup: number;
  seedStart: number;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  metrics: HandoffQualityMetrics;
  lastActionBuckets: Record<string, HandoffBucket>;
  samples: HandoffQualitySample[];
  conclusion: string[];
  nextAuditTargets: string[];
}

interface HandoffQualityMetrics {
  turns: number;
  lowStoneHandoffs: number;
  punishedHandoffs: number;
  lowStonePunished: number;
  lowStoneOk: number;
  endWithZeroStones: number;
  endWithOneStone: number;
  lowStoneAfterNonLethalFaceDamage: number;
  lowStoneAfterNonLethalFaceDamagePunished: number;
  lowStoneAfterSummon: number;
  lowStoneAfterSummonPunished: number;
  lowStoneAfterShield: number;
  lowStoneAfterShieldPunished: number;
  lowStoneShieldTargets: number;
  lowStoneShieldTargetsAttacked: number;
  lowStoneShieldTargetsIgnored: number;
  lowStoneShieldTargetsWorkedNextTurn: number;
  lowStoneShieldTargetsIgnoredAndNoWork: number;
  lowStoneShieldNoHitNoWorkPunished: number;
  lowStoneAfterMonsterNoKill: number;
  lowStoneAfterMonsterNoKillPunished: number;
  lowStoneAfterFocus: number;
  lowStoneAfterFocusPunished: number;
  lowStoneAfterNoActionEnd: number;
  lowStoneAfterNoActionEndPunished: number;
  monsterAttacksNoKill: number;
  monsterAttacksNoKillPunished: number;
  averageLowStoneOwnBoardSwing: number;
  averageLowStoneHpSwing: number;
}

interface HandoffBucket {
  turns: number;
  lowStone: number;
  punished: number;
  lowStonePunished: number;
  averageOwnBoardSwing: number;
  averageHpSwing: number;
}

type SampleKind =
  | "non_lethal_face_low_stone_punished"
  | "summon_low_stone_punished"
  | "shield_low_stone_punished"
  | "shield_absorbed_low_stone"
  | "shield_ignored_low_stone"
  | "monster_no_kill_low_stone_punished"
  | "focus_low_stone_punished"
  | "no_action_end_low_stone_punished"
  | "low_stone_ok"
  | "low_stone_punished";

interface HandoffQualitySample {
  kind: SampleKind;
  seed: number;
  seat: PlayerId;
  turnNumber: number;
  finalStones: number;
  lastActionKind: string;
  ownBoardSwing: number;
  boardSwing: number;
  hpSwing: number;
  ownLost: number;
  opponentLevelGain: number;
  ownMasterDamageTaken: number;
  nonLethalFaceDamage: number;
  monsterNoKill: number;
  shieldTargets: number;
  shieldTargetsAttacked: number;
  shieldTargetsWorkedNextTurn: number;
  shieldTargetsIgnoredAndNoWork: number;
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
  nextOwnEvents: MasterLabDecisionEvent[];
  handoff: MasterLabGameStateSummary;
  nextOwnTurn?: MasterLabGameStateSummary;
}

interface TurnAnalysis {
  finalStones: number;
  lowStone: boolean;
  punished: boolean;
  lastActionKind: string;
  ownBoardSwing: number;
  boardSwing: number;
  hpSwing: number;
  ownLost: number;
  opponentLevelGain: number;
  ownMasterDamageTaken: number;
  nonLethalFaceDamage: number;
  summonCount: number;
  shieldTargets: string[];
  shieldTargetsAttacked: number;
  shieldTargetsWorkedNextTurn: number;
  shieldTargetsIgnoredAndNoWork: number;
  monsterNoKillCount: number;
  focusCount: number;
  noActionEnd: boolean;
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

console.log(`White mirror handoff quality audit: ${report.games} games, ${report.metrics.turns} turns`);
console.log(
  `lowStone ${report.metrics.lowStoneHandoffs}, punished ${report.metrics.lowStonePunished}, ` +
    `faceLowStonePunished ${report.metrics.lowStoneAfterNonLethalFaceDamagePunished}, ` +
    `summonLowStonePunished ${report.metrics.lowStoneAfterSummonPunished}, ` +
    `shieldLowStonePunished ${report.metrics.lowStoneAfterShieldPunished}`,
);
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runAudit(options: CliOptions): HandoffQualityReport {
  const variant = createCurrentWhiteAiVariant(
    "current_white_baseline",
    "現行: 暫定白最強 / white",
    undefined,
    "白ミラーで低石ハンドオフの質を行動順ごとに監査する。",
  );
  const loopReport = runWhiteAiTuningLoop({
    ...options,
    variants: [variant],
    opponents: [CURRENT_WHITE_AI_MIRROR_OPPONENT],
    includeGameHistory: true,
  });

  const metrics = emptyMetrics();
  const samples: HandoffQualitySample[] = [];
  const lowStoneOwnBoardSwings: number[] = [];
  const lowStoneHpSwings: number[] = [];
  const bucketStats = new Map<string, MutableBucket>();
  let games = 0;
  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (const run of loopReport.runs) {
    for (const game of run.result.games) {
      games += 1;
      if (game.winner === run.candidateSeat) {
        wins += 1;
      } else if (game.winner) {
        losses += 1;
      } else {
        draws += 1;
      }

      for (const turn of buildTurnRecords(game.history ?? [], run.candidateSeat)) {
        const analysis = analyzeTurn(turn);
        accumulateMetrics(metrics, analysis);
        accumulateBucket(bucketStats, analysis);
        if (analysis.lowStone) {
          lowStoneOwnBoardSwings.push(analysis.ownBoardSwing);
          lowStoneHpSwings.push(analysis.hpSwing);
          addSamples(samples, options.maxSamples, turn, analysis);
        }
      }
    }
  }

  metrics.averageLowStoneOwnBoardSwing = round(average(lowStoneOwnBoardSwings), 1);
  metrics.averageLowStoneHpSwing = round(average(lowStoneHpSwings), 1);

  return {
    generatedAt: loopReport.generatedAt,
    gamesPerMatchup: loopReport.gamesPerMatchup,
    seedStart: options.seedStart ?? 0,
    games,
    wins,
    losses,
    draws,
    metrics,
    lastActionBuckets: finalizeBuckets(bucketStats),
    samples,
    conclusion: buildConclusion(metrics),
    nextAuditTargets: buildNextAuditTargets(metrics),
  };
}

function analyzeTurn(turn: TurnRecord): TurnAnalysis {
  const finalStones = turn.handoff.players[turn.seat].stones;
  const lowStone = finalStones <= 1;
  const nextOwnTurn = turn.nextOwnTurn ?? turn.handoff;
  const ownBoardSwing = boardValue(nextOwnTurn, turn.seat) - boardValue(turn.handoff, turn.seat);
  const boardSwing = boardBalance(nextOwnTurn, turn.seat) - boardBalance(turn.handoff, turn.seat);
  const hpSwing = hpBalance(nextOwnTurn, turn.seat) - hpBalance(turn.handoff, turn.seat);
  const ownLost = Math.max(0, ownMonsterCount(turn.handoff, turn.seat) - ownMonsterCount(nextOwnTurn, turn.seat));
  const opponentLevelGain = Math.max(
    0,
    level2PlusCount(nextOwnTurn, opponentOf(turn.seat)) - level2PlusCount(turn.handoff, opponentOf(turn.seat)),
  );
  const punished = ownBoardSwing <= -120 || ownLost > 0 || opponentLevelGain > 0 || hpSwing <= -2;
  const lastActionKind = lastActionKindOf(turn.events);
  const nonLethalFaceDamage = turn.events.reduce((total, event) => total + nonLethalFaceDamageOf(event, turn.seat), 0);
  const summonCount = turn.events.filter((event) => event.decision.startsWith("summon:")).length;
  const shieldTargets = turn.events
    .filter((event) => event.decision.startsWith("master:shield->monster:"))
    .map((event) => targetSlotKeyForDecision(event.decision))
    .filter((slotKey): slotKey is string => !!slotKey);
  const shieldTargetResults = shieldTargets.map((slotKey) => ({
    attacked: wasTargetedByOpponentWhileShielded(turn, slotKey),
    workedNextTurn: didSlotWorkNextTurn(turn, slotKey),
  }));
  const shieldTargetsAttacked = shieldTargetResults.filter((result) => result.attacked).length;
  const shieldTargetsWorkedNextTurn = shieldTargetResults.filter((result) => result.workedNextTurn).length;
  const shieldTargetsIgnoredAndNoWork = shieldTargetResults.filter((result) => !result.attacked && !result.workedNextTurn).length;
  const monsterNoKillCount = turn.events.filter((event) => isMonsterAttackNoKill(event, turn.seat)).length;
  const focusCount = turn.events.filter((event) => event.decision.startsWith("focus:")).length;
  const noActionEnd = turn.events.every((event) => event.decision === "end_turn");

  return {
    finalStones,
    lowStone,
    punished,
    lastActionKind,
    ownBoardSwing,
    boardSwing,
    hpSwing,
    ownLost,
    opponentLevelGain,
    ownMasterDamageTaken: Math.max(0, -hpSwing),
    nonLethalFaceDamage,
    summonCount,
    shieldTargets,
    shieldTargetsAttacked,
    shieldTargetsWorkedNextTurn,
    shieldTargetsIgnoredAndNoWork,
    monsterNoKillCount,
    focusCount,
    noActionEnd,
  };
}

function accumulateMetrics(metrics: HandoffQualityMetrics, analysis: TurnAnalysis): void {
  metrics.turns += 1;
  if (analysis.punished) {
    metrics.punishedHandoffs += 1;
  }
  if (!analysis.lowStone) {
    return;
  }

  metrics.lowStoneHandoffs += 1;
  if (analysis.finalStones === 0) {
    metrics.endWithZeroStones += 1;
  } else if (analysis.finalStones === 1) {
    metrics.endWithOneStone += 1;
  }
  if (analysis.punished) {
    metrics.lowStonePunished += 1;
  } else {
    metrics.lowStoneOk += 1;
  }
  if (analysis.nonLethalFaceDamage > 0) {
    metrics.lowStoneAfterNonLethalFaceDamage += 1;
    if (analysis.punished) {
      metrics.lowStoneAfterNonLethalFaceDamagePunished += 1;
    }
  }
  if (analysis.summonCount > 0) {
    metrics.lowStoneAfterSummon += 1;
    if (analysis.punished) {
      metrics.lowStoneAfterSummonPunished += 1;
    }
  }
  if (analysis.shieldTargets.length > 0) {
    metrics.lowStoneAfterShield += 1;
    metrics.lowStoneShieldTargets += analysis.shieldTargets.length;
    metrics.lowStoneShieldTargetsAttacked += analysis.shieldTargetsAttacked;
    metrics.lowStoneShieldTargetsIgnored += analysis.shieldTargets.length - analysis.shieldTargetsAttacked;
    metrics.lowStoneShieldTargetsWorkedNextTurn += analysis.shieldTargetsWorkedNextTurn;
    metrics.lowStoneShieldTargetsIgnoredAndNoWork += analysis.shieldTargetsIgnoredAndNoWork;
    if (analysis.punished) {
      metrics.lowStoneAfterShieldPunished += 1;
      if (analysis.shieldTargetsAttacked === 0 && analysis.shieldTargetsWorkedNextTurn === 0) {
        metrics.lowStoneShieldNoHitNoWorkPunished += 1;
      }
    }
  }
  if (analysis.monsterNoKillCount > 0) {
    metrics.lowStoneAfterMonsterNoKill += 1;
    metrics.monsterAttacksNoKill += analysis.monsterNoKillCount;
    if (analysis.punished) {
      metrics.lowStoneAfterMonsterNoKillPunished += 1;
      metrics.monsterAttacksNoKillPunished += analysis.monsterNoKillCount;
    }
  }
  if (analysis.focusCount > 0) {
    metrics.lowStoneAfterFocus += 1;
    if (analysis.punished) {
      metrics.lowStoneAfterFocusPunished += 1;
    }
  }
  if (analysis.noActionEnd) {
    metrics.lowStoneAfterNoActionEnd += 1;
    if (analysis.punished) {
      metrics.lowStoneAfterNoActionEndPunished += 1;
    }
  }
}

interface MutableBucket {
  turns: number;
  lowStone: number;
  punished: number;
  lowStonePunished: number;
  ownBoardSwings: number[];
  hpSwings: number[];
}

function accumulateBucket(bucketStats: Map<string, MutableBucket>, analysis: TurnAnalysis): void {
  const bucket = bucketStats.get(analysis.lastActionKind) ?? {
    turns: 0,
    lowStone: 0,
    punished: 0,
    lowStonePunished: 0,
    ownBoardSwings: [],
    hpSwings: [],
  };
  bucket.turns += 1;
  if (analysis.lowStone) {
    bucket.lowStone += 1;
  }
  if (analysis.punished) {
    bucket.punished += 1;
  }
  if (analysis.lowStone && analysis.punished) {
    bucket.lowStonePunished += 1;
  }
  bucket.ownBoardSwings.push(analysis.ownBoardSwing);
  bucket.hpSwings.push(analysis.hpSwing);
  bucketStats.set(analysis.lastActionKind, bucket);
}

function finalizeBuckets(bucketStats: Map<string, MutableBucket>): Record<string, HandoffBucket> {
  return Object.fromEntries(
    [...bucketStats.entries()]
      .sort((a, b) => b[1].lowStonePunished - a[1].lowStonePunished || b[1].lowStone - a[1].lowStone || a[0].localeCompare(b[0]))
      .map(([kind, bucket]) => [
        kind,
        {
          turns: bucket.turns,
          lowStone: bucket.lowStone,
          punished: bucket.punished,
          lowStonePunished: bucket.lowStonePunished,
          averageOwnBoardSwing: round(average(bucket.ownBoardSwings), 1),
          averageHpSwing: round(average(bucket.hpSwings), 1),
        },
      ]),
  );
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

  const turns = [...byTurn.keys()].sort((a, b) => a - b);
  for (const turnNumber of turns) {
    const events = byTurn.get(turnNumber) ?? [];
    events.sort((a, b) => a.step - b.step);
    const last = events[events.length - 1];
    if (!last) {
      continue;
    }
    const nextTurnNumber = turns.find((candidate) => candidate > turnNumber);
    records.push({
      seed: last.seed,
      seat,
      turnNumber,
      events,
      opponentEvents: opponentEventsUntilNextOwnTurn(history, seat, last.step, turnNumber),
      nextOwnEvents: nextTurnNumber !== undefined ? byTurn.get(nextTurnNumber) ?? [] : [],
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

function addSamples(
  samples: HandoffQualitySample[],
  maxSamples: number,
  turn: TurnRecord,
  analysis: TurnAnalysis,
): void {
  if (samples.length >= maxSamples) {
    return;
  }
  samples.push(sampleFor(turn, analysis, sampleKindFor(analysis)));
}

function sampleKindFor(analysis: TurnAnalysis): SampleKind {
  if (analysis.punished && analysis.nonLethalFaceDamage > 0) {
    return "non_lethal_face_low_stone_punished";
  }
  if (analysis.punished && analysis.summonCount > 0) {
    return "summon_low_stone_punished";
  }
  if (analysis.shieldTargets.length > 0 && analysis.shieldTargetsAttacked > 0) {
    return "shield_absorbed_low_stone";
  }
  if (analysis.shieldTargets.length > 0 && analysis.shieldTargetsAttacked === 0) {
    return analysis.punished ? "shield_low_stone_punished" : "shield_ignored_low_stone";
  }
  if (analysis.punished && analysis.monsterNoKillCount > 0) {
    return "monster_no_kill_low_stone_punished";
  }
  if (analysis.punished && analysis.focusCount > 0) {
    return "focus_low_stone_punished";
  }
  if (analysis.punished && analysis.noActionEnd) {
    return "no_action_end_low_stone_punished";
  }
  return analysis.punished ? "low_stone_punished" : "low_stone_ok";
}

function sampleFor(turn: TurnRecord, analysis: TurnAnalysis, kind: SampleKind): HandoffQualitySample {
  return {
    kind,
    seed: turn.seed,
    seat: turn.seat,
    turnNumber: turn.turnNumber,
    finalStones: analysis.finalStones,
    lastActionKind: analysis.lastActionKind,
    ownBoardSwing: round(analysis.ownBoardSwing, 1),
    boardSwing: round(analysis.boardSwing, 1),
    hpSwing: analysis.hpSwing,
    ownLost: analysis.ownLost,
    opponentLevelGain: analysis.opponentLevelGain,
    ownMasterDamageTaken: analysis.ownMasterDamageTaken,
    nonLethalFaceDamage: analysis.nonLethalFaceDamage,
    monsterNoKill: analysis.monsterNoKillCount,
    shieldTargets: analysis.shieldTargets.length,
    shieldTargetsAttacked: analysis.shieldTargetsAttacked,
    shieldTargetsWorkedNextTurn: analysis.shieldTargetsWorkedNextTurn,
    shieldTargetsIgnoredAndNoWork: analysis.shieldTargetsIgnoredAndNoWork,
    decisions: turn.events.map((event) => `${event.decision} [${round(event.score, 1)}]`).join(" -> "),
    opponentResponse: opponentResponse(turn),
    handoff: stateLine(turn.handoff, turn.seat),
    nextOwnTurn: turn.nextOwnTurn ? stateLine(turn.nextOwnTurn, turn.seat) : "-",
  };
}

function opponentResponse(turn: TurnRecord): string {
  return turn.opponentEvents.slice(0, 10).map((event) => `${event.decision} [${round(event.score, 1)}]`).join(" -> ") || "-";
}

function nonLethalFaceDamageOf(event: MasterLabDecisionEvent, seat: PlayerId): number {
  const opponent = opponentOf(seat);
  const targetsOpponentMaster =
    event.decision.includes(`->master:${opponent}`) &&
    (event.decision.startsWith("attack:") || event.decision.startsWith("master:master_attack->"));
  if (!targetsOpponentMaster || event.after.players[opponent].hp <= 0) {
    return 0;
  }
  return Math.max(0, event.before.players[opponent].hp - event.after.players[opponent].hp);
}

function isMonsterAttackNoKill(event: MasterLabDecisionEvent, seat: PlayerId): boolean {
  if (!event.decision.startsWith("attack:") || !event.decision.includes("->monster:")) {
    return false;
  }
  const targetSlotKey = targetSlotKeyForDecision(event.decision);
  if (!targetSlotKey) {
    return false;
  }
  const before = slotSummary(event.before, targetSlotKey);
  const after = slotSummary(event.after, targetSlotKey);
  return !!before?.card && before.owner === opponentOf(seat) && !!after?.card && after.owner === before.owner && (after.hp ?? 0) < (before.hp ?? 0);
}

function wasTargetedByOpponentWhileShielded(turn: TurnRecord, slotKey: string): boolean {
  return turn.opponentEvents.some((event) => {
    if (!event.decision.includes(`->monster:${slotKey}`)) {
      return false;
    }
    return !!slotSummary(event.before, slotKey)?.shielded;
  });
}

function didSlotWorkNextTurn(turn: TurnRecord, slotKey: string): boolean {
  return turn.nextOwnEvents.some((event) =>
    event.decision.startsWith(`attack:${slotKey}:`) ||
    event.decision === `focus:${slotKey}` ||
    levelGained(event, slotKey)
  );
}

function levelGained(event: MasterLabDecisionEvent, slotKey: string): boolean {
  const before = slotSummary(event.before, slotKey);
  const after = slotSummary(event.after, slotKey);
  return !!before?.card && !!after?.card && (after.level ?? 1) > (before.level ?? 1);
}

function lastActionKindOf(events: readonly MasterLabDecisionEvent[]): string {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const kind = decisionKind(events[index].decision);
    if (kind !== "end_turn") {
      return kind;
    }
  }
  return "end_turn";
}

function decisionKind(decision: string): string {
  if (decision.startsWith("summon:")) {
    return "summon";
  }
  if (decision.startsWith("focus:")) {
    return "focus";
  }
  if (decision.startsWith("move:")) {
    return "move";
  }
  if (decision.startsWith("magic:")) {
    return "magic";
  }
  if (decision.startsWith("master:shield->")) {
    return "shield";
  }
  if (decision.startsWith("master:wake_up->")) {
    return "wake_up";
  }
  if (decision.startsWith("master:master_attack->master:")) {
    return "master_attack_face";
  }
  if (decision.startsWith("master:master_attack->monster:")) {
    return "master_attack_monster";
  }
  if (decision.startsWith("attack:") && decision.includes("->master:")) {
    return "unit_attack_face";
  }
  if (decision.startsWith("attack:") && decision.includes("->monster:")) {
    return "unit_attack_monster";
  }
  return decision;
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

function slotSummary(summary: MasterLabGameStateSummary, slotKey: string): MasterLabGameStateSummary["slots"][number] | undefined {
  return summary.slots.find((slot) => slot.slotKey === slotKey);
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

function emptyMetrics(): HandoffQualityMetrics {
  return {
    turns: 0,
    lowStoneHandoffs: 0,
    punishedHandoffs: 0,
    lowStonePunished: 0,
    lowStoneOk: 0,
    endWithZeroStones: 0,
    endWithOneStone: 0,
    lowStoneAfterNonLethalFaceDamage: 0,
    lowStoneAfterNonLethalFaceDamagePunished: 0,
    lowStoneAfterSummon: 0,
    lowStoneAfterSummonPunished: 0,
    lowStoneAfterShield: 0,
    lowStoneAfterShieldPunished: 0,
    lowStoneShieldTargets: 0,
    lowStoneShieldTargetsAttacked: 0,
    lowStoneShieldTargetsIgnored: 0,
    lowStoneShieldTargetsWorkedNextTurn: 0,
    lowStoneShieldTargetsIgnoredAndNoWork: 0,
    lowStoneShieldNoHitNoWorkPunished: 0,
    lowStoneAfterMonsterNoKill: 0,
    lowStoneAfterMonsterNoKillPunished: 0,
    lowStoneAfterFocus: 0,
    lowStoneAfterFocusPunished: 0,
    lowStoneAfterNoActionEnd: 0,
    lowStoneAfterNoActionEndPunished: 0,
    monsterAttacksNoKill: 0,
    monsterAttacksNoKillPunished: 0,
    averageLowStoneOwnBoardSwing: 0,
    averageLowStoneHpSwing: 0,
  };
}

function buildConclusion(metrics: HandoffQualityMetrics): string[] {
  const lines: string[] = [];
  lines.push(
    `低石ハンドオフは ${metrics.lowStoneHandoffs}/${metrics.turns} (${formatPercent(ratio(metrics.lowStoneHandoffs, metrics.turns))})。` +
      `そのうち罰ありは ${metrics.lowStonePunished} (${formatPercent(ratio(metrics.lowStonePunished, metrics.lowStoneHandoffs))})。`,
  );
  lines.push(
    `低石で非リーサル顔打点を入れたターンは ${metrics.lowStoneAfterNonLethalFaceDamage}、罰あり ${metrics.lowStoneAfterNonLethalFaceDamagePunished}。` +
      `低石召喚は ${metrics.lowStoneAfterSummon}、罰あり ${metrics.lowStoneAfterSummonPunished}。`,
  );
  lines.push(
    `低石盾は ${metrics.lowStoneAfterShield}、罰あり ${metrics.lowStoneAfterShieldPunished}。` +
      `盾対象 ${metrics.lowStoneShieldTargets} のうち、相手に攻撃されたもの ${metrics.lowStoneShieldTargetsAttacked}、無視されたもの ${metrics.lowStoneShieldTargetsIgnored}、` +
      `次ターン仕事化 ${metrics.lowStoneShieldTargetsWorkedNextTurn}、攻撃も仕事化もなし ${metrics.lowStoneShieldTargetsIgnoredAndNoWork}。`,
  );
  lines.push(
    `低石かつ未撃破モンスター攻撃は ${metrics.lowStoneAfterMonsterNoKill}、罰あり ${metrics.lowStoneAfterMonsterNoKillPunished}。` +
      `低石focusは ${metrics.lowStoneAfterFocus}、罰あり ${metrics.lowStoneAfterFocusPunished}。`,
  );
  if (metrics.lowStoneAfterNonLethalFaceDamagePunished > 0) {
    lines.push("非リーサル顔打点から低石で渡す局面は、盤面制圧優先の白ミラーでは次の改善候補。");
  }
  if (metrics.lowStoneAfterSummonPunished > metrics.lowStoneAfterNonLethalFaceDamagePunished) {
    lines.push("召喚後に低石で返して罰を受ける局面が相対的に多い。召喚の価値ではなく、返しの防御余力と置き場の品質を見る必要がある。");
  }
  if (metrics.lowStoneShieldNoHitNoWorkPunished > 0) {
    lines.push("低石盾の一部は、相手の手数も吸わず次ターン仕事化もしていない。ここだけ盾抑制の候補にする。");
  } else if (metrics.lowStoneAfterShieldPunished > 0) {
    lines.push("低石盾の罰ありは出ているが、盾対象が攻撃を吸うか次ターン仕事化する例も多い。雑な盾抑制は避ける。");
  }
  if (metrics.lowStoneAfterMonsterNoKillPunished > 0) {
    lines.push("倒しきれないモンスター攻撃から低石で渡す局面は、気合ためとの比較対象として切り出せる。");
  }
  return lines;
}

function buildNextAuditTargets(metrics: HandoffQualityMetrics): string[] {
  const targets = [
    {
      label: "非リーサル顔打点後の低石ハンドオフ",
      score: metrics.lowStoneAfterNonLethalFaceDamagePunished,
    },
    {
      label: "召喚後の低石ハンドオフ",
      score: metrics.lowStoneAfterSummonPunished,
    },
    {
      label: "盾対象が相手の手数も次ターン仕事化も作らない低石シールド",
      score: metrics.lowStoneShieldTargetsIgnoredAndNoWork + metrics.lowStoneShieldNoHitNoWorkPunished,
    },
    {
      label: "倒しきれないモンスター攻撃後の低石ハンドオフ",
      score: metrics.lowStoneAfterMonsterNoKillPunished,
    },
    {
      label: "低石focus後の相手ターン被害",
      score: metrics.lowStoneAfterFocusPunished,
    },
  ];
  return targets
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .filter((target) => target.score > 0)
    .map((target) => `${target.label}: ${target.score}`);
}

function formatMarkdown(report: HandoffQualityReport): string {
  const lines: string[] = [];
  const m = report.metrics;
  lines.push("# White Mirror Handoff Quality Audit");
  lines.push("");
  lines.push(`生成: ${report.generatedAt}`);
  lines.push(`gamesPerMatchup: ${report.gamesPerMatchup}, seedStart: ${report.seedStart}`);
  lines.push(`games: ${report.games}, W-L-D: ${report.wins}-${report.losses}-${report.draws}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- turns: ${m.turns}`);
  lines.push(`- low stone handoffs: ${m.lowStoneHandoffs} (${formatPercent(ratio(m.lowStoneHandoffs, m.turns))})`);
  lines.push(`- low stone punished: ${m.lowStonePunished} (${formatPercent(ratio(m.lowStonePunished, m.lowStoneHandoffs))})`);
  lines.push(`- low stone ok: ${m.lowStoneOk}`);
  lines.push(`- end with 0/1 stones: ${m.endWithZeroStones}/${m.endWithOneStone}`);
  lines.push(`- average low-stone own board swing: ${m.averageLowStoneOwnBoardSwing}`);
  lines.push(`- average low-stone hp swing: ${m.averageLowStoneHpSwing}`);
  lines.push("");
  lines.push("## Trigger Breakdown");
  lines.push("");
  lines.push("| trigger | low stone | punished | rate |");
  lines.push("|---|---:|---:|---:|");
  lines.push(triggerRow("non-lethal face damage", m.lowStoneAfterNonLethalFaceDamage, m.lowStoneAfterNonLethalFaceDamagePunished));
  lines.push(triggerRow("summon", m.lowStoneAfterSummon, m.lowStoneAfterSummonPunished));
  lines.push(triggerRow("shield", m.lowStoneAfterShield, m.lowStoneAfterShieldPunished));
  lines.push(triggerRow("monster attack no kill", m.lowStoneAfterMonsterNoKill, m.lowStoneAfterMonsterNoKillPunished));
  lines.push(triggerRow("focus", m.lowStoneAfterFocus, m.lowStoneAfterFocusPunished));
  lines.push(triggerRow("no-action end", m.lowStoneAfterNoActionEnd, m.lowStoneAfterNoActionEndPunished));
  lines.push("");
  lines.push("## Shield Conversion");
  lines.push("");
  lines.push(`- low-stone shield targets: ${m.lowStoneShieldTargets}`);
  lines.push(`- attacked by opponent: ${m.lowStoneShieldTargetsAttacked}`);
  lines.push(`- ignored by opponent: ${m.lowStoneShieldTargetsIgnored}`);
  lines.push(`- worked next own turn: ${m.lowStoneShieldTargetsWorkedNextTurn}`);
  lines.push(`- ignored and no next-turn work: ${m.lowStoneShieldTargetsIgnoredAndNoWork}`);
  lines.push(`- punished turns with shield ignored and no next-turn work: ${m.lowStoneShieldNoHitNoWorkPunished}`);
  lines.push("");
  lines.push("## Last Action Buckets");
  lines.push("");
  lines.push("| last action | turns | low stone | punished | low stone punished | avg own board swing | avg hp swing |");
  lines.push("|---|---:|---:|---:|---:|---:|---:|");
  for (const [kind, bucket] of Object.entries(report.lastActionBuckets)) {
    lines.push(
      `| ${kind} | ${bucket.turns} | ${bucket.lowStone} | ${bucket.punished} | ${bucket.lowStonePunished} | ` +
        `${bucket.averageOwnBoardSwing} | ${bucket.averageHpSwing} |`,
    );
  }
  lines.push("");
  lines.push("## Conclusion");
  lines.push("");
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("");
  lines.push("## Next Audit Targets");
  lines.push("");
  if (report.nextAuditTargets.length === 0) {
    lines.push("- 今回の母数では明確な集中箇所なし。seedを増やして同じ監査を継続する。");
  } else {
    report.nextAuditTargets.forEach((line) => lines.push(`- ${line}`));
  }
  lines.push("");
  lines.push("## Samples");
  lines.push("");
  lines.push(
    "| kind | seed | seat | turn | S | last | ownBoard | board | hp | lost | oppLv+ | dmgTaken | face | noKill | shield | shieldHit | shieldWork | shieldNoWork | decisions | opponent response | handoff | next own turn |",
  );
  lines.push("|---|---:|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---|---|");
  for (const sample of report.samples) {
    lines.push(
      `| ${sample.kind} | ${sample.seed} | ${sample.seat} | ${sample.turnNumber} | ${sample.finalStones} | ` +
        `${sample.lastActionKind} | ${sample.ownBoardSwing} | ${sample.boardSwing} | ${sample.hpSwing} | ${sample.ownLost} | ` +
        `${sample.opponentLevelGain} | ${sample.ownMasterDamageTaken} | ${sample.nonLethalFaceDamage} | ${sample.monsterNoKill} | ` +
        `${sample.shieldTargets} | ${sample.shieldTargetsAttacked} | ${sample.shieldTargetsWorkedNextTurn} | ${sample.shieldTargetsIgnoredAndNoWork} | ` +
        `${escapeMarkdownTableCell(sample.decisions)} | ${escapeMarkdownTableCell(sample.opponentResponse)} | ` +
        `${escapeMarkdownTableCell(sample.handoff)} | ${escapeMarkdownTableCell(sample.nextOwnTurn)} |`,
    );
  }
  return lines.join("\n");
}

function triggerRow(label: string, count: number, punished: number): string {
  return `| ${label} | ${count} | ${punished} | ${formatPercent(ratio(punished, count))} |`;
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    gamesPerMatchup: 8,
    seedStart: 967000,
    maxSteps: 650,
    maxTurns: 160,
    maxSamples: 36,
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
  npm run audit:white-mirror-handoff-quality -- [options]

Options:
  --games-per-matchup <n>  Games per seat. Default: 8
  --seed-start <n>         First seed. Default: 967000
  --max-steps <n>          Max steps per game. Default: 650
  --max-turns <n>          Max turns per game. Default: 160
  --max-samples <n>        Sample rows. Default: 36
  --markdown <path>        Write Markdown report.
  --json <path>            Write JSON report.
`);
  process.exit(0);
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

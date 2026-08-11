import { getCardName, getMonsterDef } from "../src/game/cards";
import {
  CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT,
  CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT,
  CURRENT_WHITE_AI_DECOY_BACK_STABLE_OPPONENT,
  CURRENT_WHITE_AI_MIRROR_OPPONENT,
  createCurrentWhiteAiVariant,
} from "../src/game/currentWhiteAiFixtures";
import {
  runWhiteAiTuningLoop,
  type WhiteAiTuningLoopOptions,
  type WhiteAiTuningOpponent,
} from "../src/game/whiteAiTuningLoop";
import type {
  MasterLabCpuDecisionEvaluation,
  MasterLabDecisionEvent,
  MasterLabGameStateSummary,
} from "../src/game/masterLabAutoPlay";
import type { CommandDef, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";

type Outcome = "win" | "loss" | "draw";

interface CliOptions extends WhiteAiTuningLoopOptions {
  markdownPath?: string;
  jsonPath?: string;
  maxSamples: number;
}

interface HoldPlanAuditReport {
  generatedAt: string;
  gamesPerMatchup: number;
  seedStart: number;
  opponents: string[];
  games: number;
  metrics: HoldPlanMetrics;
  byOpponent: OpponentHoldPlanAudit[];
  samples: HoldPlanSample[];
  notes: string[];
  nextLoopProposal: string[];
}

interface OpponentHoldPlanAudit {
  opponentId: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  metrics: HoldPlanMetrics;
}

interface HoldPlanMetrics {
  selectedLastNoReachBackSummons: number;
  withTrace: number;
  wins: number;
  losses: number;
  draws: number;
  withOtherBacklineWorkInHand: number;
  withDeckBacklineWork: number;
  withDeckTop5BacklineWork: number;
  closeHoldAlt: number;
  mediumHoldAlt: number;
  distantHoldAlt: number;
  noHoldAlt: number;
  holdGapTotal: number;
  closeSameCardFrontAlt: number;
  sameCardFrontAlt: number;
  bestHoldAttack: number;
  bestHoldFocus: number;
  bestHoldEndTurn: number;
  bestHoldMove: number;
  bestHoldMasterAction: number;
  bestHoldMagic: number;
  bestHoldFrontSummon: number;
  bestHoldOther: number;
}

interface HoldPlanAudit {
  event: MasterLabDecisionEvent;
  opponentId: string;
  candidateSeat: PlayerId;
  outcome: Outcome;
  slotKey: SlotKey;
  cardId: string;
  cardName: string;
  frontBlocker: string;
  afterStones: number;
  selectedScore: number;
  selectedReason: string;
  followupNoWork: boolean;
  nextTurnDecisions: string[];
  handBacklineWork: string[];
  deckTop5BacklineWork: string[];
  deckBacklineWorkCount: number;
  bestHold?: MasterLabCpuDecisionEvaluation;
  bestNonSummon?: MasterLabCpuDecisionEvaluation;
  sameCardFront?: MasterLabCpuDecisionEvaluation;
  bestBacklineWorkSummon?: MasterLabCpuDecisionEvaluation;
}

interface HoldPlanSample {
  kind: string;
  opponentId: string;
  outcome: Outcome;
  candidateSeat: PlayerId;
  seed: number;
  turnNumber: number;
  step: number;
  selected: string;
  selectedScore: number;
  frontBlocker: string;
  afterStones: number;
  bestHold: string;
  bestNonSummon: string;
  sameCardFront: string;
  bestBacklineWorkSummon: string;
  pressure: string;
  nextTurn: string;
  board: string;
  reason: string;
}

type SummarySlot = MasterLabGameStateSummary["slots"][number];

const BASELINE_VARIANT = createCurrentWhiteAiVariant(
  "current_white_baseline",
  "現行: デスシープ3 / white",
  undefined,
  "暫定白最強デッキで現行white profileの最後後列枠保持判断を監査する。",
);

const ALL_OPPONENTS = [
  CURRENT_WHITE_AI_BLACK_1375_PRESSURE_OPPONENT,
  CURRENT_WHITE_AI_BLACK_PRESSURE_STRONG_OPPONENT,
  CURRENT_WHITE_AI_DECOY_BACK_STABLE_OPPONENT,
  CURRENT_WHITE_AI_MIRROR_OPPONENT,
] as const satisfies readonly WhiteAiTuningOpponent[];

const DEFAULT_OPPONENT_IDS = ["black_1375_pressure", "black_pressure_strong"] as const;

const options = parseArgs(process.argv.slice(2));
const opponents = resolveByIds(ALL_OPPONENTS, options.opponentIds, "opponent");
const loopReport = runWhiteAiTuningLoop({
  variants: [BASELINE_VARIANT],
  opponents,
  gamesPerMatchup: options.gamesPerMatchup,
  seedStart: options.seedStart,
  maxSteps: options.maxSteps,
  maxTurns: options.maxTurns,
  includeGameHistory: true,
  includeCpuDecisionEvaluations: "selected_blocked_backline_summon",
});
const report = buildReport(loopReport.runs, opponents, {
  generatedAt: new Date().toISOString(),
  gamesPerMatchup: options.gamesPerMatchup ?? 1,
  seedStart: options.seedStart ?? 137200,
  maxSamples: options.maxSamples,
});
const markdown = formatMarkdown(report);

console.log(
  `White back-slot hold plan audit: ${report.games} games / ` +
    `${report.metrics.selectedLastNoReachBackSummons} last-slot no-reach summons / ` +
    `${report.metrics.closeHoldAlt} close hold alts`,
);
for (const opponent of report.byOpponent) {
  console.log(
    `${opponent.opponentId}: ${opponent.wins}-${opponent.losses}-${opponent.draws} ` +
      `records ${opponent.metrics.selectedLastNoReachBackSummons} ` +
      `closeHold ${opponent.metrics.closeHoldAlt} top5 ${opponent.metrics.withDeckTop5BacklineWork}`,
  );
}
if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
  console.log(`JSON: ${options.jsonPath}`);
}

function buildReport(
  runs: ReturnType<typeof runWhiteAiTuningLoop>["runs"],
  opponents: readonly WhiteAiTuningOpponent[],
  context: { generatedAt: string; gamesPerMatchup: number; seedStart: number; maxSamples: number },
): HoldPlanAuditReport {
  const byOpponent = new Map<string, OpponentHoldPlanAudit>();
  const samples: HoldPlanSample[] = [];
  for (const opponent of opponents) {
    byOpponent.set(opponent.id, {
      opponentId: opponent.id,
      games: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      metrics: emptyMetrics(),
    });
  }

  for (const run of runs) {
    const record = byOpponent.get(run.opponentId);
    if (!record) {
      continue;
    }
    record.games += run.result.games.length;
    for (const game of run.result.games) {
      const outcome = outcomeFor(game.winner, run.candidateSeat);
      if (outcome === "win") {
        record.wins += 1;
      } else if (outcome === "loss") {
        record.losses += 1;
      } else {
        record.draws += 1;
      }
      const audits = auditHistory(game.history ?? [], {
        opponentId: run.opponentId,
        candidateSeat: run.candidateSeat,
        outcome,
      });
      for (const audit of audits) {
        addMetrics(record.metrics, audit);
        addSamples(samples, audit, context.maxSamples);
      }
    }
  }

  const metrics = emptyMetrics();
  for (const opponent of byOpponent.values()) {
    mergeMetrics(metrics, opponent.metrics);
  }

  return {
    generatedAt: context.generatedAt,
    gamesPerMatchup: context.gamesPerMatchup,
    seedStart: context.seedStart,
    opponents: opponents.map((opponent) => opponent.id),
    games: runs.reduce((sum, run) => sum + run.result.games.length, 0),
    metrics,
    byOpponent: [...byOpponent.values()],
    samples,
    notes: buildNotes(metrics),
    nextLoopProposal: buildNextLoopProposal(metrics),
  };
}

function auditHistory(
  history: readonly MasterLabDecisionEvent[],
  context: { opponentId: string; candidateSeat: PlayerId; outcome: Outcome },
): HoldPlanAudit[] {
  const audits: HoldPlanAudit[] = [];
  for (let index = 0; index < history.length; index += 1) {
    const event = history[index];
    if (!event || event.player !== context.candidateSeat || event.source !== "cpu") {
      continue;
    }
    const slotKey = summonSlotKeyForDecision(event.decision);
    if (!slotKey || slotRow(slotKey) !== "back") {
      continue;
    }
    if (emptyBackSlotCount(event.before, context.candidateSeat) !== 1 || emptyBackSlotCount(event.after, context.candidateSeat) !== 0) {
      continue;
    }
    if (event.after.winner === context.candidateSeat || event.reason.includes("即仕事") || event.reason.includes("ウェイク")) {
      continue;
    }
    const slot = slotByKey(event.after, slotKey);
    const front = slotByKey(event.after, frontSlotKeyFor(slotKey));
    if (!slot?.card || slot.owner !== context.candidateSeat || front?.owner !== context.candidateSeat || !front.card) {
      continue;
    }
    if (monsterHasBacklineAttackPattern(slot.card)) {
      continue;
    }
    const followup = auditFollowup(history, index, context.candidateSeat, slotKey, slot.card);
    if (!followup.nextTurnNoWork) {
      continue;
    }
    const alternatives = auditAlternatives(event, slot.card);
    const deckBacklineWork = deckBacklineWorkCards(event);
    audits.push({
      event,
      opponentId: context.opponentId,
      candidateSeat: context.candidateSeat,
      outcome: context.outcome,
      slotKey,
      cardId: slot.card,
      cardName: safeCardName(slot.card),
      frontBlocker: formatSlot(front),
      afterStones: event.after.players[context.candidateSeat].stones,
      selectedScore: selectedEvaluation(event)?.totalScore ?? event.score,
      selectedReason: event.reason,
      followupNoWork: followup.nextTurnNoWork,
      nextTurnDecisions: followup.nextTurnDecisions,
      handBacklineWork: handBacklineWorkCards(event).map((card) => card.cardName),
      deckTop5BacklineWork: deckBacklineWork.filter((card) => card.index < 5).map((card) => `${card.index + 1}:${card.cardName}`),
      deckBacklineWorkCount: deckBacklineWork.length,
      ...alternatives,
    });
  }
  return audits;
}

function auditAlternatives(
  event: MasterLabDecisionEvent,
  selectedCardId: string,
): Pick<HoldPlanAudit, "bestHold" | "bestNonSummon" | "sameCardFront" | "bestBacklineWorkSummon"> {
  const alternatives = (event.cpuDecisionEvaluations ?? [])
    .filter((evaluation) => !evaluation.selected)
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index);
  return {
    bestHold: alternatives.find(preservesLastBackSlot),
    bestNonSummon: alternatives.find((evaluation) => evaluation.type !== "summon"),
    sameCardFront: alternatives.find((evaluation) =>
      evaluation.summon?.cardId === selectedCardId && evaluation.summon.row === "front",
    ),
    bestBacklineWorkSummon: alternatives.find((evaluation) =>
      evaluation.summon?.row === "back" && monsterHasBacklineAttackPattern(evaluation.summon.cardId),
    ),
  };
}

function selectedEvaluation(event: MasterLabDecisionEvent): MasterLabCpuDecisionEvaluation | undefined {
  return event.cpuDecisionEvaluations?.find((evaluation) => evaluation.selected);
}

function preservesLastBackSlot(evaluation: MasterLabCpuDecisionEvaluation): boolean {
  if (evaluation.type === "summon") {
    return evaluation.summon?.row !== "back";
  }
  if (evaluation.type === "move") {
    const move = moveForDecision(evaluation.decision);
    return move ? slotRow(move.to) !== "back" : true;
  }
  return true;
}

function handBacklineWorkCards(event: MasterLabDecisionEvent): NonNullable<MasterLabDecisionEvent["currentPlayerHand"]> {
  const selectedHandInstanceId = summonHandInstanceIdForDecision(event.decision);
  return (event.currentPlayerHand ?? []).filter((card) =>
    card.instanceId !== selectedHandInstanceId &&
    card.type === "monster" &&
    monsterHasBacklineAttackPattern(card.cardId),
  );
}

function deckBacklineWorkCards(event: MasterLabDecisionEvent): NonNullable<MasterLabDecisionEvent["currentPlayerDeck"]> {
  return (event.currentPlayerDeck ?? []).filter((card) =>
    card.type === "monster" && monsterHasBacklineAttackPattern(card.cardId),
  );
}

function auditFollowup(
  history: readonly MasterLabDecisionEvent[],
  summonEventIndex: number,
  candidateSeat: PlayerId,
  slotKey: SlotKey,
  cardId: string,
): { nextTurnNoWork: boolean; nextTurnDecisions: string[] } {
  const nextOwnTurn = nextOwnTurnWindowAfter(history, summonEventIndex, candidateSeat);
  if (!nextOwnTurn) {
    return { nextTurnNoWork: true, nextTurnDecisions: [] };
  }
  const decisions: string[] = [];
  let trackedSlotKey: string = slotKey;
  let worked = false;
  for (let index = nextOwnTurn.startIndex; index < nextOwnTurn.endIndex; index += 1) {
    const current = history[index];
    if (!current || current.player !== candidateSeat) {
      continue;
    }
    decisions.push(current.decision);
    const moved = moveForDecision(current.decision);
    if (moved?.from === trackedSlotKey) {
      if (slotRow(moved.from) === "back" && slotRow(moved.to) === "front") {
        worked = true;
      }
      trackedSlotKey = moved.to;
    }
    const attack = attackForDecision(current.decision);
    if (attack?.actor === trackedSlotKey && slotBelongsToCard(current.before, trackedSlotKey, cardId, candidateSeat)) {
      worked = true;
    }
  }
  return { nextTurnNoWork: !worked, nextTurnDecisions: decisions };
}

function nextOwnTurnWindowAfter(
  history: readonly MasterLabDecisionEvent[],
  eventIndex: number,
  candidateSeat: PlayerId,
): { startIndex: number; endIndex: number } | undefined {
  const event = history[eventIndex];
  if (!event) {
    return undefined;
  }
  const startIndex = history.findIndex((candidate, index) =>
    index > eventIndex &&
    candidate.player === candidateSeat &&
    candidate.turnNumber > event.turnNumber,
  );
  if (startIndex < 0) {
    return undefined;
  }
  const turnNumber = history[startIndex].turnNumber;
  const endIndex = history.findIndex((candidate, index) =>
    index > startIndex &&
    (candidate.player !== candidateSeat || candidate.turnNumber !== turnNumber),
  );
  return { startIndex, endIndex: endIndex < 0 ? history.length : endIndex };
}

function addMetrics(metrics: HoldPlanMetrics, audit: HoldPlanAudit): void {
  metrics.selectedLastNoReachBackSummons += 1;
  if (audit.event.cpuDecisionEvaluations?.length) {
    metrics.withTrace += 1;
  }
  if (audit.outcome === "win") {
    metrics.wins += 1;
  } else if (audit.outcome === "loss") {
    metrics.losses += 1;
  } else {
    metrics.draws += 1;
  }
  if (audit.handBacklineWork.length > 0) {
    metrics.withOtherBacklineWorkInHand += 1;
  }
  if (audit.deckBacklineWorkCount > 0) {
    metrics.withDeckBacklineWork += 1;
  }
  if (audit.deckTop5BacklineWork.length > 0) {
    metrics.withDeckTop5BacklineWork += 1;
  }
  if (!audit.bestHold) {
    metrics.noHoldAlt += 1;
  } else {
    metrics.holdGapTotal += audit.bestHold.deltaFromSelected;
    if (audit.bestHold.deltaFromSelected <= 35) {
      metrics.closeHoldAlt += 1;
    }
    if (audit.bestHold.deltaFromSelected <= 80) {
      metrics.mediumHoldAlt += 1;
    }
    if (audit.bestHold.deltaFromSelected <= 160) {
      metrics.distantHoldAlt += 1;
    }
    addBestHoldType(metrics, audit.bestHold);
  }
  if (audit.sameCardFront) {
    metrics.sameCardFrontAlt += 1;
    if (audit.sameCardFront.deltaFromSelected <= 120) {
      metrics.closeSameCardFrontAlt += 1;
    }
  }
}

function addBestHoldType(metrics: HoldPlanMetrics, evaluation: MasterLabCpuDecisionEvaluation): void {
  if (evaluation.type === "attack") {
    metrics.bestHoldAttack += 1;
  } else if (evaluation.type === "focus") {
    metrics.bestHoldFocus += 1;
  } else if (evaluation.type === "end_turn") {
    metrics.bestHoldEndTurn += 1;
  } else if (evaluation.type === "move") {
    metrics.bestHoldMove += 1;
  } else if (evaluation.type === "master_action") {
    metrics.bestHoldMasterAction += 1;
  } else if (evaluation.type === "magic") {
    metrics.bestHoldMagic += 1;
  } else if (evaluation.type === "summon" && evaluation.summon?.row === "front") {
    metrics.bestHoldFrontSummon += 1;
  } else {
    metrics.bestHoldOther += 1;
  }
}

function addSamples(samples: HoldPlanSample[], audit: HoldPlanAudit, maxSamples: number): void {
  const kinds = sampleKinds(audit);
  for (const kind of kinds) {
    if (samples.length >= maxSamples) {
      return;
    }
    samples.push(formatSample(kind, audit));
  }
}

function sampleKinds(audit: HoldPlanAudit): string[] {
  const kinds: string[] = [];
  if (audit.bestHold && audit.bestHold.deltaFromSelected <= 35) {
    kinds.push("close_hold_alt");
  } else if (audit.bestHold && audit.bestHold.deltaFromSelected <= 80) {
    kinds.push("medium_hold_alt");
  } else if (!audit.bestHold) {
    kinds.push("no_hold_alt");
  }
  if (audit.deckTop5BacklineWork.length > 0) {
    kinds.push("top5_backline_work_wait");
  }
  if (audit.sameCardFront && audit.sameCardFront.deltaFromSelected <= 120) {
    kinds.push("same_card_front_alt");
  }
  if (kinds.length === 0 && audit.outcome === "loss") {
    kinds.push("loss_far_hold_alt");
  }
  return kinds.slice(0, 2);
}

function formatSample(kind: string, audit: HoldPlanAudit): HoldPlanSample {
  return {
    kind,
    opponentId: audit.opponentId,
    outcome: audit.outcome,
    candidateSeat: audit.candidateSeat,
    seed: audit.event.seed,
    turnNumber: audit.event.turnNumber,
    step: audit.event.step,
    selected: `${audit.cardName} -> ${audit.slotKey}`,
    selectedScore: audit.selectedScore,
    frontBlocker: audit.frontBlocker,
    afterStones: audit.afterStones,
    bestHold: formatAlternative(audit.bestHold),
    bestNonSummon: formatAlternative(audit.bestNonSummon),
    sameCardFront: formatAlternative(audit.sameCardFront),
    bestBacklineWorkSummon: formatAlternative(audit.bestBacklineWorkSummon),
    pressure: formatPressure(audit),
    nextTurn: audit.nextTurnDecisions.slice(0, 8).join(" / ") || "-",
    board: formatBoard(audit.event.after),
    reason: audit.selectedReason,
  };
}

function formatAlternative(evaluation: MasterLabCpuDecisionEvaluation | undefined): string {
  if (!evaluation) {
    return "-";
  }
  return `${evaluation.decision} / gap ${evaluation.deltaFromSelected} / total ${evaluation.totalScore}`;
}

function formatPressure(audit: HoldPlanAudit): string {
  const hand = audit.handBacklineWork.length > 0 ? audit.handBacklineWork.join(",") : "-";
  const top5 = audit.deckTop5BacklineWork.length > 0 ? audit.deckTop5BacklineWork.join(",") : "-";
  return `handBack=${hand} / deckBack=${audit.deckBacklineWorkCount} / top5=${top5}`;
}

function formatBoard(summary: MasterLabGameStateSummary): string {
  return summary.slots
    .filter((slot) => slot.card)
    .map((slot) => `${slot.slotKey}:${formatSlot(slot)}`)
    .join(" / ");
}

function formatMarkdown(report: HoldPlanAuditReport): string {
  return [
    "# White Back Slot Hold Plan Audit",
    "",
    `生成: ${report.generatedAt}`,
    `seedStart: ${report.seedStart}`,
    `相手: ${report.opponents.join(", ")}`,
    `試行: ${report.gamesPerMatchup} games/matchup/direction`,
    `総試合: ${report.games}`,
    "",
    "## Purpose",
    "",
    "最後の後列空き枠を、後列から仕事できない召喚で潰した局面について、`summon now` と `hold slot` の評価差を確認する。",
    "",
    "## Summary",
    "",
    ...formatMetricsSummary(report.metrics),
    "",
    "## Opponent Metrics",
    "",
    "| Opponent | W-L-D | Records | Trace | Close Hold | Medium Hold | Distant Hold | No Hold | Same Card Front | Hand Back | Deck Top5 | Best Hold Types |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
    ...report.byOpponent.map(formatOpponentRow),
    "",
    "## Samples",
    "",
    ...formatSamples(report.samples),
    "",
    "## Notes",
    "",
    ...report.notes.map((note) => `- ${note}`),
    "",
    "## Next Loop Proposal",
    "",
    ...report.nextLoopProposal.map((step) => `- ${step}`),
  ].join("\n");
}

function formatMetricsSummary(metrics: HoldPlanMetrics): string[] {
  return [
    `- 対象召喚: ${metrics.selectedLastNoReachBackSummons}`,
    `- 評価traceあり: ${metrics.withTrace} (${formatPercent(rate(metrics.withTrace, metrics.selectedLastNoReachBackSummons))})`,
    `- W-L-D: ${metrics.wins}-${metrics.losses}-${metrics.draws}`,
    `- Hold close <=35: ${metrics.closeHoldAlt} (${formatPercent(rate(metrics.closeHoldAlt, metrics.selectedLastNoReachBackSummons))})`,
    `- Hold medium <=80: ${metrics.mediumHoldAlt} (${formatPercent(rate(metrics.mediumHoldAlt, metrics.selectedLastNoReachBackSummons))})`,
    `- Hold distant <=160: ${metrics.distantHoldAlt} (${formatPercent(rate(metrics.distantHoldAlt, metrics.selectedLastNoReachBackSummons))})`,
    `- Hold altなし: ${metrics.noHoldAlt} (${formatPercent(rate(metrics.noHoldAlt, metrics.selectedLastNoReachBackSummons))})`,
    `- Hold gap平均: ${round(rate(metrics.holdGapTotal, metrics.selectedLastNoReachBackSummons - metrics.noHoldAlt), 1)}`,
    `- 同カード前列代替: ${metrics.sameCardFrontAlt} (${formatPercent(rate(metrics.sameCardFrontAlt, metrics.selectedLastNoReachBackSummons))})`,
    `- 同カード前列 close <=120: ${metrics.closeSameCardFrontAlt} (${formatPercent(rate(metrics.closeSameCardFrontAlt, metrics.selectedLastNoReachBackSummons))})`,
    `- 手札に他の後列仕事カード: ${metrics.withOtherBacklineWorkInHand} (${formatPercent(rate(metrics.withOtherBacklineWorkInHand, metrics.selectedLastNoReachBackSummons))})`,
    `- 山札に後列仕事カード: ${metrics.withDeckBacklineWork} (${formatPercent(rate(metrics.withDeckBacklineWork, metrics.selectedLastNoReachBackSummons))})`,
    `- 山札上位5枚に後列仕事カード: ${metrics.withDeckTop5BacklineWork} (${formatPercent(rate(metrics.withDeckTop5BacklineWork, metrics.selectedLastNoReachBackSummons))})`,
    `- Best hold type: ${formatBestHoldTypes(metrics)}`,
  ];
}

function formatOpponentRow(audit: OpponentHoldPlanAudit): string {
  const m = audit.metrics;
  return [
    escapeMarkdownTableCell(audit.opponentId),
    `${audit.wins}-${audit.losses}-${audit.draws}`,
    m.selectedLastNoReachBackSummons,
    formatCountRate(m.withTrace, m.selectedLastNoReachBackSummons),
    formatCountRate(m.closeHoldAlt, m.selectedLastNoReachBackSummons),
    formatCountRate(m.mediumHoldAlt, m.selectedLastNoReachBackSummons),
    formatCountRate(m.distantHoldAlt, m.selectedLastNoReachBackSummons),
    formatCountRate(m.noHoldAlt, m.selectedLastNoReachBackSummons),
    formatCountRate(m.sameCardFrontAlt, m.selectedLastNoReachBackSummons),
    formatCountRate(m.withOtherBacklineWorkInHand, m.selectedLastNoReachBackSummons),
    formatCountRate(m.withDeckTop5BacklineWork, m.selectedLastNoReachBackSummons),
    escapeMarkdownTableCell(formatBestHoldTypes(m)),
  ].join(" | ").replace(/^/, "| ").concat(" |");
}

function formatSamples(samples: readonly HoldPlanSample[]): string[] {
  if (samples.length === 0) {
    return ["対象サンプルなし。"];
  }
  return samples.flatMap((sample) => [
    `### ${sample.kind}: ${sample.selected} seed ${sample.seed} turn ${sample.turnNumber}`,
    "",
    `- opponent/outcome: \`${sample.opponentId}\` / ${sample.candidateSeat} ${sample.outcome}`,
    `- selected: ${sample.selected} / score ${sample.selectedScore} / front ${sample.frontBlocker} / stones ${sample.afterStones}`,
    `- best hold: ${sample.bestHold}`,
    `- best non-summon: ${sample.bestNonSummon}`,
    `- same card front: ${sample.sameCardFront}`,
    `- best backline-work summon: ${sample.bestBacklineWorkSummon}`,
    `- pressure: ${sample.pressure}`,
    `- next turn: ${sample.nextTurn}`,
    `- reason: ${sample.reason}`,
    `- board: ${sample.board}`,
    "",
  ]);
}

function buildNotes(metrics: HoldPlanMetrics): string[] {
  const notes: string[] = [];
  if (metrics.selectedLastNoReachBackSummons === 0) {
    return ["今回の母数では最後の後列枠を潰す射程なし召喚は出ていない。"];
  }
  if (rate(metrics.closeHoldAlt, metrics.selectedLastNoReachBackSummons) >= 0.25) {
    notes.push("近い hold slot 代替が一定数ある。候補生成には残っているため、評価調整で拾える可能性が高い。");
  }
  if (rate(metrics.mediumHoldAlt, metrics.selectedLastNoReachBackSummons) >= 0.5) {
    notes.push("中距離の hold slot 代替が多い。強い禁止ではなく、ターン計画比較の追加評価が向いている。");
  }
  if (rate(metrics.withDeckTop5BacklineWork, metrics.selectedLastNoReachBackSummons) >= 0.25) {
    notes.push("山札上位5枚に後列仕事カードが残る例が多い。近い将来の置き場価値を局面評価に入れる価値がある。");
  }
  if (rate(metrics.sameCardFrontAlt, metrics.selectedLastNoReachBackSummons) >= 0.25) {
    notes.push("同カード前列代替が一定数ある。後列に置くより前列召喚または保留を比較する価値がある。");
  }
  if (rate(metrics.noHoldAlt, metrics.selectedLastNoReachBackSummons) >= 0.4) {
    notes.push("hold slot 代替がtrace上にない例が多い。評価以前に候補幅やtrace上限で落ちていないか確認が必要。");
  }
  return notes;
}

function buildNextLoopProposal(metrics: HoldPlanMetrics): string[] {
  if (metrics.selectedLastNoReachBackSummons === 0) {
    return [
      "母数を増やすか、seed 137100 のような既知bad seedを固定して再現監査する。",
    ];
  }
  const steps = [
    "次は勝率係数ではなく、最後の後列枠を潰す召喚に対して `bestHold.deltaFromSelected` を記録する回帰ケースを作る。",
  ];
  if (metrics.mediumHoldAlt > 0) {
    steps.push("`hold slot` 候補が80点以内にある局面だけ、後列仕事カードの近いドローと同カード前列代替を加点/減点候補にする。");
  }
  if (metrics.withDeckTop5BacklineWork > 0) {
    steps.push("山札上位5枚に後列仕事カードがある場合だけ、枠保持の局面評価を追加する。全体の後列枠保存にはしない。");
  }
  steps.push("採用候補は黒限定 no-history で小母数確認し、白ミラーは最後に副作用確認だけ行う。");
  return steps;
}

function emptyMetrics(): HoldPlanMetrics {
  return {
    selectedLastNoReachBackSummons: 0,
    withTrace: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    withOtherBacklineWorkInHand: 0,
    withDeckBacklineWork: 0,
    withDeckTop5BacklineWork: 0,
    closeHoldAlt: 0,
    mediumHoldAlt: 0,
    distantHoldAlt: 0,
    noHoldAlt: 0,
    holdGapTotal: 0,
    closeSameCardFrontAlt: 0,
    sameCardFrontAlt: 0,
    bestHoldAttack: 0,
    bestHoldFocus: 0,
    bestHoldEndTurn: 0,
    bestHoldMove: 0,
    bestHoldMasterAction: 0,
    bestHoldMagic: 0,
    bestHoldFrontSummon: 0,
    bestHoldOther: 0,
  };
}

function mergeMetrics(target: HoldPlanMetrics, source: HoldPlanMetrics): void {
  for (const key of Object.keys(target) as Array<keyof HoldPlanMetrics>) {
    target[key] += source[key];
  }
}

function outcomeFor(winner: PlayerId | undefined, candidateSeat: PlayerId): Outcome {
  if (!winner) {
    return "draw";
  }
  return winner === candidateSeat ? "win" : "loss";
}

function summonSlotKeyForDecision(decision: string): SlotKey | undefined {
  if (!decision.startsWith("summon:")) {
    return undefined;
  }
  const slotKey = decision.split("->")[1];
  return isSlotKey(slotKey) ? slotKey : undefined;
}

function summonHandInstanceIdForDecision(decision: string): string | undefined {
  if (!decision.startsWith("summon:")) {
    return undefined;
  }
  return decision.slice("summon:".length).split("->")[0] || undefined;
}

function attackForDecision(decision: string): { actor: string } | undefined {
  if (!decision.startsWith("attack:")) {
    return undefined;
  }
  const actor = decision.split(":")[1];
  return actor ? { actor } : undefined;
}

function moveForDecision(decision: string): { from: string; to: string } | undefined {
  if (!decision.startsWith("move:")) {
    return undefined;
  }
  const [from, to] = decision.slice("move:".length).split("->");
  return from && to ? { from, to } : undefined;
}

function slotBelongsToCard(
  summary: MasterLabGameStateSummary,
  slotKey: string,
  cardId: string,
  owner: PlayerId,
): boolean {
  const slot = slotByKey(summary, slotKey);
  return slot?.owner === owner && slot.card === cardId;
}

function slotByKey(summary: MasterLabGameStateSummary, slotKey: string): SummarySlot | undefined {
  return summary.slots.find((slot) => slot.slotKey === slotKey);
}

function emptyBackSlotCount(summary: MasterLabGameStateSummary, playerId: PlayerId): number {
  return summary.slots.filter((slot) =>
    slot.owner !== "cpu" &&
    slot.owner !== "player" &&
    slot.slotKey.startsWith(`${playerId}_back_`),
  ).length;
}

function frontSlotKeyFor(slotKey: SlotKey): SlotKey {
  const [owner, , lane] = slotKey.split("_") as [PlayerId, "back", "left" | "right"];
  return `${owner}_front_${lane}`;
}

function slotRow(slotKey: string): "front" | "back" {
  return slotKey.includes("_front_") ? "front" : "back";
}

function isSlotKey(value: string | undefined): value is SlotKey {
  return value === "player_front_left" ||
    value === "player_front_right" ||
    value === "player_back_left" ||
    value === "player_back_right" ||
    value === "cpu_front_left" ||
    value === "cpu_front_right" ||
    value === "cpu_back_left" ||
    value === "cpu_back_right";
}

function monsterHasBacklineAttackPattern(cardId: string): boolean {
  const def = getMonsterDef(cardId);
  return def.levels.some((level) => level.commands.some(commandHasBacklineAttackPattern));
}

function commandHasBacklineAttackPattern(command: CommandDef): boolean {
  if (!command.implemented || command.power <= 0) {
    return false;
  }
  if (command.rangeText === "前衛攻撃" || command.rangeText === "後衛攻撃" || command.rangeText === "桂馬飛び") {
    return true;
  }
  return [
    "one_skip",
    "two_skip",
    "straight",
    "piercing",
    "decreasing_straight",
    "line",
    "any_monster",
    "any_target",
    "master",
  ].includes(command.range);
}

function safeCardName(cardId: string): string {
  try {
    return getCardName(cardId);
  } catch {
    return cardId;
  }
}

function formatSlot(slot: SummarySlot | undefined): string {
  if (!slot?.card) {
    return "-";
  }
  return `${safeCardName(slot.card)} Lv${slot.level ?? "?"} HP${slot.hp ?? "?"}${slot.status === "prepared" ? " prep" : ""}`;
}

function formatBestHoldTypes(metrics: HoldPlanMetrics): string {
  return [
    metrics.bestHoldAttack > 0 ? `attack:${metrics.bestHoldAttack}` : undefined,
    metrics.bestHoldFocus > 0 ? `focus:${metrics.bestHoldFocus}` : undefined,
    metrics.bestHoldEndTurn > 0 ? `end:${metrics.bestHoldEndTurn}` : undefined,
    metrics.bestHoldMove > 0 ? `move:${metrics.bestHoldMove}` : undefined,
    metrics.bestHoldMasterAction > 0 ? `master:${metrics.bestHoldMasterAction}` : undefined,
    metrics.bestHoldMagic > 0 ? `magic:${metrics.bestHoldMagic}` : undefined,
    metrics.bestHoldFrontSummon > 0 ? `frontSummon:${metrics.bestHoldFrontSummon}` : undefined,
    metrics.bestHoldOther > 0 ? `other:${metrics.bestHoldOther}` : undefined,
  ].filter(Boolean).join(", ") || "-";
}

function formatCountRate(count: number, total: number): string {
  return `${count} (${formatPercent(rate(count, total))})`;
}

function rate(count: number, total: number): number {
  return total > 0 ? count / total : 0;
}

function parseArgs(args: string[]): CliOptions & { opponentIds: readonly string[] } {
  const opponentIds: string[] = [];
  const parsed: CliOptions = {
    gamesPerMatchup: 1,
    seedStart: 137200,
    maxSteps: 220,
    maxTurns: 70,
    maxSamples: 40,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--games-per-matchup") {
      parsed.gamesPerMatchup = readInteger(arg, next);
      i += 1;
    } else if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      i += 1;
    } else if (arg === "--opponent") {
      opponentIds.push(readString(arg, next));
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      i += 1;
    } else if (arg === "--max-samples") {
      parsed.maxSamples = readInteger(arg, next);
      i += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      i += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return {
    ...parsed,
    opponentIds: opponentIds.length > 0 ? opponentIds : [...DEFAULT_OPPONENT_IDS],
  };
}

function resolveByIds<T extends { id: string }>(items: readonly T[], ids: readonly string[], label: string): T[] {
  return ids.map((id) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) {
      throw new Error(`Unknown ${label}: ${id}`);
    }
    return item;
  });
}

function printHelp(): void {
  console.log(`
Usage:
  npm run lab:masters:white-back-slot-hold-plan -- [options]

Options:
  --opponent <id>               Opponent id. Repeatable. Default: black_1375_pressure, black_pressure_strong
  --games-per-matchup <n>       Games per matchup/direction. Default: 1
  --seed-start <n>              First seed. Default: 137200
  --max-steps <n>               Step cap. Default: 220
  --max-turns <n>               Turn cap. Default: 70
  --max-samples <n>             Maximum samples in report. Default: 40
  --markdown <path>             Write Markdown report.
  --json <path>                 Write JSON report.
`);
}

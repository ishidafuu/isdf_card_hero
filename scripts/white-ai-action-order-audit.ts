import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  applyCpuDecision,
  chooseCpuDecision,
  inspectCpuDecisionEvaluations,
  type CpuAiOptions,
  type CpuAiProfiles,
  type CpuAiTuning,
  type CpuDecision,
  type CpuDecisionEvaluation,
} from "../src/game/cpuAi";
import { getCardName } from "../src/game/cards";
import {
  buildDeckPresetCardIds,
  deckPresetAllowsSpecial,
} from "../src/game/deckPresets";
import { DEFAULT_WHITE_AI_TUNING_OPPONENTS, DEFAULT_WHITE_AI_TUNING_VARIANTS, type WhiteAiTuningOpponent, type WhiteAiTuningVariant } from "../src/game/whiteAiTuningLoop";
import { createInitialGame, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, MasterId, PlayerId, SlotKey } from "../src/game/types";

interface CliOptions {
  seedStart: number;
  count: number;
  maxSteps: number;
  maxTurns: number;
  maxSamples: number;
  margin: number;
  variantIds: string[];
  opponentIds: string[];
  markdownPath?: string;
  jsonPath?: string;
}

interface AlternativeDecision {
  key: string;
  category: string;
  score: number;
  reason: string;
}

interface PendingShield {
  seed: number;
  opponentId: string;
  candidateSeat: PlayerId;
  variantId: string;
  turnNumber: number;
  step: number;
  slotKey: SlotKey;
  monsterInstanceId: string;
  monsterName: string;
  selected: AlternativeDecision;
  retreatOnly?: AlternativeDecision;
  attackFirst?: AlternativeDecision;
  sameMonsterAttack?: AlternativeDecision;
  wakeFirst?: AlternativeDecision;
  state: string;
  board: string;
}

interface AuditSample extends PendingShield {
  kind: string;
  moveDecision?: AlternativeDecision;
}

interface VariantMetrics {
  variantId: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  candidateDecisionSteps: number;
  selectedShields: number;
  shieldWithRetreatAlternative: number;
  retreatAlternativeHigher: number;
  retreatAlternativeClose: number;
  selectedMoves: number;
  selectedRetreats: number;
  shieldThenRetreat: number;
  backRoleShieldThenRetreat: number;
  shieldWithAttackAlternative: number;
  attackAlternativeHigher: number;
  attackAlternativeClose: number;
  sameMonsterAttackAlternativeHigher: number;
  shieldWithWakeAlternative: number;
  wakeAlternativeHigher: number;
  wakeAlternativeClose: number;
  samples: AuditSample[];
}

interface ActionOrderAuditReport {
  generatedAt: string;
  seedStart: number;
  count: number;
  maxTurns: number;
  margin: number;
  variants: string[];
  opponents: string[];
  candidateSeats: PlayerId[];
  metrics: VariantMetrics[];
  conclusion: string[];
}

const DEFAULT_OPTIONS: CliOptions = {
  seedStart: 28000,
  count: 8,
  maxSteps: 700,
  maxTurns: 160,
  maxSamples: 10,
  margin: 15,
  variantIds: ["pressure_white_baseline", "pressure_white_shield_quality_breakthrough_v1"],
  opponentIds: ["black_pressure_strong", "black_pressure_pressure", "white_pressure_strong"],
};

const options = parseArgs(process.argv.slice(2));
const report = runActionOrderAudit(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report));
}

console.log(`White AI action-order audit: ${report.metrics.reduce((sum, metric) => sum + metric.games, 0)} games`);
for (const metric of report.metrics) {
  console.log(`${metric.variantId}: ${metric.wins}-${metric.losses}-${metric.draws}, shields ${metric.selectedShields}, shield->retreat ${metric.shieldThenRetreat}`);
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runActionOrderAudit(options: CliOptions): ActionOrderAuditReport {
  const variants = options.variantIds.map(getVariant);
  const opponents = options.opponentIds.map(getOpponent);
  opponents.forEach(assertBaselineOpponent);
  const candidateSeats: PlayerId[] = ["player", "cpu"];
  const metrics = variants.map((variant) => createMetrics(variant.id));
  const metricsByVariant = new Map(metrics.map((metric) => [metric.variantId, metric]));

  for (const variant of variants) {
    const metric = requireMetrics(metricsByVariant, variant.id);
    for (const opponent of opponents) {
      for (const candidateSeat of candidateSeats) {
        for (const seed of seedRange(options.seedStart, options.count)) {
          runGameAudit(seed, variant, opponent, candidateSeat, options, metric);
        }
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    seedStart: options.seedStart,
    count: options.count,
    maxTurns: options.maxTurns,
    margin: options.margin,
    variants: variants.map((variant) => variant.id),
    opponents: opponents.map((opponent) => opponent.id),
    candidateSeats,
    metrics,
    conclusion: buildConclusion(metrics),
  };
}

function runGameAudit(
  seed: number,
  variant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
  options: CliOptions,
  metrics: VariantMetrics,
): void {
  let game = createGame(seed, variant, opponent, candidateSeat);
  const aiOptions = aiOptionsForSeats(variant, opponent, candidateSeat);
  const pendingShields = new Map<SlotKey, PendingShield>();
  let currentTurnKey = "";
  let step = 0;

  for (; step < options.maxSteps && !game.winner && game.turnNumber <= options.maxTurns; step += 1) {
    const nextTurnKey = `${game.currentPlayer}:${game.turnNumber}`;
    if (nextTurnKey !== currentTurnKey) {
      pendingShields.clear();
      currentTurnKey = nextTurnKey;
    }

    if (!game.pendingLevelUp && game.currentPlayer === candidateSeat) {
      const evaluations = inspectCpuDecisionEvaluations(game, aiOptions);
      const choice = chooseDecisionWithEvaluation(game, evaluations, aiOptions);
      metrics.candidateDecisionSteps += 1;
      auditSelectedDecision(game, choice, evaluations, seed, variant, opponent, candidateSeat, step, options, metrics, pendingShields);
      game = applyCpuDecision(game, choice.decision);
    } else {
      game = runAutoStep(game, aiOptions);
    }
  }

  metrics.games += 1;
  const opponentSeat = candidateSeat === "player" ? "cpu" : "player";
  if (game.winner === candidateSeat) {
    metrics.wins += 1;
  } else if (game.winner === opponentSeat) {
    metrics.losses += 1;
  } else {
    metrics.draws += 1;
  }
}

function auditSelectedDecision(
  game: GameState,
  choice: { decision: CpuDecision; totalScore: number },
  evaluations: readonly CpuDecisionEvaluation[],
  seed: number,
  variant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
  step: number,
  options: CliOptions,
  metrics: VariantMetrics,
  pendingShields: Map<SlotKey, PendingShield>,
): void {
  const selected = toAlternative(choice.decision, choice.totalScore, game, candidateSeat);
  if (choice.decision.type === "move") {
    metrics.selectedMoves += 1;
    if (isFrontToBackMove(game, choice.decision)) {
      metrics.selectedRetreats += 1;
      const pending = pendingShields.get(choice.decision.fromSlotKey);
      if (pending) {
        const mover = game.slots[choice.decision.fromSlotKey].monster;
        if (mover?.instanceId === pending.monsterInstanceId) {
          metrics.shieldThenRetreat += 1;
          if (isBackRoleMoveLabel(choice.decision.reason)) {
            metrics.backRoleShieldThenRetreat += 1;
          }
          addSample(metrics, options, {
            ...pending,
            kind: isBackRoleMoveLabel(choice.decision.reason) ? "back_role_shield_then_retreat" : "shield_then_retreat",
            moveDecision: selected,
          });
        }
      }
    }
    return;
  }

  if (!isOwnShieldDecision(game, choice.decision, candidateSeat)) {
    return;
  }

  const targetSlotKey = choice.decision.target.slotKey;
  const monster = game.slots[targetSlotKey].monster;
  if (!monster) {
    return;
  }

  metrics.selectedShields += 1;
  const retreatOnly = bestRetreatAlternative(evaluations, game, targetSlotKey, candidateSeat);
  const attackFirst = bestAttackAlternative(evaluations, game, candidateSeat);
  const sameMonsterAttack = bestAttackAlternative(evaluations, game, candidateSeat, targetSlotKey);
  const wakeFirst = bestWakeAlternative(evaluations, game, candidateSeat);
  const pending: PendingShield = {
    seed,
    opponentId: opponent.id,
    candidateSeat,
    variantId: variant.id,
    turnNumber: game.turnNumber,
    step,
    slotKey: targetSlotKey,
    monsterInstanceId: monster.instanceId,
    monsterName: getCardName(monster.cardId),
    selected,
    ...(retreatOnly ? { retreatOnly } : {}),
    ...(attackFirst ? { attackFirst } : {}),
    ...(sameMonsterAttack ? { sameMonsterAttack } : {}),
    ...(wakeFirst ? { wakeFirst } : {}),
    state: stateLine(game),
    board: boardLine(game),
  };
  pendingShields.set(targetSlotKey, pending);

  if (retreatOnly) {
    metrics.shieldWithRetreatAlternative += 1;
    if (retreatOnly.score > selected.score) {
      metrics.retreatAlternativeHigher += 1;
      addSample(metrics, options, { ...pending, kind: "retreat_alt_higher" });
    } else if (selected.score - retreatOnly.score <= options.margin) {
      metrics.retreatAlternativeClose += 1;
      addSample(metrics, options, { ...pending, kind: "retreat_alt_close" });
    }
  }
  if (attackFirst) {
    metrics.shieldWithAttackAlternative += 1;
    if (attackFirst.score > selected.score) {
      metrics.attackAlternativeHigher += 1;
      addSample(metrics, options, { ...pending, kind: "attack_alt_higher" });
    } else if (selected.score - attackFirst.score <= options.margin) {
      metrics.attackAlternativeClose += 1;
    }
  }
  if (sameMonsterAttack && sameMonsterAttack.score > selected.score) {
    metrics.sameMonsterAttackAlternativeHigher += 1;
  }
  if (wakeFirst) {
    metrics.shieldWithWakeAlternative += 1;
    if (wakeFirst.score > selected.score) {
      metrics.wakeAlternativeHigher += 1;
      addSample(metrics, options, { ...pending, kind: "wake_alt_higher" });
    } else if (selected.score - wakeFirst.score <= options.margin) {
      metrics.wakeAlternativeClose += 1;
    }
  }
}

function chooseDecisionWithEvaluation(
  game: GameState,
  evaluations: readonly CpuDecisionEvaluation[],
  options: CpuAiOptions,
): { decision: CpuDecision; totalScore: number } {
  const decision = chooseCpuDecision(game, options);
  const key = decisionKey(decision);
  const evaluation = evaluations.find((candidate) => decisionKey(candidate.decision) === key);
  return {
    decision,
    totalScore: evaluation?.totalScore ?? decision.score,
  };
}

function bestRetreatAlternative(
  evaluations: readonly CpuDecisionEvaluation[],
  game: GameState,
  targetSlotKey: SlotKey,
  candidateSeat: PlayerId,
): AlternativeDecision | undefined {
  if (game.slots[targetSlotKey].owner !== candidateSeat || game.slots[targetSlotKey].row !== "front") {
    return undefined;
  }
  return bestAlternative(
    evaluations,
    game,
    candidateSeat,
    (decision) =>
      decision.type === "move" &&
      decision.fromSlotKey === targetSlotKey &&
      game.slots[decision.fromSlotKey].row === "front" &&
      game.slots[decision.toSlotKey].row === "back",
  );
}

function bestAttackAlternative(
  evaluations: readonly CpuDecisionEvaluation[],
  game: GameState,
  candidateSeat: PlayerId,
  attackerSlotKey?: SlotKey,
): AlternativeDecision | undefined {
  return bestAlternative(
    evaluations,
    game,
    candidateSeat,
    (decision) => decision.type === "attack" && (!attackerSlotKey || decision.action.attackerSlotKey === attackerSlotKey),
  );
}

function bestWakeAlternative(
  evaluations: readonly CpuDecisionEvaluation[],
  game: GameState,
  candidateSeat: PlayerId,
): AlternativeDecision | undefined {
  return bestAlternative(
    evaluations,
    game,
    candidateSeat,
    (decision) => decision.type === "master_action" && decision.actionId === "wake_up",
  );
}

function bestAlternative(
  evaluations: readonly CpuDecisionEvaluation[],
  game: GameState,
  candidateSeat: PlayerId,
  predicate: (decision: CpuDecision) => boolean,
): AlternativeDecision | undefined {
  return evaluations
    .filter((evaluation) => predicate(evaluation.decision))
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index)
    .map((evaluation) => toAlternative(evaluation.decision, evaluation.totalScore, game, candidateSeat))[0];
}

function isOwnShieldDecision(game: GameState, decision: CpuDecision, candidateSeat: PlayerId): decision is Extract<CpuDecision, { type: "master_action" }> & { target: { kind: "monster"; slotKey: SlotKey } } {
  return (
    decision.type === "master_action" &&
    decision.actionId === "shield" &&
    decision.target.kind === "monster" &&
    game.slots[decision.target.slotKey].monster?.owner === candidateSeat
  );
}

function isFrontToBackMove(game: GameState, decision: CpuDecision): decision is Extract<CpuDecision, { type: "move" }> {
  return decision.type === "move" && game.slots[decision.fromSlotKey].row === "front" && game.slots[decision.toSlotKey].row === "back";
}

function isBackRoleMoveLabel(reason: string): boolean {
  return reason.includes("後衛カードを後列へ戻して");
}

function toAlternative(decision: CpuDecision, totalScore: number, game: GameState, candidateSeat: PlayerId): AlternativeDecision {
  return {
    key: decisionKey(decision),
    category: categorizeDecision(decision, game, candidateSeat),
    score: round1(totalScore),
    reason: decision.reason,
  };
}

function createGame(
  seed: number,
  variant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
): GameState {
  const playerDeck = candidateSeat === "player" ? variant.deckPreset : opponent.deckPreset;
  const cpuDeck = candidateSeat === "cpu" ? variant.deckPreset : opponent.deckPreset;
  return createInitialGame(seed, {
    masterIds: {
      player: candidateSeat === "player" ? "white" : participantToMaster(opponent),
      cpu: candidateSeat === "cpu" ? "white" : participantToMaster(opponent),
    },
    playerDeckCardIds: buildDeckPresetCardIds(playerDeck),
    cpuDeckCardIds: buildDeckPresetCardIds(cpuDeck),
    allowSpecialDecks: {
      player: deckPresetAllowsSpecial(playerDeck),
      cpu: deckPresetAllowsSpecial(cpuDeck),
    },
  });
}

function aiOptionsForSeats(
  variant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
): CpuAiOptions {
  const profiles: CpuAiProfiles = {
    player: candidateSeat === "player" ? variant.aiProfile : opponent.aiProfile,
    cpu: candidateSeat === "cpu" ? variant.aiProfile : opponent.aiProfile,
  };
  const tunings: Partial<Record<PlayerId, CpuAiTuning>> = {};
  if (variant.tuning) {
    tunings[candidateSeat] = variant.tuning;
  }
  return { profiles, tunings };
}

function categorizeDecision(decision: CpuDecision, game: GameState, candidateSeat: PlayerId): string {
  if (decision.type === "attack") {
    const target = decision.action.target;
    const attacker = monsterNameAt(game, decision.action.attackerSlotKey);
    const prefix = attacker ? `attack:${attacker}` : "attack";
    if (target.kind === "master") {
      return `${prefix}:enemy_master`;
    }
    const slot = game.slots[target.slotKey];
    const side = slot.monster?.owner === candidateSeat ? "own" : "enemy";
    return `${prefix}:${side}_${slot.row}`;
  }
  if (decision.type === "master_action") {
    if (decision.target.kind === "monster") {
      const slot = game.slots[decision.target.slotKey];
      const side = slot.monster?.owner === candidateSeat ? "own" : "enemy";
      return `master:${decision.actionId}:${side}_${slot.row}`;
    }
    return `master:${decision.actionId}:${decision.target.playerId === candidateSeat ? "own_master" : "enemy_master"}`;
  }
  if (decision.type === "magic") {
    return "magic";
  }
  if (decision.type === "move") {
    return `move:${game.slots[decision.fromSlotKey].row}->${game.slots[decision.toSlotKey].row}`;
  }
  return decision.type;
}

function decisionKey(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${decision.action.handInstanceId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function stateLine(game: GameState): string {
  return [
    `HP P/C ${game.players.player.masterHp}/${game.players.cpu.masterHp}`,
    `stones P/C ${game.players.player.stones}/${game.players.cpu.stones}`,
    `hand P/C ${game.players.player.hand.length}/${game.players.cpu.hand.length}`,
  ].join(" / ");
}

function boardLine(game: GameState): string {
  const slotKeys: SlotKey[] = [
    "cpu_back_left",
    "cpu_back_right",
    "cpu_front_left",
    "cpu_front_right",
    "player_front_left",
    "player_front_right",
    "player_back_left",
    "player_back_right",
  ];
  return slotKeys.map((slotKey) => slotLine(game, slotKey)).filter(Boolean).join(" | ") || "empty";
}

function slotLine(game: GameState, slotKey: SlotKey): string {
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return "";
  }
  const side = monster.owner === "player" ? "P" : "C";
  const row = game.slots[slotKey].row === "front" ? "F" : "B";
  const status = monster.status === "prepared" ? "prep" : `act${monster.actionCount}/${monster.actionLimit}`;
  return `${slotKey}:${side}${row}:${getCardName(monster.cardId)} Lv${monster.level} HP${monster.hp} ${status}`;
}

function monsterNameAt(game: GameState, slotKey: SlotKey): string | undefined {
  const monster = game.slots[slotKey].monster;
  return monster ? getCardName(monster.cardId) : undefined;
}

function createMetrics(variantId: string): VariantMetrics {
  return {
    variantId,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    candidateDecisionSteps: 0,
    selectedShields: 0,
    shieldWithRetreatAlternative: 0,
    retreatAlternativeHigher: 0,
    retreatAlternativeClose: 0,
    selectedMoves: 0,
    selectedRetreats: 0,
    shieldThenRetreat: 0,
    backRoleShieldThenRetreat: 0,
    shieldWithAttackAlternative: 0,
    attackAlternativeHigher: 0,
    attackAlternativeClose: 0,
    sameMonsterAttackAlternativeHigher: 0,
    shieldWithWakeAlternative: 0,
    wakeAlternativeHigher: 0,
    wakeAlternativeClose: 0,
    samples: [],
  };
}

function addSample(metrics: VariantMetrics, options: CliOptions, sample: AuditSample): void {
  if (metrics.samples.length < options.maxSamples) {
    metrics.samples.push(sample);
  }
}

function formatMarkdown(report: ActionOrderAuditReport): string {
  return [
    "# White AI Action Order Audit",
    "",
    `生成: ${report.generatedAt}`,
    `候補: ${report.variants.map((id) => `\`${id}\``).join(", ")}`,
    `相手: ${report.opponents.join(", ")}`,
    `seed: ${report.seedStart}-${report.seedStart + report.count - 1} / 各seat`,
    `close margin: ${report.margin}`,
    "",
    "## Conclusion",
    "",
    ...report.conclusion.map((line) => `- ${line}`),
    "",
    "## Summary",
    "",
    "| Variant | W-L-D | Steps | Shield | Retreat Alt | Retreat Higher | Retreat Close | Shield->Retreat | BackRole S->R | Attack Higher/Close | Wake Higher/Close |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.metrics.map(formatMetricRow),
    "",
    "## Samples",
    "",
    ...report.metrics.flatMap(formatMetricSamples),
    "",
    "## Reading",
    "",
    "- `Retreat Alt` は、シールド選択前の同一局面に同じ対象を前列から後列へ下げる移動候補が存在した件数。",
    "- `Retreat Higher` は、その後退候補の評価点が選択されたシールドを上回った件数。",
    "- `Retreat Close` は、選択シールドとの差が close margin 以内の件数。",
    "- `Shield->Retreat` は、シールドした対象を同ターン中に後列へ下げた件数。行動順としては雑になりやすい。",
    "- `Attack/Wake Higher/Close` は、シールドを選ぶ前に攻撃またはウェイクアップがどれくらい競合していたかの探索値。",
  ].join("\n");
}

function formatMetricRow(metric: VariantMetrics): string {
  return [
    metric.variantId,
    `${metric.wins}-${metric.losses}-${metric.draws}`,
    metric.candidateDecisionSteps,
    formatCountRate(metric.selectedShields, metric.candidateDecisionSteps),
    formatCountRate(metric.shieldWithRetreatAlternative, metric.selectedShields),
    formatCountRate(metric.retreatAlternativeHigher, metric.selectedShields),
    formatCountRate(metric.retreatAlternativeClose, metric.selectedShields),
    formatCountRate(metric.shieldThenRetreat, metric.selectedShields),
    formatCountRate(metric.backRoleShieldThenRetreat, metric.selectedShields),
    `${formatCountRate(metric.attackAlternativeHigher, metric.selectedShields)} / ${formatCountRate(metric.attackAlternativeClose, metric.selectedShields)}`,
    `${formatCountRate(metric.wakeAlternativeHigher, metric.selectedShields)} / ${formatCountRate(metric.wakeAlternativeClose, metric.selectedShields)}`,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatMetricSamples(metric: VariantMetrics): string[] {
  const lines = [`### ${metric.variantId}`, ""];
  if (metric.samples.length === 0) {
    lines.push("サンプルなし。", "");
    return lines;
  }
  for (const sample of metric.samples) {
    lines.push(`- ${sample.kind}: seed ${sample.seed} / ${sample.opponentId} / ${sample.candidateSeat} / turn ${sample.turnNumber} step ${sample.step} / ${sample.monsterName} ${sample.slotKey}`);
    lines.push(`  - selected: ${sample.selected.category} \`${sample.selected.key}\` score ${sample.selected.score}`);
    if (sample.retreatOnly) {
      lines.push(`  - retreat: ${sample.retreatOnly.category} \`${sample.retreatOnly.key}\` score ${sample.retreatOnly.score}`);
    }
    if (sample.attackFirst) {
      lines.push(`  - attack: ${sample.attackFirst.category} \`${sample.attackFirst.key}\` score ${sample.attackFirst.score}`);
    }
    if (sample.wakeFirst) {
      lines.push(`  - wake: ${sample.wakeFirst.category} \`${sample.wakeFirst.key}\` score ${sample.wakeFirst.score}`);
    }
    if (sample.moveDecision) {
      lines.push(`  - later move: ${sample.moveDecision.category} \`${sample.moveDecision.key}\` score ${sample.moveDecision.score}`);
    }
    lines.push(`  - state: ${sample.state}`);
    lines.push(`  - board: ${sample.board}`);
  }
  lines.push("");
  return lines;
}

function buildConclusion(metrics: readonly VariantMetrics[]): string[] {
  const lines: string[] = [];
  const reference = metrics[0];
  for (const metric of metrics) {
    lines.push(`${metric.variantId}: シールド ${metric.selectedShields}件中、同一対象の後退候補あり ${metric.shieldWithRetreatAlternative}件、後退が上回ったもの ${metric.retreatAlternativeHigher}件、同ターン shield->retreat ${metric.shieldThenRetreat}件。`);
    if (
      reference &&
      metric.variantId !== reference.variantId &&
      metric.shieldThenRetreat >= reference.shieldThenRetreat &&
      metric.wins <= reference.wins
    ) {
      lines.push(`${metric.variantId}: 参照候補より shield->retreat を減らせず勝数も伸びていないため、このままの行動順補正は採用見送り。`);
    } else if (metric.backRoleShieldThenRetreat > 0) {
      lines.push(`${metric.variantId}: 後衛ロールを盾してから後退する例が残るため、シールド係数ではなく安全後退そのものの評価を候補にする価値がある。`);
    }
    if (metric.attackAlternativeHigher + metric.wakeAlternativeHigher > metric.retreatAlternativeHigher) {
      lines.push(`${metric.variantId}: 後退以外にも攻撃/ウェイクアップがシールドを上回る局面があるため、次の監査では行動順を攻撃先行・起動先行に分解する余地がある。`);
    }
  }
  if (lines.length === 0) {
    lines.push("対象候補がないため、シールド行動順の追加調整は保留でよい。");
  }
  return lines;
}

function getVariant(id: string): WhiteAiTuningVariant {
  const variant = DEFAULT_WHITE_AI_TUNING_VARIANTS.find((candidate) => candidate.id === id);
  if (!variant) {
    throw new Error(`Unknown variant: ${id}`);
  }
  return variant;
}

function getOpponent(id: string): WhiteAiTuningOpponent {
  const opponent = DEFAULT_WHITE_AI_TUNING_OPPONENTS.find((candidate) => candidate.id === id);
  if (!opponent) {
    throw new Error(`Unknown opponent: ${id}`);
  }
  return opponent;
}

function assertBaselineOpponent(opponent: WhiteAiTuningOpponent): void {
  if (opponent.participant !== "white" && opponent.participant !== "black") {
    throw new Error(`white-ai-action-order-audit supports baseline master opponents only: ${opponent.id}`);
  }
}

function participantToMaster(opponent: WhiteAiTuningOpponent): MasterId {
  if (opponent.participant === "white" || opponent.participant === "black") {
    return opponent.participant;
  }
  throw new Error(`Unsupported lab participant in action-order audit: ${opponent.participant}`);
}

function requireMetrics(metrics: ReadonlyMap<string, VariantMetrics>, variantId: string): VariantMetrics {
  const metric = metrics.get(variantId);
  if (!metric) {
    throw new Error(`Missing metrics: ${variantId}`);
  }
  return metric;
}

function seedRange(seedStart: number, count: number): number[] {
  return Array.from({ length: count }, (_, index) => seedStart + index);
}

function formatCountRate(count: number, total: number): string {
  return `${count} (${formatPercent(rate(count, total))})`;
}

function formatPercent(value: number): string {
  return `${round1(value * 100)}%`;
}

function rate(count: number, total: number): number {
  return total > 0 ? count / total : 0;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

async function writeReport(path: string, contents: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, contents);
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { ...DEFAULT_OPTIONS, variantIds: [...DEFAULT_OPTIONS.variantIds], opponentIds: [...DEFAULT_OPTIONS.opponentIds] };
  let variantIds: string[] | undefined;
  let opponentIds: string[] | undefined;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readNumber(arg, next);
      i += 1;
    } else if (arg === "--count") {
      parsed.count = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-samples") {
      parsed.maxSamples = readNumber(arg, next);
      i += 1;
    } else if (arg === "--margin") {
      parsed.margin = readNumber(arg, next);
      i += 1;
    } else if (arg === "--variant") {
      variantIds = [...(variantIds ?? []), readString(arg, next)];
      i += 1;
    } else if (arg === "--opponent") {
      opponentIds = [...(opponentIds ?? []), readString(arg, next)];
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
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (variantIds) {
    parsed.variantIds = variantIds;
  }
  if (opponentIds) {
    parsed.opponentIds = opponentIds;
  }
  return parsed;
}

function readNumber(name: string, value: string | undefined): number {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${name} must be a number: ${value}`);
  }
  return parsed;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function printHelp(): void {
  console.log(`Usage: npm run lab:masters:white-ai-action-order -- [options]

Options:
  --variant <id>             Variant to audit. Can be repeated.
  --opponent <id>            Baseline master opponent. Can be repeated.
  --seed-start <n>           First seed. Default: ${DEFAULT_OPTIONS.seedStart}
  --count <n>                Seeds per opponent/seat. Default: ${DEFAULT_OPTIONS.count}
  --max-steps <n>            Max auto steps per game. Default: ${DEFAULT_OPTIONS.maxSteps}
  --max-turns <n>            Max turn number per game. Default: ${DEFAULT_OPTIONS.maxTurns}
  --margin <n>               Close alternative margin. Default: ${DEFAULT_OPTIONS.margin}
  --max-samples <n>          Sample cap per variant. Default: ${DEFAULT_OPTIONS.maxSamples}
  --markdown <path>          Write Markdown report.
  --json <path>              Write JSON report.
`);
}

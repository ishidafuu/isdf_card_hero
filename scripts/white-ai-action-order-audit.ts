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
  type DeckPresetId,
} from "../src/game/deckPresets";
import { DEFAULT_PLAYER_DECK_PRESET_ID } from "../src/game/defaultDeckPresets";
import { DEFAULT_WHITE_AI_TUNING_OPPONENTS, DEFAULT_WHITE_AI_TUNING_VARIANTS, type WhiteAiTuningOpponent, type WhiteAiTuningVariant } from "../src/game/whiteAiTuningLoop";
import { createInitialGame, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, MasterId, MonsterState, PlayerId, SlotKey } from "../src/game/types";

interface CliOptions {
  seedStart: number;
  count: number;
  maxSteps: number;
  maxTurns: number;
  maxSamples: number;
  margin: number;
  variantIds: string[];
  opponentIds: string[];
  stopAfterSamples?: number;
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
  alternativeCounts?: Record<string, number>;
  topAlternatives?: AlternativeDecision[];
}

interface VariantMetrics {
  variantId: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  partialGames: number;
  candidateDecisionSteps: number;
  candidateTurns: number;
  turnsWithShield: number;
  shieldFirstInTurn: number;
  shieldThenWork: number;
  workThenShield: number;
  wakeThenAttack: number;
  attackThenWake: number;
  selectedShields: number;
  shieldWithRetreatAlternative: number;
  retreatAlternativeHigher: number;
  retreatAlternativeClose: number;
  selectedMoves: number;
  selectedRetreats: number;
  selectedWakes: number;
  wakeWithAttackAlternative: number;
  wakeAttackAlternativeHigher: number;
  wakeAttackAlternativeClose: number;
  wakeWithShieldAlternative: number;
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
  count: 4,
  maxSteps: 700,
  maxTurns: 160,
  maxSamples: 10,
  margin: 15,
  variantIds: ["current_white_baseline", "current_wake_safe_work4", "current_threat_left_low_stone_guard"],
  opponentIds: ["black_pressure_strong", "black_1375_pressure", "white_current_mirror"],
};

const CURRENT_WHITE_DECK = DEFAULT_PLAYER_DECK_PRESET_ID;

const CURRENT_ACTION_ORDER_VARIANTS = [
  currentVariant("current_white_baseline", "現行: デスシープ3 / white", undefined, "暫定白最強デッキで現行white profileの順序を監査する。"),
  currentVariant("current_wake_safe_work4", "順序候補: 安全ウェイク仕事+4", {
    situationalBias: { whiteWakeSafeWorkBonus: 4 },
  }, "仕事へ変換できるウェイクアップを軽く押し、盾より先に起こすべき局面が拾えるか見る。"),
  currentVariant("current_wake_safe_work8", "順序候補: 安全ウェイク仕事+8", {
    situationalBias: { whiteWakeSafeWorkBonus: 8 },
  }, "ウェイクアップ品質加点を強め、攻撃前の起動が増えすぎないか見る。"),
  currentVariant("current_threat_left_low_stone_guard", "順序候補: 脅威残り低石布石抑制", {
    situationalBias: { whiteThreatLeftLowStoneSetupPenalty: 6 },
  }, "攻撃で脅威を減らす前に低石の盾/起動/召喚へ入る順序を抑える。"),
  currentVariant("current_black_front_threat16", "順序候補: 黒前衛脅威+16", {
    situationalBias: { whiteBlackFrontThreatBonus: 16 },
  }, "黒の打点源処理を強め、盾より攻撃が先に出るか見る。"),
] as const satisfies readonly WhiteAiTuningVariant[];

const CURRENT_ACTION_ORDER_OPPONENTS = [
  {
    id: "black_1375_pressure",
    category: "black",
    label: "黒: 1375 / pressure",
    participant: "black",
    deckPreset: "submission-pro-no-rare8-black-1375",
    aiProfile: "pressure",
  },
  {
    id: "white_current_mirror",
    category: "white",
    label: "白: 暫定白最強ミラー / white",
    participant: "white",
    deckPreset: CURRENT_WHITE_DECK,
    aiProfile: "white",
  },
] as const satisfies readonly WhiteAiTuningOpponent[];

function currentVariant(
  id: string,
  label: string,
  tuning: CpuAiTuning | undefined,
  hypothesis: string,
): WhiteAiTuningVariant {
  return {
    id,
    kind: tuning ? "hybrid" : "baseline",
    label,
    deckPreset: CURRENT_WHITE_DECK as DeckPresetId,
    aiProfile: "white",
    ...(tuning ? { tuning } : {}),
    hypothesis,
  };
}

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
    opponentLoop:
    for (const opponent of opponents) {
      for (const candidateSeat of candidateSeats) {
        for (const seed of seedRange(options.seedStart, options.count)) {
          const stopped = runGameAudit(seed, variant, opponent, candidateSeat, options, metric);
          if (stopped) {
            break opponentLoop;
          }
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
): boolean {
  let game = createGame(seed, variant, opponent, candidateSeat);
  const aiOptions = aiOptionsForSeats(variant, opponent, candidateSeat);
  const pendingShields = new Map<SlotKey, PendingShield>();
  let currentTurnKey = "";
  let turnActions: string[] = [];
  let step = 0;

  for (; step < options.maxSteps && !game.winner && game.turnNumber <= options.maxTurns; step += 1) {
    const nextTurnKey = `${game.currentPlayer}:${game.turnNumber}`;
    if (nextTurnKey !== currentTurnKey) {
      finalizeTurnActions(metrics, turnActions);
      turnActions = [];
      pendingShields.clear();
      currentTurnKey = nextTurnKey;
    }

    if (!game.pendingLevelUp && game.currentPlayer === candidateSeat) {
      const decision = chooseCpuDecision(game, aiOptions);
      const evaluations = shouldInspectSelectedDecision(game, decision, candidateSeat)
        ? inspectCpuDecisionEvaluations(game, aiOptions)
        : [];
      const choice = attachEvaluationScore(game, decision, evaluations);
      metrics.candidateDecisionSteps += 1;
      const turnActionIndex = turnActions.length;
      recordTurnAction(turnActions, choice.decision);
      auditSelectedDecision(game, choice, evaluations, seed, variant, opponent, candidateSeat, step, turnActionIndex, options, metrics, pendingShields);
      if (shouldStopAfterSamples(metrics, options)) {
        finalizeTurnActions(metrics, turnActions);
        metrics.partialGames += 1;
        return true;
      }
      game = applyCpuDecision(game, choice.decision);
    } else {
      game = runAutoStep(game, aiOptions);
    }
  }
  finalizeTurnActions(metrics, turnActions);

  metrics.games += 1;
  const opponentSeat = candidateSeat === "player" ? "cpu" : "player";
  if (game.winner === candidateSeat) {
    metrics.wins += 1;
  } else if (game.winner === opponentSeat) {
    metrics.losses += 1;
  } else {
    metrics.draws += 1;
  }
  return false;
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
  turnActionIndex: number,
  options: CliOptions,
  metrics: VariantMetrics,
  pendingShields: Map<SlotKey, PendingShield>,
): void {
  const selected = toAlternative(choice.decision, choice.totalScore, game, candidateSeat);
  if (choice.decision.type === "master_action" && choice.decision.actionId === "wake_up") {
    metrics.selectedWakes += 1;
    const attackFirst = bestAttackAlternative(evaluations, game, candidateSeat);
    const shieldAlternative = bestShieldAlternative(evaluations, game, candidateSeat);
    if (attackFirst) {
      metrics.wakeWithAttackAlternative += 1;
      if (attackFirst.score > selected.score) {
        metrics.wakeAttackAlternativeHigher += 1;
        addSample(metrics, options, {
          seed,
          opponentId: opponent.id,
          candidateSeat,
          variantId: variant.id,
          turnNumber: game.turnNumber,
          step,
          slotKey: choice.decision.target.kind === "monster" ? choice.decision.target.slotKey : "player_front_left",
          monsterInstanceId: "",
          monsterName: "wake_up",
          selected,
          attackFirst,
          state: stateLine(game),
          board: boardLine(game),
          kind: "wake_attack_alt_higher",
        });
      } else if (selected.score - attackFirst.score <= options.margin) {
        metrics.wakeAttackAlternativeClose += 1;
      }
    }
    if (shieldAlternative) {
      metrics.wakeWithShieldAlternative += 1;
    }
    return;
  }

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

  if (turnActionIndex === 0) {
    addSample(metrics, options, {
      ...pending,
      kind: "shield_first_turn",
      alternativeCounts: countAlternativeCategories(evaluations),
      topAlternatives: topAlternatives(evaluations, game, candidateSeat, 8),
    });
  }

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

function shouldInspectSelectedDecision(
  game: GameState,
  decision: CpuDecision,
  candidateSeat: PlayerId,
): boolean {
  return (
    isOwnShieldDecision(game, decision, candidateSeat) ||
    (decision.type === "master_action" && decision.actionId === "wake_up")
  );
}

function attachEvaluationScore(
  game: GameState,
  decision: CpuDecision,
  evaluations: readonly CpuDecisionEvaluation[],
): { decision: CpuDecision; totalScore: number } {
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

function bestShieldAlternative(
  evaluations: readonly CpuDecisionEvaluation[],
  game: GameState,
  candidateSeat: PlayerId,
): AlternativeDecision | undefined {
  return bestAlternative(
    evaluations,
    game,
    candidateSeat,
    (decision) =>
      decision.type === "master_action" &&
      decision.actionId === "shield" &&
      decision.target.kind === "monster" &&
      game.slots[decision.target.slotKey].monster?.owner === candidateSeat,
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

function topAlternatives(
  evaluations: readonly CpuDecisionEvaluation[],
  game: GameState,
  candidateSeat: PlayerId,
  limit: number,
): AlternativeDecision[] {
  return [...evaluations]
    .sort((a, b) => b.totalScore - a.totalScore || a.index - b.index)
    .slice(0, limit)
    .map((evaluation) => toAlternative(evaluation.decision, evaluation.totalScore, game, candidateSeat));
}

function countAlternativeCategories(evaluations: readonly CpuDecisionEvaluation[]): Record<string, number> {
  return evaluations.reduce<Record<string, number>>((counts, evaluation) => {
    counts[evaluation.decision.type] = (counts[evaluation.decision.type] ?? 0) + 1;
    return counts;
  }, {});
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
  const flags = monsterFlags(monster);
  return `${slotKey}:${side}${row}:${getCardName(monster.cardId)} Lv${monster.level} HP${monster.hp} ${status}${flags ? ` ${flags}` : ""}`;
}

function monsterNameAt(game: GameState, slotKey: SlotKey): string | undefined {
  const monster = game.slots[slotKey].monster;
  return monster ? getCardName(monster.cardId) : undefined;
}

function monsterFlags(monster: MonsterState): string {
  const flags = [
    monster.focused ? "focus" : "",
    monster.powerUp ? "powerUp" : "",
    monster.shielded ? "shield" : "",
    monster.halfShielded ? "halfShield" : "",
    monster.oneShotShield ? "oneShotShield" : "",
    monster.dragonShield ? "dragonShield" : "",
    monster.scapegoat ? "scapegoat" : "",
    monster.berserkPower ? "berserk" : "",
    monster.provokeTargetSlotKey ? `provoke:${monster.provokeTargetSlotKey}` : "",
    monster.commandSealed ? "sealed" : "",
    monster.cannotActUntilDamaged ? "sleep" : "",
    monster.cannotMove ? "noMove" : "",
    monster.canAttackAnywhere ? "rangeAll" : "",
    monster.stoneCurse ? "stoneCurse" : "",
    monster.damageCurse ? "damageCurse" : "",
    monster.damageGuarded ? "damageGuard" : "",
    monster.masterAttackBlockedUntilTurnEnd ? "masterBlock" : "",
    monster.immune ? "immune" : "",
    monster.levelFixed ? "levelFixed" : "",
    monster.hollow ? "hollow" : "",
    monster.dodgeChance ? "dodge" : "",
  ].filter(Boolean);
  return flags.length > 0 ? `[${flags.join(",")}]` : "";
}

function recordTurnAction(turnActions: string[], decision: CpuDecision): void {
  const category = orderCategory(decision);
  if (category) {
    turnActions.push(category);
  }
}

function orderCategory(decision: CpuDecision): string | undefined {
  if (decision.type === "attack") {
    return "attack";
  }
  if (decision.type === "master_action") {
    if (decision.actionId === "shield") {
      return "shield";
    }
    if (decision.actionId === "wake_up") {
      return "wake";
    }
    return "master_action";
  }
  if (decision.type === "magic") {
    return "magic";
  }
  if (decision.type === "move") {
    return "move";
  }
  if (decision.type === "summon") {
    return "summon";
  }
  if (decision.type === "focus") {
    return "focus";
  }
  return undefined;
}

function finalizeTurnActions(metrics: VariantMetrics, turnActions: string[]): void {
  if (turnActions.length === 0) {
    return;
  }
  metrics.candidateTurns += 1;
  const firstShield = turnActions.indexOf("shield");
  const firstAttack = turnActions.indexOf("attack");
  const firstWake = turnActions.indexOf("wake");
  const lastAttack = turnActions.lastIndexOf("attack");
  const lastWake = turnActions.lastIndexOf("wake");
  if (firstShield >= 0) {
    metrics.turnsWithShield += 1;
    if (firstShield === 0) {
      metrics.shieldFirstInTurn += 1;
    }
    if ((lastAttack > firstShield) || (lastWake > firstShield)) {
      metrics.shieldThenWork += 1;
    }
    if ((firstAttack >= 0 && firstAttack < firstShield) || (firstWake >= 0 && firstWake < firstShield)) {
      metrics.workThenShield += 1;
    }
  }
  if (firstWake >= 0 && lastAttack > firstWake) {
    metrics.wakeThenAttack += 1;
  }
  if (firstAttack >= 0 && lastWake > firstAttack) {
    metrics.attackThenWake += 1;
  }
}

function createMetrics(variantId: string): VariantMetrics {
  return {
    variantId,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    partialGames: 0,
    candidateDecisionSteps: 0,
    candidateTurns: 0,
    turnsWithShield: 0,
    shieldFirstInTurn: 0,
    shieldThenWork: 0,
    workThenShield: 0,
    wakeThenAttack: 0,
    attackThenWake: 0,
    selectedShields: 0,
    shieldWithRetreatAlternative: 0,
    retreatAlternativeHigher: 0,
    retreatAlternativeClose: 0,
    selectedMoves: 0,
    selectedRetreats: 0,
    selectedWakes: 0,
    wakeWithAttackAlternative: 0,
    wakeAttackAlternativeHigher: 0,
    wakeAttackAlternativeClose: 0,
    wakeWithShieldAlternative: 0,
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

function shouldStopAfterSamples(metrics: VariantMetrics, options: CliOptions): boolean {
  return options.stopAfterSamples !== undefined && metrics.samples.length >= options.stopAfterSamples;
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
    "| Variant | W-L-D | Steps | Turns | Shield | Shield Turns | Shield First | Shield Then Work | Work Then Shield | Retreat Alt | Shield->Retreat | Shield Attack Higher/Close | Shield Wake Higher/Close | Wake | Wake Attack Higher/Close | Wake Then Attack |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
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
    "- `Wake Attack Higher/Close` は、ウェイクアップを選んだ局面で、攻撃候補がどれくらい競合していたかの探索値。",
    "- `Turn Order` では、実際の同一ターン内で shield の後に attack/wake したか、attack/wake の後に shield したかを見る。",
    "- `partial` は、サンプル採取用に `--stop-after-samples` で途中終了したゲーム数。勝敗集計には含めない。",
  ].join("\n");
}

function formatMetricRow(metric: VariantMetrics): string {
  return [
    metric.variantId,
    `${metric.wins}-${metric.losses}-${metric.draws}${metric.partialGames > 0 ? ` (+${metric.partialGames} partial)` : ""}`,
    metric.candidateDecisionSteps,
    metric.candidateTurns,
    formatCountRate(metric.selectedShields, metric.candidateDecisionSteps),
    formatCountRate(metric.turnsWithShield, metric.candidateTurns),
    formatCountRate(metric.shieldFirstInTurn, metric.turnsWithShield),
    formatCountRate(metric.shieldThenWork, metric.turnsWithShield),
    formatCountRate(metric.workThenShield, metric.turnsWithShield),
    formatCountRate(metric.shieldWithRetreatAlternative, metric.selectedShields),
    formatCountRate(metric.shieldThenRetreat, metric.selectedShields),
    `${formatCountRate(metric.attackAlternativeHigher, metric.selectedShields)} / ${formatCountRate(metric.attackAlternativeClose, metric.selectedShields)}`,
    `${formatCountRate(metric.wakeAlternativeHigher, metric.selectedShields)} / ${formatCountRate(metric.wakeAlternativeClose, metric.selectedShields)}`,
    formatCountRate(metric.selectedWakes, metric.candidateDecisionSteps),
    `${formatCountRate(metric.wakeAttackAlternativeHigher, metric.selectedWakes)} / ${formatCountRate(metric.wakeAttackAlternativeClose, metric.selectedWakes)}`,
    formatCountRate(metric.wakeThenAttack, metric.candidateTurns),
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
    lines.push(`  - selected reason: ${sample.selected.reason}`);
    if (sample.attackFirst) {
      lines.push(`  - attack reason: ${sample.attackFirst.reason}`);
    }
    if (sample.wakeFirst) {
      lines.push(`  - wake reason: ${sample.wakeFirst.reason}`);
    }
    if (sample.retreatOnly) {
      lines.push(`  - retreat reason: ${sample.retreatOnly.reason}`);
    }
    if (sample.alternativeCounts) {
      lines.push(`  - alternatives: ${Object.entries(sample.alternativeCounts).map(([key, count]) => `${key} ${count}`).join(", ")}`);
    }
    if (sample.topAlternatives && sample.topAlternatives.length > 0) {
      lines.push("  - top alternatives:");
      for (const alternative of sample.topAlternatives) {
        lines.push(`    - ${alternative.category} \`${alternative.key}\` score ${alternative.score} / ${alternative.reason}`);
      }
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
    if (metric.partialGames > 0) {
      lines.push(`${metric.variantId}: サンプル採取のため ${metric.partialGames}ゲームを途中終了。勝率ではなく行動例の監査として読む。`);
    }
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
    if (metric.wakeAttackAlternativeHigher > 0) {
      lines.push(`${metric.variantId}: ウェイクアップ選択時に攻撃候補が上回る局面が ${metric.wakeAttackAlternativeHigher}件ある。起動前に盤面処理する条件の監査対象。`);
    }
    lines.push(`${metric.variantId}: turn order は shield含み ${metric.turnsWithShield}/${metric.candidateTurns}ターン、shield先行後にattack/wake ${metric.shieldThenWork}件、attack/wake後にshield ${metric.workThenShield}件、wake後attack ${metric.wakeThenAttack}件。`);
    if (metric.shieldThenWork > metric.workThenShield) {
      lines.push(`${metric.variantId}: shield後に仕事をするターンが多い。反撃回避以外は shield last を候補化する価値がある。`);
    }
  }
  if (lines.length === 0) {
    lines.push("対象候補がないため、シールド行動順の追加調整は保留でよい。");
  }
  return lines;
}

function getVariant(id: string): WhiteAiTuningVariant {
  const variant = [...CURRENT_ACTION_ORDER_VARIANTS, ...DEFAULT_WHITE_AI_TUNING_VARIANTS].find((candidate) => candidate.id === id);
  if (!variant) {
    throw new Error(`Unknown variant: ${id}`);
  }
  return variant;
}

function getOpponent(id: string): WhiteAiTuningOpponent {
  const opponent = [...CURRENT_ACTION_ORDER_OPPONENTS, ...DEFAULT_WHITE_AI_TUNING_OPPONENTS].find((candidate) => candidate.id === id);
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
    } else if (arg === "--stop-after-samples") {
      parsed.stopAfterSamples = readNumber(arg, next);
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
  --stop-after-samples <n>   Stop a variant early after collecting this many samples.
  --markdown <path>          Write Markdown report.
  --json <path>              Write JSON report.
`);
}

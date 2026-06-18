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
} from "../src/game/cpuAi";
import { getCardName } from "../src/game/cards";
import {
  buildDeckPresetCardIds,
  deckPresetAllowsSpecial,
  type DeckPresetId,
} from "../src/game/deckPresets";
import { DEFAULT_WHITE_AI_TUNING_OPPONENTS, DEFAULT_WHITE_AI_TUNING_VARIANTS, type WhiteAiTuningOpponent, type WhiteAiTuningVariant } from "../src/game/whiteAiTuningLoop";
import { createInitialGame, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, MasterId, PlayerId, SlotKey } from "../src/game/types";

interface CliOptions {
  seedStart: number;
  count: number;
  maxSteps: number;
  maxTurns: number;
  turnTo: number;
  maxSamples: number;
  referenceVariantId: string;
  compareVariantIds: string[];
  opponentIds: string[];
  markdownPath?: string;
  jsonPath?: string;
}

interface OutcomeRecord {
  seed: number;
  opponentId: string;
  candidateSeat: PlayerId;
  variantId: string;
  winner?: PlayerId;
  outcome: "win" | "loss" | "draw";
  steps: number;
  turns: number;
}

interface DecisionDiffRecord {
  step: number;
  turnNumber: number;
  player: PlayerId;
  referenceDecision: string;
  compareDecision: string;
  referenceScore: number;
  compareScore: number;
  referenceCategory: string;
  compareCategory: string;
  state: string;
  board: string;
}

interface DivergentSeedSample {
  seed: number;
  opponentId: string;
  candidateSeat: PlayerId;
  referenceOutcome: "win" | "loss" | "draw";
  compareOutcome: "win" | "loss" | "draw";
  firstDiff?: DecisionDiffRecord;
  diffs: DecisionDiffRecord[];
}

interface PairSummary {
  compareVariantId: string;
  seeds: number;
  referenceWinsCompareNot: number;
  compareWinsReferenceNot: number;
  bothWin: number;
  bothLoss: number;
  sameDraw: number;
  otherDivergent: number;
  firstDiffCategories: Record<string, number>;
  samples: DivergentSeedSample[];
}

interface DiffReport {
  generatedAt: string;
  seedStart: number;
  count: number;
  turnTo: number;
  opponents: string[];
  candidateSeats: PlayerId[];
  referenceVariantId: string;
  compareVariantIds: string[];
  outcomes: OutcomeRecord[];
  pairSummaries: PairSummary[];
  conclusion: string[];
}

const DEFAULT_OPTIONS: CliOptions = {
  seedStart: 23000,
  count: 12,
  maxSteps: 700,
  maxTurns: 160,
  turnTo: 4,
  maxSamples: 8,
  referenceVariantId: "pressure_attack_monster_plus4",
  compareVariantIds: ["pressure_white_baseline", "pressure_white_monster_pressure_v1"],
  opponentIds: ["black_pressure_strong", "black_pressure_pressure"],
};

const options = parseArgs(process.argv.slice(2));
const report = runWhiteAiDecisionDiffLoop(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report));
}

console.log(`White AI decision diff loop: ${report.outcomes.length} games / ${report.pairSummaries.length} comparisons`);
for (const pair of report.pairSummaries) {
  console.log(`${report.referenceVariantId} vs ${pair.compareVariantId}: ref-win/compare-not ${pair.referenceWinsCompareNot}, compare-win/ref-not ${pair.compareWinsReferenceNot}`);
  console.log(`  first diffs: ${formatCounts(pair.firstDiffCategories)}`);
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runWhiteAiDecisionDiffLoop(options: CliOptions): DiffReport {
  const reference = getVariant(options.referenceVariantId);
  const compared = options.compareVariantIds.map(getVariant);
  const opponents = options.opponentIds.map(getOpponent);
  const candidateSeats: PlayerId[] = ["player", "cpu"];
  const outcomes: OutcomeRecord[] = [];
  const outcomeMap = new Map<string, OutcomeRecord>();

  for (const opponent of opponents) {
    assertBaselineOpponent(opponent);
    for (const candidateSeat of candidateSeats) {
      for (const seed of seedRange(options.seedStart, options.count)) {
        for (const variant of [reference, ...compared]) {
          const outcome = runVariantOutcome(seed, variant, opponent, candidateSeat, options);
          outcomes.push(outcome);
          outcomeMap.set(outcomeKey(variant.id, opponent.id, candidateSeat, seed), outcome);
        }
      }
    }
  }

  const pairSummaries = compared.map((compareVariant) =>
    summarizePair(reference, compareVariant, opponents, candidateSeats, outcomeMap, options),
  );

  return {
    generatedAt: new Date().toISOString(),
    seedStart: options.seedStart,
    count: options.count,
    turnTo: options.turnTo,
    opponents: opponents.map((opponent) => opponent.id),
    candidateSeats,
    referenceVariantId: reference.id,
    compareVariantIds: compared.map((variant) => variant.id),
    outcomes,
    pairSummaries,
    conclusion: buildConclusion(reference, pairSummaries),
  };
}

function summarizePair(
  reference: WhiteAiTuningVariant,
  compareVariant: WhiteAiTuningVariant,
  opponents: readonly WhiteAiTuningOpponent[],
  candidateSeats: readonly PlayerId[],
  outcomes: ReadonlyMap<string, OutcomeRecord>,
  options: CliOptions,
): PairSummary {
  const summary: PairSummary = {
    compareVariantId: compareVariant.id,
    seeds: 0,
    referenceWinsCompareNot: 0,
    compareWinsReferenceNot: 0,
    bothWin: 0,
    bothLoss: 0,
    sameDraw: 0,
    otherDivergent: 0,
    firstDiffCategories: {},
    samples: [],
  };

  for (const opponent of opponents) {
    for (const candidateSeat of candidateSeats) {
      for (const seed of seedRange(options.seedStart, options.count)) {
        const referenceOutcome = requireOutcome(outcomes, reference.id, opponent.id, candidateSeat, seed);
        const compareOutcome = requireOutcome(outcomes, compareVariant.id, opponent.id, candidateSeat, seed);
        summary.seeds += 1;
        if (referenceOutcome.outcome === "win" && compareOutcome.outcome !== "win") {
          summary.referenceWinsCompareNot += 1;
          collectSample(summary, reference, compareVariant, opponent, candidateSeat, seed, referenceOutcome, compareOutcome, options);
        } else if (compareOutcome.outcome === "win" && referenceOutcome.outcome !== "win") {
          summary.compareWinsReferenceNot += 1;
        } else if (referenceOutcome.outcome === "win" && compareOutcome.outcome === "win") {
          summary.bothWin += 1;
        } else if (referenceOutcome.outcome === "loss" && compareOutcome.outcome === "loss") {
          summary.bothLoss += 1;
        } else if (referenceOutcome.outcome === "draw" && compareOutcome.outcome === "draw") {
          summary.sameDraw += 1;
        } else {
          summary.otherDivergent += 1;
        }
      }
    }
  }

  return summary;
}

function collectSample(
  summary: PairSummary,
  reference: WhiteAiTuningVariant,
  compareVariant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
  seed: number,
  referenceOutcome: OutcomeRecord,
  compareOutcome: OutcomeRecord,
  options: CliOptions,
): void {
  const diffs = collectDecisionDiffsOnReferencePath(seed, reference, compareVariant, opponent, candidateSeat, options);
  const firstDiff = diffs[0];
  if (firstDiff) {
    const key = `${firstDiff.referenceCategory} > ${firstDiff.compareCategory}`;
    summary.firstDiffCategories[key] = (summary.firstDiffCategories[key] ?? 0) + 1;
  } else {
    summary.firstDiffCategories["no_diff_before_turn_limit"] = (summary.firstDiffCategories.no_diff_before_turn_limit ?? 0) + 1;
  }
  if (summary.samples.length < options.maxSamples) {
    summary.samples.push({
      seed,
      opponentId: opponent.id,
      candidateSeat,
      referenceOutcome: referenceOutcome.outcome,
      compareOutcome: compareOutcome.outcome,
      ...(firstDiff ? { firstDiff } : {}),
      diffs: diffs.slice(0, 4),
    });
  }
}

function runVariantOutcome(
  seed: number,
  variant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
  options: CliOptions,
): OutcomeRecord {
  let game = createGame(seed, variant, opponent, candidateSeat);
  const aiOptions = aiOptionsForSeats(variant, opponent, candidateSeat);
  let step = 0;
  for (; step < options.maxSteps && !game.winner && game.turnNumber <= options.maxTurns; step += 1) {
    game = runAutoStep(game, aiOptions);
  }
  const opponentSeat = candidateSeat === "player" ? "cpu" : "player";
  const outcome = game.winner === candidateSeat
    ? "win"
    : game.winner === opponentSeat
      ? "loss"
      : "draw";
  return {
    seed,
    opponentId: opponent.id,
    candidateSeat,
    variantId: variant.id,
    winner: game.winner,
    outcome,
    steps: step,
    turns: game.turnNumber,
  };
}

function collectDecisionDiffsOnReferencePath(
  seed: number,
  reference: WhiteAiTuningVariant,
  compareVariant: WhiteAiTuningVariant,
  opponent: WhiteAiTuningOpponent,
  candidateSeat: PlayerId,
  options: CliOptions,
): DecisionDiffRecord[] {
  let game = createGame(seed, reference, opponent, candidateSeat);
  const referenceOptions = aiOptionsForSeats(reference, opponent, candidateSeat);
  const compareOptions = aiOptionsForSeats(compareVariant, opponent, candidateSeat);
  const diffs: DecisionDiffRecord[] = [];

  for (let step = 0; step < options.maxSteps && !game.winner && game.turnNumber <= options.maxTurns; step += 1) {
    if (!game.pendingLevelUp && game.currentPlayer === candidateSeat && game.turnNumber <= options.turnTo) {
      const referenceChoice = chooseDecisionWithTotalScore(game, referenceOptions);
      const compareChoice = chooseDecisionWithTotalScore(game, compareOptions);
      const referenceDecision = referenceChoice.decision;
      const compareDecision = compareChoice.decision;
      const referenceKey = decisionKey(referenceDecision);
      const compareKey = decisionKey(compareDecision);
      if (referenceKey !== compareKey) {
        diffs.push({
          step,
          turnNumber: game.turnNumber,
          player: game.currentPlayer,
          referenceDecision: referenceKey,
          compareDecision: compareKey,
          referenceScore: round1(referenceChoice.totalScore),
          compareScore: round1(compareChoice.totalScore),
          referenceCategory: categorizeDecision(referenceDecision, game, candidateSeat),
          compareCategory: categorizeDecision(compareDecision, game, candidateSeat),
          state: stateLine(game),
          board: boardLine(game),
        });
      }
      game = applyCpuDecision(game, referenceDecision);
    } else {
      game = runAutoStep(game, referenceOptions);
    }
  }

  return diffs;
}

function chooseDecisionWithTotalScore(game: GameState, options: CpuAiOptions): { decision: CpuDecision; totalScore: number } {
  const decision = chooseCpuDecision(game, options);
  const key = decisionKey(decision);
  const evaluation = inspectCpuDecisionEvaluations(game, options).find((candidate) => decisionKey(candidate.decision) === key);
  return {
    decision,
    totalScore: evaluation?.totalScore ?? decision.score,
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
    return `magic:${targetToKey(decision.action.target)}`;
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

function formatMarkdown(report: DiffReport): string {
  return [
    "# White AI Decision Diff Loop",
    "",
    `生成: ${report.generatedAt}`,
    `参照候補: \`${report.referenceVariantId}\``,
    `比較候補: ${report.compareVariantIds.map((id) => `\`${id}\``).join(", ")}`,
    `相手: ${report.opponents.join(", ")}`,
    `seed: ${report.seedStart}-${report.seedStart + report.count - 1} / 各seat`,
    `確認範囲: turn ${report.turnTo} まで`,
    "",
    "## Conclusion",
    "",
    ...report.conclusion.map((line) => `- ${line}`),
    "",
    "## Pair Summary",
    "",
    "| Compare | Seeds | Ref win / compare not | Compare win / ref not | Both win | Both loss | Other | First diff categories |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
    ...report.pairSummaries.map(formatPairRow),
    "",
    "## Samples",
    "",
    ...report.pairSummaries.flatMap(formatPairSamples),
    "",
    "## Reading",
    "",
    "- `Ref win / compare not` は参照候補だけが勝ったseed数。今回の主観察対象。",
    "- `First diff categories` は参照候補の盤面進行上で最初に選択が分かれた行動カテゴリ。",
    "- この差分は `pressure_attack_monster_plus4` の道筋上で比較候補も同一盤面評価したもの。分岐後の完全な棋譜比較ではなく、改善要因を探すための診断値。",
  ].join("\n");
}

function formatPairRow(pair: PairSummary): string {
  const other = pair.sameDraw + pair.otherDivergent;
  return [
    pair.compareVariantId,
    pair.seeds,
    pair.referenceWinsCompareNot,
    pair.compareWinsReferenceNot,
    pair.bothWin,
    pair.bothLoss,
    other,
    escapeCell(formatCounts(pair.firstDiffCategories)),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatPairSamples(pair: PairSummary): string[] {
  const lines = [`### ${pair.compareVariantId}`, ""];
  if (pair.samples.length === 0) {
    lines.push("参照候補だけが勝ったサンプルはなかった。", "");
    return lines;
  }
  for (const sample of pair.samples) {
    lines.push(`- seed ${sample.seed} / ${sample.opponentId} / candidate ${sample.candidateSeat}: ${sample.referenceOutcome} vs ${sample.compareOutcome}`);
    if (sample.firstDiff) {
      lines.push(`  - first diff turn ${sample.firstDiff.turnNumber} step ${sample.firstDiff.step}: ${sample.firstDiff.referenceCategory} => ${sample.firstDiff.compareCategory}`);
      lines.push(`  - ref: \`${sample.firstDiff.referenceDecision}\` (${sample.firstDiff.referenceScore}) / compare: \`${sample.firstDiff.compareDecision}\` (${sample.firstDiff.compareScore})`);
      lines.push(`  - state: ${sample.firstDiff.state}`);
      lines.push(`  - board: ${sample.firstDiff.board}`);
    } else {
      lines.push("  - turn範囲内の選択差分なし。");
    }
  }
  lines.push("");
  return lines;
}

function buildConclusion(reference: WhiteAiTuningVariant, pairs: readonly PairSummary[]): string[] {
  const lines: string[] = [];
  for (const pair of pairs) {
    const firstCategories = Object.entries(pair.firstDiffCategories).sort((a, b) => b[1] - a[1]);
    const topCategory = firstCategories[0];
    lines.push(`${reference.id} vs ${pair.compareVariantId}: 参照だけが勝ったseedは ${pair.referenceWinsCompareNot}/${pair.seeds}、比較だけが勝ったseedは ${pair.compareWinsReferenceNot}/${pair.seeds}。`);
    if (topCategory) {
      lines.push(`最初の分岐は \`${topCategory[0]}\` が最多（${topCategory[1]}件）。`);
    }
  }
  lines.push("次は、最多分岐カテゴリが敵モンスター攻撃へ寄るなら白限定の敵モンスター攻撃全般補正、マスター攻撃抑制へ寄るなら非リーサル本体攻撃抑制を候補にする。");
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
    throw new Error(`white-ai-diff currently supports baseline master opponents only: ${opponent.id}`);
  }
}

function participantToMaster(opponent: WhiteAiTuningOpponent): MasterId {
  if (opponent.participant === "white" || opponent.participant === "black") {
    return opponent.participant;
  }
  throw new Error(`Unsupported lab participant in decision diff: ${opponent.participant}`);
}

function requireOutcome(
  outcomes: ReadonlyMap<string, OutcomeRecord>,
  variantId: string,
  opponentId: string,
  candidateSeat: PlayerId,
  seed: number,
): OutcomeRecord {
  const outcome = outcomes.get(outcomeKey(variantId, opponentId, candidateSeat, seed));
  if (!outcome) {
    throw new Error(`Missing outcome: ${variantId} ${opponentId} ${candidateSeat} seed ${seed}`);
  }
  return outcome;
}

function outcomeKey(variantId: string, opponentId: string, candidateSeat: PlayerId, seed: number): string {
  return `${variantId}:${opponentId}:${candidateSeat}:${seed}`;
}

function seedRange(seedStart: number, count: number): number[] {
  return Array.from({ length: count }, (_, index) => seedStart + index);
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { ...DEFAULT_OPTIONS, compareVariantIds: [...DEFAULT_OPTIONS.compareVariantIds], opponentIds: [...DEFAULT_OPTIONS.opponentIds] };
  let compareVariantIds: string[] | undefined;
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
    } else if (arg === "--turn-to") {
      parsed.turnTo = readNumber(arg, next);
      i += 1;
    } else if (arg === "--max-samples") {
      parsed.maxSamples = readNumber(arg, next);
      i += 1;
    } else if (arg === "--reference") {
      parsed.referenceVariantId = readString(arg, next);
      i += 1;
    } else if (arg === "--compare") {
      compareVariantIds = [...(compareVariantIds ?? []), readString(arg, next)];
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
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (compareVariantIds) {
    parsed.compareVariantIds = compareVariantIds;
  }
  if (opponentIds) {
    parsed.opponentIds = opponentIds;
  }
  if (parsed.compareVariantIds.includes(parsed.referenceVariantId)) {
    throw new Error("--compare must not include --reference");
  }
  assertMinimum("--seed-start", parsed.seedStart, 0);
  assertMinimum("--count", parsed.count, 1);
  assertMinimum("--max-steps", parsed.maxSteps, 1);
  assertMinimum("--max-turns", parsed.maxTurns, 1);
  assertMinimum("--turn-to", parsed.turnTo, 1);
  assertMinimum("--max-samples", parsed.maxSamples, 0);
  return parsed;
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

function formatCounts(counts: Record<string, number>): string {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return entries.length > 0 ? entries.map(([key, count]) => `${key}:${count}`).join(", ") : "-";
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isInteger(number)) {
    throw new Error(`${name} must be an integer`);
  }
  return number;
}

function readString(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function assertMinimum(name: string, value: number, minimum: number): void {
  if (value < minimum) {
    throw new Error(`${name} must be ${minimum} or greater`);
  }
}

function printHelp(): void {
  console.log(`
Usage:
  npm run lab:masters:white-ai-diff -- [options]

Options:
  --seed-start <n>      First seed. Default: ${DEFAULT_OPTIONS.seedStart}
  --count <n>           Seeds per opponent/seat. Default: ${DEFAULT_OPTIONS.count}
  --turn-to <n>         Inspect same-state differences through this turn. Default: ${DEFAULT_OPTIONS.turnTo}
  --reference <id>      Reference variant. Default: ${DEFAULT_OPTIONS.referenceVariantId}
  --compare <id>        Compared variant. Can be repeated.
  --opponent <id>       Opponent id. Can be repeated. Defaults to black opponents.
  --max-samples <n>     Sample count per comparison. Default: ${DEFAULT_OPTIONS.maxSamples}
  --markdown <path>     Write a Markdown report.
  --json <path>         Write a JSON report.
`);
}

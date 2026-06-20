import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { getCardName } from "../src/game/cards";
import {
  DEFAULT_CORE_MASTER_TUNING_VARIANTS,
  formatCoreMasterTuningLoopMarkdown,
  runCoreMasterTuningLoop,
  type CoreMasterTuningReport,
  type CoreMasterTuningVariant,
} from "../src/game/coreMasterTuningLoop";
import { getDeckPreset, type DeckPresetId } from "../src/game/deckPresets";
import type { CpuAiProfile } from "../src/game/cpuAi";
import type { MasterLabEvaluationTuning } from "../src/game/masterLab";
import {
  validateMasterLabAutoPlay,
  type MasterLabAutoPlayOptions,
  type MasterLabDecisionEvent,
  type MasterLabParticipantId,
} from "../src/game/masterLabAutoPlay";
import type { PlayerId, SlotKey } from "../src/game/types";

const RESULTS_DIR = "docs/master_lab/results";
const REPORT_PATH = `${RESULTS_DIR}/2026-06-21_drill_break_ai_recheck.md`;
const JSON_PATH = `${RESULTS_DIR}/2026-06-21_drill_break_ai_recheck.json`;
const MATRIX_MARKDOWN_PATH = `${RESULTS_DIR}/2026-06-21_core_master_small_matrix_after_drillbreak.md`;
const MATRIX_JSON_PATH = `${RESULTS_DIR}/2026-06-21_core_master_small_matrix_after_drillbreak.json`;

const DRILL_GAMES_PER_DIRECTION = 3;
const MATRIX_GAMES_PER_PAIRING = 6;
const DRILL_SEED_START = 9700;
const MATRIX_SEED_START = 9900;
const MAX_STEPS = 700;
const MAX_TURNS = 160;
const HISTORY_LIMIT = 700;

const RAON_CARD_ID = "card_107";
const LEON_CARD_ID = "card_108";
const DRILL_BREAK_COMMAND_ID = "ドリルブレイク";

interface DeckEntry {
  id: DeckPresetId;
  label: string;
  participant: MasterLabParticipantId;
  aiProfile: CpuAiProfile;
  labActionMargin?: number;
  labEvaluationTuning?: MasterLabEvaluationTuning;
}

interface DirectedRunSummary {
  id: string;
  seedStart: number;
  seedEnd: number;
  playerDeckId: DeckPresetId;
  cpuDeckId: DeckPresetId;
  drillSeat: PlayerId;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  failures: number;
  warnings: number;
  maxSteps: number;
  maxTurns: number;
}

interface MatchupSummary {
  drillDeckId: DeckPresetId;
  drillLabel: string;
  opponentDeckId: DeckPresetId;
  opponentLabel: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  failures: number;
  warnings: number;
  directions: DirectedRunSummary[];
}

interface DeckSummary {
  deckId: DeckPresetId;
  label: string;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  failures: number;
  warnings: number;
}

interface DrillBreakSample {
  seed: number;
  turnNumber: number;
  step: number;
  deckId: DeckPresetId;
  player: PlayerId;
  decision: string;
  score: number;
  enemyHpBefore: number;
  enemyHpAfter: number;
  hpDelta: number;
  actorSpent: boolean;
  partnerSpent: boolean;
  newLog: string[];
}

interface PairReadySkipSample {
  seed: number;
  turnNumber: number;
  step: number;
  deckId: DeckPresetId;
  decision: string;
  reason: string;
  score: number;
  newLog: string[];
}

interface DrillAuditSummary {
  games: number;
  drillBreakChosen: number;
  drillBreakHpDeltaTotal: number;
  drillBreakHpDeltaDistribution: Record<string, number>;
  zeroHpDeltaDrillBreaks: number;
  partnerNotSpent: number;
  actorNotSpent: number;
  sameTurnDoubleDrillBreaks: number;
  raonLeonSummons: number;
  raonLeonFocuses: number;
  raonLeonMoves: number;
  raonLeonAttackUsage: Record<string, number>;
  pairReadyOpportunities: number;
  pairReadyDrillChosen: number;
  pairReadySkipped: number;
  pairReadySkippedEndTurn: number;
  pairReadySkippedFocus: number;
  samples: DrillBreakSample[];
  pairReadySkipSamples: PairReadySkipSample[];
}

interface DrillRecheckReport {
  generatedAt: string;
  drillGamesPerDirection: number;
  matrixGamesPerPairing: number;
  drillDecks: DeckEntry[];
  opponents: DeckEntry[];
  deckSummaries: DeckSummary[];
  matchupSummaries: MatchupSummary[];
  audit: DrillAuditSummary;
  coreMatrix: CoreMasterTuningReport;
}

const DRILL_DECKS: DeckEntry[] = [
  {
    id: "submission-pro-with-rare8-black-973",
    label: "黒 #973 Wドラゴン&ドリルブレイク",
    participant: "black",
    aiProfile: "pressure",
  },
  {
    id: "submission-pro-with-rare8-black-44",
    label: "黒 #44 ラオンレオンスーパー",
    participant: "black",
    aiProfile: "pressure",
  },
  {
    id: "submission-pro-no-rare8-black-539",
    label: "黒 #539 黒ラオレオ",
    participant: "black",
    aiProfile: "pressure",
  },
  {
    id: "submission-pro-no-rare8-white-78",
    label: "白 #78 レオラオ",
    participant: "white",
    aiProfile: "white",
  },
];

const OPPONENTS: DeckEntry[] = [
  {
    id: "submission-pro-with-rare8-white-1339",
    label: "白基準 #1339",
    participant: "white",
    aiProfile: "white",
  },
  {
    id: "submission-pro-no-rare8-black-493",
    label: "黒基準 #493",
    participant: "black",
    aiProfile: "pressure",
  },
  {
    id: "master-lab-decoy-unit-back-stable",
    label: "デコイ 後衛安定",
    participant: "decoy",
    aiProfile: "strong",
    labActionMargin: 12,
    labEvaluationTuning: { targetOwnerBias: { enemy: 16 } },
  },
];

const CORE_MATRIX_VARIANT_IDS = new Set([
  "white_494_white",
  "black_pressure_pressure",
  "decoy_back_stable",
]);

const report = runDrillRecheck();
const coreMatrixMarkdown = formatCoreMasterTuningLoopMarkdown(report.coreMatrix);
await writeReport(REPORT_PATH, formatDrillRecheckMarkdown(report));
await writeReport(JSON_PATH, JSON.stringify(report, null, 2));
await writeReport(MATRIX_MARKDOWN_PATH, coreMatrixMarkdown);
await writeReport(MATRIX_JSON_PATH, JSON.stringify(report.coreMatrix, null, 2));

console.log(`Drill Break recheck: ${totalGames(report.matchupSummaries)} games`);
console.log(`Report: ${REPORT_PATH}`);
console.log(`JSON: ${JSON_PATH}`);
console.log(`Core matrix: ${MATRIX_MARKDOWN_PATH}`);
console.log(`Core matrix JSON: ${MATRIX_JSON_PATH}`);

function runDrillRecheck(): DrillRecheckReport {
  const matchupSummaries: MatchupSummary[] = [];
  const audit = createAuditSummary();
  let runIndex = 0;

  for (const drillDeck of DRILL_DECKS) {
    assertDeckExists(drillDeck.id);
    for (const opponent of OPPONENTS) {
      assertDeckExists(opponent.id);
      const directions: DirectedRunSummary[] = [];
      for (const direction of [
        { player: drillDeck, cpu: opponent, drillSeat: "player" as const },
        { player: opponent, cpu: drillDeck, drillSeat: "cpu" as const },
      ]) {
        const seedStart = DRILL_SEED_START + runIndex * DRILL_GAMES_PER_DIRECTION;
        const seedEnd = seedStart + DRILL_GAMES_PER_DIRECTION - 1;
        console.log(`${direction.player.label} vs ${direction.cpu.label}: seeds ${seedStart}-${seedEnd}`);
        const result = validateMasterLabAutoPlay({
          seedStart,
          count: DRILL_GAMES_PER_DIRECTION,
          maxSteps: MAX_STEPS,
          maxTurns: MAX_TURNS,
          includeGameHistory: true,
          historyLimit: HISTORY_LIMIT,
          participants: {
            player: direction.player.participant,
            cpu: direction.cpu.participant,
          },
          deckPresets: {
            player: direction.player.id,
            cpu: direction.cpu.id,
          },
          aiProfiles: {
            player: direction.player.aiProfile,
            cpu: direction.cpu.aiProfile,
          },
          ...labOptionsFor(direction.player, direction.cpu),
        });
        updateAudit(audit, result.games, drillDeck.id, direction.drillSeat);
        directions.push(summarizeDirectedRun(
          `${direction.player.id}_vs_${direction.cpu.id}`,
          seedStart,
          seedEnd,
          direction.player.id,
          direction.cpu.id,
          direction.drillSeat,
          result,
        ));
        runIndex += 1;
      }
      matchupSummaries.push(summarizeMatchup(drillDeck, opponent, directions));
    }
  }

  const coreMatrixFull = runCoreMatrix();
  return {
    generatedAt: new Date().toISOString(),
    drillGamesPerDirection: DRILL_GAMES_PER_DIRECTION,
    matrixGamesPerPairing: MATRIX_GAMES_PER_PAIRING,
    drillDecks: DRILL_DECKS,
    opponents: OPPONENTS,
    deckSummaries: summarizeDecks(DRILL_DECKS, matchupSummaries),
    matchupSummaries,
    audit,
    coreMatrix: coreMatrixFull,
  };
}

function runCoreMatrix(): CoreMasterTuningReport {
  console.log(`core master small matrix: ${MATRIX_GAMES_PER_PAIRING} games/pairing`);
  return runCoreMasterTuningLoop({
    variants: coreMatrixVariants(),
    gamesPerPairing: MATRIX_GAMES_PER_PAIRING,
    seedStart: MATRIX_SEED_START,
    maxSteps: MAX_STEPS,
    maxTurns: MAX_TURNS,
  });
}

function coreMatrixVariants(): readonly CoreMasterTuningVariant[] {
  return DEFAULT_CORE_MASTER_TUNING_VARIANTS.filter((variant) => CORE_MATRIX_VARIANT_IDS.has(variant.id));
}

function summarizeDirectedRun(
  id: string,
  seedStart: number,
  seedEnd: number,
  playerDeckId: DeckPresetId,
  cpuDeckId: DeckPresetId,
  drillSeat: PlayerId,
  result: ReturnType<typeof validateMasterLabAutoPlay>,
): DirectedRunSummary {
  let wins = 0;
  let losses = 0;
  let draws = 0;
  for (const game of result.games) {
    if (!game.winner) {
      draws += 1;
    } else if (game.winner === drillSeat) {
      wins += 1;
    } else {
      losses += 1;
    }
  }
  return {
    id,
    seedStart,
    seedEnd,
    playerDeckId,
    cpuDeckId,
    drillSeat,
    games: result.summary.games,
    wins,
    losses,
    draws,
    failures: result.summary.failures,
    warnings: result.summary.warnings,
    maxSteps: result.summary.maxSteps,
    maxTurns: result.summary.maxTurns,
  };
}

function summarizeMatchup(drillDeck: DeckEntry, opponent: DeckEntry, directions: DirectedRunSummary[]): MatchupSummary {
  const games = directions.reduce((total, direction) => total + direction.games, 0);
  const wins = directions.reduce((total, direction) => total + direction.wins, 0);
  const losses = directions.reduce((total, direction) => total + direction.losses, 0);
  const draws = directions.reduce((total, direction) => total + direction.draws, 0);
  return {
    drillDeckId: drillDeck.id,
    drillLabel: drillDeck.label,
    opponentDeckId: opponent.id,
    opponentLabel: opponent.label,
    games,
    wins,
    losses,
    draws,
    winRate: winRate(wins, games),
    failures: directions.reduce((total, direction) => total + direction.failures, 0),
    warnings: directions.reduce((total, direction) => total + direction.warnings, 0),
    directions,
  };
}

function summarizeDecks(drillDecks: DeckEntry[], matchups: MatchupSummary[]): DeckSummary[] {
  return drillDecks.map((deck) => {
    const rows = matchups.filter((matchup) => matchup.drillDeckId === deck.id);
    const games = rows.reduce((total, row) => total + row.games, 0);
    const wins = rows.reduce((total, row) => total + row.wins, 0);
    const losses = rows.reduce((total, row) => total + row.losses, 0);
    const draws = rows.reduce((total, row) => total + row.draws, 0);
    return {
      deckId: deck.id,
      label: deck.label,
      games,
      wins,
      losses,
      draws,
      winRate: winRate(wins, games),
      failures: rows.reduce((total, row) => total + row.failures, 0),
      warnings: rows.reduce((total, row) => total + row.warnings, 0),
    };
  }).sort((a, b) => b.winRate - a.winRate || b.wins - a.wins || a.label.localeCompare(b.label));
}

function createAuditSummary(): DrillAuditSummary {
  return {
    games: 0,
    drillBreakChosen: 0,
    drillBreakHpDeltaTotal: 0,
    drillBreakHpDeltaDistribution: {},
    zeroHpDeltaDrillBreaks: 0,
    partnerNotSpent: 0,
    actorNotSpent: 0,
    sameTurnDoubleDrillBreaks: 0,
    raonLeonSummons: 0,
    raonLeonFocuses: 0,
    raonLeonMoves: 0,
    raonLeonAttackUsage: {},
    pairReadyOpportunities: 0,
    pairReadyDrillChosen: 0,
    pairReadySkipped: 0,
    pairReadySkippedEndTurn: 0,
    pairReadySkippedFocus: 0,
    samples: [],
    pairReadySkipSamples: [],
  };
}

function updateAudit(
  audit: DrillAuditSummary,
  games: Array<{ history?: MasterLabDecisionEvent[] }>,
  deckId: DeckPresetId,
  drillSeat: PlayerId,
): void {
  audit.games += games.length;
  const drillBreaksByTurn = new Map<string, number>();

  for (const game of games) {
    for (const event of game.history ?? []) {
      if (event.player !== drillSeat) {
        continue;
      }
      const pairReady = isPairReady(event.before, drillSeat);
      const attack = parseAttackDecision(event.decision);
      const focusSlotKey = parseFocusDecision(event.decision);
      const move = parseMoveDecision(event.decision);

      if (event.decision.startsWith("summon:") && (event.decision.includes(RAON_CARD_ID) || event.decision.includes(LEON_CARD_ID))) {
        audit.raonLeonSummons += 1;
      }
      if (focusSlotKey && isDrillCard(slotCard(event.before, focusSlotKey))) {
        audit.raonLeonFocuses += 1;
      }
      if (move && isDrillCard(slotCard(event.before, move.from))) {
        audit.raonLeonMoves += 1;
      }

      if (pairReady) {
        audit.pairReadyOpportunities += 1;
      }

      if (attack && isDrillCard(slotCard(event.before, attack.attackerSlotKey))) {
        const cardName = getCardName(slotCard(event.before, attack.attackerSlotKey) ?? "");
        const usageKey = `${cardName}:${attack.commandId}->${targetKind(attack.targetKey)}`;
        audit.raonLeonAttackUsage[usageKey] = (audit.raonLeonAttackUsage[usageKey] ?? 0) + 1;
      }

      if (attack?.commandId === DRILL_BREAK_COMMAND_ID) {
        audit.drillBreakChosen += 1;
        if (pairReady) {
          audit.pairReadyDrillChosen += 1;
        }
        const enemy = opponentOf(event.player);
        const hpDelta = event.before.players[enemy].hp - event.after.players[enemy].hp;
        audit.drillBreakHpDeltaTotal += hpDelta;
        audit.drillBreakHpDeltaDistribution[String(hpDelta)] = (audit.drillBreakHpDeltaDistribution[String(hpDelta)] ?? 0) + 1;
        if (hpDelta <= 0) {
          audit.zeroHpDeltaDrillBreaks += 1;
        }
        const actorAfter = slot(event.after, attack.attackerSlotKey);
        const partnerSlotKey = drillBreakPartnerSlotKey(attack.attackerSlotKey, slotCard(event.before, attack.attackerSlotKey));
        const partnerAfter = partnerSlotKey ? slot(event.after, partnerSlotKey) : undefined;
        const actorSpent = isSpent(actorAfter);
        const partnerSpent = isSpent(partnerAfter);
        if (!actorSpent) {
          audit.actorNotSpent += 1;
        }
        if (!partnerSpent) {
          audit.partnerNotSpent += 1;
        }
        const turnKey = `${event.seed}:${event.turnNumber}:${event.player}`;
        drillBreaksByTurn.set(turnKey, (drillBreaksByTurn.get(turnKey) ?? 0) + 1);
        if (audit.samples.length < 10) {
          audit.samples.push({
            seed: event.seed,
            turnNumber: event.turnNumber,
            step: event.step,
            deckId,
            player: event.player,
            decision: event.decision,
            score: round1(event.score),
            enemyHpBefore: event.before.players[enemy].hp,
            enemyHpAfter: event.after.players[enemy].hp,
            hpDelta,
            actorSpent,
            partnerSpent,
            newLog: event.newLog.slice(-5),
          });
        }
      } else if (pairReady) {
        audit.pairReadySkipped += 1;
        if (event.decision === "end_turn") {
          audit.pairReadySkippedEndTurn += 1;
        }
        if (focusSlotKey) {
          audit.pairReadySkippedFocus += 1;
        }
        if (audit.pairReadySkipSamples.length < 10) {
          audit.pairReadySkipSamples.push({
            seed: event.seed,
            turnNumber: event.turnNumber,
            step: event.step,
            deckId,
            decision: event.decision,
            reason: event.reason,
            score: round1(event.score),
            newLog: event.newLog.slice(-5),
          });
        }
      }
    }
  }

  audit.sameTurnDoubleDrillBreaks += [...drillBreaksByTurn.values()].filter((count) => count > 1).length;
}

function isPairReady(summary: MasterLabDecisionEvent["before"], player: PlayerId): boolean {
  const left = slot(summary, `${player}_front_left` as SlotKey);
  const right = slot(summary, `${player}_front_right` as SlotKey);
  return left?.card === LEON_CARD_ID &&
    right?.card === RAON_CARD_ID &&
    left.status === "active" &&
    right.status === "active" &&
    !isSpent(left) &&
    !isSpent(right);
}

function parseAttackDecision(decision: string): { attackerSlotKey: SlotKey; commandId: string; targetKey: string } | undefined {
  const match = decision.match(/^attack:([^:]+):(.+?)->(.+)$/);
  if (!match) {
    return undefined;
  }
  return {
    attackerSlotKey: match[1] as SlotKey,
    commandId: match[2],
    targetKey: match[3],
  };
}

function parseFocusDecision(decision: string): SlotKey | undefined {
  const match = decision.match(/^focus:(.+)$/);
  return match ? match[1] as SlotKey : undefined;
}

function parseMoveDecision(decision: string): { from: SlotKey; to: SlotKey } | undefined {
  const match = decision.match(/^move:(.+)->(.+)$/);
  if (!match) {
    return undefined;
  }
  return { from: match[1] as SlotKey, to: match[2] as SlotKey };
}

function drillBreakPartnerSlotKey(attackerSlotKey: SlotKey, cardId: string | undefined): SlotKey | undefined {
  if (cardId === RAON_CARD_ID && attackerSlotKey.endsWith("_front_right")) {
    return attackerSlotKey.replace("_front_right", "_front_left") as SlotKey;
  }
  if (cardId === LEON_CARD_ID && attackerSlotKey.endsWith("_front_left")) {
    return attackerSlotKey.replace("_front_left", "_front_right") as SlotKey;
  }
  return undefined;
}

function slot(
  summary: MasterLabDecisionEvent["before"] | MasterLabDecisionEvent["after"],
  slotKey: SlotKey,
): MasterLabDecisionEvent["before"]["slots"][number] | undefined {
  return summary.slots.find((entry) => entry.slotKey === slotKey);
}

function slotCard(
  summary: MasterLabDecisionEvent["before"] | MasterLabDecisionEvent["after"],
  slotKey: SlotKey,
): string | undefined {
  return slot(summary, slotKey)?.card;
}

function isSpent(entry: MasterLabDecisionEvent["before"]["slots"][number] | undefined): boolean {
  return entry?.actionCount !== undefined &&
    entry.actionLimit !== undefined &&
    entry.actionCount >= entry.actionLimit;
}

function isDrillCard(cardId: string | undefined): boolean {
  return cardId === RAON_CARD_ID || cardId === LEON_CARD_ID;
}

function targetKind(targetKey: string): string {
  if (targetKey.startsWith("master:")) {
    return "master";
  }
  if (targetKey.startsWith("monster:")) {
    return "monster";
  }
  return targetKey;
}

function labOptionsFor(player: DeckEntry, cpu: DeckEntry): Pick<MasterLabAutoPlayOptions, "labActionMargin" | "labEvaluationTuning"> {
  const labEntry = [player, cpu].find((entry) => entry.participant === "decoy" || entry.participant === "sacrifice" || entry.participant === "timing");
  return {
    labActionMargin: labEntry?.labActionMargin,
    labEvaluationTuning: labEntry?.labEvaluationTuning,
  };
}

function opponentOf(player: PlayerId): PlayerId {
  return player === "player" ? "cpu" : "player";
}

function winRate(wins: number, games: number): number {
  return games === 0 ? 0 : round1((wins / games) * 100);
}

function totalGames(matchups: MatchupSummary[]): number {
  return matchups.reduce((total, matchup) => total + matchup.games, 0);
}

function formatDrillRecheckMarkdown(report: DrillRecheckReport): string {
  const lines: string[] = [];
  const audit = report.audit;
  const averageDrillBreakHpDelta = audit.drillBreakChosen === 0
    ? 0
    : round1(audit.drillBreakHpDeltaTotal / audit.drillBreakChosen);

  lines.push("# ドリルブレイクAI再確認");
  lines.push("");
  lines.push(`- 生成日時: ${report.generatedAt}`);
  lines.push(`- ドリル入りデッキ再確認: ${report.drillGamesPerDirection} games/direction、4デッキ x 3相手 x 2方向 = ${totalGames(report.matchupSummaries)} games`);
  lines.push(`- 白・黒・デコイ小規模マトリクス: ${report.matrixGamesPerPairing} games/pairing、代表3 variants`);
  lines.push(`- 上限: ${MAX_STEPS} steps / ${MAX_TURNS} turns`);
  lines.push("");
  lines.push("## 結論");
  lines.push("");
  lines.push(`- ドリルブレイク採用は ${audit.drillBreakChosen} 回。平均マスターHP差分は ${averageDrillBreakHpDelta}、HP差分分布は ${formatUsage(audit.drillBreakHpDeltaDistribution)}。`);
  lines.push(`- 0差分ドリルブレイク ${audit.zeroHpDeltaDrillBreaks}、相方未行動済み ${audit.partnerNotSpent}、同ターン二重ドリル ${audit.sameTurnDoubleDrillBreaks}。今回ログ上は、修正後仕様とAI評価の大きなズレは見えていない。`);
  lines.push(`- ラオン/レオンが正位置で両方行動前の機会は ${audit.pairReadyOpportunities} 回。そのうちドリルブレイク採用 ${audit.pairReadyDrillChosen}、別行動 ${audit.pairReadySkipped}。別行動には敵モンスター処理や通常攻撃が含まれ、常にドリルへ吸われる挙動ではなかった。`);
  lines.push(`- ただし小母数なので、デッキ勝率は方向性確認に留める。追加確認するなら上位/違和感ありの2デッキだけ 20-30 games/direction に増やすのがよい。`);
  lines.push("");

  lines.push("## ドリル入りデッキ勝率");
  lines.push("");
  lines.push("| rank | deck | games | W-L-D | win% | issues |");
  lines.push("| ---: | --- | ---: | --- | ---: | --- |");
  report.deckSummaries.forEach((summary, index) => {
    lines.push(`| ${index + 1} | ${summary.label}<br>${summary.deckId} | ${summary.games} | ${summary.wins}-${summary.losses}-${summary.draws} | ${summary.winRate}% | ${summary.failures}F/${summary.warnings}W |`);
  });
  lines.push("");

  lines.push("## 相手別");
  lines.push("");
  lines.push("| drill deck | opponent | games | W-L-D | win% | issues |");
  lines.push("| --- | --- | ---: | --- | ---: | --- |");
  for (const matchup of report.matchupSummaries) {
    lines.push(`| ${matchup.drillLabel}<br>${matchup.drillDeckId} | ${matchup.opponentLabel}<br>${matchup.opponentDeckId} | ${matchup.games} | ${matchup.wins}-${matchup.losses}-${matchup.draws} | ${matchup.winRate}% | ${matchup.failures}F/${matchup.warnings}W |`);
  }
  lines.push("");

  lines.push("## ラオン/レオン監査");
  lines.push("");
  lines.push("| metric | value |");
  lines.push("| --- | ---: |");
  lines.push(`| games | ${audit.games} |`);
  lines.push(`| ラオン/レオン召喚 | ${audit.raonLeonSummons} |`);
  lines.push(`| ラオン/レオンためる | ${audit.raonLeonFocuses} |`);
  lines.push(`| ラオン/レオン移動 | ${audit.raonLeonMoves} |`);
  lines.push(`| ドリルブレイク採用 | ${audit.drillBreakChosen} |`);
  lines.push(`| ドリルブレイク平均HP差分 | ${averageDrillBreakHpDelta} |`);
  lines.push(`| 0差分ドリルブレイク | ${audit.zeroHpDeltaDrillBreaks} |`);
  lines.push(`| 攻撃者未行動済み | ${audit.actorNotSpent} |`);
  lines.push(`| 相方未行動済み | ${audit.partnerNotSpent} |`);
  lines.push(`| 同ターン二重ドリル | ${audit.sameTurnDoubleDrillBreaks} |`);
  lines.push(`| 正位置ペア行動前 | ${audit.pairReadyOpportunities} |`);
  lines.push(`| 正位置ペアからドリル | ${audit.pairReadyDrillChosen} |`);
  lines.push(`| 正位置ペアから別行動 | ${audit.pairReadySkipped} |`);
  lines.push(`| 正位置ペアからターン終了 | ${audit.pairReadySkippedEndTurn} |`);
  lines.push(`| 正位置ペアからためる | ${audit.pairReadySkippedFocus} |`);
  lines.push("");
  lines.push(`- ラオン/レオン攻撃内訳: ${formatUsage(audit.raonLeonAttackUsage)}`);
  lines.push("");

  if (audit.samples.length > 0) {
    lines.push("### ドリルブレイク採用サンプル");
    lines.push("");
    for (const sample of audit.samples) {
      lines.push(`- seed ${sample.seed} turn ${sample.turnNumber} step ${sample.step} ${sample.deckId}: ${sample.decision} / HP ${sample.enemyHpBefore}->${sample.enemyHpAfter} / actorSpent ${sample.actorSpent} / partnerSpent ${sample.partnerSpent}`);
      lines.push(`  - ${sample.newLog.join(" / ")}`);
    }
    lines.push("");
  }

  if (audit.pairReadySkipSamples.length > 0) {
    lines.push("### 正位置ペアから別行動サンプル");
    lines.push("");
    for (const sample of audit.pairReadySkipSamples) {
      lines.push(`- seed ${sample.seed} turn ${sample.turnNumber} step ${sample.step} ${sample.deckId}: ${sample.decision} / score ${sample.score}`);
      lines.push(`  - reason: ${sample.reason}`);
      lines.push(`  - ${sample.newLog.join(" / ")}`);
    }
    lines.push("");
  }

  lines.push("## 白・黒・デコイ小規模マトリクス");
  lines.push("");
  lines.push("| master | best variant | games | win point | score |");
  lines.push("| --- | --- | ---: | ---: | ---: |");
  for (const summary of report.coreMatrix.masterSummaries) {
    lines.push(`| ${summary.masterId} | ${summary.bestVariantId} | ${summary.games} | ${round1(summary.winPointRate * 100)}% | ${round1(summary.bestScore)} |`);
  }
  lines.push("");
  lines.push("| rank | master | variant | games | W-L-D | win point | vs white | vs black | vs decoy | issues |");
  lines.push("| ---: | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | --- |");
  report.coreMatrix.standings.forEach((standing, index) => {
    lines.push(`| ${index + 1} | ${standing.variant.masterId} | ${standing.variant.label}<br>${standing.variant.deckPreset} | ${standing.games} | ${standing.wins}-${standing.losses}-${standing.draws} | ${round1(standing.winPointRate * 100)}% | ${formatMatchup(standing.matchups.white)} | ${formatMatchup(standing.matchups.black)} | ${formatMatchup(standing.matchups.decoy)} | ${standing.failures}F/${standing.warnings}W |`);
  });
  lines.push("");
  lines.push(`詳細マトリクス: ${MATRIX_MARKDOWN_PATH}`);
  lines.push("");

  lines.push("## 次の扱い");
  lines.push("");
  lines.push("- 現時点ではドリルブレイク修正による過剰勝率化・不正連打・相方未消費は見えていない。");
  lines.push("- 勝率確認の次段階は、#973 と #44 のような高勝率寄り候補だけを中母数へ増やすより、まず正位置ペア成立時の未選択候補スコアを直接保存する監査を追加した方が、AI過大評価の切り分けには効く。");

  return lines.join("\n");
}

function formatMatchup(matchup: { games: number; wins: number; losses: number; draws: number; winPointRate: number } | undefined): string {
  if (!matchup || matchup.games === 0) {
    return "-";
  }
  return `${round1(matchup.winPointRate * 100)}%<br>${matchup.wins}-${matchup.losses}-${matchup.draws}`;
}

function formatUsage(usage: Record<string, number>): string {
  const entries = Object.entries(usage).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (entries.length === 0) {
    return "-";
  }
  return entries.map(([key, value]) => `${key} ${round1(value)}`).join(", ");
}

function assertDeckExists(deckId: DeckPresetId): void {
  getDeckPreset(deckId);
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

async function writeReport(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${content}\n`);
}

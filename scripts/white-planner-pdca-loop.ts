import { performance } from "node:perf_hooks";
import {
  applyCpuDecision,
  chooseCpuDecision,
  type CpuAiOptions,
  type CpuAiProfile,
  type CpuAiSearchOptions,
  type CpuDecision,
} from "../src/game/cpuAi";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, runAutoStep } from "../src/game/rules";
import type { GameState, PlayerId } from "../src/game/types";
import { average, escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface Candidate {
  id: string;
  note: string;
  search: CpuAiSearchOptions;
}

interface CliOptions {
  seedStart: number;
  gamesPerDirection: number;
  maxSteps: number;
  maxTurns: number;
  deckPreset: DeckPresetId;
  directions: Direction[];
  candidates: Candidate[];
  streamProgress: boolean;
  markdownPath?: string;
  jsonPath?: string;
}

interface DecisionStats {
  decisions: number;
  elapsedMs: number;
  maxDecisionMs: number;
  actionCounts: Record<string, number>;
}

interface GameResult {
  candidateId: string;
  direction: Direction;
  seed: number;
  profiles: Record<PlayerId, CpuAiProfile>;
  winner?: PlayerId;
  winnerProfile?: CpuAiProfile;
  steps: number;
  turns: number;
  playerHp: number;
  cpuHp: number;
  challengerHp: number;
  baselineHp: number;
  issue?: string;
  decisionStats: Record<PlayerId, DecisionStats>;
}

interface CandidateSummary {
  candidateId: string;
  note: string;
  games: number;
  challengerWins: number;
  baselineWins: number;
  draws: number;
  winPointRate: number;
  averageHpMargin: number;
  averageSteps: number;
  averageTurns: number;
  averageDecisionMs: number;
  maxDecisionMs: number;
  issues: number;
  actionCounts: Record<string, number>;
}

interface PdcaReport {
  generatedAt: string;
  options: Omit<CliOptions, "candidates"> & { candidates: Array<Pick<Candidate, "id" | "note" | "search">> };
  games: GameResult[];
  summaries: CandidateSummary[];
  conclusion: string[];
}

const DEFAULT_CANDIDATES = [
  {
    id: "current",
    note: "現行 white_planner",
    search: {},
  },
  {
    id: "conservative32_gap45",
    note: "採用をやや厳しくし、通常評価から離れすぎる手を抑える",
    search: {
      terminalPlanAdoptionMinMargin: 32,
      terminalPlanAdoptionMaxRootScoreGap: 45,
      terminalPlanRootDecisionWeight: 0.16,
      terminalPlanRootGapPenaltyWeight: 0.65,
    },
  },
  {
    id: "conservative48_gap25",
    note: "採用を強めに絞り、planner の過剰介入を抑える",
    search: {
      terminalPlanAdoptionMinMargin: 48,
      terminalPlanAdoptionMaxRootScoreGap: 25,
      terminalPlanRootDecisionWeight: 0.12,
      terminalPlanRootGapPenaltyWeight: 0.8,
    },
  },
  {
    id: "strict80_gap0",
    note: "通常評価と同等以上の候補だけ planner 採用する安全寄り",
    search: {
      terminalPlanAdoptionMinMargin: 80,
      terminalPlanAdoptionMaxRootScoreGap: 0,
      terminalPlanRootDecisionWeight: 0.05,
      terminalPlanRootGapPenaltyWeight: 1.2,
    },
  },
  {
    id: "low_focus_conservative",
    note: "focus 終端価値を抑え、削り放棄を減らす",
    search: {
      terminalPlanFocusHandoffValue: 24,
      terminalPlanShieldHandoffValue: 10,
      terminalPlanAdoptionMinMargin: 40,
      terminalPlanAdoptionMaxRootScoreGap: 35,
      terminalPlanRootDecisionWeight: 0.12,
      terminalPlanRootGapPenaltyWeight: 0.8,
    },
  },
  {
    id: "response2_conservative",
    note: "相手応答を少し深く読み、採用は保守的にする",
    search: {
      sameTurnOpponentTerminalPlanDepth: 2,
      terminalPlanAdoptionMinMargin: 48,
      terminalPlanAdoptionMaxRootScoreGap: 25,
      terminalPlanRootDecisionWeight: 0.12,
      terminalPlanRootGapPenaltyWeight: 0.8,
    },
  },
  {
    id: "response2_width2",
    note: "相手応答を深さ2・幅2で読み、現行採用ゲートは維持する",
    search: {
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 2,
    },
  },
  {
    id: "response2_width3",
    note: "相手応答を深さ2・幅3で読み、終盤の返し候補漏れを減らす",
    search: {
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 3,
    },
  },
  {
    id: "response2_width2_weight075",
    note: "深さ2・幅2の相手応答をやや強く反映する",
    search: {
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 2,
      sameTurnOpponentTerminalPlanWeight: 0.75,
    },
  },
  {
    id: "terminal6_response2_width2",
    note: "自ターン終端深さ6と相手応答2x2で最終盤面比較を厚くする",
    search: {
      sameTurnTerminalPlanDepth: 6,
      sameTurnOpponentTerminalPlanDepth: 2,
      sameTurnOpponentTerminalPlanWidth: 2,
    },
  },
  {
    id: "response_root_neutral",
    note: "短期root点の補正を外し、返し込み終端評価が近接候補を選びやすくする",
    search: {
      terminalPlanRootDecisionWeight: 0,
      terminalPlanRootGapPenaltyWeight: 0,
      terminalPlanAdoptionMaxRootScoreGap: 260,
      terminalPlanAdoptionMinMargin: 4,
      terminalPlanRequireCompatibleFallbackAction: 0,
    },
  },
  {
    id: "response_root_neutral_margin0",
    note: "root補正なし。応答評価が同点以上なら採用する対象局面追試候補",
    search: {
      terminalPlanRootDecisionWeight: 0,
      terminalPlanRootGapPenaltyWeight: 0,
      terminalPlanAdoptionMaxRootScoreGap: 260,
      terminalPlanAdoptionMinMargin: 0,
      terminalPlanRequireCompatibleFallbackAction: 0,
    },
  },
  {
    id: "response_setup_over_focus_t9",
    note: "turn9以降、fallbackがfocusの時だけsetup候補を応答評価で比較する",
    search: {
      terminalPlanSetupOverFocusRootNeutralTurnFrom: 9,
      terminalPlanSetupOverFocusAdoptionMaxRootScoreGap: 260,
      terminalPlanSetupOverFocusAdoptionMinMargin: 0,
    },
  },
  {
    id: "rollout3_80_w015_gap200",
    note: "terminal上位3候補を80手rolloutし、fallbackを大きく上回る時だけ採用する",
    search: {
      terminalPlanRolloutSteps: 80,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_60_w015_gap200",
    note: "terminal上位3候補を60手rolloutし、80手版より判断時間を抑える",
    search: {
      terminalPlanRolloutSteps: 60,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout2_60_w015_gap200",
    note: "60手rolloutを維持しつつ上位2候補に限定して勝ち筋と判断時間の両立を狙う",
    search: {
      terminalPlanRolloutSteps: 60,
      terminalPlanRolloutCandidateLimit: 2,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_50_w015_gap200",
    note: "60手勝ち筋をどこまで短縮できるかを見る50手rollout候補",
    search: {
      terminalPlanRolloutSteps: 50,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_40_w015_gap200",
    note: "通常rolloutを40手へ抑え、局所的な応答読みを残しつつ判断時間を下げる",
    search: {
      terminalPlanRolloutSteps: 40,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout2_40_w015_gap200",
    note: "40手rolloutを上位2候補に限定し、重い比較の候補数をさらに絞る",
    search: {
      terminalPlanRolloutSteps: 40,
      terminalPlanRolloutCandidateLimit: 2,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_40_front16_w015_gap200",
    note: "通常rollout40手、前衛focus剥がしrollout16手で重い白ミラー比較を抑える",
    search: {
      terminalPlanRolloutSteps: 40,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
      terminalPlanRolloutAllowFrontFocusStripAttack: 1,
      terminalPlanRolloutFrontFocusStripAttackSteps: 16,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_40_front12_w015_gap200",
    note: "通常rollout40手、前衛focus剥がしrollout12手まで短縮して実戦時間を優先する",
    search: {
      terminalPlanRolloutSteps: 40,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
      terminalPlanRolloutAllowFrontFocusStripAttack: 1,
      terminalPlanRolloutFrontFocusStripAttackSteps: 12,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_40_front12_handoff_w015_gap200",
    note: "通常rolloutは次自ターンまで、前衛focus剥がしは12手で相手応答読みへ寄せる",
    search: {
      terminalPlanRolloutSteps: 40,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
      terminalPlanRolloutAllowFrontFocusStripAttack: 1,
      terminalPlanRolloutFrontFocusStripAttackSteps: 12,
      terminalPlanRolloutUseHandoff: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_40_front12_handoff_light_w015_gap200",
    note: "rollout内部をstrong profileに落とし、次自ターンまでの軽量応答読みへ寄せる",
    search: {
      terminalPlanRolloutSteps: 40,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.15,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutRequirePlannerSummonBacklineReach: 1,
      terminalPlanRolloutAllowFrontFocusStripAttack: 1,
      terminalPlanRolloutFrontFocusStripAttackSteps: 12,
      terminalPlanRolloutUseHandoff: 1,
      terminalPlanRolloutUseLightweightProfile: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout4_120_relaxed_fallback",
    note: "fallbackがterminal 1位でも次点が近い時に上位4候補を120手rolloutする",
    search: {
      terminalPlanRolloutSteps: 120,
      terminalPlanRolloutCandidateLimit: 4,
      terminalPlanRolloutWeight: 0.18,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 80,
      terminalPlanRolloutTriggerMaxPlannerMargin: 60,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 4,
      terminalPlanRolloutRequireFallbackMove: 0,
      terminalPlanRolloutRequirePlannerSummon: 0,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout4_160_relaxed_fallback",
    note: "fallback 1位の近接次点も含め、上位4候補を160手rolloutする精度寄り",
    search: {
      terminalPlanRolloutSteps: 160,
      terminalPlanRolloutCandidateLimit: 4,
      terminalPlanRolloutWeight: 0.2,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 80,
      terminalPlanRolloutTriggerMaxPlannerMargin: 60,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 4,
      terminalPlanRolloutRequireFallbackMove: 0,
      terminalPlanRolloutRequirePlannerSummon: 0,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_160_w02_gap200",
    note: "terminal上位3候補を160手rolloutし、左右差や終盤崩壊を候補選定に反映する",
    search: {
      terminalPlanRolloutSteps: 160,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.2,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
  {
    id: "rollout3_160_w03_gap200",
    note: "160手rolloutを強めに反映する実験候補",
    search: {
      terminalPlanRolloutSteps: 160,
      terminalPlanRolloutCandidateLimit: 3,
      terminalPlanRolloutWeight: 0.3,
      terminalPlanRolloutAdoptionMinScoreGap: 200,
      terminalPlanRolloutTriggerMinRootScoreGap: 120,
      terminalPlanRolloutTriggerMaxPlannerMargin: 40,
      terminalPlanRolloutTurnFrom: 6,
      terminalPlanRolloutTurnTo: 10,
      terminalPlanRolloutMaxOpponentStones: 1,
      terminalPlanRolloutRequireFallbackMove: 1,
      terminalPlanRolloutRequirePlannerSummon: 1,
      terminalPlanRolloutOncePerTurn: 1,
    },
  },
] as const satisfies readonly Candidate[];

const DEFAULT_OPTIONS: CliOptions = {
  seedStart: 994300,
  gamesPerDirection: 1,
  maxSteps: 500,
  maxTurns: 120,
  deckPreset: "master-lab-white-1377-death-sheep3",
  directions: ["challenger-as-cpu", "challenger-as-player"],
  candidates: [...DEFAULT_CANDIDATES],
  streamProgress: false,
};

const options = parseArgs(process.argv.slice(2));
const report = runReport(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(markdown);

function runReport(options: CliOptions): PdcaReport {
  const games: GameResult[] = [];
  for (const candidate of options.candidates) {
    for (const direction of options.directions) {
      for (let index = 0; index < options.gamesPerDirection; index += 1) {
        const game = runGame(options.seedStart + index, direction, candidate, options);
        games.push(game);
        if (options.streamProgress) {
          console.log(formatGameProgress(games.length, game));
        }
      }
    }
  }

  const summaries = summarizeCandidates(games, options.candidates);
  return {
    generatedAt: new Date().toISOString(),
    options: {
      ...options,
      candidates: options.candidates.map(({ id, note, search }) => ({ id, note, search })),
    },
    games,
    summaries,
    conclusion: buildConclusion(summaries),
  };
}

function runGame(seed: number, direction: Direction, candidate: Candidate, options: CliOptions): GameResult {
  let game = createWhiteMirrorGame(seed, options.deckPreset);
  const profiles = profilesForDirection(direction);
  const aiOptions = aiOptionsFor(direction, candidate.search);
  const decisionStats = createDecisionStats();
  let issue: string | undefined;
  let steps = 0;

  for (; steps < options.maxSteps && !game.winner; steps += 1) {
    if (game.turnNumber > options.maxTurns) {
      issue = `turn ${game.turnNumber} exceeded limit ${options.maxTurns}`;
      break;
    }
    if (game.pendingLevelUp) {
      game = runAutoStep(game, aiOptions);
      continue;
    }

    const currentPlayer = game.currentPlayer;
    const startedAt = performance.now();
    const decision = chooseCpuDecision(game, aiOptions);
    addDecisionStats(decisionStats[currentPlayer], decision, performance.now() - startedAt);
    game = applyCpuDecision(game, decision);
  }

  if (!game.winner && !issue) {
    issue = `winner was not decided within ${options.maxSteps} auto steps`;
  }

  const challenger = challengerPlayer(direction);
  const baseline = opponentOfPlayer(challenger);
  return {
    candidateId: candidate.id,
    direction,
    seed,
    profiles,
    winner: game.winner,
    winnerProfile: game.winner ? profiles[game.winner] : undefined,
    steps,
    turns: game.turnNumber,
    playerHp: game.players.player.masterHp,
    cpuHp: game.players.cpu.masterHp,
    challengerHp: game.players[challenger].masterHp,
    baselineHp: game.players[baseline].masterHp,
    issue,
    decisionStats,
  };
}

function formatGameProgress(index: number, game: GameResult): string {
  const issue = game.issue ? `, issue ${game.issue}` : "";
  return (
    `[game ${index}] ${game.candidateId} ${game.direction} seed ${game.seed}: ` +
    `${game.winnerProfile ?? "draw"} (${game.steps} steps / ${game.turns} turns, ` +
    `HP P${game.playerHp}/C${game.cpuHp})${issue}`
  );
}

function createWhiteMirrorGame(seed: number, deckPreset: DeckPresetId): GameState {
  const deck = buildDeckPresetCardIds(deckPreset);
  const allowSpecial = deckPresetAllowsSpecial(deckPreset);
  return createInitialGame(seed, {
    masterIds: { player: "white", cpu: "white" },
    playerDeckCardIds: deck,
    cpuDeckCardIds: deck,
    allowSpecialDecks: { player: allowSpecial, cpu: allowSpecial },
  });
}

function profilesForDirection(direction: Direction): Record<PlayerId, CpuAiProfile> {
  return direction === "challenger-as-cpu"
    ? { player: "white", cpu: "white_planner" }
    : { player: "white_planner", cpu: "white" };
}

function aiOptionsFor(direction: Direction, search: CpuAiSearchOptions): CpuAiOptions {
  if (direction === "challenger-as-cpu") {
    return {
      profiles: { player: "white", cpu: "white_planner" },
      searches: { cpu: search },
    };
  }
  return {
    profiles: { player: "white_planner", cpu: "white" },
    searches: { player: search },
  };
}

function createDecisionStats(): Record<PlayerId, DecisionStats> {
  return {
    player: { decisions: 0, elapsedMs: 0, maxDecisionMs: 0, actionCounts: {} },
    cpu: { decisions: 0, elapsedMs: 0, maxDecisionMs: 0, actionCounts: {} },
  };
}

function addDecisionStats(stats: DecisionStats, decision: CpuDecision, elapsedMs: number): void {
  stats.decisions += 1;
  stats.elapsedMs += elapsedMs;
  stats.maxDecisionMs = Math.max(stats.maxDecisionMs, elapsedMs);
  const key = decisionActionKey(decision);
  stats.actionCounts[key] = (stats.actionCounts[key] ?? 0) + 1;
}

function decisionActionKey(decision: CpuDecision): string {
  if (decision.type === "master_action") {
    return `master:${decision.actionId}`;
  }
  return decision.type;
}

function summarizeCandidates(games: readonly GameResult[], candidates: readonly Candidate[]): CandidateSummary[] {
  return candidates.map((candidate) => {
    const scoped = games.filter((game) => game.candidateId === candidate.id);
    const challengerWins = scoped.filter((game) => game.winnerProfile === "white_planner").length;
    const baselineWins = scoped.filter((game) => game.winnerProfile === "white").length;
    const draws = scoped.filter((game) => !game.winnerProfile).length;
    const challengerStats = scoped.map((game) => game.decisionStats[challengerPlayer(game.direction)]);
    return {
      candidateId: candidate.id,
      note: candidate.note,
      games: scoped.length,
      challengerWins,
      baselineWins,
      draws,
      winPointRate: scoped.length > 0 ? (challengerWins + draws * 0.5) / scoped.length : 0,
      averageHpMargin: average(scoped.map((game) => game.challengerHp - game.baselineHp)),
      averageSteps: average(scoped.map((game) => game.steps)),
      averageTurns: average(scoped.map((game) => game.turns)),
      averageDecisionMs: average(challengerStats.map((stats) => stats.elapsedMs / Math.max(1, stats.decisions))),
      maxDecisionMs: Math.max(0, ...challengerStats.map((stats) => stats.maxDecisionMs)),
      issues: scoped.filter((game) => game.issue).length,
      actionCounts: mergeActionCounts(challengerStats.map((stats) => stats.actionCounts)),
    };
  }).sort((a, b) =>
    b.winPointRate - a.winPointRate ||
    b.averageHpMargin - a.averageHpMargin ||
    a.averageDecisionMs - b.averageDecisionMs ||
    a.candidateId.localeCompare(b.candidateId),
  );
}

function mergeActionCounts(counts: Array<Record<string, number>>): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const count of counts) {
    for (const [key, value] of Object.entries(count)) {
      merged[key] = (merged[key] ?? 0) + value;
    }
  }
  return Object.fromEntries(Object.entries(merged).sort(([a], [b]) => a.localeCompare(b)));
}

function buildConclusion(summaries: readonly CandidateSummary[]): string[] {
  const best = summaries[0];
  if (!best) {
    return ["No candidate was evaluated."];
  }
  const lines = [
    `best candidate: ${best.candidateId} (${best.challengerWins}-${best.baselineWins}-${best.draws}, WPR ${formatPercent(best.winPointRate)}, avg HP margin ${round(best.averageHpMargin, 2)})`,
  ];
  if (best.winPointRate < 0.5) {
    lines.push("No candidate beat the current white baseline in this sample. Keep white_planner experimental and tighten adoption around clearly winning planner differences.");
  } else if (best.winPointRate === 0.5) {
    lines.push("The best candidate reached parity in this sample. Increase games per direction before adopting it as default.");
  } else {
    lines.push("The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.");
  }
  return lines;
}

function formatMarkdown(report: PdcaReport): string {
  const lines = [
    "# White Planner PDCA Loop",
    "",
    `生成: ${report.generatedAt}`,
    `deck: \`${report.options.deckPreset}\``,
    `seeds: ${report.options.seedStart}-${report.options.seedStart + report.options.gamesPerDirection - 1}`,
    `directions: ${report.options.directions.join(", ")}`,
    "",
    "## Summary",
    "",
    "| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |",
    "| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  ];
  report.summaries.forEach((summary, index) => {
    lines.push(
      `| ${index + 1} | ${summary.candidateId} | ${summary.challengerWins}-${summary.baselineWins}-${summary.draws} | ` +
      `${formatPercent(summary.winPointRate)} | ${round(summary.averageHpMargin, 2)} | ${round(summary.averageSteps, 1)} | ` +
      `${round(summary.averageTurns, 1)} | ${round(summary.averageDecisionMs, 1)} | ${round(summary.maxDecisionMs, 1)} | ` +
      `${summary.issues} | ${escapeMarkdownTableCell(summary.note)} |`,
    );
  });

  lines.push("", "## Action Counts", "");
  for (const summary of report.summaries) {
    lines.push(`- ${summary.candidateId}: ${formatActionCounts(summary.actionCounts)}`);
  }

  lines.push("", "## Games", "", "| candidate | direction | seed | result | steps | turns | HP | issue |");
  lines.push("| --- | --- | ---: | --- | ---: | ---: | --- | --- |");
  for (const game of report.games) {
    lines.push(
      `| ${game.candidateId} | ${game.direction} | ${game.seed} | ${game.winnerProfile ?? "draw"} | ` +
      `${game.steps} | ${game.turns} | P${game.playerHp}/C${game.cpuHp} | ${escapeMarkdownTableCell(game.issue ?? "-")} |`,
    );
  }

  lines.push("", "## Conclusion", "");
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  return lines.join("\n");
}

function formatActionCounts(counts: Record<string, number>): string {
  return Object.entries(counts).map(([key, value]) => `${key} ${value}`).join(", ") || "-";
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = { ...DEFAULT_OPTIONS, directions: [...DEFAULT_OPTIONS.directions], candidates: [...DEFAULT_OPTIONS.candidates] };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed-start") {
      parsed.seedStart = readInteger(arg, next);
      index += 1;
    } else if (arg === "--games-per-direction") {
      parsed.gamesPerDirection = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--direction") {
      parsed.directions = readDirections(readString(arg, next));
      index += 1;
    } else if (arg === "--candidate") {
      parsed.candidates = readCandidates(readString(arg, next));
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

function readDirections(value: string): Direction[] {
  if (value === "both") {
    return ["challenger-as-cpu", "challenger-as-player"];
  }
  if (value === "challenger-as-cpu" || value === "challenger-as-player") {
    return [value];
  }
  throw new Error("--direction must be one of: both, challenger-as-cpu, challenger-as-player");
}

function readCandidates(value: string): Candidate[] {
  if (value === "all") {
    return [...DEFAULT_CANDIDATES];
  }
  const ids = value.split(",").map((id) => id.trim()).filter(Boolean);
  const candidates = ids.map((id) => {
    const candidate = DEFAULT_CANDIDATES.find((item) => item.id === id);
    if (!candidate) {
      throw new Error(`Unknown candidate: ${id}`);
    }
    return candidate;
  });
  if (candidates.length === 0) {
    throw new Error("--candidate requires at least one candidate id");
  }
  return candidates;
}

function challengerPlayer(direction: Direction): PlayerId {
  return direction === "challenger-as-cpu" ? "cpu" : "player";
}

function opponentOfPlayer(player: PlayerId): PlayerId {
  return player === "player" ? "cpu" : "player";
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run lab:masters:white-planner-pdca -- [options]

Options:
  --seed-start <n>              First seed. Default: ${DEFAULT_OPTIONS.seedStart}
  --games-per-direction <n>     Games per direction. Default: ${DEFAULT_OPTIONS.gamesPerDirection}
  --direction <value>           both, challenger-as-cpu, challenger-as-player. Default: both
  --candidate <ids>             Comma-separated candidate ids or all. Default: all
  --stream-progress             Print one line after each completed game.
  --deck-preset <id>            Deck preset. Default: ${DEFAULT_OPTIONS.deckPreset}
  --max-steps <n>               Max auto steps. Default: ${DEFAULT_OPTIONS.maxSteps}
  --max-turns <n>               Max turns. Default: ${DEFAULT_OPTIONS.maxTurns}
  --markdown <path>             Write Markdown report.
  --json <path>                 Write JSON report.

Candidates:
${DEFAULT_CANDIDATES.map((candidate) => `  - ${candidate.id}: ${candidate.note}`).join("\n")}
`);
  process.exit(0);
}

import {
  chooseCpuDecision,
  evaluateState,
  inspectCpuTerminalPlan,
  type CpuAiOptions,
  type CpuAiProfile,
  type CpuAiSearchOptions,
  type CpuDecision,
} from "../src/game/cpuAi";
import { AI_EVALUATION_WEIGHTS } from "../src/game/aiWeights";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, opponentOf, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey, Target } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, round, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  seed: number;
  direction: Direction;
  deckPreset: DeckPresetId;
  steps: number[];
  search: CpuAiSearchOptions;
  replayWithSearch: boolean;
  candidateLimit: number;
  rolloutSteps: number;
  rolloutWithSearch: boolean;
  markdownPath?: string;
  jsonPath?: string;
}

interface TurnPlanResponseReport {
  generatedAt: string;
  seed: number;
  direction: Direction;
  deckPreset: DeckPresetId;
  search: CpuAiSearchOptions;
  rolloutSteps: number;
  samples: TurnPlanResponseSample[];
  conclusion: string[];
}

interface TurnPlanResponseSample {
  step: number;
  turnNumber: number;
  plannerSide: PlayerId;
  currentPlayer: PlayerId;
  enabled: boolean;
  adopted: boolean;
  rejectedReason?: string;
  fallbackDecision: string;
  fallbackScore?: number;
  cpuDecision: string;
  selectedPlannerDecision: string;
  selectedPlannerScore?: number;
  runnerUpPlannerScore?: number;
  state: string;
  board: string;
  candidates: TurnPlanResponseCandidate[];
}

interface TurnPlanResponseCandidate {
  rank: number;
  selectedByPlanner: boolean;
  selectedByCpu: boolean;
  fallback: boolean;
  decision: string;
  rootScore: number;
  ownDelta: number;
  opponentDelta: number;
  responseScore: number;
  plannerScore: number;
  afterRootState: string;
  afterRootBoard: string;
  ownHandoffState: string;
  ownHandoffBoard: string;
  opponentHandoffState: string;
  opponentHandoffBoard: string;
  rolloutWinner?: PlayerId;
  rolloutWinnerProfile?: CpuAiProfile;
  rolloutSteps?: number;
  rolloutScore?: number;
  rolloutScoreGapToFallback?: number;
  rolloutFinalState?: string;
  rolloutFinalBoard?: string;
}

const SLOT_ORDER: SlotKey[] = [
  "player_front_left",
  "player_front_right",
  "player_back_left",
  "player_back_right",
  "cpu_front_left",
  "cpu_front_right",
  "cpu_back_left",
  "cpu_back_right",
];

const options = parseArgs(process.argv.slice(2));
const report = runAudit(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`White planner turn plan response audit: ${report.samples.length} samples`);
for (const sample of report.samples) {
  console.log(
    `step ${sample.step}: cpu=${sample.cpuDecision}, planner=${sample.selectedPlannerDecision}, ` +
      `adopted=${sample.adopted}, candidates=${sample.candidates.length}`,
  );
}
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runAudit(options: CliOptions): TurnPlanResponseReport {
  const samples = options.steps.map((step) => auditStep(options, step));
  return {
    generatedAt: new Date().toISOString(),
    seed: options.seed,
    direction: options.direction,
    deckPreset: options.deckPreset,
    search: options.search,
    rolloutSteps: options.rolloutSteps,
    samples,
    conclusion: buildConclusion(samples),
  };
}

function auditStep(options: CliOptions, step: number): TurnPlanResponseSample {
  const state = replayToStep(options, step);
  const plannerSide = plannerSideForDirection(options.direction);
  const aiOptions = aiOptionsFor(options.direction, options.search);
  const cpuDecision = chooseCpuDecision(state, aiOptions);
  const inspection = inspectCpuTerminalPlan(state, aiOptions);
  const cpuKey = decisionKey(cpuDecision);
  const fallbackKey = inspection.fallbackDecision ? decisionKey(inspection.fallbackDecision) : "";
  const selectedPlannerKey = inspection.selectedDecision ? decisionKey(inspection.selectedDecision) : "";
  const ranked = [...inspection.candidates].sort((a, b) =>
    b.plannerScore - a.plannerScore ||
    b.rootScore - a.rootScore ||
    a.index - b.index,
  );
  const candidates = options.candidateLimit > 0 ? ranked.slice(0, options.candidateLimit) : ranked;

  return {
    step,
    turnNumber: state.turnNumber,
    plannerSide,
    currentPlayer: state.currentPlayer,
    enabled: inspection.enabled,
    adopted: inspection.adopted,
    ...(inspection.rejectedReason ? { rejectedReason: inspection.rejectedReason } : {}),
    fallbackDecision: inspection.fallbackDecision ? decisionLabel(state, inspection.fallbackDecision) : "-",
    ...(inspection.fallbackScore !== undefined ? { fallbackScore: round(inspection.fallbackScore, 1) } : {}),
    cpuDecision: decisionLabel(state, cpuDecision),
    selectedPlannerDecision: inspection.selectedDecision ? decisionLabel(state, inspection.selectedDecision) : "-",
    ...(inspection.selectedPlannerScore !== undefined ? { selectedPlannerScore: round(inspection.selectedPlannerScore, 1) } : {}),
    ...(inspection.runnerUpPlannerScore !== undefined ? { runnerUpPlannerScore: round(inspection.runnerUpPlannerScore, 1) } : {}),
    state: stateLine(state, plannerSide),
    board: boardLine(state),
    candidates: candidates.map((candidate, index) => {
      const key = decisionKey(candidate.decision);
      const rollout = options.rolloutSteps > 0
        ? rolloutCandidate(candidate.afterRootState, plannerSide, options)
        : undefined;
      return {
        rank: index + 1,
        selectedByPlanner: key === selectedPlannerKey,
        selectedByCpu: key === cpuKey,
        fallback: key === fallbackKey,
        decision: decisionLabel(state, candidate.decision),
        rootScore: round(candidate.rootScore, 1),
        ownDelta: round(candidate.ownDelta, 1),
        opponentDelta: round(candidate.opponentDelta, 1),
        responseScore: round(candidate.responseScore, 1),
        plannerScore: round(candidate.plannerScore, 1),
        ...(candidate.rolloutScore !== undefined ? { rolloutScore: round(candidate.rolloutScore, 1) } : {}),
        ...(candidate.rolloutScoreGapToFallback !== undefined
          ? { rolloutScoreGapToFallback: round(candidate.rolloutScoreGapToFallback, 1) }
          : {}),
        ...(candidate.rolloutSteps !== undefined ? { rolloutSteps: candidate.rolloutSteps } : {}),
        ...(candidate.rolloutWinner ? { rolloutWinner: candidate.rolloutWinner } : {}),
        ...(candidate.rolloutWinnerProfile ? { rolloutWinnerProfile: candidate.rolloutWinnerProfile } : {}),
        afterRootState: stateLine(candidate.afterRootState, plannerSide),
        afterRootBoard: boardLine(candidate.afterRootState),
        ownHandoffState: stateLine(candidate.ownHandoffState, plannerSide),
        ownHandoffBoard: boardLine(candidate.ownHandoffState),
        opponentHandoffState: stateLine(candidate.opponentHandoffState, plannerSide),
        opponentHandoffBoard: boardLine(candidate.opponentHandoffState),
        ...(rollout
          ? {
              ...(rollout.winner ? { rolloutWinner: rollout.winner } : {}),
              ...(rollout.winnerProfile ? { rolloutWinnerProfile: rollout.winnerProfile } : {}),
              rolloutSteps: rollout.steps,
              rolloutScore: rollout.score,
              rolloutFinalState: rollout.finalState,
              rolloutFinalBoard: rollout.finalBoard,
            }
          : {}),
      };
    }),
  };
}

function rolloutCandidate(
  afterRootState: GameState,
  plannerSide: PlayerId,
  options: CliOptions,
): {
  winner?: PlayerId;
  winnerProfile?: "white" | "white_planner";
  steps: number;
  score: number;
  finalState: string;
  finalBoard: string;
} {
  let state = afterRootState;
  const aiOptions = aiOptionsFor(options.direction, options.rolloutWithSearch ? options.search : {});
  let steps = 1;
  while (!state.winner && steps < options.rolloutSteps && state.turnNumber < 120) {
    state = runAutoStep(state, aiOptions);
    steps += 1;
  }
  const opponent = opponentOf(plannerSide);
  const score = state.winner === plannerSide
    ? 1_000_000
    : state.winner === opponent
      ? -1_000_000
      : evaluateState(state, plannerSide, AI_EVALUATION_WEIGHTS.white);
  return {
    ...(state.winner ? { winner: state.winner } : {}),
    ...(state.winner ? { winnerProfile: aiOptions.profiles?.[state.winner] as "white" | "white_planner" | undefined } : {}),
    steps,
    score: round(score, 1),
    finalState: stateLine(state, plannerSide),
    finalBoard: boardLine(state),
  };
}

function replayToStep(options: CliOptions, targetStep: number): GameState {
  let state = createWhiteMirrorGame(options.seed, options.deckPreset);
  const aiOptions = aiOptionsFor(options.direction, options.replayWithSearch ? options.search : {});
  for (let step = 0; step < targetStep && !state.winner; step += 1) {
    state = runAutoStep(state, aiOptions);
  }
  return state;
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

function aiOptionsFor(direction: Direction, search: CpuAiSearchOptions): CpuAiOptions {
  const plannerSide = plannerSideForDirection(direction);
  return {
    profiles: profilesForDirection(direction),
    ...(Object.keys(search).length > 0 ? { searches: { [plannerSide]: search } } : {}),
  };
}

function profilesForDirection(direction: Direction): Record<PlayerId, "white" | "white_planner"> {
  return direction === "challenger-as-cpu"
    ? { player: "white", cpu: "white_planner" }
    : { player: "white_planner", cpu: "white" };
}

function plannerSideForDirection(direction: Direction): PlayerId {
  return direction === "challenger-as-cpu" ? "cpu" : "player";
}

function decisionLabel(state: GameState, decision: CpuDecision): string {
  if (decision.type === "attack") {
    const attacker = monsterNameAt(state, decision.action.attackerSlotKey) ?? decision.action.attackerSlotKey;
    const target = decision.action.target.kind === "monster"
      ? monsterNameAt(state, decision.action.target.slotKey) ?? decision.action.target.slotKey
      : `${decision.action.target.playerId} master`;
    const secondary = decision.action.secondaryTarget ? `:${targetToKey(decision.action.secondaryTarget)}` : "";
    return `attack:${attacker}:${decision.action.commandId}->${target}${secondary}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.handInstanceId);
    return `summon:${card ? getCardName(card.cardId) : decision.handInstanceId}->${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    const card = state.players[state.currentPlayer].hand.find((handCard) => handCard.instanceId === decision.action.handInstanceId);
    const secondary = decision.action.secondaryTarget ? `:${targetToKey(decision.action.secondaryTarget)}` : "";
    return `magic:${card ? getCardName(card.cardId) : decision.action.handInstanceId}->${targetToKey(decision.action.target)}${secondary}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}->${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${monsterNameAt(state, decision.slotKey) ?? decision.slotKey}`;
  }
  return "end_turn";
}

function decisionKey(decision: CpuDecision): string {
  if (decision.type === "attack") {
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}:${targetToKey(decision.action.target)}:${optionalTargetKey(decision.action.secondaryTarget)}:${decision.action.secondaryHandInstanceId ?? ""}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}:${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.handInstanceId}:${decision.slotKey}`;
  }
  if (decision.type === "magic") {
    return `magic:${decision.action.handInstanceId}:${targetToKey(decision.action.target)}:${optionalTargetKey(decision.action.secondaryTarget)}:${decision.action.secondaryHandInstanceId ?? ""}:${decision.action.selectedHandInstanceIds?.join(",") ?? ""}:${decision.action.deckTopOrderInstanceIds?.join(",") ?? ""}:${decision.action.searchCategory ?? ""}:${decision.action.rotationDirection ?? ""}`;
  }
  if (decision.type === "move") {
    return `move:${decision.fromSlotKey}:${decision.toSlotKey}`;
  }
  if (decision.type === "focus") {
    return `focus:${decision.slotKey}`;
  }
  return "end_turn";
}

function optionalTargetKey(target: Target | undefined): string {
  return target ? targetToKey(target) : "";
}

function stateLine(state: GameState, perspective: PlayerId): string {
  const opponent = opponentOf(perspective);
  return [
    `turn ${state.turnNumber}`,
    `current ${state.currentPlayer}`,
    `HP ${perspective}/${opponent} ${state.players[perspective].masterHp}/${state.players[opponent].masterHp}`,
    `stones ${perspective}/${opponent} ${state.players[perspective].stones}/${state.players[opponent].stones}`,
    `deck ${perspective}/${opponent} ${state.players[perspective].deck.length}/${state.players[opponent].deck.length}`,
    `hand ${perspective}/${opponent} ${state.players[perspective].hand.length}/${state.players[opponent].hand.length}`,
  ].join(" / ");
}

function boardLine(state: GameState): string {
  return SLOT_ORDER.map((slotKey) => slotLine(state, slotKey)).filter(Boolean).join(" | ") || "empty";
}

function slotLine(state: GameState, slotKey: SlotKey): string {
  const monster = state.slots[slotKey].monster;
  if (!monster) {
    return "";
  }
  const side = monster.owner === "player" ? "P" : "C";
  const row = state.slots[slotKey].row === "front" ? "F" : "B";
  const status = monster.status === "prepared" ? "prep" : `act${monster.actionCount}/${monster.actionLimit}`;
  const flags = [monster.focused ? "focus" : "", monster.shielded ? "shield" : ""].filter(Boolean);
  return `${slotKey}:${side}${row}:${getCardName(monster.cardId)} Lv${monster.level} HP${monster.hp} ${status}${flags.length > 0 ? ` ${flags.join(",")}` : ""}`;
}

function monsterNameAt(state: GameState, slotKey: SlotKey): string | undefined {
  const monster = state.slots[slotKey].monster;
  return monster ? getCardName(monster.cardId) : undefined;
}

function buildConclusion(samples: readonly TurnPlanResponseSample[]): string[] {
  const adopted = samples.filter((sample) => sample.adopted).length;
  const enabled = samples.filter((sample) => sample.enabled).length;
  const cpuDiff = samples.filter((sample) => sample.cpuDecision !== sample.fallbackDecision).length;
  const rolloutWins = samples.flatMap((sample) => sample.candidates).filter((candidate) => {
    if (!candidate.rolloutWinner) {
      return false;
    }
    return candidate.rolloutWinnerProfile === "white_planner" || candidate.rolloutWinnerProfile === "white_rollout";
  }).length;
  return [
    `${samples.length} samples. terminal plan enabled ${enabled}件、adopted ${adopted}件。`,
    `CPU選択がfallbackと異なる局面は${cpuDiff}件。差分局面の own/opponent handoff board を実装候補にする。`,
    `rollout 勝ち候補は${rolloutWins}件。terminal score と rollout score が割れる候補を次の実装候補にする。`,
  ];
}

function formatMarkdown(report: TurnPlanResponseReport): string {
  const lines = [
    "# White Planner Turn Plan Response Audit",
    "",
    `生成: ${report.generatedAt}`,
    `seed: ${report.seed}`,
    `direction: \`${report.direction}\``,
    `deck: \`${report.deckPreset}\``,
    `search: \`${JSON.stringify(report.search)}\``,
    `rolloutSteps: ${report.rolloutSteps}`,
    "",
    "## Conclusion",
    "",
  ];
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("", "## Samples", "");
  for (const sample of report.samples) {
    lines.push(
      `### step ${sample.step} / turn ${sample.turnNumber}`,
      "",
      `- state: ${sample.state}`,
      `- board: ${sample.board}`,
      `- terminalPlan: enabled=${sample.enabled}, adopted=${sample.adopted}`,
      `- fallback: ${sample.fallbackDecision}${sample.fallbackScore === undefined ? "" : ` (${sample.fallbackScore})`}`,
      `- cpu: ${sample.cpuDecision}`,
      `- planner selected: ${sample.selectedPlannerDecision}${
        sample.selectedPlannerScore === undefined ? "" : ` (${sample.selectedPlannerScore})`
      }`,
      ...(sample.runnerUpPlannerScore === undefined ? [] : [`- runnerUp: ${sample.runnerUpPlannerScore}`]),
      ...(sample.rejectedReason ? [`- rejected: ${sample.rejectedReason}`] : []),
      "",
    );
    if (sample.candidates.length === 0) {
      lines.push("- candidates: なし", "");
      continue;
    }
    lines.push(
      "| rank | planner | cpu | fallback | decision | root | own | opp | response | planner score | rollout | rollout score | rollout gap |",
      "| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |",
    );
    for (const candidate of sample.candidates) {
      const rollout = candidate.rolloutWinnerProfile ?? candidate.rolloutWinner ?? "-";
      lines.push(
        `| ${candidate.rank} | ${candidate.selectedByPlanner ? "Y" : ""} | ${candidate.selectedByCpu ? "Y" : ""} | ` +
          `${candidate.fallback ? "Y" : ""} | ${escapeMarkdownTableCell(candidate.decision)} | ` +
          `${candidate.rootScore} | ${candidate.ownDelta} | ${candidate.opponentDelta} | ` +
          `${candidate.responseScore} | ${candidate.plannerScore} | ${rollout} | ${candidate.rolloutScore ?? "-"} | ` +
          `${candidate.rolloutScoreGapToFallback ?? "-"} |`,
      );
    }
    lines.push("", "#### Candidate Boards", "");
    for (const candidate of sample.candidates) {
      lines.push(
        `- #${candidate.rank} ${candidate.decision}`,
        `  - after root: ${candidate.afterRootState}`,
        `  - board: ${candidate.afterRootBoard}`,
        `  - own handoff: ${candidate.ownHandoffState}`,
        `  - board: ${candidate.ownHandoffBoard}`,
        `  - opponent handoff: ${candidate.opponentHandoffState}`,
        `  - board: ${candidate.opponentHandoffBoard}`,
        ...(candidate.rolloutFinalState
          ? [
              `  - rollout: ${candidate.rolloutWinnerProfile ?? candidate.rolloutWinner ?? "-"} / score ${candidate.rolloutScore} / steps ${candidate.rolloutSteps}`,
              `  - final: ${candidate.rolloutFinalState}`,
              `  - board: ${candidate.rolloutFinalBoard}`,
            ]
          : []),
      );
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    seed: 994306,
    direction: "challenger-as-player",
    deckPreset: "master-lab-white-1377-death-sheep3",
    steps: [83],
    search: {},
    replayWithSearch: false,
    candidateLimit: 0,
    rolloutSteps: 0,
    rolloutWithSearch: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed") {
      parsed.seed = readInteger(arg, next);
      index += 1;
    } else if (arg === "--direction") {
      parsed.direction = readDirection(next);
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--step" || arg === "--only-step") {
      parsed.steps = [readInteger(arg, next)];
      index += 1;
    } else if (arg === "--add-step") {
      parsed.steps = [...parsed.steps, readInteger(arg, next)];
      index += 1;
    } else if (arg === "--search") {
      parsed.search = readSearchOptions(arg, next);
      index += 1;
    } else if (arg === "--planner-rollout-steps") {
      parsed.search = { ...parsed.search, terminalPlanRolloutSteps: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-candidate-limit") {
      parsed.search = { ...parsed.search, terminalPlanRolloutCandidateLimit: readInteger(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-weight") {
      parsed.search = { ...parsed.search, terminalPlanRolloutWeight: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-adoption-gap") {
      parsed.search = { ...parsed.search, terminalPlanRolloutAdoptionMinScoreGap: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-trigger-root-gap") {
      parsed.search = { ...parsed.search, terminalPlanRolloutTriggerMinRootScoreGap: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-trigger-margin") {
      parsed.search = { ...parsed.search, terminalPlanRolloutTriggerMaxPlannerMargin: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-turn-from") {
      parsed.search = { ...parsed.search, terminalPlanRolloutTurnFrom: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-turn-to") {
      parsed.search = { ...parsed.search, terminalPlanRolloutTurnTo: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-max-opponent-stones") {
      parsed.search = { ...parsed.search, terminalPlanRolloutMaxOpponentStones: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-require-fallback-move") {
      parsed.search = { ...parsed.search, terminalPlanRolloutRequireFallbackMove: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-require-planner-summon") {
      parsed.search = { ...parsed.search, terminalPlanRolloutRequirePlannerSummon: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--planner-rollout-once-per-turn") {
      parsed.search = { ...parsed.search, terminalPlanRolloutOncePerTurn: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-root-weight") {
      parsed.search = { ...parsed.search, terminalPlanRootDecisionWeight: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-root-gap-free-margin") {
      parsed.search = { ...parsed.search, terminalPlanRootGapFreeMargin: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-root-gap-penalty") {
      parsed.search = { ...parsed.search, terminalPlanRootGapPenaltyWeight: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-setup-over-focus-root-neutral-turn-from") {
      parsed.search = { ...parsed.search, terminalPlanSetupOverFocusRootNeutralTurnFrom: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-setup-over-focus-adoption-max-root-gap") {
      parsed.search = { ...parsed.search, terminalPlanSetupOverFocusAdoptionMaxRootScoreGap: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-setup-over-focus-adoption-margin") {
      parsed.search = { ...parsed.search, terminalPlanSetupOverFocusAdoptionMinMargin: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-adoption-margin") {
      parsed.search = { ...parsed.search, terminalPlanAdoptionMinMargin: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-adoption-max-root-gap") {
      parsed.search = { ...parsed.search, terminalPlanAdoptionMaxRootScoreGap: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-reject-non-lethal-face") {
      parsed.search = { ...parsed.search, terminalPlanRejectNonLethalFaceDamage: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-reject-end-turn-over-action") {
      parsed.search = { ...parsed.search, terminalPlanRejectEndTurnOverAction: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-reject-setup-over-tactical") {
      parsed.search = { ...parsed.search, terminalPlanRejectSetupOverTacticalAction: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-require-compatible-fallback") {
      parsed.search = { ...parsed.search, terminalPlanRequireCompatibleFallbackAction: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--replay-with-search") {
      parsed.replayWithSearch = true;
    } else if (arg === "--candidate-limit") {
      parsed.candidateLimit = readInteger(arg, next);
      index += 1;
    } else if (arg === "--rollout-steps") {
      parsed.rolloutSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--rollout-with-search") {
      parsed.rolloutWithSearch = true;
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

function readSearchOptions(name: string, value: string | undefined): CpuAiSearchOptions {
  const raw = readString(name, value);
  const [
    depth,
    width,
    detailedWidth = width,
    terminalDepth,
    terminalWidth,
    terminalWeight,
    opponentDepth,
    opponentWidth,
    opponentWeight,
  ] = raw.split(":").map(Number);
  if (!Number.isInteger(depth) || !Number.isInteger(width) || !Number.isInteger(detailedWidth)) {
    throw new Error(`${name} must be formatted as depth:width[:detailedWidth[:terminalDepth:terminalWidth:terminalWeight[:opponentDepth:opponentWidth:opponentWeight]]]`);
  }
  const search: CpuAiSearchOptions = {
    sameTurnSearchDepth: depth,
    sameTurnSearchWidth: width,
    detailedWidth,
  };
  if (terminalDepth !== undefined || terminalWidth !== undefined || terminalWeight !== undefined) {
    if (!Number.isInteger(terminalDepth) || !Number.isInteger(terminalWidth) || !Number.isFinite(terminalWeight)) {
      throw new Error(`${name} terminal plan options must be formatted as terminalDepth:terminalWidth:terminalWeight`);
    }
    search.sameTurnTerminalPlanDepth = terminalDepth;
    search.sameTurnTerminalPlanWidth = terminalWidth;
    search.sameTurnTerminalPlanWeight = terminalWeight;
  }
  if (opponentDepth !== undefined || opponentWidth !== undefined || opponentWeight !== undefined) {
    if (!Number.isInteger(opponentDepth) || !Number.isInteger(opponentWidth) || !Number.isFinite(opponentWeight)) {
      throw new Error(`${name} opponent terminal plan options must be formatted as opponentDepth:opponentWidth:opponentWeight`);
    }
    search.sameTurnOpponentTerminalPlanDepth = opponentDepth;
    search.sameTurnOpponentTerminalPlanWidth = opponentWidth;
    search.sameTurnOpponentTerminalPlanWeight = opponentWeight;
  }
  return search;
}

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isFinite(number)) {
    throw new Error(`${name} must be a number`);
  }
  return number;
}

function readDirection(value: string | undefined): Direction {
  const direction = readString("--direction", value);
  if (direction !== "challenger-as-cpu" && direction !== "challenger-as-player") {
    throw new Error("--direction must be challenger-as-cpu or challenger-as-player");
  }
  return direction;
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-turn-plan-response -- [options]

Options:
  --seed <n>                     Seed. Default: 994306
  --direction <direction>        challenger-as-cpu or challenger-as-player. Default: challenger-as-player
  --deck-preset <id>             Deck preset. Default: master-lab-white-1377-death-sheep3
  --step <n>                     Replace target step. Default: 83
  --add-step <n>                 Add another target step.
  --search <d:w[:dw[:td:tw:twgt[:od:ow:owgt]]]>
                                  Search override for planner side.
  --planner-rollout-steps <n>     Enable planner rollout scoring for terminal-plan selection.
  --planner-rollout-candidate-limit <n>
                                  Roll out only top N terminal-plan candidates.
  --planner-rollout-weight <n>    Add clamped rollout score * weight to planner score.
  --planner-rollout-adoption-gap <n>
                                  Allow rollout-confirmed candidates over fallback when score gap reaches N.
  --planner-rollout-trigger-root-gap <n>
                                  Roll out only when fallback root score exceeds planner root score by N.
  --planner-rollout-trigger-margin <n>
                                  Roll out only when planner score is within N of fallback candidate.
  --planner-rollout-turn-from <n> Roll out only from turn N.
  --planner-rollout-turn-to <n>   Roll out only through turn N.
  --planner-rollout-max-opponent-stones <n>
                                  Roll out only when opponent stones are at most N.
  --planner-rollout-require-fallback-move <n>
                                  Roll out only when fallback decision is move if nonzero.
  --planner-rollout-require-planner-summon <n>
                                  Roll out only when planner candidate is summon if nonzero.
  --planner-rollout-once-per-turn <n>
                                  Roll out at most once per current-player turn if nonzero.
  --terminal-root-weight <n>      Override terminal root decision score weight.
  --terminal-root-gap-free-margin <n>
                                  Override root score gap free margin.
  --terminal-root-gap-penalty <n> Override root score gap penalty weight.
  --terminal-setup-over-focus-root-neutral-turn-from <n>
                                  Neutralize root score for setup-over-focus comparison from turn N.
  --terminal-setup-over-focus-adoption-max-root-gap <n>
                                  Override setup-over-focus max root score gap.
  --terminal-setup-over-focus-adoption-margin <n>
                                  Override setup-over-focus adoption margin.
  --terminal-adoption-margin <n>  Override terminal plan adoption margin.
  --terminal-adoption-max-root-gap <n>
                                  Override max root score gap for adoption.
  --terminal-reject-non-lethal-face <n>
                                  Reject non-lethal face root over non-face fallback if nonzero.
  --terminal-reject-end-turn-over-action <n>
                                  Reject end-turn root over action fallback if nonzero.
  --terminal-reject-setup-over-tactical <n>
                                  Reject setup root over tactical fallback if nonzero.
  --terminal-require-compatible-fallback <n>
                                  Require compatible fallback action if nonzero.
  --replay-with-search            Apply search override during replay to the target step.
  --candidate-limit <n>           Keep only top N terminal-plan candidates in the report/rollout. Default: all
  --rollout-steps <n>             Force each candidate and run up to N auto steps. Default: 0
  --rollout-with-search           Apply search override during rollout.
  --markdown <path>              Write Markdown report.
  --json <path>                  Write JSON report.
`);
  process.exit(0);
}

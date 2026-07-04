import {
  applyCpuDecision,
  chooseCpuDecision,
  type CpuAiOptions,
  type CpuAiSearchOptions,
  type CpuDecision,
} from "../src/game/cpuAi";
import { getCardName } from "../src/game/cards";
import { buildDeckPresetCardIds, deckPresetAllowsSpecial, type DeckPresetId } from "../src/game/deckPresets";
import { createInitialGame, runAutoStep, targetToKey } from "../src/game/rules";
import type { GameState, PlayerId, SlotKey } from "../src/game/types";
import { escapeMarkdownTableCell, readInteger, readString, writeReport } from "./lib/cli";

type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  seed: number;
  direction: Direction;
  deckPreset: DeckPresetId;
  compareSearch: CpuAiSearchOptions;
  maxSteps: number;
  maxTurns: number;
  maxDiffs: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface SearchDiff {
  step: number;
  turnNumber: number;
  side: PlayerId;
  state: string;
  board: string;
  currentDecision: string;
  currentReason: string;
  compareDecision: string;
  compareReason: string;
  recentLog: string;
}

interface SearchDiffReport {
  generatedAt: string;
  options: CliOptions;
  plannerSide: PlayerId;
  finalState: string;
  winner?: PlayerId;
  winnerProfile?: string;
  diffs: SearchDiff[];
  conclusion: string[];
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
const report = runReport(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, `${JSON.stringify(report, null, 2)}\n`);
}

console.log(`White planner search diff audit: ${report.diffs.length} diffs`);
report.diffs.slice(0, 8).forEach((diff) => {
  console.log(
    `- step ${diff.step} turn ${diff.turnNumber}: ${diff.currentDecision} => ${diff.compareDecision}`,
  );
});
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runReport(options: CliOptions): SearchDiffReport {
  let state = createWhiteMirrorGame(options.seed, options.deckPreset);
  const plannerSide = plannerSideForDirection(options.direction);
  const currentOptions = aiOptionsFor(options.direction, {});
  const compareOptions = aiOptionsFor(options.direction, options.compareSearch);
  const diffs: SearchDiff[] = [];
  let step = 0;

  for (; step < options.maxSteps && !state.winner; step += 1) {
    if (state.turnNumber > options.maxTurns) {
      break;
    }
    if (state.pendingLevelUp) {
      state = runAutoStep(state, compareOptions);
      continue;
    }

    if (state.currentPlayer === plannerSide && diffs.length < options.maxDiffs) {
      const currentDecision = chooseCpuDecision(state, currentOptions);
      const compareDecision = chooseCpuDecision(state, compareOptions);
      if (decisionKey(currentDecision) !== decisionKey(compareDecision)) {
        diffs.push({
          step,
          turnNumber: state.turnNumber,
          side: state.currentPlayer,
          state: stateLine(state, plannerSide),
          board: boardLine(state),
          currentDecision: decisionLabel(state, currentDecision),
          currentReason: currentDecision.reason,
          compareDecision: decisionLabel(state, compareDecision),
          compareReason: compareDecision.reason,
          recentLog: state.log.slice(-3).join(" / "),
        });
      }
    }

    state = applyCpuDecision(state, chooseCpuDecision(state, compareOptions));
  }

  const winnerProfile = state.winner
    ? aiOptionsFor(options.direction, options.compareSearch).profiles?.[state.winner]
    : undefined;
  return {
    generatedAt: new Date().toISOString(),
    options,
    plannerSide,
    finalState: stateLine(state, plannerSide),
    ...(state.winner ? { winner: state.winner, winnerProfile } : {}),
    diffs,
    conclusion: buildConclusion(diffs, state, plannerSide),
  };
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
    profiles: direction === "challenger-as-cpu"
      ? { player: "white", cpu: "white_planner" }
      : { player: "white_planner", cpu: "white" },
    searches: { [plannerSide]: search },
  };
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
    return `attack:${attacker}:${decision.action.commandId}->${target}`;
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
    return `magic:${card ? getCardName(card.cardId) : decision.action.handInstanceId}->${targetToKey(decision.action.target)}`;
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
    return `attack:${decision.action.attackerSlotKey}:${decision.action.commandId}->${targetToKey(decision.action.target)}`;
  }
  if (decision.type === "master_action") {
    return `master:${decision.actionId}->${targetToKey(decision.target)}`;
  }
  if (decision.type === "summon") {
    return `summon:${decision.handInstanceId}->${decision.slotKey}`;
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

function stateLine(state: GameState, perspective: PlayerId): string {
  const opponent = perspective === "player" ? "cpu" : "player";
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

function buildConclusion(diffs: readonly SearchDiff[], state: GameState, plannerSide: PlayerId): string[] {
  const winnerText = state.winner ? `${state.winner} (${state.winner === plannerSide ? "planner" : "baseline"})` : "none";
  return [
    `${diffs.length} same-state decision diffs on the compare-search path.`,
    `Final: ${winnerText}; ${stateLine(state, plannerSide)}.`,
    diffs.length > 0
      ? "Inspect the earliest diff first; later diffs may be downstream of that branch."
      : "No diff captured before the limit.",
  ];
}

function formatMarkdown(report: SearchDiffReport): string {
  const lines = [
    "# White Planner Search Diff Audit",
    "",
    `生成: ${report.generatedAt}`,
    `seed: ${report.options.seed}`,
    `direction: ${report.options.direction}`,
    `deck: \`${report.options.deckPreset}\``,
    `compareSearch: \`${JSON.stringify(report.options.compareSearch)}\``,
    `plannerSide: ${report.plannerSide}`,
    `finalState: ${report.finalState}`,
    `winner: ${report.winnerProfile ?? report.winner ?? "-"}`,
    "",
    "## Conclusion",
    "",
  ];
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("", "## Diffs", "");
  if (report.diffs.length === 0) {
    lines.push("- No diffs.");
    return `${lines.join("\n")}\n`;
  }
  lines.push("| step | turn | state | current | compare | board | recent |");
  lines.push("| ---: | ---: | --- | --- | --- | --- | --- |");
  for (const diff of report.diffs) {
    lines.push(
      `| ${diff.step} | ${diff.turnNumber} | ${escapeMarkdownTableCell(diff.state)} | ` +
        `${escapeMarkdownTableCell(`${diff.currentDecision}<br>${diff.currentReason}`)} | ` +
        `${escapeMarkdownTableCell(`${diff.compareDecision}<br>${diff.compareReason}`)} | ` +
        `${escapeMarkdownTableCell(diff.board)} | ${escapeMarkdownTableCell(diff.recentLog)} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    seed: 994304,
    direction: "challenger-as-player",
    deckPreset: "master-lab-white-1377-death-sheep3",
    compareSearch: {},
    maxSteps: 260,
    maxTurns: 60,
    maxDiffs: 12,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--seed") {
      parsed.seed = readInteger(arg, next);
      index += 1;
    } else if (arg === "--direction") {
      const value = readString(arg, next);
      if (value !== "challenger-as-cpu" && value !== "challenger-as-player") {
        throw new Error("--direction must be challenger-as-cpu or challenger-as-player");
      }
      parsed.direction = value;
      index += 1;
    } else if (arg === "--deck-preset") {
      parsed.deckPreset = readString(arg, next) as DeckPresetId;
      index += 1;
    } else if (arg === "--max-steps") {
      parsed.maxSteps = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-turns") {
      parsed.maxTurns = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-diffs") {
      parsed.maxDiffs = readInteger(arg, next);
      index += 1;
    } else if (arg === "--terminal-root-weight") {
      parsed.compareSearch = { ...parsed.compareSearch, terminalPlanRootDecisionWeight: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-root-gap-penalty") {
      parsed.compareSearch = { ...parsed.compareSearch, terminalPlanRootGapPenaltyWeight: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-setup-over-focus-root-neutral-turn-from") {
      parsed.compareSearch = { ...parsed.compareSearch, terminalPlanSetupOverFocusRootNeutralTurnFrom: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-setup-over-focus-adoption-max-root-gap") {
      parsed.compareSearch = { ...parsed.compareSearch, terminalPlanSetupOverFocusAdoptionMaxRootScoreGap: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-setup-over-focus-adoption-margin") {
      parsed.compareSearch = { ...parsed.compareSearch, terminalPlanSetupOverFocusAdoptionMinMargin: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-adoption-margin") {
      parsed.compareSearch = { ...parsed.compareSearch, terminalPlanAdoptionMinMargin: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-adoption-max-root-gap") {
      parsed.compareSearch = { ...parsed.compareSearch, terminalPlanAdoptionMaxRootScoreGap: readNumber(arg, next) };
      index += 1;
    } else if (arg === "--terminal-require-compatible-fallback") {
      parsed.compareSearch = { ...parsed.compareSearch, terminalPlanRequireCompatibleFallbackAction: readNumber(arg, next) };
      index += 1;
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

function readNumber(name: string, value: string | undefined): number {
  const number = Number(readString(name, value));
  if (!Number.isFinite(number)) {
    throw new Error(`${name} must be a number`);
  }
  return number;
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-search-diff -- [options]

Options:
  --seed <n>                         Seed. Default: 994304
  --direction <direction>            challenger-as-cpu or challenger-as-player. Default: challenger-as-player
  --deck-preset <id>                 Deck preset. Default: master-lab-white-1377-death-sheep3
  --max-steps <n>                    Max auto steps. Default: 260
  --max-turns <n>                    Max turns. Default: 60
  --max-diffs <n>                    Max diffs to capture. Default: 12
  --terminal-root-weight <n>         Override terminal root decision score weight.
  --terminal-root-gap-penalty <n>    Override root score gap penalty weight.
  --terminal-setup-over-focus-root-neutral-turn-from <n>
                                      Neutralize root score for setup-over-focus comparison from turn N.
  --terminal-setup-over-focus-adoption-max-root-gap <n>
                                      Override setup-over-focus max root score gap.
  --terminal-setup-over-focus-adoption-margin <n>
                                      Override setup-over-focus adoption margin.
  --terminal-adoption-margin <n>     Override terminal plan adoption margin.
  --terminal-adoption-max-root-gap <n>
                                      Override max root score gap for adoption.
  --terminal-require-compatible-fallback <n>
                                      Require compatible fallback action if nonzero.
  --markdown <path>                  Write Markdown report.
  --json <path>                      Write JSON report.
`);
  process.exit(0);
}

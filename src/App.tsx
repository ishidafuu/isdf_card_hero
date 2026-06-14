import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, DragEvent, PointerEvent as ReactPointerEvent } from "react";
import { getCardNoteDisplays } from "./game/cardAnnotations";
import {
  buildDeckCardIds,
  deckCategoryLabel,
  deckTextFromCardIds,
  getCardDefsByPool,
  getAllCardDefs,
  getCardDef,
  getCardIconPath,
  getCardMemberRating,
  getCardMemberRatingAverage,
  getCardName,
  getCardPool,
  getMonsterDef,
  parseDeckText,
  summarizeDeckCardIds,
} from "./game/cards";
import {
  attackWithCommand,
  canFocusMonster,
  canSummonTo,
  createInitialGame,
  discardHandCard,
  endTurn,
  focusMonster,
  getCommandTargets,
  getCommandHandChoices,
  getCommandSecondaryTargets,
  getCurrentMasterActionIds,
  getHandCard,
  getMagicHandChoices,
  getMagicSearchCategories,
  getMagicSecondaryTargets,
  getMagicTargets,
  getMasterActionCost,
  getMasterActionTargets,
  getMonsterCommands,
  getMonsterDisplayName,
  getMovableTargets,
  moveMonster,
  opponentOf,
  playMagic,
  playerLabel,
  resolveLevelUp,
  runAutoStep,
  runCpuStep,
  summonMonster,
  targetToKey,
  useMasterAction,
  useMasterHpDraw,
} from "./game/rules";
import { getMasterActionDef, getMasterName, MASTER_IDS } from "./game/masters";
import { CPU_AI_PROFILES, type CpuAiProfile, type CpuAiProfiles } from "./game/cpuAi";
import {
  buildDeckPresetCardIds,
  DEFAULT_DECK_PRESET_FILTERS,
  DECK_PRESETS,
  deckPresetAllowsSpecial,
  filterDeckPresets,
  type DeckPresetDef,
  type DeckPresetFilters,
  type DeckPresetId,
  type DeckPresetMasterFilter,
  type DeckPresetRare8Filter,
} from "./game/deckPresets";
import {
  DECK_BATTLE_SCORE_SNAPSHOT_SUITES,
  DEFAULT_DECK_BATTLE_SCORE_SNAPSHOT_SUITE_ID,
  getDeckBattleScoreSnapshot,
  getDeckBattleScoreSuite,
  type DeckBattleScoreSnapshot,
  type DeckBattleScoreSnapshotSuiteId,
} from "./game/deckBattleScoreSnapshots";
import { evaluateBoardUnit, evaluateCard, type UnitEvaluation } from "./game/unitEvaluation";
import type { CardInstance, CardPool, CommandDef, GameState, MagicAction, MagicCardDef, MagicTargetKind, MasterActionId, MasterId, PlayerId, SlotKey, Target } from "./game/types";
import type { DeckValidationSummary } from "./game/cards";

type BoardCell =
  | { kind: "slot"; slotKey: SlotKey }
  | { kind: "master"; playerId: PlayerId; label: string }
  | { kind: "blocked"; label: string };

const BOARD_CELLS: BoardCell[][] = [
  [
    { kind: "slot", slotKey: "cpu_back_left" },
    { kind: "blocked", label: "進入不可" },
    { kind: "slot", slotKey: "cpu_back_right" },
  ],
  [
    { kind: "slot", slotKey: "cpu_front_left" },
    { kind: "master", playerId: "cpu", label: "CPU Master" },
    { kind: "slot", slotKey: "cpu_front_right" },
  ],
  [
    { kind: "slot", slotKey: "player_front_left" },
    { kind: "master", playerId: "player", label: "Player Master" },
    { kind: "slot", slotKey: "player_front_right" },
  ],
  [
    { kind: "slot", slotKey: "player_back_left" },
    { kind: "blocked", label: "進入不可" },
    { kind: "slot", slotKey: "player_back_right" },
  ],
];

const BOARD_SLOT_KEYS = BOARD_CELLS.flatMap((row) =>
  row.flatMap((cell) => (cell.kind === "slot" ? [cell.slotKey] : [])),
);
const PLAYER_IDS: PlayerId[] = ["player", "cpu"];
const CPU_STEP_DELAY_MS = 520;
const VISUAL_EFFECT_DURATION_MS = 900;
const AUTO_STEP_DELAY_MIN_MS = 100;
const AUTO_STEP_DELAY_MAX_MS = 3000;
const AUTO_STEP_DELAY_STEP_MS = 50;
const AUTO_STEP_DELAY_DEFAULT_MS = 650;
const AUTO_SPEED_PRESETS = [
  { label: "Watch", delayMs: 1000 },
  { label: "Normal", delayMs: 650 },
  { label: "Fast", delayMs: 300 },
  { label: "Skip", delayMs: 100 },
] as const;
const MAX_VISIBLE_RESOURCE_ICONS = 10;
const DEFAULT_BATTLE_SEED = 20260612;
const BATTLE_HISTORY_STORAGE_KEY = "card-hero:battle-history:v1";
const BATTLE_PRESETS_STORAGE_KEY = "card-hero:battle-presets:v1";
const BATTLE_HISTORY_LIMIT = 20;

type Selection =
  | { kind: "hand"; instanceId: string }
  | { kind: "monster"; slotKey: SlotKey }
  | { kind: "command"; attackerSlotKey: SlotKey; commandId: string; targets: Target[] }
  | { kind: "commandSecondaryTarget"; attackerSlotKey: SlotKey; commandId: string; target: Target; targets: Target[] }
  | { kind: "commandHandChoice"; attackerSlotKey: SlotKey; commandId: string; target: Target; choices: CardInstance[] }
  | { kind: "masterAction"; actionId: MasterActionId; targets: Target[] }
  | { kind: "magicSecondaryTarget"; handInstanceId: string; target: Target; targets: Target[] }
  | { kind: "magicHandChoice"; handInstanceId: string; target: Target; choices: CardInstance[] }
  | { kind: "magicRefresh"; handInstanceId: string; target: Target; choices: CardInstance[]; selectedIds: string[] }
  | { kind: "magicSearch"; handInstanceId: string; target: Target; categories: Array<NonNullable<MagicAction["searchCategory"]>> }
  | { kind: "move"; fromSlotKey: SlotKey; targets: SlotKey[] };

type DragPayload =
  | { kind: "hand"; instanceId: string }
  | { kind: "monster"; slotKey: SlotKey };

type PendingDropAction =
  | { kind: "magic"; handInstanceId: string; target: Target }
  | { kind: "attackTarget"; attackerSlotKey: SlotKey; target: Target; commandIds: string[] }
  | { kind: "move"; fromSlotKey: SlotKey; toSlotKey: SlotKey };

type ZoneView =
  | { kind: "playerZone"; playerId: PlayerId; zone: "deck" | "discard" | "hand" }
  | { kind: "catalog" }
  | { kind: "effects" }
  | { kind: "cpuHistory" }
  | { kind: "deckSetup" }
  | { kind: "aiLab" };
type LogFilter = "all" | "battle" | "damage" | "support" | "turn" | "cpu";
type BattleMode = "player-vs-cpu" | "cpu-vs-cpu";
type TargetRole = "ally" | "enemy" | "move" | "summon" | "empty" | "master";
type CatalogCategoryFilter = "all" | "front" | "back" | "magic";
type CatalogSortKey = "source" | "evaluation" | "proBlack" | "proWhite" | "name" | "offense" | "defense" | "synergy" | "hp" | "cost";
type DeckPresetSortKey = "source" | "battle" | "winRate" | "stability" | "speed" | "vsBlack" | "vsWhite";

interface BattleSettings {
  seed: number;
  seedInput: string;
  firstPlayer: PlayerId;
  mode: BattleMode;
  masterIds: Record<PlayerId, MasterId>;
  aiProfiles: CpuAiProfiles;
}

interface DeckSettings {
  fixed: Record<PlayerId, boolean>;
  allowSpecial: Record<PlayerId, boolean>;
  text: Record<PlayerId, string>;
}

interface BattleHistoryEntry {
  id: string;
  createdAt: string;
  seed: number;
  firstPlayer: PlayerId;
  mode: BattleMode;
  masterIds: Record<PlayerId, MasterId>;
  aiProfiles: CpuAiProfiles;
  deckSettings: DeckSettings;
  winner: PlayerId;
  turns: number;
  playerHp: number;
  cpuHp: number;
  playerDeck: number;
  cpuDeck: number;
  deckout: boolean;
  longGame: boolean;
  replay?: BattleReplaySummary;
}

interface BattleReplayEvent {
  index: number;
  entry: string;
}

interface BattleReplayTurn {
  label: string;
  startIndex: number;
  endIndex: number;
  events: BattleReplayEvent[];
}

interface BattleReplaySummary {
  early: BattleReplayEvent[];
  middle: BattleReplayEvent[];
  late: BattleReplayEvent[];
  decisive: BattleReplayEvent[];
  turns: BattleReplayTurn[];
}

interface SavedBattlePreset {
  id: string;
  name: string;
  createdAt: string;
  settings: BattleSettings;
  deckSettings: DeckSettings;
}

interface BuiltInMatchPreset {
  id: string;
  name: string;
  description: string;
  create: () => { settings: BattleSettings; deckSettings: DeckSettings };
  deckPresetIds?: Record<PlayerId, DeckPresetId>;
}

interface DeckDraft {
  playerId: PlayerId;
  fixed: boolean;
  cardIds: string[];
  summary: DeckValidationSummary;
}

interface DeckCardOption {
  id: string;
  name: string;
  pool: CardPool;
  typeLabel: string;
  sortValue: number;
}

type DeckMatrixCellKind = "front" | "back" | "magic" | "special";
interface DeckMatrixCell {
  cardId: string;
  kind: DeckMatrixCellKind;
}

const DECK_PRESET_MASTER_FILTER_OPTIONS = [
  { value: "all", label: "すべて" },
  { value: "white", label: "白" },
  { value: "black", label: "黒" },
] as const satisfies readonly { value: DeckPresetMasterFilter; label: string }[];

const DECK_PRESET_RARE8_FILTER_OPTIONS = [
  { value: "all", label: "8すべて" },
  { value: "with", label: "8あり" },
  { value: "without", label: "8なし" },
] as const satisfies readonly { value: DeckPresetRare8Filter; label: string }[];

const DECK_PRESET_SORT_OPTIONS = [
  { value: "battle", label: "総合" },
  { value: "winRate", label: "勝率" },
  { value: "stability", label: "安定度" },
  { value: "speed", label: "速度" },
  { value: "vsBlack", label: "対黒勝率" },
  { value: "vsWhite", label: "対白勝率" },
  { value: "source", label: "登録順" },
] as const satisfies readonly { value: DeckPresetSortKey; label: string }[];

const DECK_PRESET_VISIBLE_CHUNK = 80;
const DECK_MATRIX_KIND_ORDER: DeckMatrixCellKind[] = ["front", "back", "magic", "special"];
const DECK_PRESET_CARD_FILTER_OPTIONS = getAllCardDefs()
  .map((def) => ({
    id: def.id,
    name: def.name,
    sortValue: deckCategorySortValue(def),
  }))
  .sort((a, b) => a.sortValue - b.sortValue || a.name.localeCompare(b.name, "ja") || a.id.localeCompare(b.id));

const DRAG_MIME = "application/x-card-hero-drag";

const LOG_FILTERS: LogFilter[] = ["all", "battle", "damage", "support", "turn", "cpu"];

type EffectKind = "attack" | "damage" | "summon" | "focus" | "move" | "heal" | "turn" | "random" | "default";

interface VisualEffect {
  id: number;
  kind: EffectKind;
  slots: SlotKey[];
  masters: PlayerId[];
  slotDamageFlashes: SlotDamageFlash[];
  masterDamageFlashes: MasterDamageFlash[];
}

interface DamageFlash {
  amount: number;
  defeated: boolean;
}

interface SlotDamageFlash extends DamageFlash {
  slotKey: SlotKey;
}

interface MasterDamageFlash extends DamageFlash {
  playerId: PlayerId;
}

function createDefaultAiProfiles(): CpuAiProfiles {
  return { player: "stable", cpu: "stable" };
}

function cloneAiProfiles(profiles: CpuAiProfiles): CpuAiProfiles {
  return normalizeAiProfiles(profiles);
}

function aiProfileSummary(profiles: CpuAiProfiles): string {
  return `P ${profiles.player} / C ${profiles.cpu}`;
}

function historyDeckSummary(settings: DeckSettings | undefined): string {
  const normalized = normalizeDeckSettings(settings);
  return PLAYER_IDS
    .map((playerId) => {
      const fixed = normalized.fixed[playerId] ? "固定" : "ランダム";
      const special = normalized.allowSpecial[playerId] ? "+S" : "";
      return `${playerId === "player" ? "P" : "C"} ${fixed}${special}`;
    })
    .join(" / ");
}

function normalizeAiProfiles(profiles: Partial<CpuAiProfiles> | undefined): CpuAiProfiles {
  return {
    player: normalizeCpuAiProfile(profiles?.player),
    cpu: normalizeCpuAiProfile(profiles?.cpu),
  };
}

function normalizeCpuAiProfile(value: unknown): CpuAiProfile {
  return CPU_AI_PROFILES.includes(value as CpuAiProfile) ? (value as CpuAiProfile) : "stable";
}

function normalizeMasterIds(masterIds: Partial<Record<PlayerId, MasterId>> | undefined): Record<PlayerId, MasterId> {
  return {
    player: normalizeMasterId(masterIds?.player),
    cpu: normalizeMasterId(masterIds?.cpu),
  };
}

function normalizeMasterId(value: unknown): MasterId {
  return MASTER_IDS.includes(value as MasterId) ? (value as MasterId) : "white";
}

function isPlayerId(value: unknown): value is PlayerId {
  return value === "player" || value === "cpu";
}

function normalizeBattleMode(value: unknown): BattleMode {
  return value === "cpu-vs-cpu" || value === "player-vs-cpu" ? value : "player-vs-cpu";
}

function createBattleSettings(seed: number): BattleSettings {
  return {
    seed,
    seedInput: String(seed),
    firstPlayer: "player",
    mode: "player-vs-cpu",
    masterIds: { player: "white", cpu: "white" },
    aiProfiles: createDefaultAiProfiles(),
  };
}

function createDeckSettings(seed: number): DeckSettings {
  return {
    fixed: { player: false, cpu: false },
    allowSpecial: { player: false, cpu: false },
    text: {
      player: generatedDeckText("player", seed),
      cpu: generatedDeckText("cpu", seed),
    },
  };
}

function createDeckSettingsFromPreset(playerPresetId: DeckPresetId, cpuPresetId = playerPresetId): DeckSettings {
  return {
    fixed: { player: true, cpu: true },
    allowSpecial: {
      player: deckPresetAllowsSpecial(playerPresetId),
      cpu: deckPresetAllowsSpecial(cpuPresetId),
    },
    text: {
      player: deckTextFromCardIds(buildDeckPresetCardIds(playerPresetId)),
      cpu: deckTextFromCardIds(buildDeckPresetCardIds(cpuPresetId)),
    },
  };
}

const BUILT_IN_MATCH_PRESETS: BuiltInMatchPreset[] = [
  {
    id: "standard-random",
    name: "通常ランダム",
    description: "通常カードのみ。Player vs CPU、ホワイト同士、stable AI。",
    create: () => ({
      settings: createBattleSettings(DEFAULT_BATTLE_SEED),
      deckSettings: createDeckSettings(DEFAULT_BATTLE_SEED),
    }),
    deckPresetIds: { player: "balanced-normal", cpu: "balanced-normal" },
  },
  {
    id: "black-cpu-duel",
    name: "ブラックCPU戦",
    description: "CPU vs CPU、ブラック同士、strong AI、通常固定デッキ。",
    create: () => ({
      settings: {
        ...createBattleSettings(640),
        seedInput: "640",
        mode: "cpu-vs-cpu",
        masterIds: { player: "black", cpu: "black" },
        aiProfiles: { player: "strong", cpu: "strong" },
      },
      deckSettings: createDeckSettingsFromPreset("black-pressure"),
    }),
    deckPresetIds: { player: "black-pressure", cpu: "black-pressure" },
  },
  {
    id: "special-showcase",
    name: "スペシャル検証",
    description: "スペシャルON固定デッキでスーパー化と代表効果を確認する。",
    create: () => ({
      settings: {
        ...createBattleSettings(620),
        seedInput: "620",
        mode: "player-vs-cpu",
      },
      deckSettings: createDeckSettingsFromPreset("special-showcase"),
    }),
    deckPresetIds: { player: "special-showcase", cpu: "special-showcase" },
  },
];

function createGameFromSettings(settings: BattleSettings, deckSettings: DeckSettings): GameState {
  const playerDeck = createDeckDraft(settings, deckSettings, "player");
  const cpuDeck = createDeckDraft(settings, deckSettings, "cpu");
  return createInitialGame(settings.seed, {
    firstPlayer: settings.firstPlayer,
    masterIds: settings.masterIds,
    playerDeckCardIds: deckSettings.fixed.player ? playerDeck.cardIds : undefined,
    cpuDeckCardIds: deckSettings.fixed.cpu ? cpuDeck.cardIds : undefined,
    allowSpecialDecks: deckSettings.allowSpecial,
  });
}

function createDeckDraft(settings: BattleSettings, deckSettings: DeckSettings, playerId: PlayerId): DeckDraft {
  if (!deckSettings.fixed[playerId]) {
    const cardIds = generatedDeckCardIds(playerId, settings.seed, settings.masterIds[playerId]);
    return {
      playerId,
      fixed: false,
      cardIds,
      summary: summarizeDeckCardIds(cardIds, [], { strictComposition: true }),
    };
  }

  const allowSpecial = deckSettings.allowSpecial[playerId];
  const parsed = parseDeckText(deckSettings.text[playerId], { allowSpecial });
  return {
    playerId,
    fixed: true,
    cardIds: parsed.cardIds,
    summary: summarizeDeckCardIds(parsed.cardIds, parsed.unknownTokens, {
      allowSpecial,
      disallowedSpecialTokens: parsed.disallowedSpecialTokens,
    }),
  };
}

function createDeckDrafts(settings: BattleSettings, deckSettings: DeckSettings): Record<PlayerId, DeckDraft> {
  return {
    player: createDeckDraft(settings, deckSettings, "player"),
    cpu: createDeckDraft(settings, deckSettings, "cpu"),
  };
}

function cloneDeckSettings(settings: DeckSettings): DeckSettings {
  return normalizeDeckSettings(settings);
}

function normalizeDeckSettings(settings: Partial<DeckSettings> | undefined): DeckSettings {
  const fallback = createDeckSettings(DEFAULT_BATTLE_SEED);
  return {
    fixed: {
      player: !!settings?.fixed?.player,
      cpu: !!settings?.fixed?.cpu,
    },
    allowSpecial: {
      player: !!settings?.allowSpecial?.player,
      cpu: !!settings?.allowSpecial?.cpu,
    },
    text: {
      player: typeof settings?.text?.player === "string" ? settings.text.player : fallback.text.player,
      cpu: typeof settings?.text?.cpu === "string" ? settings.text.cpu : fallback.text.cpu,
    },
  };
}

function cloneBattleSettings(settings: BattleSettings): BattleSettings {
  return {
    ...settings,
    masterIds: { ...settings.masterIds },
    aiProfiles: cloneAiProfiles(settings.aiProfiles),
  };
}

function createBattleHistoryEntry(
  game: GameState,
  settings: BattleSettings,
  deckSettings: DeckSettings,
): BattleHistoryEntry | undefined {
  if (!game.winner) {
    return undefined;
  }
  const deckout = game.log.some((entry) => entry.includes("山札切れ"));
  const createdAt = new Date().toISOString();
  return {
    id: `history_${createdAt}_${settings.seed}_${game.turnNumber}_${game.winner}_${game.log.length}`,
    createdAt,
    seed: settings.seed,
    firstPlayer: settings.firstPlayer,
    mode: settings.mode,
    masterIds: { ...settings.masterIds },
    aiProfiles: cloneAiProfiles(settings.aiProfiles),
    deckSettings: cloneDeckSettings(deckSettings),
    winner: game.winner,
    turns: game.turnNumber,
    playerHp: game.players.player.masterHp,
    cpuHp: game.players.cpu.masterHp,
    playerDeck: game.players.player.deck.length,
    cpuDeck: game.players.cpu.deck.length,
    deckout,
    longGame: game.turnNumber >= 25,
    replay: createBattleReplaySummary(game.log),
  };
}

function createBattleReplaySummary(log: string[]): BattleReplaySummary {
  const phases = splitReplayLogPhases(log);
  const decisive = pickReplayEvents(log, 0, log.length, 5);
  return {
    early: pickReplayEvents(log, phases.early.start, phases.early.end, 3),
    middle: pickReplayEvents(log, phases.middle.start, phases.middle.end, 3),
    late: pickReplayEvents(log, phases.late.start, phases.late.end, 4),
    decisive,
    turns: createBattleReplayTurns(log),
  };
}

function normalizeBattleReplaySummary(value: unknown): BattleReplaySummary | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const replay = value as Partial<Record<keyof BattleReplaySummary, unknown>>;
  return {
    early: normalizeBattleReplayEvents(replay.early),
    middle: normalizeBattleReplayEvents(replay.middle),
    late: normalizeBattleReplayEvents(replay.late),
    decisive: normalizeBattleReplayEvents(replay.decisive),
    turns: normalizeBattleReplayTurns(replay.turns),
  };
}

function normalizeBattleReplayEvents(value: unknown): BattleReplayEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((event) => {
    if (!event || typeof event !== "object") {
      return [];
    }
    const candidate = event as Partial<BattleReplayEvent>;
    if (typeof candidate.index !== "number" || !Number.isFinite(candidate.index) || typeof candidate.entry !== "string") {
      return [];
    }
    return [{ index: candidate.index, entry: candidate.entry }];
  });
}

function normalizeBattleReplayTurns(value: unknown): BattleReplayTurn[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((turn) => {
    if (!turn || typeof turn !== "object") {
      return [];
    }
    const candidate = turn as Partial<BattleReplayTurn>;
    if (
      typeof candidate.label !== "string" ||
      typeof candidate.startIndex !== "number" ||
      !Number.isFinite(candidate.startIndex) ||
      typeof candidate.endIndex !== "number" ||
      !Number.isFinite(candidate.endIndex)
    ) {
      return [];
    }
    return [
      {
        label: candidate.label,
        startIndex: candidate.startIndex,
        endIndex: candidate.endIndex,
        events: normalizeBattleReplayEvents(candidate.events),
      },
    ];
  });
}

function splitReplayLogPhases(log: string[]) {
  const third = Math.max(1, Math.floor(log.length / 3));
  return {
    early: { start: 0, end: Math.min(log.length, third) },
    middle: { start: Math.min(log.length, third), end: Math.min(log.length, third * 2) },
    late: { start: Math.min(log.length, third * 2), end: log.length },
  };
}

function pickReplayEvents(log: string[], start: number, end: number, limit: number): BattleReplayEvent[] {
  const scoped = log
    .map((entry, index) => ({ entry, index }))
    .slice(start, end)
    .filter(({ entry }) => replayEventPriority(entry) > 0)
    .sort((a, b) => replayEventPriority(b.entry) - replayEventPriority(a.entry) || a.index - b.index);
  return scoped.slice(0, limit).sort((a, b) => a.index - b.index);
}

function createBattleReplayTurns(log: string[]): BattleReplayTurn[] {
  const turns: BattleReplayTurn[] = [];
  let current: Omit<BattleReplayTurn, "endIndex"> | undefined;

  log.forEach((entry, index) => {
    const turnLabel = replayTurnLabel(entry);
    if (turnLabel) {
      if (current) {
        turns.push({ ...current, endIndex: index - 1 });
      }
      current = { label: turnLabel, startIndex: index, events: [{ index, entry }] };
      return;
    }

    if (!current) {
      current = { label: "開始前", startIndex: index, events: [] };
    }
    current.events.push({ index, entry });
  });

  if (current) {
    turns.push({ ...current, endIndex: log.length - 1 });
  }

  return turns.filter((turn) => turn.events.length > 0);
}

function replayTurnLabel(entry: string): string | undefined {
  if (!entry.includes("ターン開始")) {
    return undefined;
  }
  return entry.replace(/^.*?((?:プレイヤー|CPU|先攻|後攻).+?ターン開始).*$/, "$1");
}

function replayEventPriority(entry: string): number {
  if (entry.includes("勝利")) {
    return 100;
  }
  if (entry.includes("判断:")) {
    return 90;
  }
  if (entry.includes("倒れ") || entry.includes("撃破")) {
    return 80;
  }
  if (entry.includes("マスターHPが") || entry.includes("山札切れ")) {
    return 75;
  }
  if (entry.includes("レベル") || entry.includes("Lv")) {
    return 70;
  }
  if (entry.includes("ランダム結果")) {
    return 65;
  }
  if (entry.includes("シールド") || entry.includes("ウェイクアップ") || entry.includes("バーサク") || entry.includes("大地の怒り")) {
    return 60;
  }
  if (entry.includes("召喚") || entry.includes("登場")) {
    return 45;
  }
  return 0;
}

function findLatestSpectatorAttention(log: string[]): BattleReplayEvent | undefined {
  for (let index = log.length - 1; index >= 0; index -= 1) {
    const entry = log[index];
    if (isSpectatorAttentionLog(entry)) {
      return { index, entry };
    }
  }
  return undefined;
}

function isSpectatorAttentionLog(entry: string): boolean {
  return (
    entry.includes("勝利") ||
    entry.includes("倒れ") ||
    entry.includes("撃破") ||
    entry.includes("マスターHPが") ||
    entry.includes("山札切れ") ||
    entry.includes("レベル") ||
    entry.includes("Lv") ||
    entry.includes("スーパー") ||
    entry.includes("ランダム結果")
  );
}

function createBattleResultKey(game: GameState, settings: BattleSettings): string {
  return [
    settings.seed,
    settings.firstPlayer,
    settings.mode,
    settings.masterIds.player,
    settings.masterIds.cpu,
    settings.aiProfiles.player,
    settings.aiProfiles.cpu,
    game.turnNumber,
    game.winner,
    game.log.length,
    game.log.at(-1) ?? "",
  ].join("|");
}

function loadBattleHistory(): BattleHistoryEntry[] {
  return loadJsonArray<Partial<BattleHistoryEntry>>(BATTLE_HISTORY_STORAGE_KEY)
    .map(normalizeBattleHistoryEntry)
    .filter((entry): entry is BattleHistoryEntry => !!entry)
    .slice(0, BATTLE_HISTORY_LIMIT);
}

function normalizeBattleHistoryEntry(entry: Partial<BattleHistoryEntry>): BattleHistoryEntry | undefined {
  if (!entry || typeof entry !== "object") {
    return undefined;
  }
  const winner = isPlayerId(entry.winner) ? entry.winner : undefined;
  if (!winner) {
    return undefined;
  }
  const seed = normalizeHistoryNumber(entry.seed, DEFAULT_BATTLE_SEED);
  const turns = normalizeHistoryNumber(entry.turns, 0);
  return {
    id: typeof entry.id === "string" && entry.id ? entry.id : `history_${seed}_${turns}_${winner}`,
    createdAt: typeof entry.createdAt === "string" ? entry.createdAt : "",
    seed,
    firstPlayer: isPlayerId(entry.firstPlayer) ? entry.firstPlayer : "player",
    mode: normalizeBattleMode(entry.mode),
    masterIds: normalizeMasterIds(entry.masterIds),
    aiProfiles: normalizeAiProfiles(entry.aiProfiles),
    deckSettings: normalizeDeckSettings(entry.deckSettings),
    winner,
    turns,
    playerHp: normalizeHistoryNumber(entry.playerHp, 0),
    cpuHp: normalizeHistoryNumber(entry.cpuHp, 0),
    playerDeck: normalizeHistoryNumber(entry.playerDeck, 0),
    cpuDeck: normalizeHistoryNumber(entry.cpuDeck, 0),
    deckout: !!entry.deckout,
    longGame: !!entry.longGame,
    replay: normalizeBattleReplaySummary(entry.replay),
  };
}

function normalizeHistoryNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback;
}

function loadSavedBattlePresets(): SavedBattlePreset[] {
  return loadJsonArray<SavedBattlePreset>(BATTLE_PRESETS_STORAGE_KEY);
}

function saveJsonArray<T>(key: string, value: T[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage is a convenience cache; gameplay must continue even when it is unavailable.
  }
}

function loadJsonArray<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function generatedDeckCardIds(playerId: PlayerId, seed: number, masterId: MasterId): string[] {
  return buildDeckCardIds(seed + (playerId === "player" ? 101 : 202), { masterId });
}

function generatedDeckText(playerId: PlayerId, seed: number, masterId: MasterId = "white"): string {
  return deckTextFromCardIds(generatedDeckCardIds(playerId, seed, masterId));
}

function createDeckPickerIds(): Record<PlayerId, string> {
  const firstCardId = getAllCardDefs()[0]?.id ?? "";
  return { player: firstCardId, cpu: firstCardId };
}

function createDeckPresetFilters(): Record<PlayerId, DeckPresetFilters> {
  const createFilter = (): DeckPresetFilters => ({
    ...DEFAULT_DECK_PRESET_FILTERS,
    cardIds: [...DEFAULT_DECK_PRESET_FILTERS.cardIds],
  });
  return {
    player: createFilter(),
    cpu: createFilter(),
  };
}

function createDeckPresetSorts(): Record<PlayerId, DeckPresetSortKey> {
  return { player: "battle", cpu: "battle" };
}

function normalizeSeedInput(value: string, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(0, Math.floor(parsed)) >>> 0;
}

export function App() {
  const [battleSettings, setBattleSettings] = useState<BattleSettings>(() => createBattleSettings(DEFAULT_BATTLE_SEED));
  const [deckSettings, setDeckSettings] = useState<DeckSettings>(() => createDeckSettings(DEFAULT_BATTLE_SEED));
  const [deckPickerIds, setDeckPickerIds] = useState<Record<PlayerId, string>>(() => createDeckPickerIds());
  const [game, setGame] = useState<GameState>(() =>
    createGameFromSettings(createBattleSettings(DEFAULT_BATTLE_SEED), createDeckSettings(DEFAULT_BATTLE_SEED)),
  );
  const [selection, setSelection] = useState<Selection | undefined>();
  const [pendingDropAction, setPendingDropAction] = useState<PendingDropAction | undefined>();
  const [error, setError] = useState<string>("");
  const [visualEffect, setVisualEffect] = useState<VisualEffect | undefined>();
  const [pointerDragging, setPointerDragging] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [autoStepDelayMs, setAutoStepDelayMs] = useState(AUTO_STEP_DELAY_DEFAULT_MS);
  const [spectatorPauseOnAttention, setSpectatorPauseOnAttention] = useState(true);
  const [spectatorPaused, setSpectatorPaused] = useState(false);
  const [zoneView, setZoneView] = useState<ZoneView | undefined>();
  const [logFilter, setLogFilter] = useState<LogFilter>("all");
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | undefined>();
  const [battleHistory, setBattleHistory] = useState<BattleHistoryEntry[]>(() => loadBattleHistory());
  const [savedBattlePresets, setSavedBattlePresets] = useState<SavedBattlePreset[]>(() => loadSavedBattlePresets());
  const [matchPresetId, setMatchPresetId] = useState<string>(BUILT_IN_MATCH_PRESETS[0]?.id ?? "");
  const [savedPresetId, setSavedPresetId] = useState<string>("");
  const [battlePresetName, setBattlePresetName] = useState("My Battle Preset");
  const [deckPresetPickerIds, setDeckPresetPickerIds] = useState<Record<PlayerId, DeckPresetId>>({
    player: "balanced-normal",
    cpu: "balanced-normal",
  });
  const [deckSetupTarget, setDeckSetupTarget] = useState<PlayerId>("player");
  const [deckPresetFilters, setDeckPresetFilters] = useState<Record<PlayerId, DeckPresetFilters>>(() => createDeckPresetFilters());
  const [deckPresetSorts, setDeckPresetSorts] = useState<Record<PlayerId, DeckPresetSortKey>>(() => createDeckPresetSorts());
  const [aiLabSuiteId, setAiLabSuiteId] = useState<DeckBattleScoreSnapshotSuiteId>(DEFAULT_DECK_BATTLE_SCORE_SNAPSHOT_SUITE_ID);
  const previousGameRef = useRef<GameState>(game);
  const lastSpectatorAttentionIndexRef = useRef<number | undefined>(undefined);
  const visualEffectIdRef = useRef(0);
  const recordedResultKeyRef = useRef<string | undefined>(undefined);
  const activeBattleSettingsRef = useRef<BattleSettings>(cloneBattleSettings(battleSettings));
  const activeDeckSettingsRef = useRef<DeckSettings>(cloneDeckSettings(deckSettings));
  const pointerDragRef = useRef<{
    payload: DragPayload;
    startX: number;
    startY: number;
    dragging: boolean;
  } | undefined>(undefined);
  const pointerDragCleanupRef = useRef<(() => void) | undefined>(undefined);
  const suppressNextClickRef = useRef(false);

  const deckDrafts = useMemo(() => createDeckDrafts(battleSettings, deckSettings), [battleSettings, deckSettings]);
  const deckCardOptions = useMemo(
    () => ({
      player: getDeckCardOptions(deckSettings.allowSpecial.player),
      cpu: getDeckCardOptions(deckSettings.allowSpecial.cpu),
    }),
    [deckSettings.allowSpecial.cpu, deckSettings.allowSpecial.player],
  );
  const fixedDeckError = PLAYER_IDS.some((playerId) => deckSettings.fixed[playerId] && !deckDrafts[playerId].summary.valid);
  const currentPlayer = game.players[game.currentPlayer];
  const cpuVsCpu = battleSettings.mode === "cpu-vs-cpu";
  const spectatorAutoPaused = cpuVsCpu && spectatorPaused;
  const isAutoResolving =
    !game.winner && !spectatorAutoPaused && (cpuVsCpu || autoPlayEnabled || (game.currentPlayer === "cpu" && !game.pendingLevelUp));
  const controlsDisabled = cpuVsCpu || autoPlayEnabled || game.currentPlayer !== "player" || !!game.winner || !!game.pendingLevelUp;
  const activeBattleSettings = activeBattleSettingsRef.current;
  const turnStatus = game.winner
    ? `${playerLabel(game.winner)} win`
    : cpuVsCpu
      ? spectatorPaused
        ? `CPU vs CPU paused / ${playerLabel(game.currentPlayer)}`
        : `CPU vs CPU... ${playerLabel(game.currentPlayer)}`
      : autoPlayEnabled
      ? `Auto playing... ${playerLabel(game.currentPlayer)}`
      : isAutoResolving
        ? "CPU resolving..."
        : playerLabel(game.currentPlayer);
  const targetKeys = useMemo(() => {
    if (pendingDropAction) {
      return new Set([pendingDropActionTargetKey(pendingDropAction)]);
    }
    if (!selection) {
      return new Set<string>();
    }
    if (selection.kind === "command") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "commandSecondaryTarget") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "masterAction") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "magicSecondaryTarget") {
      return new Set(selection.targets.map(targetToKey));
    }
    if (selection.kind === "move") {
      return new Set(selection.targets.map((slotKey) => `monster:${slotKey}`));
    }
    if (selection.kind === "hand") {
      const handCard = getHandCard(game, selection.instanceId);
      if (!handCard) {
        return new Set<string>();
      }
      const def = getCardDef(handCard.cardId);
      if (def.type === "magic") {
        return new Set(getMagicTargets(game, selection.instanceId).map(targetToKey));
      }
      return new Set(
        BOARD_SLOT_KEYS
          .filter((slotKey) => canSummonTo(game, selection.instanceId, slotKey))
          .map((slotKey) => `monster:${slotKey}`),
      );
    }
    return new Set<string>();
  }, [game, pendingDropAction, selection]);
  const visibleLogEntries = useMemo(
    () =>
      game.log
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => logMatchesFilter(entry, logFilter))
        .slice(-24),
    [game.log, logFilter],
  );
  const selectedLogEntry = selectedLogIndex !== undefined ? game.log[selectedLogIndex] : undefined;
  const latestSpectatorAttention = useMemo(() => findLatestSpectatorAttention(game.log), [game.log]);

  useEffect(() => {
    if (selectedLogIndex === undefined) {
      return;
    }
    const entry = game.log[selectedLogIndex];
    if (!entry || !logMatchesFilter(entry, logFilter)) {
      setSelectedLogIndex(undefined);
    }
  }, [game.log, logFilter, selectedLogIndex]);

  useEffect(() => {
    if (!cpuVsCpu || !spectatorPauseOnAttention) {
      setSpectatorPaused(false);
      lastSpectatorAttentionIndexRef.current = latestSpectatorAttention?.index;
      return;
    }
    if (!latestSpectatorAttention) {
      return;
    }
    if (latestSpectatorAttention.index !== lastSpectatorAttentionIndexRef.current) {
      lastSpectatorAttentionIndexRef.current = latestSpectatorAttention.index;
      setSpectatorPaused(true);
    }
  }, [cpuVsCpu, latestSpectatorAttention, spectatorPauseOnAttention]);

  useEffect(() => {
    const previous = previousGameRef.current;
    if (previous !== game) {
      visualEffectIdRef.current += 1;
      setVisualEffect(createVisualEffect(previous, game, visualEffectIdRef.current));
      previousGameRef.current = game;
    }
  }, [game]);

  useEffect(() => {
    if (!isAutoResolving) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setGame((previous) => {
        if (previous.winner) {
          return previous;
        }
        if (cpuVsCpu || autoPlayEnabled) {
          return runAutoStep(previous, { profiles: battleSettings.aiProfiles });
        }
        if (previous.currentPlayer === "cpu" && !previous.pendingLevelUp) {
          return runCpuStep(previous, { profiles: battleSettings.aiProfiles });
        }
        return previous;
      });
    }, cpuVsCpu || autoPlayEnabled ? autoStepDelayMs : CPU_STEP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [autoPlayEnabled, autoStepDelayMs, battleSettings.aiProfiles, cpuVsCpu, game, isAutoResolving]);

  useEffect(() => {
    if (!visualEffect) {
      return undefined;
    }
    const timer = window.setTimeout(() => setVisualEffect(undefined), VISUAL_EFFECT_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [visualEffect]);

  useEffect(() => {
    const entry = createBattleHistoryEntry(game, activeBattleSettingsRef.current, activeDeckSettingsRef.current);
    if (!entry) {
      recordedResultKeyRef.current = undefined;
      return;
    }
    const resultKey = createBattleResultKey(game, activeBattleSettingsRef.current);
    if (recordedResultKeyRef.current === resultKey) {
      return;
    }
    recordedResultKeyRef.current = resultKey;
    setBattleHistory((previous) => [entry, ...previous].slice(0, BATTLE_HISTORY_LIMIT));
  }, [game]);

  useEffect(() => {
    saveJsonArray(BATTLE_HISTORY_STORAGE_KEY, battleHistory);
  }, [battleHistory]);

  useEffect(() => {
    saveJsonArray(BATTLE_PRESETS_STORAGE_KEY, savedBattlePresets);
  }, [savedBattlePresets]);

  useEffect(() => () => clearPointerDrag(), []);

  function applyChange(change: (state: GameState) => GameState, keepSelection = false) {
    try {
      setGame(change(game));
      setError("");
      setPendingDropAction(undefined);
      if (!keepSelection) {
        setSelection(undefined);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "操作に失敗しました");
    }
  }

  function resolveMagicPrimaryTarget(handInstanceId: string, target: Target) {
    const secondaryTargets = getMagicSecondaryTargets(game, { handInstanceId, target });
    if (secondaryTargets.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "magicSecondaryTarget", handInstanceId, target, targets: secondaryTargets });
      setError("");
      return;
    }

    const handChoices = getMagicHandChoices(game, handInstanceId);
    const handCard = getHandCard(game, handInstanceId);
    if (handCard?.cardId === "card_116" && handChoices.length > 0) {
      setPendingDropAction(undefined);
      setSelection({
        kind: "magicRefresh",
        handInstanceId,
        target,
        choices: handChoices,
        selectedIds: handChoices.map((card) => card.instanceId),
      });
      setError("");
      return;
    }
    if (handChoices.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "magicHandChoice", handInstanceId, target, choices: handChoices });
      setError("");
      return;
    }

    const categories = getMagicSearchCategories(game, handInstanceId);
    if (categories.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "magicSearch", handInstanceId, target, categories });
      setError("");
      return;
    }

    applyChange((state) => playMagic(state, { handInstanceId, target }));
  }

  function resolveCommandPrimaryTarget(attackerSlotKey: SlotKey, commandId: string, target: Target) {
    const secondaryTargets = getCommandSecondaryTargets(game, { attackerSlotKey, commandId, target });
    if (secondaryTargets.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "commandSecondaryTarget", attackerSlotKey, commandId, target, targets: secondaryTargets });
      setError("");
      return;
    }

    const handChoices = getCommandHandChoices(game, attackerSlotKey, commandId);
    if (handChoices.length > 0) {
      setPendingDropAction(undefined);
      setSelection({ kind: "commandHandChoice", attackerSlotKey, commandId, target, choices: handChoices });
      setError("");
      return;
    }

    applyChange((state) =>
      attackWithCommand(state, {
        attackerSlotKey,
        commandId,
        target,
      }),
    );
  }

  function handleSlotClick(slotKey: SlotKey) {
    if (consumeSuppressedClick()) {
      return;
    }
    if (game.currentPlayer !== "player" || game.winner || game.pendingLevelUp) {
      selectSlotForInfo(slotKey);
      return;
    }

    const slot = game.slots[slotKey];
    if (pendingDropAction) {
      if (slot.monster?.owner === game.currentPlayer && slot.monster.status === "active") {
        setPendingDropAction(undefined);
        setSelection({ kind: "monster", slotKey });
        setError("");
        return;
      }
      setPendingDropAction(undefined);
      setSelection(undefined);
      return;
    }

    if (selection?.kind === "hand") {
      const target: Target = { kind: "monster", slotKey };
      const handCard = getHandCard(game, selection.instanceId);
      if (handCard && getCardDef(handCard.cardId).type === "monster" && canSummonTo(game, selection.instanceId, slotKey)) {
        applyChange((state) => summonMonster(state, selection.instanceId, slotKey));
        return;
      }
      if (targetKeys.has(targetToKey(target))) {
        resolveMagicPrimaryTarget(selection.instanceId, target);
        return;
      }
    }

    if (selection?.kind === "command") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        resolveCommandPrimaryTarget(selection.attackerSlotKey, selection.commandId, target);
        return;
      }
    }

    if (selection?.kind === "magicSecondaryTarget") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        applyChange((state) =>
          playMagic(state, {
            handInstanceId: selection.handInstanceId,
            target: selection.target,
            secondaryTarget: target,
          }),
        );
        return;
      }
    }

    if (selection?.kind === "commandSecondaryTarget") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        applyChange((state) =>
          attackWithCommand(state, {
            attackerSlotKey: selection.attackerSlotKey,
            commandId: selection.commandId,
            target: selection.target,
            secondaryTarget: target,
          }),
        );
        return;
      }
    }

    if (selection?.kind === "masterAction") {
      const target: Target = { kind: "monster", slotKey };
      if (targetKeys.has(targetToKey(target))) {
        applyChange((state) => useMasterAction(state, selection.actionId, target));
        return;
      }
    }

    if (selection?.kind === "move" && targetKeys.has(`monster:${slotKey}`)) {
      applyChange((state) => moveMonster(state, selection.fromSlotKey, slotKey));
      return;
    }

    selectSlotForInfo(slotKey);
  }

  function selectSlotForInfo(slotKey: SlotKey) {
    setPendingDropAction(undefined);
    setSelection(game.slots[slotKey].monster ? { kind: "monster", slotKey } : undefined);
    setError("");
  }

  function handleMasterClick(playerId: "player" | "cpu") {
    if (consumeSuppressedClick()) {
      return;
    }
    if (game.currentPlayer !== "player" || game.winner || game.pendingLevelUp) {
      return;
    }
    if (pendingDropAction) {
      return;
    }
    const target: Target = { kind: "master", playerId };
    if (selection?.kind === "masterAction" && targetKeys.has(targetToKey(target))) {
      applyChange((state) => useMasterAction(state, selection.actionId, target));
      return;
    }
    if (selection?.kind === "command" && targetKeys.has(targetToKey(target))) {
      resolveCommandPrimaryTarget(selection.attackerSlotKey, selection.commandId, target);
      return;
    }
    if (selection?.kind === "hand" && targetKeys.has(targetToKey(target))) {
      resolveMagicPrimaryTarget(selection.instanceId, target);
      return;
    }
    setPendingDropAction(undefined);
    setSelection(undefined);
    setError("");
  }

  function handleEndTurn() {
    applyChange(endTurn);
  }

  function startNewGame(settings: BattleSettings, decks: DeckSettings) {
    const drafts = createDeckDrafts(settings, decks);
    const invalidPlayer = PLAYER_IDS.find((playerId) => decks.fixed[playerId] && !drafts[playerId].summary.valid);
    if (invalidPlayer) {
      setZoneView({ kind: "deckSetup" });
      setError(`${playerLabel(invalidPlayer)}の固定デッキを修正してください`);
      return;
    }

    const next = createGameFromSettings(settings, decks);
    activeBattleSettingsRef.current = cloneBattleSettings(settings);
    activeDeckSettingsRef.current = cloneDeckSettings(decks);
    previousGameRef.current = next;
    setGame(next);
    setSelection(undefined);
    setPendingDropAction(undefined);
    setZoneView(undefined);
    setError("");
    setVisualEffect(undefined);
    setAutoPlayEnabled(false);
    setSpectatorPaused(false);
    lastSpectatorAttentionIndexRef.current = undefined;
  }

  function handleNewGame() {
    startNewGame(battleSettings, deckSettings);
  }

  function handleRandomSeedNewGame() {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    const nextSettings = { ...battleSettings, seed, seedInput: String(seed) };
    setBattleSettings(nextSettings);
    startNewGame(nextSettings, deckSettings);
  }

  function handleReplayHistory(entry: BattleHistoryEntry) {
    const nextSettings: BattleSettings = {
      seed: entry.seed,
      seedInput: String(entry.seed),
      firstPlayer: entry.firstPlayer,
      mode: entry.mode,
      masterIds: { ...entry.masterIds },
      aiProfiles: cloneAiProfiles(entry.aiProfiles),
    };
    const nextDeckSettings = cloneDeckSettings(entry.deckSettings);
    setBattleSettings(nextSettings);
    setDeckSettings(nextDeckSettings);
    startNewGame(nextSettings, nextDeckSettings);
  }

  function handleApplyBuiltInMatchPreset(presetId: string) {
    const preset = BUILT_IN_MATCH_PRESETS.find((candidate) => candidate.id === presetId);
    if (!preset) {
      return;
    }
    const next = preset.create();
    setMatchPresetId(presetId);
    if (preset.deckPresetIds) {
      setDeckPresetPickerIds({ ...preset.deckPresetIds });
    }
    setDeckPresetFilters(createDeckPresetFilters());
    setBattleSettings(next.settings);
    setDeckSettings(next.deckSettings);
    startNewGame(next.settings, next.deckSettings);
  }

  function handleSaveBattlePreset() {
    const name = battlePresetName.trim() || "Battle Preset";
    const now = new Date().toISOString();
    const preset: SavedBattlePreset = {
      id: `preset_${Date.now()}`,
      name,
      createdAt: now,
      settings: cloneBattleSettings(battleSettings),
      deckSettings: cloneDeckSettings(deckSettings),
    };
    setSavedBattlePresets((previous) => [preset, ...previous].slice(0, 20));
    setSavedPresetId(preset.id);
    setBattlePresetName(name);
  }

  function handleLoadSavedBattlePreset(presetId: string) {
    const preset = savedBattlePresets.find((candidate) => candidate.id === presetId);
    if (!preset) {
      setSavedPresetId("");
      return;
    }
    const nextSettings = cloneBattleSettings(preset.settings);
    const nextDeckSettings = cloneDeckSettings(preset.deckSettings);
    setSavedPresetId(preset.id);
    setBattleSettings(nextSettings);
    setDeckSettings(nextDeckSettings);
    startNewGame(nextSettings, nextDeckSettings);
  }

  function handleDeleteSavedBattlePreset(presetId: string) {
    setSavedBattlePresets((previous) => previous.filter((preset) => preset.id !== presetId));
    if (savedPresetId === presetId) {
      setSavedPresetId("");
    }
  }

  function handleClearBattleHistory() {
    setBattleHistory([]);
    recordedResultKeyRef.current = undefined;
  }

  function handleDeckPresetPickerChange(playerId: PlayerId, presetId: DeckPresetId) {
    setDeckPresetPickerIds((previous) => ({ ...previous, [playerId]: presetId }));
    applyDeckPreset(playerId, presetId);
  }

  function handleDeckPresetFilterChange(playerId: PlayerId, filters: DeckPresetFilters) {
    setDeckPresetFilters((previous) => ({ ...previous, [playerId]: filters }));
  }

  function handleDeckPresetSortChange(playerId: PlayerId, sortKey: DeckPresetSortKey) {
    setDeckPresetSorts((previous) => ({ ...previous, [playerId]: sortKey }));
  }

  function applyDeckPreset(playerId: PlayerId, presetId: DeckPresetId) {
    setDeckSettings((previous) => ({
      ...previous,
      fixed: { ...previous.fixed, [playerId]: true },
      allowSpecial: { ...previous.allowSpecial, [playerId]: deckPresetAllowsSpecial(presetId) },
      text: { ...previous.text, [playerId]: deckTextFromCardIds(buildDeckPresetCardIds(presetId)) },
    }));
  }

  function handleBattleSeedChange(value: string) {
    const parsed = normalizeSeedInput(value, battleSettings.seed);
    setBattleSettings({ ...battleSettings, seedInput: value, seed: parsed });
  }

  function handleBattleFirstPlayerChange(value: string) {
    if (value !== "player" && value !== "cpu") {
      return;
    }
    setBattleSettings({ ...battleSettings, firstPlayer: value });
  }

  function handleBattleModeChange(value: string) {
    if (value !== "player-vs-cpu" && value !== "cpu-vs-cpu") {
      return;
    }
    setBattleSettings({ ...battleSettings, mode: value });
    setAutoPlayEnabled(false);
    setSpectatorPaused(false);
  }

  function handleBattleAiProfileChange(playerId: PlayerId, value: string) {
    if (!CPU_AI_PROFILES.includes(value as CpuAiProfile)) {
      return;
    }
    setBattleSettings({
      ...battleSettings,
      aiProfiles: { ...battleSettings.aiProfiles, [playerId]: value as CpuAiProfile },
    });
  }

  function handleBattleMasterChange(playerId: PlayerId, masterId: string) {
    if (!MASTER_IDS.includes(masterId as MasterId)) {
      return;
    }
    setBattleSettings({
      ...battleSettings,
      masterIds: { ...battleSettings.masterIds, [playerId]: masterId as MasterId },
    });
  }

  function handleRandomSeed() {
    const seed = Math.floor(Math.random() * 1_000_000_000);
    setBattleSettings({ ...battleSettings, seed, seedInput: String(seed) });
  }

  function handleAutoSpeedPreset(delayMs: number) {
    setAutoStepDelayMs(delayMs);
    if (cpuVsCpu) {
      setSpectatorPaused(false);
    }
  }

  function handleDeckFixedChange(playerId: PlayerId, fixed: boolean) {
    setDeckSettings((previous) => ({
      ...previous,
      fixed: { ...previous.fixed, [playerId]: fixed },
      text: {
        ...previous.text,
        [playerId]: previous.text[playerId] || generatedDeckText(playerId, battleSettings.seed, battleSettings.masterIds[playerId]),
      },
    }));
  }

  function handleDeckAllowSpecialChange(playerId: PlayerId, allowSpecial: boolean) {
    setDeckSettings((previous) => ({
      ...previous,
      allowSpecial: { ...previous.allowSpecial, [playerId]: allowSpecial },
    }));
    setDeckPickerIds((previous) => {
      const options = getDeckCardOptions(allowSpecial);
      if (options.some((option) => option.id === previous[playerId])) {
        return previous;
      }
      return { ...previous, [playerId]: options[0]?.id ?? "" };
    });
  }

  function handleDeckTextChange(playerId: PlayerId, text: string) {
    setDeckSettings((previous) => ({
      ...previous,
      text: { ...previous.text, [playerId]: text },
    }));
  }

  function handleUseGeneratedDeckAsFixed(playerId: PlayerId) {
    setDeckSettings((previous) => ({
      ...previous,
      fixed: { ...previous.fixed, [playerId]: true },
      text: { ...previous.text, [playerId]: generatedDeckText(playerId, battleSettings.seed, battleSettings.masterIds[playerId]) },
    }));
  }

  function handleDeckPickerChange(playerId: PlayerId, cardId: string) {
    setDeckPickerIds((previous) => ({ ...previous, [playerId]: cardId }));
  }

  function handleAddDeckCard(playerId: PlayerId, cardId: string) {
    if (!isDeckCardAllowed(playerId, cardId, deckSettings)) {
      return;
    }
    const parsed = parseDeckText(deckSettings.text[playerId], { allowSpecial: true });
    const currentCount = parsed.cardIds.filter((id) => id === cardId).length;
    if (parsed.cardIds.length >= 30 || currentCount >= 3) {
      return;
    }
    setDeckSettings((previous) => ({
      ...previous,
      fixed: { ...previous.fixed, [playerId]: true },
      text: { ...previous.text, [playerId]: deckTextFromCardIds([...parsed.cardIds, cardId]) },
    }));
  }

  function handleRemoveDeckCard(playerId: PlayerId, cardId: string) {
    const parsed = parseDeckText(deckSettings.text[playerId], { allowSpecial: true });
    const removeIndex = parsed.cardIds.indexOf(cardId);
    if (removeIndex < 0) {
      return;
    }
    const nextCardIds = parsed.cardIds.filter((_, index) => index !== removeIndex);
    setDeckSettings((previous) => ({
      ...previous,
      fixed: { ...previous.fixed, [playerId]: true },
      text: { ...previous.text, [playerId]: deckTextFromCardIds(nextCardIds) },
    }));
  }

  function handleAutoDelayChange(value: string) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return;
    }
    setAutoStepDelayMs(clampNumber(
      Math.round(parsed / AUTO_STEP_DELAY_STEP_MS) * AUTO_STEP_DELAY_STEP_MS,
      AUTO_STEP_DELAY_MIN_MS,
      AUTO_STEP_DELAY_MAX_MS,
    ));
  }

  function handleHandDragStart(event: DragEvent<HTMLButtonElement>, instanceId: string) {
    startDrag(event, { kind: "hand", instanceId });
  }

  function handleMonsterDragStart(event: DragEvent<HTMLButtonElement>, slotKey: SlotKey) {
    if (!canDragMonsterFromSlot(slotKey)) {
      event.preventDefault();
      return;
    }
    startDrag(event, { kind: "monster", slotKey });
  }

  function startDrag(event: DragEvent<HTMLElement>, payload: DragPayload) {
    if (controlsDisabled) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
  }

  function handleHandPointerDown(event: ReactPointerEvent<HTMLButtonElement>, instanceId: string) {
    startPointerDrag(event, { kind: "hand", instanceId });
  }

  function handleMonsterPointerDown(event: ReactPointerEvent<HTMLButtonElement>, slotKey: SlotKey) {
    if (!canDragMonsterFromSlot(slotKey)) {
      return;
    }
    startPointerDrag(event, { kind: "monster", slotKey });
  }

  function startPointerDrag(event: ReactPointerEvent<HTMLElement>, payload: DragPayload) {
    if (controlsDisabled || event.button !== 0) {
      return;
    }

    clearPointerDrag();
    pointerDragRef.current = {
      payload,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    };

    const handleMove = (nativeEvent: PointerEvent) => {
      const current = pointerDragRef.current;
      if (!current) {
        return;
      }
      const distance = Math.hypot(nativeEvent.clientX - current.startX, nativeEvent.clientY - current.startY);
      if (!current.dragging && distance >= 8) {
        current.dragging = true;
        setPointerDragging(true);
      }
      if (current.dragging) {
        nativeEvent.preventDefault();
      }
    };

    const handleUp = (nativeEvent: PointerEvent) => {
      const current = pointerDragRef.current;
      clearPointerDrag();
      if (!current?.dragging) {
        return;
      }
      nativeEvent.preventDefault();
      suppressNextClick();

      const target = dropTargetFromPoint(nativeEvent.clientX, nativeEvent.clientY);
      if (!target) {
        setPendingDropAction(undefined);
        setError("この移動に対応する行動がありません");
        return;
      }
      handleDropAction(current.payload, target);
    };

    const handleCancel = () => {
      clearPointerDrag();
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp, { once: true });
    window.addEventListener("pointercancel", handleCancel, { once: true });
    pointerDragCleanupRef.current = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }

  function clearPointerDrag() {
    pointerDragCleanupRef.current?.();
    pointerDragCleanupRef.current = undefined;
    pointerDragRef.current = undefined;
    setPointerDragging(false);
  }

  function suppressNextClick() {
    suppressNextClickRef.current = true;
    window.setTimeout(() => {
      suppressNextClickRef.current = false;
    }, 0);
  }

  function consumeSuppressedClick(): boolean {
    if (!suppressNextClickRef.current) {
      return false;
    }
    suppressNextClickRef.current = false;
    return true;
  }

  function dropTargetFromPoint(x: number, y: number): Target | undefined {
    const element = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-slot-key], [data-master-id]");
    if (!element) {
      return undefined;
    }
    const slotKey = element.dataset.slotKey;
    if (slotKey && slotKey in game.slots) {
      return { kind: "monster", slotKey: slotKey as SlotKey };
    }
    const masterId = element.dataset.masterId;
    if (masterId === "player" || masterId === "cpu") {
      return { kind: "master", playerId: masterId };
    }
    return undefined;
  }

  function handleDragOver(event: DragEvent<HTMLElement>) {
    if (!Array.from(event.dataTransfer.types).includes(DRAG_MIME)) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleSlotDrop(event: DragEvent<HTMLElement>, slotKey: SlotKey) {
    event.preventDefault();
    const payload = readDragPayload(event);
    if (!payload) {
      return;
    }
    handleDropAction(payload, { kind: "monster", slotKey });
  }

  function handleMasterDrop(event: DragEvent<HTMLElement>, playerId: PlayerId) {
    event.preventDefault();
    const payload = readDragPayload(event);
    if (!payload) {
      return;
    }
    handleDropAction(payload, { kind: "master", playerId });
  }

  function readDragPayload(event: DragEvent<HTMLElement>): DragPayload | undefined {
    const raw = event.dataTransfer.getData(DRAG_MIME);
    if (!raw) {
      return undefined;
    }
    try {
      const parsed = JSON.parse(raw) as Partial<DragPayload>;
      if (parsed.kind === "hand" && typeof parsed.instanceId === "string") {
        return { kind: "hand", instanceId: parsed.instanceId };
      }
      if (parsed.kind === "monster" && typeof parsed.slotKey === "string" && parsed.slotKey in game.slots) {
        return { kind: "monster", slotKey: parsed.slotKey as SlotKey };
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  function handleDropAction(payload: DragPayload, target: Target) {
    if (applyImmediateDropAction(payload, target)) {
      return;
    }

    const action = createPendingDropAction(payload, target);
    if (!action) {
      setPendingDropAction(undefined);
      setError("この移動に対応する行動がありません");
      return;
    }
    setPendingDropAction(action);
    setSelection(selectionFromPendingDropAction(action));
    setError("");
  }

  function applyImmediateDropAction(payload: DragPayload, target: Target): boolean {
    if (controlsDisabled || payload.kind !== "hand" || target.kind !== "monster") {
      return false;
    }

    const handCard = getHandCard(game, payload.instanceId);
    if (!handCard) {
      return false;
    }

    const def = getCardDef(handCard.cardId);
    if (def.type !== "monster" || !canSummonTo(game, payload.instanceId, target.slotKey)) {
      return false;
    }

    applyChange((state) => summonMonster(state, payload.instanceId, target.slotKey));
    return true;
  }

  function createPendingDropAction(payload: DragPayload, target: Target): PendingDropAction | undefined {
    if (controlsDisabled) {
      return undefined;
    }

    if (payload.kind === "hand") {
      const handCard = getHandCard(game, payload.instanceId);
      if (!handCard) {
        return undefined;
      }
      const def = getCardDef(handCard.cardId);
      if (def.type === "magic" && getMagicTargets(game, payload.instanceId).some((candidate) => targetToKey(candidate) === targetToKey(target))) {
        return { kind: "magic", handInstanceId: payload.instanceId, target };
      }
      return undefined;
    }

    const source = game.slots[payload.slotKey];
    const monster = source.monster;
    if (!monster || monster.owner !== game.currentPlayer || monster.status !== "active" || monster.actionCount >= monster.actionLimit) {
      return undefined;
    }

    if (target.kind === "monster") {
      const targetSlot = game.slots[target.slotKey];
      if (targetSlot.owner === game.currentPlayer && getMovableTargets(game, payload.slotKey).includes(target.slotKey)) {
        return { kind: "move", fromSlotKey: payload.slotKey, toSlotKey: target.slotKey };
      }
    }

    const commandIds = getCommandsTargetingTarget(game, payload.slotKey, target).map((command) => command.id);
    if (commandIds.length === 0) {
      return undefined;
    }
    return { kind: "attackTarget", attackerSlotKey: payload.slotKey, commandIds, target };
  }

  function canDragMonsterFromSlot(slotKey: SlotKey): boolean {
    const monster = game.slots[slotKey].monster;
    return (
      !controlsDisabled &&
      !!monster &&
      monster.owner === game.currentPlayer &&
      monster.status === "active" &&
      monster.actionCount < monster.actionLimit
    );
  }

  function handleConfirmPendingDropAction() {
    if (!pendingDropAction) {
      return;
    }
    if (pendingDropAction.kind === "attackTarget") {
      return;
    }
    if (pendingDropAction.kind === "magic") {
      resolveMagicPrimaryTarget(pendingDropAction.handInstanceId, pendingDropAction.target);
      return;
    }
    if (pendingDropAction.kind === "move") {
      applyChange((state) => moveMonster(state, pendingDropAction.fromSlotKey, pendingDropAction.toSlotKey));
      return;
    }
  }

  function handlePendingAttackCommand(commandId: string) {
    if (!pendingDropAction || pendingDropAction.kind !== "attackTarget") {
      return;
    }
    resolveCommandPrimaryTarget(pendingDropAction.attackerSlotKey, commandId, pendingDropAction.target);
  }

  function handleCancelPendingDropAction() {
    setPendingDropAction(undefined);
    setSelection(undefined);
    setError("");
  }

  const selectedMonster =
    selection?.kind === "monster" ? game.slots[selection.slotKey].monster : undefined;
  const selectedHand =
    selection?.kind === "hand" ? currentPlayer.hand.find((card) => card.instanceId === selection.instanceId) : undefined;
  const infoWorkspaceOpen = isInfoWorkspaceView(zoneView);

  return (
    <main className={`app-shell ${pointerDragging ? "dragging" : ""}`}>
      <header className="topbar">
        <div>
          <h1>Card Hero Prototype</h1>
          <p>Turn {game.turnNumber} / {turnStatus}</p>
          {cpuVsCpu && (
            <div className={`spectator-status ${spectatorPaused ? "paused" : ""}`}>
              <strong><Icon icon={spectatorPaused ? "⏸️" : "👁️"} /> Spectator</strong>
              <span>
                {latestSpectatorAttention
                  ? `#${latestSpectatorAttention.index + 1} ${latestSpectatorAttention.entry}`
                  : "注目イベント待ち"}
              </span>
            </div>
          )}
        </div>
        <div className="topbar-actions">
          <label className="battle-setting-control">
            Seed
            <input
              type="number"
              min={0}
              value={battleSettings.seedInput}
              onChange={(event) => handleBattleSeedChange(event.target.value)}
            />
          </label>
          <label className="battle-setting-control">
            First
            <select
              value={battleSettings.firstPlayer}
              onChange={(event) => handleBattleFirstPlayerChange(event.target.value)}
            >
              <option value="player">Player</option>
              <option value="cpu">CPU</option>
            </select>
          </label>
          <label className="battle-setting-control">
            Mode
            <select
              value={battleSettings.mode}
              onChange={(event) => handleBattleModeChange(event.target.value)}
            >
              <option value="player-vs-cpu">Player vs CPU</option>
              <option value="cpu-vs-cpu">CPU vs CPU</option>
            </select>
          </label>
          <label className="battle-setting-control">
            P AI
            <select
              value={battleSettings.aiProfiles.player}
              onChange={(event) => handleBattleAiProfileChange("player", event.target.value)}
            >
              <option value="stable">Stable</option>
              <option value="strong">Strong</option>
            </select>
          </label>
          <label className="battle-setting-control">
            C AI
            <select
              value={battleSettings.aiProfiles.cpu}
              onChange={(event) => handleBattleAiProfileChange("cpu", event.target.value)}
            >
              <option value="stable">Stable</option>
              <option value="strong">Strong</option>
            </select>
          </label>
          <label className="battle-setting-control">
            P Master
            <select
              value={battleSettings.masterIds.player}
              onChange={(event) => handleBattleMasterChange("player", event.target.value)}
            >
              {MASTER_IDS.map((masterId) => (
                <option value={masterId} key={masterId}>{getMasterName(masterId)}</option>
              ))}
            </select>
          </label>
          <label className="battle-setting-control">
            C Master
            <select
              value={battleSettings.masterIds.cpu}
              onChange={(event) => handleBattleMasterChange("cpu", event.target.value)}
            >
              {MASTER_IDS.map((masterId) => (
                <option value={masterId} key={masterId}>{getMasterName(masterId)}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => setAutoPlayEnabled((enabled) => !enabled)} disabled={cpuVsCpu}>
            <Icon icon={autoPlayEnabled ? "⏸️" : "▶️"} /> {autoPlayEnabled ? "Auto Stop" : "Auto Play"}
          </button>
          <label className="auto-delay-control">
            Wait
            <input
              type="number"
              min={AUTO_STEP_DELAY_MIN_MS}
              max={AUTO_STEP_DELAY_MAX_MS}
              step={AUTO_STEP_DELAY_STEP_MS}
              value={autoStepDelayMs}
              onChange={(event) => handleAutoDelayChange(event.target.value)}
            />
            ms
          </label>
          {cpuVsCpu && (
            <div className="auto-speed-presets" aria-label="CPU vs CPU speed presets">
              {AUTO_SPEED_PRESETS.map((preset) => (
                <button
                  type="button"
                  className={autoStepDelayMs === preset.delayMs ? "selected" : ""}
                  onClick={() => handleAutoSpeedPreset(preset.delayMs)}
                  key={preset.label}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
          {cpuVsCpu && (
            <label className="spectator-toggle">
              <input
                type="checkbox"
                checked={spectatorPauseOnAttention}
                onChange={(event) => {
                  setSpectatorPauseOnAttention(event.target.checked);
                  if (!event.target.checked) {
                    setSpectatorPaused(false);
                  }
                }}
              />
              注目停止
            </label>
          )}
          {cpuVsCpu && spectatorPaused && (
            <button type="button" onClick={() => setSpectatorPaused(false)}>
              <Icon icon="▶️" /> Resume
            </button>
          )}
          <button type="button" onClick={handleRandomSeed}>
            <Icon icon="🎲" /> Seed
          </button>
          <button
            type="button"
            className={zoneView?.kind === "deckSetup" ? "selected" : ""}
            onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "deckSetup" }))}
          >
            <Icon icon="🧩" /> Decks
          </button>
          <button type="button" onClick={handleNewGame} disabled={fixedDeckError}>
            <Icon icon="🔄" /> New Game
          </button>
        </div>
      </header>

      <section
        className={[
          "play-layout",
          zoneView ? "info-open" : "",
          zoneView?.kind === "catalog" ? "catalog-open" : "",
          infoWorkspaceOpen ? "info-workspace-open" : "",
        ].filter(Boolean).join(" ")}
      >
        <aside className="info-panel">
          <section className="info-switcher-panel">
            <div className="info-switcher-heading">
              <h2>Info</h2>
              <StatusIconCount label="Cards" icon="🃏" amount={currentPlayer.hand.length} cap={MAX_VISIBLE_RESOURCE_ICONS} />
            </div>
            <div className="info-tools" aria-label="info panels">
              <button
                type="button"
                className={isZoneView(zoneView, "player", "deck") ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "playerZone", playerId: "player", zone: "deck" }))}
              >
                <Icon icon="🂠" /> Deck {game.players.player.deck.length}
              </button>
              <button
                type="button"
                className={isZoneView(zoneView, "player", "discard") ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "playerZone", playerId: "player", zone: "discard" }))}
              >
                <Icon icon="🗂️" /> Discard {game.players.player.discard.length}
              </button>
              <button
                type="button"
                className={isZoneView(zoneView, "player", "hand") ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "playerZone", playerId: "player", zone: "hand" }))}
              >
                <Icon icon="🃏" /> Hand {game.players.player.hand.length}
              </button>
              <button
                type="button"
                className={isZoneView(zoneView, "cpu", "discard") ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "playerZone", playerId: "cpu", zone: "discard" }))}
              >
                <Icon icon="🗂️" /> CPU {game.players.cpu.discard.length}
              </button>
              <button
                type="button"
                className={zoneView?.kind === "effects" ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "effects" }))}
              >
                <Icon icon="📜" /> Effects
              </button>
              <button
                type="button"
                className={zoneView?.kind === "cpuHistory" ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "cpuHistory" }))}
              >
                <Icon icon="🧠" /> CPU AI
              </button>
              <button
                type="button"
                className={zoneView?.kind === "aiLab" ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "aiLab" }))}
              >
                <Icon icon="📈" /> AI Lab
              </button>
              <button
                type="button"
                className={zoneView?.kind === "deckSetup" ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "deckSetup" }))}
              >
                <Icon icon="🧩" /> Decks
              </button>
              <button
                type="button"
                className={zoneView?.kind === "catalog" ? "selected" : ""}
                onClick={() => setZoneView(toggleZoneView(zoneView, { kind: "catalog" }))}
              >
                <Icon icon="📚" /> Card Library
              </button>
            </div>
          </section>

          <div className="info-panel-body">
            {zoneView?.kind === "deckSetup" ? (
              <DeckSetupPanel
                battleSettings={battleSettings}
                deckSettings={deckSettings}
                drafts={deckDrafts}
                cardOptions={deckCardOptions}
                pickerIds={deckPickerIds}
                deckPresetPickerIds={deckPresetPickerIds}
                deckPresetFilters={deckPresetFilters}
                deckPresetSorts={deckPresetSorts}
                activePlayerId={deckSetupTarget}
                builtInMatchPresets={BUILT_IN_MATCH_PRESETS}
                matchPresetId={matchPresetId}
                savedBattlePresets={savedBattlePresets}
                savedPresetId={savedPresetId}
                battlePresetName={battlePresetName}
                onClose={() => setZoneView(undefined)}
                onBuiltInMatchPresetChange={handleApplyBuiltInMatchPreset}
                onSavedPresetChange={handleLoadSavedBattlePreset}
                onBattlePresetNameChange={setBattlePresetName}
                onSaveBattlePreset={handleSaveBattlePreset}
                onDeleteSavedBattlePreset={handleDeleteSavedBattlePreset}
                onFixedChange={handleDeckFixedChange}
                onAllowSpecialChange={handleDeckAllowSpecialChange}
                onTextChange={handleDeckTextChange}
                onUseGeneratedDeck={handleUseGeneratedDeckAsFixed}
                onPickerChange={handleDeckPickerChange}
                onAddCard={handleAddDeckCard}
                onRemoveCard={handleRemoveDeckCard}
                onActivePlayerChange={setDeckSetupTarget}
                onDeckPresetPickerChange={handleDeckPresetPickerChange}
                onDeckPresetFilterChange={handleDeckPresetFilterChange}
                onDeckPresetSortChange={handleDeckPresetSortChange}
              />
            ) : zoneView?.kind === "aiLab" ? (
              <AiLabPanel
                suiteId={aiLabSuiteId}
                onSuiteChange={setAiLabSuiteId}
                onClose={() => setZoneView(undefined)}
              />
            ) : zoneView ? (
              <CardZonePanel
                game={game}
                view={zoneView}
                onClose={() => setZoneView(undefined)}
              />
            ) : (
              <section className="zone-panel zone-empty-panel">
                <div className="zone-panel-heading">
                  <div>
                    <h3><Icon icon="ℹ️" /> Info Panel</h3>
                    <p>Deck、Effects、CPU、Card Libraryをここに表示します。</p>
                  </div>
                </div>
                <p className="empty-zone"><Icon icon="☝️" /> 上のボタンから確認したい情報を選択してください。</p>
              </section>
            )}
          </div>
        </aside>

        <div className="battle-area">
          <div className="battle-primary">
            <div className="board" aria-label="field">
            {BOARD_CELLS.map((row, rowIndex) => (
              <div className="board-row" key={rowIndex}>
                {row.map((cell) => {
                  if (cell.kind === "slot") {
                    return (
                      <BoardSlot
                        key={cell.slotKey}
                        slotKey={cell.slotKey}
                        game={game}
                        selected={isSelectedSourceSlot(selection, pendingDropAction, cell.slotKey)}
                        targetable={targetKeys.has(`monster:${cell.slotKey}`)}
                        targetRole={targetRoleForTarget(game, { kind: "monster", slotKey: cell.slotKey }, targetKeys, selection, pendingDropAction)}
                        effectKind={visualEffect?.slots.includes(cell.slotKey) ? visualEffect.kind : undefined}
                        effectId={visualEffect?.id}
                        damageFlash={visualEffect?.slotDamageFlashes.find((flash) => flash.slotKey === cell.slotKey)}
                        draggable={canDragMonsterFromSlot(cell.slotKey)}
                        onDragStart={(event) => handleMonsterDragStart(event, cell.slotKey)}
                        onPointerDown={(event) => handleMonsterPointerDown(event, cell.slotKey)}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleSlotDrop(event, cell.slotKey)}
                        onClick={() => handleSlotClick(cell.slotKey)}
                      />
                    );
                  }
                  if (cell.kind === "master") {
                    const damageFlash = visualEffect?.masterDamageFlashes.find((flash) => flash.playerId === cell.playerId);
                    const targetRole = targetRoleForTarget(game, { kind: "master", playerId: cell.playerId }, targetKeys, selection, pendingDropAction);
                    const masterId = game.players[cell.playerId].masterId;
                    const masterLabel = `${cell.playerId === "cpu" ? "CPU" : "Player"} ${getMasterName(masterId)}`;
                    return (
                      <button
                        key={cell.playerId}
                        type="button"
                        className={[
                          "master",
                          cell.playerId === "cpu" ? "master-cpu" : "master-player",
                          `master-${masterId}`,
                          targetKeys.has(`master:${cell.playerId}`) ? "targetable" : "",
                          targetRole ? `target-${targetRole}` : "",
                          visualEffect?.masters.includes(cell.playerId) ? `effect-active effect-${visualEffect.kind}` : "",
                          damageFlash?.defeated ? "effect-defeated" : "",
                        ].join(" ")}
                        onDragOver={handleDragOver}
                        onDrop={(event) => handleMasterDrop(event, cell.playerId)}
                        data-master-id={cell.playerId}
                        onClick={() => handleMasterClick(cell.playerId)}
                        aria-label={`${masterLabel} HP ${game.players[cell.playerId].masterHp} Stone ${game.players[cell.playerId].stones} Deck ${game.players[cell.playerId].deck.length} Hand ${game.players[cell.playerId].hand.length}`}
                      >
                        <MasterResourceDisplay
                          label={masterLabel}
                          active={game.currentPlayer === cell.playerId}
                          hp={game.players[cell.playerId].masterHp}
                          stones={game.players[cell.playerId].stones}
                          deck={game.players[cell.playerId].deck.length}
                          hand={game.players[cell.playerId].hand.length}
                        />
                        {targetRole && <span className="target-badge">{targetRoleLabel(targetRole)}</span>}
                        <DamageBubble key={visualEffect?.id} flash={damageFlash} />
                      </button>
                    );
                  }
                  return (
                    <div key={`${cell.label}_${rowIndex}`} className="blocked-cell" aria-label={cell.label}>
                      <span>{cell.label}</span>
                    </div>
                  );
                })}
              </div>
            ))}
            </div>
            <section className="hand-area">
            <div className="hand-heading">
              <h2>Hand</h2>
              <div className="hand-tools">
                <StatusIconCount label="Cards" icon="🃏" amount={currentPlayer.hand.length} cap={MAX_VISIBLE_RESOURCE_ICONS} />
              </div>
            </div>
            <div className="hand-list">
              {currentPlayer.hand.map((card) => (
                <button
                  type="button"
                  key={card.instanceId}
                  className={`hand-card ${isSelectedSourceHand(selection, pendingDropAction, card.instanceId) ? "selected" : ""}`}
                  draggable={!controlsDisabled}
                  onDragStart={(event) => handleHandDragStart(event, card.instanceId)}
                  onPointerDown={(event) => handleHandPointerDown(event, card.instanceId)}
                  onClick={() => {
                    if (consumeSuppressedClick()) {
                      return;
                    }
                    setPendingDropAction(undefined);
                    setSelection({ kind: "hand", instanceId: card.instanceId });
                    setError("");
                  }}
                  disabled={controlsDisabled}
                >
                  <HandCardContent cardId={card.cardId} />
                </button>
              ))}
            </div>
            </section>
          </div>
        </div>

        <aside className="side-panel">
          <section className="log-panel">
            <div className="log-heading">
              <h2>Log</h2>
              <span>{visibleLogEntries.length}/{game.log.length}</span>
            </div>
            <div className="log-filter-row" aria-label="log filters">
              {LOG_FILTERS.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  className={filter === logFilter ? "selected" : ""}
                  onClick={() => setLogFilter(filter)}
                >
                  <Icon icon={logFilterIcon(filter)} /> {logFilterLabel(filter)}
                </button>
              ))}
            </div>
            <ol>
              {visibleLogEntries.map(({ entry, index }) => (
                <li className={`log-entry ${logTone(entry)}`} key={`${entry}_${index}`}>
                  <button
                    type="button"
                    className={`log-entry-button ${selectedLogIndex === index ? "selected" : ""}`}
                    onClick={() => setSelectedLogIndex(selectedLogIndex === index ? undefined : index)}
                  >
                    <Icon icon={logIcon(entry)} />
                    <span className="log-entry-index">#{index + 1}</span>
                    <span className="log-entry-text">{entry}</span>
                  </button>
                </li>
              ))}
            </ol>
            {selectedLogEntry && (
              <div className={`log-detail ${logTone(selectedLogEntry)}`}>
                <strong><Icon icon={logIcon(selectedLogEntry)} /> #{selectedLogIndex! + 1} {logCategoryLabel(selectedLogEntry)}</strong>
                <p>{selectedLogEntry}</p>
              </div>
            )}
            <LatestEventSummary log={game.log} />
          </section>

          {game.winner ? (
            <section className="notice">
              <h2><Icon icon="🏆" /> {playerLabel(game.winner)} Win</h2>
              <p>
                Seed {activeBattleSettings.seed} / 先攻 {playerLabel(activeBattleSettings.firstPlayer)} /
                {activeBattleSettings.mode === "cpu-vs-cpu" ? " CPU vs CPU" : " Player vs CPU"} /
                AI {aiProfileSummary(activeBattleSettings.aiProfiles)}
              </p>
              <BattleResultSummary game={game} />
              <div className="button-stack">
                <button type="button" onClick={handleNewGame} disabled={fixedDeckError}>
                  <Icon icon="🔄" /> 同じ条件で再戦
                </button>
                <button type="button" onClick={handleRandomSeedNewGame} disabled={fixedDeckError}>
                  <Icon icon="🎲" /> Seedを変えて再戦
                </button>
                <button type="button" onClick={() => setZoneView({ kind: "deckSetup" })}>
                  <Icon icon="🧩" /> デッキ設定
                </button>
              </div>
            </section>
          ) : game.pendingLevelUp ? (
            <section className="notice">
              <h2><Icon icon="✨" /> Level Up</h2>
              <p>上げるレベル数を選択</p>
              <div className="button-row">
                {Array.from({ length: game.pendingLevelUp.maxLevels + 1 }, (_, level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => applyChange((state) => resolveLevelUp(state, level))}
                    disabled={autoPlayEnabled}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {game.pendingLevelUp.superOptions && game.pendingLevelUp.superOptions.length > 0 && (
                <>
                  <p>スーパーカードで変身</p>
                  <div className="button-row">
                    {game.pendingLevelUp.superOptions.map((option) => (
                      <button
                        key={option.handInstanceId}
                        type="button"
                        onClick={() => applyChange((state) => resolveLevelUp(state, game.pendingLevelUp!.maxLevels, option.handInstanceId))}
                        disabled={autoPlayEnabled}
                      >
                        <CardIcon cardId={option.cardId} /> {getCardName(option.cardId)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>
          ) : pendingDropAction ? (
            <section className="side-context-panel">
              <PendingDropActionPanel
                action={pendingDropAction}
                game={game}
                onAttackCommand={handlePendingAttackCommand}
                onConfirm={handleConfirmPendingDropAction}
                onCancel={handleCancelPendingDropAction}
              />
              <OperationReasonPanel game={game} selection={selection} pendingDropAction={pendingDropAction} error={error} />
            </section>
          ) : isAdditionalChoiceSelection(selection) ? (
            <section className="side-context-panel card-info-panel">
              <AdditionalChoicePanel
                selection={selection}
                game={game}
                onCancel={() => {
                  setSelection(undefined);
                  setError("");
                }}
                onSecondaryTarget={(target) => {
                  if (selection.kind === "magicSecondaryTarget") {
                    applyChange((state) =>
                      playMagic(state, {
                        handInstanceId: selection.handInstanceId,
                        target: selection.target,
                        secondaryTarget: target,
                      }),
                    );
                    return;
                  }
                  if (selection.kind === "commandSecondaryTarget") {
                    applyChange((state) =>
                      attackWithCommand(state, {
                        attackerSlotKey: selection.attackerSlotKey,
                        commandId: selection.commandId,
                        target: selection.target,
                        secondaryTarget: target,
                      }),
                    );
                  }
                }}
                onMagicHand={(instanceId) => {
                  if (selection.kind !== "magicHandChoice") {
                    return;
                  }
                  applyChange((state) =>
                    playMagic(state, {
                      handInstanceId: selection.handInstanceId,
                      target: selection.target,
                      secondaryHandInstanceId: instanceId,
                    }),
                  );
                }}
                onCommandHand={(instanceId) => {
                  if (selection.kind !== "commandHandChoice") {
                    return;
                  }
                  applyChange((state) =>
                    attackWithCommand(state, {
                      attackerSlotKey: selection.attackerSlotKey,
                      commandId: selection.commandId,
                      target: selection.target,
                      secondaryHandInstanceId: instanceId,
                    }),
                  );
                }}
                onRefreshToggle={(instanceId) => {
                  if (selection.kind !== "magicRefresh") {
                    return;
                  }
                  setSelection({
                    ...selection,
                    selectedIds: selection.selectedIds.includes(instanceId)
                      ? selection.selectedIds.filter((id) => id !== instanceId)
                      : [...selection.selectedIds, instanceId],
                  });
                }}
                onRefreshConfirm={() => {
                  if (selection.kind !== "magicRefresh") {
                    return;
                  }
                  applyChange((state) =>
                    playMagic(state, {
                      handInstanceId: selection.handInstanceId,
                      target: selection.target,
                      selectedHandInstanceIds: selection.selectedIds,
                    }),
                  );
                }}
                onSearch={(category) => {
                  if (selection.kind !== "magicSearch") {
                    return;
                  }
                  applyChange((state) =>
                    playMagic(state, {
                      handInstanceId: selection.handInstanceId,
                      target: selection.target,
                      searchCategory: category,
                    }),
                  );
                }}
              />
              <OperationReasonPanel game={game} selection={selection} pendingDropAction={pendingDropAction} error={error} />
            </section>
          ) : selectedMonster && selection?.kind === "monster" ? (
            <section className="side-context-panel card-info-panel">
              <MonsterCommands
                game={game}
                slotKey={selection.slotKey}
                onCommand={(commandId, targets) => {
                  setPendingDropAction(undefined);
                  setSelection({ kind: "command", attackerSlotKey: selection.slotKey, commandId, targets });
                }}
                onFocus={() => applyChange((state) => focusMonster(state, selection.slotKey))}
                onMove={(targets) => {
                  setPendingDropAction(undefined);
                  setSelection({ kind: "move", fromSlotKey: selection.slotKey, targets });
                }}
              />
              <OperationReasonPanel game={game} selection={selection} pendingDropAction={pendingDropAction} error={error} />
            </section>
          ) : selectedHand ? (
            <section className="side-context-panel card-info-panel">
              <HandCardPanel
                card={selectedHand}
                game={game}
                disabled={controlsDisabled}
                onDiscard={() => applyChange((state) => discardHandCard(state, selectedHand.instanceId))}
              />
              <OperationReasonPanel game={game} selection={selection} pendingDropAction={pendingDropAction} error={error} />
            </section>
          ) : (
            <section className="actions">
              <h2>Actions</h2>
              <TargetSelectionSummary selection={selection} game={game} />
              <OperationReasonPanel game={game} selection={selection} pendingDropAction={pendingDropAction} error={error} />
              <div className="button-stack">
                {getCurrentMasterActionIds(game).map((actionId) => {
                  const action = getMasterActionDef(actionId);
                  const targets = getMasterActionTargets(game, actionId);
                  return (
                    <button
                      key={actionId}
                      type="button"
                      onClick={() => {
                        setPendingDropAction(undefined);
                        setSelection({ kind: "masterAction", actionId, targets });
                        setError("");
                      }}
                      disabled={controlsDisabled || targets.length === 0}
                      title={action.summary}
                    >
                      <Icon icon={masterActionIcon(actionId)} /> {action.name} {getMasterActionCost(actionId)}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => applyChange(useMasterHpDraw)}
                  disabled={controlsDisabled || currentPlayer.deck.length === 0}
                >
                  <Icon icon="🩸" /> HP Draw
                </button>
                <button type="button" onClick={handleEndTurn} disabled={controlsDisabled}>
                  <Icon icon="⏭️" /> End Turn
                </button>
              </div>
              {selection?.kind === "command" && (
                <p className="hint">攻撃対象を選択してください。</p>
              )}
              {selection?.kind === "move" && (
                <p className="hint">移動先または入れ替え先を選択してください。</p>
              )}
              {selection?.kind === "masterAction" && (
                <p className="hint">マスター特技の対象を選択してください。</p>
              )}
            </section>
          )}
          <BattleHistoryPanel history={battleHistory} onReplay={handleReplayHistory} onClear={handleClearBattleHistory} />
        </aside>
      </section>
    </main>
  );
}

function TargetSelectionSummary({ selection, game }: { selection: Selection | undefined; game: GameState }) {
  if (selection?.kind === "command") {
    const monster = game.slots[selection.attackerSlotKey].monster;
    const command = monster ? getMonsterCommands(monster).find((candidate) => candidate.id === selection.commandId) : undefined;
    if (!command) {
      return null;
    }
    return (
      <div className="target-summary">
        <strong><Icon icon={commandIcon(command)} /> {command.name} {command.power}P</strong>
        <span>{slotMonsterLabel(game, selection.attackerSlotKey)}</span>
        <span>{commandActionSummary(command)}</span>
        <TargetChipList game={game} targets={selection.targets} />
      </div>
    );
  }

  if (selection?.kind === "move") {
    return (
      <div className="target-summary">
        <strong><Icon icon="🧭" /> Move / Swap</strong>
        <span>{slotMonsterLabel(game, selection.fromSlotKey)}</span>
        <span>自陣内の空き枠または味方と入れ替え</span>
        <TargetChipList game={game} targets={selection.targets.map((slotKey) => ({ kind: "monster", slotKey }))} />
      </div>
    );
  }

  if (selection?.kind === "masterAction") {
    return (
      <div className="target-summary">
        <strong><Icon icon={masterActionIcon(selection.actionId)} /> {masterActionLabel(selection.actionId)}</strong>
        <span>Cost {getMasterActionCost(selection.actionId)}</span>
        <TargetChipList game={game} targets={selection.targets} />
      </div>
    );
  }

  return null;
}

function TargetChipList({ game, targets }: { game: GameState; targets: Target[] }) {
  const visibleTargets = targets.slice(0, 8);
  return (
    <span className="target-chip-list">
      <span className="target-count">候補 {targets.length}</span>
      {visibleTargets.map((target) => (
        <span className="target-chip" key={targetToKey(target)}>{targetLabel(game, target)}</span>
      ))}
      {targets.length > visibleTargets.length && <span className="target-chip">+{targets.length - visibleTargets.length}</span>}
    </span>
  );
}

function LatestEventSummary({ log }: { log: string[] }) {
  const latest = log.at(-1);
  if (!latest) {
    return null;
  }
  return (
    <div className={`latest-event ${logTone(latest)}`}>
      <strong><Icon icon={logIcon(latest)} /> Latest: {logCategoryLabel(latest)}</strong>
      <p>{latest}</p>
    </div>
  );
}

interface OperationReasonPanelProps {
  game: GameState;
  selection: Selection | undefined;
  pendingDropAction: PendingDropAction | undefined;
  error: string;
}

interface OperationReasonItem {
  icon: string;
  label: string;
  text: string;
  tone?: "ok" | "warn" | "danger";
}

function OperationReasonPanel({ game, selection, pendingDropAction, error }: OperationReasonPanelProps) {
  const items = getOperationReasonItems(game, selection, pendingDropAction, error);
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="operation-reason-panel">
      <strong><Icon icon="ℹ️" /> 操作理由</strong>
      <ul>
        {items.map((item, index) => (
          <li className={item.tone ? `operation-reason-${item.tone}` : ""} key={`${item.label}_${index}`}>
            <span><Icon icon={item.icon} /> {item.label}</span>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getOperationReasonItems(
  game: GameState,
  selection: Selection | undefined,
  pendingDropAction: PendingDropAction | undefined,
  error: string,
): OperationReasonItem[] {
  const items: OperationReasonItem[] = [];
  if (error) {
    items.push({ icon: "⚠️", label: "操作不可", text: error, tone: "danger" });
  }
  if (game.pendingLevelUp) {
    items.push({ icon: "✨", label: "割り込み", text: "レベルアップ数の選択が完了するまで他の行動はできません。", tone: "warn" });
    return items;
  }
  if (game.winner) {
    items.push({ icon: "🏆", label: "勝敗決定済み", text: "再戦するか、条件を変えて新しい試合を開始してください。", tone: "ok" });
    return items;
  }
  if (pendingDropAction) {
    items.push(operationReasonFromPendingDrop(game, pendingDropAction));
    return items;
  }
  if (!selection) {
    items.push({
      icon: "☝️",
      label: "未選択",
      text: game.currentPlayer === "player"
        ? "手札、味方モンスター、またはマスター特技を選ぶと候補が盤面に表示されます。"
        : "CPUターン中です。ログのCPUフィルタかCPU履歴で判断理由を確認できます。",
    });
    return items;
  }
  if (selection.kind === "hand") {
    return [...items, ...operationReasonsForHand(game, selection.instanceId)];
  }
  if (selection.kind === "monster") {
    return [...items, ...operationReasonsForMonster(game, selection.slotKey)];
  }
  if (selection.kind === "command") {
    const monster = game.slots[selection.attackerSlotKey].monster;
    const command = monster ? getMonsterCommands(monster).find((candidate) => candidate.id === selection.commandId) : undefined;
    items.push({
      icon: command ? commandIcon(command) : "⚔️",
      label: "対象選択",
      text: command
        ? `${command.name}は${commandActionSummary(command)}。候補${selection.targets.length}件から対象を選ぶと発動します。`
        : `候補${selection.targets.length}件から対象を選んでください。`,
      tone: selection.targets.length > 0 ? "ok" : "warn",
    });
    return items;
  }
  if (selection.kind === "move") {
    items.push({
      icon: "🧭",
      label: "移動/入れ替え",
      text: `${slotMonsterLabel(game, selection.fromSlotKey)}の移動先候補は${selection.targets.length}件です。味方がいるマスは入れ替えになります。`,
      tone: selection.targets.length > 0 ? "ok" : "warn",
    });
    return items;
  }
  if (selection.kind === "masterAction") {
    items.push({
      icon: masterActionIcon(selection.actionId),
      label: "マスター特技",
      text: `${masterActionLabel(selection.actionId)}はStone ${getMasterActionCost(selection.actionId)}を消費します。候補${selection.targets.length}件から対象を選んでください。`,
      tone: selection.targets.length > 0 ? "ok" : "warn",
    });
    return items;
  }
  items.push({
    icon: "🎯",
    label: "追加選択",
    text: "この効果は追加対象または手札選択が必要です。表示された候補から選ぶと解決します。",
  });
  return items;
}

function operationReasonFromPendingDrop(game: GameState, action: PendingDropAction): OperationReasonItem {
  if (action.kind === "attackTarget") {
    const commands = getPendingAttackCommands(game, action);
    return {
      icon: "⚔️",
      label: "ドラッグ攻撃",
      text: `${targetLabel(game, action.target)}を先に指定済みです。発動する技を${commands.length}件から選んでください。`,
      tone: commands.length > 0 ? "ok" : "warn",
    };
  }
  if (action.kind === "magic") {
    return {
      icon: "✨",
      label: "ドラッグマジック",
      text: `${handCardLabel(game, action.handInstanceId)}の対象は${targetLabel(game, action.target)}です。確定すると発動します。`,
      tone: "ok",
    };
  }
  return {
    icon: "🧭",
    label: "ドラッグ移動",
    text: `${slotMonsterLabel(game, action.fromSlotKey)}を${slotLabel(action.toSlotKey)}へ移動または入れ替えます。`,
    tone: "ok",
  };
}

function operationReasonsForHand(game: GameState, instanceId: string): OperationReasonItem[] {
  const card = getHandCard(game, instanceId);
  if (!card) {
    return [{ icon: "⚠️", label: "手札なし", text: "選択した手札が見つかりません。", tone: "danger" }];
  }
  const def = getCardDef(card.cardId);
  if (game.currentPlayer !== "player") {
    return [{ icon: "🧠", label: "CPUターン中", text: "手札は確認できますが、プレイヤー操作はできません。", tone: "warn" }];
  }
  if (def.type === "monster") {
    if (getCardPool(def) === "special") {
      return [{
        icon: "★",
        label: "スーパー",
        text: "対応モンスターがレベルアップ条件を満たした時に変身できます。通常召喚はできません。",
        tone: "warn",
      }];
    }
    const summonTargets = BOARD_SLOT_KEYS.filter((slotKey) => canSummonTo(game, instanceId, slotKey));
    return [{
      icon: "🂠",
      label: "召喚候補",
      text: summonTargets.length > 0
        ? `空き枠${summonTargets.length}件に召喚できます。召喚はStone 1を消費します。`
        : "召喚できる空き枠がありません。自陣の左右前後を確認してください。",
      tone: summonTargets.length > 0 ? "ok" : "warn",
    }];
  }
  const targets = getMagicTargets(game, instanceId);
  const costReason = def.cost > game.players.player.stones
    ? `Stone不足: 必要${def.cost} / 所持${game.players.player.stones}。`
    : `Stone ${def.cost}を消費します。`;
  return [{
    icon: "✨",
    label: "マジック対象",
    text: targets.length > 0
      ? `${costReason} 対象候補は${targets.length}件です。`
      : `${costReason} 現在は対象候補がありません。`,
    tone: targets.length > 0 && def.cost <= game.players.player.stones ? "ok" : "warn",
  }];
}

function operationReasonsForMonster(game: GameState, slotKey: SlotKey): OperationReasonItem[] {
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return [{ icon: "□", label: "空きマス", text: "このマスにはカードがありません。" }];
  }
  const actionReason = getMonsterActionDisabledReason(game, slotKey);
  if (actionReason) {
    return [{ icon: "🚫", label: "行動不可", text: actionReason, tone: "warn" }];
  }

  const commands = getMonsterCommands(monster).map((command) => {
    const targets = getCommandTargets(game, slotKey, command.id);
    const reason = getCommandDisabledReason(game, slotKey, command, targets);
    return `${command.name}: ${reason ?? `対象${targets.length}件`}`;
  });
  const moveTargets = getMovableTargets(game, slotKey);
  return [{
    icon: "⚡",
    label: "行動可能",
    text: `${slotMonsterLabel(game, slotKey)}は${monster.actionLimit - monster.actionCount}回行動できます。${commands.join(" / ")} / Move ${moveTargets.length}件。`,
    tone: "ok",
  }];
}

function BattleResultSummary({ game }: { game: GameState }) {
  const deckout = game.log.some((entry) => entry.includes("山札切れ"));
  const longGame = game.turnNumber >= 25;
  return (
    <div className="battle-result-summary">
      <span><Icon icon="⏱️" /> Turn {game.turnNumber}</span>
      <span><Icon icon="🂠" /> P {game.players.player.deck.length} / C {game.players.cpu.deck.length}</span>
      <span><Icon icon="❤️" /> P {game.players.player.masterHp} / C {game.players.cpu.masterHp}</span>
      {deckout && <span className="result-warning"><Icon icon="🩸" /> 山札切れあり</span>}
      {longGame && <span className="result-warning"><Icon icon="⌛" /> 長期戦</span>}
    </div>
  );
}

function BattleHistoryPanel({
  history,
  onReplay,
  onClear,
}: {
  history: BattleHistoryEntry[];
  onReplay: (entry: BattleHistoryEntry) => void;
  onClear: () => void;
}) {
  const comparisonGroups = createHistoryComparisonGroups(history);
  return (
    <section className="battle-history-panel">
      <div className="battle-history-heading">
        <h2><Icon icon="🧾" /> Battle History</h2>
        <div className="battle-history-actions">
          <span>{history.length}/{BATTLE_HISTORY_LIMIT}</span>
          <button type="button" onClick={onClear} disabled={history.length === 0}>
            <Icon icon="🗑️" /> Clear
          </button>
        </div>
      </div>
      {history.length === 0 ? (
        <p className="empty-note">対戦終了後にseed、先攻、AI、マスター、デッキ条件がここに保存されます。</p>
      ) : (
        <>
          <BattleHistoryComparison groups={comparisonGroups} />
          <ol className="battle-history-list">
            {history.map((entry) => (
              <li className="battle-history-row" key={entry.id}>
                <div>
                  <strong>
                    <Icon icon="🏆" /> {playerLabel(entry.winner)} / Seed {entry.seed}
                  </strong>
                  <div className="battle-history-meta">
                    <span>{formatHistoryTimestamp(entry.createdAt)}</span>
                    <span>{entry.mode === "cpu-vs-cpu" ? "CPU vs CPU" : "Player vs CPU"}</span>
                    <span>先攻 {playerLabel(entry.firstPlayer)}</span>
                    <span>AI {aiProfileSummary(entry.aiProfiles)}</span>
                    <span>P {getMasterName(entry.masterIds.player)} / C {getMasterName(entry.masterIds.cpu)}</span>
                    <span>{historyDeckSummary(entry.deckSettings)}</span>
                  </div>
                  <div className="battle-result-summary">
                    <span><Icon icon="⏱️" /> Turn {entry.turns}</span>
                    <span><Icon icon="❤️" /> P {entry.playerHp} / C {entry.cpuHp}</span>
                    <span><Icon icon="🂠" /> P {entry.playerDeck} / C {entry.cpuDeck}</span>
                    {entry.deckout && <span className="result-warning"><Icon icon="🩸" /> 山札切れ</span>}
                    {entry.longGame && <span className="result-warning"><Icon icon="⌛" /> 長期戦</span>}
                  </div>
                  <BattleReplaySummaryView replay={entry.replay} />
                </div>
                <button type="button" onClick={() => onReplay(entry)}>
                  <Icon icon="🔁" /> 再現
                </button>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}

function BattleHistoryComparison({ groups }: { groups: BattleHistoryEntry[][] }) {
  if (groups.length === 0) {
    return (
      <div className="battle-history-comparison empty">
        <strong><Icon icon="📊" /> Compare</strong>
        <p>同じseedの履歴が2件以上になると、AI/マスター/デッキ差分を比較できます。</p>
      </div>
    );
  }

  return (
    <div className="battle-history-comparison">
      <strong><Icon icon="📊" /> Compare</strong>
      {groups.slice(0, 2).map((group) => (
        <div className="history-compare-group" key={group[0].seed}>
          <span className="history-compare-seed">Seed {group[0].seed}</span>
          <div className="history-compare-grid">
            {group.slice(0, 4).map((entry) => (
              <div className="history-compare-card" key={entry.id}>
                <strong>{playerLabel(entry.winner)} win</strong>
                <span>{entry.turns}T / HP {entry.playerHp}-{entry.cpuHp}</span>
                <span>{getMasterName(entry.masterIds.player)} vs {getMasterName(entry.masterIds.cpu)}</span>
                <span>{aiProfileSummary(entry.aiProfiles)}</span>
                <span>{historyDeckSummary(entry.deckSettings)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BattleReplaySummaryView({ replay }: { replay?: BattleReplaySummary }) {
  const normalizedReplay = normalizeBattleReplaySummary(replay);
  if (!normalizedReplay) {
    return <p className="empty-note">旧履歴のためリプレイ要点はありません。</p>;
  }
  const sections = [
    ["序盤", normalizedReplay.early],
    ["中盤", normalizedReplay.middle],
    ["終盤", normalizedReplay.late],
    ["決定打", normalizedReplay.decisive],
  ] as const;
  if (sections.every(([, events]) => events.length === 0) && normalizedReplay.turns.length === 0) {
    return <p className="empty-note">要点ログはありません。</p>;
  }
  return (
    <details className="battle-replay-summary">
      <summary><Icon icon="🧭" /> リプレイ要点</summary>
      {sections.map(([label, events]) => (
        <div className="battle-replay-phase" key={label}>
          <strong>{label}</strong>
          {events.length === 0 ? (
            <span className="empty-note">なし</span>
          ) : (
            <ol>
              {events.map((event) => (
                <li className={logTone(event.entry)} key={`${label}_${event.index}`}>
                  <Icon icon={logIcon(event.entry)} />
                  <span>#{event.index + 1}</span>
                  <p>{event.entry}</p>
                </li>
              ))}
            </ol>
          )}
        </div>
      ))}
      {normalizedReplay.turns.length > 0 && (
        <details className="battle-replay-turns">
          <summary><Icon icon="📜" /> ターン詳細 {normalizedReplay.turns.length}</summary>
          <div className="battle-replay-turn-list">
            {normalizedReplay.turns.map((turn) => (
              <details className="battle-replay-turn" key={`${turn.startIndex}_${turn.endIndex}`}>
                <summary>
                  <span>{turn.label}</span>
                  <small>#{turn.startIndex + 1}-{turn.endIndex + 1} / {turn.events.length}件</small>
                </summary>
                <ol>
                  {turn.events.map((event) => (
                    <li className={logTone(event.entry)} key={`${turn.startIndex}_${event.index}`}>
                      <Icon icon={logIcon(event.entry)} />
                      <span>#{event.index + 1}</span>
                      <p>{event.entry}</p>
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </details>
      )}
    </details>
  );
}

function createHistoryComparisonGroups(history: BattleHistoryEntry[]): BattleHistoryEntry[][] {
  const groups = new Map<number, BattleHistoryEntry[]>();
  for (const entry of history) {
    groups.set(entry.seed, [...(groups.get(entry.seed) ?? []), entry]);
  }
  return [...groups.values()]
    .filter((group) => group.length >= 2 && hasMeaningfulHistoryDifference(group))
    .sort((a, b) => historyTimestampValue(b[0]) - historyTimestampValue(a[0]));
}

function hasMeaningfulHistoryDifference(group: BattleHistoryEntry[]): boolean {
  const keys = new Set(
    group.map((entry) => [
      entry.winner,
      entry.firstPlayer,
      entry.mode,
      entry.masterIds.player,
      entry.masterIds.cpu,
      entry.aiProfiles.player,
      entry.aiProfiles.cpu,
      historyDeckSummary(entry.deckSettings),
    ].join("|")),
  );
  return keys.size > 1;
}

function formatHistoryTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "日時不明";
  }
  return date.toLocaleString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function historyTimestampValue(entry: BattleHistoryEntry): number {
  const timestamp = Date.parse(entry.createdAt);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

interface StatusIconCountProps {
  label: string;
  icon: string;
  amount: number;
  cap?: number;
}

function StatusIconCount({ label, icon, amount, cap }: StatusIconCountProps) {
  const visibleAmount = Math.max(0, cap ? Math.min(amount, cap) : amount);
  const extraAmount = cap && amount > cap ? amount - cap : 0;

  return (
    <span className="status-icon-count" title={`${label}: ${amount}`}>
      <span className="status-icon-label">{label}</span>
      <span className="status-icons" aria-hidden="true">
        {Array.from({ length: visibleAmount }, (_, index) => (
          <span className="status-count-icon" key={`${label}_${index}`}>{icon}</span>
        ))}
        {extraAmount ? <span className="status-overflow">+{extraAmount}</span> : null}
      </span>
    </span>
  );
}

interface MasterResourceDisplayProps {
  label: string;
  active: boolean;
  hp: number;
  stones: number;
  deck: number;
  hand: number;
}

function MasterResourceDisplay({ label, active, hp, stones, deck, hand }: MasterResourceDisplayProps) {
  return (
    <div className="master-resource-display">
      <strong className="master-name">{active ? <Icon icon="▶️" /> : null}{label}</strong>
      <ResourceIconRow label="HP" icon="❤️" amount={hp} />
      <ResourceIconRow label="Stone" icon="🪨" amount={stones} cap={MAX_VISIBLE_RESOURCE_ICONS} />
      <ResourceNumberRow label="Deck" icon="🂠" amount={deck} />
      <ResourceIconRow label="Hand" icon="🃏" amount={hand} cap={MAX_VISIBLE_RESOURCE_ICONS} />
    </div>
  );
}

interface ResourceNumberRowProps {
  label: string;
  icon: string;
  amount: number;
}

function ResourceNumberRow({ label, icon, amount }: ResourceNumberRowProps) {
  return (
    <div className="resource-row resource-number-row" title={`${label}: ${amount}`}>
      <span className="resource-label">{label}</span>
      <span className="resource-number"><Icon icon={icon} />{amount}</span>
    </div>
  );
}

interface ResourceIconRowProps {
  label: string;
  icon: string;
  amount: number;
  cap?: number;
}

function ResourceIconRow({ label, icon, amount, cap }: ResourceIconRowProps) {
  const visibleAmount = Math.max(0, cap ? Math.min(amount, cap) : amount);
  const extraAmount = cap && amount > cap ? amount - cap : 0;

  return (
    <div className="resource-row" title={`${label}: ${amount}`}>
      <span className="resource-label">{label}</span>
      <span className="resource-icons" aria-hidden="true">
        {Array.from({ length: visibleAmount }, (_, index) => (
          <span className="resource-icon" key={`${label}_${index}`}>{icon}</span>
        ))}
        {extraAmount ? <span className="resource-overflow">+{extraAmount}</span> : null}
      </span>
    </div>
  );
}

interface PendingDropActionPanelProps {
  action: PendingDropAction;
  game: GameState;
  onAttackCommand: (commandId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function PendingDropActionPanel({ action, game, onAttackCommand, onConfirm, onCancel }: PendingDropActionPanelProps) {
  const attackCommands = action.kind === "attackTarget" ? getPendingAttackCommands(game, action) : [];

  return (
    <div className="pending-action">
      <h3><Icon icon={pendingDropActionIcon(action)} /> 選択中: {pendingDropActionTitle(action)}</h3>
      <p>{pendingDropActionDescription(action, game)}</p>
      {action.kind === "attackTarget" ? (
        <div className="button-stack">
          {attackCommands.map((command, index) => (
            <button type="button" key={`${command.id}_${index}`} onClick={() => onAttackCommand(command.id)}>
              <Icon icon={commandIcon(command)} /> {command.name} {command.power}P
            </button>
          ))}
          <button type="button" onClick={onCancel}>
            <Icon icon="✕" /> キャンセル
          </button>
        </div>
      ) : (
        <div className="button-row">
          <button type="button" onClick={onConfirm}>
            <Icon icon="✅" /> 確定
          </button>
          <button type="button" onClick={onCancel}>
            <Icon icon="✕" /> キャンセル
          </button>
        </div>
      )}
    </div>
  );
}

type AdditionalChoiceSelection = Extract<
  Selection,
  | { kind: "commandSecondaryTarget" }
  | { kind: "commandHandChoice" }
  | { kind: "magicSecondaryTarget" }
  | { kind: "magicHandChoice" }
  | { kind: "magicRefresh" }
  | { kind: "magicSearch" }
>;

function isAdditionalChoiceSelection(selection: Selection | undefined): selection is AdditionalChoiceSelection {
  return (
    selection?.kind === "commandSecondaryTarget" ||
    selection?.kind === "commandHandChoice" ||
    selection?.kind === "magicSecondaryTarget" ||
    selection?.kind === "magicHandChoice" ||
    selection?.kind === "magicRefresh" ||
    selection?.kind === "magicSearch"
  );
}

interface AdditionalChoicePanelProps {
  selection: AdditionalChoiceSelection;
  game: GameState;
  onCancel: () => void;
  onSecondaryTarget: (target: Target) => void;
  onMagicHand: (instanceId: string) => void;
  onCommandHand: (instanceId: string) => void;
  onRefreshToggle: (instanceId: string) => void;
  onRefreshConfirm: () => void;
  onSearch: (category: NonNullable<MagicAction["searchCategory"]>) => void;
}

function AdditionalChoicePanel({
  selection,
  game,
  onCancel,
  onSecondaryTarget,
  onMagicHand,
  onCommandHand,
  onRefreshToggle,
  onRefreshConfirm,
  onSearch,
}: AdditionalChoicePanelProps) {
  if (selection.kind === "magicSecondaryTarget" || selection.kind === "commandSecondaryTarget") {
    return (
      <div className="selected-detail">
        <h3><Icon icon="🎯" /> 追加対象を選択</h3>
        <p className="hint">候補マスをクリックして確定します。</p>
        <div className="card-meta-row">
          <span>第一対象: {targetLabel(game, selection.target)}</span>
          <span>候補 {selection.targets.length}</span>
        </div>
        <div className="button-stack">
          {selection.targets.map((target) => (
            <button type="button" key={targetToKey(target)} onClick={() => onSecondaryTarget(target)}>
              <Icon icon="🎯" /> {targetLabel(game, target)}
            </button>
          ))}
          <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
        </div>
      </div>
    );
  }

  if (selection.kind === "magicHandChoice") {
    return (
      <div className="selected-detail">
        <h3><Icon icon="🃏" /> 入れ替える手札</h3>
        <p className="hint">{targetLabel(game, selection.target)} と入れ替えるカードを選びます。</p>
        <div className="button-stack">
          {selection.choices.map((card) => (
            <button type="button" key={card.instanceId} onClick={() => onMagicHand(card.instanceId)}>
              <CardIcon cardId={card.cardId} /> {getCardName(card.cardId)}
            </button>
          ))}
          <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
        </div>
      </div>
    );
  }

  if (selection.kind === "commandHandChoice") {
    return (
      <div className="selected-detail">
        <h3><Icon icon="🃏" /> ソウルスイッチ</h3>
        <p className="hint">入れ替える手札のモンスターを選びます。</p>
        <div className="button-stack">
          {selection.choices.map((card) => (
            <button type="button" key={card.instanceId} onClick={() => onCommandHand(card.instanceId)}>
              <CardIcon cardId={card.cardId} /> {getCardName(card.cardId)}
            </button>
          ))}
          <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
        </div>
      </div>
    );
  }

  if (selection.kind === "magicRefresh") {
    return (
      <div className="selected-detail">
        <h3><Icon icon="🔁" /> リフレッシュ</h3>
        <p className="hint">捨てるカードを選び、同じ枚数を引きます。</p>
        <div className="button-stack">
          {selection.choices.map((card) => (
            <button
              type="button"
              key={card.instanceId}
              className={selection.selectedIds.includes(card.instanceId) ? "selected" : ""}
              onClick={() => onRefreshToggle(card.instanceId)}
            >
              <span>{selection.selectedIds.includes(card.instanceId) ? "☑" : "☐"}</span>
              <CardIcon cardId={card.cardId} /> {getCardName(card.cardId)}
            </button>
          ))}
          <button type="button" onClick={onRefreshConfirm}><Icon icon="✅" /> 確定</button>
          <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
        </div>
      </div>
    );
  }

  return (
    <div className="selected-detail">
      <h3><Icon icon="🔎" /> カードサーチ</h3>
      <p className="hint">山札から手札に入れる種類を選びます。</p>
      <div className="button-row">
        {selection.categories.map((category) => (
          <button type="button" key={category} onClick={() => onSearch(category)}>
            {category === "front" ? "🛡️ 前衛" : category === "back" ? "🏹 後衛" : category === "special" ? "★ スーパー" : "✨ 魔法"}
          </button>
        ))}
        <button type="button" onClick={onCancel}><Icon icon="✕" /> キャンセル</button>
      </div>
    </div>
  );
}

interface HandCardPanelProps {
  card: CardInstance;
  game: GameState;
  disabled: boolean;
  onDiscard: () => void;
}

function HandCardPanel({ card, game, disabled, onDiscard }: HandCardPanelProps) {
  const def = getCardDef(card.cardId);
  const actionHint = def.type === "monster"
    ? getCardPool(def) === "special"
      ? "スーパー化条件を満たしたレベルアップ時に使用"
      : `召喚可能 ${BOARD_SLOT_KEYS.filter((slotKey) => canSummonTo(game, card.instanceId, slotKey)).length}枠`
    : `対象 ${getMagicTargets(game, card.instanceId).length}`;

  return (
    <div className="selected-detail">
      <CardDetail cardId={card.cardId} game={game} />
      <div className="hand-action-panel">
        <span className="hint"><Icon icon={def.type === "monster" ? "🂠" : "🎯"} /> {actionHint}</span>
        <button type="button" className="danger-button" onClick={onDiscard} disabled={disabled}>
          <Icon icon="🗑️" /> 手札から捨てる
        </button>
      </div>
    </div>
  );
}

interface CardZonePanelProps {
  game: GameState;
  view: Exclude<ZoneView, { kind: "deckSetup" } | { kind: "aiLab" }>;
  onClose: () => void;
}

function AiLabPanel({
  suiteId,
  onSuiteChange,
  onClose,
}: {
  suiteId: DeckBattleScoreSnapshotSuiteId;
  onSuiteChange: (suiteId: DeckBattleScoreSnapshotSuiteId) => void;
  onClose: () => void;
}) {
  const suite = getDeckBattleScoreSuite(suiteId);
  const summary = suite.summary;
  return (
    <section className="zone-panel ai-lab-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon="📈" /> AI Lab</h3>
          <p>投稿デッキの実戦スコアから、AI改善で見るべきデッキと問題試合を整理します。</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      <div className="ai-lab-toolbar">
        <label className="preset-control">
          Suite
          <select
            value={summary.suiteId}
            onChange={(event) => onSuiteChange(event.target.value as DeckBattleScoreSnapshotSuiteId)}
          >
            {DECK_BATTLE_SCORE_SNAPSHOT_SUITES.map((candidate) => (
              <option value={candidate.summary.suiteId} key={candidate.summary.suiteId}>
                {candidate.summary.suiteId} / {candidate.summary.decks} decks / {candidate.summary.games} games
              </option>
            ))}
          </select>
        </label>
        <div className="ai-lab-summary">
          <MetricPill label="Decks" value={String(summary.decks)} />
          <MetricPill label="Games" value={String(summary.games)} />
          <MetricPill label="Avg steps" value={summary.averageSteps.toFixed(1)} />
          <MetricPill label="Issues" value={`${summary.failures}/${summary.warnings}`} />
        </div>
      </div>
      <section className="ai-lab-focus">
        <h4>Recommended Focus</h4>
        {suite.recommendedFocus.length > 0 ? (
          <ul>
            {suite.recommendedFocus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>問題候補はまだありません。</p>
        )}
      </section>
      <section className="ai-lab-focus">
        <h4>Problem Focus</h4>
        {suite.problemFocuses.length > 0 ? (
          <div className="ai-lab-focus-grid">
            {suite.problemFocuses.slice(0, 6).map((focus) => (
              <div className="ai-lab-focus-card" key={focus.id}>
                <strong>{focus.title}</strong>
                <span>{focus.count}件 / weight {focus.reviewWeight.toFixed(1)}</span>
                <p>{focus.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>分類済みの問題試合はまだありません。</p>
        )}
      </section>
      <div className="ai-lab-category-grid">
        {suite.categories.map((category) => (
          <section className="ai-lab-category" key={category.id}>
            <div>
              <h4>{category.title}</h4>
              <p>{category.description}</p>
            </div>
            <ol>
              {category.decks.slice(0, 5).map((deck) => (
                <li key={deck.deckPreset}>
                  <span className="ai-lab-deck-rank">#{deck.rank}</span>
                  <span className="ai-lab-deck-name">{deck.deckPreset}</span>
                  <span className="ai-lab-deck-score">
                    B{deck.battleScore.toFixed(1)} / W{formatPercent(deck.winRate)} / S{deck.stabilityScore.toFixed(1)}
                  </span>
                  <span className="ai-lab-deck-matchups">
                    黒vs黒 {formatMatchupRate(deck.matchups.black_vs_black)} / 白vs白 {formatMatchupRate(deck.matchups.white_vs_white)} /
                    白vs黒 {formatMatchupRate(deck.matchups.white_vs_black)}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <section className="ai-lab-problems">
        <h4>Problem Games</h4>
        <div className="ai-lab-problem-list">
          {suite.problemGames.slice(0, 10).map((problem) => (
            <div
              className={`ai-lab-problem ${problem.kind}`}
              key={`${problem.kind}-${problem.seed}-${problem.playerDeckPreset}-${problem.cpuDeckPreset}-${problem.steps}`}
            >
              <strong>{problem.kind}</strong>
              <span>seed {problem.seed} / {problem.steps} steps / {problem.turns} turns</span>
              <p>{problem.playerDeckPreset} vs {problem.cpuDeckPreset}</p>
              {(problem.focusLabels?.length ?? 0) > 0 && (
                <div className="ai-lab-problem-tags">
                  {problem.focusLabels?.map((label) => (
                    <b key={label}>{label}</b>
                  ))}
                </div>
              )}
              <small>{problem.reason}</small>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

interface DeckSetupPanelProps {
  battleSettings: BattleSettings;
  deckSettings: DeckSettings;
  drafts: Record<PlayerId, DeckDraft>;
  cardOptions: Record<PlayerId, DeckCardOption[]>;
  pickerIds: Record<PlayerId, string>;
  deckPresetPickerIds: Record<PlayerId, DeckPresetId>;
  deckPresetFilters: Record<PlayerId, DeckPresetFilters>;
  deckPresetSorts: Record<PlayerId, DeckPresetSortKey>;
  activePlayerId: PlayerId;
  builtInMatchPresets: BuiltInMatchPreset[];
  matchPresetId: string;
  savedBattlePresets: SavedBattlePreset[];
  savedPresetId: string;
  battlePresetName: string;
  onClose: () => void;
  onBuiltInMatchPresetChange: (presetId: string) => void;
  onSavedPresetChange: (presetId: string) => void;
  onBattlePresetNameChange: (name: string) => void;
  onSaveBattlePreset: () => void;
  onDeleteSavedBattlePreset: (presetId: string) => void;
  onFixedChange: (playerId: PlayerId, fixed: boolean) => void;
  onAllowSpecialChange: (playerId: PlayerId, allowSpecial: boolean) => void;
  onTextChange: (playerId: PlayerId, text: string) => void;
  onUseGeneratedDeck: (playerId: PlayerId) => void;
  onPickerChange: (playerId: PlayerId, cardId: string) => void;
  onAddCard: (playerId: PlayerId, cardId: string) => void;
  onRemoveCard: (playerId: PlayerId, cardId: string) => void;
  onActivePlayerChange: (playerId: PlayerId) => void;
  onDeckPresetPickerChange: (playerId: PlayerId, presetId: DeckPresetId) => void;
  onDeckPresetFilterChange: (playerId: PlayerId, filters: DeckPresetFilters) => void;
  onDeckPresetSortChange: (playerId: PlayerId, sortKey: DeckPresetSortKey) => void;
}

function DeckSetupPanel({
  battleSettings,
  deckSettings,
  drafts,
  cardOptions,
  pickerIds,
  deckPresetPickerIds,
  deckPresetFilters,
  deckPresetSorts,
  activePlayerId,
  builtInMatchPresets,
  matchPresetId,
  savedBattlePresets,
  savedPresetId,
  battlePresetName,
  onClose,
  onBuiltInMatchPresetChange,
  onSavedPresetChange,
  onBattlePresetNameChange,
  onSaveBattlePreset,
  onDeleteSavedBattlePreset,
  onFixedChange,
  onAllowSpecialChange,
  onTextChange,
  onUseGeneratedDeck,
  onPickerChange,
  onAddCard,
  onRemoveCard,
  onActivePlayerChange,
  onDeckPresetPickerChange,
  onDeckPresetFilterChange,
  onDeckPresetSortChange,
}: DeckSetupPanelProps) {
  const playerId = activePlayerId;
  const draft = drafts[playerId];
  const summary = draft.summary;
  const fixed = deckSettings.fixed[playerId];

  return (
    <section className="zone-panel deck-setup-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon="🧩" /> Deck Setup</h3>
          <p>固定デッキは30枚・同名3枚まで。ランダム生成は前衛/後衛/魔法の最低構成を確保します。</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      <MatchPresetPanel
        builtInMatchPresets={builtInMatchPresets}
        matchPresetId={matchPresetId}
        savedBattlePresets={savedBattlePresets}
        savedPresetId={savedPresetId}
        battlePresetName={battlePresetName}
        onBuiltInMatchPresetChange={onBuiltInMatchPresetChange}
        onSavedPresetChange={onSavedPresetChange}
        onBattlePresetNameChange={onBattlePresetNameChange}
        onSaveBattlePreset={onSaveBattlePreset}
        onDeleteSavedBattlePreset={onDeleteSavedBattlePreset}
      />
      <div className="deck-setup-target-tabs" aria-label="deck setup target">
        {PLAYER_IDS.map((targetPlayerId) => (
          <button
            type="button"
            className={targetPlayerId === activePlayerId ? "selected" : ""}
            aria-pressed={targetPlayerId === activePlayerId}
            onClick={() => onActivePlayerChange(targetPlayerId)}
            key={targetPlayerId}
          >
            {playerLabel(targetPlayerId)}
          </button>
        ))}
      </div>
      <div className="deck-setup-grid single">
        <section className={`deck-editor-card ${summary.valid ? "" : "invalid"}`} key={playerId}>
          <div className="deck-editor-heading">
            <div>
              <h4>{playerLabel(playerId)} Deck</h4>
              <p>
                {fixed ? "固定デッキ" : `${getMasterName(battleSettings.masterIds[playerId])}評価ランダム / seed ${battleSettings.seed}`} /
                Special {deckSettings.allowSpecial[playerId] ? "ON" : "OFF"}
              </p>
            </div>
            <div className="deck-toggle-group">
              <label className="deck-mode-toggle">
                <input
                  type="checkbox"
                  checked={fixed}
                  onChange={(event) => onFixedChange(playerId, event.target.checked)}
                />
                固定
              </label>
              <label className="deck-mode-toggle">
                <input
                  type="checkbox"
                  checked={deckSettings.allowSpecial[playerId]}
                  onChange={(event) => onAllowSpecialChange(playerId, event.target.checked)}
                />
                Special
              </label>
            </div>
          </div>
          <DeckSummaryView summary={summary} />
          <DeckPresetControls
            presetId={deckPresetPickerIds[playerId]}
            filters={deckPresetFilters[playerId]}
            sortKey={deckPresetSorts[playerId]}
            onFilterChange={(filters) => onDeckPresetFilterChange(playerId, filters)}
            onSortChange={(sortKey) => onDeckPresetSortChange(playerId, sortKey)}
            onPresetChange={(presetId) => onDeckPresetPickerChange(playerId, presetId)}
          />
          <div className="deck-editor-actions">
            <button type="button" onClick={() => onUseGeneratedDeck(playerId)}>
              <Icon icon="📌" /> 現在seedの内容を固定
            </button>
            {fixed && (
              <button type="button" onClick={() => onFixedChange(playerId, false)}>
                <Icon icon="🎲" /> ランダムに戻す
              </button>
            )}
          </div>
          {fixed ? (
            <>
              <DeckBuilderControls
                cardOptions={cardOptions[playerId]}
                selectedCardId={pickerIds[playerId]}
                disabled={summary.total >= 30 || draft.cardIds.filter((cardId) => cardId === pickerIds[playerId]).length >= 3}
                onSelect={(cardId) => onPickerChange(playerId, cardId)}
                onAdd={() => onAddCard(playerId, pickerIds[playerId])}
              />
              <DeckCardList
                cardIds={draft.cardIds}
                editable
                onAddCard={(cardId) => onAddCard(playerId, cardId)}
                onRemoveCard={(cardId) => onRemoveCard(playerId, cardId)}
              />
              <details className="deck-raw-editor">
                <summary><Icon icon="✎" /> テキストで直接編集</summary>
                <textarea
                  className="deck-editor-textarea"
                  value={deckSettings.text[playerId]}
                  onChange={(event) => onTextChange(playerId, event.target.value)}
                  spellCheck={false}
                />
              </details>
            </>
          ) : (
            <DeckCardList cardIds={draft.cardIds} />
          )}
          {!summary.valid && (
            <ul className="deck-errors">
              {summary.errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}

function MatchPresetPanel({
  builtInMatchPresets,
  matchPresetId,
  savedBattlePresets,
  savedPresetId,
  battlePresetName,
  onBuiltInMatchPresetChange,
  onSavedPresetChange,
  onBattlePresetNameChange,
  onSaveBattlePreset,
  onDeleteSavedBattlePreset,
}: {
  builtInMatchPresets: BuiltInMatchPreset[];
  matchPresetId: string;
  savedBattlePresets: SavedBattlePreset[];
  savedPresetId: string;
  battlePresetName: string;
  onBuiltInMatchPresetChange: (presetId: string) => void;
  onSavedPresetChange: (presetId: string) => void;
  onBattlePresetNameChange: (name: string) => void;
  onSaveBattlePreset: () => void;
  onDeleteSavedBattlePreset: (presetId: string) => void;
}) {
  const selectedBuiltIn = builtInMatchPresets.find((preset) => preset.id === matchPresetId) ?? builtInMatchPresets[0];
  const selectedSaved = savedBattlePresets.find((preset) => preset.id === savedPresetId);

  return (
    <section className="match-preset-panel">
      <div>
        <h4><Icon icon="🎛️" /> Battle Presets</h4>
        <p>対戦条件、マスター、AI、デッキ条件をまとめて再現できます。</p>
      </div>
      <div className="preset-control-grid">
        <label className="preset-control">
          Built-in
          <select
            value={selectedBuiltIn?.id ?? ""}
            onChange={(event) => onBuiltInMatchPresetChange(event.target.value)}
          >
            {builtInMatchPresets.map((preset) => (
              <option value={preset.id} key={preset.id}>{preset.name}</option>
            ))}
          </select>
        </label>
        <span className="preset-description">{selectedBuiltIn?.description}</span>
      </div>
      <div className="preset-control-grid">
        <label className="preset-control">
          Save name
          <input
            type="text"
            value={battlePresetName}
            onChange={(event) => onBattlePresetNameChange(event.target.value)}
          />
        </label>
        <button type="button" onClick={onSaveBattlePreset}>
          <Icon icon="💾" /> 保存
        </button>
        <label className="preset-control">
          Saved
          <select
            value={savedPresetId}
            onChange={(event) => onSavedPresetChange(event.target.value)}
            disabled={savedBattlePresets.length === 0}
          >
            <option value="">保存なし</option>
            {savedBattlePresets.map((preset) => (
              <option value={preset.id} key={preset.id}>{preset.name}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => savedPresetId && onDeleteSavedBattlePreset(savedPresetId)} disabled={!selectedSaved}>
          <Icon icon="🗑️" /> 削除
        </button>
      </div>
    </section>
  );
}

function DeckPresetControls({
  presetId,
  filters,
  sortKey,
  onFilterChange,
  onSortChange,
  onPresetChange,
}: {
  presetId: DeckPresetId;
  filters: DeckPresetFilters;
  sortKey: DeckPresetSortKey;
  onFilterChange: (filters: DeckPresetFilters) => void;
  onSortChange: (sortKey: DeckPresetSortKey) => void;
  onPresetChange: (presetId: DeckPresetId) => void;
}) {
  const [visiblePresetCount, setVisiblePresetCount] = useState(DECK_PRESET_VISIBLE_CHUNK);
  const selectedCardIds = filters.cardIds;
  const selectedCardSet = new Set(selectedCardIds);
  const cardFilterKey = selectedCardIds.join("|");
  const preset = DECK_PRESETS.find((candidate) => candidate.id === presetId) ?? DECK_PRESETS[0];
  const filteredPresets = sortDeckPresetCandidates(filterDeckPresets(filters), sortKey);
  const visiblePresets = filteredPresets.slice(0, visiblePresetCount);
  const hasMorePresets = visiblePresetCount < filteredPresets.length;
  const selectedIsVisible = filteredPresets.some((candidate) => candidate.id === preset.id);
  const selectedScore = getDeckBattleScoreSnapshot(preset.id);

  useEffect(() => {
    setVisiblePresetCount(DECK_PRESET_VISIBLE_CHUNK);
  }, [filters.master, filters.rare8, cardFilterKey, sortKey]);

  return (
    <div className="deck-preset-controls">
      <div className="deck-preset-filter-row">
        <div className="deck-preset-filter-group" aria-label="マスターでプリセットを絞り込み">
          <span className="deck-preset-filter-label">Master</span>
          {DECK_PRESET_MASTER_FILTER_OPTIONS.map((option) => (
            <button
              type="button"
              className={filters.master === option.value ? "selected" : ""}
              aria-pressed={filters.master === option.value}
              onClick={() => onFilterChange({ ...filters, master: option.value })}
              key={option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="deck-preset-filter-group" aria-label="8ありなしでプリセットを絞り込み">
          <span className="deck-preset-filter-label">Pro</span>
          {DECK_PRESET_RARE8_FILTER_OPTIONS.map((option) => (
            <button
              type="button"
              className={filters.rare8 === option.value ? "selected" : ""}
              aria-pressed={filters.rare8 === option.value}
              onClick={() => onFilterChange({ ...filters, rare8: option.value })}
              key={option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="deck-preset-filter-row">
        <div className="deck-preset-filter-group" aria-label="実戦スコアでプリセットを並び替え">
          <span className="deck-preset-filter-label">ソート</span>
          {DECK_PRESET_SORT_OPTIONS.map((option) => (
            <button
              type="button"
              className={sortKey === option.value ? "selected" : ""}
              aria-pressed={sortKey === option.value}
              onClick={() => onSortChange(option.value)}
              key={option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="deck-card-filter-panel">
        <div className="deck-card-filter-heading">
          <span className="deck-preset-filter-label">使用カード</span>
          <span>{selectedCardIds.length > 0 ? `${selectedCardIds.length}枚ON / OR` : "指定なし"}</span>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, cardIds: [] })}
            disabled={selectedCardIds.length === 0}
          >
            クリア
          </button>
        </div>
        <div className="deck-card-filter-grid" aria-label="使用カードでプリセットを絞り込み">
          {DECK_PRESET_CARD_FILTER_OPTIONS.map((card) => {
            const selected = selectedCardSet.has(card.id);
            return (
              <button
                type="button"
                className={`deck-card-filter-button ${deckMatrixCellKind(card.id)} ${selected ? "selected" : ""}`}
                aria-pressed={selected}
                title={card.name}
                onClick={() => onFilterChange({ ...filters, cardIds: toggleDeckPresetFilterCard(selectedCardIds, card.id) })}
                key={card.id}
              >
                <CardIcon cardId={card.id} />
                <span>{card.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="deck-preset-browser" role="listbox" aria-label="deck preset candidates">
        <div className="deck-preset-browser-heading">
          <strong>Candidates</strong>
          <span>{Math.min(visiblePresetCount, filteredPresets.length)} / {filteredPresets.length}</span>
        </div>
        {filteredPresets.length === 0 ? (
          <span className="deck-preset-empty">フィルタ対象なし</span>
        ) : (
          <div className="deck-preset-row-list">
            {visiblePresets.map((candidate) => (
              <DeckPresetRow
                preset={candidate}
                selected={candidate.id === preset.id}
                onSelect={() => onPresetChange(candidate.id)}
                key={candidate.id}
              />
            ))}
            {hasMorePresets && (
              <button
                type="button"
                className="deck-preset-more"
                onClick={() => setVisiblePresetCount((count) => count + DECK_PRESET_VISIBLE_CHUNK)}
              >
                ＋ {Math.min(DECK_PRESET_VISIBLE_CHUNK, filteredPresets.length - visiblePresetCount)}
              </button>
            )}
          </div>
        )}
      </div>
      <span className="deck-preset-selected-note">
        {selectedIsVisible
          ? `${formatDeckPresetIdentity(preset)} / ${preset.description}`
          : `現在: ${formatDeckPresetIdentity(preset)} / ${preset.name}（フィルタ外）`}
      </span>
      <DeckMatrixPreview preset={preset} />
      <DeckBattleScoreStrip score={selectedScore} />
    </div>
  );
}

function DeckPresetRow({
  preset,
  selected,
  onSelect,
}: {
  preset: DeckPresetDef;
  selected: boolean;
  onSelect: () => void;
}) {
  const score = getDeckBattleScoreSnapshot(preset.id);
  return (
    <button
      type="button"
      className={`deck-preset-row ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <div className="deck-preset-row-head">
        <div className="deck-preset-row-main">
          <strong>{score ? `#${score.rank} ${formatDeckPresetIdentity(preset)}` : formatDeckPresetIdentity(preset)}</strong>
          <span>{formatDeckPresetMeta(preset)}</span>
        </div>
        <div className="deck-preset-row-score">
          {score ? (
            <>
              <DeckPresetScoreBar label="B" value={score.battleScore.toFixed(1)} barValue={score.battleScore / 100} tone="battle" />
              <DeckPresetScoreBar label="W" value={formatPercent(score.winRate)} barValue={score.winRate} tone="win" />
              <DeckPresetScoreBar
                label="対黒 "
                value={formatDeckOpponentRate(preset, score, "black")}
                barValue={deckOpponentRateBarValue(preset, score, "black")}
                tone="vs-black"
              />
              <DeckPresetScoreBar
                label="対白 "
                value={formatDeckOpponentRate(preset, score, "white")}
                barValue={deckOpponentRateBarValue(preset, score, "white")}
                tone="vs-white"
              />
            </>
          ) : (
            <span>未計測</span>
          )}
        </div>
      </div>
      <DeckIconMatrix cardIds={preset.cardIds} compact />
    </button>
  );
}

function DeckPresetScoreBar({
  label,
  value,
  barValue,
  tone,
}: {
  label: string;
  value: string;
  barValue: number | undefined;
  tone: "battle" | "win" | "vs-black" | "vs-white";
}) {
  const normalizedValue = typeof barValue === "number" && Number.isFinite(barValue) ? clampNumber(barValue, 0, 1) : 0;
  const barPercent = `${Math.round(normalizedValue * 1000) / 10}%`;
  const style = { "--score-bar-width": barPercent } as CSSProperties;

  return (
    <span className={`deck-preset-score-pill ${tone}`} style={style}>
      <span className="deck-preset-score-fill" aria-hidden="true" />
      <span className="deck-preset-score-text">{label}{value}</span>
    </span>
  );
}

function DeckMatrixPreview({ preset }: { preset: DeckPresetDef }) {
  return (
    <div className="deck-matrix-preview">
      <div className="deck-matrix-heading">
        <strong>{preset.name}</strong>
        <span>{preset.cardIds.length}枚 / {formatDeckPresetMeta(preset)}</span>
      </div>
      <DeckIconMatrix cardIds={preset.cardIds} />
    </div>
  );
}

function DeckIconMatrix({ cardIds, compact = false }: { cardIds: readonly string[]; compact?: boolean }) {
  const cells = toDeckMatrixCells(cardIds);
  const counts = deckMatrixKindCounts(cells);

  return (
    <div className={`deck-icon-matrix-wrap ${compact ? "compact" : ""}`} aria-label="deck card icons">
      <div className="deck-icon-kind-legend" aria-hidden="true">
        {DECK_MATRIX_KIND_ORDER.map((kind) => (
          <span className={kind} key={kind}>{deckMatrixKindLabel(kind)} {counts[kind]}</span>
        ))}
      </div>
      <div className={`deck-icon-matrix ${compact ? "compact" : ""}`}>
        {cells.map(({ cardId, kind }, index) => {
          const def = getCardDef(cardId);
          return (
            <span
              className={`deck-icon-cell ${kind}`}
              title={`${def.name} / ${cardTypeLabel(cardId)}`}
              aria-label={`${index + 1}. ${def.name}`}
              key={`${cardId}-${index}`}
            >
              <CardIcon cardId={cardId} />
            </span>
          );
        })}
      </div>
    </div>
  );
}

function DeckBattleScoreStrip({ score }: { score: DeckBattleScoreSnapshot | undefined }) {
  const suite = getDeckBattleScoreSuite();
  if (!score) {
    return (
      <div className="deck-score-strip empty">
        <div className="deck-score-strip-heading">
          <strong>実戦スコア未計測</strong>
          <span>投稿デッキ{suite.summary.suiteId}対象のみ表示</span>
        </div>
      </div>
    );
  }

  return (
    <div className="deck-score-strip">
      <div className="deck-score-strip-heading">
        <strong>実戦スコア #{score.rank}</strong>
        <span>
          {suite.summary.suiteId} / seed {suite.summary.seedStart} / {score.games} games / issues {score.failures}/{score.warnings}
        </span>
      </div>
      <div className="deck-score-main">
        <MetricPill label="Battle" value={score.battleScore.toFixed(1)} strong />
        <MetricPill label="Win" value={formatPercent(score.winRate)} />
        <MetricPill label="Stable" value={score.stabilityScore.toFixed(1)} />
        <MetricPill label="Speed" value={score.speedScore.toFixed(1)} />
      </div>
      <div className="deck-score-detail">
        <span>W-L-D {score.wins}-{score.losses}-{score.draws}</span>
        <span>Win point {formatPercent(score.winPointRate)}</span>
        <span>Seat P/C {formatPercent(score.playerSideWinPointRate)} / {formatPercent(score.cpuSideWinPointRate)}</span>
        <span>Avg {score.averageSteps.toFixed(1)} steps / {score.averageTurns.toFixed(1)} turns</span>
      </div>
      <div className="deck-matchup-row" aria-label="matchup win rates">
        <MetricPill label="黒vs黒" value={formatMatchupRate(score.matchups.black_vs_black)} />
        <MetricPill label="白vs白" value={formatMatchupRate(score.matchups.white_vs_white)} />
        <MetricPill label="白vs黒" value={formatMatchupRate(score.matchups.white_vs_black)} />
      </div>
    </div>
  );
}

function formatMatchupRate(matchup: DeckBattleScoreSnapshot["matchups"][keyof DeckBattleScoreSnapshot["matchups"]]): string {
  return matchup.games > 0 ? `${formatPercent(matchup.winRate)} (${matchup.wins}-${matchup.losses}-${matchup.draws})` : "-";
}

function formatDeckOpponentRate(preset: DeckPresetDef, score: DeckBattleScoreSnapshot, opponentMasterId: MasterId): string {
  const matchup = deckOpponentMatchup(preset, score, opponentMasterId);
  return matchup ? formatMatchupRate(matchup) : "-";
}

function deckOpponentRateBarValue(preset: DeckPresetDef, score: DeckBattleScoreSnapshot, opponentMasterId: MasterId): number | undefined {
  const matchup = deckOpponentMatchup(preset, score, opponentMasterId);
  return matchup && matchup.games > 0 ? matchup.winRate : undefined;
}

function MetricPill({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <span className={`deck-score-metric ${strong ? "strong" : ""}`}>
      <span>{label}</span>
      <b>{value}</b>
    </span>
  );
}

function sortDeckPresetCandidates(presets: DeckPresetDef[], sortKey: DeckPresetSortKey): DeckPresetDef[] {
  if (sortKey === "source") {
    return presets;
  }
  return [...presets].sort((a, b) => {
    const scoreDelta = deckPresetSortValue(b, sortKey) - deckPresetSortValue(a, sortKey);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }
    const aScore = getDeckBattleScoreSnapshot(a.id);
    const bScore = getDeckBattleScoreSnapshot(b.id);
    if (aScore && bScore && aScore.rank !== bScore.rank) {
      return aScore.rank - bScore.rank;
    }
    if (aScore && !bScore) {
      return -1;
    }
    if (!aScore && bScore) {
      return 1;
    }
    return DECK_PRESETS.indexOf(a) - DECK_PRESETS.indexOf(b);
  });
}

function deckPresetSortValue(preset: DeckPresetDef, sortKey: DeckPresetSortKey): number {
  const score = getDeckBattleScoreSnapshot(preset.id);
  if (!score) {
    return Number.NEGATIVE_INFINITY;
  }
  if (sortKey === "winRate") {
    return score.winRate;
  }
  if (sortKey === "stability") {
    return score.stabilityScore;
  }
  if (sortKey === "speed") {
    return score.speedScore;
  }
  if (sortKey === "vsBlack") {
    return deckOpponentWinRateSortValue(preset, score, "black");
  }
  if (sortKey === "vsWhite") {
    return deckOpponentWinRateSortValue(preset, score, "white");
  }
  return score.battleScore;
}

function toggleDeckPresetFilterCard(cardIds: readonly string[], cardId: string): string[] {
  return cardIds.includes(cardId)
    ? cardIds.filter((candidate) => candidate !== cardId)
    : [...cardIds, cardId];
}

function deckOpponentWinRateSortValue(preset: DeckPresetDef, score: DeckBattleScoreSnapshot, opponentMasterId: MasterId): number {
  const matchup = deckOpponentMatchup(preset, score, opponentMasterId);
  return matchup && matchup.games > 0 ? matchup.winRate : Number.NEGATIVE_INFINITY;
}

function deckOpponentMatchup(
  preset: DeckPresetDef,
  score: DeckBattleScoreSnapshot,
  opponentMasterId: MasterId,
): DeckBattleScoreSnapshot["matchups"][keyof DeckBattleScoreSnapshot["matchups"]] | undefined {
  if (preset.masterId === "black") {
    return opponentMasterId === "black" ? score.matchups.black_vs_black : score.matchups.white_vs_black;
  }
  if (preset.masterId === "white") {
    return opponentMasterId === "black" ? score.matchups.white_vs_black : score.matchups.white_vs_white;
  }
  return undefined;
}

function formatDeckPresetIdentity(preset: DeckPresetDef): string {
  return preset.sourceDeckId ? `${preset.id} / 投稿#${preset.sourceDeckId}` : preset.id;
}

function formatDeckPresetMeta(preset: DeckPresetDef): string {
  return [preset.masterId ? getMasterName(preset.masterId) : undefined, preset.mode, preset.name].filter(Boolean).join(" / ");
}

function toDeckMatrixCells(cardIds: readonly string[]): DeckMatrixCell[] {
  return [...cardIds].sort((a, b) => {
    const aDef = getCardDef(a);
    const bDef = getCardDef(b);
    const categoryDiff = deckCategorySortValue(aDef) - deckCategorySortValue(bDef);
    return categoryDiff || aDef.name.localeCompare(bDef.name, "ja") || a.localeCompare(b);
  }).map((cardId) => {
    const kind = deckMatrixCellKind(cardId);
    return { cardId, kind };
  });
}

function deckMatrixCellKind(cardId: string): DeckMatrixCellKind {
  const def = getCardDef(cardId);
  if (getCardPool(def) === "special") {
    return "special";
  }
  if (def.type === "magic") {
    return "magic";
  }
  return def.role === "front" ? "front" : "back";
}

function deckMatrixKindCounts(cells: readonly DeckMatrixCell[]): Record<DeckMatrixCellKind, number> {
  const counts: Record<DeckMatrixCellKind, number> = { front: 0, back: 0, magic: 0, special: 0 };
  for (const cell of cells) {
    counts[cell.kind] += 1;
  }
  return counts;
}

function deckMatrixKindLabel(kind: DeckMatrixCellKind): string {
  if (kind === "front") {
    return "前衛";
  }
  if (kind === "back") {
    return "後衛";
  }
  if (kind === "magic") {
    return "マジック";
  }
  return "スペシャル";
}

function formatPercent(value: number): string {
  return `${Math.round(value * 1000) / 10}%`;
}

function DeckBuilderControls({
  cardOptions,
  selectedCardId,
  disabled,
  onSelect,
  onAdd,
}: {
  cardOptions: DeckCardOption[];
  selectedCardId: string;
  disabled: boolean;
  onSelect: (cardId: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="deck-builder-controls">
      <select value={selectedCardId} onChange={(event) => onSelect(event.target.value)}>
        {cardOptions.map((option) => (
          <option value={option.id} key={option.id}>
            {option.pool === "special" ? "Special / " : ""}{option.typeLabel} / {option.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={onAdd} disabled={disabled || !selectedCardId}>
        <Icon icon="＋" /> 追加
      </button>
    </div>
  );
}

function DeckSummaryView({ summary }: { summary: DeckValidationSummary }) {
  return (
    <div className="deck-summary-row">
      <span className={summary.total === 30 ? "ok" : "ng"}><Icon icon="🃏" /> {summary.total}/30</span>
      {(["front", "back", "magic"] as const).map((category) => (
        <span
          key={category}
          className={deckCategoryValid(summary, category) ? "ok" : "ng"}
        >
          {deckCategoryIcon(category)} {deckCategoryLabel(category)} {summary.categories[category]}
        </span>
      ))}
      {summary.categories.special > 0 && (
        <span className="ok">
          {deckCategoryIcon("special")} {deckCategoryLabel("special")} {summary.categories.special}
        </span>
      )}
      <span className={summary.duplicateViolations.length === 0 ? "ok" : "ng"}>
        <Icon icon="🔢" /> 3枚制限
      </span>
    </div>
  );
}

function DeckCardList({
  cardIds,
  editable = false,
  onAddCard,
  onRemoveCard,
}: {
  cardIds: string[];
  editable?: boolean;
  onAddCard?: (cardId: string) => void;
  onRemoveCard?: (cardId: string) => void;
}) {
  const counts = new Map<string, number>();
  for (const cardId of cardIds) {
    counts.set(cardId, (counts.get(cardId) ?? 0) + 1);
  }
  const rows = [...counts.entries()]
    .map(([cardId, count]) => ({ cardId, count, def: getCardDef(cardId) }))
    .sort((a, b) => {
      const categoryDiff = deckCategorySortValue(a.def) - deckCategorySortValue(b.def);
      return categoryDiff || a.def.name.localeCompare(b.def.name, "ja");
    });

  return (
    <details className="deck-card-list">
      <summary><Icon icon="📋" /> 内容 {cardIds.length}枚 / {rows.length}種類</summary>
      <div className="deck-card-grid">
        {rows.map(({ cardId, count, def }) => (
          <span className="deck-card-chip" key={cardId}>
            <CardIcon cardId={cardId} />
            {def.name} x{count}
            {editable && (
              <span className="deck-card-chip-actions">
                <button type="button" onClick={() => onRemoveCard?.(cardId)} aria-label={`${def.name}を1枚減らす`}>
                  −
                </button>
                <button type="button" onClick={() => onAddCard?.(cardId)} disabled={cardIds.length >= 30 || count >= 3} aria-label={`${def.name}を1枚増やす`}>
                  ＋
                </button>
              </span>
            )}
          </span>
        ))}
      </div>
    </details>
  );
}

function CardZonePanel({ game, view, onClose }: CardZonePanelProps) {
  if (view.kind === "catalog") {
    return <CardCatalogPanel game={game} onClose={onClose} />;
  }
  if (view.kind === "effects") {
    return <EffectHistoryPanel game={game} onClose={onClose} />;
  }
  if (view.kind === "cpuHistory") {
    return <CpuDecisionHistoryPanel game={game} onClose={onClose} />;
  }

  const cards = game.players[view.playerId][view.zone];
  const title = `${playerLabel(view.playerId)} ${zoneLabel(view.zone)}`;
  const helpText = zoneHelpText(view.zone);

  return (
    <section className="zone-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon={zoneIcon(view.zone)} /> {title}</h3>
          <p>{cards.length} cards / {helpText}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      {cards.length === 0 ? (
        <p className="empty-zone"><Icon icon="□" /> Empty</p>
      ) : (
        <div className="zone-card-list">
          {cards.map((card, index) => (
            <details className="zone-card-row" key={`${card.instanceId}_${index}`}>
              <summary>
                <span className="zone-card-index">{index + 1}</span>
                <CardIcon cardId={card.cardId} />
                <span className="zone-card-name">{getCardName(card.cardId)}</span>
                <span className="zone-card-type">{cardTypeLabel(card.cardId)}</span>
              </summary>
              <div className="catalog-card-detail">
                <CardDetail cardId={card.cardId} game={game} showTitle={false} />
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}

interface CpuDecisionEntry {
  index: number;
  actor: string;
  selected: string;
  rejected?: string;
}

function CpuDecisionHistoryPanel({ game, onClose }: { game: GameState; onClose: () => void }) {
  const decisions = game.log
    .map((entry, index) => parseCpuDecisionEntry(entry, index))
    .filter((entry): entry is CpuDecisionEntry => !!entry);

  return (
    <section className="zone-panel cpu-history-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon="🧠" /> CPU Decision History</h3>
          <p>{decisions.length} decisions / 選択理由と上位見送り候補</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      {decisions.length === 0 ? (
        <p className="empty-zone"><Icon icon="□" /> CPU判断ログはまだありません。</p>
      ) : (
        <ol className="cpu-decision-list">
          {decisions.map((decision) => (
            <li className="cpu-decision-row" key={`${decision.actor}_${decision.index}`}>
              <span className="zone-card-index">{decision.index + 1}</span>
              <span className="cpu-decision-actor">{decision.actor}</span>
              <span className="cpu-decision-main"><Icon icon="✅" /> {decision.selected}</span>
              {decision.rejected && <span className="cpu-decision-rejected"><Icon icon="↩️" /> {decision.rejected}</span>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function parseCpuDecisionEntry(entry: string, index: number): CpuDecisionEntry | undefined {
  const marker = "判断:";
  const markerIndex = entry.indexOf(marker);
  if (markerIndex < 0) {
    return undefined;
  }
  const actor = entry.slice(0, markerIndex).trim() || "CPU";
  const detail = entry.slice(markerIndex + marker.length).trim();
  const [selected, rejected] = detail.split(" / 見送り: ");
  return {
    index,
    actor,
    selected: selected.trim(),
    rejected: rejected?.trim(),
  };
}

function EffectHistoryPanel({ game, onClose }: { game: GameState; onClose: () => void }) {
  const effectEntries = game.log
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => logCategoryLabel(entry) !== "通常");

  return (
    <section className="zone-panel">
      <div className="zone-panel-heading">
        <div>
          <h3><Icon icon="📜" /> Effect History</h3>
          <p>{effectEntries.length} entries / ダメージ、支援、ランダム、CPU判断を抽出</p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>
      {effectEntries.length === 0 ? (
        <p className="empty-zone"><Icon icon="□" /> Empty</p>
      ) : (
        <ol className="effect-history-list">
          {effectEntries.map(({ entry, index }) => (
            <li className={`effect-history-row ${logTone(entry)}`} key={`${entry}_${index}`}>
              <span className="zone-card-index">{index + 1}</span>
              <span className="effect-history-kind"><Icon icon={logIcon(entry)} /> {logCategoryLabel(entry)}</span>
              <span className="effect-history-text">{entry}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function CardCatalogPanel({ game, onClose }: { game: GameState; onClose: () => void }) {
  const [poolFilter, setPoolFilter] = useState<CardPool | "all">("normal");
  const [categoryFilter, setCategoryFilter] = useState<CatalogCategoryFilter>("all");
  const [sortKey, setSortKey] = useState<CatalogSortKey>("source");
  const [searchText, setSearchText] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const rows = useMemo(() => {
    const normalizedSearch = normalizeCatalogSearch(searchText);
    return getCardDefsByPool(poolFilter)
      .map((card) => ({ card, evaluation: evaluateCard(card.id) }))
      .filter(({ card }) => categoryFilter === "all" || catalogCategory(card) === categoryFilter)
      .filter(({ card }) => !normalizedSearch || catalogSearchText(card).includes(normalizedSearch))
      .sort((a, b) => compareCatalogRows(a, b, sortKey));
  }, [categoryFilter, poolFilter, searchText, sortKey]);
  const selectedRow = rows.find(({ card }) => card.id === selectedCardId) ?? rows[0];

  return (
    <section className="zone-panel catalog-library-panel">
      <div className="zone-panel-heading catalog-library-heading">
        <div>
          <h3><Icon icon="📚" /> Card Library</h3>
          <p>
            {rows.length} cards / {cardPoolFilterLabel(poolFilter)} / {catalogCategoryFilterLabel(categoryFilter)}
            {searchText.trim() ? ` / "${searchText.trim()}"` : ""}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="閉じる">
          <Icon icon="✕" /> Close
        </button>
      </div>

      <div className="catalog-library-controls">
        <label className="catalog-search-control">
          Search
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="カード名、技、効果"
          />
        </label>
        <div className="catalog-filter-row" aria-label="card pool filter">
          {(["normal", "special", "all"] as const).map((filter) => (
            <button
              type="button"
              className={poolFilter === filter ? "selected" : ""}
              key={filter}
              onClick={() => setPoolFilter(filter)}
            >
              {cardPoolFilterLabel(filter)}
            </button>
          ))}
        </div>
        <div className="catalog-filter-row" aria-label="card category filter">
          {(["all", "front", "back", "magic"] as const).map((filter) => (
            <button
              type="button"
              className={categoryFilter === filter ? "selected" : ""}
              key={filter}
              onClick={() => setCategoryFilter(filter)}
            >
              {catalogCategoryFilterLabel(filter)}
            </button>
          ))}
        </div>
        <label className="catalog-sort-control">
          Sort
          <select value={sortKey} onChange={(event) => setSortKey(event.target.value as CatalogSortKey)}>
            <option value="source">No.</option>
            <option value="evaluation">評価</option>
            <option value="proBlack">PRO黒評価</option>
            <option value="proWhite">PRO白評価</option>
            <option value="offense">攻撃</option>
            <option value="defense">耐久</option>
            <option value="synergy">効果</option>
            <option value="hp">HP</option>
            <option value="cost">Cost</option>
            <option value="name">名前</option>
          </select>
        </label>
      </div>

      <div className="catalog-library-layout">
        <div className="catalog-card-grid" aria-label="card library cards">
          {rows.map(({ card, evaluation }) => {
            const selected = selectedRow?.card.id === card.id;
            return (
              <button
                type="button"
                className={`catalog-card-tile ${selected ? "selected" : ""}`}
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                aria-pressed={selected}
              >
                <span className="catalog-card-no">{catalogNoText(card)}</span>
                <CardIcon cardId={card.id} />
                <span className="catalog-card-main">
                  <strong>{card.name}</strong>
                  <span>{catalogTileSubtitle(card)}</span>
                </span>
                <span className="catalog-card-eval" title="カード単体評価">
                  <Icon icon="📈" /> {evaluation.grade} {evaluation.total}
                </span>
                <span className="catalog-card-tags">
                  <span className="zone-card-type">{cardTypeLabel(card.id)}</span>
                  <CardPoolChip cardId={card.id} compact />
                </span>
                <span className="catalog-card-stats" title="主要評価データ">
                  {catalogStatSummary(card, evaluation)}
                </span>
                <span className="catalog-card-preview">{catalogCommandPreview(card)}</span>
              </button>
            );
          })}
          {rows.length === 0 && (
            <p className="empty-zone"><Icon icon="□" /> 該当カードはまだありません。</p>
          )}
        </div>

        <aside className="catalog-selected-panel">
          {selectedRow ? (
            <>
              <div className="catalog-selected-heading">
                <div>
                  <span className="catalog-card-no">{catalogNoText(selectedRow.card)}</span>
                  <h3><CardIcon cardId={selectedRow.card.id} /> {selectedRow.card.name}</h3>
                </div>
                <span className="catalog-card-eval">
                  <Icon icon="📈" /> {selectedRow.evaluation.grade} {selectedRow.evaluation.total}
                </span>
              </div>
              <div className="catalog-selected-summary">
                <span>{catalogTileSubtitle(selectedRow.card)}</span>
                <span>{catalogStatSummary(selectedRow.card, selectedRow.evaluation)}</span>
                <span>{catalogRarityText(selectedRow.card)}</span>
              </div>
              <div className="catalog-card-detail">
                <CardDetail cardId={selectedRow.card.id} game={game} showTitle={false} />
              </div>
            </>
          ) : (
            <p className="empty-zone"><Icon icon="□" /> カードを選択してください。</p>
          )}
        </aside>
      </div>
    </section>
  );
}

function compareCatalogRows(
  a: { card: ReturnType<typeof getCardDef>; evaluation: ReturnType<typeof evaluateCard> },
  b: { card: ReturnType<typeof getCardDef>; evaluation: ReturnType<typeof evaluateCard> },
  sortKey: CatalogSortKey,
): number {
  if (sortKey === "name") {
    return a.card.name.localeCompare(b.card.name, "ja");
  }
  if (sortKey === "evaluation") {
    return b.evaluation.total - a.evaluation.total || sourceOrder(a.card) - sourceOrder(b.card);
  }
  if (sortKey === "proBlack") {
    return memberRatingSortValue(b.card.id, "black") - memberRatingSortValue(a.card.id, "black") || sourceOrder(a.card) - sourceOrder(b.card);
  }
  if (sortKey === "proWhite") {
    return memberRatingSortValue(b.card.id, "white") - memberRatingSortValue(a.card.id, "white") || sourceOrder(a.card) - sourceOrder(b.card);
  }
  if (sortKey === "offense") {
    return b.evaluation.offense - a.evaluation.offense || b.evaluation.total - a.evaluation.total;
  }
  if (sortKey === "defense") {
    return b.evaluation.defense - a.evaluation.defense || b.evaluation.total - a.evaluation.total;
  }
  if (sortKey === "synergy") {
    return b.evaluation.synergy - a.evaluation.synergy || b.evaluation.total - a.evaluation.total;
  }
  if (sortKey === "hp") {
    return catalogHpValue(b.card) - catalogHpValue(a.card) || b.evaluation.total - a.evaluation.total;
  }
  if (sortKey === "cost") {
    return catalogCostValue(b.card) - catalogCostValue(a.card) || b.evaluation.total - a.evaluation.total;
  }
  return sourceOrder(a.card) - sourceOrder(b.card) || a.card.name.localeCompare(b.card.name, "ja");
}

function catalogCategory(card: ReturnType<typeof getCardDef>): CatalogCategoryFilter {
  if (card.type === "magic") {
    return "magic";
  }
  return card.role;
}

function memberRatingSortValue(cardId: string, masterId: MasterId): number {
  return getCardMemberRatingAverage(cardId, masterId) ?? 0;
}

function catalogCategoryFilterLabel(filter: CatalogCategoryFilter): string {
  if (filter === "front") {
    return "前衛";
  }
  if (filter === "back") {
    return "後衛";
  }
  if (filter === "magic") {
    return "魔法";
  }
  return "全種";
}

function normalizeCatalogSearch(value: string): string {
  return value.trim().toLocaleLowerCase("ja");
}

function catalogSearchText(card: ReturnType<typeof getCardDef>): string {
  const parts = [
    card.id,
    card.name,
    card.catchcopy ?? "",
    ...(card.notes ?? []),
  ];
  if (card.type === "magic") {
    parts.push(card.description, card.category ?? "", card.continuance ?? "", ...card.targetKinds);
  } else {
    parts.push(card.role, String(card.maxLevel));
    for (const level of card.levels) {
      parts.push(
        String(level.level),
        String(level.maxHp),
        ...level.commands.flatMap((command) => [
          command.id,
          command.name,
          String(command.power),
          command.range,
          command.rangeText ?? "",
          command.effectText ?? "",
        ]),
      );
    }
  }
  return parts.join(" ").toLocaleLowerCase("ja");
}

function catalogStatSummary(card: ReturnType<typeof getCardDef>, evaluation: ReturnType<typeof evaluateCard>): string {
  if (card.type === "magic") {
    return `Cost ${card.cost} / 攻${evaluation.offense} 耐${evaluation.defense} 効${evaluation.synergy}`;
  }
  return `HP ${catalogHpText(card)} / Lv${card.maxLevel} / 攻${evaluation.offense} 耐${evaluation.defense} 効${evaluation.synergy}`;
}

function catalogTileSubtitle(card: ReturnType<typeof getCardDef>): string {
  if (card.type === "magic") {
    return `魔法 / Cost ${card.cost}`;
  }
  const pool = getCardPool(card);
  if (pool === "special") {
    return `スーパー / ${superEvolutionText(card)} / MaxLv ${card.maxLevel}`;
  }
  return `${card.role === "front" ? "前衛" : "後衛"} / 召喚 1 / MaxLv ${card.maxLevel}`;
}

function catalogCommandPreview(card: ReturnType<typeof getCardDef>): string {
  if (card.type === "magic") {
    return card.description;
  }
  return card.levels
    .map((level) => `Lv${level.level}: ${level.commands.map(commandSummary).join(" / ")}`)
    .join("  ");
}

function catalogNoText(card: ReturnType<typeof getCardDef>): string {
  return card.sourceNo ? `No.${String(card.sourceNo).padStart(3, "0")}` : "No.--";
}

function catalogRarityText(card: ReturnType<typeof getCardDef>): string {
  return card.rarity ? `Rarity ${card.rarity}` : "Rarity -";
}

function catalogHpText(card: ReturnType<typeof getCardDef>): string {
  if (card.type === "magic") {
    return "-";
  }
  const hpValues = card.levels.map((level) => level.maxHp);
  const min = Math.min(...hpValues);
  const max = Math.max(...hpValues);
  return min === max ? String(max) : `${min}-${max}`;
}

function catalogHpValue(card: ReturnType<typeof getCardDef>): number {
  if (card.type === "magic") {
    return -1;
  }
  return Math.max(...card.levels.map((level) => level.maxHp));
}

function catalogCostValue(card: ReturnType<typeof getCardDef>): number {
  return card.type === "magic" ? card.cost : -1;
}

function sourceOrder(card: ReturnType<typeof getCardDef>): number {
  return card.sourceNo ?? 9999;
}

interface BoardSlotProps {
  slotKey: SlotKey;
  game: GameState;
  selected: boolean;
  targetable: boolean;
  targetRole?: TargetRole;
  effectKind?: EffectKind;
  effectId?: number;
  damageFlash?: DamageFlash;
  draggable: boolean;
  onDragStart: (event: DragEvent<HTMLButtonElement>) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onDragOver: (event: DragEvent<HTMLButtonElement>) => void;
  onDrop: (event: DragEvent<HTMLButtonElement>) => void;
  onClick: () => void;
}

function BoardSlot({
  slotKey,
  game,
  selected,
  targetable,
  targetRole,
  effectKind,
  effectId,
  damageFlash,
  draggable,
  onDragStart,
  onPointerDown,
  onDragOver,
  onDrop,
  onClick,
}: BoardSlotProps) {
  const slot = game.slots[slotKey];
  const monster = slot.monster;
  const hidePreparedInfo = monster?.status === "prepared" && monster.owner !== "player";
  const label = slotLabel(slotKey);

  return (
    <button
      type="button"
      className={[
        "board-slot",
        slot.owner,
        selected ? "selected" : "",
        targetable ? "targetable" : "",
        targetRole ? `target-${targetRole}` : "",
        monster?.status === "prepared" ? "prepared" : "",
        effectKind ? `effect-active effect-${effectKind}` : "",
        damageFlash?.defeated ? "effect-defeated" : "",
      ].join(" ")}
      data-slot-key={slotKey}
      draggable={draggable}
      onDragStart={onDragStart}
      onPointerDown={onPointerDown}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      <span className="slot-label">{label}</span>
      {targetRole && <span className="target-badge">{targetRoleLabel(targetRole)}</span>}
      {monster && hidePreparedInfo ? (
        <span className="monster-card hidden-prepared">
          <strong><Icon icon="🂠" /> 準備中カード</strong>
          <span><Icon icon="🔒" /> 情報非公開</span>
        </span>
      ) : monster ? (
        <span className="monster-card">
          <strong><CardIcon cardId={monster.cardId} /> {getMonsterDisplayName(monster)}</strong>
          <span><Icon icon="✨" /> Lv{monster.level} / <Icon icon="❤️" /> HP {monster.hp}</span>
          <span>
            <Icon icon={monster.status === "prepared" ? "🕒" : "⚡"} />
            {monster.status === "prepared" ? "準備中" : `${monster.actionCount}/${monster.actionLimit}行動`}
          </span>
          <MonsterTraitSummary cardId={monster.cardId} />
          <span>
            {[
              monster.focused ? "💪 気合い 上技+1/被ダメ-1" : "",
              monster.powerUp ? "⬆️ P+1" : "",
              monster.berserkPower ? "🔥 バーサク" : "",
              monster.shielded ? "🛡️ 盾" : "",
            ].filter(Boolean).join(" ")}
          </span>
        </span>
      ) : (
        <span className="empty-slot"><Icon icon="□" /> Empty</span>
      )}
      <DamageBubble key={effectId} flash={damageFlash} />
    </button>
  );
}

function DamageBubble({ flash }: { flash?: DamageFlash }) {
  if (!flash) {
    return null;
  }

  return (
    <span className={`damage-bubble ${flash.defeated ? "damage-bubble-ko" : ""}`} aria-hidden="true">
      <span className="damage-value">-{flash.amount}</span>
      {flash.defeated && <strong className="damage-ko-label">KO</strong>}
    </span>
  );
}

interface MonsterCommandsProps {
  game: GameState;
  slotKey: SlotKey;
  onCommand: (commandId: string, targets: Target[]) => void;
  onFocus: () => void;
  onMove: (targets: SlotKey[]) => void;
}

function MonsterCommands({ game, slotKey, onCommand, onFocus, onMove }: MonsterCommandsProps) {
  const slot = game.slots[slotKey];
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return null;
  }
  const hidePreparedInfo = monster.status === "prepared" && monster.owner !== "player";
  const moveTargets = getMovableTargets(game, slotKey);
  const moveDisabledReason = getMoveDisabledReason(game, slotKey, moveTargets);
  const focusDisabledReason = getFocusDisabledReason(game, slotKey);

  return (
    <div className="selected-detail">
      <h3>
        {hidePreparedInfo ? <Icon icon="🂠" /> : <CardIcon cardId={monster.cardId} />}
        {hidePreparedInfo ? "準備中カード" : `${getMonsterDisplayName(monster)} Lv${monster.level}`}
      </h3>
      <div className="card-meta-row">
        <span>{playerLabel(slot.owner)}</span>
        <span>{slotLabel(slotKey)}</span>
        <span><Icon icon={monster.status === "prepared" ? "🕒" : "⚡"} /> {monster.status === "prepared" ? "準備中" : `${monster.actionCount}/${monster.actionLimit}行動`}</span>
        {!hidePreparedInfo && <span><Icon icon="❤️" /> HP {monster.hp}</span>}
        {!hidePreparedInfo && <span><Icon icon="🪨" /> 投資 {monster.investedStones}</span>}
      </div>
      {hidePreparedInfo ? (
        <p className="hint"><Icon icon="🔒" /> CPUの準備中カードの情報は非公開です。</p>
      ) : (
        <div className="board-card-detail">
          <CardDetail cardId={monster.cardId} game={game} slotKey={slotKey} showTitle={false} />
        </div>
      )}
      {!hidePreparedInfo && (
        <div className="button-stack">
          {getMonsterCommands(monster).map((command, index) => {
            const targets = getCommandTargets(game, slotKey, command.id);
            const disabledReason = getCommandDisabledReason(game, slotKey, command, targets);
            return (
              <button
                className="command-button"
                key={`${command.id}_${index}`}
                type="button"
                onClick={() => onCommand(command.id, targets)}
                disabled={!!disabledReason}
                title={disabledReason ?? `${targets.length}対象`}
              >
                <span className="command-button-main">
                  <Icon icon={commandIcon(command)} />
                  <strong>{command.name} {command.power}P</strong>
                </span>
                <span className="command-button-meta">{commandActionSummary(command)}</span>
                <span className={disabledReason ? "command-button-reason" : "command-button-ready"}>
                  {disabledReason ?? `対象 ${targets.length}`}
                </span>
              </button>
            );
          })}
          <button
            className="command-button"
            type="button"
            onClick={() => onMove(moveTargets)}
            disabled={!!moveDisabledReason}
            title={moveDisabledReason ?? `${moveTargets.length}マス`}
          >
            <span className="command-button-main"><Icon icon="🧭" /><strong>Move / Swap</strong></span>
            <span className="command-button-meta">自陣内 / 空きマスまたは味方と入れ替え</span>
            <span className={moveDisabledReason ? "command-button-reason" : "command-button-ready"}>
              {moveDisabledReason ?? `候補 ${moveTargets.length}`}
            </span>
          </button>
          <button
            className="command-button"
            type="button"
            onClick={onFocus}
            disabled={!!focusDisabledReason}
            title={focusDisabledReason ?? "次の上の技+1P / 被ダメージ-1"}
          >
            <span className="command-button-main"><Icon icon="💪" /><strong>ためる</strong></span>
            <span className="command-button-meta">上の技+1P / 被ダメージ-1 / 行動後に解除</span>
            <span className={focusDisabledReason ? "command-button-reason" : "command-button-ready"}>
              {focusDisabledReason ?? "使用可"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function getCommandDisabledReason(game: GameState, slotKey: SlotKey, command: CommandDef, targets: Target[]): string | undefined {
  const actionReason = getMonsterActionDisabledReason(game, slotKey);
  if (actionReason) {
    return actionReason;
  }

  const player = game.players[game.currentPlayer];
  const cost = command.stoneCost ?? 0;
  if (cost > player.stones) {
    return `Stone不足: 必要${cost} / 所持${player.stones}`;
  }
  if (targets.length === 0) {
    return "射程内に対象なし";
  }
  return undefined;
}

function getMoveDisabledReason(game: GameState, slotKey: SlotKey, targets: SlotKey[]): string | undefined {
  const actionReason = getMonsterActionDisabledReason(game, slotKey);
  if (actionReason) {
    return actionReason;
  }
  if (targets.length === 0) {
    return "移動・入れ替え先なし";
  }
  return undefined;
}

function getFocusDisabledReason(game: GameState, slotKey: SlotKey): string | undefined {
  const actionReason = getMonsterActionDisabledReason(game, slotKey);
  if (actionReason) {
    return actionReason;
  }
  const monster = game.slots[slotKey].monster;
  if (monster?.focused) {
    return "すでに気合い中";
  }
  if (!canFocusMonster(game, slotKey)) {
    return "ためられない状態";
  }
  return undefined;
}

function getMonsterActionDisabledReason(game: GameState, slotKey: SlotKey): string | undefined {
  if (game.winner) {
    return "勝敗決定済み";
  }
  if (game.pendingLevelUp) {
    return "レベルアップ選択中";
  }
  if (game.currentPlayer !== "player") {
    return "CPUターン中";
  }

  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return "カードがありません";
  }
  if (monster.owner !== game.currentPlayer) {
    return "相手のカードです";
  }
  if (monster.status !== "active") {
    return "準備中のため行動不可";
  }
  if (monster.actionCount >= monster.actionLimit) {
    return "このターンは行動済み";
  }
  return undefined;
}

function pendingDropActionTargetKey(action: PendingDropAction): string {
  if (action.kind === "move") {
    return `monster:${action.toSlotKey}`;
  }
  return targetToKey(action.target);
}

function selectionFromPendingDropAction(action: PendingDropAction): Selection {
  if (action.kind === "magic") {
    return { kind: "hand", instanceId: action.handInstanceId };
  }
  if (action.kind === "move") {
    return { kind: "monster", slotKey: action.fromSlotKey };
  }
  return { kind: "monster", slotKey: action.attackerSlotKey };
}

function isSelectedSourceSlot(selection: Selection | undefined, action: PendingDropAction | undefined, slotKey: SlotKey): boolean {
  if (action?.kind === "move") {
    return action.fromSlotKey === slotKey;
  }
  if (action?.kind === "attackTarget") {
    return action.attackerSlotKey === slotKey;
  }
  if (selection?.kind === "commandSecondaryTarget" || selection?.kind === "commandHandChoice") {
    return selection.attackerSlotKey === slotKey;
  }
  if (
    (selection?.kind === "magicSecondaryTarget" ||
      selection?.kind === "magicHandChoice" ||
      selection?.kind === "magicRefresh" ||
      selection?.kind === "magicSearch") &&
    selection.target.kind === "monster"
  ) {
    return selection.target.slotKey === slotKey;
  }
  return selection?.kind === "monster" && selection.slotKey === slotKey;
}

function isSelectedSourceHand(selection: Selection | undefined, action: PendingDropAction | undefined, instanceId: string): boolean {
  if (action?.kind === "magic" && action.handInstanceId === instanceId) {
    return true;
  }
  if (
    (selection?.kind === "magicSecondaryTarget" ||
      selection?.kind === "magicHandChoice" ||
      selection?.kind === "magicRefresh" ||
      selection?.kind === "magicSearch") &&
    selection.handInstanceId === instanceId
  ) {
    return true;
  }
  return selection?.kind === "hand" && selection.instanceId === instanceId;
}

function pendingDropActionIcon(action: PendingDropAction): string {
  if (action.kind === "magic") {
    return "✨";
  }
  if (action.kind === "move") {
    return "🧭";
  }
  return "⚔️";
}

function pendingDropActionTitle(action: PendingDropAction): string {
  if (action.kind === "magic") {
    return "マジック";
  }
  if (action.kind === "move") {
    return "Move / Swap";
  }
  return "技を選択";
}

function pendingDropActionDescription(action: PendingDropAction, game: GameState): string {
  if (action.kind === "magic") {
    return `${handCardLabel(game, action.handInstanceId)} -> ${targetLabel(game, action.target)}`;
  }
  if (action.kind === "move") {
    return `${slotMonsterLabel(game, action.fromSlotKey)} -> ${targetLabel(game, { kind: "monster", slotKey: action.toSlotKey })}`;
  }
  return `${slotMonsterLabel(game, action.attackerSlotKey)} -> ${targetLabel(game, action.target)}`;
}

function getPendingAttackCommands(game: GameState, action: Extract<PendingDropAction, { kind: "attackTarget" }>): CommandDef[] {
  return getCommandsTargetingTarget(game, action.attackerSlotKey, action.target)
    .filter((command) => action.commandIds.includes(command.id));
}

function getCommandsTargetingTarget(game: GameState, attackerSlotKey: SlotKey, target: Target): CommandDef[] {
  const monster = game.slots[attackerSlotKey].monster;
  if (!monster) {
    return [];
  }
  return getMonsterCommands(monster)
    .filter((command) =>
      getCommandTargets(game, attackerSlotKey, command.id)
        .some((candidateTarget) => targetToKey(candidateTarget) === targetToKey(target)),
    );
}

function handCardLabel(game: GameState, instanceId: string): string {
  const card = getHandCard(game, instanceId);
  return card ? getCardName(card.cardId) : "カード";
}

function slotMonsterLabel(game: GameState, slotKey: SlotKey): string {
  const monster = game.slots[slotKey].monster;
  return monster ? `${slotLabel(slotKey)} ${getMonsterDisplayName(monster)}` : slotLabel(slotKey);
}

function targetLabel(game: GameState, target: Target): string {
  if (target.kind === "master") {
    return `${playerLabel(target.playerId)}マスター`;
  }
  return slotMonsterLabel(game, target.slotKey);
}

function targetRoleForTarget(
  game: GameState,
  target: Target,
  targetKeys: Set<string>,
  selection: Selection | undefined,
  action: PendingDropAction | undefined,
): TargetRole | undefined {
  if (!targetKeys.has(targetToKey(target))) {
    return undefined;
  }
  if (selection?.kind === "move" || action?.kind === "move") {
    return "move";
  }
  if (selection?.kind === "hand") {
    const handCard = getHandCard(game, selection.instanceId);
    if (handCard && getCardDef(handCard.cardId).type === "monster") {
      return "summon";
    }
  }
  if (target.kind === "master") {
    return "master";
  }
  const slot = game.slots[target.slotKey];
  if (!slot.monster) {
    return "empty";
  }
  return slot.monster.owner === game.currentPlayer ? "ally" : "enemy";
}

function targetRoleLabel(role: TargetRole): string {
  if (role === "ally") {
    return "味方対象";
  }
  if (role === "enemy") {
    return "敵対象";
  }
  if (role === "move") {
    return "移動先";
  }
  if (role === "summon") {
    return "召喚先";
  }
  if (role === "master") {
    return "マスター";
  }
  return "空き枠";
}

function isZoneView(view: ZoneView | undefined, playerId: PlayerId, zone: Extract<ZoneView, { kind: "playerZone" }>["zone"]): boolean {
  return view?.kind === "playerZone" && view.playerId === playerId && view.zone === zone;
}

function isInfoWorkspaceView(view: ZoneView | undefined): boolean {
  return view?.kind === "deckSetup" || view?.kind === "aiLab";
}

function toggleZoneView(current: ZoneView | undefined, next: ZoneView): ZoneView | undefined {
  if (next.kind === "catalog") {
    return current?.kind === "catalog" ? undefined : next;
  }
  if (next.kind === "effects") {
    return current?.kind === "effects" ? undefined : next;
  }
  if (next.kind === "cpuHistory") {
    return current?.kind === "cpuHistory" ? undefined : next;
  }
  if (next.kind === "aiLab") {
    return current?.kind === "aiLab" ? undefined : next;
  }
  if (next.kind === "deckSetup") {
    return current?.kind === "deckSetup" ? undefined : next;
  }
  return isZoneView(current, next.playerId, next.zone) ? undefined : next;
}

function zoneLabel(zone: Extract<ZoneView, { kind: "playerZone" }>["zone"]): string {
  if (zone === "deck") {
    return "Deck";
  }
  if (zone === "hand") {
    return "Hand";
  }
  return "Discard";
}

function zoneIcon(zone: Extract<ZoneView, { kind: "playerZone" }>["zone"]): string {
  if (zone === "deck") {
    return "🂠";
  }
  if (zone === "hand") {
    return "🃏";
  }
  return "🗂️";
}

function zoneHelpText(zone: Extract<ZoneView, { kind: "playerZone" }>["zone"]): string {
  if (zone === "deck") {
    return "上から順に引きます。";
  }
  if (zone === "hand") {
    return "現在選べるカードです。";
  }
  return "捨てられた順に並びます。";
}

function cardTypeLabel(cardId: string): string {
  const def = getCardDef(cardId);
  if (def.type === "magic") {
    return "魔法";
  }
  if (getCardPool(def) === "special") {
    return "スーパー";
  }
  return def.role === "front" ? "前衛" : "後衛";
}

function CardPoolChip({ cardId, compact = false }: { cardId: string; compact?: boolean }) {
  if (getCardPool(cardId) !== "special") {
    return null;
  }
  return <span className={`card-chip special${compact ? " compact" : ""}`}><Icon icon="★" /> Special</span>;
}

function cardPoolFilterLabel(pool: CardPool | "all"): string {
  if (pool === "normal") {
    return "Normal";
  }
  if (pool === "special") {
    return "Special";
  }
  return "All";
}

function superEvolutionText(def: ReturnType<typeof getMonsterDef>): string {
  const seeds = def.evolvesFrom?.map((cardId) => getCardName(cardId)).join(" / ");
  return seeds ? `${seeds}から変身` : "レベルアップで変身";
}

function deckCategoryValid(summary: DeckValidationSummary, category: "front" | "back" | "magic"): boolean {
  return summary.categories[category] >= 0;
}

function deckCategoryIcon(category: "front" | "back" | "magic" | "special"): string {
  if (category === "front") {
    return "🛡️";
  }
  if (category === "back") {
    return "🏹";
  }
  if (category === "special") {
    return "★";
  }
  return "✨";
}

function deckCategorySortValue(def: ReturnType<typeof getCardDef>): number {
  if (getCardPool(def) === "special") {
    return 4;
  }
  if (def.type === "magic") {
    return 3;
  }
  return def.role === "front" ? 1 : 2;
}

function getDeckCardOptions(allowSpecial: boolean): DeckCardOption[] {
  return getCardDefsByPool(allowSpecial ? "all" : "normal")
    .map((def) => ({
      id: def.id,
      name: def.name,
      pool: getCardPool(def),
      typeLabel: getCardPool(def) === "special" ? "スーパー" : def.type === "magic" ? "魔法" : def.role === "front" ? "前衛" : "後衛",
      sortValue: deckCategorySortValue(def),
    }))
    .sort((a, b) => a.sortValue - b.sortValue || a.pool.localeCompare(b.pool) || a.name.localeCompare(b.name, "ja"));
}

function isDeckCardAllowed(playerId: PlayerId, cardId: string, deckSettings: DeckSettings): boolean {
  return deckSettings.allowSpecial[playerId] || getCardPool(cardId) !== "special";
}

function createVisualEffect(previous: GameState, next: GameState, id: number): VisualEffect {
  const appendedLogs = getAppendedLogs(previous.log, next.log);
  const latestLog = appendedLogs.at(-1) ?? next.log[next.log.length - 1] ?? "";
  const kind = effectKindFromLogs(appendedLogs, latestLog);
  return {
    id,
    kind,
    slots: BOARD_SLOT_KEYS.filter((slotKey) => slotSignature(previous, slotKey) !== slotSignature(next, slotKey)),
    masters: PLAYER_IDS.filter(
      (playerId) =>
        previous.players[playerId].masterHp !== next.players[playerId].masterHp ||
        (kind === "random" && previous.players[playerId].stones !== next.players[playerId].stones),
    ),
    slotDamageFlashes: createSlotDamageFlashes(previous, next, appendedLogs),
    masterDamageFlashes: createMasterDamageFlashes(previous, next),
  };
}

function getAppendedLogs(previousLog: string[], nextLog: string[]): string[] {
  const maxOverlap = Math.min(previousLog.length, nextLog.length);
  for (let overlap = maxOverlap; overlap > 0; overlap -= 1) {
    const previousStart = previousLog.length - overlap;
    const matches = previousLog
      .slice(previousStart)
      .every((entry, index) => entry === nextLog[index]);
    if (matches) {
      return nextLog.slice(overlap);
    }
  }
  return nextLog.length > 0 ? [nextLog[nextLog.length - 1]] : [];
}

function createSlotDamageFlashes(
  previous: GameState,
  next: GameState,
  appendedLogs: string[],
): SlotDamageFlash[] {
  return BOARD_SLOT_KEYS.flatMap((slotKey) => {
    const previousMonster = previous.slots[slotKey].monster;
    if (!previousMonster) {
      return [];
    }

    const nextMonster = next.slots[slotKey].monster;
    if (nextMonster?.instanceId === previousMonster.instanceId) {
      const amount = previousMonster.hp - nextMonster.hp;
      const flash: SlotDamageFlash = { slotKey, amount, defeated: false };
      return amount > 0 ? [flash] : [];
    }

    if (wasDefeated(previousMonster.cardId, appendedLogs)) {
      const flash: SlotDamageFlash = { slotKey, amount: Math.max(1, previousMonster.hp), defeated: true };
      return [flash];
    }

    return [];
  });
}

function createMasterDamageFlashes(previous: GameState, next: GameState): MasterDamageFlash[] {
  return PLAYER_IDS.flatMap((playerId) => {
    const amount = previous.players[playerId].masterHp - next.players[playerId].masterHp;
    const flash: MasterDamageFlash = { playerId, amount, defeated: next.players[playerId].masterHp <= 0 };
    return amount > 0 ? [flash] : [];
  });
}

function wasDefeated(cardId: string, appendedLogs: string[]): boolean {
  const cardName = getCardName(cardId);
  return appendedLogs.some((entry) => entry.includes(cardName) && entry.includes("は倒れ"));
}

function slotSignature(game: GameState, slotKey: SlotKey): string {
  const monster = game.slots[slotKey].monster;
  if (!monster) {
    return "empty";
  }
  return [
    monster.instanceId,
    monster.cardId,
    monster.owner,
    monster.hp,
    monster.level,
    monster.status,
    monster.investedStones,
    monster.actionCount,
    monster.actionLimit,
    monster.focused,
    monster.powerUp,
    monster.shielded,
    monster.powerModifier,
    monster.powerOverride,
    monster.cannotMove,
    monster.levelFixed,
    monster.immune,
    monster.halfShielded,
    monster.oneShotShield,
    monster.reviveOnDefeat,
    monster.shadowCursed,
    monster.scapegoat,
    monster.canAttackAnywhere,
    monster.stoneCostMultiplier,
    monster.commandSealed,
    monster.cannotActUntilDamaged,
    monster.berserkPower,
    monster.dodgeChance,
    monster.dragonShield,
    monster.provokeTargetSlotKey,
    monster.deathChainSlotKey,
    monster.stoneCurse,
    monster.damageCurse,
  ].join(":");
}

function effectKindFromLogs(appendedLogs: string[], fallback: string): EffectKind {
  return appendedLogs.some(isRandomResultLog) ? "random" : effectKindFromLog(fallback);
}

function effectKindFromLog(entry: string): EffectKind {
  if (isRandomResultLog(entry)) {
    return "random";
  }
  if (entry.includes("ダメージ") || entry.includes("倒れ") || entry.includes("攻撃") || entry.includes("アタック")) {
    return "attack";
  }
  if (entry.includes("HPが") || entry.includes("山札切れ")) {
    return "damage";
  }
  if (entry.includes("召喚") || entry.includes("登場")) {
    return "summon";
  }
  if (entry.includes("ため") || entry.includes("気合い")) {
    return "focus";
  }
  if (entry.includes("移動") || entry.includes("入れ替え")) {
    return "move";
  }
  if (entry.includes("回復") || entry.includes("シールド") || entry.includes("ウェイクアップ")) {
    return "heal";
  }
  if (entry.includes("ターン") || entry.includes("引いた") || entry.includes("ストーン")) {
    return "turn";
  }
  return "default";
}

function isRandomResultLog(entry: string): boolean {
  return entry.includes("ランダム結果");
}

function logTone(entry: string): string {
  if (entry.includes("勝利") || entry.includes("敗北")) {
    return "log-win";
  }
  if (isRandomResultLog(entry)) {
    return "log-random";
  }
  if (entry.includes("ダメージ") || entry.includes("倒れ") || entry.includes("HPが") || entry.includes("山札切れ")) {
    return "log-damage";
  }
  if (entry.includes("レベル") || entry.includes("Lv")) {
    return "log-level";
  }
  if (entry.includes("召喚") || entry.includes("登場")) {
    return "log-summon";
  }
  if (entry.includes("ため") || entry.includes("気合い")) {
    return "log-focus";
  }
  if (entry.includes("シールド") || entry.includes("ウェイクアップ") || entry.includes("回復")) {
    return "log-support";
  }
  if (entry.includes("ターン") || entry.includes("引いた") || entry.includes("ストーン")) {
    return "log-turn";
  }
  return "log-normal";
}

function logMatchesFilter(entry: string, filter: LogFilter): boolean {
  if (filter === "all") {
    return true;
  }
  if (filter === "cpu") {
    return entry.includes("判断:");
  }
  if (filter === "battle") {
    return entry.includes("攻撃") || entry.includes("アタック") || entry.includes("倒れ") || entry.includes("撃破");
  }
  if (filter === "damage") {
    return entry.includes("ダメージ") || entry.includes("HPが") || entry.includes("山札切れ");
  }
  if (filter === "support") {
    return (
      entry.includes("使った") ||
      entry.includes("シールド") ||
      entry.includes("ウェイクアップ") ||
      entry.includes("回復") ||
      entry.includes("コピー") ||
      entry.includes("入れ替え") ||
      entry.includes("ローテーション") ||
      entry.includes("リフレッシュ") ||
      isRandomResultLog(entry)
    );
  }
  return entry.includes("ターン") || entry.includes("引いた") || entry.includes("ストーン") || entry.includes("召喚");
}

function logFilterLabel(filter: LogFilter): string {
  if (filter === "all") {
    return "All";
  }
  if (filter === "battle") {
    return "Battle";
  }
  if (filter === "damage") {
    return "Damage";
  }
  if (filter === "support") {
    return "Support";
  }
  if (filter === "turn") {
    return "Turn";
  }
  return "CPU";
}

function logFilterIcon(filter: LogFilter): string {
  if (filter === "battle") {
    return "⚔️";
  }
  if (filter === "damage") {
    return "💥";
  }
  if (filter === "support") {
    return "🛡️";
  }
  if (filter === "turn") {
    return "⏭️";
  }
  if (filter === "cpu") {
    return "🧠";
  }
  return "•";
}

function logCategoryLabel(entry: string): string {
  if (entry.includes("判断:")) {
    return "CPU判断";
  }
  if (logMatchesFilter(entry, "damage")) {
    return "ダメージ/HP";
  }
  if (logMatchesFilter(entry, "battle")) {
    return "戦闘";
  }
  if (logMatchesFilter(entry, "support")) {
    return "支援/特殊効果";
  }
  if (logMatchesFilter(entry, "turn")) {
    return "ターン進行";
  }
  return "その他";
}

interface HandCardContentProps {
  cardId: string;
}

function HandCardContent({ cardId }: HandCardContentProps) {
  const def = getCardDef(cardId);

  if (def.type === "magic") {
    return (
      <>
        <span className="hand-card-title">
          <strong><CardIcon cardId={def.id} /> {def.name}</strong>
          <span className="card-chip magic">魔法</span>
          <CardPoolChip cardId={def.id} compact />
        </span>
        <span className="hand-card-meta"><Icon icon="🪨" /> Cost {def.cost} / {targetKindsLabel(def.targetKinds)}</span>
        <span className="hand-card-text">{def.description}</span>
        <CardNotes card={def} compact />
      </>
    );
  }

  const firstLevel = def.levels[0];
  const maxHpText = def.levels.map((level) => `Lv${level.level} HP${level.maxHp}`).join(" / ");
  const commandText = firstLevel.commands.map(commandSummary).join(" / ");
  const isSpecial = getCardPool(def) === "special";
  return (
    <>
      <span className="hand-card-title">
        <strong><CardIcon cardId={def.id} /> {def.name}</strong>
        <span className="card-chip"><Icon icon={isSpecial ? "★" : roleIcon(def.role)} /> {isSpecial ? "スーパー" : def.role === "front" ? "前衛" : "後衛"}</span>
        <CardPoolChip cardId={def.id} compact />
      </span>
      <span className="hand-card-meta">
        {isSpecial ? <><Icon icon="✨" /> {superEvolutionText(def)}</> : <><Icon icon="🪨" /> 召喚 1</>} / <Icon icon="✨" /> MaxLv {def.maxLevel}
      </span>
      <span className="hand-card-meta"><Icon icon="❤️" /> {maxHpText}</span>
      <span className="hand-card-text">{commandText}</span>
      <CardNotes card={def} compact />
    </>
  );
}

interface CardDetailProps {
  cardId: string;
  game?: GameState;
  slotKey?: SlotKey;
  showTitle?: boolean;
}

function CardDetail({ cardId, game, slotKey, showTitle = true }: CardDetailProps) {
  const def = getCardDef(cardId);
  const cardEvaluation = evaluateCard(cardId);
  const boardEvaluation = game && slotKey ? evaluateBoardUnit(game, slotKey) : undefined;
  const evaluation = boardEvaluation ?? cardEvaluation;
  if (def.type === "magic") {
    return (
      <>
        {showTitle && <h3><CardIcon cardId={def.id} /> {def.name}</h3>}
        <div className="card-meta-row">
          <CardPoolChip cardId={def.id} />
          <span className="card-chip magic">✨ 魔法</span>
          <span><Icon icon="🪨" /> Cost {def.cost}</span>
          <span>{targetKindsLabel(def.targetKinds)}</span>
          <MemberRatingChips cardId={def.id} />
        </div>
        <EffectBreakdown
          items={[
            { label: "条件", text: `手札から使用 / Stone ${def.cost}` },
            { label: "対象", text: targetKindsLabel(def.targetKinds) },
            { label: "持続", text: magicDurationText(def) },
          ]}
        />
        <p>{def.description}</p>
        <CardNotes card={def} />
        <UnitEvaluationPanel evaluation={evaluation} title="カード評価" />
      </>
    );
  }

  return (
    <>
      {showTitle && <h3><CardIcon cardId={def.id} /> {def.name}</h3>}
      <div className="card-meta-row">
        <CardPoolChip cardId={def.id} />
        <span className="card-chip"><Icon icon={getCardPool(def) === "special" ? "★" : roleIcon(def.role)} /> {getCardPool(def) === "special" ? "スーパー" : def.role === "front" ? "前衛" : "後衛"}</span>
        <span>{getCardPool(def) === "special" ? <><Icon icon="✨" /> {superEvolutionText(def)}</> : <><Icon icon="🪨" /> 召喚 1</>}</span>
        <span><Icon icon="✨" /> MaxLv {def.maxLevel}</span>
        {def.actionLimit && <span><Icon icon="⚡" /> {def.actionLimit}回行動</span>}
        <MemberRatingChips cardId={def.id} />
      </div>
      <CardNotes card={def} />
      <UnitEvaluationPanel evaluation={evaluation} title={boardEvaluation ? "盤面評価" : "カード評価"} />
      <div className="level-detail-list">
        {def.levels.map((level, index) => (
          <div className="level-detail" key={`${def.id}_${level.level}_${index}`}>
            <strong><Icon icon="✨" /> Lv{level.level} / <Icon icon="❤️" /> HP {level.maxHp}</strong>
            <ul>
              {level.commands.map((command, commandIndex) => (
                <li key={`${command.id}_${commandIndex}`}>
                  <span>{commandSummary(command)}</span>
                  <EffectBreakdown
                    compact
                    items={[
                      { label: "条件", text: commandConditionText(command) },
                      { label: "対象", text: rangeLabel(command.range, command.rangeText) },
                      { label: "持続", text: commandDurationText(command) },
                    ]}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function MemberRatingChips({ cardId }: { cardId: string }) {
  const ratings = [
    ["PRO黒", getCardMemberRating(cardId, "black")],
    ["PRO白", getCardMemberRating(cardId, "white")],
  ] as const;
  return (
    <>
      {ratings.map(([label, rating]) =>
        rating ? (
          <span className="card-chip" title={`部員評価 ${label} / ${rating.votes}票`} key={label}>
            {label} {rating.average.toFixed(1)}
          </span>
        ) : null,
      )}
    </>
  );
}

function UnitEvaluationPanel({ evaluation, title }: { evaluation: UnitEvaluation; title: string }) {
  return (
    <div className="unit-evaluation-panel">
      <div className="unit-evaluation-heading">
        <strong><Icon icon="📈" /> {title}</strong>
        <span className="unit-evaluation-total">
          {evaluation.grade} {evaluation.total}
        </span>
      </div>
      <div className="unit-evaluation-grid">
        {evaluation.breakdown.map((item) => (
          <span className={`unit-evaluation-chip ${item.tone}`} title={item.reason} key={item.key}>
            <span>{item.label}</span>
            <strong>{formatEvaluationValue(item.value)}</strong>
          </span>
        ))}
      </div>
      {evaluation.reasons.length > 0 && (
        <ul className="unit-evaluation-reasons">
          {evaluation.reasons.slice(0, 4).map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatEvaluationValue(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }
  return String(value);
}

function EffectBreakdown({
  items,
  compact = false,
}: {
  items: Array<{ label: string; text: string }>;
  compact?: boolean;
}) {
  return (
    <span className={`effect-breakdown ${compact ? "compact" : ""}`}>
      {items.map((item) => (
        <span className="effect-breakdown-chip" key={`${item.label}_${item.text}`}>
          <span>{item.label}</span>
          <strong>{item.text}</strong>
        </span>
      ))}
    </span>
  );
}

function CardNotes({ card, compact = false }: { card: ReturnType<typeof getCardDef>; compact?: boolean }) {
  const visibleNotes = getCardNoteDisplays(card);
  if (visibleNotes.length === 0) {
    return null;
  }

  return (
    <span className={`card-notes ${compact ? "compact" : ""}`}>
      {visibleNotes.map((note) => (
        <span className={`card-note card-note-${note.kind}`} key={`${note.kind}_${note.text}`}>
          <span className="card-note-label">{note.label}</span>
          <span className="card-note-text">{note.text}</span>
        </span>
      ))}
    </span>
  );
}

function MonsterTraitSummary({ cardId }: { cardId: string }) {
  const def = getCardDef(cardId);
  if (def.type !== "monster") {
    return null;
  }

  const traitNotes = getCardNoteDisplays(def)
    .filter((note) => note.kind === "personality")
    .map((note) => note.summary);
  if (traitNotes.length === 0) {
    return null;
  }

  return (
    <span className="monster-trait-line" title={traitNotes.join("\n")}>
      <Icon icon="🧬" /> {traitNotes.join(" / ")}
    </span>
  );
}

function commandSummary(command: CommandDef): string {
  return [
    `${commandIcon(command)} ${command.name} ${command.power}P`,
    rangeLabel(command.range, command.rangeText),
    command.stoneCost ? `Stone ${command.stoneCost}` : "",
    command.effectText ? `効果 ${command.effectText}` : "",
    command.recoilDamage ? `反動 ${command.recoilDamage}` : "",
  ].filter(Boolean).join(" / ");
}

function commandActionSummary(command: CommandDef): string {
  return [
    rangeLabel(command.range, command.rangeText),
    command.stoneCost ? `Stone ${command.stoneCost}` : "Stone 0",
    command.effectText ? command.effectText : "",
    command.recoilDamage ? `反動 ${command.recoilDamage}` : "",
  ].filter(Boolean).join(" / ");
}

function rangeLabel(range: string, rawRange?: string): string {
  if (range === "adjacent") {
    return "↔️ 隣接";
  }
  if (range === "one_skip") {
    return "🎯 射程2";
  }
  if (range === "any_monster") {
    return "◎ 任意モンスター";
  }
  if (range === "any_target") {
    return "✦ 任意対象";
  }
  if (range === "two_skip") {
    if (rawRange?.includes("１つ")) {
      return "🎯 射程2/3";
    }
    if (rawRange?.includes("桂馬")) {
      return "🎯 射程3/桂馬";
    }
    return "🎯 射程3";
  }
  if (range === "straight") {
    return `↕️ ${rawRange ?? "まっすぐ"}`;
  }
  if (range === "piercing") {
    return `⇈ ${rawRange ?? "貫通"}`;
  }
  if (range === "decreasing_straight") {
    return `↘️ ${rawRange ?? "減るまっすぐ"}`;
  }
  if (range === "line") {
    return `↔️ ${rawRange ?? "一直線"}`;
  }
  if (range === "special") {
    return rawRange ? `✨ ${rawRange}` : "✨ 特殊";
  }
  return "👑 マスター";
}

function targetKindsLabel(targetKinds: MagicTargetKind[]): string {
  if (targetKinds.length === 0) {
    return "カード効果";
  }
  return targetKinds
    .map((kind) => {
      if (kind === "ally_monster") {
        return "味方モンスター";
      }
      if (kind === "enemy_monster") {
        return "敵モンスター";
      }
      return "敵マスター";
    })
    .join(" / ");
}

function magicDurationText(def: MagicCardDef): string {
  if (def.continuance) {
    return def.continuance;
  }
  if (def.description.includes("次のターン") || def.description.includes("次ターン")) {
    return "次ターンまで";
  }
  if (def.description.includes("ずっと") || def.description.includes("永続")) {
    return "継続";
  }
  return "即時";
}

function commandConditionText(command: CommandDef): string {
  const conditions = [];
  if (command.stoneCost) {
    conditions.push(`Stone ${command.stoneCost}`);
  }
  if (command.recoilDamage) {
    conditions.push(`反動 ${command.recoilDamage}`);
  }
  if (command.implemented === false) {
    conditions.push("要確認");
  }
  return conditions.length > 0 ? conditions.join(" / ") : "行動可能時";
}

function commandDurationText(command: CommandDef): string {
  if (command.effectText?.includes("次")) {
    return "次回/次ターン";
  }
  if (command.effectText?.includes("ずっと") || command.effectText?.includes("継続")) {
    return "継続";
  }
  return command.effectText ? "効果依存" : "即時";
}

function slotLabel(slotKey: SlotKey): string {
  const [owner, row, lane] = slotKey.split("_");
  const ownerLabel = owner === "player" ? "P" : "C";
  const rowLabel = row === "front" ? "前" : "後";
  const laneLabel = lane === "left" ? "L" : "R";
  return `${ownerLabel}${rowLabel}${laneLabel}`;
}

interface IconProps {
  icon: string;
}

function Icon({ icon }: IconProps) {
  return <span className="ui-icon" aria-hidden="true">{icon}</span>;
}

interface CardIconProps {
  cardId: string;
}

function CardIcon({ cardId }: CardIconProps) {
  const iconPath = getCardIconPath(cardId);
  if (iconPath) {
    return <img className="card-image-icon" src={iconPath} alt="" aria-hidden="true" />;
  }
  return <Icon icon={cardIcon(cardId)} />;
}

function cardIcon(cardId: string): string {
  if (cardId === "takokke") {
    return "🔴";
  }
  if (cardId === "bomuzo") {
    return "💣";
  }
  if (cardId === "polyspinner") {
    return "⚙️";
  }
  if (cardId === "sigma") {
    return "✊";
  }
  if (cardId === "beyond") {
    return "🎯";
  }
  if (cardId === "yanbaru") {
    return "🏹";
  }
  if (cardId === "morgan") {
    return "✨";
  }
  if (cardId === "healing") {
    return "💚";
  }
  if (cardId === "thunder") {
    return "⚡";
  }
  if (cardId === "power_up") {
    return "⬆️";
  }
  return "◆";
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roleIcon(role: string): string {
  return role === "front" ? "🛡️" : "🏹";
}

function commandIcon(command: CommandDef): string {
  if (command.recoilDamage) {
    return "💣";
  }
  if (command.range === "one_skip") {
    return "🎯";
  }
  if (command.range === "any_target" || command.range === "any_monster") {
    return "✨";
  }
  return "⚔️";
}

function masterActionIcon(actionId: MasterActionId): string {
  if (actionId === "master_attack") {
    return "⚔️";
  }
  if (actionId === "wake_up") {
    return "⏰";
  }
  if (actionId === "shield") {
    return "🛡️";
  }
  if (actionId === "berserk_power") {
    return "🔥";
  }
  return "🌋";
}

function masterActionLabel(actionId: MasterActionId): string {
  return getMasterActionDef(actionId).name;
}

function logIcon(entry: string): string {
  if (entry.includes("勝利") || entry.includes("敗北")) {
    return "🏆";
  }
  if (entry.includes("倒れ") || entry.includes("ダメージ") || entry.includes("攻撃") || entry.includes("アタック") || entry.includes("大地の怒り")) {
    return "⚔️";
  }
  if (entry.includes("HPが") || entry.includes("山札切れ")) {
    return "❤️";
  }
  if (entry.includes("レベル") || entry.includes("Lv")) {
    return "✨";
  }
  if (entry.includes("召喚") || entry.includes("登場")) {
    return "🂠";
  }
  if (entry.includes("ため") || entry.includes("気合い")) {
    return "💪";
  }
  if (entry.includes("バーサク")) {
    return "🔥";
  }
  if (entry.includes("シールド") || entry.includes("ウェイクアップ") || entry.includes("回復")) {
    return "🛡️";
  }
  if (entry.includes("引いた")) {
    return "✋";
  }
  if (entry.includes("ストーン")) {
    return "🪨";
  }
  if (entry.includes("ターン")) {
    return "⏭️";
  }
  return "•";
}

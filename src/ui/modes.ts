export type BattleWorkspaceMode = "play" | "spectate" | "analyze";
export type SeatControllers = Readonly<Record<"player" | "cpu", "human" | "cpu">>;

export function isLivePrivateHumanBattle(input: {
  hasCurrentBattle: boolean;
  unfinished: boolean;
  controlPolicy: "legacy-workspace" | "fixed-seat" | undefined;
  controllerBySeat: SeatControllers | undefined;
}): boolean {
  return input.hasCurrentBattle
    && input.unfinished
    && input.controlPolicy === "fixed-seat"
    && input.controllerBySeat?.player === "human"
    && input.controllerBySeat.cpu === "human";
}

export function canRevealHand(playerId: "player" | "cpu", mode: BattleWorkspaceMode, viewerSeat?: "player" | "cpu" | null): boolean {
  if (viewerSeat !== undefined) return viewerSeat !== null && playerId === viewerSeat;
  return mode !== "play" || playerId === "player";
}

export function canRevealPreparedCard(owner: "player" | "cpu", mode: BattleWorkspaceMode, viewerSeat?: "player" | "cpu" | null): boolean {
  if (viewerSeat !== undefined) return viewerSeat !== null && owner === viewerSeat;
  return mode !== "play" || owner === "player";
}

export function sortDeckForDisplay<T extends { cardId: string }>(cards: readonly T[], mode: BattleWorkspaceMode): T[] {
  if (mode !== "play") {
    return [...cards];
  }
  return [...cards].sort((a, b) => a.cardId.localeCompare(b.cardId));
}

export function handCardCostLabel(def: { type: "magic"; cost: number } | { type: "monster" }): string {
  return def.type === "magic" ? `Stone ${def.cost}` : "召喚 Stone 1";
}

export function shouldHideHandList(isMobileViewport: boolean, handSheetOpen: boolean): boolean {
  return isMobileViewport && !handSheetOpen;
}

export function canRevealRemainingDeck(mode: BattleWorkspaceMode, viewerSeat?: "player" | "cpu" | null): boolean {
  if (viewerSeat !== undefined) return false;
  return mode !== "play";
}

export function displayLogEntry(entry: string, mode: BattleWorkspaceMode): string {
  if (mode !== "play") {
    return entry;
  }
  const decision = entry.match(/^(CPU|プレイヤーAI)判断:/);
  return decision ? `${decision[1]}判断: 行動を実行しました` : entry;
}

/** Masks private card identities in local-pass-and-play logs for the current human seat. */
export function maskPrivateSessionLogEntry(entry: string, viewerSeat: "player" | "cpu" | null): string {
  if (entry.startsWith("ランダム結果: カードサーチ ->")) {
    return "ランダム結果: カードサーチ -> 非公開情報";
  }
  if (entry.endsWith("を山札の最後に戻した")) {
    return "裏向きカードを山札の最後に戻した";
  }
  const hiddenLabels = viewerSeat === null ? ["プレイヤー", "CPU"] : [viewerSeat === "player" ? "CPU" : "プレイヤー"];
  for (const hiddenLabel of hiddenLabels) {
    if (!entry.startsWith(`${hiddenLabel}は`)) continue;
    if (entry.endsWith("を準備中で召喚した")) {
      return `${hiddenLabel}は裏向きカードを準備中で召喚した`;
    }
    if (entry.endsWith("を引いた")) {
      return `${hiddenLabel}はカードを引いた`;
    }
    if (entry.endsWith("を手札に入れた")) {
      return `${hiddenLabel}はカードを手札に入れた`;
    }
  }
  return entry;
}

export function displaySessionLogEntry(
  entry: string,
  mode: BattleWorkspaceMode,
  viewerSeat?: "player" | "cpu" | null,
): string {
  const modeSafeEntry = displayLogEntry(entry, viewerSeat !== undefined ? "play" : mode);
  return viewerSeat !== undefined ? maskPrivateSessionLogEntry(modeSafeEntry, viewerSeat) : modeSafeEntry;
}

export interface TargetedActionPreview {
  targetKey?: string;
  relatedTargetKeys?: readonly string[];
  summary: string;
  detail?: string;
  tone?: "ok" | "warn" | "danger";
  badge?: string;
  logs: string[];
}

const HIDDEN_TARGET_RESULT_SUMMARY = "裏向きカードへの結果は実行時に解決します。";

export function hidePrivateTargetPreviewDetails<T extends TargetedActionPreview>(
  previews: readonly T[],
  hiddenTargetKeys: ReadonlySet<string>,
  mode: BattleWorkspaceMode,
): T[] {
  if (mode !== "play" || hiddenTargetKeys.size === 0) {
    return [...previews];
  }
  return previews.map((preview) => {
    const targetKeys = [preview.targetKey, ...(preview.relatedTargetKeys ?? [])];
    if (!targetKeys.some((key) => key !== undefined && hiddenTargetKeys.has(key))) {
      return preview;
    }
    return {
      ...preview,
      summary: HIDDEN_TARGET_RESULT_SUMMARY,
      detail: undefined,
      tone: undefined,
      badge: undefined,
      logs: [],
    };
  });
}

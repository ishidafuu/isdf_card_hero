export type BattleWorkspaceMode = "play" | "spectate" | "analyze";

export function canRevealHand(playerId: "player" | "cpu", mode: BattleWorkspaceMode): boolean {
  return mode !== "play" || playerId === "player";
}

export function canRevealPreparedCard(owner: "player" | "cpu", mode: BattleWorkspaceMode): boolean {
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

export function canRevealRemainingDeck(mode: BattleWorkspaceMode): boolean {
  return mode !== "play";
}

export function displayLogEntry(entry: string, mode: BattleWorkspaceMode): string {
  if (mode !== "play") {
    return entry;
  }
  const decision = entry.match(/^(CPU|プレイヤーAI)判断:/);
  return decision ? `${decision[1]}判断: 行動を実行しました` : entry;
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

import type { GameState } from "../types";

type PendingLevelUp = NonNullable<GameState["pendingLevelUp"]>;

export type LevelUpChoice =
  | { kind: "skip" }
  | { kind: "level"; levels: number }
  | { kind: "super"; handInstanceId: string };

export function resolveLevelUpChoice(
  pending: PendingLevelUp,
  levels: number,
  superHandInstanceId?: string,
): LevelUpChoice {
  if (levels < 0 || levels > pending.maxLevels) {
    throw new Error("選択できないレベルアップ数です");
  }

  if (superHandInstanceId) {
    if (!pending.superOptions?.some((option) => option.handInstanceId === superHandInstanceId)) {
      throw new Error("選択できないスーパーカードです");
    }
    return { kind: "super", handInstanceId: superHandInstanceId };
  }

  if (levels > 0) {
    return { kind: "level", levels };
  }

  return { kind: "skip" };
}

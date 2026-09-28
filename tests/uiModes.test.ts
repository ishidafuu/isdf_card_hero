import { describe, expect, it } from "vitest";
import { canRevealHand, canRevealPreparedCard, displayLogEntry, handCardCostLabel, hidePrivateTargetPreviewDetails, shouldHideHandList, sortDeckForDisplay } from "../src/ui/modes";

describe("mode-dependent hidden information", () => {
  it("hides the opponent hand and prepared card in Play, and reveals both in review modes", () => {
    expect(canRevealHand("player", "play")).toBe(true);
    expect(canRevealHand("cpu", "play")).toBe(false);
    expect(canRevealHand("cpu", "spectate")).toBe(true);
    expect(canRevealHand("cpu", "analyze")).toBe(true);
    expect(canRevealPreparedCard("cpu", "play")).toBe(false);
    expect(canRevealPreparedCard("cpu", "spectate")).toBe(true);
    expect(canRevealPreparedCard("cpu", "analyze")).toBe(true);
  });

  it("keeps hidden deck order opaque by using a stable card-id sort only in Play", () => {
    const cards = [{ cardId: "z-card" }, { cardId: "a-card" }];
    expect(sortDeckForDisplay(cards, "play").map((card) => card.cardId)).toEqual(["a-card", "z-card"]);
    expect(sortDeckForDisplay(cards, "spectate").map((card) => card.cardId)).toEqual(["z-card", "a-card"]);
    expect(sortDeckForDisplay(cards, "analyze").map((card) => card.cardId)).toEqual(["z-card", "a-card"]);
    expect(cards.map((card) => card.cardId)).toEqual(["z-card", "a-card"]);
  });

  it("shows the real gameplay cost for magic and monster cards", () => {
    expect(handCardCostLabel({ type: "magic", cost: 3 })).toBe("Stone 3");
    expect(handCardCostLabel({ type: "monster" })).toBe("召喚 Stone 1");
  });

  it("only hides the collapsed hand sheet on mobile viewports", () => {
    expect(shouldHideHandList(true, false)).toBe(true);
    expect(shouldHideHandList(true, true)).toBe(false);
    expect(shouldHideHandList(false, false)).toBe(false);
  });

  it("masks CPU decision reasons in Play without changing stored or review-mode logs", () => {
    const privateLog = "CPU判断: タコッケーを使うため / 見送り候補: マジックカード";
    expect(displayLogEntry(privateLog, "play")).toBe("CPU判断: 行動を実行しました");
    expect(displayLogEntry(privateLog, "spectate")).toBe(privateLog);
    expect(displayLogEntry(privateLog, "analyze")).toBe(privateLog);
  });

  it("hides simulated outcomes for direct and secondary hidden targets only in Play", () => {
    const previews = [
      {
        key: "direct-hidden",
        targetKey: "monster:cpu_front_left",
        summary: "HP -4 / KO",
        detail: "裏向きカードが破壊された",
        tone: "danger" as const,
        badge: "KO",
        logs: ["HP 4->0"],
      },
      {
        key: "secondary-hidden",
        targetKey: "monster:player_front_left",
        relatedTargetKeys: ["monster:cpu_front_left"],
        summary: "特性: 反射ダメージ",
        detail: "反射でCPUマスターに2ダメージ",
        tone: "ok" as const,
        badge: "HP 2->0",
        logs: ["反射ダメージ 2"],
      },
      {
        key: "public-target",
        targetKey: "monster:player_front_right",
        summary: "HP -1",
        detail: "公開カードが傷つく",
        tone: "warn" as const,
        badge: "HP 3->2",
        logs: ["HP 3->2"],
      },
    ];
    const hiddenTargets = new Set(["monster:cpu_front_left"]);
    const play = hidePrivateTargetPreviewDetails(previews, hiddenTargets, "play");

    expect(play[0]).toMatchObject({ summary: "裏向きカードへの結果は実行時に解決します。", logs: [] });
    expect(play[0]).toMatchObject({ detail: undefined, tone: undefined, badge: undefined });
    expect(play[1]).toMatchObject({ summary: "裏向きカードへの結果は実行時に解決します。", logs: [] });
    expect(play[1]).toMatchObject({ detail: undefined, tone: undefined, badge: undefined });
    expect(play[2]).toEqual(previews[2]);
    expect(previews[0]).toMatchObject({ summary: "HP -4 / KO", logs: ["HP 4->0"] });
    expect(hidePrivateTargetPreviewDetails(previews, hiddenTargets, "analyze")).toEqual(previews);
  });
});

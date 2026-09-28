import { describe, expect, it } from "vitest";
import { canRevealHand, canRevealPreparedCard, canRevealRemainingDeck, displayLogEntry, displaySessionLogEntry, handCardCostLabel, hidePrivateTargetPreviewDetails, isLivePrivateHumanBattle, maskPrivateSessionLogEntry, shouldHideHandList, sortDeckForDisplay } from "../src/ui/modes";

describe("mode-dependent hidden information", () => {
  it("applies private-seat UI policy to every unfinished fixed-seat human-vs-human battle", () => {
    const controllers = { player: "human" as const, cpu: "human" as const };
    expect(isLivePrivateHumanBattle({
      hasCurrentBattle: true,
      unfinished: true,
      controlPolicy: "fixed-seat",
      controllerBySeat: controllers,
    })).toBe(true);
    expect(isLivePrivateHumanBattle({ hasCurrentBattle: false, unfinished: true, controlPolicy: "fixed-seat", controllerBySeat: controllers })).toBe(false);
    expect(isLivePrivateHumanBattle({ hasCurrentBattle: true, unfinished: false, controlPolicy: "fixed-seat", controllerBySeat: controllers })).toBe(false);
    expect(isLivePrivateHumanBattle({ hasCurrentBattle: true, unfinished: true, controlPolicy: "legacy-workspace", controllerBySeat: controllers })).toBe(false);
    expect(isLivePrivateHumanBattle({ hasCurrentBattle: true, unfinished: true, controlPolicy: "fixed-seat", controllerBySeat: { player: "human", cpu: "cpu" } })).toBe(false);
  });

  it("hides the opponent hand and prepared card in Play, and reveals both in review modes", () => {
    expect(canRevealHand("player", "play")).toBe(true);
    expect(canRevealHand("cpu", "play")).toBe(false);
    expect(canRevealHand("cpu", "spectate")).toBe(true);
    expect(canRevealHand("cpu", "analyze")).toBe(true);
    expect(canRevealHand("player", "play", "cpu")).toBe(false);
    expect(canRevealHand("cpu", "analyze", "cpu")).toBe(true);
    expect(canRevealHand("cpu", "play", null)).toBe(false);
    expect(canRevealHand("cpu", "play", "cpu")).toBe(true);
    expect(canRevealHand("player", "play", "cpu")).toBe(false);
    expect(canRevealPreparedCard("cpu", "play")).toBe(false);
    expect(canRevealPreparedCard("cpu", "spectate")).toBe(true);
    expect(canRevealPreparedCard("cpu", "analyze")).toBe(true);
    expect(canRevealPreparedCard("player", "play", "cpu")).toBe(false);
    expect(canRevealPreparedCard("cpu", "analyze", "cpu")).toBe(true);
    expect(canRevealPreparedCard("player", "play", null)).toBe(false);
    expect(canRevealPreparedCard("cpu", "play", "cpu")).toBe(true);
    expect(canRevealPreparedCard("player", "play", "cpu")).toBe(false);
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

  it("never reveals a remaining deck in Play, while review modes may reveal it", () => {
    expect(canRevealRemainingDeck("play")).toBe(false);
    expect(canRevealRemainingDeck("spectate")).toBe(true);
    expect(canRevealRemainingDeck("analyze")).toBe(true);
    expect(canRevealRemainingDeck("spectate", "cpu")).toBe(false);
    expect(canRevealRemainingDeck("analyze", "player")).toBe(false);
  });

  it("masks CPU decision reasons in Play without changing stored or review-mode logs", () => {
    const privateLog = "CPU判断: タコッケーを使うため / 見送り候補: マジックカード";
    expect(displayLogEntry(privateLog, "play")).toBe("CPU判断: 行動を実行しました");
    expect(displayLogEntry(privateLog, "spectate")).toBe(privateLog);
    expect(displayLogEntry(privateLog, "analyze")).toBe(privateLog);
  });

  it("masks private prepared and card-acquisition names symmetrically for local PvP viewers", () => {
    const playerPrivate = [
      "プレイヤーはドノマンティスを準備中で召喚した",
      "プレイヤーはドローフォースを引いた",
      "プレイヤーはモンスターからデスシープを手札に入れた",
    ];
    const cpuPrivate = [
      "CPUはデスシープを準備中で召喚した",
      "CPUはマジックカードを引いた",
      "CPUはモンスターからドノマンティスを手札に入れた",
    ];
    for (const log of playerPrivate) {
      expect(maskPrivateSessionLogEntry(log, "cpu")).not.toMatch(/ドノマンティス|デスシープ|ドローフォース/);
      expect(maskPrivateSessionLogEntry(log, "player")).toBe(log);
    }
    for (const log of cpuPrivate) {
      expect(maskPrivateSessionLogEntry(log, "player")).not.toMatch(/ドノマンティス|デスシープ/);
      expect(maskPrivateSessionLogEntry(log, "cpu")).toBe(log);
    }
    expect(maskPrivateSessionLogEntry("ランダム結果: カードサーチ -> モンスターからデスシープ", "cpu"))
      .toBe("ランダム結果: カードサーチ -> 非公開情報");
    expect(maskPrivateSessionLogEntry("プレイヤーはStone 2を得た", "cpu")).toBe("プレイヤーはStone 2を得た");
    expect(maskPrivateSessionLogEntry("ドノマンティスを山札の最後に戻した", "cpu"))
      .toBe("裏向きカードを山札の最後に戻した");
    expect(displaySessionLogEntry("CPU判断: ドノマンティスを選択", "play", "player"))
      .toBe("CPU判断: 行動を実行しました");
    expect(displaySessionLogEntry("CPU判断: デスシープを選択", "analyze", "player"))
      .toBe("CPU判断: 行動を実行しました");
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

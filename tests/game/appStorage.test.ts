import { describe, expect, it } from "vitest";
import {
  DEFAULT_WHITE_MATCH_DESCRIPTION,
  normalizeDeckTextInput,
  normalizeSavedBattlePresets,
  saveStorageSetting,
} from "../../src/App";
import { DEFAULT_CPU_AI_PROFILE } from "../../src/game/defaultAiProfiles";

describe("App storage boundaries", () => {
  it("keeps the default white match description aligned with the default CPU profile", () => {
    expect(DEFAULT_CPU_AI_PROFILE).toBe("white_v2");
    expect(DEFAULT_WHITE_MATCH_DESCRIPTION).toContain("CPUはWhite V2 AI");
  });

  it("does not let localStorage write failures escape into React effects", () => {
    const unavailableStorage = {
      setItem() {
        throw new Error("storage denied");
      },
    };

    expect(() => saveStorageSetting(unavailableStorage, "test-setting", "true")).not.toThrow();
  });

  it("drops malformed and duplicate saved presets while normalizing nested settings", () => {
    const presets = normalizeSavedBattlePresets([
      null,
      { id: "missing-settings", name: "broken" },
      {
        id: " valid-preset ",
        name: "  Valid  ",
        createdAt: 123,
        settings: {
          seed: "not-a-number",
          firstPlayer: "unknown",
          mode: "unknown",
          masterIds: { player: "invalid", cpu: "black" },
          aiProfiles: { player: "invalid", cpu: "stable_v1" },
        },
        deckSettings: {
          fixed: { player: true, cpu: "yes" },
          allowSpecial: { player: false },
          text: { player: 42, cpu: "card_001".repeat(5_000) },
        },
      },
      {
        id: "valid-preset",
        name: "duplicate",
        settings: {},
        deckSettings: {},
      },
    ]);

    expect(presets).toHaveLength(1);
    expect(presets[0]).toMatchObject({
      id: "valid-preset",
      name: "Valid",
      createdAt: "",
      settings: {
        seed: 20260612,
        seedInput: "20260612",
        firstPlayer: "player",
        mode: "player-vs-cpu",
        masterIds: { player: "white", cpu: "black" },
      },
      deckSettings: {
        fixed: { player: true, cpu: false },
        allowSpecial: { player: false, cpu: false },
      },
    });
    expect(typeof presets[0]?.deckSettings.text.player).toBe("string");
    expect(presets[0]?.deckSettings.text.cpu).toHaveLength(20_000);
  });

  it("bounds deck text before parse and render work can run", () => {
    const oversized = "card_001\n".repeat(3_000);
    expect(oversized.length).toBeGreaterThan(20_000);
    expect(normalizeDeckTextInput(oversized)).toHaveLength(20_000);
  });
});

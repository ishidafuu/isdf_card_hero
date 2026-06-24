import { describe, expect, it } from "vitest";
import { deckPresetAllowsSpecial, getDeckPreset } from "../../src/game/deckPresets";
import { DEFAULT_CPU_DECK_PRESET_ID, DEFAULT_PLAYER_DECK_PRESET_ID } from "../../src/game/defaultDeckPresets";

describe("default deck presets", () => {
  it("keeps the player default on the no-rare8 white baseline", () => {
    expect(DEFAULT_PLAYER_DECK_PRESET_ID).toBe("submission-pro-no-rare8-white-1377");
    expect(getDeckPreset(DEFAULT_PLAYER_DECK_PRESET_ID)).toMatchObject({
      masterId: "white",
      mode: "Pro 8なし",
    });
  });

  it("uses the selected white-vs-white winner as the CPU default", () => {
    expect(DEFAULT_CPU_DECK_PRESET_ID).toBe("submission-pro-with-rare8-white-1339");
    expect(getDeckPreset(DEFAULT_CPU_DECK_PRESET_ID)).toMatchObject({
      masterId: "white",
      sourceDeckId: 1339,
    });
    expect(deckPresetAllowsSpecial(DEFAULT_CPU_DECK_PRESET_ID)).toBe(true);
  });
});

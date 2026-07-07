import { describe, expect, it } from "vitest";
import { CPU_AI_PROFILES } from "../../src/game/cpuAiTypes";
import { createDefaultAiProfiles, DEFAULT_CPU_AI_PROFILE, DEFAULT_PLAYER_AI_PROFILE } from "../../src/game/defaultAiProfiles";

describe("default AI profiles", () => {
  it("keeps the enemy CPU on the current strongest white planner profile", () => {
    expect(DEFAULT_PLAYER_AI_PROFILE).toBe("stable");
    expect(DEFAULT_CPU_AI_PROFILE).toBe("white_planner");
    expect(CPU_AI_PROFILES).toContain(DEFAULT_CPU_AI_PROFILE);
    expect(createDefaultAiProfiles()).toEqual({
      player: DEFAULT_PLAYER_AI_PROFILE,
      cpu: DEFAULT_CPU_AI_PROFILE,
    });
  });
});

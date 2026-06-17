import { describe, expect, it } from "vitest";
import { AI_EVALUATION_WEIGHTS } from "../../src/game/aiWeights";

describe("ai evaluation weights", () => {
  it("keeps stable and strong as separately tunable profiles", () => {
    expect(AI_EVALUATION_WEIGHTS.strong).not.toEqual(AI_EVALUATION_WEIGHTS.stable);
    expect(AI_EVALUATION_WEIGHTS.strong.masterHp).toBeGreaterThan(AI_EVALUATION_WEIGHTS.stable.masterHp);
    expect(AI_EVALUATION_WEIGHTS.strong.stone).toBeLessThan(AI_EVALUATION_WEIGHTS.stable.stone);
    expect(AI_EVALUATION_WEIGHTS.strong.monsterKillBase).toBeLessThan(AI_EVALUATION_WEIGHTS.stable.monsterKillBase);
  });

  it("keeps white as a board and level-up focused profile", () => {
    expect(AI_EVALUATION_WEIGHTS.white.futureOwnLevelUp).toBeGreaterThan(AI_EVALUATION_WEIGHTS.stable.futureOwnLevelUp);
    expect(AI_EVALUATION_WEIGHTS.white.futureOpponentLevelUp).toBeGreaterThan(AI_EVALUATION_WEIGHTS.stable.futureOpponentLevelUp);
    expect(AI_EVALUATION_WEIGHTS.white.futureOwnThreatenedMonster).toBeGreaterThan(AI_EVALUATION_WEIGHTS.stable.futureOwnThreatenedMonster);
    expect(AI_EVALUATION_WEIGHTS.white.masterDamageBase).toBeLessThan(AI_EVALUATION_WEIGHTS.strong.masterDamageBase);
  });
});

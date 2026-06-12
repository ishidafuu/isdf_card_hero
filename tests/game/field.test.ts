import { describe, expect, it } from "vitest";
import {
  distanceBetweenSlots,
  isOpponentMasterInCommandRange,
  isTargetInCommandRange,
  rangedDistanceBetweenSlots,
} from "../../src/game/ruleEngine/field";
import type { CommandDef, SlotKey, SlotState } from "../../src/game/types";

function slot(key: SlotKey): SlotState {
  const [owner, row, lane] = key.split("_");
  return {
    key,
    owner: owner === "player" ? "player" : "cpu",
    row: row === "front" ? "front" : "back",
    lane: lane === "left" ? "left" : "right",
  };
}

function command(range: CommandDef["range"], rangeText?: string): CommandDef {
  return { id: `${range}_test`, name: "test", power: 1, range, rangeText };
}

describe("field range helpers", () => {
  it("keeps adjacent distance as board movement distance", () => {
    expect(distanceBetweenSlots(slot("player_front_left"), slot("player_back_left"))).toBe(1);
    expect(distanceBetweenSlots(slot("player_front_right"), slot("cpu_front_left"))).toBe(3);
  });

  it("treats range 2 as Chebyshev distance 2 across lanes and rows", () => {
    const attacker = slot("player_front_right");
    const target = slot("cpu_front_left");

    expect(rangedDistanceBetweenSlots(attacker, target)).toBe(2);
    expect(isTargetInCommandRange(attacker, target, command("one_skip"), "one_skip")).toBe(true);
  });

  it("lets range 3 reach from bottom-right to top-left", () => {
    const attacker = slot("player_back_right");
    const target = slot("cpu_back_left");

    expect(rangedDistanceBetweenSlots(attacker, target)).toBe(3);
    expect(isTargetInCommandRange(attacker, target, command("two_skip"), "two_skip")).toBe(true);
  });

  it("supports Pygmy style range 2 or 3 commands", () => {
    const attacker = slot("player_back_right");

    expect(isTargetInCommandRange(attacker, slot("cpu_front_left"), command("two_skip", "１つ＆２つ飛び"), "two_skip")).toBe(true);
    expect(isTargetInCommandRange(attacker, slot("cpu_back_left"), command("two_skip", "１つ＆２つ飛び"), "two_skip")).toBe(true);
  });

  it("checks monster to master range with the same distance rules", () => {
    expect(isOpponentMasterInCommandRange(slot("player_front_left"), "cpu", command("adjacent"), "adjacent")).toBe(true);
    expect(isOpponentMasterInCommandRange(slot("player_back_right"), "cpu", command("two_skip"), "two_skip")).toBe(false);
    expect(isOpponentMasterInCommandRange(slot("player_back_right"), "cpu", command("two_skip", "１つ＆２つ飛び"), "two_skip")).toBe(true);
  });
});

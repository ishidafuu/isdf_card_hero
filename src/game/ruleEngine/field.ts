import type { CommandDef, PlayerId, SlotState } from "../types";

interface BoardCoord {
  x: number;
  y: number;
}

export function distanceBetweenSlots(a: SlotState, b: SlotState): number {
  const ca = slotCoord(a);
  const cb = slotCoord(b);
  return manhattanDistance(ca, cb);
}

export function rangedDistanceBetweenSlots(a: SlotState, b: SlotState): number {
  const ca = slotCoord(a);
  const cb = slotCoord(b);
  return rangedDistance(ca, cb);
}

export function isTargetInCommandRange(
  attackerSlot: SlotState,
  targetSlot: SlotState,
  command: CommandDef,
  range: CommandDef["range"],
): boolean {
  if (range === "adjacent") {
    return distanceBetweenSlots(attackerSlot, targetSlot) === 1;
  }
  if (range === "one_skip") {
    return isOneSkipTarget(attackerSlot, targetSlot);
  }
  if (range === "two_skip") {
    return isTwoSkipTarget(attackerSlot, targetSlot, command.rangeText);
  }
  if (range === "straight" || range === "piercing" || range === "decreasing_straight") {
    return isStraightTarget(attackerSlot, targetSlot);
  }
  if (range === "line") {
    return isLineTarget(attackerSlot, targetSlot);
  }
  if (range === "special" && command.rangeText === "桂馬飛び") {
    return isKnightTarget(slotCoord(attackerSlot), slotCoord(targetSlot));
  }
  return false;
}

export function isOpponentMasterInCommandRange(
  attackerSlot: SlotState,
  opponent: PlayerId,
  command: CommandDef,
  range: CommandDef["range"],
): boolean {
  const distance = rangedDistance(slotCoord(attackerSlot), masterCoord(opponent));
  if (range === "adjacent") {
    return distance === 1;
  }
  if (range === "one_skip") {
    return distance === 2;
  }
  if (range === "two_skip") {
    if (command.rangeText?.includes("１つ")) {
      return distance === 2 || distance === 3;
    }
    return distance === 3;
  }
  if (range === "line") {
    const attacker = slotCoord(attackerSlot);
    const master = masterCoord(opponent);
    return attacker.x === master.x || attacker.y === master.y;
  }
  if (range === "special" && command.rangeText === "桂馬飛び") {
    return isKnightTarget(slotCoord(attackerSlot), masterCoord(opponent));
  }
  return false;
}

function slotCoord(slot: SlotState): BoardCoord {
  const x = slot.lane === "left" ? 0 : 2;
  if (slot.owner === "cpu") {
    return { x, y: slot.row === "back" ? 0 : 1 };
  }
  return { x, y: slot.row === "front" ? 2 : 3 };
}

function masterCoord(playerId: PlayerId): BoardCoord {
  return { x: 1, y: playerId === "cpu" ? 1 : 2 };
}

function manhattanDistance(a: BoardCoord, b: BoardCoord): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function rangedDistance(a: BoardCoord, b: BoardCoord): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

function isOneSkipTarget(attackerSlot: SlotState, targetSlot: SlotState): boolean {
  return rangedDistanceBetweenSlots(attackerSlot, targetSlot) === 2;
}

function isTwoSkipTarget(attackerSlot: SlotState, targetSlot: SlotState, rangeText?: string): boolean {
  const attacker = slotCoord(attackerSlot);
  const target = slotCoord(targetSlot);
  const distance = rangedDistance(attacker, target);
  if (rangeText?.includes("１つ")) {
    return distance === 2 || distance === 3;
  }
  if (rangeText?.includes("桂馬")) {
    return distance === 3 || isKnightTarget(attacker, target);
  }
  return distance === 3;
}

function isStraightTarget(attackerSlot: SlotState, targetSlot: SlotState): boolean {
  const attacker = slotCoord(attackerSlot);
  const target = slotCoord(targetSlot);
  if (attacker.x !== target.x) {
    return false;
  }
  return isForward(attackerSlot.owner, attacker.y, target.y);
}

function isLineTarget(attackerSlot: SlotState, targetSlot: SlotState): boolean {
  const attacker = slotCoord(attackerSlot);
  const target = slotCoord(targetSlot);
  return attacker.x === target.x || attacker.y === target.y;
}

function isKnightTarget(attacker: BoardCoord, target: BoardCoord): boolean {
  const dx = Math.abs(attacker.x - target.x);
  const dy = Math.abs(attacker.y - target.y);
  return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

function isForward(owner: PlayerId, fromY: number, toY: number): boolean {
  return owner === "player" ? toY < fromY : toY > fromY;
}

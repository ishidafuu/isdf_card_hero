import type { GameState, Lane, PlayerId, Row, SlotKey, SlotState } from "../types";

export function drillBreakPartnerSlotKey(state: GameState, attackerSlot: SlotState): SlotKey | undefined {
  const attacker = attackerSlot.monster;
  if (!attacker) {
    return undefined;
  }
  const requirement = attacker.cardId === "card_107"
    ? { partnerCardId: "card_108", attackerLane: "right" as const, partnerLane: "left" as const }
    : attacker.cardId === "card_108"
      ? { partnerCardId: "card_107", attackerLane: "left" as const, partnerLane: "right" as const }
      : undefined;
  if (!requirement || attackerSlot.row !== "front" || attackerSlot.lane !== requirement.attackerLane) {
    return undefined;
  }
  const partnerSlotKey = makeSlotKey(attacker.owner, "front", requirement.partnerLane);
  const partner = state.slots[partnerSlotKey].monster;
  return partner?.cardId === requirement.partnerCardId &&
    partner.status === "active" &&
    partner.actionCount < partner.actionLimit
    ? partnerSlotKey
    : undefined;
}

export function isPrimaryDrillBreakAttacker(slot: SlotState): boolean {
  return slot.monster?.cardId === "card_107";
}

function makeSlotKey(owner: PlayerId, row: Row, lane: Lane): SlotKey {
  return `${owner}_${row}_${lane}` as SlotKey;
}

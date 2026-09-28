export function cardArtPath(sourceNo) {
  if (!Number.isInteger(sourceNo) || sourceNo < 1 || sourceNo > 150) {
    throw new Error(`Invalid card source number: ${sourceNo}`);
  }
  return `/art/cards/card_${String(sourceNo).padStart(3, "0")}.png`;
}

export function validateCardSourceRecords(cards) {
  if (!Array.isArray(cards)) {
    return { ok: false, reason: "Card import result is not an array." };
  }
  const sourceNos = cards.map((card) => card?.sourceNo);
  const cardIds = cards.map((card) => card?.id);
  const uniqueSourceNos = new Set(sourceNos);
  const uniqueCardIds = new Set(cardIds);
  const completeRange = cards.length === 150 &&
    uniqueSourceNos.size === 150 &&
    Array.from({ length: 150 }, (_, index) => index + 1).every((sourceNo) => uniqueSourceNos.has(sourceNo));
  if (!completeRange || uniqueCardIds.size !== 150 || cardIds.some((cardId) => typeof cardId !== "string" || !cardId)) {
    return {
      ok: false,
      reason: `expected exactly 150 unique cards with sourceNo 1..150; received ${cards.length} cards and ${uniqueSourceNos.size} unique source numbers.`,
    };
  }
  return { ok: true };
}

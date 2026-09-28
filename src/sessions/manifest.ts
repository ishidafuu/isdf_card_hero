import { CPU_AI_PROFILES } from "../game/cpuAiTypes";
import { isExperimentContextV1 } from "../game/experimentalContext";
import { summarizeDeckCardIds } from "../game/cards";
import type { PlayerId } from "../game/types";
import {
  SESSION_MANIFEST_FORMAT,
  SESSION_MANIFEST_VERSION,
  type SessionError,
  type SessionKind,
  type SessionManifest,
  type SessionResult,
} from "./types";

export interface ManifestValidationOptions {
  allowEmptyDraftDecks?: boolean;
}

export function validateSessionManifest(value: unknown, options: ManifestValidationOptions = {}): SessionResult<SessionManifest> {
  if (!isRecord(value)) return fail("INVALID_MANIFEST", "manifestはobjectである必要があります。");
  const allowed = ["format", "version", "id", "kind", "createdAt", "seed", "firstPlayer", "profiles", "masters", "decks", "controllerBySeat", "controlPolicy", "opponentKnowledgePolicy", "experimentalContext", "challengeDefinition"];
  if (!hasOnlyKeys(value, allowed)) return fail("INVALID_MANIFEST", "manifestに未知のfieldがあります。");
  if (value.format !== SESSION_MANIFEST_FORMAT || value.version !== SESSION_MANIFEST_VERSION) {
    return fail("UNSUPPORTED_VERSION", "未対応のsession manifest format/versionです。");
  }
  if (!isSessionKind(value.kind)) return fail("INVALID_MANIFEST", "session kindが不正です。", "kind");
  if (!validId(value.id) || !isIsoTimestamp(value.createdAt)) return fail("INVALID_MANIFEST", "idまたはcreatedAtが不正です。");
  if (!Number.isSafeInteger(value.seed) || Number(value.seed) < 0 || Number(value.seed) > 999_999_999) return fail("INVALID_MANIFEST", "seedが不正です。", "seed");
  if (value.firstPlayer !== "player" && value.firstPlayer !== "cpu") return fail("INVALID_MANIFEST", "firstPlayerが不正です。", "firstPlayer");
  if (!isSeatRecord(value.profiles, (entry) => CPU_AI_PROFILES.includes(entry as (typeof CPU_AI_PROFILES)[number]))) return fail("INVALID_MANIFEST", "AI profilesが不正です。", "profiles");
  if (!isSeatRecord(value.masters, (entry) => entry === "white" || entry === "black")) return fail("INVALID_MANIFEST", "mastersが不正です。", "masters");
  if (!isSeatRecord(value.controllerBySeat, (entry) => entry === "human" || entry === "cpu")) return fail("INVALID_MANIFEST", "controllerBySeatが不正です。", "controllerBySeat");
  if (value.controlPolicy !== "legacy-workspace" && value.controlPolicy !== "fixed-seat") return fail("INVALID_MANIFEST", "controlPolicyが不正です。", "controlPolicy");
  if (value.kind !== "battle" && value.controlPolicy !== "fixed-seat") return fail("INVALID_MANIFEST", "通常battle以外のsessionはfixed-seatである必要があります。", "controlPolicy");
  if (value.opponentKnowledgePolicy !== "known_deck" && value.opponentKnowledgePolicy !== "unknown_composition") return fail("INVALID_MANIFEST", "opponentKnowledgePolicyが不正です。", "opponentKnowledgePolicy");
  const expectedKnowledge = value.kind === "draft" || value.kind === "sealed" || value.kind === "local-pvp" ? "unknown_composition" : "known_deck";
  const branchBattleMayRetainSourcePolicy = value.kind === "battle" && value.controlPolicy === "fixed-seat";
  if (!branchBattleMayRetainSourcePolicy && value.opponentKnowledgePolicy !== expectedKnowledge) return fail("INVALID_MANIFEST", "opponentKnowledgePolicyがkindと整合しません。", "opponentKnowledgePolicy");
  const controllerBySeat = value.controllerBySeat as Record<PlayerId, unknown>;
  if (value.kind === "local-pvp" && (controllerBySeat.player !== "human" || controllerBySeat.cpu !== "human")) {
    return fail("INVALID_MANIFEST", "local PvP manifestは両seatがhumanである必要があります。", "controllerBySeat");
  }
  if (!isDeckRecord(value.decks)) return fail("INVALID_MANIFEST", "decksが不正です。", "decks");
  for (const seat of ["player", "cpu"] as const) {
    const deck = value.decks[seat];
    const allowEmpty = options.allowEmptyDraftDecks && (value.kind === "draft" || value.kind === "sealed") && deck.cardIds.length === 0;
    if (!allowEmpty && !summarizeDeckCardIds(deck.cardIds, [], { allowSpecial: deck.allowSpecial }).valid) {
      return fail("INVALID_MANIFEST", "deck snapshotはengineの合法性ルールに適合しません。", `decks.${seat}.cardIds`);
    }
  }
  const allowsExperimentalContext = value.kind === "experimental" || (value.kind === "battle" && value.controlPolicy === "fixed-seat");
  if (value.kind === "experimental" && !isExperimentContextV1(value.experimentalContext)) return fail("UNSUPPORTED_SESSION", "experimental context version/valueが未対応です。", "experimentalContext");
  if (value.experimentalContext !== undefined && (!allowsExperimentalContext || !isExperimentContextV1(value.experimentalContext))) {
    return fail("INVALID_MANIFEST", "experimentalContextはexperimental sessionまたはfixed-seat branchに限られます。", "experimentalContext");
  }
  const definition = expectedDefinition(value.kind, value);
  if (definition === false || (definition && (!isRecord(value.challengeDefinition) || !hasOnlyKeys(value.challengeDefinition, ["id", "version"]) || value.challengeDefinition.id !== definition.id || value.challengeDefinition.version !== definition.version))) {
    return fail("INVALID_MANIFEST", "challengeDefinitionがsession kindと一致しません。", "challengeDefinition");
  }
  if (!definition && value.challengeDefinition !== undefined) return fail("INVALID_MANIFEST", "このsession kindではchallengeDefinitionを許可しません。", "challengeDefinition");
  return { ok: true, value: value as unknown as SessionManifest };
}

export function isSessionKind(value: unknown): value is SessionKind {
  return value === "battle" || value === "daily" || value === "puzzle" || value === "gauntlet" || value === "draft" || value === "sealed" || value === "local-pvp" || value === "experimental";
}

function expectedDefinition(kind: SessionKind, value: Record<string, unknown>): { id: string; version: number } | false | undefined {
  if (kind === "battle" || kind === "local-pvp" || kind === "experimental") return undefined;
  if (!isRecord(value.challengeDefinition) || !validId(value.challengeDefinition.id) || !Number.isSafeInteger(value.challengeDefinition.version) || Number(value.challengeDefinition.version) < 1) return false;
  if (kind === "daily" || kind === "puzzle" || kind === "gauntlet" || kind === "draft" || kind === "sealed") return { id: value.challengeDefinition.id, version: Number(value.challengeDefinition.version) };
  return undefined;
}

function isDeckRecord(value: unknown): value is Record<PlayerId, { cardIds: string[]; allowSpecial: boolean; sourcePresetId?: string }> {
  if (!isRecord(value) || !hasOnlyKeys(value, ["player", "cpu"])) return false;
  return (["player", "cpu"] as const).every((seat) => {
    const deck = value[seat];
    if (!isRecord(deck) || !hasOnlyKeys(deck, ["cardIds", "allowSpecial", "sourcePresetId"])) return false;
    if (!Array.isArray(deck.cardIds) || deck.cardIds.length > 60 || deck.cardIds.some((id) => !validId(id))) return false;
    if (typeof deck.allowSpecial !== "boolean") return false;
    return deck.sourcePresetId === undefined || validId(deck.sourcePresetId);
  });
}

function isSeatRecord(value: unknown, isValue: (entry: unknown) => boolean): boolean {
  return isRecord(value) && hasOnlyKeys(value, ["player", "cpu"]) && isValue(value.player) && isValue(value.cpu);
}
function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean { return Object.keys(value).every((key) => keys.includes(key)); }
function isRecord(value: unknown): value is Record<string, unknown> { return value !== null && typeof value === "object" && !Array.isArray(value); }
function validId(value: unknown): value is string { return typeof value === "string" && value.length > 0 && value.length <= 128 && !hasControlCharacters(value); }
function hasControlCharacters(value: string): boolean { return Array.from(value).some((character) => character.charCodeAt(0) < 0x20 || character.charCodeAt(0) === 0x7f); }
function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d\d)-(\d\d)T/.exec(value);
  if (!match || !Number.isFinite(Date.parse(value))) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}
function fail<T = never>(code: SessionError["code"], message: string, path?: string): SessionResult<T> {
  return { ok: false, error: { code, message, ...(path ? { path } : {}) } };
}

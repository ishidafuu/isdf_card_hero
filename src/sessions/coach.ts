import { hashBattleState, seekBattleJournalAtCursors } from "../replay/battleJournal";
import type { BattleCommand, BattleJournal } from "../replay/types";
import type { GameState, PlayerId, Target } from "../game/types";
import type { SessionBattleResult } from "./types";

const MAX_COACH_OBSERVATIONS = 24;

export interface PostgameCoachRequest {
  /** Must be the completed journal, not an unverified archive/progress object. */
  journal: BattleJournal;
  result: SessionBattleResult;
  seat: PlayerId;
}

export interface PostgameCoachObservation {
  commandSequence: number;
  actorSeat: PlayerId;
  turnNumber: number;
  action: Readonly<Record<string, string | number | boolean | null>>;
  before: PostgamePublicStateSummary;
  after: PostgamePublicStateSummary;
  review?: { kind: "ai" | "human"; actionKey: string; recordedReason?: string };
  replayLink: {
    verifiedJournalHeadHash: string;
    cursorBefore: number;
    cursorBeforeHash: string;
    seat: PlayerId;
  };
}

export interface PostgamePublicStateSummary {
  currentPlayer: PlayerId;
  turnNumber: number;
  winner: PlayerId | null;
  masters: Record<PlayerId, { id: string; hp: number; stones: number; handCount: number; deckCount: number; discardCount: number }>;
  board: Array<{
    slot: string;
    owner: PlayerId;
    status: "active" | "prepared";
    cardId?: string;
    level?: number;
    hp?: number;
    actionCount?: number;
    actionLimit?: number;
  }>;
}

export interface PostgameCoachReport {
  format: "isdf-card-hero-postgame-coach";
  version: 1;
  seat: PlayerId;
  winner: PlayerId | "draw";
  verifiedHeadHash: string;
  observations: PostgameCoachObservation[];
  heuristics: Array<{ kind: "heuristic"; commandSequence: number; text: string }>;
  reviewedCommandCount: number;
  sampledCommandCount: number;
  caveat: "これは公開局面・記録済み判断に基づく振り返りであり、最善手や勝率を保証しません。";
}

export type PostgameCoachResult =
  | { ok: true; value: PostgameCoachReport }
  | { ok: false; error: { code: "INCOMPLETE" | "INVALID_RESULT" | "REPLAY_FAILED"; message: string } };

/**
 * Builds a grounded postgame review from a replay-verified completed journal.
 * It deliberately does not inspect hidden hand/deck identities, RNG, or archive progress.
 */
export function createPostgameCoachReport(request: PostgameCoachRequest): PostgameCoachResult {
  const { journal, result, seat } = request;
  if (journal.completeness.status !== "complete") {
    return { ok: false, error: { code: "INCOMPLETE", message: "不完全な対局記録はコーチ分析に使えません。" } };
  }
  if (journal.commands.length === 0 || journal.initialState.winner !== undefined) {
    return { ok: false, error: { code: "INVALID_RESULT", message: "開始時点ですでに終局したjournalやcommandのないjournalは対局後分析に使えません。" } };
  }
  const ownCommands = journal.commands.filter((command) => command.playerId === seat);
  const selected = sampleCommands(ownCommands, MAX_COACH_OBSERVATIONS);
  const cursors = new Set<number>([journal.commands.length]);
  for (const command of selected) {
    cursors.add(command.sequence - 1);
    cursors.add(command.sequence);
  }
  const replay = seekBattleJournalAtCursors(journal, [...cursors]);
  if (!replay.ok) {
    return { ok: false, error: { code: "REPLAY_FAILED", message: `対局記録を検証できません: ${replay.error.message}` } };
  }
  const finalSnapshot = replay.value.get(journal.commands.length);
  if (!finalSnapshot) {
    return { ok: false, error: { code: "REPLAY_FAILED", message: "対局末尾の検証済みsnapshotがありません。" } };
  }
  const finalState = finalSnapshot.state;
  if (finalState.winner === undefined || !Number.isSafeInteger(result.turns) ||
      result.turns !== finalState.turnNumber || !isIsoTimestamp(result.completedAt)) {
    return { ok: false, error: { code: "INVALID_RESULT", message: "resultが完了済みjournalの勝者・turn・完了時刻を示していません。" } };
  }
  const actualWinner = finalState.winner;
  const actualHeadHash = hashBattleState(finalState);
  if (actualHeadHash !== result.headHash || actualWinner !== result.winner) {
    return { ok: false, error: { code: "INVALID_RESULT", message: "対局結果の勝者またはhead hashがjournal末尾と一致しません。" } };
  }

  const observations: PostgameCoachObservation[] = [];
  const heuristics: PostgameCoachReport["heuristics"] = [];
  let reviewedCommandCount = 0;

  for (const command of selected) {
    const beforeSnapshot = replay.value.get(command.sequence - 1);
    const afterSnapshot = replay.value.get(command.sequence);
    if (!beforeSnapshot || !afterSnapshot) {
      return { ok: false, error: { code: "REPLAY_FAILED", message: `command ${command.sequence} の再生局面を検証できません。` } };
    }
    const beforeState = beforeSnapshot.state;
    const afterState = afterSnapshot.state;
    const review = findReviewForCommand(afterState, beforeState, command, seat);
    if (review) reviewedCommandCount += 1;
    observations.push({
      commandSequence: command.sequence,
      actorSeat: seat,
      turnNumber: beforeState.turnNumber,
      action: summarizeCommand(command),
      before: summarizePublicState(beforeState),
      after: summarizePublicState(afterState),
      ...(review ? { review } : {}),
      replayLink: {
        verifiedJournalHeadHash: result.headHash,
        cursorBefore: command.sequence - 1,
        cursorBeforeHash: hashBattleState(beforeState),
        seat,
      },
    });
    if (commandActionType(command) === "end_turn") {
      const remainingActions = countPublicUnusedActionMonsters(beforeState, seat);
      if (remainingActions > 0) {
        heuristics.push({
          kind: "heuristic",
          commandSequence: command.sequence,
          text: `ターン終了時点で行動回数が残っている味方が${remainingActions}体いました。これは未使用回数の観測で、凍結・対象不在などで合法行動があったことを保証しません。振り返り候補として盤面を確認できます（温存が正解の場合もあります）。`,
        });
      }
    }
  }

  return {
    ok: true,
    value: {
      format: "isdf-card-hero-postgame-coach",
      version: 1,
      seat,
      winner: result.winner,
      verifiedHeadHash: result.headHash,
      observations,
      heuristics,
      reviewedCommandCount,
      sampledCommandCount: selected.length,
      caveat: "これは公開局面・記録済み判断に基づく振り返りであり、最善手や勝率を保証しません。",
    },
  };
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function sampleCommands(commands: readonly BattleCommand[], maximum: number): BattleCommand[] {
  if (commands.length <= maximum) return [...commands];
  if (maximum <= 1) return [commands[commands.length - 1]];
  const indexes = new Set<number>();
  for (let index = 0; index < maximum; index += 1) {
    indexes.add(Math.round(index * (commands.length - 1) / (maximum - 1)));
  }
  return [...indexes].sort((left, right) => left - right).map((index) => commands[index]);
}

function summarizeCommand(command: BattleCommand): Record<string, string | number | boolean | null> {
  const action = command.controller === "ai" ? command.decision : command.action;
  const result: Record<string, string | number | boolean | null> = { kind: action.type };
  if (action.type === "attack") {
    result.attackerSlot = action.action.attackerSlotKey;
    result.command = action.action.commandId;
    result.target = summarizeTarget(action.action.target);
  } else if (action.type === "master_action") {
    result.masterAction = action.actionId;
    result.target = summarizeTarget(action.target);
  } else if (action.type === "experimental_master_action") {
    result.experimentalMaster = action.master;
    result.masterAction = action.actionId;
    result.target = summarizeTarget(action.target);
  } else if (action.type === "summon") {
    result.destination = action.slotKey;
  } else if (action.type === "magic") {
    result.target = summarizeTarget(action.action.target);
  } else if (action.type === "move") {
    result.from = action.fromSlotKey;
    result.to = action.toSlotKey;
  } else if (action.type === "focus") {
    result.slot = action.slotKey;
  } else if (action.type === "resolve_level_up") {
    result.levels = action.levels;
    result.usedSuper = Boolean(action.superHandInstanceId);
  } else if (action.type === "end_turn") {
    result.discardCount = action.discardHandInstanceIds?.length ?? 0;
  }
  return result;
}

function commandActionType(command: BattleCommand): string {
  return command.controller === "ai" ? command.decision.type : command.action.type;
}

function summarizeTarget(target: Target): string {
  return target.kind === "monster" ? `monster:${target.slotKey}` : `master:${target.playerId}`;
}

export function summarizePublicState(state: GameState): PostgamePublicStateSummary {
  const board: PostgamePublicStateSummary["board"] = [];
  for (const [slot, slotState] of Object.entries(state.slots)) {
    const monster = slotState.monster;
    if (!monster) continue;
    if (monster.status === "prepared") {
      board.push({ slot, owner: monster.owner, status: "prepared" });
    } else {
      board.push({
        slot,
        owner: monster.owner,
        status: "active",
        cardId: monster.cardId,
        level: monster.level,
        hp: monster.hp,
        actionCount: monster.actionCount,
        actionLimit: monster.actionLimit,
      });
    }
  }
  return {
    currentPlayer: state.currentPlayer,
    turnNumber: state.turnNumber,
    winner: state.winner ?? null,
    masters: {
      player: {
        id: state.players.player.masterId,
        hp: state.players.player.masterHp,
        stones: state.players.player.stones,
        handCount: state.players.player.hand.length,
        deckCount: state.players.player.deck.length,
        discardCount: state.players.player.discard.length,
      },
      cpu: {
        id: state.players.cpu.masterId,
        hp: state.players.cpu.masterHp,
        stones: state.players.cpu.stones,
        handCount: state.players.cpu.hand.length,
        deckCount: state.players.cpu.deck.length,
        discardCount: state.players.cpu.discard.length,
      },
    },
    board,
  };
}

function countPublicUnusedActionMonsters(state: GameState, seat: PlayerId): number {
  return Object.values(state.slots).filter(({ monster }) =>
    monster?.owner === seat && monster.status === "active" && monster.actionCount < monster.actionLimit,
  ).length;
}

function findReviewForCommand(
  after: GameState,
  before: GameState,
  command: BattleCommand,
  seat: PlayerId,
): PostgameCoachObservation["review"] {
  const logIndex = before.logOffset !== undefined
    ? before.logOffset + before.log.length + 1
    : (before.eventLog?.length ?? before.log.length) + 1;
  if (command.controller === "ai") {
    const entry = after.aiDecisionHistory?.find((candidate) =>
      candidate.playerId === seat && candidate.logIndex === logIndex,
    );
    return entry ? {
      kind: "ai",
      actionKey: safeReviewActionKey(command),
      recordedReason: entry.decision.reason,
    } : undefined;
  }
  const humanEntry = after.humanActionHistory?.find((candidate) =>
    candidate.playerId === seat && candidate.logIndex === logIndex,
  );
  return humanEntry ? { kind: "human", actionKey: safeReviewActionKey(command) } : undefined;
}

function safeReviewActionKey(command: BattleCommand): string {
  return JSON.stringify(summarizeCommand(command));
}

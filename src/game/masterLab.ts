import { getCardDef, getCardName } from "./cards";
import { evaluateState } from "./cpuAi";
import { MASTER_ACTION_DEFS } from "./masters";
import { cloneState } from "./ruleEngine/state";
import {
  getMagicSecondaryTargets,
  getMagicTargets,
  getMasterActionTargets,
  opponentOf,
  playMagic,
  targetToKey,
  useMasterAction,
} from "./rules";
import type { GameState, MasterActionId, PlayerId, Target } from "./types";

export type MasterLabCandidateId = "decoy" | "sacrifice" | "timing";
export type MasterLabCandidateStatus = "design" | "rules_probe" | "ai_probe" | "candidate";
export type MasterLabActionKind = "builtin" | "magic_ref" | "experimental_effect";
export type MasterLabSeat = PlayerId;
export type MasterLabBaselineMasterId = "white" | "black";
export type MasterLabOpponentId = MasterLabBaselineMasterId | MasterLabCandidateId;

export interface MasterLabBuiltinAction {
  id: string;
  name: string;
  kind: "builtin";
  actionId: MasterActionId;
  cost?: number;
  notes: string;
}

export interface MasterLabMagicRefAction {
  id: string;
  name: string;
  kind: "magic_ref";
  cardId: string;
  cost?: number;
  notes: string;
}

export interface MasterLabExperimentalAction {
  id: string;
  name: string;
  kind: "experimental_effect";
  effectId: string;
  cost: number;
  summary: string;
  notes: string;
}

export type MasterLabAction = MasterLabBuiltinAction | MasterLabMagicRefAction | MasterLabExperimentalAction;

export interface MasterLabCandidate {
  id: MasterLabCandidateId;
  name: string;
  stance: string;
  status: MasterLabCandidateStatus;
  goal: string;
  actions: readonly MasterLabAction[];
  risks: readonly string[];
  aiNotes: readonly string[];
  acceptanceCriteria: readonly string[];
}

export interface MasterLabRoadmapPhase {
  id: string;
  title: string;
  status: "done" | "active" | "next" | "later";
  exitCriteria: readonly string[];
}

export interface MasterLabMatchup {
  candidateId: MasterLabCandidateId;
  challengerSeat: MasterLabSeat;
  opponentId: MasterLabOpponentId;
  purpose: string;
  recommendedGames: number;
}

export type MasterLabValidationSeverity = "error" | "warning";

export interface MasterLabValidationIssue {
  severity: MasterLabValidationSeverity;
  candidateId?: MasterLabCandidateId;
  actionId?: string;
  message: string;
}

export interface MasterLabActionOption {
  candidateId: MasterLabCandidateId;
  actionId: string;
  actionName: string;
  kind: MasterLabActionKind;
  cost: number;
  target: Target;
  secondaryTarget?: Target;
  summary: string;
}

export interface MasterLabActionInput {
  candidateId: MasterLabCandidateId;
  actionId: string;
  target: Target;
  secondaryTarget?: Target;
}

export interface MasterLabActionEvaluation {
  option: MasterLabActionOption;
  stateScoreDelta: number;
  heuristicScore: number;
  totalScore: number;
  reason: string;
  after: GameState;
}

const MASTER_LAB_VIRTUAL_CARD_PREFIX = "__master_lab_virtual__";

export const MASTER_LAB_ROADMAP: readonly MasterLabRoadmapPhase[] = [
  {
    id: "phase_0",
    title: "設計台帳",
    status: "done",
    exitCriteria: ["候補定義をコード化する", "参照カードとコストを静的検証する"],
  },
  {
    id: "phase_1",
    title: "既存魔法参照",
    status: "done",
    exitCriteria: ["magic_ref 特技を実戦で解決できる", "カード本体と特技側コストを分離する"],
  },
  {
    id: "phase_2",
    title: "実験ランナー",
    status: "done",
    exitCriteria: ["white/black との座席入れ替えマトリクスを100戦単位で回せる"],
  },
  {
    id: "phase_3",
    title: "CPU AI 評価",
    status: "done",
    exitCriteria: ["実験特技の合法手列挙と評価理由が出る"],
  },
  {
    id: "phase_4",
    title: "シナリオテスト",
    status: "active",
    exitCriteria: ["バーサク詰め、主力保護、ロック化回避の盤面テストがある"],
  },
  {
    id: "phase_5",
    title: "本採用判定",
    status: "next",
    exitCriteria: ["failure 0 の実戦レポートと本線移植方針がある"],
  },
];

export const MASTER_LAB_CANDIDATES: readonly MasterLabCandidate[] = [
  {
    id: "decoy",
    name: "デコイマスター",
    stance: "攻撃誘導型",
    status: "rules_probe",
    goal: "相手の攻撃を止めず、当たり先をずらして損な攻撃に変える。",
    actions: [
      {
        id: "master_attack",
        name: "マスターアタック",
        kind: "builtin",
        actionId: "master_attack",
        cost: 3,
        notes: "既存マスターと同じ基準点。",
      },
      {
        id: "provoke",
        name: "挑発",
        kind: "magic_ref",
        cardId: "card_097",
        cost: 3,
        notes: "手札消費なしの特技化ではロック化を避けるため、カード本体より重めに見る。",
      },
      {
        id: "scapegoat",
        name: "スケープゴート",
        kind: "magic_ref",
        cardId: "card_128",
        cost: 2,
        notes: "ブラックの本体詰めを味方へ逸らす。味方を失うリスクでホワイトのシールドと差別化する。",
      },
    ],
    risks: [
      "挑発が相手の行動を止め続けるロックになる",
      "スケープゴートがホワイトの防御役割と被りすぎる",
      "囮の撃破が相手のレベルアップ機会になる",
    ],
    aiNotes: [
      "本体リーサル圏ではスケープゴートを高く評価する",
      "主力が撃破される直前に挑発で安い囮へ攻撃を逸らす",
      "大地の怒りには弱いままでよい",
    ],
    acceptanceCriteria: [
      "ブラックのバーサク本体詰めを1ターンずらせる",
      "ホワイトの陣形を位置破壊しない",
      "挑発で相手が合法手を失い続けない",
    ],
  },
  {
    id: "sacrifice",
    name: "グレイブマスター",
    stance: "被害変換型",
    status: "design",
    goal: "自分のモンスターが倒れることを、手札、テンポ、反撃点へ変換する。",
    actions: [
      {
        id: "master_attack",
        name: "マスターアタック",
        kind: "builtin",
        actionId: "master_attack",
        cost: 3,
        notes: "既存マスターと同じ基準点。",
      },
      {
        id: "memorial",
        name: "供養",
        kind: "experimental_effect",
        effectId: "sacrifice_ready_ally_draw",
        cost: 2,
        summary: "自分の登場済み・未行動モンスター1体を倒し、1枚引く。",
        notes: "行動後に使えると強すぎるため、未行動限定を基本にする。",
      },
      {
        id: "requiem",
        name: "鎮魂",
        kind: "experimental_effect",
        effectId: "retaliate_when_ally_defeated",
        cost: 3,
        summary: "次の自分ターン開始まで、自分モンスターが相手攻撃で倒れた時、相手マスターに1ダメージ。",
        notes: "ブラックの撃破圧を罰へ変えるが、倒されない限り価値を出さない。",
      },
    ],
    risks: [
      "供養が相手のレベルアップ機会を消しすぎる",
      "鎮魂がブラックの通常勝ち筋を過度に否定する",
      "自壊とドローが長期戦を伸ばしすぎる",
    ],
    aiNotes: [
      "供養は相手のレベルアップが近い場面だけ評価する",
      "鎮魂は相手の撃破見込みが高いターンに使う",
      "自分のリーサルがある場面では防御より攻撃を優先する",
    ],
    acceptanceCriteria: [
      "行動済み供養を許さない",
      "ブラック相手に防御ではなく反撃として機能する",
      "撃破とレベルアップの基本ループを壊さない",
    ],
  },
  {
    id: "timing",
    name: "クロックマスター",
    stance: "タイミング干渉型",
    status: "design",
    goal: "相手の強い瞬間を1ターンずらし、陣形や盤面そのものは壊さない。",
    actions: [
      {
        id: "master_attack",
        name: "マスターアタック",
        kind: "builtin",
        actionId: "master_attack",
        cost: 3,
        notes: "既存マスターと同じ基準点。",
      },
      {
        id: "stay",
        name: "ステイ",
        kind: "experimental_effect",
        effectId: "delay_prepared_enemy",
        cost: 2,
        summary: "相手の準備中モンスター1体は、次の持ち主ターン開始時に登場しない。",
        notes: "ホワイトの陣形を移動破壊せず、登場タイミングだけをずらす。",
      },
      {
        id: "power_down",
        name: "パワーダウン",
        kind: "experimental_effect",
        effectId: "next_attack_minus_one",
        cost: 2,
        summary: "登場済みモンスター1体の次の攻撃パワーを-1する。",
        notes: "ブラックのバーサク撃破ラインを1ターン崩す。",
      },
    ],
    risks: [
      "準備中への干渉がホワイトの育成を止めすぎる",
      "パワーダウンが単なる防御でホワイトと被る",
      "遅延だけで勝ち筋が薄くなる",
    ],
    aiNotes: [
      "ステイは相手の登場で撃破やリーサルが発生する時に評価する",
      "パワーダウンは撃破ラインを下げられる時に評価する",
      "勝ち筋は自軍モンスターの攻撃で作る",
    ],
    acceptanceCriteria: [
      "位置破壊なしでテンポ差を作る",
      "ホワイト相手に一方的な準備ロックを作らない",
      "ブラックの速攻を完全停止ではなく1ターン遅延に留める",
    ],
  },
];

export function listMasterLabCandidates(): MasterLabCandidate[] {
  return MASTER_LAB_CANDIDATES.map((candidate) => ({
    ...candidate,
    actions: [...candidate.actions],
    risks: [...candidate.risks],
    aiNotes: [...candidate.aiNotes],
    acceptanceCriteria: [...candidate.acceptanceCriteria],
  }));
}

export function getMasterLabCandidate(candidateId: MasterLabCandidateId): MasterLabCandidate {
  const candidate = MASTER_LAB_CANDIDATES.find((item) => item.id === candidateId);
  if (!candidate) {
    throw new Error(`Unknown Master Lab candidate: ${candidateId}`);
  }
  return candidate;
}

export function listMasterLabActionOptions(
  state: GameState,
  candidateId: MasterLabCandidateId,
): MasterLabActionOption[] {
  if (state.winner || state.pendingLevelUp || state.players[state.currentPlayer].masterFrozen) {
    return [];
  }

  const candidate = getMasterLabCandidate(candidateId);
  return candidate.actions.flatMap((action) => listActionOptions(state, candidate, action));
}

export function playMasterLabAction(state: GameState, input: MasterLabActionInput): GameState {
  const candidate = getMasterLabCandidate(input.candidateId);
  const action = candidate.actions.find((item) => item.id === input.actionId);
  if (!action) {
    throw new Error(`Unknown Master Lab action: ${input.actionId}`);
  }

  const legal = listMasterLabActionOptions(state, input.candidateId).some((option) => isSameActionOption(option, input));
  if (!legal) {
    throw new Error("そのMaster Lab特技は使えません");
  }

  if (action.kind === "builtin") {
    const resolverState = createCostAdjustedState(state, resolvedMasterLabActionCost(action), MASTER_ACTION_DEFS[action.actionId].cost);
    return useMasterAction(resolverState, action.actionId, input.target);
  }
  if (action.kind === "magic_ref") {
    const virtual = createVirtualMagicResolverState(state, candidate.id, action);
    const next = playMagic(virtual.state, {
      handInstanceId: virtual.handInstanceId,
      target: input.target,
      secondaryTarget: input.secondaryTarget,
    });
    removeVirtualMagicCard(next, state.currentPlayer, virtual.handInstanceId);
    return next;
  }

  throw new Error(`${action.name} はまだMaster Lab実行に接続されていません`);
}

export function inspectMasterLabActionEvaluations(
  state: GameState,
  candidateId: MasterLabCandidateId,
  perspective: PlayerId = state.currentPlayer,
): MasterLabActionEvaluation[] {
  const beforeScore = evaluateState(state, perspective);
  return listMasterLabActionOptions(state, candidateId).flatMap((option, index) => {
    try {
      const after = playMasterLabAction(state, option);
      const stateScoreDelta = evaluateState(after, perspective) - beforeScore;
      const heuristicScore = masterLabActionHeuristic(state, after, option, perspective);
      const totalScore = stateScoreDelta + heuristicScore;
      return [{
        option,
        stateScoreDelta,
        heuristicScore,
        totalScore,
        reason: masterLabEvaluationReason(option, stateScoreDelta, heuristicScore, index),
        after,
      }];
    } catch {
      return [];
    }
  });
}

export function chooseMasterLabAction(
  state: GameState,
  candidateId: MasterLabCandidateId,
  perspective: PlayerId = state.currentPlayer,
): MasterLabActionEvaluation | undefined {
  return inspectMasterLabActionEvaluations(state, candidateId, perspective)
    .sort((a, b) => b.totalScore - a.totalScore || a.option.summary.localeCompare(b.option.summary))[0];
}

export function buildMasterLabMatchups(
  candidates: readonly MasterLabCandidate[] = MASTER_LAB_CANDIDATES,
): MasterLabMatchup[] {
  return candidates.flatMap((candidate) => [
    {
      candidateId: candidate.id,
      challengerSeat: "player",
      opponentId: "white",
      purpose: "ホワイトの育成維持を壊しすぎないか確認する",
      recommendedGames: 100,
    },
    {
      candidateId: candidate.id,
      challengerSeat: "cpu",
      opponentId: "white",
      purpose: "座席差込みでホワイト相手の再現性を見る",
      recommendedGames: 100,
    },
    {
      candidateId: candidate.id,
      challengerSeat: "player",
      opponentId: "black",
      purpose: "ブラックの速攻に対抗できるか確認する",
      recommendedGames: 100,
    },
    {
      candidateId: candidate.id,
      challengerSeat: "cpu",
      opponentId: "black",
      purpose: "座席差込みでブラック相手の再現性を見る",
      recommendedGames: 100,
    },
    {
      candidateId: candidate.id,
      challengerSeat: "player",
      opponentId: candidate.id,
      purpose: "同型でロックや長期戦が起きないか確認する",
      recommendedGames: 50,
    },
  ]);
}

export function validateMasterLabCandidates(
  candidates: readonly MasterLabCandidate[] = MASTER_LAB_CANDIDATES,
): MasterLabValidationIssue[] {
  const issues: MasterLabValidationIssue[] = [];
  const candidateIds = new Set<string>();

  for (const candidate of candidates) {
    if (candidateIds.has(candidate.id)) {
      issues.push({
        severity: "error",
        candidateId: candidate.id,
        message: `候補IDが重複しています: ${candidate.id}`,
      });
    }
    candidateIds.add(candidate.id);

    if (candidate.actions.length !== 3) {
      issues.push({
        severity: "warning",
        candidateId: candidate.id,
        message: "既存マスターと比較しやすいよう、特技は3つを基準にしてください",
      });
    }

    const actionIds = new Set<string>();
    for (const action of candidate.actions) {
      if (actionIds.has(action.id)) {
        issues.push({
          severity: "error",
          candidateId: candidate.id,
          actionId: action.id,
          message: `特技IDが重複しています: ${action.id}`,
        });
      }
      actionIds.add(action.id);
      validateAction(candidate.id, action, issues);
    }
  }

  return issues;
}

export function formatMasterLabMarkdown(
  candidates: readonly MasterLabCandidate[] = MASTER_LAB_CANDIDATES,
): string {
  const issues = validateMasterLabCandidates(candidates);
  const lines = [
    "# Master Lab 現状",
    "",
    "## ロードマップ",
    "",
    ...MASTER_LAB_ROADMAP.map((phase) => `- ${phase.id}: ${phase.title} (${phase.status})`),
    "",
    "## 候補",
    "",
  ];

  for (const candidate of candidates) {
    lines.push(`### ${candidate.name}`);
    lines.push("");
    lines.push(`- id: ${candidate.id}`);
    lines.push(`- スタンス: ${candidate.stance}`);
    lines.push(`- 状態: ${candidate.status}`);
    lines.push(`- 狙い: ${candidate.goal}`);
    lines.push("- 特技:");
    for (const action of candidate.actions) {
      lines.push(`  - ${action.name}: ${formatActionSummary(action)}`);
    }
    lines.push("- 主なリスク:");
    for (const risk of candidate.risks) {
      lines.push(`  - ${risk}`);
    }
    lines.push("");
  }

  lines.push("## 評価マトリクス");
  lines.push("");
  for (const matchup of buildMasterLabMatchups(candidates)) {
    lines.push(
      `- ${matchup.candidateId} as ${matchup.challengerSeat} vs ${matchup.opponentId}: ${matchup.recommendedGames}戦 - ${matchup.purpose}`,
    );
  }

  lines.push("");
  lines.push("## 実行レイヤー");
  lines.push("");
  lines.push("- builtin: 既存マスター特技を、Master Lab側のコストで解決する");
  lines.push("- magic_ref: 仮想手札カードを一時追加し、既存魔法効果をMaster Lab側のコストで解決する");
  lines.push("- experimental_effect: 効果ごとの個別実装が入るまで候補列挙しない");

  lines.push("");
  lines.push("## 静的検証");
  lines.push("");
  if (issues.length === 0) {
    lines.push("- PASS");
  } else {
    for (const issue of issues) {
      const scope = [issue.candidateId, issue.actionId].filter(Boolean).join("/");
      lines.push(`- ${issue.severity}: ${scope ? `${scope}: ` : ""}${issue.message}`);
    }
  }

  return lines.join("\n");
}

export function resolvedMasterLabActionCost(action: MasterLabAction): number {
  if (action.cost !== undefined) {
    return action.cost;
  }
  if (action.kind === "builtin") {
    return MASTER_ACTION_DEFS[action.actionId].cost;
  }
  if (action.kind === "experimental_effect") {
    return action.cost;
  }
  const card = getCardDef(action.cardId);
  return card.type === "magic" ? card.cost : 0;
}

function validateAction(
  candidateId: MasterLabCandidateId,
  action: MasterLabAction,
  issues: MasterLabValidationIssue[],
): void {
  const cost = resolvedMasterLabActionCost(action);
  if (!Number.isInteger(cost) || cost < 0) {
    issues.push({
      severity: "error",
      candidateId,
      actionId: action.id,
      message: `コストが不正です: ${cost}`,
    });
  }

  if (action.kind === "magic_ref") {
    const card = getCardDef(action.cardId);
    if (card.type !== "magic") {
      issues.push({
        severity: "error",
        candidateId,
        actionId: action.id,
        message: `${action.cardId} は魔法カードではありません`,
      });
      return;
    }
    if (!card.implemented) {
      issues.push({
        severity: "warning",
        candidateId,
        actionId: action.id,
        message: `${getCardName(action.cardId)} は未実装の魔法です`,
      });
    }
  }
}

function listActionOptions(
  state: GameState,
  candidate: MasterLabCandidate,
  action: MasterLabAction,
): MasterLabActionOption[] {
  if (state.players[state.currentPlayer].stones < resolvedMasterLabActionCost(action)) {
    return [];
  }

  if (action.kind === "builtin") {
    const resolverState = createCostAdjustedState(state, resolvedMasterLabActionCost(action), MASTER_ACTION_DEFS[action.actionId].cost);
    return getMasterActionTargets(resolverState, action.actionId).map((target) =>
      createActionOption(candidate.id, action, target),
    );
  }

  if (action.kind === "magic_ref") {
    const virtual = createVirtualMagicResolverState(state, candidate.id, action);
    return getMagicTargets(virtual.state, virtual.handInstanceId).flatMap((target) => {
      const secondaryTargets = getMagicSecondaryTargets(virtual.state, {
        handInstanceId: virtual.handInstanceId,
        target,
      });
      if (secondaryTargets.length === 0) {
        return [createActionOption(candidate.id, action, target)];
      }
      return secondaryTargets.map((secondaryTarget) => createActionOption(candidate.id, action, target, secondaryTarget));
    });
  }

  return [];
}

function createActionOption(
  candidateId: MasterLabCandidateId,
  action: MasterLabAction,
  target: Target,
  secondaryTarget?: Target,
): MasterLabActionOption {
  const cost = resolvedMasterLabActionCost(action);
  return {
    candidateId,
    actionId: action.id,
    actionName: action.name,
    kind: action.kind,
    cost,
    target,
    secondaryTarget,
    summary: secondaryTarget
      ? `${action.name} ${targetToKey(target)} / ${targetToKey(secondaryTarget)} (${cost}コ)`
      : `${action.name} ${targetToKey(target)} (${cost}コ)`,
  };
}

function isSameActionOption(option: MasterLabActionOption, input: MasterLabActionInput): boolean {
  return option.candidateId === input.candidateId
    && option.actionId === input.actionId
    && targetToKey(option.target) === targetToKey(input.target)
    && optionalTargetKey(option.secondaryTarget) === optionalTargetKey(input.secondaryTarget);
}

function optionalTargetKey(target: Target | undefined): string {
  return target ? targetToKey(target) : "";
}

function createVirtualMagicResolverState(
  state: GameState,
  candidateId: MasterLabCandidateId,
  action: MasterLabMagicRefAction,
): { state: GameState; handInstanceId: string } {
  const card = getCardDef(action.cardId);
  if (card.type !== "magic") {
    throw new Error(`${action.cardId} は魔法カードではありません`);
  }

  const handInstanceId = virtualMagicHandInstanceId(candidateId, action.id);
  const next = createCostAdjustedState(state, resolvedMasterLabActionCost(action), card.cost);
  const player = next.players[next.currentPlayer];
  removeVirtualMagicCard(next, next.currentPlayer, handInstanceId);
  player.hand.push({ cardId: action.cardId, instanceId: handInstanceId });
  return { state: next, handInstanceId };
}

function masterLabActionHeuristic(
  before: GameState,
  after: GameState,
  option: MasterLabActionOption,
  perspective: PlayerId,
): number {
  if (option.candidateId !== "decoy") {
    return 0;
  }

  if (option.actionId === "scapegoat" && option.target.kind === "monster") {
    const target = after.slots[option.target.slotKey].monster;
    if (!target?.scapegoat || target.owner !== perspective) {
      return 0;
    }
    const opponent = opponentOf(perspective);
    const hpPressure = before.players[perspective].masterHp <= before.players[opponent].masterHp ? 22 : 8;
    const lowHpBonus = before.players[perspective].masterHp <= 3 ? 24 : 0;
    return 34 + hpPressure + lowHpBonus + Math.max(0, target.hp) * 3;
  }

  if (option.actionId === "provoke" && option.target.kind === "monster") {
    const provoked = after.slots[option.target.slotKey].monster;
    const bait = option.secondaryTarget?.kind === "monster"
      ? before.slots[option.secondaryTarget.slotKey].monster
      : undefined;
    if (!provoked?.provokeTargetSlotKey || bait?.owner !== perspective) {
      return 0;
    }
    const enemyLevelPressure = provoked.level * 12;
    const cheapBaitBonus = bait.level <= 1 ? 14 : -8;
    return 32 + enemyLevelPressure + cheapBaitBonus;
  }

  return 0;
}

function masterLabEvaluationReason(
  option: MasterLabActionOption,
  stateScoreDelta: number,
  heuristicScore: number,
  index: number,
): string {
  return [
    `Master Lab候補${index + 1}`,
    option.summary,
    `状態差分 ${formatSigned(stateScoreDelta)}`,
    `補助評価 ${formatSigned(heuristicScore)}`,
  ].join(" / ");
}

function formatSigned(value: number): string {
  return value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
}

function createCostAdjustedState(state: GameState, labCost: number, resolverCost: number): GameState {
  const current = state.players[state.currentPlayer];
  if (current.stones < labCost) {
    throw new Error("Master Lab特技に必要なストーンが足りません");
  }
  const next = cloneState(state);
  next.players[next.currentPlayer].stones = current.stones - labCost + resolverCost;
  return next;
}

function removeVirtualMagicCard(state: GameState, playerId: PlayerId, handInstanceId: string): void {
  const player = state.players[playerId];
  player.hand = player.hand.filter((card) => card.instanceId !== handInstanceId);
  player.discard = player.discard.filter((card) => card.instanceId !== handInstanceId);
}

function virtualMagicHandInstanceId(candidateId: MasterLabCandidateId, actionId: string): string {
  return `${MASTER_LAB_VIRTUAL_CARD_PREFIX}${candidateId}_${actionId}`;
}

function formatActionSummary(action: MasterLabAction): string {
  const cost = `${resolvedMasterLabActionCost(action)}コ`;
  if (action.kind === "builtin") {
    return `${cost}, builtin:${action.actionId}, ${action.notes}`;
  }
  if (action.kind === "magic_ref") {
    return `${cost}, magic:${getCardName(action.cardId)}, ${action.notes}`;
  }
  return `${cost}, ${action.summary}, ${action.notes}`;
}

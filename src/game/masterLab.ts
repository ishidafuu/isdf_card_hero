import { getCardDef, getCardName } from "./cards";
import { MASTER_ACTION_DEFS } from "./masters";
import type { MasterActionId, PlayerId } from "./types";

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

export const MASTER_LAB_ROADMAP: readonly MasterLabRoadmapPhase[] = [
  {
    id: "phase_0",
    title: "設計台帳",
    status: "active",
    exitCriteria: ["候補定義をコード化する", "参照カードとコストを静的検証する"],
  },
  {
    id: "phase_1",
    title: "既存魔法参照",
    status: "next",
    exitCriteria: ["magic_ref 特技を実戦で解決できる", "カード本体と特技側コストを分離する"],
  },
  {
    id: "phase_2",
    title: "実験ランナー",
    status: "later",
    exitCriteria: ["white/black との座席入れ替えマトリクスを100戦単位で回せる"],
  },
  {
    id: "phase_3",
    title: "CPU AI 評価",
    status: "later",
    exitCriteria: ["実験特技の合法手列挙と評価理由が出る"],
  },
  {
    id: "phase_4",
    title: "シナリオテスト",
    status: "later",
    exitCriteria: ["バーサク詰め、主力保護、ロック化回避の盤面テストがある"],
  },
  {
    id: "phase_5",
    title: "本採用判定",
    status: "later",
    exitCriteria: ["failure 0 の実戦レポートと本線移植方針がある"],
  },
];

export const MASTER_LAB_CANDIDATES: readonly MasterLabCandidate[] = [
  {
    id: "decoy",
    name: "デコイマスター",
    stance: "攻撃誘導型",
    status: "design",
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

import { getMasterLabCandidate, type MasterLabCandidateId } from "./masterLab";

export type MasterLabSelectionCandidateId = "tempo" | "grave" | "archive" | "conductor" | "old_timing";
export type MasterLabSelectionCriterionId =
  | "differentiation"
  | "stressSafety"
  | "aiReadiness"
  | "implementationReadiness"
  | "balanceSafety";

export interface MasterLabSelectionCriterion {
  id: MasterLabSelectionCriterionId;
  label: string;
  weight: number;
  description: string;
}

export interface MasterLabSelectionCandidate {
  id: MasterLabSelectionCandidateId;
  label: string;
  sourceCandidateId?: MasterLabCandidateId;
  stance: string;
  actions: readonly string[];
  scores: Record<MasterLabSelectionCriterionId, number>;
  strengths: readonly string[];
  risks: readonly string[];
  nextAction: string;
}

export interface MasterLabSelectionLoopEntry {
  rank: number;
  candidate: MasterLabSelectionCandidate;
  weightedScore: number;
  maxScore: number;
  scoreRate: number;
  judgement: "prototype" | "hold" | "reject";
}

export interface MasterLabSelectionLoopReport {
  generatedAt: string;
  criteria: readonly MasterLabSelectionCriterion[];
  entries: readonly MasterLabSelectionLoopEntry[];
  best: MasterLabSelectionLoopEntry;
  conclusion: {
    summary: string;
    nextSteps: readonly string[];
  };
}

export const MASTER_LAB_SELECTION_CRITERIA = [
  {
    id: "differentiation",
    label: "独自性",
    weight: 3,
    description: "ホワイト、ブラック、デコイと勝ち方が被らないか。",
  },
  {
    id: "stressSafety",
    label: "低ストレス",
    weight: 4,
    description: "相手の行動、準備、配置、レベルアップ機会を直接奪いすぎないか。",
  },
  {
    id: "aiReadiness",
    label: "CPU評価",
    weight: 2,
    description: "CPUが使うべき場面を局面評価へ分解しやすいか。",
  },
  {
    id: "implementationReadiness",
    label: "実装容易性",
    weight: 2,
    description: "既存ルールの範囲で小さくプロトタイプできるか。",
  },
  {
    id: "balanceSafety",
    label: "相性安全性",
    weight: 3,
    description: "特定マスターや基本ルールを一方的に否定しにくいか。",
  },
] as const satisfies readonly MasterLabSelectionCriterion[];

export const MASTER_LAB_SELECTION_CANDIDATES = [
  {
    id: "tempo",
    label: "テンポマスター",
    sourceCandidateId: "timing",
    stance: "自軍テンポ調整型",
    actions: ["クイックコール", "シフト"],
    scores: {
      differentiation: 5,
      stressSafety: 5,
      aiReadiness: 4,
      implementationReadiness: 3,
      balanceSafety: 4,
    },
    strengths: [
      "相手の行動を止めず、自分側の準備と配置だけを整える。",
      "ホワイトの防御、ブラックの打点、デコイの攻撃誘導と役割が被りにくい。",
      "準備中や配置という既存ルールの範囲でプロトタイプしやすい。",
    ],
    risks: [
      "クイックコールが強すぎると、準備ターンの重みを壊す。",
      "シフトが強すぎると、配置読み合いが薄くなる。",
    ],
    nextAction: "クイックコール単体からシナリオテストを作る。",
  },
  {
    id: "grave",
    label: "グレイブ改",
    sourceCandidateId: "sacrifice",
    stance: "被害後の回収、追悼",
    actions: ["弔い", "残響"],
    scores: {
      differentiation: 5,
      stressSafety: 3,
      aiReadiness: 3,
      implementationReadiness: 3,
      balanceSafety: 3,
    },
    strengths: [
      "倒された後の価値変換で、既存3マスターと違うゲーム体験になる。",
      "黒速攻への受けを、禁止ではなく損得判断にできる。",
    ],
    risks: [
      "相手が普通に攻撃するだけで罰を受ける印象が出やすい。",
      "ドローや反撃が過剰だと長期戦化しやすい。",
    ],
    nextAction: "テンポマスターが不発だった場合の第二候補として、供養を外した形で再設計する。",
  },
  {
    id: "archive",
    label: "アーカイブマスター",
    stance: "手札整流、再計画",
    actions: ["リサーチ", "再計画"],
    scores: {
      differentiation: 3,
      stressSafety: 5,
      aiReadiness: 4,
      implementationReadiness: 4,
      balanceSafety: 3,
    },
    strengths: [
      "相手盤面に干渉しないため低ストレス。",
      "手札交換系は実装とCPU評価が比較的軽い。",
    ],
    risks: [
      "盤面上の個性が薄く、勝ち方が見えにくい。",
      "安定性だけが上がると、相手からは強さの理由が見えにくい。",
    ],
    nextAction: "第四候補ではなく、将来の低ストレス控え案として残す。",
  },
  {
    id: "conductor",
    label: "コンダクター",
    stance: "自軍配置調整",
    actions: ["ポジションチェンジ", "バックアップ"],
    scores: {
      differentiation: 3,
      stressSafety: 5,
      aiReadiness: 3,
      implementationReadiness: 4,
      balanceSafety: 3,
    },
    strengths: [
      "相手の駒を動かさず、自分の配置だけを整えるので低ストレス。",
      "シフト系だけを切り出せばプロトタイプしやすい。",
    ],
    risks: [
      "ホワイトの陣形管理と近くなりやすい。",
      "テンポマスターのシフトに役割を吸収されやすい。",
    ],
    nextAction: "独立候補ではなく、テンポマスターのシフト調整案として扱う。",
  },
  {
    id: "old_timing",
    label: "旧タイミング型",
    sourceCandidateId: "timing",
    stance: "相手登場遅延",
    actions: ["ステイ", "パワーダウン"],
    scores: {
      differentiation: 4,
      stressSafety: 1,
      aiReadiness: 2,
      implementationReadiness: 3,
      balanceSafety: 2,
    },
    strengths: [
      "相手の強い瞬間をずらす独自性は高い。",
      "白黒どちらにも違う角度で作用する。",
    ],
    risks: [
      "相手の出す楽しさを直接止める。",
      "ホワイトの準備と陣形へ刺さりすぎる。",
      "連打時にロックへ見えやすい。",
    ],
    nextAction: "相手遅延型としては非推奨。自軍テンポ型へ置き換える。",
  },
] as const satisfies readonly MasterLabSelectionCandidate[];

export function runMasterLabSelectionLoop(date = new Date()): MasterLabSelectionLoopReport {
  const maxScore = MASTER_LAB_SELECTION_CRITERIA.reduce((total, criterion) => total + criterion.weight * 5, 0);
  const candidates: readonly MasterLabSelectionCandidate[] = MASTER_LAB_SELECTION_CANDIDATES;
  const entries = candidates
    .map((candidate) => {
      const weightedScore = MASTER_LAB_SELECTION_CRITERIA.reduce(
        (total, criterion) => total + candidate.scores[criterion.id] * criterion.weight,
        0,
      );
      const scoreRate = weightedScore / maxScore;
      return {
        candidate,
        weightedScore,
        maxScore,
        scoreRate,
        judgement: scoreRate >= 0.78 ? "prototype" : scoreRate >= 0.6 ? "hold" : "reject",
      } satisfies Omit<MasterLabSelectionLoopEntry, "rank">;
    })
    .sort((a, b) => b.weightedScore - a.weightedScore || b.candidate.scores.stressSafety - a.candidate.scores.stressSafety)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const best = entries[0];
  if (!best) {
    throw new Error("No Master Lab selection candidates were evaluated");
  }
  const bestSource = best.candidate.sourceCandidateId ? getMasterLabCandidate(best.candidate.sourceCandidateId) : undefined;
  const bestActionNames = new Set(bestSource?.actions.map((action) => action.name) ?? []);
  const bestIsReflectedInLedger = !!bestSource && best.candidate.actions.every((actionName) => bestActionNames.has(actionName));

  return {
    generatedAt: date.toISOString(),
    criteria: MASTER_LAB_SELECTION_CRITERIA,
    entries,
    best,
    conclusion: {
      summary: bestIsReflectedInLedger
        ? `${best.candidate.label}を第四マスターの本命として確定。台帳は更新済みなので、次は単体シナリオテストへ進める。`
        : `${best.candidate.label}を第四マスターの本命として、次は台帳更新と単体シナリオテストへ進める。`,
      nextSteps: bestIsReflectedInLedger
        ? [
          "クイックコールを自軍準備中限定でプロトタイプし、相手準備中を対象にできないことをテストする。",
          "シフトを自軍配置限定でプロトタイプし、敵配置を動かさないことをテストする。",
          "小母数の自動対戦前に、ストレスリスクをシナリオテストで潰す。",
        ]
        : [
          "Master Lab台帳で timing 候補をテンポ型へ更新する。",
          "クイックコールを自軍準備中限定でプロトタイプし、相手準備中を対象にできないことをテストする。",
          "シフトを自軍配置限定でプロトタイプし、敵配置を動かさないことをテストする。",
          "小母数の自動対戦前に、ストレスリスクをシナリオテストで潰す。",
        ],
    },
  };
}

export function formatMasterLabSelectionLoopMarkdown(report: MasterLabSelectionLoopReport): string {
  return [
    "# Master Lab Selection Loop",
    "",
    `生成: ${report.generatedAt}`,
    "",
    "## Conclusion",
    "",
    report.conclusion.summary,
    "",
    "### Next Steps",
    "",
    ...report.conclusion.nextSteps.map((step) => `- ${step}`),
    "",
    "## Criteria",
    "",
    "| Criterion | Weight | Description |",
    "| --- | ---: | --- |",
    ...report.criteria.map((criterion) => `| ${criterion.label} | ${criterion.weight} | ${criterion.description} |`),
    "",
    "## Ranking",
    "",
    "| Rank | Candidate | Stance | Score | Judgement | Actions |",
    "| ---: | --- | --- | ---: | --- | --- |",
    ...report.entries.map((entry) =>
      `| ${entry.rank} | ${entry.candidate.label} | ${entry.candidate.stance} | ${entry.weightedScore}/${entry.maxScore} | ${entry.judgement} | ${entry.candidate.actions.join(" / ")} |`,
    ),
    "",
    "## Candidate Notes",
    "",
    ...report.entries.flatMap(formatSelectionEntryNotes),
    "## Static Consistency",
    "",
    ...formatStaticConsistency(report),
  ].join("\n");
}

function formatSelectionEntryNotes(entry: MasterLabSelectionLoopEntry): string[] {
  return [
    `### ${entry.rank}. ${entry.candidate.label}`,
    "",
    `- 判定: ${entry.judgement}`,
    `- スコア: ${entry.weightedScore}/${entry.maxScore}`,
    `- 特技案: ${entry.candidate.actions.join(" / ")}`,
    "- 強み:",
    ...entry.candidate.strengths.map((strength) => `  - ${strength}`),
    "- リスク:",
    ...entry.candidate.risks.map((risk) => `  - ${risk}`),
    `- 次アクション: ${entry.candidate.nextAction}`,
    "",
  ];
}

function formatStaticConsistency(report: MasterLabSelectionLoopReport): string[] {
  const bestSourceId = report.best.candidate.sourceCandidateId;
  if (!bestSourceId) {
    return ["- 本命候補はMaster Lab台帳とは別案として扱う。"];
  }
  const source = getMasterLabCandidate(bestSourceId);
  const actionNames = source.actions.map((action) => action.name).join(" / ");
  return [
    `- 本命候補は Master Lab 台帳の \`${source.id}\` に対応する。`,
    `- 現在の台帳名: ${source.name}`,
    `- 現在の台帳特技: ${actionNames}`,
  ];
}

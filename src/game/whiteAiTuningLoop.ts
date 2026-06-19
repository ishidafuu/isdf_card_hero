import { getCardName, getMonsterDef } from "./cards";
import {
  buildDeckPresetCardIds,
  getDeckPreset,
  type DeckPresetId,
} from "./deckPresets";
import {
  validateMasterLabAutoPlay,
  type MasterLabDecisionEvent,
  type MasterLabGameStateSummary,
  type MasterLabAutoPlayOptions,
  type MasterLabAutoPlayResult,
  type MasterLabParticipantId,
} from "./masterLabAutoPlay";
import type { MasterLabEvaluationTuning } from "./masterLab";
import type { CpuAiProfile, CpuAiTuning } from "./cpuAi";
import type { PlayerId } from "./types";

export type WhiteAiTuningExperimentKind = "baseline" | "action_bias" | "weights" | "hybrid" | "deck";
export type WhiteAiTuningOpponentCategory = "black" | "decoy" | "white";

export interface WhiteAiTuningLoopOptions extends Pick<
  MasterLabAutoPlayOptions,
  "maxSteps" | "maxTurns" | "stagnationLimit" | "longGameSteps" | "longGameTurns" | "failOnWarnings"
> {
  variants?: readonly WhiteAiTuningVariant[];
  opponents?: readonly WhiteAiTuningOpponent[];
  variantIds?: readonly string[];
  gamesPerMatchup?: number;
  seedStart?: number;
  loopCount?: number;
  includeGameHistory?: boolean;
}

export interface WhiteAiTuningVariant {
  id: string;
  kind: WhiteAiTuningExperimentKind;
  label: string;
  deckPreset: DeckPresetId;
  aiProfile: CpuAiProfile;
  tuning?: CpuAiTuning;
  hypothesis: string;
}

export interface WhiteAiTuningOpponent {
  id: string;
  category: WhiteAiTuningOpponentCategory;
  label: string;
  participant: MasterLabParticipantId;
  deckPreset: DeckPresetId;
  aiProfile: CpuAiProfile;
  labActionMargin?: number;
  labEvaluationTuning?: MasterLabEvaluationTuning;
}

export interface WhiteAiTuningRun {
  id: string;
  variantId: string;
  opponentId: string;
  opponentCategory: WhiteAiTuningOpponentCategory;
  candidateSeat: PlayerId;
  seedStart: number;
  games: number;
  result: MasterLabAutoPlayResult;
}

export interface WhiteAiTuningMatchupStats {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winPointRate: number;
}

export interface WhiteAiTuningStanding {
  variant: WhiteAiTuningVariant;
  games: number;
  wins: number;
  losses: number;
  draws: number;
  winPointRate: number;
  score: number;
  averageSteps: number;
  averageTurns: number;
  failures: number;
  warnings: number;
  bannedCardCount: number;
  averageOpponentHpOnLoss?: number;
  masterActionUsage: Record<string, number>;
  turnIntentMetrics: WhiteAiTurnIntentMetrics;
  matchups: Record<WhiteAiTuningOpponentCategory, WhiteAiTuningMatchupStats>;
  notes: string[];
}

export interface WhiteAiTurnIntentMetrics {
  totalActions: number;
  executionActions: number;
  setupActions: number;
  lowStoneAfterSetup: number;
  shieldUses: number;
  shieldConvertedNextTurn: number;
  shieldNoConversion: number;
  woundedLevelUpHeal: number;
  pygmyActions: number;
  pygmySetupHits: number;
  polyspinnerFirstActions: number;
  polyspinnerPurposefulFirstAction: number;
  polyspinnerWasteAction: number;
}

export interface WhiteAiTuningReport {
  generatedAt: string;
  gamesPerMatchup: number;
  variants: readonly WhiteAiTuningVariant[];
  opponents: readonly WhiteAiTuningOpponent[];
  runs: WhiteAiTuningRun[];
  standings: WhiteAiTuningStanding[];
  conclusion: {
    summary: string;
    nextSteps: string[];
  };
}

const BANNED_CARD_IDS = ["card_113"] as const;
const PIGMY_CARD_ID = "card_051";
const POLYSPINNER_CARD_ID = "polyspinner";
const TURN_INTENT_METRIC_KEYS = [
  "totalActions",
  "executionActions",
  "setupActions",
  "lowStoneAfterSetup",
  "shieldUses",
  "shieldConvertedNextTurn",
  "shieldNoConversion",
  "woundedLevelUpHeal",
  "pygmyActions",
  "pygmySetupHits",
  "polyspinnerFirstActions",
  "polyspinnerPurposefulFirstAction",
  "polyspinnerWasteAction",
] as const satisfies readonly (keyof WhiteAiTurnIntentMetrics)[];

export const DEFAULT_WHITE_AI_TUNING_OPPONENTS = [
  {
    id: "black_pressure_strong",
    category: "black",
    label: "黒: black-pressure / strong",
    participant: "black",
    deckPreset: "black-pressure",
    aiProfile: "strong",
  },
  {
    id: "black_pressure_pressure",
    category: "black",
    label: "黒: black-pressure / pressure",
    participant: "black",
    deckPreset: "black-pressure",
    aiProfile: "pressure",
  },
  {
    id: "decoy_back_stable",
    category: "decoy",
    label: "デコイ: 後衛安定 / enemy+16",
    participant: "decoy",
    deckPreset: "master-lab-decoy-unit-back-stable",
    aiProfile: "strong",
    labActionMargin: 12,
    labEvaluationTuning: { targetOwnerBias: { enemy: 16 } },
  },
  {
    id: "white_pressure_strong",
    category: "white",
    label: "白基準: pressure-normal / strong",
    participant: "white",
    deckPreset: "pressure-normal",
    aiProfile: "strong",
  },
] as const satisfies readonly WhiteAiTuningOpponent[];

export const DEFAULT_WHITE_AI_TUNING_VARIANTS = [
  baselineVariant("pressure_white_baseline", "基準: pressure-normal / white", "pressure-normal", "white", "現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。"),
  baselineVariant("pressure_strong_baseline", "比較: pressure-normal / strong", "pressure-normal", "strong", "白専用補正なしの強AI。white profileの差分基準にする。"),
  baselineVariant("balanced_white_baseline", "比較: balanced-normal / white", "balanced-normal", "white", "標準構成で白AIの守備寄り判断が安定するかを見る。"),
  baselineVariant("white494_white_baseline", "比較: 投稿494 / white", "submission-pro-no-rare8-white-494", "white", "投稿白デッキ候補で、白AIの上限と癖を見る。"),
  baselineVariant("white1340_white_baseline", "比較: 投稿1340 / white", "submission-pro-no-rare8-white-1340", "white", "育成寄り白デッキで、守ってレベルを上げる筋が伸びるかを見る。"),
  baselineVariant("white1347_defensive_baseline", "比較: 投稿1347 / defensive", "submission-pro-no-rare8-white-1347", "defensive", "防御密度の高い候補で、長期戦化しすぎないかを見る。"),
  actionVariant("pressure_wake_plus8", "特技: wake_up+8", "pressure-normal", { actionBias: { wake_up: 8 } }, "準備中の味方を早めに起こし、黒の速度に盤面展開で対抗できるか見る。"),
  actionVariant("pressure_wake_plus16", "特技: wake_up+16", "pressure-normal", { actionBias: { wake_up: 16 } }, "ウェイクアップを明確に厚くし、使いすぎの副作用を測る。"),
  actionVariant("pressure_shield_plus8", "特技: shield+8", "pressure-normal", { actionBias: { shield: 8 } }, "守る価値のある駒を残しやすくし、レベルアップまでつなげる。"),
  actionVariant("pressure_shield_minus8", "特技: shield-8", "pressure-normal", { actionBias: { shield: -8 } }, "守りすぎで反撃が遅い仮説を確認する。"),
  actionVariant("pressure_master_attack_minus8", "特技: master_attack-8", "pressure-normal", { actionBias: { master_attack: -8 } }, "白がマスターアタックへ逃げすぎていないかを切り分ける。"),
  actionVariant("pressure_master_attack_plus8", "特技: master_attack+8", "pressure-normal", { actionBias: { master_attack: 8 } }, "白が盤面処理をマスターアタックで補う価値を確認する。"),
  actionVariant("pressure_attack_master_plus8", "攻撃: attack_master+8", "pressure-normal", { actionBias: { attack_master: 8 } }, "決着力不足の補正として、本体打点を少し押す。"),
  actionVariant("pressure_attack_monster_plus2", "攻撃: attack_monster+2", "pressure-normal", { actionBias: { attack_monster: 2 } }, "盤面制圧補正を最小限にし、+4が強すぎないかの下限を見る。"),
  actionVariant("pressure_attack_monster_plus4", "攻撃: attack_monster+4", "pressure-normal", { actionBias: { attack_monster: 4 } }, "盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。"),
  actionVariant("pressure_attack_monster_plus6", "攻撃: attack_monster+6", "pressure-normal", { actionBias: { attack_monster: 6 } }, "盤面制圧補正を+4より少し強め、黒耐性と白基準への勝ちすぎを確認する。"),
  actionVariant("pressure_attack_monster_plus4_shield_minus2", "混合: attack_monster+4 / shield-2", "pressure-normal", { actionBias: { attack_monster: 4, shield: -2 } }, "盤面処理補正を残しつつ、成果化しないシールドを軽く抑えられるか見る。"),
  hybridVariant("pressure_attack_monster4_stone_conserve", "状況: attack_monster+4 / 石温存", "pressure-normal", {
    actionBias: { attack_monster: 4 },
    situationalBias: { setupLowStonePenalty: 12 },
  }, "盤面処理補正は残し、布石後に石が1以下になる手を少し抑える。"),
  hybridVariant("pressure_attack_monster4_shield_convert", "状況: attack_monster+4 / 成果化シールド", "pressure-normal", {
    actionBias: { attack_monster: 4 },
    situationalBias: { shieldConversionBonus: 12 },
  }, "シールド対象が次ターン攻撃・撃破・レベルアップへ変換できる時だけ少し押す。"),
  hybridVariant("pressure_attack_monster4_anti_berserk_front", "状況: attack_monster+4 / 対黒前衛処理", "pressure-normal", {
    actionBias: { attack_monster: 4 },
    situationalBias: { antiBerserkFrontBonus: 16 },
  }, "黒相手のバーサク打点源になりやすい敵前衛処理だけを状況加点する。"),
  hybridVariant("pressure_white_monster_pressure_v1", "本実装候補: 白盤面処理+4", "pressure-normal", {
    situationalBias: { whiteMonsterPressureBonus: 4 },
  }, "白マスター限定で、敵モンスターへの実ダメージ/撃破評価だけを薄く上げる。"),
  hybridVariant("pressure_white_enemy_front_attack_v1", "本実装候補: 白敵前衛攻撃+4", "pressure-normal", {
    situationalBias: { whiteEnemyFrontAttackBonus: 4 },
  }, "白マスター限定で、HP減少の有無にかかわらず敵前衛へ攻撃する価値を薄く上げる。"),
  hybridVariant("pressure_white_black_front_threat_v1", "本実装候補: 白黒前衛脅威処理+8", "pressure-normal", {
    situationalBias: { whiteBlackFrontThreatBonus: 8 },
  }, "白マスター限定で、黒の次ターン打点源になりうる敵前衛を削る時だけ加点する。"),
  hybridVariant("pressure_white_active_front_work_v1", "本実装候補: 白既存駒前衛仕事+4", "pressure-normal", {
    situationalBias: { whiteActiveFrontWorkBonus: 4 },
  }, "白マスター限定で、召喚より既存アクティブ駒で敵前衛を削る行動を薄く上げる。"),
  hybridVariant("pressure_white_pygmy_front_setup_v1", "本実装候補: 白ピグミィ撃破圏+10", "pressure-normal", {
    situationalBias: { whitePygmyFrontSetupBonus: 10 },
  }, "白マスター限定で、ピグミィが敵前衛を撃破圏へ入れる小打点を評価する。"),
  hybridVariant("pressure_white_strict_shield_v1", "本実装候補: 白成果化盾-10", "pressure-normal", {
    situationalBias: { whiteStrictShieldPenalty: 10 },
  }, "白マスター限定で、致死回避・脅威軽減・次ターン成果化につながらないシールドを抑える。"),
  hybridVariant("pressure_white_low_stone_shield_wake_v1", "本実装候補: 白低石盾起動抑制", "pressure-normal", {
    situationalBias: { whiteLowStoneShieldPenalty: 10, whiteLowStoneWakePenalty: 8 },
  }, "白マスター限定で、石1以下になるシールド/ウェイクアップ布石を抑え、次ターンの選択肢を残す。"),
  hybridVariant("pressure_white_low_stone_summon_v1", "本実装候補: 白低石召喚抑制", "pressure-normal", {
    situationalBias: { whiteLowStoneSummonPenalty: 8 },
  }, "白マスター限定で、石1以下になる召喚布石を抑え、特技用ストーンの枯渇を避ける。"),
  hybridVariant("pressure_white_low_stone_setup_v1", "本実装候補: 白低石布石抑制", "pressure-normal", {
    situationalBias: { setupLowStonePenalty: 10 },
  }, "白マスター限定ではなく汎用フックで、石1以下になる布石全般を抑える。focus低石化が多い監査結果の対照候補。"),
  hybridVariant("pressure_white_low_stone_setup_light_v1", "本実装候補: 白低石布石抑制軽量", "pressure-normal", {
    situationalBias: { setupLowStonePenalty: 4 },
  }, "全布石低石抑制を弱め、強すぎる抑制で反撃速度を落としていないか確認する。"),
  hybridVariant("pressure_white_low_stone_focus_v1", "本実装候補: 白低石focus抑制", "pressure-normal", {
    situationalBias: { whiteLowStoneFocusPenalty: 8 },
  }, "負け監査で多かった、石1以下のままfocusする布石だけを抑える。"),
  hybridVariant("pressure_white_low_stone_focus_light_v1", "本実装候補: 白低石focus抑制軽量", "pressure-normal", {
    situationalBias: { whiteLowStoneFocusPenalty: 4 },
  }, "focus抑制を薄く入れ、待ちすぎの副作用を抑えながら石枯渇を減らす。"),
  hybridVariant("pressure_white_low_stone_focus_guard_v1", "本実装候補: 白低石focus+盾起動抑制", "pressure-normal", {
    situationalBias: { whiteLowStoneFocusPenalty: 6, whiteLowStoneShieldPenalty: 4, whiteLowStoneWakePenalty: 4 },
  }, "低石focusを主対象にしつつ、シールド/ウェイクアップの低石化も薄く抑える。"),
  hybridVariant("pressure_white_strict_shield_low_stone_v1", "本実装候補: 白盾精査+低石抑制", "pressure-normal", {
    situationalBias: { whiteStrictShieldPenalty: 8, whiteLowStoneShieldPenalty: 6, whiteLowStoneWakePenalty: 6 },
  }, "成果化しないシールド抑制と低石シールド/ウェイクアップ抑制を薄く併用する。"),
  hybridVariant("pressure_white_shield_threat_conversion_v1", "本実装候補: 白盾脅威/成果化+8", "pressure-normal", {
    situationalBias: { whiteShieldThreatConversionBonus: 8 },
  }, "白マスター限定で、脅威軽減または次ターン成果化が見えるシールドだけを加点する。"),
  hybridVariant("pressure_white_shield_threat_conversion_plus12_v1", "本実装候補: 白盾脅威/成果化+12", "pressure-normal", {
    situationalBias: { whiteShieldThreatConversionBonus: 12 },
  }, "成果化シールド加点を強め、2枚守りより質の高い1枚守りへ寄るか確認する。"),
  hybridVariant("pressure_white_wake_immediate_work_v1", "本実装候補: 白起動即仕事+8", "pressure-normal", {
    situationalBias: { whiteWakeImmediateWorkBonus: 8 },
  }, "白マスター限定で、起こした味方が即攻撃またはレベルアップ筋へつながるウェイクアップを加点する。"),
  hybridVariant("pressure_white_shield_wake_quality_v1", "本実装候補: 白盾起動品質+8", "pressure-normal", {
    situationalBias: { whiteShieldThreatConversionBonus: 8, whiteWakeImmediateWorkBonus: 8 },
  }, "シールドとウェイクアップを、消費量ではなく次ターン成果化の質で押す。"),
  hybridVariant("pressure_white_closeout_after_shield_v1", "本実装候補: 白盾後詰め+8", "pressure-normal", {
    situationalBias: { whiteCloseoutAfterShieldBonus: 8 },
  }, "既に守った駒がいる局面で、相手HP3以下へ詰める手を加点して守り続けを避ける。"),
  hybridVariant("pressure_white_next_turn_plan_quality_v1", "本実装候補: 白次ターン布石品質", "pressure-normal", {
    situationalBias: { whiteShieldThreatConversionBonus: 8, whiteWakeImmediateWorkBonus: 8, whiteCloseoutAfterShieldBonus: 6 },
  }, "盾/起動の対象品質と、守った後の詰めを同時に見る本命複合候補。"),
  hybridVariant("pressure_white_second_shield_guard_v1", "本実装候補: 白2枚目低石盾抑制", "pressure-normal", {
    situationalBias: { whiteSecondShieldLowStonePenalty: 8 },
  }, "白マスター限定で、同ターン2枚目以降のシールドで残石1以下になる過剰コミットを抑える。"),
  hybridVariant("pressure_white_second_shield_guard_light_v1", "本実装候補: 白2枚目低石盾抑制軽量", "pressure-normal", {
    situationalBias: { whiteSecondShieldLowStonePenalty: 4 },
  }, "同ターン2枚目以降の低石シールドだけを軽く抑え、必要な育成防御まで削らないか確認する。"),
  hybridVariant("pressure_white_second_shield_guard_plus12_v1", "本実装候補: 白2枚目低石盾抑制+12", "pressure-normal", {
    situationalBias: { whiteSecondShieldLowStonePenalty: 12 },
  }, "同ターン2枚目以降の低石シールド抑制を強め、過剰コミットの減少幅を見る。"),
  hybridVariant("pressure_white_shield_quality_second_guard_v1", "本実装候補: 白盾品質+2枚目抑制", "pressure-normal", {
    situationalBias: { whiteShieldThreatConversionBonus: 8, whiteSecondShieldLowStonePenalty: 8 },
  }, "質の高い盾を押しつつ、2枚目低石シールドの全力投入を抑える。"),
  hybridVariant("pressure_white_low_stone_focus_conversion_v1", "本実装候補: 白低石focus成果化+8", "pressure-normal", {
    situationalBias: { whiteLowStoneFocusConversionBonus: 8 },
  }, "白マスター限定で、低石でも次ターン攻撃/レベルアップへ変換できるfocusだけを加点する。"),
  hybridVariant("pressure_white_wake_safe_work_v1", "本実装候補: 白安全ウェイク仕事+8", "pressure-normal", {
    situationalBias: { whiteWakeSafeWorkBonus: 8 },
  }, "白マスター限定で、起こした味方が露出死しにくく、同ターンまたは次ターンの仕事が見えるウェイクアップを加点する。"),
  hybridVariant("pressure_white_focus_wake_quality_v1", "本実装候補: 白focus/wake布石品質", "pressure-normal", {
    situationalBias: { whiteLowStoneFocusConversionBonus: 8, whiteWakeSafeWorkBonus: 8 },
  }, "低石focusと自陣ウェイクを、消費量ではなく次ターンの仕事へ変換できる品質で押す。"),
  hybridVariant("pressure_white_focus_wake_quality_light_v1", "本実装候補: 白focus/wake布石品質軽量", "pressure-normal", {
    situationalBias: { whiteLowStoneFocusConversionBonus: 4, whiteWakeSafeWorkBonus: 4 },
  }, "focus/wake品質加点を薄く入れ、+8複合の上振れや守り寄り副作用を抑える。"),
  hybridVariant("pressure_white_low_stone_focus_missed_attack_light_v1", "本実装候補: 白低石focus攻撃見送り抑制軽量", "pressure-normal", {
    situationalBias: { whiteLowStoneFocusMissedAttackPenalty: 4 },
  }, "白マスター限定で、攻撃という同ターンの仕事が残っている低石focusだけを軽く抑える。"),
  hybridVariant("pressure_white_low_stone_focus_missed_attack_v1", "本実装候補: 白低石focus攻撃見送り抑制", "pressure-normal", {
    situationalBias: { whiteLowStoneFocusMissedAttackPenalty: 8 },
  }, "白マスター限定で、攻撃可能なのに低石focusで布石へ寄る局面を抑え、このターンの仕事を優先する。"),
  hybridVariant("pressure_white_threat_source_attack_v1", "本実装候補: 白脅威源攻撃+8", "pressure-normal", {
    situationalBias: { whiteThreatSourceAttackBonus: 8 },
  }, "白マスター限定で、敵前衛の次ターン打点源を削る攻撃を加点する。"),
  hybridVariant("pressure_white_threat_source_attack_light_v1", "本実装候補: 白脅威源攻撃+4", "pressure-normal", {
    situationalBias: { whiteThreatSourceAttackBonus: 4 },
  }, "敵前衛の打点源処理を軽く押し、Decoyや白ミラーへの副作用を確認する。"),
  hybridVariant("pressure_white_threat_then_setup_v1", "本実装候補: 白脅威処理後布石", "pressure-normal", {
    situationalBias: { whiteThreatSourceAttackBonus: 6, whiteSetupAfterThreatReductionBonus: 6 },
  }, "脅威源を削ってから低石布石へ移る順序を加点し、全力布石の前に盤面の仕事を済ませる。"),
  hybridVariant("pressure_white_redirect_marked_attack_guard_v1", "本実装候補: 白誘導印攻撃抑制", "pressure-normal", {
    situationalBias: { whiteRedirectMarkedAttackPenalty: 8 },
  }, "挑発/スケープゴート印のある敵へ低成果攻撃を吸われる局面を抑え、Decoy相手の攻撃誘導に乗りすぎないか確認する。"),
  hybridVariant("pressure_white_threat_left_low_stone_setup_guard_light_v1", "本実装候補: 白脅威残り低石布石抑制軽量", "pressure-normal", {
    situationalBias: { whiteThreatLeftLowStoneSetupPenalty: 6 },
  }, "白マスター限定で、敵前衛脅威が残る低石布石だけを軽く抑え、緊急/成果化シールドや仕事が見える起動/集中は残す。"),
  hybridVariant("pressure_white_threat_left_low_stone_setup_guard_v1", "本実装候補: 白脅威残り低石布石抑制", "pressure-normal", {
    situationalBias: { whiteThreatLeftLowStoneSetupPenalty: 10 },
  }, "敵前衛脅威が残るまま石1以下へ落ちる布石を抑え、このターンの処理と次ターンの防御余力を優先する。"),
  hybridVariant("pressure_white_threat_left_focus_missed_attack_v1", "本実装候補: 白脅威残り布石+対黒focus手がかり", "pressure-normal", {
    situationalBias: { whiteThreatLeftLowStoneSetupPenalty: 6, whiteLowStoneFocusMissedAttackPenalty: 4 },
  }, "汎用の脅威残り低石布石抑制に、黒限定で有効だった攻撃見送りfocus抑制を軽く混ぜ、副作用の有無を見る。"),
  actionVariant("pressure_attack_monster_plus8", "攻撃: attack_monster+8", "pressure-normal", { actionBias: { attack_monster: 8 } }, "盤面制圧を少し厚くし、黒の前のめり展開を止める。"),
  actionVariant("pressure_attack_monster4_shield2", "混合: attack_monster+4 / shield+2", "pressure-normal", { actionBias: { attack_monster: 4, shield: 2 } }, "盤面処理と守りを薄く両立し、石枯渇を避ける現実的補正を見る。"),
  actionVariant("pressure_attack_monster_plus12", "攻撃: attack_monster+12", "pressure-normal", { actionBias: { attack_monster: 12 } }, "盤面制圧補正を強め、黒耐性の上限と勝ち切り遅延を測る。"),
  actionVariant("pressure_attack_monster_plus16", "攻撃: attack_monster+16", "pressure-normal", { actionBias: { attack_monster: 16 } }, "盤面処理へ強く寄せた時、白らしさを保てるかの上限確認。"),
  actionVariant("pressure_wake8_shield8", "混合: wake_up+8 / shield+8", "pressure-normal", { actionBias: { wake_up: 8, shield: 8 } }, "展開前倒しと保護を薄く両立し、白らしい制圧へ寄せる。"),
  actionVariant("pressure_attack_monster8_shield4", "混合: attack_monster+8 / shield+4", "pressure-normal", { actionBias: { attack_monster: 8, shield: 4 } }, "盤面処理を主軸にしつつ、倒されると困る駒だけ少し守る。"),
  actionVariant("pressure_attack_monster8_wake4", "混合: attack_monster+8 / wake_up+4", "pressure-normal", { actionBias: { attack_monster: 8, wake_up: 4 } }, "盤面処理の補助としてウェイクアップを薄く足し、反撃速度を確保する。"),
  actionVariant("pressure_attack_monster8_closeout4", "混合: attack_monster+8 / attack_master+4", "pressure-normal", { actionBias: { attack_monster: 8, attack_master: 4 } }, "盤面処理に寄せすぎた時の決着力不足を本体攻撃補正で補う。"),
  actionVariant("pressure_wake16_shield_minus8", "混合: wake_up+16 / shield-8", "pressure-normal", { actionBias: { wake_up: 16, shield: -8 } }, "守るより起こして動かす形へ寄せ、速度不足を補えるか見る。"),
  weightVariant("weights_level_up", "重み: レベルアップ最大化", "pressure-normal", {
    weights: { futureOwnLevelUp: 0.3, futureOpponentLevelUp: 0.28, futureOwnThreatenedMonster: 0.34, masterDamageBase: 90 },
  }, "白の本筋である、守った駒のレベルアップ期待をさらに強める。"),
  weightVariant("weights_guard", "重み: 保護重視", "pressure-normal", {
    weights: { masterHp: 92, healPerPoint: 34, futureOwnLevelUp: 0.22, futureOwnThreatenedMonster: 0.38 },
    actionBias: { shield: 6 },
  }, "黒速攻を受け止める方向へ寄せ、長期戦化の副作用を見る。"),
  weightVariant("weights_counter", "重み: 反撃重視", "pressure-normal", {
    weights: { masterDamageBase: 104, monsterKillBase: 270, futureOpponentThreatenedMonster: 0.22 },
    actionBias: { attack_master: 4 },
  }, "守った後に勝ち切れない問題へ、本体打点と敵駒圧力で対処する。"),
  weightVariant("weights_deny", "重み: 相手レベルアップ拒否", "pressure-normal", {
    weights: { monsterKillBase: 320, futureOpponentLevelUp: 0.36, futureOwnThreatenedMonster: 0.32 },
    actionBias: { attack_monster: 4 },
  }, "黒のバーサク供養に近い、相手のレベルアップ機会を奪う判断を強める。"),
  weightVariant("weights_deny_attack_monster8", "重み: 拒否 + attack_monster+8", "pressure-normal", {
    weights: { monsterKillBase: 320, futureOpponentLevelUp: 0.36, futureOwnThreatenedMonster: 0.32 },
    actionBias: { attack_monster: 8 },
  }, "相手レベルアップ拒否と盤面攻撃補正を合わせ、黒速攻を盤面から止める。"),
  weightVariant("weights_stone_light", "重み: ストーン軽視", "pressure-normal", {
    weights: { stone: 3, genericMagicCost: 6 },
    actionBias: { wake_up: 4, shield: 4 },
  }, "白特技を温存しすぎる仮説を確認し、石を盤面へ変換しやすくする。"),
  weightVariant("weights_stone_guard", "重み: ストーン温存", "pressure-normal", {
    weights: { stone: 8, genericMagicCost: 10, futureOwnThreatenedMonster: 0.34 },
    actionBias: { shield: 8 },
  }, "石の尽き方が負け筋なら、必要な盾だけ撃つ形が安定するか見る。"),
  weightVariant("stone_guard_no_proactive_shield", "診断: 石温存 / 予防シールド抑制", "pressure-normal", {
    weights: { stone: 9, genericMagicCost: 11, futureOwnThreatenedMonster: 0.32 },
    actionBias: { shield: -4, master_attack: -4 },
  }, "石を残し、成果の薄いシールドと非リーサルのマスターアタックを抑える。"),
  weightVariant("wounded_levelup_setup", "診断: 負傷レベルアップ布石", "pressure-normal", {
    weights: { futureOwnLevelUp: 0.32, futureOpponentLevelUp: 0.26, futureOwnThreatenedMonster: 0.32, healPerPoint: 34 },
    actionBias: { shield: 2, attack_monster: 4 },
  }, "負傷モンスターを守ってレベルアップ回復へ変換する布石を薄く強める。"),
  hybridVariant("pressure_full_hybrid", "複合: レベルアップ + wake/shield", "pressure-normal", {
    weights: { futureOwnLevelUp: 0.28, futureOpponentLevelUp: 0.3, futureOwnThreatenedMonster: 0.36 },
    actionBias: { wake_up: 8, shield: 6, attack_monster: 4 },
  }, "白の主筋を広く押し、単独補正より安定するかを見る。"),
  hybridVariant("white494_wake8", "投稿494: wake_up+8", "submission-pro-no-rare8-white-494", {
    actionBias: { wake_up: 8 },
  }, "投稿白デッキでウェイクアップ補正が再現するかを見る。"),
  hybridVariant("white494_guard", "投稿494: 保護重視", "submission-pro-no-rare8-white-494", {
    weights: { futureOwnLevelUp: 0.26, futureOwnThreatenedMonster: 0.36 },
    actionBias: { shield: 8 },
  }, "投稿白デッキで守って育てる筋が黒相手に間に合うか見る。"),
  hybridVariant("white1340_level", "投稿1340: レベルアップ重視", "submission-pro-no-rare8-white-1340", {
    weights: { futureOwnLevelUp: 0.32, futureOpponentLevelUp: 0.28 },
    actionBias: { shield: 6, wake_up: 6 },
  }, "育成寄りデッキで白AIの本筋を最大化する。"),
  hybridVariant("balanced_guard", "balanced: 保護重視", "balanced-normal", {
    weights: { masterHp: 92, futureOwnThreatenedMonster: 0.36 },
    actionBias: { shield: 8 },
  }, "標準構成で過剰防御にならず黒に耐えられるか見る。"),
  hybridVariant("balanced_attack_monster8", "balanced: attack_monster+8", "balanced-normal", {
    actionBias: { attack_monster: 8 },
  }, "標準構成でも盤面処理補正が再現するかを見る。"),
  hybridVariant("balanced_wake8_shield8", "balanced: wake/shield+8", "balanced-normal", {
    actionBias: { wake_up: 8, shield: 8 },
  }, "標準構成で展開と保護を同時に押した場合の平均値を見る。"),
] as const satisfies readonly WhiteAiTuningVariant[];

export function runWhiteAiTuningLoop(options: WhiteAiTuningLoopOptions = {}): WhiteAiTuningReport {
  const opponents = options.opponents ?? DEFAULT_WHITE_AI_TUNING_OPPONENTS;
  const variants = selectVariants(options);
  const gamesPerMatchup = integerOption(options.gamesPerMatchup, 2);
  const seedStart = integerOption(options.seedStart, 9000);
  const runs: WhiteAiTuningRun[] = [];
  let runIndex = 0;

  for (const variant of variants) {
    for (const opponent of opponents) {
      for (const candidateSeat of ["player", "cpu"] as const) {
        const runSeedStart = seedStart + runIndex * gamesPerMatchup;
        const run = runWhiteAiTuningMatchup({
          variant,
          opponent,
          candidateSeat,
          seedStart: runSeedStart,
          gamesPerMatchup,
          options,
        });
        runs.push(run);
        runIndex += 1;
      }
    }
  }

  const standings = summarizeStandings(variants, runs);
  return {
    generatedAt: new Date().toISOString(),
    gamesPerMatchup,
    variants,
    opponents,
    runs,
    standings,
    conclusion: buildConclusion(standings),
  };
}

export function formatWhiteAiTuningLoopMarkdown(report: WhiteAiTuningReport): string {
  return [
    "# White AI Tuning Loop",
    "",
    `生成: ${report.generatedAt}`,
    `候補: ${report.variants.length}`,
    `相手: ${report.opponents.map((opponent) => opponent.id).join(", ")}`,
    `試行: ${report.gamesPerMatchup} games/matchup/direction`,
    `総試合: ${report.runs.reduce((total, run) => total + run.result.summary.games, 0)}`,
    "",
    "## Conclusion",
    "",
    report.conclusion.summary,
    "",
    "### Next Steps",
    "",
    ...report.conclusion.nextSteps.map((step) => `- ${step}`),
    "",
    "## Top Candidates",
    "",
    "| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |",
    "| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |",
    ...report.standings.slice(0, 8).map((standing, index) => formatStandingRow(standing, index + 1)),
    "",
    "## Loop Results",
    "",
    "| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |",
    "| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |",
    ...report.standings.map((standing, index) => formatLoopResultRow(standing, index + 1)),
    "",
    "## Runs",
    "",
    "| Run | Candidate Seat | Opponent | Result | Issues |",
    "| --- | --- | --- | --- | --- |",
    ...report.runs.map(formatRunRow),
    "",
    "## Reading",
    "",
    "- `Overall` と `vs ...` は引き分けを0.5勝として扱う勝ち点率。",
    "- `vs Black` は黒速攻耐性の主指標。`black_pressure_strong` と `black_pressure_pressure` の両方を合算している。",
    "- `vs Decoy` は現行第三マスターへの基準維持。高すぎる場合は白が基準を超えすぎていないかを見る。",
    "- `vs White` は現行白基準との比較診断。採用判断では黒耐性と長期戦リスクを優先する。",
    "- `Usage` は候補白側の通常マスター特技使用回数。`wake_up` / `shield` / `master_attack` の偏りを見る。",
    "- `Intent` は白側行動の診断値。`Ex` はこのターンの仕事率、`Setup` は布石率、`LowS` は布石後に石が1以下、`ShieldConv` はシールドが次ターン成果へ変換された率。",
    "- `Pygmy` はピグミィの小打点が撃破圏作りに寄与した回数、`Poly` はポリスピナー1回目行動が同ターン成果へつながった率。",
    "- `Loss Opp HP` は候補白側が負けた時の相手残HP平均。低いほど惜敗、高いほど押し切られ。",
    "- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。",
  ].join("\n");
}

function runWhiteAiTuningMatchup(options: {
  variant: WhiteAiTuningVariant;
  opponent: WhiteAiTuningOpponent;
  candidateSeat: PlayerId;
  seedStart: number;
  gamesPerMatchup: number;
  options: WhiteAiTuningLoopOptions;
}): WhiteAiTuningRun {
  const candidate = variantSeatConfig(options.variant);
  const opponent = opponentSeatConfig(options.opponent);
  const player = options.candidateSeat === "player" ? candidate : opponent;
  const cpu = options.candidateSeat === "cpu" ? candidate : opponent;
  const labOptions = labOptionsForSeats(player, cpu);

  return {
    id: `${options.variant.id}_vs_${options.opponent.id}_${options.candidateSeat}`,
    variantId: options.variant.id,
    opponentId: options.opponent.id,
    opponentCategory: options.opponent.category,
    candidateSeat: options.candidateSeat,
    seedStart: options.seedStart,
    games: options.gamesPerMatchup,
    result: validateMasterLabAutoPlay({
      seedStart: options.seedStart,
      count: options.gamesPerMatchup,
      maxSteps: options.options.maxSteps ?? 700,
      maxTurns: options.options.maxTurns ?? 160,
      stagnationLimit: options.options.stagnationLimit,
      longGameSteps: options.options.longGameSteps,
      longGameTurns: options.options.longGameTurns,
      failOnWarnings: options.options.failOnWarnings,
      includeGameHistory: options.options.includeGameHistory ?? true,
      historyLimit: options.options.maxSteps ?? 700,
      participants: {
        player: player.participant,
        cpu: cpu.participant,
      },
      deckPresets: {
        player: player.deckPreset,
        cpu: cpu.deckPreset,
      },
      aiProfiles: {
        player: player.aiProfile,
        cpu: cpu.aiProfile,
      },
      aiTunings: {
        ...(player.tuning ? { player: player.tuning } : {}),
        ...(cpu.tuning ? { cpu: cpu.tuning } : {}),
      },
      ...labOptions,
    }),
  };
}

interface SeatConfig {
  participant: MasterLabParticipantId;
  deckPreset: DeckPresetId;
  aiProfile: CpuAiProfile;
  tuning?: CpuAiTuning;
  labActionMargin?: number;
  labEvaluationTuning?: MasterLabEvaluationTuning;
}

function variantSeatConfig(variant: WhiteAiTuningVariant): SeatConfig {
  return {
    participant: "white",
    deckPreset: variant.deckPreset,
    aiProfile: variant.aiProfile,
    ...(variant.tuning ? { tuning: variant.tuning } : {}),
  };
}

function opponentSeatConfig(opponent: WhiteAiTuningOpponent): SeatConfig {
  return {
    participant: opponent.participant,
    deckPreset: opponent.deckPreset,
    aiProfile: opponent.aiProfile,
    ...(opponent.labActionMargin !== undefined ? { labActionMargin: opponent.labActionMargin } : {}),
    ...(opponent.labEvaluationTuning ? { labEvaluationTuning: opponent.labEvaluationTuning } : {}),
  };
}

function labOptionsForSeats(
  player: SeatConfig,
  cpu: SeatConfig,
): Pick<MasterLabAutoPlayOptions, "labActionMargin" | "labEvaluationTuning"> {
  const labSeat = isLabParticipant(player.participant)
    ? player
    : isLabParticipant(cpu.participant)
      ? cpu
      : undefined;
  return {
    ...(labSeat?.labActionMargin !== undefined ? { labActionMargin: labSeat.labActionMargin } : {}),
    ...(labSeat?.labEvaluationTuning ? { labEvaluationTuning: labSeat.labEvaluationTuning } : {}),
  };
}

function summarizeStandings(
  variants: readonly WhiteAiTuningVariant[],
  runs: readonly WhiteAiTuningRun[],
): WhiteAiTuningStanding[] {
  const records = new Map(variants.map((variant) => [variant.id, createStandingRecord(variant)]));

  for (const run of runs) {
    const standing = records.get(run.variantId);
    if (!standing) {
      continue;
    }
    for (const game of run.result.games) {
      applyGameResult(standing, run, game);
    }
  }

  return [...records.values()]
    .map(finalizeStanding)
    .sort((a, b) =>
      b.score - a.score ||
      b.matchups.black.winPointRate - a.matchups.black.winPointRate ||
      b.winPointRate - a.winPointRate ||
      a.variant.id.localeCompare(b.variant.id),
    );
}

function createStandingRecord(variant: WhiteAiTuningVariant): WhiteAiTuningStanding {
  return {
    variant,
    games: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winPointRate: 0,
    score: 0,
    averageSteps: 0,
    averageTurns: 0,
    failures: 0,
    warnings: 0,
    bannedCardCount: bannedCardCount(variant.deckPreset),
    masterActionUsage: {},
    turnIntentMetrics: emptyTurnIntentMetrics(),
    matchups: {
      black: emptyMatchupStats(),
      decoy: emptyMatchupStats(),
      white: emptyMatchupStats(),
    },
    notes: [],
  };
}

function applyGameResult(
  standing: WhiteAiTuningStanding,
  run: WhiteAiTuningRun,
  game: MasterLabAutoPlayResult["games"][number],
): void {
  const candidateSeat = run.candidateSeat;
  const opponentSeat = candidateSeat === "player" ? "cpu" : "player";
  standing.games += 1;
  standing.averageSteps += game.steps;
  standing.averageTurns += game.turns;
  standing.failures += game.issueCount;
  standing.warnings += game.warningCount;
  addUsage(standing.masterActionUsage, game.masterActionUsageByPlayer[candidateSeat]);
  addTurnIntentMetrics(standing.turnIntentMetrics, summarizeTurnIntentMetrics(game.history ?? [], candidateSeat));

  const matchup = standing.matchups[run.opponentCategory];
  matchup.games += 1;
  if (!game.winner) {
    standing.draws += 1;
    matchup.draws += 1;
    return;
  }
  if (game.winner === candidateSeat) {
    standing.wins += 1;
    matchup.wins += 1;
  } else {
    standing.losses += 1;
    matchup.losses += 1;
    const opponentHp = game.stateSummary?.players[opponentSeat].hp;
    if (opponentHp !== undefined) {
      standing.averageOpponentHpOnLoss = (standing.averageOpponentHpOnLoss ?? 0) + opponentHp;
    }
  }
}

function finalizeStanding(standing: WhiteAiTuningStanding): WhiteAiTuningStanding {
  const games = Math.max(standing.games, 1);
  const finalizedMatchups = {
    black: finalizeMatchupStats(standing.matchups.black),
    decoy: finalizeMatchupStats(standing.matchups.decoy),
    white: finalizeMatchupStats(standing.matchups.white),
  };
  const winPointRate = rate(standing.wins + standing.draws * 0.5, standing.games);
  const playedMatchups = Object.values(finalizedMatchups).filter((matchup) => matchup.games > 0);
  const matchupFloor = playedMatchups.length > 0 ? Math.min(...playedMatchups.map((matchup) => matchup.winPointRate)) : 0;
  const averageSteps = round1(standing.averageSteps / games);
  const averageTurns = round1(standing.averageTurns / games);
  const speedScore = clamp((42 - averageTurns) / 20, 0, 1);
  const safetyPenalty = standing.failures * 24 + standing.warnings * 6;
  const bannedPenalty = standing.bannedCardCount * 14;
  const decoyOverrunPenalty = finalizedMatchups.decoy.games > 0
    ? Math.max(0, finalizedMatchups.decoy.winPointRate - 0.75) * 8
    : 0;
  const lossOpponentHp = standing.losses > 0 && standing.averageOpponentHpOnLoss !== undefined
    ? round1(standing.averageOpponentHpOnLoss / standing.losses)
    : undefined;
  const intentScore = turnIntentScore(standing.turnIntentMetrics);
  const score = round1(
    finalizedMatchups.black.winPointRate * 46 +
    finalizedMatchups.decoy.winPointRate * 16 +
    finalizedMatchups.white.winPointRate * 8 +
    winPointRate * 12 +
    matchupFloor * 12 +
    speedScore * 6 -
    safetyPenalty -
    bannedPenalty -
    decoyOverrunPenalty +
    intentScore,
  );

  return {
    ...standing,
    winPointRate: round3(winPointRate),
    score,
    averageSteps,
    averageTurns,
    averageOpponentHpOnLoss: lossOpponentHp,
    matchups: finalizedMatchups,
    notes: buildStandingNotes(standing, finalizedMatchups, averageTurns, lossOpponentHp),
  };
}

function buildConclusion(standings: readonly WhiteAiTuningStanding[]): WhiteAiTuningReport["conclusion"] {
  const best = standings[0];
  const baseline = standings.find((standing) => standing.variant.id === "pressure_white_baseline");
  const blackStable = standings.filter((standing) =>
    standing.failures === 0 &&
    standing.warnings <= 1 &&
    standing.matchups.black.winPointRate >= 0.45,
  );
  const top = standings.slice(0, 5);
  const nextSteps: string[] = [];

  if (!best) {
    return {
      summary: "白AI候補は評価されていない。",
      nextSteps: ["候補数と相手セットを確認して再実行する。"],
    };
  }

  const baselineBlackDelta = baseline
    ? best.matchups.black.winPointRate - baseline.matchups.black.winPointRate
    : 0;

  if (best.failures > 0 || best.warnings > 1) {
    nextSteps.push(`首位 \`${best.variant.id}\` は issue が ${best.failures}F/${best.warnings}W あるため、採用前に該当seedを確認する。`);
  }
  if (blackStable.length > 0) {
    nextSteps.push(`次は \`${blackStable.slice(0, 4).map((standing) => standing.variant.id).join("`, `")}\` を games-per-matchup 8-12 で確認する。`);
  } else {
    nextSteps.push("vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。");
  }
  if (best.matchups.black.winPointRate < 0.45) {
    nextSteps.push("首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。");
  }
  if (best.masterActionUsage.shield && best.masterActionUsage.wake_up && best.masterActionUsage.shield > best.masterActionUsage.wake_up * 2) {
    nextSteps.push("首位はシールド寄り。確認ループでは `wake_up` 補正を少し足す条件を横に置き、守った後の勝ち切り不足を確認する。");
  }
  nextSteps.push("採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。");
  nextSteps.push("次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。");

  return {
    summary: [
      `首位は \`${best.variant.id}\`（score ${best.score} / overall ${formatPercent(best.winPointRate)} / vs Black ${formatPercent(best.matchups.black.winPointRate)}）。`,
      baseline ? `現行 \`pressure_white_baseline\` 比の vs Black 差分は ${formatSignedPercent(baselineBlackDelta)}。` : "",
      `安定候補（vs Black 45%以上、0F/1W以下）は ${blackStable.length} 件。`,
      `上位候補: ${top.map((standing) => `${standing.variant.id} ${formatPercent(standing.matchups.black.winPointRate)}`).join(" / ")}。`,
    ].filter(Boolean).join(" "),
    nextSteps,
  };
}

function buildStandingNotes(
  standing: WhiteAiTuningStanding,
  matchups: Record<WhiteAiTuningOpponentCategory, WhiteAiTuningMatchupStats>,
  averageTurns: number,
  averageOpponentHpOnLoss: number | undefined,
): string[] {
  const notes: string[] = [];
  if (standing.bannedCardCount > 0) {
    notes.push(`${getCardName(BANNED_CARD_IDS[0])}入り`);
  }
  if (standing.failures > 0) {
    notes.push(`failure ${standing.failures}`);
  }
  if (standing.warnings > 0) {
    notes.push(`warning ${standing.warnings}`);
  }
  if (matchups.black.games > 0 && matchups.black.winPointRate < 0.4) {
    notes.push("黒に弱い");
  }
  if (matchups.black.games > 0 && matchups.black.winPointRate >= 0.5) {
    notes.push("黒耐性あり");
  }
  if (averageTurns > 42) {
    notes.push("長期戦寄り");
  }
  if (averageOpponentHpOnLoss !== undefined && averageOpponentHpOnLoss <= 3) {
    notes.push("惜敗多め");
  }
  if ((standing.masterActionUsage.shield ?? 0) > (standing.masterActionUsage.wake_up ?? 0) * 2 && (standing.masterActionUsage.shield ?? 0) >= 8) {
    notes.push("シールド偏重");
  }
  const shieldNoConversionRate = rate(standing.turnIntentMetrics.shieldNoConversion, standing.turnIntentMetrics.shieldUses);
  if (shieldNoConversionRate >= 0.45 && standing.turnIntentMetrics.shieldUses >= 8) {
    notes.push("盾の成果化不足");
  }
  const lowStoneSetupRate = rate(standing.turnIntentMetrics.lowStoneAfterSetup, standing.turnIntentMetrics.setupActions);
  if (lowStoneSetupRate >= 0.35 && standing.turnIntentMetrics.setupActions >= 8) {
    notes.push("布石後の石枯渇");
  }
  return notes.length > 0 ? notes : ["-"];
}

function formatStandingRow(standing: WhiteAiTuningStanding, rank: number): string {
  return [
    rank,
    escapeCell(`${standing.variant.id}<br>${standing.variant.label}`),
    standing.variant.kind,
    escapeCell(`${standing.variant.deckPreset}<br>${getDeckPreset(standing.variant.deckPreset).name}`),
    standing.score,
    `${standing.wins}-${standing.losses}-${standing.draws}`,
    formatPercent(standing.winPointRate),
    formatMatchup(standing.matchups.black),
    formatMatchup(standing.matchups.decoy),
    formatMatchup(standing.matchups.white),
    standing.averageTurns,
    standing.averageOpponentHpOnLoss ?? "-",
    formatUsage(standing.masterActionUsage),
    formatTurnIntentMetrics(standing.turnIntentMetrics),
    `${standing.failures}F/${standing.warnings}W`,
    escapeCell(standing.notes.join("<br>")),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatLoopResultRow(standing: WhiteAiTuningStanding, rank: number): string {
  return [
    rank,
    escapeCell(`${standing.variant.id}<br>${standing.variant.label}`),
    escapeCell(standing.variant.hypothesis),
    escapeCell(formatTuning(standing.variant.tuning)),
    standing.score,
    formatPercent(standing.winPointRate),
    formatMatchup(standing.matchups.black),
    formatMatchup(standing.matchups.decoy),
    formatMatchup(standing.matchups.white),
    formatUsage(standing.masterActionUsage),
    formatTurnIntentMetrics(standing.turnIntentMetrics),
    escapeCell(standing.notes.join("<br>")),
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function formatRunRow(run: WhiteAiTuningRun): string {
  return [
    run.id,
    run.candidateSeat,
    run.opponentId,
    `P ${run.result.summary.winners.player} / C ${run.result.summary.winners.cpu} / D ${run.result.summary.undecided}`,
    `${run.result.summary.failures}F/${run.result.summary.warnings}W`,
  ].join(" | ").replace(/^/, "| ").replace(/$/, " |");
}

function summarizeTurnIntentMetrics(
  history: readonly MasterLabDecisionEvent[],
  candidateSeat: PlayerId,
): WhiteAiTurnIntentMetrics {
  const metrics = emptyTurnIntentMetrics();
  for (let index = 0; index < history.length; index += 1) {
    const event = history[index];
    if (!event || event.player !== candidateSeat || event.source !== "cpu") {
      continue;
    }

    const intent = analyzeTurnIntentEvent(event, candidateSeat);
    metrics.totalActions += 1;
    if (intent.execution) {
      metrics.executionActions += 1;
    } else if (intent.setup) {
      metrics.setupActions += 1;
      if (event.after.players[candidateSeat].stones <= 1) {
        metrics.lowStoneAfterSetup += 1;
      }
    }

    const shieldTargetSlotKey = shieldTargetSlotKeyForEvent(event);
    if (shieldTargetSlotKey) {
      metrics.shieldUses += 1;
      if (shieldConvertedOnNextOwnTurn(history, index, candidateSeat, shieldTargetSlotKey)) {
        metrics.shieldConvertedNextTurn += 1;
      } else {
        metrics.shieldNoConversion += 1;
      }
    }

    if (intent.woundedLevelUpHeal) {
      metrics.woundedLevelUpHeal += 1;
    }
    if (intent.attackerCard === PIGMY_CARD_ID) {
      metrics.pygmyActions += 1;
      if (intent.enemyDamaged && !intent.enemyKilled) {
        metrics.pygmySetupHits += 1;
      }
    }
    if (isPolyspinnerFirstAction(event, intent.actorSlotKey)) {
      metrics.polyspinnerFirstActions += 1;
      if (intent.execution || laterSameTurnPolyspinnerExecution(history, index, candidateSeat)) {
        metrics.polyspinnerPurposefulFirstAction += 1;
      } else {
        metrics.polyspinnerWasteAction += 1;
      }
    }
  }
  return metrics;
}

interface TurnIntentEventAnalysis {
  execution: boolean;
  setup: boolean;
  enemyDamaged: boolean;
  enemyKilled: boolean;
  woundedLevelUpHeal: boolean;
  actorSlotKey?: string;
  attackerCard?: string;
}

function analyzeTurnIntentEvent(
  event: MasterLabDecisionEvent,
  candidateSeat: PlayerId,
): TurnIntentEventAnalysis {
  const opponentSeat = opponentSeatOf(candidateSeat);
  const actorSlotKey = actorSlotKeyForEvent(event);
  const actorSlot = actorSlotKey ? slotByKey(event.before, actorSlotKey) : undefined;
  const targetSlotKey = targetSlotKeyForEvent(event);
  const targetBefore = targetSlotKey ? slotByKey(event.before, targetSlotKey) : undefined;
  const targetAfter = targetSlotKey ? slotByKey(event.after, targetSlotKey) : undefined;
  const enemyDamaged = !!(
    targetBefore?.owner === opponentSeat &&
    targetAfter?.owner === opponentSeat &&
    targetBefore.card === targetAfter.card &&
    targetBefore.hp !== undefined &&
    targetAfter.hp !== undefined &&
    targetAfter.hp < targetBefore.hp
  );
  const enemyKilled = !!(
    targetBefore?.owner === opponentSeat &&
    targetBefore.card &&
    (!targetAfter?.card || targetAfter.owner !== opponentSeat || targetAfter.card !== targetBefore.card)
  );
  const ownLevelUp = event.before.slots.some((beforeSlot) => {
    const afterSlot = slotByKey(event.after, beforeSlot.slotKey);
    return (
      beforeSlot.owner === candidateSeat &&
      afterSlot?.owner === candidateSeat &&
      beforeSlot.card === afterSlot.card &&
      beforeSlot.level !== undefined &&
      afterSlot.level !== undefined &&
      afterSlot.level > beforeSlot.level
    );
  });
  const woundedLevelUpHeal = event.before.slots.some((beforeSlot) => {
    const afterSlot = slotByKey(event.after, beforeSlot.slotKey);
    if (
      beforeSlot.owner !== candidateSeat ||
      afterSlot?.owner !== candidateSeat ||
      !beforeSlot.card ||
      beforeSlot.card !== afterSlot.card ||
      beforeSlot.level === undefined ||
      afterSlot.level === undefined ||
      beforeSlot.hp === undefined ||
      afterSlot.hp === undefined ||
      afterSlot.level <= beforeSlot.level ||
      afterSlot.hp <= beforeSlot.hp
    ) {
      return false;
    }
    return beforeSlot.hp < monsterMaxHpAtLevel(beforeSlot.card, beforeSlot.level);
  });
  const masterHpDamage = event.after.players[opponentSeat].hp < event.before.players[opponentSeat].hp;
  const execution = !!event.after.winner || masterHpDamage || enemyKilled || ownLevelUp;
  const setup = !execution && (
    event.decision.startsWith("summon:") ||
    event.decision.startsWith("move:") ||
    event.decision.startsWith("focus:") ||
    event.decision.startsWith("master:shield") ||
    event.decision.startsWith("master:wake_up") ||
    enemyDamaged
  );

  return {
    execution,
    setup,
    enemyDamaged,
    enemyKilled,
    woundedLevelUpHeal,
    actorSlotKey,
    attackerCard: actorSlot?.card,
  };
}

function shieldConvertedOnNextOwnTurn(
  history: readonly MasterLabDecisionEvent[],
  shieldEventIndex: number,
  candidateSeat: PlayerId,
  shieldTargetSlotKey: string,
): boolean {
  const shieldEvent = history[shieldEventIndex];
  if (!shieldEvent) {
    return false;
  }
  const shieldedSlot = slotByKey(shieldEvent.after, shieldTargetSlotKey);
  if (shieldedSlot?.owner !== candidateSeat || !shieldedSlot.card) {
    return false;
  }
  const nextTurnNumber = history
    .slice(shieldEventIndex + 1)
    .find((event) => event.player === candidateSeat && event.turnNumber > shieldEvent.turnNumber)
    ?.turnNumber;
  if (nextTurnNumber === undefined) {
    return false;
  }

  return history.some((event, index) => {
    if (index <= shieldEventIndex || event.player !== candidateSeat || event.turnNumber !== nextTurnNumber || event.source !== "cpu") {
      return false;
    }
    const actorSlotKey = actorSlotKeyForEvent(event);
    if (actorSlotKey !== shieldTargetSlotKey) {
      return false;
    }
    const actorSlot = slotByKey(event.before, actorSlotKey);
    if (actorSlot?.owner !== candidateSeat || actorSlot.card !== shieldedSlot.card) {
      return false;
    }
    const analysis = analyzeTurnIntentEvent(event, candidateSeat);
    return analysis.execution || event.decision.startsWith("attack:");
  });
}

function laterSameTurnPolyspinnerExecution(
  history: readonly MasterLabDecisionEvent[],
  firstActionIndex: number,
  candidateSeat: PlayerId,
): boolean {
  const first = history[firstActionIndex];
  if (!first) {
    return false;
  }
  for (let index = firstActionIndex + 1; index < history.length; index += 1) {
    const event = history[index];
    if (!event || event.turnNumber !== first.turnNumber) {
      break;
    }
    if (event.player !== candidateSeat || event.source !== "cpu") {
      continue;
    }
    const actorSlotKey = actorSlotKeyForEvent(event);
    const actorSlot = actorSlotKey ? slotByKey(event.before, actorSlotKey) : undefined;
    if (actorSlot?.card !== POLYSPINNER_CARD_ID) {
      continue;
    }
    if (analyzeTurnIntentEvent(event, candidateSeat).execution) {
      return true;
    }
  }
  return false;
}

function isPolyspinnerFirstAction(event: MasterLabDecisionEvent, actorSlotKey: string | undefined): boolean {
  if (!actorSlotKey) {
    return false;
  }
  const beforeSlot = slotByKey(event.before, actorSlotKey);
  if (beforeSlot?.card !== POLYSPINNER_CARD_ID || beforeSlot.actionCount !== 0) {
    return false;
  }
  return event.decision.startsWith("attack:") || event.decision.startsWith("move:") || event.decision.startsWith("focus:");
}

function actorSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  if (event.decision.startsWith("attack:")) {
    return event.decision.split(":")[1];
  }
  if (event.decision.startsWith("move:")) {
    return event.decision.slice("move:".length).split("->")[0];
  }
  if (event.decision.startsWith("focus:")) {
    return event.decision.slice("focus:".length);
  }
  return undefined;
}

function targetSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  const target = event.decision.split("->")[1];
  return target?.startsWith("monster:") ? target.slice("monster:".length) : undefined;
}

function shieldTargetSlotKeyForEvent(event: MasterLabDecisionEvent): string | undefined {
  if (!event.decision.startsWith("master:shield->monster:")) {
    return undefined;
  }
  return event.decision.slice("master:shield->monster:".length);
}

function slotByKey(summary: MasterLabGameStateSummary, slotKey: string): MasterLabGameStateSummary["slots"][number] | undefined {
  return summary.slots.find((slot) => slot.slotKey === slotKey);
}

function monsterMaxHpAtLevel(cardId: string, level: number): number {
  const def = getMonsterDef(cardId);
  return def.levels.find((levelDef) => levelDef.level === level)?.maxHp ?? def.levels[0]?.maxHp ?? 0;
}

function opponentSeatOf(playerId: PlayerId): PlayerId {
  return playerId === "player" ? "cpu" : "player";
}

function baselineVariant(
  id: string,
  label: string,
  deckPreset: DeckPresetId,
  aiProfile: CpuAiProfile,
  hypothesis: string,
): WhiteAiTuningVariant {
  return { id, kind: "baseline", label, deckPreset, aiProfile, hypothesis };
}

function actionVariant(
  id: string,
  label: string,
  deckPreset: DeckPresetId,
  tuning: CpuAiTuning,
  hypothesis: string,
): WhiteAiTuningVariant {
  return { id, kind: "action_bias", label, deckPreset, aiProfile: "white", tuning, hypothesis };
}

function weightVariant(
  id: string,
  label: string,
  deckPreset: DeckPresetId,
  tuning: CpuAiTuning,
  hypothesis: string,
): WhiteAiTuningVariant {
  return { id, kind: "weights", label, deckPreset, aiProfile: "white", tuning, hypothesis };
}

function hybridVariant(
  id: string,
  label: string,
  deckPreset: DeckPresetId,
  tuning: CpuAiTuning,
  hypothesis: string,
): WhiteAiTuningVariant {
  return { id, kind: "hybrid", label, deckPreset, aiProfile: "white", tuning, hypothesis };
}

function selectVariants(options: WhiteAiTuningLoopOptions): readonly WhiteAiTuningVariant[] {
  const source = options.variants ?? DEFAULT_WHITE_AI_TUNING_VARIANTS;
  const variantIdSet = options.variantIds && options.variantIds.length > 0
    ? new Set(options.variantIds)
    : undefined;
  const selected = variantIdSet ? source.filter((variant) => variantIdSet.has(variant.id)) : source;
  const loopCount = Number.isInteger(options.loopCount) && options.loopCount !== undefined
    ? options.loopCount
    : selected.length;
  return selected.slice(0, Math.max(0, loopCount));
}

function emptyMatchupStats(): WhiteAiTuningMatchupStats {
  return { games: 0, wins: 0, losses: 0, draws: 0, winPointRate: 0 };
}

function emptyTurnIntentMetrics(): WhiteAiTurnIntentMetrics {
  return {
    totalActions: 0,
    executionActions: 0,
    setupActions: 0,
    lowStoneAfterSetup: 0,
    shieldUses: 0,
    shieldConvertedNextTurn: 0,
    shieldNoConversion: 0,
    woundedLevelUpHeal: 0,
    pygmyActions: 0,
    pygmySetupHits: 0,
    polyspinnerFirstActions: 0,
    polyspinnerPurposefulFirstAction: 0,
    polyspinnerWasteAction: 0,
  };
}

function finalizeMatchupStats(stats: WhiteAiTuningMatchupStats): WhiteAiTuningMatchupStats {
  return {
    ...stats,
    winPointRate: round3(rate(stats.wins + stats.draws * 0.5, stats.games)),
  };
}

function addUsage(target: Record<string, number>, source: Record<string, number>): void {
  for (const [key, value] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + value;
  }
}

function addTurnIntentMetrics(target: WhiteAiTurnIntentMetrics, source: WhiteAiTurnIntentMetrics): void {
  for (const key of TURN_INTENT_METRIC_KEYS) {
    target[key] += source[key];
  }
}

function turnIntentScore(metrics: WhiteAiTurnIntentMetrics): number {
  const shieldConversionRate = rate(metrics.shieldConvertedNextTurn, metrics.shieldUses);
  const lowStoneSetupRate = rate(metrics.lowStoneAfterSetup, metrics.setupActions);
  const polyPurposeRate = rate(metrics.polyspinnerPurposefulFirstAction, metrics.polyspinnerFirstActions);
  const polyWasteRate = rate(metrics.polyspinnerWasteAction, metrics.polyspinnerFirstActions);
  const woundedLevelUpHealRate = rate(metrics.woundedLevelUpHeal, metrics.totalActions);
  const pygmySetupRate = rate(metrics.pygmySetupHits, metrics.totalActions);

  return round1(
    shieldConversionRate * 4 -
    lowStoneSetupRate * 6 +
    polyPurposeRate * 2 -
    polyWasteRate * 2 +
    woundedLevelUpHealRate * 10 +
    pygmySetupRate * 4,
  );
}

function bannedCardCount(deckPreset: DeckPresetId): number {
  const cardIds = buildDeckPresetCardIds(deckPreset);
  return cardIds.filter((cardId) => (BANNED_CARD_IDS as readonly string[]).includes(cardId)).length;
}

function isLabParticipant(participant: MasterLabParticipantId): boolean {
  return participant === "decoy" || participant === "sacrifice" || participant === "timing";
}

function formatMatchup(stats: WhiteAiTuningMatchupStats): string {
  return stats.games > 0
    ? `${formatPercent(stats.winPointRate)} (${stats.wins}-${stats.losses}-${stats.draws})`
    : "-";
}

function formatUsage(usage: Record<string, number>): string {
  const entries = Object.entries(usage)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (entries.length === 0) {
    return "-";
  }
  return entries.slice(0, 5).map(([key, count]) => `${key}:${count}`).join(", ");
}

function formatTurnIntentMetrics(metrics: WhiteAiTurnIntentMetrics): string {
  if (metrics.totalActions <= 0) {
    return "-";
  }
  return [
    `Ex ${formatPercent(rate(metrics.executionActions, metrics.totalActions))}`,
    `Setup ${formatPercent(rate(metrics.setupActions, metrics.totalActions))}`,
    `LowS ${formatPercent(rate(metrics.lowStoneAfterSetup, metrics.setupActions))}`,
    `ShieldConv ${formatPercent(rate(metrics.shieldConvertedNextTurn, metrics.shieldUses))}`,
    `Pygmy ${metrics.pygmySetupHits}/${metrics.pygmyActions}`,
    `Poly ${formatPercent(rate(metrics.polyspinnerPurposefulFirstAction, metrics.polyspinnerFirstActions))}`,
  ].join("<br>");
}

function formatTuning(tuning: CpuAiTuning | undefined): string {
  if (!tuning) {
    return "-";
  }
  const parts: string[] = [];
  const actionBias = Object.entries(tuning.actionBias ?? {});
  if (actionBias.length > 0) {
    parts.push(`action ${actionBias.map(([key, value]) => `${key}${formatSignedNumber(value)}`).join(", ")}`);
  }
  const weights = Object.entries(tuning.weights ?? {});
  if (weights.length > 0) {
    parts.push(`weights ${weights.map(([key, value]) => `${key}:${value}`).join(", ")}`);
  }
  const situationalBias = Object.entries(tuning.situationalBias ?? {});
  if (situationalBias.length > 0) {
    parts.push(`situational ${situationalBias.map(([key, value]) => `${key}:${value}`).join(", ")}`);
  }
  return parts.join("<br>");
}

function rate(points: number, games: number): number {
  return games > 0 ? points / games : 0;
}

function integerOption(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value !== undefined ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function round3(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function formatPercent(value: number): string {
  return `${round1(value * 100)}%`;
}

function formatSignedPercent(value: number): string {
  const rounded = round1(value * 100);
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}

function formatSignedNumber(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

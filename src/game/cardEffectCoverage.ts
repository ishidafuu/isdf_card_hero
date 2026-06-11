export type CoverageStatus = "covered" | "simplified" | "pending";

export interface CardEffectCoverageArea {
  id: string;
  title: string;
  status: Extract<CoverageStatus, "covered">;
  scope: string;
  coveredBy: string[];
  magicCategories?: string[];
  commandTraits?: CommandEffectTrait[];
  notes?: string[];
}

export type CommandEffectTrait =
  | "effectText"
  | "stoneCost"
  | "recoilDamage"
  | "straight"
  | "piercing"
  | "decreasing_straight"
  | "line"
  | "special";

export interface SimplifiedOrPendingCardEffect {
  id: string;
  title: string;
  status: Exclude<CoverageStatus, "covered">;
  scope: string;
  currentBehavior: string;
  reason: string;
  followUp: string;
  relatedCards?: string[];
}

export const IMPORTED_MAGIC_CATEGORIES = [
  "カード魔法",
  "シールド魔法",
  "ストーン魔法",
  "パワー魔法",
  "レベル魔法",
  "呪印魔法",
  "回復魔法",
  "攻撃魔法",
  "最高位魔法",
  "特殊防御魔法",
  "特殊魔法",
  "空間魔法",
] as const;

export const COMMAND_EFFECT_TRAITS: readonly CommandEffectTrait[] = [
  "effectText",
  "stoneCost",
  "recoilDamage",
  "straight",
  "piercing",
  "decreasing_straight",
  "line",
  "special",
] as const;

export const CARD_EFFECT_COVERAGE_AREAS: readonly CardEffectCoverageArea[] = [
  {
    id: "card_pool_import",
    title: "カードプール投入状態",
    status: "covered",
    scope: "スペシャルカードを除く公式カード126枚、仮アイコン、未実装フラグの混入を検出する。",
    coveredBy: [
      "tests/game/rules.test.ts: imports the non-super original card pool with temporary icons",
      "tests/game/rules.test.ts: does not keep imported cards marked as unimplemented",
    ],
  },
  {
    id: "targetability",
    title: "対象選択と射程",
    status: "covered",
    scope: "全マジックと全モンスター技が、盤面上で少なくとも1つ合法対象を持つことを検出する。",
    coveredBy: [
      "tests/game/rules.test.ts: gives every imported magic card at least one playable target in a populated board",
      "tests/game/rules.test.ts: gives every imported monster command at least one playable target in a populated board",
    ],
    magicCategories: [...IMPORTED_MAGIC_CATEGORIES],
    commandTraits: ["stoneCost", "recoilDamage", "straight", "piercing", "decreasing_straight", "line", "special"],
  },
  {
    id: "range_geometry",
    title: "特殊射程と命中判定",
    status: "covered",
    scope: "射程2/3、斜め飛ばし、マスター到達、貫通、直線、特殊射程、命中しない技の代表例を検証する。",
    coveredBy: [
      "tests/game/rules.test.ts: lets range-2 attacks target the diagonally forward skipped lane",
      "tests/game/rules.test.ts: lets range-2 attacks target the opponent master coordinate",
      "tests/game/rules.test.ts: lets range-2 attacks reach from the right front to the opposite left front",
      "tests/game/rules.test.ts: lets range-3 attacks reach from the bottom right to the top left",
      "tests/game/rules.test.ts: lets Pigmy Lv2 spike ball target both range-2 and range-3 squares",
      "tests/game/rules.test.ts: can miss with Kentaurus Gemini Lance",
      "tests/game/rules.test.ts: moves Gungnir forward before sweep attacking",
      "tests/game/rules.test.ts: limits once-only Ro Ro and special attack targets from card text",
    ],
    commandTraits: ["straight", "piercing", "decreasing_straight", "line", "special", "effectText"],
  },
  {
    id: "resource_and_level",
    title: "コスト、レベル、ストーン変動",
    status: "covered",
    scope: "技コスト、HPドロー、山札切れ、撃破レベルアップ、投資ストーン返却、レベル変動系カードを検証する。",
    coveredBy: [
      "tests/game/rules.test.ts: spends master HP to draw and converts the HP loss into stone",
      "tests/game/rules.test.ts: applies deck-out penalty on forced draw and grants stone from HP loss",
      "tests/game/rules.test.ts: can raise a level 1 monster by two levels after defeating a level 2 monster",
      "tests/game/rules.test.ts: returns all invested stones when a level 3 monster is defeated",
      "tests/game/rules.test.ts: applies deterministic random effects for level change, plastone, and Din blast",
    ],
    magicCategories: ["ストーン魔法", "レベル魔法", "カード魔法"],
    commandTraits: ["stoneCost"],
  },
  {
    id: "secondary_choices",
    title: "複数対象と手札選択",
    status: "covered",
    scope: "二重対象、入れ替え、手札交換、捨て札選択、サーチ分類など、1アクション内で追加入力が必要な効果を検証する。",
    coveredBy: [
      "tests/game/rules.test.ts: uses explicit secondary monster targets for double shield and warp effects",
      "tests/game/rules.test.ts: uses explicit hand choices for shift change, soul switch, refresh, and card search",
    ],
    magicCategories: ["カード魔法", "シールド魔法", "特殊魔法", "空間魔法"],
    commandTraits: ["effectText"],
  },
  {
    id: "random_effects",
    title: "ランダム効果",
    status: "covered",
    scope: "ランダム結果をseedで固定し、レベル変動、ストーン増減、ランダム追加ダメージを再現可能にする。",
    coveredBy: ["tests/game/rules.test.ts: applies deterministic random effects for level change, plastone, and Din blast"],
    magicCategories: ["ストーン魔法", "レベル魔法"],
    commandTraits: ["effectText"],
  },
  {
    id: "persistent_defense",
    title: "継続防御と解除",
    status: "covered",
    scope: "女神の加護、竜の盾、スケープゴート、デスチェーン、浄化時に残る効果/消える効果を検証する。",
    coveredBy: [
      "tests/game/rules.test.ts: applies defensive persistent effects: goddess, dragon shield, scapegoat, and death chain",
      "tests/game/rules.test.ts: keeps shield and power effects when cleansing a field",
    ],
    magicCategories: ["シールド魔法", "特殊防御魔法", "特殊魔法"],
    commandTraits: ["effectText"],
  },
  {
    id: "action_restrictions",
    title: "行動制限と盤面制約",
    status: "covered",
    scope: "特技封じ、挑発、石化/呪い、ダークホール、移動不可など、行動候補を変える効果を検証する。",
    coveredBy: ["tests/game/rules.test.ts: applies action restrictions from command seal, Death Sheep, provoke, stone curse, and dark hole"],
    magicCategories: ["呪印魔法", "特殊魔法", "空間魔法"],
    commandTraits: ["effectText"],
  },
  {
    id: "damage_and_defeat_traits",
    title: "ダメージ時/撃破時効果",
    status: "covered",
    scope: "転生、復活、反撃、退却、献身、怨念、仮死、各種呪いなど、ダメージ処理と撃破処理に割り込む効果を検証する。",
    coveredBy: ["tests/game/rules.test.ts: applies damage and defeat traits: reincarnation, revive, curses, counters, retreat, devotion, grudge, and suspended animation"],
    commandTraits: ["effectText", "recoilDamage"],
  },
  {
    id: "cpu_effect_usage",
    title: "CPUの効果利用",
    status: "covered",
    scope: "CPUが攻撃/回復/強化/シールド/ウェイクアップ/移動を選ぶ代表ケースと、判断理由ログを検証する。",
    coveredBy: [
      "tests/game/cpuAi.test.ts: uses thunder when it can finish the opponent master",
      "tests/game/cpuAi.test.ts: uses healing for a threatened valuable ally with meaningful missing hp",
      "tests/game/cpuAi.test.ts: uses power up when it creates an immediate monster kill",
      "tests/game/cpuAi.test.ts: shields a threatened valuable ally",
      "tests/game/cpuAi.test.ts: wakes up a prepared ally when it can act immediately",
      "tests/game/cpuAi.test.ts: prioritizes a swap when it creates a stronger follow-up attack lane",
    ],
    magicCategories: ["攻撃魔法", "回復魔法", "パワー魔法", "シールド魔法", "カード魔法"],
  },
  {
    id: "auto_play_artifacts",
    title: "seed単位の長期検証",
    status: "covered",
    scope: "100戦単位のオートプレイで例外、未解決プロンプト、進行不能、極端な長期戦、不審判断をartifact化する。",
    coveredBy: [
      "tests/game/autoPlayValidation.test.ts: validates an arbitrary seed range without relying on vitest assertions inside the runner",
      "tests/game/autoPlayValidation.test.ts: captures reproducible state, log tail, and decision history for failures",
      "npm run validate:auto-play -- --seed-start 400 --count 100",
    ],
  },
];

export const SIMPLIFIED_OR_PENDING_CARD_EFFECTS: readonly SimplifiedOrPendingCardEffect[] = [
  {
    id: "super_cards_pending",
    title: "スペシャルカード",
    status: "pending",
    scope: "公式カードのうち、スペシャルカード枠は現カードプールへ投入していない。",
    currentBehavior: "通常カード126枚のみをランダムデッキとテスト対象にしている。",
    reason: "まず通常カードの戦闘ルール、CPU判断、検証基盤を安定させるため。",
    followUp: "スペシャルカードを導入するタイミングでカードデータ、対象選択UI、CPU判断、専用テストを追加する。",
  },
  {
    id: "per_card_assertion_gap",
    title: "全カード個別の期待値テスト",
    status: "pending",
    scope: "全カード/全技について、公式挙動と完全一致する個別期待値を1枚ずつ持つ状態にはまだしていない。",
    currentBehavior: "効果群ごとの代表テストと、全カード/全技の合法対象テストで大きな未接続を検出している。",
    reason: "効果カテゴリ横断の基盤を先に固め、警告seedやバグ報告から個別期待値を増やす方針のため。",
    followUp: "特殊効果のある技とマジックから優先度順に、1カード1期待値のケースを追加する。",
  },
  {
    id: "multi_target_defaulting",
    title: "複数対象のデフォルト解決",
    status: "simplified",
    scope: "二重の盾、ワープ、挑発、デスチェーンなど、複数対象がある効果。",
    currentBehavior: "ルールAPIではsecondaryTargetを受け取り、未指定時は合法候補から決定的に補完する。",
    reason: "手動UI/CPU/オート検証の全経路で進行不能を避けるため。",
    followUp: "手動UIで全ての追加対象を明示選択できる画面を作り、CPUは評価付きでsecondaryTargetを選ぶ。",
    relatedCards: ["二重の盾", "ワープ", "挑発", "デスチェーン"],
  },
  {
    id: "hand_choice_defaulting",
    title: "手札/山札選択のデフォルト解決",
    status: "simplified",
    scope: "シフトチェンジ、リフレッシュ、カードサーチ、ソウルスイッチなど、手札や山札カテゴリを選ぶ効果。",
    currentBehavior: "ルールAPIでは選択値を受け取り、未指定時は決定的に補完する。",
    reason: "オートプレイ検証とCPU判断を止めずに全カードを回すため。",
    followUp: "手動UIに選択パネルを追加し、CPUはデッキ残量/盤面価値を見て選択する。",
    relatedCards: ["シフトチェンジ", "リフレッシュ", "カードサーチ", "ソウルスイッチ"],
  },
  {
    id: "random_resolution_seeded",
    title: "ランダム効果のseed固定",
    status: "simplified",
    scope: "レベルチェンジ、プラストーン、爆雷撃など、ランダム結果を含む効果。",
    currentBehavior: "GameState.randomSeedを進めて決定的に解決し、同じseedでは同じ結果にする。",
    reason: "warning seedを後から完全再現し、テストで期待値を固定するため。",
    followUp: "UI上にランダム解決の結果演出を追加し、検証ログにも乱数結果を残す。",
    relatedCards: ["レベルチェンジ", "プラストーン", "ディン"],
  },
  {
    id: "cpu_magic_heuristic",
    title: "CPUの特殊効果判断",
    status: "simplified",
    scope: "CPUがマジックや特殊技を使うかどうかの判断全般。",
    currentBehavior: "撃破、回復、強化、シールド、ウェイクアップ、移動後攻撃などの浅い評価で判断する。",
    reason: "公式AI再現ではなく、ルール破綻を起こさず検証相手として動くことを優先しているため。",
    followUp: "warning seedの不審判断をもとに、同一ターン内の往復移動抑制、複数対象評価、手札選択評価を足す。",
  },
  {
    id: "temporary_original_icons",
    title: "攻略サイト由来の仮アイコン",
    status: "simplified",
    scope: "カード表示用の画像アセット。",
    currentBehavior: "テスト用として取得済み画像を表示する。",
    reason: "後で自作画像へ差し替える前提のため。",
    followUp: "自作画像の命名規則と差し替えチェックを追加する。",
  },
];

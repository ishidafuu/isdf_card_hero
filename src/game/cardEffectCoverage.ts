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

export interface DeferredProductDecision {
  id: string;
  title: string;
  scope: string;
  decision: string;
  reason: string;
  revisitWhen: string;
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
    scope: "通常カード126枚とスーパーカード24枚、仮アイコン、未実装フラグの混入を検出する。",
    coveredBy: [
      "tests/game/rules.test.ts: imports the normal and special original card pools with temporary icons",
      "tests/game/rules.test.ts: requires an explicit special deck opt-in for super cards",
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
    id: "effect_resolution",
    title: "全カード効果の発動解決",
    status: "covered",
    scope: "全マジックカードと全モンスター技を実際に1回解決し、対象列挙後の実行例外を検出する。",
    coveredBy: [
      "tests/game/cardEffectResolution.test.ts: resolves every imported magic card effect at least once",
      "tests/game/cardEffectResolution.test.ts: resolves every imported monster command at least once",
    ],
    magicCategories: [...IMPORTED_MAGIC_CATEGORIES],
    commandTraits: [...COMMAND_EFFECT_TRAITS],
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
      "tests/game/rules.test.ts: uses a matching super card from hand when resolving level up",
      "tests/game/cardOfficialExpectations.test.ts: each official super card can enter through a matching super level-up",
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
    scope: "二重対象、入れ替え、手札交換、捨て札選択、サーチ分類など、1アクション内で追加入力が必要な効果を、手動UIとCPU候補展開で検証する。",
    coveredBy: [
      "tests/game/rules.test.ts: uses explicit secondary monster targets for double shield and warp effects",
      "tests/game/rules.test.ts: uses explicit hand choices for shift change, soul switch, refresh, and card search",
      "tests/game/cpuAi.test.ts: evaluates secondary targets for double shield magic",
      "tests/game/cpuAi.test.ts: evaluates hand choices for shift change magic",
      "tests/game/cpuAi.test.ts: evaluates card search categories from the deck",
      "tests/game/cpuAi.test.ts: keeps high-value hand cards when evaluating refresh discard choices",
    ],
    magicCategories: ["カード魔法", "シールド魔法", "特殊魔法", "空間魔法"],
    commandTraits: ["effectText"],
  },
  {
    id: "per_card_official_expectations",
    title: "カード単位の公式期待値",
    status: "covered",
    scope: "公式攻略データにある効果文から、ズレやすいカードを1枚ずつ状態変化まで検証する。",
    coveredBy: [
      "tests/game/cardOfficialExpectations.test.ts: every imported card has reviewed official source data snapshot",
      "tests/game/cardOfficialExpectations.test.ts: card_027 パワーダウン lowers only the next attack by 1P",
      "tests/game/cardOfficialExpectations.test.ts: card_059 パワー２ overrides the next attack power to exactly 2P",
      "tests/game/cardOfficialExpectations.test.ts: card_094 バーサクパワー adds 1P once and deals 1 recoil after the attack",
      "tests/game/cardOfficialExpectations.test.ts: card_063 どこでも makes only the normal attack reach any active monster for one turn",
      "tests/game/cardOfficialExpectations.test.ts: card_118 かまいたち can hit front monsters on either side but not back monsters",
      "tests/game/cardOfficialExpectations.test.ts: card_119 バイストーン doubles special stone cost until the target owner's next turn",
      "tests/game/cardOfficialExpectations.test.ts: card_062 水晶の壁 blocks damage until the target owner's next turn",
      "tests/game/cardOfficialExpectations.test.ts: card_086 呪縛 prevents movement until the target owner's next turn",
      "tests/game/cardOfficialExpectations.test.ts: card_130 再生 resets a monster to its entry level and returns excess invested stones",
      "tests/game/cardOfficialExpectations.test.ts: card_127 癒しの光 heals either a master or a monster by 1",
      "tests/game/cardOfficialExpectations.test.ts: card_149 福音の鐘 levels up an eligible ally by spending one stone",
      "tests/game/cardOfficialExpectations.test.ts: card_150 スパルタス覚醒 powers up Spartas and levels it up when a stone is available",
      "tests/game/cardOfficialExpectations.test.ts: special magic and curse cards from card_057/card_058/card_061/card_064/card_087/card_090/card_097/card_098/card_124/card_125/card_128/card_129",
      "tests/game/cardOfficialExpectations.test.ts: monster signature commands and traits including Power Horn, Gemini Lance, Nuts Rockle counter, Death Sheep seal, Drill Break, and Soul Switch",
      "tests/game/cardOfficialExpectations.test.ts: monster personality traits including self-bomb, double action, heal up, assist, retreat, suspended animation, devotion, curses, Lv2 counter, whim, and hollow",
      "tests/game/cardOfficialExpectations.test.ts: official super cards have source snapshots, level-up paths, and main side effects",
    ],
    magicCategories: ["パワー魔法", "特殊魔法", "攻撃魔法", "回復魔法", "カード魔法", "空間魔法", "特殊防御魔法"],
    commandTraits: ["stoneCost", "effectText"],
  },
  {
    id: "random_effects",
    title: "ランダム効果",
    status: "covered",
    scope: "ランダム結果をseedで固定し、レベル変動、ストーン増減、ランダム追加ダメージ、空振り、回避をログと簡易演出で追跡可能にする。",
    coveredBy: [
      "tests/game/rules.test.ts: applies deterministic random effects for level change, plastone, and Din blast",
      "tests/game/rules.test.ts: logs random results for level change, plastone, and Din blast",
      "tests/game/cardOfficialExpectations.test.ts: card_039 ケントゥリアス logs and applies the random miss result for ジェミニランス",
      "npm run build: type-checks random result visual effect classification",
    ],
    magicCategories: ["ストーン魔法", "レベル魔法", "攻撃魔法", "特殊防御魔法"],
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
    scope: "CPUが攻撃/回復/強化/シールド/ウェイクアップ/移動/手札選択を選ぶ代表ケースと、判断理由ログを検証する。",
    coveredBy: [
      "tests/game/cpuAi.test.ts: uses thunder when it can finish the opponent master",
      "tests/game/cpuAi.test.ts: uses healing for a threatened valuable ally with meaningful missing hp",
      "tests/game/cpuAi.test.ts: uses power up when it creates an immediate monster kill",
      "tests/game/cpuAi.test.ts: shields a threatened valuable ally",
      "tests/game/cpuAi.test.ts: shields a monster that can convert survival into a next-turn level-up",
      "tests/game/cpuAi.test.ts: does not list a redundant shield action for an ally already protected",
      "tests/game/cpuAi.test.ts: wakes up a prepared ally when it can act immediately",
      "tests/game/cpuAi.test.ts: prioritizes a swap when it creates a stronger follow-up attack lane",
      "tests/game/cpuAi.test.ts: evaluates secondary targets for double shield magic",
      "tests/game/cpuAi.test.ts: evaluates hand choices for shift change magic",
      "tests/game/cpuAi.test.ts: evaluates card search categories from the deck",
      "tests/game/cpuAi.test.ts: evaluates hand choices for Soul Switch commands",
      "tests/game/cpuAi.test.ts: keeps high-value hand cards when evaluating refresh discard choices",
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
      "tests/game/autoPlayValidation.test.ts: runs auto play with the special showcase preset",
      "tests/game/autoPlayValidation.test.ts: captures reproducible state, log tail, and decision history for failures",
      "npm run validate:auto-play -- --seed-start 400 --count 100",
      "npm run validate:auto-play -- --seed-start 620 --count 100 --deck-preset special-showcase --max-steps 600 --max-turns 140",
      "npm run validate:auto-play -- --seed-start 400 --count 500 --write-artifacts --out-dir artifacts/auto-play-validation/2026-06-12-phase4-500",
    ],
  },
];

export const SIMPLIFIED_OR_PENDING_CARD_EFFECTS: readonly SimplifiedOrPendingCardEffect[] = [];

export const DEFERRED_PRODUCT_DECISIONS: readonly DeferredProductDecision[] = [
  {
    id: "cpu_magic_heuristic",
    title: "CPUの特殊効果判断",
    scope: "CPUがマジックや特殊技を使うかどうかの判断全般。",
    decision: "撃破、回復、強化、シールド、ウェイクアップ、移動後攻撃、複数対象、手札/山札選択、次ターンの反撃/レベルアップ価値を浅い評価で判断する現行AIを、公式再現ではなく検証相手AIとして扱う。",
    reason: "公式AI再現ではなく、ルール破綻を起こさず検証相手として動くことを優先しているため。",
    revisitWhen: "公式CPUの打ち筋再現がゲーム体験上の要求になった時点で、別AIプロファイルとして設計する。",
  },
  {
    id: "temporary_original_icons",
    title: "攻略サイト由来の仮アイコン",
    scope: "カード表示用の画像アセット。",
    decision: "現時点ではテスト用として取得済み画像を表示し、ゲームルールやPhase 4/5完了条件からは切り離す。",
    reason: "後で自作画像へ差し替える前提のため。",
    revisitWhen: "正式な自作カード画像の制作または差し替え運用が始まった時点で、命名規則と差し替えチェックを追加する。",
  },
];

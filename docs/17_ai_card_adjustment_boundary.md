# AIカード調整耐性の境界

## 目的

カード性能を調整しても、CPU AI側がカード性能を再定義しない構造に寄せる。

AIはカードIDごとの強さを覚えない。合法手をルールで仮実行し、before/afterの盤面差分を評価する。カード効果の補助情報が必要な場合も、`damage`、`heal`、`shield`、`search`、`draw`、`buff` のような意味タグだけを見る。

## 所有境界

| 層 | 責務 |
| --- | --- |
| `cardData` | HP、攻撃P、射程、コスト、カード種別、ロール、テキスト由来の基本性能 |
| `rules` | 合法対象、コスト支払い、実際の効果、ダメージ量、回復量、撃破、状態変化 |
| `aiTraits` | 攻撃魔法、回復、シールド、サーチ、ドロー、配置変更などの意味分類 |
| `aiWeights` | マスターHP、ストーン、撃破価値、打点価値、終盤補正などの評価係数 |
| `cpuAi` | 合法手列挙、仮実行、before/after評価、探索、タイブレーク |

## 原則

- `cpuAi` は「サンダーは3P」のようなカード性能を持たない。
- 威力、回復量、コスト、対象条件の正は `cardData` と `rules` に置く。
- `aiTraits` に「強いカード」は書かない。
- `aiTraits` に書くのは「敵にダメージを与える」「回復する」「防御する」「手札を入れ替える」などの意味だけにする。
- `cpuAi` のカードID分岐は例外扱いにし、追加する場合は先に `aiTraits` で表現できないか確認する。

## 現在の移行状態

- 実装済みマジックは `src/game/aiTraits.ts` で分類する。
- `scoreMagicDecision` はカードIDではなくtraitの `valueModel` / `effectKind` で評価関数を選ぶ。
- ダメージ魔法の脅威推定は固定威力ではなく、`playMagic` の仮実行後にHP差分を見る。
- 評価係数は `src/game/aiWeights.ts` に分離し、`stable` / `strong` のプロファイル別に調整できる。

## カード性能調整時の確認

1. `cardData` と `rules` を変更する。
2. 新しい効果種別が増えた場合だけ `aiTraits` を追加する。
3. 評価の性格だけ変えたい場合は `aiWeights` を調整する。
4. `npm test -- --run tests/game/aiTraits.test.ts` で未分類マジックがないことを確認する。
5. `npm run diff:ai` と `npm run benchmark:deck-suite` で判断変化を確認する。

この境界を守ると、カードの攻撃Pや回復量が変わっても、AIは仮実行結果から自然に評価できる。

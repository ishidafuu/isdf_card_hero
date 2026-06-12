# ユニット評価値

カード単体評価と盤面上ユニット評価を `src/game/unitEvaluation.ts` に集約する。
評価値は公式ルール判定ではなく、UI説明、CPU判断、統計分析のための説明可能なヒューリスティックとして扱う。

## 評価軸

- `base`: カード本体の基礎値。
- `offense`: 火力、射程、現在狙える対象。
- `defense`: HP、シールド、軽減、継続防御。
- `position`: 前衛/後衛役割と現在配置。
- `tempo`: 行動可能性、投資ストーン、状態強化。
- `levelUp`: 撃破からのレベルアップ余地。
- `risk`: 相手から受ける撃破/被弾リスク。
- `synergy`: 性格、登場時/死亡時/被ダメージ時効果、コンボ性。

## 使い分け

- `evaluateCard(cardId)`: カード一覧、手札、デッキ確認で使う静的評価。
- `evaluateBoardUnit(state, slotKey)`: 盤面上のHP、配置、危険度、狙える対象を含む動的評価。
- `cpuMonsterValue(state, slotKey)`: 既存CPUの盤面評価互換値。AI挙動を急に変えないため既存式を維持する。

## UI表示

Card Listでは次の軸で確認できる。

- プール: 通常 / スペシャル / 全カード。
- 種別: 全種 / 前衛 / 後衛 / 魔法。
- ソート: No. / 評価 / 攻撃 / 耐久 / 効果 / HP / Cost / 名前。

一覧行には総合評価、グレード、主要評価データを表示し、展開するとカード詳細と評価内訳を確認できる。
勝敗後のBattle Historyから同じ seed、先攻、対戦モード、マスター、AIプロファイル、デッキ条件で再現できるため、評価調整後の挙動差分を同条件で確認する。

## 統計CLI

```sh
npm run evaluate:units -- --seed-start 400 --count 100 --top 15
```

主なオプション:

- `--seed-start <n>` / `--seed-end <n>` / `--count <n>`
- `--deck-preset random|special-showcase`
- `--player-master white|black`
- `--cpu-master white|black`
- `--json <path>`: 集計結果をJSON保存

## 調整方針

絶対値より相対値を優先する。
カード固有効果が公式一致テストで増えたら、まず `synergy` と `risk` に反映し、CPU判断に影響させる場合は `cpuMonsterValue` ではなく別評価として段階的に寄せる。

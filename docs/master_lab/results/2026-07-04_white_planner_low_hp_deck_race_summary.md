# White Planner Low HP Deck Race

生成: 2026-07-04

## 目的

白対白の終盤で、`white_planner` が「盤面評価では終了が良い」と見て非リーサル顔打点を見送る局面を再検証した。

起点は `994302 / challenger-as-player`。旧ログでは `turn 22-24` にデスシープの顔1点や後列維持が branch score 上は良いのに、実戦では `end_turn` や返しで処理される前出しを選んで deckout race を落としていた。

## 採用した変更

1. `white_planner` 限定で、白ミラー終盤の山札/HPレースに入ったとき、最大打点プランを早めに通す。
   - 両者の山札が4枚以下。
   - 自分HPが4以下。
   - 自分HPが相手HPより低い。
   - 相手の返し最大打点で即死しない。
   - `selectTerminalPlan` を持つ profile のみ対象なので、比較対象の既存 `white` は強化しない。

2. 白ミラー終盤かつ自分HP4以下に限り、後列から前列へ出す移動の免除条件を厳しくする。
   - 移動後に次ターン顔打点があっても、返しの相手通常攻撃だけで倒されるなら「安全な次ターン打点」とは見なさない。
   - HP5以上ではこの抑制をかけない。`994305` の勝ち筋で必要だった前出しを壊さないため。

## 却下した変更

- HP同点でも山札レース顔打点を強制する案。
  - `994305 challenger-as-cpu` を勝ちから負けへ反転させたため却下。
- 前出し抑制を白ミラー終盤全体へ広げる案。
  - `994305 challenger-as-player` のHP5からの前出し勝ち筋を壊したため却下。
- 低局所点の顔打点を terminal plan coverage へ単純追加する案。
  - `994302` の選択は変わらず、採用効果が薄かったため mainline には入れない。

## 14戦相当結果

対象:

- master: `white` vs `white`
- deck: `master-lab-white-1377-death-sheep3`
- baseline AI: `white`
- challenger AI: `white_planner`
- seeds: `994300-994306`
- directions: both

| seed range | games | result | artifact |
| --- | ---: | --- | --- |
| `994300-994301` | 4 | `white_planner` 3勝 / `white` 1勝 | `artifacts/ai-benchmark/2026-07-04_white_planner_low_hp_move_deck_race_994300_994301` |
| `994302-994304` | 6 | `white_planner` 5勝 / `white` 1勝 | `artifacts/ai-benchmark/2026-07-04_white_planner_low_hp_move_deck_race_994302_994304` |
| `994305-994306` | 4 | `white_planner` 3勝 / `white` 1勝 | `artifacts/ai-benchmark/2026-07-04_white_planner_low_hp_move_deck_race_994305_994306` |

合計: `white_planner` 11勝 / `white` 3勝。

前回同条件は `white_planner` 10勝 / `white` 4勝だったため、1勝分改善。

反転した主な勝ち:

- `994302 challenger-as-player`
  - 旧: `white` 勝ち、256 steps / 27 turns。
  - 新: `white_planner` 勝ち、264 steps / 28 turns。
  - HP4以下・山札4枚以下で、デスシープの顔1点を見送らず、HP/山札レースへ入れるようになった。

維持できた主な勝ち:

- `994305 challenger-as-player`
  - HP5時点の後列から前列への勝ち筋を残し、310 steps / 27 turns で勝ち維持。

残った負け:

- `994300 challenger-as-cpu`
- `994304 challenger-as-cpu`
- `994306 challenger-as-player`

## 検証

```bash
npm run benchmark:ai -- \
  --seed-start 994300 \
  --count 2 \
  --deck-preset master-lab-white-1377-death-sheep3 \
  --player-master white \
  --cpu-master white \
  --baseline-ai white \
  --challenger-ai white_planner \
  --direction both \
  --max-steps 420 \
  --max-turns 100 \
  --long-game-steps 300 \
  --long-game-turns 80 \
  --stream-progress \
  --write-game-artifacts \
  --out-dir artifacts/ai-benchmark/2026-07-04_white_planner_low_hp_move_deck_race_994300_994301
```

同形式で `994302-994304`, `994305-994306` も実行。

追加検証:

```bash
npm run build
npm test -- tests/game/cpuAi.test.ts -- --testTimeout 60000
```

結果:

- build: pass。Vite chunk size warning のみ。
- `tests/game/cpuAi.test.ts`: 129 tests pass。

## 次ループ

次は残った負け3本のうち、`994304 challenger-as-cpu` を優先する。

理由:

- 今回の改善対象だった山札/HPレースに近い。
- `994300` はシールド付き高レベル前衛の処理、`994306` は短めの別負け筋で、今回の低HP deck race とは別カテゴリに見える。

次の監査案:

1. `994304 challenger-as-cpu` の終盤で、山札0-2枚時の `end_turn / 顔打点 / 敵前衛処理` を branch replay で比較する。
2. HP同点・HP優勢では顔打点を強制しない今回の条件を維持したまま、相手の次ターン最大打点で負ける局面だけを抽出する。
3. `white_planner` がHP4以下で「守りながら勝つ」局面と「殴らないと負ける」局面を分ける。

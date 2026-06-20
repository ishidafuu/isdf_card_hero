# White AI Black Specialist Scenario Tests Loop 71

生成: 2026-06-20

## 結論

対黒白AIの係数ループで得た代表局面を、再現可能な seed-derived シナリオテストへ落とした。

追加テスト:

- `tests/game/whiteBlackSpecialistScenarios.test.ts`

固定した局面:

- seed `38607`
- `black_pressure_strong`
- 白候補 seat: `cpu`
- step `15` と `25`
- どちらも低石状態で `ラオン` が敵前衛 `グングニエル` を攻撃するか、`focus` へ逃げるかの僅差局面。

## 追加テスト内容

`keeps seed-derived low-stone Raon turns on enemy-front pressure instead of focus`

確認していること:

- current default white は step 15 で `cpu_front_right` の `ラオン` から `player_front_right` の敵前衛へ攻撃する。
- 同じ局面で `whiteMonsterPressureBonus: 0` を明示すると、旧判断の `focus:cpu_front_right` に戻る。
- current default white は follow-up の step 25 でも同じく敵前衛攻撃を選ぶ。
- 同じ follow-up 局面でも `whiteMonsterPressureBonus: 0` では `focus` に戻る。

このテストにより、前回採用した `whiteMonsterPressureBonus: 4` が単なる係数ではなく、実際に黒戦の `focus` 逃げを止める代表局面として固定された。

## Loop 65 由来の未解決候補

Loop 65 の loss seed 範囲を再生して、低石 `focus` かつ敵前衛攻撃候補が残っている局面を追加確認した。

代表例:

- seed `39102` / `black_pressure_strong` / 白候補 seat `player`
  - step `36`, turn `4`, stones `1`
  - selected: `focus:ラオン:player_front_right`
  - alternative: `attack:ラオン:player_front_right->monster:cpu_front_right`
  - score: `focus 132.6` / `attack 132.3`
  - 僅差なので、今後の未解決シナリオ候補。

一方で、他の loss seed では focus と攻撃の点差が大きい局面も多かった。

例:

- seed `39101`: `focus 123.6` / `attack 81.9`
- seed `39105`: `focus 128.8` / `attack 78.5`
- seed `39110`: `focus 124.9` / `attack 35.8`

これらは「攻撃可能なら常に攻撃」が正しいわけではないことを示している。追加係数で一律に focus を抑えると、Loop 67-68 のように baseline を落としやすい。

## 次の扱い

今回テスト化したのは、すでに採用済みの `whiteMonsterPressureBonus: 4` が効く代表局面。

未解決の `39102` は、まだ本実装へ進めない。次にやるなら以下のどちらか。

1. `39102` を同じ seed replay のシナリオテスト候補として固定し、現状は `focus` を選ぶ characterization test にする。
2. `39102` 周辺を改善したい場合は、係数追加ではなく「攻撃スコアとfocusスコアが僅差の時だけ、黒前衛脅威が残るなら攻撃へ倒す」ような狭いルールを設計してからテストを反転する。

現時点では、`39102` は未解決課題として残す。採用済み挙動を守るテストだけ追加した。


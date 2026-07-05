# White Planner CPU Side Front Ace Fix Summary

生成: 2026-07-06

## 進行度

- ゴール全体の進行度見立て: 70% 前後。
- 白対白の基本方針、盾の順序、盤面制圧、後列配置、終盤詰め確認は実戦で見える水準まで改善済み。
- 残りは CPU 側の座席差、長期戦の山札切れレース、相手応答込みの複数ターン安定化。

## 今回の狙い

前回の 8 戦確認で残っていた CPU 側負け seed のうち、`994314 challenger-as-cpu` は白ミラーで相手 HP が低いときに、Lv3 前衛の処理より非リーサル顔打点を優先する負け筋だった。

白ミラーでは相手 HP 4 以下でも、こちらが安全に勝ち切れていない限り、Lv3 前衛などの盤面制圧源を放置しない方がよい。今回の修正はこの局面だけを広げ、通常の詰め判断はできるだけ邪魔しない形にした。

## 監査結果

### seed 994314

- forced branch scan: `docs/master_lab/results/2026-07-06_white_planner_cpu_loss_994314_forced_branch_scan.md`
- turn 10 / step 113 で winner flip を確認。
- 選択手: `attack:ポリスピナー:attack->player master`
- 勝ち分岐: `attack:ポリスピナー:attack->真勇者ダイン`
- scoreDelta: `2000000`
- selected winner: `white`
- best winner: `white_planner`

修正後の単独再実行では `994314 challenger-as-cpu` が `white_planner/cpu` 勝ちに反転した。

### seed 994315

- forced branch scan: `docs/master_lab/results/2026-07-06_white_planner_cpu_loss_994315_forced_branch_scan.md`
- turn 24-31 の 8 局面を確認。
- promising 0 件。
- 終盤の単発手差し替えでは勝敗反転が出ず、山札切れ・長期戦の積み上がり課題として残した。

## 実装

- `src/game/cpuAi.ts`
  - `whiteBoardControlMasterAttackDecisionPenalty(...)` を調整。
  - これまで相手 HP 4 以下では非リーサル顔打点ペナルティを完全に切っていた。
  - 白ミラー、盤面制圧スコアが高い、相手前衛脅威が残る、こちらが大きく安全ではない、という条件では顔打点より前衛処理を評価するようにした。
- `tests/game/cpuAi.test.ts`
  - Lv3 ダインを無視して相手マスターへ行かない回帰テストを追加。

## ベンチ結果

`docs/master_lab/results/2026-07-06_white_planner_cpu_side_front_ace_fix_benchmark/`

- 条件: `seed 994314-994317`, `master-lab-white-1377-death-sheep3`, 白対白, `white` vs `white_planner`, both directions
- 合計: 8 戦 7 勝 1 敗
- CPU 側: 4 戦 3 勝 1 敗
- player 側: 4 戦 4 勝 0 敗
- failures: 0
- warnings: 1
- 残敗: `994315 challenger-as-cpu`, 327 steps / 32 turns

前回の同範囲では CPU 側が 2 勝 2 敗だったため、今回の修正で CPU 側は 3 勝 1 敗まで改善した。player 側の 4 勝 0 敗も維持できている。

## 検証

- `npm test -- tests/game/cpuAi.test.ts`
  - 135 tests passed
- `npm run build`
  - passed
  - Vite chunk-size warning は継続

## 残課題

`994315 challenger-as-cpu` は一手差し替えでは解けなかった。次に詰めるなら以下。

- 長期戦の山札切れレース評価。
- 山札 0-2 枚帯での HP 差、盤面残り、攻撃可能数の終局評価。
- 終盤で 0 ダメージになりやすい気合い剥がし攻撃の価値監査。
- CPU 側だけ重い局面の探索軽量化。

ただし、今回の段階ではこの 1 敗を無理に係数で潰すより、別フェーズで「終局レース評価」として扱う方が安全。

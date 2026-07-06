# White Planner Midgame Shield Hold Summary

## 目的

前列蓋ホールド後の小マトリクスで残った `994331` / `994332` の負けを調査した。
終盤の盾・前衛削りを疑ったが、branch replay では終盤の上位候補が全て負けで、より前の中盤判断が原因候補になった。

## 主要発見

### 994331 challenger-as-cpu

turn 11 / step 123 の盾が明確な分岐だった。

- selected: `master:shield->monster:cpu_front_left`
- forced selected: white 勝ち
- forced `end_turn`: white_planner 勝ち
- branch score delta: `+2000000`

この局面は、こちらがHP先行、相手石が少なく、盾対象は最大レベル前衛だった。
「大事な駒だから守る」評価になっていたが、即致死ではなく、盾を貼ることで石と次ターンの柔軟性を落としていた。

## 実装

`selectWhiteMirrorMidgameOverprotectShieldHoldEndTurnDecision` を追加した。

対象条件:

- 白ミラー turn 10-13
- fallback が自軍前衛への `shield`
- こちらHPが同等以上、相手HP7以下
- 相手石3以下
- 盾対象が最大レベルの前衛ロール
- 盾なしでも即致死ではない
- `end_turn` との root gap が 320 以下

この条件では `end_turn` へ差し替え、過保護な中盤盾を見送る。

## 検証結果

| check | before | after |
| --- | --- | --- |
| `994331 challenger-as-cpu` | white 勝ち | white_planner 勝ち |
| `994330 challenger-as-cpu` | white_planner 勝ち | white_planner 勝ち |
| `994332 challenger-as-cpu` | white 勝ち | white 勝ち |
| `994330-994333` 4 seeds x 2 directions | 未実施 | 6-2-0 / WPR 75% |

8戦 smoke:

- W-L-D: `6-2-0`
- WPR: `75%`
- avg HP margin: `3.88`
- avg decision: `751.9ms`
- max decision: `7607ms`

## 注意点

`994331 challenger-as-player` は負け残り。
今回追加した中盤盾holdはこの負けtraceでは発火していないため、直接の悪化要因ではなさそう。
ただし同seedで座席違いの勝敗が入れ替わっているため、次ループでは player 側の turn 10-13 の別負け筋を調査する。

## 追加監査

- `994331` 終盤盾/詰めろ: selected が全て branch replay でも1位。終盤1手では戻らない。
- `994332` 劣勢時前衛削り: selected が全て branch replay でも1位。終盤の削りは原因というより結果。
- `994331 player` 低石盾: step 108/118 とも selected が branch replay でも1位。単純な低石盾抑制では戻らない。

## 検証コマンド

- `npm run audit:white-planner-forced-branch -- --seed 994331 --direction challenger-as-cpu --only-step 123 --step 124`
- `npm run audit:white-planner-decision-trace -- --seed 994331 --direction challenger-as-cpu`
- `npm run lab:masters:white-planner-pdca -- --seed-start 994330 --games-per-direction 4 --candidate current`
- `npm test -- --run tests/game/cpuAi.test.ts`
- `npm run build`

## 次ループ提案

1. `994331 challenger-as-player` の turn 10-13 を、盾ではなく「ウェイク/召喚/敵最大Lv前衛処理」の観点で branch replay する。
2. `994332 challenger-as-cpu` は終盤ではなく turn 9-12 の盤面崩壊点を探す。
3. 今回の中盤盾holdは、8戦 smoke で WPR 75% のため採用候補。ただし次回の広め確認で `994331 player` の残負けを合わせて見る。

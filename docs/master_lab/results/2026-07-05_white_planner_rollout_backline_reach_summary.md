# White Planner Rollout Backline Reach Summary

生成: 2026-07-05

## 目的

前フェーズで `white_planner` に限定 rollout を入れ、seed 994306 player 側を勝ちに変えられた。一方で、同じ seed 帯に 80-100 秒級の decision が複数出ていた。

このフェーズでは勝率を落とさず、手を変えない rollout 発火を止めることを目的にした。

## 監査結果

対象は `master-lab-white-1377-death-sheep3`、seed 994306-994313、白白両方向。

| 条件 | 勝敗 | inspected decisions | rollout-triggered | avg decision ms | max decision ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| before | 10-6 | 3 | 3 | 712.1 | 97374.8 |
| backlineReach 条件後 | 10-6 | 1 | 1 | 616.0 | 78533.1 |

勝敗は維持しつつ、不要な重い rollout を2件削れた。

## 消えた不要発火

削れた2件はいずれも `fallbackDecision` と `selectedDecision` が同じ `move` だった。

- seed 994307: `move:player_front_right->player_back_left` のまま。対抗召喚候補は `デスシープ` 後列で `noBacklineReach`。
- seed 994310: `move:player_front_right->player_back_left` のまま。対抗召喚候補は `ドノマンティス` 後列で `noBacklineReach`。

どちらも rollout は候補比較を重くするだけで、実際の手を変えていなかった。

## 残した必要発火

seed 994306 player 側は引き続き発火させる。

- turn 8、player stones 7 / cpu stones 1
- fallback: `move:player_front_right->player_back_left`
- selected: `summon:ボムゾウ->player_back_right`
- rollout gap to fallback: 278.2

これは `ヤンバル` を逃がすより、後列から仕事できる `ボムゾウ` を置くことで勝ちに変わる局面だった。

## candidateLimit=1 の不採用

さらに軽量化するため `terminalPlanRolloutCandidateLimit: 1` も途中確認したが、肝心の seed 994306 player 側を落とした。

- `rollout1_60_w015_gap200` seed 994306 player: white 勝利、175 steps / 22 turns、HP P0-C6

そのため candidateLimit は3を維持する。

## 採用内容

`terminalPlanRolloutRequirePlannerSummonBacklineReach` を追加し、`white_planner` と `white_rollout` では有効にした。

限定 rollout は、fallback が移動で、planner 側の召喚候補が後列から仕事できる攻撃パターンを持つ場合だけ発火する。

## 次の候補

まだ seed 994306 の必要発火は約78秒かかる。次に詰めるなら、候補数を減らすのではなく、rollout 内部のAIを軽くする案を検証する。

- rollout 中だけ terminal plan を無効にした軽量プロファイルを使う
- rollout 中だけ detailedWidth / sameTurnSearchDepth を落とす
- 勝敗ではなく一定turn後の評価で早期打ち切る

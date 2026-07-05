# White Planner Forced Branch Probe

生成: 2026-07-05T05:14:10.981Z
seed: 994309
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 10
maxReplaySteps: 360

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 74

- turn: 7
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 7 / current cpu / HP cpu/player 10/9 / stones cpu/player 9/1 / deck cpu/player 18/19 / hand cpu/player 5/5
- board: player_front_left:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_front_right:PF:真勇者ダイン Lv3 HP6 act1/1 | player_back_left:PB:ヤンバル Lv1 HP3 act0/1 focus | player_back_right:PB:ヤンバル Lv2 HP3 act1/1 | cpu_front_left:CF:デスシープ Lv1 HP6 act0/1 | cpu_front_right:CF:ピグミィ Lv1 HP3 act0/2 focus | cpu_back_left:CB:ピグミィ Lv1 HP3 act0/2 focus
- selected: focus:デスシープ
- best: magic:ワープ->monster:player_front_left:monster:player_back_left
- selectedRank: 6
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | focus:デスシープ | 310.2 | white | -1000000 | 207 | turn 26 / current cpu / HP cpu/player 0/7 / stones cpu/player 25/17 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | magic:ワープ->monster:player_front_left:monster:player_back_left | 272.1 | white_planner | 1000000 | 146 | turn 19 / current cpu / HP cpu/player 7/0 / stones cpu/player 10/7 / deck cpu/player 6/7 / hand cpu/player 6/5 |
| 3 |  | magic:ワープ->monster:player_back_left:monster:player_front_left | 272.1 | white_planner | 1000000 | 146 | turn 19 / current cpu / HP cpu/player 7/0 / stones cpu/player 10/7 / deck cpu/player 6/7 / hand cpu/player 6/5 |
| 4 |  | summon:ポリスピナー->cpu_back_right | 204 | white | -1000000 | 180 | turn 27 / current cpu / HP cpu/player 0/1 / stones cpu/player 31/19 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 5 |  | attack:ピグミィ:スパイクボール->真勇者ダイン | 64 | white_planner | 1000000 | 258 | turn 30 / current cpu / HP cpu/player 1/0 / stones cpu/player 29/29 / deck cpu/player 0/0 / hand cpu/player 4/5 |
| 6 |  | attack:ピグミィ:スパイクボール->真勇者ダイン | 64 | white_planner | 1000000 | 258 | turn 30 / current cpu / HP cpu/player 1/0 / stones cpu/player 29/29 / deck cpu/player 0/0 / hand cpu/player 4/5 |
| 7 |  | magic:ワープ->monster:player_front_left:monster:player_back_right | 63 | white | -1000000 | 163 | turn 28 / current cpu / HP cpu/player 0/5 / stones cpu/player 43/29 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 8 |  | magic:ワープ->monster:player_back_right:monster:player_front_left | 63 | white | -1000000 | 163 | turn 28 / current cpu / HP cpu/player 0/5 / stones cpu/player 43/29 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 9 |  | magic:ワープ->monster:player_front_right:monster:player_back_left | 61 | white_planner | 1000000 | 211 | turn 28 / current player / HP cpu/player 6/0 / stones cpu/player 21/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 10 |  | magic:ワープ->monster:player_front_right:monster:player_back_right | 61 | white | -1000000 | 221 | turn 29 / current cpu / HP cpu/player 0/4 / stones cpu/player 22/23 / deck cpu/player 0/0 / hand cpu/player 5/5 |



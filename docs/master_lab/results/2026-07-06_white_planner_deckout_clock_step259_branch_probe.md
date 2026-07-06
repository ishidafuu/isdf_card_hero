# White Planner Forced Branch Probe

生成: 2026-07-06T00:19:55.474Z
seed: 994315
direction: challenger-as-cpu
deck: `master-lab-white-1377-death-sheep3`
branchTop: 16
maxReplaySteps: 220

## Conclusion

- 1/1 samples で選択手より最終scoreが高い代替がある。
- root評価では低いが最終勝敗に効く候補だけを、局面条件へ還元して検証する。

## Samples

### step 259

- turn: 20
- plannerSide: cpu
- currentPlayer: cpu
- state: turn 20 / current cpu / HP cpu/player 8/10 / stones cpu/player 6/1 / deck cpu/player 5/4 / hand cpu/player 6/4
- board: player_front_left:PF:ドノマンティス Lv1 HP5 prep | player_front_right:PF:真勇者ダイン Lv1 HP6 act1/1 focus | player_back_left:PB:ヤンバル Lv1 HP3 prep | player_back_right:PB:ピグミィ Lv2 HP3 act2/2 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act0/1 | cpu_front_right:CF:ボムゾウ Lv2 HP5 act0/1 | cpu_back_left:CB:ピグミィ Lv2 HP3 act0/2 focus | cpu_back_right:CB:ピグミィ Lv1 HP3 act0/2
- selected: attack:ピグミィ:スパイクボール->真勇者ダイン
- best: end_turn
- selectedRank: 3
- bestVsSelectedScoreDelta: 2000000

| rank | selected | decision | root | winner | final score | replay steps | final state |
| ---: | --- | --- | ---: | --- | ---: | ---: | --- |
| 1 | Y | attack:ピグミィ:スパイクボール->真勇者ダイン | 63.4 | white | -1000000 | 60 | turn 31 / current cpu / HP cpu/player 0/2 / stones cpu/player 38/35 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 2 |  | end_turn | 55.9 | white_planner | 1000000 | 46 | turn 28 / current cpu / HP cpu/player 2/0 / stones cpu/player 27/29 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 3 |  | attack:ボムゾウ:storm_bomb->ピグミィ | 51.4 | white | -1000000 | 48 | turn 27 / current cpu / HP cpu/player 0/6 / stones cpu/player 29/20 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 4 |  | attack:ピグミィ:スパイクボール->真勇者ダイン | 27.6 | white | -1000000 | 47 | turn 27 / current cpu / HP cpu/player 0/6 / stones cpu/player 29/20 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 5 |  | attack:ピグミィ:スパイクボール->ピグミィ | 3.8 | white | -1000000 | 48 | turn 27 / current cpu / HP cpu/player 0/6 / stones cpu/player 29/20 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 6 |  | focus:ピグミィ | -46 | white | -1000000 | 48 | turn 27 / current cpu / HP cpu/player 0/6 / stones cpu/player 29/20 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 7 |  | focus:真勇者ダイン | -46 | white | -1000000 | 60 | turn 31 / current cpu / HP cpu/player 0/2 / stones cpu/player 38/35 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 8 |  | focus:ボムゾウ | -53.8 | white | -1000000 | 57 | turn 28 / current cpu / HP cpu/player 0/5 / stones cpu/player 28/24 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 9 |  | attack:ボムゾウ:self_bomb->player master | -178.9 | white_planner | 1000000 | 52 | turn 30 / current player / HP cpu/player 1/0 / stones cpu/player 30/40 / deck cpu/player 0/0 / hand cpu/player 5/5 |
| 10 |  | attack:ボムゾウ:self_bomb->真勇者ダイン | -359.5 | white | -1000000 | 58 | turn 29 / current player / HP cpu/player 0/4 / stones cpu/player 28/25 / deck cpu/player 0/0 / hand cpu/player 5/5 |



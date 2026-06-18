# White AI Decision Diff Loop

生成: 2026-06-18T08:01:48.989Z
参照候補: `pressure_attack_monster_plus4`
比較候補: `pressure_white_baseline`, `pressure_white_monster_pressure_v1`
相手: black_pressure_strong, black_pressure_pressure
seed: 23100-23111 / 各seat
確認範囲: turn 8 まで

## Conclusion

- pressure_attack_monster_plus4 vs pressure_white_baseline: 参照だけが勝ったseedは 4/48、比較だけが勝ったseedは 2/48。
- 最初の分岐は `attack:真勇者ダイン:enemy_front > attack:アーシュ＆ロロ:enemy_front` が最多（2件）。
- pressure_attack_monster_plus4 vs pressure_white_monster_pressure_v1: 参照だけが勝ったseedは 3/48、比較だけが勝ったseedは 0/48。
- 最初の分岐は `attack:真勇者ダイン:enemy_front > attack:アーシュ＆ロロ:enemy_front` が最多（2件）。
- 次は、最多分岐カテゴリが敵モンスター攻撃へ寄るなら白限定の敵モンスター攻撃全般補正、マスター攻撃抑制へ寄るなら非リーサル本体攻撃抑制を候補にする。

## Pair Summary

| Compare | Seeds | Ref win / compare not | Compare win / ref not | Both win | Both loss | Other | First diff categories |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| pressure_white_baseline | 48 | 4 | 2 | 14 | 28 | 0 | attack:真勇者ダイン:enemy_front > attack:アーシュ＆ロロ:enemy_front:2, attack:ピグミィ:enemy_front > summon:1, attack:真勇者ダイン:enemy_front > summon:1 |
| pressure_white_monster_pressure_v1 | 48 | 3 | 0 | 15 | 30 | 0 | attack:真勇者ダイン:enemy_front > attack:アーシュ＆ロロ:enemy_front:2, attack:ピグミィ:enemy_front > summon:1 |

## Samples

### pressure_white_baseline

- seed 23100 / black_pressure_strong / candidate player: win vs loss
  - first diff turn 5 step 41: attack:ピグミィ:enemy_front => summon
  - ref: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (229.4) / compare: `summon:player_back_right` (225.5)
  - state: HP P/C 9/9 / stones P/C 3/0 / hand P/C 5/3
  - board: cpu_back_left:CB:神斬丸 Lv1 HP5 prep | cpu_back_right:CB:ナッツロックル Lv1 HP6 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 | cpu_front_right:CF:グングニエル Lv1 HP4 act1/1 | player_front_left:PF:ラオン Lv1 HP5 act0/1 | player_front_right:PF:アサシン Lv1 HP4 prep | player_back_left:PB:ピグミィ Lv1 HP3 act0/2
- seed 23106 / black_pressure_strong / candidate cpu: win vs loss
  - first diff turn 2 step 13: attack:真勇者ダイン:enemy_front => attack:アーシュ＆ロロ:enemy_front
  - ref: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (188.2) / compare: `attack:cpu_back_left:飛竜ロロ->monster:player_front_left` (182.4)
  - state: HP P/C 10/10 / stones P/C 0/3 / hand P/C 2/4
  - board: cpu_back_left:CB:アーシュ＆ロロ Lv1 HP5 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_left:PF:ナッツロックル Lv1 HP6 act1/1 | player_front_right:PF:ヒートロン Lv1 HP5 act1/1 | player_back_left:PB:ビヨンド Lv1 HP2 act1/1
- seed 23101 / black_pressure_pressure / candidate player: win vs loss
  - first diff turn 5 step 42: attack:真勇者ダイン:enemy_front => summon
  - ref: `attack:player_front_left:ダイン斬り->monster:cpu_front_left` (373.9) / compare: `summon:player_back_right` (215.1)
  - state: HP P/C 8/8 / stones P/C 4/0 / hand P/C 4/4
  - board: cpu_front_left:CF:ヒートロン Lv1 HP3 act1/1 | cpu_front_right:CF:ガンプ Lv2 HP5 act1/1 | player_front_left:PF:真勇者ダイン Lv1 HP4 act0/1 | player_front_right:PF:ラオン Lv1 HP3 act0/1 | player_back_left:PB:ボムゾウ Lv1 HP6 prep
- seed 23106 / black_pressure_pressure / candidate cpu: win vs loss
  - first diff turn 2 step 13: attack:真勇者ダイン:enemy_front => attack:アーシュ＆ロロ:enemy_front
  - ref: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (188.2) / compare: `attack:cpu_back_left:飛竜ロロ->monster:player_front_left` (182.4)
  - state: HP P/C 10/10 / stones P/C 0/3 / hand P/C 2/4
  - board: cpu_back_left:CB:アーシュ＆ロロ Lv1 HP5 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_left:PF:ナッツロックル Lv1 HP6 act1/1 | player_front_right:PF:ヒートロン Lv1 HP5 act1/1 | player_back_left:PB:ビヨンド Lv1 HP2 act1/1

### pressure_white_monster_pressure_v1

- seed 23100 / black_pressure_strong / candidate player: win vs loss
  - first diff turn 5 step 41: attack:ピグミィ:enemy_front => summon
  - ref: `attack:player_back_left:スパイクボール->monster:cpu_front_left` (229.4) / compare: `summon:player_back_right` (225.5)
  - state: HP P/C 9/9 / stones P/C 3/0 / hand P/C 5/3
  - board: cpu_back_left:CB:神斬丸 Lv1 HP5 prep | cpu_back_right:CB:ナッツロックル Lv1 HP6 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP5 act1/1 | cpu_front_right:CF:グングニエル Lv1 HP4 act1/1 | player_front_left:PF:ラオン Lv1 HP5 act0/1 | player_front_right:PF:アサシン Lv1 HP4 prep | player_back_left:PB:ピグミィ Lv1 HP3 act0/2
- seed 23106 / black_pressure_strong / candidate cpu: win vs loss
  - first diff turn 2 step 13: attack:真勇者ダイン:enemy_front => attack:アーシュ＆ロロ:enemy_front
  - ref: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (188.2) / compare: `attack:cpu_back_left:飛竜ロロ->monster:player_front_left` (182.4)
  - state: HP P/C 10/10 / stones P/C 0/3 / hand P/C 2/4
  - board: cpu_back_left:CB:アーシュ＆ロロ Lv1 HP5 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_left:PF:ナッツロックル Lv1 HP6 act1/1 | player_front_right:PF:ヒートロン Lv1 HP5 act1/1 | player_back_left:PB:ビヨンド Lv1 HP2 act1/1
- seed 23106 / black_pressure_pressure / candidate cpu: win vs loss
  - first diff turn 2 step 13: attack:真勇者ダイン:enemy_front => attack:アーシュ＆ロロ:enemy_front
  - ref: `attack:cpu_front_left:ダイン斬り->monster:player_front_left` (188.2) / compare: `attack:cpu_back_left:飛竜ロロ->monster:player_front_left` (182.4)
  - state: HP P/C 10/10 / stones P/C 0/3 / hand P/C 2/4
  - board: cpu_back_left:CB:アーシュ＆ロロ Lv1 HP5 act0/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act0/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_left:PF:ナッツロックル Lv1 HP6 act1/1 | player_front_right:PF:ヒートロン Lv1 HP5 act1/1 | player_back_left:PB:ビヨンド Lv1 HP2 act1/1


## Reading

- `Ref win / compare not` は参照候補だけが勝ったseed数。今回の主観察対象。
- `First diff categories` は参照候補の盤面進行上で最初に選択が分かれた行動カテゴリ。
- この差分は `pressure_attack_monster_plus4` の道筋上で比較候補も同一盤面評価したもの。分岐後の完全な棋譜比較ではなく、改善要因を探すための診断値。

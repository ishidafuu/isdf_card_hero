# White AI Decision Diff Loop

生成: 2026-06-19T08:02:50.339Z
参照候補: `pressure_white_baseline`
比較候補: `pressure_white_threat_left_low_stone_setup_guard_light_v1`, `pressure_white_threat_left_low_stone_setup_guard_v1`
相手: black_pressure_strong, black_pressure_pressure
seed: 37000-37007 / 各seat
確認範囲: turn 6 まで

## Conclusion

- pressure_white_baseline vs pressure_white_threat_left_low_stone_setup_guard_light_v1: 参照だけが勝ったseedは 0/32、比較だけが勝ったseedは 0/32。
- pressure_white_baseline vs pressure_white_threat_left_low_stone_setup_guard_v1: 参照だけが勝ったseedは 5/32、比較だけが勝ったseedは 0/32。
- 最初の分岐は `focus > attack:オヤコダケ:enemy_front` が最多（2件）。
- 次は、最多分岐カテゴリが敵モンスター攻撃へ寄るなら白限定の敵モンスター攻撃全般補正、マスター攻撃抑制へ寄るなら非リーサル本体攻撃抑制を候補にする。

## Pair Summary

| Compare | Seeds | Ref win / compare not | Compare win / ref not | Both win | Both loss | Other | First diff categories |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| pressure_white_threat_left_low_stone_setup_guard_light_v1 | 32 | 0 | 0 | 17 | 15 | 0 | - |
| pressure_white_threat_left_low_stone_setup_guard_v1 | 32 | 5 | 0 | 12 | 15 | 0 | focus > attack:オヤコダケ:enemy_front:2, master:wake_up:own_front > focus:2, master:wake_up:own_back > master:shield:own_front:1 |

## Samples

### pressure_white_threat_left_low_stone_setup_guard_light_v1

参照候補だけが勝ったサンプルはなかった。

### pressure_white_threat_left_low_stone_setup_guard_v1

- seed 37004 / black_pressure_strong / candidate player: win vs loss
  - first diff turn 2 step 11: master:wake_up:own_back => master:shield:own_front
  - ref: `master:wake_up->monster:player_back_right` (110.1) / compare: `master:shield->monster:player_front_right` (95.4)
  - state: HP P/C 10/10 / stones P/C 2/0 / hand P/C 2/3
  - board: cpu_back_left:CB:アンノウン Lv1 HP5 prep | cpu_front_left:CF:ホロウダイン Lv1 HP5 prep | cpu_front_right:CF:ヒートロン Lv1 HP5 prep | player_front_left:PF:ボムゾウ Lv1 HP6 act1/1 | player_front_right:PF:ラオン Lv1 HP5 act1/1 | player_back_left:PB:ラオン Lv1 HP5 act0/1 | player_back_right:PB:オヤコダケ Lv1 HP2 prep
- seed 37006 / black_pressure_strong / candidate cpu: win vs loss
  - first diff turn 3 step 30: focus => attack:オヤコダケ:enemy_front
  - ref: `focus:cpu_front_left` (55.9) / compare: `attack:cpu_back_right:爆裂キノコ->monster:player_front_left` (43.3)
  - state: HP P/C 9/8 / stones P/C 3/1 / hand P/C 3/3
  - board: cpu_back_left:CB:オーパス Lv1 HP4 prep | cpu_back_right:CB:オヤコダケ Lv1 HP2 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act1/2 | cpu_front_right:CF:ボムゾウ Lv2 HP2 act1/1 | player_front_left:PF:ナッツロックル Lv1 HP5 act1/1
- seed 37007 / black_pressure_strong / candidate cpu: win vs loss
  - first diff turn 5 step 56: master:wake_up:own_front => focus
  - ref: `master:wake_up->monster:cpu_front_left` (114) / compare: `focus:cpu_back_left` (130.1)
  - state: HP P/C 8/8 / stones P/C 3/3 / hand P/C 2/5
  - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 | cpu_back_right:CB:キラービ Lv3 HP4 act1/1 | cpu_front_left:CF:アサシン Lv1 HP4 prep | cpu_front_right:CF:ラッフィー Lv2 HP5 act1/1 | player_front_left:PF:神斬丸 Lv1 HP4 act1/1 | player_back_left:PB:ゾンビ Lv1 HP4 prep
- seed 37006 / black_pressure_pressure / candidate cpu: win vs loss
  - first diff turn 3 step 30: focus => attack:オヤコダケ:enemy_front
  - ref: `focus:cpu_front_left` (55.9) / compare: `attack:cpu_back_right:爆裂キノコ->monster:player_front_left` (43.3)
  - state: HP P/C 9/8 / stones P/C 3/1 / hand P/C 3/3
  - board: cpu_back_left:CB:オーパス Lv1 HP4 prep | cpu_back_right:CB:オヤコダケ Lv1 HP2 act0/1 | cpu_front_left:CF:ピグミィ Lv2 HP3 act1/2 | cpu_front_right:CF:ボムゾウ Lv2 HP2 act1/1 | player_front_left:PF:ナッツロックル Lv1 HP5 act1/1
- seed 37007 / black_pressure_pressure / candidate cpu: win vs loss
  - first diff turn 5 step 56: master:wake_up:own_front => focus
  - ref: `master:wake_up->monster:cpu_front_left` (114) / compare: `focus:cpu_back_left` (130.1)
  - state: HP P/C 8/8 / stones P/C 3/3 / hand P/C 2/5
  - board: cpu_back_left:CB:ピグミィ Lv1 HP3 act1/2 | cpu_back_right:CB:キラービ Lv3 HP4 act1/1 | cpu_front_left:CF:アサシン Lv1 HP4 prep | cpu_front_right:CF:ラッフィー Lv2 HP5 act1/1 | player_front_left:PF:神斬丸 Lv1 HP4 act1/1 | player_back_left:PB:ゾンビ Lv1 HP4 prep


## Reading

- `Ref win / compare not` は参照候補だけが勝ったseed数。今回の主観察対象。
- `First diff categories` は参照候補の盤面進行上で最初に選択が分かれた行動カテゴリ。
- この差分は `pressure_attack_monster_plus4` の道筋上で比較候補も同一盤面評価したもの。分岐後の完全な棋譜比較ではなく、改善要因を探すための診断値。

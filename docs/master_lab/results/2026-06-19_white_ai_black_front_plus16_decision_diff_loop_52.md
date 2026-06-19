# White AI Decision Diff Loop

生成: 2026-06-19T14:26:22.762Z
参照候補: `pressure_white_baseline`
比較候補: `pressure_white_black_front_threat_plus16_v1`
相手: black_pressure_strong, black_pressure_pressure
seed: 37800-37809 / 各seat
確認範囲: turn 6 まで

## Conclusion

- pressure_white_baseline vs pressure_white_black_front_threat_plus16_v1: 参照だけが勝ったseedは 3/40、比較だけが勝ったseedは 3/40。
- 最初の分岐は `focus > attack:デスシープ:enemy_front` が最多（2件）。
- 次は、最多分岐カテゴリが敵モンスター攻撃へ寄るなら白限定の敵モンスター攻撃全般補正、マスター攻撃抑制へ寄るなら非リーサル本体攻撃抑制を候補にする。

## Pair Summary

| Compare | Seeds | Ref win / compare not | Compare win / ref not | Both win | Both loss | Other | First diff categories |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| pressure_white_black_front_threat_plus16_v1 | 40 | 3 | 3 | 6 | 28 | 0 | focus > attack:デスシープ:enemy_front:2, focus > attack:ラオン:enemy_front:1 |

## Samples

### pressure_white_black_front_threat_plus16_v1

- seed 37802 / black_pressure_strong / candidate cpu: win vs loss
  - first diff turn 2 step 17: focus => attack:デスシープ:enemy_front
  - ref: `focus:cpu_front_right` (121.2) / compare: `attack:cpu_front_right:attack->monster:player_front_right` (124.7)
  - state: HP P/C 10/9 / stones P/C 1/0 / hand P/C 3/3
  - board: cpu_back_left:CB:ラオン Lv1 HP5 act0/1 | cpu_back_right:CB:オヤコダケ Lv2 HP2 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ガンプ Lv1 HP5 act1/1 | player_back_left:PB:バルキャノン Lv1 HP3 act1/1
- seed 37802 / black_pressure_pressure / candidate cpu: win vs loss
  - first diff turn 2 step 17: focus => attack:デスシープ:enemy_front
  - ref: `focus:cpu_front_right` (121.2) / compare: `attack:cpu_front_right:attack->monster:player_front_right` (124.7)
  - state: HP P/C 10/9 / stones P/C 1/0 / hand P/C 3/3
  - board: cpu_back_left:CB:ラオン Lv1 HP5 act0/1 | cpu_back_right:CB:オヤコダケ Lv2 HP2 act1/1 | cpu_front_left:CF:真勇者ダイン Lv1 HP6 act1/1 | cpu_front_right:CF:デスシープ Lv1 HP6 act0/1 | player_front_right:PF:ガンプ Lv1 HP5 act1/1 | player_back_left:PB:バルキャノン Lv1 HP3 act1/1
- seed 37804 / black_pressure_pressure / candidate cpu: win vs loss
  - first diff turn 2 step 15: focus => attack:ラオン:enemy_front
  - ref: `focus:cpu_front_right` (129.3) / compare: `attack:cpu_front_right:attack->monster:player_front_right` (135.5)
  - state: HP P/C 9/9 / stones P/C 1/1 / hand P/C 3/3
  - board: cpu_back_left:CB:マッド・ダミー Lv1 HP3 act0/1 | cpu_back_right:CB:ホロウダイン Lv1 HP5 prep | cpu_front_left:CF:ホロウダイン Lv1 HP5 act1/1 | cpu_front_right:CF:ラオン Lv1 HP5 act0/1 | player_front_left:PF:ナッツロックル Lv1 HP5 act1/1 | player_front_right:PF:ガンプ Lv1 HP5 act1/1 | player_back_left:PB:ヴァルテル Lv1 HP1 act1/1


## Reading

- `Ref win / compare not` は参照候補だけが勝ったseed数。今回の主観察対象。
- `First diff categories` は参照候補の盤面進行上で最初に選択が分かれた行動カテゴリ。
- この差分は `pressure_attack_monster_plus4` の道筋上で比較候補も同一盤面評価したもの。分岐後の完全な棋譜比較ではなく、改善要因を探すための診断値。

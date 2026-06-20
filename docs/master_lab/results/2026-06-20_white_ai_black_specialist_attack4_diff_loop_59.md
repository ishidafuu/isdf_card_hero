# White AI Decision Diff Loop

生成: 2026-06-20T00:34:42.078Z
参照候補: `pressure_attack_monster_plus4`
比較候補: `pressure_white_baseline`
相手: black_pressure_strong, black_pressure_pressure
seed: 38600-38611 / 各seat
確認範囲: turn 6 まで

## Conclusion

- pressure_attack_monster_plus4 vs pressure_white_baseline: 参照だけが勝ったseedは 2/48、比較だけが勝ったseedは 1/48。
- 最初の分岐は `attack:ラオン:enemy_front > focus` が最多（2件）。
- 次は、最多分岐カテゴリが敵モンスター攻撃へ寄るなら白限定の敵モンスター攻撃全般補正、マスター攻撃抑制へ寄るなら非リーサル本体攻撃抑制を候補にする。

## Pair Summary

| Compare | Seeds | Ref win / compare not | Compare win / ref not | Both win | Both loss | Other | First diff categories |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| pressure_white_baseline | 48 | 2 | 1 | 15 | 30 | 0 | attack:ラオン:enemy_front > focus:2 |

## Samples

### pressure_white_baseline

- seed 38607 / black_pressure_strong / candidate cpu: win vs loss
  - first diff turn 2 step 15: attack:ラオン:enemy_front => focus
  - ref: `attack:cpu_front_right:attack->monster:player_front_right` (131.5) / compare: `focus:cpu_front_right` (129.3)
  - state: HP P/C 9/9 / stones P/C 1/1 / hand P/C 3/3
  - board: cpu_back_left:CB:マッド・ダミー Lv1 HP3 act0/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:ホロウダイン Lv1 HP5 act1/1 | cpu_front_right:CF:ラオン Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 | player_front_right:PF:グングニエル Lv1 HP5 act1/1 | player_back_left:PB:ラティーヌ Lv1 HP4 act1/1
- seed 38607 / black_pressure_pressure / candidate cpu: win vs loss
  - first diff turn 2 step 15: attack:ラオン:enemy_front => focus
  - ref: `attack:cpu_front_right:attack->monster:player_front_right` (131.5) / compare: `focus:cpu_front_right` (129.3)
  - state: HP P/C 9/9 / stones P/C 1/1 / hand P/C 3/3
  - board: cpu_back_left:CB:マッド・ダミー Lv1 HP3 act0/1 | cpu_back_right:CB:真勇者ダイン Lv1 HP6 prep | cpu_front_left:CF:ホロウダイン Lv1 HP5 act1/1 | cpu_front_right:CF:ラオン Lv1 HP5 act0/1 | player_front_left:PF:真勇者ダイン Lv1 HP5 act1/1 | player_front_right:PF:グングニエル Lv1 HP5 act1/1 | player_back_left:PB:ラティーヌ Lv1 HP4 act1/1


## Reading

- `Ref win / compare not` は参照候補だけが勝ったseed数。今回の主観察対象。
- `First diff categories` は参照候補の盤面進行上で最初に選択が分かれた行動カテゴリ。
- この差分は `pressure_attack_monster_plus4` の道筋上で比較候補も同一盤面評価したもの。分岐後の完全な棋譜比較ではなく、改善要因を探すための診断値。

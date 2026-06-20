# White AI Decision Diff Loop

生成: 2026-06-20T00:48:25.070Z
参照候補: `pressure_white_baseline`
比較候補: `pressure_white_monster_pressure_v1`
相手: black_pressure_strong, black_pressure_pressure
seed: 39000-39005 / 各seat
確認範囲: turn 6 まで

## Conclusion

- pressure_white_baseline vs pressure_white_monster_pressure_v1: 参照だけが勝ったseedは 0/24、比較だけが勝ったseedは 0/24。
- 次は、最多分岐カテゴリが敵モンスター攻撃へ寄るなら白限定の敵モンスター攻撃全般補正、マスター攻撃抑制へ寄るなら非リーサル本体攻撃抑制を候補にする。

## Pair Summary

| Compare | Seeds | Ref win / compare not | Compare win / ref not | Both win | Both loss | Other | First diff categories |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| pressure_white_monster_pressure_v1 | 24 | 0 | 0 | 5 | 19 | 0 | - |

## Samples

### pressure_white_monster_pressure_v1

参照候補だけが勝ったサンプルはなかった。


## Reading

- `Ref win / compare not` は参照候補だけが勝ったseed数。今回の主観察対象。
- `First diff categories` は参照候補の盤面進行上で最初に選択が分かれた行動カテゴリ。
- この差分は `pressure_attack_monster_plus4` の道筋上で比較候補も同一盤面評価したもの。分岐後の完全な棋譜比較ではなく、改善要因を探すための診断値。

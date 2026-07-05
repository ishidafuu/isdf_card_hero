# White Planner Front Hold Summary

生成: 2026-07-05

## 目的

白白の残り負け `994311 challenger-as-player` を改善する。  
前回の `preserved reserve` 後、この範囲の中母数は `994310-994315 both` で `8-4-0`、残課題として `994311 challenger-as-player` が残っていた。

## 観測

### `994311 challenger-as-player` step 67

- 現行選択: `attack:デスシープ:attack->デスシープ`
- 盤面: 自前衛デスシープ2体、相手前衛デスシープ2体、相手後衛ボムゾウ/ピグミィ。
- 問題: 相手前衛を倒しきれない攻撃で行動を消費し、未行動前衛を気合に変換できていなかった。
- forced branch 240 step:
  - 現行攻撃: white 勝ち、score `-1000000`
  - `end_turn`: white_planner 勝ち、score `1000000`
- forced branch 28 step:
  - 現行攻撃: `-302.2`
  - `end_turn`: `-65`

28 stepでも `end_turn` が現行攻撃より明確に良く、既存の短い front-pressure rollout で拾える局面だった。

## 対応

front-pressure rollout の候補に、条件付きで `end_turn` を追加した。

追加条件:

- 白ミラー。
- 相手前衛の脅威が残っている。
- `end_turn` の root score が極端に悪くない。
- 未行動の自前衛が `end_turn` で気合状態に変換される。

これにより、倒しきれない前衛攻撃で小さく削るより、気合を残して次ターンの制圧に接続する枝を比較対象にできる。

## 結果

### 直接対象

| case | 修正前 | 修正後 |
| --- | --- | --- |
| `994311 challenger-as-player` | loss, HP `P0/C6` | win, HP `P2/C0` |

### 中母数

`master-lab-white-1377-death-sheep3`, seeds `994310-994315`, both directions。

| version | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| previous | 8-4-0 | 66.7% | +2.83 | 251.6 | 25.2 | 820.4 | 67460.0 | 0 |
| front hold | 9-3-0 | 75.0% | +3.08 | 258.2 | 25.3 | 840.7 | 66653.1 | 0 |

### 既存ガード

`master-lab-white-1377-death-sheep3`, seeds `994306-994309`, both directions。

| version | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| previous | 8-0-0 | 100% | +5.88 | 258.9 | 24.8 | 932.2 | 77761.0 | 0 |
| front hold | 8-0-0 | 100% | +5.13 | 261.5 | 25.3 | 984.5 | 77912.9 | 0 |

## 所感

今回の改善は「係数で攻撃を雑に抑える」ではなく、既存の front-pressure rollout に `end_turn` を比較対象として入れる対応。  
白対白では、倒しきれない前衛攻撃より、未行動前衛を気合で残して次ターンの制圧に接続する判断が重要で、今回の `994311` はその典型だった。

max decision は引き続き 60-80 秒級が出る。勝率改善とは別軸で、長考局面の抽出と枝刈りは継続課題。

## 次の改善候補

次は勝率をさらに追うより、長考局面の内訳を監査するのがよい。特に front-pressure rollout が出た局面で、追加候補が何回発火し、何秒増やしたかを記録できるようにすると、実プレイ向けAIとしての調整がしやすい。

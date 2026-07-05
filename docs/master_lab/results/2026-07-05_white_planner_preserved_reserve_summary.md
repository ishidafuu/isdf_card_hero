# White Planner Preserved Reserve Summary

生成: 2026-07-05

## 目的

白白の中母数確認で見つかった `994310 challenger-as-cpu` の大敗を改善する。

修正前の `994310-994315 both` は 7-5-0、平均HP差 +1.5。特に `994310 challenger-as-cpu` は HP `P10/C0` の大敗だった。

## 観測

### `994310 challenger-as-cpu` step 54

- 現行選択: `focus:デスシープ`
- forced branch best: `summon:デスシープ->cpu_back_right`
- `focus:デスシープ` は最終的に white 勝ち、`summon:デスシープ->cpu_back_right` は white_planner 勝ち。
- `end_turn` でも勝ち筋があり、局面の本質は「このターンに小さく動いて石を吐き切るより、後列控えと石を残す」ことだった。

terminal audit では、`focus` 後は自ターン終了時に石0まで使い切っていた。一方、`summon:デスシープ->cpu_back_right` は召喚したデスシープが後列に残り、石も5残る。

## 対応

`backlineReserveSummonOverFocusPlannerBonus` に preserved reserve 条件を追加した。

以下を満たす場合だけ、フォーカスより後列控え召喚を加点する。

- 白ミラー。
- turn 5-8。
- 相手石が1以下。
- fallback が自前衛への `focus`。
- candidate が空き後列へのHP5以上・最大Lv2以上モンスター召喚。
- 自前衛が1体だけ。
- 相手前衛が2体いる。
- 召喚した駒が terminal plan 後も同じ後列に残る。
- terminal plan 後も石が4以上残る。
- focus 対象が最大Lv2以下。最大Lv3級の前衛 focus を邪魔しない。

一度は条件を広げすぎ、`994308 challenger-as-cpu` の turn 5 で `focus:真勇者ダイン` を押しのけて悪化したため、上記の「自前衛1体」「focus対象最大Lv2以下」で絞った。

## 結果

### 直接対象

| case | 修正前 | 修正後 |
| --- | --- | --- |
| `994310 challenger-as-cpu` | loss, HP margin -10 | win, HP margin +6 |

### 中母数

`master-lab-white-1377-death-sheep3`, seeds `994310-994315`, both directions。

| version | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| before | 7-5-0 | 58.3% | +1.5 | 246.1 | 24.7 | 809.0 | 66097.1 | 0 |
| after narrow | 8-4-0 | 66.7% | +2.83 | 251.6 | 25.2 | 820.4 | 67460.0 | 0 |

### 既存ガード

`master-lab-white-1377-death-sheep3`, seeds `994306-994309`, both directions。

| W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8-0-0 | 100% | +5.88 | 258.9 | 24.8 | 932.2 | 77761.0 | 0 |

## 残課題

- `994313 challenger-as-cpu`、`994311/994312/994314 challenger-as-player` の負けは残る。
- max decision は引き続き 60-80 秒級が出る。強さ改善と別に、長考局面の抽出と枝刈りが必要。

## 次の改善候補

次は `994311 challenger-as-player` か `994313 challenger-as-cpu` を監査する。前者は短期決着負け、後者は接戦負けなので、短期決着負けから先に見る方が改善幅を得やすい。

# White No-Rare8 Deck Tier Summary

生成: 2026-06-27

## Goal

モーガンなどの8ありカードを含むデッキでは白AIの基礎評価が歪むため、現行最強の `white` AI プロファイルで、Pro 8なし白デッキだけを比較した。

対象は静的評価上位の Pro 8なし白デッキから、special allowed ではないものを採用した。
`submission-pro-no-rare8-white-1377` は基準デッキとして必ず含む。

## AI / Conditions

- AI: `white` profile current default
  - same-turn search depth 3 / width 4
  - terminal plan 6x2 weight 2
  - opponent terminal response 2x1 weight 0.35
- master: White vs White
- deck group: `pro-no-rare8-white`
- special allowed submissions: excluded

## Top 8 Screen

コマンド:

```bash
npm run tier:white-no-rare8 -- --top 8 --games-per-direction 1 --seed-start 79000 --markdown docs/master_lab/results/2026-06-27_white_no_rare8_tier_top8.md --json docs/master_lab/results/2026-06-27_white_no_rare8_tier_top8.json
```

総試合: 56

| Rank | Tier | Deck | W-L-D | WPR | Avg HP diff | Note |
| ---: | --- | --- | --- | ---: | ---: | --- |
| 1 | A | `submission-pro-no-rare8-white-1377` | 9-5-0 | 64.3% | +1.43 | 基準デッキ。一次では首位。 |
| 2 | A | `submission-pro-no-rare8-white-1060` | 9-5-0 | 64.3% | +1.21 | 1377とほぼ同等。 |
| 3 | B | `submission-pro-no-rare8-white-345` | 7-7-0 | 50.0% | +1.07 | 勝率五分だが点差は良い。 |
| 4 | B | `submission-pro-no-rare8-white-836` | 7-7-0 | 50.0% | +0.43 | 席差が大きい。 |
| 5 | B | `submission-pro-no-rare8-white-494` | 7-7-0 | 50.0% | -0.43 | 静的評価は高いが実戦は五分。 |
| 6 | B | `submission-pro-no-rare8-white-541` | 7-7-0 | 50.0% | -0.64 | 494に近い。 |
| 7 | C | `submission-pro-no-rare8-white-479` | 6-8-0 | 42.9% | -1.29 | 相性差が強い。 |
| 8 | D | `submission-pro-no-rare8-white-400` | 4-10-0 | 28.6% | -1.79 | 現行AIでは低め。 |

## Top 4 Confirm

コマンド:

```bash
npm run tier:white-no-rare8 -- --candidate submission-pro-no-rare8-white-1377 --candidate submission-pro-no-rare8-white-1060 --candidate submission-pro-no-rare8-white-345 --candidate submission-pro-no-rare8-white-836 --games-per-direction 2 --seed-start 79100 --markdown docs/master_lab/results/2026-06-27_white_no_rare8_tier_top4_confirm.md --json docs/master_lab/results/2026-06-27_white_no_rare8_tier_top4_confirm.json
```

総試合: 24

| Rank | Tier | Deck | W-L-D | WPR | Avg HP diff | Direct notes |
| ---: | --- | --- | --- | ---: | ---: | --- |
| 1 | A | `submission-pro-no-rare8-white-345` | 7-5-0 | 58.3% | +2.42 | 1377とは2-2、836には3-1。 |
| 2 | A | `submission-pro-no-rare8-white-1377` | 7-5-0 | 58.3% | +1.25 | 1060には3-1、345/836とは2-2。 |
| 3 | B | `submission-pro-no-rare8-white-1060` | 6-6-0 | 50.0% | -0.83 | 1377に1-3、836に3-1。 |
| 4 | D | `submission-pro-no-rare8-white-836` | 4-8-0 | 33.3% | -2.83 | 上位4確認では落ちた。 |

## Reading

- `1377` は8なし白の基準としてかなり妥当。一次では1位、上位4確認でも2位で、少なくとも弱い基準ではない。
- `345` は上位4確認で最上位。点差が大きく、現行AIとの噛み合いが良い可能性がある。
- `1060` は一次では1377級だったが、上位4確認では1377に直接1-3で落ちた。候補としては残るが、1377を置き換えるほどではない。
- `494` は静的評価の割に現行AIでは伸びなかった。白AIが使いこなせていない可能性と、単純に現行環境で上位に届かない可能性の両方がある。
- 席差はまだ大きい。特に上位4確認では `1377` と `345` が player side 83.3% / cpu side 33.3% で、seed・先後・席の影響が残っている。

## Current Tier Judgment

| Tier | Decks | Comment |
| --- | --- | --- |
| A | `1377`, `345`, `1060` | 1377と345が本命。1060は準本命。 |
| B | `836`, `494`, `541` | 上位候補ではあるが、現行AIでは安定して上位と言い切れない。 |
| C | `479` | 相性次第。基準デッキ候補からは一段落ちる。 |
| D | `400` | 今回条件では低め。 |

## Conclusion

当面の白AI・白デッキ基準は `submission-pro-no-rare8-white-1377` のままでよい。
ただし、現行AIでは `submission-pro-no-rare8-white-345` もかなり有力なので、次にデッキ側を詰めるなら `1377` vs `345` を中母数で直接確認する価値がある。

次に追加するなら、`1377` / `345` / `1060` の3候補だけを `games-per-direction 4-6` で回し、席差と直接相性を確認する。

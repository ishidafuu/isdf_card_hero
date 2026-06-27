# White 1377 Yummy Variant Check

生成: 2026-06-27T12:43:43.459Z
基準デッキ: submission-pro-no-rare8-white-1377
試行: 1 games/matchup/direction
総試合: 12
AI: white profile current default

## Variants

| Variant | 構成差分 | 前衛/後衛/魔法 | Note |
| --- | --- | ---: | --- |
| 1377-original<br>1377原型 | ヤミーx3 / デスシープx0 / アーシュ＆ロロx0 | 15/6/9 | ヤミー3枚をそのまま残す現行基準。 |
| 1377-death-sheep3<br>1377 ヤミー3 -> デスシープ3 | ヤミーx0 / デスシープx3 / アーシュ＆ロロx0 | 15/6/9 | 石妨害を捨て、前衛の拘束・受け性能を厚くする。 |
| 1377-ash-roro3<br>1377 ヤミー3 -> アーシュ＆ロロ3 | ヤミーx0 / デスシープx0 / アーシュ＆ロロx3 | 15/6/9 | 石妨害を捨て、前衛からの打点・射程変化を厚くする。 |
| 1377-yummy-death-sheep-ash-roro<br>1377 ヤミー/デスシープ/アーシュ＆ロロ各1 | ヤミーx1 / デスシープx1 / アーシュ＆ロロx1 | 15/6/9 | 石妨害・拘束・打点変化を1枚ずつ散らす。 |

## Standings

| Rank | Variant | Score | W-L-D | WPR | Avg HP diff | Seat WPR P/C | Avg turns | Avg turn ms | Issues |
| ---: | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 1377-death-sheep3<br>1377 ヤミー3 -> デスシープ3 | 116.5 | 6-0-0 | 100% | +5.5 | 100%/100% | 25 | 1271.9 | 0 |
| 2 | 1377-yummy-death-sheep-ash-roro<br>1377 ヤミー/デスシープ/アーシュ＆ロロ各1 | 75.7 | 4-2-0 | 66.7% | +3 | 66.7%/66.7% | 22.5 | 1262.5 | 0 |
| 3 | 1377-ash-roro3<br>1377 ヤミー3 -> アーシュ＆ロロ3 | 25.8 | 2-4-0 | 33.3% | -2.5 | 33.3%/33.3% | 22.2 | 1269.1 | 0 |
| 4 | 1377-original<br>1377原型 | -18 | 0-6-0 | 0% | -6 | 0%/0% | 21.3 | 1552.2 | 0 |

## Matchup Matrix

| Variant A | Variant B | Result for A | A WPR | Avg HP diff for A |
| --- | --- | ---: | ---: | ---: |
| 1377-original | 1377-death-sheep3 | 0-2-0 | 0% | -4.5 |
| 1377-original | 1377-ash-roro3 | 0-2-0 | 0% | -7 |
| 1377-original | 1377-yummy-death-sheep-ash-roro | 0-2-0 | 0% | -6.5 |
| 1377-death-sheep3 | 1377-ash-roro3 | 2-0-0 | 100% | +7.5 |
| 1377-death-sheep3 | 1377-yummy-death-sheep-ash-roro | 2-0-0 | 100% | +4.5 |
| 1377-ash-roro3 | 1377-yummy-death-sheep-ash-roro | 0-2-0 | 0% | -7 |

## Reading

- 暫定1位は 1377-death-sheep3（WPR 100%, 平均HP差 +5.5）。
- 1377原型は 4位（WPR 0%, 平均HP差 -6）。
- 原型 vs 1377-death-sheep3: 原型側 WPR 0%, 平均HP差 -4.5。
- 原型 vs 1377-ash-roro3: 原型側 WPR 0%, 平均HP差 -7。
- 原型 vs 1377-yummy-death-sheep-ash-roro: 原型側 WPR 0%, 平均HP差 -6.5。

## Notes

- AI は両席とも current white profile。デッキ以外のAI設定は変えていない。
- 1377のヤミー3枠だけを差し替え、他29/30枚または27/30枚の構成は固定した。
- 小母数の派生比較なので、上位候補は別seed・中母数で再確認する前提。


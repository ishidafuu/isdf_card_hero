# White 1377 Yummy Variant Check

生成: 2026-06-27T12:31:20.496Z
基準デッキ: submission-pro-no-rare8-white-1377
試行: 2 games/matchup/direction
総試合: 24
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
| 1 | 1377-death-sheep3<br>1377 ヤミー3 -> デスシープ3 | 73.7 | 8-4-0 | 66.7% | +2.33 | 50%/83.3% | 23.4 | 1382.1 | 0 |
| 2 | 1377-yummy-death-sheep-ash-roro<br>1377 ヤミー/デスシープ/アーシュ＆ロロ各1 | 51.8 | 6-6-0 | 50% | +0.58 | 33.3%/66.7% | 23 | 1371.8 | 0 |
| 3 | 1377-ash-roro3<br>1377 ヤミー3 -> アーシュ＆ロロ3 | 46.3 | 6-6-0 | 50% | -1.25 | 16.7%/83.3% | 20.3 | 1270.4 | 0 |
| 4 | 1377-original<br>1377原型 | 28.3 | 4-8-0 | 33.3% | -1.67 | 33.3%/33.3% | 22.5 | 1216.3 | 0 |

## Matchup Matrix

| Variant A | Variant B | Result for A | A WPR | Avg HP diff for A |
| --- | --- | ---: | ---: | ---: |
| 1377-original | 1377-death-sheep3 | 0-4-0 | 0% | -5.75 |
| 1377-original | 1377-ash-roro3 | 2-2-0 | 50% | +2.75 |
| 1377-original | 1377-yummy-death-sheep-ash-roro | 2-2-0 | 50% | -2 |
| 1377-death-sheep3 | 1377-ash-roro3 | 2-2-0 | 50% | +0.5 |
| 1377-death-sheep3 | 1377-yummy-death-sheep-ash-roro | 2-2-0 | 50% | +0.75 |
| 1377-ash-roro3 | 1377-yummy-death-sheep-ash-roro | 2-2-0 | 50% | -0.5 |

## Reading

- 暫定1位は 1377-death-sheep3（WPR 66.7%, 平均HP差 +2.33）。
- 1377原型は 4位（WPR 33.3%, 平均HP差 -1.67）。
- 原型 vs 1377-death-sheep3: 原型側 WPR 0%, 平均HP差 -5.75。
- 原型 vs 1377-ash-roro3: 原型側 WPR 50%, 平均HP差 +2.75。
- 原型 vs 1377-yummy-death-sheep-ash-roro: 原型側 WPR 50%, 平均HP差 -2。

## Notes

- AI は両席とも current white profile。デッキ以外のAI設定は変えていない。
- 1377のヤミー3枠だけを差し替え、他29/30枚または27/30枚の構成は固定した。
- 小母数の派生比較なので、上位候補は別seed・中母数で再確認する前提。

# White Planner PDCA Loop

生成: 2026-07-05T03:14:03.376Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout2_60_w015_gap200 | 1-0-0 | 100% | 5 | 281 | 27 | 1043.2 | 79930.4 | 0 | 60手rolloutを維持しつつ上位2候補に限定して勝ち筋と判断時間の両立を狙う |

## Action Counts

- rollout2_60_w015_gap200: attack 40, end_turn 26, focus 19, magic 1, master:master_attack 13, master:shield 12, master:wake_up 3, move 4, summon 19

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| rollout2_60_w015_gap200 | challenger-as-player | 994306 | white_planner | 281 | 27 | P5/C0 | - |

## Conclusion

- best candidate: rollout2_60_w015_gap200 (1-0-0, WPR 100%, avg HP margin 5)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.

# White Planner PDCA Loop

生成: 2026-07-04T05:03:45.266Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_60_w015_gap200 | 1-0-0 | 100% | 5 | 281 | 27 | 1547.8 | 77051.1 | 0 | terminal上位3候補を60手rolloutし、80手版より判断時間を抑える |
| 2 | current | 0-1-0 | 0% | -6 | 175 | 22 | 468.7 | 2858.5 | 0 | 現行 white_planner |

## Action Counts

- rollout3_60_w015_gap200: attack 40, end_turn 26, focus 19, magic 1, master:master_attack 13, master:shield 12, master:wake_up 3, move 4, summon 19
- current: attack 25, end_turn 22, focus 9, magic 1, master:master_attack 5, master:shield 8, master:wake_up 2, move 4, summon 11

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-player | 994306 | white | 175 | 22 | P0/C6 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994306 | white_planner | 281 | 27 | P5/C0 | - |

## Conclusion

- best candidate: rollout3_60_w015_gap200 (1-0-0, WPR 100%, avg HP margin 5)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.

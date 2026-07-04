# White Planner PDCA Loop

生成: 2026-07-04T03:26:50.696Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994305-994306
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_60_w015_gap200 | 4-0-0 | 100% | 4.5 | 268 | 25.5 | 1949.9 | 138216 | 0 | terminal上位3候補を60手rolloutし、80手版より判断時間を抑える |

## Action Counts

- rollout3_60_w015_gap200: attack 150, end_turn 99, focus 85, magic 4, master:master_attack 36, master:shield 38, master:wake_up 15, move 29, summon 66

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994305 | white_planner | 312 | 32 | P0/C1 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994306 | white_planner | 169 | 16 | P0/C8 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994305 | white_planner | 310 | 27 | P4/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994306 | white_planner | 281 | 27 | P5/C0 | - |

## Conclusion

- best candidate: rollout3_60_w015_gap200 (4-0-0, WPR 100%, avg HP margin 4.5)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.

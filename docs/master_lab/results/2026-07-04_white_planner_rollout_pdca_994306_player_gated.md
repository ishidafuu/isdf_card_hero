# White Planner PDCA Loop

生成: 2026-07-04T02:44:52.749Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_80_w015_gap200 | 1-0-0 | 100% | 3 | 242 | 22 | 4337 | 157767.9 | 0 | terminal上位3候補を80手rolloutし、fallbackを大きく上回る時だけ採用する |

## Action Counts

- rollout3_80_w015_gap200: attack 32, end_turn 21, focus 15, magic 1, master:master_attack 3, master:shield 15, master:wake_up 7, move 7, summon 18

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| rollout3_80_w015_gap200 | challenger-as-player | 994306 | white_planner | 242 | 22 | P3/C0 | - |

## Conclusion

- best candidate: rollout3_80_w015_gap200 (1-0-0, WPR 100%, avg HP margin 3)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.

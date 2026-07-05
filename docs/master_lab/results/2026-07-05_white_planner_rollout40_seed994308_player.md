# White Planner PDCA Loop

生成: 2026-07-05T02:05:33.048Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994308-994308
directions: challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_40_w015_gap200 | 0-1-0 | 0% | -6 | 217 | 19 | 1629.7 | 43342.6 | 0 | 通常rolloutを40手へ抑え、局所的な応答読みを残しつつ判断時間を下げる |

## Action Counts

- rollout3_40_w015_gap200: attack 28, end_turn 19, focus 12, magic 2, master:master_attack 12, master:shield 6, master:wake_up 3, move 4, summon 13

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| rollout3_40_w015_gap200 | challenger-as-player | 994308 | white | 217 | 19 | P0/C6 | - |

## Conclusion

- best candidate: rollout3_40_w015_gap200 (0-1-0, WPR 0%, avg HP margin -6)
- No candidate beat the current white baseline in this sample. Keep white_planner experimental and tighten adoption around clearly winning planner differences.

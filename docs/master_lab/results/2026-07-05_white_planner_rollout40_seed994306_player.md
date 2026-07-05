# White Planner PDCA Loop

生成: 2026-07-05T03:10:10.396Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994306
directions: challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_40_w015_gap200 | 0-1-0 | 0% | -6 | 270 | 27 | 1047.1 | 63080.8 | 0 | 通常rolloutを40手へ抑え、局所的な応答読みを残しつつ判断時間を下げる |

## Action Counts

- rollout3_40_w015_gap200: attack 32, end_turn 26, focus 20, magic 1, master:master_attack 10, master:shield 11, master:wake_up 3, move 4, summon 18

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| rollout3_40_w015_gap200 | challenger-as-player | 994306 | white | 270 | 27 | P0/C6 | - |

## Conclusion

- best candidate: rollout3_40_w015_gap200 (0-1-0, WPR 0%, avg HP margin -6)
- No candidate beat the current white baseline in this sample. Keep white_planner experimental and tighten adoption around clearly winning planner differences.

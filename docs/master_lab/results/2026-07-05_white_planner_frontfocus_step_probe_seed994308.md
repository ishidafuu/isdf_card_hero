# White Planner PDCA Loop

生成: 2026-07-05T02:13:20.116Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994308-994308
directions: challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_40_front12_w015_gap200 | 0-1-0 | 0% | -5 | 291 | 27 | 858 | 17090.6 | 0 | 通常rollout40手、前衛focus剥がしrollout12手まで短縮して実戦時間を優先する |
| 2 | rollout3_40_front16_w015_gap200 | 0-1-0 | 0% | -6 | 217 | 19 | 1431.8 | 24989.2 | 0 | 通常rollout40手、前衛focus剥がしrollout16手で重い白ミラー比較を抑える |

## Action Counts

- rollout3_40_front12_w015_gap200: attack 52, end_turn 26, focus 20, magic 2, master:master_attack 12, master:shield 9, master:wake_up 3, move 7, summon 17
- rollout3_40_front16_w015_gap200: attack 28, end_turn 19, focus 12, magic 2, master:master_attack 12, master:shield 6, master:wake_up 3, move 4, summon 13

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| rollout3_40_front16_w015_gap200 | challenger-as-player | 994308 | white | 217 | 19 | P0/C6 | - |
| rollout3_40_front12_w015_gap200 | challenger-as-player | 994308 | white | 291 | 27 | P0/C5 | - |

## Conclusion

- best candidate: rollout3_40_front12_w015_gap200 (0-1-0, WPR 0%, avg HP margin -5)
- No candidate beat the current white baseline in this sample. Keep white_planner experimental and tighten adoption around clearly winning planner differences.

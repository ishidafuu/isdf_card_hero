# White Planner PDCA Loop

生成: 2026-07-05T02:16:23.669Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994307-994307
directions: challenger-as-cpu

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_40_front12_w015_gap200 | 1-0-0 | 100% | 2 | 297 | 28 | 725.3 | 5601.3 | 0 | 通常rollout40手、前衛focus剥がしrollout12手まで短縮して実戦時間を優先する |

## Action Counts

- rollout3_40_front12_w015_gap200: attack 55, end_turn 27, focus 28, magic 2, master:master_attack 13, master:shield 9, master:wake_up 1, move 7, summon 16

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| rollout3_40_front12_w015_gap200 | challenger-as-cpu | 994307 | white_planner | 297 | 28 | P0/C2 | - |

## Conclusion

- best candidate: rollout3_40_front12_w015_gap200 (1-0-0, WPR 100%, avg HP margin 2)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.

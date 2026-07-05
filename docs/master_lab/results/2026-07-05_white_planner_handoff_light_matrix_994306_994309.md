# White Planner PDCA Loop

生成: 2026-07-05T03:06:15.129Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994309
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_40_front12_handoff_light_w015_gap200 | 5-3-0 | 62.5% | 1.38 | 237.4 | 23.3 | 640.6 | 5720.1 | 0 | rollout内部をstrong profileに落とし、次自ターンまでの軽量応答読みへ寄せる |

## Action Counts

- rollout3_40_front12_handoff_light_w015_gap200: attack 284, end_turn 180, focus 147, magic 8, master:master_attack 67, master:shield 71, master:wake_up 21, move 39, summon 115

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| rollout3_40_front12_handoff_light_w015_gap200 | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |
| rollout3_40_front12_handoff_light_w015_gap200 | challenger-as-cpu | 994307 | white_planner | 297 | 28 | P0/C2 | - |
| rollout3_40_front12_handoff_light_w015_gap200 | challenger-as-cpu | 994308 | white_planner | 253 | 22 | P0/C7 | - |
| rollout3_40_front12_handoff_light_w015_gap200 | challenger-as-cpu | 994309 | white | 281 | 26 | P7/C0 | - |
| rollout3_40_front12_handoff_light_w015_gap200 | challenger-as-player | 994306 | white | 175 | 22 | P0/C6 | - |
| rollout3_40_front12_handoff_light_w015_gap200 | challenger-as-player | 994307 | white_planner | 292 | 27 | P7/C0 | - |
| rollout3_40_front12_handoff_light_w015_gap200 | challenger-as-player | 994308 | white | 221 | 21 | P0/C4 | - |
| rollout3_40_front12_handoff_light_w015_gap200 | challenger-as-player | 994309 | white_planner | 205 | 18 | P6/C0 | - |

## Conclusion

- best candidate: rollout3_40_front12_handoff_light_w015_gap200 (5-3-0, WPR 62.5%, avg HP margin 1.38)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.

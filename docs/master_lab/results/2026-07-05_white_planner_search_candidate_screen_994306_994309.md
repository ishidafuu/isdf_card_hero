# White Planner PDCA Loop

生成: 2026-07-04T16:51:25.325Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994306-994309
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | rollout3_60_w015_gap200 | 6-2-0 | 75% | 2.75 | 245.4 | 23.3 | 774 | 96441 | 0 | terminal上位3候補を60手rolloutし、80手版より判断時間を抑える |
| 2 | response2_width2 | 5-3-0 | 62.5% | 1.5 | 229 | 22.1 | 826.9 | 6452.6 | 0 | 相手応答を深さ2・幅2で読み、現行採用ゲートは維持する |
| 3 | terminal6_response2_width2 | 5-3-0 | 62.5% | 1.5 | 229 | 22.1 | 859 | 8952.3 | 0 | 自ターン終端深さ6と相手応答2x2で最終盤面比較を厚くする |
| 4 | current | 5-3-0 | 62.5% | 1.38 | 232.1 | 22.6 | 614.9 | 4851.4 | 0 | 現行 white_planner |
| 5 | response2_width3 | 3-5-0 | 37.5% | 0 | 219.3 | 21.4 | 1318.4 | 11039.4 | 0 | 相手応答を深さ2・幅3で読み、終盤の返し候補漏れを減らす |

## Action Counts

- rollout3_60_w015_gap200: attack 293, end_turn 179, focus 155, magic 8, master:master_attack 72, master:shield 76, master:wake_up 22, move 40, summon 123
- response2_width2: attack 276, end_turn 171, focus 141, magic 8, master:master_attack 61, master:shield 76, master:wake_up 21, move 38, summon 113
- terminal6_response2_width2: attack 276, end_turn 171, focus 141, magic 8, master:master_attack 61, master:shield 76, master:wake_up 21, move 38, summon 113
- current: attack 278, end_turn 175, focus 145, magic 8, master:master_attack 64, master:shield 72, master:wake_up 21, move 40, summon 115
- response2_width3: attack 265, end_turn 166, focus 130, magic 7, master:master_attack 56, master:shield 76, master:wake_up 16, move 37, summon 108

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |
| current | challenger-as-cpu | 994307 | white | 288 | 27 | P7/C0 | - |
| current | challenger-as-cpu | 994308 | white_planner | 253 | 22 | P0/C7 | - |
| current | challenger-as-cpu | 994309 | white_planner | 248 | 22 | P0/C2 | - |
| current | challenger-as-player | 994306 | white | 175 | 22 | P0/C6 | - |
| current | challenger-as-player | 994307 | white_planner | 292 | 27 | P7/C0 | - |
| current | challenger-as-player | 994308 | white | 221 | 21 | P0/C4 | - |
| current | challenger-as-player | 994309 | white_planner | 205 | 18 | P6/C0 | - |
| response2_width2 | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |
| response2_width2 | challenger-as-cpu | 994307 | white | 263 | 23 | P6/C0 | - |
| response2_width2 | challenger-as-cpu | 994308 | white_planner | 253 | 22 | P0/C7 | - |
| response2_width2 | challenger-as-cpu | 994309 | white_planner | 248 | 22 | P0/C2 | - |
| response2_width2 | challenger-as-player | 994306 | white | 175 | 22 | P0/C6 | - |
| response2_width2 | challenger-as-player | 994307 | white_planner | 292 | 27 | P7/C0 | - |
| response2_width2 | challenger-as-player | 994308 | white | 221 | 21 | P0/C4 | - |
| response2_width2 | challenger-as-player | 994309 | white_planner | 205 | 18 | P6/C0 | - |
| response2_width3 | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |
| response2_width3 | challenger-as-cpu | 994307 | white | 263 | 23 | P6/C0 | - |
| response2_width3 | challenger-as-cpu | 994308 | white_planner | 253 | 22 | P0/C7 | - |
| response2_width3 | challenger-as-cpu | 994309 | white | 172 | 16 | P1/C0 | - |
| response2_width3 | challenger-as-player | 994306 | white | 175 | 22 | P0/C6 | - |
| response2_width3 | challenger-as-player | 994307 | white | 290 | 27 | P0/C2 | - |
| response2_width3 | challenger-as-player | 994308 | white | 221 | 21 | P0/C4 | - |
| response2_width3 | challenger-as-player | 994309 | white_planner | 205 | 18 | P6/C0 | - |
| terminal6_response2_width2 | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |
| terminal6_response2_width2 | challenger-as-cpu | 994307 | white | 263 | 23 | P6/C0 | - |
| terminal6_response2_width2 | challenger-as-cpu | 994308 | white_planner | 253 | 22 | P0/C7 | - |
| terminal6_response2_width2 | challenger-as-cpu | 994309 | white_planner | 248 | 22 | P0/C2 | - |
| terminal6_response2_width2 | challenger-as-player | 994306 | white | 175 | 22 | P0/C6 | - |
| terminal6_response2_width2 | challenger-as-player | 994307 | white_planner | 292 | 27 | P7/C0 | - |
| terminal6_response2_width2 | challenger-as-player | 994308 | white | 221 | 21 | P0/C4 | - |
| terminal6_response2_width2 | challenger-as-player | 994309 | white_planner | 205 | 18 | P6/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994306 | white_planner | 175 | 22 | P0/C6 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994307 | white | 288 | 27 | P7/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994308 | white_planner | 253 | 22 | P0/C7 | - |
| rollout3_60_w015_gap200 | challenger-as-cpu | 994309 | white_planner | 248 | 22 | P0/C2 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994306 | white_planner | 281 | 27 | P5/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994307 | white_planner | 292 | 27 | P7/C0 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994308 | white | 221 | 21 | P0/C4 | - |
| rollout3_60_w015_gap200 | challenger-as-player | 994309 | white_planner | 205 | 18 | P6/C0 | - |

## Conclusion

- best candidate: rollout3_60_w015_gap200 (6-2-0, WPR 75%, avg HP margin 2.75)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.

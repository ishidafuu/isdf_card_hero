# White Planner PDCA Loop

生成: 2026-07-04T10:17:19.669Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994305-994305
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | response_setup_over_focus_t9 | 1-1-0 | 50% | -3 | 286.5 | 27.5 | 742 | 4672.5 | 0 | turn9以降、fallbackがfocusの時だけsetup候補を応答評価で比較する |

## Action Counts

- response_setup_over_focus_t9: attack 74, end_turn 54, focus 45, magic 3, master:master_attack 18, master:shield 22, master:wake_up 8, move 18, summon 32

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| response_setup_over_focus_t9 | challenger-as-cpu | 994305 | white_planner | 311 | 29 | P0/C2 | - |
| response_setup_over_focus_t9 | challenger-as-player | 994305 | white | 262 | 26 | P0/C8 | - |

## Conclusion

- best candidate: response_setup_over_focus_t9 (1-1-0, WPR 50%, avg HP margin -3)
- The best candidate reached parity in this sample. Increase games per direction before adopting it as default.

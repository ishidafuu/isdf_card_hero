# White Planner PDCA Loop

生成: 2026-07-04T10:11:25.087Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994304-994304
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | response_setup_over_focus_t9 | 2-0-0 | 100% | 6.5 | 260 | 25.5 | 544.4 | 3984.3 | 0 | turn9以降、fallbackがfocusの時だけsetup候補を応答評価で比較する |

## Action Counts

- response_setup_over_focus_t9: attack 89, end_turn 50, focus 32, magic 3, master:master_attack 17, master:shield 20, master:wake_up 7, move 17, summon 36

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| response_setup_over_focus_t9 | challenger-as-cpu | 994304 | white_planner | 266 | 23 | P0/C9 | - |
| response_setup_over_focus_t9 | challenger-as-player | 994304 | white_planner | 254 | 28 | P4/C0 | - |

## Conclusion

- best candidate: response_setup_over_focus_t9 (2-0-0, WPR 100%, avg HP margin 6.5)
- The best candidate beat the current white baseline in this sample. Re-run with more seeds before adopting.

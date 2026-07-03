# White Planner PDCA Loop

生成: 2026-07-03T14:33:36.617Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994300
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | low_focus_conservative | 1-1-0 | 50% | -3.5 | 188.5 | 20.5 | 142.9 | 1198.9 | 0 | focus 終端価値を抑え、削り放棄を減らす |
| 2 | strict80_gap0 | 1-1-0 | 50% | -4 | 188 | 21 | 145.2 | 1184.7 | 0 | 通常評価と同等以上の候補だけ planner 採用する安全寄り |
| 3 | conservative32_gap45 | 1-1-0 | 50% | -4 | 188 | 21 | 145.5 | 1185.8 | 0 | 採用をやや厳しくし、通常評価から離れすぎる手を抑える |
| 4 | conservative48_gap25 | 1-1-0 | 50% | -4 | 188 | 21 | 145.7 | 1174.2 | 0 | 採用を強めに絞り、planner の過剰介入を抑える |
| 5 | current | 1-1-0 | 50% | -4 | 188 | 21 | 148.6 | 1183.3 | 0 | 現行 white_planner |
| 6 | response2_conservative | 1-1-0 | 50% | -4 | 188 | 21 | 178 | 1484 | 0 | 相手応答を少し深く読み、採用は保守的にする |

## Action Counts

- low_focus_conservative: attack 62, end_turn 40, focus 20, magic 2, master:master_attack 11, master:shield 19, master:wake_up 4, move 8, summon 23
- strict80_gap0: attack 60, end_turn 41, focus 20, magic 2, master:master_attack 11, master:shield 18, master:wake_up 4, move 8, summon 23
- conservative32_gap45: attack 60, end_turn 41, focus 20, magic 2, master:master_attack 11, master:shield 18, master:wake_up 4, move 8, summon 23
- conservative48_gap25: attack 60, end_turn 41, focus 20, magic 2, master:master_attack 11, master:shield 18, master:wake_up 4, move 8, summon 23
- current: attack 60, end_turn 41, focus 20, magic 2, master:master_attack 11, master:shield 18, master:wake_up 4, move 8, summon 23
- response2_conservative: attack 60, end_turn 41, focus 20, magic 2, master:master_attack 11, master:shield 18, master:wake_up 4, move 8, summon 23

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994300 | white_planner | 232 | 27 | P0/C1 | - |
| current | challenger-as-player | 994300 | white | 144 | 15 | P0/C9 | - |
| conservative32_gap45 | challenger-as-cpu | 994300 | white_planner | 232 | 27 | P0/C1 | - |
| conservative32_gap45 | challenger-as-player | 994300 | white | 144 | 15 | P0/C9 | - |
| conservative48_gap25 | challenger-as-cpu | 994300 | white_planner | 232 | 27 | P0/C1 | - |
| conservative48_gap25 | challenger-as-player | 994300 | white | 144 | 15 | P0/C9 | - |
| strict80_gap0 | challenger-as-cpu | 994300 | white_planner | 232 | 27 | P0/C1 | - |
| strict80_gap0 | challenger-as-player | 994300 | white | 144 | 15 | P0/C9 | - |
| low_focus_conservative | challenger-as-cpu | 994300 | white_planner | 233 | 26 | P0/C2 | - |
| low_focus_conservative | challenger-as-player | 994300 | white | 144 | 15 | P0/C9 | - |
| response2_conservative | challenger-as-cpu | 994300 | white_planner | 232 | 27 | P0/C1 | - |
| response2_conservative | challenger-as-player | 994300 | white | 144 | 15 | P0/C9 | - |

## Conclusion

- best candidate: low_focus_conservative (1-1-0, WPR 50%, avg HP margin -3.5)
- The best candidate reached parity in this sample. Increase games per direction before adopting it as default.

# White Planner PDCA Loop

生成: 2026-07-03T14:24:54.695Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994300-994300
directions: challenger-as-cpu, challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | strict80_gap0 | 0-0-2 | 50% | 0 | 120 | 11 | 186 | 1173.5 | 2 | 通常評価と同等以上の候補だけ planner 採用する安全寄り |
| 2 | current | 0-0-2 | 50% | 0 | 120 | 11 | 188.7 | 1186.5 | 2 | 現行 white_planner |

## Action Counts

- strict80_gap0: attack 35, end_turn 21, focus 18, magic 1, master:master_attack 7, master:shield 11, master:wake_up 4, move 5, summon 18
- current: attack 35, end_turn 21, focus 18, magic 1, master:master_attack 7, master:shield 11, master:wake_up 4, move 5, summon 18

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| current | challenger-as-cpu | 994300 | draw | 120 | 11 | P10/C10 | winner was not decided within 120 auto steps |
| current | challenger-as-player | 994300 | draw | 120 | 11 | P9/C9 | winner was not decided within 120 auto steps |
| strict80_gap0 | challenger-as-cpu | 994300 | draw | 120 | 11 | P10/C10 | winner was not decided within 120 auto steps |
| strict80_gap0 | challenger-as-player | 994300 | draw | 120 | 11 | P9/C9 | winner was not decided within 120 auto steps |

## Conclusion

- best candidate: strict80_gap0 (0-0-2, WPR 50%, avg HP margin 0)
- The best candidate reached parity in this sample. Increase games per direction before adopting it as default.

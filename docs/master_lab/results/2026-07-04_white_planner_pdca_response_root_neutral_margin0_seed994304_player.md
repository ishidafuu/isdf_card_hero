# White Planner PDCA Loop

生成: 2026-07-04T09:44:59.354Z
deck: `master-lab-white-1377-death-sheep3`
seeds: 994304-994304
directions: challenger-as-player

## Summary

| rank | candidate | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues | note |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | response_root_neutral_margin0 | 0-1-0 | 0% | -5 | 236 | 20 | 430.3 | 2426.5 | 0 | root補正なし。応答評価が同点以上なら採用する対象局面追試候補 |

## Action Counts

- response_root_neutral_margin0: attack 34, end_turn 20, focus 18, magic 1, master:master_attack 9, master:shield 9, master:wake_up 5, move 3, summon 18

## Games

| candidate | direction | seed | result | steps | turns | HP | issue |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| response_root_neutral_margin0 | challenger-as-player | 994304 | white | 236 | 20 | P0/C5 | - |

## Conclusion

- best candidate: response_root_neutral_margin0 (0-1-0, WPR 0%, avg HP margin -5)
- No candidate beat the current white baseline in this sample. Keep white_planner experimental and tighten adoption around clearly winning planner differences.

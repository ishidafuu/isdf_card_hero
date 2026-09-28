# Experimental master both-seat smoke

Generated: 2026-09-28T18:58:56.933Z
Seeds: 9300-9301; games=16; limits=400 steps/100 turns
Profile: overlay/white=white; white baseline=white; black opponent=strong
Decks: white=master-lab-white-1377-death-sheep3; black=black-pressure

## Summary

| matchup | games | completed | limited | failures | warnings | overlay-seat wins | player-seat wins / games | cpu-seat wins / games | chosen experimental actions | avg ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| white-baseline | 8 | 8 | 0 | 0 | 0 | 3 | 2/4 | 1/4 | 153 (decoy:provoke=4, decoy:scapegoat=81, timing:quick_call=45, timing:shift=23) | 57140 |
| black-pressure | 8 | 8 | 0 | 0 | 0 | 2 | 0/4 | 2/4 | 113 (decoy:provoke=4, decoy:scapegoat=79, timing:quick_call=22, timing:shift=8) | 11319 |

## Every game

| matchup | overlay | seat | seed | master P/CPU | profile P/CPU | deck P/CPU | result | status | steps / turns | partial LvUP | ms | chosen experimental actions; issues |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- |
| white-baseline | decoy | player | 9300 | white/white | white/white | master-lab-white-1377-death-sheep3/master-lab-white-1377-death-sheep3 | white/cpu | completed | 285/27 | 0 | 90777 | 28 (decoy:scapegoat=25, decoy:provoke=3); — |
| white-baseline | decoy | player | 9301 | white/white | white/white | master-lab-white-1377-death-sheep3/master-lab-white-1377-death-sheep3 | white/cpu | completed | 143/14 | 0 | 34149 | 19 (decoy:scapegoat=19); — |
| white-baseline | decoy | cpu | 9300 | white/white | white/white | master-lab-white-1377-death-sheep3/master-lab-white-1377-death-sheep3 | white/player | completed | 198/19 | 0 | 53850 | 21 (decoy:scapegoat=20, decoy:provoke=1); — |
| white-baseline | decoy | cpu | 9301 | white/white | white/white | master-lab-white-1377-death-sheep3/master-lab-white-1377-death-sheep3 | white/player | completed | 183/17 | 0 | 48291 | 17 (decoy:scapegoat=17); — |
| white-baseline | timing | player | 9300 | white/white | white/white | master-lab-white-1377-death-sheep3/master-lab-white-1377-death-sheep3 | white/player | completed | 216/26 | 0 | 47945 | 14 (timing:quick_call=9, timing:shift=5); — |
| white-baseline | timing | player | 9301 | white/white | white/white | master-lab-white-1377-death-sheep3/master-lab-white-1377-death-sheep3 | white/player | completed | 192/23 | 0 | 49029 | 11 (timing:quick_call=8, timing:shift=3); — |
| white-baseline | timing | cpu | 9300 | white/white | white/white | master-lab-white-1377-death-sheep3/master-lab-white-1377-death-sheep3 | white/cpu | completed | 300/30 | 0 | 78206 | 15 (timing:quick_call=13, timing:shift=2); — |
| white-baseline | timing | cpu | 9301 | white/white | white/white | master-lab-white-1377-death-sheep3/master-lab-white-1377-death-sheep3 | white/player | completed | 294/29 | 0 | 54874 | 28 (timing:quick_call=15, timing:shift=13); — |
| black-pressure | decoy | player | 9300 | white/black | white/strong | master-lab-white-1377-death-sheep3/black-pressure | strong/cpu | completed | 192/20 | 0 | 11789 | 24 (decoy:scapegoat=22, decoy:provoke=2); — |
| black-pressure | decoy | player | 9301 | white/black | white/strong | master-lab-white-1377-death-sheep3/black-pressure | strong/cpu | completed | 153/16 | 0 | 16898 | 20 (decoy:scapegoat=20); — |
| black-pressure | decoy | cpu | 9300 | black/white | strong/white | black-pressure/master-lab-white-1377-death-sheep3 | strong/player | completed | 198/21 | 0 | 13332 | 24 (decoy:scapegoat=22, decoy:provoke=2); — |
| black-pressure | decoy | cpu | 9301 | black/white | strong/white | black-pressure/master-lab-white-1377-death-sheep3 | white/cpu | completed | 174/19 | 0 | 13264 | 15 (decoy:scapegoat=15); — |
| black-pressure | timing | player | 9300 | white/black | white/strong | master-lab-white-1377-death-sheep3/black-pressure | strong/cpu | completed | 197/21 | 0 | 11256 | 15 (timing:quick_call=10, timing:shift=5); — |
| black-pressure | timing | player | 9301 | white/black | white/strong | master-lab-white-1377-death-sheep3/black-pressure | strong/cpu | completed | 117/11 | 0 | 8786 | 8 (timing:quick_call=5, timing:shift=3); — |
| black-pressure | timing | cpu | 9300 | black/white | strong/white | black-pressure/master-lab-white-1377-death-sheep3 | strong/player | completed | 125/11 | 0 | 8574 | 5 (timing:quick_call=5); — |
| black-pressure | timing | cpu | 9301 | black/white | strong/white | black-pressure/master-lab-white-1377-death-sheep3 | white/cpu | completed | 102/10 | 0 | 6651 | 2 (timing:quick_call=2); — |

## Limitations

- 16局の機能スモークであり、勝敗や勝率は実験能力の強さ/バランスを証明しない。
- 各seedで席を反転しているが、乱数系列・deck draw順・agentの探索は完全対称ではない。
- warningは対局内の両AI診断合計。候補overlay固有の誤判断件数ではない。elapsedMsはマシン負荷依存。
- experimentalActionCountsはjournal対象対局内の両seatが実際に選んだ能力の合計。Exchangeで相手seatが借用能力を使う場合も含み、候補seatだけの使用回数ではない。
- overlayはversioned experimental contextを用い、標準MasterId white/blackは維持。未定義sacrificeは含めない。

Rerun: `npx vite-node scripts/experimental-master-seat-smoke.ts`

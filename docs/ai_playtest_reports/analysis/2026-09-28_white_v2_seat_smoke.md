# WhiteV2 両先攻ベンチ

生成: 2026-09-28T14:19:05.643Z
seed: 400-401; games=8
candidate: white_v2; white baseline: white; black: strong
deck: white=master-lab-white-1377-death-sheep3; black=black-pressure
limit: 500 steps / 120 turns

## Matchup summary

| matchup | games | candidate wins | opponent wins | unfinished | failures | warnings | avg ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| white-baseline | 4 | 3 | 1 | 0 | 0 | 14 | 114505 |
| black-pressure | 4 | 2 | 2 | 0 | 0 | 10 | 49892 |

## Every game

| matchup | seed | candidate seat | P / CPU profile | P / CPU deck | result | steps / turns | partial LvUP steps | ms | issues |
| --- | ---: | --- | --- | --- | --- | ---: | ---: | ---: | --- |
| white-baseline | 400 | cpu | white / white_v2 | master-lab-white-1377-death-sheep3 / master-lab-white-1377-death-sheep3 | white_v2/cpu (completed) | 222 / 24 | 0 | 159939 | warning:suspicious_decision@24 ended turn despite strong candidate: attack:cpu_front_right:self_bomb->monster:player_front_right; warning:suspicious_decision@33 ended turn despite strong candidate: attack:cpu_back_left:スパイクボール->monster:player_front_right; warning:suspicious_decision@42 ended turn despite strong candidate: attack:cpu_front_left:attack->monster:player_front_left; warning:suspicious_decision@50 ended turn despite strong candidate: attack:cpu_back_left:スパイクボール->monster:player_front_left; warning:suspicious_decision@55 ended turn despite strong candidate: attack:cpu_back_left:スパイクボール->monster:player_front_left; warning:suspicious_decision@76 ended turn despite strong candidate: attack:cpu_front_right:wild_claw->monster:player_back_right; warning:suspicious_decision@88 ended turn despite strong candidate: attack:cpu_front_left:attack->monster:player_front_left; warning:suspicious_decision@96 ended turn despite strong candidate: attack:cpu_front_right:self_bomb->monster:player_front_right; warning:suspicious_decision@101 ended turn despite strong candidate: attack:cpu_back_right:wild_claw->monster:player_front_left; warning:suspicious_decision@106 ended turn despite strong candidate: attack:cpu_back_left:スパイクボール->monster:player_front_left |
| white-baseline | 401 | cpu | white / white_v2 | master-lab-white-1377-death-sheep3 / master-lab-white-1377-death-sheep3 | white/player (completed) | 219 / 26 | 0 | 141648 | warning:suspicious_decision@161 ended turn despite strong candidate: attack:cpu_front_left:attack->monster:player_front_left |
| white-baseline | 400 | player | white_v2 / white | master-lab-white-1377-death-sheep3 / master-lab-white-1377-death-sheep3 | white_v2/player (completed) | 159 / 15 | 0 | 89527 | warning:suspicious_decision@85 ended turn despite strong candidate: attack:player_front_right:attack->monster:cpu_front_right; warning:suspicious_decision@93 ended turn despite strong candidate: attack:player_front_right:attack->monster:cpu_front_right; warning:suspicious_decision@105 ended turn despite strong candidate: attack:player_front_left:スパイクボール->monster:cpu_back_right |
| white-baseline | 401 | player | white_v2 / white | master-lab-white-1377-death-sheep3 / master-lab-white-1377-death-sheep3 | white_v2/player (completed) | 101 / 10 | 0 | 66906 | — |
| black-pressure | 400 | cpu | strong / white_v2 | black-pressure / master-lab-white-1377-death-sheep3 | strong/player (completed) | 115 / 14 | 0 | 50225 | warning:suspicious_decision@28 ended turn despite strong candidate: attack:cpu_front_right:storm_bomb->monster:player_back_right; warning:suspicious_decision@48 ended turn despite strong candidate: attack:cpu_front_left:storm_bomb->monster:player_back_right; warning:suspicious_decision@58 ended turn despite strong candidate: attack:cpu_front_left:self_bomb->monster:player_front_left; warning:suspicious_decision@69 ended turn despite strong candidate: attack:cpu_front_left:storm_bomb->monster:player_back_left; warning:suspicious_decision@78 ended turn despite strong candidate: attack:cpu_front_left:storm_bomb->monster:player_back_left |
| black-pressure | 401 | cpu | strong / white_v2 | black-pressure / master-lab-white-1377-death-sheep3 | white_v2/cpu (completed) | 139 / 13 | 0 | 62679 | warning:suspicious_decision@51 ended turn despite strong candidate: attack:cpu_front_right:storm_bomb->monster:player_back_left; warning:suspicious_decision@73 ended turn despite strong candidate: attack:cpu_back_right:スパイクボール->monster:player_front_right |
| black-pressure | 400 | player | white_v2 / strong | master-lab-white-1377-death-sheep3 / black-pressure | white_v2/player (completed) | 100 / 11 | 0 | 45986 | — |
| black-pressure | 401 | player | white_v2 / strong | master-lab-white-1377-death-sheep3 / black-pressure | strong/cpu (completed) | 94 / 11 | 0 | 40678 | warning:suspicious_decision@29 ended turn despite strong candidate: master:wake_up->monster:cpu_back_left; warning:suspicious_decision@50 ended turn despite strong candidate: attack:player_front_right:attack->master:cpu; warning:suspicious_decision@91 ended turn despite strong candidate: master:master_attack->monster:cpu_front_left |

## Limitations

- 同seed・両席を対にした機能/回帰スモークであり、少数試合は強さの証明ではない。
- 40試合でも採用判断は行わず、勝ち筋/警告/所要時間の追加調査に限定する。
- 時間値は環境依存の観測値で、seed再現性や勝敗の比較指標にしない。
- whiteLowStoneFocusMissedAttackPenalty=8は候補defaultへ追加していない。

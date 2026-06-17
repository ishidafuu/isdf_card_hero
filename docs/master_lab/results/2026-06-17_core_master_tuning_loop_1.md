# Core Master Tuning Loop

生成: 2026-06-17T13:37:18.217Z
候補: 9
試行: 2 games/pairing
総試合: 108

## Conclusion

白本命: white_pressure_strong / 黒本命: black_1408_pressure / デコイ本命: decoy_back_stable. 初回マトリクスでは進行上の重大issueは出ていない。 白に勝ちすぎる候補があるため、採用判断では総合勝率より白基準への近さを優先する。

### Next Steps

- 白に勝ちすぎている候補（black_1408_pressure）は本命から外し、白基準に近い構成へ戻す。
- デコイのvs Blackが45%未満なら、デッキより挑発タイミングと守る対象の評価を優先して調整する。
- 次ループは各マスター上位1-2案に絞り、games-per-pairingを10へ増やして再現性を見る。
- デッキ調整はロストーンなしを前提に、白は基準化、黒は速攻精度、デコイは黒相手の負け方分類を優先する。

## Master Summary

| Master | Variants | Best | Score | Win% | Games |
| --- | ---: | --- | ---: | ---: | ---: |
| white | 3 | white_pressure_strong | 40 | 38.9% | 72 |
| black | 3 | black_1408_pressure | 66.7 | 81.9% | 72 |
| decoy | 3 | decoy_back_stable | 32 | 29.2% | 72 |

## Standings

| Rank | Master | Variant | Deck | AI | Score | W-L-D | Win% | vs White | vs Black | vs Decoy | Avg Turns | Issues | Lab Usage | Notes |
| ---: | --- | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | white | white_pressure_strong<br>白: 通常プレッシャー / strong | pressure-normal<br>通常プレッシャー | strong | 40 | 12-12-0 | 50% | - | 33.3%<br>4-8-0 | 66.7%<br>8-4-0 | 13.6 | 0F/0W | - | - |
| 2 | white | white_494_strong<br>白: 投稿494 / strong | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | strong | 34 | 10-14-0 | 41.7% | - | 25%<br>3-9-0 | 58.3%<br>7-5-0 | 14.3 | 0F/0W | - | - |
| 3 | white | white_balanced_defensive<br>白: 通常バランス / defensive | balanced-normal<br>通常バランス | defensive | 20 | 6-18-0 | 25% | - | 0%<br>0-12-0 | 50%<br>6-6-0 | 14.1 | 0F/0W | - | - |
| 4 | black | black_1408_pressure<br>黒: 投稿1408 / pressure | submission-pro-no-rare8-black-1408<br>投稿Pro黒8なし #1408 Proブラックガチ構想 | pressure | 66.7 | 21-3-0 | 87.5% | 83.3%<br>10-2-0 | - | 91.7%<br>11-1-0 | 12 | 0F/0W | - | 白に勝ちすぎ |
| 5 | black | black_pressure_strong<br>黒: ブラック検証 / strong | black-pressure<br>ブラック検証 | strong | 61.2 | 20-4-0 | 83.3% | 91.7%<br>11-1-0 | - | 75%<br>9-3-0 | 13.7 | 0F/0W | - | 白に勝ちすぎ |
| 6 | black | black_pressure_pressure<br>黒: ブラック検証 / pressure | black-pressure<br>ブラック検証 | pressure | 59.7 | 18-6-0 | 75% | 66.7%<br>8-4-0 | - | 83.3%<br>10-2-0 | 11.9 | 0F/0W | - | 白に勝ちすぎ |
| 7 | decoy | decoy_back_stable<br>デコイ: 後衛安定 / enemy+16 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | strong | 32 | 9-15-0 | 37.5% | 50%<br>6-6-0 | 25%<br>3-9-0 | - | 16.8 | 0F/0W | scapegoat 372<br>provoke 3<br>master_attack 1 | 黒対策不足 |
| 8 | decoy | decoy_black_pressure_trim<br>デコイ: black-pressure / 挑発厚め | black-pressure<br>ブラック検証 | strong | 26 | 7-17-0 | 29.2% | 41.7%<br>5-7-0 | 16.7%<br>2-10-0 | - | 14.8 | 0F/0W | scapegoat 221<br>provoke 93 | 黒対策不足 |
| 9 | decoy | decoy_back_pressure<br>デコイ: 後衛圧力 / provoke+16 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | strong | 20 | 5-19-0 | 20.8% | 33.3%<br>4-8-0 | 8.3%<br>1-11-0 | - | 15.2 | 0F/0W | scapegoat 236<br>provoke 96 | 黒対策不足 |

## Runs

| Run | Player | CPU | Result | Issues |
| --- | --- | --- | --- | --- |
| white_pressure_strong_vs_black_pressure_pressure | white_pressure_strong<br>pressure-normal | black_pressure_pressure<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_pressure_strong | black_pressure_pressure<br>black-pressure | white_pressure_strong<br>pressure-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_pressure_strong_vs_black_pressure_strong | white_pressure_strong<br>pressure-normal | black_pressure_strong<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_strong_vs_white_pressure_strong | black_pressure_strong<br>black-pressure | white_pressure_strong<br>pressure-normal | P 2 / C 0 / D 0 | 0F/0W |
| white_pressure_strong_vs_black_1408_pressure | white_pressure_strong<br>pressure-normal | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_white_pressure_strong | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | white_pressure_strong<br>pressure-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_pressure_strong_vs_decoy_back_stable | white_pressure_strong<br>pressure-normal | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_pressure_strong | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_pressure_strong<br>pressure-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_pressure_strong_vs_decoy_back_pressure | white_pressure_strong<br>pressure-normal | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_pressure_vs_white_pressure_strong | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | white_pressure_strong<br>pressure-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_pressure_strong_vs_decoy_black_pressure_trim | white_pressure_strong<br>pressure-normal | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_white_pressure_strong | decoy_black_pressure_trim<br>black-pressure | white_pressure_strong<br>pressure-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_balanced_defensive_vs_black_pressure_pressure | white_balanced_defensive<br>balanced-normal | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_balanced_defensive | black_pressure_pressure<br>black-pressure | white_balanced_defensive<br>balanced-normal | P 2 / C 0 / D 0 | 0F/0W |
| white_balanced_defensive_vs_black_pressure_strong | white_balanced_defensive<br>balanced-normal | black_pressure_strong<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_strong_vs_white_balanced_defensive | black_pressure_strong<br>black-pressure | white_balanced_defensive<br>balanced-normal | P 2 / C 0 / D 0 | 0F/0W |
| white_balanced_defensive_vs_black_1408_pressure | white_balanced_defensive<br>balanced-normal | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_white_balanced_defensive | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | white_balanced_defensive<br>balanced-normal | P 2 / C 0 / D 0 | 0F/0W |
| white_balanced_defensive_vs_decoy_back_stable | white_balanced_defensive<br>balanced-normal | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 0 / C 2 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_balanced_defensive | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_balanced_defensive<br>balanced-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_balanced_defensive_vs_decoy_back_pressure | white_balanced_defensive<br>balanced-normal | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_pressure_vs_white_balanced_defensive | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | white_balanced_defensive<br>balanced-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_balanced_defensive_vs_decoy_black_pressure_trim | white_balanced_defensive<br>balanced-normal | decoy_black_pressure_trim<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_white_balanced_defensive | decoy_black_pressure_trim<br>black-pressure | white_balanced_defensive<br>balanced-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_494_strong_vs_black_pressure_pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | black_pressure_pressure<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_494_strong | black_pressure_pressure<br>black-pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| white_494_strong_vs_black_pressure_strong | white_494_strong<br>submission-pro-no-rare8-white-494 | black_pressure_strong<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_strong_vs_white_494_strong | black_pressure_strong<br>black-pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | P 2 / C 0 / D 0 | 0F/0W |
| white_494_strong_vs_black_1408_pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_white_494_strong | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | white_494_strong<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| white_494_strong_vs_decoy_back_stable | white_494_strong<br>submission-pro-no-rare8-white-494 | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_494_strong | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_494_strong<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| white_494_strong_vs_decoy_back_pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 0 / C 2 / D 0 | 0F/0W |
| decoy_back_pressure_vs_white_494_strong | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | P 0 / C 2 / D 0 | 0F/0W |
| white_494_strong_vs_decoy_black_pressure_trim | white_494_strong<br>submission-pro-no-rare8-white-494 | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_white_494_strong | decoy_black_pressure_trim<br>black-pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_decoy_back_stable | black_pressure_pressure<br>black-pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_stable_vs_black_pressure_pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | black_pressure_pressure<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_pressure_vs_decoy_back_pressure | black_pressure_pressure<br>black-pressure | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_pressure_vs_black_pressure_pressure | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_decoy_black_pressure_trim | black_pressure_pressure<br>black-pressure | decoy_black_pressure_trim<br>black-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_black_pressure_pressure | decoy_black_pressure_trim<br>black-pressure | black_pressure_pressure<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_strong_vs_decoy_back_stable | black_pressure_strong<br>black-pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_stable_vs_black_pressure_strong | decoy_back_stable<br>master-lab-decoy-unit-back-stable | black_pressure_strong<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_strong_vs_decoy_back_pressure | black_pressure_strong<br>black-pressure | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_pressure_vs_black_pressure_strong | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | black_pressure_strong<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_strong_vs_decoy_black_pressure_trim | black_pressure_strong<br>black-pressure | decoy_black_pressure_trim<br>black-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_black_pressure_strong | decoy_black_pressure_trim<br>black-pressure | black_pressure_strong<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_decoy_back_stable | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_stable_vs_black_1408_pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_decoy_back_pressure | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_pressure_vs_black_1408_pressure | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_decoy_black_pressure_trim | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_black_1408_pressure | decoy_black_pressure_trim<br>black-pressure | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |

## Reading

- `Win%` は引き分けを0.5勝として扱う勝ち点率。
- `vs White/Black/Decoy` は相手マスター別の勝ち点率。同一マスター同士は初回ループでは省略。
- `Lab Usage` はデコイ特技のみ。白黒は通常AIのマスター特技をそのまま使う。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。

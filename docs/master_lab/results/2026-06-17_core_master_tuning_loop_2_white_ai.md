# Core Master Tuning Loop

生成: 2026-06-17T14:59:49.782Z
候補: 11
試行: 2 games/pairing
総試合: 156

## Conclusion

白本命: white_pressure_white / 黒本命: black_1408_pressure / デコイ本命: decoy_back_stable. 初回マトリクスでは進行上の重大issueは出ていない。 白に勝ちすぎる候補があるため、採用判断では総合勝率より白基準への近さを優先する。

### Next Steps

- 白に勝ちすぎている候補（black_1408_pressure）は本命から外し、白基準に近い構成へ戻す。
- 白AIは `white_pressure_white` を中母数で確認する。strong比の総合差分は +8.3%、vs Black は 33.3%。
- 白のvs Blackが45%未満なら、次は重み追加ではなく、敗戦ログからシールド後の反撃不足とウェイクアップ後の攻撃継続を分類する。
- デコイのvs Blackが45%未満なら、デッキより挑発タイミングと守る対象の評価を優先して調整する。
- 次ループは各マスター上位1-2案に絞り、games-per-pairingを10へ増やして再現性を見る。
- デッキ調整はロストーンなしを前提に、白は基準化、黒は速攻精度、デコイは黒相手の負け方分類を優先する。

## Master Summary

| Master | Variants | Best | Score | Win% | Games |
| --- | ---: | --- | ---: | ---: | ---: |
| white | 5 | white_pressure_white | 44 | 39.2% | 120 |
| black | 3 | black_1408_pressure | 65.5 | 76% | 96 |
| decoy | 3 | decoy_back_stable | 42 | 37.5% | 96 |

## Standings

| Rank | Master | Variant | Deck | AI | Score | W-L-D | Win% | vs White | vs Black | vs Decoy | Avg Turns | Issues | Master Usage | Lab Usage | Notes |
| ---: | --- | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | white | white_pressure_white<br>白: 通常プレッシャー / white | pressure-normal<br>通常プレッシャー | white | 44 | 14-10-0 | 58.3% | - | 33.3%<br>4-8-0 | 83.3%<br>10-2-0 | 13.1 | 0F/0W | shield 95<br>wake_up 81<br>master_attack 71 | - | - |
| 2 | white | white_pressure_strong<br>白: 通常プレッシャー / strong | pressure-normal<br>通常プレッシャー | strong | 40 | 12-12-0 | 50% | - | 33.3%<br>4-8-0 | 66.7%<br>8-4-0 | 13.2 | 0F/0W | wake_up 73<br>shield 72<br>master_attack 57 | - | - |
| 3 | white | white_494_white<br>白: 投稿494 / white | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | white | 32 | 9-15-0 | 37.5% | - | 25%<br>3-9-0 | 50%<br>6-6-0 | 13.1 | 0F/0W | shield 139<br>master_attack 83<br>wake_up 74 | - | - |
| 4 | white | white_balanced_defensive<br>白: 通常バランス / defensive | balanced-normal<br>通常バランス | defensive | 32 | 9-15-0 | 37.5% | - | 25%<br>3-9-0 | 50%<br>6-6-0 | 14.6 | 0F/0W | shield 135<br>wake_up 87<br>master_attack 54 | - | - |
| 5 | white | white_494_strong<br>白: 投稿494 / strong | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | strong | 14 | 3-21-0 | 12.5% | - | 0%<br>0-12-0 | 25%<br>3-9-0 | 12.8 | 0F/0W | shield 155<br>master_attack 80<br>wake_up 64 | - | - |
| 6 | black | black_1408_pressure<br>黒: 投稿1408 / pressure | submission-pro-no-rare8-black-1408<br>投稿Pro黒8なし #1408 Proブラックガチ構想 | pressure | 65.5 | 28-4-0 | 87.5% | 90%<br>18-2-0 | - | 83.3%<br>10-2-0 | 12 | 0F/0W | berserk_power 305<br>master_attack 47<br>earth_anger 13 | - | 白に勝ちすぎ |
| 7 | black | black_pressure_pressure<br>黒: ブラック検証 / pressure | black-pressure<br>ブラック検証 | pressure | 60.8 | 25-7-0 | 78.1% | 80%<br>16-4-0 | - | 75%<br>9-3-0 | 10.6 | 0F/0W | berserk_power 264<br>master_attack 33<br>earth_anger 6 | - | 白に勝ちすぎ |
| 8 | black | black_pressure_strong<br>黒: ブラック検証 / strong | black-pressure<br>ブラック検証 | strong | 52.4 | 20-12-0 | 62.5% | 60%<br>12-8-0 | - | 66.7%<br>8-4-0 | 11.9 | 0F/0W | berserk_power 262<br>master_attack 42<br>earth_anger 19 | - | - |
| 9 | decoy | decoy_back_stable<br>デコイ: 後衛安定 / enemy+16 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | strong | 42 | 16-16-0 | 50% | 55%<br>11-9-0 | 41.7%<br>5-7-0 | - | 17.7 | 0F/0W | master_attack 123 | scapegoat 524<br>provoke 6 | 黒対策不足 |
| 10 | decoy | decoy_back_pressure<br>デコイ: 後衛圧力 / provoke+16 | master-lab-decoy-unit-back-pressure<br>デコイ実験: 後衛圧力 | strong | 30 | 12-20-0 | 37.5% | 50%<br>10-10-0 | 16.7%<br>2-10-0 | - | 14.6 | 0F/0W | master_attack 112 | scapegoat 308<br>provoke 95<br>master_attack 1 | 黒対策不足 |
| 11 | decoy | decoy_black_pressure_trim<br>デコイ: black-pressure / 挑発厚め | black-pressure<br>ブラック検証 | strong | 24 | 8-24-0 | 25% | 30%<br>6-14-0 | 16.7%<br>2-10-0 | - | 15.5 | 0F/0W | master_attack 110 | scapegoat 264<br>provoke 147 | 黒対策不足 |

## Runs

| Run | Player | CPU | Result | Issues |
| --- | --- | --- | --- | --- |
| white_pressure_strong_vs_black_pressure_pressure | white_pressure_strong<br>pressure-normal | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_pressure_strong | black_pressure_pressure<br>black-pressure | white_pressure_strong<br>pressure-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_pressure_strong_vs_black_pressure_strong | white_pressure_strong<br>pressure-normal | black_pressure_strong<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_strong_vs_white_pressure_strong | black_pressure_strong<br>black-pressure | white_pressure_strong<br>pressure-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_pressure_strong_vs_black_1408_pressure | white_pressure_strong<br>pressure-normal | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_white_pressure_strong | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | white_pressure_strong<br>pressure-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_pressure_strong_vs_decoy_back_stable | white_pressure_strong<br>pressure-normal | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_pressure_strong | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_pressure_strong<br>pressure-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_pressure_strong_vs_decoy_back_pressure | white_pressure_strong<br>pressure-normal | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_pressure_vs_white_pressure_strong | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | white_pressure_strong<br>pressure-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_pressure_strong_vs_decoy_black_pressure_trim | white_pressure_strong<br>pressure-normal | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_white_pressure_strong | decoy_black_pressure_trim<br>black-pressure | white_pressure_strong<br>pressure-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_pressure_white_vs_black_pressure_pressure | white_pressure_white<br>pressure-normal | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_pressure_white | black_pressure_pressure<br>black-pressure | white_pressure_white<br>pressure-normal | P 2 / C 0 / D 0 | 0F/0W |
| white_pressure_white_vs_black_pressure_strong | white_pressure_white<br>pressure-normal | black_pressure_strong<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_strong_vs_white_pressure_white | black_pressure_strong<br>black-pressure | white_pressure_white<br>pressure-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_pressure_white_vs_black_1408_pressure | white_pressure_white<br>pressure-normal | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_white_pressure_white | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | white_pressure_white<br>pressure-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_pressure_white_vs_decoy_back_stable | white_pressure_white<br>pressure-normal | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_pressure_white | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_pressure_white<br>pressure-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_pressure_white_vs_decoy_back_pressure | white_pressure_white<br>pressure-normal | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_pressure_vs_white_pressure_white | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | white_pressure_white<br>pressure-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_pressure_white_vs_decoy_black_pressure_trim | white_pressure_white<br>pressure-normal | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_white_pressure_white | decoy_black_pressure_trim<br>black-pressure | white_pressure_white<br>pressure-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_balanced_defensive_vs_black_pressure_pressure | white_balanced_defensive<br>balanced-normal | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_balanced_defensive | black_pressure_pressure<br>black-pressure | white_balanced_defensive<br>balanced-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_balanced_defensive_vs_black_pressure_strong | white_balanced_defensive<br>balanced-normal | black_pressure_strong<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_strong_vs_white_balanced_defensive | black_pressure_strong<br>black-pressure | white_balanced_defensive<br>balanced-normal | P 1 / C 1 / D 0 | 0F/0W |
| white_balanced_defensive_vs_black_1408_pressure | white_balanced_defensive<br>balanced-normal | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_white_balanced_defensive | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | white_balanced_defensive<br>balanced-normal | P 2 / C 0 / D 0 | 0F/0W |
| white_balanced_defensive_vs_decoy_back_stable | white_balanced_defensive<br>balanced-normal | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 0 / C 2 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_balanced_defensive | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_balanced_defensive<br>balanced-normal | P 2 / C 0 / D 0 | 0F/0W |
| white_balanced_defensive_vs_decoy_back_pressure | white_balanced_defensive<br>balanced-normal | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_pressure_vs_white_balanced_defensive | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | white_balanced_defensive<br>balanced-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_balanced_defensive_vs_decoy_black_pressure_trim | white_balanced_defensive<br>balanced-normal | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_white_balanced_defensive | decoy_black_pressure_trim<br>black-pressure | white_balanced_defensive<br>balanced-normal | P 0 / C 2 / D 0 | 0F/0W |
| white_494_strong_vs_black_pressure_pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_494_strong | black_pressure_pressure<br>black-pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | P 2 / C 0 / D 0 | 0F/0W |
| white_494_strong_vs_black_pressure_strong | white_494_strong<br>submission-pro-no-rare8-white-494 | black_pressure_strong<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_strong_vs_white_494_strong | black_pressure_strong<br>black-pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | P 2 / C 0 / D 0 | 0F/0W |
| white_494_strong_vs_black_1408_pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_white_494_strong | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | white_494_strong<br>submission-pro-no-rare8-white-494 | P 2 / C 0 / D 0 | 0F/0W |
| white_494_strong_vs_decoy_back_stable | white_494_strong<br>submission-pro-no-rare8-white-494 | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 0 / C 2 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_494_strong | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_494_strong<br>submission-pro-no-rare8-white-494 | P 2 / C 0 / D 0 | 0F/0W |
| white_494_strong_vs_decoy_back_pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 0 / C 2 / D 0 | 0F/0W |
| decoy_back_pressure_vs_white_494_strong | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | P 2 / C 0 / D 0 | 0F/0W |
| white_494_strong_vs_decoy_black_pressure_trim | white_494_strong<br>submission-pro-no-rare8-white-494 | decoy_black_pressure_trim<br>black-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_white_494_strong | decoy_black_pressure_trim<br>black-pressure | white_494_strong<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| white_494_white_vs_black_pressure_pressure | white_494_white<br>submission-pro-no-rare8-white-494 | black_pressure_pressure<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_494_white | black_pressure_pressure<br>black-pressure | white_494_white<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| white_494_white_vs_black_pressure_strong | white_494_white<br>submission-pro-no-rare8-white-494 | black_pressure_strong<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_strong_vs_white_494_white | black_pressure_strong<br>black-pressure | white_494_white<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| white_494_white_vs_black_1408_pressure | white_494_white<br>submission-pro-no-rare8-white-494 | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_white_494_white | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | white_494_white<br>submission-pro-no-rare8-white-494 | P 2 / C 0 / D 0 | 0F/0W |
| white_494_white_vs_decoy_back_stable | white_494_white<br>submission-pro-no-rare8-white-494 | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_494_white | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_494_white<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| white_494_white_vs_decoy_back_pressure | white_494_white<br>submission-pro-no-rare8-white-494 | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 0 / C 2 / D 0 | 0F/0W |
| decoy_back_pressure_vs_white_494_white | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | white_494_white<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| white_494_white_vs_decoy_black_pressure_trim | white_494_white<br>submission-pro-no-rare8-white-494 | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_white_494_white | decoy_black_pressure_trim<br>black-pressure | white_494_white<br>submission-pro-no-rare8-white-494 | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_pressure_vs_decoy_back_stable | black_pressure_pressure<br>black-pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_stable_vs_black_pressure_pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_decoy_back_pressure | black_pressure_pressure<br>black-pressure | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_back_pressure_vs_black_pressure_pressure | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_pressure_vs_decoy_black_pressure_trim | black_pressure_pressure<br>black-pressure | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_black_pressure_pressure | decoy_black_pressure_trim<br>black-pressure | black_pressure_pressure<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_strong_vs_decoy_back_stable | black_pressure_strong<br>black-pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 0 / C 2 / D 0 | 0F/0W |
| decoy_back_stable_vs_black_pressure_strong | decoy_back_stable<br>master-lab-decoy-unit-back-stable | black_pressure_strong<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| black_pressure_strong_vs_decoy_back_pressure | black_pressure_strong<br>black-pressure | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_pressure_vs_black_pressure_strong | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | black_pressure_strong<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_pressure_strong_vs_decoy_black_pressure_trim | black_pressure_strong<br>black-pressure | decoy_black_pressure_trim<br>black-pressure | P 1 / C 1 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_black_pressure_strong | decoy_black_pressure_trim<br>black-pressure | black_pressure_strong<br>black-pressure | P 0 / C 2 / D 0 | 0F/0W |
| black_1408_pressure_vs_decoy_back_stable | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_stable_vs_black_1408_pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 1 / C 1 / D 0 | 0F/0W |
| black_1408_pressure_vs_decoy_back_pressure | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_back_pressure_vs_black_1408_pressure | decoy_back_pressure<br>master-lab-decoy-unit-back-pressure | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 1 / C 1 / D 0 | 0F/0W |
| black_1408_pressure_vs_decoy_black_pressure_trim | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | decoy_black_pressure_trim<br>black-pressure | P 2 / C 0 / D 0 | 0F/0W |
| decoy_black_pressure_trim_vs_black_1408_pressure | decoy_black_pressure_trim<br>black-pressure | black_1408_pressure<br>submission-pro-no-rare8-black-1408 | P 0 / C 2 / D 0 | 0F/0W |

## Reading

- `Win%` は引き分けを0.5勝として扱う勝ち点率。
- `vs White/Black/Decoy` は相手マスター別の勝ち点率。同一マスター同士は初回ループでは省略。
- `Master Usage` は通常マスター特技。白AIの `shield` / `wake_up`、黒AIの `berserk_power` などを見る。
- `Lab Usage` はデコイ特技のみ。白黒は通常AIのマスター特技をそのまま使う。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。

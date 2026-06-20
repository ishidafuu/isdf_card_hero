# Core Master Tuning Loop

生成: 2026-06-20T15:18:13.274Z
候補: 3
試行: 6 games/pairing
総試合: 36

## Conclusion

白本命: white_494_white / 黒本命: black_pressure_pressure / デコイ本命: decoy_back_stable. issuesは合計2件。安全性確認を先に挟む。 白に勝ちすぎる候補があるため、採用判断では総合勝率より白基準への近さを優先する。

### Next Steps

- warning/failureが出たseedを先に確認し、長期戦か進行問題かを切り分ける。
- 白に勝ちすぎている候補（black_pressure_pressure, decoy_back_stable）は本命から外し、白基準に近い構成へ戻す。
- 白AIは `white_494_white` を中母数で確認する。strong比の総合差分は +0%、vs Black は 16.7%。
- 白のvs Blackが45%未満なら、次は重み追加ではなく、敗戦ログからシールド後の反撃不足とウェイクアップ後の攻撃継続を分類する。
- デコイのvs Blackが45%未満なら、デッキより挑発タイミングと守る対象の評価を優先して調整する。
- 次ループは各マスター上位1-2案に絞り、games-per-pairingを10へ増やして再現性を見る。
- デッキ調整はロストーンなしを前提に、白は基準化、黒は速攻精度、デコイは黒相手の負け方分類を優先する。

## Master Summary

| Master | Variants | Best | Score | Win% | Games |
| --- | ---: | --- | ---: | ---: | ---: |
| white | 1 | white_494_white | 16 | 20.8% | 24 |
| black | 1 | black_pressure_pressure | 56.7 | 75% | 24 |
| decoy | 1 | decoy_back_stable | 34.2 | 54.2% | 24 |

## Standings

| Rank | Master | Variant | Deck | AI | Score | W-L-D | Win% | vs White | vs Black | vs Decoy | Avg Turns | Issues | Master Usage | Lab Usage | Notes |
| ---: | --- | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | white | white_494_white<br>白: 投稿494 / white | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | white | 16 | 5-19-0 | 20.8% | - | 16.7%<br>2-10-0 | 25%<br>3-9-0 | 15.5 | 0F/1W | shield 211<br>wake_up 89<br>master_attack 86 | - | warning 1 |
| 2 | black | black_pressure_pressure<br>黒: ブラック検証 / pressure | black-pressure<br>ブラック検証 | pressure | 56.7 | 18-6-0 | 75% | 83.3%<br>10-2-0 | - | 66.7%<br>8-4-0 | 14.8 | 0F/0W | berserk_power 251<br>master_attack 48<br>earth_anger 7 | - | 白に勝ちすぎ |
| 3 | decoy | decoy_back_stable<br>デコイ: 後衛安定 / enemy+16 | master-lab-decoy-unit-back-stable<br>デコイ実験: 後衛安定 | strong | 34.2 | 13-11-0 | 54.2% | 75%<br>9-3-0 | 33.3%<br>4-8-0 | - | 20.4 | 0F/1W | master_attack 109 | scapegoat 417<br>provoke 5 | warning 1<br>白に勝ちすぎ<br>黒対策不足 |

## Runs

| Run | Player | CPU | Result | Issues |
| --- | --- | --- | --- | --- |
| white_494_white_vs_black_pressure_pressure | white_494_white<br>submission-pro-no-rare8-white-494 | black_pressure_pressure<br>black-pressure | P 2 / C 4 / D 0 | 0F/0W |
| black_pressure_pressure_vs_white_494_white | black_pressure_pressure<br>black-pressure | white_494_white<br>submission-pro-no-rare8-white-494 | P 6 / C 0 / D 0 | 0F/0W |
| white_494_white_vs_decoy_back_stable | white_494_white<br>submission-pro-no-rare8-white-494 | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 1 / C 5 / D 0 | 0F/0W |
| decoy_back_stable_vs_white_494_white | decoy_back_stable<br>master-lab-decoy-unit-back-stable | white_494_white<br>submission-pro-no-rare8-white-494 | P 4 / C 2 / D 0 | 0F/1W |
| black_pressure_pressure_vs_decoy_back_stable | black_pressure_pressure<br>black-pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | P 2 / C 4 / D 0 | 0F/0W |
| decoy_back_stable_vs_black_pressure_pressure | decoy_back_stable<br>master-lab-decoy-unit-back-stable | black_pressure_pressure<br>black-pressure | P 0 / C 6 / D 0 | 0F/0W |

## Reading

- `Win%` は引き分けを0.5勝として扱う勝ち点率。
- `vs White/Black/Decoy` は相手マスター別の勝ち点率。同一マスター同士は初回ループでは省略。
- `Master Usage` は通常マスター特技。白AIの `shield` / `wake_up`、黒AIの `berserk_power` などを見る。
- `Lab Usage` はデコイ特技のみ。白黒は通常AIのマスター特技をそのまま使う。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。

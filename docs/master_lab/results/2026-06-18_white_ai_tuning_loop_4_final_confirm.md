# White AI Tuning Loop

生成: 2026-06-17T16:07:25.841Z
候補: 4
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 10 games/matchup/direction
総試合: 320

## Conclusion

首位は `pressure_attack_monster8_shield4`（score 47.1 / overall 46.3% / vs Black 42.5%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +12.5%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_attack_monster8_shield4 42.5% / weights_deny_attack_monster8 32.5% / pressure_attack_monster8_closeout4 32.5% / pressure_white_baseline 30%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster8_shield4<br>混合: attack_monster+8 / shield+4 | action_bias | pressure-normal<br>通常プレッシャー | 47.1 | 37-43-0 | 46.3% | 42.5% (17-23-0) | 40% (8-12-0) | 60% (12-8-0) | 12.7 | 3.4 | shield:387, wake_up:269, master_attack:149 | 0F/0W | - |
| 2 | weights_deny_attack_monster8<br>重み: 拒否 + attack_monster+8 | weights | pressure-normal<br>通常プレッシャー | 46.6 | 38-42-0 | 47.5% | 32.5% (13-27-0) | 75% (15-5-0) | 50% (10-10-0) | 12.7 | 3.1 | shield:317, wake_up:228, master_attack:183 | 0F/0W | 黒に弱い |
| 3 | pressure_attack_monster8_closeout4<br>混合: attack_monster+8 / attack_master+4 | action_bias | pressure-normal<br>通常プレッシャー | 41.3 | 32-48-0 | 40% | 32.5% (13-27-0) | 50% (10-10-0) | 45% (9-11-0) | 13.2 | 3.5 | shield:340, wake_up:241, master_attack:185 | 0F/0W | 黒に弱い |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 36.4 | 36-44-0 | 45% | 30% (12-28-0) | 50% (10-10-0) | 70% (14-6-0) | 12.6 | 3.7 | shield:289, wake_up:231, master_attack:187 | 0F/1W | warning 1<br>黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | pressure_attack_monster8_shield4<br>混合: attack_monster+8 / shield+4 | 盤面処理を主軸にしつつ、倒されると困る駒だけ少し守る。 | action attack_monster+8, shield+4 | 47.1 | 46.3% | 42.5% (17-23-0) | 40% (8-12-0) | 60% (12-8-0) | shield:387, wake_up:269, master_attack:149 | - |
| 2 | weights_deny_attack_monster8<br>重み: 拒否 + attack_monster+8 | 相手レベルアップ拒否と盤面攻撃補正を合わせ、黒速攻を盤面から止める。 | action attack_monster+8<br>weights monsterKillBase:320, futureOpponentLevelUp:0.36, futureOwnThreatenedMonster:0.32 | 46.6 | 47.5% | 32.5% (13-27-0) | 75% (15-5-0) | 50% (10-10-0) | shield:317, wake_up:228, master_attack:183 | 黒に弱い |
| 3 | pressure_attack_monster8_closeout4<br>混合: attack_monster+8 / attack_master+4 | 盤面処理に寄せすぎた時の決着力不足を本体攻撃補正で補う。 | action attack_monster+8, attack_master+4 | 41.3 | 40% | 32.5% (13-27-0) | 50% (10-10-0) | 45% (9-11-0) | shield:340, wake_up:241, master_attack:185 | 黒に弱い |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 36.4 | 45% | 30% (12-28-0) | 50% (10-10-0) | 70% (14-6-0) | shield:289, wake_up:231, master_attack:187 | warning 1<br>黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 8 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 5 / D 0 | 0F/1W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 6 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 8 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_white_pressure_strong_player | player | white_pressure_strong | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_shield4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 6 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 7 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_decoy_back_stable_player | player | decoy_back_stable | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 6 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 8 / D 0 | 0F/0W |
| pressure_attack_monster8_closeout4_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 7 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 6 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 7 / C 3 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 7 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 3 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_decoy_back_stable_player | player | decoy_back_stable | P 7 / C 3 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 8 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| weights_deny_attack_monster8_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |

## Reading

- `Overall` と `vs ...` は引き分けを0.5勝として扱う勝ち点率。
- `vs Black` は黒速攻耐性の主指標。`black_pressure_strong` と `black_pressure_pressure` の両方を合算している。
- `vs Decoy` は現行第三マスターへの基準維持。高すぎる場合は白が基準を超えすぎていないかを見る。
- `vs White` は現行白基準との比較診断。採用判断では黒耐性と長期戦リスクを優先する。
- `Usage` は候補白側の通常マスター特技使用回数。`wake_up` / `shield` / `master_attack` の偏りを見る。
- `Loss Opp HP` は候補白側が負けた時の相手残HP平均。低いほど惜敗、高いほど押し切られ。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。

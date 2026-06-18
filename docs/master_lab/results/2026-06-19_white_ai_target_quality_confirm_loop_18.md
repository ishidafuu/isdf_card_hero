# White AI Tuning Loop

生成: 2026-06-18T22:58:23.478Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 6 games/matchup/direction
総試合: 144

## Conclusion

首位は `pressure_white_shield_threat_conversion_v1`（score 41.6 / overall 52.1% / vs Black 33.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_shield_threat_conversion_v1 33.3% / pressure_white_closeout_after_shield_v1 25% / pressure_white_baseline 33.3%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 41.6 | 25-23-0 | 52.1% | 33.3% (8-16-0) | 58.3% (7-5-0) | 83.3% (10-2-0) | 12.2 | 3.4 | shield:214, wake_up:124, master_attack:106 | Ex 23.7%<br>Setup 51.6%<br>LowS 52.5%<br>ShieldConv 37.4%<br>Pygmy 36/234<br>Poly 88.2% | 0F/1W | warning 1<br>黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_closeout_after_shield_v1<br>本実装候補: 白盾後詰め+8 | hybrid | pressure-normal<br>通常プレッシャー | 40.7 | 21-27-0 | 43.8% | 25% (6-18-0) | 83.3% (10-2-0) | 41.7% (5-7-0) | 13 | 3.1 | shield:222, wake_up:176, master_attack:112 | Ex 22.4%<br>Setup 52.1%<br>LowS 53.4%<br>ShieldConv 41.4%<br>Pygmy 43/257<br>Poly 58.3% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 39.4 | 22-26-0 | 45.8% | 33.3% (8-16-0) | 75% (9-3-0) | 41.7% (5-7-0) | 12.9 | 3.8 | shield:245, wake_up:148, master_attack:119 | Ex 21.8%<br>Setup 54.4%<br>LowS 54.2%<br>ShieldConv 38.4%<br>Pygmy 56/310<br>Poly 71.4% | 0F/1W | warning 1<br>黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_shield_threat_conversion_v1<br>本実装候補: 白盾脅威/成果化+8 | 白マスター限定で、脅威軽減または次ターン成果化が見えるシールドだけを加点する。 | situational whiteShieldThreatConversionBonus:8 | 41.6 | 52.1% | 33.3% (8-16-0) | 58.3% (7-5-0) | 83.3% (10-2-0) | shield:214, wake_up:124, master_attack:106 | Ex 23.7%<br>Setup 51.6%<br>LowS 52.5%<br>ShieldConv 37.4%<br>Pygmy 36/234<br>Poly 88.2% | warning 1<br>黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_closeout_after_shield_v1<br>本実装候補: 白盾後詰め+8 | 既に守った駒がいる局面で、相手HP3以下へ詰める手を加点して守り続けを避ける。 | situational whiteCloseoutAfterShieldBonus:8 | 40.7 | 43.8% | 25% (6-18-0) | 83.3% (10-2-0) | 41.7% (5-7-0) | shield:222, wake_up:176, master_attack:112 | Ex 22.4%<br>Setup 52.1%<br>LowS 53.4%<br>ShieldConv 41.4%<br>Pygmy 43/257<br>Poly 58.3% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 39.4 | 45.8% | 33.3% (8-16-0) | 75% (9-3-0) | 41.7% (5-7-0) | shield:245, wake_up:148, master_attack:119 | Ex 21.8%<br>Setup 54.4%<br>LowS 54.2%<br>ShieldConv 38.4%<br>Pygmy 56/310<br>Poly 71.4% | warning 1<br>黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 1 / D 0 | 0F/1W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 4 / D 0 | 0F/1W |
| pressure_white_shield_threat_conversion_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_threat_conversion_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |

## Reading

- `Overall` と `vs ...` は引き分けを0.5勝として扱う勝ち点率。
- `vs Black` は黒速攻耐性の主指標。`black_pressure_strong` と `black_pressure_pressure` の両方を合算している。
- `vs Decoy` は現行第三マスターへの基準維持。高すぎる場合は白が基準を超えすぎていないかを見る。
- `vs White` は現行白基準との比較診断。採用判断では黒耐性と長期戦リスクを優先する。
- `Usage` は候補白側の通常マスター特技使用回数。`wake_up` / `shield` / `master_attack` の偏りを見る。
- `Intent` は白側行動の診断値。`Ex` はこのターンの仕事率、`Setup` は布石率、`LowS` は布石後に石が1以下、`ShieldConv` はシールドが次ターン成果へ変換された率。
- `Pygmy` はピグミィの小打点が撃破圏作りに寄与した回数、`Poly` はポリスピナー1回目行動が同ターン成果へつながった率。
- `Loss Opp HP` は候補白側が負けた時の相手残HP平均。低いほど惜敗、高いほど押し切られ。
- ロストーン入りデッキは `Notes` に出る。現方針では本命候補から外す。

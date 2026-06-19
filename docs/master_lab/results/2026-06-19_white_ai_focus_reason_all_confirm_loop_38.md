# White AI Tuning Loop

生成: 2026-06-19T02:25:06.709Z
候補: 2
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 8 games/matchup/direction
総試合: 128

## Conclusion

首位は `pressure_white_baseline`（score 41.9 / overall 43.8% / vs Black 28.1%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_baseline 28.1% / pressure_white_low_stone_focus_missed_attack_v1 31.3%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 41.9 | 28-36-0 | 43.8% | 28.1% (9-23-0) | 68.8% (11-5-0) | 50% (8-8-0) | 13.1 | 3.2 | shield:240, wake_up:206, master_attack:161 | Ex 23.1%<br>Setup 51.5%<br>LowS 55.6%<br>ShieldConv 37.1%<br>Pygmy 69/413<br>Poly 76.9% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_missed_attack_v1<br>本実装候補: 白低石focus攻撃見送り抑制 | hybrid | pressure-normal<br>通常プレッシャー | 40.2 | 27-37-0 | 42.2% | 31.3% (10-22-0) | 43.8% (7-9-0) | 62.5% (10-6-0) | 13.4 | 3.2 | shield:285, wake_up:224, master_attack:153 | Ex 21.8%<br>Setup 53.6%<br>LowS 53.9%<br>ShieldConv 32.6%<br>Pygmy 67/436<br>Poly 70% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 41.9 | 43.8% | 28.1% (9-23-0) | 68.8% (11-5-0) | 50% (8-8-0) | shield:240, wake_up:206, master_attack:161 | Ex 23.1%<br>Setup 51.5%<br>LowS 55.6%<br>ShieldConv 37.1%<br>Pygmy 69/413<br>Poly 76.9% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_missed_attack_v1<br>本実装候補: 白低石focus攻撃見送り抑制 | 白マスター限定で、攻撃可能なのに低石focusで布石へ寄る局面を抑え、このターンの仕事を優先する。 | situational whiteLowStoneFocusMissedAttackPenalty:8 | 40.2 | 42.2% | 31.3% (10-22-0) | 43.8% (7-9-0) | 62.5% (10-6-0) | shield:285, wake_up:224, master_attack:153 | Ex 21.8%<br>Setup 53.6%<br>LowS 53.9%<br>ShieldConv 32.6%<br>Pygmy 67/436<br>Poly 70% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 5 / D 0 | 0F/0W |

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

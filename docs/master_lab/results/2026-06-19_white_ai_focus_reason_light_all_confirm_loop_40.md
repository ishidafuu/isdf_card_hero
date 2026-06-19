# White AI Tuning Loop

生成: 2026-06-19T02:30:41.962Z
候補: 2
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 6 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_baseline`（score 45.2 / overall 45.8% / vs Black 41.7%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_baseline 41.7% / pressure_white_low_stone_focus_missed_attack_light_v1 29.2%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 45.2 | 22-26-0 | 45.8% | 41.7% (10-14-0) | 41.7% (5-7-0) | 58.3% (7-5-0) | 12.3 | 3.2 | shield:212, wake_up:139, master_attack:85 | Ex 22.1%<br>Setup 51.8%<br>LowS 56%<br>ShieldConv 42.5%<br>Pygmy 67/358<br>Poly 41.7% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 40.5 | 21-27-0 | 43.8% | 29.2% (7-17-0) | 58.3% (7-5-0) | 58.3% (7-5-0) | 12.3 | 4 | shield:194, wake_up:164, master_attack:101 | Ex 21.8%<br>Setup 53.6%<br>LowS 56.9%<br>ShieldConv 35.1%<br>Pygmy 55/351<br>Poly 56.3% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 45.2 | 45.8% | 41.7% (10-14-0) | 41.7% (5-7-0) | 58.3% (7-5-0) | shield:212, wake_up:139, master_attack:85 | Ex 22.1%<br>Setup 51.8%<br>LowS 56%<br>ShieldConv 42.5%<br>Pygmy 67/358<br>Poly 41.7% | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | 白マスター限定で、攻撃という同ターンの仕事が残っている低石focusだけを軽く抑える。 | situational whiteLowStoneFocusMissedAttackPenalty:4 | 40.5 | 43.8% | 29.2% (7-17-0) | 58.3% (7-5-0) | 58.3% (7-5-0) | shield:194, wake_up:164, master_attack:101 | Ex 21.8%<br>Setup 53.6%<br>LowS 56.9%<br>ShieldConv 35.1%<br>Pygmy 55/351<br>Poly 56.3% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 6 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |

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

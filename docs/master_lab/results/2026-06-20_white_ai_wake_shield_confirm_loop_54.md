# White AI Tuning Loop

生成: 2026-06-19T23:57:00.840Z
候補: 4
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 4 games/matchup/direction
総試合: 128

## Conclusion

首位は `pressure_white_baseline`（score 61.3 / overall 59.4% / vs Black 56.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_baseline 56.3% / pressure_white_next_turn_plan_quality_v1 43.8% / pressure_white_shield_wake_quality_v1 37.5% / pressure_white_low_stone_shield_wake_v1 43.8%。

### Next Steps

- 次は `pressure_white_baseline` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 61.3 | 19-13-0 | 59.4% | 56.3% (9-7-0) | 62.5% (5-3-0) | 62.5% (5-3-0) | 13.3 | 3.5 | shield:121, wake_up:116, master_attack:71 | Ex 21.9%<br>Setup 52.6%<br>LowS 56.6%<br>ShieldConv 43%<br>Pygmy 37/256<br>Poly 100% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_next_turn_plan_quality_v1<br>本実装候補: 白次ターン布石品質 | hybrid | pressure-normal<br>通常プレッシャー | 43.5 | 13-19-0 | 40.6% | 43.8% (7-9-0) | 37.5% (3-5-0) | 37.5% (3-5-0) | 13.9 | 3.4 | shield:176, wake_up:104, master_attack:76 | Ex 20.7%<br>Setup 54.1%<br>LowS 57.1%<br>ShieldConv 42%<br>Pygmy 45/247<br>Poly 66.7% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_wake_quality_v1<br>本実装候補: 白盾起動品質+8 | hybrid | pressure-normal<br>通常プレッシャー | 41.7 | 13-19-0 | 40.6% | 37.5% (6-10-0) | 37.5% (3-5-0) | 50% (4-4-0) | 13 | 3.7 | shield:158, wake_up:91, master_attack:61 | Ex 21.5%<br>Setup 53.3%<br>LowS 53.4%<br>ShieldConv 29.1%<br>Pygmy 39/182<br>Poly 75% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_low_stone_shield_wake_v1<br>本実装候補: 白低石盾起動抑制 | hybrid | pressure-normal<br>通常プレッシャー | 37.8 | 11-21-0 | 34.4% | 43.8% (7-9-0) | 50% (4-4-0) | 0% (0-8-0) | 12.6 | 3.1 | shield:130, wake_up:82, master_attack:68 | Ex 22.2%<br>Setup 52.3%<br>LowS 52.4%<br>ShieldConv 29.2%<br>Pygmy 42/222<br>Poly 83.3% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 61.3 | 59.4% | 56.3% (9-7-0) | 62.5% (5-3-0) | 62.5% (5-3-0) | shield:121, wake_up:116, master_attack:71 | Ex 21.9%<br>Setup 52.6%<br>LowS 56.6%<br>ShieldConv 43%<br>Pygmy 37/256<br>Poly 100% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_next_turn_plan_quality_v1<br>本実装候補: 白次ターン布石品質 | 盾/起動の対象品質と、守った後の詰めを同時に見る本命複合候補。 | situational whiteShieldThreatConversionBonus:8, whiteWakeImmediateWorkBonus:8, whiteCloseoutAfterShieldBonus:6 | 43.5 | 40.6% | 43.8% (7-9-0) | 37.5% (3-5-0) | 37.5% (3-5-0) | shield:176, wake_up:104, master_attack:76 | Ex 20.7%<br>Setup 54.1%<br>LowS 57.1%<br>ShieldConv 42%<br>Pygmy 45/247<br>Poly 66.7% | 盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_wake_quality_v1<br>本実装候補: 白盾起動品質+8 | シールドとウェイクアップを、消費量ではなく次ターン成果化の質で押す。 | situational whiteShieldThreatConversionBonus:8, whiteWakeImmediateWorkBonus:8 | 41.7 | 40.6% | 37.5% (6-10-0) | 37.5% (3-5-0) | 50% (4-4-0) | shield:158, wake_up:91, master_attack:61 | Ex 21.5%<br>Setup 53.3%<br>LowS 53.4%<br>ShieldConv 29.1%<br>Pygmy 39/182<br>Poly 75% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_low_stone_shield_wake_v1<br>本実装候補: 白低石盾起動抑制 | 白マスター限定で、石1以下になるシールド/ウェイクアップ布石を抑え、次ターンの選択肢を残す。 | situational whiteLowStoneShieldPenalty:10, whiteLowStoneWakePenalty:8 | 37.8 | 34.4% | 43.8% (7-9-0) | 50% (4-4-0) | 0% (0-8-0) | shield:130, wake_up:82, master_attack:68 | Ex 22.2%<br>Setup 52.3%<br>LowS 52.4%<br>ShieldConv 29.2%<br>Pygmy 42/222<br>Poly 83.3% | 盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_wake_quality_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |

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

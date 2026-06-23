# White AI Tuning Loop

生成: 2026-06-23T03:10:06.718Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 6 games/matchup/direction
総試合: 144

## Conclusion

首位は `pressure_white_baseline`（score 50.7 / overall 50% / vs Black 41.7%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_baseline 41.7% / pressure_white_shield_quality_second_guard_v1 50% / pressure_white_shield_breakthrough_guard_plus20_v1 41.7%。

### Next Steps

- 次は `pressure_white_shield_quality_second_guard_v1` を games-per-matchup 8-12 で確認する。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 50.7 | 24-24-0 | 50% | 41.7% (10-14-0) | 75% (9-3-0) | 41.7% (5-7-0) | 12.5 | 3.8 | shield:263, wake_up:152, master_attack:87 | Ex 21.7%<br>Setup 52.2%<br>LowS 53.1%<br>ShieldConv 41.1%<br>Pygmy 51/298<br>Poly 64.7% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | hybrid | pressure-normal<br>通常プレッシャー | 50.2 | 23-25-0 | 47.9% | 50% (12-12-0) | 58.3% (7-5-0) | 33.3% (4-8-0) | 12.2 | 4 | shield:211, wake_up:143, master_attack:113 | Ex 22.7%<br>Setup 52.4%<br>LowS 55.4%<br>ShieldConv 40.8%<br>Pygmy 66/245<br>Poly 76% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_breakthrough_guard_plus20_v1<br>本実装候補: 白突破盾抑制-20 | hybrid | pressure-normal<br>通常プレッシャー | 44.6 | 20-28-0 | 41.7% | 41.7% (10-14-0) | 41.7% (5-7-0) | 41.7% (5-7-0) | 13.6 | 3.6 | shield:259, wake_up:137, master_attack:130 | Ex 22.2%<br>Setup 50.5%<br>LowS 51.6%<br>ShieldConv 42.5%<br>Pygmy 52/254<br>Poly 66.7% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 50.7 | 50% | 41.7% (10-14-0) | 75% (9-3-0) | 41.7% (5-7-0) | shield:263, wake_up:152, master_attack:87 | Ex 21.7%<br>Setup 52.2%<br>LowS 53.1%<br>ShieldConv 41.1%<br>Pygmy 51/298<br>Poly 64.7% | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | 質の高い盾を押しつつ、2枚目低石シールドの全力投入を抑える。 | situational whiteShieldThreatConversionBonus:8, whiteSecondShieldLowStonePenalty:8 | 50.2 | 47.9% | 50% (12-12-0) | 58.3% (7-5-0) | 33.3% (4-8-0) | shield:211, wake_up:143, master_attack:113 | Ex 22.7%<br>Setup 52.4%<br>LowS 55.4%<br>ShieldConv 40.8%<br>Pygmy 66/245<br>Poly 76% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_breakthrough_guard_plus20_v1<br>本実装候補: 白突破盾抑制-20 | 突破される盾への抑制を強め、1接触除去がどこまで減るか見る。 | situational whiteShieldBreakthroughPenalty:20 | 44.6 | 41.7% | 41.7% (10-14-0) | 41.7% (5-7-0) | 41.7% (5-7-0) | shield:259, wake_up:137, master_attack:130 | Ex 22.2%<br>Setup 50.5%<br>LowS 51.6%<br>ShieldConv 42.5%<br>Pygmy 52/254<br>Poly 66.7% | 盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |

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

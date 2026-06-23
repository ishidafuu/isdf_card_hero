# White AI Tuning Loop

生成: 2026-06-23T03:05:19.229Z
候補: 6
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 2 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_baseline`（score 53.1 / overall 50% / vs Black 50%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 3 件。 上位候補: pressure_white_baseline 50% / pressure_white_shield_quality_second_guard_v1 50% / pressure_white_shield_breakthrough_guard_plus20_v1 62.5% / pressure_white_shield_pressure_breakthrough_v1 25% / pressure_white_shield_breakthrough_guard_v1 12.5%。

### Next Steps

- 次は `pressure_white_baseline`, `pressure_white_shield_quality_second_guard_v1`, `pressure_white_shield_breakthrough_guard_plus20_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 53.1 | 8-8-0 | 50% | 50% (4-4-0) | 50% (2-2-0) | 50% (2-2-0) | 11.6 | 4.8 | shield:72, master_attack:42, wake_up:41 | Ex 24.2%<br>Setup 51.8%<br>LowS 52.2%<br>ShieldConv 30.6%<br>Pygmy 10/32<br>Poly 100% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | hybrid | pressure-normal<br>通常プレッシャー | 51.3 | 8-8-0 | 50% | 50% (4-4-0) | 50% (2-2-0) | 50% (2-2-0) | 12.6 | 4.1 | shield:83, wake_up:62, master_attack:31 | Ex 22.2%<br>Setup 55.1%<br>LowS 58.2%<br>ShieldConv 41%<br>Pygmy 24/118<br>Poly 0% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_breakthrough_guard_plus20_v1<br>本実装候補: 白突破盾抑制-20 | hybrid | pressure-normal<br>通常プレッシャー | 50 | 10-6-0 | 62.5% | 62.5% (5-3-0) | 25% (1-3-0) | 100% (4-0-0) | 13.4 | 3.8 | shield:91, wake_up:59, master_attack:33 | Ex 20.5%<br>Setup 54.3%<br>LowS 53.9%<br>ShieldConv 45.1%<br>Pygmy 17/124<br>Poly 50% | 0F/1W | warning 1<br>黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_shield_pressure_breakthrough_v1<br>本実装候補: 白盾圧力/突破精査 | hybrid | pressure-normal<br>通常プレッシャー | 48.2 | 9-7-0 | 56.3% | 25% (2-6-0) | 75% (3-1-0) | 100% (4-0-0) | 14.2 | 4.6 | shield:65, wake_up:62, master_attack:49 | Ex 23.7%<br>Setup 48.3%<br>LowS 48.6%<br>ShieldConv 43.1%<br>Pygmy 14/94<br>Poly 100% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 5 | pressure_white_shield_breakthrough_guard_v1<br>本実装候補: 白突破盾抑制-12 | hybrid | pressure-normal<br>通常プレッシャー | 21.7 | 4-12-0 | 25% | 12.5% (1-7-0) | 25% (1-3-0) | 50% (2-2-0) | 12.3 | 3.8 | shield:119, wake_up:52, master_attack:37 | Ex 20.4%<br>Setup 56.5%<br>LowS 49.8%<br>ShieldConv 31.1%<br>Pygmy 21/97<br>Poly 25% | 0F/0W | 黒に弱い<br>シールド偏重<br>盾の成果化不足<br>布石後の石枯渇 |
| 6 | pressure_white_shield_quality_breakthrough_v1<br>本実装候補: 白盾品質+突破抑制 | hybrid | pressure-normal<br>通常プレッシャー | 12.7 | 3-13-0 | 18.8% | 0% (0-8-0) | 25% (1-3-0) | 50% (2-2-0) | 15.3 | 2.9 | shield:106, wake_up:61, master_attack:38 | Ex 21.6%<br>Setup 53.3%<br>LowS 56.6%<br>ShieldConv 40.6%<br>Pygmy 32/123<br>Poly 0% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 53.1 | 50% | 50% (4-4-0) | 50% (2-2-0) | 50% (2-2-0) | shield:72, master_attack:42, wake_up:41 | Ex 24.2%<br>Setup 51.8%<br>LowS 52.2%<br>ShieldConv 30.6%<br>Pygmy 10/32<br>Poly 100% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | 質の高い盾を押しつつ、2枚目低石シールドの全力投入を抑える。 | situational whiteShieldThreatConversionBonus:8, whiteSecondShieldLowStonePenalty:8 | 51.3 | 50% | 50% (4-4-0) | 50% (2-2-0) | 50% (2-2-0) | shield:83, wake_up:62, master_attack:31 | Ex 22.2%<br>Setup 55.1%<br>LowS 58.2%<br>ShieldConv 41%<br>Pygmy 24/118<br>Poly 0% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_shield_breakthrough_guard_plus20_v1<br>本実装候補: 白突破盾抑制-20 | 突破される盾への抑制を強め、1接触除去がどこまで減るか見る。 | situational whiteShieldBreakthroughPenalty:20 | 50 | 62.5% | 62.5% (5-3-0) | 25% (1-3-0) | 100% (4-0-0) | shield:91, wake_up:59, master_attack:33 | Ex 20.5%<br>Setup 54.3%<br>LowS 53.9%<br>ShieldConv 45.1%<br>Pygmy 17/124<br>Poly 50% | warning 1<br>黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_shield_pressure_breakthrough_v1<br>本実装候補: 白盾圧力/突破精査 | 守りきれない盾と、成果化しないノープレッシャー盾を同時に薄く抑える。 | situational whiteShieldBreakthroughPenalty:16, whiteShieldNoPressurePenalty:8 | 48.2 | 56.3% | 25% (2-6-0) | 75% (3-1-0) | 100% (4-0-0) | shield:65, wake_up:62, master_attack:49 | Ex 23.7%<br>Setup 48.3%<br>LowS 48.6%<br>ShieldConv 43.1%<br>Pygmy 14/94<br>Poly 100% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 5 | pressure_white_shield_breakthrough_guard_v1<br>本実装候補: 白突破盾抑制-12 | 白マスター限定で、シールド後もマスターアタック込み致死が残る守りきれない盾を抑える。 | situational whiteShieldBreakthroughPenalty:12 | 21.7 | 25% | 12.5% (1-7-0) | 25% (1-3-0) | 50% (2-2-0) | shield:119, wake_up:52, master_attack:37 | Ex 20.4%<br>Setup 56.5%<br>LowS 49.8%<br>ShieldConv 31.1%<br>Pygmy 21/97<br>Poly 25% | 黒に弱い<br>シールド偏重<br>盾の成果化不足<br>布石後の石枯渇 |
| 6 | pressure_white_shield_quality_breakthrough_v1<br>本実装候補: 白盾品質+突破抑制 | 質の高い盾は押し、2枚目低石と突破される盾を抑える複合候補。 | situational whiteShieldThreatConversionBonus:8, whiteSecondShieldLowStonePenalty:8, whiteShieldBreakthroughPenalty:12 | 12.7 | 18.8% | 0% (0-8-0) | 25% (1-3-0) | 50% (2-2-0) | shield:106, wake_up:61, master_attack:38 | Ex 21.6%<br>Setup 53.3%<br>LowS 56.6%<br>ShieldConv 40.6%<br>Pygmy 32/123<br>Poly 0% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 0 / D 0 | 0F/1W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_breakthrough_guard_plus20_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_pressure_breakthrough_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_pressure_breakthrough_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_pressure_breakthrough_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_pressure_breakthrough_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_pressure_breakthrough_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_pressure_breakthrough_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_pressure_breakthrough_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_pressure_breakthrough_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_breakthrough_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_breakthrough_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_quality_breakthrough_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_breakthrough_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 0 / D 0 | 0F/0W |
| pressure_white_shield_quality_breakthrough_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_breakthrough_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_quality_breakthrough_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_breakthrough_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |

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

# White AI Tuning Loop

生成: 2026-06-19T14:24:08.030Z
候補: 2
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 4 games/matchup/direction
総試合: 64

## Conclusion

首位は `pressure_white_black_front_threat_plus16_v1`（score 57 / overall 56.3% / vs Black 56.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +25%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_black_front_threat_plus16_v1 56.3% / pressure_white_baseline 31.3%。

### Next Steps

- 次は `pressure_white_black_front_threat_plus16_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_black_front_threat_plus16_v1<br>本実装候補: 白黒前衛脅威処理+16 | hybrid | pressure-normal<br>通常プレッシャー | 57 | 18-14-0 | 56.3% | 56.3% (9-7-0) | 50% (4-4-0) | 62.5% (5-3-0) | 13.7 | 3.3 | shield:172, wake_up:122, master_attack:71 | Ex 22.1%<br>Setup 53.3%<br>LowS 54.2%<br>ShieldConv 32.6%<br>Pygmy 45/240<br>Poly 80% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 38 | 12-20-0 | 37.5% | 31.3% (5-11-0) | 50% (4-4-0) | 37.5% (3-5-0) | 12.6 | 2.9 | shield:159, wake_up:108, master_attack:69 | Ex 21.6%<br>Setup 54.5%<br>LowS 50.6%<br>ShieldConv 30.2%<br>Pygmy 27/153<br>Poly 50% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_black_front_threat_plus16_v1<br>本実装候補: 白黒前衛脅威処理+16 | 黒前衛打点源処理をかなり強め、白の育成/防御を壊さない上限を確認する。 | situational whiteBlackFrontThreatBonus:16 | 57 | 56.3% | 56.3% (9-7-0) | 50% (4-4-0) | 62.5% (5-3-0) | shield:172, wake_up:122, master_attack:71 | Ex 22.1%<br>Setup 53.3%<br>LowS 54.2%<br>ShieldConv 32.6%<br>Pygmy 45/240<br>Poly 80% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 38 | 37.5% | 31.3% (5-11-0) | 50% (4-4-0) | 37.5% (3-5-0) | shield:159, wake_up:108, master_attack:69 | Ex 21.6%<br>Setup 54.5%<br>LowS 50.6%<br>ShieldConv 30.2%<br>Pygmy 27/153<br>Poly 50% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |

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

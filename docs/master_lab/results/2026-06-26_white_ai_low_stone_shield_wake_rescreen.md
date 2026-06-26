# White AI Tuning Loop

注記: 小母数では低石シールド/ウェイクアップ抑制が良く見えたが、この中母数確認では `pressure_white_baseline` が overall / vs Black とも上回ったため、デフォルト採用は見送る。自動生成の Next Steps は追加確認案として残し、採用判断は `2026-06-26_white_ai_decision_trace_loop_summary.md` を優先する。

生成: 2026-06-26T05:01:48.292Z
候補: 2
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable
試行: 4 games/matchup/direction
総試合: 48

## Conclusion

首位は `pressure_white_baseline`（score 67.6 / overall 75% / vs Black 68.8%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 2 件。 上位候補: pressure_white_baseline 68.8% / pressure_white_low_stone_shield_wake_v1 50%。

### Next Steps

- 次は `pressure_white_baseline`, `pressure_white_low_stone_shield_wake_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 67.6 | 18-6-0 | 75% | 68.8% (11-5-0) | 87.5% (7-1-0) | - | 16.5 | 3 | shield:92, master_attack:83, wake_up:76 | Ex 24.7%<br>Setup 51.6%<br>LowS 38.3%<br>ShieldConv 45.7%<br>Pygmy 59/170<br>Poly 50% | 0F/0W | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_shield_wake_v1<br>本実装候補: 白低石盾起動抑制 | hybrid | pressure-normal<br>通常プレッシャー | 55.8 | 15-9-0 | 62.5% | 50% (8-8-0) | 87.5% (7-1-0) | - | 16.5 | 3 | shield:103, master_attack:91, wake_up:75 | Ex 24.3%<br>Setup 51.1%<br>LowS 37.8%<br>ShieldConv 52.4%<br>Pygmy 66/203<br>Poly 55.6% | 0F/0W | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 67.6 | 75% | 68.8% (11-5-0) | 87.5% (7-1-0) | - | shield:92, master_attack:83, wake_up:76 | Ex 24.7%<br>Setup 51.6%<br>LowS 38.3%<br>ShieldConv 45.7%<br>Pygmy 59/170<br>Poly 50% | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_shield_wake_v1<br>本実装候補: 白低石盾起動抑制 | 白マスター限定で、石1以下になるシールド/ウェイクアップ布石を抑え、次ターンの選択肢を残す。 | situational whiteLowStoneShieldPenalty:10, whiteLowStoneWakePenalty:8 | 55.8 | 62.5% | 50% (8-8-0) | 87.5% (7-1-0) | - | shield:103, master_attack:91, wake_up:75 | Ex 24.3%<br>Setup 51.1%<br>LowS 37.8%<br>ShieldConv 52.4%<br>Pygmy 66/203<br>Poly 55.6% | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |

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

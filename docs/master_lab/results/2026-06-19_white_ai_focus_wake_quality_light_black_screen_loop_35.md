# White AI Tuning Loop

生成: 2026-06-19T01:46:59.106Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure
試行: 6 games/matchup/direction
総試合: 72

## Conclusion

首位は `pressure_white_focus_wake_quality_v1`（score 43.9 / overall 54.2% / vs Black 54.2%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +12.5%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_focus_wake_quality_v1 54.2% / pressure_white_baseline 41.7% / pressure_white_focus_wake_quality_light_v1 41.7%。

### Next Steps

- 次は `pressure_white_focus_wake_quality_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_focus_wake_quality_v1<br>本実装候補: 白focus/wake布石品質 | hybrid | pressure-normal<br>通常プレッシャー | 43.9 | 13-11-0 | 54.2% | 54.2% (13-11-0) | - | - | 8.7 | - | wake_up:47, shield:46, master_attack:41 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 35.2 | 10-14-0 | 41.7% | 41.7% (10-14-0) | - | - | 9.5 | - | shield:65, wake_up:58, master_attack:40 | - | 0F/0W | - |
| 3 | pressure_white_focus_wake_quality_light_v1<br>本実装候補: 白focus/wake布石品質軽量 | hybrid | pressure-normal<br>通常プレッシャー | 35.2 | 10-14-0 | 41.7% | 41.7% (10-14-0) | - | - | 10.3 | - | wake_up:77, shield:70, master_attack:36 | - | 0F/0W | - |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_focus_wake_quality_v1<br>本実装候補: 白focus/wake布石品質 | 低石focusと自陣ウェイクを、消費量ではなく次ターンの仕事へ変換できる品質で押す。 | situational whiteLowStoneFocusConversionBonus:8, whiteWakeSafeWorkBonus:8 | 43.9 | 54.2% | 54.2% (13-11-0) | - | - | wake_up:47, shield:46, master_attack:41 | - | 黒耐性あり |
| 2 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 35.2 | 41.7% | 41.7% (10-14-0) | - | - | shield:65, wake_up:58, master_attack:40 | - | - |
| 3 | pressure_white_focus_wake_quality_light_v1<br>本実装候補: 白focus/wake布石品質軽量 | focus/wake品質加点を薄く入れ、+8複合の上振れや守り寄り副作用を抑える。 | situational whiteLowStoneFocusConversionBonus:4, whiteWakeSafeWorkBonus:4 | 35.2 | 41.7% | 41.7% (10-14-0) | - | - | wake_up:77, shield:70, master_attack:36 | - | - |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |

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

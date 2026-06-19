# White AI Tuning Loop

生成: 2026-06-19T01:32:45.050Z
候補: 5
相手: black_pressure_strong, black_pressure_pressure
試行: 6 games/matchup/direction
総試合: 120

## Conclusion

首位は `pressure_white_focus_wake_quality_v1`（score 43.9 / overall 54.2% / vs Black 54.2%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +25%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_focus_wake_quality_v1 54.2% / pressure_white_low_stone_focus_light_v1 33.3% / pressure_white_baseline 29.2% / pressure_white_low_stone_focus_conversion_v1 29.2% / pressure_white_wake_safe_work_v1 25%。

### Next Steps

- 次は `pressure_white_focus_wake_quality_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_focus_wake_quality_v1<br>本実装候補: 白focus/wake布石品質 | hybrid | pressure-normal<br>通常プレッシャー | 43.9 | 13-11-0 | 54.2% | 54.2% (13-11-0) | - | - | 9.8 | - | shield:83, wake_up:47, master_attack:37 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_low_stone_focus_light_v1<br>本実装候補: 白低石focus抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 29.3 | 8-16-0 | 33.3% | 33.3% (8-16-0) | - | - | 10.2 | - | wake_up:73, shield:60, master_attack:56 | - | 0F/0W | 黒に弱い |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 26.4 | 7-17-0 | 29.2% | 29.2% (7-17-0) | - | - | 10.5 | - | shield:87, wake_up:68, master_attack:52 | - | 0F/0W | 黒に弱い |
| 4 | pressure_white_low_stone_focus_conversion_v1<br>本実装候補: 白低石focus成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 26.4 | 7-17-0 | 29.2% | 29.2% (7-17-0) | - | - | 10 | - | shield:84, wake_up:67, master_attack:47 | - | 0F/0W | 黒に弱い |
| 5 | pressure_white_wake_safe_work_v1<br>本実装候補: 白安全ウェイク仕事+8 | hybrid | pressure-normal<br>通常プレッシャー | 23.5 | 6-18-0 | 25% | 25% (6-18-0) | - | - | 9.9 | - | shield:67, master_attack:54, wake_up:53 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_focus_wake_quality_v1<br>本実装候補: 白focus/wake布石品質 | 低石focusと自陣ウェイクを、消費量ではなく次ターンの仕事へ変換できる品質で押す。 | situational whiteLowStoneFocusConversionBonus:8, whiteWakeSafeWorkBonus:8 | 43.9 | 54.2% | 54.2% (13-11-0) | - | - | shield:83, wake_up:47, master_attack:37 | - | 黒耐性あり |
| 2 | pressure_white_low_stone_focus_light_v1<br>本実装候補: 白低石focus抑制軽量 | focus抑制を薄く入れ、待ちすぎの副作用を抑えながら石枯渇を減らす。 | situational whiteLowStoneFocusPenalty:4 | 29.3 | 33.3% | 33.3% (8-16-0) | - | - | wake_up:73, shield:60, master_attack:56 | - | 黒に弱い |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 26.4 | 29.2% | 29.2% (7-17-0) | - | - | shield:87, wake_up:68, master_attack:52 | - | 黒に弱い |
| 4 | pressure_white_low_stone_focus_conversion_v1<br>本実装候補: 白低石focus成果化+8 | 白マスター限定で、低石でも次ターン攻撃/レベルアップへ変換できるfocusだけを加点する。 | situational whiteLowStoneFocusConversionBonus:8 | 26.4 | 29.2% | 29.2% (7-17-0) | - | - | shield:84, wake_up:67, master_attack:47 | - | 黒に弱い |
| 5 | pressure_white_wake_safe_work_v1<br>本実装候補: 白安全ウェイク仕事+8 | 白マスター限定で、起こした味方が露出死しにくく、同ターンまたは次ターンの仕事が見えるウェイクアップを加点する。 | situational whiteWakeSafeWorkBonus:8 | 23.5 | 25% | 25% (6-18-0) | - | - | shield:67, master_attack:54, wake_up:53 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 0 / D 0 | 0F/0W |
| pressure_white_wake_safe_work_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_wake_safe_work_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 0 / D 0 | 0F/0W |
| pressure_white_wake_safe_work_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_wake_safe_work_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |

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

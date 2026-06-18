# White AI Tuning Loop

生成: 2026-06-18T15:40:09.171Z
候補: 6
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_low_stone_focus_guard_v1`（score 41 / overall 50% / vs Black 50%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +18.7%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_low_stone_focus_guard_v1 50% / pressure_white_low_stone_focus_light_v1 43.8% / pressure_white_low_stone_focus_v1 37.5% / pressure_white_low_stone_setup_light_v1 37.5% / pressure_white_baseline 31.3%。

### Next Steps

- 次は `pressure_white_low_stone_focus_guard_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_low_stone_focus_guard_v1<br>本実装候補: 白低石focus+盾起動抑制 | hybrid | pressure-normal<br>通常プレッシャー | 41 | 8-8-0 | 50% | 50% (8-8-0) | - | - | 8.9 | - | shield:36, wake_up:30, master_attack:23 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_low_stone_focus_light_v1<br>本実装候補: 白低石focus抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 11.1 | - | wake_up:48, shield:42, master_attack:27 | - | 0F/0W | - |
| 3 | pressure_white_low_stone_focus_v1<br>本実装候補: 白低石focus抑制 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 9.6 | - | wake_up:46, shield:44, master_attack:33 | - | 0F/0W | 黒に弱い |
| 4 | pressure_white_low_stone_setup_light_v1<br>本実装候補: 白低石布石抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 10.8 | - | shield:56, wake_up:42, master_attack:36 | - | 0F/0W | 黒に弱い |
| 5 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 10.2 | - | shield:55, wake_up:48, master_attack:23 | - | 0F/0W | 黒に弱い |
| 6 | pressure_white_low_stone_setup_v1<br>本実装候補: 白低石布石抑制 | hybrid | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 11.8 | - | shield:58, wake_up:52, master_attack:37 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_low_stone_focus_guard_v1<br>本実装候補: 白低石focus+盾起動抑制 | 低石focusを主対象にしつつ、シールド/ウェイクアップの低石化も薄く抑える。 | situational whiteLowStoneFocusPenalty:6, whiteLowStoneShieldPenalty:4, whiteLowStoneWakePenalty:4 | 41 | 50% | 50% (8-8-0) | - | - | shield:36, wake_up:30, master_attack:23 | - | 黒耐性あり |
| 2 | pressure_white_low_stone_focus_light_v1<br>本実装候補: 白低石focus抑制軽量 | focus抑制を薄く入れ、待ちすぎの副作用を抑えながら石枯渇を減らす。 | situational whiteLowStoneFocusPenalty:4 | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | wake_up:48, shield:42, master_attack:27 | - | - |
| 3 | pressure_white_low_stone_focus_v1<br>本実装候補: 白低石focus抑制 | 負け監査で多かった、石1以下のままfocusする布石だけを抑える。 | situational whiteLowStoneFocusPenalty:8 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:46, shield:44, master_attack:33 | - | 黒に弱い |
| 4 | pressure_white_low_stone_setup_light_v1<br>本実装候補: 白低石布石抑制軽量 | 全布石低石抑制を弱め、強すぎる抑制で反撃速度を落としていないか確認する。 | situational setupLowStonePenalty:4 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | shield:56, wake_up:42, master_attack:36 | - | 黒に弱い |
| 5 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:55, wake_up:48, master_attack:23 | - | 黒に弱い |
| 6 | pressure_white_low_stone_setup_v1<br>本実装候補: 白低石布石抑制 | 白マスター限定ではなく汎用フックで、石1以下になる布石全般を抑える。focus低石化が多い監査結果の対照候補。 | situational setupLowStonePenalty:10 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:58, wake_up:52, master_attack:37 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |

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

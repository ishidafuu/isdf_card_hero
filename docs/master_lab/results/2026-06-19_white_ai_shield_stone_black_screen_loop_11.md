# White AI Tuning Loop

生成: 2026-06-18T15:31:44.306Z
候補: 6
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_low_stone_setup_v1`（score 45.4 / overall 56.3% / vs Black 56.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +18.8%。 安定候補（vs Black 45%以上、0F/1W以下）は 2 件。 上位候補: pressure_white_low_stone_setup_v1 56.3% / pressure_white_low_stone_shield_wake_v1 50% / pressure_white_baseline 37.5% / pressure_white_strict_shield_low_stone_v1 37.5% / pressure_white_strict_shield_v1 37.5%。

### Next Steps

- 次は `pressure_white_low_stone_setup_v1`, `pressure_white_low_stone_shield_wake_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_low_stone_setup_v1<br>本実装候補: 白低石布石抑制 | hybrid | pressure-normal<br>通常プレッシャー | 45.4 | 9-7-0 | 56.3% | 56.3% (9-7-0) | - | - | 10.8 | - | shield:54, wake_up:52, master_attack:41 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_low_stone_shield_wake_v1<br>本実装候補: 白低石盾起動抑制 | hybrid | pressure-normal<br>通常プレッシャー | 41 | 8-8-0 | 50% | 50% (8-8-0) | - | - | 9.5 | - | shield:45, master_attack:34, wake_up:33 | - | 0F/0W | 黒耐性あり |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 11.5 | - | wake_up:57, shield:44, master_attack:33 | - | 0F/0W | 黒に弱い |
| 4 | pressure_white_strict_shield_low_stone_v1<br>本実装候補: 白盾精査+低石抑制 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 9.8 | - | wake_up:50, shield:36, master_attack:32 | - | 0F/0W | 黒に弱い |
| 5 | pressure_white_strict_shield_v1<br>本実装候補: 白成果化盾-10 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 10.9 | - | wake_up:65, shield:51, master_attack:26 | - | 0F/0W | 黒に弱い |
| 6 | pressure_white_low_stone_summon_v1<br>本実装候補: 白低石召喚抑制 | hybrid | pressure-normal<br>通常プレッシャー | 14.8 | 2-14-0 | 12.5% | 12.5% (2-14-0) | - | - | 9.9 | - | wake_up:53, shield:52, master_attack:34 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_low_stone_setup_v1<br>本実装候補: 白低石布石抑制 | 白マスター限定ではなく汎用フックで、石1以下になる布石全般を抑える。focus低石化が多い監査結果の対照候補。 | situational setupLowStonePenalty:10 | 45.4 | 56.3% | 56.3% (9-7-0) | - | - | shield:54, wake_up:52, master_attack:41 | - | 黒耐性あり |
| 2 | pressure_white_low_stone_shield_wake_v1<br>本実装候補: 白低石盾起動抑制 | 白マスター限定で、石1以下になるシールド/ウェイクアップ布石を抑え、次ターンの選択肢を残す。 | situational whiteLowStoneShieldPenalty:10, whiteLowStoneWakePenalty:8 | 41 | 50% | 50% (8-8-0) | - | - | shield:45, master_attack:34, wake_up:33 | - | 黒耐性あり |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:57, shield:44, master_attack:33 | - | 黒に弱い |
| 4 | pressure_white_strict_shield_low_stone_v1<br>本実装候補: 白盾精査+低石抑制 | 成果化しないシールド抑制と低石シールド/ウェイクアップ抑制を薄く併用する。 | situational whiteStrictShieldPenalty:8, whiteLowStoneShieldPenalty:6, whiteLowStoneWakePenalty:6 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:50, shield:36, master_attack:32 | - | 黒に弱い |
| 5 | pressure_white_strict_shield_v1<br>本実装候補: 白成果化盾-10 | 白マスター限定で、致死回避・脅威軽減・次ターン成果化につながらないシールドを抑える。 | situational whiteStrictShieldPenalty:10 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:65, shield:51, master_attack:26 | - | 黒に弱い |
| 6 | pressure_white_low_stone_summon_v1<br>本実装候補: 白低石召喚抑制 | 白マスター限定で、石1以下になる召喚布石を抑え、特技用ストーンの枯渇を避ける。 | situational whiteLowStoneSummonPenalty:8 | 14.8 | 12.5% | 12.5% (2-14-0) | - | - | wake_up:53, shield:52, master_attack:34 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_strict_shield_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_strict_shield_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_strict_shield_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_strict_shield_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_shield_wake_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_summon_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_summon_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_low_stone_summon_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_summon_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_setup_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_strict_shield_low_stone_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_strict_shield_low_stone_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_strict_shield_low_stone_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_strict_shield_low_stone_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |

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

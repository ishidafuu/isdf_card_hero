# White AI Tuning Loop

生成: 2026-06-23T08:37:31.838Z
候補: 1
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable
試行: 6 games/matchup/direction
総試合: 36

## Conclusion

首位は `pressure_white_second_shield_old_guard_v1`（score 39.6 / overall 41.7% / vs Black 33.3%）。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_second_shield_old_guard_v1 33.3%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_second_shield_old_guard_v1<br>比較用: 旧2枚目低石盾抑制 | hybrid | pressure-normal<br>通常プレッシャー | 39.6 | 15-21-0 | 41.7% | 33.3% (8-16-0) | 58.3% (7-5-0) | - | 12.3 | - | shield:150, wake_up:110, master_attack:74 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_second_shield_old_guard_v1<br>比較用: 旧2枚目低石盾抑制 | 2枚目シールド強抑制前に近い設定。勝率副作用の切り分けに使う。 | situational whiteSecondShieldLowStonePenalty:12, whiteSecondShieldCommitmentPenalty:0 | 39.6 | 41.7% | 33.3% (8-16-0) | 58.3% (7-5-0) | - | shield:150, wake_up:110, master_attack:74 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_second_shield_old_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_second_shield_old_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_second_shield_old_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_second_shield_old_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_old_guard_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_second_shield_old_guard_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 4 / D 0 | 0F/0W |

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

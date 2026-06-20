# White AI Tuning Loop

生成: 2026-06-20T01:30:27.887Z
候補: 4
相手: black_pressure_strong, black_pressure_pressure
試行: 10 games/matchup/direction
総試合: 160

## Conclusion

首位は `balanced_attack_monster8`（score 33.2 / overall 40% / vs Black 40%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +2.5%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: balanced_attack_monster8 40% / pressure_white_low_stone_focus_missed_attack_light_v1 37.5% / pressure_white_baseline 37.5% / white494_wake8 22.5%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | balanced_attack_monster8<br>balanced: attack_monster+8 | hybrid | balanced-normal<br>通常バランス | 33.2 | 16-24-0 | 40% | 40% (16-24-0) | - | - | 12.5 | 3.5 | wake_up:166, shield:152, master_attack:104 | Ex 26.2%<br>Setup 52.5%<br>LowS 51.7%<br>ShieldConv 57.2%<br>Pygmy 0/0<br>Poly 0% | 0F/0W | 布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 31.7 | 15-25-0 | 37.5% | 37.5% (15-25-0) | - | - | 11.2 | 2.9 | shield:126, wake_up:119, master_attack:101 | Ex 26.6%<br>Setup 51.2%<br>LowS 53.1%<br>ShieldConv 42.9%<br>Pygmy 33/167<br>Poly 70% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 31.6 | 15-25-0 | 37.5% | 37.5% (15-25-0) | - | - | 10.7 | 3 | wake_up:125, shield:105, master_attack:75 | Ex 27.5%<br>Setup 48.6%<br>LowS 52.1%<br>ShieldConv 48.6%<br>Pygmy 30/186<br>Poly 60% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | white494_wake8<br>投稿494: wake_up+8 | hybrid | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | 21.2 | 9-31-0 | 22.5% | 22.5% (9-31-0) | - | - | 10.7 | 3.4 | shield:176, master_attack:129, wake_up:103 | Ex 22.9%<br>Setup 56.2%<br>LowS 51.5%<br>ShieldConv 50.6%<br>Pygmy 27/148<br>Poly 58.3% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | balanced_attack_monster8<br>balanced: attack_monster+8 | 標準構成でも盤面処理補正が再現するかを見る。 | action attack_monster+8 | 33.2 | 40% | 40% (16-24-0) | - | - | wake_up:166, shield:152, master_attack:104 | Ex 26.2%<br>Setup 52.5%<br>LowS 51.7%<br>ShieldConv 57.2%<br>Pygmy 0/0<br>Poly 0% | 布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | 白マスター限定で、攻撃という同ターンの仕事が残っている低石focusだけを軽く抑える。 | situational whiteLowStoneFocusMissedAttackPenalty:4 | 31.7 | 37.5% | 37.5% (15-25-0) | - | - | shield:126, wake_up:119, master_attack:101 | Ex 26.6%<br>Setup 51.2%<br>LowS 53.1%<br>ShieldConv 42.9%<br>Pygmy 33/167<br>Poly 70% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 31.6 | 37.5% | 37.5% (15-25-0) | - | - | wake_up:125, shield:105, master_attack:75 | Ex 27.5%<br>Setup 48.6%<br>LowS 52.1%<br>ShieldConv 48.6%<br>Pygmy 30/186<br>Poly 60% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | white494_wake8<br>投稿494: wake_up+8 | 投稿白デッキでウェイクアップ補正が再現するかを見る。 | action wake_up+8 | 21.2 | 22.5% | 22.5% (9-31-0) | - | - | shield:176, master_attack:129, wake_up:103 | Ex 22.9%<br>Setup 56.2%<br>LowS 51.5%<br>ShieldConv 50.6%<br>Pygmy 27/148<br>Poly 58.3% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 9 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 5 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 6 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 7 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 6 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 7 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 3 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 8 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 6 / C 4 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 10 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 3 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 5 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 8 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 4 / D 0 | 0F/0W |

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

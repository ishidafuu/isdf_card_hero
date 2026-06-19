# White AI Tuning Loop

生成: 2026-06-19T07:59:38.158Z
候補: 5
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 4 games/matchup/direction
総試合: 160

## Conclusion

首位は `pressure_white_baseline`（score 57.9 / overall 62.5% / vs Black 43.8%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_baseline 43.8% / pressure_white_threat_left_low_stone_setup_guard_light_v1 37.5% / pressure_white_threat_left_low_stone_setup_guard_v1 37.5% / pressure_white_threat_then_setup_v1 25% / pressure_white_threat_left_focus_missed_attack_v1 25%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 57.9 | 20-12-0 | 62.5% | 43.8% (7-9-0) | 87.5% (7-1-0) | 75% (6-2-0) | 12.6 | - | shield:130, wake_up:108, master_attack:80 | - | 0F/0W | - |
| 2 | pressure_white_threat_left_low_stone_setup_guard_light_v1<br>本実装候補: 白脅威残り低石布石抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 46.4 | 15-17-0 | 46.9% | 37.5% (6-10-0) | 50% (4-4-0) | 62.5% (5-3-0) | 12.9 | - | shield:104, wake_up:104, master_attack:73 | - | 0F/0W | 黒に弱い |
| 3 | pressure_white_threat_left_low_stone_setup_guard_v1<br>本実装候補: 白脅威残り低石布石抑制 | hybrid | pressure-normal<br>通常プレッシャー | 41.3 | 12-20-0 | 37.5% | 37.5% (6-10-0) | 37.5% (3-5-0) | 37.5% (3-5-0) | 12.3 | - | shield:148, wake_up:93, master_attack:70 | - | 0F/0W | 黒に弱い |
| 4 | pressure_white_threat_then_setup_v1<br>本実装候補: 白脅威処理後布石 | hybrid | pressure-normal<br>通常プレッシャー | 39.8 | 14-18-0 | 43.8% | 25% (4-12-0) | 50% (4-4-0) | 75% (6-2-0) | 12.3 | - | wake_up:96, shield:92, master_attack:82 | - | 0F/0W | 黒に弱い |
| 5 | pressure_white_threat_left_focus_missed_attack_v1<br>本実装候補: 白脅威残り布石+対黒focus手がかり | hybrid | pressure-normal<br>通常プレッシャー | 38.4 | 13-19-0 | 40.6% | 25% (4-12-0) | 50% (4-4-0) | 62.5% (5-3-0) | 12 | - | shield:130, master_attack:80, wake_up:70 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 57.9 | 62.5% | 43.8% (7-9-0) | 87.5% (7-1-0) | 75% (6-2-0) | shield:130, wake_up:108, master_attack:80 | - | - |
| 2 | pressure_white_threat_left_low_stone_setup_guard_light_v1<br>本実装候補: 白脅威残り低石布石抑制軽量 | 白マスター限定で、敵前衛脅威が残る低石布石だけを軽く抑え、緊急/成果化シールドや仕事が見える起動/集中は残す。 | situational whiteThreatLeftLowStoneSetupPenalty:6 | 46.4 | 46.9% | 37.5% (6-10-0) | 50% (4-4-0) | 62.5% (5-3-0) | shield:104, wake_up:104, master_attack:73 | - | 黒に弱い |
| 3 | pressure_white_threat_left_low_stone_setup_guard_v1<br>本実装候補: 白脅威残り低石布石抑制 | 敵前衛脅威が残るまま石1以下へ落ちる布石を抑え、このターンの処理と次ターンの防御余力を優先する。 | situational whiteThreatLeftLowStoneSetupPenalty:10 | 41.3 | 37.5% | 37.5% (6-10-0) | 37.5% (3-5-0) | 37.5% (3-5-0) | shield:148, wake_up:93, master_attack:70 | - | 黒に弱い |
| 4 | pressure_white_threat_then_setup_v1<br>本実装候補: 白脅威処理後布石 | 脅威源を削ってから低石布石へ移る順序を加点し、全力布石の前に盤面の仕事を済ませる。 | situational whiteThreatSourceAttackBonus:6, whiteSetupAfterThreatReductionBonus:6 | 39.8 | 43.8% | 25% (4-12-0) | 50% (4-4-0) | 75% (6-2-0) | wake_up:96, shield:92, master_attack:82 | - | 黒に弱い |
| 5 | pressure_white_threat_left_focus_missed_attack_v1<br>本実装候補: 白脅威残り布石+対黒focus手がかり | 汎用の脅威残り低石布石抑制に、黒限定で有効だった攻撃見送りfocus抑制を軽く混ぜ、副作用の有無を見る。 | situational whiteThreatLeftLowStoneSetupPenalty:6, whiteLowStoneFocusMissedAttackPenalty:4 | 38.4 | 40.6% | 25% (4-12-0) | 50% (4-4-0) | 62.5% (5-3-0) | shield:130, master_attack:80, wake_up:70 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_threat_then_setup_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |

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

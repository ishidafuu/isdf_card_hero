# White AI Tuning Loop

生成: 2026-06-19T08:09:45.865Z
候補: 4
相手: black_pressure_strong, black_pressure_pressure, decoy_back_stable, white_pressure_strong
試行: 4 games/matchup/direction
総試合: 128

## Conclusion

首位は `pressure_white_black_front_threat_v1`（score 51.7 / overall 56.3% / vs Black 37.5%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +12.5%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_black_front_threat_v1 37.5% / pressure_white_low_stone_focus_missed_attack_light_v1 50% / pressure_white_active_front_work_v1 37.5% / pressure_white_baseline 25%。

### Next Steps

- 次は `pressure_white_low_stone_focus_missed_attack_light_v1` を games-per-matchup 8-12 で確認する。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_black_front_threat_v1<br>本実装候補: 白黒前衛脅威処理+8 | hybrid | pressure-normal<br>通常プレッシャー | 51.7 | 18-14-0 | 56.3% | 37.5% (6-10-0) | 87.5% (7-1-0) | 62.5% (5-3-0) | 13.8 | 3.5 | shield:152, wake_up:106, master_attack:69 | Ex 23.1%<br>Setup 51.2%<br>LowS 52.5%<br>ShieldConv 43.4%<br>Pygmy 22/134<br>Poly 63.6% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 47.3 | 14-18-0 | 43.8% | 50% (8-8-0) | 50% (4-4-0) | 25% (2-6-0) | 12.3 | 3.2 | shield:122, wake_up:106, master_attack:68 | Ex 23.2%<br>Setup 52.5%<br>LowS 54.9%<br>ShieldConv 49.2%<br>Pygmy 31/178<br>Poly 80% | 0F/0W | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_active_front_work_v1<br>本実装候補: 白既存駒前衛仕事+4 | hybrid | pressure-normal<br>通常プレッシャー | 46.9 | 16-16-0 | 50% | 37.5% (6-10-0) | 100% (8-0-0) | 25% (2-6-0) | 13.6 | 2.4 | shield:129, wake_up:114, master_attack:81 | Ex 23.1%<br>Setup 49.4%<br>LowS 52.2%<br>ShieldConv 41.9%<br>Pygmy 30/205<br>Poly 50% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 39.3 | 13-19-0 | 40.6% | 25% (4-12-0) | 75% (6-2-0) | 37.5% (3-5-0) | 12.7 | 3.9 | shield:139, wake_up:102, master_attack:70 | Ex 21.1%<br>Setup 54.4%<br>LowS 52.9%<br>ShieldConv 32.4%<br>Pygmy 36/213<br>Poly 66.7% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_black_front_threat_v1<br>本実装候補: 白黒前衛脅威処理+8 | 白マスター限定で、黒の次ターン打点源になりうる敵前衛を削る時だけ加点する。 | situational whiteBlackFrontThreatBonus:8 | 51.7 | 56.3% | 37.5% (6-10-0) | 87.5% (7-1-0) | 62.5% (5-3-0) | shield:152, wake_up:106, master_attack:69 | Ex 23.1%<br>Setup 51.2%<br>LowS 52.5%<br>ShieldConv 43.4%<br>Pygmy 22/134<br>Poly 63.6% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | 白マスター限定で、攻撃という同ターンの仕事が残っている低石focusだけを軽く抑える。 | situational whiteLowStoneFocusMissedAttackPenalty:4 | 47.3 | 43.8% | 50% (8-8-0) | 50% (4-4-0) | 25% (2-6-0) | shield:122, wake_up:106, master_attack:68 | Ex 23.2%<br>Setup 52.5%<br>LowS 54.9%<br>ShieldConv 49.2%<br>Pygmy 31/178<br>Poly 80% | 黒耐性あり<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_active_front_work_v1<br>本実装候補: 白既存駒前衛仕事+4 | 白マスター限定で、召喚より既存アクティブ駒で敵前衛を削る行動を薄く上げる。 | situational whiteActiveFrontWorkBonus:4 | 46.9 | 50% | 37.5% (6-10-0) | 100% (8-0-0) | 25% (2-6-0) | shield:129, wake_up:114, master_attack:81 | Ex 23.1%<br>Setup 49.4%<br>LowS 52.2%<br>ShieldConv 41.9%<br>Pygmy 30/205<br>Poly 50% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 39.3 | 40.6% | 25% (4-12-0) | 75% (6-2-0) | 37.5% (3-5-0) | shield:139, wake_up:102, master_attack:70 | Ex 21.1%<br>Setup 54.4%<br>LowS 52.9%<br>ShieldConv 32.4%<br>Pygmy 36/213<br>Poly 66.7% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_player | player | white_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_white_pressure_strong_player | player | white_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_white_pressure_strong_cpu | cpu | white_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |

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

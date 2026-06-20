# White AI Tuning Loop

生成: 2026-06-20T01:12:56.595Z
候補: 11
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction
総試合: 176

## Conclusion

首位は `pressure_white_threat_left_focus_missed_attack_v1`（score 49.8 / overall 62.5% / vs Black 62.5%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +37.5%。 安定候補（vs Black 45%以上、0F/1W以下）は 5 件。 上位候補: pressure_white_threat_left_focus_missed_attack_v1 62.5% / pressure_white_low_stone_focus_missed_attack_light_v1 56.3% / pressure_white_shield_quality_second_guard_v1 56.3% / pressure_white_low_stone_focus_conversion_v1 50% / pressure_white_low_stone_focus_missed_attack_v1 50%。

### Next Steps

- 次は `pressure_white_threat_left_focus_missed_attack_v1`, `pressure_white_low_stone_focus_missed_attack_light_v1`, `pressure_white_shield_quality_second_guard_v1`, `pressure_white_low_stone_focus_conversion_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_threat_left_focus_missed_attack_v1<br>本実装候補: 白脅威残り布石+対黒focus手がかり | hybrid | pressure-normal<br>通常プレッシャー | 49.8 | 10-6-0 | 62.5% | 62.5% (10-6-0) | - | - | 10.9 | - | shield:60, wake_up:48, master_attack:31 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 45.4 | 9-7-0 | 56.3% | 56.3% (9-7-0) | - | - | 11.7 | - | wake_up:60, shield:53, master_attack:32 | - | 0F/0W | 黒耐性あり |
| 3 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | hybrid | pressure-normal<br>通常プレッシャー | 45.4 | 9-7-0 | 56.3% | 56.3% (9-7-0) | - | - | 10.6 | - | shield:52, wake_up:42, master_attack:36 | - | 0F/0W | 黒耐性あり |
| 4 | pressure_white_low_stone_focus_conversion_v1<br>本実装候補: 白低石focus成果化+8 | hybrid | pressure-normal<br>通常プレッシャー | 41 | 8-8-0 | 50% | 50% (8-8-0) | - | - | 9.4 | - | wake_up:43, shield:37, master_attack:17 | - | 0F/0W | 黒耐性あり |
| 5 | pressure_white_low_stone_focus_missed_attack_v1<br>本実装候補: 白低石focus攻撃見送り抑制 | hybrid | pressure-normal<br>通常プレッシャー | 41 | 8-8-0 | 50% | 50% (8-8-0) | - | - | 9.7 | - | wake_up:39, shield:36, master_attack:18 | - | 0F/0W | 黒耐性あり |
| 6 | pressure_white_closeout_after_shield_v1<br>本実装候補: 白盾後詰め+8 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 9.9 | - | shield:48, wake_up:37, master_attack:29 | - | 0F/0W | 黒に弱い |
| 7 | pressure_white_next_turn_plan_quality_v1<br>本実装候補: 白次ターン布石品質 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 11.5 | - | wake_up:52, shield:41, master_attack:36 | - | 0F/0W | 黒に弱い |
| 8 | pressure_white_threat_left_low_stone_setup_guard_v1<br>本実装候補: 白脅威残り低石布石抑制 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 10.9 | - | wake_up:53, shield:46, master_attack:30 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_threat_left_focus_missed_attack_v1<br>本実装候補: 白脅威残り布石+対黒focus手がかり | 汎用の脅威残り低石布石抑制に、黒限定で有効だった攻撃見送りfocus抑制を軽く混ぜ、副作用の有無を見る。 | situational whiteThreatLeftLowStoneSetupPenalty:6, whiteLowStoneFocusMissedAttackPenalty:4 | 49.8 | 62.5% | 62.5% (10-6-0) | - | - | shield:60, wake_up:48, master_attack:31 | - | 黒耐性あり |
| 2 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | 白マスター限定で、攻撃という同ターンの仕事が残っている低石focusだけを軽く抑える。 | situational whiteLowStoneFocusMissedAttackPenalty:4 | 45.4 | 56.3% | 56.3% (9-7-0) | - | - | wake_up:60, shield:53, master_attack:32 | - | 黒耐性あり |
| 3 | pressure_white_shield_quality_second_guard_v1<br>本実装候補: 白盾品質+2枚目抑制 | 質の高い盾を押しつつ、2枚目低石シールドの全力投入を抑える。 | situational whiteShieldThreatConversionBonus:8, whiteSecondShieldLowStonePenalty:8 | 45.4 | 56.3% | 56.3% (9-7-0) | - | - | shield:52, wake_up:42, master_attack:36 | - | 黒耐性あり |
| 4 | pressure_white_low_stone_focus_conversion_v1<br>本実装候補: 白低石focus成果化+8 | 白マスター限定で、低石でも次ターン攻撃/レベルアップへ変換できるfocusだけを加点する。 | situational whiteLowStoneFocusConversionBonus:8 | 41 | 50% | 50% (8-8-0) | - | - | wake_up:43, shield:37, master_attack:17 | - | 黒耐性あり |
| 5 | pressure_white_low_stone_focus_missed_attack_v1<br>本実装候補: 白低石focus攻撃見送り抑制 | 白マスター限定で、攻撃可能なのに低石focusで布石へ寄る局面を抑え、このターンの仕事を優先する。 | situational whiteLowStoneFocusMissedAttackPenalty:8 | 41 | 50% | 50% (8-8-0) | - | - | wake_up:39, shield:36, master_attack:18 | - | 黒耐性あり |
| 6 | pressure_white_closeout_after_shield_v1<br>本実装候補: 白盾後詰め+8 | 既に守った駒がいる局面で、相手HP3以下へ詰める手を加点して守り続けを避ける。 | situational whiteCloseoutAfterShieldBonus:8 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | shield:48, wake_up:37, master_attack:29 | - | 黒に弱い |
| 7 | pressure_white_next_turn_plan_quality_v1<br>本実装候補: 白次ターン布石品質 | 盾/起動の対象品質と、守った後の詰めを同時に見る本命複合候補。 | situational whiteShieldThreatConversionBonus:8, whiteWakeImmediateWorkBonus:8, whiteCloseoutAfterShieldBonus:6 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:52, shield:41, master_attack:36 | - | 黒に弱い |
| 8 | pressure_white_threat_left_low_stone_setup_guard_v1<br>本実装候補: 白脅威残り低石布石抑制 | 敵前衛脅威が残るまま石1以下へ落ちる布石を抑え、このターンの処理と次ターンの防御余力を優先する。 | situational whiteThreatLeftLowStoneSetupPenalty:10 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:53, shield:46, master_attack:30 | - | 黒に弱い |
| 9 | pressure_white_focus_wake_quality_light_v1<br>本実装候補: 白focus/wake布石品質軽量 | focus/wake品質加点を薄く入れ、+8複合の上振れや守り寄り副作用を抑える。 | situational whiteLowStoneFocusConversionBonus:4, whiteWakeSafeWorkBonus:4 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:65, wake_up:40, master_attack:20 | - | 黒に弱い |
| 10 | pressure_white_threat_left_low_stone_setup_guard_light_v1<br>本実装候補: 白脅威残り低石布石抑制軽量 | 白マスター限定で、敵前衛脅威が残る低石布石だけを軽く抑え、緊急/成果化シールドや仕事が見える起動/集中は残す。 | situational whiteThreatLeftLowStoneSetupPenalty:6 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:59, wake_up:51, master_attack:24 | - | 黒に弱い |
| 11 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 23.5 | 25% | 25% (4-12-0) | - | - | shield:54, wake_up:46, master_attack:41 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_closeout_after_shield_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_next_turn_plan_quality_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_shield_quality_second_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_conversion_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_focus_wake_quality_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_left_low_stone_setup_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_threat_left_focus_missed_attack_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |

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

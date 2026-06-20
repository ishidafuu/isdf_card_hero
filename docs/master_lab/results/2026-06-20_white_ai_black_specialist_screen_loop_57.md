# White AI Tuning Loop

生成: 2026-06-20T00:27:54.815Z
候補: 9
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction
総試合: 144

## Conclusion

首位は `pressure_attack_monster_plus4`（score 45.4 / overall 56.3% / vs Black 56.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +18.8%。 安定候補（vs Black 45%以上、0F/1W以下）は 2 件。 上位候補: pressure_attack_monster_plus4 56.3% / pressure_white_vs_black_attack4_front16_v1 50% / pressure_attack_monster_plus6 37.5% / pressure_attack_monster_plus8 37.5% / pressure_white_baseline 37.5%。

### Next Steps

- 次は `pressure_attack_monster_plus4`, `pressure_white_vs_black_attack4_front16_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 45.4 | 9-7-0 | 56.3% | 56.3% (9-7-0) | - | - | 10.8 | - | shield:49, wake_up:47, master_attack:34 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_vs_black_attack4_front16_v1<br>対黒専用: attack_monster+4 / 黒前衛脅威+16 | hybrid | pressure-normal<br>通常プレッシャー | 41 | 8-8-0 | 50% | 50% (8-8-0) | - | - | 11.6 | - | shield:50, wake_up:49, master_attack:43 | - | 0F/0W | 黒耐性あり |
| 3 | pressure_attack_monster_plus6<br>攻撃: attack_monster+6 | action_bias | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 10.4 | - | wake_up:43, master_attack:40, shield:38 | - | 0F/0W | 黒に弱い |
| 4 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | action_bias | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 10.8 | - | wake_up:53, shield:48, master_attack:31 | - | 0F/0W | 黒に弱い |
| 5 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 11.1 | - | shield:62, wake_up:49, master_attack:31 | - | 0F/0W | 黒に弱い |
| 6 | pressure_white_vs_black_attack4_focus_guard_v1<br>対黒専用: attack_monster+4 / 低石focus抑制 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 11.5 | - | wake_up:61, shield:58, master_attack:36 | - | 0F/0W | 黒に弱い |
| 7 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 9.9 | - | shield:47, wake_up:41, master_attack:26 | - | 0F/0W | 黒に弱い |
| 8 | pressure_white_vs_black_attack4_front16_focus_guard_v1<br>対黒専用: attack_monster+4 / 黒前衛+16 / focus抑制 | hybrid | pressure-normal<br>通常プレッシャー | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 9.5 | - | shield:40, wake_up:33, master_attack:28 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 45.4 | 56.3% | 56.3% (9-7-0) | - | - | shield:49, wake_up:47, master_attack:34 | - | 黒耐性あり |
| 2 | pressure_white_vs_black_attack4_front16_v1<br>対黒専用: attack_monster+4 / 黒前衛脅威+16 | 対黒専用候補。盤面処理を薄く押しつつ、バーサク打点源になる黒前衛処理を採用値+8より強める。 | action attack_monster+4<br>situational whiteBlackFrontThreatBonus:16 | 41 | 50% | 50% (8-8-0) | - | - | shield:50, wake_up:49, master_attack:43 | - | 黒耐性あり |
| 3 | pressure_attack_monster_plus6<br>攻撃: attack_monster+6 | 盤面制圧補正を+4より少し強め、黒耐性と白基準への勝ちすぎを確認する。 | action attack_monster+6 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:43, master_attack:40, shield:38 | - | 黒に弱い |
| 4 | pressure_attack_monster_plus8<br>攻撃: attack_monster+8 | 盤面制圧を少し厚くし、黒の前のめり展開を止める。 | action attack_monster+8 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:53, shield:48, master_attack:31 | - | 黒に弱い |
| 5 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | shield:62, wake_up:49, master_attack:31 | - | 黒に弱い |
| 6 | pressure_white_vs_black_attack4_focus_guard_v1<br>対黒専用: attack_monster+4 / 低石focus抑制 | 対黒専用候補。盤面処理を薄く押しつつ、攻撃可能なのに低石focusへ寄る黒戦の負け筋を軽く抑える。 | action attack_monster+4<br>situational whiteLowStoneFocusMissedAttackPenalty:4 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | wake_up:61, shield:58, master_attack:36 | - | 黒に弱い |
| 7 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | 白マスター限定で、攻撃という同ターンの仕事が残っている低石focusだけを軽く抑える。 | situational whiteLowStoneFocusMissedAttackPenalty:4 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:47, wake_up:41, master_attack:26 | - | 黒に弱い |
| 8 | pressure_white_vs_black_attack4_front16_focus_guard_v1<br>対黒専用: attack_monster+4 / 黒前衛+16 / focus抑制 | 対黒専用候補。盤面処理、黒前衛処理、低石focus抑制を軽く複合し、速攻への押し返し性能を見る。 | action attack_monster+4<br>situational whiteBlackFrontThreatBonus:16, whiteLowStoneFocusMissedAttackPenalty:4 | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:40, wake_up:33, master_attack:28 | - | 黒に弱い |
| 9 | pressure_white_black_front_threat_plus16_v1<br>本実装候補: 白黒前衛脅威処理+16 | 黒前衛打点源処理をかなり強め、白の育成/防御を壊さない上限を確認する。 | situational whiteBlackFrontThreatBonus:16 | 23.5 | 25% | 25% (4-12-0) | - | - | wake_up:48, master_attack:38, shield:37 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus6_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_focus_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_focus_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_focus_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_focus_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_focus_guard_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_focus_guard_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_focus_guard_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_focus_guard_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |

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

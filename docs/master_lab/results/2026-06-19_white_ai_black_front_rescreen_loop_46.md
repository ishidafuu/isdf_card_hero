# White AI Tuning Loop

生成: 2026-06-19T08:05:08.421Z
候補: 6
相手: black_pressure_strong, black_pressure_pressure
試行: 3 games/matchup/direction
総試合: 72

## Conclusion

首位は `pressure_white_black_front_threat_v1`（score 46.8 / overall 58.3% / vs Black 58.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +16.6%。 安定候補（vs Black 45%以上、0F/1W以下）は 3 件。 上位候補: pressure_white_black_front_threat_v1 58.3% / pressure_white_active_front_work_v1 50% / pressure_white_low_stone_focus_missed_attack_light_v1 50% / pressure_white_baseline 41.7% / pressure_white_pygmy_front_setup_v1 41.7%。

### Next Steps

- 次は `pressure_white_black_front_threat_v1`, `pressure_white_active_front_work_v1`, `pressure_white_low_stone_focus_missed_attack_light_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_black_front_threat_v1<br>本実装候補: 白黒前衛脅威処理+8 | hybrid | pressure-normal<br>通常プレッシャー | 46.8 | 7-5-0 | 58.3% | 58.3% (7-5-0) | - | - | 10.8 | - | wake_up:41, shield:31, master_attack:21 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_active_front_work_v1<br>本実装候補: 白既存駒前衛仕事+4 | hybrid | pressure-normal<br>通常プレッシャー | 41 | 6-6-0 | 50% | 50% (6-6-0) | - | - | 9.8 | - | wake_up:46, shield:30, master_attack:9 | - | 0F/0W | 黒耐性あり |
| 3 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | hybrid | pressure-normal<br>通常プレッシャー | 41 | 6-6-0 | 50% | 50% (6-6-0) | - | - | 10.3 | - | wake_up:36, shield:34, master_attack:32 | - | 0F/0W | 黒耐性あり |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 35.2 | 5-7-0 | 41.7% | 41.7% (5-7-0) | - | - | 9.8 | - | shield:40, wake_up:34, master_attack:15 | - | 0F/0W | - |
| 5 | pressure_white_pygmy_front_setup_v1<br>本実装候補: 白ピグミィ撃破圏+10 | hybrid | pressure-normal<br>通常プレッシャー | 35.2 | 5-7-0 | 41.7% | 41.7% (5-7-0) | - | - | 10.6 | - | shield:50, wake_up:40, master_attack:23 | - | 0F/0W | - |
| 6 | pressure_white_threat_source_attack_light_v1<br>本実装候補: 白脅威源攻撃+4 | hybrid | pressure-normal<br>通常プレッシャー | 23.5 | 3-9-0 | 25% | 25% (3-9-0) | - | - | 9.3 | - | shield:35, wake_up:26, master_attack:21 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_black_front_threat_v1<br>本実装候補: 白黒前衛脅威処理+8 | 白マスター限定で、黒の次ターン打点源になりうる敵前衛を削る時だけ加点する。 | situational whiteBlackFrontThreatBonus:8 | 46.8 | 58.3% | 58.3% (7-5-0) | - | - | wake_up:41, shield:31, master_attack:21 | - | 黒耐性あり |
| 2 | pressure_white_active_front_work_v1<br>本実装候補: 白既存駒前衛仕事+4 | 白マスター限定で、召喚より既存アクティブ駒で敵前衛を削る行動を薄く上げる。 | situational whiteActiveFrontWorkBonus:4 | 41 | 50% | 50% (6-6-0) | - | - | wake_up:46, shield:30, master_attack:9 | - | 黒耐性あり |
| 3 | pressure_white_low_stone_focus_missed_attack_light_v1<br>本実装候補: 白低石focus攻撃見送り抑制軽量 | 白マスター限定で、攻撃という同ターンの仕事が残っている低石focusだけを軽く抑える。 | situational whiteLowStoneFocusMissedAttackPenalty:4 | 41 | 50% | 50% (6-6-0) | - | - | wake_up:36, shield:34, master_attack:32 | - | 黒耐性あり |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 35.2 | 41.7% | 41.7% (5-7-0) | - | - | shield:40, wake_up:34, master_attack:15 | - | - |
| 5 | pressure_white_pygmy_front_setup_v1<br>本実装候補: 白ピグミィ撃破圏+10 | 白マスター限定で、ピグミィが敵前衛を撃破圏へ入れる小打点を評価する。 | situational whitePygmyFrontSetupBonus:10 | 35.2 | 41.7% | 41.7% (5-7-0) | - | - | shield:50, wake_up:40, master_attack:23 | - | - |
| 6 | pressure_white_threat_source_attack_light_v1<br>本実装候補: 白脅威源攻撃+4 | 敵前衛の打点源処理を軽く押し、Decoyや白ミラーへの副作用を確認する。 | situational whiteThreatSourceAttackBonus:4 | 23.5 | 25% | 25% (3-9-0) | - | - | shield:35, wake_up:26, master_attack:21 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 0 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_black_front_threat_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 3 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_active_front_work_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_pygmy_front_setup_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_pygmy_front_setup_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_pygmy_front_setup_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_pygmy_front_setup_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 0 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |
| pressure_white_low_stone_focus_missed_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 0 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 2 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 1 / D 0 | 0F/0W |

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

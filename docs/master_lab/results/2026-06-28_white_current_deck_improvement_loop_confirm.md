# White AI Tuning Loop

生成: 2026-06-27T16:11:50.323Z
候補: 5
相手: black_pressure_strong, black_1375_pressure, decoy_back_stable, white_current_mirror
試行: 2 games/matchup/direction
総試合: 80

## Conclusion

首位は `current_threat_source_attack8`（score 73.4 / overall 75% / vs Black 62.5%）。 安定候補（vs Black 45%以上、0F/1W以下）は 3 件。 上位候補: current_threat_source_attack8 62.5% / current_white_baseline 50% / current_strong_profile 62.5% / current_front_work_light 37.5% / current_shield_wake_quality 12.5%。

### Next Steps

- 次は `current_threat_source_attack8`, `current_white_baseline`, `current_strong_profile` を games-per-matchup 8-12 で確認する。
- 首位はシールド寄り。確認ループでは `wake_up` 補正を少し足す条件を横に置き、守った後の勝ち切り不足を確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | current_threat_source_attack8<br>候補: 脅威源攻撃 8 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 73.4 | 12-4-0 | 75% | 62.5% (5-3-0) | 100% (4-0-0) | 75% (3-1-0) | 15.4 | 4.3 | shield:94, master_attack:66, wake_up:31 | Ex 22.5%<br>Setup 54.3%<br>LowS 24.7%<br>ShieldConv 47.9%<br>Pygmy 49/173<br>Poly 85.7% | 0F/0W | 黒耐性あり<br>シールド偏重<br>盾の成果化不足 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | baseline | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 56.3 | 9-7-0 | 56.3% | 50% (4-4-0) | 100% (4-0-0) | 25% (1-3-0) | 17.6 | 5.3 | shield:126, master_attack:79, wake_up:45 | Ex 20.7%<br>Setup 56.3%<br>LowS 25.9%<br>ShieldConv 38.9%<br>Pygmy 52/203<br>Poly 81.5% | 0F/0W | 黒耐性あり<br>シールド偏重<br>盾の成果化不足 |
| 3 | current_strong_profile<br>比較: デスシープ3 / strong | baseline | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 55 | 8-8-0 | 50% | 62.5% (5-3-0) | 50% (2-2-0) | 25% (1-3-0) | 11.9 | 3.8 | shield:117, master_attack:39, wake_up:9 | Ex 22%<br>Setup 51.4%<br>LowS 35.7%<br>ShieldConv 58.1%<br>Pygmy 26/163<br>Poly 71.4% | 0F/0W | 黒耐性あり<br>シールド偏重<br>布石後の石枯渇 |
| 4 | current_front_work_light<br>候補: 既存前衛仕事 48 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 45.3 | 8-8-0 | 50% | 37.5% (3-5-0) | 75% (3-1-0) | 50% (2-2-0) | 16.3 | 5.8 | shield:84, master_attack:75, wake_up:26 | Ex 21.2%<br>Setup 53.7%<br>LowS 29%<br>ShieldConv 50%<br>Pygmy 50/193<br>Poly 76.5% | 0F/1W | warning 1<br>黒に弱い<br>シールド偏重<br>盾の成果化不足 |
| 5 | current_shield_wake_quality<br>候補: 盾/起動品質 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 34.8 | 6-10-0 | 37.5% | 12.5% (1-7-0) | 100% (4-0-0) | 25% (1-3-0) | 18.8 | 3.8 | master_attack:100, shield:99, wake_up:36 | Ex 20.7%<br>Setup 54%<br>LowS 28.2%<br>ShieldConv 45.5%<br>Pygmy 57/175<br>Poly 66.7% | 0F/0W | 黒に弱い<br>シールド偏重<br>盾の成果化不足 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | current_threat_source_attack8<br>候補: 脅威源攻撃 8 | 脅威源処理を強め、黒/デコイ/白ミラーへの副作用を確認する。 | situational whiteThreatSourceAttackBonus:8 | 73.4 | 75% | 62.5% (5-3-0) | 100% (4-0-0) | 75% (3-1-0) | shield:94, master_attack:66, wake_up:31 | Ex 22.5%<br>Setup 54.3%<br>LowS 24.7%<br>ShieldConv 47.9%<br>Pygmy 49/173<br>Poly 85.7% | 黒耐性あり<br>シールド偏重<br>盾の成果化不足 |
| 2 | current_white_baseline<br>現行: デスシープ3 / white | 暫定白最強デッキで現行white profileを基準化する。 | - | 56.3 | 56.3% | 50% (4-4-0) | 100% (4-0-0) | 25% (1-3-0) | shield:126, master_attack:79, wake_up:45 | Ex 20.7%<br>Setup 56.3%<br>LowS 25.9%<br>ShieldConv 38.9%<br>Pygmy 52/203<br>Poly 81.5% | 黒耐性あり<br>シールド偏重<br>盾の成果化不足 |
| 3 | current_strong_profile<br>比較: デスシープ3 / strong | 白専用補正が本当に必要かを確認するため、strong profileを横に置く。 | - | 55 | 50% | 62.5% (5-3-0) | 50% (2-2-0) | 25% (1-3-0) | shield:117, master_attack:39, wake_up:9 | Ex 22%<br>Setup 51.4%<br>LowS 35.7%<br>ShieldConv 58.1%<br>Pygmy 26/163<br>Poly 71.4% | 黒耐性あり<br>シールド偏重<br>布石後の石枯渇 |
| 4 | current_front_work_light<br>候補: 既存前衛仕事 48 | デスシープで前衛が厚くなったため、現行72が押しすぎていないか軽量化を見る。 | situational whiteActiveFrontWorkBonus:48 | 45.3 | 50% | 37.5% (3-5-0) | 75% (3-1-0) | 50% (2-2-0) | shield:84, master_attack:75, wake_up:26 | Ex 21.2%<br>Setup 53.7%<br>LowS 29%<br>ShieldConv 50%<br>Pygmy 50/193<br>Poly 76.5% | warning 1<br>黒に弱い<br>シールド偏重<br>盾の成果化不足 |
| 5 | current_shield_wake_quality<br>候補: 盾/起動品質 | 守る価値のある盾と仕事へ変換できる起動だけを少し押す。 | situational whiteShieldThreatConversionBonus:8, whiteWakeSafeWorkBonus:4 | 34.8 | 37.5% | 12.5% (1-7-0) | 100% (4-0-0) | 25% (1-3-0) | master_attack:100, shield:99, wake_up:36 | Ex 20.7%<br>Setup 54%<br>LowS 28.2%<br>ShieldConv 45.5%<br>Pygmy 57/175<br>Poly 66.7% | 黒に弱い<br>シールド偏重<br>盾の成果化不足 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| current_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| current_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| current_white_baseline_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 1 / D 0 | 0F/0W |
| current_white_baseline_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 1 / D 0 | 0F/0W |
| current_white_baseline_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| current_white_baseline_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| current_white_baseline_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 1 / D 0 | 0F/0W |
| current_white_baseline_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 2 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 0 / C 2 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 1 / D 0 | 0F/0W |
| current_threat_source_attack8_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 0 / C 2 / D 0 | 0F/0W |
| current_front_work_light_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| current_front_work_light_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| current_front_work_light_vs_black_1375_pressure_player | player | black_1375_pressure | P 0 / C 2 / D 0 | 0F/0W |
| current_front_work_light_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 1 / D 0 | 0F/0W |
| current_front_work_light_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| current_front_work_light_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| current_front_work_light_vs_white_current_mirror_player | player | white_current_mirror | P 2 / C 0 / D 0 | 0F/1W |
| current_front_work_light_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 2 / C 0 / D 0 | 0F/0W |
| current_strong_profile_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 1 / D 0 | 0F/0W |
| current_strong_profile_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| current_strong_profile_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 1 / D 0 | 0F/0W |
| current_strong_profile_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 1 / D 0 | 0F/0W |
| current_strong_profile_vs_decoy_back_stable_player | player | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| current_strong_profile_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 1 / C 1 / D 0 | 0F/0W |
| current_strong_profile_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 2 / D 0 | 0F/0W |
| current_strong_profile_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 1 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 2 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 0 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 1 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 2 / C 0 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_decoy_back_stable_player | player | decoy_back_stable | P 2 / C 0 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_decoy_back_stable_cpu | cpu | decoy_back_stable | P 0 / C 2 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 1 / D 0 | 0F/0W |
| current_shield_wake_quality_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 2 / C 0 / D 0 | 0F/0W |

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

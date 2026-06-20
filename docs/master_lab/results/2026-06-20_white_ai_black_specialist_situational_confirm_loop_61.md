# White AI Tuning Loop

生成: 2026-06-20T00:41:16.508Z
候補: 4
相手: black_pressure_strong, black_pressure_pressure
試行: 6 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_white_monster_pressure_v1`（score 47.6 / overall 58.3% / vs Black 58.3%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +37.5%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_monster_pressure_v1 58.3% / pressure_white_threat_source_attack_light_v1 37.5% / pressure_attack_monster_plus4 33.3% / pressure_white_baseline 20.8%。

### Next Steps

- 次は `pressure_white_monster_pressure_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | hybrid | pressure-normal<br>通常プレッシャー | 47.6 | 14-10-0 | 58.3% | 58.3% (14-10-0) | - | - | 9.5 | 3 | wake_up:59, master_attack:45, shield:45 | Ex 27.9%<br>Setup 49.3%<br>LowS 53.3%<br>ShieldConv 48.9%<br>Pygmy 11/83<br>Poly 100% | 0F/0W | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_threat_source_attack_light_v1<br>本実装候補: 白脅威源攻撃+4 | hybrid | pressure-normal<br>通常プレッシャー | 32.3 | 9-15-0 | 37.5% | 37.5% (9-15-0) | - | - | 9.9 | 3.1 | shield:59, wake_up:57, master_attack:51 | Ex 27.6%<br>Setup 50.4%<br>LowS 55.3%<br>ShieldConv 45.8%<br>Pygmy 28/104<br>Poly 83.3% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 29.3 | 8-16-0 | 33.3% | 33.3% (8-16-0) | - | - | 9.8 | 3.1 | shield:66, wake_up:60, master_attack:40 | Ex 27%<br>Setup 49.3%<br>LowS 54.1%<br>ShieldConv 47%<br>Pygmy 15/121<br>Poly 80% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 19.5 | 5-19-0 | 20.8% | 20.8% (5-19-0) | - | - | 11 | 3.1 | wake_up:80, shield:76, master_attack:49 | Ex 26.1%<br>Setup 49.6%<br>LowS 51.3%<br>ShieldConv 39.5%<br>Pygmy 13/80<br>Poly 57.1% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_monster_pressure_v1<br>本実装候補: 白盤面処理+4 | 白マスター限定で、敵モンスターへの実ダメージ/撃破評価だけを薄く上げる。 | situational whiteMonsterPressureBonus:4 | 47.6 | 58.3% | 58.3% (14-10-0) | - | - | wake_up:59, master_attack:45, shield:45 | Ex 27.9%<br>Setup 49.3%<br>LowS 53.3%<br>ShieldConv 48.9%<br>Pygmy 11/83<br>Poly 100% | 黒耐性あり<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_threat_source_attack_light_v1<br>本実装候補: 白脅威源攻撃+4 | 敵前衛の打点源処理を軽く押し、Decoyや白ミラーへの副作用を確認する。 | situational whiteThreatSourceAttackBonus:4 | 32.3 | 37.5% | 37.5% (9-15-0) | - | - | shield:59, wake_up:57, master_attack:51 | Ex 27.6%<br>Setup 50.4%<br>LowS 55.3%<br>ShieldConv 45.8%<br>Pygmy 28/104<br>Poly 83.3% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 29.3 | 33.3% | 33.3% (8-16-0) | - | - | shield:66, wake_up:60, master_attack:40 | Ex 27%<br>Setup 49.3%<br>LowS 54.1%<br>ShieldConv 47%<br>Pygmy 15/121<br>Poly 80% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |
| 4 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 19.5 | 20.8% | 20.8% (5-19-0) | - | - | wake_up:80, shield:76, master_attack:49 | Ex 26.1%<br>Setup 49.6%<br>LowS 51.3%<br>ShieldConv 39.5%<br>Pygmy 13/80<br>Poly 57.1% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 4 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 1 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 5 / C 1 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 2 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_monster_pressure_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 5 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 3 / D 0 | 0F/0W |
| pressure_white_threat_source_attack_light_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 0 / D 0 | 0F/0W |

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

# White AI Tuning Loop

生成: 2026-06-20T00:31:37.278Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure
試行: 8 games/matchup/direction
総試合: 96

## Conclusion

首位は `pressure_attack_monster_plus4`（score 35.8 / overall 43.8% / vs Black 43.8%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +12.5%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_attack_monster_plus4 43.8% / pressure_white_vs_black_attack4_front16_v1 34.4% / pressure_white_baseline 31.3%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | action_bias | pressure-normal<br>通常プレッシャー | 35.8 | 14-18-0 | 43.8% | 43.8% (14-18-0) | - | - | 10.7 | 3.8 | shield:110, wake_up:100, master_attack:60 | Ex 24%<br>Setup 53.1%<br>LowS 54.1%<br>ShieldConv 42.7%<br>Pygmy 33/230<br>Poly 61.5% | 0F/0W | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_vs_black_attack4_front16_v1<br>対黒専用: attack_monster+4 / 黒前衛脅威+16 | hybrid | pressure-normal<br>通常プレッシャー | 28.5 | 11-21-0 | 34.4% | 34.4% (11-21-0) | - | - | 10.4 | 2.8 | wake_up:100, shield:74, master_attack:71 | Ex 27.7%<br>Setup 50.7%<br>LowS 52.4%<br>ShieldConv 52.7%<br>Pygmy 31/102<br>Poly 33.3% | 0F/0W | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 26.4 | 10-22-0 | 31.3% | 31.3% (10-22-0) | - | - | 10.6 | 3.2 | wake_up:101, shield:91, master_attack:62 | Ex 25.2%<br>Setup 52.1%<br>LowS 52.1%<br>ShieldConv 29.7%<br>Pygmy 28/144<br>Poly 57.1% | 0F/0W | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_attack_monster_plus4<br>攻撃: attack_monster+4 | 盤面制圧補正を薄く入れ、+8より副作用が少ないか見る。 | action attack_monster+4 | 35.8 | 43.8% | 43.8% (14-18-0) | - | - | shield:110, wake_up:100, master_attack:60 | Ex 24%<br>Setup 53.1%<br>LowS 54.1%<br>ShieldConv 42.7%<br>Pygmy 33/230<br>Poly 61.5% | 盾の成果化不足<br>布石後の石枯渇 |
| 2 | pressure_white_vs_black_attack4_front16_v1<br>対黒専用: attack_monster+4 / 黒前衛脅威+16 | 対黒専用候補。盤面処理を薄く押しつつ、バーサク打点源になる黒前衛処理を採用値+8より強める。 | action attack_monster+4<br>situational whiteBlackFrontThreatBonus:16 | 28.5 | 34.4% | 34.4% (11-21-0) | - | - | wake_up:100, shield:74, master_attack:71 | Ex 27.7%<br>Setup 50.7%<br>LowS 52.4%<br>ShieldConv 52.7%<br>Pygmy 31/102<br>Poly 33.3% | 黒に弱い<br>惜敗多め<br>盾の成果化不足<br>布石後の石枯渇 |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 26.4 | 31.3% | 31.3% (10-22-0) | - | - | wake_up:101, shield:91, master_attack:62 | Ex 25.2%<br>Setup 52.1%<br>LowS 52.1%<br>ShieldConv 29.7%<br>Pygmy 28/144<br>Poly 57.1% | 黒に弱い<br>盾の成果化不足<br>布石後の石枯渇 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 7 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_player | player | black_pressure_strong | P 5 / C 3 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 4 / C 4 / D 0 | 0F/0W |
| pressure_attack_monster_plus4_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 7 / C 1 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 6 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 4 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 3 / C 5 / D 0 | 0F/0W |
| pressure_white_vs_black_attack4_front16_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 6 / C 2 / D 0 | 0F/0W |

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

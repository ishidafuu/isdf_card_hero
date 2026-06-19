# White AI Tuning Loop

生成: 2026-06-19T14:21:40.461Z
候補: 3
相手: black_pressure_strong, black_pressure_pressure
試行: 5 games/matchup/direction
総試合: 60

## Conclusion

首位は `pressure_white_black_front_threat_plus16_v1`（score 41 / overall 50% / vs Black 50%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +15%。 安定候補（vs Black 45%以上、0F/1W以下）は 1 件。 上位候補: pressure_white_black_front_threat_plus16_v1 50% / pressure_white_black_front_threat_plus12_v1 40% / pressure_white_baseline 35%。

### Next Steps

- 次は `pressure_white_black_front_threat_plus16_v1` を games-per-matchup 8-12 で確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_black_front_threat_plus16_v1<br>本実装候補: 白黒前衛脅威処理+16 | hybrid | pressure-normal<br>通常プレッシャー | 41 | 10-10-0 | 50% | 50% (10-10-0) | - | - | 10.9 | - | shield:68, wake_up:59, master_attack:42 | - | 0F/0W | 黒耐性あり |
| 2 | pressure_white_black_front_threat_plus12_v1<br>本実装候補: 白黒前衛脅威処理+12 | hybrid | pressure-normal<br>通常プレッシャー | 34 | 8-12-0 | 40% | 40% (8-12-0) | - | - | 10.5 | - | wake_up:71, shield:55, master_attack:46 | - | 0F/0W | - |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 30.5 | 7-13-0 | 35% | 35% (7-13-0) | - | - | 10 | - | wake_up:54, shield:52, master_attack:36 | - | 0F/0W | 黒に弱い |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_black_front_threat_plus16_v1<br>本実装候補: 白黒前衛脅威処理+16 | 黒前衛打点源処理をかなり強め、白の育成/防御を壊さない上限を確認する。 | situational whiteBlackFrontThreatBonus:16 | 41 | 50% | 50% (10-10-0) | - | - | shield:68, wake_up:59, master_attack:42 | - | 黒耐性あり |
| 2 | pressure_white_black_front_threat_plus12_v1<br>本実装候補: 白黒前衛脅威処理+12 | 採用済み+8より黒前衛打点源処理を強め、過剰前衛攻撃にならない上限を確認する。 | situational whiteBlackFrontThreatBonus:12 | 34 | 40% | 40% (8-12-0) | - | - | wake_up:71, shield:55, master_attack:46 | - | - |
| 3 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 30.5 | 35% | 35% (7-13-0) | - | - | wake_up:54, shield:52, master_attack:36 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 5 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus12_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus12_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 2 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus12_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 4 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus12_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 4 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |
| pressure_white_black_front_threat_plus16_v1_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 3 / D 0 | 0F/0W |

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

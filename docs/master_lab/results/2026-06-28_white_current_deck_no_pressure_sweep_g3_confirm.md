# White AI Tuning Loop

生成: 2026-06-28T05:38:02.566Z
候補: 3
相手: black_1375_pressure, white_current_mirror
試行: 3 games/matchup/direction
総試合: 36

## Conclusion

首位は `current_white_baseline`（score 43.3 / overall 50% / vs Black 66.7%）。 安定候補（vs Black 45%以上、0F/1W以下）は 2 件。 上位候補: current_white_baseline 66.7% / current_shield_no_pressure4_wake4 50% / current_shield_no_pressure8_wake4 33.3%。

### Next Steps

- 次は `current_white_baseline`, `current_shield_no_pressure4_wake4` を games-per-matchup 8-12 で確認する。
- 首位はシールド寄り。確認ループでは `wake_up` 補正を少し足す条件を横に置き、守った後の勝ち切り不足を確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | baseline | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 43.3 | 6-6-0 | 50% | 66.7% (4-2-0) | - | 33.3% (2-4-0) | 15.7 | - | shield:90, master_attack:63, wake_up:22 | - | 0F/1W | warning 1<br>黒耐性あり<br>シールド偏重 |
| 2 | current_shield_no_pressure4_wake4<br>候補: ノープレッシャー盾抑制 4 / 安全ウェイク 4 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 40.7 | 5-7-0 | 41.7% | 50% (3-3-0) | - | 33.3% (2-4-0) | 15.9 | - | shield:88, master_attack:54, wake_up:25 | - | 0F/0W | 黒耐性あり<br>シールド偏重 |
| 3 | current_shield_no_pressure8_wake4<br>候補: ノープレッシャー盾抑制 8 / 安全ウェイク 4 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 34.3 | 5-7-0 | 41.7% | 33.3% (2-4-0) | - | 50% (3-3-0) | 17.1 | - | shield:78, master_attack:67, wake_up:27 | - | 0F/0W | 黒に弱い<br>シールド偏重 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | current_white_baseline<br>現行: デスシープ3 / white | 暫定白最強デッキで現行white profileを基準化する。 | - | 43.3 | 50% | 66.7% (4-2-0) | - | 33.3% (2-4-0) | shield:90, master_attack:63, wake_up:22 | - | warning 1<br>黒耐性あり<br>シールド偏重 |
| 2 | current_shield_no_pressure4_wake4<br>候補: ノープレッシャー盾抑制 4 / 安全ウェイク 4 | 軽い盾抑制と安全ウェイクを併用し、対黒改善と対白維持の両立を見る。 | situational whiteShieldNoPressurePenalty:4, whiteWakeSafeWorkBonus:4 | 40.7 | 41.7% | 50% (3-3-0) | - | 33.3% (2-4-0) | shield:88, master_attack:54, wake_up:25 | - | 黒耐性あり<br>シールド偏重 |
| 3 | current_shield_no_pressure8_wake4<br>候補: ノープレッシャー盾抑制 8 / 安全ウェイク 4 | ノープレッシャー盾を抑えた分、仕事へ変換できるウェイクアップで勝ち切りを補う。 | situational whiteShieldNoPressurePenalty:8, whiteWakeSafeWorkBonus:4 | 34.3 | 41.7% | 33.3% (2-4-0) | - | 50% (3-3-0) | shield:78, master_attack:67, wake_up:27 | - | 黒に弱い<br>シールド偏重 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| current_white_baseline_vs_black_1375_pressure_player | player | black_1375_pressure | P 2 / C 1 / D 0 | 0F/0W |
| current_white_baseline_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 2 / D 0 | 0F/0W |
| current_white_baseline_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 2 / D 0 | 0F/1W |
| current_white_baseline_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 2 / C 1 / D 0 | 0F/0W |
| current_shield_no_pressure8_wake4_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 2 / D 0 | 0F/0W |
| current_shield_no_pressure8_wake4_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 2 / C 1 / D 0 | 0F/0W |
| current_shield_no_pressure8_wake4_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 2 / D 0 | 0F/0W |
| current_shield_no_pressure8_wake4_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 1 / C 2 / D 0 | 0F/0W |
| current_shield_no_pressure4_wake4_vs_black_1375_pressure_player | player | black_1375_pressure | P 1 / C 2 / D 0 | 0F/0W |
| current_shield_no_pressure4_wake4_vs_black_1375_pressure_cpu | cpu | black_1375_pressure | P 1 / C 2 / D 0 | 0F/0W |
| current_shield_no_pressure4_wake4_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 2 / D 0 | 0F/0W |
| current_shield_no_pressure4_wake4_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 2 / C 1 / D 0 | 0F/0W |

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

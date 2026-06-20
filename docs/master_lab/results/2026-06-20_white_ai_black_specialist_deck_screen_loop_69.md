# White AI Tuning Loop

生成: 2026-06-20T01:25:53.368Z
候補: 11
相手: black_pressure_strong, black_pressure_pressure
試行: 4 games/matchup/direction
総試合: 176

## Conclusion

首位は `pressure_white_baseline`（score 36.7 / overall 43.8% / vs Black 43.8%）。 現行 `pressure_white_baseline` 比の vs Black 差分は +0%。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: pressure_white_baseline 43.8% / white494_wake8 43.8% / balanced_attack_monster8 37.5% / white1347_defensive_baseline 31.3% / balanced_wake8_shield8 25%。

### Next Steps

- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | baseline | pressure-normal<br>通常プレッシャー | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 11.9 | - | shield:55, wake_up:55, master_attack:39 | - | 0F/0W | - |
| 2 | white494_wake8<br>投稿494: wake_up+8 | hybrid | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | 36.7 | 7-9-0 | 43.8% | 43.8% (7-9-0) | - | - | 11.9 | - | shield:71, master_attack:58, wake_up:51 | - | 0F/0W | - |
| 3 | balanced_attack_monster8<br>balanced: attack_monster+8 | hybrid | balanced-normal<br>通常バランス | 32.3 | 6-10-0 | 37.5% | 37.5% (6-10-0) | - | - | 13.4 | - | shield:64, wake_up:61, master_attack:45 | - | 0F/0W | 黒に弱い |
| 4 | white1347_defensive_baseline<br>比較: 投稿1347 / defensive | baseline | submission-pro-no-rare8-white-1347<br>投稿Pro白8なし #1347 極端なぼうえい | 27.9 | 5-11-0 | 31.3% | 31.3% (5-11-0) | - | - | 11.4 | - | shield:71, wake_up:60, master_attack:35 | - | 0F/0W | 黒に弱い |
| 5 | balanced_wake8_shield8<br>balanced: wake/shield+8 | hybrid | balanced-normal<br>通常バランス | 23.5 | 4-12-0 | 25% | 25% (4-12-0) | - | - | 13 | - | shield:67, wake_up:65, master_attack:40 | - | 0F/0W | 黒に弱い |
| 6 | balanced_guard<br>balanced: 保護重視 | hybrid | balanced-normal<br>通常バランス | 19.2 | 3-13-0 | 18.8% | 18.8% (3-13-0) | - | - | 12.7 | - | shield:68, wake_up:51, master_attack:49 | - | 0F/0W | 黒に弱い |
| 7 | white494_guard<br>投稿494: 保護重視 | hybrid | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | 19.2 | 3-13-0 | 18.8% | 18.8% (3-13-0) | - | - | 10.9 | - | shield:89, master_attack:56, wake_up:37 | - | 0F/0W | 黒に弱い<br>シールド偏重 |
| 8 | white494_white_baseline<br>比較: 投稿494 / white | baseline | submission-pro-no-rare8-white-494<br>投稿Pro白8なし #494 高評価ホワイト | 19.2 | 3-13-0 | 18.8% | 18.8% (3-13-0) | - | - | 10.4 | - | shield:86, master_attack:43, wake_up:41 | - | 0F/0W | 黒に弱い<br>シールド偏重 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | pressure_white_baseline<br>基準: pressure-normal / white | 現行白専用AIの基準。黒速攻へどこまで耐えるかを見る。 | - | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | shield:55, wake_up:55, master_attack:39 | - | - |
| 2 | white494_wake8<br>投稿494: wake_up+8 | 投稿白デッキでウェイクアップ補正が再現するかを見る。 | action wake_up+8 | 36.7 | 43.8% | 43.8% (7-9-0) | - | - | shield:71, master_attack:58, wake_up:51 | - | - |
| 3 | balanced_attack_monster8<br>balanced: attack_monster+8 | 標準構成でも盤面処理補正が再現するかを見る。 | action attack_monster+8 | 32.3 | 37.5% | 37.5% (6-10-0) | - | - | shield:64, wake_up:61, master_attack:45 | - | 黒に弱い |
| 4 | white1347_defensive_baseline<br>比較: 投稿1347 / defensive | 防御密度の高い候補で、長期戦化しすぎないかを見る。 | - | 27.9 | 31.3% | 31.3% (5-11-0) | - | - | shield:71, wake_up:60, master_attack:35 | - | 黒に弱い |
| 5 | balanced_wake8_shield8<br>balanced: wake/shield+8 | 標準構成で展開と保護を同時に押した場合の平均値を見る。 | action wake_up+8, shield+8 | 23.5 | 25% | 25% (4-12-0) | - | - | shield:67, wake_up:65, master_attack:40 | - | 黒に弱い |
| 6 | balanced_guard<br>balanced: 保護重視 | 標準構成で過剰防御にならず黒に耐えられるか見る。 | action shield+8<br>weights masterHp:92, futureOwnThreatenedMonster:0.36 | 19.2 | 18.8% | 18.8% (3-13-0) | - | - | shield:68, wake_up:51, master_attack:49 | - | 黒に弱い |
| 7 | white494_guard<br>投稿494: 保護重視 | 投稿白デッキで守って育てる筋が黒相手に間に合うか見る。 | action shield+8<br>weights futureOwnLevelUp:0.26, futureOwnThreatenedMonster:0.36 | 19.2 | 18.8% | 18.8% (3-13-0) | - | - | shield:89, master_attack:56, wake_up:37 | - | 黒に弱い<br>シールド偏重 |
| 8 | white494_white_baseline<br>比較: 投稿494 / white | 投稿白デッキ候補で、白AIの上限と癖を見る。 | - | 19.2 | 18.8% | 18.8% (3-13-0) | - | - | shield:86, master_attack:43, wake_up:41 | - | 黒に弱い<br>シールド偏重 |
| 9 | balanced_white_baseline<br>比較: balanced-normal / white | 標準構成で白AIの守備寄り判断が安定するかを見る。 | - | 10.4 | 6.3% | 6.3% (1-15-0) | - | - | shield:64, wake_up:53, master_attack:40 | - | 黒に弱い |
| 10 | white1340_level<br>投稿1340: レベルアップ重視 | 育成寄りデッキで白AIの本筋を最大化する。 | action shield+6, wake_up+6<br>weights futureOwnLevelUp:0.32, futureOpponentLevelUp:0.28 | 10.4 | 6.3% | 6.3% (1-15-0) | - | - | wake_up:69, master_attack:55, shield:49 | - | 黒に弱い |
| 11 | white1340_white_baseline<br>比較: 投稿1340 / white | 育成寄り白デッキで、守ってレベルを上げる筋が伸びるかを見る。 | - | 10.4 | 6.3% | 6.3% (1-15-0) | - | - | shield:75, wake_up:69, master_attack:56 | - | 黒に弱い |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| pressure_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| pressure_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| balanced_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| balanced_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| balanced_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| balanced_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| white494_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| white494_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| white494_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| white494_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| white1340_white_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| white1340_white_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| white1340_white_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| white1340_white_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| white1347_defensive_baseline_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_strong_player | player | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| white494_wake8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 1 / C 3 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 2 / C 2 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| white494_guard_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| white1340_level_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| white1340_level_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| white1340_level_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| white1340_level_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |
| balanced_guard_vs_black_pressure_strong_player | player | black_pressure_strong | P 0 / C 4 / D 0 | 0F/0W |
| balanced_guard_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 3 / C 1 / D 0 | 0F/0W |
| balanced_guard_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| balanced_guard_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 4 / C 0 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 0 / C 4 / D 0 | 0F/0W |
| balanced_attack_monster8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_black_pressure_strong_player | player | black_pressure_strong | P 1 / C 3 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_black_pressure_strong_cpu | cpu | black_pressure_strong | P 4 / C 0 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_black_pressure_pressure_player | player | black_pressure_pressure | P 2 / C 2 / D 0 | 0F/0W |
| balanced_wake8_shield8_vs_black_pressure_pressure_cpu | cpu | black_pressure_pressure | P 3 / C 1 / D 0 | 0F/0W |

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

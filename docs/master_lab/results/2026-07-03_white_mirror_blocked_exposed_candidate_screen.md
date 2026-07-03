# White AI Tuning Loop

生成: 2026-07-03T08:21:24.989Z
候補: 3
相手: white_current_mirror
試行: 1 games/matchup/direction
総試合: 6

## Conclusion

首位は `current_mirror_blocked_exposed70`（score 6 / overall 75% / vs Black 0%）。 安定候補（vs Black 45%以上、0F/1W以下）は 0 件。 上位候補: current_mirror_blocked_exposed70 0% / current_mirror_blocked_exposed45 0% / current_white_baseline 0%。

### Next Steps

- 首位 `current_mirror_blocked_exposed70` は issue が 1F/0W あるため、採用前に該当seedを確認する。
- vs Black 45%以上かつwarning少なめの候補が薄い。次ループは敗戦ログを広げ、シールド後に反撃できない局面とウェイクアップが遅い局面を分ける。
- 首位でもvs Black 45%未満なら、白の恒久重みを上げる前にデッキ側の黒対策カードとAIの守る対象を同時に見る。
- 首位はシールド寄り。確認ループでは `wake_up` 補正を少し足す条件を横に置き、守った後の勝ち切り不足を確認する。
- 採用候補を白プロファイルへ反映する場合は、今回の実験用 `actionBias` をそのまま入れず、対応する局面評価へ還元する。
- 次回レポートでは上位候補の負けログから、相手残HPが低い惜敗と高HPの完敗を分けてカード/AIどちらを触るか決める。

## Top Candidates

| Rank | Variant | Kind | Deck | Score | W-L-D | Overall | vs Black | vs Decoy | vs White | Avg Turns | Loss Opp HP | Usage | Intent | Issues | Notes |
| ---: | --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| 1 | current_mirror_blocked_exposed70<br>候補: 白ミラー露出後列召喚 70 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | 6 | 1-0-1 | 75% | - | - | 75% (1-0-1) | 16.5 | - | shield:16, master_attack:8, wake_up:4 | - | 1F/0W | failure 1<br>シールド偏重 |
| 2 | current_mirror_blocked_exposed45<br>候補: 白ミラー露出後列召喚 45 | hybrid | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | -26 | 0-0-2 | 50% | - | - | 50% (0-0-2) | 17.5 | - | shield:16, master_attack:13, wake_up:7 | - | 2F/0W | failure 2<br>シールド偏重 |
| 3 | current_white_baseline<br>現行: デスシープ3 / white | baseline | master-lab-white-1377-death-sheep3<br>白暫定最強: 1377デスシープ3 | -26 | 0-0-2 | 50% | - | - | 50% (0-0-2) | 18 | - | shield:22, master_attack:9, wake_up:4 | - | 2F/0W | failure 2<br>シールド偏重 |

## Loop Results

| Rank | Variant | Hypothesis | Tuning | Score | Overall | vs Black | vs Decoy | vs White | Usage | Intent | Notes |
| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| 1 | current_mirror_blocked_exposed70<br>候補: 白ミラー露出後列召喚 70 | 再現比較で攻撃代替が勝った露出後列召喚を中程度に抑え、副作用が出るかを見る。 | situational whiteBlockedBacklineExposedSummonPenalty:70 | 6 | 75% | - | - | 75% (1-0-1) | shield:16, master_attack:8, wake_up:4 | - | failure 1<br>シールド偏重 |
| 2 | current_mirror_blocked_exposed45<br>候補: 白ミラー露出後列召喚 45 | 後列から働けない召喚のうち、返しで脅かされ、既存アクティブ駒の敵前衛処理がある局面だけ軽く抑える。 | situational whiteBlockedBacklineExposedSummonPenalty:45 | -26 | 50% | - | - | 50% (0-0-2) | shield:16, master_attack:13, wake_up:7 | - | failure 2<br>シールド偏重 |
| 3 | current_white_baseline<br>現行: デスシープ3 / white | 暫定白最強デッキで現行white profileを基準化する。 | - | -26 | 50% | - | - | 50% (0-0-2) | shield:22, master_attack:9, wake_up:4 | - | failure 2<br>シールド偏重 |

## Runs

| Run | Candidate Seat | Opponent | Result | Issues |
| --- | --- | --- | --- | --- |
| current_white_baseline_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 0 / D 1 | 1F/0W |
| current_white_baseline_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 0 / C 0 / D 1 | 1F/0W |
| current_mirror_blocked_exposed45_vs_white_current_mirror_player | player | white_current_mirror | P 0 / C 0 / D 1 | 1F/0W |
| current_mirror_blocked_exposed45_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 0 / C 0 / D 1 | 1F/0W |
| current_mirror_blocked_exposed70_vs_white_current_mirror_player | player | white_current_mirror | P 1 / C 0 / D 0 | 0F/0W |
| current_mirror_blocked_exposed70_vs_white_current_mirror_cpu | cpu | white_current_mirror | P 0 / C 0 / D 1 | 1F/0W |

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

# White AI Focus Reason Loop 36-40 Summary

## Goal

ホワイトAIの汎用強化として、相手別プロファイル化ではなく「このターンの仕事」と「次ターンへの布石」の優先順位を改善できるかを検証した。

前回ループで残った課題は、負け試合で低石 `focus` が多く、次ターンの仕事へ変換されないケースが目立つことだった。今回は `focus` を一律に抑えるのではなく、低石 `focus` の直前に攻撃などの代替手が残っていたかを監査した。

## Implementation

### Audit

`white-ai-loss-audit` に `Loss Focus Reason` を追加した。

- `LowF`: 負け試合の低石focus回数。
- `NoOther`: 低石focus直前に他の行動可能味方がいなかった率。
- `Other`: 他の行動可能味方が残っていた率。
- `FrontReach`: 同列前衛へ触れる味方がいた率。
- `Summon` / `Wake` / `MA`: 召喚・ウェイクアップ・マスターアタックの余地があった率。
- `BlkThreat`: focus後に黒の前衛打点源が残った率。

### Candidate

実験variantとして `whiteLowStoneFocusMissedAttackPenalty` を追加した。

- `pressure_white_low_stone_focus_missed_attack_light_v1`: +4相当の軽量ペナルティ。
- `pressure_white_low_stone_focus_missed_attack_v1`: +8相当の標準ペナルティ。

内容は、白マスター限定で「攻撃可能な局面なのに、残石1以下になるfocusを選ぶ」手だけを減点するもの。`white` profileの標準値には入れていない。

## Loop 36: Focus Reason Baseline Audit

- Report: `2026-06-19_white_ai_focus_reason_audit_loop_36.md`
- 条件: baseline、黒2相手、8 games/matchup/direction、historyあり。
- 結果: 11-21-0、Loss LowS 50.3%。

負け試合の低石focusは 94 回。

| Metric | Value |
| --- | ---: |
| 他の行動可能味方あり | 60.6% |
| 同列前衛へ触れる味方あり | 42.6% |
| focus後に黒前衛打点源が残る | 13.8% |
| 低石focus後に次ターン仕事なし | 41/94 |

読み取り:

- `focus` が単なるターン終了前の自然なためだけではなく、攻撃可能な局面でも選ばれている。
- ただし `BlkThreat` は13.8%で、問題の中心は「黒専用対策」より「仕事できる手番を布石に回す癖」と見た。

## Loop 37: Black Screen

- Report: `2026-06-19_white_ai_focus_reason_black_screen_loop_37.md`
- 条件: baseline / +4 / +8、黒2相手、4 games/matchup/direction、no-history。

| Rank | Variant | vs Black |
| ---: | --- | ---: |
| 1 | `pressure_white_low_stone_focus_missed_attack_v1` | 43.8% |
| 2 | `pressure_white_low_stone_focus_missed_attack_light_v1` | 37.5% |
| 3 | `pressure_white_baseline` | 31.3% |

読み取り:

- +8は小母数では明確に伸びた。
- +4は伸び幅が小さく、黒への即効性は弱い。

## Loop 38: All Opponent Confirm

- Report: `2026-06-19_white_ai_focus_reason_all_confirm_loop_38.md`
- 条件: baseline / +8、全相手、8 games/matchup/direction、historyあり。

| Variant | Overall | vs Black | vs Decoy | vs White |
| --- | ---: | ---: | ---: | ---: |
| `pressure_white_baseline` | 43.8% | 28.1% | 68.8% | 50.0% |
| `pressure_white_low_stone_focus_missed_attack_v1` | 42.2% | 31.3% | 43.8% | 62.5% |

読み取り:

- +8は vs Black を +3.2pt 伸ばしたが、overall は baseline 未満。
- Decoy相手を大きく落としたため、汎用標準採用には弱い。
- 白ミラーは伸びたが、今回の主目的は全相手で安定する基準白AIなので、Decoy低下は無視しない。

## Loop 39: Black Loss Audit

- Report: `2026-06-19_white_ai_focus_reason_loss_audit_loop_39.md`
- 条件: baseline / +8、黒2相手、8 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss LowF | FLowNo | BlkThreat |
| --- | --- | ---: | ---: | ---: |
| `pressure_white_baseline` | 12-20-0 | 87 | 43/87 | 11.5% |
| `pressure_white_low_stone_focus_missed_attack_v1` | 18-14-0 | 83 | 29/83 | 4.8% |

読み取り:

- 黒限定の同条件では +8 が大きく改善した。
- `FLowNo` は 43/87 -> 29/83 に減り、監査目的にはかなり良い。
- `BlkThreat` も 11.5% -> 4.8% に下がり、黒の次ターン打点源を放置するケースは減った。
- ただしこの改善は Loop 38 の全相手安定性を覆すほどではない。

## Loop 40: Light All Opponent Confirm

- Report: `2026-06-19_white_ai_focus_reason_light_all_confirm_loop_40.md`
- 条件: baseline / +4、全相手、6 games/matchup/direction、historyあり。

| Variant | Overall | vs Black | vs Decoy | vs White |
| --- | ---: | ---: | ---: | ---: |
| `pressure_white_baseline` | 45.8% | 41.7% | 41.7% | 58.3% |
| `pressure_white_low_stone_focus_missed_attack_light_v1` | 43.8% | 29.2% | 58.3% | 58.3% |

読み取り:

- +4は副作用が小さいわけではなく、seed帯によって黒耐性を落とした。
- 軽量化すれば汎用候補になる、という結果ではなかった。

## Decision

`white` profileへの標準採用はしない。

採用しない理由:

- +8は黒限定では良いが、全相手確認でbaselineを下回り、特にDecoy相手を落とした。
- +4は全相手確認でbaselineを下回り、黒改善も再現しなかった。
- 「攻撃可能なら低石focusを減点」という形は少し粗く、相手の挑発・スケープゴート・盤面誘導に対して副作用が出やすい可能性がある。

残す価値:

- `Loss Focus Reason` 監査は有効。低石focusの質をかなり説明できる。
- `whiteLowStoneFocusMissedAttackPenalty` は実験variantとして残す。黒限定の局面抽出には使える。

## Next Loop Proposal

次は `focus` そのものを罰するのではなく、「低石布石の前に処理すべき脅威が残っているか」を監査・候補化する。

1. `threat_before_setup_audit` を追加する。
   - 低石 `focus` / `summon` / `wake_up` / `shield` の前後で、敵前衛の次ターン打点源が残ったか。
   - その打点源を既存アクティブ駒で削れたか。
   - Decoy相手ではスケープゴート・挑発対象に吸われる攻撃だったかを分ける。

2. 候補はペナルティではなく加点寄りにする。
   - `whiteThreatSourceAttackBonus`: 敵の次ターン打点源を削る攻撃を加点。
   - `whiteSetupAfterThreatReductionBonus`: 脅威を削った後のfocus/盾/起動を加点。
   - `whiteDecoyRedirectAwareAttackPenalty`: Decoyの挑発/スケープゴートに吸われる低価値攻撃だけ軽く抑える。

3. ループ配分。
   - 黒+Decoy限定 no-history 3-4 games/matchup/direction で一次スクリーニング。
   - 上位2候補だけ全相手 historyあり 6-8 games/matchup/direction。
   - 最後に黒限定 loss audit 8 games/matchup/direction で `BlkThreat` と `FLowNo` が改善したかを見る。

今回の結論として、白AIの次の改善軸は「focusを減らす」ではなく、「脅威処理を済ませてから布石する」の順序評価に移す。

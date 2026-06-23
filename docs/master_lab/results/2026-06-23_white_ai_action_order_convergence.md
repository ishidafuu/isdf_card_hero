# White AI Action Order Convergence

生成: 2026-06-23

## 目的

シールド係数をさらに回すのではなく、白AIの行動順を `shield -> retreat` / `retreat only` / `attack first` / `wake first` で比較し、前列に釣り出された後衛を雑にシールドしてから下げる動きが残るかを検証した。

## 追加した監査

- `npm run lab:masters:white-ai-action-order` を追加。
- 同一局面でAIがシールドを選んだとき、同じ対象の後退候補、攻撃候補、ウェイクアップ候補の評価点を記録する。
- シールド対象を同ターン中に後退させた `shield->retreat` と、後衛ロールでそれが起きた `BackRole S->R` を別に集計する。

## 基準監査

参照: `2026-06-23_white_ai_action_order_baseline_audit.md`

| Variant | W-L-D | Shield | Retreat Alt | Retreat Higher | Shield->Retreat | BackRole S->R |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| pressure_white_baseline | 15-33-0 | 240 | 7 | 0 | 3 | 1 |
| pressure_white_shield_quality_breakthrough_v1 | 18-30-0 | 232 | 7 | 0 | 3 | 0 |

所感:

- `shield->retreat` は多発していない。
- 問題視していた「後衛ロールを盾してから下げる」は baseline に1件、盾品質候補では0件だった。
- 同一対象の後退候補がシールド評価を上回る局面は0件で、現状は「後退を選べたのに明確に選び損ねた」というより、シールド評価がかなり高い局面で後から後退も行っている。

## 候補検証

追加候補:

- `pressure_white_safe_retreat_order_light_v1`: 安全後退 +24 / 先貼り盾 -12
- `pressure_white_safe_retreat_order_v1`: 安全後退 +56 / 先貼り盾 -24
- `pressure_white_shield_quality_retreat_order_v1`: 盾品質候補 + 安全後退

参照: `2026-06-23_white_ai_action_order_retreat_candidates_audit.md`

| Variant | W-L-D | Shield | Retreat Alt | Shield->Retreat | BackRole S->R |
| --- | ---: | ---: | ---: | ---: | ---: |
| pressure_white_baseline | 13-23-0 | 124 | 6 | 1 | 1 |
| pressure_white_safe_retreat_order_light_v1 | 10-26-0 | 120 | 5 | 1 | 1 |
| pressure_white_safe_retreat_order_v1 | 12-24-0 | 122 | 6 | 2 | 2 |
| pressure_white_shield_quality_retreat_order_v1 | 9-27-0 | 134 | 8 | 2 | 1 |

所感:

- 安全後退フックは `shield->retreat` を減らせなかった。
- 強めにしても後衛ロールの盾後退が減らず、勝敗も改善しなかった。
- これは「後退評価が低すぎる」より、「その局面でシールド自体の盤面価値が高く出ている」可能性が高い。

## 実戦チェック

参照: `2026-06-23_white_ai_action_order_practical_screen.md`

| Variant | Overall | vs Black | vs Decoy | Notes |
| --- | ---: | ---: | ---: | --- |
| pressure_white_baseline | 61.1% | 58.3% | 66.7% | 黒耐性あり |
| pressure_white_shield_quality_breakthrough_v1 | 44.4% | 41.7% | 50.0% | シールド偏重 |
| pressure_white_safe_retreat_order_light_v1 | 44.4% | 33.3% | 66.7% | 黒に弱い |

所感:

- 今回のseed帯では baseline が最も安定した。
- 安全後退候補は黒に弱く、デフォルト採用は見送り。
- 盾品質+突破抑制もこの小規模実戦では伸びず、現時点で白プロファイルへ入れる根拠は弱い。

## 結論

- 今回の本採用はなし。現行白AIのデフォルト挙動は変えない。
- ただし、行動順監査は有用なので残す。
- 安全後退フックとvariantは、再現seedや別デッキで検証するための実験候補として残すが、デフォルト白プロファイルへは入れない。
- 実戦チェック上は大きな破綻なし。問題視された `shield->retreat` は頻度が低く、現時点ではシールド係数をさらに触るより監査を継続する方が安全。

## 次に見るなら

- `attack first` はシールドを上回る局面が0件、close は一定数あるため、次は「攻撃がcloseなのに盾を選んだ局面」のサンプルを増やして、敵前衛処理やリーサル圏作りが絡むかを見る。
- `wake first` も higher は0件なので、今すぐ補正を入れるより、起こした駒が同ターン仕事をしたかの既存監査と合わせて見る。
- ユーザー実戦で再度「後衛を盾して下げる」棋譜が出た場合は、そのseed/履歴をこの監査に流し、候補評価点を直接確認する。

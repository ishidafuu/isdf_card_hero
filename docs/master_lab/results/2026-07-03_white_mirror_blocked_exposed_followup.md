# White Mirror Blocked Backline Follow-up

生成: 2026-07-03

## 結論

- `current_mirror_blocked_exposed45` は現時点では採用見送り。
- 分岐リプレイでは、露出した詰まり後列召喚より攻撃先行が良いサンプルが見つかった。
- ただし中母数の白ミラー再確認では改善幅が小さく、盾後接続の負け監査では baseline より悪化した。
- 今回の成果は、採用候補ではなく「局所リプレイ監査を追加し、後列召喚問題を狭く検出できるようにした」こと。

## 実施内容

### 1. 分岐リプレイ監査

レポート:

- `docs/master_lab/results/2026-07-03_white_mirror_branch_replay_blocked_close.md`

結果:

| 指標 | 値 |
| --- | ---: |
| samples | 4 |
| selected mismatch | 0 |
| better alternative | 2 |
| materially better alternative | 1 |
| best branch | selected 2 / attack_first 1 / focus_only 1 |

読み:

- seed 992100 step 81 では、詰まり後列へ召喚するより `ダイン斬り` で敵前衛を削る分岐が +166。
- 一方で、同じ「後列召喚」に見えるサンプルでも selected が最善または同等のものがあり、広い後列召喚ペナルティは危険。

### 2. 候補化

追加した候補:

- `current_mirror_blocked_exposed45`
- `current_mirror_blocked_exposed70`

AI baseline には未反映。`whiteBlockedBacklineExposedSummonPenalty` は実験用の situational bias として追加した。

条件は以下に限定:

- 白マスター
- 後列召喚
- 召喚直後に後列から仕事できない
- 前列の味方でレーンが詰まっている
- 召喚後に低石または後列満杯
- 既存アクティブ駒に一定以上の攻撃機会がある
- 召喚した駒が返しで脅かされる

## ループ結果

### 小母数候補確認

レポート:

- `docs/master_lab/results/2026-07-03_white_mirror_blocked_exposed_candidate_loop.md`

結果:

| phase | top | W-L-D | overall | 判定 |
| --- | --- | ---: | ---: | --- |
| screen | `current_mirror_blocked_exposed70` | 1-0-1 | 75% | 保留 |
| confirm | `current_mirror_blocked_exposed45` | 1-0-1 | 75% | 保留 |

読み:

- 小母数では候補が上に出たが、seed 差の可能性が高く即採用できない。

### 白ミラー再確認

レポート:

- `docs/master_lab/results/2026-07-03_white_mirror_blocked_exposed45_recheck_loop.md`

結果:

| phase | variant | W-L-D | overall | avg turns | issues |
| --- | --- | ---: | ---: | ---: | --- |
| screen | `current_white_baseline` | 3-3-2 | 50% | 17.1 | 2F/0W |
| screen | `current_mirror_blocked_exposed45` | 3-2-3 | 56.3% | 17.0 | 3F/0W |
| confirm | `current_white_baseline` | 1-2-5 | 43.8% | 18.4 | 5F/0W |
| confirm | `current_mirror_blocked_exposed45` | 2-2-4 | 50% | 16.4 | 4F/0W |

読み:

- `exposed45` は +6.2pt 程度で微増。
- ただし issue が残り、明確な採用根拠には弱い。
- 4 games/matchup/direction でも実行がかなり重く、今後の白ミラー確認は seed/step 起点の局所リプレイを優先する。

### 行動順監査

レポート:

- `docs/master_lab/results/2026-07-03_white_mirror_blocked_exposed45_action_order_audit.md`

結果:

| variant | W-L-D | shield | shield first | shield then work | work then shield | shield attack higher/close |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `current_white_baseline` | 3-3-0 | 59 | 7 | 0 | 42 | 0/0 |
| `current_mirror_blocked_exposed45` | 3-3-0 | 59 | 7 | 0 | 42 | 0/0 |

読み:

- `exposed45` は盾の行動順にはほぼ影響していない。
- 現行 white は、この監査範囲では「盾のあとに攻撃/ウェイク」ではなく「攻撃/ウェイクのあとに盾」が多い。
- 盾順序そのものより、盾が次ターンの盤面仕事へ変換されるかを見る方が重要。

### 盾後接続の負け監査

レポート:

- `docs/master_lab/results/2026-07-03_white_mirror_blocked_exposed45_shield_followup_loss.md`

結果:

| variant | W-L-D | loss shield | team conn | target conn | front proc | no-contact/no-conn | low stone | multi shield |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `current_white_baseline` | 1-3-0 | 28 | 82.1% | 50.0% | 78.6% | 14.3% | 53.6% | 7.1% |
| `current_mirror_blocked_exposed45` | 1-3-0 | 32 | 53.1% | 34.4% | 53.1% | 25.0% | 68.8% | 12.5% |

読み:

- `exposed45` は負け試合での盾後接続を悪化させている。
- 特に team connected / front process connected が大きく落ち、no-contact/no-connection と low stone が増えている。
- 白ミラー勝率が微増しても、白の基本方針である「守って盤面制圧へつなぐ」品質が落ちるため採用しない。

## 次ループ提案

次は係数候補を広げず、監査対象を以下へ絞る。

1. `shieldConnectionPlanAudit` を追加する。
   - 盾選択時に、この後または次自ターンに誰が何をする予定かを候補評価ログへ出す。
   - `targetConnected` ではなく `teamConnected` と `frontProcessConnected` を主指標にする。

2. `no-contact/no-connection` の盾を局所リプレイする。
   - shield / no shield / attack first / focus only を同 seed・同 step から次自ターンまで比較する。
   - 勝率ではなく、盤面差・石差・前衛処理・次ターン開始行動で読む。

3. `exposed45` は凍結する。
   - 後列召喚問題は実在するが、現行条件では盾後接続の副作用がある。
   - 次に触るなら「召喚を抑える」ではなく「既存アクティブ駒の敵前衛処理を先に読む」方向へ戻す。

## 採用判断

- 採用: なし
- 保留: `whiteBlockedBacklineExposedSummonPenalty`
- 次の主対象: `shieldConnectionPlanAudit`


# White Mirror Threat-Then-Setup Investigation

生成: 2026-06-30

## 結論

白ミラー限定で `whiteThreatSourceAttackBonus: 6` / `whiteSetupAfterThreatReductionBonus: 6` を本線へ入れる。

狙いは、白対白で「マスターを殴る・盾を張る・布石する」前に、まず敵前衛の脅威源を処理し、その後に低石布石へ移る順序を少し押すこと。

## 実装判断

- 採用範囲は `white vs white` のみ。
- 黒戦/デコイ戦へは広げない。
- 既存の白全体 `whiteThreatSourceAttackBonus: 8` は、白ミラー時だけ `6` に落とす。
- 代わりに `whiteSetupAfterThreatReductionBonus: 6` を足し、脅威処理後の布石を評価する。
- `current_white_mirror_threat_then_setup_off` を比較候補として残し、今後も回帰確認できるようにする。

## 盾後接続監査

`2026-06-30_white_mirror_shield_followup_audit.md`

| Variant | W-L-D | Loss shield | Team conn | Front proc |
| --- | ---: | ---: | ---: | ---: |
| current_white_baseline | 1-3-0 | 32 | 75.0% | 65.6% |
| current_wake_safe_work4 | 2-2-0 | 21 | 71.4% | 66.7% |
| current_shield_wake_quality | 2-2-0 | 15 | 53.3% | 40.0% |
| current_threat_then_setup | 4-0-0 | 0 | - | - |
| current_shield_no_pressure4_wake4 | 1-3-0 | 25 | 64.0% | 60.0% |

小母数だが `current_threat_then_setup` だけ負けなし。盾の質を直接上げる候補より、「脅威処理を先に済ませる」方向の方が筋が良かった。

## 中母数確認

### Medium

`2026-06-30_white_mirror_threat_then_setup_medium_summary.md`

- threat_then_setup: 9-7-0 / 56.3%
- baseline: 6-10-0 / 37.5%

### Recheck

`2026-06-30_white_mirror_threat_then_setup_recheck_summary.md`

- threat_then_setup: 11-5-0 / 68.8%
- baseline: 8-8-0 / 50.0%

### Post Implementation

`2026-06-30_white_mirror_threat_then_setup_post_impl_summary.md`

- implemented baseline: 5-3-0 / 62.5%
- off: 3-5-0 / 37.5%

## 合算

confirm 相当の3ブロック合算:

| Variant | W-L-D | Win point |
| --- | ---: | ---: |
| threat_then_setup | 25-15-0 | 62.5% |
| off/baseline before adoption | 17-23-0 | 42.5% |

差は +20.0pt。白ミラー限定なら採用できる。

## 所感

今回の改善は「盾を減らす」ではなく「盾に行く前に盤面脅威を処理する」方向。ユーザー方針の「白対白はマスター被ダメージをある程度許容し、盤面制圧優先」と整合する。

ただし、採用後もレポート上は `シールド偏重` が残る。次は盾そのものを減らす係数ではなく、負けseedで `shield -> front process / wake / master attack` の順序と、同ターン内にまだ攻撃可能な駒が残っているかを候補評価ログへ出すのがよい。

## 次ループ

- `shieldConnectionPlanAudit` を追加する。シールド候補ごとに、同ターン/次自ターンの前衛処理予定をログ化する。
- `current_white_mirror_threat_then_setup_off` を回帰比較に残す。
- 白ミラーの長時間ループは重いので、`white-current-deck-loop` と shield follow-up audit に進捗ログを追加する。

# White Mirror Focus/Summon Candidate Follow-up

生成: 2026-07-03

## Scope

- 対象: 白ミラーのみ
- デッキ: `master-lab-white-1377-death-sheep3`
- 参照:
  - `2026-07-02_white_mirror_focus_summon_audit.md`
  - `2026-07-03_white_mirror_focus_summon_candidate_loop.md`

## What Was Tested

前回監査で多かった以下を、既存 hook の組み合わせで小母数検証した。

1. 低石かつ次自ターン仕事化しない focus
2. 前列味方で塞がる、後列攻撃パターンなし召喚
3. focus と後列召喚の複合抑制

追加候補:

| Variant | 目的 |
|---|---|
| `current_mirror_focus_quality_mid` | 低石 focus を仕事化条件へ寄せる |
| `current_mirror_blocked_backline_no_work80` | 塞がる後列仕事なし召喚を中程度に抑える |
| `current_mirror_blocked_backline_no_work120` | 塞がる後列仕事なし召喚を強めに抑える |
| `current_mirror_focus_backline_quality` | focus 品質と後列召喚品質を同時に見る |

## Result

自動候補比較では `current_mirror_blocked_backline_no_work120` が score 上は首位だったが、白ミラー勝ち点率は baseline より低かった。

| Phase | Baseline | best candidate |
|---|---:|---:|
| Screen overall | 75% | 50% |
| Confirm overall | 75% | 50% |
| Confirm issues | 1F/0W | 0F/0W |

focus 系候補は今回の小母数では 25% に落ちた。`whiteLowStoneFocusConversionBonus` と `whiteLowStoneFocusMissedAttackPenalty` の組み合わせは、監査で見えた「仕事化しない focus」を十分狭く捉えられていない可能性が高い。

後列召喚抑制は違和感を減らす方向には見えるが、強く入れると盤面を埋める力や盾対象の確保を落としている可能性がある。現時点では mainline 採用しない。

## Interpretation

今回の収穫は、勝率改善候補の採用ではなく、次の検証方法が見えたこと。

- 勝率だけだと、blocked/no-work 召喚が本当に減ったのか分からない。
- focus は「低石」「攻撃が残っている」だけでは広すぎる。
- 召喚は「後列で塞がる」だけでは広く、実際には「次ターン仕事なし」「攻撃吸収なし」「低石で返す」を同時に見る必要がある。

## Next Verification

次は勝率ループを増やす前に、監査スクリプト側を variant 対応にして同一 seed 比較する。

1. `white-mirror-focus-summon-audit` に `--variant` を追加する。
2. baseline と `current_mirror_blocked_backline_no_work120` を同一 seed で比較する。
3. 重点指標は以下に絞る。
   - `backSummonsBlockedNoPattern`
   - `summonNoWorkNoAttackPunished`
   - `focusNoNextWorkPunished`
   - `lowStonePunished`
4. 指標が減って勝率も維持できる場合だけ、中母数の勝率確認へ進む。

現時点の次候補は `whiteBlockedBacklineNoWorkSummonPenalty` だが、値は 120 をそのまま採用せず、80/120 の同一 seed 監査で「問題行動が減るか」を先に見る。

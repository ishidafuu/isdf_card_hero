# White AI Threat Order Loop 41-43 Summary

## Goal

前回の `focus` 理由監査を受けて、ホワイトAIの汎用強化を「低石focusを減らす」から「脅威処理を済ませてから布石する」へ移した。

なお、前回黒限定で有効だった `whiteLowStoneFocusMissedAttackPenalty: 8` は、今回も標準採用していない。黒限定最適化の手がかりとして残す。

## Implementation

### Audit

`white-ai-loss-audit` に `Loss Threat Before Setup` を追加した。

- `LowSetup`: 負け試合の低石布石回数。
- `ThreatB`: 低石布石前に敵前衛脅威が残っていた率。
- `Reducible`: 既存アクティブ駒で同列前衛へ触れた率。
- `ThreatA`: 低石布石後も敵前衛脅威が残った率。
- `BlkA`: 低石布石後も黒前衛脅威が残った率。
- `ClearSetup`: 何か行動した後、敵前衛脅威がない状態で低石布石した率。
- `Redirect` / `RedirectNo`: 挑発/スケープゴート印つき対象への攻撃回数と、成果行動にならなかった率。

### AI Candidates

実験variantを追加した。いずれも `white` profile の標準値には入れていない。

- `pressure_white_threat_source_attack_light_v1`
  - `whiteThreatSourceAttackBonus: 4`
- `pressure_white_threat_source_attack_v1`
  - `whiteThreatSourceAttackBonus: 8`
- `pressure_white_threat_then_setup_v1`
  - `whiteThreatSourceAttackBonus: 6`
  - `whiteSetupAfterThreatReductionBonus: 6`
- `pressure_white_redirect_marked_attack_guard_v1`
  - `whiteRedirectMarkedAttackPenalty: 8`

## Loop 41: Threat Order Screen

- Report: `2026-06-19_white_ai_threat_order_screen_loop_41.md`
- 条件: baseline / 脅威源+4 / 脅威源+8 / 脅威処理後布石、黒2相手+Decoy、4 games/matchup/direction、no-history。

| Rank | Variant | Overall | vs Black | vs Decoy |
| ---: | --- | ---: | ---: | ---: |
| 1 | `pressure_white_baseline` | 50.0% | 37.5% | 75.0% |
| 2 | `pressure_white_threat_then_setup_v1` | 41.7% | 37.5% | 50.0% |
| 3 | `pressure_white_threat_source_attack_light_v1` | 37.5% | 31.3% | 50.0% |
| 4 | `pressure_white_threat_source_attack_v1` | 37.5% | 25.0% | 62.5% |

読み取り:

- 脅威源攻撃の単体加点は黒にもDecoyにも安定しなかった。
- `threat_then_setup` は黒を維持したが、Decoyを落とした。
- この時点で標準採用候補はなし。

## Loop 42: Threat Order Loss Audit

- Report: `2026-06-19_white_ai_threat_order_loss_audit_loop_42.md`
- 条件: baseline / `threat_then_setup`、黒2相手+Decoy、6 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss LowS | ThreatB | Reducible | ThreatA | RedirectNo |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `pressure_white_baseline` | 16-20-0 | 52.3% | 72.2% | 40.8% | 72.8% | 90.0% |
| `pressure_white_threat_then_setup_v1` | 15-21-0 | 54.6% | 70.9% | 48.0% | 71.2% | 85.7% |

読み取り:

- `threat_then_setup` は負けを減らせず、低石布石も増えた。
- `ThreatB` と `ThreatA` がほぼ同じで、候補は「布石前に脅威を処理する」行動系列へ十分には変換できていない。
- `RedirectNo` は高いが、件数は baseline 10 / 候補14 と少ない。ここだけを触っても全体勝率への寄与は限定的そう。

## Loop 43: Redirect Screen

- Report: `2026-06-19_white_ai_redirect_screen_loop_43.md`
- 条件: baseline / redirect抑制 / threat_then_setup、黒2相手+Decoy、4 games/matchup/direction、no-history。

| Rank | Variant | Overall | vs Black | vs Decoy |
| ---: | --- | ---: | ---: | ---: |
| 1 | `pressure_white_baseline` | 41.7% | 31.3% | 62.5% |
| 2 | `pressure_white_threat_then_setup_v1` | 45.8% | 25.0% | 87.5% |
| 3 | `pressure_white_redirect_marked_attack_guard_v1` | 41.7% | 25.0% | 75.0% |

読み取り:

- redirect抑制はDecoyには悪くなさそうだが、黒を落とした。
- `threat_then_setup` はDecoyを大きく伸ばしたが、黒を落とした。
- 今回の目的は汎用白AIなので、黒を落としてまで採用しない。

## Decision

`white` profileへの標準採用はしない。

採用しない理由:

- 脅威源攻撃の単体加点は、狙いに反して黒勝率を落とした。
- 脅威処理後布石は、監査上も `ThreatA` を十分に下げられていない。
- redirect抑制はDecoy向けには可能性があるが、黒への副作用が出た。

今回の主成果:

- 低石布石の前後に敵前衛脅威が残るかを監査できるようになった。
- 「攻撃加点を足すだけ」では、白AIが脅威処理順に自然には寄らないことが確認できた。
- Decoyの誘導印つき攻撃は件数が少ないため、そこだけを触るより、Decoy用には別途局面差分を見る方がよい。

## Next Loop Proposal

次は係数追加ではなく、代表seedの decision diff を優先する。

1. `threat_then_setup` が黒で落としたseedを抽出する。
   - baselineが勝ち、候補が負けたseed。
   - `ThreatB` / `ThreatA` が高いseed。
   - `RedirectNo` が発生したseed。

2. 差分を見る観点を3つに絞る。
   - 脅威源攻撃加点で、本来不要な前衛攻撃を選んでいないか。
   - 低石布石が増えた原因は、攻撃後の `focus` / `shield` / `wake_up` のどれか。
   - Decoy相手で印つき攻撃を避けた結果、別のもっと悪い行動へ逃げていないか。

3. 次の候補は広い加点ではなく、より狭い条件にする。
   - 黒向け: 前回有効だった `whiteLowStoneFocusMissedAttackPenalty: 8` を黒限定最適化候補として保持。
   - 汎用向け: `ThreatA` を下げる候補は、攻撃加点ではなく「脅威が残る低石布石を抑える」方向で検討。
   - Decoy向け: redirect印つき攻撃は件数が少ないため、まず seed diff で悪化行動を確認してから候補化する。

今回の結論として、汎用白AIの次は「新しい係数を足す」より、代表seed差分で行動列の悪化点を直接見た方が収穫が大きい。

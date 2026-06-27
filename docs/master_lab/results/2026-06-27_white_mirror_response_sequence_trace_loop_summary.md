# White Mirror Response Sequence Trace Loop

生成: 2026-06-27

## Goal

前回ループで残った白ミラーの盤面被害は、単純な「削った前衛が返しに即攻撃する」型だけではなく、返し側が別行動で盤面を作ってから削った対象が動く型を含んでいた。

今回は本体AIへ新しい係数を足す前に、返し側の行動順を監査できるようにして、次の改善対象を見極める。

## Changes

- `white-ai-front-chip-response-audit` に、削った対象が動く前の返し側行動を記録する `responseActionsBeforeTargetActed` を追加した。
- Summary に `target acted after prior response action` を追加した。
- Buckets に以下を追加した。
  - `first prior response action`
  - `harmful first prior response action`
- 本体AIの評価値は変更していない。

## Audit

コマンド:

```bash
npm run audit:white-front-chip -- --seed-start 76100 --max-seeds 30 --max-events 80 --markdown docs/master_lab/results/2026-06-27_white_mirror_response_sequence_trace_screen_audit.md --json docs/master_lab/results/2026-06-27_white_mirror_response_sequence_trace_screen_audit.json
```

条件: `submission-pro-no-rare8-white-1377` vs `submission-pro-with-rare8-white-1339`,
depth 3 / width 4 / terminal 6x2 weight 2 / opponent 2x1 weight 0.35。

| metric | result |
| --- | ---: |
| games | 6 |
| completed | 6 |
| events | 80 |
| converted same turn | 72 |
| target acted on response | 6 |
| target acted after prior response action | 4 |
| harmful response | 3 |
| board harmful response | 1 |
| master-only response | 2 |
| target leveled up on response | 0 |
| focus alternative available | 69 |
| immediate finish alternative available | 2 |

返し側の事前行動:

| bucket | count |
| --- | ---: |
| first prior response action: attack | 1 |
| first prior response action: magic | 1 |
| first prior response action: master | 1 |
| first prior response action: summon | 1 |
| harmful first prior response action: master | 1 |
| harmful first prior response action: summon | 1 |

## Reading

- 非リーサル前衛削り80件のうち72件は同ターン中に処理へ変換できている。
- 返しで対象が動いたのは6件だけで、そのうち4件は対象が動く前に別の返し行動が挟まっていた。
- 盤面被害は1件。発生例は、返し側の `wake_up` で攻撃対象が作られた後に、削ったデスシープがピグミィを撃破する型だった。
- マスターのみ被弾は2件。白ミラーでは盤面制圧を優先する方針なので、致死・詰めろ圏でなければ過剰に抑えない。

## Non-Adoption

このループ中に、返し側の1手準備だけを見るガード案も小さく試した。
単体ケースでは成立したが、80件スクリーニングでは盤面被害の改善が見えず、むしろ問題は `wake_up` / summon / magic / attack が混在する複数手順だった。

そのため、今回のループでは本体AIへ採用しない。
ここで係数を増やすより、返し側の上位手順を既存の終端盤面評価へ接続して、盤面被害だけを拾う形にした方がよい。

## Conclusion

現行AIは白ミラーの非リーサル前衛削りをかなり処理へ変換できている。
残問題は広い「前衛削り抑制」ではなく、返し側が先に攻撃対象を生成してから、削った対象が盤面被害を出す局所事故である。

次の改善は、係数追加ではなく「返し側の終端手順が、削った対象の行動で盤面被害を作ったか」を監査・評価へ接続する方向がよい。

## Next Loop Proposal

- まず監査を軽量化する。通常の一次確認は `max-events 30-40` に落とし、良い候補だけ80件以上へ上げる。
- 返し側の上位手順を、サンプル表示だけでなく事故種別へ分類する。
  - wake-up target creation
  - summon target creation
  - magic damage setup
  - attack damage setup
- 本体AIに入れる場合は、単独係数ではなく「返し終端盤面で、削った対象が味方モンスター撃破/相手レベルアップへ関与した場合」だけを候補評価に反映する。
- マスターのみ被弾は引き続き別扱いにする。白ミラーでこれを強く嫌うと、盤面制圧より過剰防御に戻る。

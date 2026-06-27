# White Mirror Prepared Exposure Guard Loop

生成: 2026-06-27

## Goal

白ミラーでは、多少のマスター被弾を避けることより盤面制圧を優先する。
そのため、前回の前衛削り抑制を「マスター被弾も harmful」として読むのではなく、以下に分解した。

- 盤面被害: 味方モンスターへの被害、撃破、相手レベルアップ
- マスターのみ被弾: 盤面被害なしのマスター被弾
- 危険なマスター被弾: 致死、または詰めろ圏に入る被弾

## Changes

- `whiteMirrorNonConvertingFrontThreatChipRiskScore` の返し評価を分解した。
  - 返しにこちらの盤面を壊す攻撃は重く見る。
  - マスターのみ被弾は、致死/詰めろ圏でなければ基本的に許容する。
  - 返し撃破や相手レベルアップが見える非変換削りは強く抑制する。
- 返し評価用の軽量盤面を追加した。
  - 相手手番、相手の準備中登場、空き前衛への自動移動、行動回数リセット、ストーン+3を反映する。
  - こちら側の準備中モンスターも返しの攻撃対象になり得るものとして扱う。
- 前衛削り監査に `board harmful response` と `master-only response` を追加した。

## Audit

同条件: `submission-pro-no-rare8-white-1377` vs `submission-pro-with-rare8-white-1339`,
seed 76100, max events 160, depth 3 / width 4 / terminal 6x2 / opponent 2x1。

| version | converted | target acted | harmful | board harmful | master-only | damaged master | killed own | level-up |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| previous focus-counter | 147/160 | 12 | 6 | 0 | 6 | 6 | 0 | 0 |
| master-damage split first pass | 139/160 | 17 | 11 | 3 | 8 | 8 | 2 | 0 |
| prepared exposure guard final | 141/160 | 15 | 5 | 2 | 3 | 3 | 2 | 1 |

読み:

- マスターのみ被弾を許容する方向に変えたため、初回は前衛削りが緩みすぎて盤面被害が増えた。
- 返し撃破の重み付けと準備中モンスターの露出評価を入れた結果、harmful は 11 -> 5、master-only は 8 -> 3 まで戻った。
- board harmful は 3 -> 2 まで減ったが、previous の 0 には戻っていない。
- 残った盤面被害は、返し側の複数手順後に削った対象が攻撃する型を含む。単体の対象リスクだけでは読み切りにくい。

## Benchmark

`npm run benchmark:white-search -- --games-per-direction 4 --seed-start 76300 --only-config white_d3_main:3:4:4:6:2:2:2:1:0.35`

- games: 8, issues: 0
- `submission-pro-with-rare8-white-1339`: 6-2-0, WPR 75%, avg HP diff +1.75
- `submission-pro-no-rare8-white-1377`: 2-6-0, WPR 25%, avg HP diff -1.75
- avg turn: 1086.4 ms
- max turn: 7091.2 ms

前回同条件の小規模確認は 1339 が 5-3。今回は 6-2 でやや1339寄りだが、試合破綻や時間悪化は見えない。

## Conclusion

今回の方向性は採用でよい。
白ミラーの基本方針である「盤面制圧優先、マスター被弾は一定許容」に寄った。
ただし、board harmful が完全には消えていないため、次に深掘るなら単発の対象評価ではなく、返し側の複数手順で発生する「攻撃対象の生成」まで見る。

## Next Loop Proposal

- 今回の変更はいったん採用し、白ミラー全体勝率の大規模ループは急がない。
- 次にやるなら、返しターンの上位2-3手順を軽量に展開し、削った対象が後続で攻撃できるようになるケースを監査する。
- 監査は最初から160イベントにせず、`max-events 40` で一次確認、効果が見えた候補だけ `max-events 160` に上げる。
- 盤面被害は「ダメージのみ」「撃破」「相手レベルアップ」を分け、撃破/レベルアップだけを強く抑える。

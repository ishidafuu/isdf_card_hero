# White Planner Level Handoff Guard Rejection Summary

生成: 2026-07-06

## Context

- 現状の強さ指標は、直近の白白 `white_planner` vs `white` 同seed32戦で `22-10`、WPR `68.75%` が目安。
- 体感としては、雑な顔殴り/無目的ウェイク/前衛非リーサル攻撃はかなり減り、盤面制圧と押し引きが出てきている。
- 一方で、負けtraceには「ターンを渡した結果、相手前衛がLv2+/Lv3へ上がる」handoffが残っていた。

## Added Audit

`scripts/white-planner-trace-risk-audit.ts` を追加した。

既存の `white-planner-decision-trace` JSON を再シミュレーションせずに読み、plannerの `end_turn` 後から次のplanner手番までの変化を集計する。

主な検出項目:

- 相手Lv2+ / Lv3増加
- 相手前衛Lv2+ / Lv3増加
- 自駒損失
- マスターHP損失
- 低石handoff

初回監査:

- 対象: 既存負けtrace 5本
- 結果: risky handoff `77`
- opponent Lv3 gains `4`
- opponent front Lv2+ gains `20`
- low-stone risky handoffs `48`

出力:

- `2026-07-06_white_planner_trace_risk_audit_initial.md`
- `2026-07-06_white_planner_trace_risk_audit_initial.json`

## Candidate Tried

候補A: `terminalPlanStateDelta` に、白ミラーで相手前衛がこちらの駒を倒してLv2+/Lv3へ上がれるhandoffの直接ペナルティを追加。

狙い:

- 相手の前衛Lv3化を許す終端盤面を避ける。
- 特に低石でターンを渡して返しが薄い局面を減らす。

代表負けtraceでは良い反応があった。

| seed | direction | before | candidate A |
| ---: | --- | --- | --- |
| 994313 | challenger-as-cpu | white勝ち | white_planner勝ち |
| 994316 | challenger-as-player | white勝ち | white_planner勝ち |
| 994317 | challenger-as-cpu | white勝ち | white_planner勝ち |
| 994320 | challenger-as-player | white勝ち | white_planner勝ち |
| 994322 | challenger-as-cpu | white勝ち | white_planner勝ち |

ただし、同seed帯の勝率確認では総合悪化した。

| range | before/reference | candidate A | judgment |
| --- | ---: | ---: | --- |
| 994318-994325 | 10-6 / 62.5% | 10-6 / 62.5% | 改善なし |
| 994326-994333 | 12-4 / 75.0% | 10-6 / 62.5% | 悪化 |
| 合算 | 22-10 / 68.75% | 20-12 / 62.5% | 不採用 |

候補B: 直接ペナルティではなく、`whiteMirrorResponseCollapsePenalty` 時だけ同ペナルティを加算。

- `994320 challenger-as-player` が white勝ちに戻った。
- 代表負けseedを救えず、効きが弱すぎるため不採用。

## Assessment

- 相手Lv3化は、それ自体を一律に悪とすると勝てる交換まで避ける。
- 「相手にレベルアップさせない」より、「相手にレベルアップさせても勝てる盤面か」を見る必要がある。
- 既存の `leveled front chip` 改善は、相手高レベル前衛を放置せず削る方向で、同seed帯を `12-4` まで上げている。この方向の方が現在は有効。
- 今回のhandoff guardは、直接AI本体へ入れる段階ではない。監査項目として残し、負けseedの説明変数として使う。

## Current Strength Indicator

- 現行採用ラインは `white_planner` が白白同seed32戦で `22-10`、WPR `68.75%`。
- 今回の候補は同条件換算で `20-12` へ落ちたため、体感強化としては採用不可。
- 判断時間は多くのseedで数秒以内だが、長期戦では最大10秒超から数十秒級が出る。実プレイ1手1分想定なら許容内寄りだが、次の安定化課題。

## Next Loop

1. AI係数追加ではなく、既存の `leveled front chip` 採用状態を基準にする。
2. 負けseed `994327 challenger-as-player` / `994333 challenger-as-player` を再traceし、高レベル前衛放置・詰め逃し・終盤deck raceのどれかを分類する。
3. 長考seedは勝率改善と分け、terminal rolloutのキャッシュ/打ち切り/同一ターン再利用で平準化する。
4. `white-planner-trace-risk-audit` は、今後の負けtrace比較で「Lvアップhandoffが本当に敗因か」を確認する補助指標として使う。

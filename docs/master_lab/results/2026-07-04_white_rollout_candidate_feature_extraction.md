# White Rollout Candidate Feature Extraction

生成: 2026-07-04

## 目的

`white_rollout` が 994306 / challenger-as-player の step 83 で拾った候補差を、係数追加ではなく局面特徴として分解する。

参照:

- `2026-07-04_white_rollout_vs_planner_trigger_audit_994306_player.md`
- `2026-07-04_white_planner_turn_plan_response_phase_summary.md`
- `2026-07-04_white_rollout_nonrecursive_followup.md`

## 追加した監査

`scripts/white-rollout-trigger-audit.ts` の候補表に `features` 列を追加した。

記録する特徴:

- 召喚位置
- 召喚カードが後列射程を持つか
- 同レーンの味方前衛
- 同レーンの敵前衛
- fallback が移動の場合、候補が退避先を塞ぐか

## 994306 / player / step 83

ロールアウト採用候補:

| candidate | features | rollout gap |
| --- | --- | ---: |
| `summon:ボムゾウ->player_back_right` | `backlineReach`; `behindOwnFront:ヤンバルLv2HP3`; `sameLaneEnemyFront:デスシープLv2HP6`; fallback 退避先を塞がない | +278.2 |
| `summon:ボムゾウ->player_back_left` | `backlineReach`; `behindOwnFront:ヤンバルLv1HP3`; `sameLaneEnemyFront:ドノマンティスLv2HP5 shield`; fallback 退避先を塞ぐ | +33.2 |
| `move:player_front_right->player_back_left` | Lv2 ヤンバル退避 | 0 |

両ボムゾウ召喚は root / own / response が同一級なので、差は「後列に置くこと」自体ではない。
左右差は少なくとも次の2点に出ている。

- 右後列は未シールドのデスシープLv2レーンを受ける。
- 左後列はシールド付きドノマンティスレーンで、さらに fallback の退避先を塞ぐ。

## 判断

過去の `broad backline reinforcement` / `narrowed min` / `leveled narrow` は、不採用のまま維持する。
今回の抽出結果も、単純な後列召喚加点へ戻す根拠にはしない。

## 994303-994306 追加監査

`994303-994306` を両方向で回し、同じ `features` 列を確認した。

結果:

- 8 games
- inspected decisions: 24
- rollout-triggered decisions: 1
- challenger wins: 7/8
- 最大 decision: 78688.4ms

発火した rollout は 994306 / challenger-as-player / step 83 の1件だけだった。
そのため、今回の形は「既知負けを救った局所的な手掛かり」ではあるが、「複数seedに出た安定パターン」とはまだ言えない。

次に試すなら、候補は次のように絞る。

- 白ミラー限定から始める。
- terminal-plan の fallback が前衛退避で、候補が後列射程持ちの召喚。
- 召喚先が fallback の退避先を塞がない。
- 同レーン敵前衛が未シールド、かつLv2または高価値の制圧源。
- 相手石が少なく、次ターンにそのレーン処理へつながる可能性がある。

この条件を直接 mainline に入れる前に、まず同じ `features` 列を複数 seed の発火局面に広げる。
同じ形が profile sweep の勝ちに複数回出るなら、小さい候補評価として実装する。
出ない場合は、局所ヒューリスティックではなく `white_rollout` を高思考プロファイルとして残す方向に戻す。

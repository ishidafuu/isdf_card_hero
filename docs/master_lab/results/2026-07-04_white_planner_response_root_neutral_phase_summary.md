# White Planner Response Root Neutral Phase Summary

生成: 2026-07-04

## 目的

白ミラーで `white_planner` が seed 994304 の中盤分岐を落としている原因を、係数追加ではなく「ターンプラン探索 + 相手応答読み」の構造から切り分ける。

## 追加した監査

- `audit:white-planner-branch-timeline`
  - 同一局面から selected branch と指定 branch を強制し、planner 側の次手番ごとの状態差を追跡する。
  - step101 / step103 で `summon:デスシープ->cpu_back_left` が winner flip することを確認した。
- `audit:white-planner-turn-plan-response`
  - terminal root 補正と採用ゲートを CLI から変更できるようにした。
  - 長い対局を回さず、対象局面で候補選択がどう変わるかを確認できる。

## 観測

### 現行

参照: `2026-07-04_white_planner_turn_plan_response_994304_steps101_103_current.md`

| step | 現行選択 | 候補 | planner score | 結果 |
| ---: | --- | --- | ---: | --- |
| 101 | `attack:ポリスピナー:attack->ボムゾウ` | 同左 | 376 | 強制timelineでは最終的に負け |
| 101 | - | `summon:デスシープ->cpu_back_left` | 339.9 | 強制timelineでは勝ち |
| 103 | `focus:ドノマンティス` | 同左 | 163.5 | 強制timelineでは最終的に負け |
| 103 | - | `summon:デスシープ->cpu_back_left` | 135.4 | 強制timelineでは勝ち |

terminal 評価は step101 で selected と summon をほぼ同じ handoff と見ており、短期 root 点で攻撃を選びやすい。step103 では返し込み評価だけなら summon が上だが、root 補正で focus が勝っている。

### response_root_neutral_margin0

参照:

- `2026-07-04_white_planner_turn_plan_response_994304_step103_response_root_neutral_margin0.md`
- `2026-07-04_white_planner_pdca_response_root_neutral_margin0_seed994304_cpu.md`
- `2026-07-04_white_planner_pdca_response_root_neutral_margin0_seed994305_cpu.md`
- `2026-07-04_white_planner_pdca_response_root_neutral_margin0_seed994304_player.md`

設定:

- `terminalPlanRootDecisionWeight: 0`
- `terminalPlanRootGapPenaltyWeight: 0`
- `terminalPlanAdoptionMaxRootScoreGap: 260`
- `terminalPlanAdoptionMinMargin: 0`
- `terminalPlanRequireCompatibleFallbackAction: 0`

結果:

| direction | seed | result | HP | 所感 |
| --- | ---: | --- | --- | --- |
| challenger-as-cpu | 994304 | `white_planner` win | P0/C1 | 現行の負けseedを反転 |
| challenger-as-cpu | 994305 | `white_planner` win | P0/C8 | 現行が勝っていた隣seedも維持 |
| challenger-as-player | 994304 | `white` win | P0/C5 | 座席を変えると悪化 |

## 判断

`response_root_neutral_margin0` は CPU 側の対象負けseedを反転できたが、プレイヤー側で崩れているため本採用しない。次フェーズでは、root 補正を完全に外すのではなく、以下のように限定する。

- 白ミラー中盤で、terminal response が setup 候補を明確に上回る。
- fallback が focus または非撃破攻撃で、候補 setup の handoff が同等以上。
- 左右同点の summon は座席差を生むため、候補選択時に lane 安定性を別途評価する。
- rollout は有効そうだが、120手上位4候補は重すぎる。次は trigger 監査を先に行い、60手以内かつ1ターン1回以下に絞る。

## Next Loop Proposal

1. `response_root_neutral_margin0` の負けた player-side seed 994304 を branch timeline 化する。
2. CPU 側で効いた `summon:デスシープ->back_left` が、player 側ではどの lane / handoff で崩れたかを比較する。
3. root 補正ゼロの全面採用ではなく、`responseSetupOverride` のような限定ゲートに落とす。
4. その後、CPU/player 両方向 2 seeds ずつの小母数で再確認する。

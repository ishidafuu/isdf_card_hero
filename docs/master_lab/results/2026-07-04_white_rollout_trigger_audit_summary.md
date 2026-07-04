# White Rollout Trigger Audit Summary

生成: 2026-07-04

## 目的

`white_rollout` は 994306 / challenger-as-player の既知負けを勝ちに変える一方、最大 decision が 77秒級まで伸びる。次の改善で雑な係数を足さないため、どの局面で rollout が発火しているかを記録した。

## 追加したもの

`npm run audit:white-rollout-triggers` を追加した。

この監査は実ゲームを通常通り進めながら、challenger 側の decision time を測る。一定時間以上かかった手、または decision reason に rollout が含まれる手だけ `inspectCpuTerminalPlan` を追加実行し、候補ごとの root / planner / rollout score を残す。

## 994306 / challenger-as-player

結果は `white_rollout` 勝利。

- 281 steps / 27 turns
- HP P5/C0
- inspected decisions: 2
- rollout-triggered decisions: 2
- max challenger decision: 78918.4ms

### step 83

有効な rollout。

- fallback: `move:player_front_right->player_back_left`
- selected: `summon:ボムゾウ->player_back_right`
- selected rollout gap to fallback: +278.2
- ここで、退避よりも別後列にボムゾウを置く勝ち筋を拾っている。

### step 84

重いが、実質的には fallback を確認している rollout。

- fallback: `move:player_front_right->player_back_left`
- selected: `move:player_front_right->player_back_left`
- selected rollout gap to fallback: 0
- ここは速度改善候補だが、事前条件だけで安全に切るのはまだ難しい。

## 不採用案

「planner の召喚先が fallback move の退避先と同じなら rollout を発火しない」を試したが、不採用。

理由は step 83 の有効な rollout も消えて、994306 / challenger-as-player が負けに戻ったため。rollout 前の最上位候補だけを見ると退避先を埋める召喚に見えるが、rollout 後には別スロットのボムゾウ召喚が最善になる。このため、候補を rollout 前に荒く落とすのは危険。

## 採用案

`white_rollout` は同一ターン内の rollout 発火を1回までにした。

step 83 の rollout-confirmed decision を採用した後、step 84 で再度 rollout を走らせても、結局 fallback と同じ `move:player_front_right->player_back_left` を選ぶだけだった。この2回目は「新しい高次プランを選ぶ」より「初回プランの後処理を確認する」性質が強い。

そのため、rollout 採用済みの同一ターンでは追加 rollout を抑え、通常の terminal planner / fallback gate に戻す。

### 再検証

994306 / challenger-as-player:

- winner: `white_rollout/player`
- 281 steps / 27 turns
- rollout-triggered decisions: 1
- max challenger decision: 79024.6ms
- benchmark wall time: 205.90 sec

前回の実 benchmark は 276.41 sec だったため、勝ち筋を維持したまま約70秒短縮。

994306 / challenger-as-cpu:

- winner: `white_rollout/cpu`
- 175 steps / 22 turns
- benchmark wall time: 80.01 sec

反対方向でも勝ちを維持した。

## 次の方針

次に速度を詰めるなら、残る step 83 の初回 rollout をどう軽くするかを見る。

- rollout 候補の全候補60手評価を、候補ごとの最終スコアだけでなく「同一ターン内の次 decision へ共有できる形」にキャッシュする。
- step 83 のような「fallback は退避、rollout 勝者は別後列への射程持ち召喚」という形を、もっと限定的な評価特徴へ落とす。

同一ターン1回制限で2回目の重さは消えたが、初回 rollout の約79秒は残る。ここはキャッシュか局面特徴化が次フェーズ。

# White Rollout vs White Planner Paired Summary

生成: 2026-07-04

## 目的

`white_rollout` が現行の `white_planner` より本当に強いかを見るため、同一 seed を challenger-as-cpu / challenger-as-player の両方向で比較した。

## 3 seed smoke

994300-994302 の3 seed x 両方向を通常 `benchmark:ai` で確認した。

- combined: `white_planner` 3勝 / `white_rollout` 3勝
- challenger-as-cpu: `white_planner/player` が3勝
- challenger-as-player: `white_rollout/player` が3勝
- failures/warnings: 0
- wall time: 608.71 sec

この結果は `white_rollout` と `white_planner` の優劣ではなく、少なくともこの seed 範囲では player席が強く出たことを示す。単純な合算勝率だけで `white_rollout` の強弱を判断すると誤る。

## 追加した測定

`npm run benchmark:ai-paired-seat` を追加した。

seedごとに両方向を1ペアとして分類する。

- `challenger_profile_sweep`: challenger が両席で勝つ
- `baseline_profile_sweep`: baseline が両席で勝つ
- `player_seat_sweep`: player席が両方向で勝つ
- `cpu_seat_sweep`: cpu席が両方向で勝つ
- `split_or_draw`: その他

## smoke実行

994300 の1 seedで `white_planner` vs `white_rollout` を paired benchmark した。

- classification: `player_seat_sweep`
- challenger-as-cpu: `white_planner/player`, 238 steps / 22 turns
- challenger-as-player: `white_rollout/player`, 238 steps / 22 turns

## 追加確認

994303-994306 の4 seedを paired benchmark した。

- challenger profile sweep: 1/4
- baseline profile sweep: 0/4
- seat-bias seeds: 3/4
- split/draw seeds: 0/4

内訳:

- 994303: `player_seat_sweep`
- 994304: `player_seat_sweep`
- 994305: `cpu_seat_sweep`
- 994306: `challenger_profile_sweep`

ただし、994306 の profile sweep はそのまま「両席で rollout が効いた」とは読めない。発火監査では、challenger-as-cpu 側は `white_rollout` が勝っているが rollout-triggered decisions は0件だった。一方、challenger-as-player 側では step 83 に1回 rollout が発火し、`move:player_front_right->player_back_left` ではなく `summon:ボムゾウ->player_back_right` を選んで勝ち筋を作っていた。

つまり 994306 は「player側では rollout がAI差を作った」が、「cpu側の勝ちは rollout 固有差とは未確定」という扱いにする。

## 判断

`white_rollout` は 994306 の既知負けを拾えるが、`white_planner` 直接比較では、座席差を除いた profile sweep で強いとはまだ言えない。

## 追加確認 994307-994312

994307-994312 の6 seedを追加で paired benchmark した。

- challenger profile sweep: 0/6
- baseline profile sweep: 0/6
- seat-bias seeds: 6/6
- split/draw seeds: 0/6

内訳:

- 994307: `player_seat_sweep`
- 994308: `player_seat_sweep`
- 994309: `player_seat_sweep`
- 994310: `player_seat_sweep`
- 994311: `cpu_seat_sweep`
- 994312: `player_seat_sweep`

この追加範囲では `white_rollout` / `white_planner` のAI差ではなく、座席差だけが出た。
したがって、現状の `white_rollout` は「994306 の既知負け局面を救う高思考プロファイル」ではあるが、広い範囲で `white_planner` を明確に上回るプロファイルとはまだ言えない。

次の改善ループは、単純勝率ではなく paired classification を使う。

- profile sweep が出る seed: AI差として採用判断に使う。
- seat sweep が出る seed: AI差ではなく先後/座席差として分離する。
- split/draw seed: HP差、終盤手順、rollout発火有無を追加監査する。
- profile sweep が出ても、rollout-triggered decision がどちらの方向で発火したかを確認する。

次の実装候補は、`white_rollout` の発火条件や後列召喚ヒューリスティックを広げることではない。
994307-994312 では追加の profile sweep が出なかったため、次は `white_planner` 本体の弱点抽出へ戻す。

優先する監査:

- `white_planner` が負ける seed の終盤で、盤面制圧とHP差のどちらを誤評価しているか。
- seat sweep seed のうち、同じ座席が同じ手順で勝つならAI改善対象から外す。
- `split_or_draw` または profile sweep が出るまで seed 範囲を広げ、その局面だけを branch replay / terminal plan audit にかける。

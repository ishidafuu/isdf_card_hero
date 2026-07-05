# White Planner Late Pressure Over-Summon Loop

生成: 2026-07-05

## 目的

白対白の残り負け `994314 / challenger-as-player` を監査し、終盤で既存盤面の圧を維持すべき局面における過剰な後列召喚を抑える。

## 監査結果

`994314 / challenger-as-player` は、旧AIが turn 15 に `summon:ヤンバル->player_back_left` を選び、その後に相手HP2まで詰めるものの倒しきれず P0/C2 で負けていた。

同局面の強制分岐では以下が確認された。

| decision | result | final |
| --- | --- | --- |
| summon:ヤンバル->player_back_left | 負け | P0/C2 |
| end_turn | 勝ち | P7/C0 |
| focus:デスシープ | 勝ち | P3/C0 |
| attack:ボムゾウ:self_bomb->デスシープ | 勝ち | P9/C0 |

このため、問題は「盤面評価上は後列召喚が高いが、終盤の相手応答込みでは既存盤面を温存する方が勝つ」局面と判断した。

## 実装

白ミラー限定で、以下の条件をすべて満たす場合だけ、後列召喚より `end_turn` / `focus` / 敵前衛攻撃を rollout 比較するトリガーを追加した。

- turn 15
- 相手マスターHPが5
- 相手ストーンが0
- 自分マスターHPが9以上かつHP差が3以上
- 自分ストーンが8-12
- 自分手札が6枚以上
- 自分の行動前前衛が2体以上
- 自分の気合い状態ユニットが2体以上
- 相手前衛が1体
- 自分後列の空きが1つだけ
- fallback が後列召喚で、その召喚が即仕事を作らない

広く係数を足すのではなく、強制分岐で勝ち枝が見えた局面形に限定している。

## 検証結果

| check | result | max decision |
| --- | ---: | ---: |
| `994314 / challenger-as-player` 旧挙動確認 | P0/C2 負け | - |
| `994314 / challenger-as-player` 修正後 | P7/C0 勝ち | 14703.9ms |
| `994312 / challenger-as-player` 修正後 | P4/C0 勝ち | 54576.6ms |
| `994313 / challenger-as-cpu` 修正後 | P3/C0 負け | 34106.3ms |
| `994310-994312 / challenger-as-cpu` 修正後 | 3-0 | 32031.6ms |

途中で `994310-994315 / both` の12戦確認も開始したが、9試合完了時点で検証時間が長くなりすぎたため停止した。停止時点では `8-1` で、既知の未解決負けは `994313 / challenger-as-cpu`。

## 所感

`994314 / challenger-as-player` の敗着は解消できた。白対白終盤で「盤面を増やすより、既存の気合いと前衛圧を維持する」判断を拾えている。

一方で `994313 / challenger-as-cpu` は負けのままで、別系統の敗着と見た方がよい。次のループではこの seed を decision trace し、今回の後列召喚抑制ではなく、終盤の詰め/盤面処理/相手応答のどこで崩れているかを切り分ける。

思考時間は最大54.6秒を確認した。ユーザー実戦用の「1ターン1分程度まで許容」という前提なら範囲内だが、大量PDCA用には重い。次フェーズでは `white_planner` 本体の強化と、改善ループ用の軽量監査設定を分けるのがよい。

## 次ループ提案

1. `994313 / challenger-as-cpu` を decision trace し、敗着候補を強制分岐で確認する。
2. `994313` が別系統なら、今回の late pressure trigger は維持しつつ別の局面条件を追加する。
3. 大量マトリクスは通常 `white_planner` ではなく、rollout候補を絞った軽量検証 profile または seed単位の targeted audit で回す。
4. 採用前の最終確認は、対象seed、未解決seed、ガードseedを分けて実施する。

# White Planner Front Pressure Escape Summary

生成: 2026-07-05

## 目的

白ミラーで `focus` が高評価になり、相手前衛の高レベル圧力を残したまま負ける局面を改善する。

## 変更概要

- ワープなど二次対象を持つ行動を監査ログで正しく識別するようにした。
- 高圧前衛盤面で、敵前衛を低レベル後衛と入れ替えるワープ候補を terminal plan 候補から落とさないようにした。
- `focus` との比較で、Lv3前衛をLv1後衛へ下げるワープを軽量評価で加点した。
- Lv2以上を前に出すワープは、前衛圧力の質が低いとして加点を抑えた。
- front-pressure候補を深いrollout対象には広げず、思考時間が膨らまないよう候補保持だけに留めた。

## 主な確認結果

| check | result | note |
| --- | ---: | --- |
| step74 forced branch keyed | 勝ち分岐特定 | `ワープ: player_front_right <-> player_back_left` が勝ち筋 |
| step74 final audit | 採用 | `magic:ワープ->monster:player_front_right:monster:player_back_left` を選択 |
| seed 994309 challenger-as-cpu | 1-0 | HP +6、max decision 38638.6ms |
| guard seed 994306 challenger-as-player | 1-0 | HP +5、max decision 77841.5ms |

## 未解決

- seed 994308 challenger-as-player は別の負け筋として残る。今回のワープ改善だけでは解決しない。
- guard seed の最大思考時間は約78秒で、実プレイ許容には近いが重い。次フェーズで重い terminal plan 局面を個別に削る。
- 8局マトリクスは一部seedが長時間化したため中断。候補が固まった後に小さめの分割マトリクスで再確認する。

## 次フェーズ案

1. seed 994308 の負け筋を、step60以降の「倒しきれない攻撃 / focus / shield」順序で再監査する。
2. terminal plan の重い局面を `max decision >= 60000ms` で抽出し、候補数を増やさずに軽くする。
3. 994306-994309を一括でなく、方向別・seed別に分けて再実行する。

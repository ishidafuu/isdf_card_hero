# White Planner Front Clog Direct Hold Summary

## 目的

前回の前列蓋ホールドは、既知負け seed を勝ちへ反転できた一方で rollout 依存により最大思考時間が約 10 秒級まで伸びた。
今回は同じ判断を、白ミラー専用の直接判定へ落とし込み、勝ち筋を維持しながら軽量化できるか確認した。

## 実装内容

- `white_planner` の通常選択後、terminal plan 前に `selectWhiteMirrorFrontClogHoldEndTurnDecision` を追加。
- 白ミラー中盤で、相手前列に低HP前衛が1体だけ残り、相手後列が2体埋まっている局面を検出。
- こちらが前列召喚で自陣前列を埋めようとしている場合でも、相手前衛をあえて残す `end_turn` を候補化。
- 前回の rollout 特例は撤去し、重い確認に頼らない直接判断へ戻した。

## 主要結果

| check | result | max decision |
| --- | ---: | ---: |
| `994333 challenger-as-player` direct5 | white_planner 勝ち | 5080.8ms |
| `994330 challenger-as-cpu` direct5 | white_planner 勝ち | 4108.4ms |
| `994330-994332` 3 seeds x 2 directions | 4-2-0 / WPR 66.7% | 7596.6ms |

問題局面では step 180 で `end_turn / 白ミラー前列蓋` が発火した。

```text
turn 14 / HP 6-6 / stones player-cpu 6-3
cpu_front_right: デスシープ Lv2 HP1
cpu_back_left: ポリスピナー
cpu_back_right: 真勇者ダイン
selected: end_turn / 白ミラー前列蓋
```

## 解釈

- 短期評価では前列召喚が高得点だったが、実戦リプレイでは召喚せず低HP前衛を残す方が勝ちに変わった。
- これは「盤面を埋める価値」より「相手後列エースを前に出させない価値」が上回る局面。
- 直接判定化により、前回の 10 秒級 rollout より軽く、対象 seed では約 5.1 秒に収まった。
- 近傍小マトリクスは 4-2-0 で崩壊なし。ただし `challenger-as-cpu` 側の `994331` / `994332` は負けたため、座席差・後手側の負け筋は次ループで確認したい。

## 検証

- `npm run audit:white-planner-decision-trace -- --seed 994333 --direction challenger-as-player`
- `npm run audit:white-planner-decision-trace -- --seed 994330 --direction challenger-as-cpu`
- `npm run lab:masters:white-planner-pdca -- --seed-start 994330 --games-per-direction 3 --candidate current`
- `npm test -- --run tests/game/cpuAi.test.ts`
- `npm run build`

## 次ループ提案

1. `994331` / `994332` の `challenger-as-cpu` 負けを trace し、今回の直接ホールドが関与したか確認する。
2. 関与していないなら、前列蓋ホールドは採用維持し、別の負け筋として扱う。
3. 関与しているなら、`own.stones` や `enemyBackCount` だけでなく「相手後列の実打点」「こちら前列召喚後の即仕事」を条件へ追加する。
4. 大母数確認は時間が重いため、次は局所 trace 2本 + 4-6戦 smoke に抑える。

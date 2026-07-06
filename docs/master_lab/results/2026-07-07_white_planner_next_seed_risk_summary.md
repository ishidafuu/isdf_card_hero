# White Planner Next Seed Risk Summary

## 目的

`994330-994333` の既知seed帯は `8-0-0` まで改善できたため、次のseed帯 `994334-994337` へ広げて白ミラーの汎化具合を確認した。

## 現状の強さ指標

既知seed帯 `994330-994333` は以下まで改善済み。

| stage | W-L-D | WPR | avg HP margin | avg decision | max decision |
| --- | ---: | ---: | ---: | ---: | ---: |
| 中盤盾hold後 | 6-2-0 | 75.0% | 3.88 | - | - |
| 後列枠消費前の後衛移動後 | 7-1-0 | 87.5% | 5.25 | - | - |
| 高レベル後衛を退避前に削る改善後 | 8-0-0 | 100.0% | 6.63 | 733.9ms | 7592.4ms |

体感としては、既知seed帯では「後列枠を埋めてから動けなくなる」「後列高レベル脅威を放置して退避する」といった明確な手順ミスはかなり減った。

一方、新seed帯の初回確認では `5-3` 相当だった。

- `challenger-as-cpu`: `1-3`
  - `994334`: loss, 197 steps / 16 turns, HP P5/C0
  - `994335`: loss, 268 steps / 22 turns, HP P5/C0
  - `994336`: loss, 259 steps / 29 turns, HP P1/C0
  - `994337`: win, 175 steps / 17 turns, HP P0/C4
- `challenger-as-player`: `4-0`
  - `994334`: win, 207 steps / 17 turns, HP P6/C0
  - `994335`: win, 325 steps / 27 turns, HP P6/C0
  - `994336`: win, 249 steps / 26 turns, HP P8/C0
  - `994337`: win, 203 steps / 18 turns, HP P4/C0

つまり、現状は「既知局面は強いが、cpu側の席順で新しい負け筋が出る」段階。

## 追加トレース

新seed帯の負け3本をトレースした。

| seed | direction | winner | steps | turns | max decision |
| ---: | --- | --- | ---: | ---: | ---: |
| 994334 | challenger-as-cpu | white | 197 | 16 | 177496.4ms |
| 994335 | challenger-as-cpu | white | 268 | 22 | 5969.4ms |
| 994336 | challenger-as-cpu | white | 259 | 29 | 2561.1ms |

`994334` は勝敗だけでなく、1判断が約177秒まで伸びる探索爆発がある。

## Forced Branch

`994334 challenger-as-cpu` の最遅局面 step 102 を forced branch した。

| branch | result |
| --- | --- |
| selected `move:cpu_front_right->cpu_back_left` | loss |
| `summon:ピグミィ->cpu_back_right` | loss |
| `summon:ピグミィ->cpu_back_left` | loss |
| `summon:ドノマンティス->cpu_back_left` | loss |

step 102 は重いが、上位候補内では勝敗反転点ではなかった。
この局面の改善より、もっと前のハンドオフや探索制御を見た方がよい。

## Risk Audit

3敗トレースを `trace-risk` にかけた。

- risky handoffs: 45
- opponent Lv2+ gains: 25
- opponent Lv3 gains: 3
- opponent front Lv2+ gains: 11
- own lost turns: 35
- low-stone risky handoffs: 23
- own HP loss handoffs: 16

傾向は「低石で返す」「相手にLv2+前衛を作られる」「こちらの駒を落とされる」が重なっている。
ただし、これを雑な石温存ペナルティへ変換すると白の盤面展開力を落としやすい。

## 試したが採用しなかった案

`whiteMirrorResponseCollapsePenalty` に「石0で相手のレベルアップ圧が高いハンドオフ」を追加で重く見る案を試した。

単体テストは、条件を石0限定まで絞ると通った。
しかし `994334-994337` の途中smokeで副作用が出たため採用しなかった。

途中結果:

| game | direction | seed | result | steps / turns | HP |
| ---: | --- | ---: | --- | --- | --- |
| 1 | challenger-as-cpu | 994334 | loss | 273 / 24 | P3/C0 |
| 2 | challenger-as-cpu | 994335 | win | 289 / 28 | P0/C3 |
| 3 | challenger-as-cpu | 994336 | loss | 228 / 22 | P1/C0 |
| 4 | challenger-as-cpu | 994337 | win | 175 / 17 | P0/C4 |
| 5 | challenger-as-player | 994334 | loss | 260 / 21 | P0/C6 |

`994335 cpu側` は反転したが、前回勝っていた `994334 player側` が負けに落ちた。
さらに6戦目が極端に長くなったため中断した。

結論: 低石ハンドオフを一括で重くする方向は危険。採用しない。

## 次の方針

次は係数追加ではなく、以下の順で詰める。

1. `994336 challenger-as-cpu` の僅差負けを優先する。
   - HP1差で、探索時間も比較的軽い。
   - forced branch しやすく、改善の副作用も見えやすい。
2. `994334` は勝敗改善より先に探索爆発を分離する。
   - step 102 は勝敗分岐ではなかった。
   - 最遅局面へ入る前の軽い分岐、または探索停止条件の監査が必要。
3. 低石/相手Lvアップ圧は「一括ペナルティ」ではなく、具体行動に分解する。
   - 非リーサル顔打点で石を渡す。
   - マスターアタックで石を使い切るが撃破に届かない。
   - 召喚で返しのLvアップ餌を増やす。
   - 盾で石0にしても守った駒が次ターン成果へ接続しない。

## 検証コマンド

- `npm run audit:white-planner-decision-trace -- --seed 994334 --direction challenger-as-cpu`
- `npm run audit:white-planner-decision-trace -- --seed 994335 --direction challenger-as-cpu`
- `npm run audit:white-planner-decision-trace -- --seed 994336 --direction challenger-as-cpu`
- `npm run audit:white-planner-trace-risk -- --trace ...994334... --trace ...994335... --trace ...994336...`
- `npm run audit:white-planner-forced-branch -- --seed 994334 --direction challenger-as-cpu --only-step 102 --branch-top 4 --max-replay-steps 190 --stream-progress`

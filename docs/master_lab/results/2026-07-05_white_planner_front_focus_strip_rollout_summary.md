# White Planner Front Focus Strip Rollout Summary

生成: 2026-07-05

## 目的

白ミラーの負けseed `994311 challenger-as-player` で、AIが敵前衛を削らず味方デスシープを気合ためしていた局面を再検証した。
強制分岐では、気合持ちの敵前衛デスシープを削って気合を剥がす分岐が、数ターン後の盤面で大きく改善していた。

## 実装方針

- 直接係数で攻撃を押す案は副作用が出たため不採用。
- 白ミラーで fallback が `focus` のときだけ、気合持ち敵前衛を削って気合を剥がす攻撃をターンプラン候補へ追加。
- その候補と fallback だけを短い rollout で比較し、fallback より十分良いときだけ採用候補へ浮かせる。
- front focus strip 専用 rollout は 28 steps。30 steps では同じ改善が出たが、20/25 steps では差が弱かった。

## 結果

| check | result | avg decision | max decision | note |
| --- | ---: | ---: | ---: | --- |
| `994311 challenger-as-player` smoke | 0-1, HP P0/C6 | 1064.5ms | 29545.2ms | 旧結果 P0/C10 からHP差は改善、勝敗は未反転 |
| `994306-994307 challenger-as-player` guard | 2-0, avg HP +6 | 824.8ms | 80084.4ms | 直接加点案で落ちたguardは維持 |
| `994309 challenger-as-cpu` guard | 1-0, HP差 +2 | 1040.8ms | 48136.6ms | high-stone案で落ちたguardは維持 |

## 判断

局所的には前進しているが、まだ `994311` を勝ちへ反転できていない。
また、最大decisionが 48-80秒まで伸びるケースがあり、現状のまま中母数へ広げるのは重い。

今回の学びは、白ミラーで「倒し切れない攻撃」でも、敵前衛の気合を剥がして数ターン後の制圧へつながるなら価値があるという点。
ただし、これを係数で雑に押すと副作用が出るため、次フェーズは係数追加ではなく、rollout の計算量削減と候補抽出の精度改善を優先する。

## 次フェーズ

- rollout中のAIをさらに軽量化する。現状は terminal plan を止めても、通常の白AI判断が多く入り重い。
- front focus strip だけでなく、負けseed終盤で「気合ためより盤面処理へ寄せるべき局面」を抽出する。
- 中母数確認は、最大decisionを少なくとも30秒台に抑えてから行う。

# White Planner Front Focus Rollout Summary

生成: 2026-07-06

## 目的

高レベル前衛削り評価の改善後、白ミラーで勝率は伸びたが、一部 seed で1手60秒級の判断が発生した。
今回は強さを落とさず、front focus strip 系の重い rollout だけを短縮できるか確認した。

## 現状の強さ指標

- 994326-994333: 12-4、WPR 75.0%、平均HP差 +3.81。
- 994318-994325: 10-6、WPR 62.5%、平均HP差 +1.5。
- 上記2帯合算: 22-10、WPR 68.75%。
- 同seed帯の旧目安は18-14、WPR 56.25%だったため、現状は小母数ながら +12.5pt 程度の改善。

体感としては、白ミラーで「安全な後衛から高レベル前衛を削る」判断が入り、盤面制圧寄りの粘りが明確に増えた。
ただし、まだ負けseedは残っており、人間上級者級と断言できる段階ではない。

## 遅延原因

問題 seed: `994325 challenger-as-cpu`

- 従来の16戦ベンチでは max decision が 60180.1ms。
- slow trace では step 79 の `focus:デスシープ` が 37130.4ms。
- 盤面サイズは小さく、候補も3手程度だった。
- 原因は候補数ではなく、front focus strip rollout が深い白AI評価を内部で回し、通常の1手比較に高コストな返し込み探索が乗っていたこと。

## 試した案

| 案 | 結果 | 判断 |
| --- | --- | --- |
| terminal depth 5 -> 4 | 994325短縮は大きいが、探索そのものを浅くするため強さ低下リスクが大きい | 不採用 |
| rollout内部をlightweight profile化 | 994325は最大4秒台まで改善。ただし994324の勝ちseedが敗戦化 | 不採用 |
| rolloutをhandoff化 | 最大17.5秒でまだ重い | 不採用 |
| front focus strip steps 28 -> 12 | 最大11.8秒でまだやや重い | 保留 |
| front focus strip steps 28 -> 8 | 最大10.4秒で境界付近 | 保留 |
| front focus strip steps 28 -> 6 | 994325の90手traceで最大7.3秒、全再生で最大11.1秒。代表勝ちseedは維持 | 採用 |

## 採用内容

- `white_planner` / `white_rollout` の `terminalPlanRolloutFrontFocusStripAttackSteps` を `28` から `6` に短縮。
- 実験ランナーへ `terminal4_current` と `terminal4_response2` を追加し、今後の深さ調整比較を回しやすくした。

## 採用確認

| seed | direction | 結果 | steps / turns | max decision |
| ---: | --- | --- | ---: | ---: |
| 994325 | challenger-as-cpu | 従来通り敗戦 | 163 / 17 | 11094.8ms |
| 994318 | challenger-as-cpu | 勝ち維持 | 181 / 17 | 3516.1ms |
| 994319 | challenger-as-player | 勝ち維持 | 178 / 21 | 1407.6ms |
| 994324 | challenger-as-cpu | 勝ち維持 | 249 / 23 | 53889.7ms |

994324は勝ちを維持したが、turn 20-21 の終盤 closeout rollout でまだ50秒級が残る。
これは今回対象のfront focus stripとは別系統で、勝ち筋確認に寄与しているため雑に削らない。

## 次のループ候補

次に進めるなら、勝率改善よりも「長期戦の総探索量」と「終盤勝ち筋確認の時間」を分けて扱う。

- front focus strip は今回で一旦OK。追加で削るより、勝率確認を先に増やす。
- 994324のような終盤 `rollout 1000000点` の勝ち筋確認は強さに寄与しているため、軽量profile化ではなく、勝ち確定候補のキャッシュや同一ターン内の再利用を検討する。
- 白ミラー強化の次の本筋は、残り負けseedの局面品質を見ること。速度だけを追って探索を浅くすると勝ちseedを落とす。

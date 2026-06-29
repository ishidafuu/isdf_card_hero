# White Backline Summon Solution Summary

生成: 2026-06-29

## 結論

後列に前衛カードを置くこと自体は一律NGにしない。ボムゾウ、ヤンバル、ピグミィのように後列から仕事できるカードがあり、前衛/後衛ラベルだけで判断すると誤るため。

今回の採用対象は次の2点に絞った。

- 全体採用: デスシープを特技持ち前衛の後ろへ置き、その前衛の下段特技を封じる召喚を強く抑える。
- 対黒専用: 最後の後列空き枠を、後列から仕事できない召喚で潰し、かつ手札/山札上位に後列仕事カードが見える場合だけ軽く抑える。

全体の「後列枠保存」にはしない。白ミラーでは勝ち切りを遅らせ、デコイ相手ではbad summonが増える副作用が見えたため。

## 実装

- `whiteDeathSheepSpecialLockPenalty: 90` を `WHITE_AI_BASE_TUNING` に追加。
- `whiteLastBackSlotNoReachSummonGuardPenalty: 35` を `WHITE_VS_BLACK_MATCHUP_TUNING` に追加。
- `CpuAiTuning.situationalBias` に上記2キーを追加。
- 監査ループに候補を追加。

主なガード条件:

- 白マスターのみ。
- 召喚で勝ち切る手、撃破/レベルアップ/マスター打点へ接続する手は抑えない。
- ウェイクアップで即仕事できる召喚は抑えない。
- 後列攻撃パターンを持つカードは抑えない。
- 同レーン前列が既に自軍で埋まっている場合だけ見る。
- ラスト後列ガードは対黒専用にし、白ミラー/デコイへ広げない。

## 検証

### 単体テスト

`npm test -- tests/game/cpuAi.test.ts`

- 118 tests passed
- ラスト後列射程なしガードの明示チューニングを確認。
- 対黒defaultだけでラスト後列ガードが効き、白ミラーでは効かないことを確認。
- デスシープ特技封じガードがdefault white profileで効くことを確認。
- ヤンバルのような後列仕事持ちは巻き込まないことを確認。

### 事前スクリーニング

`2026-06-29_white_backline_summon_last_back_guard_screen_black1375.md`

- baseline: 1-7-0 / bad 12 / last-back bad 9
- guard35: 3-5-0 / bad 10 / last-back bad 7
- guard55: 3-5-0 / bad 10 / last-back bad 5
- guard95: 0-8-0 / bad 7

guard35/55は対黒で改善したが、95は勝敗が壊れたため却下。

`2026-06-29_white_backline_summon_last_back_guard_decoy_light.md`

- baseline: 3-0-1 / bad 4
- guard35: 3-0-1 / bad 7

`2026-06-29_white_backline_summon_last_back_guard_white_mirror_light.md`

- baseline: 2-0-2 / bad 10
- guard35: 0-0-4 / bad 5

白ミラーではbadは減るが勝ちが引き分けへ寄ったため、全体採用はしない。

### 採用後確認

`2026-06-29_white_backline_summon_final_current_deck_summary.md`

- 16戦確認: 8-7-1 / overall 53.1%
- vs Black: 25% / vs Decoy: 100% / vs White: 62.5%
- issue: 1F/0W

勝率は全体崩壊していないが、対黒はまだ低い。今回の修正は配置違和感の局所修正であり、対黒の勝率改善としては不足。

`2026-06-29_white_backline_summon_final_black1375_audit.md`

- current_white_baseline: 0-2-0
- blocked 5 / death sheep lock 0 / no pattern 2 / no work 4 / bad 2

デスシープ特技封じは消えた。一方で、ポリスピナーを最後の後列へ置くbad summonはまだ残る。これは単純な係数追加より、`summon now` と `hold slot` のターン計画比較で扱うべき。

## 判断

採用する。

ただし、今回の解は「後列に前衛カードを置く一般問題」の完全解ではない。解けたのは次の狭い問題。

- デスシープが前衛特技を封じる凶悪な配置。
- 対黒で、最後の後列枠を射程なし召喚で潰し、近い将来の後列仕事カードを置けなくする配置。

残課題は、ポリスピナー等を後列へ置く手が、そのターンの盤面評価だけで高く見えてしまうケース。これは「後で後衛を引いた時に置き場がない」問題なので、次は召喚の単体ペナルティではなく、後列枠を残すターン計画を比較する方向がよい。

## 次ループ案

- `summon now` / `hold slot` 比較を作る。
- 最後の後列枠を潰す召喚について、次の自ターンまでの手札/山札上位5枚の後列仕事カード、同ターンに残る攻撃/ためる/終了の候補差、相手の次ターン打点を並べて評価する。
- 対黒で残ったbad seed 137100 turn 2, turn 6 のポリスピナー後列召喚を再現ケース化する。
- 勝率ループは黒だけ先に小母数、白ミラーは採用直前に確認する。白ミラー横断を早い段階で混ぜると実行時間が重く、PDCA効率が落ちる。

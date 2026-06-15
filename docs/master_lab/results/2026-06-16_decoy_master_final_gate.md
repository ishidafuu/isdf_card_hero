# デコイマスター Master Lab 検証レポート

実施日: 2026-06-16

## 対象

候補: デコイマスター

- マスターアタック: 3コ
- 挑発: 3コ
- スケープゴート: 2コ

目的は、ホワイトの「守って育てる」とブラックの「速攻で押す」とは別に、攻撃先をずらして相手の強い攻撃を損な攻撃へ変えるマスターとして成立するか確認すること。

## 実装状況

| 項目 | 状態 | 確認 |
| --- | --- | --- |
| `masterLab` 台帳と静的テスト | 完了 | `tests/game/masterLab.test.ts` |
| レポート出力スクリプト | 完了 | `npm run lab:masters` |
| デコイマスター実験ランナー接続 | 完了 | `src/game/masterLabAutoPlay.ts` |
| スケープゴートのシナリオテスト | 完了 | `tests/game/masterLabScenario.test.ts` |
| 挑発のシナリオテスト | 完了 | `tests/game/masterLabScenario.test.ts` |
| 100戦マトリクス | 完了 | `npm run lab:masters:final-gate -- --candidate decoy --max-steps 700 --max-turns 160` |

## シナリオテスト

追加した確認:

- スケープゴート: Lv2タコッケーのマスター攻撃を、マスターではなく選択した味方モンスターへ逸らす
- 挑発: 対象の敵モンスターが攻撃可能な場合、選択した囮だけを攻撃対象にする
- 挑発ロック回避: 囮がいなくなった場合、通常攻撃候補へ戻り、挑発状態を解除する

実行:

```text
npm test -- tests/game/masterLabScenario.test.ts tests/game/masterLab.test.ts tests/game/masterLabFinalGate.test.ts tests/game/masterLabAutoPlay.test.ts
```

結果:

```text
Test Files 4 passed
Tests 15 passed
```

## ランダムデッキ最終ゲート

実行:

```text
npm run lab:masters:final-gate -- --candidate decoy --max-steps 700 --max-turns 160
```

総合:

| 指標 | 値 |
| --- | ---: |
| 試合数 | 450 |
| failures | 0 |
| warnings | 2 |
| Master Lab decisions | 9617 |
| master_attack | 396 |
| provoke | 1509 |
| scapegoat | 7712 |

warning はデコイ同型の長期戦のみ。

- seed 1407: 326 steps / 28 turns
- seed 1446: 328 steps / 30 turns

### ランダムデッキ内訳

| Matchup | Games | Winner player | Winner cpu | Max | Issues |
| --- | ---: | ---: | ---: | --- | --- |
| decoy vs white | 100 | 48 | 52 | 299 steps / 31 turns | 0 |
| white vs decoy | 100 | 66 | 34 | 303 steps / 30 turns | 0 |
| decoy vs black | 100 | 42 | 58 | 293 steps / 28 turns | 0 |
| black vs decoy | 100 | 65 | 35 | 305 steps / 28 turns | 0 |
| decoy mirror | 50 | 28 | 22 | 328 steps / 31 turns | 2 warnings |

## 固定デッキ検証

各プリセットで `games-per-matchup 20`、合計100戦ずつ確認した。

### `balanced-normal`

```text
npm run lab:masters:final-gate -- --candidate decoy --games-per-matchup 20 --deck-preset balanced-normal --max-steps 700 --max-turns 160
```

| Matchup | Winner player | Winner cpu | Max | Issues |
| --- | ---: | ---: | --- | --- |
| decoy vs white | 9 | 11 | 311 steps / 30 turns | 0 |
| white vs decoy | 10 | 10 | 298 steps / 32 turns | 0 |
| decoy vs black | 6 | 14 | 292 steps / 28 turns | 0 |
| black vs decoy | 16 | 4 | 285 steps / 27 turns | 0 |
| decoy mirror | 14 | 6 | 331 steps / 32 turns | 1 warning |

総計:

- failures 0
- warnings 1
- Master Lab decisions 2721
- action usage: master_attack 87, provoke 449, scapegoat 2185

### `pressure-normal`

```text
npm run lab:masters:final-gate -- --candidate decoy --games-per-matchup 20 --deck-preset pressure-normal --max-steps 700 --max-turns 160
```

| Matchup | Winner player | Winner cpu | Max | Issues |
| --- | ---: | ---: | --- | --- |
| decoy vs white | 11 | 9 | 251 steps / 27 turns | 0 |
| white vs decoy | 13 | 7 | 302 steps / 28 turns | 0 |
| decoy vs black | 8 | 12 | 303 steps / 28 turns | 0 |
| black vs decoy | 12 | 8 | 247 steps / 24 turns | 0 |
| decoy mirror | 9 | 11 | 260 steps / 29 turns | 0 |

総計:

- failures 0
- warnings 0
- Master Lab decisions 1954
- action usage: master_attack 85, provoke 357, scapegoat 1512

### `black-pressure`

```text
npm run lab:masters:final-gate -- --candidate decoy --games-per-matchup 20 --deck-preset black-pressure --max-steps 700 --max-turns 160
```

| Matchup | Winner player | Winner cpu | Max | Issues |
| --- | ---: | ---: | --- | --- |
| decoy vs white | 9 | 11 | 275 steps / 27 turns | 0 |
| white vs decoy | 14 | 6 | 262 steps / 27 turns | 0 |
| decoy vs black | 4 | 16 | 235 steps / 24 turns | 0 |
| black vs decoy | 13 | 7 | 255 steps / 27 turns | 0 |
| decoy mirror | 7 | 13 | 319 steps / 30 turns | 0 |

総計:

- failures 0
- warnings 0
- Master Lab decisions 2317
- action usage: master_attack 84, provoke 318, scapegoat 1915

## 所見

### 成立している点

- 450戦ランダムで failure 0。ルール破綻、進行不能、未解決レベルアップは出ていない。
- 挑発とスケープゴートは実戦で選択されている。特にスケープゴートは十分に候補化されている。
- ホワイト相手は大きく壊れていない。ランダムでは decoy vs white が 48-52、固定プリセットでも概ね接戦。
- ブラック相手も即崩壊はしていない。ランダムでは decoy vs black が 42-58、black vs decoy が 65-35。

### 懸念

- スケープゴート使用が多い。ランダムでは 7712 / 9617 decisions で、デコイの行動がかなり防御へ寄っている。
- `black-pressure` では decoy vs black が 4-16。黒圧力の固定デッキ相手には明確に押されている。
- デコイ同型で長期戦 warning が出る。現時点では failure ではないが、スケープゴート連打で試合が伸びる傾向はある。
- 勝率だけでは、善戦負けか延命負けかを判定できない。次の計測で敗北の質を見る必要がある。

## デッキ調整方針

次のトライアルでは、勝率だけでなく敗北の質を計測する。

見るべき指標:

- 敗者が相手HPを何点まで削ったか
- 終了ターン、終了steps
- 最終盤面のモンスター数、合計Lv、合計HP
- スケープゴート使用後に勝ちへ繋がった率
- 挑発使用後に守りたい主力が生存した率
- 長期戦 warning の発生率

デッキ候補:

1. 共通ベース: `balanced-normal`, `pressure-normal`, `black-pressure`
2. デコイ適性: HP高め前衛、安い囮、後衛主力を増やす
3. 対策デッキ: ブラック速攻、全体除去、後衛圧力、貫通/直接打点
4. 悪用チェック: スケープゴート連打、挑発ロック、レベルアップ拒否が強すぎないかを見る

## 次のPDCAループ

### Plan

次の仮説は「デコイは防御行動の候補化には成功しているが、勝ちへ変換する打点が不足している可能性がある」とする。

重点確認:

- `black-pressure` の decoy vs black が 4-16 と厳しい
- スケープゴート比率が高く、延命寄りになっている可能性がある
- ホワイト相手は概ね接戦なので、防御性能そのものは過剰ではなさそう

### Do

次に追加する検証:

1. 敗北の質レポートを追加する
2. デコイ適性デッキを2-3案作る
3. 同じseed範囲で `balanced-normal` / `decoy-A` / `decoy-B` を比較する
4. `black-pressure` 相手の改善幅を見る

### Check

勝率以外に見る指標:

- 敗戦時の相手残HP
- 終了ターンと終了steps
- 最終盤面の自軍モンスター数、合計Lv、合計HP
- スケープゴート使用後に勝てた率
- 挑発使用後に相手の撃破や本体打点をどれだけ遅らせたか
- 同型の長期戦 warning が増えていないか

### Act

結果に応じて次の調整を行う。

- 善戦負けが多い: 後衛打点、直接打点、詰め手段を増やす
- ボロ負けが多い: 序盤前衛、HP高めの受け先、低コスト囮を増やす
- 延命負けが多い: スケープゴート評価を下げるか、攻撃候補の評価を上げる
- 同型長期戦が増える: スケープゴートのコストまたはAI評価を調整する

## 判定

現段階では `ready_for_review`。本線移植へ進める最低限の実戦安定性はある。

ただし、本採用前に次を追加確認する。

- 敗北の質レポート
- デコイ適性デッキのA/B比較
- ブラック圧力相手の改善余地
- デコイ同型の長期戦対策

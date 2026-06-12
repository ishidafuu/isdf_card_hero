# オートプレイ検証ログ

## 2026-06-11

対象:

- 両者CPUオートプレイ
- seed `400` から `499` までの100戦
- 1戦あたり最大500 auto step
- 1戦あたり最大120 turn

検証コマンド:

```sh
npm test -- tests/game/cpuAi.test.ts
```

独立検証コマンド:

```sh
npm run validate:auto-play -- --seed-start 400 --count 100 --out-dir artifacts/auto-play-validation/check-400-499 --write-artifacts
```

主なオプション:

- `--seed-start <n>`: 開始seed
- `--seed-end <n>`: 終了seed。指定した場合は `--count` より優先
- `--count <n>`: 戦数
- `--deck-preset <id>`: 検証用固定デッキプリセット。既定は `random`。スペシャルON検証は `special-showcase`
- `--player-master <id>` / `--cpu-master <id>`: 検証用マスター。既定は `white`。ブラック検証は `black`
- `--max-steps <n>`: 1戦あたりstep上限
- `--max-turns <n>`: 1戦あたりturn上限
- `--long-game-steps <n>`: 長期戦警告step
- `--long-game-turns <n>`: 長期戦警告turn
- `--out-dir <path>`: artifact保存先
- `--write-artifacts`: issueがなくてもsummaryを出力
- `--fail-on-warnings`: warningも失敗扱いにする

検証結果:

- PASS
- `tests/game/cpuAi.test.ts` は23件すべて成功した。
- 100戦オートプレイ検証の実行時間は約32.8秒。
- CPU AIテスト全体の実行時間は約35.1秒。
- 100戦すべてで勝敗が確定した。
- 例外は発生していない。
- `pendingLevelUp` が未解決で残った戦闘はない。
- 同一進行シグネチャが8回以上連続した戦闘はない。
- 500 auto step を超えた戦闘はない。
- 120 turn を超えた戦闘はない。

独立検証コマンドでの追加結果:

- PASS
- seed `400` から `499` までの100戦を実行した。
- 勝者内訳はプレイヤー50勝、CPU50勝。
- 最大344 auto step / 27 turn。
- failure / warningは0件。
- warningは14件。
- warningは長期戦または同一ターン内の3回以上移動としてartifactへ保存した。

検出対象:

- 例外
- 進行不能
- 未解決のレベルアップ選択
- 極端な長期戦
- 同一状態の停滞
- 勝敗未確定のままstep上限に到達するケース
- 同一ターン内の過剰な移動
- 低スコアの魔法使用

artifact内容:

- seed
- step
- turn
- issue種別
- 直近ログ
- 盤面要約
- 完全な `GameState`
- 直近のCPU/プレイヤーAI判断履歴

備考:

- テスト側の代表seed検証は `tests/game/cpuAi.test.ts` の `finishes a representative auto-play seed range without exceptions or unresolved prompts` で固定している。
- 100戦以上の任意seed範囲の反復検証は `npm run validate:auto-play` を使う。
- 強化AIの検証は `npm run validate:auto-play -- --ai-profile strong` を使う。
- 陣営別のAI比較は `npm run validate:auto-play -- --player-ai stable --cpu-ai strong` を使う。
- 同一seedで両向きのAI比較ベンチを取る場合は `npm run benchmark:ai -- --baseline-ai stable --challenger-ai strong` を使う。
- スペシャルONの再現検証は `npm run validate:auto-play -- --seed-start 620 --count 100 --deck-preset special-showcase --max-steps 600 --max-turns 140` を使う。
- ブラックマスター検証は `npm run validate:auto-play -- --seed-start 640 --count 100 --player-master black --cpu-master black --max-steps 650 --max-turns 140` を使う。
- 失敗した場合は、artifactのseedで同じ条件を再実行できる。
- CPU判断理由ログは `CPU判断: ...` または `プレイヤーAI判断: ...` として通常ログに残る。

## 2026-06-12 スペシャルONプリセット検証

対象:

- 両者CPUオートプレイ
- `special-showcase` 固定デッキプリセット
- seed `620` から `719` までの100戦
- 1戦あたり最大600 auto step
- 1戦あたり最大140 turn

検証コマンド:

```sh
npm run validate:auto-play -- --seed-start 620 --count 100 --deck-preset special-showcase --max-steps 600 --max-turns 140
```

検証結果:

- PASS
- 勝者内訳はプレイヤー51勝、CPU49勝。
- 最大276 auto step / 27 turn。
- failureは0件。
- warningは0件。
- 例外、進行不能、未解決レベルアップは発生していない。

## 2026-06-12 ブラックマスター検証

対象:

- 両者CPUオートプレイ
- プレイヤー/CPUともにブラックマスター
- seed `640` から `739` までの100戦
- 1戦あたり最大650 auto step
- 1戦あたり最大140 turn

検証コマンド:

```sh
npm run validate:auto-play -- --seed-start 640 --count 100 --player-master black --cpu-master black --max-steps 650 --max-turns 140
```

検証結果:

- PASS
- 勝者内訳はプレイヤー52勝、CPU48勝。
- 最大272 auto step / 27 turn。
- failureは0件。
- warningは0件。
- 例外、進行不能、未解決レベルアップは発生していない。

## 2026-06-12 CPU追撃/脅威評価後の通常100戦検証

対象:

- 両者CPUオートプレイ
- ホワイトマスター同士
- ランダムデッキ
- seed `400` から `499` までの100戦

検証コマンド:

```sh
npm run validate:auto-play -- --seed-start 400 --count 100
```

検証結果:

- PASS
- 勝者内訳はプレイヤー58勝、CPU42勝。
- 最大312 auto step / 26 turn。
- failureは0件。
- warningは4件。
- warningはすべてlong gameで、移動多発warningは0件。
- artifact: `artifacts/auto-play-validation/2026-06-12T09-35-02-089Z/`

## 2026-06-12 strong AIプロファイル導入後の少数seed検証

対象:

- 両者CPUオートプレイ
- AI profile `strong`
- ホワイトマスター同士
- ランダムデッキ
- seed `430` から `434` までの5戦
- 1戦あたり最大700 auto step
- 1戦あたり最大160 turn

検証コマンド:

```sh
npm run validate:auto-play -- --seed-start 430 --count 5 --ai-profile strong --max-steps 700 --max-turns 160
```

検証結果:

- PASS
- 勝者内訳はプレイヤー2勝、CPU3勝。
- 最大212 auto step / 18 turn。
- failureは0件。

## 2026-06-12 陣営別AIプロファイル導入後の少数seed検証

対象:

- 両者CPUオートプレイ
- player AI `stable`
- cpu AI `strong`
- ホワイトマスター同士
- ランダムデッキ
- seed `430` から `432` までの3戦
- 1戦あたり最大700 auto step
- 1戦あたり最大160 turn

検証コマンド:

```sh
npm run validate:auto-play -- --seed-start 430 --count 3 --player-ai stable --cpu-ai strong --max-steps 700 --max-turns 160
```

検証結果:

- PASS
- 勝者内訳はプレイヤー2勝、CPU1勝。
- 最大201 auto step / 17 turn。
- failure / warningは0件。

## 2026-06-13 AI比較ベンチ導入後の少数seed検証

対象:

- baseline AI `stable`
- challenger AI `strong`
- challengerをplayer側/cpu側の両向きで配置
- ホワイトマスター同士
- ランダムデッキ
- seed `430` から `431` までの2 seed、合計4戦
- 1戦あたり最大700 auto step
- 1戦あたり最大160 turn

検証コマンド:

```sh
npm run benchmark:ai -- --seed-start 430 --count 2 --max-steps 700 --max-turns 160
```

検証結果:

- PASS
- 合算勝者内訳は `stable` 4勝、`strong` 0勝。
- 平均158.8 auto step / 13.8 turn。
- 最大185 auto step / 16 turn。
- failure / warningは0件。
- `strong` の負けseedサンプルは 430 / 431 の両向き。次のAI改善では、このseedの判断ログから「探索で評価が上がったが実際には悪い手」を確認する。

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
- `--max-steps <n>`: 1戦あたりstep上限
- `--max-turns <n>`: 1戦あたりturn上限
- `--long-game-steps <n>`: 長期戦警告step
- `--long-game-turns <n>`: 長期戦警告turn
- `--out-dir <path>`: artifact保存先
- `--write-artifacts`: issueがなくてもsummaryを出力
- `--fail-on-warnings`: warningも失敗扱いにする

検証結果:

- PASS
- `tests/game/cpuAi.test.ts` は22件すべて成功した。
- 100戦オートプレイ検証の実行時間は約32.4秒。
- CPU AIテスト全体の実行時間は約34.5秒。
- 100戦すべてで勝敗が確定した。
- 例外は発生していない。
- `pendingLevelUp` が未解決で残った戦闘はない。
- 同一進行シグネチャが8回以上連続した戦闘はない。
- 500 auto step を超えた戦闘はない。
- 120 turn を超えた戦闘はない。

独立検証コマンドでの追加結果:

- PASS
- seed `400` から `499` までの100戦を実行した。
- 勝者内訳はプレイヤー53勝、CPU47勝。
- 最大344 auto step / 28 turn。
- failureは0件。
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

- テスト側の100戦検証は `tests/game/cpuAi.test.ts` の `finishes 100 auto-play games without exceptions, unresolved prompts, or extreme length` で固定している。
- 任意seed範囲の反復検証は `npm run validate:auto-play` を使う。
- 失敗した場合は、artifactのseedで同じ条件を再実行できる。
- CPU判断理由ログは `CPU判断: ...` または `プレイヤーAI判断: ...` として通常ログに残る。

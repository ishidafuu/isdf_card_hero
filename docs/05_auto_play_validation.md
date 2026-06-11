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

検証結果:

- PASS
- `tests/game/cpuAi.test.ts` は17件すべて成功した。
- 100戦オートプレイ検証の実行時間は約27.3秒。
- CPU AIテスト全体の実行時間は約30.3秒。
- 100戦すべてで勝敗が確定した。
- 例外は発生していない。
- `pendingLevelUp` が未解決で残った戦闘はない。
- 同一進行シグネチャが8回以上連続した戦闘はない。
- 500 auto step を超えた戦闘はない。
- 120 turn を超えた戦闘はない。

検出対象:

- 例外
- 進行不能
- 未解決のレベルアップ選択
- 極端な長期戦
- 同一状態の停滞
- 勝敗未確定のままstep上限に到達するケース

備考:

- この検証は `tests/game/cpuAi.test.ts` の `finishes 100 auto-play games without exceptions, unresolved prompts, or extreme length` で固定している。
- 失敗した場合は、Vitestの失敗メッセージにseedが出るため、同じseedで再現確認できる。
- CPU判断理由ログは `CPU判断: ...` または `プレイヤーAI判断: ...` として通常ログに残る。

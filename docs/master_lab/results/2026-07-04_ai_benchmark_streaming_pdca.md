# AI Benchmark Streaming PDCA

生成: 2026-07-04

## 目的

前回の `white_planner` Phase 3 では、白ミラーの探索が重く、20ゲーム相当の確認が21分超で未完走になった。AI本体の改善を続ける前に、検証ループが途中で止まっても状況を失わない仕組みが必要になった。

今回の目的:

- 1ゲーム完了ごとに結果を標準出力へ出す。
- 1ゲーム完了ごとにartifactを即時保存する。
- 長時間化seedや中断時の最後の完了ゲームを把握できるようにする。

## 実装

### `validateAutoPlay`

`onGameResult` callback を追加した。

- seedごとのゲーム完了直後に呼ばれる。
- `AutoPlayGameResult` と、そのseedで発生した `AutoPlayIssue[]` を受け取る。
- 既存の戻り値・通常実行には影響しない。

### `benchmarkAiProfiles`

`onGameOutcome` callback を追加した。

- `validateAutoPlay` の結果に benchmark direction と winner profile を付与して通知する。
- `challenger-as-cpu` / `challenger-as-player` のどちらで完了したか分かる。

### `benchmark:ai` CLI

追加オプション:

- `--stream-progress`
  - 1ゲーム完了ごとに `seed / direction / winner / steps / turns / issue数` を出す。
- `--write-game-artifacts`
  - 1ゲーム完了ごとに `${outDir}/NNN_seed-*_direction.json` を即時保存する。
  - `--write-artifacts` と同様、履歴保存のため `includeGameHistory` を有効化する。

## スモーク確認

意図的に `max-steps 1` にして、失敗ゲームでも途中出力とartifact保存が動くことを確認した。

```bash
npm run benchmark:ai -- \
  --seed-start 430 \
  --count 1 \
  --deck-preset master-lab-white-1377-death-sheep3 \
  --player-master white \
  --cpu-master white \
  --baseline-ai white \
  --challenger-ai strong \
  --direction challenger-as-cpu \
  --max-steps 1 \
  --max-turns 20 \
  --stream-progress \
  --write-game-artifacts \
  --out-dir artifacts/ai-benchmark/2026-07-04_stream_smoke
```

確認できた出力:

- `[game 1] seed 430 challenger-as-cpu: undecided, 1 steps / 1 turns, issues 1F/0W`
- `Artifacts: artifacts/ai-benchmark/2026-07-04_stream_smoke`
- `001_seed-430_challenger-as-cpu.json` が即時保存された。

## 検証

- `npm test -- tests/game/autoPlayValidation.test.ts tests/game/cpuAi.test.ts -- --testTimeout 60000`
- `npm run build`
- `npm run benchmark:ai -- --seed-start 430 --count 1 ... --max-steps 1 --stream-progress --write-game-artifacts ...`

## 次の使い方

今後の長めの白ミラー確認は、以下のように分割・逐次保存で回す。

```bash
npm run benchmark:ai -- \
  --seed-start 994300 \
  --count 5 \
  --deck-preset master-lab-white-1377-death-sheep3 \
  --player-master white \
  --cpu-master white \
  --baseline-ai white \
  --challenger-ai white_planner \
  --direction both \
  --max-steps 420 \
  --max-turns 100 \
  --long-game-steps 300 \
  --long-game-turns 80 \
  --stream-progress \
  --write-game-artifacts \
  --out-dir artifacts/ai-benchmark/<run-name>
```

これで中断しても、完了済みゲームと長時間化seedを失わずに次の監査へ進める。

## Next Loop Proposal

次はこの基盤を使って、`white_planner` の白ミラー確認を 1-2 seed 単位で積み上げる。

- まず `seed 994300-994304` を `--stream-progress --write-game-artifacts` 付きで再確認する。
- 長時間化seedが出たら、そのseedだけ履歴artifactを読んで、負け方と採用差分を監査する。
- `white-planner-phase2` は毎手 `white` と `white_planner` を両方評価するため、今後は必要seedに絞って使う。

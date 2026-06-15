# 投稿テンプレデッキAI検証ロードマップ

## 目的

カードヒーロー部.com投稿デッキを、AI改善の実践的な検証資産として使う。

ランダムデッキだけでは、実戦的なキーカード、3積み、マスター別構成、スーパー軸、石テンポの圧が薄くなる。投稿テンプレを監査してから検証スイート化し、`strong` AIの改善を「どのデッキで、どのseedで、どの判断が変わったか」まで追える状態にする。

## 対象デッキ

取り込み対象は次の4種類に限定する。

- Pro 8なし / ブラックマスター
- Pro 8あり / ブラックマスター
- Pro 8なし / ホワイトマスター
- Pro 8あり / ホワイトマスター

投稿デッキは `npm run import:deck-submissions` で再取得する。

## 監査

監査コマンド:

```sh
npm run audit:deck-submissions
```

出力:

- `artifacts/deck-submission-audit/latest/deck-report.json`
- `artifacts/deck-submission-audit/latest/deck-report.md`

監査項目:

- 前衛 / 後衛 / 魔法 / スーパー枚数
- Pro黒 / Pro白の部員評価平均
- 3積み数、ユニークカード数
- 実装リスク
- 極端構成スコア
- 実践スコア
- ストレススコア
- 推定アーキタイプ
- キーカード

## 検証スイート

`src/game/deckBenchmarkSuites.ts` で次の4スイートを定義する。

| Suite | 件数 | 用途 |
| --- | ---: | --- |
| `smoke` | 8 | 各投稿グループ上位2件。AI評価変更の最小確認 |
| `core` | 40 | 各投稿グループ上位10件。AI改善の主検証 |
| `stress` | 12 | 特殊/極端構成/複雑寄り。warningと長期戦確認 |
| `holdout` | 20 | Coreから外した上位投稿。調整後の汎化確認 |

## ベンチ

スイート単位のAIベンチ:

```sh
npm run benchmark:deck-suite -- --suite smoke --seed-start 430 --count 2
```

主なオプション:

- `--suite smoke|core|stress|holdout`
- `--seed-start <n>`
- `--count <n>`
- `--baseline-ai stable`
- `--challenger-ai strong`
- `--direction both|challenger-as-cpu|challenger-as-player`
- `--player-master <id>` / `--cpu-master <id>`
- `--json <path>`

投稿テンプレを指定した `diff:ai`:

```sh
npm run diff:ai -- --seed 430 --deck-preset submission-pro-no-rare8-black-1408 --direction challenger-as-cpu
```

投稿テンプレを指定した場合、マスター指定を省略すると投稿元マスターをPlayer/CPU両方に使う。

## AI改善ゲート

小変更:

```sh
npm run benchmark:deck-suite -- --suite smoke --seed-start 430 --count 2
```

AI評価変更:

```sh
npm run benchmark:deck-suite -- --suite core --seed-start 430 --count 3
```

採用前:

```sh
npm run benchmark:deck-suite -- --suite holdout --seed-start 450 --count 3
npm run benchmark:deck-suite -- --suite stress --seed-start 430 --count 2
```

最低条件:

- failure 0
- unresolved level-up 0
- warningが増える場合はseedと投稿デッキIDを残してレビューする
- `strong` が `stable` に明確に悪化する変更は戻す
- 勝率が五分でも、既知の悪手が減りwarningや最大stepが悪化しないなら採用候補にできる

## 改善テーマ

投稿テンプレデッキを使って優先的に見るテーマ:

- 開幕配置: 前衛/後衛の役割に合った召喚
- マスター別判断: 黒は打点圧、白は盤面維持と防御
- キーカード温存: 高評価カード、3積みカード、コンボカードを雑に消費しない
- リーサル判断: 実践デッキで勝ち筋を逃さない
- 防御判断: 守る価値のあるユニットだけ守る
- スーパー軸: スーパー化ラインを捨てすぎない
- 石テンポ: ヤミー、ロストーン、プラストーン、バイストーンの価値を局面で扱う

## 運用

1. 監査でスイートを確認する。
2. `smoke` で小さく回す。
3. 悪化seedを `diff:ai --deck-preset` で読む。
4. 評価関数を小さく補正する。
5. `core`、`holdout`、`stress` の順に確認する。
6. 結果をAI改善ロードマップへ追記する。

## Phase 5 実行メモ

実行日: 2026-06-13

### 監査スナップショット

```sh
npm run audit:deck-submissions -- --out-dir artifacts/deck-submission-audit/phase5 --top 12
```

- 524件を監査。
- 上位12件に `submission-pro-no-rare8-black-493` が入り、Pro黒8なしの実戦的なアグロ/石テンポ検証デッキとして扱える。

### 補正対象

`submission-pro-no-rare8-black-493` / seed `430` / `challenger-as-cpu` で、強AIがバーサクパワー後に直撃1点を捨て、ポリスピナーへの非撃破削りを選んでいた。

補正後は同局面のstep 14差分が消え、強AIはマスターへ直撃する。

```sh
npm run diff:ai -- --seed 430 --deck-preset submission-pro-no-rare8-black-493 --direction challenger-as-cpu --max-diffs 4
```

- 補正前: winner player、117 steps / 11 turns、step 14で非撃破削り。
- 補正後: winner player、88 steps / 8 turns、step 14の非撃破削り差分なし。

### 軽量ゲート結果

```sh
npm run benchmark:deck-suite -- --suite smoke --seed-start 430 --count 2 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase5-smoke.json
npm run benchmark:deck-suite -- --suite core --seed-start 430 --count 1 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase5-core-count1.json
npm run benchmark:deck-suite -- --suite holdout --seed-start 450 --count 1 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase5-holdout-count1.json
npm run benchmark:deck-suite -- --suite stress --seed-start 430 --count 1 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase5-stress-count1.json
```

| Suite | Result | Games | Wins stable/strong | Warnings | Max |
| --- | --- | ---: | ---: | ---: | --- |
| smoke count2 | PASS | 32 | 19 / 13 | 2 | 165 steps / 13 turns |
| core count1 | PASS | 80 | 34 / 46 | 7 | 355 steps / 27 turns |
| holdout count1 | PASS | 40 | 20 / 20 | 4 | 326 steps / 24 turns |
| stress count1 | PASS | 24 | 10 / 14 | 0 | 162 steps / 35 turns |

次候補:

- 終盤に「強い候補があるのにターン終了」警告が出る局面を、投稿デッキIDつきで優先レビューする。
- 長期戦warningは `submission-pro-no-rare8-white-882` と `submission-pro-no-rare8-white-206` を個別に見る。

## Phase 6/7 実行メモ

実行日: 2026-06-13

### Phase 6: 終盤ターン終了警告

`end_turn` 警告は、合法手のraw scoreだけでは誤検知が出ていた。`chooseCpuDecision` と同じ総合評価を参照し、raw score 200以上の候補でも、総合評価で `end_turn` から80点以上離れている場合は警告対象外にした。

代表確認:

```sh
npm run benchmark:deck-suite -- --suite core --seed-start 430 --count 1 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase7-core-count1-white-only.json
```

- `core` count1の `ended turn despite strong candidate` 警告: 7件から0件。
- `holdout` count1の同系警告: 3件から0件。

### Phase 7: 白マスター長期戦短縮

白マスターのcloseout時だけ、勝敗に直結しない行動を抑制した。

- focusを候補から外す。
- 既に盤面がある状態の低スコア召喚を抑える。
- 即行動につながらない味方ウェイクアップを抑える。
- 非撃破マスターアタックを抑える。
- 残HPが大きく残る非撃破削りを抑える。

代表結果:

| Deck | Before | After | Result |
| --- | ---: | ---: | --- |
| `submission-pro-no-rare8-white-882` seed 430 | 355 steps / 27 turns | 295 steps / 28 turns | warning解消 |
| `submission-pro-no-rare8-white-206` seed 450 | 326 steps / 24 turns | 181 steps / 16 turns | warning解消 |

### Phase 7 ゲート結果

```sh
npm run benchmark:deck-suite -- --suite smoke --seed-start 430 --count 2 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase7-smoke-white-only.json
npm run benchmark:deck-suite -- --suite core --seed-start 430 --count 1 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase7-core-count1-white-only.json
npm run benchmark:deck-suite -- --suite holdout --seed-start 450 --count 1 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase7-holdout-count1.json
npm run benchmark:deck-suite -- --suite stress --seed-start 430 --count 1 --max-steps 700 --max-turns 160 --json artifacts/deck-suite-benchmark/phase7-stress-count1.json
```

| Suite | Result | Games | Wins stable/strong | Warnings | Max |
| --- | --- | ---: | ---: | ---: | --- |
| smoke count2 | PASS | 32 | 20 / 12 | 0 | 145 steps / 15 turns |
| core count1 | PASS | 80 | 38 / 42 | 0 | 295 steps / 30 turns |
| holdout count1 | PASS | 40 | 19 / 21 | 0 | 181 steps / 23 turns |
| stress count1 | PASS | 24 | 9 / 15 | 0 | 172 steps / 35 turns |

## Phase 8: 投稿デッキ実戦スコア

静的な `practicalScore` は、カード評価・3枚積み・キーカード・構成リスクから見たテンプレ候補の一次選別に使う。
ただし、実際のAI強化では「そのデッキがAI同士の自動対戦でどれくらい勝つか」「長期戦や警告が出にくいか」も分けて見る必要がある。

そのため、投稿デッキ同士を総当たりで自動対戦させる実戦スコアを追加した。

```sh
npm run score:deck-battles -- --suite smoke --seed-start 500 --count 1
npm run score:deck-battles -- --suite core --max-decks 12 --seed-start 500 --count 1
```

出力先は既定で `artifacts/deck-battle-score/latest/report.json` と `artifacts/deck-battle-score/latest/report.md`。
必要に応じて `--out-dir` / `--json` / `--markdown` で保存先を変える。

### 指標

| 指標 | 用途 |
| --- | --- |
| Battle score | 並べ替え用の総合点。勝点率を主軸に、速度・警告・失敗を軽く補正する |
| Win point | 勝ち=1、引き分け=0.5で見た実戦成績 |
| Win rate | 純粋な勝率。引き分けは勝ちに含めない |
| Stability | 警告/失敗の少なさと、player/cpu席で成績が崩れないかを見る安定度 |
| Speed | 同一suite内の平均stepsと比べた決着速度。50がsuite平均 |

`Battle score` だけでデッキ選別を固定しない。
AI改善の検証では、上位デッキ、勝率は高いが安定度が低いデッキ、安定度は高いが勝ち切れないデッキを別枠で見る。

### Smoke実行結果

```sh
npm run score:deck-battles -- --suite smoke --seed-start 500 --count 1 --out-dir artifacts/deck-battle-score/phase8-smoke
```

| Deck | Battle | Win point | Win rate | Stability | Speed | W-L-D | Avg |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `submission-pro-no-rare8-black-493` | 78.7 | 78.6% | 78.6% | 95.7 | 51.5 | 11-3-0 | 98.2 steps / 9.4 turns |
| `submission-pro-with-rare8-white-1339` | 70.9 | 71.4% | 71.4% | 91.4 | 44.3 | 10-4-0 | 112.7 steps / 10.6 turns |
| `submission-pro-no-rare8-black-252` | 63.8 | 64.3% | 64.3% | 87.1 | 45.6 | 9-5-0 | 110.1 steps / 10.4 turns |
| `submission-pro-with-rare8-black-1354` | 57.5 | 57.1% | 57.1% | 91.4 | 54.0 | 8-6-0 | 93.1 steps / 8.7 turns |
| `submission-pro-with-rare8-white-1346` | 49.9 | 50.0% | 50.0% | 95.7 | 48.7 | 7-7-0 | 103.9 steps / 10.6 turns |
| `submission-pro-with-rare8-black-999` | 43.9 | 42.9% | 42.9% | 91.4 | 60.2 | 6-8-0 | 80.6 steps / 8.2 turns |
| `submission-pro-no-rare8-white-494` | 28.4 | 28.6% | 28.6% | 100.0 | 48.1 | 4-10-0 | 105.1 steps / 10.4 turns |
| `submission-pro-no-rare8-white-1377` | 6.9 | 7.1% | 7.1% | 95.7 | 47.7 | 1-13-0 | 105.9 steps / 9.6 turns |

- `submission-pro-no-rare8-black-493` は実戦スコア上も強く、黒アグロ/石テンポ検証の主軸にできる。
- `submission-pro-with-rare8-white-1339` は白8あり代表として勝率が高いが、Speedは低めなので長期戦寄りの改善確認に向く。
- `submission-pro-no-rare8-white-494` はStabilityが高い一方でWin rateが低く、安定するが勝ち切れない白デッキの確認枠に向く。

## Phase 9-14: 継続強化ループ

長時間のAI強化は、以下の順で回す。

1. `core` 実戦スコアを生成する。
2. スコアから代表デッキを分類する。
3. 問題試合だけを再実行し、ログ末尾を保存する。
4. 抽出結果から弱点カテゴリを1つ選んでAIを補正する。
5. `smoke` / `core` / `holdout` / `stress` で回帰確認する。
6. ゲーム内 `AI Lab` へスコア、分類、問題試合候補を反映する。

```sh
npm run score:deck-battles -- --suite core --seed-start 500 --count 1 --out-dir artifacts/deck-battle-score/phase9-core
npm run analyze:deck-battles -- --report artifacts/deck-battle-score/phase9-core/report.json --out-dir artifacts/deck-battle-score/phase10-core-insights
npm run trace:deck-battles -- --report artifacts/deck-battle-score/phase9-core/report.json --out-dir artifacts/deck-battle-score/phase11-core-traces --limit 8 --log-limit 40
npm run generate:deck-battle-snapshots -- --report artifacts/deck-battle-score/phase8-smoke/report.json --report artifacts/deck-battle-score/phase9-core/report.json --default-suite core --out src/game/deckBattleScoreSnapshots.ts
```

ゲーム内では右パネルの `AI Lab` から、suite別のsummary、推奨フォーカス、カテゴリ別代表デッキ、問題試合候補を確認できる。

## Phase 15: 問題試合の自動分類強化

実行日: 2026-06-14

### 目的

勝率やBattle scoreだけでは、次にどのAI評価を直すべきかが見えにくい。
そのため、`Problem Games` に改善テーマのタグを自動付与し、AI Labで「何を見ればよいか」を先に絞れるようにした。

### 追加した分類

| Focus | 用途 |
| --- | --- |
| 安全性 | failure / warningを含む試合。進行不能、例外、警告を優先確認する |
| 長期戦/勝ち切り | 平均より長い試合。終盤の直接打点、focus、非撃破行動を見る |
| 白の勝ち切り | 白デッキが安定するが勝ち切れないケースを見る |
| 白vs黒対策 | 白が黒の圧に負ける構図。防御対象、前衛処理、石テンポを見る |
| 黒の攻め筋 | 黒が白に押し返される構図。バーサク後の直撃、非撃破削り、石消費を見る |
| 番狂わせ | 実戦スコア差がある敗戦。上位側の分岐判断を追う |
| 上位デッキ敗戦 | 主力検証デッキの敗戦。AI変更時の回帰候補にする |
| 席差/非対称 | player/cpu席差が大きいデッキ。先後や評価の非対称性を見る |

### 生成結果

```sh
npm run analyze:deck-battles -- --report artifacts/deck-battle-score/2026-06-14-core-count2-merged/report.json --out-dir artifacts/deck-battle-score/phase15-core-insights
npm run trace:deck-battles -- --report artifacts/deck-battle-score/2026-06-14-core-count2-merged/report.json --out-dir artifacts/deck-battle-score/phase15-core-traces --limit 10 --log-limit 50
npm run generate:deck-battle-snapshots -- --report artifacts/deck-battle-score/2026-06-14-smoke-count2/report.json --report artifacts/deck-battle-score/2026-06-14-core-count2-merged/report.json --default-suite core --out src/game/deckBattleScoreSnapshots.ts
```

Core count2 mergedの代表分類:

| Focus | Count | Weight |
| --- | ---: | ---: |
| 黒の攻め筋 | 22 | 6635.8 |
| 上位デッキ敗戦 | 15 | 5240.0 |
| 番狂わせ | 4 | 1002.2 |
| 長期戦/勝ち切り | 5 | 615.1 |
| 席差/非対称 | 2 | 356.3 |
| 白の勝ち切り | 1 | 114.0 |
| 白vs黒対策 | 1 | 107.5 |

次のAI補正候補:

- `黒の攻め筋`: 上位黒デッキが白に押し返される試合を優先し、バーサク後の直撃、非撃破削り、石消費を確認する。
- `長期戦/勝ち切り`: trace済みの長期戦から、終盤に勝ち筋へ向かわない行動を確認する。
- `白vs黒対策`: 白側が黒の圧に負ける試合は、防御対象と前衛処理の評価を確認する。

ゲーム内では `AI Lab` に `Problem Focus` を追加し、各 `Problem Games` に分類タグを表示する。

## Phase 22: 安定化

実行日: 2026-06-14

### 目的

Phase 15で見えた `黒の攻め筋` と `長期戦/勝ち切り` を、実戦デッキの自動対戦で再確認する。
あわせて、ゲーム内のDecks / AI Labから見えるスコアを最新AIの結果へ更新する。

### AI補正

- 非致死のマスター向け攻撃魔法を固定8点ではなく、実ダメージ価値とコストで評価するようにした。
  - サンダーなどを、リーサル以外でも黒の押し込み手段として評価できる。
- 終盤、山札切れ、マスターHP競争の局面では、0ダメージ攻撃で気合いを剥がすだけの行動を抑制した。
  - 防御上の直接打点軽減や、後続攻撃に明確につながる場合は残す。
- 単体テストは、seed依存の途中盤面ではなく、バーサク後にマスター打点へ進む最小局面で固定した。

### 実行結果

```sh
npm test -- --run tests/game/cpuAi.test.ts
npm run score:deck-battles -- --suite smoke --seed-start 520 --count 2 --out-dir artifacts/deck-battle-score/phase22-smoke-count2
npm run score:deck-battles -- --suite core --max-decks 24 --seed-start 520 --count 2 --out-dir artifacts/deck-battle-score/phase22-core24-count2
npm run score:deck-battles -- --suite core --seed-start 540 --count 1 --out-dir artifacts/deck-battle-score/phase22-core-count1
npm run analyze:deck-battles -- --report artifacts/deck-battle-score/phase22-core-count1/report.json --out-dir artifacts/deck-battle-score/phase22-core-count1-insights
npm run trace:deck-battles -- --report artifacts/deck-battle-score/phase22-core-count1/report.json --out-dir artifacts/deck-battle-score/phase22-core-count1-traces --limit 8 --log-limit 60
npm run generate:deck-battle-snapshots -- --report artifacts/deck-battle-score/phase22-smoke-count2/report.json --report artifacts/deck-battle-score/phase22-core-count1/report.json --default-suite core --out src/game/deckBattleScoreSnapshots.ts
npm run benchmark:deck-suite -- --suite smoke --seed-start 560 --count 2 --json artifacts/deck-benchmark/phase22-smoke-count2.json
npm run benchmark:deck-suite -- --suite core --seed-start 560 --count 1 --json artifacts/deck-benchmark/phase22-core-count1.json
```

| Gate | Games | Result | Notes |
| --- | ---: | --- | --- |
| AI単体テスト | 47 tests | PASS | サンダー非致死打点、終盤0ダメージ抑制、黒バーサク後の直撃を固定 |
| score smoke count2 | 112 | PASS 0/0 | 平均99.2 steps / 9.6 turns、最大291 steps / 28 turns |
| score core24 count2 | 1104 | PASS 0/0 | 平均90.7 steps / 8.9 turns、最大284 steps / 29 turns |
| score core count1 | 1560 | PASS 0/3 | 平均108.1 steps / 10.5 turns、最大331 steps / 30 turns |
| benchmark smoke count2 | 32 | PASS 0/0 | strong 17勝 / stable 15勝 |
| benchmark core count1 | 80 | PASS 0/1 | strong 41勝 / stable 39勝 |

`src/game/deckBattleScoreSnapshots.ts` は `smoke seed 520 count2` と `core seed 540 count1` で更新した。
core count2は40デッキで3120試合になるため、同条件での再計算を試したが48分時点で未完だった。
Phase 22では40デッキを最新AIで覆うことを優先し、snapshotはcore count1を採用した。

### Core count1の代表傾向

| Rank | Deck | Battle | Win | Stable | Speed |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | submission-pro-with-rare8-black-320 | 82.0 | 80.8% | 94.6 | 60.9 |
| 2 | submission-pro-with-rare8-black-315 | 82.0 | 80.8% | 94.6 | 60.9 |
| 3 | submission-pro-with-rare8-black-1333 | 76.7 | 75.6% | 93.1 | 59.9 |
| 4 | submission-pro-no-rare8-black-322 | 76.5 | 75.6% | 99.2 | 57.6 |
| 6 | submission-pro-with-rare8-white-1339 | 72.9 | 73.1% | 99.2 | 48.6 |

### 残課題

- core count1のwarning 3件は、白同士の長期戦と山札切れ付近の勝ち切り問題。
- traceでは、0ダメージ行動のうち「防御目的」と判定されたものがまだ残る。
  - 次フェーズでは、山札切れ時は非致死の気合い剥がしをさらに抑え、勝ち筋または山札切れ勝負へ寄せる。
- `submission-pro-with-rare8-black-45` と `submission-pro-with-rare8-black-999` は席差が大きく、player/cpu非対称の確認対象。
- full core count2は夜間・長時間ジョブ向け。UI上の通常snapshotはcore count1、深掘りはcore24 count2 / traceで見る。

## Phase 23: Phase 22残課題対応

実行日: 2026-06-15

### 目的

Phase 22で残った白同士の長期戦、山札切れ付近の0ダメージ行動、防御過多、配置だけの移動を抑える。
実戦スコアはseedを変えて取り直し、ゲーム内のDecks / AI Labのsnapshotも最新結果へ更新する。

### AI補正

- 山札切れ中の0ダメージ気合い剥がしは、相手の次ターン直接打点がこちらマスターを倒す場合だけ防御行動として残す。
- 山札切れ中のシールドは、リーサル回避、直接打点維持、レベルアップ見込み、明確な攻撃筋がない場合は候補から外す。
- 山札切れ/closeout中の移動は、攻撃筋や直接打点を伸ばさない配置改善だけなら抑制する。
- 山札切れ中に敵モンスターを削る攻撃は、相手の直接リーサル脅威が残る場合は候補から外す。

### 実行結果

```sh
npm test -- --run
npm run build
npm run score:deck-battles -- --suite smoke --seed-start 560 --count 2 --out-dir artifacts/deck-battle-score/phase23-smoke-count2 --fail-on-warnings
npm run score:deck-battles -- --suite core --seed-start 560 --count 1 --out-dir artifacts/deck-battle-score/phase23-core-count1 --fail-on-warnings
npm run analyze:deck-battles -- --report artifacts/deck-battle-score/phase23-core-count1/report.json --out-dir artifacts/deck-battle-score/phase23-core-count1-insights
npm run trace:deck-battles -- --report artifacts/deck-battle-score/phase23-core-count1/report.json --out-dir artifacts/deck-battle-score/phase23-core-count1-traces --limit 8 --log-limit 80
npm run generate:deck-battle-snapshots -- --report artifacts/deck-battle-score/phase23-smoke-count2/report.json --report artifacts/deck-battle-score/phase23-core-count1/report.json --default-suite core --out src/game/deckBattleScoreSnapshots.ts
```

| Gate | Games | Result | Notes |
| --- | ---: | --- | --- |
| 全テスト | 420 tests | PASS | CPU AIは51 tests |
| build | - | PASS | Viteのchunk size warningのみ |
| score smoke count2 | 112 | PASS 0/0 | 平均106.3 steps / 11 turns、最大219 steps / 22 turns |
| score core count1 | 1560 | PASS 0/1 | 平均101.5 steps / 10.5 turns、最大328 steps / 30 turns |

`score core count1` は `--fail-on-warnings` により終了コード1だが、failure 0、warning 1でレポート生成は完了している。
Phase 22のcore count1と比べると、warningは3件から1件へ減り、平均stepsは108.1から101.5へ改善した。

`src/game/deckBattleScoreSnapshots.ts` は `smoke seed 560 count2` と `core seed 560 count1` で更新した。

### Core count1の代表傾向

| Rank | Deck | Battle | Win | Stable | Speed |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | submission-pro-no-rare8-black-493 | 72.1 | 71.8% | 92.3 | 52.9 |
| 2 | submission-pro-with-rare8-black-1333 | 70.4 | 69.2% | 93.8 | 61.2 |
| 3 | submission-pro-no-rare8-black-408 | 69.7 | 69.2% | 95.4 | 54.9 |
| 4 | submission-pro-with-rare8-white-1236 | 68.2 | 67.9% | 92.9 | 53.4 |
| 5 | submission-pro-no-rare8-black-322 | 67.3 | 66.7% | 92.3 | 56.7 |

### 残課題

- 残りwarning 1件は `submission-pro-with-rare8-white-1236` vs `submission-pro-no-rare8-white-400` seed 560、328 steps / 30 turns。
  - 進行不能ではなく、CPUの真勇者ダインが山札切れ後に勝ち切る白同士の長期戦。
  - 次は白の攻め筋不足、席差/非対称、山札切れ前の勝ち切りを分けて見る。
- `Problem Focus` は席差/非対称19件、上位デッキ敗戦16件、黒の攻め筋14件が中心。
- `submission-pro-no-rare8-white-541` は安定度100だが勝率30.8%で、守りすぎ/攻め筋不足の継続確認対象。

## Phase 24: カード調整耐性のためのAI分離

実行日: 2026-06-15

### 目的

カード性能調整時に、CPU AIがカードIDごとの威力や強さを覚えない構造へ寄せる。
まずマジック評価を対象に、カードID分岐を `aiTraits` と仮実行結果へ置き換え、評価係数を `aiWeights` へ分離する。

### 実装内容

- `docs/17_ai_card_adjustment_boundary.md` を追加し、`cardData` / `rules` / `aiTraits` / `aiWeights` / `cpuAi` の責務境界を固定した。
- `src/game/aiTraits.ts` を追加し、実装済みマジックを `damage` / `heal` / `shield` / `search` / `refresh` / `buff` などの意味タグで分類した。
- `scoreMagicDecision` はカードIDではなく、traitの `effectKind` / `valueModel` で評価関数を選ぶようにした。
- ダメージ魔法の脅威推定は、固定のカードID別威力ではなく、`playMagic` の仮実行後のHP差分を見るようにした。
- `src/game/aiWeights.ts` を追加し、マスターHP、ストーン、撃破価値、打点価値、マジックコスト補正をプロファイル別に調整できるようにした。
- `tests/game/aiTraits.test.ts` を追加し、実装済みマジックに未分類traitがないことを検出する。

### 実行結果

```sh
npm test -- --run
npm run build
npm run score:deck-battles -- --suite smoke --seed-start 560 --count 2 --out-dir artifacts/deck-battle-score/phase24-traits-smoke-count2 --fail-on-warnings
npm run score:deck-battles -- --suite core --seed-start 560 --count 1 --out-dir artifacts/deck-battle-score/phase24-traits-core-count1 --fail-on-warnings
npm run analyze:deck-battles -- --report artifacts/deck-battle-score/phase24-traits-core-count1/report.json --out-dir artifacts/deck-battle-score/phase24-traits-core-count1-insights
npm run trace:deck-battles -- --report artifacts/deck-battle-score/phase24-traits-core-count1/report.json --out-dir artifacts/deck-battle-score/phase24-traits-core-count1-traces --limit 8 --log-limit 80
npm run generate:deck-battle-snapshots -- --report artifacts/deck-battle-score/phase24-traits-smoke-count2/report.json --report artifacts/deck-battle-score/phase24-traits-core-count1/report.json --default-suite core --out src/game/deckBattleScoreSnapshots.ts
```

| Gate | Games | Result | Notes |
| --- | ---: | --- | --- |
| 全テスト | 422 tests | PASS | trait未分類チェックを追加 |
| build | - | PASS | Viteのchunk size warningのみ |
| score smoke count2 | 112 | PASS 0/0 | 平均106.3 steps / 11 turns、最大219 steps / 22 turns |
| score core count1 | 1560 | PASS 0/1 | 平均101.4 steps / 10.5 turns、最大328 steps / 30 turns |

`score core count1` は `--fail-on-warnings` により終了コード1だが、failure 0、warning 1でレポート生成は完了している。
安全性はPhase 23と同等で、ゲーム内snapshotは `phase24-traits-smoke-count2` と `phase24-traits-core-count1` で更新した。

### 次の分離候補

- `cpuAi` に残るコマンド/モンスター寄りのID例外を、必要に応じて `commandTraits` / `unitTraits` へ分離する。
- `aiWeights.strong` は現時点では既存係数を踏襲している。カード性能調整後は、カードデータではなくここでAI性格を再調整する。
- マジック以外の特殊コマンドも、威力固定推定ではなくルール仮実行差分へ寄せる。

## Phase 25: AI分離レビューと重みプロファイル修正

実行日: 2026-06-15

### 目的

Phase 24のコードレビューとして、カード調整耐性の設計に対して不足している点を修正する。
特に `strong` が `stable` と同一重みのままだった点と、一部評価経路でプロファイル重みがデフォルトへ戻っていた点を直す。

### 修正内容

- `AI_EVALUATION_WEIGHTS.strong` に初期差分を持たせ、マスターHP差とマスター打点をやや重く、ストーン消費とモンスター撃破をやや軽く評価するようにした。
- 攻撃評価の `stateDelta` と大地の怒り評価へ、選択中プロファイルの `weights` を渡すようにした。
- `tests/game/aiWeights.test.ts` を追加し、`stable` / `strong` が別プロファイルとして維持されることを検出する。
- `docs/17_ai_card_adjustment_boundary.md` に `strong` の初期性格差を追記した。

### 実行結果

```sh
npm test -- --run
npm run build
npm run score:deck-battles -- --suite smoke --seed-start 570 --count 2 --out-dir artifacts/deck-battle-score/phase25-review-smoke-count2 --fail-on-warnings
npm run score:deck-battles -- --suite core --seed-start 570 --count 1 --out-dir artifacts/deck-battle-score/phase25-review-core-count1 --fail-on-warnings
npm run analyze:deck-battles -- --report artifacts/deck-battle-score/phase25-review-core-count1/report.json --out-dir artifacts/deck-battle-score/phase25-review-core-count1-insights
npm run trace:deck-battles -- --report artifacts/deck-battle-score/phase25-review-core-count1/report.json --out-dir artifacts/deck-battle-score/phase25-review-core-count1-traces --limit 8 --log-limit 80
npm run generate:deck-battle-snapshots -- --report artifacts/deck-battle-score/phase25-review-smoke-count2/report.json --report artifacts/deck-battle-score/phase25-review-core-count1/report.json --default-suite core --out src/game/deckBattleScoreSnapshots.ts
```

| Gate | Games | Result | Notes |
| --- | ---: | --- | --- |
| 全テスト | 423 tests | PASS | aiWeightsプロファイル差分チェックを追加 |
| build | - | PASS | Viteのchunk size warningのみ |
| score smoke count2 | 112 | PASS 0/0 | 平均89.5 steps / 9.7 turns、最大172 steps / 17 turns |
| score core count1 | 1560 | PASS 0/2 | 平均95.4 steps / 10.6 turns、最大358 steps / 32 turns |

`score core count1` は `--fail-on-warnings` により終了コード1だが、failure 0、warning 2でレポート生成は完了している。
警告2件はいずれも白同士の長期戦で、進行不能ではない。

`src/game/deckBattleScoreSnapshots.ts` は `phase25-review-smoke-count2` と `phase25-review-core-count1` で更新した。

### Core count1の代表傾向

| Rank | Deck | Battle | Win | Stable | Speed |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | submission-pro-with-rare8-black-44 | 76.2 | 75.6% | 86.9 | 55.5 |
| 2 | submission-pro-with-rare8-white-1245 | 72.9 | 73.1% | 88.5 | 47.7 |
| 3 | submission-pro-with-rare8-black-1354 | 72.1 | 71.8% | 87.7 | 53.4 |
| 4 | submission-pro-no-rare8-black-408 | 69.7 | 69.2% | 89.2 | 55.0 |
| 5 | submission-pro-with-rare8-black-771 | 69.3 | 69.2% | 83.1 | 51.2 |

### 残課題

- 白同士の長期戦warning 2件は、`submission-pro-no-rare8-white-479` が先手側のときに発生した。
- `Problem Focus` は席差/非対称24件が中心で、次は player/cpu席差と先後差の分解が必要。
- `submission-pro-no-rare8-black-758` は勝てるが遅い。終盤の勝ち切り評価を確認する。
- `submission-pro-no-rare8-white-345` は安定するが勝てない。白デッキの攻め筋不足を確認する。

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

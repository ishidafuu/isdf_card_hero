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

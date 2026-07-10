# AI Playtest Reports

コメント付き棋譜を貼り付けずに渡すためのローカル保存先です。

## 使い方

1. 受信サーバーを起動する。

   ```sh
   npm run collect:battle-reports
   ```

2. 別ターミナルでゲームをローカル起動する。

   ```sh
   npm run dev -- --host 127.0.0.1 --port 5174
   ```

3. `http://127.0.0.1:5174/` で対戦し、Battle Logの行へコメントを書く。
4. 必要に応じて `Good` / `Bad` / `Question` スタンプを押す。
5. コメントが1件以上あると、入力停止後に自動保存される。
6. `docs/ai_playtest_reports/inbox/` にJSONレポートが保存される。

同じ対戦中は同じJSONへ上書き保存します。`Save Local` は明示保存用、`Copy Report` は従来どおり手動共有用として残しています。

受信サーバーは既定で `localhost` / `127.0.0.1` / `::1` からの保存だけを許可します。公開URLからローカル受信する場合は、起動時に許可するOriginを明示してください。

```sh
BATTLE_REPORT_ALLOWED_ORIGINS=https://isdf-card-hero.vercel.app npm run collect:battle-reports
```

受信ポートを変える場合は、ゲーム側の `VITE_BATTLE_REPORT_LOCAL_ENDPOINT` も同じポートへ合わせます。

スタンプを押すとコメント先頭に `GOOD:` / `BAD:` / `QUESTION:` が入り、JSONのコメント項目にも `stamp` が出力されます。

レビュー用に、画面上ではCPU手札と伏せカードの中身を表示します。保存JSONにも `reviewHiddenInfo` として両者の手札、デッキ上部、伏せスロットを出力します。

保存JSONの `aiDecisionHistory` には、各AI判断直前の復元可能な完全状態、構造化された採用行動、評価値を保存します。`white_v2` では自ターンの採用手順と、比較に使った相手の最悪応答手順も `decision.trace.turnPlan` に含まれます。

保存済みレポートの `BAD` / `QUESTION` を旧AIとV2で自動再検討するには、次を実行します。

```sh
npm run analyze:battle-report -- --report docs/ai_playtest_reports/inbox/<report>.json
```

結果は既定で `docs/ai_playtest_reports/analysis/` にMarkdownとして出力されます。`--include-good` を付けると `GOOD` も再確認対象に含めます。

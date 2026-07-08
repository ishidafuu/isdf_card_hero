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

スタンプを押すとコメント先頭に `GOOD:` / `BAD:` / `QUESTION:` が入り、JSONのコメント項目にも `stamp` が出力されます。

レビュー用に、画面上ではCPU手札と伏せカードの中身を表示します。保存JSONにも `reviewHiddenInfo` として両者の手札、デッキ上部、伏せスロットを出力します。

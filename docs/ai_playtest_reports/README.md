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
4. コメントが1件以上あると、入力停止後に自動保存される。
5. `docs/ai_playtest_reports/inbox/` にJSONレポートが保存される。

同じ対戦中は同じJSONへ上書き保存します。`Save Local` は明示保存用、`Copy Report` は従来どおり手動共有用として残しています。

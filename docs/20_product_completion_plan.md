# プロダクト完成計画

この文書は実装順と完了判定を管理する。チェックは実装・対象検証・フェイズレビューがすべて完了した項目だけに付ける。初回実装だけでは完了にしない。2026-09-28に短期フェイズの全8項目をrootがレビュー承認済み。中期フェイズは着手ゲートが開いたが、実装開始指示待ち。

## 短期フェイズ

フェイズ完了ゲート: 8項目すべての受入条件を満たし、各項目の対象テスト/手動確認の証跡を記録する。フェイズ横断で回帰テスト、`npm test`、`npm run build`、`git diff --check`を実行する。主担当レビューで未解決指摘がなくなるまで次フェイズへ進まない。状態: 完了・2026-09-28 root承認済み。

全体検証記録（2026-09-28、root実施）: `npm test -- --maxWorkers=2` は49 files / 697 tests pass（354.18秒）、`npm run build` pass（500KB超chunkの既知warningあり）、`git diff --check` pass。CPU対象テスト241件pass、盾同点fixtureの根拠は別途記録済み。以下は実ブラウザーで確認済み。

最終確認（2026-09-28、root実施）: mobile→desktopで手札が復帰。pending seed変更は対局中stateを変えず、New Gameでseed 12345が反映。AI step履歴が1/2/3件と各1件ずつ増加し停止中state不変。log overflow（783px viewport / 80px client）でfollow OFF時にscrollTop 0を維持し、console errorsは空。最終UI/diagnostics対象16 tests pass、最新build pass。全体697件実行後にresponsive対象1件を追加しているため、全suiteの最新実行数は未確認。証跡は「全体697 pass + 対象16 pass」とし、698件全suite passとは表記しない。

- Play / Spectate / Analyze: Playで召喚、CPU手番中も自分の手札を保持。AnalyzeではAutoPlayがなくread-onlyで、console error 0件。Spectateは1手進行でAI履歴が1件増え、その後3.5秒state不変。
- 設定 / モバイル: 設定のpending変更で進行中hand不変、Escape後にfocus復帰。幅390pxで横overflowなし、bottom sheet開閉を確認。
- 診断: window errorから対局データ入りJSONのdownload、unhandled rejectionから対局データ入りclipboard copyを確認。
- レビュー修正: 非Error throwのfallback、両側deck順序の秘匿、CPU判断ログ/preview/overlayの情報漏洩、raw report保存の保持、Analyzeの操作不可、mobile collapse後のdesktop手札復帰を修正済み。
- 最終ゲート: mobile→desktop / seed適用 / AI step / log-follow OFF / console errorsのrootブラウザー確認pass。未解決レビュー指摘なし。root承認済み。

- [x] 1. Play / Spectate / Analyze 分離 — Playは操作可能な対局、Spectateは入力不能な観戦、Analyzeは対局を変更しない検討表示として明確に切り替わる。モードごとに許可入力と表示内容をテストする。
- [x] 2. 設定シートと次の対局設定 — 対局中に設定シートを開閉でき、変更が進行中対局を遡及変更せず次の対局に適用される。閉じる/再開始/次戦の境界を検証する。
- [x] 3. CPUターン中の自分手札維持 — CPU行動中も人間側の手札が隠れず、選択/操作可否だけが状態に応じて制御される。CPU手番の複数状態で回帰確認する。
- [x] 4. 手札名とコスト — 手札の各カードに名前とプレイコストが判読可能に表示され、コストなし/特殊カードも曖昧な表示にならない。デスクトップと狭幅画面を確認する。
- [x] 5. モバイルbottom sheet — モバイル幅で必要な対局情報をbottom sheetから操作でき、盤面の主要操作を妨げない。開閉、スクロール、safe-area、キーボード操作を確認する。
- [x] 6. pause / step / log follow OFF — 自動進行を一時停止・1手進行でき、ログ追従OFFでは新規ログで表示位置が奪われない。各状態遷移と再開をテストする。
- [x] 7. CPU LvUP / HP draw / 捨て札 — CPUがレベルアップ、HPを使ったドロー、必要な捨て札を合法手として扱う。各経路のルール・AI選択・対局ログと代表的な境界ケースを検証する。
- [x] 8. Error Boundaryと診断保存 — React描画/ライフサイクル例外と未処理のwindow error / promise rejectionで白画面にならず、利用者が診断JSONを保存/コピーできる。対局状態を含み、機密らしいキーや文字列は可能な範囲で秘匿するが完全除去を保証しないため、利用者が共有前に確認する。context直列化や保存失敗でもfallbackを維持する。故障注入テストとブラウザーでの保存/コピーを確認する。

  - 捕捉範囲: React Error Boundaryは描画/ライフサイクル中の子孫例外を捕捉する。グローバルlistenerは未処理window errorとpromise rejectionを診断画面へ送る。React event handlerの同期例外はReactのwindow error経路に委ね、明示的な非同期エラー処理は各機能の責務とする。自動進行Workerは既存のrequest/response error経路でUIへ通知するため、Boundaryへ再送しない。

  - 個別コードレビュー: 主担当レビュー済み。診断テスト10件pass。throw値がError以外（null / 0 / string）の場合もErrorへ正規化してfallbackを維持する修正を確認済み。実ブラウザーでwindow error時download、unhandled rejection時clipboard copyとも対局データを含むことを確認済み。最終UI/diagnostics対象16 testsと最新build pass、未解決レビュー指摘なし。root承認済み。

## 中期フェイズ

フェイズ完了ゲート: 短期フェイズのレビュー承認後に着手する。7項目の受入条件と対局/AI回帰を記録し、全テスト・build・diff checkを実施したうえでレビューする。

- [ ] 1. AI hidden情報 / 乱数公平性 — CPU判断が非公開の相手情報へ不正アクセスせず、乱数源/seedの扱いが人間とCPUで公平であることをコード経路と再現可能なテストで証明する。
- [ ] 2. WhiteV2 fullturn — WhiteV2が1手の局所選択ではなく、合法な自ターン全体を計画/実行する。終了条件、計算上限、合法性、ベースライン対比のテストを用意する。
- [ ] 3. White baseline 両先攻ベンチ — 両先攻を対称に測る固定seedのベンチを整備し、比較対象・勝敗・引分・試行数をレポートして再実行可能にする。
- [ ] 4. 初回tutorial — 初回利用者が対局開始と主要操作を完了でき、再表示/スキップ可能で通常対局の入力を妨げない。初回/既存利用の両方を確認する。
- [ ] 5. DeckSetup簡易 / 研究分離 — 通常のデッキ設定を簡潔にし、研究・調整機能を通常導線から分離する。既存デッキの保持と対局への反映を検証する。
- [ ] 6. command journal 完全replay — 初期状態と順序付きcommand journalからゲーム状態・結果・ログを決定的に再構築する。乱数、境界イベント、旧記録互換を含むreplay一致テストを用意する。
- [ ] 7. E2E / a11y / visual regression — Play/Spectate/Analyzeと代表的対局フローのE2E、主要操作のアクセシビリティ検査、承認済み画面のvisual regressionをCI等で再現可能にする。

## 後段フェイズ

フェイズ完了ゲート: 中期フェイズのレビュー承認後に着手する。オンライン/共有データやコンテンツ制作を伴う項目はスコープと保存形式を先にレビューし、5項目の受入証跡を揃えて最終レビューする。

- [ ] 1. 分岐再戦 / 対局後coach — 保存した局面から分岐して再戦でき、対局後に根拠付きの改善提案を表示する。元対局を変更せず、提案の正確性を代表局面で評価する。
- [ ] 2. DailySeed / 戦術puzzle / Gauntlet — 日替わりseedの安定性、puzzleの正解/不正解判定、Gauntletの連戦状態と中断復帰をテストし、日付境界を含め再現可能にする。
- [ ] 3. local人対人 / Draft / Sealed — 端末内2人対戦、Draft、Sealedの各ルール・設定・終了結果が独立して動作し、隠し情報と手番制御を守る。各モードのシナリオテストを用意する。
- [ ] 4. Experimental masters — 実験用Masterを通常対局から分離し、明示的に選択した場合だけ利用可能にする。能力、対局保存、AI/人間双方の合法性とバランス評価を記録する。
- [ ] 5. 自作カードアート / 正式ブランド — 全カードの独自アートを制作・配布し、旧画像への依存を外す。独自タイトル/ロゴ/配色/文言を画面全体に適用し、素材manifestに権利/出典を記録する。取り込み機能は本項目の必須条件ではない。原典のカード名/ルールの全面置換は未承認で、提供物は非公式互換として表示する。権利/商標クリア済みと断定せず、素材の権利状態をレビューする。

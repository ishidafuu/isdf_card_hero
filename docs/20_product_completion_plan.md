# プロダクト完成計画

この文書は実装順と完了判定を管理する。チェックは実装・対象検証・フェイズレビューがすべて完了した項目だけに付ける。初回実装だけでは完了にしない。2026-09-28に短期フェイズの全8項目、2026-09-29に中期フェイズの全7項目、後段5項目をrootが最終レビュー承認済み。全20項目完了。

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

フェイズ完了ゲート: 短期フェイズのレビュー承認後に着手する。7項目の受入条件と対局/AI回帰を記録し、全テスト・build・diff checkを実施したうえでレビューする。状態: 完了・2026-09-29 rootレビュー承認済み。

中期最終証跡（2026-09-29、root実施・承認）: `npm test` は52 files / 729 tests pass（389.54秒）、`npm run build` pass（500KB超chunkのwarningあり）、local ChromiumでE2Eは9/9 pass（実stdout: `9 passed (1.8m)`）。GitHub CIは設定済みだが、remote runは未実行。axeはPlay/Spectate/Analyze、設定、DeckSetup basic/research、tutorial等の実画面検査で0 violations。画像decode完了を待つ検査後の4枚の固定seed PNGをrootが目視承認した。visual回帰はgeometry/color/radiusのJSON契約を比較し、PNGは目視補助でありpixel差分baselineではない。242 commands（review historyなし）のseek/parse測定と、別条件の482 command rollover stressは混同しない。後者は空の初期review history・eventLog有効からhuman/AI end_turn各241件を実記録し、482 commandsのseek後hash一致、human/AI history各240件・最新sequence 241を確認。再検証の記録43,093ms、seek 23,086.8ms。dual32-v2 hashと、検証済みstress journal（`output/replay-stress/482-command-journal.json`、98,462 bytes）をrootの実ブラウザー確認に使用した。worker経由の482-command import中は50msごとのresponsive probeが32回（約1.6秒）進行。cancel、Current game、New Gameによる後続意図の後に古い結果がlive header/journalを上書きせず、page errorsも0件。8 smoke benchmarkは失敗0（White 3–1、Black 2–2）だが、強さや採用可否の証明ではない。追加40件の追試は未完了であり、完了扱いしない。

中期以後の追試（2026-09-29）: 上記「追加40件未完了」は中期ゲート時点の履歴として維持する。その後、中期コミット時点のソースで別途40局を完了し、failure/unfinished 0、partial 0を確認した。White-baseline 14–6、black-pressure 10–10。これは後段core変更前の追試で、最新版の戦略評価や強さの証明ではない。詳細は[40局ベンチマーク](ai_playtest_reports/analysis/2026-09-28_white_v2_seat_benchmark.md)。

中期のjournal測定は負荷の大きい同期replayをWorkerへ移す判断の根拠にもなった。create/append/seek/parse/import/export/undo/branchの対象テスト、E2Eのread-only seek・JSON往復・undo分岐・cancel/stale抑止、型検査とbuildを確認済み。完全記録のschema検証とfull replayを通らない入力は完全journalとして扱わない。visual JSON契約は承認済みで、CIで自動更新しない。

- [x] 1. AI hidden情報 / 乱数公平性 — CPU判断が非公開の相手情報へ不正アクセスせず、乱数源/seedの扱いが人間とCPUで公平であることをコード経路と再現可能なテストで証明する。
- [x] 2. WhiteV2 fullturn — WhiteV2が1手の局所選択ではなく、合法な自ターン全体を計画/実行する。終了条件、計算上限、合法性、ベースライン対比のテストを用意する。
- [x] 3. White baseline 両先攻ベンチ — 両先攻を対称に測る固定seedのベンチを整備し、比較対象・勝敗・引分・試行数をレポートして再実行可能にする。
- [x] 4. 初回tutorial — 初回利用者が対局開始と主要操作を完了でき、再表示/スキップ可能で通常対局の入力を妨げない。初回/既存利用の両方を確認する。
- [x] 5. DeckSetup簡易 / 研究分離 — 通常のデッキ設定を簡潔にし、研究・調整機能を通常導線から分離する。既存デッキの保持と対局への反映を検証する。
- [x] 6. command journal 完全replay — 初期状態と順序付きcommand journalからゲーム状態・結果・ログを決定的に再構築する。乱数、境界イベント、旧記録互換を含むreplay一致テストを用意する。
- [x] 7. E2E / a11y / visual regression — Play/Spectate/Analyzeと代表的対局フローのE2E、主要操作のアクセシビリティ検査、承認済み画面のvisual regressionをCI等で再現可能にする。

## 後段フェイズ

フェイズ完了ゲート: 中期フェイズのレビュー承認後に着手する。オンライン/共有データやコンテンツ制作を伴う項目はスコープと保存形式を先にレビューし、5項目の受入証跡を揃えて最終レビューする。状態: 完了・2026-09-29 root最終レビュー承認済み。

後段の実装・途中検証の履歴（2026-09-29、最終gate以前）: DailyのJST日付・private handoverとJSON復帰競合、3 Puzzleの実操作による正解/不正解/reset、Gauntlet 3戦の実対局・各archive復帰・完了、Draftの途中pick保存復帰後30枚pickと実終局、Sealedのpool途中保存復帰・30枚deckと実終局、Local PvPの両席交代・情報遮断・69 commandの実終局とCoach、embedded Draft/GauntletのJournal/Coach/分岐、active Gauntlet過去戦からの分岐、Experimentals 16局smoke（errors/warnings 0）がそれぞれ報告された。Draft/Sealed途中保存から実終局のPlaywrightは2/2 pass。completed Draft/Gauntlet embedded Journal/Coach→nonzero branch→verified JSON E2Eは1/1 pass（17.8秒）、Hub/Experimental/Draft/Sealed axe・Sealed 390px overflow・3 Puzzle wrong/reset/correct/archive E2Eは1/1 pass（7.4秒）。CPU workerの遅延応答後もJournal/Coachの現在結果を維持する競合QA、Coach/Branch axe scan 0 violationsと390px横overflowなしもrootから報告された。この時点のunit gateは60 files / 788 tests pass（387.93秒）であり、最終統合の証跡とは区別する。当時はフェイズ最終gate未承認で、以下5項目はいずれも未完了としていた。

後段最終gate（2026-09-29、root実施・承認）: `npm test` は63 files / 792 tests pass（394.47秒、開始04:36:05）。Playwrightは隔離output directoryで最終13/13 pass（実stdout: `13 passed (3.0m)`、visual baseline更新なし）。E2Eのlive turn assertionsはbrand説明文ではなく `Turn n / ...` の実段落を一意・visible確認してから比較するselectorへ修正し、対象手動End Turn testは単独で1/1 pass（11.1秒）。`npm run build`、App/Node TypeScript検査、`git diff --check`もpass。buildには既知の500KB超chunk warningがある。local production previewのPlay/Spectate/Analyze Journal/mobile 390pxの4画面はaxe violations 0、page errors 0、旧画像URL 0、表示画像decode完了を確認。Root承認済み4 PNGの目視後、承認済みvisual JSON baselineだけを1回更新し、その後の13件E2Eは更新なしでpassした。150アートすべてについてpublic manifestのSHA一致・unique 150・1254×1254を確認し、旧配布画像folderは0。manifestにはfull promptを含みprivate pathは0、旧素材157件はGit管理外で保全された。native SVG 7点もdecode pass。Rootは全後段項目をレビュー承認した。GitHub CIのremote runは未実行。権利/商標クリア済みとは主張しない。Experimental 16局smokeはerrors/warnings 0の動作確認であり、AIの強さやバランスを保証しない。実装は各担当Luna、統合/最終レビューはRootが行い、commitもRootが担当する。

- [x] 1. 分岐再戦 / 対局後coach — 保存した局面から分岐して再戦でき、対局後に根拠付きの改善提案を表示する。元対局を変更せず、提案の正確性を代表局面で評価する。
- [x] 2. DailySeed / 戦術puzzle / Gauntlet — 日替わりseedの安定性、puzzleの正解/不正解判定、Gauntletの連戦状態と中断復帰をテストし、日付境界を含め再現可能にする。
- [x] 3. local人対人 / Draft / Sealed — 端末内2人対戦、Draft、Sealedの各ルール・設定・終了結果が独立して動作し、隠し情報と手番制御を守る。各モードのシナリオテストを用意する。
- [x] 4. Experimental masters — 実験用Masterを通常対局から分離し、明示的に選択した場合だけ利用可能にする。能力、対局保存、AI/人間双方の合法性とバランス評価を記録する。
- [x] 5. 自作カードアート / 正式ブランド — 全カードの独自アートを制作・配布し、旧画像への依存を外す。独自タイトル/ロゴ/配色/文言を画面全体に適用し、素材manifestに権利/出典を記録する。取り込み機能は本項目の必須条件ではない。原典のカード名/ルールの全面置換は未承認で、提供物は非公式互換として表示する。権利/商標クリア済みと断定せず、素材の権利状態をレビューする。

## 完了後の追加アート修正（別タスク、20項目の履歴は維持）

2026-09-29のユーザー追加指示を受け、元画像のシルエット、色面、ポーズ、クロップを基準にした読みやすいシンプル2D描き直しへ切り替えた。カード名や旧subject文から別キャラクターを発明しない。後段5項目と全20項目の完了/Root承認記録は維持し、この追作業によって当時の完了履歴を取り消さない。

- 公開状態: `public/art/card-art-manifest.json` はversion 2。内訳は147 reference-redrawと、生成拒否により現行v1を変更せず保持した004/005/007の3枚。保持3枚は描き直し成功として数えない。ユーザーによるこの3枚の扱いの回答は引き続き待ち。
- 147枚の証跡: Rootが各147件の実call全文・参照入力と候補を突合し、画像の64/48/32px視認をレビューした。生成入力は元JPGを明示参照し、094のみ元JPGと中間画像の計2枚を入力している。manifestはprompt、候補SHA、reference source/SHA、権利状態を記録し、生成元の保存場所と制作途中の証跡は含めない。
- 公開監査: Root独立監査でmanifest SHA `703ca4b69d9ed03e4754a00378b646b1bc89b7dcba22ca42610b51e112d12733`、147件の選定画像SHA一致、保持3件のv1 SHA/prompt不変を確認。公開変更範囲はmanifestと147 PNGの計148ファイルで、native UI変更は0。
- テスト境界: `tests/cardArtBuilderV2.test.ts` の14件は合成fixtureに対するschema/preflight/dry-run/publish rollback安全性の検査で、実画像の視覚品質や権利を証明するものではない。`tests/cardArtAssets.test.ts` は公開version 2、147/3内訳、PNG signature、manifest対応、配布bytesのSHA/寸法とprivate-path漏洩を検査する。v2固定後の対象テストは1 file / 3 tests PASSで、最終全unit suiteにも含まれる。全unit PASSは実画像の権利を証明するものではない。
- 権利状態: reference-based redrawであり、権利・商標クリア済みとは断定しない。生成拒否3件は元のまま残し、扱いの回答を待つ。

公開後の最終検証（2026-09-29、Root報告分）: `npm test` は64 files / 808 tests PASS（866.76秒）。`diagnosticErrorBoundary` 6 testsは293msでPASSし、長い無出力はjsdom環境初期化360.16秒によるものと確認した（単独実行も6/6 PASS）。`npm run build` と最終ソースの `npx tsc -b` PASS（buildに既知の500KB超chunk警告あり）、Playwright E2E 13/13 PASS（2.8分、承認済みbaseline更新なし）。配布150 PNGのbytes SHA/寸法監査とproduction previewのmanifest/150画像HTTP SHA・decode・寸法一致もPASS。desktop Play、Card Library、390px mobileの実画面はRoot目視済み、axe違反0・console/page error 0・横overflowなし。

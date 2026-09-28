# Stone Tactics

カードヒーローの対戦ルールに互換する、非公式のファンメイド実装です。原典のカード名・ルールは一部引き継いでいます。権利・商標のクリア済みを示すものではありません。

## 対局とセッション

- Playは通常操作、SpectateはCPU対局の観戦、Analyzeはread-onlyの対局記録検討に使います。
- セッションHubから通常対戦、Daily、Puzzle、3戦Gauntlet、Draft、Sealed、Local PvP、研究用Experimentalを開始できます。セッション条件は開始時に保存され、画面表示モードの切替だけではcontroller設定を変えません。
- Journalは初期状態と順序付き具体コマンドから状態を再構築します。検証済みの位置から元記録を保持して分岐し、対局後Coachは公開盤面と記録済み判断に基づく観察・ヒューリスティックを示します。最善手の保証ではありません。
- セッションJSONの保存は完全検証付きです。両者の手札・山札順・準備中カード、Draft/Sealedの非公開pool/pickなどを含みます。共有せず安全に保管してください。端末autosaveは任意で、再読み込み後の自動復帰はしません。保存内容を確認して手動で復帰してください。
- Experimental mastersは標準対戦から分離された研究条件です。結果はバランスや強さの証明ではありません。

## 開発

Node.jsは20系なら20.19以上、または22.12以上が必要です（package.jsonのengine条件）。`.node-version`は22系を指定しています。初回はlockfileに従って依存を入れます。

```sh
npm ci
npm run dev
npm test
npm run test:e2e
npm run build
```

Playwright E2EはローカルChromiumが必要です。Visual検査は承認済みgeometry/color/radius JSON契約と補助PNGを使い、CIでbaselineを自動更新しません。詳しい受入条件・検証履歴は[プロダクト完成計画](docs/20_product_completion_plan.md)を参照してください。

## アートの出典

全150枚の独自カードアートと素材情報は[配布用アートmanifest](public/art/card-art-manifest.json)を参照してください。manifestには採用画像のprompt・hash・出典を記録しています。元出力の保存場所と制作途中の証跡は非公開です。素材情報は権利や商標のクリア済みを示すものではありません。

## 関連資料

- [プロジェクト方針](docs/00_project_direction.md)
- [戦闘プロトタイプ仕様](docs/01_battle_prototype.md)
- [資料調査メモ](docs/02_research_notes.md)
- [CPU AI設計メモ](docs/03_cpu_ai_design.md)
- [今後のロードマップ](docs/04_roadmap.md)
- [オートプレイ検証ログ](docs/05_auto_play_validation.md)
- [warning seedレビュー](docs/06_warning_seed_review.md)
- [カード特殊効果の網羅テスト基盤](docs/07_card_effect_coverage.md)

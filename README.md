# isdf_card_hero

カードヒーロー風の位置取り、育成、リソース管理を小さく検証するための
プロトタイププロジェクトです。

現時点では完成形を固定せず、まずは仕様書をもとに「1戦の戦闘が面白いか」を
確認するプロトタイプを作ります。

## Current Focus

1. 戦闘プロトタイプを反復プレイに耐える状態へ安定化する
2. CPU AIの行動理由とログ表示を改善する
3. マジック、マスター特技、移動をCPU AIへ段階的に解禁する

## Documents

- [プロジェクト方針](docs/00_project_direction.md)
- [戦闘プロトタイプ仕様](docs/01_battle_prototype.md)
- [資料調査メモ](docs/02_research_notes.md)
- [CPU AI設計メモ](docs/03_cpu_ai_design.md)
- [今後のロードマップ](docs/04_roadmap.md)

## Development

```sh
npm install
npm run dev
npm test
npm run build
```

ローカル開発サーバーは通常 `http://localhost:5173/` で起動します。

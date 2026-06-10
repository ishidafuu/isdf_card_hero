# isdf_card_hero

カードヒーロー風の位置取り、育成、リソース管理を小さく検証するための
プロトタイププロジェクトです。

現時点では完成形を固定せず、まずは仕様書をもとに「1戦の戦闘が面白いか」を
確認するプロトタイプを作ります。

## Current Focus

1. 公式/参考資料から通常バトルの核を整理する
2. プロトタイプで採用する仕様と未採用にする仕様を分ける
3. 最小戦闘プロトタイプを実装する

## Documents

- [プロジェクト方針](docs/00_project_direction.md)
- [戦闘プロトタイプ仕様](docs/01_battle_prototype.md)
- [資料調査メモ](docs/02_research_notes.md)

## Development

```sh
npm install
npm run dev
npm test
npm run build
```

ローカル開発サーバーは通常 `http://localhost:5173/` で起動します。

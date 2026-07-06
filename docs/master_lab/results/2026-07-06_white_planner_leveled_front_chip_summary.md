# White Planner Leveled Front Chip Loop

生成: 2026-07-06

## Summary

- 変更内容: 白ミラーで、後衛から相手Lv2以上の前衛脅威へ非リーサル削りを入れる価値を追加した。
- 狙い: ドノマンティスLv2、真勇者ダインLv3、ポリスピナーLv2のような盤面制圧/顔打点の起点を、倒しきれないからと放置しすぎる問題を減らす。
- 対象は後衛からの削りに限定した。前衛の非リーサル攻撃を雑に増やすと、反撃を受ける旧問題に戻るため。

## Validation

- `npm test -- --run tests/game/cpuAi.test.ts`: pass
- `npm run build`: pass
- `lab:masters:white-planner-pdca` 994326-994333 / both directions / current only:
  - 途中で送った中断入力が最後に効き、プロセス終了コードは130。
  - ただし16戦目の結果までは標準出力で確認済み。
  - そのため、このレポートは標準出力からの手動集計で、同名JSONは未生成。

## Benchmark

| range | games | white_planner | white | win rate | avg steps | avg turns | avg HP margin |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 994326-994333 | 16 | 12 | 4 | 75.0% | 208.1 | 19.8 | +3.81 |

前回同seed帯:

| range | games | white_planner | white | win rate | avg steps | avg turns | warnings |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 994326-994333 | 16 | 10 | 6 | 62.5% | 241.3 | 23.1 | 4 |

## Seat Split

| direction | W-L | avg steps | avg turns | avg HP margin |
| --- | ---: | ---: | ---: | ---: |
| challenger-as-cpu | 6-2 | 202.0 | 19.5 | +4.38 |
| challenger-as-player | 6-2 | 214.1 | 20.0 | +3.25 |

## Games

| direction | seed | result | steps | turns | HP |
| --- | ---: | --- | ---: | ---: | --- |
| challenger-as-cpu | 994326 | white_planner | 149 | 15 | P0/C5 |
| challenger-as-cpu | 994327 | white_planner | 143 | 14 | P0/C9 |
| challenger-as-cpu | 994328 | white_planner | 265 | 24 | P0/C5 |
| challenger-as-cpu | 994329 | white_planner | 228 | 19 | P0/C8 |
| challenger-as-cpu | 994330 | white_planner | 235 | 21 | P0/C10 |
| challenger-as-cpu | 994331 | white | 199 | 20 | P2/C0 |
| challenger-as-cpu | 994332 | white | 198 | 27 | P8/C0 |
| challenger-as-cpu | 994333 | white_planner | 199 | 16 | P0/C8 |
| challenger-as-player | 994326 | white_planner | 134 | 14 | P10/C0 |
| challenger-as-player | 994327 | white | 146 | 14 | P0/C8 |
| challenger-as-player | 994328 | white_planner | 292 | 25 | P5/C0 |
| challenger-as-player | 994329 | white_planner | 306 | 28 | P1/C0 |
| challenger-as-player | 994330 | white_planner | 265 | 27 | P8/C0 |
| challenger-as-player | 994331 | white_planner | 199 | 20 | P2/C0 |
| challenger-as-player | 994332 | white_planner | 165 | 15 | P10/C0 |
| challenger-as-player | 994333 | white | 206 | 17 | P0/C2 |

## Assessment

- 採用寄り。前回10-6から12-4へ改善し、平均stepsも短くなった。
- CPU席は前回5-3から6-2。特に994329は前回負けから勝ちへ変わっており、今回の狙いと噛み合っている可能性が高い。
- player席も前回5-3から6-2。994332を拾えた一方、994327/994333はまだ落としている。
- 306 stepsの長期戦が残っているため、次は勝率改善より終盤の軽量化と負けseed 994327/994333 の質確認を優先する。

## Next Loop

1. 994327/994333 の負けログを取り直し、高レベル前衛放置がまだ残るか確認する。
2. 994329/994332 の勝ち化seedで、後衛チップ評価が実際に選択差へ寄与したかトレースする。
3. 強さ確認は同条件をもう1帯、たとえば 994318-994325 で回す。
4. その後、終盤の長期局面だけを対象に terminal rollout の軽量化候補を試す。

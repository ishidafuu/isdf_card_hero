# White Current Deck Shield Quality Next

生成: 2026-06-28

## Scope

前回の `Shield First` 調査で、行動順そのものよりも「盾対象の品質/必要性」が次の焦点と分かった。  
今回は、現行の暫定白最強デッキ `master-lab-white-1377-death-sheep3` で、以下を確認した。

- 盾なし予測ダメージ
- 盾あり予測ダメージ
- 接触なし/成果化なし
- 1接触で除去
- 次自ターン成果化
- 2枚目盾
- 低石化

## Script Updates

`scripts/shield-usage-audit-loop.ts` を現行デッキ基準に更新した。

- デフォルト候補を現行白デッキ用に変更。
- `current_white_baseline` を追加。
- `current_shield_no_pressure8` を追加。
- `current_shield_breakthrough12` を追加。
- `current_shield_quality_combo` を追加。
- `current_second_shield_guard` を追加。
- 相手に `black_1375_pressure` と `white_current_mirror` を追加。

また、通常の現行デッキ改善ループでも追試できるように、`scripts/white-current-deck-improvement-loop.ts` へ `current_shield_no_pressure8` を追加した。

## Screen Result

実行:

```bash
npm run lab:masters:shield-audit -- --variant current_white_baseline --variant current_shield_no_pressure8 --variant current_shield_breakthrough12 --opponent black_1375_pressure --opponent white_current_mirror --games-per-matchup 1 --seed-start 84100 --max-turns 100 --markdown docs/master_lab/results/2026-06-28_white_current_deck_shield_quality_screen_g1.md --json docs/master_lab/results/2026-06-28_white_current_deck_shield_quality_screen_g1.json
```

結果:

| Variant | W-L-D | Shield | 1接触除去 | 接触なし/成果化なし | 成果化 | 低石化 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| current_white_baseline | 3-1-0 | 35 | 17.1% | 37.1% | 45.7% | 54.3% |
| current_shield_no_pressure8 | 3-1-0 | 25 | 12.0% | 20.0% | 68.0% | 52.0% |
| current_shield_breakthrough12 | 1-3-0 | 27 | 14.8% | 29.6% | 55.6% | 25.9% |

## Interpretation

`current_shield_no_pressure8` は小母数ではかなり良い。

- 盾使用数が 35 -> 25 に減った。
- 成果化率が 45.7% -> 68.0% に上がった。
- 接触なし/成果化なしが 37.1% -> 20.0% に減った。
- 1接触除去も 17.1% -> 12.0% に減った。
- 勝敗は baseline と同じ 3-1-0。

一方で `current_shield_breakthrough12` は、盾品質指標は少し改善したが勝敗が 1-3-0 へ悪化した。  
「突破される盾」を抑える方向は、必要な延命まで削っている可能性がある。

## Hold Reason

`current_shield_no_pressure8` は有望だが、まだAI本体へ採用しない。

理由:

- `games-per-matchup 1` の一次スクリーニングで、母数が小さい。
- 履歴付き `games-per-matchup 2` の再確認は重すぎて打ち切った。
- ノープレッシャー予測は簡易上限で、実ログでは `predictedNoPressure` でも後から接触される例がある。

したがって、現時点では「採用候補」ではなく「次ループの最有力候補」とする。

## Next Loop Proposal

次は重い履歴付き監査ではなく、二段に分ける。

1. 勝率だけを見る軽量ループ  
   `current_white_baseline` と `current_shield_no_pressure8` だけを、履歴なしで `black_1375_pressure` / `white_current_mirror` に `games-per-matchup 3-4` で当てる。

2. その結果が悪くなければ、履歴付き盾監査  
   `games-per-matchup 1-2` で十分。目的は勝率ではなく、`接触なし/成果化なし` と `1接触除去` が本当に減るかを見る。

3. 採用条件  
   - 勝率が baseline から大きく落ちない。
   - 成果化率が baseline より明確に高い。
   - `接触なし/成果化なし` が低い。
   - 対白ミラーで盤面制圧力が落ちない。

## References

- [shield quality screen g1](./2026-06-28_white_current_deck_shield_quality_screen_g1.md)

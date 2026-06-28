# White Current Deck No Pressure Sweep Summary

生成: 2026-06-28

## Scope

前回の盾品質監査で `current_shield_no_pressure8` が小母数では有望に見えたため、履歴なしの長めループで再確認した。  
目的は AI 本体へ採用するかではなく、`whiteShieldNoPressurePenalty` 系を次の本命候補に残すかを判断すること。

## Script Updates

`scripts/white-current-deck-improvement-loop.ts` を軽量確認へ使いやすくした。

- `--variant` で候補を絞れるようにした。
- `--opponent` で相手を絞れるようにした。
- `--no-confirm-history` を追加し、confirm phase でも履歴保存を切れるようにした。
- 追加候補:
  - `current_shield_no_pressure4`
  - `current_shield_no_pressure8`
  - `current_shield_no_pressure4_wake4`
  - `current_shield_no_pressure8_wake4`

## Loop 1: no-pressure8 only

実行規模:

- Screen: 2 variants / 32 games
- Confirm: 2 variants / 32 games
- 合計: 64 games

結果:

| Phase | Variant | W-L-D | Overall | vs Black | vs White | 判定 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Screen | current_white_baseline | 10-6-0 | 62.5% | 62.5% | 62.5% | baseline優位 |
| Screen | current_shield_no_pressure8 | 5-11-0 | 31.3% | 25.0% | 37.5% | 悪化 |
| Confirm | current_white_baseline | 6-10-0 | 37.5% | 25.0% | 50.0% | 対白維持 |
| Confirm | current_shield_no_pressure8 | 6-10-0 | 37.5% | 37.5% | 37.5% | 対黒改善/対白悪化 |

読み:

- `no-pressure8` は seed によって対黒が伸びるが、対白を落としやすい。
- screen と confirm で順位が反転しており、安定した改善とは言いにくい。
- この時点で採用は保留。

## Loop 2: no-pressure / wake sweep

実行規模:

- Screen: 5 variants / 60 games
- Confirm: 3 variants / 36 games
- 合計: 96 games

Screen:

| Rank | Variant | W-L-D | Overall | vs Black | vs White |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | current_shield_no_pressure8_wake4 | 6-6-0 | 50.0% | 50.0% | 50.0% |
| 2 | current_shield_no_pressure4_wake4 | 6-6-0 | 50.0% | 66.7% | 33.3% |
| 3 | current_shield_no_pressure8 | 3-9-0 | 25.0% | 50.0% | 0.0% |
| 4 | current_shield_no_pressure4 | 3-9-0 | 25.0% | 33.3% | 16.7% |
| 5 | current_white_baseline | 4-8-0 | 33.3% | 33.3% | 33.3% |

Confirm:

| Rank | Variant | W-L-D | Overall | vs Black | vs White |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | current_white_baseline | 6-6-0 | 50.0% | 66.7% | 33.3% |
| 2 | current_shield_no_pressure4_wake4 | 5-7-0 | 41.7% | 50.0% | 33.3% |
| 3 | current_shield_no_pressure8_wake4 | 5-7-0 | 41.7% | 33.3% | 50.0% |

読み:

- screen では wake 併用が良く見えたが、confirm では baseline が首位に戻った。
- `no_pressure4_wake4` は baseline に近いが、baseline比で score -2.6 / overall -8.3% / vsBlack -16.7%。
- `no_pressure8_wake4` は対白を維持する seed がある一方、対黒が落ちた。
- no-pressure単体は対白を大きく落としやすく、本命から外す。

## Decision

`whiteShieldNoPressurePenalty` 系は採用しない。  
少なくとも現行デスシープ3デッキでは、ノープレッシャー盾を抑えるだけでは白ミラーまたは対黒のどちらかを崩しやすい。

今の白AIは「盾が多い」こと自体は確かだが、雑に盾を減らすと必要な盤面維持まで削る。  
次は盾抑制ではなく、盾後の勝ち筋変換を直接見る方がよい。

## Next Loop Proposal

次は `shield penalty` ではなく、以下のどちらかを攻める。

1. 盾後の勝ち筋変換
   - 盾対象が次ターン攻撃したかだけでなく、その攻撃が撃破/レベルアップ/相手前衛打点源処理へつながったかを見る。
   - 候補は `whiteShieldThreatConversionBonus` の強化ではなく、成果の種類別に分ける。

2. 負けseedの反撃不足監査
   - 対黒で負ける seed を抽出し、「盾で耐えた後に反撃できない」「ウェイクアップが遅い」「マスターアタックへ逃げた」を分ける。
   - 次の候補は `shieldを減らす` ではなく、`盾後に攻撃/ウェイク/前衛処理へ接続する` 方向にする。

## References

- [no-pressure8 loop g4](./2026-06-28_white_current_deck_no_pressure8_loop_g4.md)
- [no-pressure8 loop g4 screen](./2026-06-28_white_current_deck_no_pressure8_loop_g4_screen.md)
- [no-pressure8 loop g4 confirm](./2026-06-28_white_current_deck_no_pressure8_loop_g4_confirm.md)
- [no-pressure sweep g3](./2026-06-28_white_current_deck_no_pressure_sweep_g3.md)
- [no-pressure sweep g3 screen](./2026-06-28_white_current_deck_no_pressure_sweep_g3_screen.md)
- [no-pressure sweep g3 confirm](./2026-06-28_white_current_deck_no_pressure_sweep_g3_confirm.md)

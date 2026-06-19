# White AI Black Front Upper Loop 49-52 Summary

## Goal

前回採用した `whiteBlackFrontThreatBonus: 8` の上限を確認しつつ、採用後baselineの黒敗戦を監査した。

## Implementation

実験variantを追加した。

- `pressure_white_black_front_threat_plus12_v1`
  - `whiteBlackFrontThreatBonus: 12`
- `pressure_white_black_front_threat_plus16_v1`
  - `whiteBlackFrontThreatBonus: 16`

標準 `white` profile は今回変更していない。採用済みの値は `+8` のまま。

## Loop 49: Adoption Baseline Loss Audit

- Report: `2026-06-19_white_ai_black_front_loss_audit_loop_49.md`
- 条件: 採用後baseline、黒2相手、6 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss LowS | Loss ShieldConv | Loss Focus | ThreatB | ThreatA | BlkA |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `pressure_white_baseline` | 9-15-0 | 53.6% | 48.1% | 84 | 64.9% | 64.9% | 16.0% |

読み取り:

- 採用後も黒相手の負けでは低石布石が多い。
- ただし負け側の `ShieldConv` は48.1%あり、盾が完全に無駄というより、守った後に勝ち切れない局面が混ざっている。
- `WNow 10.7%` / `WExec 7.1%` と、負け側のウェイク即仕事は低い。次はウェイク対象の品質をもう少し分けて見る価値がある。
- `ThreatA` が `ThreatB` と同じ64.9%なので、布石後も敵前衛脅威は残りやすい。ただし前回の低石布石抑制は白の必要な布石まで壊したため、直接ペナルティは危険。

## Loop 50: Black Front Upper Screen

- Report: `2026-06-19_white_ai_black_front_upper_screen_loop_50.md`
- 条件: baseline(+8) / +12 / +16、黒2相手、5 games/matchup/direction、no-history。

| Rank | Variant | vs Black |
| ---: | --- | ---: |
| 1 | `pressure_white_black_front_threat_plus16_v1` | 50.0% |
| 2 | `pressure_white_black_front_threat_plus12_v1` | 40.0% |
| 3 | `pressure_white_baseline` | 35.0% |

読み取り:

- 粗いスクリーニングでは +16 が上振れた。
- +12 はbaselineより少し良いが、+16ほどではない。
- +16だけを中母数確認へ進めた。

## Loop 51: Plus16 Confirm

- Report: `2026-06-19_white_ai_black_front_plus16_confirm_loop_51.md`
- 条件: baseline(+8) / +16、黒2相手+Decoy+White、4 games/matchup/direction、historyあり。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | ShieldConv | LowS |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | `pressure_white_black_front_threat_plus16_v1` | 56.3% | 56.3% | 50.0% | 62.5% | 32.6% | 54.2% |
| 2 | `pressure_white_baseline` | 37.5% | 31.3% | 50.0% | 37.5% | 30.2% | 50.6% |

読み取り:

- 通常loopでは +16 が大きく上回った。
- ただし、variantごとにseedがずれるため、この結果だけで採用するのは危険。
- `LowS` は+16でも改善せず、盾成果化もまだ低い。前衛脅威処理だけでは残課題は解けていない。

## Loop 52: Plus16 Paired Decision Diff

- Report: `2026-06-19_white_ai_black_front_plus16_decision_diff_loop_52.md`
- 条件: baseline(+8) vs +16、黒2相手、10 seeds/seat、同一seed比較、turn 6まで。

| Compare | Ref win / compare not | Compare win / ref not | Both win | Both loss |
| --- | ---: | ---: | ---: | ---: |
| `pressure_white_black_front_threat_plus16_v1` | 3/40 | 3/40 | 6/40 | 28/40 |

読み取り:

- 同一seed比較では +16 だけが勝つseedと baselineだけが勝つseedが同数だった。
- 最初の分岐は `focus > attack:デスシープ:enemy_front` や `focus > attack:ラオン:enemy_front`。
- +16 は「focusをやめて黒前衛を殴る」方向へ動かすが、それが勝ち筋になるseedと負け筋になるseedが割れている。

## Decision

標準 `white` profile は `whiteBlackFrontThreatBonus: 8` のまま維持する。

理由:

- 通常loopでは +16 が強いが、paired seed では 3勝改善 / 3勝悪化で互角だった。
- +16 は前衛攻撃を強く押すため、白の育成目的のfocusを壊す局面がある。
- `LowS` / `ShieldConv` の残課題は +16 では解決していない。

今回追加した +12/+16 variant は、今後の黒限定調整候補として残す。

## Next Loop Proposal

次は前衛脅威処理の係数をさらに上げるより、敗戦ログの `wake_up` と `shield` を分ける。

1. `wake_up` の敗戦監査を強める。
   - 起こした対象が同ターンに仕事したか。
   - 次ターンまで生きたか。
   - 起こした結果、残石1以下になって防御手段が消えたか。
   - `WLowNo` が高いseedで、起こす対象が前衛/後衛/準備中スーパー候補のどれかを見る。

2. `shield` は「成果化不足」ではなく「守った後に勝ち切れない」を分ける。
   - `ShieldConv` は負け側でも48.1%あり、完全な無駄盾ではない。
   - 盾対象が攻撃した後に相手前衛が残るのか、レベルアップできないのか、マスターHPを詰められないのかを見る。

3. paired diff toolingを改善する。
   - 現在は `Ref win / compare not` 側のsampleだけが詳しい。
   - `Compare win / ref not` 側のsampleも出すと、+16の勝ちseedを読める。
   - 次の採用判断前にここを直すと、勝率差の理由を追いやすい。

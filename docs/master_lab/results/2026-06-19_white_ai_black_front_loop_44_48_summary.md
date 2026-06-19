# White AI Black Front Loop 44-48 Summary

## Goal

前回の「脅威処理を済ませてから布石する」方針を受け、白AIの汎用強化を続けた。

今回は、黒に有効だった示唆を意識しつつ、標準 `white` profile に入れてよい条件かを分けて確認した。

## Implementation

### Adopted

`white` profile に以下を標準採用した。

- `whiteBlackFrontThreatBonus: 8`

これは、相手マスターが `black` で、敵前衛がバーサク込みの次ターン打点源になりうる場合に、その前衛を削る白の攻撃を加点する。

白/Decoy相手では条件が発火しないため、黒マスターへの見えている対策として扱う。

### Experimental Only

以下は実験候補として追加したが、標準採用していない。

- `whiteThreatLeftLowStoneSetupPenalty`
  - 敵前衛脅威が残る低石布石を抑える。
  - 緊急/成果化シールド、仕事が見えるウェイクアップ、仕事が見えるfocusは除外する。

追加variant:

- `pressure_white_threat_left_low_stone_setup_guard_light_v1`
- `pressure_white_threat_left_low_stone_setup_guard_v1`
- `pressure_white_threat_left_focus_missed_attack_v1`

## Loop 44: Threat Left Setup Screen

- Report: `2026-06-19_white_ai_threat_left_setup_screen_loop_44.md`
- 条件: baseline / 脅威残り低石布石抑制 / 既存threat_then_setup、黒2相手+Decoy+White、4 games/matchup/direction、no-history。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | `pressure_white_baseline` | 62.5% | 43.8% | 87.5% | 75.0% |
| 2 | `pressure_white_threat_left_low_stone_setup_guard_light_v1` | 46.9% | 37.5% | 50.0% | 62.5% |
| 3 | `pressure_white_threat_left_low_stone_setup_guard_v1` | 37.5% | 37.5% | 37.5% | 37.5% |
| 4 | `pressure_white_threat_then_setup_v1` | 43.8% | 25.0% | 50.0% | 75.0% |
| 5 | `pressure_white_threat_left_focus_missed_attack_v1` | 40.6% | 25.0% | 50.0% | 62.5% |

読み取り:

- 「脅威が残る低石布石」を直接抑える候補は広すぎた。
- 特に強め版は、白の必要な布石を別の悪い行動へ押し出している可能性が高い。
- 標準採用候補なし。

## Loop 45: Threat Left Setup Decision Diff

- Report: `2026-06-19_white_ai_threat_left_setup_decision_diff_loop_45.md`
- 条件: baseline vs 脅威残り低石布石抑制、黒2相手、8 seeds/seat、turn 6まで。

| Compare | Ref win / compare not | Compare win / ref not | First diff |
| --- | ---: | ---: | --- |
| `pressure_white_threat_left_low_stone_setup_guard_light_v1` | 0/32 | 0/32 | - |
| `pressure_white_threat_left_low_stone_setup_guard_v1` | 5/32 | 0/32 | `focus > attack:オヤコダケ:enemy_front`, `wake_up > focus/shield` |

読み取り:

- 強め版は baseline だけが勝つseedを作った。
- 悪化分岐は、focusやwake_upを削って攻撃/盾/focusへ逃がす形。
- 「全力を出しすぎない」ための抑制でも、白の育成・展開の核を削ると悪化する。

## Loop 46: Black Front Rescreen

- Report: `2026-06-19_white_ai_black_front_rescreen_loop_46.md`
- 条件: 前回リファクタ後、既存の黒前衛処理系候補を黒限定で再評価。3 games/matchup/direction、no-history。

| Rank | Variant | vs Black |
| ---: | --- | ---: |
| 1 | `pressure_white_black_front_threat_v1` | 58.3% |
| 2 | `pressure_white_active_front_work_v1` | 50.0% |
| 3 | `pressure_white_low_stone_focus_missed_attack_light_v1` | 50.0% |
| 4 | `pressure_white_baseline` | 41.7% |

読み取り:

- 直前のリファクタで、行動済みの敵前衛も次ターン脅威として見るようになったため、`whiteBlackFrontThreatBonus` が有効化した。
- これは過去の「黒に効いたことを後で活かす」方針と一致する。

## Loop 47: Black Front Confirm

- Report: `2026-06-19_white_ai_black_front_confirm_loop_47.md`
- 条件: 上位候補を黒2相手+Decoy+Whiteで確認。4 games/matchup/direction、historyあり。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | `pressure_white_black_front_threat_v1` | 56.3% | 37.5% | 87.5% | 62.5% |
| 2 | `pressure_white_low_stone_focus_missed_attack_light_v1` | 43.8% | 50.0% | 50.0% | 25.0% |
| 3 | `pressure_white_active_front_work_v1` | 50.0% | 37.5% | 100.0% | 25.0% |
| 4 | `pressure_white_baseline` | 40.6% | 25.0% | 75.0% | 37.5% |

読み取り:

- `whiteBlackFrontThreatBonus` は baseline 比で vs Black +12.5pt。
- `whiteLowStoneFocusMissedAttackPenalty: 4` は黒だけなら魅力があるが、Decoy/Whiteを落としすぎる。
- `whiteBlackFrontThreatBonus` は相手が黒の時だけ発火するため、標準採用してもDecoy/Whiteの行動には直接影響しない。

## Loop 48: Adoption Check

- Report: `2026-06-19_white_ai_black_front_adoption_check_loop_48.md`
- 条件: `whiteBlackFrontThreatBonus: 8` 採用後の baseline と、focus抑制追加候補を確認。4 games/matchup/direction、historyあり。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | `pressure_white_baseline` | 59.4% | 43.8% | 75.0% | 75.0% |
| 2 | `pressure_white_low_stone_focus_missed_attack_light_v1` | 40.6% | 37.5% | 50.0% | 37.5% |

読み取り:

- 採用後 baseline は安定。
- focus抑制を追加すると黒も全体も落ちたため、今回の採用は `whiteBlackFrontThreatBonus: 8` のみに留める。

## Decision

標準 `white` profile に `whiteBlackFrontThreatBonus: 8` を採用する。

採用理由:

- 黒限定スクリーニングで baseline を上回った。
- 中母数確認でも baseline 比で黒勝率が改善した。
- 条件が「相手マスターが黒」に閉じており、Decoy/Whiteの通常行動を直接変えない。
- 直前の脅威評価リファクタにより、行動済み敵前衛も次ターン脅威として正しく評価できるようになった。

採用しないもの:

- `whiteThreatLeftLowStoneSetupPenalty`
  - 低石布石抑制が広すぎ、focus/wake_upを削って悪化する。
- `whiteLowStoneFocusMissedAttackPenalty`
  - 黒向けの手がかりとしては残すが、汎用採用ではDecoy/Whiteの副作用が大きい。

## Next Loop Proposal

次はAI係数だけで押すより、敗戦ログを分ける。

1. 採用後 baseline の黒敗戦を loss audit する。
   - `ShieldConv` がまだ35.9%で低い。
   - `LowS` も53.3%残っている。
   - 「守ったが反撃できない」と「そもそも守る対象が弱い」を分ける。

2. `whiteBlackFrontThreatBonus` の上限確認をする。
   - +8採用済み。
   - +12/+16は過剰前衛攻撃にならないか、黒限定で短く見る。
   - ただし、Decoy/Whiteには発火しないので主に黒seedでよい。

3. `whiteLowStoneFocusMissedAttackPenalty` は黒専用手がかりとして保持する。
   - 汎用採用はしない。
   - 将来、相手マスター別AI最適化を入れる場合の候補にする。

4. 評価方法の改善も検討する。
   - `white-ai-tuning-loop` はvariantごとにseedがずれるため、Decoy/White差分にノイズが出る。
   - 採用判断用には paired seed 比較モードを追加すると、今回のような条件付き候補を判定しやすい。

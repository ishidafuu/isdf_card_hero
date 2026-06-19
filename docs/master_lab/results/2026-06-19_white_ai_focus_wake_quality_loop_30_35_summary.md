# White AI Focus/Wake Quality Loop 30-35 Summary

## Goal

ひいら氏ブログ整理のうち、次の4点をホワイトAI改善ループへ反映した。

1. `execution/setup` 分離
   そのターンの成果と、次ターンへの布石を分けて見る。
2. 自陣ウェイクの露出込み評価
   起こした味方が同ターンに仕事したかだけでなく、次自ターン前に倒されたかを見る。
3. シールド理論の監査化
   盾対象が実際に何回攻撃されたかを audit し、すぐ追加加点にはしない。
4. 開幕配置の固定局面化
   勝率ループではなく、後衛役を前列へ雑に置かないテストとして固定する。

## Implementation

### Audit

`white-ai-loss-audit` の `Target Quality` を拡張した。

- Shield
  - `SHit`: 盾対象が次自ターンまでに受けた攻撃回数。
  - `SMulti`: 2回以上攻撃された盾対象数。
- Wake
  - `WDead`: ウェイク対象が次自ターン前に倒された率。
- Focus
  - `F`: focus回数。
  - `FLow`: 低石focus回数。
  - `FNext`: focus対象が次自ターンに攻撃した率。
  - `FExec`: focus対象が次自ターンに成果行動へつながった率。
  - `FLowNo`: 低石focus後、次自ターンの仕事へ変換されなかった回数。

### AI候補

標準採用はせず、実験variantとして追加した。

- `pressure_white_low_stone_focus_conversion_v1`
  - `whiteLowStoneFocusConversionBonus: 8`
  - 低石でも次ターン攻撃/レベルアップへ変換できるfocusだけを加点。
- `pressure_white_wake_safe_work_v1`
  - `whiteWakeSafeWorkBonus: 8`
  - 起こした味方が露出死しにくく、同ターンまたは次ターンの仕事が見えるウェイクを加点。
- `pressure_white_focus_wake_quality_v1`
  - 上記2つの+8複合。
- `pressure_white_focus_wake_quality_light_v1`
  - 上記2つの+4複合。

### Fixed Test

HBR-004 の開幕配置観点として、後衛役 `beyond` を初手で後列へ置く固定テストを追加した。

## Loop 30: Baseline Audit

- Report: `2026-06-19_white_ai_focus_wake_quality_baseline_audit_loop_30.md`
- 条件: 採用済みbaseline、黒2相手、8 games/matchup/direction。
- 結果: 9-23-0、Loss LowS 50.9%。

| Outcome | Focus | Wake | Shield |
| --- | --- | --- | --- |
| Win | F 48、FLow 33、FNext 60.4%、FExec 54.2%、FLowNo 17/33 | WNow 36.1%、WExec 25.0%、WDead 11.1%、WLowNo 12/16 | SAtk 61.5%、SDead 15.4%、SHit 5、SMulti 1 |
| Loss | F 138、FLow 107、FNext 59.4%、FExec 41.3%、FLowNo 47/107 | WNow 32.9%、WExec 12.3%、WDead 16.4%、WLowNo 19/29 | SAtk 58.2%、SDead 19.4%、SHit 13、SMulti 0 |

読み取り:

- 負け側の低石focusは 107 回で最大。うち 47 回は次ターン仕事へ変換されていない。
- Wakeは負け側で `WExec` が低く、`WDead` も少し悪い。
- Shieldは `SMulti` が少なく、「2回以上殴られる対象に盾」というより、守った対象が1回以下しか攻撃されない局面も多そう。

## Loop 31: Black Screen

- Report: `2026-06-19_white_ai_focus_wake_quality_black_screen_loop_31.md`
- 条件: 黒2相手、6 games/matchup/direction、no-history。

| Rank | Variant | vs Black |
| ---: | --- | ---: |
| 1 | `pressure_white_focus_wake_quality_v1` | 54.2% |
| 2 | `pressure_white_low_stone_focus_light_v1` | 33.3% |
| 3 | `pressure_white_baseline` | 29.2% |
| 4 | `pressure_white_low_stone_focus_conversion_v1` | 29.2% |
| 5 | `pressure_white_wake_safe_work_v1` | 25.0% |

読み取り:

- 単体のfocus加点/wake加点は伸びない。
- +8複合だけが大きく上振れた。focusとwakeを同時に動かすことで行動系列が変わった可能性がある。

## Loop 32: Black Confirm

- Report: `2026-06-19_white_ai_focus_wake_quality_black_confirm_loop_32.md`
- 条件: 黒2相手、8 games/matchup/direction、historyあり。

| Rank | Variant | vs Black | ShieldConv | LowS |
| ---: | --- | ---: | ---: | ---: |
| 1 | `pressure_white_focus_wake_quality_v1` | 43.8% | 50.5% | 53.2% |
| 2 | `pressure_white_baseline` | 40.6% | 40.6% | 54.2% |
| 3 | `pressure_white_low_stone_focus_light_v1` | 37.5% | 43.6% | 51.3% |

読み取り:

- +8複合は historyありでも一応首位だが、差は +3.2pt まで縮小。
- `ShieldConv` は改善しており、focus/wakeを触った副作用として守った駒の成果化も上がっている。
- ただし vs Black 45% には届かない。

## Loop 33: Loss Audit

- Report: `2026-06-19_white_ai_focus_wake_quality_loss_audit_loop_33.md`
- 条件: 黒2相手、8 games/matchup/direction、historyあり。

| Variant | W-L-D | Loss LowS | Loss Target Quality |
| --- | --- | ---: | --- |
| `pressure_white_baseline` | 7-25-0 | 51.4% | WDead 22.7%、WLowNo 21/31、FExec 35.2%、FLowNo 69/136 |
| `pressure_white_low_stone_focus_light_v1` | 13-19-0 | 53.2% | WDead 17.3%、WLowNo 28/34、FExec 40.2%、FLowNo 47/112 |
| `pressure_white_focus_wake_quality_v1` | 13-19-0 | 52.1% | WDead 18.0%、WLowNo 22/27、FExec 37.3%、FLowNo 68/124 |

読み取り:

- 勝敗だけなら focus軽量抑制と+8複合が改善。
- focus軽量抑制は `FLowNo` を 69/136 -> 47/112 に減らし、監査目的には一番きれい。
- +8複合は勝敗を改善したが、`FLowNo` は 68/124 であまり改善していない。
- `wake_safe_work` 系は `WDead` を少し下げるが、`WLowNo` を十分には解決していない。

## Loop 34: All Opponent Confirm

- Report: `2026-06-19_white_ai_focus_wake_quality_all_confirm_loop_34.md`
- 条件: 全相手、8 games/matchup/direction、historyあり。

| Rank | Variant | Overall | vs Black | vs Decoy | vs White |
| ---: | --- | ---: | ---: | ---: | ---: |
| 1 | `pressure_white_baseline` | 45.3% | 31.3% | 56.3% | 62.5% |
| 2 | `pressure_white_low_stone_focus_light_v1` | 39.1% | 31.3% | 50.0% | 43.8% |
| 3 | `pressure_white_focus_wake_quality_v1` | 40.6% | 31.3% | 37.5% | 62.5% |

読み取り:

- 全相手では baseline が首位。
- 黒限定で見えた+8複合の改善は、全相手では再現しなかった。
- `focus_light` は白ミラーとoverallを落とす。標準採用はしない。

## Loop 35: Light Composite Check

- Report: `2026-06-19_white_ai_focus_wake_quality_light_black_screen_loop_35.md`
- 条件: 黒2相手、6 games/matchup/direction、no-history。

| Rank | Variant | vs Black |
| ---: | --- | ---: |
| 1 | `pressure_white_focus_wake_quality_v1` | 54.2% |
| 2 | `pressure_white_baseline` | 41.7% |
| 3 | `pressure_white_focus_wake_quality_light_v1` | 41.7% |

読み取り:

- +4軽量複合はbaseline同等。
- +8複合は黒限定で再び上振れたが、Loop 34 の全相手結果を覆すほどではない。

## Decision

今回は `white` profile への標準採用なし。

採用しない理由:

- +8複合は黒限定で良いが、全相手確認で baseline を下回った。
- focus軽量抑制は `FLowNo` を改善したが、overall と白ミラーを落とした。
- wake単体は黒に弱く、現段階では露出込み評価を足すだけでは足りない。

今回の主成果:

- `focus` / `wake` / `shield` の布石品質を audit できるようになった。
- HBR-004 の開幕配置観点を固定テストに落とした。
- `focus/wake` 候補variantは残したが、標準採用は保留。

## Next Loop Proposal

次は `focus` の係数をさらに触るより、黒相手の「低石focusを選んだ理由」を分解する。

1. `focus_reason_audit` を追加する。
   - 低石focus直前に有効攻撃がなかったのか。
   - 召喚/移動/ウェイク/マスターアタックよりfocusが選ばれた理由は何か。
   - `focus` 後に黒の前衛打点源を放置したか。

2. `wake_safe_work` は単体では打ち切り。
   - `WDead` は少し改善するが、黒勝率に出ていない。
   - 次に触るなら「起こした後に何を攻撃するか」まで見る。

3. シールドは `SMulti` が少ない局面を抽出する。
   - 2回以上攻撃されない対象に盾を張る局面が多いなら、シールド対象品質の別監査に戻る価値がある。

4. 開幕配置は勝率ループから分離して、固定局面を増やす。
   - 後衛を後列に置く最低限のテストは追加済み。
   - 次は「前1後2」「前2後1」「縦列リスク」の3ケースを作る。

次の推奨配分:

- 黒限定 loss audit 8 games/matchup/direction で `focus_reason_audit` を追加。
- その後、候補化は1本だけに絞る。
- 全相手確認で baseline を超えない限り、white profile には採用しない。

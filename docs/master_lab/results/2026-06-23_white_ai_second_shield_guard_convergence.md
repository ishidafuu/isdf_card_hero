# White AI Second Shield Guard Convergence

生成: 2026-06-23

## 目的

白AIが価値の低いユニット2体へ同ターンにシールドを貼り、石を使い切る動きを抑える。

方針:

- 2枚目シールドは基本的に悪手として扱う。
- 例外は「実際に脅威があり、かつ対象が高価値」の場合だけにする。
- 低石になる2枚目はさらに重く見る。

## 実装

- `whiteSecondShieldCommitmentPenalty` を追加。
- 白デフォルトへ `whiteSecondShieldCommitmentPenalty: 180` を追加。
- 白デフォルトの `whiteSecondShieldLowStonePenalty` を `12 -> 120` へ強化。
- 2枚目シールドの例外条件を以下に限定。
  - 対象に実際の予測脅威がある。
  - 対象がLv2以上、次ターンレベルアップ筋、または次ターンリーサル打点を持つ。
- シールド監査に `low_stone_second_shield` / `second_shield_same_turn` サンプル出力を追加。

## シールド監査

参照: `2026-06-23_white_ai_second_shield_guard_audit.md`

同条件の調整中推移:

| 設定 | Shield | 2nd Shield | Low Stone 2nd | 備考 |
| --- | ---: | ---: | ---: | --- |
| 旧寄り | 116 | 14 | 11 | 低石2枚張りが多すぎる |
| 強抑制 | 103 | 5 | 1 | かなり減るが勝率副作用が強い |
| 採用値 | 101 | 6 | 3 | 2枚目を抑えつつ過抑制を避ける中間 |

最終監査:

| Variant | W-L-D | Shield | No Pressure | Converted | 2nd Shield Low | Front Back Retreat |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| pressure_white_baseline | 10-14-0 | 101 | 1.0% | 41.6% | 3/6 | 3.0% |

所感:

- 2枚目シールドは 14件から6件まで減った。
- 低石2枚目は 11件から3件まで減った。
- 残った2枚目は、Lv2アーシュ＆ロロや次ターンレベルアップ筋など、例外寄りのケースが中心。
- `front_back_role_shield_then_retreat` は別問題として3件残る。今回は2枚張りの石枯渇対策を優先した。

## 実戦チェック

参照:

- `2026-06-23_white_ai_second_shield_guard_practical_screen_seed28200.md`
- `2026-06-23_white_ai_second_shield_guard_practical_screen_seed28400_g6.md`
- `2026-06-23_white_ai_second_shield_old_guard_seed28400_g6.md`

| 条件 | Variant | Overall | vs Black | vs Decoy | 所感 |
| --- | --- | ---: | ---: | ---: | --- |
| seed28200 / 3 games | 採用値 baseline | 55.6% | 58.3% | 50.0% | 崩れていない |
| seed28400 / 6 games | 採用値 baseline | 38.9% | 29.2% | 58.3% | hard seed。黒に弱い |
| seed28400 / 6 games | 旧寄り比較 | 41.7% | 33.3% | 58.3% | 旧寄りも黒に弱く、大差ではない |

所感:

- seed28400 は旧寄りでも黒に弱いため、2枚目抑制だけが原因とは言い切れない。
- ただし過度な強抑制は勝率副作用が強かったため不採用。
- 採用値は「2枚張りをかなり抑える」ことと「白基準を壊しすぎない」ことの中間。

## 結論

- 白AIデフォルトに中間の2枚目シールド抑制を採用する。
- 価値の低い2体へ盾を貼る動きはかなり減る。
- 残る2枚目は高価値例外に寄っているが、低石2枚目が完全に0ではないため、実戦でまだ気になる場合は次に `low_stone_second_shield` の例外をさらに削る。
- 次の焦点は、2枚目よりも `front_back_role_shield_then_retreat` と `1 contact removed` の質改善。

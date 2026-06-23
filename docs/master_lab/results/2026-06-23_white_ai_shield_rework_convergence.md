# White AI Shield Rework Convergence

生成: 2026-06-23

## 目的

シールドAIを雑にカード名や配置だけで抑制せず、前回監査で見えた失敗型に絞って改修ループを回した。

主な論点は以下。

- シールドなしで何点入るか。
- マスターアタック込みで何点入るか。
- シールド後も致死が残るなら、守りきれない盾として扱えるか。
- ただし白基準を壊さず、勝率・対黒・対デコイを維持できるか。

## 実装した基盤改修

- `IncomingThreat` に `masterActionDamage`, `maxDamageWithMasterAction`, `lethalWithMasterAction` を追加。
- `buildThreatModel` で相手の `master_attack` が対象前衛モンスターへ入る場合、モンスター/魔法打点とは別に加算して見積もるようにした。
- シールドの緊急判定は、従来の単発モンスター/魔法打点だけでなく、マスターアタック込み致死も見る。
- 「前衛の後衛ロールが、シールド後もマスターアタック込みで突破される」局面では、退避が候補として勝てることをシナリオテスト化した。

この基盤改修は default AI に入れる。理由は、特定カードの抑制ではなく、ユーザー指摘の「マスターアタック込みで守りきれるか」を threat model の欠落として補うものだから。

## 候補として試した調整

### Loop 1: breakthrough screen

レポート:

- `2026-06-23_white_ai_shield_breakthrough_screen_loop_1.md`

候補:

- `pressure_white_baseline`
- `pressure_white_shield_quality_second_guard_v1`
- `pressure_white_shield_breakthrough_guard_v1`
- `pressure_white_shield_breakthrough_guard_plus20_v1`
- `pressure_white_shield_pressure_breakthrough_v1`
- `pressure_white_shield_quality_breakthrough_v1`

結果:

| Variant | Overall | vs Black | 判断 |
| --- | ---: | ---: | --- |
| baseline | 50.0% | 50.0% | 継続基準 |
| quality_second_guard | 50.0% | 50.0% | 継続 |
| breakthrough_guard_plus20 | 62.5% | 62.5% | 上振れ疑いで確認へ |
| pressure_breakthrough | 56.3% | 25.0% | 対黒が弱く見送り |
| breakthrough_guard | 25.0% | 12.5% | 見送り |
| quality_breakthrough | 18.8% | 0.0% | 見送り |

所感:

- breakthrough 系は調整幅による挙動差が大きく、安定していない。
- `+20` だけ一時的に良く見えたが、母数不足の上振れを疑うべき結果。

### Loop 2: breakthrough confirm

レポート:

- `2026-06-23_white_ai_shield_breakthrough_confirm_loop_2.md`

結果:

| Variant | Overall | vs Black | vs Decoy | 判断 |
| --- | ---: | ---: | ---: | --- |
| baseline | 50.0% | 41.7% | 75.0% | 維持 |
| quality_second_guard | 47.9% | 50.0% | 58.3% | 対黒は良いが全体は微減 |
| breakthrough_guard_plus20 | 41.7% | 41.7% | 41.7% | 見送り |

所感:

- `breakthrough_guard_plus20` の上振れは再現しなかった。
- 守りきれない盾を強く罰するだけでは、必要な防御やテンポ確保まで削っている可能性が高い。

### Loop 2b: shield usage audit

レポート:

- `2026-06-23_shield_usage_audit_loop_2.md`

結果:

| Variant | W-L-D | Shield | 1 Contact Removed | Converted | Front Back Retreat | 判断 |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| quality_second_guard | 17-19-0 | 183 | 19.7% | 41.5% | 2.2% | 盾品質は改善 |
| baseline | 12-24-0 | 172 | 22.7% | 48.3% | 4.1% | 基準 |
| breakthrough_guard_plus20 | 12-24-0 | 146 | 23.3% | 39.7% | 4.1% | 改善なし |

所感:

- `quality_second_guard` はシールド監査上は良い。1接触除去と前衛後衛ロール退避の粗さが減っている。
- ただし勝率確認では全体微減、白ミラー低下が出ているため、default へそのまま入れるには弱い。
- `breakthrough_guard_plus20` は勝率も監査も採用理由が薄い。

### Loop 3: conversion final

レポート:

- `2026-06-23_white_ai_shield_conversion_final_loop_3.md`

結果:

| Variant | Overall | vs Black | 判断 |
| --- | ---: | ---: | --- |
| baseline | 50.0% | 43.8% | 維持 |
| quality_second_guard | 31.3% | 37.5% | 見送り |
| shield_threat_conversion | 34.4% | 18.8% | 見送り |

所感:

- 成果化シールド加点だけを足す案は、このseed帯では明確に弱い。
- 盾の「質」を上げる加点は、局所監査では良くても、勝率へ安定して返っていない。

## 収束判断

今回の収束点:

- 採用: マスターアタック込み threat model。
- 採用: 前衛後衛ロールが守りきれない時に退避が勝てるシナリオをテスト固定。
- 見送り: `whiteShieldBreakthroughPenalty` の default 採用。
- 見送り: `whiteShieldThreatConversionBonus` の default 採用。
- 見送り: `whiteShieldNoPressurePenalty` の default 採用。

理由:

- 「マスターアタック込みで守りきれるか」は明確な欠落だったため、基盤改修として妥当。
- 追加のシールド重み調整は、監査指標が一部良くても勝率が安定しなかった。
- 特に breakthrough penalty は、守りきれない盾を減らすよりも、白に必要な防御テンポまで削る副作用が強い。

## 次の提案

このままシールド係数を回し続ける収穫は小さい。次にやるなら、シールド重みではなく行動順・代替行動の比較へ移る。

優先候補:

- シールド直後の同ターン移動監査を強化する。
- `shield -> retreat` ではなく、`retreat only` / `attack first` / `wake first` と比較する decision diff を取る。
- 守りきれない盾の一律ペナルティではなく、「退避先があり、退避後に相手の主要打点圏から外れる」時だけ退避を加点する。
- 前衛に出た後衛ロール全般ではなく、マスターアタック込みでシールド後致死が残る局面に限定する。

結論:

今回のループはここで一旦収束。シールドAIは、基盤の threat model 改修を採用し、追加重みは採用しない。次の改善ループは「シールド対象品質」ではなく「シールドと移動/攻撃/ウェイクアップの行動順比較」に移るのがよい。

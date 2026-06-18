# White AI Tuning Summary

生成: 2026-06-18 JST

## 実施内容

白AI専用の改善ループとして、通常プレイへ直接反映しない実験用チューニング口を追加し、白側だけ `weights` / `actionBias` を差し替えて比較した。

- Loop 1: 28候補 / 448戦。広めのスクリーニング。
- Loop 2: 6候補 / 384戦。Loop 1上位の中母数確認。
- Loop 3: 10候補 / 400戦。`attack_monster` 軸の細分化。
- Loop 4: 4候補 / 320戦。現行白基準と有力候補の最終確認。

合計 1,552戦。全体として failure は 0。Loop 4 の現行白基準に warning が 1件出た以外、進行上の大きな問題は出ていない。

## 主要結果

| Loop | 首位 | Overall | vs Black | vs Decoy | vs White | 所感 |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_master_attack_plus8` | 56.3% | 62.5% | 50.0% | 50.0% | 少母数ではマスターアタック補正が強く見えた。 |
| 2 | `pressure_attack_monster_plus8` | 51.6% | 50.0% | 56.3% | 50.0% | `master_attack+8` は再現せず、盤面処理補正が残った。 |
| 3 | `pressure_white_baseline` | 57.5% | 55.0% | 50.0% | 70.0% | seed帯を変えると現行白基準が首位。補正の揺れが大きい。 |
| 4 | `pressure_attack_monster8_shield4` | 46.3% | 42.5% | 40.0% | 60.0% | 現行白基準比で vs Black +12.5%。ただし45%未満。 |

## 読み

単純な `shield` 強化は本命ではなさそう。白の強みは守って育てることだが、黒相手には守るだけでは間に合わず、相手の前衛・バーサクの種を盤面から減らす判断が必要になる。

`master_attack+8` は Loop 1 だけ強く、Loop 2 で落ちた。白がマスターアタックを増やす方向を恒久採用する根拠は薄い。

一方で `attack_monster+8` 系は複数ループで上位に残った。特に `attack_monster+8 / shield+4` は Loop 4 で現行白基準より vs Black が良い。ただし Loop 3 では現行白基準に負けており、このまま白プロファイルへ固定するには揺れが大きい。

`weights_deny_attack_monster8` は Decoy 相手には高いが、Loop 4 の vs Black は 32.5% まで落ちた。相手レベルアップ拒否の重みを強めるだけでは、黒の速攻には安定しない。

## 現時点の判断

白AIの恒久プロファイルを今すぐ大きく書き換える段階ではない。採用候補は `pressure_attack_monster8_shield4` だが、これは「全局面でモンスター攻撃+8、シールド+4」ではなく、次のような局面評価へ還元した方がよい。

- 黒相手、または相手がバーサク可能な石を持つ時、敵前衛の処理価値を少し上げる。
- 自分の高価値モンスターを守るだけでなく、相手のレベルアップ餌やバーサク打点源を減らす手を評価する。
- シールドは単独で厚くするのではなく、盤面処理とセットで「守った後に次ターン攻め返せる駒」だけ少し上げる。
- 本体打点補正は薄く扱う。`attack_master` / `master_attack` を強くしすぎると再現性が落ちる。

## 次のループ提案

次は「行動バイアスをそのまま固定」ではなく、敗戦ログ分類と状況限定評価を入れるループに進む。

1. `pressure_white_baseline` と `pressure_attack_monster8_shield4` の敗戦ログを各20-30件抽出する。
2. 負けを `押し切られ` / `惜敗` / `シールド後に反撃できない` / `ウェイクアップが遅い` / `敵レベルアップを許した` に分類する。
3. 分類結果から、白AIに入れる局面評価を1-2個だけ追加する。
4. 追加後は `pressure_white_baseline`、`attack_monster+4/shield+2相当`、新評価版の3候補で games-per-matchup 10-15 を回す。

次ループの候補は以下。

- 現行基準: `pressure_white_baseline`
- 実験上位: `pressure_attack_monster8_shield4`
- 弱補正版: `attack_monster+4 / shield+2` 相当
- 状況限定版: 黒相手・バーサク可能時だけ敵モンスター処理を加点
- 反撃限定版: シールド対象が次ターン攻撃/レベルアップへ変換できる時だけ加点

## 参照レポート

- `docs/master_lab/results/2026-06-18_white_ai_tuning_loop_1_screening.md`
- `docs/master_lab/results/2026-06-18_white_ai_tuning_loop_2_confirm.md`
- `docs/master_lab/results/2026-06-18_white_ai_tuning_loop_3_attack_monster_focus.md`
- `docs/master_lab/results/2026-06-18_white_ai_tuning_loop_4_final_confirm.md`
- `docs/master_lab/results/2026-06-18_white_ai_turn_intent_followup.md`

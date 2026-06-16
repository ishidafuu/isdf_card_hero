# Tempo Master PDCA Summary

生成: 2026-06-17

## Goal

テンポマスターを第四マスター候補として、デコイマスター調整時と同等の PDCA ループに載せる。白/黒/デコイと違う立ち位置を保ち、ストレスの強い敵干渉ではなく、自軍テンポ調整で戦えるかを見る。

## Implemented Prototype

- `timing` 候補をテンポマスターとして実行可能化。
- クイックコール: 1コスト。自分の準備中モンスター1体を即登場させる。ただし登場ターンは相手マスターを攻撃不可。
- シフト: 2コスト。自分の登場済みモンスターを自陣内で移動/交換する。候補化は配置評価が改善する場合だけに制限。
- 通常攻撃の対象判定に `masterAttackBlockedUntilTurnEnd` を追加し、クイックコール直後の直接打点だけを抑制。
- 自動対戦、評価補正、改善ループに `tempo_action` / `tempo_confirm` を追加。

## PDCA Sets

### Set 1: Broad Screening Before Tuning

- Report: `2026-06-17_tempo_master_improvement_loop_1.md`
- Scope: 18 loops / 10 games-per-matchup / 900 games
- Best: `tempo_quick_call_plus8`
- Result: overall 40%、vs Black 35%、vs White 45%
- Reading: シフトが50%前後まで出ており、通常手を押しのけて盤面をいじりすぎていた。クイックコール2コストでは黒速攻に間に合わない。

### Set 2: Cost and Candidate Filtering

- Report: `2026-06-17_tempo_master_improvement_loop_2.md`
- Change: クイックコールを1コストへ変更。シフトは配置改善時だけ候補化。
- Scope: 18 loops / 10 games-per-matchup / 900 games
- Best: `tempo_quick_call_plus16`
- Result: overall 65%、vs Black 50%、vs White 80%
- Reading: クイックコール率は約60%、シフト率は約14-18%へ低下。テンポマスターらしい主軸が「展開前倒し」に寄った。

### Set 3: Confirm Top Conditions

- Report: `2026-06-17_tempo_master_confirm_loop_3.md`
- Scope: 6 loops / 30 games-per-matchup / 900 games
- Best: `tempo_confirm_1403_quick_shift8`
- Result: overall 70%、vs Black 55%、vs White 85%、0 failure / 0 warning
- Usage: クイックコール 50.6%、シフト 17.2%、マスターアタック 32.2%
- Reading: 中母数でも上位は崩れず、特に投稿Pro黒8なし #1403 の妨害/テンポ構成と相性が良い。

### Set 4: No-Lostone Confirmation

- Report: `2026-06-17_tempo_master_no_lostone_confirm_loop_4.md`
- Change: 1403のロストーン1枚をリ・シャッフルへ差し替えた `master-lab-tempo-1403-no-lostone` を追加。
- Scope: 5 loops / 30 games-per-matchup / 750 games
- Best: `tempo_no_lostone_1403_quick_shift8`
- Result: overall 68.3%、vs Black 53.3%、vs White 83.3%、0 failure / 0 warning
- Reading: ロストーンを抜いても白勝率はほぼ下がらなかった。白に勝ちすぎる主因はロストーン単体ではなく、1403系の妨害/テンポ構成とクイックコールの噛み合いにある。

## Current Best Shape

- Master: テンポマスター
- Deck axis: 本命は `pressure-normal` 系に戻す。`master-lab-tempo-1403-no-lostone` は勝率上位だが、白に勝ちすぎるため調整候補へ降格。
- AI eval: `pressure-normal` では `quick_call +16` または `margin +12` が安定控え。1403派生の `quick_call +8 / shift +8 / margin +8` は白メタ過多として扱う。
- Play pattern: クイックコールで準備ターンを短縮し、即マスター打点は封じたまま盤面の先手を取る。シフトは過剰移動ではなく、後衛を下げる/前衛を戻す補助。

## Next Loop Proposal

次は「白基準への再調整」として、ロストーンなし前提のまま、白勝率を落とす方向で 10-12 ループ回すのがよい。

優先候補:

1. `pressure-normal + quick_call+16`
2. `pressure-normal + margin+12`
3. `pressure-normal + quick_call+8`
4. 1403派生から黄昏の風/ローテーション密度も落とした小型派生

判定基準:

- vs Black 50%以上
- vs White 55-65%
- failure 0
- warning 2以下
- シフト率 25%以下

この条件を満たすなら、テンポマスターは候補としてかなり有望。白勝率が70%を超える候補は、勝率上位でも本命から外す。

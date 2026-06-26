# White Mirror Overcommit Guard Loop

生成: 2026-06-26

## 目的

白ミラー中盤で、盤面評価だけを見ると良く見えるが、返しの総攻撃で大きく崩れる手順を抑える。
特に seed 68002 の「Lv2デスシープを守らず、ピグミィの追加チップやパワーアップに石/行動を使い切る」手順を対象にした。

## 実装

- 白ミラー限定で、後衛への非撃破・非変換チップ攻撃を減点。
  - 対象が残りHP1になる、または同ターン中に撃破へ変換できる場合は減点しない。
  - 攻撃役が最後の行動を使い切る場合だけ対象。
- 白ミラー限定で、Lv2以上の味方にパワーアップを使って残石1以下になる過剰投資を減点。
  - マスターリーサルまたはレベルアップ変換が見える場合は減点しない。
- 監査局面を直接組んだ回帰テストを追加。
  - 期待手順: 攻撃 -> 攻撃 -> ためる -> ためる -> シールド -> ターン終了。

## 監査

コマンド:

`npx --yes vite-node scripts/white-ai-terminal-plan-audit.ts --seed-start 68000 --max-seeds 6 --scenarios 3 --max-steps 220 --max-turns 80 --top-lines 2 --response-rank-limit 3`

変更前:

- selected response top1: 0/3
- selected average response rank: 3.67
- average response gap to best: 34.3
- max response gap to best: 103

変更後:

- selected response top1: 1/3
- selected average response rank: 2.67
- average response gap to best: 0
- max response gap to best: 0

seed 68002 は、パワーアップや追加チップへ逸れず、デスシープをシールドして返す手順に変わった。

## 小規模ベンチ

比較対象: 直前の `AIに相手打点源の処理評価を追加` 後の同 seed 結果。

コマンド:

`COUNT=5 SEED_START=67000 MAX_STEPS=320 MAX_TURNS=90 node_modules/.bin/vite-node /private/tmp/white_ai_strength_probe.ts`

結果:

- overall: 14-6-0 70.0% -> 15-5-0 75.0%
- white_cpu_vs_black_strong: 4-1-0 80.0% -> 4-1-0 80.0%
- white_player_vs_black_strong: 4-1-0 80.0% -> 4-1-0 80.0%
- white_cpu_vs_white_strong: 1-4-0 20.0% -> 3-2-0 60.0%
- white_player_vs_white_strong: 5-0-0 100.0% -> 4-1-0 80.0%
- elapsed: 175720ms -> 173697ms

## 所感

勝率だけでなく、相手応答後のギャップが大きく縮んだのが収穫。
今回の修正は「盾を強くする」ではなく、「盾に回すべき石と行動を、低変換のチップや過剰バフに使い切らない」方向なので、以前の過剰シールド問題とは別軸で扱える。

次に進めるなら、同じ監査を対黒局面にも広げる。
ただし対黒は今回の小規模ベンチで維持できているため、先に白同士のシード数を増やして再現性を確認するのが堅い。

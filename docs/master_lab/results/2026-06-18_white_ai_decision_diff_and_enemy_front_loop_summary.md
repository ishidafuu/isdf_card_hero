# White AI Decision Diff and Enemy Front Loop Summary

生成: 2026-06-18 JST

## 実施内容

前回の `pressure_white_monster_pressure_v1` が `attack_monster+4` を再現できなかったため、まず意思決定差分を確認し、その後に差分から作った新候補を小母数で一次スクリーニングした。

- 差分診断: `pressure_attack_monster_plus4` vs `pressure_white_baseline` / `pressure_white_monster_pressure_v1`
- 差分診断母数: 黒2種 x 両seat x 12seed = 48 seed/比較
- 観察範囲: turn 8 まで
- 新候補: `pressure_white_enemy_front_attack_v1`
- 新候補確認: `--no-history` / 3 games/matchup/direction / 96戦
- 差分レポート: `docs/master_lab/results/2026-06-18_white_ai_decision_diff_loop_5.md`
- 新候補レポート: `docs/master_lab/results/2026-06-18_white_ai_enemy_front_attack_loop_6.md`

## 差分診断の結果

| Compare | Ref win / compare not | Compare win / ref not | 主な最初の分岐 |
| --- | ---: | ---: | --- |
| `pressure_white_baseline` | 4/48 | 2/48 | ダインで敵前衛を攻撃、ピグミィで敵前衛を攻撃、召喚より敵前衛攻撃 |
| `pressure_white_monster_pressure_v1` | 3/48 | 0/48 | ダインで敵前衛を攻撃、ピグミィで敵前衛を攻撃 |

`attack_monster+4` の差分は、非リーサル本体攻撃ではなく敵前衛への干渉に寄っていた。特に見えたのは「召喚より先に敵前衛を削る」「後衛ロロではなく前衛ダインで敵前衛へ触る」という分岐。

これは、白AIに必要な「このターンの仕事」と「次ターンへの布石」の切り分けでいうと、黒相手には布石より先に敵前衛へ仕事をする局面がある、という読みになる。

## 新候補の結果

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | 判断 |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_white_baseline` | 54.2% | 66.7% | 50.0% | 33.3% | このseed帯では基準が強い。小母数なので過信しない。 |
| 2 | `pressure_white_monster_pressure_v1` | 50.0% | 50.0% | 50.0% | 50.0% | 低母数では悪くないが、前回中母数では弱かった。 |
| 3 | `pressure_white_enemy_front_attack_v1` | 45.8% | 41.7% | 66.7% | 33.3% | 目的の黒耐性が伸びず、デコイへ寄る。 |
| 4 | `pressure_attack_monster_plus4` | 45.8% | 8.3% | 100.0% | 66.7% | このseed帯では大きくブレた。 |

`pressure_white_enemy_front_attack_v1` は、差分診断の読みから作った「白限定・敵前衛攻撃+4」候補だが、一次スクリーニングでは vs Black 41.7%に留まった。敵前衛へ触るだけでは足りず、どの攻撃をいつ使うか、相手前衛が黒の打点源か、召喚を遅らせてもよい局面か、といった条件が必要そう。

## 判断

今回の新候補は採用しない。`attack_monster+4` の改善要因は確かに敵前衛干渉に寄っているが、それを「敵前衛なら常に+4」へ還元すると粗い。

また、同じ `attack_monster+4` でも seed 帯によって vs Black が大きく揺れた。ここまで来ると、単純な係数探索を続けるより、代表seedの差分を見て局面条件を狭める方が収穫が大きい。

## 次ループ提案

次は勝率ループを大きく回す前に、軽量な二段構えにする。

1. `--no-history` で候補を 3-5 games/matchup/direction だけ一次スクリーニングする。
2. 上位候補だけ通常historyありで 8-12 games/matchup/direction に増やす。
3. `attack_monster+4` が勝つseedをさらに抽出し、敵前衛攻撃のうち「高打点前衛で削る」「ピグミィで撃破圏を作る」「召喚より攻撃を優先する」を分けて見る。
4. 次の実装候補は `敵前衛攻撃+4` ではなく、「黒の次ターン打点源になっている敵前衛」「こちらの既存アクティブ駒で処理できる敵前衛」「召喚よりこのターンの撃破圏作りが優先される局面」に絞る。

## 現時点の判断

白AI改善はまだ進められるが、係数を横に増やす段階は一旦終わり。次は局面分類を増やし、条件つきの小さな補正に落とす方がよい。

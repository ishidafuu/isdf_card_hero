# White AI Conditional Front Loop 7-9 Summary

生成: 2026-06-18 JST

## 実施内容

前回の結論を受け、`敵前衛なら常に+4` ではなく、より条件を絞った白AI候補を追加して検証した。

- 候補A: `pressure_white_black_front_threat_v1`
  - 黒の次ターン打点源になりうる敵前衛を削る時だけ加点。
- 候補B: `pressure_white_active_front_work_v1`
  - 既存アクティブ駒で敵前衛を削る時だけ加点。
- 候補C: `pressure_white_pygmy_front_setup_v1`
  - ピグミィが敵前衛を撃破圏へ入れる小打点だけ加点。

運用面では、白AIループに `--opponent` を追加し、黒2種だけの一次スクリーニングを回せるようにした。7候補を全相手で横並びするのは重すぎたため、黒限定で足切りし、上位だけ全相手・historyあり確認へ進めた。

## Loop 7: 黒限定スクリーニング

- 条件: `--no-history` / 4 games/matchup/direction
- 相手: `black_pressure_strong`, `black_pressure_pressure`
- レポート: `docs/master_lab/results/2026-06-18_white_ai_conditional_front_black_screen_loop_7.md`

| Rank | Variant | Overall | vs Black | 判断 |
| ---: | --- | ---: | ---: | --- |
| 1 | `pressure_white_enemy_front_attack_v1` | 56.3% | 56.3% | 黒限定では首位。 |
| 2 | `pressure_white_baseline` | 50.0% | 50.0% | 基準も悪くない。 |
| 3 | `pressure_attack_monster_plus4` | 43.8% | 43.8% | 黒限定では伸びず。 |
| 4 | `pressure_white_active_front_work_v1` | 43.8% | 43.8% | 既存駒条件は伸びず。 |
| 5 | `pressure_white_pygmy_front_setup_v1` | 43.8% | 43.8% | ピグミィ条件も伸びず。 |
| 6 | `pressure_white_black_front_threat_v1` | 37.5% | 37.5% | 打点源条件は狭すぎるか、評価タイミングが悪い。 |
| 7 | `pressure_white_monster_pressure_v1` | 31.3% | 31.3% | 低調。 |

一次スクリーニングでは、条件を絞った新3候補はどれも基準を超えなかった。逆に、前回は粗すぎると判断した `whiteEnemyFrontAttackBonus` が黒限定では首位になった。

## Loop 8: 上位詳細確認

- 条件: historyあり / 6 games/matchup/direction
- 相手: 黒2種、デコイ、白基準
- レポート: `docs/master_lab/results/2026-06-18_white_ai_conditional_front_confirm_loop_8.md`

| Rank | Variant | Overall | vs Black | vs Decoy | vs White | 判断 |
| ---: | --- | ---: | ---: | ---: | ---: | --- |
| 1 | `pressure_attack_monster_plus4` | 62.5% | 50.0% | 91.7% | 58.3% | overall首位。ただしデコイへ勝ちすぎ。 |
| 2 | `pressure_white_baseline` | 52.1% | 54.2% | 58.3% | 41.7% | 黒耐性は最も高く、白基準として自然。 |
| 3 | `pressure_white_enemy_front_attack_v1` | 41.7% | 20.8% | 66.7% | 58.3% | 詳細確認で崩れた。採用なし。 |

詳細確認では、黒限定スクリーニング首位の `pressure_white_enemy_front_attack_v1` が vs Black 20.8%まで落ちた。黒限定小母数で見えた良さは再現せず、敵前衛への広い加点は安定しない。

`pressure_attack_monster_plus4` は overall では強いが、vs Decoy 91.7%が高すぎる。白AIを強くする候補としては有力でも、「白を基準にする」という観点では少し危険。`pressure_white_baseline` は vs Black 54.2%で最も高く、全体の歪みも少ない。

## Loop 9: 差分診断

- 条件: `pressure_attack_monster_plus4` を参照、黒2種、6seed、turn 8まで
- レポート: `docs/master_lab/results/2026-06-18_white_ai_conditional_front_diff_loop_9.md`

| Compare | Ref win / compare not | Compare win / ref not | 読み |
| --- | ---: | ---: | --- |
| `pressure_white_baseline` | 0/24 | 2/24 | このseed帯の黒相手では基準の方が勝つ。 |
| `pressure_white_enemy_front_attack_v1` | 0/24 | 1/24 | 敵前衛加点も参照より黒で勝つケースがあったが、詳細確認では不安定。 |

今回のseed帯では、`attack_monster+4` が黒相手で基準より勝つサンプルが出なかった。つまり、今回のループだけを見ると、黒対策として `attack_monster+4` をさらに局面還元する根拠は弱い。

## 判断

この方向は一旦止めるのがよい。

理由は3つ。

1. 条件を絞った3候補が黒限定スクリーニングで基準を超えなかった。
2. 広い敵前衛加点は小母数では良く見えたが、詳細確認で vs Black 20.8%まで崩れた。
3. `attack_monster+4` は overall が強い一方、今回の黒seedでは基準より明確に良いわけではなく、デコイへ勝ちすぎる副作用が見えた。

## 次ループ提案

次は敵前衛攻撃系を横に増やさず、白AIの基準挙動を磨く方がよい。

1. `pressure_white_baseline` を中心に、黒相手の勝ちseed/負けseedを分類する。
2. 指標は敵前衛攻撃ではなく、`盾の成果化不足` と `布石後の石枯渇` に寄せる。
3. 次候補は以下の2系統に絞る。
   - 成果化しないシールドを抑えるのではなく、守る対象を厳しくする候補。
   - 石が1以下になる布石のうち、召喚・シールド・ウェイクアップのどれが負け筋かを分ける候補。
4. `attack_monster+4` は本採用候補ではなく、比較用の強い参照候補として残す。

## 現時点の所感

「黒に押される白が、敵前衛へ触るべき局面がある」という読み自体は間違っていない。ただし、それを直接 `敵前衛攻撃` の加点へ落とすと不安定になる。

今の白AIで本当に詰めるべきなのは、敵前衛攻撃そのものより、白らしい防御行動をいつ成果へ変換するか。次はシールドと石管理の質を上げるループに戻す方が収穫が大きい。

# White Planner Back Threat Before Retreat Summary

## 目的

`994330-994333` の 8戦 smoke で最後に残った `994332 challenger-as-cpu` の負けを調査した。
前回改善後は `7-1-0` まで上がっていたが、この1敗だけが残っていた。

## 主要発見

`994332 challenger-as-cpu` の turn 9 を forced branch したところ、step 107-112 の全候補が負けだった。
つまり turn 9 に入った時点では、手順を変えても戻らない局面だった。

1つ前の turn 8 を forced branch したところ、step 94 が分岐だった。

| branch | root score | winner | branch score |
| --- | ---: | --- | ---: |
| selected: `move:cpu_front_right->cpu_back_left` | 206.8 | white | -1000000 |
| best: `attack:ピグミィ:スパイクボール->player_back_right` | -8.3 | white_planner | 1000000 |

盤面では `cpu_front_right` のピグミィLv2が前列にいて、敵後列 `player_back_right` にヤンバルLv2がいた。
AIはピグミィを後列に戻してから前列ヤンバルを削っていたが、勝ち筋は退避移動で行動を消費する前に、後列のLv2ヤンバルを削ることだった。

## 実装

`selectWhiteMirrorBackThreatAttackBeforeRetreatDecision` を追加した。

対象条件:

- 白ミラー turn 7-10
- fallback が自軍前列の後衛ロールを空き後列へ戻す `move`
- こちらHPが同等以下で、石が3以上
- 移動で行動回数を消費する
- 同じ移動元から、敵後列のLv2以上・後衛ロールを削れる攻撃候補がある
- fallback との root gap が 260 以下
- 高レベル後衛削りの専用スコアが 180 以上

条件を満たす場合、退避移動より先に敵後列の高レベル脅威を削る。

## 検証結果

### 既知負けseed

`994332 challenger-as-cpu` は以下のように反転した。

- before: white 勝ち / 198 steps / 27 turns
- after: white_planner 勝ち / 150 steps / 15 turns

trace では step 94 が以下になった。

```text
attack:ピグミィ:スパイクボール->ヤンバル
ヤンバルを削れるため攻撃 / 白ミラー中盤: 後列へ下げて行動を使う前に高レベル後衛を削る
```

実ターゲットは `player_back_right` のヤンバルLv2。

### 8戦 smoke

`994330-994333` の 4 seeds x 2 directions。

| stage | W-L-D | WPR | avg HP margin |
| --- | ---: | ---: | ---: |
| 中盤盾hold後 | 6-2-0 | 75.0% | 3.88 |
| 後列枠消費前の後衛移動後 | 7-1-0 | 87.5% | 5.25 |
| 高レベル後衛を退避前に削る改善後 | 8-0-0 | 100.0% | 6.63 |

after summary:

- W-L-D: `8-0-0`
- WPR: `100.0%`
- avg HP margin: `6.63`
- avg steps: `227.3`
- avg turns: `22.1`
- avg decision: `733.9ms`
- max decision: `7592.4ms`

## 所感

今回の改善は、前列に出ている後衛ロールを「置き場所として正しい後列」へ戻す前に、現在の盤面で必要な仕事を済ませる判断。
前回の「最後の後列枠を埋める前に後衛を前へ出す」と同じく、白ミラー中盤の行動順の質を上げる改善になった。

小母数ではあるが、同じ 8戦 smoke で `6-2 -> 7-1 -> 8-0` まで改善できており、体感的にも「変な順序で盤面を明け渡す」負け方が減っている。

## 検証コマンド

- `npm run audit:white-planner-decision-trace -- --seed 994332 --direction challenger-as-cpu`
- `npm run audit:white-planner-forced-branch -- --seed 994332 --direction challenger-as-cpu --only-step 107 --step 108 --step 109 --step 110 --step 111 --step 112 --branch-top 6 --max-replay-steps 220 --stream-progress`
- `npm run audit:white-planner-forced-branch -- --seed 994332 --direction challenger-as-cpu --only-step 94 --step 95 --step 96 --step 97 --step 98 --step 99 --branch-top 6 --max-replay-steps 220 --stream-progress`
- `npm run lab:masters:white-planner-pdca -- --seed-start 994330 --games-per-direction 4 --candidate current --stream-progress`
- `npm test -- --run tests/game/cpuAi.test.ts`
- `npm run build`

## 次ループ提案

この 4seed smoke は一旦詰め切った。
次は同じ形で `seed-start 994334` 以降、または 8-12 seeds へ広げて、新しい負けseedを探すのがよい。
局所8-0をこれ以上同じ範囲で回しても収穫は薄い。

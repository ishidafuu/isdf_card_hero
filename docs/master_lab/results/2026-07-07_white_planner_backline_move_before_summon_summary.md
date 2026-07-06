# White Planner Backline Move Before Summon Summary

## 目的

前回の中盤盾hold後に残っていた `994331 challenger-as-player` の負けを調査した。
終盤の盾や低石判断では戻らず、turn 10 / step 101 の「最後の後列枠を埋める召喚」が分岐になっていた。

## 主要発見

`994331 challenger-as-player` の turn 10 / step 101 では、候補比較で以下の差が出た。

| branch | root score | winner | branch score |
| --- | ---: | --- | ---: |
| selected: `summon:ピグミィ->player_back_left` | 152.8 | white | -1000000 |
| best: `move:player_back_right->player_front_left` | 95.9 | white_planner | 1000000 |
| `end_turn` | 0 | white_planner | 1000000 |

盤面上は、後列の行動可能なポリスピナーを前列へ出すことで、最大レベルのダインを維持しつつ、ボムゾウ処理へ接続できた。
一方で先にピグミィを召喚すると最後の後列枠が埋まり、行動済み・配置・処理順が窮屈になって負け筋へ入っていた。

## 実装

`selectWhiteMirrorBacklineMoveBeforeBackSummonDecision` を追加した。

対象条件:

- 白ミラー turn 9-12
- fallback が後列への召喚
- 召喚前の自軍後列空きが1枠で、召喚後に0枠になる
- 召喚ウェイクで即仕事が生まれる局面ではない
- こちらHPが同等以上、相手石3以下
- 行動可能な後列モンスターを前列へ出す候補がある
- 移動先が最大レベル前衛主力を崩さない
- fallback との root gap が 140 以下

条件を満たす場合、最後の後列枠を埋める前に後衛を前列へ出す。

## 検証結果

### 既知負けseed

`994331 challenger-as-player` は以下のように反転した。

- before: `summon:ピグミィ->player_back_left` から white 勝ち
- after: `move:player_back_right->player_front_left` から white_planner 勝ち

trace では step 101 が以下になった。

```text
move:player_back_right->player_front_left
移動後に強い攻撃筋を作れるため移動 / 白ミラー中盤: 最後の後列枠を埋める前に行動可能な後衛を前へ出して盤面を広げる
```

### 8戦 smoke

`994330-994333` の 4 seeds x 2 directions。

| before | after |
| ---: | ---: |
| 6-2-0 / WPR 75.0% | 7-1-0 / WPR 87.5% |

after summary:

- W-L-D: `7-1-0`
- WPR: `87.5%`
- avg HP margin: `5.25`
- avg steps: `233.3`
- avg turns: `23.6`
- avg decision: `720.9ms`
- max decision: `7510.1ms`

残負けは `994332 challenger-as-cpu` のみ。

## 所感

今回の改善は、勝率を広く押し上げる係数調整ではなく、白ミラー中盤の「召喚で後列を埋める前に、行動可能な後衛を前へ出す」という手順改善。
人間視点で違和感が出やすい配置順ミスを1カテゴリ減らせた。

体感強度としては、全体が一気に別物になったというより、白ミラーで負けに直結する中盤事故が1つ減った段階。
小母数指標では 8戦 smoke が `75% -> 87.5%` に改善し、既知負けseedが1つ勝ちに反転したため、採用価値は高い。

## 検証コマンド

- `npm run audit:white-planner-forced-branch -- --seed 994331 --direction challenger-as-player --only-step 101 --step 104 --step 105 --branch-top 5 --max-replay-steps 220 --stream-progress`
- `npm run audit:white-planner-decision-trace -- --seed 994331 --direction challenger-as-player`
- `npm run lab:masters:white-planner-pdca -- --seed-start 994330 --games-per-direction 4 --candidate current --stream-progress`
- `npm test -- --run tests/game/cpuAi.test.ts`
- `npm run build`

## 次ループ提案

1. 残負け `994332 challenger-as-cpu` の turn 9-12 を branch replay する。
2. 特に、最大レベル前衛の扱い、敵前衛処理前後の召喚、盾後の攻撃接続を見る。
3. 追加改善後、同じ 4 seeds x 2 directions で 8-0 になるか確認する。

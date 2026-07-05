# White Planner Backline Reserve Summary

生成: 2026-07-05

## 目的

白白の負け seed `994308` で、CPU が前衛フォーカスを優先し、後列に次ターン以降の勝ち筋になる育成種を置けていなかった局面を改善する。

## 観測

- 対象局面: seed `994308`, `challenger-as-player`, step 60。
- 修正前の選択: `focus:デスシープ`。
- forced branch では `focus:デスシープ` が負け筋で、`summon:真勇者ダイン->player_back_right` が 220 replay steps 時点で HP `P8/C2` まで優勢化した。
- rollout なしの terminal audit でも、修正前は `focus:デスシープ` が planner score 284.5、`summon:真勇者ダイン->player_back_right` が 263.1 で、短期盤面評価がフォーカス側に寄っていた。

## 対応

`src/game/cpuAi.ts` に `backlineReserveSummonOverFocus` を追加した。

発動条件はかなり狭くした。

- 白ミラー。
- 6-8ターン目。
- 相手石が1以下、こちら石が3以上。
- fallback が自前衛へのフォーカス。
- candidate が空き後列への召喚。
- 召喚対象が HP5 以上、最大Lv2以上のモンスター。
- こちら前衛が2体埋まっている。

この条件では、目先のフォーカスよりも、前衛が仕事をしている間に後列へ次の打点源を置く価値を planner root で加点する。

## 結果

### 直接対象

| case | 修正前 | 修正後 |
| --- | --- | --- |
| `994308 challenger-as-player` | loss, HP margin -5 | win, HP margin +8 |

### 副作用ガード

| case | result | HP margin | max decision ms |
| --- | --- | ---: | ---: |
| `994306 challenger-as-player` | win | +5 | 80821.0 |
| `994309 challenger-as-cpu` | win | +6 | 39837.8 |

### 8戦マトリクス

`master-lab-white-1377-death-sheep3`, seeds `994306-994309`, both directions。

| W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 8-0-0 | 100% | +5.88 | 258.9 | 24.8 | 914.1 | 75193.9 | 0 |

## 所感

強さ面では採用候補。今回の改善は「係数で盾や攻撃を抑える」方向ではなく、ターンプラン探索が見つけた将来の勝ち筋を root 選択へ返す形になっており、目指している AI 方針に近い。

ただし最大思考時間は 75-80 秒級が出ている。実戦では許容できる可能性があるが、今後の改善では強さを維持したまま長考局面を絞る必要がある。

## 次の確認候補

- 白白の seed 範囲を広げた中母数確認。
- max decision が 60 秒を超えた局面の抽出。
- root 選択の加点を増やすのではなく、forced branch で明確に良い候補だけを浅く拾う枝刈り。

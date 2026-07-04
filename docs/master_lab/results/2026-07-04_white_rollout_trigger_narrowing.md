# White Rollout Trigger Narrowing

生成: 2026-07-04

## 目的

`white_rollout` は既知負け seed を拾えるが、60手ロールアウトが発火すると実プレイ向けには重い。次フェーズでは、勝ち筋を落とさない範囲で発火条件を狭める。

## 採用

ロールアウト発火を次の局面に限定した。

- fallback の即時評価が `move`
- terminal planner の候補が `summon`

これは 994306 の既知負け局面で見えていた「前衛を後列に逃がす即時評価」と「後列へ控えを置いて次ターンの返しを受けるプラン」の競合に絞るための条件。

`white_rollout` の候補数、60手、重み、採用差分は維持した。candidate limit を 1 にする案は、単発監査では正しい候補を拾える場面があったが、実プロファイルでは負けに倒れたため採用しない。

## 検証

### 994306 / challenger-as-player

通常 `white_planner` は負け、60手 rollout 候補は勝ちを維持した。

| candidate | result | steps | turns | HP | avg decision ms | max decision ms |
| --- | --- | ---: | ---: | --- | ---: | ---: |
| current | white | 175 | 22 | P0/C6 | 468.7 | 2858.5 |
| rollout3_60_w015_gap200 | white_planner | 281 | 27 | P5/C0 | 1547.8 | 77051.1 |

実プロファイル `white_rollout` でも同条件は勝利。

- winner: `white_rollout/player`
- 281 steps / 27 turns
- issues: 0
- wall time: 276.41 sec

### 994306 / challenger-as-cpu

反対方向は current と 60手 rollout 候補が同じ勝ち筋になった。

| candidate | result | steps | turns | HP | avg decision ms | max decision ms |
| --- | --- | ---: | ---: | --- | ---: | ---: |
| current | white_planner | 175 | 22 | P0/C6 | 574.8 | 4654.5 |
| rollout3_60_w015_gap200 | white_planner | 175 | 22 | P0/C6 | 569.6 | 4713.7 |

この seed では、重い探索は `challenger-as-player` 側の特定分岐に集中している。

## 不採用

後列レーン召喚ボーナスは採用しない。

理由は、監査局面ではボムゾウ後列召喚を選ばせやすくできた一方、実プロファイル単発で 994306 を落としたため。今回は局面特徴を直接加点へ還元せず、フルロールアウトの発火範囲を狭めるだけに留める。

## 次の見るべき点

今回の条件でも最大 decision time はまだ重い可能性がある。次は係数追加ではなく、ロールアウトが発火した局面について次を記録する。

- fallback と planner の手種別
- root score gap
- planner margin
- rollout winner / score gap
- 実際に採用された候補が次ターンの盤面制圧へつながったか

ここから「高思考プロファイルとして許容する局面」と「通常 `white_planner` へ戻す局面」を分ける。

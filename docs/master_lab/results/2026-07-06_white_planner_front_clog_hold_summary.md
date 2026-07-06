# White Planner Front Clog Hold Summary

生成: 2026-07-06

## 現状指標

- 直近の広め確認では、白plannerは白baseline相手に `22-10 / 68.75%`。
- 直近採用帯域 `994326-994333` では `12-4 / 75.0%`、avg HP margin `+3.81`。
- 今回の主対象は、その中で残っていた負け `994333 challenger-as-player`。

## 見つかった問題

`994333 challenger-as-player` の終盤では、turn 14 step 180 で以下の局面が分岐点だった。

- 自分: HP6、石6、前列に Lv2 真勇者ダイン、後列に Lv2 ピグミィ。
- 相手: HP6、石3、前列に HP1 の Lv2 デスシープ、後列にポリスピナーと真勇者ダイン。
- 既存AIは `デスシープを前列召喚 -> ウェイクアップ -> 敵デスシープ撃破` に進み、石を使い切ったうえで相手後列の真勇者ダインを前に出してしまった。
- 分岐リプレイでは、同じ局面で `end_turn` を選ぶと白planner勝ち、既存の前列召喚継続は白baseline勝ちだった。

これは「倒せる敵を倒す」よりも「低HP前衛を蓋として残し、相手後列エースを前に出させない」方が強い局面だった。

## 実装

`src/game/cpuAi.ts` に白ミラー限定の `front clog hold over summon` を追加した。

- 対象は turn 12-17 の白ミラーのみ。
- fallback が前列への召喚で、召喚後ウェイクアップにより即時仕事が作れる場合だけ見る。
- 相手前列が1体で HP2 以下、かつ相手後列に最大Lv3以上の前衛エースが控えている場合に限定。
- 評価点で直接抑えるのではなく、`end_turn` と fallback 召喚だけをrollout比較する。
- rolloutで実勝ちが見えた候補は late pressure 系に限って強く優先する。

## 検証

### 局面単体

- `994333 challenger-as-player step180`
- 変更前: fallback `summon:デスシープ->player_front_right`
- 変更後: `end_turn`
- terminal plan inspect:
  - `end_turn`: rollout `1000000`, winner `player`
  - fallback summon: rollout `-1000000`, winner `cpu`

### フルtrace

- 変更前 `994333 challenger-as-player`: white baseline 勝ち、206 steps / 17 turns、max decision `4958ms`。
- 変更後 `994333 challenger-as-player`: white_planner 勝ち、234 steps / 24 turns、max decision `10829ms`。
- 対象seedの2席スモーク:
  - `challenger-as-cpu`: white_planner 勝ち、199 steps / 16 turns、HP `P0/C8`
  - `challenger-as-player`: white_planner 勝ち、234 steps / 24 turns、HP `P4/C0`
  - 集計 `2-0-0 / 100%`, avg decision `800.1ms`, max decision `10670.3ms`

## 採用判断

採用寄り。勝敗が1seedで明確に反転しており、判断内容も白ミラーの実戦理論に合っている。

一方で、広いマトリクスは重くなりやすい。`994330 challenger-as-cpu` の単体traceは max decision `4115ms` で上限は問題なかったが、131 decisions / sum `83909ms` と総時間は重い。次回は 4戦スモークから始め、速度を見て `994326-994333` へ広げる。

## 次ループ提案

- `front clog hold` の発火回数を監査する。
- `994326-994333` は一気に16戦ではなく、`--stream-progress` 付きで 2-4戦ずつ分割する。
- 勝率だけでなく `avg decision ms`, `max decision ms`, `sum decision ms` を採用条件に含める。
- 目安は「1手最大10-15秒程度、1試合1-2分台」。これを超えるなら発火条件をさらに狭める。

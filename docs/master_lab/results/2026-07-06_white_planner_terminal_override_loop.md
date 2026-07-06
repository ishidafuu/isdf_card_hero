# White Planner Terminal Override Loop

生成: 2026-07-06

## Purpose

直近レポートで次候補にした `rollout-confirmed override` を再確認した。
実際には `994324` の怪しい手は rollout ではなく、通常の terminal plan override だった。
そのため `white-rollout-trigger-audit` を拡張し、`--inspect-turn-plan` 指定時に `ターンプラン探索` 採用も検査対象へ含めるようにした。

## Script Update

- `--inspect-turn-plan` を追加。
- terminal plan 採用手も `inspectCpuTerminalPlan` で再検査できる。
- candidate features に攻撃後の target / attacker 状態を追加。
- `rolloutConfirmedOverride` と `rootGapOverDefaultGate` をレポートに出す。

## Audits

| seed | direction | result | inspected | selected override | finding |
| ---: | --- | --- | ---: | ---: | --- |
| 994324 | challenger-as-player | loss 0-2 | 56 | 2 | step98 の attack override が怪しいが、止めると 0-10 へ悪化 |
| 994325 | challenger-as-cpu | loss 0-10 | 44 | 0 | planner固有overrideなし。別要因の負け |
| 994333 | challenger-as-player | loss 0-2 | 60 | 2 | root gapありoverrideは自爆撃破など妥当寄り |

## Rejected Implementation

試した安全弁:

- fallback と selected が同じ敵モンスター状態を作る場合、複数回行動ユニットを消費する selected attack を拒否。

結果:

- `994324 challenger-as-player` の step98 は `ポリスピナー attack` から `ボムゾウ storm_bomb` に戻った。
- ただし通しでは元の 0-2 負けから 0-10 負けへ悪化。
- 見た目上はポリスピナー温存が自然でも、後続展開では planner の消費判断が必要だった可能性が高い。

判断:

- AI本体変更は不採用。
- terminal override を広く締める修正は、現状では勝ち筋を消すリスクが高い。

## Next Loop

次は terminal override gate ではなく、負けseedのうち planner と white の decision diff が少ないものを除外し、差分がある負けseedだけを対象にする。

候補:

1. `decision diff > 0` かつ負けたseedを抽出する軽量サマリを作る。
2. その中で「採用手を止めると悪化」した局面は除外ラベルを付ける。
3. 残った差分について、直接gateを触る前に `同一局面候補のafter-state比較` と `次ターン開始時の盤面価値` を出す。
4. 実装候補は、単発手の禁止ではなく「次ターン開始時に実際に変換されたか」を評価へ戻す。

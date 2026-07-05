# White Planner Closeout Rollout Summary

生成: 2026-07-06
deck: `master-lab-white-1377-death-sheep3`
対象: 白対白、終盤の詰めろ維持判断

## 結論

- `994317 / challenger-as-cpu` の負け筋を、終盤 closeout 用の短いロールアウトで修正した。
- 広い行動抑制は退行したため不採用。今回採用候補にしたのは、直接減点ではなく「限定局面で `end_turn` をロールアウト比較し、勝ちが確認できたときだけ採用する」方式。
- 固定退行セットでは CPU側 `4-0`、player側 `3-1`。元の `6-2` から `7-1` 相当へ改善し、既存勝ち seed の退行は見えなかった。

## 実装方針

closeout ロールアウトは以下を満たす場合だけ発火する。

- 白対白である。
- turn 12 以降である。
- 相手マスターHPが2以下で、自分マスターHPが相手HPを上回っている。
- 次自ターンの直接マスター打点で相手を倒せる見込みがある。
- fallback が敵モンスターへの攻撃である。
- その攻撃は相手マスターHPを削らず、敵モンスターを倒さず、HPも減らさず、気合だけを剥がしている。
- 相手の次ターン最大打点が自分の現在HPに届いていない。

ロールアウト対象は `end_turn` と fallback の比較に絞った。広い候補プールを回すと白ミラーが重くなりすぎるため、ワープなどの高root候補はこの closeout 比較には含めない。

## 対象 seed

`2026-07-06_white_planner_trace_994317_cpu_after_closeout_rollout_narrow.md`

| step | before | selected | result |
| ---: | --- | --- | --- |
| 189 | 相手HP4 | `attack:ヤンバル:wild_claw->player master` | 相手HP3 |
| 190 | 相手HP3 | `attack:デスシープ:attack->player master` | 相手HP2 |
| 191 | 相手HP2 | `end_turn` | rollout `1000000`、次ターン勝ち |

修正前は step 191 で `attack:ピグミィ:attack->真勇者ダイン`、続いて `ワープ` を選び、最終的に負けていた。修正後は `end_turn` を選び、turn 18 に顔打点で勝ち切る。

## 退行確認

### CPU側

`2026-07-06_white_planner_closeout_rollout_narrow_cpu_probe_994314_994317.md`

| seed | result | HP |
| ---: | --- | --- |
| 994314 | white_planner | P0/C2 |
| 994315 | white_planner | P0/C2 |
| 994316 | white_planner | P0/C4 |
| 994317 | white_planner | P0/C6 |

合計: `4-0-0 / WPR 100%`

### Player側

`2026-07-06_white_planner_closeout_rollout_narrow_player_probe_994314_994317.md`

| seed | result | HP |
| ---: | --- | --- |
| 994314 | white_planner | P7/C0 |
| 994315 | white_planner | P9/C0 |
| 994316 | white | P0/C1 |
| 994317 | white_planner | P6/C0 |

合計: `3-1-0 / WPR 75%`

元の同一セットは CPU側 `3-1`、player側 `3-1` だったため、改善は `994317 / challenger-as-cpu` の1本。player側は同等。

## 性能

- CPU側4本: avg decision `909.3ms`、max decision `56216.8ms`
- player側4本: avg decision `1223.9ms`、max decision `87828.5ms`

max decision はまだ大きいが、元の current probe でも max `87133.9ms` が出ていたため、今回の closeout 実装だけで悪化したとは見ていない。次に詰めるなら、この closeout ではなく既存の重い白ミラー seed の探索枝削減を別テーマで扱う。

## 採用判断

採用候補として妥当。理由は以下。

- 実戦的に明確なミスだった「詰めろを作った後の余計な行動」を修正できている。
- 係数で広く抑制しておらず、ロールアウト勝ち確認がある場合だけ `end_turn` を昇格している。
- 直前に退行した `994314/994315` を維持できている。
- 対象外の player側では結果が元と同等。

次に大きく進めるなら、白ミラーの max decision が高い seed を別途抽出し、closeout とは分けて探索枝削減を行う。

# White Planner Summon Slot And Next Candidate Audit Summary

生成: 2026-07-04

## 目的

前フェーズで残課題にした「召喚先レーン同点」を、実装候補にする前に監査した。
あわせて、召喚slotに問題がない場合に備えて、次の広域forced branch候補も小さく探した。

## 追加した監査

`audit:white-planner-summon-slot` を追加した。

見るもの:

- white_planner が実際に選んだ `summon`。
- 同じ手札カードを別スロットへ召喚できる候補。
- 各候補を同一局面から強制し、一定手数replayした最終スコア。

意図:

- 召喚全体を悪者にしない。
- `summon_different_slot` だけを切り出す。
- root score で同点でも、replayで明確に悪いslotがあるかを見る。

## 召喚slot監査

- 根拠: `2026-07-04_white_planner_summon_slot_audit_seeds994300_994303.md`
- 対象: `994300-994303 / both directions / turn 6-12`
- captured cases: 14
- promising: 0

結論:

- selected summon の別slot候補を再生比較したが、選択slotより明確に良い別slotは見つからなかった。
- `994300 / step 91` も、現在は `summon:ヤンバル->cpu_back_left` を選べており、右後列召喚より良い。
- 召喚slot choice へ新しい補正を入れる根拠は弱い。

## 広域forced branch一次scan

- 根拠: `2026-07-04_white_planner_forced_branch_scan_next_candidates_994304_994307_cpu.md`
- 対象: `994304-994307 / challenger-as-cpu / turn 7-12`
- captured states: 8
- promising: 0

結論:

- 直近の保護seed周辺では、上位候補の強制分岐でも勝敗反転級または閾値以上の改善候補は見つからなかった。
- `focus` や `attack` が一見低rootに見えても、replayでは選択手がbestと一致するケースが多い。
- この範囲でさらに単発係数を足すのは危険。

## 判断

今回はAI本体の追加変更なし。

理由:

- 召喚slot監査で14件すべてpromisingなし。
- 広域forced branchでも8局面すべてpromisingなし。
- 現行AIは少なくとも `994300-994307` 周辺の白ミラー中盤では、上位候補比較がかなり収束している。
- ここで係数を追加すると、根拠のない過学習になる。

## 次フェーズ

次は局面係数ではなく、探索設定比較へ戻す。

候補:

1. `current`
2. `response2_width2`
3. `response2_width3`
4. `terminal6_response2_width2`
5. `rollout3_60_w015_gap200`

進め方:

- seeds `994306-994309` か、未使用seed帯で `games-per-direction 1-2` の小母数比較。
- まずは勝率、平均HP差、平均思考時間、最大思考時間を見る。
- current を明確に超える候補がなければ、局所係数ではなく「負けseedの終盤だけ」を監査する。
- current を超える候補があれば、同じ候補を `994300-994305` の保護seedで再確認してから採用候補化する。

現時点の所感:

- 直近の改善で単発の分岐ミスはかなり減っている。
- 次に強くするなら、個別係数より「候補探索の設定」または「終盤負けseedだけの深い相手応答読み」を詰める方が良い。

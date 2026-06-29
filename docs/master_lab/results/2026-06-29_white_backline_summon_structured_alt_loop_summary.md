# White Backline Summon Structured Alternative Loop Summary

生成: 2026-06-29

## 目的

bad 後列召喚の代替手が召喚同士に寄っているかを、カード名・召喚先・前列ブロッカーまで見て確認した。

## 追加した監査

- CPU候補traceの召喚候補に以下を追加
  - 召喚カードID/カード名
  - 召喚先スロット、行、レーン
  - 同レーン前列に自軍ユニットがいるか
  - 前列ブロッカーのカード名、HP、レベル、状態
- trace構成を `全体上位8件 + 召喚上位4件` に変更
  - bad召喚の局面で、低順位の召喚候補も拾えるようにした。
- 監査レポートに以下を追加
  - `Bad top summon alt`
  - `Bad top summon same card`
  - `Bad top summon backline pattern`
  - サンプル内の代替召喚カード名と前列ブロッカー

## 結果

同一seed `136400`、`current_white_baseline`、`black_1375_pressure` / `white_current_mirror`、各1 games/matchup/direction。

| W-L-D | Blocked | No Pattern | No Work | Bad | Close Non-Summon | Bad Top Summon | Same Card | Reach Summon |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2-2-0 | 14 | 3 | 7 | 3 | 0 | 1 | 1 | 0 |

## 読み取り

- bad 3件中、近い非召喚代替は0件。
- bad 3件中、非選択の召喚代替が上位に出たのは1件だけ。
- その1件は `デスシープ -> 反対側後列` で、同じく前列にブロックされた後列射程なし召喚だった。
- 残り2件は、少なくとも上位trace内では有力な代替召喚がない。

つまり、今回のseedでは「手札内の後列仕事カードへ切り替えればよい」という単純な構図ではない。悪い召喚を消すだけだと、前回の hard skip 試案と同じく別の悪い召喚へ流れる可能性が高い。

## 次ループ提案

次は bad 召喚局面の手札構成を監査する。

- 手札に後列仕事カードがあるのに選べていないのか
- そもそも手札が前衛カードだけなのか
- 手札枚数が多く、出さないと次ドローや手札上限で損する局面なのか
- 出すなら、前列が空く見込みがある「予約召喚」なのか
- 出さない場合の `end_turn` が低すぎる理由は何か

実装候補はまだ入れない。次の判断材料として、bad summon sample に手札カード一覧と、手札内の後列仕事カード枚数を追加するのがよい。

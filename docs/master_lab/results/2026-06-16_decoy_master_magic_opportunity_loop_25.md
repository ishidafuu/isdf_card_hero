# Master Lab Magic Opportunity: decoy

生成: 2026-06-16T05:38:54.331Z
デッキ: `black-pressure`（ブラック検証）
試行: 5 games/matchup（5 matchups）
閾値: 実選択より +25 点以上

## Summary

- 25戦。failure 0、warning 0。
- opportunity 総数は 930 件。これは「候補マジックを仮想手札に1枚足したら、実選択より評価が閾値以上伸びた」場面数。
- 主候補: `サンダー` (414件, lethal 27, non-lethal avg +262.9) / `二重の盾` (395件, lethal 0, non-lethal avg +94.5) / `ロストーン` (39件, lethal 0, non-lethal avg +120.2) / `ローテーション` (32件, lethal 0, non-lethal avg +340.5)
- 勝ち切り候補: なし
- 1枚差し候補: なし

## Card Ranking

| Rank | Card | Role | Count | Lethal | Avg Delta | Non-Lethal Avg | Best Delta | Recommendation | Reading |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | `サンダー`<br>thunder | damage | 414 | 27 | 116125.2 | 262.9 | 2000360.7 | main_candidate | 25戦中387件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 2 | `二重の盾`<br>card_030 | shield | 395 | 0 | 94.5 | 94.5 | 304.7 | main_candidate | 25戦中395件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 3 | `ロストーン`<br>card_113 | interference | 39 | 0 | 120.2 | 120.2 | 318 | main_candidate | 25戦中39件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 4 | `ローテーション`<br>card_093 | tempo | 32 | 0 | 340.5 | 340.5 | 1097.3 | main_candidate | 25戦中32件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 5 | `黄昏の風`<br>card_064 | interference | 30 | 0 | 260.5 | 260.5 | 1289.8 | main_candidate | 25戦中30件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 6 | `ウェイクアップ`<br>card_117 | tempo | 20 | 0 | 99.3 | 99.3 | 238.1 | main_candidate | 25戦中20件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 7 | `ドロー５`<br>card_120 | draw | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 8 | `再生`<br>card_130 | recovery | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 9 | `悪魔のダンス`<br>card_029 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 10 | `鋼の盾`<br>card_088 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |

## Matchups

| Matchup | Result | Opportunities | Top Cards | Issues |
| --- | --- | ---: | --- | --- |
| decoy_vs_white | P 4 / C 1 / U 0 | 166 | サンダー 58<br>二重の盾 50<br>ロストーン 36 | 0F/0W |
| white_vs_decoy | P 3 / C 2 / U 0 | 245 | サンダー 117<br>二重の盾 106<br>ローテーション 10 | 0F/0W |
| decoy_vs_black | P 3 / C 2 / U 0 | 139 | 二重の盾 67<br>サンダー 59<br>ローテーション 6 | 0F/0W |
| black_vs_decoy | P 1 / C 4 / U 0 | 94 | 二重の盾 47<br>サンダー 43<br>ウェイクアップ 2 | 0F/0W |
| decoy_mirror | P 4 / C 1 / U 0 | 286 | サンダー 137<br>二重の盾 125<br>ウェイクアップ 14 | 0F/0W |

## Top Opportunity Records

| Rank | Seed | Turn | Player | Card | Lethal | Delta | Target | Selected | Reason |
| ---: | ---: | ---: | --- | --- | --- | ---: | --- | --- | --- |
| 1 | 1202 | 21 | player | `サンダー` | yes | 2000360.7 | master:cpu | master_lab:scapegoat->monster:player_front_left | サンダーで相手マスターを倒せるため使用 |
| 2 | 1002 | 10 | player | `サンダー` | yes | 2000209.2 | master:cpu | master_lab:scapegoat->monster:player_front_left | サンダーで相手マスターを倒せるため使用 |
| 3 | 1102 | 12 | cpu | `サンダー` | yes | 1999278.7 | master:player | master_lab:scapegoat->monster:cpu_front_left | サンダーで相手マスターを倒せるため使用 |
| 4 | 1102 | 11 | cpu | `サンダー` | yes | 1999136.9 | master:player | master_lab:scapegoat->monster:cpu_front_left | サンダーで相手マスターを倒せるため使用 |
| 5 | 1102 | 11 | cpu | `サンダー` | yes | 1999124.9 | master:player | master_lab:scapegoat->monster:cpu_front_left | サンダーで相手マスターを倒せるため使用 |
| 6 | 1000 | 17 | player | `サンダー` | yes | 1998895.8 | master:cpu | attack:player_back_left:双華剣_陽->monster:cpu_front_right | サンダーで相手マスターを倒せるため使用 |
| 7 | 1000 | 17 | player | `サンダー` | yes | 1998876 | master:cpu | attack:player_front_right:attack->monster:cpu_front_right | サンダーで相手マスターを倒せるため使用 |
| 8 | 1000 | 17 | player | `サンダー` | yes | 1998867 | master:cpu | master_lab:provoke->monster:cpu_front_right | サンダーで相手マスターを倒せるため使用 |
| 9 | 1000 | 17 | player | `サンダー` | yes | 1998849 | master:cpu | master_lab:provoke->monster:cpu_front_right | サンダーで相手マスターを倒せるため使用 |
| 10 | 1000 | 16 | player | `サンダー` | yes | 1998834.9 | master:cpu | attack:player_back_left:双華剣_陽->monster:cpu_front_right | サンダーで相手マスターを倒せるため使用 |
| 11 | 1000 | 22 | player | `サンダー` | yes | 1998832.4 | master:cpu | master_lab:provoke->monster:cpu_back_left | サンダーで相手マスターを倒せるため使用 |
| 12 | 1000 | 23 | player | `サンダー` | yes | 1998828.2 | master:cpu | master_lab:provoke->monster:cpu_back_left | サンダーで相手マスターを倒せるため使用 |
| 13 | 1000 | 16 | player | `サンダー` | yes | 1998796.6 | master:cpu | end_turn | サンダーで相手マスターを倒せるため使用 |
| 14 | 1400 | 20 | player | `サンダー` | yes | 1998780.6 | master:cpu | attack:player_back_left:癒しの光->master:player | サンダーで相手マスターを倒せるため使用 |
| 15 | 1000 | 21 | player | `サンダー` | yes | 1998717.9 | master:cpu | master_lab:provoke->monster:cpu_back_left | サンダーで相手マスターを倒せるため使用 |
| 16 | 1302 | 9 | cpu | `サンダー` | yes | 1998701.3 | master:player | magic:cpu_card_093_1->master:cpu | サンダーで相手マスターを倒せるため使用 |
| 17 | 1004 | 14 | player | `サンダー` | yes | 1998679.1 | master:cpu | attack:player_front_right:attack->monster:cpu_front_right | サンダーで相手マスターを倒せるため使用 |
| 18 | 1000 | 19 | player | `サンダー` | yes | 1998669.4 | master:cpu | attack:player_back_left:双華剣_陽->monster:cpu_front_right | サンダーで相手マスターを倒せるため使用 |
| 19 | 1000 | 19 | player | `サンダー` | yes | 1998395.1 | master:cpu | master:master_attack->monster:cpu_front_right | サンダーで相手マスターを倒せるため使用 |
| 20 | 1400 | 21 | player | `サンダー` | yes | 1998390.2 | master:cpu | attack:player_back_left:癒しの光->master:player | サンダーで相手マスターを倒せるため使用 |

## Next Loop Proposal

- 提案: opportunity 上位カードだけをデッキへ実装して、小母数勝率で副作用を見る。
- 次回候補: `サンダー` 414件 lethal 27 non-lethal avg +262.9 / `二重の盾` 395件 lethal 0 non-lethal avg +94.5 / `ロストーン` 39件 lethal 0 non-lethal avg +120.2
- 目安: 3-5デッキ案、games-per-matchup 10-20。warning と敵スケープゴート率を同時に見る。
- 分岐: main_candidate が勝率を落とす場合、カード自体ではなくAIがその場面を過大評価している可能性を疑う。

## Reading

- count が高いカードは、複数seedで実選択より良い可能性が出たカード。
- lethal は、そのマジックで相手マスターを倒せる勝ち切り機会。汎用性とは分けて読む。
- best delta だけが高いカードは、汎用枠ではなく1枚差しの奇襲/回答札として見る。
- このレポートは勝率検証ではなく、次にデッキへ入れて試す候補を絞るための前段。

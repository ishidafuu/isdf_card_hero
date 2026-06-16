# Master Lab Magic Opportunity: decoy

生成: 2026-06-16T06:35:45.979Z
デッキ: `black-pressure`（ブラック検証）
候補セット: `implemented`（54 cards）
試行: 5 games/matchup（5 matchups）
閾値: 実選択より +25 点以上

## Summary

- 25戦。failure 0、warning 0。
- opportunity 総数は 4772 件。これは「候補マジックを仮想手札に1枚足したら、実選択より評価が閾値以上伸びた」場面数。
- 主候補: `リ・シャッフル` (564件, lethal 0, non-lethal avg +92.8) / `パワーアップ` (554件, lethal 0, non-lethal avg +269.4) / `バーサクパワー` (484件, lethal 0, non-lethal avg +282.8) / `二重の盾` (395件, lethal 0, non-lethal avg +94.5)
- 勝ち切り候補: `サンダー` (414件, lethal 27, non-lethal avg +262.9)
- 1枚差し候補: なし

## Role Summary

| Role | Cards | Count | Lethal | Non-Lethal Avg | Top Cards | Reading |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| burst | 3 | 1038 | 0 | 275.6 | パワーアップ 554<br>バーサクパワー 484 | 火力増幅枠。サンダー同様にピーキーなので安定枠とは分ける。 |
| shield | 14 | 949 | 0 | 100 | 二重の盾 395<br>竜の盾 204<br>鉄の盾 204 | 役割単位で再現性あり。デッキ採用テストへ進める。 |
| removal | 5 | 849 | 0 | 262.3 | マッドファイア 342<br>スパーク 283<br>ブラックレイン 173 | 役割単位で再現性あり。デッキ採用テストへ進める。 |
| resource | 7 | 677 | 0 | 89.4 | リ・シャッフル 564<br>リフレッシュ 74<br>ロストーン 39 | 役割単位で再現性あり。デッキ採用テストへ進める。 |
| finisher | 1 | 414 | 27 | 262.9 | サンダー 414 | 勝ち切り力を見る枠。汎用性とは分けて扱う。 |
| interference | 9 | 345 | 0 | 204.7 | 誘惑 345 | 役割単位で再現性あり。デッキ採用テストへ進める。 |
| tempo | 6 | 220 | 0 | 223.8 | ワープ 130<br>リターン 38<br>ローテーション 32 | 役割単位で再現性あり。デッキ採用テストへ進める。 |
| recovery | 5 | 208 | 0 | 135.3 | ヒーリング 167<br>シフトチェンジ 22<br>幻影の鏡 19 | 役割単位で再現性あり。デッキ採用テストへ進める。 |
| setup | 4 | 72 | 0 | 125.8 | レベルチェンジ 72 | 役割単位で再現性あり。デッキ採用テストへ進める。 |

## Card Ranking

| Rank | Card | Role | Count | Lethal | Avg Delta | Non-Lethal Avg | Best Delta | Recommendation | Reading |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 1 | `リ・シャッフル`<br>card_114 | resource | 564 | 0 | 92.8 | 92.8 | 300.7 | main_candidate | 25戦中564件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 2 | `パワーアップ`<br>power_up | burst | 554 | 0 | 269.4 | 269.4 | 1627.9 | main_candidate | 25戦中554件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 3 | `バーサクパワー`<br>card_094 | burst | 484 | 0 | 282.8 | 282.8 | 1612.6 | main_candidate | 25戦中484件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 4 | `二重の盾`<br>card_030 | shield | 395 | 0 | 94.5 | 94.5 | 304.7 | main_candidate | 25戦中395件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 5 | `誘惑`<br>card_061 | interference | 345 | 0 | 204.7 | 204.7 | 1287.8 | main_candidate | 25戦中345件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 6 | `マッドファイア`<br>card_092 | removal | 342 | 0 | 346.3 | 346.3 | 1529.6 | main_candidate | 25戦中342件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 7 | `スパーク`<br>card_026 | removal | 283 | 0 | 197.4 | 197.4 | 648.1 | main_candidate | 25戦中283件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 8 | `竜の盾`<br>card_089 | shield | 204 | 0 | 66.6 | 66.6 | 197.1 | main_candidate | 25戦中204件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 9 | `鉄の盾`<br>card_025 | shield | 204 | 0 | 66.6 | 66.6 | 197.1 | main_candidate | 25戦中204件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 10 | `ブラックレイン`<br>card_056 | removal | 173 | 0 | 192.1 | 192.1 | 1310 | main_candidate | 25戦中173件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 11 | `ヒーリング`<br>healing | recovery | 167 | 0 | 118.4 | 118.4 | 396.5 | main_candidate | 25戦中167件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 12 | `ワープ`<br>card_031 | tempo | 130 | 0 | 262.8 | 262.8 | 1294.8 | main_candidate | 25戦中130件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 13 | `浄化`<br>card_087 | shield | 116 | 0 | 194.8 | 194.8 | 1309.8 | main_candidate | 25戦中116件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 14 | `リフレッシュ`<br>card_116 | resource | 74 | 0 | 46.8 | 46.8 | 87.8 | main_candidate | 25戦中74件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 15 | `レベルチェンジ`<br>card_028 | setup | 72 | 0 | 125.8 | 125.8 | 924.1 | main_candidate | 25戦中72件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 16 | `大地の怒り`<br>card_126 | removal | 51 | 0 | 297.2 | 297.2 | 1251.6 | main_candidate | 25戦中51件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 17 | `ロストーン`<br>card_113 | resource | 39 | 0 | 120.2 | 120.2 | 318 | main_candidate | 25戦中39件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 18 | `リターン`<br>card_122 | tempo | 38 | 0 | 57.4 | 57.4 | 243.7 | main_candidate | 25戦中38件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 19 | `ローテーション`<br>card_093 | tempo | 32 | 0 | 340.5 | 340.5 | 1097.3 | main_candidate | 25戦中32件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 20 | `黄昏の風`<br>card_064 | shield | 30 | 0 | 260.5 | 260.5 | 1289.8 | main_candidate | 25戦中30件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 21 | `シフトチェンジ`<br>card_065 | recovery | 22 | 0 | 74.2 | 74.2 | 274.6 | main_candidate | 25戦中22件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 22 | `ウェイクアップ`<br>card_117 | tempo | 20 | 0 | 99.3 | 99.3 | 238.1 | main_candidate | 25戦中20件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 23 | `幻影の鏡`<br>card_148 | recovery | 19 | 0 | 354.4 | 354.4 | 1099.2 | main_candidate | 25戦中19件で非リーサル改善。まず1-2枚入れて勝率検証する。 |
| 24 | `サンダー`<br>thunder | finisher | 414 | 27 | 116125.2 | 262.9 | 2000360.7 | finisher_candidate | 27件の勝ち切り機会。評価値が跳ねやすいので詰め札として別枠で見る。 |
| 25 | `エクスチェンジ`<br>card_124 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 26 | `エスケープ`<br>card_057 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 27 | `カードサーチ`<br>card_123 | resource | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 28 | `かげ呪い`<br>card_125 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 29 | `かまいたち`<br>card_118 | removal | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 30 | `ガラスの盾`<br>card_055 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 31 | `スケープゴート`<br>card_128 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 32 | `スパルタス覚醒`<br>card_150 | burst | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 33 | `ソートカード`<br>card_115 | resource | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 34 | `ソウルチャージ`<br>card_129 | setup | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 35 | `ダークホール`<br>card_095 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 36 | `デスチェーン`<br>card_098 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 37 | `どこでも`<br>card_063 | tempo | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 38 | `ドロー５`<br>card_120 | resource | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 39 | `バイストーン`<br>card_119 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 40 | `パワー２`<br>card_059 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 41 | `パワーダウン`<br>card_027 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 42 | `プラストーン`<br>card_121 | resource | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 43 | `レベル固定`<br>card_060 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 44 | `再生`<br>card_130 | recovery | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 45 | `呪縛`<br>card_086 | tempo | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 46 | `墓荒らし`<br>card_090 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 47 | `女神の加護`<br>card_091 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 48 | `悪魔のダンス`<br>card_029 | setup | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 49 | `挑発`<br>card_097 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 50 | `水晶の壁`<br>card_062 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 51 | `特技封じ`<br>card_058 | interference | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 52 | `癒しの光`<br>card_127 | recovery | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 53 | `福音の鐘`<br>card_149 | setup | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |
| 54 | `鋼の盾`<br>card_088 | shield | 0 | 0 | 0 | 0 | 0 | low_signal | 今回の条件では仮想手札に足しても刺さりにくい。 |

## Matchups

| Matchup | Result | Opportunities | Top Cards | Issues |
| --- | --- | ---: | --- | --- |
| decoy_vs_white | P 4 / C 1 / U 0 | 742 | リ・シャッフル 93<br>パワーアップ 91<br>バーサクパワー 80 | 0F/0W |
| white_vs_decoy | P 3 / C 2 / U 0 | 1284 | パワーアップ 127<br>サンダー 117<br>バーサクパワー 111 | 0F/0W |
| decoy_vs_black | P 3 / C 2 / U 0 | 698 | パワーアップ 93<br>バーサクパワー 87<br>リ・シャッフル 76 | 0F/0W |
| black_vs_decoy | P 1 / C 4 / U 0 | 514 | リ・シャッフル 58<br>パワーアップ 58<br>バーサクパワー 50 | 0F/0W |
| decoy_mirror | P 4 / C 1 / U 0 | 1534 | リ・シャッフル 235<br>パワーアップ 185<br>バーサクパワー 156 | 0F/0W |

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

## Top Non-Lethal Opportunity Records

| Rank | Seed | Turn | Player | Card | Delta | Target | Selected | Reason |
| ---: | ---: | ---: | --- | --- | ---: | --- | --- | --- |
| 1 | 1000 | 17 | player | `パワーアップ` | 1627.9 | monster:player_front_right | attack:player_front_right:attack->monster:cpu_front_right | パワーアップから攻撃につなげられるため使用 |
| 2 | 1000 | 17 | player | `バーサクパワー` | 1612.6 | monster:player_front_right | attack:player_front_right:attack->monster:cpu_front_right | バーサクパワーで局面を改善できるため使用 |
| 3 | 1104 | 27 | cpu | `マッドファイア` | 1529.6 | monster:player_back_left | end_turn | マッドファイアで敵モンスターを撃破できるため使用 |
| 4 | 1001 | 12 | player | `マッドファイア` | 1497.5 | monster:cpu_front_right | master_lab:scapegoat->monster:player_front_right | マッドファイアで敵モンスターを撃破できるため使用 |
| 5 | 1401 | 13 | cpu | `マッドファイア` | 1471.7 | monster:player_back_right | master_lab:scapegoat->monster:cpu_front_left | マッドファイアで敵モンスターを撃破できるため使用 |
| 6 | 1001 | 7 | player | `マッドファイア` | 1438.4 | monster:cpu_back_right | attack:player_front_left:attack->monster:cpu_front_left | マッドファイアで敵モンスターを撃破できるため使用 |
| 7 | 1401 | 13 | cpu | `マッドファイア` | 1406 | monster:player_back_right | attack:cpu_front_left:attack->monster:player_front_left | マッドファイアで敵モンスターを撃破できるため使用 |
| 8 | 1001 | 7 | player | `マッドファイア` | 1397.5 | monster:cpu_back_right | master_lab:scapegoat->monster:player_front_left | マッドファイアで敵モンスターを撃破できるため使用 |
| 9 | 1001 | 7 | player | `マッドファイア` | 1397.5 | monster:cpu_back_right | master_lab:scapegoat->monster:player_front_left | マッドファイアで敵モンスターを撃破できるため使用 |
| 10 | 1000 | 16 | player | `パワーアップ` | 1388.5 | monster:player_front_right | attack:player_front_right:attack->master:cpu | パワーアップから攻撃につなげられるため使用 |
| 11 | 1000 | 16 | player | `バーサクパワー` | 1373.2 | monster:player_front_right | attack:player_front_right:attack->master:cpu | バーサクパワーで局面を改善できるため使用 |
| 12 | 1001 | 26 | player | `マッドファイア` | 1368.7 | monster:cpu_front_right | end_turn | マッドファイアで局面を改善できるため使用 |
| 13 | 1001 | 14 | player | `マッドファイア` | 1367.8 | monster:cpu_front_right | master_lab:scapegoat->monster:player_front_right | マッドファイアで局面を改善できるため使用 |
| 14 | 1001 | 16 | player | `マッドファイア` | 1367.8 | monster:cpu_front_right | master_lab:scapegoat->monster:player_front_right | マッドファイアで局面を改善できるため使用 |
| 15 | 1001 | 18 | player | `マッドファイア` | 1367.8 | monster:cpu_front_right | master_lab:scapegoat->monster:player_front_right | マッドファイアで局面を改善できるため使用 |
| 16 | 1001 | 20 | player | `マッドファイア` | 1367.8 | monster:cpu_front_right | master_lab:scapegoat->monster:player_front_right | マッドファイアで局面を改善できるため使用 |
| 17 | 1001 | 22 | player | `マッドファイア` | 1367.8 | monster:cpu_front_right | master_lab:scapegoat->monster:player_front_right | マッドファイアで局面を改善できるため使用 |
| 18 | 1001 | 24 | player | `マッドファイア` | 1367.8 | monster:cpu_front_right | master_lab:scapegoat->monster:player_front_right | マッドファイアで局面を改善できるため使用 |
| 19 | 1102 | 11 | cpu | `パワーアップ` | 1365.7 | monster:cpu_front_left | attack:cpu_front_left:attack->master:player | パワーアップから攻撃につなげられるため使用 |
| 20 | 1102 | 11 | cpu | `バーサクパワー` | 1350.4 | monster:cpu_front_left | attack:cpu_front_left:attack->master:player | バーサクパワーで局面を改善できるため使用 |

## Next Loop Proposal

- 提案: opportunity 上位だけでなく role 別上位も拾い、サンダー型の勝ち切り札と汎用札を別々に小母数検証する。
- 次回候補: `リ・シャッフル` 564件 lethal 0 non-lethal avg +92.8 / `パワーアップ` 554件 lethal 0 non-lethal avg +269.4 / `バーサクパワー` 484件 lethal 0 non-lethal avg +282.8 / `サンダー` 414件 lethal 27 non-lethal avg +262.9
- role別控え: resource=`リ・シャッフル` 564件 / burst=`パワーアップ` 554件 / shield=`二重の盾` 395件 / interference=`誘惑` 345件 / removal=`マッドファイア` 342件 / recovery=`ヒーリング` 167件
- 目安: 3-5デッキ案、games-per-matchup 10-20。warning と敵スケープゴート率を同時に見る。
- 分岐: finisher_candidate は勝率が上がってもピーキー枠として扱い、main_candidate/role別候補の安定性と混ぜて判断しない。

## Reading

- count が高いカードは、複数seedで実選択より良い可能性が出たカード。
- lethal は、そのマジックで相手マスターを倒せる勝ち切り機会。汎用性とは分けて読む。
- role summary は、サンダーのようなピーキーな勝ち切り札でランキングが埋まるのを避け、役割ごとの候補を拾うために見る。
- best delta だけが高いカードは、汎用枠ではなく1枚差しの奇襲/回答札として見る。
- このレポートは勝率検証ではなく、次にデッキへ入れて試す候補を絞るための前段。

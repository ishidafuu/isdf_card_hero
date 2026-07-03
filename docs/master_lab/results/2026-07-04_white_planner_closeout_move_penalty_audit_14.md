# White Planner Deckout Race Audit

生成: 2026-07-03T19:42:05.965Z
deck threshold: 2

## Summary

| item | value |
| --- | ---: |
| games | 14 |
| white_planner wins | 10 |
| white wins | 4 |
| deckout finishes | 7 |
| planner deckout losses | 2 |
| planner deckout events | 64 |
| planner end_turn near deckout | 37 |
| planner face damage near deckout | 15 |
| avg steps | 241.2 |
| avg turns | 24.5 |

## Games

| seed | direction | winner | deckout | planner deckout loss | planner events | end_turn | face | warnings |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| 994300 | challenger-as-cpu | white | - | - | 0 | 0 | 0 | suspicious_decision |
| 994301 | challenger-as-cpu | white_planner | - | - | 0 | 0 | 0 | - |
| 994300 | challenger-as-player | white_planner | - | - | 5 | 3 | 1 | - |
| 994301 | challenger-as-player | white_planner | Y | - | 6 | 4 | 2 | - |
| 994302 | challenger-as-cpu | white_planner | Y | - | 12 | 5 | 4 | long_game |
| 994303 | challenger-as-cpu | white_planner | - | - | 0 | 0 | 0 | - |
| 994304 | challenger-as-cpu | white | Y | Y | 3 | 3 | 0 | - |
| 994302 | challenger-as-player | white | Y | Y | 5 | 4 | 0 | - |
| 994303 | challenger-as-player | white_planner | - | - | 0 | 0 | 0 | suspicious_decision |
| 994304 | challenger-as-player | white_planner | Y | - | 8 | 4 | 3 | - |
| 994305 | challenger-as-cpu | white_planner | Y | - | 11 | 9 | 1 | long_game |
| 994306 | challenger-as-cpu | white_planner | - | - | 0 | 0 | 0 | - |
| 994305 | challenger-as-player | white_planner | Y | - | 14 | 5 | 4 | long_game |
| 994306 | challenger-as-player | white | - | - | 0 | 0 | 0 | - |

## Samples

| seed | direction | step | turn | player | planner | decision | HP | deck | stones | deckout log | reason |
| ---: | --- | ---: | ---: | --- | ---: | --- | --- | --- | --- | ---: | --- |
| 994300 | challenger-as-player | 208 | 23 | player | Y | end_turn | 3/1 | 3/3 | 17/25 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-13点 |
| 994300 | challenger-as-player | 209 | 23 | cpu | - | move:cpu_front_left->cpu_front_right | 1/3 | 2/3 | 28/17 | - | 移動後に強い攻撃筋を作れるため移動 |
| 994300 | challenger-as-player | 210 | 23 | cpu | - | attack:cpu_front_right:attack->monster:player_front_right | 1/3 | 2/3 | 28/17 | - | ピグミィを削れるため攻撃 |
| 994300 | challenger-as-player | 211 | 23 | cpu | - | master:master_attack->monster:player_front_right | 1/3 | 2/3 | 28/17 | - | マスターアタックで敵モンスターを撃破できるため使用 |
| 994300 | challenger-as-player | 212 | 23 | cpu | - | end_turn | 1/3 | 2/3 | 25/18 | - | 有効な行動がないためターン終了 |
| 994300 | challenger-as-player | 213 | 24 | player | Y | summon:player_card_133_2->player_back_left | 3/1 | 2/2 | 21/25 | - | デスシープを空き枠へ召喚 / ターンプラン探索: 返し込み最終盤面84点、次点と0点差 |
| 994300 | challenger-as-player | 214 | 24 | player | Y | end_turn | 3/1 | 2/2 | 20/25 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面2点 |
| 994300 | challenger-as-player | 215 | 24 | cpu | - | end_turn | 1/3 | 1/2 | 28/20 | - | 有効な行動がないためターン終了 |
| 994300 | challenger-as-player | 216 | 25 | player | Y | end_turn | 3/1 | 1/1 | 23/28 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面34点 |
| 994300 | challenger-as-player | 217 | 25 | cpu | - | attack:cpu_front_right:attack->master:player | 1/3 | 0/1 | 31/23 | - | 相手マスターへ実ダメージを与えられるため攻撃 |
| 994300 | challenger-as-player | 218 | 25 | cpu | - | end_turn | 1/2 | 0/1 | 31/24 | - | 有効な行動がないためターン終了 |
| 994300 | challenger-as-player | 219 | 26 | player | Y | attack:player_front_left:attack->master:cpu | 2/1 | 0/0 | 27/31 | - | ターン開始時の最大打点で相手マスターを倒せるため攻撃 |
| 994301 | challenger-as-player | 192 | 23 | player | Y | end_turn | 8/3 | 3/3 | 29/10 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面227点 |
| 994301 | challenger-as-player | 193 | 23 | cpu | - | attack:cpu_front_left:スパイクボール->monster:player_front_right | 3/8 | 2/3 | 13/29 | - | デスシープを削れるため攻撃 |
| 994301 | challenger-as-player | 194 | 23 | cpu | - | master:shield->monster:cpu_front_left | 3/8 | 2/3 | 13/29 | - | 倒されそうな高価値味方を守るためシールド |
| 994301 | challenger-as-player | 195 | 23 | cpu | - | end_turn | 3/8 | 2/3 | 11/29 | - | 有効な行動がないためターン終了 |
| 994301 | challenger-as-player | 196 | 24 | player | Y | end_turn | 8/3 | 2/2 | 32/11 | - | 有効な行動がないためターン終了 / 見送り: 攻撃は614点差で見送り |
| 994301 | challenger-as-player | 197 | 24 | cpu | - | attack:cpu_front_left:attack->monster:player_front_left | 3/8 | 1/2 | 14/32 | - | ポリスピナーを削れるため攻撃 / 見送り: 攻撃は143点差で見送り |
| 994301 | challenger-as-player | 198 | 24 | cpu | - | attack:cpu_front_left:スパイクボール->monster:player_front_right | 3/8 | 1/2 | 14/32 | - | デスシープを削れるため攻撃 |
| 994301 | challenger-as-player | 199 | 24 | cpu | - | master:shield->monster:cpu_front_left | 3/8 | 1/2 | 14/32 | - | 致死圏の味方を守れるためシールド |
| 994301 | challenger-as-player | 200 | 24 | cpu | - | end_turn | 3/8 | 1/2 | 12/32 | - | 有効な行動がないためターン終了 |
| 994301 | challenger-as-player | 201 | 25 | player | Y | end_turn | 8/3 | 1/1 | 35/12 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面266点 |
| 994301 | challenger-as-player | 202 | 25 | cpu | - | end_turn | 3/8 | 0/1 | 15/35 | - | 有効な行動がないためターン終了 |
| 994301 | challenger-as-player | 203 | 26 | player | Y | attack:player_front_left:attack->master:cpu | 8/3 | 0/0 | 38/15 | - | ターン開始時の最大打点2点で詰めろを作れるため攻撃 |
| 994301 | challenger-as-player | 204 | 26 | player | Y | attack:player_front_right:attack->master:cpu | 8/2 | 0/0 | 38/16 | - | 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面999017点、次点と998765点差 |
| 994301 | challenger-as-player | 205 | 26 | player | Y | end_turn | 8/1 | 0/0 | 38/17 | Y | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面998968点 |
| 994302 | challenger-as-cpu | 299 | 23 | player | - | end_turn | 6/9 | 3/3 | 2/5 | - | 有効な行動がないためターン終了 |
| 994302 | challenger-as-cpu | 300 | 23 | cpu | Y | magic:cpu_card_031_1->monster:player_front_right | 9/6 | 2/3 | 8/2 | - | ワープで追加対象も有効にできるため使用 / ターンプラン探索: 返し込み最終盤面180点、次点と0点差 |
| 994302 | challenger-as-cpu | 301 | 23 | cpu | Y | attack:cpu_front_right:attack->monster:player_front_right | 9/6 | 2/3 | 5/2 | - | ピグミィを削れるため攻撃 / ターンプラン探索: 返し込み最終盤面155点、次点と39点差 |
| 994302 | challenger-as-cpu | 302 | 23 | cpu | Y | attack:cpu_back_left:storm_bomb->monster:player_front_right | 9/6 | 2/3 | 5/2 | - | 敵モンスターを撃破できるため攻撃 / ターンプラン探索: 返し込み最終盤面118点、次点と48点差 |
| 994302 | challenger-as-cpu | 303 | 23 | cpu | Y | end_turn | 9/6 | 2/3 | 4/4 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-35点 |
| 994302 | challenger-as-cpu | 304 | 24 | player | - | attack:player_front_right:ダイン斬り->master:cpu | 6/9 | 2/2 | 7/4 | - | 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は10点差で見送り |
| 994302 | challenger-as-cpu | 305 | 24 | player | - | end_turn | 6/7 | 2/2 | 7/6 | - | 有効な行動がないためターン終了 |
| 994302 | challenger-as-cpu | 306 | 24 | cpu | Y | attack:cpu_front_left:attack->master:player | 7/6 | 1/2 | 9/7 | - | 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面234点、次点と160点差 |
| 994302 | challenger-as-cpu | 307 | 24 | cpu | Y | end_turn | 7/5 | 1/2 | 9/8 | - | 有効な行動がないためターン終了 / 見送り: マスター特技は76点差で見送り |
| 994302 | challenger-as-cpu | 308 | 25 | player | - | attack:player_front_right:ダイン斬り->monster:cpu_front_right | 5/7 | 1/1 | 11/9 | - | ドノマンティスを削れるため攻撃 / 見送り: 攻撃は366点差で見送り |
| 994302 | challenger-as-cpu | 309 | 25 | player | - | master:master_attack->monster:cpu_front_right | 5/7 | 1/1 | 11/9 | - | マスターアタックで敵モンスターを撃破できるため使用 |
| 994302 | challenger-as-cpu | 310 | 25 | player | - | end_turn | 5/7 | 1/1 | 8/10 | - | 有効な行動がないためターン終了 |
| 994302 | challenger-as-cpu | 311 | 25 | cpu | Y | attack:cpu_front_left:attack->master:player | 7/5 | 0/1 | 13/8 | - | 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面76点、次点と190点差 |
| 994302 | challenger-as-cpu | 312 | 25 | cpu | Y | end_turn | 7/4 | 0/1 | 13/9 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-29点 |
| 994302 | challenger-as-cpu | 313 | 26 | player | - | attack:player_front_right:ダイン斬り->master:cpu | 4/7 | 0/0 | 12/13 | - | 相手マスターへ実ダメージを与えられるため攻撃 |
| 994302 | challenger-as-cpu | 314 | 26 | player | - | end_turn | 4/5 | 0/0 | 12/15 | Y | 有効な行動がないためターン終了 |
| 994302 | challenger-as-cpu | 315 | 26 | cpu | Y | attack:cpu_front_left:attack->master:player | 4/4 | 0/0 | 19/12 | - | 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面159点、次点と147点差 |
| 994302 | challenger-as-cpu | 316 | 26 | cpu | Y | end_turn | 4/3 | 0/0 | 19/13 | Y | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面68点 |
| 994302 | challenger-as-cpu | 317 | 27 | player | - | attack:player_front_right:ダイン斬り->master:cpu | 2/4 | 0/0 | 17/19 | - | 相手マスターへ実ダメージを与えられるため攻撃 |
| 994302 | challenger-as-cpu | 318 | 27 | player | - | end_turn | 2/2 | 0/0 | 17/21 | Y | 有効な行動がないためターン終了 |
| 994302 | challenger-as-cpu | 319 | 27 | cpu | Y | attack:cpu_front_left:attack->master:player | 1/2 | 0/0 | 25/17 | - | 相手マスターへ実ダメージを与えられるため攻撃 / ターンプラン探索: 返し込み最終盤面999992点、次点と1750303点差 |
| 994302 | challenger-as-cpu | 320 | 27 | cpu | Y | end_turn | 1/1 | 0/0 | 25/18 | Y | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面999929点 |
| 994304 | challenger-as-cpu | 242 | 23 | player | - | end_turn | 6/5 | 3/3 | 2/8 | - | 有効な行動がないためターン終了 |
| 994304 | challenger-as-cpu | 243 | 23 | cpu | Y | end_turn | 5/6 | 2/3 | 11/2 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-90点 |
| 994304 | challenger-as-cpu | 244 | 24 | player | - | end_turn | 6/5 | 2/2 | 5/11 | - | 有効な行動がないためターン終了 / 見送り: 攻撃は153点差で見送り、攻撃は240点差で見送り |
| 994304 | challenger-as-cpu | 245 | 24 | cpu | Y | end_turn | 5/6 | 1/2 | 14/5 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-17点 |
| 994304 | challenger-as-cpu | 246 | 25 | player | - | attack:player_front_left:attack->master:cpu | 6/5 | 1/1 | 8/14 | - | ターン開始時の最大打点3点で詰めろを作れるため攻撃 |
| 994304 | challenger-as-cpu | 247 | 25 | player | - | attack:player_front_right:ダイン斬り->master:cpu | 6/3 | 1/1 | 8/16 | - | 相手マスターへ実ダメージを与えられるため攻撃 / 見送り: 攻撃は202点差で見送り |
| 994304 | challenger-as-cpu | 248 | 25 | player | - | attack:player_back_right:スパイクボール->monster:cpu_front_left | 6/2 | 1/1 | 8/17 | - | 真勇者ダインを削れるため攻撃 |
| 994304 | challenger-as-cpu | 249 | 25 | player | - | end_turn | 6/2 | 1/1 | 8/17 | - | 有効な行動がないためターン終了 |
| 994304 | challenger-as-cpu | 250 | 25 | cpu | Y | end_turn | 2/6 | 0/1 | 20/8 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-749403点 |
| 994304 | challenger-as-cpu | 251 | 26 | player | - | attack:player_front_left:attack->master:cpu | 6/2 | 0/0 | 11/20 | - | 相手マスターへ実ダメージを与えられるため攻撃 |
| 994304 | challenger-as-cpu | 252 | 26 | player | - | end_turn | 6/1 | 0/0 | 11/21 | Y | 有効な行動がないためターン終了 |
| 994302 | challenger-as-player | 238 | 23 | player | Y | end_turn | 3/7 | 3/3 | 11/5 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面135点 |
| 994302 | challenger-as-player | 239 | 23 | cpu | - | magic:cpu_card_031_1->monster:player_front_right | 7/3 | 2/3 | 8/11 | - | ワープで追加対象も有効にできるため使用 / 見送り: マジックは1点差で見送り、攻撃は277点差で見送り |
| 994302 | challenger-as-player | 240 | 23 | cpu | - | attack:cpu_front_right:wild_claw->monster:player_front_left | 7/3 | 2/3 | 5/11 | - | ピグミィを削れるため攻撃 |
| 994302 | challenger-as-player | 241 | 23 | cpu | - | attack:cpu_front_left:attack->monster:player_front_left | 7/3 | 2/3 | 5/11 | - | 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は200点差で見送り、移動は288点差で見送り |
| 994302 | challenger-as-player | 242 | 23 | cpu | - | master:shield->monster:cpu_front_right | 7/3 | 2/3 | 4/12 | - | 致死圏の味方を守れるためシールド |
| 994302 | challenger-as-player | 243 | 23 | cpu | - | end_turn | 7/3 | 2/3 | 2/12 | - | 有効な行動がないためターン終了 |
| 994302 | challenger-as-player | 244 | 24 | player | Y | move:player_back_right->player_front_left | 3/7 | 2/2 | 15/2 | - | 移動後に強い攻撃筋を作れるため移動 / 見送り: 移動は79点差で見送り |
| 994302 | challenger-as-player | 245 | 24 | player | Y | end_turn | 3/7 | 2/2 | 15/2 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-23点 |
| 994302 | challenger-as-player | 246 | 24 | cpu | - | attack:cpu_front_right:wild_claw->monster:player_front_left | 7/3 | 1/2 | 5/15 | - | デスシープを削れるため攻撃 / 見送り: 攻撃は2点差で見送り、攻撃は109点差で見送り |
| 994302 | challenger-as-player | 247 | 24 | cpu | - | attack:cpu_front_left:attack->monster:player_front_left | 7/3 | 1/2 | 5/15 | - | 敵モンスターを撃破できるため攻撃 / 見送り: 攻撃は660点差で見送り |
| 994302 | challenger-as-player | 248 | 24 | cpu | - | master:shield->monster:cpu_front_right | 7/3 | 1/2 | 5/17 | - | 致死圏の味方を守れるためシールド |
| 994302 | challenger-as-player | 249 | 24 | cpu | - | end_turn | 7/3 | 1/2 | 3/17 | - | 有効な行動がないためターン終了 |
| 994302 | challenger-as-player | 250 | 25 | player | Y | end_turn | 3/7 | 1/1 | 20/3 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-30点 |
| 994302 | challenger-as-player | 251 | 25 | cpu | - | attack:cpu_front_left:attack->master:player | 7/3 | 0/1 | 6/20 | - | 相手マスターへ実ダメージを与えられるため攻撃 |
| 994302 | challenger-as-player | 252 | 25 | cpu | - | end_turn | 7/2 | 0/1 | 6/21 | - | 有効な行動がないためターン終了 |
| 994302 | challenger-as-player | 253 | 26 | player | Y | end_turn | 2/7 | 0/0 | 24/6 | Y | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-749388点 |
| 994302 | challenger-as-player | 254 | 26 | cpu | - | attack:cpu_front_left:attack->master:player | 6/2 | 0/0 | 10/24 | - | 相手マスターへ実ダメージを与えられるため攻撃 |
| 994302 | challenger-as-player | 255 | 26 | cpu | - | end_turn | 6/1 | 0/0 | 10/25 | Y | 有効な行動がないためターン終了 |
| 994304 | challenger-as-player | 242 | 23 | player | Y | end_turn | 6/5 | 3/3 | 2/8 | - | 有効な行動がないためターン終了 / ターンプラン探索: 返し込み最終盤面-18点 |
| 994304 | challenger-as-player | 243 | 23 | cpu | - | end_turn | 5/6 | 2/3 | 11/2 | - | 有効な行動がないためターン終了 |
| 994304 | challenger-as-player | 244 | 24 | player | Y | end_turn | 6/5 | 2/2 | 5/11 | - | 有効な行動がないためターン終了 / 見送り: 攻撃は153点差で見送り、攻撃は240点差で見送り |

## Conclusion

- white_planner は 10-4、勝率 71.4%。
- deckout finish は 7/14、そのうち planner の deckout loss は 2。
- deckout race は実際に負け筋として出ており、終盤評価を単独監査する価値がある。
- 山札切れ付近では planner の end_turn が顔打点より多い。これが正しい待ちか、詰め損ねかを分岐再生で確認する。

## Next Loop Proposal

- planner が負けた deckout finish seed を分岐再生し、end_turn / face damage / monster attack の勝敗差を直接比較する。
- deckout race 用の実験チューニングは、相手より先に山札切れで死ぬ局面だけに限定する。
- long_game の勝ちseedは、勝っているが決着が遅いだけか、詰めを逃しているかを別に見る。

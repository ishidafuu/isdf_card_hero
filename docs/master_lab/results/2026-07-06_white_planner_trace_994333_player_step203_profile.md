# White Planner Decision Trace

生成: 2026-07-06T14:59:12.829Z
deck: `master-lab-white-1377-death-sheep3`
seed: 994333
direction: challenger-as-player
search: `{}`

## Conclusion

- winner: none, final score 71.2.
- planner decisions 1, attacks 0, focus 0, max decision 472ms.
- slow decisions >=5000ms: 0.
- Use this trace to pick exact turn/step targets before running expensive branch replay.

## Final

- state: turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 25/25 / hand player/cpu 4/5
- board: player_back_left:PB:ピグミィ Lv1 HP3 prep

## Decisions

| step | turn | ms | decision | score | state | board | after | reason |
| ---: | ---: | ---: | --- | ---: | --- | --- | --- | --- |
| 0 | 1 | 472 | summon:ピグミィ->player_back_left | 27 | turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 3/0 / deck player/cpu 25/25 / hand player/cpu 5/5 | empty | turn 1 / current player / HP player/cpu 10/10 / stones player/cpu 2/0 / deck player/cpu 25/25 / hand player/cpu 4/5 | 後衛カードを後列左へ召喚 / ターンプラン探索: 返し込み最終盤面263点、次点と0点差 |

# White Shield Response Matrix Audit

- generatedAt: 2026-07-01T08:52:54.214Z
- gamesPerMatchup: 1
- seedStart: 963000
- maxSteps/maxTurns: 450/120
- maxOwnActionsAfterShield/maxOpponentActions: 8/8
- maxShieldEventsPerGame/maxShieldEventsPerAudit: 4/10

## Summary

- shield events: 6
- ignored_both: 1<br>16.7%
- deterrent: 4<br>66.7%
- anomaly: 0<br>0%
- absorbed: 1<br>16.7%
- no-shield contact: 5<br>83.3%
- with-shield contact: 1<br>16.7%
- shield saved target: 4<br>66.7%
- with-shield face damage worse: 0<br>0%
- branch truncation: own 0, response 0

## Matchups

| variant | opponent | seat | games | shield | ignored_both | deterrent | anomaly | absorbed | with contact | no contact | saved | face worse |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| current_white_baseline | white_current_mirror | player | 1 | 4 | 0<br>0% | 3<br>75% | 0<br>0% | 1<br>25% | 1<br>25% | 4<br>100% | 3<br>75% | 0<br>0% |
| current_white_baseline | white_current_mirror | cpu | 1 | 2 | 1<br>50% | 1<br>50% | 0<br>0% | 0<br>0% | 0<br>0% | 1<br>50% | 1<br>50% | 0<br>0% |

## Reading

- 盾応答の内訳は ignored_both 16.7% / deterrent 66.7% / absorbed 16.7%。
- 無仕事盾はかなり抑えられている。次は deterrent が顔面被弾増に変換されていないかを見る段階。
- 最も ignored_both が濃い組み合わせは current_white_baseline vs white_current_mirror (cpu) の 50%。

## Samples

### current_white_baseline vs white_current_mirror (player)

| class | seed/turn/step | target | state | no-shield response | with-shield response | branch actions | board |
|---|---|---|---|---|---|---|---|
| deterrent | 963000/T3/S26 | ドノマンティス player_front_right HP5 Lv1 | turn 3 player HP10/S2 cpu HP10/S1 current player | contact/removed/face 0<br>focus:cpu_front_right<br>attack:cpu_front_left:wild_claw->monster:player_front_right<br>attack:cpu_front_right:attack->monster:player_front_right<br>summon:ピグミィ->cpu_back_left<br>master:shield->monster:cpu_front_right<br>end_turn | no contact/survive/face 0<br>focus:cpu_front_right<br>attack:cpu_front_left:wild_claw->monster:player_back_left<br>attack:cpu_back_right:スパイクボール->monster:player_front_left<br>attack:cpu_back_right:スパイクボール->monster:player_front_left<br>master:master_attack->monster:player_front_left<br>summon:ピグミィ->cpu_back_left<br>end_turn | no: master:shield->monster:player_front_left<br>end_turn<br>with: end_turn | cpu_back_left:ヤンバル HP3 Lv1 P<br>cpu_back_right:ピグミィ HP3 Lv1 A/F<br>cpu_front_left:empty<br>cpu_front_right:ポリスピナー HP3 Lv1 A/S<br>player_front_left:ボムゾウ HP4 Lv1 A<br>player_front_right:ドノマンティス HP5 Lv1 A<br>player_back_left:ヤンバル HP3 Lv2 A<br>player_back_right:デスシープ HP6 Lv1 A/F |
| deterrent | 963000/T5/S49 | ドノマンティス player_front_right HP5 Lv1 気合 | turn 5 player HP10/S5 cpu HP10/S1 current player | contact/survive/face 0<br>master:wake_up->monster:player_back_left<br>attack:cpu_front_left:wild_claw->monster:player_back_left<br>attack:cpu_back_left:スパイクボール->monster:player_front_right<br>summon:デスシープ->cpu_front_right<br>focus:cpu_back_left<br>end_turn | no contact/survive/face 0<br>master:wake_up->monster:player_back_left<br>attack:cpu_front_left:wild_claw->monster:player_back_left<br>summon:デスシープ->cpu_front_right<br>attack:cpu_back_left:スパイクボール->monster:player_back_right<br>focus:cpu_back_left<br>end_turn | no: master:shield->monster:player_back_right<br>end_turn<br>with: end_turn | cpu_back_left:ピグミィ HP3 Lv2 A<br>cpu_back_right:empty<br>cpu_front_left:ヤンバル HP3 Lv2 A/S<br>cpu_front_right:empty<br>player_front_left:ポリスピナー HP3 Lv1 P<br>player_front_right:ドノマンティス HP5 Lv1 A/F<br>player_back_left:ピグミィ HP3 Lv1 P<br>player_back_right:デスシープ HP6 Lv1 A/F |
| deterrent | 963000/T6/S62 | ポリスピナー player_front_left HP3 Lv2 | turn 6 player HP10/S5 cpu HP9/S4 current player | contact/removed/face 0<br>focus:cpu_front_right<br>move:cpu_front_left->cpu_back_right<br>attack:cpu_back_right:スパイクボール->monster:player_front_left<br>summon:ボムゾウ->cpu_front_left<br>master:wake_up->monster:cpu_front_left<br>attack:cpu_front_left:self_bomb->monster:player_front_left<br>master:shield->monster:cpu_front_right<br>end_turn | no contact/survive/face 0<br>focus:cpu_front_right<br>move:cpu_front_left->cpu_back_right<br>attack:cpu_back_right:スパイクボール->monster:player_front_right<br>master:master_attack->monster:player_front_right<br>master:master_attack->monster:player_front_right<br>summon:ボムゾウ->cpu_front_left<br>end_turn | no: master:shield->monster:player_front_right<br>end_turn<br>with: end_turn | cpu_back_left:ピグミィ HP3 Lv2 A/F<br>cpu_back_right:empty<br>cpu_front_left:empty<br>cpu_front_right:デスシープ HP6 Lv1 P<br>player_front_left:ポリスピナー HP3 Lv2 A<br>player_front_right:ドノマンティス HP5 Lv1 A<br>player_back_left:ドノマンティス HP5 Lv1 P<br>player_back_right:デスシープ HP6 Lv1 A/F |
| absorbed | 963000/T2/S12 | ドノマンティス player_front_right HP5 Lv1 気合 | turn 2 player HP10/S2 cpu HP10/S0 current player | contact/removed/face 0<br>focus:cpu_front_right<br>attack:cpu_back_right:スパイクボール->monster:player_front_right<br>attack:cpu_front_left:wild_claw->monster:player_front_right<br>attack:cpu_front_right:attack->monster:player_front_right<br>summon:ヤンバル->cpu_back_left<br>focus:cpu_back_right<br>end_turn | contact/survive/face 0<br>attack:cpu_front_right:attack->monster:player_front_right<br>focus:cpu_front_right<br>attack:cpu_back_right:スパイクボール->monster:player_front_left<br>focus:cpu_front_left<br>focus:cpu_back_right<br>summon:ヤンバル->cpu_back_left<br>master:shield->monster:cpu_front_right<br>end_turn | no: master:shield->monster:player_front_left<br>end_turn<br>with: end_turn | cpu_back_left:ヤンバル HP3 Lv1 P<br>cpu_back_right:ピグミィ HP3 Lv1 P<br>cpu_front_left:empty<br>cpu_front_right:ポリスピナー HP3 Lv1 P<br>player_front_left:ボムゾウ HP6 Lv1 A/F<br>player_front_right:ドノマンティス HP5 Lv1 A/F<br>player_back_left:ヤンバル HP3 Lv1 A/F<br>player_back_right:デスシープ HP6 Lv1 P |

### current_white_baseline vs white_current_mirror (cpu)

| class | seed/turn/step | target | state | no-shield response | with-shield response | branch actions | board |
|---|---|---|---|---|---|---|---|
| ignored_both | 963001/T8/S82 | 真勇者ダイン cpu_front_left HP3 Lv3 | turn 8 cpu HP9/S3 player HP2/S8 current cpu | no contact/survive/face 0<br>end_turn | no contact/survive/face 0<br>end_turn | no: end_turn<br>with: end_turn | cpu_back_left:ピグミィ HP3 Lv2 A<br>cpu_back_right:ヤンバル HP3 Lv1 A<br>cpu_front_left:真勇者ダイン HP3 Lv3 A<br>cpu_front_right:ピグミィ HP3 Lv2 A/F<br>player_front_left:empty<br>player_front_right:デスシープ HP6 Lv1 A<br>player_back_left:empty<br>player_back_right:ピグミィ HP3 Lv1 A/F |
| deterrent | 963001/T6/S62 | 真勇者ダイン cpu_front_left HP3 Lv3 | turn 6 cpu HP9/S7 player HP6/S3 current cpu | contact/removed/face 0<br>attack:player_front_right:attack->monster:cpu_front_right<br>attack:player_back_right:スパイクボール->monster:cpu_front_left<br>master:master_attack->monster:cpu_front_left<br>summon:ボムゾウ->player_front_left<br>focus:player_back_right<br>master:shield->monster:player_front_right<br>end_turn | no contact/survive/face 0<br>attack:player_back_right:スパイクボール->monster:cpu_front_right<br>attack:player_front_right:attack->monster:cpu_front_right<br>master:master_attack->monster:cpu_front_right<br>attack:player_back_right:スパイクボール->monster:cpu_front_right<br>summon:ボムゾウ->player_front_left<br>master:wake_up->monster:player_front_left<br>attack:player_front_left:storm_bomb->monster:cpu_front_right<br>end_turn | no: master:shield->monster:cpu_front_right<br>end_turn<br>with: end_turn | cpu_back_left:ピグミィ HP3 Lv2 A/F<br>cpu_back_right:ピグミィ HP3 Lv2 A/F<br>cpu_front_left:真勇者ダイン HP3 Lv3 A<br>cpu_front_right:デスシープ HP6 Lv1 A/F<br>player_front_left:empty<br>player_front_right:デスシープ HP6 Lv1 P<br>player_back_left:empty<br>player_back_right:ピグミィ HP3 Lv1 A/S |

## Notes

- `ignored_both`: 盾なしでも盾ありでも相手が対象に触らない。現状の第一改善候補。
- `deterrent`: 盾なしなら対象に触るが、盾ありなら触らない。価値はあるが、顔面へ逃がしていないかを見る。
- `absorbed`: 盾ありでも相手が対象に触る。攻撃を使わせているので基本は良いが、1接触で除去される場合は過信を疑う。
- `anomaly`: 盾なしでは触られないのに盾ありでは触られる。分岐の行動順差や対象価値の逆転を優先確認する。

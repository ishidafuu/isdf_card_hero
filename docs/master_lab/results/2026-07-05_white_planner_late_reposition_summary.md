# White Planner Late Reposition Summary

生成: 2026-07-05

## 目的

白白の残り負け `994312 challenger-as-player` を改善する。  
前回の `front hold` 後、この範囲の中母数は `994310-994315 both` で `9-3-0`。残り負けは `994313 challenger-as-cpu`、`994312 challenger-as-player`、`994314 challenger-as-player` だった。

## 観測

### `994312 challenger-as-player` step 247

- turn 20、双方デッキ6枚。
- 現行選択: `magic:ローテーション->master:player`
- 勝ち枝: `move:player_back_left->player_front_right`
- 盤面:
  - 自前衛: ドノマンティス、ピグミィLv2
  - 自後衛: 真勇者ダイン
  - 敵前衛: ボムゾウLv2、デスシープLv2

forced branch では、現行ローテーションは最終的に `white` 勝ち、前衛再配置moveは `white_planner` 勝ちだった。

| branch | result | final |
| --- | --- | --- |
| `magic:ローテーション->master:player` | loss | `P0/C4` |
| `move:player_back_left->player_front_right` | win | `P4/C0` |

内部評価ではローテーションが planner score `222.3`、勝ち枝の移動が `57.4` まで落ちていた。短期盤面ではローテーションが良く見えるが、終盤のデッキ切れ競争では、真勇者ダインを前衛に出してピグミィを後列へ戻す配置が勝ち筋だった。

## 対応

late deck race 限定で、ローテーションと前衛再配置moveを rollout 比較にかける trigger を追加した。

追加条件:

- 白ミラー。
- turn 18以降。
- 双方デッキが6枚以下。
- fallback がローテーション。
- 候補に、後列の耐久/前衛役を前列へ出し、前列の後衛役を後列へ戻す move がある。

この条件を満たす場合だけ64 step rolloutを行い、勝ち枝が明確な場合に前衛再配置を採用する。

## 結果

### 直接対象

| case | 修正前 | 修正後 |
| --- | --- | --- |
| `994312 challenger-as-player` | loss, HP `P0/C4` | win, HP `P4/C0` |

### 中母数

`master-lab-white-1377-death-sheep3`, seeds `994310-994315`, both directions。

| version | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| front hold | 9-3-0 | 75.0% | +3.08 | 258.2 | 25.3 | 840.7 | 66653.1 | 0 |
| late reposition | 10-2-0 | 83.3% | +3.75 | 258.2 | 25.0 | 891.5 | 67473.1 | 0 |

### 既存ガード

`master-lab-white-1377-death-sheep3`, seeds `994306-994309`, both directions。

| version | W-L-D | WPR | avg HP margin | avg steps | avg turns | avg decision ms | max decision ms | issues |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| front hold | 8-0-0 | 100% | +5.13 | 261.5 | 25.3 | 984.5 | 77912.9 | 0 |
| late reposition | 8-0-0 | 100% | +5.13 | 261.5 | 25.3 | 1006.3 | 80283.9 | 0 |

## 所感

今回の改善は、終盤の「全体配置を良く見せるローテーション」より、「前衛に耐久/打点源を出して後衛役を後ろに戻す」方がデッキ切れ競争で勝つ局面を拾ったもの。  
白白では終盤の1点レースが発生しやすく、短期盤面評価だけではローテーションの見栄えに引っ張られるため、late deck race 限定のrollout比較が有効だった。

max decision は 80秒級が残る。勝率は伸びたが、実プレイ向けには次に長考局面を抽出し、rollout発火回数と候補数を削る必要がある。

## 次の改善候補

残り負けは `994313 challenger-as-cpu` と `994314 challenger-as-player`。  
ただし max decision が 60-80秒級で残っているため、次は勝率ループの前に長考監査を挟むのがよい。特に late deck race / front pressure rollout の発火局面、候補数、選択変更の有無を記録すると、強さを落とさず枝刈りしやすい。

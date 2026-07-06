# White Planner Loss Diff Filter

生成: 2026-07-06

## Purpose

負けseedをすべて同じ重さで見るのではなく、`white_planner` が標準 `white` と違う手を実際に選んだ負けseedだけを次の改善対象にする。

## Checked Seeds

| seed | direction | result | diff | planner-selected diff | decision |
| ---: | --- | --- | ---: | ---: | --- |
| 994325 | challenger-as-cpu | loss 0-10 | 1 | 0 | planner固有悪手ではないため除外 |
| 994333 | challenger-as-player | loss 0-2 | 2 | 2 | 差分はあるが、どちらも妥当寄り |

## Notes

- `994325` は大敗だが、plannerが実際に選んだ差分は0。白AI共通の展開負けまたはデッキ/席順要因として扱う。
- `994333` step98 は `ボムゾウ self_bomb -> ボムゾウ` で敵撃破。標準whiteとの差分だが、止めるべき手ではない。
- `994333` step190 は `ピグミィ -> Lv3ダイン`。終盤のLv3前衛を削る判断で、これも単純な悪手とは言いにくい。
- `994324` の怪しい攻撃overrideは止めると悪化したため、planner差分を直接禁止する方向は現時点で危険。

## Next Loop

planner固有差分の抑制では収穫が薄い。
次は標準whiteとplannerが共通して選ぶが負けに向かう判断を扱う。

候補:

1. 負けseedで `white` と `white_planner` の差分が0または少ない局面を対象にする。
2. 終盤ではなく、中盤の「相手Lv3前衛を作らせた前後」「こちらの攻め駒が消えた前後」を抽出する。
3. 改善候補は planner gate ではなく、共通評価の `敵レベルアップ許容`、`次ターン脅威源処理`、`前衛突破前の顔打点` へ戻す。

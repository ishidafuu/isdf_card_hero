# White Mirror Terminal Plan Loop Conclusion

生成: 2026-06-26

## 目的

白対白を対象に、ターン中の手順を「最終盤面」と「相手の返し」まで見て、現行AIの次改善候補を検証した。

## 実行内容

1. 現行設定の終端手順監査を再実行。
2. 探索パラメータ候補を小母数、中母数で確認。
3. 低石終端ペナルティ、前列後衛役のフォーカス抑制、低石未来盾抑制を候補実装として試行。
4. 広い前衛チップ抑制も試したが、既存回帰を壊したため即時棄却。

## 結果

| 候補 | 終端監査 | 勝率確認 | 判定 |
| --- | --- | --- | --- |
| 現行再監査 | selected avg rank 16.5 / avg gap 34 / response gap 54.6 | 既存 baseline は 1339 が 6-2 | 基準 |
| terminal weight 3 | 未採用 | 中母数で 4-4。小母数の好結果は再現せず | 棄却 |
| opponent response weight 0.5 | 未採用 | 6-2で baseline と同等、思考時間は増加 | 棄却 |
| focus/shield 抑制 | shield は 2/6 から 1/6 に減少。ただし avg gap 46.5、max gap 118 に悪化 | 4-4。強化とは言えない | 棄却 |
| 広い前衛チップ抑制 | 未採用 | `tests/game/cpuAi.test.ts` で 9 件失敗 | 棄却 |

## 主要な観察

- 「盾を減らす」「前列の後衛役をためない」は局所的には正しいが、それだけだとAIは別の余剰行動、特に前衛への非致死削りへ寄る。
- 白の基本方針は盤面制圧なので、前衛攻撃を雑に下げると既存回帰を壊す。
- 次に必要なのは「削り攻撃そのものの禁止」ではなく、削った後に相手ターンでその前衛が反撃して、こちらの前衛が落ちるかどうかの評価。
- 終端盤面監査では、raw terminal 1位と response-adjusted 1位が分かれる局面があり、相手返しをより深く読む必要がある。

## 結論

今回のAI本体変更は採用しない。勝率面で明確な改善がなく、終端監査では悪化が確認されたため。

次に進めるべき方向は、白ミラー限定の「前衛削り後の相手返し評価」。具体的には、攻撃後の敵前衛が次ターンにこちらの前衛を撃破できるか、こちらの攻撃が同ターン撃破・レベルアップ・相手打点源低下に変換できるかを分けて監査する。

## 次ループ提案

1. `front_chip_response_audit` を追加する。
   - 敵前衛を削ったが倒していない手を抽出する。
   - 削られた敵前衛が相手ターンに攻撃したかを記録する。
   - その攻撃でこちらの前衛が撃破、レベルアップ餌化、シールド要求化したかを記録する。
2. 採用候補はペナルティではなく、分岐評価にする。
   - 同ターン撃破に届く削りは加点。
   - レベルアップへ変換できる削りは加点。
   - 返しでこちらの前衛が落ちるだけの削りは減点候補。
3. まず白対白 6 seed 程度の監査で候補を読む。
4. 候補が明確なら 8 戦、次に 16 戦の白ミラーで確認する。

## 生成レポート

- `2026-06-26_white_mirror_terminal_plan_audit_refresh.md`
- `2026-06-26_white_mirror_terminal_plan_param_screen.md`
- `2026-06-26_white_mirror_terminal_plan_param_rescreen.md`
- `2026-06-26_white_mirror_terminal_overcommit_audit.md`
- `2026-06-26_white_mirror_overcommit_current_rescreen.md`
- `2026-06-26_white_mirror_focus_shield_audit.md`
- `2026-06-26_white_mirror_focus_shield_rescreen.md`

## 検証

- `npm test -- --run tests/game/cpuAi.test.ts`

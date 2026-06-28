# White Current Deck Shield First Investigation

生成: 2026-06-28

## Scope

前回の行動順序監査で残った `Shield First` を掘り下げた。
ここでの目的は勝率測定ではなく、同一ターンの最初にシールドを選ぶ局面が「攻撃/ウェイクアップより先に盾を張っている悪手」なのか、「他に有効行動がなく盾だけが残っている局面」なのかを分けること。

## Script Updates

`scripts/white-ai-action-order-audit.ts` を調査用に拡張した。

- 盾/ウェイクアップ選択時だけ詳細候補評価を取るようにして、全ステップ再評価による重さを軽減。
- `--stop-after-samples` を追加し、サンプルが取れた時点で途中終了できるようにした。
- 途中終了ゲームは `partial` として扱い、勝敗集計と混同しないようにした。
- `shield_first_turn` サンプルに、候補種別カウントと上位候補を出すようにした。
- 盤面表示に `focus`, `shield`, `sealed`, `scapegoat`, `berserk`, `provoke` などの状態フラグを出すようにした。

## Commands

```bash
npm run lab:masters:white-ai-action-order -- --variant current_white_baseline --opponent black_pressure_strong --opponent black_1375_pressure --opponent white_current_mirror --seed-start 83100 --count 4 --margin 20 --max-samples 12 --stop-after-samples 8 --markdown docs/master_lab/results/2026-06-28_white_current_deck_shield_first_audit.md --json docs/master_lab/results/2026-06-28_white_current_deck_shield_first_audit.json
npm run lab:masters:white-ai-action-order -- --variant current_white_baseline --opponent black_pressure_strong --opponent black_1375_pressure --opponent white_current_mirror --seed-start 83100 --count 4 --margin 20 --max-samples 6 --stop-after-samples 4 --markdown docs/master_lab/results/2026-06-28_white_current_deck_shield_first_detail_audit.md --json docs/master_lab/results/2026-06-28_white_current_deck_shield_first_detail_audit.json
npm run build
```

## Findings

### 1. shield -> retreat は引き続き 0

8サンプル採取監査:

- 19完走 + 1 partial
- `Shield->Retreat`: 0
- `Shield Then Work`: 0
- `Work Then Shield`: 101
- `Shield First`: 8

4サンプル詳細監査:

- 5完走 + 1 partial
- `Shield->Retreat`: 0
- `Shield Then Work`: 0
- `Work Then Shield`: 30
- `Shield First`: 4

したがって、今回も「盾を張った後に攻撃/ウェイクアップしている」順序ミスは出ていない。

### 2. Shield First は攻撃/ウェイクアップを押しのけていない

詳細サンプル4件の候補一覧は以下。

| seed | 相手 | seat | 対象 | 候補種別 |
| --- | --- | --- | --- | --- |
| 83103 | black_pressure_strong | player | ヤンバル | `master_action 1`, `end_turn 1` |
| 83103 | black_pressure_strong | player | ピグミィ | `master_action 1`, `end_turn 1` |
| 83100 | black_pressure_strong | cpu | デスシープ | `master_action 1`, `magic 2`, `end_turn 1` |
| 83101 | black_pressure_strong | cpu | ポリスピナー | `master_action 1`, `end_turn 1` |

上位候補に攻撃/ウェイクアップは存在しなかった。
つまり今回の `Shield First` は「攻撃前に盾を張っている」のではなく、「有効候補として残ったのが盾、ターン終了、または一部マジックだけ」という局面だった。

### 3. 見た目より候補が少なくなる理由

`listAttackDecisions` は攻撃を列挙しているが、`createAttackDecision` で攻撃スコアが `-90` 以下の場合は候補から落ちる。
そのため、法的には攻撃できるように見えても、状態評価上ほぼ悪手と判定された攻撃は候補一覧に残らない。

今回のサンプルでは、準備中の敵しかいない、攻撃しても成果が薄い、既に相手駒が気合だめ済みで殴る価値が低い、などの理由で攻撃が有効候補に残っていないと読める。

## Interpretation

`Shield First` だけを理由に「盾は必ず最後」という補正を入れるのは不適切。
現状の問題は順序ではなく、以下に移っている。

- 盾対象を本当に守る価値があるか
- 盾なしで受ける相手最大打点を許容できるか
- 盾を張っても突破されるだけではないか
- 前列に出た後衛ロールを守る価値が、石2個に見合うか
- スコアが大幅マイナスの局面で、盾が「最善の敗戦遅延」になっているだけではないか

特に、ヤンバル/ピグミィ/ポリスピナーのような行動価値は高いが脆い駒に対して、「高価値だから守る」だけでなく、「守った結果、次ターンに仕事へ変換できるか」を見る必要がある。

## Decision

行動順序補正は採用しない。
次に進むなら、`shield target quality / shield necessity` の監査へ戻す。

次の監査で見るべき項目:

- 盾なし予測ダメージ
- 盾あり突破コスト
- 盾対象が次自ターンまで生存したか
- 盾対象が次自ターンに攻撃/撃破/レベルアップ/壁化へ変換されたか
- 盾対象が後衛ロールで、前列に残す価値があったか
- 盾を張ったことで次ターンの石が足りなくなったか

## References

- [8サンプル採取監査](./2026-06-28_white_current_deck_shield_first_audit.md)
- [4サンプル詳細監査](./2026-06-28_white_current_deck_shield_first_detail_audit.md)

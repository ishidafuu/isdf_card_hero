# White Current Deck Action Order Summary

生成: 2026-06-28

## Scope

- 対象デッキ: `master-lab-white-1377-death-sheep3`
- 対象AI: 現行 `white` profile
- 主な確認観点:
  - シールド後に同じ駒を後列へ逃がす雑な順序が残っているか
  - 攻撃/ウェイクアップより先にシールドを張ってしまう順序問題が支配的か
  - ウェイクアップが攻撃より優先されすぎていないか

## Commands

```bash
npm run lab:masters:white-ai-action-order -- --seed-start 83000 --count 4 --margin 20 --max-samples 16 --markdown docs/master_lab/results/2026-06-28_white_current_deck_action_order_audit.md --json docs/master_lab/results/2026-06-28_white_current_deck_action_order_audit.json
npm run lab:masters:white-ai-action-order -- --variant current_white_baseline --opponent black_pressure_strong --opponent black_1375_pressure --opponent white_current_mirror --seed-start 83100 --count 4 --margin 20 --max-samples 20 --markdown docs/master_lab/results/2026-06-28_white_current_deck_turn_order_audit.md --json docs/master_lab/results/2026-06-28_white_current_deck_turn_order_audit.json
npm run build
```

## Findings

### 1. shield -> retreat は再現しなかった

- 広域監査 72戦では、3候補すべてで `Shield->Retreat` は 0件。
- 現行baseline詳細 24戦でも、`Shield->Retreat` は 0件。
- 少なくとも暫定白最強デッキ基準では、「前衛にシールドを張ってから後列へ逃がす」順序は支配的な再現パターンではない。

### 2. 盾はおおむね仕事の後に張れている

現行baseline詳細 24戦:

| 指標 | 件数 |
| --- | ---: |
| 候補ターン | 386 |
| シールドを含むターン | 163 |
| Shield First | 9 |
| Shield Then Work | 0 |
| Work Then Shield | 135 |

重要なのは `Shield Then Work` が 0件だったこと。  
「盾を張った後に攻撃/ウェイクアップで仕事をする」流れは、この監査範囲では出ていない。

一方で `Shield First` は 9件ある。これは、そのターンの最初の意味ある行動が盾だったという意味で、後続に攻撃/ウェイクアップは発生していない。反撃回避や他に仕事がないターンなら許容できるが、ここは次に盤面サンプルを抜いて確認する価値がある。

### 3. ウェイクアップは攻撃候補を大きく上回って暴走していない

現行baseline詳細 24戦:

- `selectedWakes`: 62件
- `Wake Attack Higher`: 0件
- `Wake Attack Close`: 0件
- `Wake Then Attack`: 59ターン

少なくとも探索評価上は、攻撃した方が明確に良い局面でウェイクアップを選ぶ傾向は見えていない。  
ただし、この監査は「評価上の競合」を見ているだけなので、ユーザー指摘の「気合ため目的の味方ウェイクアップ」が完全に消えた証拠ではない。次に見るなら、ウェイクアップ対象が同ターンに撃破/削り/リーサル/盾対象化へ変換されたかを追う方がよい。

### 4. 勝率の悪さは順序だけでは説明しにくい

現行baseline詳細は 7-17-0 で負け越し。  
ただし、順序指標では `shield -> retreat` や `shield then work` が出ていないため、単純な「盾を最後に張る係数」を入れても改善根拠が薄い。

現在の問題は、順序よりも以下に寄っている可能性が高い。

- その盾対象を本当に守る価値があったか
- 盾なしで相手の最大打点を受けても許容できたか
- 盾を張ったことで次ターンの石が枯れていないか
- 黒の次ターン打点源を処理する攻撃と、盤面維持のシールドの優先関係が正しいか

## Decision

この結果だけでは、行動順に対する新しい係数追加は見送り。  
現行AIは、少なくとも「攻撃/ウェイクアップ後に盾」という基本順序をかなり満たしている。

次の改善は、順序補正ではなく次のどちらかがよい。

1. `Shield First` 9件の盤面サンプル監査  
   最初に盾を張るしかなかったターンか、仕事を放棄して盾を張っているターンかを分解する。

2. シールド対象品質の再監査  
   盾対象が次ターンまで生存したか、仕事したか、レベルアップ/撃破/壁へ変換されたかを見る。特に、盾なし予測ダメージと盾あり突破コストの差分を入れる。

## References

- [広域監査](./2026-06-28_white_current_deck_action_order_audit.md)
- [現行baseline詳細監査](./2026-06-28_white_current_deck_turn_order_audit.md)

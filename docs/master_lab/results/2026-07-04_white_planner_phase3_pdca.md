# White Planner Phase 3 PDCA

生成: 2026-07-04

## 目的

前フェーズで `white_planner` は白ミラー 1377 デスシープ3基準において、既存 `white` に対して小-中母数で勝ち越した。一方で、探索コストが重く、追加ループの速度が落ちている。今回は以下を確認した。

- 前回の勝ち越しがより大きい母数でも再現するか。
- `white_planner` の root 探索を軽量化できるか。
- 負けseedから次の白AI改善候補を抽出できるか。

## 実行結果

### 大母数確認

20ゲーム相当の確認として `seed 994300 / count 10 / both` を開始したが、21分超で未完走だったため中断した。

続いて `seed 994305 / count 5 / both` も8分超で未完走だったため中断した。

所感:

- 現状の白ミラー探索は、勝率ループを大きく回すには重すぎる。
- 次の検証基盤は、5-10戦を一括で回すより、1-2 seed単位に分割して結果を積み上げる方が安定する。
- 強さ改善とは別に、AIベンチのタイムボックス/途中出力/分割実行が必要。

### root探索 prefilter 実験

仮説:

- `white_planner` は後段ゲートで不採用になる局面でも root 探索を走らせている。
- 既存 `white` の最善手に対して、互換差し替え候補がない局面では planner を起動しなくてよい。

実装したが、以下の結果から不採用にした。

| 条件 | seeds | games | 結果 |
| --- | --- | ---: | --- |
| root候補まで互換候補に絞る | 994300-994301 | 4 | `white_planner` 3勝 / `white` 1勝 |
| root候補まで互換候補に絞る | 994302-994303 | 4 | `white_planner` 1勝 / `white` 3勝 |
| root探索起動だけprefilter | 994300-994301 | 4 | `white_planner` 2勝 / `white` 2勝 |
| prefilterを戻す | 994300-994301 | 4 | `white_planner` 3勝 / `white` 1勝 |

結論:

- 候補フィルタは、以前なら「上位が互換外なので不採用」だった局面で、下位互換候補を採用できてしまい、弱化する可能性がある。
- 起動prefilterだけでも前回の強さを崩す可能性があった。
- 今回は prefilter を採用しない。

### 非リーサル顔打点ペナルティ

負けseed `994305 / challenger-as-player` では、終盤に以下の流れが見えた。

- プレイヤー側 `white_planner` は HP4、相手HP8。
- 相手盤面に Lv3 ダインとデスシープが残っている。
- プレイヤー側はドノマンティスで相手マスターを1点削り、その後シールド。
- 返しで CPU が Lv3 ダイン + デスシープにより詰めろを作り、次ターン勝利。

これは「白ミラーでは非リーサル顔打点より盤面制圧」という方針に反する可能性がある。

対応:

- `whiteMirrorThreatenedNonLethalFacePenalty` を実験チューニングとして追加した。
- ただしデフォルト白AIには入れていない。
- 単体テストでは、相手の返し打点でHP1以下まで落ちる非リーサル顔打点の評価が下がることを確認した。

デフォルト採用しない理由:

- 同じseedの方向別確認では、デフォルト適用時に `white_planner` が両方向で負けるケースが出た。
- 顔打点を抑える思想は正しいが、単純ペナルティだと詰めろ・終盤速度まで落とす恐れがある。
- 次に採用するなら「相手の次ターン最大打点源を処理できるか」「こちらの顔打点が詰めろへつながるか」を同時に見る必要がある。

## 現在の採用状況

採用:

- `whiteMirrorThreatenedNonLethalFacePenalty` を実験チューニング項目として追加。
- その単体テストを追加。

不採用:

- `white_planner` の root 探索 prefilter。
- 非リーサル顔打点ペナルティのデフォルト白AI適用。

維持:

- 前フェーズの `white_planner` 採用ゲート強化版をデフォルト挙動として維持。

## 検証

- `npm test -- tests/game/cpuAi.test.ts -- --testTimeout 60000`
- `npm run benchmark:ai -- --seed-start 994300 --count 2 --deck-preset master-lab-white-1377-death-sheep3 --player-master white --cpu-master white --baseline-ai white --challenger-ai white_planner --direction both --max-steps 420 --max-turns 100 --long-game-steps 300 --long-game-turns 80`
  - `white_planner` 3勝 / `white` 1勝
  - failures 0
  - warnings 1

## Next Loop Proposal

次はAI本体の係数を増やすより、検証基盤を先に改善する。

1. `benchmark:ai` に分割実行向けの途中出力、または1ゲーム完了ごとのartifact書き込みを追加する。
2. 長時間化seedを保存し、途中中断しても何seed目で詰まったか分かるようにする。
3. `white_planner` の採用差分だけを軽く収集する専用監査を作る。現行 `white-planner-phase2` は毎手 `white` と `white_planner` を両方読むため重すぎる。
4. 顔打点ペナルティは、次回「詰めろ接続あり/なし」「返し最大打点源を処理可能/不可能」で分けて再評価する。

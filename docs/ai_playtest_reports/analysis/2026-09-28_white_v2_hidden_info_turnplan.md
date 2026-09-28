# WhiteV2 情報公平性・全ターン計画・両席ベンチ

## 判定境界

通常CPU profileは、相手の初期デッキ構成は既知だが、相手の現在の手札/山札のpartitionと順序、準備中カードのidentity、山札乱数状態は未知として決定する。相手の手札・山札・準備中カードを合算した公開残存poolからcanonical sampleを作り、準備中は合法な通常monsterに再構築する。自分の山札順も未知扱いとする。明示的な `omniscient` profileだけが研究用途の例外。実際のルール適用は常に元のGameStateへ行う。

探索用stateはclone前に表示log/eventLogとAI/human review履歴を除外する。戦術判断に使うターン内move/master-action/rollout履歴は保持し、元stateは変更しない。

## LvUPを含むWhiteV2全ターン

pending LvUPは0/partial/full/superの合法choiceをすべて計画候補にし、choice解決のたびに残pendingを次branchへ渡す。handoffか勝利へ到達したplanだけを完成planとして比較する。探索budget終了時にpendingが残る候補は完成扱いしない。auto-play validatorはpartial choice後の盤面進捗を確認して次stepへ継続し、無進捗またはbounded limit超過のみfailureとする。

## 盾対象の旧fixture確認

CPU LvUP pending導入前に作られた白ミラーfixtureでは、旧期待の対象差がLvUP選択を含めると解消した。両候補は13 stepsで次CPU turn（turn 10）へ到達し、`pendingLevelUp=false`、勝者なし、rollout scoreはともに `-72`。したがってhorizon未到達の非対称ではなく、旧fixture上では応答評価が同点となったため、通常profileのfixtureは即時評価の合法選択を検証する形へ更新した。タイブレーク実装は変更していない。

別に、準備中identityへ依存していた旧早期fixtureは明示 `omniscient` に隔離した。通常profileの盾応答変更を示すfixtureは、公開状態だけの合法盤面で独立に検証する。

## 低石focusの旧長手順fixture

旧fixture seed `994322` の16-step prefixでは、以前の期待はend-turnだった。通常profileの公開情報探索では、実行経路が変わり、focusが `有効攻撃がないためためる / ターンプラン探索: 返し込み最終盤面143点、次点と61点差` で選ばれた（score 38、plan totalScore 178.35、代替点81.985、gap 61.052）。これは単なるgolden追従ではなく、現行の公開情報計画が次自ターンまでの盤面価値を変えた結果。旧長いprefixのassertionは独立した局面検証として使わず、以下のfresh snapshotでstone/handを消費しないfocus見送り意図を確認した。

fixture `tests/game/cpuAi.test.ts`「preserves stones and hand when a fresh public white-mirror snapshot rejects low-conversion focus」は、turn 3・白同士・CPU stone3/相手stone1・手札0枚。CPU前衛左右はダイン/ドノマンティスとも行動済み、後衛左のダインだけ未行動、相手前衛デスシープとダインは行動済み。normal `white_planner` は `end_turn` を選び、理由に `白ミラー序盤` を記録する。実適用後もCPU stone3と手札0枚を維持し、消費を伴う布石へ進まないことをassertする。

## ベンチ条件と解釈

固定seedを白baseline対白V2、白V2対現行黒pressureの両matchupで用い、candidateのplayer/cpu席を反転する。両席で同じseedとdeck presetを使う。全gameにprofile/deck/勝者または未決着理由/steps/turns/partial LvUP steps/issue/warning/elapsedを記録する。勝者なしは自然引分とは呼ばず、上限停止等の未決着として分ける。failureは勝者の有無によらず失敗とし、reportを書いた後にnon-zero exitする。

8試合smokeおよび40試合は機能・警告・実行時間の確認であり、少数試行から強さ/採用判断は行わない。`whiteLowStoneFocusMissedAttackPenalty: 8` はdefaultへ追加しない。

### 8試合smoke（seed 400-401）

結果は [smoke report](./2026-09-28_white_v2_seat_smoke.md) を参照。8/8決着、未決着0、failure 0。白baseline戦はcandidate 3勝、相手1勝、warning 14。黒pressure戦はcandidate 2勝、相手2勝、warning 10。elapsed平均はそれぞれ約114.5秒、49.9秒。全8試合の `partialLevelUpResolutionSteps` は0であり、partial継続分岐の実測証拠ではない。40試合は実行中。

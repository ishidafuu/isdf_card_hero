# 戦闘ルール分割設計

## 目的

`src/game/rules.ts` は通常カード126枚の効果、射程、ダメージ、ターン進行、対象選択、ログをまとめて持っている。
オリジナル要素やスペシャルカードを入れる前に、ルール追加で既存挙動を壊しにくい分割単位を決める。

この設計では、当面 `src/game/rules.ts` を公開ファサードとして残す。
`App`、`cpuAi`、`autoPlayValidation`、既存テストの import 先を一気に変えず、内部実装だけ段階的に `src/game/ruleEngine/` へ移す。

## 現状の責務

`rules.ts` の主な責務は次の通り。

| 領域 | 現在の主な関数 |
| --- | --- |
| ゲーム生成 | `createInitialGame`, `createPlayer`, `createSlots`, `createMonster`, `cloneState` |
| ターン進行 | `startTurn`, `endTurn`, `readyPreparedMonsters`, `autoAdvanceBackRow`, `resolveEndTurnFieldEffects` |
| プレイヤー行動 | `summonMonster`, `moveMonster`, `focusMonster`, `attackWithCommand`, `playMagic`, `useMasterAction`, `useMasterHpDraw` |
| 対象選択/射程 | `getCommandTargets`, `getMagicTargets`, `rangeTargets`, `isTargetInCommandRange`, `isOpponentMasterInCommandRange` |
| ダメージ/撃破 | `damageMonster`, `damageMasterByPower`, `decreaseMasterHp`, `defeatMonster`, `resolveLevelUp`, `performLevelUp` |
| カード効果 | `applyMagicEffect`, `applyUtilityCommandEffect`, `applyPostDamageCommandEffect`, `applyAfterDamageTraits` |
| 継続/状態効果 | `clearExpiredStartTurnEffects`, `clearExpiredEndTurnEffects`, `isMonsterActionBlocked`, `isSpecialCommandSealed` |
| 盤面/移動補助 | `PLAYER_SLOT_ORDER`, `FIELD_ORDER`, `distanceBetweenSlots`, `slotCoord`, `slotInFrontOf` |
| ログ/乱数 | `appendLog`, `appendRandomResultLog`, `randomChance`, `randomInt`, `shuffle` |

## 目標構成

最終的には次の構成を目指す。

```text
src/game/rules.ts                 公開ファサード。外部から使う関数だけをexportする。
src/game/ruleEngine/constants.ts   HP、コスト、盤面順などの定数。
src/game/ruleEngine/state.ts       初期化、clone、カード生成、手札/山札の基本操作。
src/game/ruleEngine/turn.ts        ターン開始/終了、準備中登場、自動前進、ターン効果。
src/game/ruleEngine/targeting.ts   射程、対象候補、二次対象、手札/山札選択候補。
src/game/ruleEngine/actions.ts     召喚、移動、ためる、攻撃、マジック、マスター行動の入口。
src/game/ruleEngine/damage.ts      ダメージ、撃破、レベルアップ、反動、マスターHP減少。
src/game/ruleEngine/effects.ts     継続効果、性格、被ダメージ時/死亡時/行動後効果。
src/game/ruleEngine/cardEffects.ts カードID別のマジック/固有技効果。
src/game/ruleEngine/field.ts       座標、距離、隣接、前後左右、盤面回転。
src/game/ruleEngine/log.ts         ログ整形、乱数結果ログ。
src/game/ruleEngine/random.ts      seed乱数、shuffle。
```

## 公開API方針

外部モジュールは原則として `src/game/rules.ts` だけを import する。

現在の外部利用元:

- `src/App.tsx`
- `src/game/cpuAi.ts`
- `src/game/autoPlayValidation.ts`
- `tests/game/*.test.ts`

分割中も、これらから `ruleEngine/*` を直接 import しない。
直接 import を許すのは、将来のテストで純粋関数を個別検証したい場合だけにする。

## 分割順

### Step 0: 定数と盤面順

状態: 完了。

- `src/game/ruleEngine/constants.ts` を追加。
- `MASTER_HP`、`HAND_LIMIT`、マスター行動コスト、`PLAYER_SLOT_ORDER`、`FIELD_ORDER` を移動。
- `rules.ts` は `PLAYER_SLOT_ORDER` と `FIELD_ORDER` を再exportし、既存APIを維持する。

### Step 1: ログ/乱数/clone

状態: 完了。

移動候補:

- `appendLog`
- `appendRandomResultLog`
- `cloneState`
- `randomChance`
- `randomInt`
- `nextRandom`
- `shuffle`
- `seededRandom`

注意点:

- `appendLog` は全領域から使うため、依存の底に置く。
- `cloneState` は外部から公開しない。アクション入口だけが clone する。

### Step 2: 盤面/射程

状態: 完了。ただし、対象列挙に近い `rangeTargets`、`targetToKey`、`isSameTarget` はStep 3側で扱う。

移動候補:

- `slotCoord`
- `masterCoord`
- `distanceBetweenSlots`
- `rangedDistanceBetweenSlots`
- `isOneSkipTarget`
- `isTwoSkipTarget`
- `isStraightTarget`
- `isLineTarget`
- `isKnightTarget`
- `isForward`
- `isTargetInCommandRange`
- `isOpponentMasterInCommandRange`

注意点:

- 射程判定はバグが起きやすいので、移動前後で既存の射程テストとオートプレイ検証を必ず通す。
- `targetToKey` はUI/検証で使うため、`rules.ts` から再exportする。

### Step 3: 対象選択

状態: 完了。

移動候補:

- `rangeTargets`
- `targetToKey`
- `isSameTarget`
- `getCommandTargets`
- `getMasterActionTargets`
- `getMagicTargets`
- `getMagicSecondaryTargets`
- `getCommandSecondaryTargets`
- `getMagicHandChoices`
- `getCommandHandChoices`
- `getMagicSearchCategories`

注意点:

- CPUは合法手列挙でこれらに依存する。
- 対象選択は効果解決と分離し、カード効果側で対象候補を再実装しない。

### Step 4: ダメージ/撃破

状態: 着手中。`src/game/ruleEngine/damage.ts` を追加し、`DamageContext`、マスターシールド後のダメージ計算、レベルアップ可能数の純粋計算を切り出した。追加で `src/game/ruleEngine/defeat.ts` を追加し、撃破時のストーン返却、捨て札/山札戻り、盤面からの除去を小分割した。

移動候補:

- `damageMasterByPower`
- `decreaseMasterHp`
- `damageMonster`
- `defeatMonster`
- `resolveLevelUp`
- `performLevelUp`
- `applyRecoil`
- `applyAfterDamageTraits`
- `applyDeathChainDamage`
- `applyDefeatCurses`

注意点:

- 反撃、死亡時、レベルアップ、ストーン返却が絡むため、ここは1コミットで大きく動かさない。
- `damage.ts` からカードID別効果へ依存し始めると循環しやすい。死亡時/被ダメージ時のtraitは `effects.ts` に寄せ、`damage.ts` から呼ぶ。

### Step 5: カード効果

移動候補:

- `applyMagicEffect`
- `applyUtilityCommandEffect`
- `applyPostDamageCommandEffect`
- `finishCommandSideEffects`
- `shouldCommandMiss`
- `getCommandBasePower`
- `consumeAttackPowerBonuses`
- カードID別 helper

注意点:

- カードID分岐は `cardEffects.ts` に集約する。
- 公式効果文、表示注記、実装効果がずれないよう、`docs/07_card_effect_coverage.md` と同時更新する。

### Step 6: アクション入口

移動候補:

- `summonMonster`
- `moveMonster`
- `focusMonster`
- `attackWithCommand`
- `playMagic`
- `useMasterAction`
- `useMasterHpDraw`
- `discardHandCard`
- `startTurn`
- `endTurn`

注意点:

- 入口関数は引き続き `rules.ts` から export する。
- UI/CPU/testが使う関数名は変えない。
- 入口で clone し、内部 helper は mutable state を受ける方針を維持する。

## 循環依存を避けるルール

- `ruleEngine/constants.ts` はどこにも依存しない。
- `log.ts` と `random.ts` は `types.ts` 以外に依存しない。
- `targeting.ts` は効果を解決しない。
- `damage.ts` はアクション入口を呼ばない。
- `cardEffects.ts` は対象候補を作らない。受け取った対象を解決するだけにする。
- `actions.ts` は公開入口として、`targeting`、`damage`、`effects`、`cardEffects` を組み合わせる。

## 検証ルール

分割コミットごとに最低限次を通す。

```bash
npm run build
npm test -- --run
npm run validate:auto-play -- --seed-start 400 --count 100
git diff --check
```

射程、ダメージ、カード効果を動かすコミットでは、関連する個別テストを先に増やしてから移動する。

## 次に進めるなら

次の実装ステップは Step 4 の継続。
`damageMonster`、`damageMasterByPower`、`resolveLevelUp` 周辺を小さく分け、反撃、死亡時、レベルアップ、ストーン返却のテストを先に固定してから `ruleEngine/damage.ts` / `ruleEngine/defeat.ts` へ移す。

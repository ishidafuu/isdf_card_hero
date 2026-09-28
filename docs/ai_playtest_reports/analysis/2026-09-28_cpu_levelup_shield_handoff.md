# CPU LvUP追加に伴う盾対象タイブレーク確認

短期実装でCPUの撃破後LvUPが即時自動処理からpending選択へ変わったため、白同士・低ストーンの盾対象タイブレークを再確認した。

旧fixtureでは、即時評価の候補は `cpu_front_left` / `cpu_front_right` の2つ。応答ロールアウトは両候補とも13 stepsで次のCPUターン（turn 10）へ到達し、`pendingLevelUp=false`、勝者なし、rollout scoreは両方 `-72` だった。したがってLvUP追加により一方だけがhorizon外になる非対称は起きていない。

差は応答後盤面ではなく、LvUP選択を含めると応答評価値が同値になった点にある。旧期待値の `cpu_front_right` と「盾対象応答評価」理由はこのfixtureでは成立しないため、回帰テストを `cpu_front_left` の合法選択と即時評価優先に更新した。タイブレーク実装自体は変更していない。

旧fixtureのhidden prepared identityをnormal AIから外すため、旧盤面は明示 `omniscient` のexact-info fixtureに限定し、即時選択 `player_front_left` を検証する。

通常profileの応答契約は別の合法snapshotで確認した。turn 12、白同士、こちらHP/stone 9/3、相手7/2。自軍前衛左ヤンバルLv2 HP3、右デスシープLv2 HP5、後衛左ボムゾウ準備中、後衛右ピグミィLv2 HP3 act1/2 focus、相手前衛ダインLv3 HP6 shield、ボムゾウ準備中、後衛左ピグミィLv1 HP3 act2/2。現fixtureではcandidateは盾対象を `player_front_right` から `player_front_left` へ変更し、理由「盾対象応答評価: 次自ターン167点、fallback比13点差」を記録する。clean cacheで同fixtureを評価し、tieSteps=0の比較と無関係なWhiteV2判断を挟んでwarm再評価しても理由文字列は一致した。過去のRoot診断にあった124点はこの現fixtureの反復値ではなく、異なる過去fixture条件での観測なので比較対象から分離する。これは旧fixtureのgolden追従ではなく、応答評価の有効な独立回帰。

該当するsnapshotの構成/期待値と既定判断への復帰は `tests/game/cpuAi.test.ts` の「changes a public white-mirror shield target after reading the next-turn response」でassertしている。

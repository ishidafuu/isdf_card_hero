# CPU LvUP追加に伴う盾対象タイブレーク確認

短期実装でCPUの撃破後LvUPが即時自動処理からpending選択へ変わったため、白同士・低ストーンの盾対象タイブレークを再確認した。

旧fixtureでは、即時評価の候補は `cpu_front_left` / `cpu_front_right` の2つ。応答ロールアウトは両候補とも13 stepsで次のCPUターン（turn 10）へ到達し、`pendingLevelUp=false`、勝者なし、rollout scoreは両方 `-72` だった。したがってLvUP追加により一方だけがhorizon外になる非対称は起きていない。

差は応答後盤面ではなく、LvUP選択を含めると応答評価値が同値になった点にある。旧期待値の `cpu_front_right` と「盾対象応答評価」理由はこのfixtureでは成立しないため、回帰テストを `cpu_front_left` の合法選択と即時評価優先に更新した。タイブレーク実装自体は変更していない。

ただし、この更新fixtureは応答評価による選択変更を検証しない。過去playtest traceには応答評価がfallbackを上回る実例が記録されているが、この確認では完全な入力状態を特定できず、同じ契約を検証する新しい再現fixtureは追加できていない。独立したresponse-reading回帰fixtureの追加は残件。

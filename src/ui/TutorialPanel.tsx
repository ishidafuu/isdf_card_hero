import type { TutorialStep } from "./tutorial";

const INSTRUCTIONS: Record<TutorialStep, { title: string; target: string; body: string }> = {
  0: {
    title: "1 / 3 · カードを配置する",
    target: "Your Hand → 空いているマス",
    body: "手札のモンスターを選び、青く光る空きマスを選ぶと召喚できます。カードをドラッグして置くこともできます。",
  },
  1: {
    title: "2 / 3 · ターンを終える",
    target: "End Turn",
    body: "召喚したカードは最初は準備中で、すぐには攻撃できません。End Turnで相手のターンを進め、登場を待ちましょう。",
  },
  2: {
    title: "相手のターンを処理中",
    target: "CPUの行動後、自分のターンへ",
    body: "準備中のカードは次の自分のターンに登場します。CPUが動いている間はそのままお待ちください。",
  },
  3: {
    title: "3 / 3 · 登場したカードを操作する",
    target: "自分の場のカード",
    body: "自分のモンスターを選ぶと、攻撃・移動・ためるなどの操作と対象候補が表示されます。対象を選ぶとチュートリアル完了です。End TurnでStoneや手札も補充できます。",
  },
};

interface TutorialPanelProps {
  step: TutorialStep;
  onSkip: () => void;
  onClose: () => void;
}

export function TutorialPanel({ step, onSkip, onClose }: TutorialPanelProps) {
  const instruction = INSTRUCTIONS[step];
  return (
    <aside className="first-run-tutorial" aria-label="初回対局チュートリアル">
      <div className="first-run-tutorial-heading">
        <div>
          <strong aria-live="polite">{instruction.title}</strong>
          <span>{instruction.target}</span>
        </div>
        <button type="button" onClick={onClose} aria-label="チュートリアルを一時的に閉じる">×</button>
      </div>
      <p>{instruction.body}</p>
      <div className="first-run-tutorial-actions">
        <button type="button" onClick={onSkip}>スキップして完了</button>
      </div>
    </aside>
  );
}

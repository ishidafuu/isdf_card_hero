import type { BattleWorkspaceMode } from "./modes";

interface ModeNavigationProps {
  mode: BattleWorkspaceMode;
  onSelect: (mode: BattleWorkspaceMode) => void;
}

const MODES: Array<{ id: BattleWorkspaceMode; icon: string; label: string }> = [
  { id: "play", icon: "🎮", label: "Play" },
  { id: "spectate", icon: "👁️", label: "Spectate" },
  { id: "analyze", icon: "📊", label: "Analyze" },
];

export function ModeNavigation({ mode, onSelect }: ModeNavigationProps) {
  return (
    <nav className="mode-navigation" aria-label="Game mode">
      {MODES.map((item) => (
        <button
          type="button"
          key={item.id}
          className={mode === item.id ? "selected" : ""}
          aria-current={mode === item.id ? "page" : undefined}
          onClick={() => onSelect(item.id)}
        >
          <span aria-hidden="true">{item.icon}</span> {item.label}
        </button>
      ))}
    </nav>
  );
}

import { useEffect, useRef, useState } from "react";
import type { CpuAiProfile, CpuAiProfiles } from "../game/cpuAiTypes";
import { CPU_AI_PROFILES } from "../game/cpuAiTypes";
import type { SessionControllers } from "../sessions/types";

interface BranchSessionSetupProps {
  cursor: number;
  defaults: { controllerBySeat: SessionControllers; profiles: CpuAiProfiles };
  onStart: (cursor: number, controllers: SessionControllers, profiles: CpuAiProfiles) => void;
  onCancel?: () => void;
  label?: string;
}

export function BranchSessionSetup({ cursor, defaults, onStart, onCancel, label = "検証済み局面" }: BranchSessionSetupProps) {
  const [controllers, setControllers] = useState<SessionControllers>(defaults.controllerBySeat);
  const [profiles, setProfiles] = useState<CpuAiProfiles>(defaults.profiles);
  const setupRef = useRef<HTMLElement>(null);
  const firstControllerRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setupRef.current?.scrollIntoView?.({ block: "nearest", behavior: "auto" });
    firstControllerRef.current?.focus({ preventScroll: true });
  }, [cursor]);

  return (
    <section ref={setupRef} className="coach-branch-setup" aria-label="分岐対戦の設定">
      <h4>{label}から新しい対局</h4>
      <p>元Journalは変更せず、新しい対局を作ります。席ごとの操作担当とCPU profileを明示してください。</p>
      {(["player", "cpu"] as const).map((seat) => (
        <fieldset key={seat}>
          <legend>{seat === "player" ? "席1" : "席2"}</legend>
          <label>
            操作担当
            <select ref={seat === "player" ? firstControllerRef : undefined} aria-label={`${seat === "player" ? "席1" : "席2"}の操作担当`} value={controllers[seat]} onChange={(event) => setControllers((current) => ({ ...current, [seat]: event.target.value as "human" | "cpu" }))}>
              <option value="human">人間</option>
              <option value="cpu">CPU</option>
            </select>
          </label>
          <label>
            CPU profile
            <select aria-label={`${seat === "player" ? "席1" : "席2"}のCPU profile`} value={profiles[seat]} onChange={(event) => setProfiles((current) => ({ ...current, [seat]: event.target.value as CpuAiProfile }))}>
              {CPU_AI_PROFILES.map((profile) => <option key={profile} value={profile}>{profile}</option>)}
            </select>
          </label>
        </fieldset>
      ))}
      <div>
        <button type="button" onClick={() => onStart(cursor, controllers, profiles)}>局面を検証して分岐対戦を開始</button>
        {onCancel && <button type="button" onClick={onCancel}>キャンセル</button>}
      </div>
    </section>
  );
}

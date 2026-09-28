import { useState } from "react";
import type { CpuAiProfiles } from "../game/cpuAiTypes";
import { CPU_AI_PROFILES } from "../game/cpuAiTypes";
import type { ExperimentContextV1, ExperimentalMasterId } from "../game/experimentalContext";
import type { DeckPresetId } from "../game/deckPresets";
import type { MasterId, PlayerId } from "../game/types";
import type { SessionControllers } from "../sessions/types";
import { DECK_PRESETS } from "../game/deckPresets";

export interface ExperimentalLaunchOptions {
  seed: number;
  firstPlayer: PlayerId;
  controllerBySeat: SessionControllers;
  experimentalContext: ExperimentContextV1;
  profiles: CpuAiProfiles;
  masters: Record<PlayerId, MasterId>;
  deckPresetBySeat: Record<PlayerId, DeckPresetId>;
}

interface ExperimentalSessionSetupProps {
  busy?: boolean;
  defaults: { seed: number; profiles: CpuAiProfiles; masters: Record<PlayerId, MasterId> };
  onStart: (options: ExperimentalLaunchOptions) => void;
}

const STANDARD_MASTER = "standard";

export function ExperimentalSessionSetup({ busy = false, defaults, onStart }: ExperimentalSessionSetupProps) {
  const [seedText, setSeedText] = useState(String(defaults.seed));
  const [firstPlayer, setFirstPlayer] = useState<PlayerId>("player");
  const [controllers, setControllers] = useState<SessionControllers>({ player: "human", cpu: "cpu" });
  const [overlays, setOverlays] = useState<Record<PlayerId, ExperimentalMasterId | typeof STANDARD_MASTER>>({ player: "decoy", cpu: "timing" });
  const [profiles, setProfiles] = useState<CpuAiProfiles>(defaults.profiles);
  const [masters, setMasters] = useState<Record<PlayerId, MasterId>>(defaults.masters);
  const [deckPresets, setDeckPresets] = useState<Record<PlayerId, DeckPresetId>>({ player: "balanced-normal", cpu: "balanced-normal" });
  const seed = Number(seedText.trim());
  const hasOverlay = overlays.player !== STANDARD_MASTER || overlays.cpu !== STANDARD_MASTER;
  const canStart = seedText.trim().length > 0 && Number.isSafeInteger(seed) && seed >= 0 && seed <= 999_999_999 && hasOverlay && !busy;

  return (
    <section className="experimental-session-setup" aria-labelledby="experimental-session-title">
      <div>
        <p className="eyebrow">RESEARCH ONLY · NOT STANDARD MATCHMAKING</p>
        <h3 id="experimental-session-title">Experimental対戦</h3>
        <p>能力overlay・両席の操作担当・盤面初期条件をこのSessionへ固定します。開始後、次戦設定の変更では書き換わりません。</p>
      </div>
      <div className="experimental-session-fields">
        <label>Seed
          <input aria-label="Experimental seed" inputMode="numeric" value={seedText} onChange={(event) => setSeedText(event.target.value)} aria-invalid={seedText.trim().length > 0 && (seed > 999_999_999 || !Number.isSafeInteger(seed))} />
        </label>
        <label>先攻
          <select aria-label="Experimental first player" value={firstPlayer} onChange={(event) => setFirstPlayer(event.target.value as PlayerId)}>
            <option value="player">席1</option><option value="cpu">席2</option>
          </select>
        </label>
      </div>
      {(["player", "cpu"] as const).map((seat) => (
        <fieldset key={seat}>
          <legend>{seat === "player" ? "席1" : "席2"}</legend>
          <label>操作担当
            <select aria-label={`${seat === "player" ? "席1" : "席2"} Experimental操作担当`} value={controllers[seat]} onChange={(event) => setControllers((current) => ({ ...current, [seat]: event.target.value as "human" | "cpu" }))}>
              <option value="human">人間</option><option value="cpu">CPU</option>
            </select>
          </label>
          <label>master能力
            <select aria-label={`${seat === "player" ? "席1" : "席2"} Experimental master能力`} value={overlays[seat]} onChange={(event) => setOverlays((current) => ({ ...current, [seat]: event.target.value as ExperimentalMasterId | typeof STANDARD_MASTER }))}>
              <option value={STANDARD_MASTER}>通常</option><option value="decoy">Decoy</option><option value="timing">Timing</option>
            </select>
          </label>
          <label>通常master identity
            <select aria-label={`${seat === "player" ? "席1" : "席2"} base master`} value={masters[seat]} onChange={(event) => setMasters((current) => ({ ...current, [seat]: event.target.value as MasterId }))}>
              <option value="white">White</option><option value="black">Black</option>
            </select>
          </label>
          <label>Deck preset
            <select aria-label={`${seat === "player" ? "席1" : "席2"} Experimental deck preset`} value={deckPresets[seat]} onChange={(event) => setDeckPresets((current) => ({ ...current, [seat]: event.target.value as DeckPresetId }))}>
              {DECK_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}</option>)}
            </select>
          </label>
          {controllers[seat] === "cpu" && <label>CPU profile
            <select aria-label={`${seat === "player" ? "席1" : "席2"} Experimental CPU profile`} value={profiles[seat]} onChange={(event) => setProfiles((current) => ({ ...current, [seat]: event.target.value as CpuAiProfiles[PlayerId] }))}>
              {CPU_AI_PROFILES.map((profile) => <option key={profile} value={profile}>{profile}</option>)}
            </select>
          </label>}
        </fieldset>
      ))}
      {seedText.trim().length > 0 && (!Number.isSafeInteger(seed) || seed < 0 || seed > 999_999_999) && <p role="alert">Seedは0〜999999999の整数で入力してください。</p>}
      {!hasOverlay && <p role="alert">少なくとも一方の席にDecoyまたはTiming overlayを指定してください。</p>}
      <button type="button" disabled={!canStart} onClick={() => onStart({
        seed,
        firstPlayer,
        controllerBySeat: controllers,
        experimentalContext: {
          format: "isdf-card-hero-experiment-context",
          version: 1,
          rulesProfileId: "experimental-decoy-timing-v1",
          masterOverlayBySeat: {
            ...(overlays.player === STANDARD_MASTER ? {} : { player: overlays.player }),
            ...(overlays.cpu === STANDARD_MASTER ? {} : { cpu: overlays.cpu }),
          },
        },
        profiles,
        masters,
        deckPresetBySeat: deckPresets,
      })}>明示設定でExperimental sessionを開始</button>
    </section>
  );
}

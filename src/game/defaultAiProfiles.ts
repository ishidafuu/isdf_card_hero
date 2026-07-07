import type { CpuAiProfile, CpuAiProfiles } from "./cpuAiTypes";

export const DEFAULT_PLAYER_AI_PROFILE = "stable" satisfies CpuAiProfile;
export const DEFAULT_CPU_AI_PROFILE = "white_planner" satisfies CpuAiProfile;

export function createDefaultAiProfiles(): CpuAiProfiles {
  return {
    player: DEFAULT_PLAYER_AI_PROFILE,
    cpu: DEFAULT_CPU_AI_PROFILE,
  };
}

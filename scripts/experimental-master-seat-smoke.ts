import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { validateAutoPlay, type AutoPlayIssue } from "../src/game/autoPlayValidation";
import type { CpuAiProfile } from "../src/game/cpuAi";
import type { ExperimentContextV1, ExperimentalMasterId } from "../src/game/experimentalContext";
import type { DeckPresetId } from "../src/game/deckPresets";
import type { MasterId, PlayerId } from "../src/game/types";

type Seat = PlayerId;
type Matchup = "white-baseline" | "black-pressure";

interface GameRecord {
  matchup: Matchup;
  overlay: ExperimentalMasterId;
  overlaySeat: Seat;
  seed: number;
  playerMaster: MasterId;
  cpuMaster: MasterId;
  playerProfile: CpuAiProfile;
  cpuProfile: CpuAiProfile;
  playerDeck: DeckPresetId;
  cpuDeck: DeckPresetId;
  winner?: Seat;
  winnerProfile?: CpuAiProfile;
  status: "completed" | "limited" | "failed";
  steps: number;
  turns: number;
  elapsedMs: number;
  partialLevelUpResolutionSteps: number;
  experimentalActionCount: number;
  experimentalActionCounts: Record<string, number>;
  issues: Array<Pick<AutoPlayIssue, "kind" | "severity" | "step" | "turnNumber" | "message">>;
}

const seedStart = 9300;
const count = 2;
const maxSteps = 400;
const maxTurns = 100;
const whiteDeck: DeckPresetId = "master-lab-white-1377-death-sheep3";
const blackDeck: DeckPresetId = "black-pressure";
const games: GameRecord[] = [];

for (const matchup of ["white-baseline", "black-pressure"] as const) {
  for (const overlay of ["decoy", "timing"] as const) {
    for (const overlaySeat of ["player", "cpu"] as const) {
      const playerIsCandidate = overlaySeat === "player";
      const playerMaster: MasterId = matchup === "black-pressure" && !playerIsCandidate ? "black" : "white";
      const cpuMaster: MasterId = matchup === "black-pressure" && playerIsCandidate ? "black" : "white";
      const playerProfile: CpuAiProfile = playerIsCandidate ? "white" : matchup === "white-baseline" ? "white" : "strong";
      const cpuProfile: CpuAiProfile = !playerIsCandidate ? "white" : matchup === "white-baseline" ? "white" : "strong";
      const playerDeck = matchup === "black-pressure" && !playerIsCandidate ? blackDeck : whiteDeck;
      const cpuDeck = matchup === "black-pressure" && playerIsCandidate ? blackDeck : whiteDeck;
      const experiment: ExperimentContextV1 = {
        format: "isdf-card-hero-experiment-context",
        version: 1,
        rulesProfileId: "experimental-decoy-timing-v1",
        masterOverlayBySeat: { [overlaySeat]: overlay },
      };
      const result = validateAutoPlay({
        seedStart,
        count,
        maxSteps,
        maxTurns,
        longGameSteps: maxSteps,
        longGameTurns: maxTurns,
        masterIds: { player: playerMaster, cpu: cpuMaster },
        aiProfiles: { player: playerProfile, cpu: cpuProfile },
        playerDeckPreset: playerDeck,
        cpuDeckPreset: cpuDeck,
        experimentalContext: experiment,
        includeGameHistory: true,
        historyLimit: maxSteps,
        onGameResult: (game) => {
          console.log(`[game] ${matchup} ${overlay}@${overlaySeat} seed=${game.seed} winner=${game.winner ?? "no-winner"} steps=${game.steps} failures=${game.issueCount} warnings=${game.warningCount}`);
        },
      });
      for (const game of result.games) {
        const issues = result.issues.filter((issue) => issue.seed === game.seed).map((issue) => ({
          kind: issue.kind,
          severity: issue.severity,
          step: issue.step,
          turnNumber: issue.turnNumber,
          message: issue.message,
        }));
        const winnerProfile = game.winner === "player" ? playerProfile : game.winner === "cpu" ? cpuProfile : undefined;
        const experimentalActionCounts: Record<string, number> = {};
        for (const event of game.history ?? []) {
          const match = /^experimental:(decoy|timing):([a-z0-9_]+)$/.exec(event.decision);
          if (!match) continue;
          const key = `${match[1]}:${match[2]}`;
          experimentalActionCounts[key] = (experimentalActionCounts[key] ?? 0) + 1;
        }
        games.push({
          matchup,
          overlay,
          overlaySeat,
          seed: game.seed,
          playerMaster,
          cpuMaster,
          playerProfile,
          cpuProfile,
          playerDeck,
          cpuDeck,
          winner: game.winner,
          winnerProfile,
          status: game.issueCount > 0 ? "failed" : game.winner ? "completed" : "limited",
          steps: game.steps,
          turns: game.turns,
          elapsedMs: game.elapsedMs,
          partialLevelUpResolutionSteps: game.partialLevelUpResolutionSteps,
          experimentalActionCount: Object.values(experimentalActionCounts).reduce((sum, count) => sum + count, 0),
          experimentalActionCounts,
          issues,
        });
      }
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  configuration: {
    seedStart,
    count,
    seedEnd: seedStart + count - 1,
    maxSteps,
    maxTurns,
    overlays: ["decoy", "timing"],
    matchups: ["white-baseline", "black-pressure"],
    candidateProfile: "white" as const,
    whiteBaselineProfile: "white" as const,
    blackOpponentProfile: "strong" as const,
    whiteDeck,
    blackDeck,
    games: games.length,
  },
  summary: ["white-baseline", "black-pressure"].map((matchup) => {
    const selected = games.filter((game) => game.matchup === matchup);
    return {
      matchup,
      games: selected.length,
      completed: selected.filter((game) => game.status === "completed").length,
      limited: selected.filter((game) => game.status === "limited").length,
      failed: selected.reduce((total, game) => total + game.issues.filter((issue) => issue.severity === "failure").length, 0),
      warnings: selected.reduce((total, game) => total + game.issues.filter((issue) => issue.severity === "warning").length, 0),
      overlaySeatWins: selected.filter((game) => game.winner === game.overlaySeat).length,
      winsByOverlay: Object.fromEntries(["decoy", "timing"].map((overlay) => [overlay, selected.filter((game) => game.overlay === overlay && game.winner === game.overlaySeat).length])),
      bySeat: Object.fromEntries(["player", "cpu"].map((seat) => [seat, {
        games: selected.filter((game) => game.overlaySeat === seat).length,
        overlayWins: selected.filter((game) => game.overlaySeat === seat && game.winner === seat).length,
      }])),
      averageElapsedMs: Math.round(selected.reduce((total, game) => total + game.elapsedMs, 0) / Math.max(1, selected.length)),
      experimentalActionCount: selected.reduce((total, game) => total + game.experimentalActionCount, 0),
      experimentalActionCounts: Object.fromEntries([...new Set(selected.flatMap((game) => Object.keys(game.experimentalActionCounts)))].sort().map((key) => [
        key,
        selected.reduce((total, game) => total + (game.experimentalActionCounts[key] ?? 0), 0),
      ])),
    };
  }),
  limitations: [
    "16局の機能スモークであり、勝敗や勝率は実験能力の強さ/バランスを証明しない。",
    "各seedで席を反転しているが、乱数系列・deck draw順・agentの探索は完全対称ではない。",
    "warningは対局内の両AI診断合計。候補overlay固有の誤判断件数ではない。elapsedMsはマシン負荷依存。",
    "experimentalActionCountsはjournal対象対局内の両seatが実際に選んだ能力の合計。Exchangeで相手seatが借用能力を使う場合も含み、候補seatだけの使用回数ではない。",
    "overlayはversioned experimental contextを用い、標準MasterId white/blackは維持。未定義sacrificeは含めない。",
  ],
  games,
};

const jsonPath = "docs/ai_playtest_reports/analysis/2026-09-29_experimental_master_smoke.json";
const markdownPath = "docs/ai_playtest_reports/analysis/2026-09-29_experimental_master_smoke.md";
await mkdir(dirname(jsonPath), { recursive: true });
await writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(markdownPath, formatMarkdown(report));
console.log(`Saved ${jsonPath} and ${markdownPath}`);
if (games.some((game) => game.status === "failed")) process.exitCode = 1;

function formatMarkdown(value: typeof report): string {
  const lines = [
    "# Experimental master both-seat smoke",
    "",
    `Generated: ${value.generatedAt}`,
    `Seeds: ${seedStart}-${seedStart + count - 1}; games=${games.length}; limits=${maxSteps} steps/${maxTurns} turns`,
    `Profile: overlay/white=${value.configuration.candidateProfile}; white baseline=${value.configuration.whiteBaselineProfile}; black opponent=${value.configuration.blackOpponentProfile}`,
    `Decks: white=${whiteDeck}; black=${blackDeck}`,
    "",
    "## Summary",
    "",
    "| matchup | games | completed | limited | failures | warnings | overlay-seat wins | player-seat wins / games | cpu-seat wins / games | chosen experimental actions | avg ms |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: |",
  ];
  for (const row of value.summary) {
    const abilityCounts = Object.entries(row.experimentalActionCounts).map(([key, count]) => `${key}=${count}`).join(", ") || "none";
    lines.push(`| ${row.matchup} | ${row.games} | ${row.completed} | ${row.limited} | ${row.failed} | ${row.warnings} | ${row.overlaySeatWins} | ${row.bySeat.player.overlayWins}/${row.bySeat.player.games} | ${row.bySeat.cpu.overlayWins}/${row.bySeat.cpu.games} | ${row.experimentalActionCount} (${abilityCounts}) | ${row.averageElapsedMs} |`);
  }
  lines.push("", "## Every game", "", "| matchup | overlay | seat | seed | master P/CPU | profile P/CPU | deck P/CPU | result | status | steps / turns | partial LvUP | ms | chosen experimental actions; issues |", "| --- | --- | --- | ---: | --- | --- | --- | --- | --- | ---: | ---: | ---: | --- |");
  for (const game of games) {
    const winner = game.winner ? `${game.winnerProfile}/${game.winner}` : "no-winner";
    const issueText = game.issues.map((issue) => `${issue.severity}:${issue.kind}@${issue.step}`).join(", ") || "—";
    const abilityCounts = Object.entries(game.experimentalActionCounts).map(([key, count]) => `${key}=${count}`).join(", ") || "none";
    lines.push(`| ${game.matchup} | ${game.overlay} | ${game.overlaySeat} | ${game.seed} | ${game.playerMaster}/${game.cpuMaster} | ${game.playerProfile}/${game.cpuProfile} | ${game.playerDeck}/${game.cpuDeck} | ${winner} | ${game.status} | ${game.steps}/${game.turns} | ${game.partialLevelUpResolutionSteps} | ${game.elapsedMs} | ${game.experimentalActionCount} (${abilityCounts}); ${issueText} |`);
  }
  lines.push("", "## Limitations", "", ...value.limitations.map((item) => `- ${item}`), "", "Rerun: `npx vite-node scripts/experimental-master-seat-smoke.ts`", "");
  return lines.join("\n");
}

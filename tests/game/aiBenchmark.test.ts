import { describe, expect, it } from "vitest";
import { benchmarkAiProfiles, formatAiBenchmarkSummary } from "../../src/game/aiBenchmark";

describe("ai benchmark", () => {
  it("runs mirrored AI profile comparisons and aggregates outcomes", () => {
    const result = benchmarkAiProfiles({
      seedStart: 430,
      count: 1,
      maxSteps: 1,
      maxTurns: 160,
    });

    expect(result.runs.map((run) => run.direction)).toEqual(["challenger-as-cpu", "challenger-as-player"]);
    expect(result.options.baselineProfile).toBe("stable");
    expect(result.options.challengerProfile).toBe("strong");
    expect(result.summary.games).toBe(2);
    expect(result.summary.profileWins.stable + result.summary.profileWins.strong + result.summary.undecided).toBe(2);
    expect(result.summary.failures).toBeGreaterThan(0);
  });

  it("formats the benchmark summary with per-direction profiles", () => {
    const result = benchmarkAiProfiles({
      seedStart: 430,
      count: 1,
      maxSteps: 1,
      maxTurns: 160,
      directions: ["challenger-as-cpu"],
    });

    const summary = formatAiBenchmarkSummary(result);

    expect(summary).toContain("AI benchmark: FAIL");
    expect(summary).toContain("Profiles: baseline stable, challenger strong");
    expect(summary).toContain("challenger as cpu: player stable, cpu strong");
  });

  it("can include final game history for benchmark artifacts", () => {
    const result = benchmarkAiProfiles({
      seedStart: 430,
      count: 1,
      maxSteps: 1,
      maxTurns: 160,
      includeGameHistory: true,
      directions: ["challenger-as-cpu"],
    });

    expect(result.runs[0].outcomes[0].history?.length).toBeGreaterThan(0);
    expect(result.runs[0].outcomes[0].stateSummary?.currentPlayer).toBeDefined();
    expect(result.runs[0].outcomes[0].logTail?.length).toBeGreaterThan(0);
  });

  it("rejects identical baseline and challenger profiles", () => {
    expect(() =>
      benchmarkAiProfiles({
        baselineProfile: "stable",
        challengerProfile: "stable",
      }),
    ).toThrow("must differ");
  });
});

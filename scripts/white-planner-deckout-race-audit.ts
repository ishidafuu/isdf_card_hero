import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { average, escapeMarkdownTableCell, formatPercent, readInteger, readString, round, writeReport } from "./lib/cli";

type PlayerId = "player" | "cpu";
type Direction = "challenger-as-cpu" | "challenger-as-player";

interface CliOptions {
  artifactDirs: string[];
  deckThreshold: number;
  maxSamples: number;
  markdownPath?: string;
  jsonPath?: string;
}

interface PlayerSummary {
  hp: number;
  stones: number;
  hand: number;
  deck: number;
  discard: number;
}

interface DecisionEvent {
  seed: number;
  step: number;
  turnNumber: number;
  player: PlayerId;
  decision: string;
  reason: string;
  before: {
    players: Record<PlayerId, PlayerSummary>;
  };
  after: {
    players: Record<PlayerId, PlayerSummary>;
  };
  newLog: string[];
}

interface GameArtifact {
  direction: Direction;
  seed: number;
  winner?: PlayerId;
  winnerProfile?: string;
  steps: number;
  turns: number;
  issueCount: number;
  warningCount: number;
  logTail?: string[];
  history?: DecisionEvent[];
  finalState?: {
    players: Record<PlayerId, PlayerSummary>;
  };
  issues?: Array<{ kind: string; severity: string; message: string }>;
}

interface DeckoutRaceSample {
  seed: number;
  direction: Direction;
  winnerProfile?: string;
  step: number;
  turn: number;
  player: PlayerId;
  plannerTurn: boolean;
  decision: string;
  reason: string;
  hp: string;
  deck: string;
  stones: string;
  selectedEndTurn: boolean;
  selectedFaceDamage: boolean;
  deckoutLog: boolean;
}

interface GameDeckoutAudit {
  seed: number;
  direction: Direction;
  winnerProfile?: string;
  steps: number;
  turns: number;
  plannerWon: boolean;
  deckoutFinish: boolean;
  plannerDeckoutLoss: boolean;
  warningKinds: string[];
  plannerEvents: number;
  plannerEndTurns: number;
  plannerFaceDamage: number;
}

interface DeckoutRaceAuditReport {
  generatedAt: string;
  artifactDirs: string[];
  deckThreshold: number;
  games: number;
  summary: {
    plannerWins: number;
    whiteWins: number;
    deckoutFinishes: number;
    plannerDeckoutLosses: number;
    warnings: number;
    averageSteps: number;
    averageTurns: number;
    plannerDeckoutEvents: number;
    plannerEndTurnsNearDeckout: number;
    plannerFaceDamageNearDeckout: number;
  };
  gamesDetail: GameDeckoutAudit[];
  samples: DeckoutRaceSample[];
  conclusion: string[];
  nextLoopProposal: string[];
}

const options = parseArgs(process.argv.slice(2));
const report = runAudit(options);
const markdown = formatMarkdown(report);

if (options.markdownPath) {
  await writeReport(options.markdownPath, markdown);
}
if (options.jsonPath) {
  await writeReport(options.jsonPath, JSON.stringify(report, null, 2));
}

console.log(`White planner deckout race audit: ${report.games} games`);
console.log(
  `planner ${report.summary.plannerWins}-${report.summary.whiteWins}, ` +
    `deckout finishes ${report.summary.deckoutFinishes}, ` +
    `planner deckout losses ${report.summary.plannerDeckoutLosses}`,
);
if (options.markdownPath) {
  console.log(`Markdown: ${options.markdownPath}`);
}
if (options.jsonPath) {
  console.log(`JSON: ${options.jsonPath}`);
}

function runAudit(options: CliOptions): DeckoutRaceAuditReport {
  const artifacts = readArtifacts(options.artifactDirs);
  const gamesDetail = artifacts.map((artifact) => auditGame(artifact, options.deckThreshold));
  const samples = artifacts
    .flatMap((artifact) => deckoutSamplesForGame(artifact, options.deckThreshold))
    .slice(0, options.maxSamples);
  const plannerWins = artifacts.filter((artifact) => artifact.winnerProfile === "white_planner").length;
  const whiteWins = artifacts.filter((artifact) => artifact.winnerProfile === "white").length;
  const report: DeckoutRaceAuditReport = {
    generatedAt: new Date().toISOString(),
    artifactDirs: options.artifactDirs,
    deckThreshold: options.deckThreshold,
    games: artifacts.length,
    summary: {
      plannerWins,
      whiteWins,
      deckoutFinishes: gamesDetail.filter((game) => game.deckoutFinish).length,
      plannerDeckoutLosses: gamesDetail.filter((game) => game.plannerDeckoutLoss).length,
      warnings: artifacts.reduce((total, artifact) => total + (artifact.issues ?? []).filter((issue) => issue.severity === "warning").length, 0),
      averageSteps: round(average(artifacts.map((artifact) => artifact.steps)), 1),
      averageTurns: round(average(artifacts.map((artifact) => artifact.turns)), 1),
      plannerDeckoutEvents: gamesDetail.reduce((total, game) => total + game.plannerEvents, 0),
      plannerEndTurnsNearDeckout: gamesDetail.reduce((total, game) => total + game.plannerEndTurns, 0),
      plannerFaceDamageNearDeckout: gamesDetail.reduce((total, game) => total + game.plannerFaceDamage, 0),
    },
    gamesDetail,
    samples,
    conclusion: [],
    nextLoopProposal: [],
  };
  report.conclusion = buildConclusion(report);
  report.nextLoopProposal = buildNextLoopProposal(report);
  return report;
}

function readArtifacts(dirs: readonly string[]): GameArtifact[] {
  return dirs
    .flatMap((dir) =>
      readdirSync(dir)
        .filter((entry) => entry.endsWith(".json"))
        .map((entry) => join(dir, entry))
        .filter((path) => statSync(path).isFile()),
    )
    .sort()
    .map((path) => JSON.parse(readFileSync(path, "utf8")) as Partial<GameArtifact>)
    .filter((artifact): artifact is GameArtifact =>
      typeof artifact.seed === "number" &&
      (artifact.direction === "challenger-as-cpu" || artifact.direction === "challenger-as-player") &&
      Array.isArray(artifact.history),
    );
}

function auditGame(artifact: GameArtifact, deckThreshold: number): GameDeckoutAudit {
  const plannerSide = plannerPlayerForDirection(artifact.direction);
  const events = deckoutSamplesForGame(artifact, deckThreshold).filter((sample) => sample.plannerTurn);
  return {
    seed: artifact.seed,
    direction: artifact.direction,
    winnerProfile: artifact.winnerProfile,
    steps: artifact.steps,
    turns: artifact.turns,
    plannerWon: artifact.winnerProfile === "white_planner",
    deckoutFinish: isDeckoutFinish(artifact),
    plannerDeckoutLoss: artifact.winnerProfile === "white" && isDeckoutFinish(artifact) && artifact.winner !== plannerSide,
    warningKinds: (artifact.issues ?? []).filter((issue) => issue.severity === "warning").map((issue) => issue.kind),
    plannerEvents: events.length,
    plannerEndTurns: events.filter((sample) => sample.selectedEndTurn).length,
    plannerFaceDamage: events.filter((sample) => sample.selectedFaceDamage).length,
  };
}

function deckoutSamplesForGame(artifact: GameArtifact, deckThreshold: number): DeckoutRaceSample[] {
  const plannerSide = plannerPlayerForDirection(artifact.direction);
  return (artifact.history ?? [])
    .filter((event) => isDeckoutRaceEvent(event, deckThreshold))
    .map((event) => {
      const current = event.before.players[event.player];
      const opponent = event.before.players[opponentOf(event.player)];
      return {
        seed: artifact.seed,
        direction: artifact.direction,
        winnerProfile: artifact.winnerProfile,
        step: event.step,
        turn: event.turnNumber,
        player: event.player,
        plannerTurn: event.player === plannerSide,
        decision: event.decision,
        reason: event.reason,
        hp: `${current.hp}/${opponent.hp}`,
        deck: `${current.deck}/${opponent.deck}`,
        stones: `${current.stones}/${opponent.stones}`,
        selectedEndTurn: event.decision === "end_turn",
        selectedFaceDamage: event.decision.includes("->master:"),
        deckoutLog: event.newLog.some((entry) => entry.includes("山札切れ")),
      };
    });
}

function isDeckoutRaceEvent(event: DecisionEvent, deckThreshold: number): boolean {
  return (
    event.before.players.player.deck <= deckThreshold ||
    event.before.players.cpu.deck <= deckThreshold ||
    event.after.players.player.deck <= deckThreshold ||
    event.after.players.cpu.deck <= deckThreshold ||
    event.newLog.some((entry) => entry.includes("山札切れ"))
  );
}

function isDeckoutFinish(artifact: GameArtifact): boolean {
  return (artifact.logTail ?? []).some((entry) => entry.includes("山札切れ"));
}

function plannerPlayerForDirection(direction: Direction): PlayerId {
  return direction === "challenger-as-cpu" ? "cpu" : "player";
}

function opponentOf(player: PlayerId): PlayerId {
  return player === "player" ? "cpu" : "player";
}

function buildConclusion(report: DeckoutRaceAuditReport): string[] {
  const lines: string[] = [];
  lines.push(
    `white_planner は ${report.summary.plannerWins}-${report.summary.whiteWins}、勝率 ${formatPercent(report.summary.plannerWins / Math.max(1, report.games))}。`,
  );
  lines.push(
    `deckout finish は ${report.summary.deckoutFinishes}/${report.games}、そのうち planner の deckout loss は ${report.summary.plannerDeckoutLosses}。`,
  );
  if (report.summary.plannerDeckoutLosses > 0) {
    lines.push("deckout race は実際に負け筋として出ており、終盤評価を単独監査する価値がある。");
  }
  if (report.summary.plannerEndTurnsNearDeckout > report.summary.plannerFaceDamageNearDeckout) {
    lines.push("山札切れ付近では planner の end_turn が顔打点より多い。これが正しい待ちか、詰め損ねかを分岐再生で確認する。");
  }
  return lines;
}

function buildNextLoopProposal(report: DeckoutRaceAuditReport): string[] {
  const proposals = [
    "planner が負けた deckout finish seed を分岐再生し、end_turn / face damage / monster attack の勝敗差を直接比較する。",
    "deckout race 用の実験チューニングは、相手より先に山札切れで死ぬ局面だけに限定する。",
    "long_game の勝ちseedは、勝っているが決着が遅いだけか、詰めを逃しているかを別に見る。",
  ];
  if (report.summary.plannerDeckoutLosses === 0) {
    proposals.unshift("今回範囲では planner の deckout loss がないため、deckout係数の採用は見送り、監査だけ継続する。");
  }
  return proposals;
}

function formatMarkdown(report: DeckoutRaceAuditReport): string {
  const lines = [
    "# White Planner Deckout Race Audit",
    "",
    `生成: ${report.generatedAt}`,
    `deck threshold: ${report.deckThreshold}`,
    "",
    "## Summary",
    "",
    "| item | value |",
    "| --- | ---: |",
    `| games | ${report.games} |`,
    `| white_planner wins | ${report.summary.plannerWins} |`,
    `| white wins | ${report.summary.whiteWins} |`,
    `| deckout finishes | ${report.summary.deckoutFinishes} |`,
    `| planner deckout losses | ${report.summary.plannerDeckoutLosses} |`,
    `| planner deckout events | ${report.summary.plannerDeckoutEvents} |`,
    `| planner end_turn near deckout | ${report.summary.plannerEndTurnsNearDeckout} |`,
    `| planner face damage near deckout | ${report.summary.plannerFaceDamageNearDeckout} |`,
    `| avg steps | ${report.summary.averageSteps} |`,
    `| avg turns | ${report.summary.averageTurns} |`,
    "",
    "## Games",
    "",
    "| seed | direction | winner | deckout | planner deckout loss | planner events | end_turn | face | warnings |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const game of report.gamesDetail) {
    lines.push(
      `| ${game.seed} | ${game.direction} | ${game.winnerProfile ?? "-"} | ${game.deckoutFinish ? "Y" : "-"} | ` +
        `${game.plannerDeckoutLoss ? "Y" : "-"} | ${game.plannerEvents} | ${game.plannerEndTurns} | ${game.plannerFaceDamage} | ` +
        `${escapeMarkdownTableCell(game.warningKinds.join(", ") || "-")} |`,
    );
  }

  lines.push("", "## Samples", "");
  lines.push("| seed | direction | step | turn | player | planner | decision | HP | deck | stones | deckout log | reason |");
  lines.push("| ---: | --- | ---: | ---: | --- | ---: | --- | --- | --- | --- | ---: | --- |");
  for (const sample of report.samples) {
    lines.push(
      `| ${sample.seed} | ${sample.direction} | ${sample.step} | ${sample.turn} | ${sample.player} | ` +
        `${sample.plannerTurn ? "Y" : "-"} | ${escapeMarkdownTableCell(sample.decision)} | ${sample.hp} | ${sample.deck} | ` +
        `${sample.stones} | ${sample.deckoutLog ? "Y" : "-"} | ${escapeMarkdownTableCell(sample.reason)} |`,
    );
  }

  lines.push("", "## Conclusion", "");
  report.conclusion.forEach((line) => lines.push(`- ${line}`));
  lines.push("", "## Next Loop Proposal", "");
  report.nextLoopProposal.forEach((line) => lines.push(`- ${line}`));
  return lines.join("\n");
}

function parseArgs(args: string[]): CliOptions {
  const parsed: CliOptions = {
    artifactDirs: [],
    deckThreshold: 2,
    maxSamples: 80,
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];
    if (arg === "--artifact-dir") {
      parsed.artifactDirs.push(readString(arg, next));
      index += 1;
    } else if (arg === "--artifact-dirs") {
      parsed.artifactDirs.push(...readString(arg, next).split(",").map((value) => value.trim()).filter(Boolean));
      index += 1;
    } else if (arg === "--deck-threshold") {
      parsed.deckThreshold = readInteger(arg, next);
      index += 1;
    } else if (arg === "--max-samples") {
      parsed.maxSamples = readInteger(arg, next);
      index += 1;
    } else if (arg === "--markdown") {
      parsed.markdownPath = readString(arg, next);
      index += 1;
    } else if (arg === "--json") {
      parsed.jsonPath = readString(arg, next);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelpAndExit();
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  if (parsed.artifactDirs.length === 0) {
    throw new Error("--artifact-dir or --artifact-dirs is required");
  }
  return parsed;
}

function printHelpAndExit(): never {
  console.log(`Usage:
  npm run audit:white-planner-deckout -- --artifact-dir <dir> [--artifact-dir <dir> ...]

Options:
  --artifact-dir <dir>       Benchmark game artifact directory. Can be repeated.
  --artifact-dirs <dirs>     Comma-separated artifact directories.
  --deck-threshold <n>       Include events with either deck <= n. Default: 2
  --max-samples <n>          Max samples in the report. Default: 80
  --markdown <path>          Write Markdown report.
  --json <path>              Write JSON report.
`);
  process.exit(0);
}

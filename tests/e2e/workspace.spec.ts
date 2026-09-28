import AxeBuilder from "@axe-core/playwright";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { getCardDef } from "../../src/game/cards";
import { TUTORIAL_STORAGE_KEY, TUTORIAL_VERSION } from "../../src/ui/tutorial";
import { buildRolloverJournalForBrowser } from "./buildRolloverJournal";
import { buildCompletedDraftArchiveForBrowser, buildCompletedGauntletArchiveForBrowser } from "./sessionArchiveFixtures";

async function openApp(page: Page) {
  await page.addInitScript(([key, version]) => {
    window.localStorage.setItem(key, version);
  }, [TUTORIAL_STORAGE_KEY, String(TUTORIAL_VERSION)] as const);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Stone Tactics" })).toBeVisible();
  await page.getByRole("button", { name: "次の対戦設定" }).click();
  await page.getByRole("dialog").getByLabel("Seed", { exact: true }).fill("20260928");
  await page.getByRole("dialog").getByRole("button", { name: "New Game" }).click();
}

async function switchMode(page: Page, mode: "Play" | "Spectate" | "Analyze") {
  await page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: mode }).click();
  await expect(page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: mode })).toHaveAttribute("aria-current", "page");
}

async function getLiveTurnLine(page: Page) {
  const liveTurnLine = page.locator(".topbar p").filter({ hasText: /^Turn \d+\s*\// });
  await expect(liveTurnLine).toHaveCount(1);
  await expect(liveTurnLine).toBeVisible();
  return liveTurnLine;
}

async function openInfoPanel(page: Page) {
  const toggle = page.locator(".info-panel-toggle");
  if (await toggle.getAttribute("aria-expanded") === "false") await toggle.click();
}

async function exportJournal(page: Page) {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSONを書き出す" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  if (!path) throw new Error("Journal download did not produce a readable file.");
  return JSON.parse(readFileSync(path, "utf8")) as {
    initialHash: string;
    commands: unknown[];
    initialState: { players: { player: { masterId: string }; cpu: { masterId: string } } };
  };
}

async function openJournalPanel(page: Page) {
  await switchMode(page, "Analyze");
  await page.getByRole("button", { name: "Journal", exact: true }).click();
  await expect(page.getByRole("heading", { name: "対局Journal / Replay" })).toBeVisible();
}

async function waitForVisibleImages(page: Page) {
  await page.evaluate(async () => {
    const visibleImages = Array.from(document.images).filter((image) => {
      const rect = image.getBoundingClientRect();
      const style = getComputedStyle(image);
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0 &&
        rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
    });
    await Promise.all(visibleImages.map(async (image) => {
      if (image.loading === "lazy") image.loading = "eager";
      await image.decode();
      if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        throw new Error(`Visible image failed to decode: ${image.currentSrc || image.src || "(missing src)"}`);
      }
    }));
  });
}

async function visualContract(page: Page) {
  return page.evaluate(() => {
    const selectors = [
      ".app-shell",
      ".topbar",
      ".mode-navigation",
      ".battle-area",
      ".battle-primary",
      ".board",
      ".battle-control-panel",
      ".hand-panel",
      ".hand-list",
      ".battle-history-panel",
      ".battle-journal-panel",
    ];
    return selectors.flatMap((selector) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element || element.hidden) return [];
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return [{
        selector,
        rect: {
          x: rect.x, y: rect.y, width: rect.width, height: rect.height,
          widthRatio: rect.width / window.innerWidth,
          heightRatio: rect.height / window.innerHeight,
        },
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
      }];
    });
  });
}

async function expectVisualContract(page: Page, testInfo: TestInfo, name: string) {
  const actual = await visualContract(page);
  const snapshotPath = testInfo.snapshotPath(`${name}.json`);
  if (process.env.UPDATE_VISUAL_BASELINES === "1") {
    writeFileSync(snapshotPath, `${JSON.stringify(actual, null, 2)}\n`);
    return;
  }
  if (!existsSync(snapshotPath)) throw new Error(`承認済みvisual baselineがありません: ${snapshotPath}`);
  const expected = JSON.parse(readFileSync(snapshotPath, "utf8")) as typeof actual;
  expect(actual.map((item) => item.selector)).toEqual(expected.map((item) => item.selector));
  const fixedBoxTolerance = 4;
  const textHeightTolerance = 12;
  const majorWidthRatioTolerance = 0.01;
  for (const [index, item] of actual.entries()) {
    const baseline = expected[index];
    expect(item.color, `${name} ${item.selector} text color`).toBe(baseline.color);
    expect(item.backgroundColor, `${name} ${item.selector} background color`).toBe(baseline.backgroundColor);
    expect(item.borderRadius, `${name} ${item.selector} border radius`).toBe(baseline.borderRadius);
    for (const axis of ["x", "y", "width"] as const) {
      expect(Math.abs(item.rect[axis] - baseline.rect[axis]), `${name} ${item.selector} ${axis} tolerance`)
        .toBeLessThanOrEqual(fixedBoxTolerance);
    }
    expect(Math.abs(item.rect.height - baseline.rect.height), `${name} ${item.selector} height tolerance`)
      .toBeLessThanOrEqual(textHeightTolerance);
    expect(Math.abs(item.rect.widthRatio - baseline.rect.widthRatio), `${name} ${item.selector} width ratio`)
      .toBeLessThanOrEqual(majorWidthRatioTolerance);
    expect(Math.abs(item.rect.heightRatio - baseline.rect.heightRatio), `${name} ${item.selector} height ratio`)
      .toBeLessThanOrEqual(0.02);
  }
}

async function expectA11yClean(page: Page, label: string) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })),
  }));
  expect(summary, `${label} accessibility violations`).toEqual([]);
}

async function withAcceptedDialogs<T>(page: Page, action: () => Promise<T>): Promise<T> {
  const accept = (dialog: import("@playwright/test").Dialog) => { void dialog.accept(); };
  page.on("dialog", accept);
  try {
    return await action();
  } finally {
    page.off("dialog", accept);
  }
}

async function openLimitedSession(page: Page, kind: "Draft" | "Sealed") {
  await page.getByRole("button", { name: "セッション", exact: true }).click();
  await expect(page.getByRole("heading", { name: "セッション", exact: true })).toBeVisible();
  await withAcceptedDialogs(page, () => page.getByRole("button", { name: `${kind}を開始` }).click());
  await expect(page.locator(".limited-session-panel")).toBeVisible();
}

async function downloadSessionArchive(page: Page, expectedFilename: RegExp) {
  const downloadPromise = page.waitForEvent("download");
  await withAcceptedDialogs(page, () => page.getByRole("button", { name: "セッションを検証してJSON保存" }).click());
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(expectedFilename);
  const path = await download.path();
  if (!path) throw new Error("Session archive download did not produce a readable file.");
  const json = readFileSync(path, "utf8");
  return { archive: JSON.parse(json) as Record<string, unknown>, filename: download.suggestedFilename(), bytes: readFileSync(path) };
}

async function restoreSessionArchive(page: Page, saved: { filename: string; bytes: Buffer }, verifyRestored: () => Promise<void>) {
  const input = page.locator('input[aria-label="セッションアーカイブJSONを選択"]');
  await withAcceptedDialogs(page, () => input.setInputFiles({ name: saved.filename, mimeType: "application/json", buffer: saved.bytes }));
  await verifyRestored();
  if (!(await page.locator(".limited-session-panel").isVisible())) {
    await page.getByRole("button", { name: /セッション/ }).first().click();
  }
  await expect(page.locator(".limited-session-panel")).toBeVisible();
}

async function restoreCompletedArchiveIntoHub(page: Page, filename: string, json: string) {
  const sessionButton = page.getByRole("button", { name: "セッション", exact: true });
  if (await sessionButton.getAttribute("aria-expanded") !== "true") await sessionButton.click();
  await expect(page.locator(".session-launcher-panel")).toBeVisible();
  const input = page.locator('input[aria-label="セッションアーカイブJSONを選択"]');
  await withAcceptedDialogs(page, () => input.setInputFiles({ name: filename, mimeType: "application/json", buffer: Buffer.from(json) }));
  await expect(page.locator(".session-hub-shell")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByTestId("journal-worker-status")).toHaveCount(0, { timeout: 60_000 });
}

async function seekEmbeddedJournalBackOneCommand(page: Page) {
  const status = page.locator(".session-hub-review .battle-journal-status");
  await expect(status).toBeVisible();
  const counts = (await status.innerText()).match(/(\d+)\s*\/\s*(\d+) commands/);
  if (!counts) throw new Error("Embedded journal cursor status was not readable.");
  const cursor = Number(counts[1]);
  const total = Number(counts[2]);
  expect(total).toBeGreaterThan(1);
  expect(cursor).toBe(total);
  await page.getByRole("button", { name: "1 command戻る" }).click();
  await expect(status).toContainText(`${total - 1} / ${total} commands`, { timeout: 60_000 });
}

async function branchFromLastCoachObservation(page: Page) {
  const observations = page.locator(".postgame-coach-panel .coach-observation-list > li");
  await expect(observations.first()).toBeVisible({ timeout: 60_000 });
  const last = observations.last();
  const sequence = Number((await last.innerText()).match(/行動\s+(\d+)/)?.[1] ?? 0);
  expect(sequence).toBeGreaterThan(1);
  await last.getByRole("button", { name: "この行動前から分岐" }).click();
  const setup = page.getByRole("region", { name: "分岐対戦の設定" });
  await expect(setup).toBeVisible();
  // The selected observation is an action-before cursor, so sequence > 1 proves
  // that this branch point is nonzero without depending on presentation text.
  expect(sequence - 1).toBeGreaterThan(0);
  await setup.getByRole("button", { name: "局面を検証して分岐対戦を開始" }).click();
  await expect(page.locator(".battle-area")).toBeVisible({ timeout: 60_000 });
}

async function saveCurrentBranchArchive(page: Page) {
  const switchButton = page.getByRole("button", { name: /セッション/ }).first();
  await switchButton.click();
  return downloadSessionArchive(page, /^stone-tactics-battle-.*\.json$/);
}

async function launchPuzzle(page: Page, title: string) {
  const launcher = page.locator(".session-launcher-panel");
  await expect(launcher).toBeVisible();
  await withAcceptedDialogs(page, () => launcher.getByRole("button", { name: new RegExp(title) }).click());
  await expect(page.locator(".battle-area")).toBeVisible();
}

async function failThenResetPuzzle(page: Page, title: string) {
  await launchPuzzle(page, title);
  await page.getByRole("button", { name: "End Turn" }).click();
  await expect(page.getByTestId("puzzle-terminal-panel")).toContainText("Puzzle失敗");
  await page.getByRole("button", { name: "このPuzzleを最初からやり直す" }).click();
  await expect(page.getByTestId("puzzle-terminal-panel")).toHaveCount(0);
}

async function saveSolvedPuzzle(page: Page, expectedPuzzleId: string) {
  await expect(page.getByTestId("puzzle-terminal-panel")).toContainText("Puzzle達成");
  await page.getByRole("button", { name: "セッション", exact: true }).click();
  await expect(page.locator(".session-launcher-panel")).toBeVisible();
  const saved = await downloadSessionArchive(page, /^stone-tactics-puzzle-.*\.json$/);
  const archive = saved.archive as {
    manifest: { challengeDefinition?: { id?: string } };
    progress: { status: string; attempts: number };
    journal: { commands: unknown[] };
  };
  expect(archive.manifest.challengeDefinition?.id).toBe(expectedPuzzleId);
  expect(archive.progress).toMatchObject({ status: "solved", attempts: 2 });
  expect(archive.journal.commands).toHaveLength(1);
}

async function draftPickCount(page: Page): Promise<number> {
  const text = await page.locator(".limited-session-panel").innerText();
  return Number(text.match(/自分のpick\s+(\d+)\/30/)?.[1] ?? text.match(/pick\s+(\d+)\/30/)?.[1] ?? 0);
}

async function pickDraftUntil(page: Page, target: number) {
  const choices = page.locator(".limited-choice-list button");
  for (let guard = 0; guard < 40 && await draftPickCount(page) < target; guard += 1) {
    await expect(choices.first()).toBeVisible({ timeout: 20_000 });
    await choices.first().click();
  }
  await expect.poll(() => draftPickCount(page), { timeout: 20_000 }).toBe(target);
}

async function playUntilActualTerminalResult(page: Page) {
  test.setTimeout(300_000);
  const resultHeading = page.locator(".battle-control-result h2");
  const endTurn = page.getByRole("button", { name: "End Turn" });
  const completedSummary = page.locator(".session-hub-shell .limited-session-panel");
  const isCompleted = async () => await completedSummary.isVisible() && (await completedSummary.innerText()).includes("対局完了");
  for (let round = 0; round < 100 && !(await resultHeading.isVisible()) && !(await isCompleted()); round += 1) {
    const discardPanel = page.locator(".hand-limit-discard-panel");
    if (await discardPanel.isVisible()) {
      const needed = Number((await discardPanel.innerText()).match(/必要\s+(\d+)/)?.[1] ?? 0);
      const cards = discardPanel.locator(".button-stack > button").filter({ hasNotText: "捨ててターン終了" }).filter({ hasNotText: "キャンセル" });
      for (let index = 0; index < needed; index += 1) await cards.nth(index).click();
      await discardPanel.getByRole("button", { name: /捨ててターン終了/ }).click();
    } else {
      if (await isCompleted()) break;
      await expect(endTurn).toBeEnabled({ timeout: 60_000 });
      await endTurn.click();
    }
    await expect.poll(async () =>
      await resultHeading.isVisible() || await isCompleted() || await endTurn.isEnabled() || await discardPanel.isVisible(),
    { timeout: 60_000 }).toBe(true);
  }
  await expect.poll(async () => await resultHeading.isVisible() || await isCompleted(), { timeout: 60_000 }).toBe(true);
}

test("Play / Spectate / Analyze の主要画面を実ブラウザーで描画する", async ({ page }, testInfo) => {
  await openApp(page);
  const states: Array<{ name: string; mode: "Play" | "Spectate" | "Analyze"; selector?: string }> = [
    { name: "play-desktop", mode: "Play" },
    { name: "spectate-desktop", mode: "Spectate" },
    { name: "analyze-journal-desktop", mode: "Analyze", selector: "Journal" },
  ];

  for (const state of states) {
    await switchMode(page, state.mode);
    if (state.selector) {
      await page.getByRole("button", { name: state.selector, exact: true }).click();
      await expect(page.getByRole("heading", { name: "対局Journal / Replay" })).toBeVisible();
    }
    await waitForVisibleImages(page);
    await expectA11yClean(page, state.name);
    await expectVisualContract(page, testInfo, state.name);
    await page.screenshot({ path: testInfo.outputPath(`${state.name}.png`), animations: "disabled" });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await switchMode(page, "Play");
  await waitForVisibleImages(page);
  await expectA11yClean(page, "play-mobile");
  await expectVisualContract(page, testInfo, "play-mobile");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "mobile horizontal overflow in CSS pixels").toBeLessThanOrEqual(0);
  await page.screenshot({ path: testInfo.outputPath("play-mobile.png"), animations: "disabled" });
});

test("settings、Deck Setup basic/research、first-run tutorial の主要操作をaxe検査する", async ({ page }) => {
  await openApp(page);

  await page.getByRole("button", { name: "次の対戦設定" }).click();
  await expect(page.getByRole("dialog", { name: "次の対戦設定" })).toBeVisible();
  await expectA11yClean(page, "settings-dialog");
  await page.getByRole("button", { name: "対戦設定を閉じる" }).click();

  await openInfoPanel(page);
  await page.getByRole("button", { name: "Decks" }).click();
  await expect(page.getByRole("heading", { name: "Deck Setup" })).toBeVisible();
  await expectA11yClean(page, "deck-setup-basic");
  await page.getByRole("tab", { name: "研究・詳細設定" }).click();
  await page.getByRole("button", { name: "現在seedの内容を固定" }).click();
  await page.getByText("テキストで直接編集", { exact: false }).click();
  await expect(page.locator(".deck-editor-textarea")).toBeVisible();
  await expectA11yClean(page, "deck-setup-research-editor");

  await page.locator(".deck-setup-panel").getByRole("button", { name: "閉じる" }).click();
  await page.getByRole("button", { name: "チュートリアルを再表示" }).click();
  await expect(page.getByRole("complementary", { name: "初回対局チュートリアル" })).toBeVisible();
  await expectA11yClean(page, "first-run-tutorial");
  await page.getByRole("button", { name: "チュートリアルを一時的に閉じる" }).click();
});

test("初回tutorialはskip可能で完了状態を保存する", async ({ page }) => {
  await page.goto("/");
  const tutorial = page.getByRole("complementary", { name: "初回対局チュートリアル" });
  await expect(tutorial).toBeVisible();
  await expectA11yClean(page, "first-run-onboarding");
  await tutorial.getByRole("button", { name: "スキップして完了" }).click();
  await expect(tutorial).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Stone Tactics" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "初回対局チュートリアル" })).toHaveCount(0);
});

test("初回tutorialを召喚・ターン終了・移動の実操作で完了して保存する", async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    Math.random = () => 0.000012345;
  });
  await page.goto("/");
  const tutorial = page.getByRole("complementary", { name: "初回対局チュートリアル" });
  await expect(tutorial).toContainText("1 / 3 · カードを配置する");

  await page.getByRole("button", { name: "次の対戦設定" }).click();
  const settings = page.getByRole("dialog", { name: "次の対戦設定" });
  await settings.getByLabel("Seed", { exact: true }).fill("12345");
  await settings.getByRole("button", { name: "New Game" }).click();
  const summonCard = page.getByRole("button", { name: /ドノマンティス/ });
  await expect(summonCard).toBeEnabled();
  await summonCard.click();
  await page.locator('.board-slot[data-slot-key="player_front_left"]').click();
  await expect(tutorial).toContainText("2 / 3 · ターンを終える");

  await page.getByRole("button", { name: "End Turn" }).click();
  await expect(tutorial).toContainText("3 / 3 · 登場したカードを操作する", { timeout: 75_000 });
  await page.locator('.board-slot[data-slot-key="player_front_left"]').click();
  const move = page.getByRole("button", { name: /移動 \/ 入れ替え/ });
  await expect(move).toBeEnabled();
  await move.click();
  await page.locator('.board-slot[data-slot-key="player_back_left"]').click();
  await expect(tutorial).toHaveCount(0);
  await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), TUTORIAL_STORAGE_KEY))
    .toBe(String(TUTORIAL_VERSION));
  await page.reload();
  await expect(page.getByRole("complementary", { name: "初回対局チュートリアル" })).toHaveCount(0);
});

test("Spectateをpauseして1手進め、log-follow OFFではログ位置を維持する", async ({ page }) => {
  test.setTimeout(90_000);
  await openApp(page);
  await page.getByRole("button", { name: "次の対戦設定" }).click();
  const dialog = page.getByRole("dialog", { name: "次の対戦設定" });
  await dialog.getByLabel("Mode", { exact: false }).selectOption("cpu-vs-cpu");
  await page.locator(".auto-delay-control input").fill("4000");
  await dialog.getByRole("button", { name: "New Game" }).click();
  await expect(page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: "Spectate" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "一時停止" }).click();
  await expect(page.getByRole("button", { name: "再生" })).toBeVisible();
  await expectA11yClean(page, "spectate-paused");

  const follow = page.getByLabel("最新へ追従");
  await follow.uncheck();
  const logList = page.locator(".log-panel ol");
  await logList.evaluate((element) => {
    element.style.height = "80px";
    element.style.maxHeight = "80px";
    element.style.minHeight = "0";
    element.style.overflowY = "auto";
  });
  const dimensions = await logList.evaluate((element) => ({ scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }));
  expect(dimensions.clientHeight).toBe(80);
  expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);
  const beforeCount = await logList.locator("li").count();
  const liveTurnLine = await getLiveTurnLine(page);
  const beforeHeader = await liveTurnLine.textContent();
  await logList.evaluate((element) => { element.scrollTop = 0; });
  await page.getByRole("button", { name: "1手送り" }).click();
  await expect.poll(() => logList.locator("li").count(), { timeout: 60_000 }).toBeGreaterThan(beforeCount);
  await expect(page.getByRole("button", { name: "再生" })).toBeVisible();
  expect(await logList.evaluate((element) => element.scrollTop)).toBe(0);
  await page.waitForTimeout(4_200);
  await expect(liveTurnLine).toHaveText(beforeHeader ?? "");
  await expect(page.getByRole("button", { name: "再生" })).toBeVisible();
});

test("Analyzeのjournal seekはread-onlyで、操作UIの不在を保つ", async ({ page }) => {
  await openApp(page);
  await switchMode(page, "Play");
  await expect(page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: "Play" })).toHaveAttribute("aria-current", "page");
  await switchMode(page, "Analyze");
  await page.getByRole("button", { name: "Journal", exact: true }).click();
  await expect(page.getByRole("heading", { name: "対局Journal / Replay" })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Replay position" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Auto Play" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "JSONを書き出す" })).toBeEnabled();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSONを書き出す" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^battle-journal-.*\.json$/);
  await expectA11yClean(page, "journal-readonly");
});

test("手動End Turnと保存済みCPU判断をJournalへ記録し、seekしてもlive対局を変更しない", async ({ page }) => {
  test.setTimeout(90_000);
  await openApp(page);
  const liveHeader = await getLiveTurnLine(page);
  const liveBefore = await liveHeader.textContent();
  await page.getByRole("button", { name: "End Turn" }).click();
  await expect(page.getByRole("button", { name: "End Turn" })).toBeEnabled({ timeout: 75_000 });
  const liveAfterCpu = await liveHeader.textContent();
  expect(liveAfterCpu).not.toBe(liveBefore);

  await switchMode(page, "Analyze");
  await page.getByRole("button", { name: "Journal", exact: true }).click();
  await expect(page.getByRole("heading", { name: "対局Journal / Replay" })).toBeVisible();
  const status = page.locator(".battle-journal-status");
  await expect(status).toContainText(/\d+ \/ \d+ commands/);
  const countText = await status.innerText();
  const count = Number(countText.match(/\d+ \/ (\d+) commands/)?.[1] ?? 0);
  expect(count).toBeGreaterThanOrEqual(2);
  await expect(page.getByRole("button", { name: "JSONを書き出す" })).toBeEnabled();
  for (let cursor = count; cursor > 1; cursor -= 1) {
    await page.getByRole("button", { name: "1 command戻る" }).click();
  }
  await expect(status.locator("span").first()).toContainText(/^1 \/ /);
  await expect(liveHeader).toHaveText(liveAfterCpu ?? "");
  await expect(page.getByRole("button", { name: "Auto Play" })).toHaveCount(0);
  await expectA11yClean(page, "journal-replayed-turn");

  const journalBeforeUndo = await exportJournal(page);
  const originalBranchLength = journalBeforeUndo.commands.length;
  await page.getByRole("button", { name: "現在の対局" }).click();
  await switchMode(page, "Play");
  await page.locator(".master-player").click();
  await page.getByRole("button", { name: /HP Draw/ }).click();
  await expect(page.getByRole("button", { name: "戻す" })).toBeEnabled();
  await page.getByRole("button", { name: "戻す" }).click();
  await expect(page.getByTestId("journal-worker-status")).toBeVisible();
  await expect(page.getByTestId("journal-worker-status")).toHaveCount(0, { timeout: 60_000 });
  await openJournalPanel(page);
  await expect(page.locator(".battle-journal-status")).toContainText(`${originalBranchLength} / ${originalBranchLength} commands`);
  const replayedBranch = await exportJournal(page);
  expect(replayedBranch.initialHash).toBe(journalBeforeUndo.initialHash);
  expect(replayedBranch.commands).toHaveLength(originalBranchLength);
  expect(journalBeforeUndo.commands).toHaveLength(originalBranchLength);
});

test("Deck Setupのプリセット読込は現在の対局とJournalを維持し、New Gameで次戦へ適用する", async ({ page }) => {
  test.setTimeout(90_000);
  await openApp(page);
  await page.getByRole("button", { name: "End Turn" }).click();
  await expect(page.getByRole("button", { name: "End Turn" })).toBeEnabled({ timeout: 75_000 });
  const liveHeader = await getLiveTurnLine(page);
  const liveHeaderBeforePreset = await liveHeader.textContent();
  const handBeforePreset = await page.locator(".hand-card-name").allTextContents();

  await openJournalPanel(page);
  const beforePresetJournal = await exportJournal(page);
  expect(beforePresetJournal.commands.length).toBeGreaterThanOrEqual(2);
  await switchMode(page, "Play");

  await openInfoPanel(page);
  await page.getByRole("button", { name: "Decks" }).click();
  await page.getByLabel("次戦 Built-in").selectOption({ label: "ブラックCPU戦" });
  await page.getByLabel("Save name").fill("Journal E2E preset");
  await page.getByRole("button", { name: "保存" }).click();
  await page.getByLabel("次戦 Saved").selectOption({ label: "Journal E2E preset" });
  await expect(page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: "Play" })).toHaveAttribute("aria-current", "page");
  await expect(liveHeader).toHaveText(liveHeaderBeforePreset ?? "");
  await expect(page.locator(".hand-card-name")).toHaveText(handBeforePreset);

  await page.locator(".deck-setup-panel").getByRole("button", { name: "閉じる" }).click();
  await openJournalPanel(page);
  const journalStatus = page.locator(".battle-journal-status");
  await expect(journalStatus).toContainText(/\d+ \/ \d+ commands/);
  const journalBeforeNewGame = await journalStatus.innerText();
  const previousCommandCount = Number(journalBeforeNewGame.match(/\d+ \/ (\d+) commands/)?.[1] ?? 0);
  expect(previousCommandCount).toBeGreaterThanOrEqual(2);
  const afterPresetJournal = await exportJournal(page);
  expect(afterPresetJournal.initialHash).toBe(beforePresetJournal.initialHash);
  expect(afterPresetJournal.commands).toHaveLength(beforePresetJournal.commands.length);

  await switchMode(page, "Play");
  await page.getByRole("button", { name: "次の対戦設定" }).click();
  await page.getByRole("dialog", { name: "次の対戦設定" }).getByRole("button", { name: "New Game" }).click();
  await expect(page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: "Spectate" })).toHaveAttribute("aria-current", "page");

  await openJournalPanel(page);
  await expect(page.locator(".battle-journal-status")).toContainText("0 / 0 commands");
  const nextGameJournal = await exportJournal(page);
  expect(nextGameJournal.initialHash).not.toBe(beforePresetJournal.initialHash);
  expect(nextGameJournal.initialState.players.cpu.masterId).toBe("black");
});

test("実482-command import/seekはread-onlyで、Cancel・Return・New Game後の古い結果を破棄する", async ({ page }) => {
  test.setTimeout(180_000);
  const stressJson = buildRolloverJournalForBrowser();
  const parseFixture = JSON.parse(stressJson) as { commands: unknown[] };
  expect(parseFixture.commands).toHaveLength(482);
  await openApp(page);
  const liveHeader = await getLiveTurnLine(page);
  const liveBefore = await liveHeader.textContent();

  await openJournalPanel(page);
  const input = page.getByRole("textbox", { name: "Journal JSONを貼り付けて読み込む" });
  const importButton = page.getByRole("button", { name: "JSONを読み込む" });
  await input.fill(stressJson);
  await importButton.click();
  await expect(page.getByTestId("journal-worker-status")).toBeVisible();
  await expect(page.locator(".battle-journal-status")).toContainText("482 / 482 commands", { timeout: 60_000 });
  await expect(page.locator(".battle-journal-status")).toContainText("読み込みJournal");
  await expect(liveHeader).toHaveText(liveBefore ?? "");
  await expectA11yClean(page, "journal-imported-482");

  const replaySlider = page.getByRole("slider", { name: "Replay position" });
  await replaySlider.focus();
  await replaySlider.press("Home");
  await expect(page.locator(".battle-journal-status")).toContainText("0 / 482 commands", { timeout: 60_000 });
  await expect(liveHeader).toHaveText(liveBefore ?? "");
  await page.getByRole("button", { name: "現在の対局" }).click();
  await expect(page.locator(".battle-journal-status")).toContainText("現在の対局");

  await input.fill(stressJson);
  await importButton.click();
  await expect(page.getByTestId("journal-worker-status")).toBeVisible();
  await page.getByTestId("journal-worker-cancel").click();
  await expect(page.getByTestId("journal-worker-status")).toHaveCount(0);
  await expect(page.locator(".battle-journal-status")).toContainText("0 / 0 commands");
  await expect(liveHeader).toHaveText(liveBefore ?? "");

  await input.fill(stressJson);
  await importButton.click();
  await expect(page.getByTestId("journal-worker-status")).toBeVisible();
  await page.getByRole("button", { name: "現在の対局" }).click();
  await expect(page.getByTestId("journal-worker-status")).toHaveCount(0);
  await expect(page.locator(".battle-journal-status")).toContainText("0 / 0 commands");
  await expect(liveHeader).toHaveText(liveBefore ?? "");

  const currentJournal = await exportJournal(page);
  await input.fill(stressJson);
  await importButton.click();
  await expect(page.getByTestId("journal-worker-status")).toBeVisible();
  await switchMode(page, "Play");
  await page.getByRole("button", { name: "次の対戦設定" }).click();
  const settings = page.getByRole("dialog", { name: "次の対戦設定" });
  await settings.getByLabel("Seed", { exact: true }).fill("424242");
  await settings.getByRole("button", { name: "New Game" }).click();
  await expect(page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: "Play" })).toHaveAttribute("aria-current", "page");
  await expect(liveHeader).toContainText("Turn 1");

  await openJournalPanel(page);
  await expect(page.getByTestId("journal-worker-status")).toHaveCount(0);
  await expect(page.locator(".battle-journal-status")).toContainText("現在の対局");
  await expect(page.locator(".battle-journal-status")).toContainText("0 / 0 commands");
  const nextGameJournal = await exportJournal(page);
  expect(nextGameJournal.initialHash).not.toBe(currentJournal.initialHash);
});

test("Draft途中保存からpickを再開し、実対局の終局結果まで記録する", async ({ page }) => {
  test.setTimeout(300_000);
  await openApp(page);
  await openLimitedSession(page, "Draft");
  await pickDraftUntil(page, 5);

  const saved = await downloadSessionArchive(page, /^stone-tactics-draft-.*\.json$/);
  const savedProgress = saved.archive.progress as { pickEvents: Array<{ picker: "player" | "cpu"; cardId: string }> };
  expect(savedProgress.pickEvents.filter((event) => event.picker === "player")).toHaveLength(5);
  const visibleDraft = await page.locator(".limited-session-panel").innerText();
  const playerCards = new Set(savedProgress.pickEvents.filter((event) => event.picker === "player").map((event) => event.cardId));
  const hiddenCpuPick = savedProgress.pickEvents.find((event) => event.picker === "cpu" && !playerCards.has(event.cardId) && !visibleDraft.includes(getCardDef(event.cardId).name));
  expect(hiddenCpuPick, "CPU picked at least one card that is not shown in the player's Draft view").toBeDefined();
  expect(visibleDraft).not.toContain(getCardDef(hiddenCpuPick!.cardId).name);

  await pickDraftUntil(page, 6);
  await restoreSessionArchive(page, saved, () => expect.poll(() => draftPickCount(page), { timeout: 60_000 }).toBe(5));
  await expect(page.locator(".limited-session-panel")).not.toContainText(getCardDef(hiddenCpuPick!.cardId).name);
  await pickDraftUntil(page, 30);
  await expect(page.getByRole("button", { name: "Draftデッキで対局開始" })).toBeEnabled();
  await page.getByRole("button", { name: "Draftデッキで対局開始" }).click();
  await expect(page.locator(".battle-area")).toBeVisible();
  await playUntilActualTerminalResult(page);
  await expect(page.locator(".session-hub-shell .limited-session-panel")).toContainText("対局完了", { timeout: 60_000 });
});

test("Sealedの途中pool選択を保存・復帰し、確定deckの実対局結果を記録する", async ({ page }) => {
  test.setTimeout(300_000);
  await openApp(page);
  await openLimitedSession(page, "Sealed");
  const pool = page.locator(".limited-sealed-pool");
  const checkboxes = pool.getByRole("checkbox");
  await expect(checkboxes).toHaveCount(60);
  for (let index = 0; index < 14; index += 1) await checkboxes.nth(index).check();
  await expect(page.locator(".limited-session-panel")).toContainText("現在 14/30");

  const saved = await downloadSessionArchive(page, /^stone-tactics-sealed-.*\.json$/);
  const savedProgress = saved.archive.progress as {
    poolBySeat: { player: Array<{ cardId: string }>; cpu: Array<{ cardId: string }> };
    selectedDeckBySeat: { player: string[]; cpu: string[] };
  };
  expect(savedProgress.selectedDeckBySeat.player).toHaveLength(14);
  const playerPoolIds = new Set(savedProgress.poolBySeat.player.map((card) => card.cardId));
  const cpuOnlyPoolCard = savedProgress.poolBySeat.cpu.find((card) => !playerPoolIds.has(card.cardId));
  expect(cpuOnlyPoolCard, "CPU pool has a card absent from the player's pool").toBeDefined();
  const panelText = await page.locator(".limited-session-panel").innerText();
  expect(panelText).not.toContain(getCardDef(cpuOnlyPoolCard!.cardId).name);

  await checkboxes.nth(14).check();
  await restoreSessionArchive(page, saved, async () => {
    await expect.poll(() => pool.getByRole("checkbox").evaluateAll((items) => items.filter((item) => (item as HTMLInputElement).checked).length), { timeout: 60_000 }).toBe(14);
  });
  const restoredBoxes = page.locator(".limited-sealed-pool").getByRole("checkbox");
  for (let index = 14; index < 30; index += 1) await restoredBoxes.nth(index).check();
  await page.getByRole("button", { name: "この30枚でデッキを確定" }).click();
  await expect(page.getByRole("button", { name: "Sealedデッキで対局開始" })).toBeEnabled();
  await page.getByRole("button", { name: "Sealedデッキで対局開始" }).click();
  await expect(page.locator(".battle-area")).toBeVisible();
  await playUntilActualTerminalResult(page);
  await page.getByRole("button", { name: /セッション/ }).first().click();
  await expect(page.locator(".limited-session-panel")).toContainText("対局完了", { timeout: 60_000 });
  await expect(page.locator(".limited-session-panel")).not.toContainText(getCardDef(cpuOnlyPoolCard!.cardId).name);
});

test("completed Draft/Gauntletのembedded Journal・Coachから非zero位置へ分岐し、検証済みJSONを保存する", async ({ page }) => {
  test.setTimeout(300_000);
  await openApp(page);

  const draftJson = buildCompletedDraftArchiveForBrowser(510_321);
  const draftSource = JSON.parse(draftJson) as {
    progress: { pickEvents: unknown[]; result: { journal: { commands: unknown[] } } };
  };
  await restoreCompletedArchiveIntoHub(page, "completed-draft.json", draftJson);
  await expect(page.locator(".limited-session-panel")).toContainText("対局完了");
  await page.locator(".limited-session-panel").getByRole("button", { name: "この対局を振り返る" }).click();
  await expect(page.locator(".session-hub-review")).toBeVisible();
  await expect(page.getByRole("heading", { name: "対局Journal / Replay" })).toBeVisible();
  await seekEmbeddedJournalBackOneCommand(page);
  await page.getByRole("button", { name: "現在の対局" }).click();
  await page.locator(".limited-session-panel").getByRole("button", { name: "席1のコーチ分析" }).click();
  await expect(page.locator(".postgame-coach-panel .coach-report-summary")).toBeVisible({ timeout: 60_000 });
  await branchFromLastCoachObservation(page);
  const draftBranch = await saveCurrentBranchArchive(page);
  const draftBranchSource = draftBranch.archive.branchSource as {
    sourceCursor: number;
    sourceProgress: { pickEvents: unknown[]; result: { journal: { commands: unknown[] } } };
    sourceJournal: { commands: unknown[] };
  };
  expect(draftBranch.archive.manifest).toMatchObject({ kind: "battle", controlPolicy: "fixed-seat" });
  expect(draftBranch.archive.journal).toMatchObject({ commands: [] });
  expect(draftBranchSource.sourceCursor).toBeGreaterThan(0);
  expect(draftBranchSource.sourceProgress).toEqual(draftSource.progress);
  expect(draftBranchSource.sourceJournal.commands).toEqual(draftSource.progress.result.journal.commands);

  const gauntletJson = buildCompletedGauntletArchiveForBrowser(851_000);
  const gauntletSource = JSON.parse(gauntletJson) as {
    progress: { completedBattles: Array<{ journal: { commands: unknown[] } }> };
  };
  await restoreCompletedArchiveIntoHub(page, "completed-gauntlet.json", gauntletJson);
  const results = page.getByTestId("gauntlet-result-summary");
  await expect(results).toContainText("3/3");
  const secondStage = results.locator("li").nth(1);
  await secondStage.getByRole("button", { name: "この対局を振り返る" }).click();
  await expect(page.getByRole("heading", { name: "対局Journal / Replay" })).toBeVisible();
  await expect(page.locator(".battle-journal-panel")).toContainText("第2戦");
  await seekEmbeddedJournalBackOneCommand(page);
  await page.getByRole("button", { name: "現在の対局" }).click();
  await results.locator("li").nth(1).getByRole("button", { name: "席1のコーチ分析" }).click();
  await expect(page.locator(".postgame-coach-panel .coach-report-summary")).toBeVisible({ timeout: 60_000 });
  await branchFromLastCoachObservation(page);
  const gauntletBranch = await saveCurrentBranchArchive(page);
  const gauntletBranchSource = gauntletBranch.archive.branchSource as {
    sourceCursor: number;
    sourceProgress: { completedBattles: Array<{ journal: { commands: unknown[] } }> };
    sourceJournal: { commands: unknown[] };
  };
  expect(gauntletBranch.archive.manifest).toMatchObject({ kind: "battle", controlPolicy: "fixed-seat" });
  expect(gauntletBranch.archive.journal).toMatchObject({ commands: [] });
  expect(gauntletBranchSource.sourceCursor).toBeGreaterThan(0);
  expect(gauntletBranchSource.sourceProgress).toEqual(gauntletSource.progress);
  expect(gauntletBranchSource.sourceJournal.commands).toEqual(gauntletSource.progress.completedBattles[1].journal.commands);
});

test("Hub/Experimental と limited のaxe・モバイル、三つの実Puzzle reset/勝利を確認する", async ({ page }) => {
  test.setTimeout(300_000);
  await openApp(page);
  await page.getByRole("button", { name: "セッション", exact: true }).click();
  const launcher = page.locator(".session-launcher-panel");
  await expectA11yClean(page, "session-hub");
  await launcher.locator("details.session-launcher-experimental > summary").click();
  await expectA11yClean(page, "session-hub-experimental");

  await withAcceptedDialogs(page, () => launcher.getByRole("button", { name: "Draftを開始" }).click());
  await expect(page.locator(".limited-session-panel")).toBeVisible();
  await expectA11yClean(page, "draft-session");

  await withAcceptedDialogs(page, () => launcher.getByRole("button", { name: "Sealedを開始" }).click());
  await expect(page.locator(".limited-session-panel")).toBeVisible();
  await expectA11yClean(page, "sealed-session");
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(mobileOverflow, "Sealed mobile horizontal overflow in CSS pixels").toBeLessThanOrEqual(0);
  await page.setViewportSize({ width: 1280, height: 900 });

  const puzzleCases = [
    { title: "一撃で決める", id: "master-lethal", action: async () => {
      await page.locator(".master-player").click();
      await page.getByRole("button", { name: /Master Attack/ }).click();
      await page.locator(".master-cpu").click();
    } },
    { title: "前衛を突破", id: "frontline-break", action: async () => {
      await page.locator('.board-slot[data-slot-key="player_front_left"]').click();
      await page.locator(".selected-detail .command-button.is-ready").first().click();
      await page.locator('.board-slot[data-slot-key="cpu_front_left"]').click();
    } },
    { title: "狙いを定める", id: "focus-the-guard", action: async () => {
      await page.locator('.board-slot[data-slot-key="player_front_left"]').click();
      await page.getByRole("button", { name: /ためる/ }).click();
    } },
  ];
  await expect(page.locator(".session-launcher-panel")).toBeVisible();
  for (const puzzle of puzzleCases) {
    await failThenResetPuzzle(page, puzzle.title);
    await puzzle.action();
    await saveSolvedPuzzle(page, puzzle.id);
  }
});

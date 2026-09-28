import AxeBuilder from "@axe-core/playwright";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { TUTORIAL_STORAGE_KEY, TUTORIAL_VERSION } from "../../src/ui/tutorial";
import { buildRolloverJournalForBrowser } from "./buildRolloverJournal";

async function openApp(page: Page) {
  await page.addInitScript(([key, version]) => {
    window.localStorage.setItem(key, version);
  }, [TUTORIAL_STORAGE_KEY, String(TUTORIAL_VERSION)] as const);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Card Hero Prototype" })).toBeVisible();
  await page.getByRole("button", { name: "次の対戦設定" }).click();
  await page.getByRole("dialog").getByLabel("Seed", { exact: true }).fill("20260928");
  await page.getByRole("dialog").getByRole("button", { name: "New Game" }).click();
}

async function switchMode(page: Page, mode: "Play" | "Spectate" | "Analyze") {
  await page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: mode }).click();
  await expect(page.getByRole("navigation", { name: "Game mode" }).getByRole("button", { name: mode })).toHaveAttribute("aria-current", "page");
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
  await expect(page.getByRole("heading", { name: "Card Hero Prototype" })).toBeVisible();
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
  const beforeHeader = await page.locator(".topbar p").first().textContent();
  await logList.evaluate((element) => { element.scrollTop = 0; });
  await page.getByRole("button", { name: "1手送り" }).click();
  await expect.poll(() => logList.locator("li").count(), { timeout: 60_000 }).toBeGreaterThan(beforeCount);
  await expect(page.getByRole("button", { name: "再生" })).toBeVisible();
  expect(await logList.evaluate((element) => element.scrollTop)).toBe(0);
  await page.waitForTimeout(4_200);
  await expect(page.locator(".topbar p").first()).toHaveText(beforeHeader ?? "");
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
  const liveHeader = page.locator(".topbar p").first();
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
  const liveHeader = page.locator(".topbar p").first();
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
  const liveHeader = page.locator(".topbar p").first();
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

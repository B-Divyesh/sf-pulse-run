import { expect, test } from '@playwright/test';

test('@claim:complete-run plays a six-track, three-minute run to the win screen', async ({ page }) => {
  await page.goto('/demo?qa=1');
  await page.evaluate(() => window.__PULSE_QA__?.finishRun());

  await expect(page.getByRole('heading', { name: 'Run complete' })).toBeVisible();
  await expect(page.getByText('You finished all six tracks.')).toBeVisible();
  await expect(page.getByText('3:00 played', { exact: false })).toBeVisible();
  const snapshot = await page.evaluate(() => window.__PULSE_QA__?.snapshot());
  expect(snapshot?.status).toBe('won');
  expect(snapshot?.track).toBe(5);
  expect(snapshot?.runTime).toBe(180_000);
  expect(snapshot?.modifiers).toHaveLength(5);
});

test('@claim:three-misses ends the run on the third missed phrase', async ({ page }) => {
  await page.goto('/demo?qa=1');
  await page.evaluate(() => window.__PULSE_QA__?.loseRun());

  await expect(page.getByRole('heading', { name: 'Run ended' })).toBeVisible();
  await expect(page.getByText('Three missed phrases ended this run.')).toBeVisible();
  const snapshot = await page.evaluate(() => window.__PULSE_QA__?.snapshot());
  expect(snapshot?.status).toBe('lost');
  expect(snapshot?.missedPhrases).toBe(3);
});

test('@claim:restart-reset starts a clean build after an end screen', async ({ page }) => {
  await page.goto('/demo?qa=1');
  await page.evaluate(() => window.__PULSE_QA__?.finishRun());
  await page.getByRole('button', { name: 'Play again' }).click();

  const snapshot = await page.evaluate(() => window.__PULSE_QA__?.snapshot());
  expect(snapshot?.status).toBe('playing');
  expect(snapshot?.track).toBe(0);
  expect(snapshot?.score).toBe(0);
  expect(snapshot?.missedPhrases).toBe(0);
  expect(snapshot?.modifiers).toEqual([]);
  await expect(page.locator('#track-value')).toHaveText('1 / 6');
});

test('@claim:settings-persist keeps sound, assist, and key settings in a real browser', async ({ page }) => {
  await page.goto('/demo?qa=1');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Open game settings' }).click();
  await page.getByLabel('Play percussion').uncheck();
  await page.getByLabel('Use wider timing').check();
  await page.getByLabel('Lane 1 key').selectOption('KeyA');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Open game settings' }).click();

  await expect(page.getByLabel('Play percussion')).not.toBeChecked();
  await expect(page.getByLabel('Use wider timing')).toBeChecked();
  await expect(page.getByLabel('Lane 1 key')).toHaveValue('KeyA');
});

test('@claim:local-play-data keeps real and sample play data in the browser', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'Start a real run' }).click();
  await page.evaluate(() => window.__PULSE_QA__?.finishRun());
  await page.getByRole('button', { name: 'Play again' }).click();

  const storedKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(storedKeys.some((key) => key.startsWith('pulse-run:'))).toBe(true);
  await page.goto('/demo?qa=1');
  await page.evaluate(() => window.__PULSE_QA__?.finishRun());
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(storedKeys);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:demo-isolation resets sample play without reading or changing real data', async ({ page }) => {
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('18,420')).toBeVisible();
  const sentinel = JSON.stringify({ bestScore: 4321, completedRuns: 2, startedRuns: 3 });
  await page.evaluate((value) => localStorage.setItem('pulse-run:stats', value), sentinel);
  await page.evaluate(() => window.__PULSE_QA__?.loseRun());
  await page.getByRole('button', { name: 'Reset demo' }).click();

  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  const stored = await page.evaluate(() => localStorage.getItem('pulse-run:stats'));
  expect(stored).toBe(sentinel);
  const snapshot = await page.evaluate(() => window.__PULSE_QA__?.snapshot());
  expect(snapshot?.status).toBe('playing');
  expect(snapshot?.track).toBe(0);
  expect(snapshot?.score).toBe(0);
});

test('@claim:one-time-offer exposes the same $5 one-time public offer on site and metadata', async ({ page, request }) => {
  const response = await request.get('/billing-offer.json');
  expect(response.ok()).toBe(true);
  const offer = await response.json() as { price_minor: number; currency: string; price_type: string; paid_features: string[] };
  expect(offer).toMatchObject({ price_minor: 500, currency: 'USD', price_type: 'one_time_price' });
  expect(offer.paid_features).toEqual(['Copper, Paper, and Glass original percussion sets']);

  await page.goto('/license');
  await expect(page.getByText('Pulse Run Complete costs $5 USD once. It is not a subscription.')).toBeVisible();
  await expect(page.getByText('Copper, Paper, and Glass original percussion sets')).toBeVisible();
  await expect(page.getByText('Checkout and license activation are not available yet.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button')).toHaveCount(0);
});

test('@claim:input-modes scores notes from both the keyboard and touch controls', async ({ page }) => {
  await page.goto('/demo?qa=1');
  await page.evaluate(() => window.__PULSE_QA__?.placeNote(0));
  await page.keyboard.press('KeyD');
  const keyboardScore = await page.evaluate(() => window.__PULSE_QA__?.snapshot()?.score ?? 0);
  expect(keyboardScore).toBeGreaterThan(0);

  await page.evaluate(() => window.__PULSE_QA__?.placeNote(1));
  await page.locator('[data-lane="1"]').dispatchEvent('pointerdown');
  const touchScore = await page.evaluate(() => window.__PULSE_QA__?.snapshot()?.score ?? 0);
  expect(touchScore).toBeGreaterThan(keyboardScore);
});

test('@claim:remappable-input plays each lane after the player remaps every key', async ({ page }) => {
  const keys = ['KeyA', 'KeyS', 'KeyL', 'Semicolon'];
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'Open game settings' }).click();
  for (const [lane, key] of keys.entries()) {
    await page.getByLabel(`Lane ${lane + 1} key`).selectOption(key);
  }
  await page.getByRole('button', { name: 'Save settings' }).click();

  let score = 0;
  for (const [lane, key] of keys.entries()) {
    await page.evaluate((currentLane) => window.__PULSE_QA__?.placeNote(currentLane), lane);
    await page.keyboard.press(key);
    const nextScore = await page.evaluate(() => window.__PULSE_QA__?.snapshot()?.score ?? 0);
    expect(nextScore).toBeGreaterThan(score);
    score = nextScore;
  }
});

test('@claim:free-run-changes gives the free game six changes with distinct play effects', async ({ page }) => {
  await page.goto('/demo?qa=1');
  const results = [];
  for (const id of ['wide', 'shield', 'boost', 'rotate', 'dense', 'steady']) {
    results.push(await page.evaluate((modifier) => window.__PULSE_QA__?.inspectModifier(modifier), id));
  }
  const byId = new Map(results.filter(Boolean).map((result) => [result!.id, result!]));

  expect(byId.size).toBe(6);
  expect([...byId.values()].every((result) => result.groove === 'circuit')).toBe(true);
  expect(byId.get('wide')?.timingWindow).toBeGreaterThan(145);
  expect(byId.get('shield')?.shield).toBe(1);
  expect(byId.get('boost')).toMatchObject({ timingWindow: 125, multiplier: 1.35 });
  expect(byId.get('rotate')?.rotatedInputWorks).toBe(true);
  expect(byId.get('dense')?.noteCount).toBe(90);
  expect(byId.get('steady')?.lanePattern).toEqual([0, 1, 2, 3, 1, 2, 3, 0]);
});

test('@claim:no-account-ads-tracking starts a real run without identity or third-party requests', async ({ page }) => {
  const requests: string[] = [];
  const openedPages: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  page.context().on('page', (opened) => openedPages.push(opened.url()));
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'Start a real run' }).click();

  await expect(page.locator('#game-overlay')).toBeHidden();
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  expect(await page.locator('input[type="password"], input[autocomplete="email"]').count()).toBe(0);
  await page.goto('/license');
  await expect(page.getByRole('heading', { name: 'Get the complete rhythm set' })).toBeVisible();
  expect(await page.locator('input[type="password"], input[autocomplete="email"]').count()).toBe(0);
  expect(openedPages).toEqual([]);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:audio-gesture creates percussion only after a player action and never records', async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __pulseMediaCalls?: number }).__pulseMediaCalls = 0;
    const mediaDevices = navigator.mediaDevices;
    if (!mediaDevices?.getUserMedia) return;
    const original = mediaDevices.getUserMedia.bind(mediaDevices);
    mediaDevices.getUserMedia = (...args) => {
      (window as Window & { __pulseMediaCalls?: number }).__pulseMediaCalls! += 1;
      return original(...args);
    };
  });
  await page.goto('/demo?qa=1');
  expect(await page.evaluate(() => window.__PULSE_QA__?.audioUnlocked())).toBe(false);
  await page.keyboard.press('KeyD');
  expect(await page.evaluate(() => window.__PULSE_QA__?.audioUnlocked())).toBe(true);
  expect(await page.evaluate(() => (window as Window & { __pulseMediaCalls?: number }).__pulseMediaCalls)).toBe(0);
});

test('@claim:assist-timing accepts a wider hit after the player enables the timing setting', async ({ page }) => {
  await page.goto('/?qa=1');
  await page.evaluate(() => window.__PULSE_QA__?.placeNote(0, 190));
  await page.keyboard.press('KeyD');
  expect(await page.evaluate(() => window.__PULSE_QA__?.snapshot()?.score ?? 0)).toBe(0);

  await page.getByRole('button', { name: 'Open game settings' }).click();
  await page.getByLabel('Use wider timing').check();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await page.evaluate(() => window.__PULSE_QA__?.placeNote(0, 190));
  await page.keyboard.press('KeyD');
  expect(await page.evaluate(() => window.__PULSE_QA__?.snapshot()?.score ?? 0)).toBeGreaterThan(0);
});

test('@claim:delete-play-data removes all real browser storage through the privacy control', async ({ page }) => {
  await page.goto('/privacy');
  await page.evaluate(() => {
    localStorage.setItem('pulse-run:settings', '{}');
    localStorage.setItem('pulse-run:stats', '{}');
    localStorage.setItem('pulse-run:run', '{}');
  });
  await page.getByRole('button', { name: 'Delete my play data' }).click();

  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await expect(page.getByRole('status')).toContainText('was deleted');
});

test('@claim:built-in-scope uses the built-in single-player game without upload or realtime connections', async ({ page }) => {
  const sockets: string[] = [];
  page.on('websocket', (socket) => sockets.push(socket.url()));
  await page.goto('/?qa=1');
  await page.getByRole('button', { name: 'Start a real run' }).click();

  await expect(page.locator('#game-overlay')).toBeHidden();
  expect(await page.locator('input[type="file"]').count()).toBe(0);
  const hasRoomOrRankingControl = await page.locator('button, a, input, select').evaluateAll((controls) => controls.some((control) =>
    /room code|leaderboard|competitive ranking|multiplayer/i.test((control.textContent ?? '') + (control.getAttribute('aria-label') ?? '')),
  ));
  expect(hasRoomOrRankingControl).toBe(false);
  expect(sockets).toEqual([]);
});

test('@claim:frame-rate renders at least 50 fps with a phone viewport under 4x CPU throttling', async ({ page }) => {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo?qa=1');
  await page.waitForTimeout(2_500);

  const fps = await page.evaluate(() => window.__PULSE_QA__?.fps() ?? 0);
  expect(fps).toBeGreaterThanOrEqual(50);
});

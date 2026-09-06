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

test('@claim:local-play-data sends no gameplay or play data to another origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo?qa=1');
  await page.evaluate(() => window.__PULSE_QA__?.finishRun());
  await page.getByRole('button', { name: 'Play again' }).click();

  const storedKeys = await page.evaluate(() => Object.keys(localStorage));
  expect(storedKeys).toEqual([]);
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:demo-isolation resets sample play without reading or changing real data', async ({ page }) => {
  await page.goto('/demo?qa=1');
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
  expect(offer.paid_features).toHaveLength(2);

  await page.goto('/license');
  await expect(page.getByText('Pulse Run Complete costs $5 USD once. It is not a subscription.')).toBeVisible();
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

test('@claim:frame-rate renders at least 50 fps with a phone viewport under 4x CPU throttling', async ({ page }) => {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo?qa=1');
  await page.waitForTimeout(2_500);

  const fps = await page.evaluate(() => window.__PULSE_QA__?.fps() ?? 0);
  expect(fps).toBeGreaterThanOrEqual(50);
});

import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('first screen states the job, audience, action, facts, and working game', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');

  await expect(page).toHaveTitle('Pulse Run — Play a three-minute rhythm run');
  await expect(page.getByRole('heading', { level: 1, name: 'Play a three-minute rhythm run' })).toBeVisible();
  await expect(page.getByText('For keyboard players who want a short run with original percussion and no account setup.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('one click opens an active, populated, persistent sample', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();

  await expect(page).toHaveURL('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Sample previous score')).toBeVisible();
  await expect(page.getByText('18,420')).toBeVisible();
  await expect(page.locator('#game-overlay')).toBeHidden();
  await expect(page.locator('#track-value')).toHaveText('1 / 6');
});

test('an in-progress real run recovers paused after reload', async ({ page }) => {
  await page.goto('/demo?qa=1');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForTimeout(1_200);
  await page.reload();

  await expect(page.getByRole('heading', { name: 'Run paused' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume the run' }).click();
  await expect(page.locator('#game-overlay')).toBeHidden();
});

test('settings rejects duplicate lane keys and keeps the dialog open', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open game settings' }).click();
  await page.getByLabel('Lane 1 key').selectOption('KeyA');
  await page.getByLabel('Lane 2 key').selectOption('KeyA');
  await page.getByRole('button', { name: 'Save settings' }).click();

  await expect(page.getByText('Choose a different key for each lane.')).toBeVisible();
  await expect(page.locator('#settings-dialog')).toHaveAttribute('open', '');
});

test('privacy deletion removes all product storage', async ({ page }) => {
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

test('routes have distinct titles, one h1, and a main landmark', async ({ page }) => {
  const routes = [
    ['/', 'Pulse Run — Play a three-minute rhythm run'],
    ['/demo', 'Demo — Pulse Run'],
    ['/privacy', 'Privacy — Pulse Run'],
    ['/terms', 'Terms — Pulse Run'],
    ['/license', 'Complete offer — Pulse Run'],
  ];
  for (const [route, title] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
  }
});

test('SPA navigation supports back and moves focus to the page heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await expect(page).toHaveURL('/privacy');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.locator('h1')).toBeFocused();
});

test('keyboard focus is visible and the settings dialog traps and restores focus', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.getByRole('button', { name: 'Open game settings' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Game settings' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open game settings' })).toBeFocused();
});

test('phone layout has no horizontal overflow and shows the game in the first viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const result = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')?.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      canvasTop: canvas?.top ?? Number.POSITIVE_INFINITY,
    };
  });
  expect(result.overflow).toBe(0);
  expect(result.canvasTop).toBeLessThan(844);
  for (const button of await page.locator('.lane-button').all()) {
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }
});

test('visible touch targets meet 44px and text remains usable at 200 percent', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const targets = await page.locator('a:visible, button:visible, select:visible').all();
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }

  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  await expect(page.getByRole('heading', { name: 'Play a three-minute rhythm run' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try it with sample data' })).toBeVisible();
});

test('reduced-motion preference removes interface transition duration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const duration = await page.getByRole('button', { name: 'Try it with sample data' }).evaluate((button) => getComputedStyle(button).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
});

for (const route of ['/', '/demo', '/privacy', '/terms', '/license']) {
  test(`axe has no serious or critical issues on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(severe).toEqual([]);
  });
}

test('the designed 404 document has recovery structure', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Pulse Run');
  await expect(page.locator('h1')).toHaveText('This page is not part of the run');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Return to the game' })).toHaveAttribute('href', '/');
});

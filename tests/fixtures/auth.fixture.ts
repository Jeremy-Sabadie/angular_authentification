import { test as base, expect, Page } from '@playwright/test';
import { login } from '../utils/auth';

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/');

    // 🔐 Login
    await login(page);

    // ⏱️ Attente navigation réelle (plus fiable que toHaveURL direct)
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // ✅ Vérification dashboard stable
    await expect(page.getByTestId('materials-table')).toBeVisible();

    await use(page);
  },
});

export { expect };

import { test as base, expect, Page } from '@playwright/test';
import { login } from '../utils/auth';

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    // 🔐 Login centralisé
    await login(page);

    // ✅ Attente robuste (évite waitForURL bloqué)
    await expect(page).toHaveURL(/dashboard/);

    // Optionnel mais utile pour stabilité CI
    await expect(page.getByTestId('materials-table')).toBeVisible();

    await use(page);
  },
});

export { expect };

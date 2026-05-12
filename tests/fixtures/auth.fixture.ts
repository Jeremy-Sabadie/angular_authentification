import { test as base, expect, Page } from '@playwright/test';
import { login } from '../utils/auth';

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    // 🔐 Login direct (login gère déjà la navigation)
    await login(page);

    // ✅ Vérification robuste
    await expect(page).toHaveURL(/dashboard/);

    // 🧱 Attente UI stable (évite tests flaky)
    await expect(page.getByTestId('materials-table')).toBeVisible();

    await use(page);
  },
});

export { expect };

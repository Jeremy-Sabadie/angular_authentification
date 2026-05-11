import { test as base, expect, Page } from '@playwright/test';

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/login');

    await page.getByTestId('login-email').fill('user1@example.com');
    await page.getByTestId('login-password').fill('password123');
    await page.getByTestId('login-submit').click();

    await page.waitForURL('**/dashboard');

    await use(page);
  },
});

export { expect };

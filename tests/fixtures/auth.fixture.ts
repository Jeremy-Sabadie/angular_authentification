import { test as base, expect, Page } from '@playwright/test';

type Fixtures = {
  loggedInPage: Page;
};

export const test = base.extend<Fixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/');

    await page.getByTestId('login-email').fill('user1@example.com');
    await page.getByTestId('login-password').fill('pass1234');

    await page.getByTestId('login-submit').click();

    await use(page);
  },
});

export { expect };

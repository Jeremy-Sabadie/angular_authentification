import { test as base, Page, expect } from '@playwright/test';

export async function login(page: Page): Promise<void> {
  const loginResp = page.waitForResponse(r => r.url().includes('/users'));
  await page.goto('/');
  await page.getByTestId('login-email').fill('user1@example.com');
  await page.getByTestId('login-password').fill('pass1234');
  await page.getByTestId('login-submit').click();
  await loginResp;
  await page.waitForURL(/dashboard/);
}

export const test = base.extend<{ loggedInPage: Page }>({
  loggedInPage: async ({ page }, use) => {
    await login(page);
    await use(page);
  },
});

export { expect };

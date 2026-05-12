import { Page, expect } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');

  await page.getByTestId('login-email').fill('user1@example.com');
  await page.getByTestId('login-password').fill('pass1234');

  await Promise.all([
    page.waitForURL('**/dashboard'),
    page.getByTestId('login-submit').click(),
  ]);

  await expect(page).toHaveURL(/dashboard/);
}

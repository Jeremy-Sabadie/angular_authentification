import { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');

  await page.getByTestId('login-email').fill('user1@example.com');
  await page.getByTestId('login-password').fill('password123');

  await page.getByTestId('login-submit').click();
}

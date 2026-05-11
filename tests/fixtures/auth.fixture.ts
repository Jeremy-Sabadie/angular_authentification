import { Page, Response } from '@playwright/test';

export async function login(page: Page): Promise<void> {
  await page.goto('/');

  await page.getByTestId('login-email').fill('user1@example.com');
  await page.getByTestId('login-password').fill('pass1234');

  await Promise.all([
    page.waitForResponse(
      (r: Response) => r.url().includes('/users') && r.status() === 200,
    ),
    page.getByTestId('login-submit').click(),
  ]);
}

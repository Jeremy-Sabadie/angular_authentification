import { test, expect } from '@playwright/test';

test.describe('Protection des routes', () => {
  test('Accès dashboard refusé sans authentification', async ({ page }) => {
    await page.goto('/dashboard');

    // le guard doit rediriger vers login
    await expect(page).toHaveURL(/login/);

    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
  });

  test('Accès dashboard autorisé après connexion', async ({ page }) => {
    // login manuel (plus stable que helper fragile)
    await page.goto('/');

    await page.getByTestId('login-email').fill('user1@example.com');
    await page.getByTestId('login-password').fill('pass1234');
    await page.getByTestId('login-submit').click();

    await page.waitForURL('**/dashboard');

    await expect(page.getByTestId('materials-table')).toBeVisible();
  });
});

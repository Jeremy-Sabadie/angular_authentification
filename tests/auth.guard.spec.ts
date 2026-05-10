import { test, expect } from '@playwright/test';
import { login } from './fixtures/auth.fixture';

test.describe('Protection des routes', () => {
  test('Accès dashboard refusé sans authentification', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).not.toHaveURL(/dashboard/);
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
  });

  test('Accès dashboard autorisé après connexion', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByTestId('materials-table')).toBeVisible();
  });
});

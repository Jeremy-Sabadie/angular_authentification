import { test, expect } from '@playwright/test';
import { login } from './utils/auth';

test.describe('Protection des routes', () => {
  test('Accès dashboard refusé sans authentification', async ({ page }) => {
    await page.goto('/dashboard');

    // Attendre la redirection réelle du guard Angular
    await page.waitForURL(/login|\/$/);

    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
  });

  test('Accès dashboard autorisé après connexion', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByTestId('materials-table')).toBeVisible();
  });
});

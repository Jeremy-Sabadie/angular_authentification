import { test, expect } from '@playwright/test';

test.describe('Protection des routes', () => {
  test('Accès dashboard refusé sans authentification', async ({ page }) => {
    // tentative accès direct dashboard
    await page.goto('http://localhost:4200/dashboard');

    // doit être redirigé vers login
    await expect(page).not.toHaveURL(/dashboard/);

    // vérifie présence formulaire login
    await expect(page.locator('input[formcontrolname="email"]')).toBeVisible();

    await expect(
      page.locator('input[formcontrolname="password"]'),
    ).toBeVisible();
  });

  test('Accès dashboard autorisé après connexion', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // login OK
    await page.fill('input[formcontrolname="email"]', 'user1@example.com');

    await page.fill('input[formcontrolname="password"]', 'pass1234');

    await page.click('button[type="submit"]');

    // dashboard accessible
    await expect(page).toHaveURL(/dashboard/);

    // tableau visible
    await expect(page.locator('table')).toBeVisible();
  });
});

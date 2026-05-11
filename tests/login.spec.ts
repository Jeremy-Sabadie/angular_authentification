import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test('Connexion réussie', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('login-email').fill('user1@example.com');
    await page.getByTestId('login-password').fill('pass1234');

    await Promise.all([
      page.waitForURL('**/dashboard'),
      page.getByTestId('login-submit').click(),
    ]);

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByTestId('topbar-user')).toContainText('Bonjour');
  });

  test('Connexion échouée', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('login-email').fill('fake@test.com');
    await page.getByTestId('login-password').fill('wrongpassword');

    await page.getByTestId('login-submit').click();

    await expect(page).not.toHaveURL(/dashboard/);
    await expect(page.getByTestId('login-error')).toContainText(
      'Email ou mot de passe incorrect',
    );
  });
});

import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test('Connexion réussie', async ({ page }) => {
    const loginResp = page.waitForResponse(r => r.url().includes('/users'));

    await page.goto('/');
    await page.getByTestId('login-email').fill('user1@example.com');
    await page.getByTestId('login-password').fill('pass1234');
    await page.getByTestId('login-submit').click();

    await loginResp;
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByTestId('topbar-user')).toContainText('Bonjour');
  });

  test('Connexion échouée', async ({ page }) => {
    const loginResp = page.waitForResponse(r => r.url().includes('/users'));

    await page.goto('/');
    await page.getByTestId('login-email').fill('fake@test.com');
    await page.getByTestId('login-password').fill('wrongpassword');
    await page.getByTestId('login-submit').click();

    await loginResp;
    await expect(page).not.toHaveURL(/dashboard/);
    await expect(page.getByTestId('login-error')).toContainText('Email ou mot de passe incorrect');
  });
});

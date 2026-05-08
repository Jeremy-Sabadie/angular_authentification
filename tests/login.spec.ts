import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  test('Connexion réussie', async ({ page }) => {
    // ouverture app Angular
    await page.goto('http://localhost:4200');

    // remplissage du formulaire
    await page.fill('input[formcontrolname="email"]', 'user1@example.com');

    await page.fill('input[formcontrolname="password"]', 'pass1234');

    // submit
    await page.click('button[type="submit"]');

    // vérifie redirection vers la page du dashboard
    await expect(page).toHaveURL(/dashboard/);

    // vérification de la  présence message bonjour
    await expect(page.locator('.topbar-user')).toContainText('Bonjour');
  });

  test('Connexion échouée', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // faux identifiants
    await page.fill('input[formcontrolname="email"]', 'fake@test.com');

    await page.fill('input[formcontrolname="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // reste sur login
    await expect(page).not.toHaveURL(/dashboard/);

    // vérification si on a un  message erreur
    await expect(page.locator('.error-message')).toContainText(
      'Email ou mot de passe incorrect',
    );
  });
});

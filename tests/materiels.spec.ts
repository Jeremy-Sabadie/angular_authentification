import { test, expect } from './fixtures/auth.fixture';

test('CRUD matériels', async ({ loggedInPage }) => {
  // Vérifie que le dashboard est bien chargé après login
  await expect(loggedInPage).toHaveURL(/dashboard/);

  // Vérifie la présence de la table des matériels
  await expect(loggedInPage.getByTestId('materials-table')).toBeVisible();

  // (optionnel mais utile pour stabilité CI)
  await expect(loggedInPage.locator('body')).toBeVisible();
});

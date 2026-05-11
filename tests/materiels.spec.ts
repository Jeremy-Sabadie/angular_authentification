import { test, expect } from './fixtures/auth.fixture';

test('CRUD matériels', async ({ loggedInPage }) => {
  // ✅ la fixture garantit déjà login + dashboard

  // Vérifie la présence de la table des matériels
  await expect(loggedInPage.getByTestId('materials-table')).toBeVisible();
});

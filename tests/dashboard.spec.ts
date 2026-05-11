import { test, expect } from './fixtures/auth.fixture';

test('Affichage dashboard', async ({ loggedInPage }) => {
  // ✅ on suppose déjà login OK via fixture

  await expect(loggedInPage.getByTestId('materials-table')).toBeVisible();
});

import { test, expect } from './fixtures/auth.fixture';

test('Affichage dashboard', async ({ loggedInPage }) => {
  await expect(loggedInPage).toHaveURL(/dashboard/);

  await expect(loggedInPage.getByTestId('materials-table')).toBeVisible();
});

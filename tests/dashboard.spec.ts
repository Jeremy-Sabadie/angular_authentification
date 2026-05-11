import { test, expect } from './fixtures/auth.fixture';

test('Affichage dashboard', async ({ loggedInPage }) => {
  const page = loggedInPage;

  await expect(page.getByTestId('materials-table')).toBeVisible();
});

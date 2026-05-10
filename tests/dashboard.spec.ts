import { test, expect } from './fixtures/auth.fixture';

test('Affichage dashboard', async ({ loggedInPage: page }) => {
  await expect(page.getByTestId('materials-table')).toBeVisible();
  await expect(page.getByTestId('topbar-user')).toContainText('Bonjour');
});

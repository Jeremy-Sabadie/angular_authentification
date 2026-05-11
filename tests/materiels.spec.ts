import { test, expect } from './fixtures/auth.fixture';

test('CRUD matériels', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByTestId('materials-table')).toBeVisible();
});

import { test, expect } from './fixtures/auth.fixture';

test('CRUD matériels', async ({ loggedInPage }) => {
  const page = loggedInPage;

  await expect(page.getByTestId('materials-table')).toBeVisible();
});

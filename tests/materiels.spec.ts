import { test, expect } from './fixtures/auth.fixture';

test('CRUD matériels', async ({ loggedInPage: page }) => {
  // =========================
  // CREATE
  // =========================
  const createResp = page.waitForResponse(
    r => r.url().includes('/materiels') && r.request().method() === 'POST',
  );

  await page.getByTestId('create-serial-number').fill('PW-TEST-001');
  await page.getByTestId('create-date-mise-en-service').fill('2026-05-08');
  await page.getByTestId('create-date-fin-garantie').fill('2028-05-08');
  await page.getByTestId('create-btn').click();

  await createResp;
  await page.waitForSelector('.swal2-container', { state: 'hidden' });
  await expect(page.getByTestId('materials-table')).toContainText('PW-TEST-001');

  // =========================
  // UPDATE
  // =========================
  const updateResp = page.waitForResponse(
    r => r.url().includes('/materiels') && r.request().method() === 'PUT',
  );

  await page.getByTestId('edit-btn').last().click();
  await page.getByTestId('modal-serial-number').fill('PW-UPDATED');
  await page.getByTestId('modal-save').click();
  await page.locator('.swal2-confirm').click();

  await updateResp;
  await page.waitForSelector('.swal2-container', { state: 'hidden' });
  await expect(page.getByTestId('materials-table')).toContainText('PW-UPDATED');

  // =========================
  // DELETE
  // =========================
  const deleteResp = page.waitForResponse(
    r => r.url().includes('/materiels') && r.request().method() === 'DELETE',
  );

  await page.getByTestId('delete-btn').last().click();
  await page.locator('.swal2-confirm').click();

  await deleteResp;
  await expect(page.getByTestId('materials-table')).not.toContainText('PW-UPDATED');
});

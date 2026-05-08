import { test, expect } from '@playwright/test';

test('CRUD matériels', async ({ page }) => {
  await page.goto('http://localhost:4200');

  // LOGIN
  await page.fill('input[formcontrolname="email"]', 'user1@example.com');

  await page.fill('input[formcontrolname="password"]', 'pass1234');

  await page.click('button[type="submit"]');

  // =========================
  // CREATE
  // =========================

  await page.fill('input[formcontrolname="serialNumber"]', 'PW-TEST-001');

  await page.fill('input[formcontrolname="dateMiseEnService"]', '2026-05-08');

  await page.fill('input[formcontrolname="dateFinGarantie"]', '2028-05-08');

  await page.click('.add-btn');

  await expect(page.locator('table')).toContainText('PW-TEST-001');

  // =========================
  // UPDATE
  // =========================

  await page.locator('.edit').last().click();

  await page.fill('.modal input[formcontrolname="serialNumber"]', 'PW-UPDATED');

  await page.click('.primary');

  // confirmation sweetalert
  await page.click('.swal2-confirm');

  await expect(page.locator('table')).toContainText('PW-UPDATED');

  // =========================
  // DELETE
  // =========================

  await page.locator('.delete').last().click();

  await page.click('.swal2-confirm');

  await expect(page.locator('table')).not.toContainText('PW-UPDATED');
});

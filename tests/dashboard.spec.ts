import { test, expect } from '@playwright/test';

test('Affichage dashboard', async ({ page }) => {
  await page.goto('http://localhost:4200');

  // login
  await page.fill('input[formcontrolname="email"]', 'user1@example.com');
  await page.fill('input[formcontrolname="password"]', 'pass1234');

  await page.click('button[type="submit"]');

  // dashboard
  await expect(page).toHaveURL(/dashboard/);

  // tableau matériels
  await expect(page.locator('table')).toBeVisible();

  // bonjour user
  await expect(page.locator('.topbar-user')).toContainText('Bonjour');


});

import { test, expect } from '@playwright/test';

test('DEBUG LOGIN', async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  // screenshot avant
  await page.screenshot({ path: 'before-login.png' });

  // email
  await page
    .locator('input[formcontrolname="email"]')
    .fill('user1@example.com');

  // password
  await page.locator('input[formcontrolname="password"]').fill('pass1234');

  // screenshot après saisie
  await page.screenshot({ path: 'filled-login.png' });

  // click sur lebouton
  await page.locator('button').click();

  // attente de  5 sec
  await page.waitForTimeout(5000);

  // screenshot final
  await page.screenshot({ path: 'after-login.png' });

  console.log(await page.url());
});

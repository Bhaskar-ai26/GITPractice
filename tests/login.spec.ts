import { test, expect } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/');
  await page.getByRole('textbox', { name: 'Username' }).fill('bhaskar');
  await page.getByRole('textbox', { name: 'Password' }).fill('Bhaskar@123#');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/dashboard/index');
}); 
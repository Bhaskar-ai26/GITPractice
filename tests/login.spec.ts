import { test, expect } from '@playwright/test';
import { admin } from '../testdata/creds';

test('login test', { tag: ['@smoke'] }, async ({ page }) => {
  await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/');
  /* await page.getByRole('textbox', { name: 'Username' }).fill('bhaskar');
  await page.getByRole('textbox', { name: 'Password' }).fill('Bhaskar@123#'); */
  await page.getByRole('textbox', { name: 'Username' }).fill(admin.username);
  await page.getByRole('textbox', { name: 'Password' }).fill(admin.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/dashboard/index');
}); 
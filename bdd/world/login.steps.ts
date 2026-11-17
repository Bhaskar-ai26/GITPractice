import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { HrmWorld } from './world';

Given('I navigate to hrm login page', { timeout: 60000 }, async function (this: HrmWorld) {
    await this.page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/');
});

Then('I should see the login page', async function (this: HrmWorld) {
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

When('I enter valid username as {string} and password as {string} details', async function (this: HrmWorld, username: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
});

When('I click the login button', async function (this: HrmWorld) {
    await this.page.getByRole('button', { name: 'Login' }).click();
});

Then('I should be redirected to the dashboard page', async function (this: HrmWorld) {
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

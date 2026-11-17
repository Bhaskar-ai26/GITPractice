import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';
import { HrmWorld } from '../world/world';

const APP_URL = 'https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/';
const STEP_TIMEOUT = 60000;

Given('I navigate to hrm login page', { timeout: STEP_TIMEOUT }, async function (this: HrmWorld) {
    await this.loginPage.open(APP_URL);
});

Then('I should see the login page', async function (this: HrmWorld) {
    await expect(this.loginPage.heading()).toBeVisible();
});

When('I enter valid username as {string} and password as {string} details', async function (this: HrmWorld, username: string, password: string) {
    await this.loginPage.enterCredentials(username, password);
});

When('I click the login button', async function (this: HrmWorld) {
    await this.loginPage.clickLogin();
});

Then('I should be redirected to the dashboard page', async function (this: HrmWorld) {
    await expect(this.dashboardPage.dashboardHeading()).toBeVisible();
});

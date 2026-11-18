import { expect } from '@playwright/test';
import { Then, When } from '@cucumber/cucumber';
import { HrmWorld } from '../world/world';

const STEP_TIMEOUT = 60000;
const MENU_ITEMS = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard'];

Then('I should see the all links on the dashboard', { timeout: STEP_TIMEOUT }, async function (this: HrmWorld) {
    for (const name of MENU_ITEMS) {
        await expect(this.dashboardPage.menuLink(name)).toBeVisible();
    }
});

When(/^I click on (.+) link$/, { timeout: STEP_TIMEOUT }, async function (this: HrmWorld, linkName: string) {
    await this.dashboardPage.clickMenu(linkName);
});

// The lookahead keeps this from matching the login step "I should be redirected to the dashboard page".
Then(/^I should be redirected to (?!the dashboard page$)(.+) page$/, { timeout: STEP_TIMEOUT }, async function (this: HrmWorld, pageName: string) {
    await expect(this.dashboardPage.pageHeading(pageName)).toBeVisible();
});

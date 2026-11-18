import { Browser, chromium, Page, expect } from '@playwright/test';
import { Given, When, Then, After } from '@cucumber/cucumber';

const DASHBOARD_URL = 'https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/';
const USERNAME = 'testadmin';
const PASSWORD = 'Vibetestq@123#';
const MENU_ITEMS = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard'];
// My Info's page shows "PIM" as its heading instead of its own name.
const PAGE_HEADINGS: Record<string, string> = { 'My Info': 'PIM' };
const STEP_TIMEOUT = 60000; 

let browser: Browser;
let page: Page;

Given('I see the all links on the dashboard', { timeout: STEP_TIMEOUT }, async () => {
    browser = await chromium.launch();
    page = await (await browser.newContext()).newPage();
    await page.goto(DASHBOARD_URL);
    await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);
    await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    for (const name of MENU_ITEMS) {
        await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
    }
});

When(/^I click on (.+) link$/, { timeout: STEP_TIMEOUT }, async (linkName: string) => {
    await page.getByRole('link', { name: linkName, exact: true }).click();
});

// The lookahead keeps this from matching login's "I should be redirected to the dashboard page".
Then(/^I should be redirected to (?!the dashboard page$)(.+) page$/, { timeout: STEP_TIMEOUT }, async (pageName: string) => {
    const heading = PAGE_HEADINGS[pageName] ?? pageName;
    await expect(page.getByRole('heading', { name: new RegExp(`^${heading}$`, 'i') })).toBeVisible();
});

After(async () => {
    await browser?.close();
});




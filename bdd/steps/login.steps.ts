import { Browser, chromium, BrowserContext, Page, expect } from '@playwright/test';
import { Given, When, Then, After } from '@cucumber/cucumber';


let browser: Browser;
let context: BrowserContext;
let page: Page;

Given('I navigate to hrm login page', async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/');    // Implement navigation to HRM login page
});

Then('I should see the login page', async () => {
    // Implement verification of login page
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible(); // Example check for login page URL
   // await page.waitForSelector('input[name="username"]'); // Example selector for username input
});

When('I enter valid username as {string} and password as {string} details', async (username, password) => {
    await page.getByRole('textbox', { name: 'Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
});

When('I click the login button', async () => {
    await page.getByRole('button', { name: 'Login' }).click(); 
});

Then('I should be redirected to the dashboard page', async () => {
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible(); 
});

// Shared with employee.steps.ts so employee scenarios run on the logged-in page.
export function currentPage(): Page {
    return page;
}

After(async () => {
    await browser?.close();
});
import { expect } from '@playwright/test';
import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { currentPage } from './login.steps';

setDefaultTimeout(60000);

When('I open the Add Employee page', async () => {
    const page = currentPage();
    await page.getByRole('link', { name: 'PIM', exact: true }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();
});

When('I enter first name {string} and last name {string}', async (firstName: string, lastName: string) => {
    const page = currentPage();
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
});

When('I click the save button', async () => {
    await currentPage().getByRole('button', { name: 'Save' }).first().click();
});

Then('I should see the employee personal details page', async () => {
    await expect(currentPage()).toHaveURL(/viewPersonalDetails/);
});

Then('I should see a required field validation message', async () => {
    await expect(currentPage().getByText('Required').first()).toBeVisible();
});

Given('an employee with first name {string} exists', async (firstName: string) => {
    const page = currentPage();
    await page.getByRole('link', { name: 'PIM', exact: true }).click();
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Employee');
    await page.getByRole('button', { name: 'Save' }).first().click();
    await expect(page).toHaveURL(/viewPersonalDetails/);
});

When('I search for employee {string}', async (employeeName: string) => {
    const page = currentPage();
    await page.getByRole('link', { name: 'PIM', exact: true }).click();
    await page.getByPlaceholder('Type for hints...').first().fill(employeeName);
    await page.getByRole('option', { name: new RegExp(employeeName) }).first().click();
    await page.getByRole('button', { name: 'Search' }).click();
});

When('I open the first employee in the results', async () => {
    await currentPage().locator('.oxd-table-body .oxd-table-row').first().click();
});

When('I change the first name to {string}', async (firstName: string) => {
    await currentPage().getByRole('textbox', { name: 'First Name' }).fill(firstName);
});

Then('I should see the saved message', async () => {
    await expect(currentPage().getByText(/Successfully (Updated|Saved)/)).toBeVisible();
});

import { expect } from '@playwright/test';
import { When, Given, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { HrmWorld } from '../world/world';

setDefaultTimeout(60000);

When('I open the Add Employee page', async function (this: HrmWorld) {
    await this.dashboardPage.clickMenu('PIM');
    await this.pimPage.addButton().click();
    await expect(this.pimPage.addEmployeeHeading()).toBeVisible();
});

When('I enter first name {string} and last name {string}', async function (this: HrmWorld, firstName: string, lastName: string) {
    await this.pimPage.enterName(firstName, lastName);
});

When('I click the save button', async function (this: HrmWorld) {
    await this.pimPage.save();
});

Then('I should see the employee personal details page', async function (this: HrmWorld) {
    await expect(this.page).toHaveURL(/viewPersonalDetails/);
});

Then('I should see a required field validation message', async function (this: HrmWorld) {
    await expect(this.pimPage.requiredMessage()).toBeVisible();
});

When('I search for employee {string}', async function (this: HrmWorld, employeeName: string) {
    await this.dashboardPage.clickMenu('PIM');
    await this.pimPage.searchFor(employeeName);
});

Given('an employee with first name {string} exists', async function (this: HrmWorld, firstName: string) {
    await this.dashboardPage.clickMenu('PIM');
    await this.pimPage.addButton().click();
    await expect(this.pimPage.addEmployeeHeading()).toBeVisible();
    await this.pimPage.enterName(firstName, 'Employee');
    await this.pimPage.save();
    await expect(this.page).toHaveURL(/viewPersonalDetails/);
});

When('I open the first employee in the results', async function (this: HrmWorld) {
    await this.pimPage.openFirstResult();
});

When('I change the first name to {string}', async function (this: HrmWorld, firstName: string) {
    await this.pimPage.changeFirstName(firstName);
});

Then('I should see the saved message', async function (this: HrmWorld) {
    await expect(this.pimPage.savedMessage()).toBeVisible();
});

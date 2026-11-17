import { Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';

export class PimPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    addButton(): Locator {
        return this.page.getByRole('button', { name: 'Add' });
    }

    addEmployeeHeading(): Locator {
        return this.page.getByRole('heading', { name: 'Add Employee' });
    }

    async enterName(firstName: string, lastName: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    }

    async save() {
        await this.page.getByRole('button', { name: 'Save' }).first().click();
    }

    requiredMessage(): Locator {
        return this.page.getByText('Required').first();
    }

    async searchFor(employeeName: string) {
        await this.page.getByPlaceholder('Type for hints...').first().fill(employeeName);
        await this.page.getByRole('option', { name: new RegExp(employeeName) }).first().click({ timeout: 60000 });
        await this.page.getByRole('button', { name: 'Search' }).click();
    }

    async openFirstResult() {
        await this.page.locator('.oxd-table-body .oxd-table-row').first().click();
    }

    async changeFirstName(firstName: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    }

    savedMessage(): Locator {
        return this.page.getByText(/Successfully (Updated|Saved)/);
    }
}

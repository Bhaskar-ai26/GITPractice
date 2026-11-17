import { Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';

// My Info's page shows "PIM" as its heading instead of its own name.
const HEADING_OVERRIDES: Record<string, string> = { 'My Info': 'PIM' };

export class DashboardPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    dashboardHeading(): Locator {
        return this.page.getByRole('heading', { name: 'Dashboard', exact: true });
    }

    menuLink(name: string): Locator {
        return this.page.getByRole('link', { name, exact: true });
    }

    async clickMenu(name: string) {
        await this.menuLink(name).click();
    }

    // Case-insensitive, so "admin" in a feature matches the "Admin" heading.
    pageHeading(name: string): Locator {
        const target = HEADING_OVERRIDES[name] ?? name;
        return this.page.getByRole('heading', { name: new RegExp(`^${target}$`, 'i') });
    }
}

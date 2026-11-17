import { Locator, Page } from '@playwright/test';
import { BasePage } from './basepage';

export class LoginPage extends BasePage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.loginHeading = page.getByRole('heading', { name: 'Login' });
    }

    async open(url: string) {
        await this.navigateTo(url);
    }

    async enterCredentials(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    heading(): Locator {
        return this.loginHeading;
    }
}

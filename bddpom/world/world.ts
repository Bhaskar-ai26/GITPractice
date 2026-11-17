import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginPage } from '../pages/loginpage';
import { DashboardPage } from '../pages/dashboardpage';
import { PimPage } from '../pages/pimpage';

export class HrmWorld extends World {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    loginPage!: LoginPage;
    dashboardPage!: DashboardPage;
    pimPage!: PimPage;

    constructor(options: IWorldOptions) {
        super(options);
    }

    async open() {
        this.browser = await chromium.launch();
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.pimPage = new PimPage(this.page);
    }

    async close() {
        await this.browser?.close();
    }
}

setWorldConstructor(HrmWorld);

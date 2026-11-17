import { Locator, Page } from '@playwright/test';
export class PageLinks {
    protected page: Page;
    private linkAdmin: Locator
    private linkPIM: Locator;
    private linkLeave: Locator;
    private linkTime: Locator;
    private linkMyInfo: Locator;


    constructor(page: Page) {
        this.page = page;
        this.linkAdmin = page.getByRole('link', { name: 'Admin' }).describe('Admin link');
        this.linkPIM = page.getByRole('link', { name: 'PIM' }).describe('PIM link');
        this.linkLeave = page.getByRole('link', { name: 'Leave' }).describe('Leave link');
        this.linkTime = page.getByRole('link', { name: 'Time' }).describe('Time link');
        this.linkMyInfo = page.getByRole('link', { name: 'My Info' }).describe('My Info link');
    }

    public async clickAdminLink() {
        await this.linkAdmin.click();
        console.log(` ${this.linkAdmin} clicked`);
    }

    public async clickPIMLink() {
        await this.linkPIM.click();
        console.log(` ${this.linkPIM} clicked`);
    }

    public async clickLeaveLink() {
        await this.linkLeave.click();
        console.log(` ${this.linkLeave} clicked`);
    }

    public async clickTimeLink() {
        await this.linkTime.click();
        console.log(` ${this.linkTime} clicked`);
    }

    public async clickMyInfoLink() {
        await this.linkMyInfo.click();
        console.log(` ${this.linkMyInfo} clicked`);
    }
}
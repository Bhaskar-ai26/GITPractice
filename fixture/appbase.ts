import { test as base } from '@playwright/test';
import * as pages from '../pom'

type tPages ={
    basepage: pages.BasePage
    loginpage: pages.LoginPage 

}

let test = base.extend<{ AppPages: tPages }>({
    AppPages: async ({ page }, use) => {
        await use({
            basepage: new pages.BasePage(page),
            loginpage: new pages.LoginPage(page)
        });
    }
});

export { test };
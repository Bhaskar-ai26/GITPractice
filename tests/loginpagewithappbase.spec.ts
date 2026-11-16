import { test } from '../fixture/appbase';

test('login test', async ({ AppPages }) => {
    await AppPages.loginpage.urlNavigation();
    await AppPages.loginpage.loginDetails();
    await AppPages.loginpage.loginButton();
});
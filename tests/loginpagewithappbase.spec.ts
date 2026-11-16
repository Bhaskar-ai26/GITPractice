import { test } from '../fixture/appbase';

test('login test', {tag: ['@all']} ,  async ({ AppPages }) => {
    await AppPages.loginpage.urlNavigation();
    await AppPages.loginpage.loginDetails();
    await AppPages.loginpage.loginButton();
});
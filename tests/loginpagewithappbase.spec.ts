import { test } from '../fixture/appbase';

test('login test', {tag: ['@all']} ,  async ({ AppPages }) => {
    await AppPages.loginpage.urlNavigation();
    await AppPages.loginpage.loginDetails();
    await AppPages.loginpage.loginButton();

      await AppPages.pagelinks.clickAdminLink();

      await AppPages.pagelinks.clickPIMLink();
      await AppPages.pagelinks.clickLeaveLink();
      await AppPages.pagelinks.clickTimeLink();
      await AppPages.pagelinks.clickMyInfoLink();
});

/* test('click admin link', {tag: ['@all']} ,  async ({ AppPages }) => {
  
});
test('click PIM link', {tag: ['@all']} ,  async ({ AppPages }) => {
    await AppPages.pagelinks.clickPIMLink();
});
test('click Leave link', {tag: ['@all']} ,  async ({ AppPages }) => {
    await AppPages.pagelinks.clickLeaveLink();
});
test('click Time link', {tag: ['@all']} ,  async ({ AppPages }) => {
    await AppPages.pagelinks.clickTimeLink();
});
test('click My Info link', {tag: ['@all']} ,  async ({ AppPages }) => {
    await AppPages.pagelinks.clickMyInfoLink();     
}); */
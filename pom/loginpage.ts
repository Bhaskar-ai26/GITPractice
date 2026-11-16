import { BasePage } from './basepage';
import { Locator, Page } from '@playwright/test';
import {admin} from '../testdata/creds'

const url = "https://qtpsudhakar-vibetestq-hrm.up.railway.app/"

export class LoginPage extends BasePage {
    private txtUserName :Locator;
    private txtPassword :Locator;
    private clickLogin: Locator;


  constructor(page: Page) {
    super(page);
    this.txtUserName = page.getByRole('textbox', { name: 'Username' }).describe("User text box");
    this.txtPassword = page.getByRole('textbox', { name: 'Password' }).describe("Password text box");
    this.clickLogin = page.getByRole('button', { name: 'Login' }).describe("Login Button");
  }

  public async urlNavigation(){
    await this.navigateTo(url)
  }

  public async loginDetails(){
    await this.txtUserName.fill(admin.username);
    await this.txtPassword.fill(admin.password);
  }

  public async loginButton(){
    await this.clickLogin.click();
  }

}
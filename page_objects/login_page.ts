import { Locator, Page } from "@playwright/test";
import { test_constants as tc } from "../test_constants";

export class LoginPage {
  readonly page: Page;
  readonly errorMessage: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorCode: Locator;

  constructor(page: Page) {
    this.page = page;
    this.errorMessage = page.locator(".text-danger ul");
    this.usernameInput = page.locator("#Username");
    this.passwordInput = page.locator("#Password");
    this.loginButton = page.locator('button[type="submit"]');
    this.errorCode = page.locator("div[jscontent='errorCode']");
  }

  /**
   * Login to the application
   * @param username
   * @param password
   * @returns void
   * @example
   * await loginPage.login("admin", "password");
   */
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  /**
   * Navigate to the login page
   * @returns void
   * @example
   * await loginPage.goto();
   */
  async goto() {
    await this.page.goto(tc.LOGIN_PAGE_URL);
    await this.page.waitForLoadState("networkidle");
  }
}

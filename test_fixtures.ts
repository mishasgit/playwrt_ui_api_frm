import { test as base } from "@playwright/test";
import { PageManager } from "./page_objects/page_manager";
import { LoginPage } from "./page_objects/login_page";
import { ApiHelper } from "./api_helper";

export type TestFixtures = {
  pm: PageManager;
  login: string;
  api: ApiHelper;
};

export const test = base.extend<TestFixtures>({
  pm: async ({ page }, use) => {
    const pageManger = new PageManager(page);
    await use(pageManger);
  },

  login: async ({ page }, use) => {
    const username = process.env.USER_NAME;
    const password = process.env.PASSWORD;
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForLoadState("networkidle");
    await loginPage.login(username, password);
    await page.waitForResponse(
      (response) =>
        response.url().includes("/Prod/api/employees") &&
        response.request().method() === "GET" &&
        response.status() === 200
    );
    await use("");
  },

  api: async ({ request }, use) => {
    const apiHelper = new ApiHelper(request);
    await use(apiHelper);
  },
});

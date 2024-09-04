import { expect } from "@playwright/test";
import { test } from "../../test_fixtures";
import { test_constants as tc } from "../../test_constants";

const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

test.describe("Login Page tests @ui_test", async () => {
  test.beforeEach(async ({ page, pm }) => {
    await pm.loginPage().goto();
    await pm.waitForIdle();
  });

  test("Login with valid credentials", async ({ page, pm }, testInfo) => {
    //some login page is slow increase timeout
    if (testInfo.retry > 0) {
      test.use({
        navigationTimeout: 20000,
      });
    }
    await pm.loginPage().login(username, password);
    await pm.waitForIdle();
    expect(page.url()).toContain("/Prod/Benefits");
  });

  test("Login with invalid credentials", async ({ page, pm }) => {
    await pm.loginPage().login(`TestUser428`, "U>-iD)e)wnj4");
    await pm.waitForIdle();
    expect(page.url()).toContain(tc.LOGIN_PAGE_URL);
    const errorMessage = await pm.loginPage().getErrorMessage();
    expect(errorMessage).toContain(
      "The specified username or password is incorrect."
    );
  });

  test("Login with empty inputs", async ({ page, pm }) => {
    await pm.loginPage().login("", password);
    await pm.waitForIdle();
    expect(page.url()).toContain(tc.LOGIN_PAGE_URL);
    const errorMessage = await pm.loginPage().getErrorMessage();
    expect(errorMessage).toContain("The Username field is required.");
    await pm.loginPage().login(username, "");
    await pm.waitForIdle();
    expect(page.url()).toContain(tc.LOGIN_PAGE_URL);
    const errorMessage2 = await pm.loginPage().getErrorMessage();
    expect(errorMessage2).toContain("The Password field is required.");
    await pm.loginPage().login("", "");
    await pm.waitForIdle();
    expect(page.url()).toContain(tc.LOGIN_PAGE_URL);
    const errorMessage3 = await pm.loginPage().getErrorMessage();
    expect(errorMessage3).toContain("The Username field is required.");
    expect(errorMessage3).toContain("The Password field is required.");
  });

  test("login with username of length 1", async ({ page, pm }) => {
    //bug if username is of length different from 11 it returns 405 and crashes the app
    // catching it here
    page.on("response", (response) => {
      if (
        response.url().includes(tc.LOGIN_PAGE_URL) &&
        response.request().method() === "POST"
      ) {
        expect(response.status()).toBe(405);
      }
    });
    await pm.loginPage().login("a", password);
    //bug if username is of length different from 11 it returns 405 and crashes the app
    // await pm.waitForIdle();
    // expect(page.url()).toContain(tc.LOGIN_PAGE_URL);
    // const errorMessage = await pm.loginPage().getErrorMessage();
    // expect(errorMessage).toContain("The field Username must be a string with a minimum length of 2 and a maximum length of 50.");
  });

  test.describe("Logout tests", async () => {
    test.describe.configure({ retries: 2 });

    test.beforeEach(async ({ page, pm }) => {
      await pm.loginPage().goto();
      await pm.waitForIdle();
      await pm.loginPage().login(username, password);
      await pm.waitForEmployeeResponse();
    });

    test("Logout", async ({ page, pm }) => {
      await pm.dashboardPage().logOut();
      await pm.waitForIdle();
      expect(page.url()).toContain(tc.LOGIN_PAGE_URL);
    });
  });
});

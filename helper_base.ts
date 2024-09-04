import { Page } from "@playwright/test";
import { test_constants as tc } from "./test_constants";

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * wait for number of seconds
   * @param seconds
   * @returns void
   * @example
   * await page.waitForNumOfSeconds(5);
   */
  async waitForNumOfSeconds(seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
  }

  /**
   * wait for employees API response
   * @returns void
   * @example
   * await page.waitForEmployeeResponse();
   */
  async waitForEmployeeResponse() {
    await this.page.waitForResponse(
      (response) =>
        response.url().includes(tc.EMPLOYEES_API_URL) &&
        response.request().method() === "GET" &&
        response.status() === 200
    );
  }

  /**
   * wait for idle state
   * @returns void
   * @example
   * await page.waitForIdle();
   */
  async waitForIdle() {
    await this.page.waitForLoadState("networkidle");
  }
}

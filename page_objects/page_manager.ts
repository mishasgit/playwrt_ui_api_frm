import { Page } from "@playwright/test";
import { LoginPage } from "./login_page";
import { DashboardPage } from "./dashboard_page";
import { HelperBase } from "../helper_base";

export class PageManager extends HelperBase {
  private lp: LoginPage;
  private dp: DashboardPage;

  constructor(page: Page) {
    super(page);
    this.lp = new LoginPage(page);
    this.dp = new DashboardPage(page);
  }

  loginPage() {
    return this.lp;
  }

  dashboardPage() {
    return this.dp;
  }
}

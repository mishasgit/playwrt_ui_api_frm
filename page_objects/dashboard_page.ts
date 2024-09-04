import { Locator, Page } from "@playwright/test";
import { AddEmployeeModal } from "./add_employee_modal";
import { EmployeeTable } from "./employee_table";

export class DashboardPage {
  readonly page: Page;
  private readonly addModal: AddEmployeeModal;
  private readonly table: EmployeeTable;
  readonly logOutBtn: Locator;
  readonly headerLink: Locator;
  readonly addEmployee: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addModal = new AddEmployeeModal(page);
    this.table = new EmployeeTable(page);
    this.logOutBtn = this.page.locator("li[class='nav-item'] a");
    this.headerLink = this.page.locator("a.navbar-brand");
    this.addEmployee = this.page.locator("#add");
  }

  async openAddModal() {
    await this.addEmployee.click();
    return this.addModal;
  }

  getTable() {
    return this.table;
  }

  async logOut() {
    await this.logOutBtn.click();
  }
}

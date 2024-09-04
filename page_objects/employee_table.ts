import { Page, Locator } from "@playwright/test";
import { UpdateEmployeeModal } from "./update_employee_modal";
import { DeleteEmployeeModal } from "./delete_employee_modal";

export class EmployeeTable {
  readonly page: Page;
  private readonly updateModal: UpdateEmployeeModal;
  private readonly deleteModal: DeleteEmployeeModal;
  readonly table: Locator;
  readonly tableHeaderRow: Locator;
  readonly tableHeader: Locator;
  readonly tableBody: Locator;
  readonly tableRow: Locator;
  readonly updateBtn: string;
  readonly deleteBtn: string;

  constructor(page: Page) {
    this.page = page;
    this.updateModal = new UpdateEmployeeModal(page);
    this.deleteModal = new DeleteEmployeeModal(page);
    this.table = this.page.locator("#employeesTable");
    this.tableHeaderRow = this.page.locator(".thead-dark");
    this.tableHeader = this.tableHeaderRow.locator("tr th");
    this.tableBody = this.page.locator("tbody");
    this.tableRow = this.tableBody.locator("tr");
    this.updateBtn = "i[class='fas fa-edit']";
    this.deleteBtn = "i[class='fas fa-times']";
  }

  /**
   * Get the table header text by index
   * @param index
   * @returns
   * @example
   * await employeeTable.getTableHeaderByIndex(0);
   */
  async getTableHeaderByIndex(index: number) {
    return await this.tableHeader.nth(index).innerText();
  }

  /**
   * Get the table header text by name
   * @param name
   * @returns
   * @example
   * await employeeTable.getTableHeaderByName("First Name");
   */
  async getTableRowCount() {
    return await this.tableRow.count();
  }
  /**
   * Get the table row by index
   * @param index
   * @returns
   * @example
   * await employeeTable.getTableRowByIndex(0);
   */
  async getTableRowByIndex(index: number) {
    return this.tableRow.nth(index);
  }
  /**
   * Get the table row by last or first name
   * @param name
   * @returns Locator
   * @example
   * await employeeTable.getRowByLastOrFirstName("John");
   */
  async getRowByLastOrFirstName(name: string) {
    const rowCount = await this.tableRow.count();
    const rows = this.tableRow;
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.textContent();
      if (rowText && rowText.includes(name)) {
        return row;
      }
    }
  }

  /**
   * Get the table row by ID
   * @param id
   * @returns Locator
   * @example
   * await employeeTable.getRowById("1");
   */
  async getRowById(id: string) {
    const rowCount = await this.tableRow.count();
    const rows = this.tableRow;
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const rowText = await row.textContent();
      if (rowText && rowText.includes(id)) {
        return row;
      }
    }
  }

  /**
   * Get the row data by index
   * @param index
   * @returns Object
   * @example
   * await employeeTable.getRowDataByIndex(0);
   */
  async getRowDataByIndex(index: number) {
    const row = await this.getTableRowByIndex(index);
    if (!row) {
      throw new Error("Row is undefined");
    }
    return {
      id: await row.locator("td").nth(0).innerText(),
      firstName: await row.locator("td").nth(2).innerText(),
      lastName: await row.locator("td").nth(1).innerText(),
      dependants: await row.locator("td").nth(3).innerText(),
      salary: await row.locator("td").nth(4).innerText(),
      grossPay: await row.locator("td").nth(5).innerText(),
      benefitsCost: await row.locator("td").nth(6).innerText(),
      netPay: await row.locator("td").nth(7).innerText(),
      upodateBtn: row.locator("td").nth(8),
      deleteBtn: row.locator("td").nth(8),
      clickUpdate: async () => {
        await row.locator(this.updateBtn).click();
        return this.updateModal;
      },
      clickDelete: async () => {
        await row.locator(this.deleteBtn).click();
        return this.deleteModal;
      },
    };
  }

  /**
   * Get the row data by ID
   * @param id
   * @returns Object
   * @example
   * await employeeTable.getRowDataById("1");
   */
  async getRowDataById(id: string) {
    const row = await this.getRowById(id);
    if (!row) {
      throw new Error("Row is undefined");
    }
    return {
      id: await row.locator("td").nth(0).innerText(),
      firstName: await row.locator("td").nth(2).innerText(),
      lastName: await row.locator("td").nth(1).innerText(),
      dependants: await row.locator("td").nth(3).innerText(),
      salary: await row.locator("td").nth(4).innerText(),
      grossPay: await row.locator("td").nth(5).innerText(),
      benefitsCost: await row.locator("td").nth(6).innerText(),
      netPay: await row.locator("td").nth(7).innerText(),
      upodateBtn: row.locator("td").nth(8),
      deleteBtn: row.locator("td").nth(8),
      clickUpdate: async () => {
        await row.locator(this.updateBtn).click();
        return this.updateModal;
      },
      clickDelete: async () => {
        await row.locator(this.deleteBtn).click();
        return this.deleteModal;
      },
    };
  }

  /**
   * Get the row data by last or first name
   * @param name
   * @returns Object
   * @example
   * await employeeTable.getRowDataByName("John");
   */
  async getRowDataByName(name: string) {
    const row = await this.getRowByLastOrFirstName(name);
    if (!row) {
      throw new Error("Row is undefined");
    }
    return {
      id: await row.locator("td").nth(0).innerText(),
      firstName: await row.locator("td").nth(2).innerText(),
      lastName: await row.locator("td").nth(1).innerText(),
      dependants: await row.locator("td").nth(3).innerText(),
      salary: await row.locator("td").nth(4).innerText(),
      grossPay: await row.locator("td").nth(5).innerText(),
      benefitsCost: await row.locator("td").nth(6).innerText(),
      netPay: await row.locator("td").nth(7).innerText(),
      upodateBtn: row.locator("td").nth(8),
      deleteBtn: row.locator("td").nth(8),
      clickUpdate: async () => {
        await row.locator(this.updateBtn).click();
        return this.updateModal;
      },
      clickDelete: async () => {
        await row.locator(this.deleteBtn).click();
        return this.deleteModal;
      },
    };
  }

  /**
   * Check if table contains ID
   * @param id
   * @returns
   * @example
   * await employeeTable.checkIfTableConatisId("1");
   */
  async checkIfTableConatisId(id: string) {
    return await this.tableBody.locator("tr", { hasText: id }).count();
  }
}

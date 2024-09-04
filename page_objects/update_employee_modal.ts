import { Locator, Page } from "@playwright/test";

export class UpdateEmployeeModal {
  readonly page: Page;
  readonly modalTitle: Locator;
  readonly closeBtn: Locator;
  readonly updateBtn: Locator;
  readonly cancelBtn: Locator;
  readonly fnInput: Locator;
  readonly lnInput: Locator;
  readonly depInput: Locator;
  readonly modalContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalContainer = this.page.locator(
      "div[id='employeeModal'] .modal-content"
    );
    this.modalTitle = this.modalContainer.locator("h5.modal-title");
    this.closeBtn = this.modalContainer.locator("button.close");
    this.updateBtn = this.page.locator("#updateEmployee");
    this.cancelBtn = this.modalContainer.locator(".btn-secondary");
    this.fnInput = this.page.locator("#firstName");
    this.lnInput = this.page.locator("#lastName");
    this.depInput = this.page.locator("#dependants");
  }

  /**
   * Fill the modal with the provided values
   * @param firstName
   * @param lastName
   * @param dependants
   * @returns
   * @example
   * await updateEmployeeModal.fillModal("John", "Doe", "3");
   */
  async fillModal(firstName: string, lastName: string, dependants: string) {
    await this.fnInput.fill(firstName);
    await this.lnInput.fill(lastName);
    await this.depInput.fill(dependants);
  }

  async clickUpdate() {
    await this.updateBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async closeModal() {
    await this.closeBtn.click();
  }

  async getModalTitle() {
    return await this.modalTitle.innerText();
  }

  async getFirstName() {
    return await this.fnInput.inputValue();
  }

  async getLastName() {
    return await this.lnInput.inputValue();
  }

  async getDependants() {
    return await this.depInput.inputValue();
  }
}

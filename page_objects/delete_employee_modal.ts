import { Locator, Page } from "@playwright/test";

export class DeleteEmployeeModal {
  readonly page: Page;
  readonly title: Locator;
  readonly deleteBtn: Locator;
  readonly cancelBtn: Locator;
  readonly modalContainer: Locator;
  readonly closeBtn: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalContainer = this.page.locator(
      "div[id='deleteModal'] .modal-content"
    );
    this.title = this.modalContainer.locator("h5.modal-title");
    this.deleteBtn = this.page.locator("#deleteEmployee");
    this.cancelBtn = this.modalContainer.locator(".btn-secondary");
    this.closeBtn = this.modalContainer.locator("button.close");
    this.message = this.modalContainer.locator(".col-sm-12");
  }

  async clickDelete() {
    await this.deleteBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async closeModal() {
    await this.closeBtn.click();
  }

  async getTitle() {
    return await this.title.innerText();
  }

  async getMessage() {
    return await this.message.innerText();
  }

  async getModal() {
    return this.modalContainer;
  }
}

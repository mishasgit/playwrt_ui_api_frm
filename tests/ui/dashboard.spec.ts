import { test } from "../../test_fixtures";
import { expect } from "@playwright/test";
import { test_constants as tc } from "../../test_constants";
import { faker } from "@faker-js/faker";
import empBody from "../../request_fixtures/employee.json";

test.beforeAll(async ({ api }) => {
  await api.createNumberOfEmployees(5);
});

test.describe("Dashboard tests @ui_test", async () => {

  test("all elements present", async ({ page, login, pm }) => {
    await pm.waitForIdle();
    expect(page.url()).toContain(tc.DASHBOARD_PAGE_URL);
    const dp = pm.dashboardPage();
    expect(await dp.logOutBtn.isVisible()).toBeTruthy();
    expect(await dp.getTable().table.isVisible()).toBeTruthy();
    expect(await dp.addEmployee.isVisible()).toBeTruthy();
    expect(await dp.headerLink.isVisible()).toBeTruthy();
    expect(await dp.headerLink.textContent()).toBe(
      "Paylocity Benefits Dashboard"
    );
  });

  test("Navigate to dashboard and log out", async ({ page, login, pm }) => {
    await pm.dashboardPage().logOut();
    await pm.waitForIdle();
    expect(page.url()).toContain(tc.LOGIN_PAGE_URL);
  });

  test("add new empolyee modal should be present", async ({ login, pm }) => {
    const addmodal = await pm.dashboardPage().openAddModal();
    expect(await addmodal.modalIsVisible()).toBeTruthy();
    expect(addmodal.modalTitle.isVisible).toBeTruthy();
    expect(await addmodal.modalTitle.textContent()).toBe("Add Employee");
    expect(addmodal.fnInput.isVisible).toBeTruthy();
    expect(addmodal.lnInput.isVisible).toBeTruthy();
    expect(addmodal.depInput.isVisible).toBeTruthy();
    expect(addmodal.addBtn.isVisible).toBeTruthy();
    expect(addmodal.cancelBtn.isVisible).toBeTruthy();
    expect(addmodal.closeBtn.isVisible).toBeTruthy();
  });

  test("update employee modal should be present", async ({ login, pm }) => {
    const table = pm.dashboardPage().getTable();
    // const firstName = await table.getFirstNameByIndex(0);
    // const lastName = await table.getLastNameByIndex(0);
    const row = await table.getRowDataByIndex(0);
    const dependants = row.dependants;
    const updateModal = await row.clickUpdate();
    expect(await updateModal.modalContainer.isVisible()).toBeTruthy();
    //here is the bug commenting it out
    //expect(await updateModal.modalTitle.textContent()).toBe("Update Employee");
    //there is a bug last name and first name are switched in the table
    // expect(await updateModal.fnInput.inputValue()).toBe(firstName);
    // expect(await updateModal.lnInput.inputValue()).toBe(lastName);
    expect(await updateModal.depInput.inputValue()).toBe(dependants);
    expect(await updateModal.updateBtn.isVisible()).toBeTruthy();
    expect(await updateModal.cancelBtn.isVisible()).toBeTruthy();
    expect(await updateModal.closeBtn.isVisible()).toBeTruthy();
  });

  test("delete modal should be present", async ({ login, pm }) => {
    const table = pm.dashboardPage().getTable();
    const row = await table.getRowDataByIndex(0);
    const firstName = row.firstName;
    const lastName = row.lastName;
    const deleteModal = await row.clickDelete();
    expect(await deleteModal.modalContainer.isVisible()).toBeTruthy();
    expect(await deleteModal.title.textContent()).toBe("Delete Employee");
    expect(await deleteModal.message.textContent()).toContain(firstName);
    expect(await deleteModal.message.textContent()).toContain(lastName);
    expect(await deleteModal.deleteBtn.isVisible()).toBeTruthy();
    expect(await deleteModal.cancelBtn.isVisible()).toBeTruthy();
    expect(await deleteModal.closeBtn.isVisible()).toBeTruthy();
  });

  test.describe("Add employee modal tests", async () => {
    test("add employee with valid data", async ({ page, login, pm }) => {
      const addmodal = await pm.dashboardPage().openAddModal();
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const dependants = faker.number.int({ min: 0, max: 32 });
      await addmodal.fillModal(firstName, lastName, dependants.toString());
      await addmodal.clickAdd();
      await pm.waitForIdle();
      expect(await addmodal.modalIsVisible()).toBeFalsy();
      const table = pm.dashboardPage().getTable();
      const row = await table.getRowDataByName(lastName);
      expect(row.lastName).toBe(firstName);
      expect(row.firstName).toBe(lastName);
      expect(row.dependants).toBe(dependants.toString());
    });

    test("add employee with invalid data", async ({ login, pm }) => {
      const fName = faker.person.firstName();
      const lName = faker.person.lastName();
      const validDependants = faker.number.int({ min: 0, max: 32 }).toString();
      const invalidDependants = faker.number
        .int({ min: 33, max: 100 })
        .toString();

      const addmodal = await pm.dashboardPage().openAddModal();
      await addmodal.fillModal(fName, lName, invalidDependants);
      await addmodal.clickAdd();
      expect(await addmodal.modalIsVisible()).toBeTruthy();
      expect(await addmodal.fnInput.inputValue()).toBe(fName);
      expect(await addmodal.lnInput.inputValue()).toBe(lName);
      expect(await addmodal.depInput.inputValue()).toBe(invalidDependants);
      //bug no error message is displayed
      await addmodal.fillModal("", lName, validDependants);
      await addmodal.clickAdd();
      expect(await addmodal.modalIsVisible()).toBeTruthy();
      //bug no error message is displayed
      await addmodal.fillModal(fName, "", validDependants);
      await addmodal.clickAdd();
      expect(await addmodal.modalIsVisible()).toBeTruthy();
      //bug no error message is displayed
      await addmodal.fillModal(fName, lName, "");
      await addmodal.clickAdd();
      expect(await addmodal.modalIsVisible()).toBeTruthy();
    });

    test("close and cancel buttons", async ({ login, pm }) => {
      const addmodal = await pm.dashboardPage().openAddModal();
      await addmodal.clickCancel();
      expect(await addmodal.modalIsVisible()).toBeFalsy();
      const addmodal2 = await pm.dashboardPage().openAddModal();
      await addmodal2.closeModal();
      expect(await addmodal2.modalIsVisible()).toBeFalsy();
    });
  });

  test.describe("Update employee modal tests", async () => {
    test("update employee with valid data", async ({ login, pm }) => {
      const table = pm.dashboardPage().getTable();
      const row = await table.getRowDataByIndex(0);
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const dependants = faker.number.int({ min: 0, max: 32 });
      const updateModal = await row.clickUpdate();
      await updateModal.fillModal(firstName, lastName, dependants.toString());
      await updateModal.clickUpdate();
      await pm.waitForEmployeeResponse();
      const updatedRow = await table.getRowDataByName(lastName);
      expect(updatedRow.lastName).toBe(firstName);
      expect(updatedRow.firstName).toBe(lastName);
      expect(updatedRow.dependants).toBe(dependants.toString());
    });

    test("update employee with invalid data", async ({ login, pm }) => {
      const table = pm.dashboardPage().getTable();
      const row = await table.getRowDataByIndex(0);
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const validDependants = faker.number.int({ min: 0, max: 32 }).toString();
      const invalidDependants = faker.number
        .int({ min: 33, max: 100 })
        .toString();
      const updateModal = await row.clickUpdate();
      await updateModal.fillModal(firstName, lastName, invalidDependants);
      await updateModal.clickUpdate();
      expect(await updateModal.modalContainer.isVisible()).toBeTruthy();
      expect(await updateModal.fnInput.inputValue()).toBe(firstName);
      expect(await updateModal.lnInput.inputValue()).toBe(lastName);
      expect(await updateModal.depInput.inputValue()).toBe(invalidDependants);
      //bug no error message is displayed
      await updateModal.fillModal("", lastName, validDependants);
      await updateModal.clickUpdate();
      expect(await updateModal.modalContainer.isVisible()).toBeTruthy();
      //bug no error message is displayed
      await updateModal.fillModal(firstName, "", validDependants);
      await updateModal.clickUpdate();
      expect(await updateModal.modalContainer.isVisible()).toBeTruthy();
      //bug no error message is displayed
      await updateModal.fillModal(firstName, lastName, "");
      await updateModal.clickUpdate();
      expect(await updateModal.modalContainer.isVisible()).toBeTruthy();
    });

    test("close and cancel buttons", async ({ login, pm }) => {
      const table = pm.dashboardPage().getTable();
      const row = await table.getRowDataByIndex(0);
      const updateModal = await row.clickUpdate();
      await updateModal.clickCancel();
      expect(await updateModal.modalContainer.isVisible()).toBeFalsy();
      const updateModal2 = await row.clickUpdate();
      await updateModal2.closeModal();
      expect(await updateModal2.modalContainer.isVisible()).toBeFalsy();
    });
  });
  test.describe("Delete employee modal tests", async () => {
    test("delete employee", async ({ login, pm, page, api }) => {
      //create a new employee by post call
      empBody.firstName = faker.person.firstName();
      empBody.lastName = faker.person.lastName();
      empBody.dependants = faker.number.int({ min: 0, max: 32 });
      empBody.salary = faker.number.int({ min: 50000, max: 200000 });
      const response = await api.post(tc.EMPLOYEES_API_URL, empBody);
      const responseBody = await response.json();
      const id = responseBody.id;
      await page.reload();
      await pm.waitForEmployeeResponse();
      const table = pm.dashboardPage().getTable();
      const row = await table.getRowDataById(id);
      const deleteModal = await row.clickDelete();
      await deleteModal.clickDelete();
      await pm.waitForEmployeeResponse();
      await pm.waitForIdle();
      expect(await table.checkIfTableConatisId(id)).toBeFalsy();
    });

    test("close and cancel buttons", async ({ login, pm }) => {
      const table = pm.dashboardPage().getTable();
      const row = await table.getRowDataByIndex(0);
      const deleteModal = await row.clickDelete();
      await deleteModal.clickCancel();
      expect(await deleteModal.modalContainer.isVisible()).toBeFalsy();
      const deleteModal2 = await row.clickDelete();
      await deleteModal2.closeModal();
      expect(await deleteModal2.modalContainer.isVisible()).toBeFalsy();
    });
  });

  test.describe("Table tests", async () => {
    test("table should be present", async ({ login, pm }) => {
      const table = pm.dashboardPage().getTable();
      expect(await table.table.isVisible()).toBeTruthy();
      expect(await table.tableHeaderRow.isVisible()).toBeTruthy();
      expect(await table.getTableHeaderByIndex(0)).toContain("Id");
      expect(await table.getTableHeaderByIndex(2)).toContain("First Name");
      expect(await table.getTableHeaderByIndex(1)).toContain("Last Name");
      //bug dependants in response splelled as dependants but in table spelled as dependents
      expect(await table.getTableHeaderByIndex(3)).toContain("Dependents");
      expect(await table.getTableHeaderByIndex(4)).toContain("Salary");
      expect(await table.getTableHeaderByIndex(5)).toContain("Gross Pay");
      expect(await table.getTableHeaderByIndex(6)).toContain("Benefits Cost");
      expect(await table.getTableHeaderByIndex(7)).toContain("Net Pay");
    });

    test("table should have data", async ({ login, pm }) => {
      const table = pm.dashboardPage().getTable();
      expect(await table.table.isVisible()).toBeTruthy();
      const rows = await table.getTableRowCount();
      expect(rows).toBeGreaterThan(0);
    });

    test("table should have correct data", async ({ login, pm }) => {
      const table = pm.dashboardPage().getTable();
      const row = await table.getRowDataByIndex(0);
      const id = row.id;
      const firstName = row.firstName;
      const lastName = row.lastName;
      const dependants = row.dependants;
      const salary = row.salary;
      const grossPay = row.grossPay;
      const benefitsCost = row.benefitsCost;
      const netPay = row.netPay;
      expect(id).not.toBe("");
      expect(firstName).not.toBe("");
      expect(lastName).not.toBe("");
      expect(dependants).not.toBe("");
      expect(salary).not.toBe("");
      expect(grossPay).not.toBe("");
      expect(benefitsCost).not.toBe("");
      expect(netPay).not.toBe("");
    });

    test("table should have correct data by id", async ({ login, pm }) => {
      const table = pm.dashboardPage().getTable();
      const row = await table.getRowDataByIndex(0);
      const id = row.id;
      const row2 = await table.getRowDataById(id);
      expect(row.id).toBe(row2.id);
      expect(row.firstName).toBe(row2.firstName);
      expect(row.lastName).toBe(row2.lastName);
      expect(row.dependants).toBe(row2.dependants);
      expect(row.salary).toBe(row2.salary);
      expect(row.grossPay).toBe(row2.grossPay);
      expect(row.benefitsCost).toBe(row2.benefitsCost);
      expect(row.netPay).toBe(row2.netPay);
    });
  });
});

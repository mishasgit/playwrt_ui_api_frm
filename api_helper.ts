import { APIRequestContext } from "@playwright/test";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { test_constants as tc } from "./test_constants";

export class ApiHelper {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * get method to make a get request to the API
   * @param endpoint
   * @param id
   * @returns response
   * @example
   * const response = await api.get(tc.EMPLOYEES_API_URL);
   */
  async get(endpoint: string, id?: string) {
    const response = await this.request.get(
      id ? `${endpoint}/${id}` : endpoint
    );
    return response;
  }

  /**
   * post method to make a post request to the API
   * @param endpoint
   * @param body
   * @returns response
   * @example
   * const response = await api.post(tc.EMPLOYEES_API_URL, empBody);
   */
  async post(endpoint: string, body: any) {
    const response = await this.request.post(endpoint, {
      data: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  /**
   * put method to make a put request to the API
   * @param endpoint
   * @param body
   * @returns response
   * @example
   * const response = await api.put(tc.EMPLOYEES_API_URL, empBody);
   */
  async put(endpoint: string, body: any) {
    const response = await this.request.put(`${endpoint}`, {
      data: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  /**
   * delete method to make a delete request to the API
   * @param endpoint
   * @param id
   * @returns response
   * @example
   * const response = await api.delete(tc.EMPLOYEES_API_URL, id);
   */
  async delete(endpoint: string, id: string) {
    const response = await this.request.delete(`${endpoint}/${id}`);
    return response;
  }

  /**
   * checkResponseStructure method to check the structure of the response
   * @param responseBody
   * @param structure
   * @returns void
   * @example
   * await api.checkResponseStructure(responseBody, { id: "string", firstName: "string", lastName: "string", dependants: "number", salary: "number" });
   */
  async checkResponseStructure(responseBody: any, structure: any) {
    for (const [key, type] of Object.entries(structure)) {
      expect(responseBody).toHaveProperty(key);
      expect(typeof responseBody[key]).toBe(type);
    }
  }

  /**
   * createNumberOfEmployees method to create a number of employees
   * @param numberOfEmployees
   * @returns void
   * @example
   * await api.createNumberOfEmployees(5);
   */
  async createNumberOfEmployees(numberOfEmployees: number) {
    for (let i = 0; i < numberOfEmployees; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const dependants = faker.number.int({ min: 0, max: 32 });
      const salary = faker.number.int({ min: 10000, max: 999000 });
      const empBody = {
        firstName,
        lastName,
        dependants,
        salary,
      };
      const response = await this.post(tc.EMPLOYEES_API_URL, empBody);
      expect(response.status()).toBe(200);
    }
  }
}

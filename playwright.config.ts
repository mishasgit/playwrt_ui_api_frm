import { defineConfig, devices } from "@playwright/test";

require("dotenv").config();

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/",
    trace: "on-first-retry",
    extraHTTPHeaders: {
      Authorization: `${process.env.API_TOKEN}`,
    },
  },

  projects: [
    {
      name: "api",
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});

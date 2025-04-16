import { test as setup, expect } from "@playwright/test";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const testEmail = process.env.PLAYWRIGHT_TEST_EMAIL;
  const testPassword = process.env.PLAYWRIGHT_TEST_PASSWORD;

  console.log(testEmail, "testEmail");
  console.log(testPassword, "testPassword");

  if (testEmail && testPassword) {
    console.log("Test email and password present");
  }

  if (!testEmail || !testPassword) {
    console.warn("Missing test email or password");
    return;
  }
  await page.goto("/login");
  await page.getByTestId("email-input").fill(testEmail);
  await page.getByTestId("password-input").fill(testPassword);
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForURL("/dashboard");
  await expect(page.getByText("Dashboard")).toBeVisible();

  await page.context().storageState({ path: authFile });
});

import { expect, test } from "@playwright/test";

test("Dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  const dashboardTitle = page.getByTestId("dashboardContainer");
  await expect(dashboardTitle).toBeVisible();
  await expect(page.getByText("Total outstanding invoices")).toBeVisible();
  await expect(page.getByText("Manage")).toBeVisible();
});

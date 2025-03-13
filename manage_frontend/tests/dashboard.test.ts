import { expect, test } from "@playwright/test";

test("Dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  const dashboardTitle = page.getByTestId("dashboardContainer");
  await expect(dashboardTitle).toBeVisible();
});

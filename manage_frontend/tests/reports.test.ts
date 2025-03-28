import { expect, test } from "@playwright/test";

test("Reports page", async ({ page }) => {
  await page.goto("/reports");
  await expect(page.getByText(/Generate various reports/i)).toBeVisible();
});

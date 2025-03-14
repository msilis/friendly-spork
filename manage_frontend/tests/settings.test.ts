import { expect, test } from "@playwright/test";

test("Settings page", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByText(/Settings/i)).toBeVisible();
  await expect(page.getByText(/rates/i)).toBeVisible();
});

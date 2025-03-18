import { expect, test } from "@playwright/test";

test("Classes page", async ({ page }) => {
  await page.goto("/classes");
  await expect(page.getByText("Classes")).toBeVisible();

  const addClassButton = page.getByRole("button", { name: /Add Class/ });
  await expect(addClassButton).toBeVisible();
});

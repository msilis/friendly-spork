import { expect, test } from "@playwright/test";

test("Families page", async ({ page }) => {
  await page.goto("/families");
  await expect(page.getByRole("button", { name: /Add Family/ })).toBeVisible();
  await expect(page.getByText("Families")).toBeVisible();
  await expect(page.getByText("Family Last Name")).toBeVisible();
});

test("Add family page", async ({ page }) => {
  await page.goto("/families/add");
  const backButton = page.getByRole("button", { name: /Back/ });
  const addSecondParentButton = page.getByRole("button", {
    name: /Add Second Parent?/,
  });
  await addSecondParentButton.click();
  await expect(page.getByPlaceholder(/Parent 2 First Name/)).toBeVisible();
  await backButton.click();
  await expect(addSecondParentButton).not.toBeVisible();
});

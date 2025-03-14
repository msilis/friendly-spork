import { expect, test } from "@playwright/test";

test("Teachers page", async ({ page }) => {
  await page.goto("/teachers");
  await expect(page.getByText(/Teachers/)).toBeVisible();

  const addTeacherButton = page.getByRole("button", { name: /Add Teacher/ });
  await addTeacherButton.click();
  await expect(page).toHaveURL("/teachers/add");
  await expect(page.getByPlaceholder(/First Name/)).toBeVisible();

  const backButton = page.getByRole("button", { name: /back/i });
  await backButton.click();
  await expect(page).toHaveURL("/teachers");
});

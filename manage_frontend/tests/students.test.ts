import { expect, test } from "@playwright/test";

test("Students page", async ({ page }) => {
  await page.goto("/students");
  await expect(page.getByText(/Students/)).toBeVisible();
  await expect(page.getByText(/First Name/)).toBeVisible();

  const addStudentButton = page.getByRole("button", { name: /Add Student/ });
  await addStudentButton.click();
  await expect(page).toHaveURL("/students/add");
  const backButton = page.getByRole("button", { name: "Back" });
  await backButton.click();
  await expect(page).toHaveURL("/students");
});

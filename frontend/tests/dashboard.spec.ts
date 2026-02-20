import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto("/login");
    await page.fill("#email", "visper5060@gmail.com");
    await page.fill("#password", "123456");
    await page.getByRole("button", { name: /^تسجيل الدخول$/ }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("dashboard loads correctly", async ({ page }) => {
    // Check for main dashboard heading
    // Adjust exact text based on page content
    await expect(
      page
        .locator("h1, h2, h3")
        .filter({ hasText: /Dashboard|لوحة التحكم/i })
        .first(),
    ).toBeVisible();

    // Check for common dashboard elements (cards, charts, etc.)
    // This part needs to be refined after reading page.tsx
    // await expect(page.locator('.dashboard-card')).toHaveCount(4);
  });
});

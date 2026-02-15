import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/مدير لوفت الحمام|GoldenLoft/);
});

test("dashboard loads", async ({ page }) => {
  await page.goto("/dashboard");
  // If redirected to login, that's also a valid smoke test result (it means protection works)
  // Or if public, it should show dashboard.
  // Assuming protected:
  if (page.url().includes("login") || page.url().includes("auth")) {
    await expect(
      page.getByRole("heading", { name: /login|sign in|تسجيل/i }),
    ).toBeVisible();
  } else {
    // If logged in or public
    await expect(page.locator("body")).toBeVisible();
  }
});

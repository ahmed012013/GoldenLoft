import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: "Golden Loft" }),
    ).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^تسجيل الدخول$/ }),
    ).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: /register|sign up|حساب جديد/i }),
    ).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password").first()).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^إنشاء الحساب$/ }),
    ).toBeVisible();
  });

  test("login with invalid credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.fill("#email", "invalid@example.com");
    await page.fill("#password", "wrongpassword");
    await page.getByRole("button", { name: /^تسجيل الدخول$/ }).click();

    // Expect an error toast or message.
    // Adjust selector based on actual UI (e.g., toast, alert)
    // Assuming toast via Sonner or similar:
    const toast = page.getByText(/Invalid credentials/i);
    await expect(toast.first()).toBeVisible();
  });

  test("login with valid credentials redirects to dashboard", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.fill("#email", "visper5060@gmail.com");
    await page.fill("#password", "123456");
    await page.getByRole("button", { name: /^تسجيل الدخول$/ }).click();

    // Wait for navigation to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

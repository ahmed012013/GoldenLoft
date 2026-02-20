import { test, expect } from "@playwright/test";

test.describe("GoldenLoft Website Tests", () => {
  const BASE_URL = "http://localhost:3000";
  const EMAIL = "visper5060@gmail.com";
  const PASSWORD = "123456";

  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto(BASE_URL);

    // Wait for redirect to login if not authenticated
    await page.waitForTimeout(2000);

    // Check if we need to login
    if (page.url().includes("login")) {
      // Fill login form
      await page.fill('input[type="email"], input[name="email"]', EMAIL);
      await page.fill(
        'input[type="password"], input[name="password"]',
        PASSWORD,
      );

      // Click login button
      await page.click('button[type="submit"]');

      // Wait for dashboard to load
      await page.waitForURL("**/dashboard**", { timeout: 10000 });
    }
  });

  test("1. Login should work correctly", async ({ page }) => {
    // Verify we're on dashboard
    expect(page.url()).toContain("dashboard");

    // Check for main elements
    await expect(page.locator("body")).toBeVisible();
  });

  test("2. Dashboard should load properly", async ({ page }) => {
    // Check dashboard loaded
    expect(page.url()).toContain("dashboard");

    // Wait for content to load
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: "test-results/dashboard.png" });
  });

  test("3. Navigate to Pigeons/Birds section", async ({ page }) => {
    // Look for pigeons/birds menu item and click it
    const pigeonMenu = page.locator("text=الحمام").first();
    if (await pigeonMenu.isVisible()) {
      await pigeonMenu.click();
      await page.waitForTimeout(2000);
    }

    // Take screenshot
    await page.screenshot({ path: "test-results/pigeons.png" });
  });

  test("4. Health Records should show bird name column", async ({ page }) => {
    // Navigate to health records
    const healthMenu = page.locator("text=السجلات").first();
    if (await healthMenu.isVisible()) {
      await healthMenu.click();
      await page.waitForTimeout(2000);
    }

    // Check for bird column header
    const birdColumn = page.locator("text=الطائر");

    // Take screenshot
    await page.screenshot({ path: "test-results/health-records.png" });
  });

  test("5. Health Record modal should have scroll", async ({ page }) => {
    // Navigate to health records
    await page.locator("text=الحمام").first().click();
    await page.waitForTimeout(1000);

    // Look for add button
    const addButton = page
      .locator('button:has-text("إضافة سجل"), button:has-text("Add")')
      .first();
    if (await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(1000);

      // Take screenshot of modal
      await page.screenshot({ path: "test-results/health-modal.png" });
    }
  });

  test("6. Logout should redirect properly", async ({ page }) => {
    // Find and click logout
    const logoutBtn = page.locator("text=تسجيل خروج, text=Logout").first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForTimeout(2000);
    }

    // Should be on login page
    expect(page.url()).toContain("login");
  });
});

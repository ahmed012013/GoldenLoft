import { test, expect } from "@playwright/test";
import { GoldenLoftPage } from "./pages/goldenloft.page";

test.describe("GoldenLoft E2E Tests", () => {
  let goldenLoft: GoldenLoftPage;

  test.beforeEach(async ({ page }) => {
    goldenLoft = new GoldenLoftPage(page);
    await goldenLoft.goto();
  });

  test.describe("Login", () => {
    test("should login successfully with valid credentials", async () => {
      await goldenLoft.login("visper5060@gmail.com", "123456");

      // Verify we're on dashboard after login
      await expect(goldenLoft.page).toHaveURL(/dashboard/);

      // Verify dashboard elements are visible
      await expect(goldenLoft.dashboardWelcome).toBeVisible({ timeout: 10000 });
    });

    test("should show error with invalid credentials", async () => {
      await goldenLoft.login("visper5060@gmail.com", "wrongpassword");

      // Verify error message is shown
      await expect(goldenLoft.errorMessage).toBeVisible({ timeout: 5000 });
    });

    test("should show error with empty fields", async () => {
      await goldenLoft.loginButton.click();

      // Verify validation errors
      await expect(goldenLoft.emailInput).toHaveAttribute("required");
    });
  });

  test.describe("Navigation", () => {
    test("should navigate through main sections", async () => {
      await goldenLoft.login("visper5060@gmail.com", "123456");

      // Navigate to Birds
      await goldenLoft.navigateToBirds();
      await expect(goldenLoft.page).toHaveURL(/birds/);

      // Navigate to Pairings
      await goldenLoft.navigateToPairings();
      await expect(goldenLoft.page).toHaveURL(/pairings/);

      // Navigate to Eggs
      await goldenLoft.navigateToEggs();
      await expect(goldenLoft.page).toHaveURL(/eggs/);

      // Navigate to Life Events
      await goldenLoft.navigateToLifeEvents();
      await expect(goldenLoft.page).toHaveURL(/life-events/);

      // Navigate to Health
      await goldenLoft.navigateToHealth();
      await expect(goldenLoft.page).toHaveURL(/health/);
    });
  });

  test.describe("Birds Management", () => {
    test("should create a new bird", async () => {
      await goldenLoft.login("visper5060@gmail.com", "123456");
      await goldenLoft.navigateToBirds();

      // Click add bird button
      await goldenLoft.addBirdButton.click();

      // Fill bird form
      await goldenLoft.fillBirdForm({
        ringNumber: "TEST-" + Date.now(),
        name: "Test Bird",
        gender: "MALE",
        status: "HEALTHY",
      });

      // Submit form
      await goldenLoft.submitForm();

      // Verify success
      await expect(goldenLoft.successMessage).toBeVisible({ timeout: 5000 });
    });

    test("should search for birds", async () => {
      await goldenLoft.login("visper5060@gmail.com", "123456");
      await goldenLoft.navigateToBirds();

      // Search for a bird
      await goldenLoft.searchInput.fill("test");
      await goldenLoft.searchInput.press("Enter");

      // Verify search results are displayed
      await expect(goldenLoft.birdList).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe("Logout", () => {
    test("should logout successfully", async () => {
      await goldenLoft.login("visper5060@gmail.com", "123456");
      await goldenLoft.logout();

      // Verify we're back on login page
      await expect(goldenLoft.page).toHaveURL(/login/);
      await expect(goldenLoft.loginButton).toBeVisible();
    });
  });
});

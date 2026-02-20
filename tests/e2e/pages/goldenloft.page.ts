import { Page, Locator } from '@playwright/test';

export class GoldenLoftPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly dashboardWelcome: Locator;
  readonly logoutButton: Locator;
  readonly addBirdButton: Locator;
  readonly searchInput: Locator;
  readonly birdList: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // More flexible selectors for common login patterns
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i], #email, [data-testid="email"]').first();
    this.passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i], #password, [data-testid="password"]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("تسجيل الدخول"), [data-testid="login-button"]').first();
    this.errorMessage = page.locator('.error, .alert-error, [role="alert"], .text-red-500, .text-red-600, .Mui-error, .ant-form-item-explain-error').first();
    this.successMessage = page.locator('.success, .alert-success, .text-green-500, .text-green-600, .MuiAlert-standardSuccess, .ant-message-success').first();
    this.dashboardWelcome = page.locator('text=/welcome|dashboard|home/i, h1, [data-testid="dashboard"], .dashboard').first();
    this.logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("تسجيل الخروج"), [data-testid="logout"]').first();
    this.addBirdButton = page.locator('button:has-text("Add"), button:has-text("إضافة"), a:has-text("Add Bird"), [data-testid="add-bird"], .fab, button[aria-label*="add" i]').first();
    this.searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="بحث" i], [data-testid="search"]').first();
    this.birdList = page.locator('[data-testid="bird-list"], .bird-list, table tbody tr, .MuiDataGrid-row, .list-item, .card').first();
    this.submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Save"), button:has-text("حفظ"), button:has-text("إضافة"), [data-testid="submit"]').first();
  }

  async goto() {
    await this.page.goto('https://goldenloft.duckdns.org');
    await this.page.waitForLoadState('networkidle');
    // Take initial screenshot
    await this.takeScreenshot('01-initial-load');
  }

  async login(email: string, password: string) {
    // Wait for page to be fully loaded
    await this.page.waitForSelector('body', { timeout: 10000 });
    
    // Debug: Check if we're on login page
    const pageTitle = await this.page.title();
    console.log('Page title:', pageTitle);
    
    // Try to find and fill email
    try {
      await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.emailInput.fill(email);
      console.log('Email filled');
    } catch (e) {
      console.log('Email input not found, taking screenshot');
      await this.takeScreenshot('02-email-not-found');
      throw e;
    }
    
    // Fill password
    await this.passwordInput.fill(password);
    console.log('Password filled');
    
    // Click login
    await this.loginButton.click();
    console.log('Login clicked');
    
    // Wait for navigation
    await this.page.waitForLoadState('networkidle');
    await this.takeScreenshot('03-after-login');
  }

  async logout() {
    // Logout button has Arabic text "تسجيل الخروج" with red color
    const logoutBtn = this.page.locator('.text-red-500, button:has-text("تسجيل الخروج"), a:has-text("تسجيل الخروج")').first();
    await logoutBtn.click({ force: true });
    await this.page.waitForLoadState('networkidle');
    await this.takeScreenshot('04-after-logout');
  }

  async navigateToSection(sectionNameArabic: string) {
    // Navigate using Arabic text from sidebar
    const navLink = this.page.locator(`aside a:has-text("${sectionNameArabic}"), nav a:has-text("${sectionNameArabic}"), a:has-text("${sectionNameArabic}")`).first();
    await navLink.click({ force: true });
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToBirds() {
    await this.navigateToSection('الطيور');
  }

  async navigateToPairings() {
    await this.navigateToSection('الأزواج');
  }

  async navigateToEggs() {
    await this.navigateToSection('البيض');
  }

  async navigateToLifeEvents() {
    await this.navigateToSection('الأحداث');
  }

  async navigateToHealth() {
    await this.navigateToSection('الصحة');
  }

  async fillBirdForm(data: { ringNumber: string; name: string; gender: string; status: string }) {
    const ringInput = this.page.locator('input[name="ringNumber"], input[placeholder*="ring" i], #ringNumber').first();
    const nameInput = this.page.locator('input[name="name"], input[placeholder*="name" i], #name').first();
    const genderSelect = this.page.locator('select[name="gender"], button:has-text("Gender"), [data-testid="gender"]').first();
    const statusSelect = this.page.locator('select[name="status"], button:has-text("Status"), [data-testid="status"]').first();

    await ringInput.waitFor({ state: 'visible', timeout: 5000 });
    await ringInput.fill(data.ringNumber);
    await nameInput.fill(data.name);
    
    if (await genderSelect.count() > 0) {
      await genderSelect.click();
      await this.page.click(`text="${data.gender}"`);
    }
    
    if (await statusSelect.count() > 0) {
      await statusSelect.click();
      await this.page.click(`text="${data.status}"`);
    }
  }

  async submitForm() {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `tests/e2e/screenshots/${name}.png`, fullPage: true });
  }
}
